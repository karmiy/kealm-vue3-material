import { App } from 'vue';
import {
    Bicycle,
    Box,
    DArrowLeft,
    DArrowRight,
    PieChart,
    Reading,
    Sell,
} from '@element-plus/icons-vue';

export const installComponents = [Bicycle, Box, DArrowLeft, DArrowRight, PieChart, Reading, Sell];
export const elementIcons = {
    install(app: App) {
        installComponents.forEach((item: { name: string | undefined }) => {
            app.component(item.name || '', item);
        });
    },
};
