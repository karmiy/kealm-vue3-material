import { createMaterialRegister, materialComponentName } from '@/utils/material';

export default {
    install: createMaterialRegister({
        name: materialComponentName('button'),
        loader: () => import('./index.vue'),
    }),
};
