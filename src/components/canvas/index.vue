<script setup lang="ts" name="Canvas">
const click = () => {
    //
};
</script>

<template>
    <div class="canvas cursor-auto" @mousedown.stop @mousemove.stop @mouseup.stop>
        <van-button type="primary">朴素按钮</van-button>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
