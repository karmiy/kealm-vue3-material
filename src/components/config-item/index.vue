<script setup lang="ts">
import { PropType } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';

defineProps({
    label: {
        type: String,
        required: true,
    },
    align: {
        type: String as PropType<'top' | 'center' | 'bottom'>,
        default: 'center',
    },
    list: {
        type: Array as PropType<Array<{ label: string }>>,
        default: () => [],
    },
    tip: {
        type: String,
    },
});
</script>

<template>
    <div
        :class="{
            'config-item': true,
            flex: true,
            'p-8': true,
            'items-center': align === 'center',
            'items-start': align === 'top',
            'items-end': align === 'bottom',
        }"
    >
        <div class="w-72 label text-size-13">
            {{ label }}
        </div>
        <div class="flex-1">
            <slot />
        </div>
        <div v-if="tip" class="flex items-center ml-4 cursor-pointer">
            <el-tooltip effect="dark" :content="tip" placement="bottom">
                <el-icon :size="16"><question-filled /></el-icon>
            </el-tooltip>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// @import './styles.scss';
</style>
