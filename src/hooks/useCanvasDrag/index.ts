import { useThrottleFn } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/store';
import { generateTplSeries } from '@/utils/canvas';
import { CANVAS_TUPLE_TYPE } from '@/utils/constants';
import { getParentNodeByClass } from '@/utils/dom';

export function useCanvasDrag() {
    const canvasStore = useCanvasStore();
    const {
        getTemplatesByParentId,
        isRootTemplates,
        setWaitToInsert,
        registryDragMaterial,
        releaseDragMaterial,
    } = canvasStore;
    const { templates, dragMaterial, dragging } = storeToRefs(canvasStore);
    const THROTTLE_DELAY = 10;

    const getTemplates = () => {
        const rootTemplates = templates.value;

        if (!dragMaterial.value) return { rootTemplates };

        const { waitToInsertParentId } = dragMaterial.value;
        const curTemplates = getTemplatesByParentId(waitToInsertParentId);

        return { rootTemplates, curTemplates };
    };

    const createHelp = () => {
        return { type: CANVAS_TUPLE_TYPE.Help, id: generateTplSeries() };
    };

    const getHelpInfo = () => {
        const { curTemplates } = getTemplates();

        if (!dragMaterial.value || !curTemplates)
            return { hasHelp: false, helpTemplate: createHelp() };

        const { waitToInsertIndex } = dragMaterial.value;
        const hasHelp = waitToInsertIndex !== -1;
        const helpTemplate = hasHelp ? curTemplates[waitToInsertIndex] : createHelp();

        return {
            hasHelp,
            helpTemplate,
        };
    };

    /* 当前拖拽到画布上 */
    const runInsertToPage = () => {
        const { rootTemplates, curTemplates } = getTemplates();
        if (!dragMaterial.value || !curTemplates) return;

        const { waitToInsertParentId } = dragMaterial.value;
        let { waitToInsertIndex } = dragMaterial.value;
        const { hasHelp, helpTemplate } = getHelpInfo();

        // 如果当前 help 也顶层在最后，就不需要操作了
        if (
            hasHelp &&
            isRootTemplates(waitToInsertParentId) &&
            waitToInsertIndex === curTemplates.length - 1
        )
            return;
        // 本来有 help 先移除
        hasHelp && curTemplates.splice(waitToInsertIndex, 1);
        // 插入到顶层末尾
        waitToInsertIndex = rootTemplates.push(helpTemplate) - 1;
        setWaitToInsert(waitToInsertIndex);
    };

    /* 当前拖拽到组件上 */
    const runInsertToMaterial = (e: DragEvent) => {
        const { rootTemplates, curTemplates } = getTemplates();
        if (!dragMaterial.value || !curTemplates) return;

        const { waitToInsertParentId } = dragMaterial.value;
        let { waitToInsertIndex } = dragMaterial.value;
        const { hasHelp, helpTemplate } = getHelpInfo();

        const target = e.target as HTMLElement | null;

        const [y, h, curComponentIndex] = [
            e.offsetY,
            Number(target?.offsetHeight ?? 0),
            Number(target?.dataset.index ?? 0),
        ];
        // 鼠标位置是否在组件中线之上
        const isUpDirection = y < h / 2;

        // console.log(isUpDirection, hasHelp);

        if (!hasHelp) {
            waitToInsertIndex = isUpDirection ? curComponentIndex : curComponentIndex + 1;
        } else {
            // 不需要变动的场景：要移动到的位置刚好也是现在 help 的位置
            // 组件中线之上：0 1 2? [3] 4
            if (
                isRootTemplates(waitToInsertParentId) &&
                isUpDirection &&
                waitToInsertIndex < curComponentIndex &&
                curComponentIndex - 1 === waitToInsertIndex
            )
                return;

            // 组件中线之下：0 1 2 [3] 4?
            if (
                isRootTemplates(waitToInsertParentId) &&
                !isUpDirection &&
                waitToInsertIndex >= curComponentIndex &&
                curComponentIndex + 1 === waitToInsertIndex
            )
                return;

            // 移除当前 help
            curTemplates.splice(waitToInsertIndex, 1);
            if (isUpDirection) {
                if (
                    isRootTemplates(waitToInsertParentId) &&
                    waitToInsertIndex < curComponentIndex
                ) {
                    // 场景 0 1? 2 [3] 4
                    waitToInsertIndex = curComponentIndex - 1;
                } else {
                    // 场景 0 1 2 [3] 4?
                    waitToInsertIndex = curComponentIndex;
                }
            } else {
                if (
                    isRootTemplates(waitToInsertParentId) &&
                    waitToInsertIndex < curComponentIndex
                ) {
                    // 场景 0 1 2? [3] 4
                    waitToInsertIndex = curComponentIndex;
                } else {
                    // 场景 0 1 2 [3] 4 5?
                    waitToInsertIndex = curComponentIndex + 1;
                }
            }
        }
        // 更新 help 位置
        setWaitToInsert(waitToInsertIndex);
        rootTemplates.splice(waitToInsertIndex, 0, helpTemplate);
    };

    /* 当前拖拽到插槽上 */
    const runInsertToSocket = (e: DragEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        const shapeEl = getParentNodeByClass(target, 'shape');
        if (!shapeEl) return;

        const parentId = shapeEl.dataset.id;
        if (!parentId) return;

        // const socketIndex = Number(target.dataset.index);
    };

    /* 拖拽开始，注册物料 */
    const onDragStart = (name: string) => {
        dragging.value = true;
        registryDragMaterial(name);
    };

    /* 拖拽中，调整放置区域辅助块的位置 */
    const onDragOver = useThrottleFn(
        (e: DragEvent) => {
            const target = e.target as HTMLElement | null;

            const type = target?.dataset.type;

            switch (type) {
                case CANVAS_TUPLE_TYPE.Page:
                    runInsertToPage();
                    break;
                case CANVAS_TUPLE_TYPE.Material:
                    runInsertToMaterial(e);
                    break;
                case CANVAS_TUPLE_TYPE.Socket:
                    runInsertToSocket(e);
                    break;

                default:
                    break;
            }
        },
        THROTTLE_DELAY,
        false,
    );

    /* 拖拽放手时（在画布内才会有效触发）放置组件 */
    const onDrop = () => {
        if (!dragMaterial.value) return;

        const { waitToInsertParentId, waitToInsertIndex, template } = dragMaterial.value;
        if (waitToInsertIndex === -1) return;

        const curTemplates = getTemplatesByParentId(waitToInsertParentId);

        if (!curTemplates) return;

        curTemplates.splice(waitToInsertIndex, 1, template);
        setWaitToInsert(-1, waitToInsertParentId);
    };

    /* 拖拽结束，顺序：drop => end */
    const onDragEnd = () => {
        dragging.value = false;
        if (!dragMaterial.value) return;

        // 结束拖拽时，如果鼠标在画布外，需要移除辅助块
        const { waitToInsertParentId, waitToInsertIndex } = dragMaterial.value;

        if (waitToInsertIndex !== -1) {
            const curTemplates = getTemplatesByParentId(waitToInsertParentId);
            curTemplates?.splice(waitToInsertIndex, 1);
        }

        releaseDragMaterial();
    };

    return { onDragStart, onDragOver, onDrop, onDragEnd };
}
