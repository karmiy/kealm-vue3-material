import { cloneDeep } from 'lodash-es';
import { defineStore } from 'pinia';
import { useMaterials } from '@/hooks';
import { generateTplSeries } from '@/utils/canvas';
import { deepEach } from '@/utils/shared';

interface LibraryItem extends EditorNS.TemplateItem {
    parentId: number;
    index: number;
}

const { getMaterialByName, getControllerByName } = useMaterials();

export const useCanvasStore = defineStore('Canvas', {
    state: () => ({
        /* 拖拽行为 */
        dragMaterial: null as {
            waitToInsertParentId: number; // 插入的模板父层级 id
            waitToInsertIndex: number;
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
        templateMap(state): Readonly<Record<number, LibraryItem>> {
            // TODO: 同步操作多次 templates 只触发一次，且考虑到模板量一般不会很大
            const library: Record<number, LibraryItem> = {};

            deepEach(state.templates, (item, parentId, index) => {
                library[item.id] = {
                    ...item,
                    parentId,
                    index,
                };
            });
            return library;
        },
    },
    actions: {
        registryDragMaterial(name: string) {
            const initialTemplate = getControllerByName(name)?.getInitialTemplate?.() ?? {
                id: generateTplSeries(),
                type: name,
                config: cloneDeep(getMaterialByName(name)?.defaultConfig ?? {}),
            };

            this.dragMaterial = {
                template: initialTemplate,
                waitToInsertIndex: -1,
                waitToInsertParentId: 0,
            };
        },
        releaseDragMaterial() {
            this.dragMaterial = null;
        },
        setSelectedTemplate(item: EditorNS.TemplateItem) {
            this.selectedTemplate = item;
            this.isBeautyVisible = true;
        },
        getTemplatesByParentId(parentId: number) {
            if (parentId === 0) return this.templates;

            return this.templateMap[parentId].children;
        },
        isRootTemplates(parentId: number) {
            // TODO: 后期 tabs 考虑下 getTemplatesByParentId(parentId).isPage
            return parentId === 0;
        },
        setWaitToInsert(index: number, parentId = 0) {
            if (!this.dragMaterial) return;

            this.dragMaterial.waitToInsertIndex = index;
            this.dragMaterial.waitToInsertParentId = parentId;
        },
    },
});
