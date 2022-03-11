<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@/components';
import { useToolsHandler } from './useToolsHandler';
const { templatesStorage, handleClear, handleUndo } = useToolsHandler();

const tools = computed(() => {
    return [
        {
            label: '保存',
            icon: 'save',
        },
        {
            label: '下载',
            icon: 'download',
        },
        {
            label: '撤销',
            icon: 'undo',
            handler: handleUndo,
            disabled: templatesStorage.length === 0,
        },
        {
            label: '清空',
            icon: 'clear',
            handler: handleClear,
        },
        {
            label: '预览',
            icon: 'preview',
        },
    ];
});
</script>

<template>
    <div class="editor-header">
        <div class="wrap-item">
            <!-- <div class="title">模板</div> -->
            <!-- {{ templates }} -->
        </div>
        <div class="wrap-item">
            <ul class="tools">
                <li
                    v-for="item in tools"
                    :key="item.label"
                    :class="{ 'is-disabled': item.disabled }"
                >
                    <Icon
                        v-if="item.disabled"
                        :type="item.icon"
                        :size="20"
                        disabled
                        @click="item.handler"
                    />
                    <el-tooltip v-else effect="dark" :content="item.label" placement="bottom">
                        <div>
                            <Icon :type="item.icon" :size="20" @click="item.handler" />
                        </div>
                    </el-tooltip>
                </li>
            </ul>
            <div>
                <el-button>页面设置</el-button>
                <el-button>退出</el-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
