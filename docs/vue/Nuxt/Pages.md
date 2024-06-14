# 页面
> https://nuxt.com/docs/guide/directory-structure/pages#child-route-keys
<p class='text-2xl font-bold'>Nuxt为你的网页应用提供基于文件结构的路由系统</p>

***
::: tip
为了压缩应用的打包体积,这个`pages`目录并不是必须要有的.就是说你单用`app.vue`定义你整个应用的话,`vue-router`直接就不会作为依赖被添加到你的项目之中了.如果你需要强制开启这个路由功能,可以在`nuxt.config`里设置`pages:true`,或者创建`app/router.options.ts`这个文件在里面配置.
:::
* [定义组件的三种方法](./Pages.md#用法)
* [动态路由](./Pages.md#动态路由)
* [嵌套路由,既显示父组件也显示子组件内容](./Pages.md#嵌套路由)
* [页面元数据](./Pages.md#一些特殊的元数据)
* [导航](./Pages.md#导航)

## 用法
页面就是Vue组件,一些扩展定义组件的方法也是允许的.(不限于vue文件定义组件,js/ts返回jsx也是可以的.默认允许的有:`.vue`,`.js`,`.jsx`,`.mjs`,`.ts`以及`.tsx`)  
Nuxt会自动为`~/pages/`目录下的每个页面创建对应的路由.  
::: code-group 
```vue [pages/index.vue]
<template>
    <h1>Rendered with template</h1> 
</template>
```

```ts [pages/index.tsx]
export default defineComponent({
    render(){
        return <h1>Rendered by tsx</h1>
    }
});
```
```ts [pages/index.ts]
export default defineComponent({
    render(){
        return h('h1','Index page')
    }
})
```
:::

`pages/index.vue`文件,会作为你的应用入口,对应`/`.  
如果你用的是`app.vue`,记得用`<NuxtPage/>`组件来展示当前的页面(???):
```vue
<template>
  <div>
    <!-- Markup shared across all pages, ex: NavBar -->
    <NuxtPage />
  </div>
</template>
```
每个页面**必须**包含唯一的一个根元素,这样才能实现页面之间的路由切换.HTML的注释元素也会被作为元素对待.(???什么怪异提示)  
也就是说,当路由是服务器端渲染,或是静态生成的话,你能正确地看到对应内容;而如果你通过客户端导航到该路由时,该路由就不会被渲染出来.(???)  
::: danger
实测`<template>`渲染的不受一个根元素的限制,而用jsx渲染的,还是会报错,提示jsx有且仅可有一个根元素.
:::

例子说明要如何定义一个页面仅包含一个根元素,(**以下全都是可行的**,不过应该不推荐后两种?):
::: code-group
```vue [pages/working.vue]
<template>
    <div>
    <!-- This page correctly has only one single root element -->
    Page content
  </div>
</template>
```
```vue [pages/work-but-bad-1.vue]
<!-- 应该也是可以的, -->
<template>
  <!-- This page will not render when route changes during client side navigation, because of this comment -->
  <div>Page content</div>
</template>
```
```vue [pages/work-but-bad-2.vue]
<template>
  <div>This page</div>
  <div>Has more than one root element</div>
  <div>And will not render when route changes during client side navigation</div>
</template>
```
:::

## 动态路由
如果你在路由命名时,用方括号并填入内容的话,那这个内容就会作为变量,变成"动态路由参数".  
你可以混合使用,配设多个动态参数,或是静态文字作为文件的名称或目录的名称(什么反向介绍)  
**如果这个动态参数是可有可无的话,你要用双重方括号作为对应名称 -- 举例说,`~/pages/[[slug]]/index.vue`或者`~/pages/[[slug]].vue`,都会对应到`/`和`/test`这两个路由.  
<p class="text-xs text-blue-300">光看目录确实如此,但什么场景下会有这样的用法?</p>

```text
-| pages/
---| index.vue
---| users-[group]/
-----| [id].vue
```
上面这个文件结构,你可以通过`$route`来访问到`group`和`id`这两个动态参数:(都是必须有的参数,不会出现undefined情况);
```vue
<!--  pages/users-[group]/[id].vue -->
<template>
    <p>{{ $route.params.group}} - {{ $route.params.id }}</p>
</template>
```
导航到`/users-admins/123`路由的话,会渲染以下内容
```html
<p>admins - 123</p>
```
(这是在template中获取路由信息的方式,`$route`)  
如果你需要在Composition API中获取当前路由信息,用`useRoute()`这个全局钩子函数,它的内容跟Options API中,`this.$route`是一样的.
```vue
<script setup lang='ts'>
const route = useRoute();
if(route.params.group === 'admins' && !route.params.id){
    console.log('Warning!Make sure user is authenticated!');
}
</script>
```

::: warning
具名路由的优先级比动态路由高,举例就是对于`/foo/hello`这个路由,`~/pages/foo.vue`优先级会比`~/pages/foo/[slug].vue`高.  
建议用`~/pages/foo/index.vue`和`~/pages/foo/[slug].vue`来分别对应`/foo`和`/foo/hello`两个路由.  
(?第二段还能看懂,第一段前者为什么会匹配到?)
:::

## 捕获所有的路由
如果需要捕捉所有路由,那就创建像`[...slug].vue`这个格式的路由页面.这样这个页面不仅会捕捉所有对应目录下的所有路由请求,还会把路由参数分开给你.
```vue
<!-- pages/[...slug].vue -->
<template>
    <p>{{$route.params.slug}}</p>
</template>
```
如果你访问的路径是`/hello/world`,就会渲染以下:
```html
<p>["hello","world"]</p>
```

## 嵌套路由
用`<NuxtPage/>`组件展示嵌套路由是完全可以的.举例就是:
```text
-| pages/
---| parent/
------| child.vue
---| parent.vue
```
这个目录结构会生成这样的路由配置:
```js
[
  {
    path: '/parent',
    component: '~/pages/parent.vue',
    name: 'parent',
    children: [
      {
        path: 'child',
        component: '~/pages/parent/child.vue',
        name: 'parent-child'
      }
    ]
  }
]
```
为了展示`child.vue`组件,你需要在`pages/parent.vue`中插入`<NuxtPage/>`组件.
::: danger
路径叠加不叫嵌套路由.**`pages/parent/Child.vue`对应的URL是`/parent/child`,内容是`child`组件.**   
路由组件内容共同展示才可能叫嵌套路由.**`pages/parent/Child.vue`,对应的URL是`/parent/child`,内容是`Parent`和`Child`组件,才叫嵌套路由.**  
* 同名文件和文件夹, `parent.vue`和`pages/parent`
* 对应URL,`parent/child`
* 结果是`Child`组件内又有`Parent`的内容.
:::

```vue 
<!-- pages/parent.vue -->
<template>
    <div>
        <h1>I am the parent view</h1>
        <NuxtPage :foobar="123" />
    </div>
</template>
```
```vue 
<script setup lang='ts'>
const props = defineProps(['foobar']);
console.log(props.foobar);
</script>
```
<p class="text-xs text-blue-300">!!!!为什么一个NuxtPage,甚至不用指定child组件就能显示获取到这个prop了???</p>

:::danger
如果`pages/Parent.vue`和`pages/Parent/index.vue`同时存在,那么只会渲染`Parent.vue`.  
如果需要同时渲染,则要在`Parent.vue`中添加`<NuxtPage/>`.  
parent.vue > parent/index.vue = parent/child.vue
:::

## 子路由关键字
当你想在`<NuxtPage>`组件重渲染时进行一些操作(比如加点动画),你可以给组件传个属性`pageKey`,这个属性值可以是字符串,也可以是函数.又或者在`definePageMeta`中定义`key`这个属性.
```vue
<!-- page/parent.vue -->
<template>
  <div>
    <h1>I am the parent view</h1>
    <NuxtPage :page-key="route => route.fullPath" />
  </div>
</template>
```
或者:(???没看懂怎么用,[给的例子](https://nuxt.com/docs/examples/routing/pages)我也没看懂???)
```vue
<!-- page/parent/child.vue -->
<script setup lang="ts">
definePageMeta({
  key: route => route.fullPath
})
</script>
```

## 页面元数据
你可以通过`definePageMeta()`这个宏定义函数(macro,类似`defineProps()`,不用引入就能直接用.),为你的每个页面定义元数据.这个宏函数在`<script>`,`<script setup>`中都是允许的.
```vue
<script setup lang='ts'>
definePageMeta({
  title:'My home page'
})
</script>
```

这里定义的元数据可以通过`route.meta`对象获取.
```vue
<script setup lang='ts'>
const route = useRoute();
console.log(route.meta.title);
</script>
```

而如果碰巧你用了嵌套路由,那么页面的所有元数据就会整合到同一个对象之中(类似多个函数嵌套定义,最里层的函数?).更多关于路由元数据的内容,[可以看vue-router的相关文档](https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields)  
跟`defineEmits`和`defineProps`很相似的是,`definePageMeta`也是编译器宏函数(compiler macro).在编译阶段,它会被转换为其它内容,因此你不能够在组件其它地方再指示或是索引它了(功能单一且完成后会自动消失).而对于`definePageMeta`这个宏的功能就是,将元数据会提升到组件之外.这样的结果就是你不能通过元数据对象,指向定义它的那个组件了(或是该组件定义的其它值).不过,它可以指向一些引入的绑定值.(?imported bindings):

```vue
<script setup lang='ts'>
import { someData } from "~/utils/example";
const title = ref('');
definePageMeta({
  title,    //这里会报错
  someData
})
</script>
```
<p class="text-xs text-blue-300">???迷惑.本组件的ref不能,引进来的就可以?</p>

### 一些特殊的元数据
你当然可以按需要任意定义你应用的元数据.不过`definePageMeta`中,一些元数据的定义,有对应特殊的功能.  
* `alias:`顾名思义,定义页面的别名,通过不同的路径可以访问到相同的组件页面.可以是字符串,也可以是字符串数组.([Vue-router alias](https://router.vuejs.org/guide/essentials/redirect-and-alias.html#Alias))  
* `keepalive:`如果你在元数据定义中设置了`keepalive:true`,那么Nuxt会自动将你的组件用`<KeepAlive>`包裹起来.父组件中有许多动态子组件,而你又需要在路由切换时保留页面的数据状态的话,这个功能就派上用场了.  
如果你想在父组件中将状态持久化,你可以在父组件里,`<NuxtLink keepalive/>`.另一个做法就是手动包裹,用`<KeepAlive>`,`include,exclude,max`这些结合使用.(是不是有点离题了?metadata呢?)  
如果你`KeepAlive`的页面有很多,你还可以在`nuxt.config`里,给`keepalive`设置默认值,这个值默认为`false`,改为`true`就可以实现你的目的了.
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app:{
    keepalive:true
  }
})
```
* `key:`[看本页面的这里](./Pages.md#子路由关键字)
* `layout:`你可以在这里定义你想应用到当前页面的布局,它的值可以是`false`(禁止布局应用),字符串,或是响应值ref/computed(如果你想页面的布局也是响应式的话).[更多关于布局的内容](https://nuxt.com/docs/guide/directory-structure/layouts)
* `layoutTransition`和`pageTransition`:你可以在这个属性中定义很多`<transition>`可以接收的属性值,或者传个`false`就直接禁用`<transition>`包裹当前路由了.`<transition>`可以接收的东西[在这](https://vuejs.org/api/built-in-components.html#transition),或者你可以了解一下[transitions是如何实现的](https://vuejs.org/guide/built-ins/transition.html#transition).  
跟keepalive一样,可以在`nuxt.config`里为这两个属性设定一个默认值.(默认都为false)
* `middleware:`这个属性可以用来决定,当前路由加载之前,作用于当前路由的中间件有哪些.如果其它中间件符合作用于当前路由的条件,那它们会整合到一起.(???所以作用是什么,符合的发挥作用,不符合的需要在这里额外声明才能发挥作用是吗?只有include没有exclude是吧?)  
值可以是字符串,可以是函数(匿名/行内中间件,定义跟全局守卫模式相同),或是数组(字符串数组,函数数组).[更多关于具名中间件](https://nuxt.com/docs/guide/directory-structure/middleware).

* `name:`为当前页面路由定义一个名字.
* `path:`当你不满足于文件名作为路径这个功能时,你可以在这里定义你想要的,路径匹配符.这就[看你对vue-router的熟悉程度](https://router.vuejs.org/guide/essentials/route-matching-syntax.html#custom-regex-in-params)了.

### 自定义元数据类型
如果你要添加额外的自定义元数据,你可能希望这些新的,也还是跟其它一样,是类型安全的(type-safe).  
你可以通过增强`definePageMeta`对象的类型实现目的:
```ts
// index.d.ts
declare module '#app' {
  interface PageMeta{
    pageType?: string
  }
}

export {}  //这很重要!
```

## 导航
页面之间的导航,一般通过`<NuxtLink>`实现.  
这个组件是自带的,你不需要额外的声明导入.  
简单如导航到`/pages/index.vue`的例子长这样:
```vue
<template>
  <NuxtLink to='/'>Home page</NuxtLink>
</template>
```
::: tip
[更多关于`<NuxtLink>`组件](https://nuxt.com/docs/api/components/nuxt-link)
:::

## 编程式导航
Nuxt3实现编程式导航的方法是:`navigateTo()`.这个函数可以理解为手动触发页面跳转.对于接收用户输入,然后动态地在网页应用中切换页面这样的场景中,这个函数可以说是必不可少的了.  
以下就是用户在搜索框中输入,提交表格后实现页面跳转的例子:
::: tip
记得用`await`"装饰"`navigateTo`这个函数,或是通过函数的返回,使其结果链式化(chain its result by returning from functions?)
:::

```vue
<script setup lang='ts'>
const name = ref('');
const type = ref(1);

function navigate() {
  return navigateTo({  //这大概就是chain its result by returning from functions?
    path:'/search',
    query:{
      name:name.value,
      type:type.value
    }
  })
}
</script>
```

## 仅客户端页面
通过给文件命名添加后缀`.client.vue`的方式,你可以把页面定义为["仅客户端页面"](https://nuxt.com/docs/guide/directory-structure/components#client-components).这种页面是不会在服务器上渲染的.

## 仅服务器端页面
同样,文件命名后缀为`.server.vue`,页面就成了["仅服务器端页面"](https://nuxt.com/docs/guide/directory-structure/components#server-components).尽管你能够通过由vue-router控制的,客户端导航,切换到该页面,它还是自动会作为服务器组件渲染到页面上,也就是说渲染当前页面所需的代码,在服务器端上而不在客户端包(client-side bundle)上.

::: tip
仅服务器端页面的定义必须仅有一个根元素(注释也可以是根元素).
:::

## 自定义路由
如果你的应用庞大复杂到,本身路由功能都不够用了,还要更加的灵活[,Nuxt把路由器,路由,路由器选项等等一系列](https://nuxt.com/docs/guide/recipes/custom-routing)可定制化的东西都暴露给你了.看你怎么用了.(天啊还能这么复杂)

## "多个"pages目录
默认情况是一个项目一个`pages/`目录就够了.  
不过你可以利用[`Nuxt Layers`](https://nuxt.com/docs/getting-started/layers)来将你的应用页面进行分组:
```text
-| some-app/
---| nuxt.config.ts
---| pages
-----| app-page.vue
-| nuxt.config.ts
```
```ts
// some-app/nuxt.config.ts
export default defineNuxtConfig({})
```
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends:['./some-app']
})
```

:::tip
[更多关于层面问题](https://nuxt.com/docs/guide/going-further/layers)
:::