# 数据获取
* 文档似乎是更新了,之前翻译过的内容好像分散到几个部分去了.那就跟随更新的脚步吧.

数据获取是所有应用的核心部分之一.这篇文章将教您如何使用你想的数据获取方式,以及一些较好的实践模式.  

## 我应该在服务器上获取数据,还是在客户端上呢?
要在哪个端上获取数据,取决于你要搭建的UI类型是什么.  
大部分情况下,如果你不需要实时的数据(像计票数polling这种),你可以搭配服务器组件,在服务器端上获取数据.这样做的好处有以下几点:
- 你可以在单次的服务器端-客户端过程中就能获取到数据,减少请求次数及各种客户端-服务器流水(waterfalls)
- 避免敏感信息泄露到客户端,像tokens,API密钥等等(如果真要传,起码设置个中间API路由对其进行验证.)
- 因为接近数据源头的地方,所以实际要获取的延迟也会被减少(如果适逢应用代码及数据库在相同一个服务器地区的话)
- 获取到的数据会被缓存,或对其进行重校验.

不过,在服务器端上获取数据会导致整个页面在服务器端上重渲染.如果你需要改变或重校验一些较小的UI模块,或是需要不停请求,实时更新数据的话(像直播画面等),改用客户端数据获取可能更加合适,因为它的作用之一就是允许你重渲染客户端UI上的某一特定部分.  

获取数据的方法有四种:
1. 在服务器端上,用`fetch`API
2. 在服务器端上,用ORMs或是数据库客户机(?database clients)
3. 经由客户端,调用服务器上的路由处理器
4. 在客户端上采用数据获取的第三方库.

## `fetch`API
Next将原生的`fetch`函数扩展了,这样你可以为每个服务器请求自行地配置缓存及重校验行为.你可以在服务器组件,路由处理器及Server Actions(服务器行为?)中使用`fetch`函数.   
比如说:
```tsx
// app/page.tsx

export default async function Page(){
    const data = await fetch('https://api.example.com/...').then(res => 
        res.json()
    )

    return '...'
}
```

默认`fetch`获取到的都是新的数据.调用它会使整个路由动态被动态渲染,数据也不会被缓存.  
你可以通过将`cache`配置项的值设置为`force-cache`,从而对`fetch`请求进行缓存.也就是说请求来的数据会被缓存,组件会被静态渲染.  
```js
fetch('https://...',{ cache: 'force-cache'});
```

而如果你采用了部分重渲染的策略[(PPR,Partial Prerendering)](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering),我们建议您将使用了`fetch`请求的组件,包裹在Suspense边界之内.这样可以保证只有使用了`fetch`的组件会被动态渲染和流渲染(streamed in),而不是整个页面的重渲染.

```jsx
import { Suspense } from 'react';

export default async function Cart(){
    const res = await fetch('https://api.example.com/...')
    return '...'
}

export default function Navigation(){
    return (
        <>
            <Suspense fallback={</>}>
                <Cart/>
            </Suspense>
        </>
    )
}

```

[看看更多关于缓存和重校验的信息吧](https://nextjs.org/docs/app/building-your-application/data-fetching/caching-and-revalidating)

::: tip
在Next v14及之前的版本里(?确实是earlier),`fetch`请求都会被缓存.[更多关于版本升级的指引](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
:::

### 请求记存(memoization)
如果你要在一颗组件树里的多个组件中,多次获取相同的数据的话,你不必在全局种获取,然后顺着树的顺序逐层传递下去.  
更好的做法是直接在需要该数据的组件中去获取,放心,多次相同请求可能带来的性能影响,交由我们框架来解决.  
因为对于React框架而言,相同URL,相同配置项的`fetch`请求都会被自动记住.(实际是during a React render pass,pass给我整不会了)
[更多关于请求记存](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)

## ORMs和数据库客户端(Database Clients)
你可以在服务器组件,路由处理器和Server Actions里调用ORM或数据库客户端.  
你可以使用[React cache](https://react.dev/reference/react/cache)来记住渲染过程中的数据请求.  
以下面为例子,尽管`getItem`在layout和page里都被调用了,但实际的查询请求次数只有一次:
```ts
// app/utils.ts
import { cache } from 'react';

export const getItem = cachce(async(id:string) => {
    const item = await db.item.findUnique({id});
    return item;
})

```

```tsx
// app/item/[id]/layout.tsx
import { getItem } from '@/utils/get-item'

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

export default async function Page({
    params:{id}
}:{
    params:{id:string}
}){
    const item = await getItem(id);
}

```

你还可以用两个实验性的API:`unstable_cache`,`unstable_noStore`, 自行配置这些请求的缓存和重校验行为.