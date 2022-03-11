<template>
    <svg :class="{ icon: true, 'is-disabled': disabled }" :style="style" aria-hidden="true">
        <use :xlink:href="xlink"></use>
    </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    type: string;
    size?: number;
    color?: string;
    disabled?: boolean;
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
@import './styles.scss';
</style>
