<script setup lang="ts" name="EditorSidebar">
import { computed, ref, watch } from 'vue';
import { Icon } from '@/components';
import { MENU_TYPES } from './constants';

const props = defineProps<{ modelValue?: string }>();
const emits = defineEmits(['update:modelValue']);

defineExpose({
    count: 1,
});

/* -------------------- BLOCK: 当前选中 -------------------- */
const activeKey = ref(props.modelValue ?? MENU_TYPES[0].key);
const onActiveChange = (key: string) => {
    activeKey.value = key;
    emits('update:modelValue', key);
};

watch(
    () => props.modelValue,
    nextValue => {
        if (nextValue === activeKey.value || !nextValue) return;

        activeKey.value = nextValue;
    },
);

/* -------------------- BLOCK: sidebar 折叠状态 -------------------- */
const isCollapsed = ref(false);
const collapsedIconType = computed(() => `double-arrow-${isCollapsed.value ? 'right' : 'left'}`);
</script>

<template>
    <div class="editor-sidebar">
        <!-- <collapse-transition> -->
        <div class="box-border h-full pt-16">
            <div :class="{ content: true, 'is-collapsed': isCollapsed }">
                <div class="logo">
                    <img src="@/assets/images/logo.png" />
                </div>
                <ul class="menu">
                    <li
                        v-for="item in MENU_TYPES"
                        :key="item.key"
                        :class="{ 'menu-item': true, 'is-active': item.key === activeKey }"
                        @click="onActiveChange(item.key)"
                    >
                        <!-- <el-icon :size="18"><div v-is="item.icon" /></el-icon> -->
                        <Icon :type="item.icon" :size="20" />
                        <span class="type">{{ item.label }}</span>
                    </li>
                </ul>
                <div class="collapsed hit-slop" @click="isCollapsed = !isCollapsed">
                    <Icon :type="collapsedIconType" :size="20" />
                    <!-- <el-icon :size="20">
                        <d-arrow-left v-if="!isCollapsed" />
                        <d-arrow-right v-else />
                    </el-icon> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
