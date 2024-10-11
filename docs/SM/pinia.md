# 初识Pinia
> 半夜三更了,我的想法跟烤架上刚熟五花肉的油一样滋滋往外冒.  
> 初衷是昨天的一篇Typescript的文章最后,提到的状态管理跟TS的结合,引起了我对Pinia这个库的学习兴趣.  
> 接下来想做的除了学习Pinia,还想拿它跟Zustand,类似的一个React状态管理库作为学习对比.此外还想翻译一下那边,通读下来,React的"组件进化历史"的一篇文章翻译.
> 就看看这个晚上,心血来潮潮能翻多高吧~  0:51了~
> Pinia 官网: https://pinia.vuejs.org/

## Before diving in
从官网学习前对Pinia已有一点认识,关键概念是
1. `defineStore(key,content)`
2. `states`
3. `actions`
4. `getters`

从上到下,分别对应Vue的概念可以理解为:定义仓库,"共享状态","共享函数","共享加工后的状态".  
其实对应Vuex也是有相关概念的,可以说是"取其精华弃其糟粕"的一个产物.

那么正式学习前的理解到此,以下是官网上的一些新认识.

## `defineStore(key, content)`
1. key为什么字符串就可以了?为什么不用像InjectionKey一样,拿`Symbol`作为key?
2. 既然content可以用类似setup function一样引入,为什么`<script setup>`可以不用return就能在`<template>`中使用;而`defineStore`里,仍旧需要return object,将需要的内容暴露出来?
3. 甚者,上面的问题越读越不明白.  
> "setup function里定义的state,必须所有都返回出来,且不能是只读属性,否则会破坏SSR,devtools,and other plugins."  
4. 

`content`可以有两种形式:一个`Options`对象,或是匿名函数返回.
### `Options`
```js
const useUserStore = defineStore('users',{
    state:() => ({
        count:0,
        name:'Eduardo'
    }),
    getters:{
        double:(state) => state.count *2
    },
    actions:{
        increment(){
            this.count++
        }
    }
})

```

### Setup function
```js
const useProductStore = defineStore('products',() => {
    const items = ref([]);
    const itemsCount =  computed(() => items.value.length);
    function clearItems(){
        items.value.length = 0;
    }
    return {
        items,
        itemsCount,
        clearItems
    }
})

```
::: tip
Setup Store的一个优点是,可以在内部使用全局`provide`的值,就是说可以在store function内,`inject`某些内容,比如Router或Route信息.  
缺点是需要return一个对象,将所有定义的内容都返回出去,感觉有点多余.  

而Options Store,优点明显就是向下兼容了,对Vue2习惯Options API的用户明显更容易使用; 且不用将定义的内容返回出去.  
缺点是灵活性没那么强;actions里使用state的内容甚至出现`this`,明显更容易出错,混淆.  

如果需要重置仓库内容,Options API有`store.$reset`这个自带方法;Setup function则需要自定义方法,自行对需要重置的内容进行还原. `function $reset(){count.value = 0}`
:::

**仓库的创建时机是:实际调用`useXXXStore()`时.**  
不在`setup`里调用这个函数,仓库内容**就不会被创建.**  
官方建议是,每个仓库的定义,分开到各自文件中去,这样能更好利用打包代码分块,以及Typescript类型推断.  

## Using a store
使用的时候,各种潜在的问题就来了:
1. `useXXXStore()`返回的是一个`reactive`包裹的对象,因此:
    - 在setup里使用,不用`.value`.(`ref`包裹的才需要)
    - **解构需谨慎,直接解构可能仓库内容的响应性就消失了**
2. 为了解决可能的,解构导致内容响应性丢失的问题,你需要使用`storeToRefs()` API.(state和getters如需解构,则必须使用这个API.action则不需要,可以直接从store解构)
```js
const store = useUserStore();
const { count, double } = storeToRefs(store);
const { increment } = store;
```

## Guess what
漏了最最最基础的一步,`defineStore()`之前还要在全局注册插件:
```ts
// main.ts
import { createPinia } from 'pinia';

const pinia = createPinia();
// const app = createVue(App);
app.use(pinia);
// app.mount('#app');

```