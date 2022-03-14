<script setup lang="ts">
import { PropType, ref } from 'vue';
import { isNil } from 'lodash-es';
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

interface Option {
    label: string;
    value: string;
}

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
    },
    options: {
        type: Array as PropType<Array<Option>>,
        default: () => [
            { label: 'px', value: 'px' },
            { label: '%', value: '%' },
            { label: 'em', value: 'em' },
            { label: 'rem', value: 'rem' },
            { label: 'vw', value: 'vw' },
            { label: 'vh', value: 'vh' },
        ],
    },
});

const emits = defineEmits(['update:modelValue']);

const getInputNumber = (val?: string) => {
    if (isNil(val)) return val;

    return parseFloat(val);
};

const getUnit = (val?: string) => {
    if (isNil(val)) return val;

    return props.options.find(item => val.includes(item.label))?.value;
};

const inputValue = ref(getInputNumber(props.modelValue));
const selectUnit = ref(getUnit(props.modelValue));

const onChange = () => {
    const nextValue = `${inputValue.value}${selectUnit.value}`;
    if (nextValue === props.modelValue) return;

    emits('update:modelValue', nextValue);
};

const onInputValueChange = (val: number) => {
    inputValue.value = val;
    onChange();
};

const onSelectUnitChange = (val: string) => {
    selectUnit.value = val;
    onChange();
};
</script>

<template>
    <config-item :class="beautyClassName('measure')" v-bind="props">
        <div class="flex">
            <el-input-number
                class="mr-8"
                :model-value="inputValue"
                :min="0"
                controls-position="right"
                @update:modelValue="onInputValueChange"
            />
            <el-select
                class="w-80"
                :model-value="selectUnit"
                placeholder="单位"
                @update:modelValue="onSelectUnitChange"
            >
                <el-option
                    v-for="item in options"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
    </config-item>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
