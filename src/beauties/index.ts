import { App } from 'vue';
import ArrayMap from './array-map';
import Color from './color';
import Icon from './icon';
import Number from './number';
import Select from './select';
import String from './string';
import Switch from './switch';

const beauties = [Select, String, Icon, Color, Switch, Number, ArrayMap];

export default {
    install: (app: App) => {
        beauties.forEach(item => item.install(app));
    },
};
