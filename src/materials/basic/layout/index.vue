<script lang="tsx">
import { computed, createCommentVNode, defineComponent, useSlots, watch, watchEffect } from 'vue';
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

        return () => {
            return (
                <div class={materialClassName('layout')}>
                    <Row
                        gutter={props.gutter}
                        justify={props.justify}
                        align={props.align}
                        wrap={props.wrap}
                    >
                        {/* MARK: slots 内容响应式，必须放 return 这，独立到外部无效 */}
                        {slots
                            .default?.()
                            .filter(item => item.type !== commentVNode.type)?.[0]
                            ?.props?.templates.map((tpl: EditorNS.TemplateItem, index: number) => {
                                const listItem = props.list?.[index];

                                return (
                                    <Col key={index} {...listItem}>
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
