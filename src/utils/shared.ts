import { camelCase, isArray, kebabCase, upperFirst } from 'lodash-es';

export function sleep(delay = 1000) {
    return new Promise<void>(r => {
        setTimeout(() => {
            r();
        }, delay);
    });
}

/**
 * @description 构建标志性前缀类名
 * @param prefix
 * @param block
 * @returns
 */
export const createSignClassName = (prefix: string, block: string) =>
    kebabCase(`${prefix} ${block}`);

/**
 * @description 构建标志性前缀组件名
 * @param prefix
 * @param block
 * @returns
 */
export const createSignComponentName = (prefix: string, block: string) =>
    upperFirst(camelCase(`${prefix} ${block}`));

interface ChildrenWithParentId<T> extends Array<T> {
    parentId?: number;
}
/**
 * @description 深度遍历数组
 * @param arr
 * @param callback
 */
export const deepEach = <T extends { id: number; children?: ChildrenWithParentId<T> }>(
    arr: ChildrenWithParentId<T>,
    callback: (item: T, parentId: number, index: number) => void,
) => {
    const { parentId = 0 } = arr;

    arr.forEach((item, index) => {
        callback(item, parentId, index);

        const { children } = item;
        if (!children || !isArray(children)) return;

        children.parentId = item.id;
        deepEach(children, callback);
    });
};
