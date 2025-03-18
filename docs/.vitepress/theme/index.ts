import DefaultTheme from 'vitepress/theme'
import './custom.css'

import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick, defineAsyncComponent } from 'vue';
import { useRoute } from 'vitepress';

import vitepressBackToTop from 'vitepress-plugin-back-to-top';
import 'vitepress-plugin-back-to-top/dist/style.css';



export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('ImageWithCaption', defineAsyncComponent(() => import('@/JS/Patterns/components/ImageWithCaption.vue' as string)));
        app.component('Divider', defineAsyncComponent(() => import('@/JS/Patterns/components/Divider.vue' as string) ));
        vitepressBackToTop({
            threshold: 300,
        })
    },
    setup() {
        const route = useRoute();
        const initZoom = () => {
            // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认  
            mediumZoom(".main img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能 
        };
        onMounted(() => {
            initZoom();
        });
        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        );

        // production 下 收集 web-vitals
        // if (import.meta.env.PROD) {}
        if (process.env.NODE_ENV === 'production') {
            onMounted(() => import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
                onCLS(console.log)
                onFCP(console.log)
                onLCP(console.log)
                onTTFB(console.log)
            }))
        }
    },
}