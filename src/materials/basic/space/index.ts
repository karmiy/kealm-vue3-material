import { createMaterialRegister, materialComponentName } from '@/utils/material';

export default {
    install: createMaterialRegister({
        name: materialComponentName('space'),
        loader: () => import('./index.vue'),
    }),
};
