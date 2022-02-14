import { createMaterialRegister, materialComponentName } from '@/utils/material';

export default {
    install: createMaterialRegister({
        name: materialComponentName('layout'),
        loader: () => import('./index.vue'),
    }),
};
