import { generateTplSeries } from './canvas';

export enum CANVAS_TUPLE_TYPE {
    Container = 'container',
    Material = 'material',
    Help = 'help',
}

export const ROOT_CONTAINER = {
    id: generateTplSeries(),
    pId: '-1',
    index: -1,
};
