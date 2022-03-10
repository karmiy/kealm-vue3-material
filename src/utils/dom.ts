/**
 * @description 根据条件查询父级 DOM 元素
 * @param dom
 * @param callback
 * @param self
 * @returns
 */
export const getParentNodeByCondition = function (
    dom: HTMLElement,
    callback: (el: HTMLElement) => boolean,
    self = true,
): HTMLElement | null {
    if (self && callback(dom)) return dom;
    const parentNode = dom.parentNode as HTMLElement | null;

    if (!parentNode || parentNode === document.documentElement) return null;

    return callback(parentNode)
        ? parentNode
        : getParentNodeByCondition(parentNode, callback, false);
};

/**
 * @description 通过 class 查询父级 DOM 元素
 * @param dom 被查找 DOM元素
 * @param className 父元素类名
 * @param self 查找时是否包含元素本身
 */
export const getParentNodeByClass = function (
    dom: HTMLElement,
    className: string,
    self = true,
): HTMLElement | null {
    return getParentNodeByCondition(dom, el => el.classList.contains(className), self);
};
