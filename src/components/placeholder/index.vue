<script setup lang="ts">
const { height } = defineProps({
    height: {
        type: Number,
        default: 60,
    },
});
</script>

<template>
    <div class="placeholder" :style="{ height: `${height}px` }" />
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
