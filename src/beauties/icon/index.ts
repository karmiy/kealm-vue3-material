import { App } from 'vue';
import { beautyComponentName } from '@/utils/beauty';
import Icon from './index.vue';

export default {
    install: (app: App) => {
        app.component(beautyComponentName('icon'), Icon);
    },
};
