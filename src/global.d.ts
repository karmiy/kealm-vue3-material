declare namespace EditorNS {
    type BasicValue = string | number | boolean | null;
    interface CustomValue {
        $type: 'Date';
        value: string | number;
    }

    type FlatValue = BasicValue & CustomValue;
    type SchemaValue = FlatValue | Array<FlatValue> | Record<string, FlatValue>;

    // 页面配置
    interface PageConfig {
        width?: number | string;
        height?: number | string;
    }

    // 模板项
    interface TemplateConfig {
        [key: string]: SchemaValue;
    }

    interface TemplateItem {
        id: number;
        type: string;
        config?: TemplateConfig;
        children?: Array<TemplateItem>;
    }

    // 画板配置
    type CanvasConfig = Array<TemplateItem>;

    // JSON 配置
    interface SchemaConfig {
        pageConfig: PageConfig;
        canvasConfig: CanvasConfig;
    }

    // beauty
    interface Beauty {
        type: string;
        config?: Record<string, SchemaValue>;
    }

    // 物料
    interface Material {
        label: string;
        icon: string;
        name: string; // json 文件不需要标明，自动根据 src/materials/[group]/[name]/index.vue 解析
        group: string; // json 文件不需要标明，自动根据 src/materials/[group]/[name]/index.vue 解析
        defaultConfig?: TemplateConfig;
        fields?: Array<{
            title: string;
            children: Array<{
                prop: string;
                label: string;
                beauty: Beauty;
            }>;
        }>;
    }

    interface MaterialGroup {
        label: string;
        key: string; // key 对应 @/materials 分组的文件夹名
        icon: string;
    }

    // controller
    interface Controller {
        getInitialTemplate?: () => TemplateItem;
    }
}

type Timer = ReturnType<typeof setTimeout>;
