import { App, AsyncComponentLoader, defineAsyncComponent } from 'vue';
import { camelCase, capitalize, kebabCase } from 'lodash-es';

export const materialPrefix = 'km';

export const materialClassName = (block: string) => kebabCase(`${materialPrefix} ${block}`);
export const materialComponentName = (block: string) =>
    capitalize(camelCase(`${materialPrefix} ${block}`));

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
