import vue, { Options } from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
const { resolve } = require('path');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            refTransform: true, // 开启ref转换
        } as Options),
        vueJsx({
            // options are passed on to @vue/babel-plugin-jsx
        }),
        vueSetupExtend(), // 在 <script /> 上可加 name
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    server: {
        host: '0.0.0.0',
    },
});
