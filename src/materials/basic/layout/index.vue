<script lang="tsx">
import { computed, createCommentVNode, defineComponent, useSlots } from 'vue';
import { Col, Row, RowAlign, RowJustify } from 'vant';
import { TemplateParser } from '@/components';
import { materialClassName } from '@/utils/material';

interface Props {
    gutter?: number | string;
    justify?: RowJustify;
    align?: RowAlign;
    wrap?: boolean;
    list?: Array<{
        span?: number | string;
        offset?: number | string;
    }>;
}

export default defineComponent({
    props: {
        gutter: [Number, String],
        justify: String,
        align: String,
        wrap: {
            type: Boolean,
            default: true,
        },
        list: Array,
    },
    setup(_props) {
        const props = _props as Props;

        const commentVNode = createCommentVNode();
        const slots = useSlots();
        // 过滤掉注释节点
        // const defaultSlots = slots.default?.().filter(item => item.type !== commentVNode.type);
        // console.log(defaultSlots?.[0].props?.templates, props, props.wrap);
        /* defaultSlots?.forEach(item =>
            console.log(item, item.type === createCommentVNode().type, item.el),
        ); */
        const templates = computed(() => {
            const defaultSlots = slots.default?.().filter(item => item.type !== commentVNode.type);
            const templateParser = defaultSlots?.[0];
            return templateParser?.props?.templates as Array<EditorNS.TemplateItem>;
        });

        return () => {
            return (
                <div class={materialClassName('layout')}>
                    <Row
                        gutter={props.gutter}
                        justify={props.justify}
                        align={props.align}
                        wrap={props.wrap}
                    >
                        {props.list?.map((item, index) => {
                            const tpl = templates.value?.[index];
                            return (
                                <Col key={index} {...item}>
                                    <TemplateParser templates={[tpl]} />
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            );
        };
    },
});
</script>
<style lang="scss" scoped>
@import './styles.scss';
</style>
