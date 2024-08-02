# 重定向

Next当中实现重定向的方式有好几种.  
这篇文章会一一介绍,怎么使用,什么场景下用.也会介绍如何实现大量的重定向.
| API   | 使用目的 | 在哪里用 | 状态码|
| ---  | ---      | ---      | ---  |
| `redirect`   |    用户状态变化或事件处理时实现重定向 | 服务器组件,服务器行为(Server Actions),路由处理器 |  307(临时重定向) 或 303(服务器行为) |
| `permanentRedirect`  |  同上,变化时重定向  | 同上 | 308(永久重定向) |
|  `useRouter` |   客户端导航   |   客户端组件里的事件处理器 |  无 |
|  `next.config.js`里的`redirects` | 基于路径将接收的请求进行重定向   | `next.config.js` | 307(临时)或308(永久) |
|  `NextResponse.redirect` |   基于状态将接收的请求进行重定向 | 中间件 | 任意 |

## `redirect`函数
`redirect`函数允许用户重定向到其它的URL去.你可以在服务器组件,服务器行为和路由处理器当中使用这个函数.  
`redirect`一般还是在用户状态发生变化,或事件处理器当中被调用.举个例子,创建一条博客:
```tsx
// app/actions.tsx
'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(id:string){
    try {
        // 调用数据库操作
    } catch (error) {
        //处理错误
    }
    revalidatePath('/posts');  //更新缓存起来的博客
    redirect(`/posts/${id}`); // 重定向到新的博客页面(???)
}
```
::: tip
- 默认情况`redirect`返回状态码307,表示临时重定向.而在服务器行为中调用,则会返回303状态码,是常见的表示POST请求成功,重定向到特定页面的一个状态.
- `redirect`内部行为会抛出一个错误.因此它不应该在`try/catch`内部中被调用.
- `redirect`其实也可以在客户端组件中被调用.但这个调用是在页面渲染过程中调用的而不是在事件处理器当中.这种情况你应该用`useRouter`取而代之.
- `redirect`接受绝对路径(absolute URLs)作为参数.也就是说它可以重定向到外部链接.
- 如果你想在页面渲染之前就重定向,可以参考配置[`next.config.js`](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs)或是[使用中间件](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware).
:::

