<script setup lang="ts">
import { PropType } from 'vue';
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

type Value = string | number | boolean;

interface Option {
    label: string;
    value: Value;
}

defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: [String, Number, Boolean],
        default: '',
    },
    options: {
        type: Array as PropType<Array<Option>>,
        default: () => [],
    },
    placeholder: {
        type: String,
        default: '请选择',
    },
    clearable: {
        type: Boolean,
        default: false,
    },
});
const emits = defineEmits(['update:modelValue']);

const onChange = (val: Value) => emits('update:modelValue', val);
</script>

<template>
    <ConfigItem :class="beautyClassName('select')" :label="label">
        <el-select
            :model-value="modelValue"
            :placeholder="placeholder"
            :clearable="clearable"
            @update:modelValue="onChange"
        >
            <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
        </el-select>
    </ConfigItem>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
