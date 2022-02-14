<script setup lang="ts">
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        default: '',
    },
});
const emits = defineEmits(['update:modelValue']);

const onChange = (val: string) => emits('update:modelValue', val);
</script>

<template>
    <ConfigItem :class="beautyClassName('color')" :label="label">
        <el-color-picker :model-value="modelValue" @update:modelValue="onChange" />
    </ConfigItem>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
