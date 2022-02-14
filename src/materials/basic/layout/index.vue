<script lang="tsx">
import { defineComponent, useSlots } from 'vue';
import { Col, Row, RowAlign, RowJustify } from 'vant';
import { Placeholder } from '@/components';
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

        const slots = useSlots();
        const defaultSlots = slots.default?.();

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
                            return (
                                <Col key={index} {...item}>
                                    {defaultSlots?.[index] ?? <Placeholder />}
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
