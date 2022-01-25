# Vue3 Low Code

## 约定式实现

### 物料面板描述

```json
{
    "name": "图片", // left：名称
    "icon": "icon-image", // left：图标
    "fields": { // right：属性字段
 		"imagePath": {
            "label": "图片上传", // right：属性名
            "type": "upload", // right：value 用 <upload> 组件来表示
            "value": "" // right：默认值
        },
        "radius": {
            "label": "图片圆角",
            "type": "number",
            "value": 0
        }
    }
}
```

```json
{
    "Text": {
        "editData": [
            {
                "key": "text",
                "name": "文字",
                "type": "Text"
            },
            {
                "key": "color",
                "name": "标题颜色",
                "type": "Color"
            },
            {
                "key": "fontSize",
                "name": "字体大小",
                "type": "Number"
            },
            {
                "key": "align",
                "name": "对齐方式",
                "type": "Select",
                "range": [
                    {
                        "key": "left",
                        "text": "左对齐"
                    },
                    {
                        "key": "center",
                        "text": "居中对齐"
                    },
                    {
                        "key": "right",
                        "text": "右对齐"
                    }
                ]
            },
            {
                "key": "lineHeight",
                "name": "行高",
                "type": "Number"
            }
        ],
        "config": {
            "text": "我是文本",
            "color": "rgba(60,60,60,1)",
            "fontSize": 18,
            "align": "center",
            "lineHeight": 2
        }
    }
}
```



### 属性 type

- string：文本组件
- number：数字组件
- upload：上传组件
- select：单选组件
- switch：开关组件
- color：颜色组件
- time：时间组件