<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/store';
import { CANVAS_TUPLE_TYPE } from '../../utils/constants';

const { templateId } = defineProps({
    index: {
        type: Number,
        required: true,
    },
    templateId: {
        type: Number,
        required: true,
    },
});

const canvasStore = useCanvasStore();
const { setSelectedTemplate } = canvasStore;
const { isDragging, selectedTemplate, templateMap } = storeToRefs(canvasStore);

const onClick = () => {
    setSelectedTemplate(templateMap.value[templateId]);
};
</script>

<template>
    <div
        v-hover.stop="'is-hover'"
        class="shape"
        :data-type="CANVAS_TUPLE_TYPE.Material"
        :data-index="index"
        @click.stop="onClick"
    >
        <div class="shape-dashed"></div>
        <div v-if="selectedTemplate?.id === templateId" class="shape-solid"></div>
        <div :class="[isDragging ? 'pointer-events-none' : '']">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
