import { cloneDeep } from 'lodash-es';
import { generateTplSeries } from '@/utils/canvas';
import { CANVAS_TUPLE_TYPE } from '@/utils/constants';
import componentJSON from './component.json';

export function getInitialTemplate() {
    const { list } = componentJSON.defaultConfig;
    return {
        id: generateTplSeries(),
        type: 'layout',
        config: cloneDeep(componentJSON.defaultConfig),
        children: list.map(() => {
            return {
                id: generateTplSeries(),
                type: CANVAS_TUPLE_TYPE.Container,
                children: [],
            };
        }),
    };
}

// selectedTemplate 对应操作模板
// propName 对应配置项是谁
// current 当前数组值
export function arrayMapReducer(info: EditorNS.ArrayMapPayInfo<any>) {
    const { selectedTemplate, propName, currentValue, action } = info;
    // console.log('arrayMapReducer', info);

    if (propName === 'list') {
        switch (action.type) {
            case 'add': {
                // 新增 slot
                selectedTemplate.children = selectedTemplate.children ?? [];
                selectedTemplate.children.push({
                    id: generateTplSeries(),
                    type: CANVAS_TUPLE_TYPE.Container,
                    children: [],
                });

                return [...currentValue, cloneDeep(componentJSON.defaultConfig.list[0])];
            }
            case 'remove': {
                // 移除 slot
                const {
                    payload: { removeIndex },
                } = action;

                selectedTemplate.children?.splice(removeIndex, 1);

                const nextValue = [...currentValue];
                nextValue.splice(removeIndex, 1);
                return nextValue;
            }
        }
    }
}
