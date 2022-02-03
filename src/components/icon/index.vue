<template>
    <svg class="icon" :style="style" aria-hidden="true">
        <use :xlink:href="xlink"></use>
    </svg>
</template>
<script setup lang="ts" name="Icon">
import { computed } from 'vue';

const props = defineProps<{
    type: string;
    size?: number;
    color?: string;
}>();

const xlink = computed(() => {
    return `#icon-${props.type}`;
});

const style = computed(() => {
    const { size, color } = props;
    return {
        width: size,
        height: size,
        fill: color,
    };
});
</script>
<style lang="scss" scoped>
@import '@/assets/styles/var.scss';

.icon {
    width: 20px;
    height: 20px;
    fill: $text-color-primary;
    flex-shrink: 0;
}
</style>
