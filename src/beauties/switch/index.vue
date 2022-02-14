<script setup lang="ts">
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: Boolean,
        default: false,
    },
});
const emits = defineEmits(['update:modelValue']);

const onChange = (val: boolean) => emits('update:modelValue', val);
</script>

<template>
    <ConfigItem :class="beautyClassName('switch')" :label="label">
        <el-switch :model-value="modelValue" @update:modelValue="onChange" />
    </ConfigItem>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
