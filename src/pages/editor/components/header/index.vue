<script setup lang="ts">
import { Icon } from '@/components';

const tools = [
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
    },
    {
        label: '清空',
        icon: 'clear',
    },
    {
        label: '预览',
        icon: 'preview',
    },
];
</script>

<template>
    <div class="editor-header">
        <div class="wrap-item">
            <!-- <div class="title">模板</div> -->
        </div>
        <div class="wrap-item">
            <ul class="tools">
                <li v-for="item in tools" :key="item.label">
                    <el-tooltip effect="dark" :content="item.label" placement="bottom">
                        <div>
                            <Icon :type="item.icon" :size="20" />
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
