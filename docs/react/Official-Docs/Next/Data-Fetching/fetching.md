# 数据获取
> 文档似乎是更新了,之前翻译过的内容好像分散到几个部分去了.那就跟随更新的脚步吧.  

数据获取是所有应用的核心部分之一.这篇文章将教您如何使用你想的数据获取方式,以及一些较好的实践模式.
## 我应该在服务器上获取数据,还是在客户端上呢?
要在哪个端上获取数据,取决于你要搭建的UI类型是什么.  
大部分情况下,如果你不需要实时的数据(像计票数polling这种),你可以搭配服务器组件,在服务器端上获取数据.  
这样做有以下几点好处:
- 你可以在单次的服务器端-客户端过程中就能获取到数据,减少请求次数及各种客户端-服务器流水(waterfalls)
- 避免敏感信息泄露到客户端,像tokens,API密钥等等(如果真要传,起码设置个中间API路由对其进行验证.)
- 因为接近数据源头的地方,所以实际要获取的延迟也会被减少(如果适逢应用代码及数据库在相同一个服务器地区的话)
- 请求可以被缓存和重新发起.

不过,在服务器端上获取数据会导致整个页面在服务器端上重渲染.如果你需要改变或重校验一些较小的UI模块,或是需要不停请求,实时更新数据的话(像直播画面等),改用客户端数据获取可能更加合适一些,因为它的作用之一就是允许你重渲染客户端UI上的某一特定部分.  

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

