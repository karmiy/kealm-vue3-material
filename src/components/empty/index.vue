<script setup lang="ts" name="Empty">
defineProps({
    description: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 60,
    },
});
</script>

<template>
    <el-empty class="empty" :description="description">
        <template #image>
            <Icon type="empty" :size="size" />
        </template>
    </el-empty>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
