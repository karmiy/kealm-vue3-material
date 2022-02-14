<script setup lang="ts">
import { ref } from 'vue';
import { SideBar } from './components';
import { BeautyModal, Canvas, Header, Materials } from './components';

// 当前物料组
const materialGroup = ref('basic');
</script>

<template>
    <div class="editor">
        <SideBar v-model="materialGroup" />
        <div class="flex flex-1 flex-col">
            <Header />
            <div class="flex flex-1 overflow-hidden pt-4">
                <Materials :group="materialGroup" />
                <Canvas />
                <BeautyModal />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