## 第三方的数据获取库
你可以在客户端组件里用像[SWR](https://swr.vercel.app/),[ReactQuery](https://tanstack.com/query/latest)这样的三方数据获取库.这些库对于数据获取的缓存,重校验及数据修改有自己的实现,可以根据对应框架相应学习.  
比如说用SWR在客户端中周期性地获取数据:

```js
"use client"
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';

export default function PollingComponent() {
    // 每2000毫秒重新获取一次数据
    const { data } = useSWR('/api/data',fetcher,{refreshInterval: 2000});

    return '...'
}
```

## 路由处理器
如果你需要自行创建API终端(endpoints)的话,Next也提供路由处理器的功能(Route Handlers).它们是在服务器上运行的,防止一些像API证书这样的敏感信息暴露给客户端.  
比如说,用SWR调用一次路由处理器:
```tsx
// api/ui/message.tsx
'use client'
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';

export default function Message() {
    const { data } = useSWR('/api/messages',fetcher);
    return '...'
}

```

```ts
// app/api/messages/route.ts
export async function GET(){
    const data = await fetch('https://...',{
        headers:{
            'Content-Type': 'application/json',
            'API-KEY':process.env.DATA_API_KEY,
        }
    }).then(res => res.json());

    return Response.json({data})
}

```

[更多使用路由处理器的例子](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 模式
### 平行数据获取和顺序数据获取(parallel and sequential)
在组件中获取数据的模式有两种: 平行获取和顺序获取.
![patterns-of-fetching-data](imgs/sequential-parallel-data-fetching.jpg)
- **顺序获取:** 组件内的请求相互依赖.这样可能会使加载时间变得更长.
- **平行获取:** 路由里的请求会即时主动发出(eagerly initiated),同时加载数据.这样能减少加载数据所需的总时间.

#### 顺序获取数据
如果你的组件是嵌套的,每个组件内部各自获取属于自己的数据,而请求自身又没有记忆机制的话,那么它们就会按顺序地逐个发出请求.  
这种模式的适用场景一般是,一个请求的开始,依赖于另一个请求的结束.  
比如说,以下的`Playlists`组件只会在`Artist`组件的请求结束后,才开始获取自身需要的数据.因为`Playlist`依赖于`artistID`这个需要通过请求获得的属性:
```tsx
// app/artist/[username]/page.tsx
export default async function Page({
    params:{username},
}:{
    params:{username: string}
}){
    const artist = await getArtist(username);

    return (
    <>
      <h1>{artist.name}</h1>
      {/* 请求artist时,展示一个加载中信息提示 */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* 将artistID传给Playlists组件 */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
    )
}

async function Playlists({artistID} : {artistID: string}){
    const playlists = await getArtistPlaylists(artistID);

    return (
        <ul>
            {playlists.map((playlist) => (
            <li key={playlist.id}>{playlist.name}</li>
            ))}
        </ul>
    )
}

```

你可以在React流式渲染结果的过程中,利用`loading.js`(路由分块层级),或是`React <Suspense>`(路由嵌套层级),向用户展示一个即时的加载状态告知.  
这样做能防止数据获取阻碍路由内容的展示,以及,用户能尽早地在加载好了的部分实现互动.

#### 平行获取数据
默认情况下,布局和页面分块是平行渲染的.也就是说,请求的初始化(initiated)也是平行进行的.  
不过,由于`async/await`本身的行为限制,一个请求的执行必然会阻塞其之后的任意请求代码(不单是请求).  
为了实现平行获取数据,你可以将组件内需要通过请求获取的数据,在组件外定义如何获取.这样平行地初始化所有请求,可以节省掉一些时间(?).而且用户只会在所有请求都结束后才看到最终的渲染结果.(?)  
以下的例子中,`getArtist`和`getAlbums`就是定义在组件之外,并在组件内用`Promise.all`同时地发出请求:
```tsx
// app/artist/[username]/page.tsx
import Albums from './albums';


//组件外定义如何获取
async function getArtist(username: string){
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}

async function getAlbums(username: string){
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}

// 
export default async function Page({
    params: { username }
}: {
    params: { username: string }
}){

    // 组件内需要通过请求获取地数据
    const artistData = getArtist(username);
    const almbumsData = getAlbums(username);

    // 同时发出请求
    const [artist, albums] = Promise.all([artistData,almbumsData]) 

    return (
        <>
            <h1>{artist.name}</h1>
            <Albums list={albums} />
        </>
    )
}
```

除此之外,你可以添加Suspense边界,将渲染工作分开多个,尽可能快地某些加载完的部分展示给用户.

## 预加载数据
另一种防止流水式渲染(waterfalls)的方法是利用预加载机制,在请求阻塞之前调用一个自己创建的工具函数.  
比如说,`checkIsAvailable()`阻塞了`<Item />`组件的渲染,那你可以在渲染前就调用`preload()`,到`<Item/>`组件被渲染出来时,对应的数据早已被获取到了.(?)  
注意,`preload()`函数不会阻塞`checkIsAvailable()`的执行.
```tsx
// components/items.tsx
import { getItem } from '@/utils/get-item';

export const preload = (id:string) => {
    // void会评估执行(evaluate)之后的代码,返回undefined值
    // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/void
    void getItem(id)
}

export default async function Item({id} : {id:string}){
    const result = await getItem(id);
    // ...
}

```

```tsx
// app/item/[id]/page.tsx
import Item, { preload, checkIsAvailable } from '@/component/Item';

export default async function Page({
    params:{id},
    }:{
    params:{
        id: string
    }
}){
    preload(id);
    const isAvailable = await checkIsAvailable();

    return isAvailable? <Item id={id} /> : null;
}   

```

::: tip
这里的`preload`可以是其它名字,这是自定义的,不是框架内部API.
:::

### 配合`cache`和`server-only`使用预加载模式
你可以结合`cache`函数,`server-only`包,`preload`模式,搭建一种整个应用都适用的数据获取方式.
```ts
// utils/get-item.ts
import { cache } from 'react'
import 'server-only';

export const preload = (id: string) => {
    void getItem(id);
}


export const getItem = cache(async (id:string) => {
    // ..
})
```
这样做的好处是可以尽早获取数据,缓存响应内容以及确保[数据获取仅在服务器上发生](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment).  

因为这个获取方式是从`utils/get-item`中导出的,所以它可以被任意布局/页面/组件使用,可以将数据的处理交由各自组件,自行实现.  
::: tip
- 我们建议使用`server-only`包,来确保获取数据的函数不会再客户端上执行.
:::

## 防止向客户端暴露敏感信息
我们推荐使用React提供的污点API(?taint APIs),`taintObjectReference`和`taintUniqueValue`,防止将整个对象实例或是一些敏感值发送到客户端.  
要启用这种功能,你需要在Next的配置文件中,设置`experimental.taint: true`:
```js
// next.config.js
module.exports = {
    experimental:{
        taint: true,
    }
}

```
然后将你想"加点料(taint)"的对象或值传给`experimental_taintObjectReference`或`experimental_taintUniqueValue`函数.
```ts
// app/utils.ts
import { queryDataFromDB } from './api'
import { 
    experimental_taintObjectReference,
    experimental_taintUniqueValue,
} from 'react'

export async function getUserData(){
    const data = await queryDataFromDB();
    experimental_taintObjectReference(
        'Do not pass the whole user object to the client',
        data
    );
    experimental_taintUniqueValue(
        "Do not pass the user's address to the client",
        data,
        data.address
    )

    return data
}

```

```tsx
// app/page.tsx
import { getUserData } from './data'

export async function Page(){
    const userData = await getUserData();
    return (
        <ClientComponent
            user={userData} // 这会报错,因为taintObjectReference的作用
            address={userData.address} // 这也会报错,因为taintUniqueValue
        />
  )
}

```