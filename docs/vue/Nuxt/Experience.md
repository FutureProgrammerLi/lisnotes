# 用的时候的一些总结,杂乱无章,学到什么写什么

## 汇总
### Chapter 1

* [怎么自定义布局?](./Experience.md#布局)
* [Nuxt里怎么获取数据?又要怎么传参?(query,body.getQuery(),readBody().)](./Experience.md#数据获取与传参)
* [动态路由和动态传参([name].ts和getRouterParam())](./Experience.md#怎么动态传参-依赖值或参数发生变化时重新发送请求-getrouterparam)
* [怎么使用全局变量?](./Experience.md#全局变量)
* [怎么根据命令行切换端口?(根据开发环境切换接口地址)](./Experience.md#根据开发生产环境切换端口)
* [Nuxt里怎么使用jsx?渲染组件的方式有多少种?](./Experience.md#怎么用jsx)

### Chapter 2
是Nuxt4的callback,时隔了很久重学的一些"新"经验.(上次学已经是24/06/14了)
* [路由中间件](#组件级使用中间件)(`defineNuxtMiddleware`) (Vue Router)
* [路由参数](#路由参数) (`$route.params`)
* [导航](#导航)(declarative/programatic, validation)
* [`assets`和`public`目录的区别](#assets和public的区别)
* [状态管理及初始化](#状态管理及初始化)(两种方法:`useState`或者Pinia)
* [构建本地服务器server目录](#构建本地服务器server目录)

## 布局
### 开启布局
布局的功能也是要自己开启的:
* 1. 根目录下创建`layouts`文件夹
* 2. 创建`default.vue`,在这里编写你要的布局
* 3. 如果是全局布局,就在`app.vue`中:
```vue
<NuxtLayout>
    <NuxtPage />
</NuxtLayout>
```
::: warning
1. **每个`NuxtLayout`中必须包含`<slot/>`标签,不然只有布局,没有你的路由内容;**
2. 开启布局后,默认适用`layouts/default.vue`作为布局;如果要自定义布局,看下面.
:::

### 自定义布局
跟启用`default.vue`作为布局操作相似,只是需要指定你要用的布局是哪个.(找类似`app.vue`这个布局入口是不是有点困难?)
* 1. 在`layouts/`中创建你的布局文件`MyLayout.vue`; (记得包含`<slot/>`组件显示路由内容)
* 2. 两种方式启用(我第二种没成功):

    2.1 包裹路由内容时为其添加具体布局名称:
    ```vue
    <NuxtLayout name="my-layout">
        <NuxtPage/>
    </NuxtLayout>
    ```

    2.2 利用`definePageMeta`具体声明需要用的布局名称:
    ```vue
    <script setup lang='ts'>
    import { definePageMeta } from '#imports'; //应该可以忽略
    definePageMeta({
        layout:'my-layout'
    })
    </script>
    ```

## 数据获取与传参
Nuxt里面获取数据有三种方法:
* `useFetch`
* `$fetch`
* `useAsyncData`  

总结就是`useFetch`是`$fetch`和`useAsyncData`的合体.  
**useFetch(url) ≈ useAsyncData(key, () => $fetch(url));**  
**怎么用?** 
`useFetch`和`useAsyncData`的`option`是相似的.  
而`useAsyncData`一般又要结合`$fetch`结合使用.(具体看例子吧,感觉光说不够明显).  
### **`useFetch(URL,Options)`**
```vue
<script setup lang='ts'>
    const { data, pending ,error ,execute } = await useFetch('/api/userinfo',{
        method:'GET',
        query:{
            id:1234
        },
        params:{
            name:'li'
        };
        //这里两个传参是等价的,params只是query的别名alias
        //请求路径最终会变成/api/userinfo?id=1234&name=li
    });
    const { data, pending ,error , execute } = await useFetch('/api/auth',{
        method:'POST',
        body:{
            info:"Here's the body"
        }
    });
</script>
```



### **`$fetch`**
是`useFetch`背后实际获取数据的方法.但据说它避免不了初次渲染时的两次获取问题,所以还是建议用`useFetch`.
```vue
<script setup lang='ts'>
async function fetchData() {
    const todo = await $fetch('/api/todos',{
        method:"POST",
        body:{
            //... todo info
        }
    });
}
</script>
```
可以看到,它不能像`useFetch`那样,尽管在setup环境中,省略`async await`.

### **`useAsyncData(key,$fetch,options)`**
它跟`useFetch`在选项options上是有重叠部分的,不过`useFetch`更为全面.  

```ts
function useFetch(
    url:string | Reqeust,
    options?: FetchOptions
){}

function useAsyncData(
    key?:string,
    handler:function,
    options?:AsyncDataOptions
){}

type AsyncDataOptions = {
    server?:boolean  //是否从服务器中获取
    lazy?:boolean   //加载路由后是否resolve掉async (???原本就看不懂)
    immediate?:boolean //是否立即触发请求
    deep?:boolean   //是否需要返回的数据对象全为响应式,默认为是
    watch?:string[]  //数组内的数据变化后重新触发请求
    pick?:string[]  //从返回的数据中挑选需要的数据
    transform?:function //处理返回的数据,做一点点想要的改变
                        // transform还会拿到所有数据,pick是从这些数据筛选出来的
    dedupe?: 'cancel' | 'defer'
    default?: function | Ref | null
    getCachedData:function
}

//除了以上类型,useFetch特有的还有以下,结合了$fetch的method/url那些就不说了:
// 简单说就是请求/回复时的interceptors.
type FetchOptions extends AsyncDataOptions and FetchDataType= {  //这是什么语法?自制类型扩展语法
    onRequest:function  //请求前处理,处理请求错误 | 回复处理,处理回复错误
    onRequestError:function
    onResponse:function
    onResponseError:function
}
```

感觉可能有用的几个options就是
* `immediate`,`watch`
* `transform`,`onRequest`

*`useFetch`的传参中可以包括`computed`或`ref`响应式数据,当这些数据发生变化时会自动触发新的请求*(??? 这不就跟`watch option`功能重复了吗?)  
感觉没有重复:
* 传的参数原本就是响应式的话,不需要`watch`这个参数请求就已经可以重新触发了
* 传的参数不包含响应式,但请求依赖于其它不是参数的值的话,此时则可使用`watch`.

### 怎么在服务器中获取query或者body里的参数?

由于两种请求方法将客户端的数据放在了不同位置:  
GET时是添加到URL上;POST时是放到body上.**(GET不能利用body传参)**   
Nuxt server分别针对两种情况有对应的方法获取:
**`getQuery()`和`readBody()`**

```js
//针对GET
// /api/userinfo/index.get.ts
export default defineEventHandler((e) => {
    const query = getQuery(e);
    console.log(query); // { id:1234,name:'li'}
    return "Handle GET"
});

//针对POST
// /api/auth/index.post.ts
export default defineEventHandler(async (e) => {
    const body = await readBody(e);
    console.log(body); // {info:"Here's the body"}
    return "Handle POST";
});
```

### 怎么动态传参?依赖值或参数发生变化时重新发送请求?(getRouterParam)

先分析好具体场景:
1. URL中是否包含动态值?目标路由是否具备接收动态参数的条件?(函数返回模板字符串URL)
```ts
// 动态路由
// server/api/hello/[name.ts]
export default defineEventHandler(e => {
    const name = getRouterParam(event,'name');
    return `Hello `${name}!`
})
```
2. 请求参数中的值是否包含响应式?它发生变化时是否需要重新请求?
3. 当其它值(非请求参数)发生变化时是否需要重新请求?
```vue
<script setup lang='ts'>
    const id = ref(1);
    const anotherValue = ref(0);
    const { data } = useFetch(() => `/api/hello/${id}`,{ //注意这里的URL
        query:{
            id //id变了但不需要重新请求,其它依赖变了才重新请求要怎么处理?下面这行代码就行
            // id:id.value  //怎么用最新的id作为query请求而保留它变的时候不请求的问题?
        },
        watch:[anotherValue]
    })
</script>
```
:::warning
以上`id`和`anotherValue`**任一个值**发生变化时都会触发请求.  
`id:id.value`的话,id的值变化也不会重新发送请求,`anotherValue`变才会请求  
如果目标路由不具备处理动态路径能力的话(没有像[name]这种东西),则不需要**使用函数返回动态URL**.  
请求路径如果不是动态的,那么URL朴素无华的字符串就行,值变化请求就重新触发:
```vue
<script setup lang='ts'>
    const id = ref(1);
    const { data } = useFetch('/api/hello',{ 
        query:{
            id
        },
    })
</script>
```
:::
### useFetch和useAsyncData的返回值
* `data`,`pending`,`refresh/execute`,`clear`,`error`,`status`
* `status`包含四个状态:`idle`,`pending`,`success`,`error`

基本可以看名称判断对应功能:   
data数据,pending加载中,refresh/execute手动触发请求,clear清空对应请求进程,error请求错误,status整个请求的状态.

## 全局变量
* 在`.env`文件中定义变量,如`GLOBAL_VAR`
* 通过`process.env.GLOBAL_VAR`访问对应变量

## 根据开发/生产环境切换端口
从`.env`文件和启动时的命令入手.  
`.env`定义的是**开发和生产环境共用的环境变量**,一般有`NUXT_BASE_URL`.  
之后分别创建`.env.development`和`.env.production`两个文件,用以区分两个环境中各自的内容(像全局变量,端口等等)  
::: warning
在这里定义了PORT之后,启动的端口直接就变了,甚至不用在`nuxt.config.ts`里配置.(是不是做得太多了???)
:::

::: code-group

```text [.env]
GLOBAL_VAR = 'just a test'
NUXT_BASE_URL = localhost.com
```

```text [.env.development]
NODE_ENV = development
NUXT_ENV = development
PORT = 5000
```

```text [.env.produciton]
NODE_ENV = produciton
NUXT_ENV = produciton
PORT = 3002
```
:::

```json
"scripts":{
    //...
    "dev":"nuxt dev --dotenv .env.development",
    "pro":"nuxt dev --dotenv .env.production",
}
```
```bash
$ npm run dev  #开发环境,端口是5000
$ npm run pro  #生产环境,端口是3002
```

## 怎么用jsx
定义组件的方式有三种:
```ts 
// 对应三个不同文件,为了方便理解放在一起
// pages/index.tsx
export default defineComponent({
    render(){
        return <h1>Rendered by tsx</h1>
    }
});

// pages/posts/index.tsx
export default defineComponent({
    render(){
        return h('h1','Index page')
    }
})

// pages/preview/index.vue
<template>
    <h1>Rendered with template</h1> 
</template>
```

## 组件级使用中间件
**app/middleware/里的内容是自动引入的,跟`components`,`pages`目录一样,直接在定义中使用就可以了,不用明文引入.**

::: code-group
```js [app/middleware/test.ts]
export default defineNuxtMiddleware((to,from) => {
    console.log('middleware triggered');
})
```

```vue [pages/index.vue]
<script setup lang='ts'>
definePageMeta({
    middleware: ['test']
})
</script>
```
:::
## 路由中间件
1. 组件级中间件("Anonymous/Inline")
2. 具名路由中间件("Named")
3. 全局路由中间件("Global")

全局路由中间件运行顺序默认按字母排序运行(alphabetically)  
如果要改变,推荐使用数字prefix改变字母排序
```txt
Directory Middleware
-| middleware/
---| 01.setup.global.ts
---| 02.analytics.global.ts
---| auth.ts

不加01.02前缀的话,analytics会先于setup中间件运行
```
运行顺序: 全局 > definePageMeta里声明的顺序(匿名可以先于具名)
```vue
<script setup lang='ts'>
definePageMeta({
    middleware:[
        function(to,from){
            console.log('Inline middleware');
        },
        'test',  // 具名中间件
        ]
})
</script>
<!-- 顺序是01setup,02analytics, Anonymous Inline, test -->
```
## 路由参数
1. 动态参数
```vue
<!-- pages/user-[group]/[id].vue -->
<template>
    <h1>User {{ group }} {{ id }}</h1>
</template>
<script setup lang='ts'>
const { params:{group, id} } = useRoute();  // 不用手动引入
</script>
```
2. 捕获所有动态参数的方法[...slug]
```vue
<!-- pages/[...slug].vue -->
<!-- /user/123/456 -->
<template>
    <h1> {{$route.params.slug }}</h1> 
    <!-- 结果会是['user','123','456'] -->
</template>
```

404,error页面怎么定义?

## 导航
1. Declarative
```vue
<NuxtLink to="/">Home</NuxtLink>
<NuxtLink to="/about">About</NuxtLink>
<NuxtLink :to="{ name:'posts-id', params:{id:123}}">Posts</NuxtLink>
```
[更多关于`<NuxtLink>`组件的介绍](https://nuxt.com/docs/4.x/api/components/nuxt-link) 
* `to`: 直接是URL,或者是包含name,params,query,hash.
* `activeClass`: 激活时添加的class
* `replace`: 替换当前帧,无法后退.不声明的默认行为是`push`,可以后退

2. Programatic
```vue
<template>
    <button @click="goToPage">Somewhere</button>
</template>
<script setup lang='ts'>
const goToPage = () => {
    navigateTo({
        name:'somewhere',
        params:{
            id:123
        },
        query:{
            test:456
        },
        hash:'#sometitle'
    });
}
</script>
```




## Route validation
```vue
<script setup lang='ts'>
definePageMeta({
    validate(route){
        // 假设访问该路由时携带的动态参数为"id"
        if(!/^\d+$/.test(route.params.id)){
            return false;  // => 404
        }
        return true;  // => 正常访问
    }
})
</script>
```

## `assets`和`public`的区别
* `public`目录下的文件是可以直接用静态URL访问到的,如`/public/img/logo.png`下的文件,在元素中可以直接通过`<img src="/img/logo.png" />`访问.文件原先是怎样就怎样(as-is).  
* `assets`目录下的内容,一般你是希望通过构建工具对其进行处理,才把资源放到这里.(也就是说放这里的资源会被构建工具加工处理).填写URL时你也无法直接省略`assets`前缀,需要为:`~/assets/img/nuxt.png`.(customarily process these assets through your own plugins/loaders)

[更多关于`assets`和`public`的区别](https://nuxt.com/docs/4.x/getting-started/assets)

## 状态管理及初始化
Nuxt官方建议两种状态管理方法
* `useState` composable API, 无需额外安装模块
* Pinia, 官方开发的,需要额外安装的状态管理模块

1. `useState`
::: code-group
```js [stores/local.js]
export const useGlobalState = () => {
    const count = useState('count',() => 0);  // 第一个参数是状态的key,第二个是初始值
    const increment = () => {
        count.value++;
    }
    return {
        count,
        increment
    }
}
```

```vue [pages/index.vue]
<template>
    <button @click="increment">{{ count }}</button>
</template>
<script setup lang='ts'>
import { useGlobalState } from '~/stores/local';
const { count, increment } = useGlobalState();
</script>
```
:::

2. Pinia  
如果用的Nuxt UI添加模块的话直接就安装好,`nuxt.config`里也添加上了`modules:['@pinia/nuxt']`.之后直接在文件中用就可以了
:::code-group
```js [stores/pinia.js]
import {defineStore} from 'pinia';

export const usePiniaStore = defineStore('pinia',{
    state:() => {
        count:0
    },
    actions:{
        increment(){
            this.count++;
        }
    }
})
```

```vue [pages/index.vue]
<script setup lang='ts'>
import { usePiniaStore } from '~/stores/pinia';
const store = usePiniaStore();
</script>
<template>
    <button @click="store.increment">{{ store.count }}</button>
</template>
```
:::

### 状态初始化
都要利用`callOnce`这个util函数
* `useState`直接调用`callOnce`方法进行初始化
* Pinia则利用`defineStore`里的`actions`,还需要利用`callOnce`,对`state`中的值进行异步赋值

## 构建本地服务器server目录
直接跟`app`目录同级创建`server`目录,之后创建`/api`,`/route`,`/middleware`目录,对应的就是名字的功能.(后二者之后再深究作用,现在用到`/api`,不用自行额外创建express服务器再返回数据就够了)
[官方介绍](https://nuxt.com/docs/4.x/guide/directory-structure/server)
```js
// server/api/hello.js
export default defineEventHandler((e) => {
    return {
        message:'Hello from server'
    }
})
```

```vue 
<!-- app/pages/index.vue -->
<script setup lang='ts'>
const { data } = await useFetch('/api/hello');
</script>
<template>
    <div>{{ data.value.message }}</div>
</template>
```

### 二者结合:利用服务器数据对全局状态进行初始化
1. `useState`
::: code-group
```js [stores/local.js]
export const useGlobalState = () => {
    const message = useState('message',() => '');
    async function initializeMessage() {
        const { data } = await useFetch('/api/hello');
        message.value = data.value.message;
    }
    return {
        message,
        initializeMessage
    }
}
```

```vue [pages/index.vue]
<script setup lang='ts'>
import { useGlobalState } from '~/stores/local';
const { message, initializeMessage } = useGlobalState();
await callOnce(initializeMessage);
</script>
<template>
    <div>{{ message }}</div>
</template>
```
:::

2. Pinia
::: code-group
```js [stores/pinia.js]
import {defineStore} from 'pinia';

export const usePiniaStore = defineStore('pinia',{
    state:() => ({
        message:''
    }),
    actions:{
        async initializeMessage(){
            const { data } = await useFetch('/api/hello');
            this.message = data.value.message;
        }
    }
})
```
```vue [pages/index.vue]
<script setup lang='ts'>
import { usePiniaStore } from '~/stores/pinia';
const store = usePiniaStore();
await callOnce(store.initializeMessage);
</script>
<template>
    <div>{{ store.message }}</div>
</template>
```
:::
