<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Help, Shape, Socket } from '@/components';
import { CANVAS_TUPLE_TYPE } from '@/utils/constants';
import { materialComponentName } from '@/utils/material';

export default defineComponent({
    name: 'TemplateParser',
});
</script>
<script setup lang="ts">
defineProps({
    templates: {
        type: Array as PropType<Array<EditorNS.TemplateItem>>,
        default: () => [],
    },
});
</script>

<template>
    <template v-for="(item, index) in templates" :key="item.id">
        <help v-if="item.type === CANVAS_TUPLE_TYPE.Help" :index="index" :template-id="item.id" />
        <socket v-else-if="item.type === CANVAS_TUPLE_TYPE.Socket" :template-id="item.id" />
        <shape v-else :index="index" :template-id="item.id">
            <!-- <template-parser v-if="item.children" :templates="item.children" /> -->
            <component :is="materialComponentName(item.type)" v-bind="item.config">
                <template-parser v-if="item.children" :templates="item.children" />
            </component>
        </shape>
    </template>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
