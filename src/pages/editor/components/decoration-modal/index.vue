<script lang="ts">
import { computed, ref } from 'vue';
import { isEmpty } from '@/utils/validation';
const isCollapsed = ref(false);
export const toggleCollapsed = (value?: boolean) => {
    isCollapsed.value = isEmpty(value) ? !isCollapsed.value : value;
};
</script>

<script setup lang="ts" name="EditorDecorationModal">
import { Icon } from '@/components';
import { CollapseTransition, ConfigItem } from '@/components';

const collapsedIconType = computed(() => `double-arrow-${!isCollapsed.value ? 'right' : 'left'}`);
</script>

<template>
    <div class="editor-decoration-modal">
        <div class="collapsed" @click="() => toggleCollapsed()">
            <Icon :type="collapsedIconType" />
        </div>
        <CollapseTransition>
            <div v-show="!isCollapsed" class="h-full">
                <div class="wrapper h-full overflow-auto">
                    <div class="title">属性配置</div>
                    <ul>
                        <li v-for="group in 2" :key="group">
                            <div class="group-title">
                                <div class="flex items-center">公告内容</div>
                            </div>
                            <div class="group-body">
                                <ul>
                                    <li v-for="item in 3" :key="item">
                                        <ConfigItem label="公告文本">
                                            <el-input />
                                        </ConfigItem>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <!-- <el-button type="">button</el-button>
                    <span>Hi there!</span>
                    <div style="height: 1000px"></div> -->
                </div>
            </div>
        </CollapseTransition>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
