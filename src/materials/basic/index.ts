import { App } from 'vue';
import Button from './button';

const materials = [Button];

export default {
    install: (app: App) => {
        materials.forEach(item => item.install(app));
    },
};
