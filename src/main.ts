import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Beauties from '@/beauties';
import Directives from '@/directives';
import Materials from '@/materials';
import App from './App.vue';
import router from './router';
import './assets/styles/index.scss';

createApp(App)
    .use(router)
    .use(createPinia())
    .use(Materials)
    .use(Beauties)
    .use(Directives)
    .mount('#app');
