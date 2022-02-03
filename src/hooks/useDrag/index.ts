import { computed, ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { MaybeRef } from '@/utils/types';

interface Options {
    initialValue?: {
        x?: number;
        y?: number;
    };
}

export function useDrag(target: MaybeRef<HTMLElement | null>, options?: Options) {
    const { initialValue } = options ?? {};
    const x = ref(initialValue?.x ?? 0);
    const y = ref(initialValue?.y ?? 0);

    const mousedown = (e: MouseEvent) => {
        const currentX = x.value;
        const currentY = y.value;
        const startX = e.pageX;
        const startY = e.pageY;

        const cancelMove = useEventListener(document, 'mousemove', e => {
            const deltaX = e.pageX - startX;
            const deltaY = e.pageY - startY;
            x.value = currentX + deltaX;
            y.value = currentY + deltaY;
        });
        const cancelUp = useEventListener(document, 'mouseup', () => {
            cancelMove();
            cancelUp();
        });
    };

    useEventListener(target, 'mousedown', mousedown);

    return {
        x,
        y,
        style: computed(() => {
            return {
                transform: `translate(${x.value}px, ${y.value}px)`,
            };
        }),
    };
}
