import { App } from 'vue';
import { beautyComponentName } from '@/utils/beauty';
import ArrayMap from './index.vue';

export default {
    install: (app: App) => {
        app.component(beautyComponentName('arrayMap'), ArrayMap);
    },
};
