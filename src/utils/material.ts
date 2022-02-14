import { App, AsyncComponentLoader, defineAsyncComponent } from 'vue';
import { createSignClassName, createSignComponentName } from './shared';

export const materialPrefix = 'mat';

export const materialClassName = (block: string) => createSignClassName(materialPrefix, block);
export const materialComponentName = (block: string) =>
    createSignComponentName(materialPrefix, block);

export const createMaterialRegister = (options: { name: string; loader: AsyncComponentLoader }) => {
    const { name, loader } = options;

    return (app: App) => {
        app.component(
            name,
            defineAsyncComponent({
                loader,
                // ... common config
            }),
        );
    };
};
