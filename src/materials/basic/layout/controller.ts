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
                type: CANVAS_TUPLE_TYPE.Socket,
                children: [],
            };
        }),
    };
}
