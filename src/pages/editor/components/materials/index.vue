<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { Empty, Icon } from '@/components';
import { useMaterials } from '@/hooks';
import { useCanvasStore } from '@/store';

const props = defineProps<{
    group: string;
}>();

/* -------------------- BLOCK: 物料区 -------------------- */
const { getMaterialsByGroup } = useMaterials();
const materials = computed(() => getMaterialsByGroup(props.group));

/* -------------------- BLOCK: 拖拽 -------------------- */
const canvasStore = useCanvasStore();
const { registryDragMaterial, releaseDragMaterial } = canvasStore;
const { dragMaterial, templates, isDragging } = storeToRefs(canvasStore);

const onDragStart = (name: string) => {
    isDragging.value = true;
    registryDragMaterial(name);
};

/* 顺序：drop => end */
const onDragEnd = () => {
    isDragging.value = false;
    if (!dragMaterial.value) return;

    // 结束拖拽时，如果鼠标在画布外，需要移除辅助块
    const { waitToInsertIndex } = dragMaterial.value;
    if (waitToInsertIndex !== -1) {
        // const curTemplates = [...templates.value];
        templates.value.splice(waitToInsertIndex, 1);
        // setTemplates(curTemplates);
    }

    releaseDragMaterial();
};
</script>

<template>
    <ul class="editor-materials scroll-hidden">
        <empty v-if="!materials?.length" description="暂无物料" :size="60" />
        <li
            v-for="item in materials"
            v-else
            :key="item.label"
            class="item"
            draggable="true"
            @dragstart="onDragStart(item.name)"
            @dragend="onDragEnd"
        >
            <Icon :type="item.icon" :size="30" />
            <span>{{ item.label }}</span>
        </li>
        <!-- <li
            v-for="item in 8"
            :key="item"
            class="item"
            draggable="true"
            @dragstart="onDragStart"
            @dragend="onDragEnd"
        >
            <Icon type="save" :size="30" />
            <span>按钮</span>
        </li> -->
    </ul>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
