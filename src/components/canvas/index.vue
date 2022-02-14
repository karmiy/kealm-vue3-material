<script setup lang="ts">
import { computed } from 'vue';
import { useThrottleFn } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { Shape } from '@/components';
import { useCanvasStore } from '@/store';
import { generateTplSeries } from '@/utils/canvas';
import { CANVAS_TUPLE_TYPE } from '@/utils/constants';
import { materialComponentName } from '@/utils/material';

/* -------------------- BLOCK: 物料拖拽 => 画布行为交互 -------------------- */
const canvasStore = useCanvasStore();
const { setWaitToInsertIndex } = canvasStore;
const { templates, dragMaterial } = storeToRefs(canvasStore);
const THROTTLE_DELAY = 10;

/* 拖拽中，调整放置区域辅助块的位置 */
const onDragOver = useThrottleFn(
    (e: DragEvent) => {
        if (!dragMaterial.value) return;

        let { waitToInsertIndex } = dragMaterial.value;
        const target = e.target as HTMLElement | null;
        const type = target?.dataset.type;

        // const curTemplates = [...templates.value];

        // 当前拖拽到辅助块上
        if (type === CANVAS_TUPLE_TYPE.Help) return;

        // 是否已经有辅助块
        // const helpIndex = curTemplates.findIndex(item => item.type === CANVAS_TUPLE_TYPE.Help);
        const hasHelp = waitToInsertIndex !== -1;
        const helpTemplate = hasHelp
            ? templates.value[waitToInsertIndex]
            : { type: CANVAS_TUPLE_TYPE.Help, id: generateTplSeries() };

        // 当前拖拽到页面上
        if (type === CANVAS_TUPLE_TYPE.Page) {
            // 如果当前 help 也在最后，就不需要操作了
            if (hasHelp && waitToInsertIndex === templates.value.length - 1) return;
            // 本来有 help 先移除
            hasHelp && templates.value.splice(waitToInsertIndex, 1);
            // 插入到最后
            waitToInsertIndex = templates.value.push(helpTemplate) - 1;
            setWaitToInsertIndex(waitToInsertIndex);

            // templates.value = curTemplates;
            // setDragMaterialInsertIndex(insertIndex);
            return;
        }

        // 当前拖拽到组件上
        if (type === CANVAS_TUPLE_TYPE.Material) {
            const [y, h, curComponentIndex] = [
                e.offsetY,
                Number(target?.offsetHeight ?? 0),
                Number(target?.dataset.index ?? 0),
            ];
            // 鼠标位置是否在组件中线之上
            const isUpDirection = y < h / 2;

            // console.log(isUpDirection, hasHelp);

            if (!hasHelp) {
                waitToInsertIndex = isUpDirection ? curComponentIndex : curComponentIndex + 1;
            } else {
                // 不需要变动的场景：要移动到的位置刚好也是现在 help 的位置
                // 组件中线之上：0 1 2? [3] 4
                if (
                    isUpDirection &&
                    waitToInsertIndex < curComponentIndex &&
                    curComponentIndex - 1 === waitToInsertIndex
                )
                    return;

                // 组件中线之下：0 1 2 [3] 4?
                if (
                    !isUpDirection &&
                    waitToInsertIndex >= curComponentIndex &&
                    curComponentIndex + 1 === waitToInsertIndex
                )
                    return;

                // 移除当前 help
                templates.value.splice(waitToInsertIndex, 1);
                if (isUpDirection) {
                    if (waitToInsertIndex < curComponentIndex) {
                        // 场景 0 1? 2 [3] 4
                        waitToInsertIndex = curComponentIndex - 1;
                    } else {
                        // 场景 0 1 2 [3] 4?
                        waitToInsertIndex = curComponentIndex;
                    }
                } else {
                    if (waitToInsertIndex < curComponentIndex) {
                        // 场景 0 1 2? [3] 4
                        waitToInsertIndex = curComponentIndex;
                    } else {
                        // 场景 0 1 2 [3] 4 5?
                        waitToInsertIndex = curComponentIndex + 1;
                    }
                }
            }
            // 更新 help 位置
            setWaitToInsertIndex(waitToInsertIndex);
            templates.value.splice(waitToInsertIndex, 0, helpTemplate);
            // templates.value = curTemplates;
        }
    },
    THROTTLE_DELAY,
    false,
);

/* 放手时（在画布内才会有效触发）放置组件 */
const onDrop = () => {
    if (!dragMaterial.value) return;

    const { waitToInsertIndex, template } = dragMaterial.value;
    if (waitToInsertIndex === -1) return;

    // const curTemplates = [...templates.value];

    templates.value.splice(waitToInsertIndex, 1, template);
    setWaitToInsertIndex(-1);
    // templates.value = curTemplates;
};
</script>

<template>
    <div
        class="canvas cursor-auto"
        :data-type="CANVAS_TUPLE_TYPE.Page"
        @mousedown.stop
        @mousemove.stop
        @mouseup.stop
        @dragover.stop.prevent="onDragOver"
        @drop.stop.prevent="onDrop"
    >
        <template v-for="(item, index) in templates" :key="item.id">
            <div
                v-if="item.type === CANVAS_TUPLE_TYPE.Help"
                class="help"
                :data-type="CANVAS_TUPLE_TYPE.Help"
                :data-index="index"
            ></div>
            <Shape v-else :index="index" :template-id="item.id">
                <component :is="materialComponentName(item.type)" v-bind="item.config"></component>
            </Shape>
        </template>
    </div>
</template>

<style lang="scss" scoped>
@import './styles.scss';
</style>
