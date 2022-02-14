import { App } from 'vue';
import { beautyComponentName } from '@/utils/beauty';
import Color from './index.vue';

export default {
    install: (app: App) => {
        app.component(beautyComponentName('color'), Color);
    },
};
