<template>
    <transition name="collapse-transition" v-on="on">
        <slot></slot>
    </transition>
</template>
<script setup lang="ts">
import { isNil } from 'lodash-es';

const { direction = 'horizontal' } = defineProps<{ direction?: 'vertical' | 'horizontal' }>();

const isHoriz = direction === 'horizontal';

const rectUnit = isHoriz ? 'Width' : 'Height';
const maxRectUnit = `max${rectUnit}` as const;
const scrollRectUnit = `scroll${rectUnit}` as const;

const directSUnit = isHoriz ? 'Left' : 'Top';
const directEUnit = isHoriz ? 'Right' : 'Bottom';
const paddingSUnit = `padding${directSUnit}` as const;
const paddingEUnit = `padding${directEUnit}` as const;

const on = {
    beforeEnter(el: HTMLElement) {
        // if (!el.dataset) el.dataset = {};

        el.dataset.oldPaddingS = el.style[paddingSUnit];
        el.dataset.oldPaddingE = el.style[paddingEUnit];

        el.style[maxRectUnit] = '0';
        el.style[paddingSUnit] = '0';
        el.style[paddingEUnit] = '0';
    },

    enter(el: HTMLElement) {
        el.dataset.oldOverflow = el.style.overflow;

        el.style[maxRectUnit] = el[scrollRectUnit] !== 0 ? `${el[scrollRectUnit]}px` : '0';
        !isNil(el.dataset.oldPaddingS) && (el.style[paddingSUnit] = el.dataset.oldPaddingS);
        !isNil(el.dataset.oldPaddingE) && (el.style[paddingEUnit] = el.dataset.oldPaddingE);

        el.style.overflow = 'hidden';
    },

    afterEnter(el: HTMLElement) {
        el.style[maxRectUnit] = '';
        !isNil(el.dataset.oldOverflow) && (el.style.overflow = el.dataset.oldOverflow);
    },

    beforeLeave(el: HTMLElement) {
        // if (!el.dataset) el.dataset = {};
        el.dataset.oldPaddingS = el.style[paddingSUnit];
        el.dataset.oldPaddingE = el.style[paddingEUnit];
        el.dataset.oldOverflow = el.style.overflow;

        el.style[maxRectUnit] = `${el[scrollRectUnit]}px`;
        el.style.overflow = 'hidden';
    },

    leave(el: HTMLElement) {
        if (el[scrollRectUnit] !== 0) {
            el.style[maxRectUnit] = '0';
            el.style[paddingSUnit] = '0';
            el.style[paddingEUnit] = '0';
        }
    },

    afterLeave(el: HTMLElement) {
        el.style[maxRectUnit] = '';
        !isNil(el.dataset.oldOverflow) && (el.style.overflow = el.dataset.oldOverflow);
        !isNil(el.dataset.oldPaddingS) && (el.style[paddingSUnit] = el.dataset.oldPaddingS);
        !isNil(el.dataset.oldPaddingE) && (el.style[paddingEUnit] = el.dataset.oldPaddingE);
    },
};
</script>
<style lang="scss" scoped>
@import './styles.scss';
</style>
