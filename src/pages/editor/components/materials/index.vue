<script setup lang="ts">
import { computed } from 'vue';
import { Empty, Icon } from '@/components';
import { useCanvasDrag, useMaterials } from '@/hooks';

const props = defineProps<{
    group: string;
}>();

/* -------------------- BLOCK: 物料区 -------------------- */
const { getMaterialsByGroup } = useMaterials();
const materials = computed(() => getMaterialsByGroup(props.group));

/* -------------------- BLOCK: 拖拽 -------------------- */
const { onDragStart, onDragEnd } = useCanvasDrag();
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
