# 数据获取,数据缓存及重校验

数据获取是所有应用的核心部分之一.这篇文章将指导你如何在React和Next应用中,获取/缓存/重校验(revalidate)数据.  

获取数据的方法有四种:
1. 在服务器端上,用`fetch`
2. 在服务器端上,用第三方库
3. 在客户端上,用路由处理器(Route Handler)
4. 在客户端上,用第三方库.

## 在服务器端上用`fetch`获取数据
Next将原生的`fetch`函数扩展了,这样你可以为每个服务器请求自行地配置缓存及重校验行为.React则扩展了`fetch`,在渲染组件树的同时,自动将fetch请求记忆起来.(memoize)  

你可以在服务器组件,路由处理器及Server Actions(服务器行为?)中,配合`async/await`使用`fetch`函数.  
举个例子:
```tsx
// app/page.tsx
async function getData(){
    const res = await fetch('https://api.example.com/...');
    // 这样请求回来的值是 *没有*被序列化的
    // 因此返回的值甚至可以是Date/Map/Set等类型

    if(!res.ok){
        // 这里会渲染跟这个页面最接近的错误边界.
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function Page(){
    const data = await getData();

    return <main></main>
}

```

::: tip
- Next提供了一些像`cookies`和`headers`这样的工具函数,从而让你在服务器组件中获取数据时,对请求进行一些额外的操作.这也会导致页面会被动态渲染,因为这些操作依赖于请求时的具体信息.
- 在路由处理器中,`fetch`请求不会被记住,因为路由处理器并不是组件树的一部分.
- 服务器行为中,`fetch`请求是不会被缓存的.(默认`cache: no-store`)
- 服务器组件中,要同时使用`async/await`和Typescript,版本支持至少是:Typescript `5.1.3`, `@type/react 18.2.8`.
:::

