<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router';
import {
    Button as VanButton,
    ButtonIconPosition,
    // ButtonNativeType,
    ButtonSize,
    ButtonType,
    LoadingType,
} from 'vant';
import { materialClassName } from '@/utils/material';
const props = defineProps<{
    text?: string; // 不适应 slot 插槽作为文本，因为考虑到 JSON 的 children 字段约定是数组
    type?: ButtonType;
    size?: ButtonSize;
    color?: string;
    icon?: string;
    iconPosition?: ButtonIconPosition;
    // tag?: keyof HTMLElementTagNameMap;
    // nativeType?: ButtonNativeType;
    block?: boolean;
    plain?: boolean;
    square?: boolean;
    round?: boolean;
    disabled?: boolean;
    hairline?: boolean;
    loading?: boolean;
    loadingText?: string;
    loadingType?: LoadingType;
    loadingSize?: number | string;
    url?: string;
    to?: RouteLocationRaw;
    replace?: boolean;
}>();
</script>

<template>
    <div :class="materialClassName('button')">
        <van-button v-bind="props">
            {{ text }}
            <!-- <slot>这是一个按钮</slot> -->
        </van-button>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
