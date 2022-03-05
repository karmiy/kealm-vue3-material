<script setup lang="ts">
import { PropType } from 'vue';
import { ConfigItem } from '@/components';
import { beautyClassName } from '@/utils/beauty';

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: Array,
    },
    mapping: {
        type: Object as PropType<Record<string, EditorNS.Beauty>>,
    },
});

const emits = defineEmits(['update:modelValue']);

const onChange = (val: number) => emits('update:modelValue', val);
console.log('mapping', props.mapping);
</script>

<template>
    <config-item :class="beautyClassName('arrayMap')" :label="label">
        <div>111</div>
    </config-item>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
