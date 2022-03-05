<script setup lang="ts">
import { CANVAS_TUPLE_TYPE } from '@/utils/constants';

defineProps({
    index: {
        type: Number,
        default: 60,
    },
    templateId: {
        type: Number,
        required: true,
    },
});
</script>

<template>
    <div
        class="help"
        :data-type="CANVAS_TUPLE_TYPE.Help"
        :data-index="index"
        :data-id="templateId"
    ></div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
