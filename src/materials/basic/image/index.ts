import { createMaterialRegister, materialComponentName } from '@/utils/material';

export default {
    install: createMaterialRegister({
        name: materialComponentName('image'),
        loader: () => import('./index.vue'),
    }),
};
