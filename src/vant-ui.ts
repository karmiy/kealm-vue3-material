import { App } from 'vue';
import { Button } from 'vant';

export const installComponents = [Button];
export const vantUI = {
    install(app: App) {
        installComponents.forEach((item: { name: string | undefined }) => {
            app.component(item.name || '', item);
        });
    },
};
