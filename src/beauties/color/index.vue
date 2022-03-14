<script setup lang="ts">
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

const props = defineProps({
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
    <config-item :class="beautyClassName('color')" v-bind="props">
        <el-color-picker :model-value="modelValue" @update:modelValue="onChange" />
    </config-item>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
