<script setup lang="ts">
import { ref } from 'vue';
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
    changeAfterBlur: {
        type: Boolean,
        default: true,
    },
    placeholder: {
        type: String,
        default: '请选择',
    },
});
const emits = defineEmits(['update:modelValue']);
const handleEmitChange = (val: string) => emits('update:modelValue', val);

const inputValue = ref(String(props.modelValue));

const onChange = (val: string) => {
    inputValue.value = val;
    if (props.modelValue === val) return;

    if (props.changeAfterBlur) return;
    handleEmitChange(val);
};

const onBlur = () => {
    if (!props.changeAfterBlur) return;
    if (props.modelValue === inputValue.value) return;

    handleEmitChange(inputValue.value);
};
</script>

<template>
    <config-item :class="beautyClassName('string')" v-bind="props">
        <el-input
            :model-value="inputValue"
            :placeholder="placeholder"
            @update:modelValue="onChange"
            @blur="onBlur"
        />
    </config-item>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
