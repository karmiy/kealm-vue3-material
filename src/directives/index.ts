import { App } from 'vue';
import Hover from './hover';

const directives = [Hover];

export default {
    install: (app: App) => {
        directives.forEach(item => item.install(app));
    },
};
