import { useThrottleFn } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/store';
import { generateTplSeries } from '@/utils/canvas';
import { CANVAS_TUPLE_TYPE } from '@/utils/constants';
import { getParentNodeByCondition } from '@/utils/dom';

// slot 有值不显示元素自身
// container => slot => material 时拖拽到 material 上应该找到最近的 container
export function useCanvasDrag() {
    const canvasStore = useCanvasStore();
    const {
        getTemplateById,
        getParentTemplateById,
        getNearestContainerChain,
        setWaitToInsert,
        registryDragMaterial,
        releaseDragMaterial,
    } = canvasStore;
    const { templates, dragMaterial, dragging, templateMap } = storeToRefs(canvasStore);
    const THROTTLE_DELAY = 10;

    /**
     * @description 获取：顶层模板列表、当前准备放置层级的模板列表
     * @returns
     */
    const getTemplates = () => {
        const rootTemplates = templates.value;

        if (!dragMaterial.value) return { rootTemplates };

        const { waitToInsertContainerId } = dragMaterial.value;
        const curTemplates = getTemplateById(waitToInsertContainerId)?.children;
        // console.log(waitToInsertContainerId, curTemplates);

        return { rootTemplates, curTemplates };
    };

    /**
     * @description 创建一个 help 模板
     * @returns
     */
    const createHelp = () => {
        return { type: CANVAS_TUPLE_TYPE.Help, id: generateTplSeries() };
    };

    /**
     * @description 获取当前 templates 中 help 模板的信息
     * @returns
     */
    const getHelpInfo = () => {
        const { curTemplates } = getTemplates();

        if (!dragMaterial.value || !curTemplates)
            return { hasHelp: false, helpIndex: -1, helpTemplate: createHelp() };

        // 注：
        // 虽然循环性能低一点，但是考虑到同层级数组项不会很多
        // 且用 waitToInsertIndex 存在副作用（可能 curTemplates 在其他代码中操作了，如把 help 删了），取到的项会不准
        const helpIndex = curTemplates.findIndex(item => item.type === CANVAS_TUPLE_TYPE.Help);
        const hasHelp = helpIndex !== -1;
        const helpTemplate = hasHelp ? curTemplates[helpIndex] : createHelp();

        return {
            hasHelp,
            helpIndex,
            helpTemplate,
        };
    };

    /**
     * @description 移除当前 help
     * @returns
     */
    const removeHelp = () => {
        const { curTemplates } = getTemplates();
        if (!curTemplates) return;

        const { hasHelp, helpIndex } = getHelpInfo();

        hasHelp && curTemplates.splice(helpIndex, 1);
    };

    /**
     * @description 放置 help 块
     * @param templates
     * @param waitToInsertIndex
     */
    const updateOrInsertHelp = (
        templates: Array<EditorNS.TemplateItem>,
        waitToInsertIndex: number,
        waitToInsertContainerId?: string,
    ) => {
        if (templates[waitToInsertIndex]?.type === CANVAS_TUPLE_TYPE.Help) return;

        const { helpTemplate } = getHelpInfo();

        // 更新 help 位置
        setWaitToInsert(waitToInsertContainerId);
        templates.splice(waitToInsertIndex, 0, helpTemplate);
    };

    /**
     * @description 边缘判断
     * @param e
     * @returns
     */
    const isBounding = (delta: number) => {
        return delta > 0 && delta < 4;
    };

    const getBounding = (el: HTMLElement, e: DragEvent) => {
        const mouseY = e.clientY;
        const { top: boundingTop, bottom: boundingBottom } = el.getBoundingClientRect();
        const deltaTop = mouseY - boundingTop;
        const deltaBottom = boundingBottom - mouseY;
        const inUpBounding = isBounding(deltaTop);
        const inDownBounding = isBounding(deltaBottom);

        return { inUpBounding, inDownBounding };
    };

    /**
     * @description 当前拖拽到容器上
     * @returns
     */
    const runInsertToContainer = (e: DragEvent) => {
        const target = e.target as HTMLElement | null;
        const targetContainerId = target?.dataset.id;
        if (!target || !targetContainerId) return;

        // 触碰容器边缘不响应，防止与 runInsertToBounding 冲突闪烁
        const { inUpBounding, inDownBounding } = getBounding(target, e);
        if (inUpBounding || inDownBounding) return;

        const { curTemplates } = getTemplates();
        if (!dragMaterial.value || !curTemplates) return;

        const { waitToInsertContainerId } = dragMaterial.value;
        const { hasHelp, helpIndex, helpTemplate } = getHelpInfo();

        // 如果当前 help 已经在准备放入的 container 中，且排在最后，就不需要操作了
        if (
            hasHelp &&
            waitToInsertContainerId === targetContainerId &&
            helpIndex === curTemplates.length - 1
        )
            return;

        // 本来有 help 先移除
        hasHelp && curTemplates.splice(helpIndex, 1);

        // 插入到目标容器末尾
        const targetTemplates = getTemplateById(targetContainerId)?.children;
        if (!targetTemplates) return;

        targetTemplates.push(helpTemplate);

        setWaitToInsert(targetContainerId);
    };

    /**
     * @description 当前拖拽到组件上
     * @param e
     * @returns
     */
    const runInsertToMaterial = (e: DragEvent) => {
        if (!dragMaterial.value) return;

        const target = e.target as HTMLElement | null;
        if (!target) return;

        const [materialId, y, h, curComponentIndex] = [
            target?.dataset.id,
            e.offsetY,
            Number(target.offsetHeight ?? 0),
            Number(target.dataset.index ?? 0),
        ];

        if (!materialId) return;

        // 找到此物料所处的容器
        const targetContainer = getParentTemplateById(materialId);

        // 父级不是容器过掉
        if (!targetContainer || targetContainer?.type !== CANVAS_TUPLE_TYPE.Container) return;

        const targetContainerId = targetContainer.id;
        const targetTemplates = getTemplateById(targetContainerId)?.children;
        if (!targetTemplates) return;

        const { waitToInsertContainerId } = dragMaterial.value;
        const { hasHelp, helpIndex } = getHelpInfo();
        let waitToInsertIndex = helpIndex;

        // 鼠标位置是否在组件中线之上
        const isUpDirection = y < h / 2;

        if (!hasHelp) {
            waitToInsertIndex = isUpDirection ? curComponentIndex : curComponentIndex + 1;
        } else {
            if (waitToInsertContainerId === targetContainerId) {
                // 当前鼠标触碰的元素位置：[]
                // 当前 help 元素位置 ?
                // 不需要变动的场景：要移动到的位置刚好也是现在 help 的位置
                // 组件中线之上：0 1 2? [3] 4
                if (isUpDirection && curComponentIndex - 1 === waitToInsertIndex) return;

                // 组件中线之下：0 1 2 [3] 4?
                if (!isUpDirection && curComponentIndex + 1 === waitToInsertIndex) return;

                // 移除当前 help
                removeHelp();

                if (isUpDirection) {
                    if (waitToInsertIndex < curComponentIndex) {
                        // 场景 0 1? 2 [3] 4
                        waitToInsertIndex = curComponentIndex - 1;
                    } else {
                        // 场景 0 1 2 [3] 4?
                        waitToInsertIndex = curComponentIndex;
                    }
                } else {
                    if (waitToInsertIndex < curComponentIndex) {
                        // 场景 0 1 2? [3] 4
                        waitToInsertIndex = curComponentIndex;
                    } else {
                        // 场景 0 1 2 [3] 4 5?
                        waitToInsertIndex = curComponentIndex + 1;
                    }
                }
            } else {
                // 插槽不同直接移除原 help
                removeHelp();

                waitToInsertIndex = isUpDirection ? curComponentIndex : curComponentIndex + 1;
            }
        }
        // 更新 help 位置
        updateOrInsertHelp(targetTemplates, waitToInsertIndex, targetContainerId);
    };

    /**
     * @description 当前拖拽边缘
     * @param e
     * @returns
     */
    const runInsertToBounding = (e: DragEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        const containerEl = getParentNodeByCondition(
            target,
            el => el.dataset.type === CANVAS_TUPLE_TYPE.Container,
        );
        const containerId = containerEl?.dataset.id;
        if (!containerEl || !containerId) return;

        // 是否达到了容器边缘
        const { inUpBounding, inDownBounding } = getBounding(containerEl, e);

        if (!inUpBounding && !inDownBounding) return;

        // 找到父层容器
        const outerContainer = getNearestContainerChain(containerId);
        const targetTemplates = outerContainer?.template?.children;
        const targetContainerId = outerContainer?.template.id;

        if (!targetTemplates || !targetContainerId) return;

        // 移除原 help
        removeHelp();

        // 找到当前容器隶属于父层容器的哪个位置
        const curComponentIndex = targetTemplates.findIndex(
            item => item.id === outerContainer.next?.template.id,
        );
        if (curComponentIndex === -1) return;

        const waitToInsertIndex = inUpBounding ? curComponentIndex : curComponentIndex + 1;

        // 更新 help 位置
        updateOrInsertHelp(targetTemplates, waitToInsertIndex, targetContainerId);
    };

    /**
     * @description 拖拽开始，注册物料
     * @param name
     */
    const onDragStart = (name: string) => {
        dragging.value = true;
        registryDragMaterial(name);
    };

    /**
     * @description 拖拽中，调整放置区域辅助块的位置
     */
    const onDragOver = useThrottleFn(
        (e: DragEvent) => {
            const target = e.target as HTMLElement | null;

            const type = target?.dataset.type;

            switch (type) {
                case CANVAS_TUPLE_TYPE.Container:
                    runInsertToContainer(e);
                    break;
                case CANVAS_TUPLE_TYPE.Material:
                    runInsertToMaterial(e);
                    break;

                default: {
                    runInsertToBounding(e);
                    break;
                }
            }
        },
        THROTTLE_DELAY,
        false,
    );

    /**
     * @description 拖拽放手时（在画布内才会有效触发）放置组件
     * @returns
     */
    const onDrop = () => {
        if (!dragMaterial.value) return;

        const { waitToInsertContainerId, template } = dragMaterial.value;

        const targetTemplates = getTemplateById(waitToInsertContainerId)?.children;

        if (!targetTemplates) return;

        const { hasHelp, helpIndex } = getHelpInfo();

        if (!hasHelp) return;
        targetTemplates.splice(helpIndex, 1, template);
    };

    /**
     * @description 拖拽结束，顺序：drop => end
     * @returns
     */
    const onDragEnd = () => {
        dragging.value = false;
        if (!dragMaterial.value) return;

        // 结束拖拽时，如果鼠标在画布外，需要移除辅助块
        removeHelp();

        releaseDragMaterial();
    };

    return { onDragStart, onDragOver, onDrop, onDragEnd };
}