[更多关于`redirect`这个函数](https://nextjs.org/docs/app/api-reference/functions/redirect)

## `permanentRedirect`函数
要实现永久重定向,可以用`permanentRedirect`这个方法.你可以在服务器组件,服务器行为,路由处理器中调用它.  
`permanentRedirect`一般在状态变化,或是一些改变实体标准URL(?entity's canonical URL)的事件中被调用,比如用户修改了用户名后更新对应的主页URL.
```ts
// app/actions.ts
'use server'
import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache' 

export async function updateUsername(username:string, formData:FormData) {
    try {
        // 调用数据库相关操作
    } catch (error) {
        //错误处理     
    }
    revalidateTag('username'); //更新所有用户名相关的指引?(references)
    permanentRedirect(`/profile/${username}`);  //重定向到新的用户名的主页
}
```

::: tip
- `permanentRedirect`默认情况下返回308状态码,表示永久重定向.
- `permanentRedirect`接受绝对路径,可以用来重定向到外部链接.
- 如果你想在渲染过程前进行重定向,参考使用`next.config.js`或是中间件.
:::

## `useRouter()`
如果你需要在客户端组件的事件处理器中实现重定向,你可以用`useRouter()`方法返回的`push`方法.
```tsx
// app/page.tsx
'use client'
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter();
    return (
        <button onClick={() => router.push('/dashboard')}>
            Dashboard
        </button>
    )
}
```

::: tip
- 如果不需要编程式地路由切换,那可以用`<Link>`组件实现.
:::

## `next.config.js`里的`redirects`
`next.config.js`里有个`redirects`选项,用于将接收的请求路径,重定向到另外一个,不同的最终路径.  
这在你文件结构发生变化,导致整体URL发生变化时,或是你提前知道,网站内部需要有许多重定向要求的情况下,是非常有用的.  
`redirects`支持`path`,`header`,`cookie`,`查询参数匹配`的设置和功能,从而将用户的请求更灵活地实现转向.  
怎么用?在`next.config.js`里添加这个`redirects`这个选项咯:
```js
// next.config.js
module.exports = {
    async redirects(){
        return [
            // 基本的重定向功能, 将/about请求,永久重定向到/
            {
                source:'/about',
                destination:'/',
                permanent:true
            },
            // 通配符路径匹配(wildcard path matching)
            // ? 重定向到哪了? '/news/:slug'怎么理解?
            {
                source:'/blog/:slug',
                destination:'/news/:slug',
                permanent:true,             
            }
        ]
    }
}
```
(更多关于`redirects`选项的信息)[https://nextjs.org/docs/app/api-reference/next-config-js/redirects]
::: tip
- 根据`permanent`这个选项的值可以知道,`redirects`实现的重定向返回307(`permanent:false`),或是308(`permanent:true`)状态码.
- `redirects`可能在一些平台上功能受限.比如在Vercel里,允许实现的重定向数量最大值为1024个.要实现大于1024个重定向的要求,我们建议你自己制定中间件来解决.[看看这里如何解决大量重定向的问题.](https://nextjs.org/docs/app/building-your-application/routing/redirecting#managing-redirects-at-scale-advanced)
- `redirects`**先于**中间件的执行.
:::

## 中间件里的`NextResponse.redirect`
中间件的存在,允许你在请求结束前执行一些代码.也就是说你可以用中间件的`NextResponse.redirect`,根据接收到的请求,重定向到另外的URL去.一般在需要根据条件实现跳转的情况下发挥作用.(比如授权,会话管理等)也可以是有大量的重定向需求的时候.  
比如说如果用户没有被授权,那就将用户重定向到`/login`页面:
```ts
// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { authenticate } from 'auth-provider';

export function middleware(request: NextRequest) {
    const isAuthenticated = authenticate(request);

    if(isAuthenticated){
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {   //这是什么?
    matcher:'/dashboard/:path',
}
```

::: tip
- 中间件**后于**`next.config.js`里的`redirects`执行.
:::

[更多关于中间件的信息](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## 实现大量的重定向(高级应用)
(已知`next.config.js`的`redirects`在Vercel上最大允许值为1024.需要手动编写中间件实现)  
为了满足大量的重定向需求(1000+),你需要自定义中间件来实现.这种实现方式说白了就是交由程序员自行编码处理,而不用重新部署你的应用了(?).  
实现这个功能时你需要考虑:
1. 创建并存储好一个重定向图(redirect map)
2. 优化路径查询性能.(怎么更快地根据图找到目的地)
:::info
Next实例: 你可以看看我们在实际应用中事如何实现的: [Middle with Bloom filter](https://redirects-bloom-filter.vercel.app/)
:::

### 1. 创建并存储重定向图
重定向图,就是一系列的重定向起点和目的地的数据集合.你可以将它存于数据库(通常以键值对的形式存储),或直接用JSON文件也可以.  
用JSON作图,结构大概如下:
```JSON
{
    "/old":{
        "destination": "/new",
        "permanent":true
    },
    "/blog/post-old":{
        "destination":"/blog/post-new",
        "permanent":true
    }
}
```
而在中间件中,你可以从数据库(比如Vercel的Edge Config或是Redis)中获取这个图,将用户根据请求的路径重定向到对应目的路径.  
```ts
// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { get } from '@vercel/edge-config';

type RedirectEntry = {
    destination: string,
    permanent: boolean
}
export async function middleware(request:NextRequest) {
    const pathname = request.nextUrl.pathname;
    const redirectData = await get(pathname);

    if(redirectData && typeof redirectData === 'string'){
        const redirectEntry: RedirectEntry = JSON.parse(redirectData);
        const statusCode = redirectEntry.permanent ? 308 : 307;
        return NextResponse.redirect(redirectEntry.destination,statusCode);
    }

    // 没找到对应路径,不进行重定向
    return NextResponse.next();
}
```

### 2.优化数据查询性能
每次请求都要查询整个数据集这种操作是很费时费力的.以下是两种你可以用来提高查询效率的方法:
- 1. 用专门优化过查询的数据库,比如Vercel Edge Config,或是Redis
- 2. 使用数据查询策略,比如[Bloom Filter](https://en.wikipedia.org/wiki/Bloom_filter),在读取大量的重定向文件或数据库之前就确定,是否需要重定向.(??? 不查怎么知道用不用???)

参考先前的例子,你可以把生成的bloom filter文件引入到中间件里.,之后,直接校验请求路径是否存在于这个过滤器之中即可.  
如果存在,就把请求发送到路由路由处理器中,在这个处理器中查询真正的文件,重定向到对应的URL去.这样做就不用把可能包含很多数据的重定向图引入到中间件,降低请求效率了.  
```ts
// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { ScalableBloomFilter } from 'bloom-filters';
import GeneratedBloomFilter from './redirects/bloom-filter.json';

type RedirectEntry ={
    destination: string,
    permanent: boolean
}

//根据生成JSON文件,初始化bloom filter
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter as any);

export async function middleware(request:NextRequest) {
    // 获取请求路径
    const pathname = request.nextUrl.pathname;

    // 校验路径是否存在于bloomFilter
    if(bloomFilter.has(pathname)){
        // 将路径转发给专门处理的路由事件处理
        const api = new URL(
            `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
            request.nextUrl.origin
        )
        try {
            // 查询真正的,需要重定向的目的地
             const redirectData = await fetch(api);
             if(redirectData.ok){
                const redirectEntry: RedirectEntry | undefined = await redirect.json()
                if(redirectEntry){
                    // 根据图的信息设置状态码
                    const statusCode = redirectEntry.permanent? 308 : 307;
                    return NextResponse.redirect(redirectEntry.destination,statusCode)
                }
             }
        } catch (error) {
            console.error(error);
        } 
    }
    //不需重定向
    return NextResponse.next()
}
```

而在`/api/redirects`这个路由处理器中,可以这样写:
```ts
// app/redirects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import redirects from '@/app/redirects/redirects.json'

type RedirectEntry = {
    destination: string,
    permanent: boolean
}

export function GET(request:NextRequest) {
    const pathname = request.nextUrl.searchParams.get('pathname');
    if(!pathname){
        return new Response('Bad request', {status:400});
    }

    //从redirects.json文件中获取真实的重定向数据
    const redirect = (redirects as Record<string,RedirectEntry>)[pathname];
    //规避bloom filter错误查询的情况
    if(!redirect){
        return new Response('No redirect',{ status: 400});
    }
    return NextResponse.json(redirect)
}
```
::: tip
- 要生成bloom filter,布隆过滤器,可以用`bloom-filters`这个库.
- 你应该先校验请求的合法性再进行以上的查询工作,避免恶意请求.
:::

## 接下来
* [`redirect`](https://nextjs.org/docs/app/api-reference/functions/redirect)
* [`permanentRedirect`](https://nextjs.org/docs/app/api-reference/functions/permanentRedirect)
* [`中间件`](https://nextjs.org/docs/app/building-your-application/routing/middleware)
* [`redirects`选项](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)