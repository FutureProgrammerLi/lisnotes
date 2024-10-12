# `<script setup>`的一些理解
> 主要内容来自一个问题:**为什么Pinia setup function还要将定义的所有return出去,而Vue SFC的`<script setup>`就不用了?**  
> 然后自己就去玩了.
> https://play.vuejs.org  
> 试着各种Macro,API,在编译后都变成什么样吧.

## `<template>`
类似React Class Component,一个单文件Vue组件可以理解为一个对象:`__sfc__`.  
`<template>`对应的是`render()`函数,其它状态/方法,可以理解为对象上的属性.  
先上代码吧:
```js
// 一个只有模板的,没有任何和Vue相关内容的SFC,长这样:
const __sfc__ = {};
function render(_ctx, _cache) {
  return " 12345 "
}
__sfc__.render = render
__sfc__.__file = "src/App.vue"
export default __sfc__

// const __sfc = {
//     render(){/** */},
//     __file:'src/App.vue',
// }
```
能从以上知道什么呢?你又是否能了解模板原本是什么内容呢?  
1. 一个`render`函数,返回字符串`12345`.
2. 该函数作为对象属性添加到了对象上
3. 为对象添加`__file`属性,没错,这就是文件的名称.(是否用了别名这里会发生变化?)

## `<script>`没有setup
Vue3初期是没有`setup`这个语法糖的,定义的所有响应式内容都需要从`setup()`函数返回出去,这样模板才能读取到对应的值:
```vue
<script>
    import { defineComponent, ref } from 'vue';
    export default defineComponent({
        setup(){
            const msg = ref('Hello');
            return {
                msg
            }
        }
    })
</script>
<template>
{{ msg }}
</template>
```
如此,编译后的文件又会变成什么样呢?


```js
import {ref,defineComponent} from 'vue'
const __sfc__ = defineComponent({
    setup(){
        const msg = ref('hello world');
        return {
            msg
        }
    }
});
import { toDisplayString as _toDisplayString } from "vue"
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return _toDisplayString(_ctx.msg)
}
__sfc__.render = render
__sfc__.__file = "src/App.vue"
export default __sfc__
```

可以说是毫无变化了,对`__sfc__`这个对象的定义,就是`defineComponent()`内的对象.  
可见一斑了,`<script setup>`的作用:`defineComponent`,除了`setup()`函数以外的东西,你没有定义,Vue自己就给它添加上一些默认值.  

## 有了`<script setup>`
用`defineComponent`定义一个没有利用语法糖的组件,编译后的代码是这样的:
```js
// Comp.vue
import { defineComponent,ref } from 'vue';
const __sfc__ = defineComponent({
  name:'Foo',
  setup(){
  const withoutReactive = 'something constant';
  const age = ref(11)
  return {
    withoutReactive,
    age
  }
}
})
```
用了语法糖后,代码就变这样了:
```js
// App.vue
import {ref} from 'vue';
import Foo from './Comp.vue'
  
const __sfc__ = {
  __name: 'App',         [!code highlight]
  setup(__props, { expose: __expose }) {
  __expose();

  const msg = ref('hello world')

    const __returned__ = { msg, ref, Foo }
    Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
    return __returned__
}
```
发现了个差异点:
`defineComponent`需要注册组件:  
1. 传个对象,编译结果也还是对象;
2. 在`render`函数内有`const _component_Foo = _resolveComponent("Foo")`这个步骤,之后为这个结果`_createVNode(_component_Foo)`.  

`setup`语法糖不用注册了,直接导入就行
1. 将这个组件,放到了`__sfc__.__returned__`这个对象上;
2. 渲染的时候用的方法是`createVNode($setup["Foo"])`,而少了中间变量了.

`$setup["Foo"]`,是不是可以理解为:用了语法糖后,Foo组件的定义作为属性添加到这个参数上了?
`_createVnode`接收的参数是怎样的?  `_resolveComponent("Foo")` 和 `$setup["Foo"]`又有什么区别?

先暂停一下去看下官网吧.