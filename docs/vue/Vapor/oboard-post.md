# 深度分析Vue Vapor Mode:开启无VDOM的高效JS编译策略
> [原文地址](https://oboard.xlog.app/vue-vapor?locale=en)

## AI生成概述
Vapor Mode时Vue的一种新的编译策略,它不需要VDOM,而是直接将代码编译成高效的Javascript结果,通过减少内存使用,降低运行时压力,减少打包体积的方式来提升应用的性能表现.我们可以通过在线的Vue Vapor SFC playground和Vue Volar Template Explorer直接体验Vapor Mode.  
开发者要在Vite项目启用Vapor Mode的话,需要升级Vue和@vitejs/plugin-vue到最新版本,利用新的`createVaporApp`取代`createApp`来创建应用实例.Vapor Mode编译后的代码具备以下特性:更优的模板编译,更好的渲染副作用,以及更高性能的文本设置.Vapor Mode在2024年已经出现,就革新了前端对应用性能的认知,并保证后续为Vue开发者带来更丝滑更高效的开发体验.  

## 正文
Vapor Mode使Vue.js的一种新的编译策略,它不需要使用VDOM.它将代码直接编译成高效的JS代码结果,减少内存的利用,减轻运行时的压力,尽可能地压缩编译后代码的体积,从而大幅提升Vue应用的性能.你可以到[Vue Vapor SFC Playground](https://vapor-repl.netlify.app/)体验Vapor Mode,或者到[Vue Volar Template Explorer](https://vapor-template-explorer.netlify.app/)自行探索Vue使如何对模板进行编译转换的.

![vapor-comparison](/vapor/vapor-compilation.png)

![performance](/vapor/performance-comparison.png)

## 如何在Vite项目中启用Vapor Mode
你可以参考[这个项目](https://github.com/sxzz/vue-vapor-starter)
1. 更新Vue和@vitejs/plugin-vue到最新版本,从而适应vapor mode
```json
"dependencies": {
	"vue": "npm:@vue-vapor/vue@latest"
},
"devDependencies": {
    "@vitejs/plugin-vue": "npm:@vue-vapor/vite-plugin-vue@latest",
}
```
2.  应用入口从默认的`createApp`改为`createVaporApp`
```js 
// main.js
import { createVaporApp } from 'vue/vapor'
import './style.css'
import App from './App.vue'

const create = createVaporApp;
create(App as any).mount('#app')
```

## 检验是否启用成功
```vue
<script setup lang="ts">
    import { ref } from 'vue'
    const msg = ref('Hello Vapor!')
    const classes = ref('p')
</script>
<template>
    <h1 :class="classes">{{msg}}</h1>
</template>
```

> 启用了的话,编译代码会是
```js
/* Analyzed bindings: {
"ref": "setup-const",
"msg": "setup-ref"
} */
import { defineComponent as _defineComponent } from 'vue/vapor'
import { renderEffect as _renderEffect, setText as _setText, setClass as _setClass, template as _template } from 'vue/vapor';
const t0 = _template("<h1></h1>")
import { ref } from 'vue'

const __sfc__ = _defineComponent({
	vapor: true,
	__name: 'App',
	setup(__props) {
	
	const msg = ref('Hello World!')
	
	return (() => {
		const n0 = t0()
		_renderEffect(() => _setText(n0, msg.value))
		_renderEffect(() => _setClass(n0, classes.value))
		return n0
	})()
	}
})
__sfc__.__file = "src/App.vue"
export default __sfc__

```
> 否则没启用的话:
```js
/* Analyzed bindings: {
"ref": "setup-const",
"msg": "setup-ref"
} */
import { defineComponent as _defineComponent } from 'vue'
import { toDisplayString as _toDisplayString, normalizeClass as _normalizeClass, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

import { ref } from 'vue'

const __sfc__ = _defineComponent({
	__name: 'App',
	setup(__props) {
		const msg = ref('Hello World!')
		const classes = ref('p')
		return (_ctx,_cache) => {
			return (_openBlock(), _createElementBlock("h1", {
				class: _normalizeClass(classes.value)
			}, _toDisplayString(msg.value), 3 /* TEXT, CLASS */))
		}
	}
})
__sfc__.__file = "src/App.vue"
export default __sfc__

```

## 启用了Vapor Mode后,编译代码所具有的特性
1. **模板编译结果不同**: 启用了Vapor Mode后,Vue会用`_template`函数来定义模板内容.Vue内部就是用这个方法来生成模板的.
2. **渲染副作用**: Vue会用`_renderEffect`来处理渲染中用到的响应式数据.这是一个Vapor Mode中特有的,高度优化后用以高效更新DOM的渲染函数.
3. **文本设置**: 利用`_setText`来设置元素的文本内容.也就是说,Vapor Mode中Vue会用更加直接的方法来更新文本节点.

## 没启用时编译代码又是怎样的?
1. **编译结果不同**: 用之前的`createElementBlock`来生成元素.这是标准Vue编译过程中,用来虚拟DOM节点的函数.
2. **文本转化**: 用`_toDisplayString`将数据转换为客栈是的字符串.也是Vue处理数据绑定时最标准的办法.
3. **块级渲染**: 用`_openBlock`处理块级渲染,也是Vue处理多个统计节点时的标准方法.

## 编译后代码的对比
* 性能优化: 启用了Vapor Mode编译后的代码是经过高度优化的,运行时的DOM操作已经尽可能被减少,渲染效率也被进一步提升了.
* 不同API的使用: 启用了Vapor Mode后,底层利用的API(比如`_renderEffect`和`_setText`)跟标准版本下是不一样的,这些API是Vapor Mode中特有的,专门用来提升渲染效率的.

## Vapor Mode所利用的API
1. `renderEffect`: 这个函数用于监听元素节点中,类/属性/文本的变化,确保更新能被应用到正确的节点上.
2. `setClass`: 正如其名,将特定的类应用到元素节点上.它包括两个参数:一个元素(或节点),以及需要委任的类的名称.
3. `setDynamicProp`: 用以设置元素的动态属性.包括三个参数:元素,键名,值.这些参数用以确保当函数被调用时,合适的值能被设置/更新到对应的元素上.
4. `setText`: 接收两个参数:一个节点,一个对应的值.将接收到的值设置为节点的文本内容,还有一个作用就是,确认节点中的内容是否已经被更新了.
5. `template`: 参数为一段有效的HTML字符串,并根据这段字符串盛恒对应的元素.深入来说,这个方法内部调用了大量最基础的操作DOM的方法.具体而言就是,`document.createElement`创建元素,`innerHTML`添加内容到元素中,后者接收的也是HTML字符串.

## 总结
2024年Vapor Mode革新了前端开发领域,通过突出的性能表现为Vue生态带来了史无前例的变化.我们非常期待Vapor Mode的正式到来,并相信它将给Vue开发者带来更丝滑更高效的开发体验.
