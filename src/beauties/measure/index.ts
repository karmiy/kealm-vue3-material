import { App } from 'vue';
import { beautyComponentName } from '@/utils/beauty';
import Measure from './index.vue';

export default {
    install: (app: App) => {
        app.component(beautyComponentName('measure'), Measure);
    },
};
