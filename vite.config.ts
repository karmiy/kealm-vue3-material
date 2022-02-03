import vue, { Options } from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import styleImport, { VantResolve } from 'vite-plugin-style-import';
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
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        styleImport({
            resolves: [VantResolve()],
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
        host: '0.0.0.0',
    },
});
