// 人麻了,四个插件三个不能用,全挤在config里都变臃肿了

// import { defineConfig } from "vitepress"

// 把尝试过的方法都提取到这了.实际还只是用了一种

// 1. 打包失败
// import MarkJS from './lib/mark.js'
// fix: 
// 1. globally install mark.js 
// 2. locate the reported file in node_modules/mark.js/src/vanilla.js
// 3. install mark.js globally. 'npm install mark.js -g'
// 4. modify from './lib/mark.js' to 'mark.js'  
//   => another issue: fail to build on netlify, netlify will independently install deps of the project, resulting in the same issue in 'node_modules/mark.js/src/vanilla.js' on the server.
// 5. use patch-package and postinstall-postinstall to change file on netlify server.
// 5.1 'npm install patch-package postinstall-postinstall --save-dev'
// 5.2 change 'node_modules/mark.js/src/vanilla.js' locally. (generate a package-lock.json before the next step, by running 'npm install' or 'npm install --package-lock-only'. 'cnpm install' will not generate package-lock.json)
// 5.3 run 'npx patch-package mark.js' to generate patch file for mark.js.
// 5.4 add a script in package.json: "scripts":'postinstall":"patch-package"'
// 5.5 After doing 5.3,a file 'patches/mark.js+8.11.1.patch' will be generated.Upload it to github.And the problem will be solved.

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


