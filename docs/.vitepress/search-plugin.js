// 人麻了,四个插件三个不能用,全挤在config里都变臃肿了

// import { defineConfig } from "vitepress"

// 把尝试过的方法都提取到这了.实际还只是用了一种

// 1. 打包失败
// import MarkJS from './lib/mark.js'

// defineConfig({
//     themeConfig: {
//         search: {
//             provider: 'local', // local
//         },
//     }
// })

// 2.  加载失败
// import {OramaPlugin} from '@orama/plugin-vitepress';
// import { SearchPlugin } from "vitepress-plugin-search";
// import { pagefindPlugin } from 'vitepress-plugin-pagefind'

// defineConfig({
//     plugins: [OramaPlugin(),SearchPlugin(),pagefindPlugin()],
// })


