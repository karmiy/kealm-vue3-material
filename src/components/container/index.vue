<script setup lang="ts">
import { CANVAS_TUPLE_TYPE } from '@/utils/constants';

const { minHeight } = defineProps({
    minHeight: {
        type: Number,
    },
    templateId: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div
        class="container pointer-events-auto"
        :style="{ minHeight: `${minHeight}px` }"
        :data-id="templateId"
        :data-type="CANVAS_TUPLE_TYPE.Container"
    >
        <slot />
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
