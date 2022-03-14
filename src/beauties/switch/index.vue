<script setup lang="ts">
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

const props = defineProps({
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
    <config-item :class="beautyClassName('switch')" v-bind="props">
        <el-switch :model-value="modelValue" @update:modelValue="onChange" />
    </config-item>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
