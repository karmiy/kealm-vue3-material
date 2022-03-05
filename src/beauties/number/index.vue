<script setup lang="ts">
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: Number,
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
    },
    precision: {
        type: Number,
        default: 0,
    },
});
const emits = defineEmits(['update:modelValue']);

const onChange = (val: number) => emits('update:modelValue', val);
</script>

<template>
    <config-item :class="beautyClassName('number')" :label="label">
        <el-input-number
            :model-value="modelValue"
            :min="min"
            :max="max"
            :precision="precision"
            controls-position="right"
            @update:modelValue="onChange"
        />
    </config-item>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
