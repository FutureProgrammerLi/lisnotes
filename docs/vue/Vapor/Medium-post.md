# Vue3.6: Vapor Mode opening virtual DOM era
> [原文地址](https://medium.com/@sampan090611/vue-3-6-vapor-mode-opening-virtual-dom-era-dfd10023cd05)

Vue3.6的Vapor Mode可以让你直接跳过需您DOM,直接跟真实DOM进行互动.你只需要添加一个标记,就可以巨幅提升应用速度,打包出更小的代码包.  
以下就是具体的操作

## 虚拟DOM是什么
浏览器是通过变更DOM树来改变页面的内容的.早期的前端框架直接手动修改DOM树,问题是效率很低,而且还容易出错.虚拟DOM则缓解了这些问题,通过在内存中保留DOM的轻量化代表实现.当数据发生变化时,框架会做以下操作:
1. 渲染一棵新的虚拟DOM树
2. 与旧的VDOM树进行对比(diff)
3. 找出需要更新的DOM的最小部分
4. 将这些变化应用到真实DOM上

这样你旧可以不直接对DOM进行操作,将多个更新整合成单独一个了.不过还是会存在不足:创建新树和新旧树之间的对比依旧耗费大量CPU性能和内存占用.  
面对这种情况,Vue3特此在编译器上做了些优化工作(静态提升,标签添加),以尽量减少不必要的工作.不过可惜,这样做还是会在运行时构建虚拟节点,还是需要对比diff VDOM.  

## Vapor Mode是如何工作的
Vapor Mode跳过了运行时的VDOM.编译器将`<template>`标签中的内容直接转变为更新DOM的代码.它不会创建VNode对象并对它们进行对比,而是生成相应的函数,这些函数会:
* 创建DOM节点
* 精确追踪哪些节点依赖了哪些响应值
* 当且仅当值发生变化时对响应节点进行更新.

实际编程中你编写的代码其实跟Vue3一开始是没什么区别的:
```vue
<script setup vapor>
import {ref} from 'vue'
const count = ref(0)
</script>
```
```vue
<template>
   <button @click="count++">
        Count: {{count}}
   </button>
</template>
```
留意到`<script>`标签里的`vapor`,经编译后它会变成类似注释的代码:
```js
// create <button>, set text and click handler
// track `count` so only text node updates on change
```

单单这个标签的添加,就把虚拟DOM的构建和diff过程给去掉了.它利用的是Vue自身的响应性系统(Proxy+effect tracking),只运行需要的对应更新函数.也就是说浏览器需要编译的JS代码量减少了,内存也不需要占用太多的内存来保留节点信息,更新速度也有所提升了.

## 性能提升
经过多个权威测试,Vapor Mode简直赢麻了:
* 打包体积(以Hello World为例):
1. VDOM版本: 22.8kB
2. Vapor : 7.9kB

* 复杂列表diff耗时
1. VDOM版本: 基准时间(1x)
2. Vapor: 1.66*速度(大约比VDOM快了40%)

* 内存占用
1. VDOM版本: 100%(基准)
2. Vapor: 58%(直接少了42%)

一句话总结: 首次加载JS代码量少了三分二,运行时内存占用直接减半.

## 如何启用Vapor Mode
1. 启用
```vue
<script setup vapor>
// your code
</script>
```
1. Options API
不支持Vue2的用法了,限定在`<script setup>`标签里了.
2. 自定义指令
参数包括一个响应式的getter function,还可以返回一个清除函数:
```js
const MyDirective = (el,valueGetter) => {
    watchEffect(() => {
        el.textContent = valueGetter()
    });
    return () => console.log('clean when uninstalling')
}
```

1. 你可以直接用上面的形式重写已有的自定义指令
2. 与UI库互动  
使用`vaporInteropPlugin`插件,可以将Vapor模式跟Element Plus或Ant Design Vue混合到一起使用.基本的props,事件定义,插槽功能是可以实现的.其它复杂的用途则仍需进一步测试.
3. createVaporApp
新的项目可以直接实现无VDOM运行时
```bash
$ npm init vue@latest --template vapor
```

## 何时使用Vapor Mode?(3用3不用)
✅  性能要求高的模块(首页/落地页等)  
✅  新项目(直接用createVaporApp)  
✅  内部测试:文件问题,运行测试,帮助提升  

❌ 不要直接一次性迁移整个项目(部分功能仍在测试)  
❌ Nuxt SSR,`<Transition>`,`<KeepAlive>`等起作用时不要随便使用Vapor Mode.  
❌ 不要随意与深度嵌入VDOM的三方库混合使用

## 5个开发者最想知道的问题
1. 我需要重写旧代码吗?  
不需要.直接在`<script setup>`标签里加多个`vapor`就可以了.模板和setup工作的逻辑还是之前那样的.
2. 自定义指令呢?需不需要重写?  
建议重写.直接利用官方的codemod对旧指令进行转变.(?)
3. 用了Vapor Mode还能不能用Element Plus或Ant Design Vue?  
可以,使用`vaporInteropPlugin`插件.组件复杂的话建议自行谨慎测试.
4. Vapor Mode支持Typescript吗?  
完全支持.类型支持并无发生变化.Vue在`@vue/runtime-core`里还添加了`VaporComponent`类型帮助你编写启用了Vapor Mode的组件.开发者无需额外的配置项
5. Vapor Mode跟React的并行模式,或者Angular的Signals对比效果如何?  
启用了Vapor模式的Vue直接比肩Solid和Svelte.而且这种模式的代码迁移量小到几乎可以忽略--加个标签就行了.

## 总结
Vapor Mode的出现可以说是象征性的,它秉承了一贯的优秀:"难的东西交给编译器做".它将diff过程迁移到打包时,这样你就可以更专注于编写更快的应用了.Vue3.6稳定版本会在2025年底发布-- 试试在某些需要性能提升的页面上启用吧,你会感到惊喜的!
