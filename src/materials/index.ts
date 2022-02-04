import { App } from 'vue';
import Basic from './basic';

const materials = [Basic];

export default {
    install: (app: App) => {
        materials.forEach(item => item.install(app));
    },
};
