<script setup lang="ts">
import { ref } from 'vue';
import { Canvas } from '@/components';
import { useDrag } from '@/hooks';
import { useCanvasStore } from '@/store';

/* -------------------- BLOCK: 画布拖拽 -------------------- */
const wrapperEl = ref<HTMLElement | null>(null);
const { style } = useDrag(wrapperEl);
// const onWrapMousedown = () => {}
const isTouchDown = ref(false);

/* -------------------- BLOCK: 点击画布外取消模板选中 -------------------- */
const { setSelectedTemplate } = useCanvasStore();
const onWrapperClick = () => {
    setSelectedTemplate();
};
</script>

<template>
    <div class="editor-canvas scroll-hidden">
        <div
            ref="wrapperEl"
            :class="{
                wrapper: true,
                'cursor-move': isTouchDown,
                'cursor-default': !isTouchDown,
            }"
            @click.stop="onWrapperClick"
            @mousedown="isTouchDown = true"
            @mouseup="isTouchDown = false"
        >
            <Canvas :style="style" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
