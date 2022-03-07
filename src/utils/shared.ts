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

interface ChildrenWithParentId<T, K> extends Array<T> {
    parentId?: K;
}

interface DeepEachCallback<T, K> {
    (item: T, index: number, parentId?: K): void;
}

/**
 * @description 深度遍历数组
 * @param arr
 * @param callback
 */
function deepEach<T extends { id: number; children?: ChildrenWithParentId<T, number> }>(
    arr: ChildrenWithParentId<T, number>,
    callback: DeepEachCallback<T, number>,
): void;
function deepEach<T extends { id: string; children?: ChildrenWithParentId<T, string> }>(
    arr: ChildrenWithParentId<T, string>,
    callback: DeepEachCallback<T, string>,
): void;
function deepEach<
    T extends { id: number | string; children?: ChildrenWithParentId<T, number | string> },
>(
    arr: ChildrenWithParentId<T, number | string>,
    callback: DeepEachCallback<T, number> | DeepEachCallback<T, string>,
): void {
    const { parentId } = arr;

    arr.forEach((item, index) => {
        (callback as any)(item, index, parentId);

        const { children } = item;
        if (!children || !isArray(children)) return;

        children.parentId = item.id;
        (deepEach as any)(children, callback);
    });
}

export { deepEach };
