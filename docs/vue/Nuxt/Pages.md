# 页面
<p class='text-2xl font-bold'>Nuxt为你的网页应用提供基于文件结构的路由系统</p>

***
::: tip
为了压缩应用的打包体积,这个`pages`目录并不是必须要有的.就是说你单用`app.vue`定义你整个应用的话,`vue-router`直接就不会作为依赖被添加到你的项目之中了.如果你需要强制开启这个路由功能,可以在`nuxt.config`里设置`pages:true`,或者创建`app/router.options.ts`这个文件在里面配置.
:::

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