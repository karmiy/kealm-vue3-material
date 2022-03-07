<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { TemplateParser } from '@/components';
import { useCanvasDrag } from '@/hooks';
import { useCanvasStore } from '@/store';
import { CANVAS_TUPLE_TYPE } from '@/utils/constants';

/* -------------------- BLOCK: 物料拖拽 => 画布行为交互 -------------------- */
const canvasStore = useCanvasStore();
const { templates } = storeToRefs(canvasStore);

const { onDragOver, onDrop } = useCanvasDrag();
</script>

<template>
    <div
        class="canvas cursor-auto"
        :data-type="CANVAS_TUPLE_TYPE.Page"
        @mousedown.stop
        @mousemove.stop
        @mouseup.stop
        @dragover.stop.prevent="onDragOver"
        @drop.stop.prevent="onDrop"
    >
        <template-parser :templates="templates" />
        <!-- <template v-for="(item, index) in templates" :key="item.id">
            <div
                v-if="item.type === CANVAS_TUPLE_TYPE.Help"
                class="help"
                :data-type="CANVAS_TUPLE_TYPE.Help"
                :data-index="index"
            ></div>
            <Shape v-else :index="index" :template-id="item.id">
                <component :is="materialComponentName(item.type)" v-bind="item.config"> </component>
            </Shape>
        </template> -->
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
