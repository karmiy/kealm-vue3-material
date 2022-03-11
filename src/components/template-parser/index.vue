<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Container, Help, Shape } from '@/components';
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
        <container v-else-if="item.type === CANVAS_TUPLE_TYPE.Container" :template-id="item.id">
            <template-parser v-if="item.children" :templates="item.children" />
        </container>
        <shape v-else :index="index" :template-id="item.id">
            <!-- <template-parser v-if="item.children" :templates="item.children" /> -->
            <component :is="materialComponentName(item.type)" v-bind="item.config">
                <template-parser
                    v-if="item.children"
                    :key="Date.now()"
                    :templates="item.children"
                />
            </component>
        </shape>
        <!-- <template v-if="item.type === 'layout'">{{ item.children }}</template> -->
    </template>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
