# Vue3 Low Code

## 快速上手

```shell
# 项目启动
npm run dev
```

## 设计

### 约定式设计

以 `JSON Schema` 描述页面组件编排

组件定制化，统称**物料**，页面 UI 完全由物料组合构成

物料、JSON、页面形成一个**闭环**：

```shell
# 页面生成 JSON
物料 => 嵌入组成并组成页面 => UI 视图 => 产出映射 JSON
# JSON 生成页面
JSON 信息 => 组件解析 JSON => UI 视图 
```

### 输出 JSON 结构

JSON 划分为：

- 页面配置 pageConfig
- 画布配置 canvas

```json
{
    "pageConfig": {},
    "canvas": [
        {
            "id": 1,
            "type": "Button",
            "config": {
                "type": "primary"
            },
            "children": "按钮"
        }
    ]
}
```

### 物料描述

物料组件放置在 `src/materials` 下，如 `Button` 按钮在 `src/materials/basic/button`，其中 `basic` 作为物料的 **group**（这也是为什么，物料 JSON 中没有分组字段）

每个物料中包含 `component.json` 文件用于描述物料的具体信息

```ts
- materials
	- basic
        - button
            - component.json // 物料的 JSON 配置
```

```json
{
    "label": "按钮",
    "icon": "btn",
    // ...
}
```

### 物料属性

物料的属性，我们将其成为**Beauty**

在组件 `component.json` 的 fields 属性字段中与组件 `prop` 挂钩

```json
{
    "label": "按钮",
    "icon": "save",
    "fields": [
        {
            "title": "基础配置", // 分组标题
            "children": [
                {
                    "prop": "type",
                    "label": "按钮类型",
                    "beauty": {
                        "type": "select", // 使用 <select> 组件来表示
                        "config": { // <select> 组件配置
                            "options": [
                                { "label": "Default", "value": "default" },
                                { "label": "Primary", "value": "primary" },
                                { "label": "Success", "value": "success" },
                                { "label": "Warning", "value": "warning" },
                                { "label": "Danger", "value": "danger" }
                            ]
                        }
                    }
                },
                {
                    "prop": "size",
                    "label": "按钮大小",
                    "beauty": {
                        "type": "select",
                        "config": {
                            "options": [
                                { "label": "Large", "value": "large" },
                                { "label": "Normal", "value": "normal" },
                                { "label": "Small", "value": "small" },
                                { "label": "Mini", "value": "mini" }
                            ]
                        }
                    }
                }
            ]
        }
    ]
}
```

Beauty 组件 type：

- string：文本组件
- number：数字组件
- upload：上传组件
- select：单选组件
- switch：开关组件
- color：颜色组件
- time：时间组件

### 物料控制权

通常 `物料描述 JSON` 与 `物料属性` 已经可以很好的表达物料的双向关系

但需要复杂的物料往往不是这么简单，如：

- Layout 布局物料，列表属性配置在 `list` 字段，但 `list` 更新后却需要驱动 `children` 数量的更新

这种**一对多**的联动关系是无法利用简单的数据绑定实现的，为了适应更多场景，物料允许存在一个 `controller.ts` 文件用于初始化物料模板、处理 Beauty 响应等

```typescript
- button
	- index.vue
	- styles.scss
	- component.json
	- controller.ts // 物料控制
```

controller 允许 export 抛出一些约定的函数，用于处理不同时机的交互行为：

- getInitialTemplate：表示如何获取初始化模板数组
- arrayMapReducer：表示如何处理 `Beauty.ArrayMap` 在 `add`、`remove` 等行为时的数据

```ts
// controller.ts
export function getInitialTemplate() {
    const { list } = componentJSON.defaultConfig;
    
    return {
        id: generateTplSeries(),
        type: 'layout',
        config: cloneDeep(componentJSON.defaultConfig),
        children: list.map(() => {
            return {
                id: generateTplSeries(),
                type: CANVAS_TUPLE_TYPE.Container,
                children: [],
            };
        }),
    };
}
```

### 画布模板数据交互

物料的数据存储在全局 Hook `useCanvasStore` 中的 `templates` 字段

我们约定有 2 种方式可以操作这个数据源：

- 当操作的行为需要被记录时（记录的数据需要用于撤销等行为），应直接操作 templates 原数组

  ```ts
  const canvasStore = useCanvasStore();
  const { templates } = storeToRefs(canvasStore);
  
  // 直接操作原数组
  templates.value[0] = {};
  ```

- 当操作的行为不需要被记录时（移除 help 等行为），应赋值 templates 数组

  ```ts
  const canvasStore = useCanvasStore();
  const { templates } = storeToRefs(canvasStore);
  
  // 赋值新数组
  templates.value = [];
  ```

这个约定是为了**区分交互行为，记录有效操作**

## 实现

### 物料库

物料基于 `Vant` 封装

由于 `JSON Schema` 难以表达一些 props 类型，物料不继承 `Vant` 组件全部 props，而是提取或转变为需要的自定义配置

在物料以**异步组件**实现，为了：

- 物料组件可以达到包的按需引入

`Vant` 组件不在 main.ts 以 use 的方式注册 Vant 组件，考虑到：

- 物料异步组件的方式，那引用到的 Vant 组件也可以达到异步加载的效果，而非一开始加载全部组件

### 物料 Props

物料组件的实现，**不推荐直接使用 Vant 组件的 Props**，如：

```ts
// ⭕
import { ButtonProps } from 'vant';
const props = defineProps<ButtonProps>();

// ✅
const props = defineProps<{ disabled?: boolean; ... }>();
```

考虑到：

- Vant 组件的 Props 有使用到联合类型，defineProps 不支持
- 按需设计配置，可控性强，在 Vant 组件版本更新变动后易调整

### 物料 DefaultProps

物料组件的默认配置，有 2 种方案：

- 集成在 defineProps 中

  ```ts
  // materials/baisc/button/index.vue
  const props = defineProps({
      width: {
          type: Number,
          default: 60,
      },
  });
  ```

  - 优势：拖拽插入物料组件时，不需要关心默认 props，因为在组件中以定义
  - 劣势：物料属性需要接收默认配置，从这个对象上提取并不太方便

- 独立出来，如放在一个 `.ts` 文件或集成到 `component.json` 皆可

  - 优势：统一管理，易提取，传入物料组件或物料属性都容易
  - 劣势：拖拽插入物料组件需手动传入，且有些类型可能需要进行一次转换

这里使用方案 2，且集成在 `component.json` 中，考虑到类型维护和转换与 `Canvas` 保持一致

### 模板 id

代码中需要通过模板 id 找到对应的模板项，所以模板 id 唯一是至关重要的，需要考虑：

- 当前环境下生成的模板 id 唯一
- 当前环境生成的模板 id 不与原有 JSON 内的模板 id 冲突

这里考虑模板 id实现以：`new Date().getTime() + '_' + sequence.next()`，其中 sequence 为一个累加器，这是因为：

- 时间戳可以防止原有 JSON 不与当前环境有重合
- 同步代码创建模板 id 时时间戳会相同，所以还需要补充一个递增值

## FAQ

### stylelint 无效

若 VSCode 插件是 v1.2.1，需在 setting.json 配 `"stylelint.validate": ["css", "scss"]`
