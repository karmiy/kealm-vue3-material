import { App } from 'vue';
import Button from './button';
import Image from './image';
import Layout from './layout';
import Space from './space';

const materials = [Button, Layout, Space, Image];

export default {
    install: (app: App) => {
        materials.forEach(item => item.install(app));
    },
};
