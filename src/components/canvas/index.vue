<script setup lang="ts" name="Canvas"></script>

<template>
    <div class="canvas cursor-auto" @mousedown.stop @mousemove.stop @mouseup.stop>
        <km-Button type="primary" icon="plus">朴素按钮</km-Button>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
