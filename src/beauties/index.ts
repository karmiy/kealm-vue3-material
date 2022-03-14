import { App } from 'vue';
import ArrayMap from './array-map';
import Color from './color';
import Icon from './icon';
import Image from './image';
import Measure from './measure';
import Number from './number';
import Select from './select';
import String from './string';
import Switch from './switch';

const beauties = [Select, String, Icon, Color, Switch, Number, ArrayMap, Image, Measure];

export default {
    install: (app: App) => {
        beauties.forEach(item => item.install(app));
    },
};
