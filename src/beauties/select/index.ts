import { App } from 'vue';
import { beautyComponentName } from '@/utils/beauty';
import Select from './index.vue';

export default {
    install: (app: App) => {
        app.component(beautyComponentName('select'), Select);
    },
};
