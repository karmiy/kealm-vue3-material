import { App } from 'vue';
import { beautyComponentName } from '@/utils/beauty';
import Number from './index.vue';

export default {
    install: (app: App) => {
        app.component(beautyComponentName('number'), Number);
    },
};
