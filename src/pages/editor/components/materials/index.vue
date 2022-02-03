<script setup lang="ts" name="EditorMaterials">
import { Icon } from '@/components';

const onDragStart = () => {
    console.log('start');
};
const onDragEnd = () => {
    console.log('end');
};
</script>

<template>
    <ul class="editor-materials scroll-hidden">
        <li
            v-for="item in 8"
            :key="item"
            class="item"
            draggable="true"
            @dragstart="onDragStart"
            @dragend="onDragEnd"
        >
            <Icon type="save" :size="30" />
            <span>输入框</span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
