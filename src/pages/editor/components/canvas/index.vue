<script setup lang="ts" name="EditorCanvas">
import { ref } from 'vue';
import { Canvas } from '@/components';
import { useDrag } from '@/hooks';

const wrapperEl = ref<HTMLElement | null>(null);
const { style } = useDrag(wrapperEl);
// const onWrapMousedown = () => {}
const isTouchDown = ref(false);
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
