<script setup lang="ts">
import { PropType, ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { storeToRefs } from 'pinia';
import { useMaterials } from '@/hooks';
import { useCanvasStore } from '@/store';
import { beautyClassName, beautyComponentName } from '@/utils/beauty';

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    propName: {
        type: String,
        required: true,
    },
    modelValue: {
        type: Array as PropType<Array<any>>,
        default: () => [],
    },
    mappings: {
        type: Array as PropType<Array<EditorNS.FieldItem>>,
        default: () => [],
    },
});

/* -------------------- BLOCK: v-model -------------------- */
const emits = defineEmits(['update:modelValue']);

const onChange = (val: Array<any>) => emits('update:modelValue', val);

/* -------------------- BLOCK: 添加/移除交互 -------------------- */
const canvasStore = useCanvasStore();
const { selectedTemplate } = storeToRefs(canvasStore);
const { getControllerByName } = useMaterials();

const selectedTabName = ref('0');

const addTab = () => {
    const template = selectedTemplate.value;
    if (!template) return;

    const { modelValue, propName } = props;
    // 选中项自动切换为新增项
    const nextTabSize = modelValue.length + 1;
    selectedTabName.value = `${nextTabSize - 1}`;

    // 数组新增项（先走自定义 controller）
    const nextModelValue = getControllerByName(template.type)?.arrayMapReducer?.({
        selectedTemplate: template,
        propName,
        currentValue: modelValue,
        action: {
            type: 'add',
        },
    }) ?? [...modelValue, {}];

    onChange(nextModelValue);
};
const removeTab = (targetName: string) => {
    const template = selectedTemplate.value;
    if (!template) return;

    const { modelValue, propName } = props;

    // 删的如果刚好是当前选中，把当前选中置为它下一项或上一项
    const removeIndex = Number(targetName);
    let nextSelectedIndex = 0;

    if (modelValue[removeIndex + 1]) {
        nextSelectedIndex = removeIndex;
    } else if (modelValue[removeIndex - 1]) {
        nextSelectedIndex = removeIndex - 1;
    }
    selectedTabName.value = `${nextSelectedIndex}`;

    // 过滤掉删的那项（先走自定义 controller）
    const nextModelValue = getControllerByName(template.type)?.arrayMapReducer?.({
        selectedTemplate: template,
        propName: propName,
        currentValue: modelValue,
        action: {
            type: 'remove',
            payload: {
                removeIndex,
            },
        },
    }) ?? [...modelValue.filter((_, index) => index !== removeIndex)];

    onChange(nextModelValue);
};
</script>

<template>
    <div :class="[beautyClassName('arrayMap'), 'p-8']">
        <div class="mb-8">
            <el-button size="small" @click="addTab">
                {{ label }}<el-icon><Plus /></el-icon>
            </el-button>
        </div>
        <el-tabs
            v-model="selectedTabName"
            type="card"
            class="demo-tabs"
            closable
            @tab-remove="removeTab"
        >
            <el-tab-pane
                v-for="(item, index) in modelValue"
                :key="index"
                :label="`Tab ${index + 1}`"
                :name="`${index}`"
            >
                <component
                    :is="beautyComponentName(map.beauty.type)"
                    v-for="map in mappings"
                    :key="map.prop"
                    v-model="item[map.prop]"
                    :label="map.label"
                    v-bind="map.beauty.config"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
