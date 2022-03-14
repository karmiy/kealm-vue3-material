import { App } from 'vue';
import { beautyComponentName } from '@/utils/beauty';
import Image from './index.vue';

export default {
    install: (app: App) => {
        app.component(beautyComponentName('image'), Image);
    },
};
