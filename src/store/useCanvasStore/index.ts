import { cloneDeep } from 'lodash-es';
import { defineStore } from 'pinia';
import { useMaterials } from '@/hooks';
import { generateTplSeries } from '@/utils/canvas';
import { CANVAS_TUPLE_TYPE, ROOT_CONTAINER } from '@/utils/constants';
import { deepEach } from '@/utils/shared';

interface LibraryItem {
    parentId: string;
    index: number;
    template: EditorNS.TemplateItem;
}

interface TemplateChain {
    template: EditorNS.TemplateItem;
    next?: TemplateChain;
}

const { getMaterialByName, getControllerByName } = useMaterials();

export const useCanvasStore = defineStore('Canvas', {
    state: () => ({
        /* 拖拽行为 */
        dragMaterial: null as {
            waitToInsertContainerId: string; // 插入的模板父层级 id
            // waitToInsertIndex: number;
            template: EditorNS.TemplateItem;
        } | null,
        dragging: false, // 物料拖拽中
        /* 模板 */
        templates: [] as Array<EditorNS.TemplateItem>, // 当前画布模-板
        selectedTemplate: null as EditorNS.TemplateItem | null,
        /* 组件属性 */
        isBeautyVisible: false,
    }),
    getters: {
        /* { id: [tpl] } 映射模板数据 */
        templateMap(state): Readonly<Record<string, LibraryItem>> {
            // TODO: 同步操作多次 templates 只触发一次，且考虑到模板量一般不会很大
            const library: Record<string, LibraryItem> = {
                // 顶层模板也创建一个模板实例
                [ROOT_CONTAINER.id]: {
                    template: {
                        id: ROOT_CONTAINER.id,
                        type: CANVAS_TUPLE_TYPE.Container,
                        children: state.templates,
                    },
                    index: ROOT_CONTAINER.index,
                    parentId: ROOT_CONTAINER.pId,
                },
            };

            deepEach(state.templates, (item, index, parentId = ROOT_CONTAINER.id) => {
                library[item.id] = {
                    template: item,
                    parentId,
                    index,
                };
            });
            return library;
        },
    },
    actions: {
        /**
         * @description 注册拖拽中的物料信息
         * @param name
         */
        registryDragMaterial(name: string) {
            const initialTemplate = getControllerByName(name)?.getInitialTemplate?.() ?? {
                id: generateTplSeries(),
                type: name,
                config: cloneDeep(getMaterialByName(name)?.defaultConfig ?? {}),
            };

            this.dragMaterial = {
                template: initialTemplate,
                // waitToInsertIndex: -1,
                waitToInsertContainerId: ROOT_CONTAINER.id,
            };
        },
        /**
         * @description 放手时释放拖拽中的物料信息
         */
        releaseDragMaterial() {
            this.dragMaterial = null;
        },
        /**
         * @description 拖拽过程中实时保存准备放入的容器
         * @param index
         * @param containerId
         * @returns
         */
        setWaitToInsert(containerId = ROOT_CONTAINER.id) {
            if (!this.dragMaterial) return;

            // this.dragMaterial.waitToInsertIndex = index;
            this.dragMaterial.waitToInsertContainerId = containerId;
        },
        /**
         * @description 设置当前选中的模板，用于物料属性 beauty 的显示选中模板的配置信息
         * @param item
         */
        setSelectedTemplate(item?: EditorNS.TemplateItem) {
            if (!item) {
                this.selectedTemplate = null;
                this.isBeautyVisible = false;
                return;
            }
            this.selectedTemplate = item;
            this.isBeautyVisible = true;
        },
        /**
         * @description 根据 id 找到父级模板
         * @param id
         * @returns
         */
        getParentTemplateById(id: string) {
            const parentId = this.templateMap[id]?.parentId;
            if (!parentId) return;
            if (parentId === ROOT_CONTAINER.pId) return;

            return this.getTemplateById(parentId);
        },
        /**
         * @description 根据 id 找到模板
         * @param id
         * @returns
         */
        getTemplateById(id: string): EditorNS.TemplateItem | undefined {
            return this.templateMap[id]?.template;
        },
        /**
         * @description 根据条件获取模板链
         * @param id
         * @param callback
         * @param self
         * @param prevChain
         * @returns
         */
        getTemplateChainByCondition(
            id: string,
            callback: (template: EditorNS.TemplateItem) => boolean,
            self = false,
            prevChain?: TemplateChain,
        ): TemplateChain | undefined {
            const currentTemplate = this.getTemplateById(id);
            if (!currentTemplate) return;

            if (self) {
                const enable = callback(currentTemplate);

                if (enable) return { template: currentTemplate };
            }

            const template = this.getParentTemplateById(id);
            if (!template) return;

            const chain = { template, next: prevChain };
            const enable = callback(template);

            if (enable) return chain;

            return this.getTemplateChainByCondition(template.id, callback, false, chain);
        },
        /**
         * @description 找到最近的容器元素
         * @param id
         * @param self
         * @returns
         */
        getNearestContainerChain(id: string, self = false): TemplateChain | undefined {
            return this.getTemplateChainByCondition(
                id,
                template => template.type === CANVAS_TUPLE_TYPE.Container,
                self,
            );
        },
        /**
         * @description 判断是否是顶层模板列表
         * @param id
         * @returns
         */
        isRootTemplates(id: string) {
            return id === ROOT_CONTAINER.id;
        },
    },
});