### 缓存数据
数据缓存就是将你获取过的数据存储起来,从而不必每次请求的时候都进行重新获取.  
默认情况下,Next会自动将`fetch`返回来的值,缓存到服务器上一个叫[`Data Cache`的地方](https://nextjs.org/docs/app/building-your-application/caching#data-cache).也就是说,数据可以在打包或请求时获取,它们都会被缓存起来,能重用就重用.
```js
// 默认值就是'force-cache',可以忽略
fetch('https://...',{ cache: 'force-cache'});
```

然而,`fetch`对数据的缓存是有例外的,以下情况就不会缓存:
- 在Server Actions里用`fetch`
- 在路由处理器中的`POST`请求

::: info
**`Data Cache`是什么东西?**  
Data Cache是一种持久的[HTTP缓存](https://developer.mozilla.org/docs/Web/HTTP/Caching).这个缓存可以根据你所在的平台自动扩充,并[在多个地方(regions)共享](https://vercel.com/docs/infrastructure/data-cache).  
[更多关于Data Cache的信息](https://nextjs.org/docs/app/building-your-application/caching#data-cache)
:::

### 数据重校验
重校验是删除某个请求在Data Cache里的内容,通过重新获取的方式,取得最新数据的一个过程.这在数据发生变化,需要保证最新数据的场景下有所用处.  
对缓存数据进行重校验的方法有两种:
- **基于时间的重校验:** 过了一段既定的时间后自动重新校验数据.一般一些不经常改变的,数据实时性没那么重要的数据会采用这种方案.
- **按需重校验:** 根据某个事件手动触发重校验(比如表单提交时).按需重校验可以用基于标识(tag-based)或基于路径(path-based)的方法,一次将多组数据进行重校验.这在你需要尽可能快地展示最新数据的场景较为有用(比如无头部内容管理系统(Headless CMS)的内容需要更新)

#### 基于时间的重校验
你可以在`fetch`选项的`next.revalidate`属性上,为数据获取添加一个时间间隔,从而为`fetch`获取到的数据缓存设置一个生存时间.(?为什么是设置缓存多久而不是多久触发?缓存没了不代表请求会被重新发送吧?)
```js
fetch('https://...',{ next: { revalidate: 3600 }})
// 需要是静态值而不能是evaluated的值, 60 * 60也不可以, 单位是秒
```

如果你要重校验一个路由分块内的所有`fetch`请求,你可以用[分块配置项(Segment config options)](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)

```js
// layout.js | page.js
export const revalidate = 3600 // 至多每小时对整个页面的fetch请求进行重校验操作.
// 上面是单个fetch层面,这个是整个页面.
```

如果一个静态渲染的路由中有多个不同频率重校验的请求,那这些频率之中的最小值则会作为所有请求的重校验时间.(???那我不同频率的设置还有什么用???哦针对的静态渲染路由).  
而对于动态渲染的路由,每个请求的重校验都是各自独立的.(关键区别是**静态和动态渲染**)  
[更多关于基于时间的重校验](https://nextjs.org/docs/app/building-your-application/caching#time-based-revalidation)

#### 基于需求的重校验
基于需求重校验,就可以根据路径变化`revalidatePath`,或是Server Actions或路由处理器的缓存标签(revalidateTag)变化,触发重校验.  
Next.js有一整个缓存系统来避免不同路由间的`fetch`请求冲突(invalidate fetch).
1. 你可以在`fetch`当中,对缓存项打一个或多个标签
2. 然后你可以调用`revalidateTag`,对所有打了某个标签的缓存项进行重校验.  
比如说,以下的`fetch`请求则添加了`collection`这个缓存标签:
```tsx
// app/page.tsx
export default async function Page() {
    const res = await fetch('https://...',{ next:{ tags: ['collection'] }});
    const data = await res.json();
    // ...
}
```

然后你可以在Server Action里调用`revalidateTag`,重新校验这个带有了`collection`的`fetch`请求:
```ts
'use server';
import { revalidateTag } from 'next/cache'

export default async function action(){
    revalidateTag('collection');
}

```
[更多关于按需重校验](https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation)

#### 错误处理及重校验
如果在尝试重校验的时候报错了,那重校验的结果就是缓存中,上一次成功获取的数据.在之后的请求中,Next再重新校验相应数据.(?)

### 选择不用数据缓存
以下条件下`fetch`请求不会被缓存:
- `fetch`配置项设置了`cache:no-store`
- `fetch`请求内部设置了`revalidate:0`
- 路由处理器中,用了`POST`方法的`fetch`
- 使用了`headers`或`cookies`之后的`fetch`请求(?这里指工具函数吗?)
- 路由分块里,设置了`const dynamic = 'force-dynamic'`
- 专门设置默认跳过缓存的`fetchCache`路由分块
- 头部包含了`Authentication`或`Cookies`,以及组件树以上包含了一个不被缓存的请求的`fetch`请求.(?这么苛刻)

#### 针对单独的`fetch`请求
在单独的`fetch`请求中选择不用缓存,可以在`fetch`的第二个参数里,设置配置项,`cache:no-store`.这样就能在每次请求中都动态获取数据了.
```js
// layout.js | page.js
fetch('https://...',{ cache: 'no-store'})
```

[更多关于`cache`选项的可选值](https://nextjs.org/docs/app/api-reference/functions/fetch)(其实就两个,`force-cache`和`no-store`)

#### 针对多个`fetch`
如果你在路由分块中(布局或页面内)有多个请求都不需要用到缓存,那你可以在路由分块层面进行配置.主要是`const fetchCache = auto`这个值来控制.[更多可选的值](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)  
不过我们还是建议您针对每一个`fetch`请求,单独地控制其缓存行为.这样能为你提供更加细粒度的请求控制.

## 在服务器端上,用第三方库获取数据
如果你用的获取数据的三方库不支持或没有暴露`fetch`方法,那你可以选择用路由分块的配置项或React提供的`cache`函数来控制这些请求的缓存和重校验行为.(像数据库,CMS,ORM客户端等三方库)  
请求的数据是否被缓存,取决于所在的路由分块是静态渲染还是动态渲染的.如果是静态的(默认情况),那请求的数据就会作为路由的部分内容,被缓存下来并被重校验(?).而要是动态的,那请求的结果则不会被缓存,每次分块渲染时都会重新发起所有数据请求.  
你也可以使用实验性API[`unstable_cache`](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)来进行更多的控制.

### 例子
以下例子中:
- 我们用了React的`cache`函数来"记忆"数据请求
- 路由设置项`revalidate`的值设为了`3600`,也就是说对应的布局和页面分块内,数据会被缓存1小时,每小时发起一次数据请求.
```ts
// app/utils.ts
import { cache } from 'react'

export const getItem = cache(async (id:string) => {
    const item = await db.item.findUnique({id});  //这里的三方库就是数据库操作
    return item;
})
```

尽管`getItem`被调用了两次,实际只会对数据库进行一次查询.
```tsx
// app/item/[id]/layout.tsx
import { getItem } from '@/utils/get-item'
export const revalidate = 3600;

export default async function Layout({
    params:{id}
}:{
    params:{id:string}
}){
    const item = await getItem(id)
    //...
}
```

```tsx
// app/item/[id]/page.tsx
import { getItem } from '@/utils/get-item'
export const revalidate = 3600;

export default async function Page({
    params:{id}
}:{
    params:{id:string}
}){
    const item = await getItem(id);
    // ...
}

```

## 客户端上用路由处理器获取数据
如果你需要在客户端组件上获取数据,那你可以在客户端上调用路由处理器.路由处理器就是用来接收客户端请求,在服务器端上处理请求,再将数据返回给客户端的.如果你不想向客户端暴露像API tokens这样的敏感信息的话我们建议你使用这种办法.  
相应的[路由处理器获取数据例子可以看看这里](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

::: info
**服务器组件和路由处理器**  
服务器组件是直接在服务器端上渲染的,因此,你不必在服务器组件中再调用路由处理器来获取数据.你可以直接在服务器租价中获取数据.
:::

## 客户端上用三方库获取数据
当然,你还可以在客户端上用三方数据获取库,像[SWR](https://swr.vercel.app/),[TanStack Query](https://tanstack.com/query/latest)等等.这些三方库有自己记忆,缓存,重校验请求,及修改数据的方法.

::: info
**未来的API:**  
`use`是一个React函数,用来接收并处理由另一个函数返回的promise.目前我们不建议在客户端里,将`fetch`请求包裹在`use`函数内,因为这样可能会导致多次重渲染.[更多关于`use`函数的内容可以去React官网看看.](https://react.dev/reference/react/use)
:::
