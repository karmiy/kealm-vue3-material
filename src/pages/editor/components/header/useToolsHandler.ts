import { reactive, ref, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/store';

// 最多保留 7 份数据
const STORAGE_SIZE = 7;

export function useToolsHandler() {
    const canvasStore = useCanvasStore();
    const { clearCanvas, setSelectedTemplate } = canvasStore;
    const { templates, dragging } = storeToRefs(canvasStore);

    /* -------------------- BLOCK: 操作记录 -------------------- */
    // 存储最近的 N 次模板列表
    const templatesStorage = reactive<Array<Array<EditorNS.TemplateItem>>>([]);
    // N 次之前的那次模板
    const guarantee = ref<Array<EditorNS.TemplateItem>>([]);

    watch(
        templates,
        (currentTemplates, prevTemplates) => {
            // 重新赋值整个 templates（撤销等操作），不记录
            if (prevTemplates !== currentTemplates) return;

            // 挂个延迟，因为在 onDragEnd 才释放
            setTimeout(() => {
                if (dragging.value) return;

                const length = templatesStorage.length;

                if (length >= STORAGE_SIZE) {
                    const item = templatesStorage.shift();
                    item && (guarantee.value = item);
                }

                templatesStorage.push(cloneDeep(currentTemplates));
            });
        },
        { deep: true },
    );

    /* -------------------- BLOCK: 清空 -------------------- */
    const handleClear = clearCanvas;

    /* -------------------- BLOCK: 撤销 -------------------- */
    const handleUndo = () => {
        // 移除当前模板
        templatesStorage.pop();

        // 取最后一项
        const prevTemplates = templatesStorage[templatesStorage.length - 1];

        // 取消模板选中
        setSelectedTemplate();

        // 更新模板，撤销到末尾后，累计记录次数小于存储大小时可清空
        // 需要 cloneDeep，否则赋值空数组后，后续操作等于在此数组基础上变更
        templates.value = prevTemplates ?? cloneDeep(guarantee.value);
    };

    return { templatesStorage, handleClear, handleUndo };
}
