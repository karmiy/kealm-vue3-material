import { cloneDeep } from 'lodash-es';
import { defineStore } from 'pinia';
import { useMaterials } from '@/hooks';
import { generateTplSeries } from '@/utils/canvas';
import { deepEach } from '@/utils/shared';

interface LibraryItem {
    parentId: string;
    index: number;
    template: EditorNS.TemplateItem;
}

const ROOT_PARENT_ID = '0';

const { getMaterialByName, getControllerByName } = useMaterials();

export const useCanvasStore = defineStore('Canvas', {
    state: () => ({
        /* 拖拽行为 */
        dragMaterial: null as {
            waitToInsertParentId: string; // 插入的模板父层级 id
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
        templateMap(state): Readonly<Record<string, LibraryItem>> {
            // TODO: 同步操作多次 templates 只触发一次，且考虑到模板量一般不会很大
            const library: Record<string, LibraryItem> = {};

            deepEach(state.templates, (item, index, parentId = ROOT_PARENT_ID) => {
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
        registryDragMaterial(name: string) {
            const initialTemplate = getControllerByName(name)?.getInitialTemplate?.() ?? {
                id: generateTplSeries(),
                type: name,
                config: cloneDeep(getMaterialByName(name)?.defaultConfig ?? {}),
            };

            this.dragMaterial = {
                template: initialTemplate,
                waitToInsertIndex: -1,
                waitToInsertParentId: ROOT_PARENT_ID,
            };
        },
        releaseDragMaterial() {
            this.dragMaterial = null;
        },
        setSelectedTemplate(item: EditorNS.TemplateItem) {
            this.selectedTemplate = item;
            this.isBeautyVisible = true;
        },
        getTemplatesByParentId(parentId: string) {
            if (parentId === ROOT_PARENT_ID) return this.templates;

            return this.templateMap[parentId].template.children;
        },
        isRootTemplates(parentId: string) {
            // TODO: 后期 tabs 考虑下 getTemplatesByParentId(parentId).isPage
            return parentId === ROOT_PARENT_ID;
        },
        setWaitToInsert(index: number, parentId = ROOT_PARENT_ID) {
            if (!this.dragMaterial) return;

            this.dragMaterial.waitToInsertIndex = index;
            this.dragMaterial.waitToInsertParentId = parentId;
        },
    },
});
