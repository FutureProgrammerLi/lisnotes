# 实践Vapor Mode

翻译了几篇相关文章,感觉可以上手了.  
实践是检验真理的唯一标准,一些文章的内容其实也不一定对.  
所以不如自己总结一下,自己可行的,启用Vapor Mode的方法

## 总结
1. 使用Vue^3.6.0-alpha.2 版本(25/8/17),latest都不行,latest是3.5.18
2. `createVaporApp` 全局使用Vapor Mode(组件内还是依赖`<script setup vapor>`)
3. **`<script setup vapor>` 局部使用Vapor Mode**
4. 混合使用Vapor Component和VDOM traditional components(`vaporInteropPlugin`)
5. 校验是否启用成功Vapor Mode (`_renderEffect`, `_setText`, `_template...`)


6. 局部启用VaporMode不可行的方法  
    6.1 `<template v-vapor>`  
    6.2 `defineOptions({vapor:true})`  
    6.3 组件命名"Comp.vapor.vue"  

7. 全局使用Vapor Mode不可行的方法  
7.1 Vite的`experimental:{vapor:true}`用不了.哪怕用的是7.1.2版本.@vitejs/plugin-vue@latest也不行.

## 1.依赖安装
```bash
# mkdir vapor-test
# cd vapor-test
# npm init -y
$ npm install vue@3.6.0-alpha.2 vite@latest @vitejs/plugin-vue@latest
```

## 2/3/4.createApp和createVaporApp
1. `createVaporApp`的话,必须所有组件都已启用`<script setup vapor>`,否则会报错.
```txt
[Vue warn]: Unhandled error during execution of render function 
  at <App >
Uncaught TypeError: Cannot read properties of undefined (reading 'insert')
    at insert (vue.js?v=ff5e4179:13087:15)
    at insert (vue.js?v=ff5e4179:13090:7)
    at mountComponent (vue.js?v=ff5e4179:14323:3)
    at createComponent (vue.js?v=ff5e4179:14206:5)
    at _sfc_render
```
2. `createApp`,如果组件中包含vapor component,则需要结合`vaporInteropPlugin`使用,否则也会报错.
```txt
[Vue warn]: Vapor component found in vdom tree but vapor-in-vdom interop was not installed. Make sure to install it:
```
import { vaporInteropPlugin } from 'vue'
app.use(vaporInteropPlugin)
``` 
  at <App>
```

**2**是比较常见的混用报错,解决方法也给出来了,引入插件,全局使用这个`vaporInteropPlugin`就可以了.

## 5.校验是否成功启用Vapor Mode
看编译后的代码就知道了.  
1. [去这个网站](https://vapor-repl.netlify.app/),在`script setup`里加上`vapor`, `function render`的内容都变完了,说明启用成功了
2. 按F12,Sources标签->src->App.vue[一些Vapor Mode下特有的API](./oboard-post.md#vapor-mode所利用的api),看到它们就代表启用成功了.  
主要看`_sfc_render`这个函数,里面是`const t0 = _template(/***/)`,``_renderEffect(() => _setText(n0, msg.value))`等等的字眼就是成功.  
`_createElementBlock`,`_toDisplayString`等字眼就是没启用成功,还用的VDOM方法.  

