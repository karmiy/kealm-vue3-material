<script setup lang="ts">
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: [String, Number, Boolean],
        default: '',
    },
    placeholder: {
        type: String,
        default: '请选择',
    },
});
const emits = defineEmits(['update:modelValue']);

const onChange = (val: string) => emits('update:modelValue', val);
</script>

<template>
    <ConfigItem :class="beautyClassName('string')" :label="label">
        <el-input
            :model-value="modelValue"
            :placeholder="placeholder"
            @update:modelValue="onChange"
        />
    </ConfigItem>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
