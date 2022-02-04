import { createMaterialRegister } from '@/utils/material';

export default {
    install: createMaterialRegister({ name: 'KmButton', loader: () => import('./index.vue') }),
};
