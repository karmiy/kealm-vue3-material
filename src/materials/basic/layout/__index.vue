<script setup lang="ts">
import { Col as VanCol, Row as VanRow, RowAlign, RowJustify } from 'vant';
import { Socket, TemplateParser } from '@/components';
import { materialClassName } from '@/utils/material';

defineProps<{
    gutter?: number | string;
    justify?: RowJustify;
    align?: RowAlign;
    wrap?: boolean;
    list?: Array<{
        span?: number | string;
        offset?: number | string;
        slot?: EditorNS.TemplateItem;
    }>;
}>();
</script>

<template>
    <div :class="materialClassName('layout')">
        <van-row :gutter="gutter" :justify="justify" :align="align" :wrap="wrap">
            <van-col
                v-for="(item, index) in list"
                :key="index"
                :span="item.span"
                :offset="item.offset"
            >
                <template-parser v-if="item.slot" :templates="[item.slot]" />
                <socket v-else :path="`[list][${index}][slot]`" />
            </van-col>
        </van-row>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
