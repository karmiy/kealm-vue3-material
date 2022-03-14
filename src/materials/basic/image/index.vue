<script setup lang="ts">
import { PropType } from 'vue';
import { Image as VanImage } from 'vant';
import { materialClassName } from '@/utils/material';

type Position =
    | 'left top'
    | 'left center'
    | 'left bottom'
    | 'center top'
    | 'center'
    | 'center bottom'
    | 'right top'
    | 'right center'
    | 'right bottom';

defineProps({
    src: {
        type: String,
    },
    fit: {
        type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>,
    },
    position: {
        type: String as PropType<Position>,
    },
    width: {
        type: String,
        default: '100%',
    },
    height: {
        type: String,
        default: '100',
    },
    radius: {
        type: String,
    },
    round: {
        type: Boolean,
    },
});
</script>

<template>
    <!-- <div :class="materialClassName('image')"> -->
    <van-image
        :class="materialClassName('image')"
        :width="width"
        :height="height"
        :src="src"
        :fit="fit"
        :position="position"
        :radius="radius"
        :round="round"
    />
    <!-- </div> -->
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
