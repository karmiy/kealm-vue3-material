<script setup lang="ts">
import { CANVAS_TUPLE_TYPE } from '@/utils/constants';

const { height } = defineProps({
    height: {
        type: Number,
        default: 60,
    },
    templateId: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div
        class="socket pointer-events-auto"
        :style="{ height: `${height}px` }"
        :data-id="templateId"
        :data-type="CANVAS_TUPLE_TYPE.Socket"
    />
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
