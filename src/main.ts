import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// import { elementIcons } from './element-icons';
import { vantUI } from './vant-ui';
// import 'tailwindcss/tailwind.css';
import './assets/styles/index.scss';

createApp(App).use(router).use(vantUI).mount('#app');
