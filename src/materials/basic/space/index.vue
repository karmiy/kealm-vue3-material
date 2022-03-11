<script setup lang="ts">
import { materialClassName } from '@/utils/material';
defineProps({
    height: {
        type: Number,
        default: 16,
    },
    color: {
        type: String,
    },
});
</script>

<template>
    <div :class="materialClassName('space')">
        <div :style="{ height: `${height}px`, backgroundColor: color }" />
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
