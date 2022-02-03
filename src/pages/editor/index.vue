<script setup lang="ts" name="Editor">
import { ref } from 'vue';
import { SideBar } from './components';
import { Canvas, DecorationModal, Header, Materials } from './components';

const activeMenuType = ref('basic');
</script>

<template>
    <div class="editor">
        <SideBar v-model="activeMenuType" />
        <div class="flex flex-1 flex-col">
            <Header />
            <div class="flex flex-1 overflow-hidden pt-4">
                <Materials />
                <Canvas />
                <DecorationModal />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
