import { App } from 'vue';
import { beautyComponentName } from '@/utils/beauty';
import Switch from './index.vue';

export default {
    install: (app: App) => {
        app.component(beautyComponentName('switch'), Switch);
    },
};
