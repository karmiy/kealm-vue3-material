<script setup lang="ts" name="ConfigItem">
const { label, align = 'center' } = defineProps<{
    label: string;
    align?: 'top' | 'center' | 'bottom';
}>();
</script>

<template>
    <div
        :class="{
            'config-item': true,
            flex: true,
            'p-8': true,
            'items-center': align === 'center',
            'items-start': align === 'top',
            'items-end': align === 'bottom',
        }"
    >
        <div class="w-72 label text-size-13">{{ label }}</div>
        <div class="flex-1">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
// @import './styles.scss';
</style>
