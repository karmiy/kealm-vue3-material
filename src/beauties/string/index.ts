import { App } from 'vue';
import { beautyComponentName } from '@/utils/beauty';
import String from './index.vue';

export default {
    install: (app: App) => {
        app.component(beautyComponentName('string'), String);
    },
};
