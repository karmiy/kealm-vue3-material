import { createApp } from 'vue';
import Materials from '@/materials';
import App from './App.vue';
import router from './router';
import './assets/styles/index.scss';

createApp(App).use(router).use(Materials).mount('#app');
