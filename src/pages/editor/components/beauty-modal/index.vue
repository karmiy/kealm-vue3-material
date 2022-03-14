<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { CollapseTransition, ConfigItem, Icon } from '@/components';
import { useMaterials } from '@/hooks';
import { useCanvasStore } from '@/store';
import { beautyComponentName } from '@/utils/beauty';
const canvasStore = useCanvasStore();
const { getMaterialByName } = useMaterials();
const { beautyVisible, selectedTemplate } = storeToRefs(canvasStore);

/* -------------------- BLOCK: 折叠弹框 -------------------- */
const toggleCollapsed = () => {
    beautyVisible.value = !beautyVisible.value;
};

const collapsedIconType = computed(() => `double-arrow-${beautyVisible.value ? 'right' : 'left'}`);

/* -------------------- BLOCK: 属性列表 -------------------- */
const fields = computed(() => {
    const selectedMaterial = selectedTemplate.value?.type;
    if (!selectedMaterial) return [];

    return getMaterialByName(selectedMaterial)?.fields ?? [];
});

/* -------------------- BLOCK: v-model -------------------- */
const onModelValueChange = (value: EditorNS.FlatValue, prop: string) => {
    if (!selectedTemplate.value) return;

    if (!selectedTemplate.value.config) selectedTemplate.value.config = {};

    if (value === '') return delete selectedTemplate.value.config![prop];

    selectedTemplate.value.config![prop] = value;
};
</script>

<template>
    <div class="editor-decoration-modal">
        <div class="collapsed" @click="() => toggleCollapsed()">
            <Icon :type="collapsedIconType" :size="16" />
        </div>
        <!-- <bt-select
            v-model="value"
            :options="[
                { label: 'Primary', value: 'primary' },
                { label: 'Success', value: 'success' },
            ]"
        /> -->
        <collapse-transition>
            <div v-show="beautyVisible" class="h-full">
                <div class="wrapper h-full overflow-auto">
                    <div class="title">属性配置</div>
                    <ul>
                        <li v-for="group in fields" :key="group.title">
                            <div class="group-title">
                                <div class="flex items-center">{{ group.title }}</div>
                            </div>
                            <div class="group-body">
                                <ul>
                                    <li v-for="item in group.children" :key="item.prop">
                                        <component
                                            :is="beautyComponentName(item.beauty.type)"
                                            :prop-name="item.prop"
                                            :model-value="selectedTemplate?.config?.[item.prop]"
                                            :label="item.label"
                                            v-bind="item.beauty.config"
                                            :tip="item.beauty.tip"
                                            @update:modelValue="
                                                onModelValueChange($event, item.prop)
                                            "
                                        />
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <!-- <li v-for="group in 2" :key="group">
                            <div class="group-title">
                                <div class="flex items-center">公告内容</div>
                            </div>
                            <div class="group-body">
                                <ul>
                                    <li v-for="item in 3" :key="item">
                                        <config-item label="公告文本">
                                            <el-input />
                                        </config-item>
                                    </li>
                                </ul>
                            </div>
                        </li> -->
                    </ul>
                </div>
            </div>
        </collapse-transition>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
