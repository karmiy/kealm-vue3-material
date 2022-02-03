export const toString = Object.prototype.toString;

/**
 * @description 是否为 null
 * @param value: any
 * @returns {boolean}
 */
export const isNull = (value: any): value is string => {
    return toString.call(value) === '[object Null]';
};

/**
 * @description 是否为空值
 * @param value
 */
export const isEmpty = (value: any): value is undefined | null => {
    return typeof value === 'undefined' || isNull(value);
};
