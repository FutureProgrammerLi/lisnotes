# 路由
> 跟服务器端的文件结构功能相似,那个是后端,处理发送后的请求  
> 这个是前端的路由,页面切换.这大概也是前后端对于"路由"这个概念的差异,前者类似跳转,后者更像"接口"  
> 因此也可以配合跳转理解:[Nuxt里的服务器文件夹](Server.md)

* [`pages`目录](https://nuxt.com/docs/guide/directory-structure/pages)
* [`<NuxtLink>`组件](https://nuxt.com/docs/api/components/nuxt-link)
* [`useRoute`钩子函数](https://nuxt.com/docs/api/composables/use-route)
* [`Middleware`目录](https://nuxt.com/docs/guide/directory-structure/middleware)
* [页面元数据](https://nuxt.com/docs/api/utils/define-page-meta)

<p class="text-2xl font-bold">Nuxt的路由是基于文件结构实现的,它会为`pages/`目录下的每个文件创建对应的路由</p>

---
Nuxt的一个核心功能是文件系统路由器.每个在`pages/`目录下的文件都会创建一个对应的URL(或者说是路由),该路由就会显示对应文件的组件内容.结合页面的动态导入功能,Nuxt增强了代码划分的功能,最小化每次请求的路由JS加载量.  

## 页面
Nuxt路由是基于[vue-router](https://router.vuejs.org/)实现的.每一个在`pages/`目录下的文件,会根据文件名生成对应的路由页面.  
文件结构系统,换句话说,可以说是沿袭命名规则,生成动态路由或是嵌套路由.  
(应该是假定了你已经知道如何通过创建文件夹/文件,决定实际对应的URL和路由页面)  
::: code-group
```text [Directory Structure]
| pages/
---| about.vue
---| index.vue
---| posts/
-----| [id].vue
```

```text [Generated Router File]
{
  "routes": [
    {
      "path": "/about",
      "component": "pages/about.vue"
    },
    {
      "path": "/",
      "component": "pages/index.vue"
    },
    {
      "path": "/posts/:id",
      "component": "pages/posts/[id].vue"
    }
  ]
}
```
:::
<p class="text-xs text-blue-300">(Vitepress里面为什么没有这个功能啊啊啊啊,好麻烦啊啊啊啊)</p>

::: tip
更直接的,[去看`pages`目录](https://nuxt.com/docs/guide/directory-structure/pages)(跟Server类似,这里算是概括对应目录功能,注重"可以怎么用".后者更像"有什么用")
:::

## 导航
你可以用`<NavLink>`这个组件实现路由的切换.本质上它会渲染一个属性的`<a>`标签,`href`的属性会被设置为对应的路由页面.(所以为什么要用这个而不直接用`<a href>`?)  
当应用被激活(hydrated)的时候,页面的切换就会通过URL的更新得以实现.这样可以防止整个页面的刷新,并在这个切换过程中实现一切动画过渡.  
当`<NuxtLink>`进入到用户的视线窗口时,Nuxt会自动预获取对应目标链接的组件代码,事先生成对应页面(?),从而加快页面切换速度.
```vue
<!-- pages/app.vue -->
<template>
    <header>
        <nav>
            <ul>
                <li><NuxtLink to='/about'>About</NuxtLink></li>
                <li><NuxtLink to='/posts/1'>Post 1</NuxtLink></li>
                <li><NuxtLink to='/posts/2'>Post 2</NuxtLink></li>
            </ul>
        </nav>
    </header>
</template>
```
::: tip
[更多关于NuxtLink这个组件](https://nuxt.com/docs/api/components/nuxt-link)
:::

## 路由参数
你可以在`<script setup>`或是`setup()函数`内,使用`useRoute()`这个钩子函数,获得当前路由的相关信息.  
```vue
<!-- pages/posts/[id].vue -->
<script setup>
const route = useRoute();
// 当访问路径是posts/1时,id这个值就会是1.
console.log(route.params.id);
</script>
```

::: tip
[更多关于`useRoute()`这个钩子函数.](https://nuxt.com/docs/api/composables/use-route)
:::

## 路由中间件
Nuxt为开发者提供了一整个可定制化的路由中间件框架(原文framework).如果你想对特定路由切换时做点限制或是验证或是~~任何页面切换前后的工作,你可以通过这个中间件系统实现.

::: warning
这里的路由中间件是前端Vue应用的一部分.虽然它跟服务器端的中间件名字相似,它们是完全不一样的两个东西.服务器中间件的运行是后端Nitro服务器的一部分.
:::

路由中间件有三种:
1. **匿名(或是行内)路由中间件:** 这种中间件的定义是直接在页面内定义的,哪个页面用就在哪个页面内定义.(功能相对简单且不指望复用)
2. **具名路由中间件:** 一般这种中间件是定义在`middleware/`这个目录下的,当页面要用到它们的时候会自动通过异步导入,自动加载到对应页面.(**注意:** 中间件一般用驼峰式命名(kebab-case),所以`someMiddleware`会变成`some-middleware`)???前者是什么,后者又是什么?函数名和组件名吗?
3. **全局路由中间件:** 这种中间件也放在`middleware/`目录下,命名时可用`.global`作后续标识.每次路由变化时这种中间件都会被执行.  
以下是对`/dashboard`页面进行验证的一个`auth`中间件:
::: code-group
```ts [middleware/auth.ts]
export default defineNuxtRouteMiddleware((to,from) => {
   if(isAuthenticated() === false){
    return navigateTo('/login')
   } 
})
```
```vue [pages/dashboard.vue]
<script setup lang='ts'>
    definePageMeta({
        middleware:'auth'
    })
</script>
<template>
    <h1>Welcome to your dashboard</h1>
</template>
```
:::

::: tip
[更多关于中间件的内容](https://nuxt.com/docs/guide/directory-structure/middleware)
:::

## 路由验证
<p class='text-xs text-blue-300'>(和上面的中间件有什么区别?)</p> 

如果你想对特定的个别页面进行验证,你还可以用`definePageMeta()`方法中的`validate`方法实现路由验证.  
`validate`这个属性是个函数,参数是`route`,返回一个布尔值,从而决定当前路由是否需要渲染对应内容.如果这个函数返回`false`,而又找不到其它对应的路由,那么就会返回404错误.你也可以返回对象,包含`statusCode/statusMessage`来扔出错误.(这样的话路由就不会去检查是否还有其它路由跟当前请求是符合的了,**扔出错误属于中断操作了**)  
如果你的应用场景更为复杂的话,尝试改用匿名中间件吧.  

```vue
<!-- pages/posts/[id].vue -->
<script setup lang='ts'>
definePageMeta({
    validate: async (route) => { // 为什么要async? 
        return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id);
    }
})
</script>
```

::: tip
[更多关于页面元数据](https://nuxt.com/docs/api/utils/define-page-meta)
:::