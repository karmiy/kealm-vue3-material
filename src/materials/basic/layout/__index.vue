<script setup lang="ts">
import { computed, createCommentVNode, PropType, reactive, useSlots, watch } from 'vue';
import { Col as VanCol, Row as VanRow, RowAlign, RowJustify } from 'vant';
import { TemplateParser } from '@/components';
import { materialClassName } from '@/utils/material';

interface ListItem {
    span?: number | string;
    offset?: number | string;
}

defineProps({
    gutter: {
        type: [Number, String],
    },
    justify: {
        type: String as PropType<RowJustify>,
    },
    align: {
        type: String as PropType<RowAlign>,
    },
    wrap: {
        type: Boolean,
        default: true,
    },
    list: {
        type: Array as PropType<Array<ListItem>>,
    },
});

const commentVNode = createCommentVNode();

// const defaultSlots = slots.default?.().filter(item => item.type !== commentVNode.type);
// console.log(defaultSlots?.[0].props?.templates, props, props.wrap);
/* defaultSlots?.forEach(item =>
            console.log(item, item.type === createCommentVNode().type, item.el),
        ); */

const slots = useSlots();

const templates = computed(() => {
    // 过滤掉注释节点
    const defaultSlots = slots.default?.().filter(item => item.type !== commentVNode.type);
    const templateParser = defaultSlots?.[0];

    return templateParser?.props?.templates as Array<EditorNS.TemplateItem>;
});
</script>

<template>
    <div :class="materialClassName('layout')">
        <van-row :gutter="gutter" :justify="justify" :align="align" :wrap="wrap">
            <van-col v-for="(item, index) in list" :key="index" v-bind="item">
                <template-parser :templates="[templates[index] ?? []]" />
                <!-- <socket v-else :path="`[list][${index}][slot]`" /> -->
            </van-col>
        </van-row>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
