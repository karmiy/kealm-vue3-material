const materials = import.meta.globEager('../../materials/**/*.json');
const controllers = import.meta.globEager('../../materials/**/controller.ts');

const mapOfGroup = new Map<string, Array<EditorNS.Material>>();
const mapOfName = new Map<string, EditorNS.Material>();
const mapOfController = new Map<string, EditorNS.Controller>();

Object.keys(materials).forEach(path => {
    // ../../materials/basic/button/component.json
    const [group, name] = path.split('/').slice(-3);
    const item = { ...materials[path], name, group } as EditorNS.Material;

    const currentGroup = mapOfGroup.get(group);
    const nextGroup = currentGroup ? [...currentGroup, item] : [item];

    mapOfGroup.set(group, nextGroup);
    mapOfName.set(name, item);
});

Object.keys(controllers).forEach(path => {
    // ../../materials/basic/layout/controller.ts
    const [, name] = path.split('/').slice(-3);
    const item = { ...controllers[path] } as EditorNS.Controller;
    mapOfController.set(name, item);
});

export const materialGroups: Array<EditorNS.MaterialGroup> = [
    {
        label: '基础',
        key: 'basic',
        icon: 'basic',
    },
    {
        label: '数据',
        key: 'data',
        icon: 'data',
    },
    {
        label: '图表',
        key: 'chart',
        icon: 'chart',
    },
    {
        label: '反馈',
        key: 'feedback',
        icon: 'feedback',
    },
    {
        label: '其他',
        key: 'others',
        icon: 'others',
    },
];

/**
 * @description 获取物料库资源
 * @returns
 */
export function useMaterials() {
    /**
     * @description 根据名称获取物料详情
     */
    const getMaterialByName = (name: string) => mapOfName.get(name);

    /**
     * @description 根据组名获取物料集合
     */
    const getMaterialsByGroup = (group: string) => mapOfGroup.get(group);

    /**
     * @description 根据名称获取物料 controller
     */
    const getControllerByName = (name: string) => mapOfController.get(name);

    return {
        materialGroups,
        getMaterialByName,
        getMaterialsByGroup,
        getControllerByName,
    };
}
