declare namespace EditorNS {
    type BasicValue = string | number | boolean | null;
    interface CustomValue {
        $type: 'Date';
        value: string | number;
    }

    type FlatValue = BasicValue & CustomValue;
    type SchemaValue = FlatValue | Array<FlatValue> | Record<string, FlatValue>;

    /* 页面配置 */
    interface PageConfig {
        width?: number | string;
        height?: number | string;
    }

    /* 模板项 */
    interface TemplateConfig {
        [key: string]: SchemaValue;
    }

    interface TemplateItem {
        id: string;
        type: string;
        config?: TemplateConfig;
        children?: Array<TemplateItem>;
    }

    /* 画板配置 */
    type CanvasConfig = Array<TemplateItem>;

    /* JSON 配置 */
    interface SchemaConfig {
        pageConfig: PageConfig;
        canvasConfig: CanvasConfig;
    }

    /* 属性配置器 */
    interface Beauty {
        type: string;
        tip?: string;
        config?: Record<string, SchemaValue>;
    }

    interface FieldItem {
        prop: string;
        label: string;
        beauty: Beauty;
    }

    /* 物料 */
    interface Material {
        label: string;
        icon: string;
        name: string; // json 文件不需要标明，自动根据 src/materials/[group]/[name]/index.vue 解析
        group: string; // json 文件不需要标明，自动根据 src/materials/[group]/[name]/index.vue 解析
        defaultConfig?: TemplateConfig;
        fields?: Array<{
            title: string;
            children: Array<FieldItem>;
        }>;
    }

    interface MaterialGroup {
        label: string;
        key: string; // key 对应 @/materials 分组的文件夹名
        icon: string;
    }

    /* 物料 controller */
    // arrayMap
    interface ArrayMapActionAdd {
        type: 'add';
    }

    interface ArrayMapActionRemove {
        type: 'remove';
        payload: {
            removeIndex: number;
        };
    }
    type ArrayMapAction = ArrayMapActionAdd | ArrayMapActionRemove;

    interface ArrayMapPayInfo<T> {
        selectedTemplate: TemplateItem;
        propName: string;
        currentValue: Array<T>;
        action: ArrayMapAction;
    }
    interface Controller {
        getInitialTemplate?: () => TemplateItem;
        arrayMapReducer?: <T>(info: ArrayMapPayInfo<T>) => Array<T>;
    }
}

type Timer = ReturnType<typeof setTimeout>;
