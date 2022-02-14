import { App } from 'vue';
import Button from './button';
import Layout from './layout';

const materials = [Button, Layout];

export default {
    install: (app: App) => {
        materials.forEach(item => item.install(app));
    },
};
