# Vue的未来: 蒸发模式(Vapor Mode)
> [原文地址](https://www.vuemastery.com/blog/the-future-of-vue-vapor-mode/#why-vapor-mode)

Vue团队总能走在网页开发的前端,这次他们带来了新东西: 蒸发模式(Vapor Mode).  
这种模式优化了Vue的核心渲染机制,也能让应用更为轻量化... 蒸发(vapor),让开发者不用自行深入代码优化的问题.  

本篇文章我们来谈谈蒸发模式是如何优雅地提升应用性能,尝试一下如何使用这种模式.不过我们需要清晰一点: 蒸发模式还处于开发阶段(2024年4月)  

## 为什么需要蒸发模式?
只要你用过JS框架,你就不会对虚拟DOM这个概念感到陌生.它包括构建并更新DOM的虚拟代表(virtual representation),将其村在内存中,并与实际DOM保持同步.因为更新VDOM的速度是比更新真实DOM速度更快的,框架就能更自由地以低成本的方式更新VDOM.  

对于Vu而言,基于VDOM渲染系统就是将`<template>`中的代码转化为实际的DOM节点.这个系统能高效地将变化应用到节点上,动态地调用JS函数,API调用,等等.  

![render-system](/vapor/render-system.jpg)

VDOM能提升网页速度和性能,而更新实际DOM还是需要遍历节点树,准确地对比每个虚拟节点的属性.这个过程也包括为无论节点发生了什么变化,都为节点树的每一部分生成新的虚拟节点,这样就可能会对内存产生不必要的压力.  

但在Vue中,有种专门的方法解决这个问题,叫"编译器告知的虚拟DOM"(Compiler-informed Virtual DOM).  
这是一种结合了多种优化策略的混合方案,包括
1. 静态提升(static hosting)
2. 标识辅助(patch flag)

接下来细说一下这两种策略,以更好地理解Vapor Mode.

## Vue里的静态提升
静态提升是一种机制,自动地从渲染函数中提取出虚拟节点的构造过程,以便重用后续多次重渲染中都被渲染到的虚拟节点.这种优化是非常有效的,因为这些虚拟节点在重渲染时没发生变化,也得到了重用.  

比如以下的代码:
```HTML
<div>
    <p class="vue">Vue.js is Cool</p>
    <p class="solid">Solid.js is also cool</p>
    <p>Agree?{{agree}}</p>
</div>
```
当利用静态提升优化的策略后我们会得到以下代码:
```ts
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createElementVNode("p", { class: "vue" }, "Vue.js is Cool", -1 /* HOISTED */)
const _hoisted_2 = /*#__PURE__*/_createElementVNode("p", { class: "solid" }, "Solid.js is also Cool", -1 /* HOISTED */)

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _hoisted_1,
    _hoisted_2,
    _createElementVNode("p", null, "Agree?>" + _toDisplayString(_ctx.agree), 1 /* TEXT */)
  ]))
}
```

上面有两个变量:`_hoisted_1`和`_hoisted_2`.它们的值是静态节点,不会被改变,而且它们被提升到了渲染函数之外.这样它们就不会在每次渲染时跟其它动态代码一样,都被重新处理了.  
我们在最后的`p`标签中声明并重渲染了该元素,因为这个元素中包含了一个**动态**的变量,它随时都可能被改变.  

值得注意的是,当出现足够多的连续静态元素时,它们会被整合成一个单独的静态节点(利用`createStaticVNode`构建),并被传递到渲染函数中.  
连续多个静态节点的代码例子如下:
```HTML
<div>
  <p class="vue">Vue.js is Cool</p>
  <p class="solid">Solid.js is also Cool</p>
  <p class="vue">Vue.js is Cool</p>
  <p class="solid">Solid.js is also Cool</p>
  <p class="solid">React is cool</p>
  <p>{{agree}}</p>
</div>
```

编译后的结果:
```ts [3]
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, createStaticVNode as _createStaticVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createStaticVNode("<p class=\"vue\">Vue.js is Cool</p><p class=\"solid\">Solid.js is also Cool</p><p class=\"vue\">Vue.js is Cool</p><p class=\"solid\">Solid.js is also Cool</p><p class=\"solid\">React is cool</p>", 5)

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", null, [
    _hoisted_1,
    _createElementVNode("p", null, _toDisplayString(_ctx.agree), 1 /* TEXT */)
  ]))
}
```
以上没了多个静态常量`_hoisted_1`...换来了一个包含了所有静态代码的模板块.

## Vue里的标识辅助
标识辅助能让Vue更智能地更新DOM.它们时用来辨别带有动态绑定的元素,需要进行哪种类型的更新的,像`class`,`id`,`value`等等.  
Vue不会胡乱校验元素或直接重渲染所有东西,而是根据这些标识选择性地对元素或组件进行更新.  
这种把焦点聚焦于只发生了变化的元素上的更新机制不仅提升了更新速度,还避免了像对未发生位置变化进行重排这样的不必要操作.  

之所以能够这样,是因为Vue在更新的时候直接把VNode传递给了渲染函数.`createElementVNode`函数最后的参数是一个数字,分别对应不同的标识,意味着渲染函数被调用时,需要执行的动态绑定更新的类型.  

拿代码举例吧:
```vue
<template>
    <div :class="{ active}" ></div>
    <input :id="id" :value="value" :placeholder="placeholder" />
    <div> {{ dynamic }}</div>
</template>
```
以上,一个带有动态类"active"的`div`元素;一个包含动态id,value,placeholder的`input`元素;以及一个包括动态文本dynmaic的`div`.  
编译后的结果如下:
```ts
import { normalizeClass as _normalizeClass, createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createElementVNode("div", {
      class: _normalizeClass({ active: _ctx.active })
    }, null, 2 /* CLASS */),
    _createElementVNode("input", {
      id: _ctx.id,
      value: _ctx.value,
      placeholder: _ctx.placeholder
    }, null, 8 /* PROPS */, ["id", "value", "placeholder"]),
    _createElementVNode("div", null, _toDisplayString(_ctx.dynamic), 1 /* TEXT */)
  ], 64 /* STABLE_FRAGMENT */))
}
```
可以看到每个`createElementVNode`函数最后都多接收了一个数字参数.第一个是`2`,代表的是类,`8`代表的是属性props,而`64`代表的是静态碎片(stable fragment).完整的对应列表可以看[这里](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts)  

有了这种方法,Vue性能就如下图展示那样,比React和Svelte略快了.
![comparison](/vapor/comparison.jpg)

## 为什么要有蒸发模式?
虽然Vue优化了这种方式,但其中还是存在个别优化问题的.这些问题包括: 不必要的内存应用;节点树差异对比; 以及VDOM本身的缺陷.  

而蒸发模式,就是用来解决这些问题的.  

蒸发模式是一种可选的编译策略,通过将代码编译成更高效的JS代码,减少内存利用,引用更少的运行时辅助代码,避开VDOM方法的自身缺陷,从而提高你的Vue应用性能.  

蒸发模式的一些好处包括:
* 它是可选的模式,不会影响任何已有的代码.也就是说你随时可以在Vue3应用中启用这种模式,而不用担心需要对已有代码产生变化.  
* 如果你在应用中使用了仅为Vapor组件的话,你就能完全将VDOM代码从包中丢弃,从而减少运行时代码量.  

**蒸发模式只支持Composition API和`<script setup>`**

## 蒸发模式是如何实现的
根据尤雨溪的说法,蒸发模式是受Solid.js启发而来,后者是用一种完全不同的方式编译和渲染网页节点的.  
它不使用VDOM,而是将模板编译成真实的DOM节点,并用细粒度(fine-grained)的方式对其进行更新.Vue跟Solid相似,能利用响应系统中的Proxies实现基于读取的自动追踪(read-based auto-tracking).

再拿以上代码为例,如果启用了蒸发模式,编译结果会是这样的:
```ts
import { renderEffect as _renderEffect, setClass as _setClass, setDynamicProp as _setDynamicProp, setText as _setText, template as _template } from 'vue/vapor';
const t0 = _template("<div></div>")
const t1 = _template("<input>")

export function render(_ctx) {
  const n0 = t0()
  const n1 = t1()
  const n2 = t0()
  _renderEffect(() => _setClass(n0, { active }))   // <div :class="active" />

  _renderEffect(() => _setDynamicProp(n1, "id", id))   //     <input :id="id":value="value":placeholder="placeholder" >
  _renderEffect(() => _setDynamicProp(n1, "value", value))
  _renderEffect(() => _setDynamicProp(n1, "placeholder", placeholder))

  _renderEffect(() => _setText(n2, dynamic))  //   <div> {{ dynamic }}</div>
  return [n0, n1, n2]
}
```
可以看到,引入的函数都不一样了,从`vue/vapor`包中引入了`renderEffect`,`setClass`,`setDynamicProp`,`setText`,`template`.  

每个函数做了什么呢?
1. `renderEffect`: 用于监听类/属性/文本的变化,确保更新时每个节点发生的变化是正确的.
2. `setClass`:如名所示,将一个类名分配给一个节点元素.其中包括两个参数:一个元素(或节点),一个需要分配的对应类名.
3. `setDynamicProp`:将动态属性分配到元素上.其中包括三个参数:对应元素element,键名key,以及对应值value.这些都是用来决定元素值的原始分配或后续更新的.
4. `setText`:参数包括对应元素和任意可能的文本值.作用是将所接收到的文本值,设置为对应节点的`textContent`内容,同时也可以用来确保内容是否发生了变化.
5. `template`: 这个函数接收有效的HTML字符串,并为其创建对应的元素.细看这个函数可以知道,它内部会调用很多最基础的DOM操作方法,比如`document.createElement`.之后将内容通过改变`innerHTML`属性添加到元素上.  

通过以上函数的结合使用,Vue可以将你的组件编译成速度更快,效率更高的应用.  
为了让开发者更熟悉这种模式,Vue团队也开发了个playground供我们自行研究.[Vue Playground](https://vapor-repl.netlify.app) / [template explorer](https://vapor-template-explorer.netlify.app/)  
这个"游乐场"可以展示用不用蒸发模式时,编译后的代码区别.你还可以看到Vue代码编译后,对应CSS,JS,SSR的代码输出.  

---
而template explorer跟playground相似,不过只会展示编译后的JS,可选项没那么多.  

## 启用蒸发模式
根据[蒸发模式的介绍](https://github.com/vuejs/vue-vapor),以下是启用该模式的代码案例:
```Vue
<script setup>
import {
    onBeforeMount,
    onMounted,
    onBeforeUnmount,
    onUnmounted,
    ref
} from 'vue/vapor'
const bar = ref('update')
const id = ref('id')
const p = ref<any>({
  bar,
  id: 'not id',
  test: 100,
})

function update() {
  bar.value = 'updated'
  p.value.foo = 'updated foo'
  p.value.newAttr = 'new attr'
  id.value = 'updated id'
}

function update2() {
  delete p.value.test
}

onBeforeMount(() => console.log('root: before mount'))
onMounted(() => console.log('root: mounted'))
onBeforeUnmount(() => console.log('root: before unmount'))
onUnmounted(() => console.log('root: unmounted'))
</script>

<template>
  <div>
    root comp
    <button @click="update">update</button>
    <button @click="update2">update2</button>
    <input :value="p.test" :placeholder="p.bar" :id="p.id" />
  </div>
</template>
```
最大的一个区别是,setup里的函数都是从**vue/vapor**包中引入的.这些都是Composition API,区别是从这个包引入的不会依赖虚拟DOM.  
这种引入方式就方便了我们,既可以依赖蒸发模式,又可以维持原本的代码配置了.

## 蒸发模式的新特性
当前的蒸发模式仅支持Composition API和在`<script setup>`中使用.  
模式依旧会发展,但可以确定的是,它是可选的,你可以选择混用,全用,或是不用都行.

## 总结
Vue目前编译策略主要还是Compiler-informed Virtual DOM,随着其缺点不断突出,我们很高兴看到其解决方法 Vapor Mode的出现,后者进一步减少打包体积,提升应用性能.
