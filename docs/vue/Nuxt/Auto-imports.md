# 自动导入
> https://nuxt.com/docs/guide/concepts/auto-imports  


<p style="font-size:1.125rem;line-height:1.75rem;">Nuxt会自动导入一些组件,复用钩子,协助函数以及内置Vue API.</p>

***

Nuxt会自动引入组件,钩子(composables),以及内置API.不用手动声明引入,在你的vue文件内直接用就行了.  

```vue
<script setup lang='ts'>
    const count = ref(1);
</script>
```

"死板"的目录结构有一点好处就是,`components/,composables/,utils/`这三个目录下的所有内容**都会被自动引入.**  
(Official Example里面没有这三个目录,你可以自己创建,只要目录名字是对的它就能全局引入).  
跟之前全局声明不一样的是,Nuxt保留了类型声明,IDE自动补全及提示,**这些内容在生产环境中只有被使用的部分会被保留.**  
> [!TIP]
> `server`目录下,Nuxt会自动引入`server/utils/`目录下导出的函数及变量.  
> 你可以自定义哪个文件夹内导出的内容,全局被使用:修改`nuxt.config`文件中的`imports`属性即可.  

## 内置自动引入
Nuxt会自动引入一些用于函数及可复用钩子函数,这些函数一般用于数据获取,获取整个应用的上下文及运行时配置内容,管理状态或是定义组件和插件.

```vue
<script setup lang='ts'>
    const {data, refresh, pending} = await useFetch('/api/hello');
</script>
```

一些内置响应式API,像`ref`,`reactive`,或是生命周期钩子函数,辅助函数,这些也是直接暴露的,直接用就行.
```vue
<script setup lang="ts">
    const count = ref(1);
    const double = computed(() => count * 2);
</script>
```

## Vue和Nuxt的可复用函数
你要用Vue和Nuxt内置的可复用函数时,应注意它们的使用需要在*正确的上下文环境*中才能发挥作用.  
在组件的生命周期内,Nuxt会用一个全局变量来跟踪当前的临时实例,`nuxtApp`,而在生命周期结束时取消跟踪(unsets in the same tick??怎么理解).这样做对于服务器渲染而言时很有必要的,一是可以避免跨组件状态请求污染(这个错误的结果是两个用户获得了同一个状态(!???!)),二是避免不同组件中状态的污染.  
换句话说就是,不要过多的指望自动引入给你带来的便利,这些自动导入的内容本身就不是到处都能被使用的:**编写Nuxt插件,路由中间件,setup函数** 里它们确实非常有用,所以一般限于这些范围之内.  
除此之外,你还需要同步地使用它们--  
**除了在** 
* `<script setup>`,
* `defineNuxtComponent`,
* `defineNuxtPlugin`,
* `defineNuxtRouteMiddleware`  

这些环境内,你不能不用await就调用一些异步钩子函数.我们在这些环境内都做了一些转变,把`await`后面的代码都保持同步执行.  
(好拗口,但看例子也能看出来.  
上面的`useFetch`没有async声明也能用`await`,是因为它在规定的`<script setup>`环境之中.而这个环境是可以变化的,但又不是全部环境.尽量cover掉大部分的开发场景提供的便利吧算是)  
如果你开发遇到报错`Nuxt instance is unavailable`,大概是由于你在错误的环境中调用了Nuxt的钩子函数了(没在环境就直接用,你要手动声明引入才能解决)  

> [!TIP]
> ⭐一个实验性的功能是,[自定义这个异步环境](https://nuxt.com/docs/guide/going-further/experimental-features#asynccontext),硬要在没有`async`声明的环境下使用`await`,可复用钩子函数.

???为什么例子讲的不是一个东西?下面的代码说明的是**要在自定义hooks内使用内置的钩子函数.**  
```js
// wrong 错误的
const config = useRuntimeConfig();
export const useMyWrongComposable = () => {
    //  在这里用config
}

//right, 正确的
export const useMyRightComposable = () => {
    //环境正确,可以正确获得运行时配置
    const config = useRuntimeConfig();
    //...
}
```

## 基于目录结构的自动引入
Nuxt会自动导入以下目录的所有文件:
* `components/`,放Vue的组件;
* `composables/`,放自定义的Vue钩子函数;
* `utils/`,放一些协助函数或一些实用工具函数;

## 显式导入
如果你的代码要给不熟悉Nuxt的人看的话,你可以显式的将Vue自动帮你导入的东西,手动声明导入.  
这些Nuxt自动导入的内容,显式导入的话在`#imports`这个别名包内.
```vue
<script setup lang='ts'>
    import {ref,computed} from '#imports'
    const count = ref(1);
    const double = computed(() => count*2);
</script>
```

## 禁止自动导入
当然自动导入这个功能是默认打开的.如果你要关闭它,可以在`nuxt.config`文件中,把`imports.autoImport`设置为`false`即可.  

```ts
export default defineNuxtConfig({
    imports: {
        autoImport:false
    }
})
```

自动导入的所有东西都没有了(包括API及文件).不过你还可以从`#imports`这个包中手动导入你需要的东西.

## 自动导入的组件
Nuxt自动导入`~/components`目录下的组件,它的配置跟自动导入的可复用hooks(composables)和工具函数(utils)是分开配置的.

::: details 更多关于[自动导入的组件内容,看这.](https://nuxt.com/docs/guide/directory-structure/components)    
略微看了下,组件的名称就是文件名.如果文件所在位置是多层目录下嵌套出来的,那就逐层叠加,即`组件名=一级目录名+二级目录名+3/4/5+文件名`, 当然首字母都是要大写的.  
比如`components/base/foo/bar.vue`,组件名就叫`<BaseFooBar />`  
要关掉组件名字根据目录名称嵌套组合,要配置:
```ts
export default defineNuxtConfig({
    components:[
        {
            path:'~/components',
            pathPrefix:false
        }
    ]
})
```

:::

## 自动导入第三方包
要在Nuxt中自动导入第三方包也是可以的.
::: tip
如果你用的是Nuxt模块,那么大概你是不用手动再去配置什么了的,模块本身实现了自动导入包的功能.
:::

举个例子就是,要从`vue-i18n`包中自动导入`useI18n`这个钩子,你可以这样写:
```ts
export defineNuxtConfig({
    imports:{
        presets:[
            {
                from:'vue-i18n',
                imports:['useI18n']
            }
        ]
    }
})
```