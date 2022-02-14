import { createSignClassName, createSignComponentName } from './shared';

export const beautyPrefix = 'bt';

export const beautyClassName = (block: string) => createSignClassName(beautyPrefix, block);
export const beautyComponentName = (block: string) => createSignComponentName(beautyPrefix, block);
