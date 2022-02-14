<script setup lang="ts">
import { Icon } from 'vant';
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';
import { ICON_GROUPS } from './constants';

defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
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
    <ConfigItem :class="beautyClassName('icon')" :label="label">
        <el-select
            :model-value="modelValue"
            :placeholder="placeholder"
            :clearable="true"
            @update:modelValue="onChange"
        >
            <el-option-group v-for="group in ICON_GROUPS" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item" :value="item">
                    <Icon :name="item" /> {{ item }}
                </el-option>
            </el-option-group>
        </el-select>
    </ConfigItem>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
