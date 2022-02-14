import { cloneDeep } from 'lodash-es';
import { defineStore } from 'pinia';
import { useMaterials } from '@/hooks';
import { generateTplSeries } from '@/utils/canvas';
import { deepEach } from '@/utils/shared';

interface LibraryItem extends EditorNS.TemplateItem {
    parentId: number;
    index: number;
}

const { getMaterialByName } = useMaterials();

export const useCanvasStore = defineStore('Canvas', {
    state: () => ({
        /* 拖拽行为 */
        dragMaterial: null as { waitToInsertIndex: number; template: EditorNS.TemplateItem } | null,
        isDragging: false, // 物料拖拽中
        /* 模板 */
        templates: [] as Array<EditorNS.TemplateItem>, // 当前画布模-板
        selectedTemplate: null as EditorNS.TemplateItem | null,
        /* 组件属性 */
        isBeautyVisible: false,
    }),
    getters: {
        /* { id: [tpl] } 映射模板数据 */
        templateMap(state) {
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
            const { defaultConfig } = getMaterialByName(name) ?? {};
            this.dragMaterial = {
                template: {
                    id: generateTplSeries(),
                    type: name,
                    config: cloneDeep(defaultConfig),
                },
                waitToInsertIndex: -1,
            };
        },
        releaseDragMaterial() {
            this.dragMaterial = null;
        },
        setWaitToInsertIndex(index: number) {
            if (!this.dragMaterial) return;

            this.dragMaterial.waitToInsertIndex = index;
        },
        setSelectedTemplate(item: EditorNS.TemplateItem) {
            this.selectedTemplate = item;
            this.isBeautyVisible = true;
        },
    },
});
