import { App } from 'vue';
import Color from './color';
import Icon from './icon';
import Number from './number';
import Select from './select';
import String from './string';
import Switch from './switch';

const beauties = [Select, String, Icon, Color, Switch, Number];

export default {
    install: (app: App) => {
        beauties.forEach(item => item.install(app));
    },
};
