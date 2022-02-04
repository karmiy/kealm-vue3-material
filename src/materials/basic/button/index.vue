<script setup lang="ts">
import { Button as VanButton, ButtonProps } from 'vant';
import { materialClassName } from '@/utils/material';
const props = defineProps<{
    type?: ButtonProps['type'];
    icon?: string;
}>();
</script>

<template>
    <div :class="materialClassName('button')">
        <van-button v-bind="props">
            <slot />
        </van-button>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
