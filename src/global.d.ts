declare namespace EditorNS {
    type JSONValidValue = string | number | boolean | null;

    // 页面配置
    interface PageConfig {
        width?: number | string;
        height?: number | string;
    }

    // 模板项
    type PropsValue =
        | JSONValidValue
        | { $type: 'Date'; value: string | number }
        | Array<PropsValue>;

    interface TemplateItem {
        id: number;
        type: string;
        props?: {
            [key: string]: PropsValue;
        };
        children?: JSONValidValue | Array<TemplateItem>;
    }

    // 画板配置
    type Canvas = Array<TemplateItem>;

    // JSON 配置
    interface SchemaConfig {
        pageConfig: PageConfig;
        canvas: Canvas;
    }

    // 物料
    interface Material {
        label: string;
        icon: string;
    }

    interface MaterialGroup {
        label: string;
        key: string; // key 对应 @/materials 分组的文件夹名
        icon: string;
    }
}
