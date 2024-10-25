import { defineConfig } from "vite";
// import { defineConfig } from 'vitepress';
import { compression } from 'vite-plugin-compression2';
import { visualizer } from 'rollup-plugin-visualizer';
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
    plugins: [
        ViteImageOptimizer(),
        compression({
            filename: 'compressed.gz',
        }),
        visualizer({
            open: true,
            filename: 'bundle-visualizer.html'
        })
    ]
})

// export default defineConfig({
//     vite: {
//         plugins: [
//             ViteImageOptimizer(),
//             compression({
//                 filename: 'compressed.gz',
//             }),
//             visualizer({
//                 open: true,
//                 filename: 'bundle-visualizer.html'
//             })
//         ]
//     }
// })