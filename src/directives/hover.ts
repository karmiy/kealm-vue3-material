import { App } from 'vue';

interface MouseListener {
    (e: MouseEvent): any;
}
const mouseEnterMap = new Map<HTMLElement, MouseListener>();
const mouseLeaveMap = new Map<HTMLElement, MouseListener>();

export default {
    install: (app: App) => {
        app.directive('hover', {
            beforeMount(el: HTMLElement, binding) {
                const { value, modifiers } = binding;
                const { stop } = modifiers;

                const onMouseEnter = (e: MouseEvent) => {
                    if (stop) e.stopPropagation();

                    el.classList.add(value);
                };

                const onMouseLeave = (e: MouseEvent) => {
                    if (stop) e.stopPropagation();

                    el.classList.remove(value);
                };
                el.addEventListener('mouseenter', onMouseEnter);
                el.addEventListener('mouseleave', onMouseLeave);
                mouseEnterMap.set(el, onMouseEnter);
                mouseLeaveMap.set(el, onMouseLeave);
            },
            beforeUnmount(el: HTMLElement) {
                const onMouseEnter = mouseEnterMap.get(el);
                const onMouseLeave = mouseLeaveMap.get(el);

                onMouseEnter && el.removeEventListener('mouseenter', onMouseEnter);
                onMouseLeave && el.removeEventListener('mouseleave', onMouseLeave);
                mouseEnterMap.delete(el);
                mouseLeaveMap.delete(el);
            },
        });
    },
};
