# 中间件

中间件的作用是在你完成某个请求之前,运行一些代码.然后,你可以根据这个请求,对这个请求的响应进行重写,重定向,修改请求头或响应头,或是直接响应.  
中间件的运行先于缓存匹配和路由匹配.你可以[看看这里的匹配路径了解更多细节.](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths)

## 使用场景
将中间件整合到你的应用中,能很好地提升应用的性能,安全性以及用户体验.以下是一些中间件派上用场的场景:  
- 认证及授权(Authentication & Authorization): 在用户访问特定页面或请求某个API之前,确认请求用户的身份及检查对话cookies.
- 服务器端重定向: 根据某些特定的条件,在服务器端将重定向到其它地方.(比如不同的地区或用户角色身份)
- 路径重写:支持A/B测试,[特性初展(feature rollouts)](https://vwo.com/glossary/feature-rollout/),甚至是些过时的路径(legacy paths).你可以在中间件里根据请求的一些属性,动态地将某些API路由或页面路径重写为其它.
- 机器人校验: 通过人工校验和阻挡机器人请求,保护你的服务器资源.
- 日志注册和数据分析: 在用户访问某个页面或进行某个请求前,捕获并对用户的请求信息进行分析.
- [功能切换(Feature Flagging)](https://featureflags.io/feature-flags/):在功能初展或测试的时候,无缝地将某些功能启用或是关闭.  

了解了中间件在哪些场景有用后,接着了解哪些场景不可用也是很重要的.以下这些情况我们建议您谨慎选用中间件:
- 复杂的数据获取和操作: 中间件设计的初衷就不是用来获取数据或操控的.这种功能的实现应该交给路由处理器或服务器端工具库来完成.(专业事专业"人"做)
- 繁琐的计算任务: 中间件的代码执行量应该是轻量(lightweight)的,这样才能在页面加载的时候尽快响应客户端,少产生延迟.同样,计算繁琐的任务或比较耗时的一些操作应该交给专门的路由处理器处理.
- 大量的会话管理: 尽管中间件能够处理一些较为基础的会话,但当管理任务较多,那还是交给专门的认证服务或是路由处理器吧(authentication services or route handlers).
- 直接对数据库进行操作: 我们不建议您直接通过中间件对数据库进行操作.数据库操作应交由路由处理器或服务器工具库来完成.

## 使用习惯
你可以在项目的根目录下定义`middleware.ts`(或`.js`)文件,在里面编写你自己的中间件.比如说在`pages`或`app`同级的目录下,或是`src`目录下(如果有使用这种项目管理方式的话)
::: info
尽管每个项目仅支持一个`middleware.ts`文件,你依然可以按照逻辑模块划分你的中间件.方法就是将不同的中间件功能,划分成不同的`ts`,`js`文件,然后在最顶层的`middleware.ts`文件中导入它们.这样可以更简洁地管理不同路由间的中间件,汇总在顶层`middleware.ts`来集中管理.  
这样强制地只允许一个中间件文件,而不是多个层级中间件的方法,能简化项目的配置,避免潜在的一些冲突,以及优化项目性能.
:::

## 例子
```ts
// middleware.ts
import { NextResponse } from 'next/serer';
import type { NextRequest } from 'next/server';

// 如果内部需要用`await`, 则外部可以定义为async function
export function middleware(request: NextRequest){
    return NextResponse.redirect(new URL('/home',request.url));
}

// 这里的作用可以看看下面的'Matching paths',匹配路径内容
export const config = {
    matcher: ' /about/:path'
}

```

## 匹配路径
中间件会在你每个路由被请求时都执行.既然被执行的可能如此高,那选择什么时候才执行什么中间件则显得比较重要了.  
所以我们需要使用匹配器(matchers)来对请求和中间件进行匹配,在特定情况下,才/不执行中间件.  
以下是执行的顺序:
1. `next.config.js`中的`headers`
2. `next.config.js`中的`redirects`
3. 中间件(`rewrites`,`redirects`等等)
4. `next.config.js`中的`beforeFiles`(`rewrites`)
5. 文件系统路由(`public/`,`_next/static/`,`pages/`,`app/`等等)
6. `next.config.js`中的`afterFiles`
7. 动态路由(`/blog/[slug]`)
8. `next.config.js`中的`fallback`(`rewrites`)

定义中间件执行路径的方式有两种:(都在下面有介绍)
1. [自定义的匹配模式设置](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)
2. [条件语句](https://nextjs.org/docs/app/building-your-application/routing/middleware#conditional-statements)

### 匹配器
`matcher`的作用就是过滤特定的中间件执行路径
```ts 
// middleware.ts
export const config = {
    matcher:'/about/:path*'
}

```

你可以用数组的方法匹配单个或多个路径:

```ts 
// middleware.ts
export const config = {
    matcher:['/about/:path*','/dashboard/:path*']
}

```

`matcher`支持完整的正则匹配,所以像负向预查(negative lookaheads)或字符匹配也是可以的.以下就是一个负向预查,用以匹配特定路径之外的所有路径:
```js
// middleware.js
/*除了以下开头的请求,其它请求都是匹配的(中间件会被执行)
 - api(API请求)
 - _next/static(静态资源)
 - _next/image(图片资源)
 - favicon.ico(图标资源)
*/

export const config = {
    matcher:[
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}

```

你也可以用`missing`或`has`,或二者结合来为特定的请求,忽略使用中间件处理:
```js
export const config = {
    matcher: [
        {
            source:'/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing:[
                {type: 'header', key:'next-router-prefetch'},
                {type: 'header', key:'purpose', value:'prefetch'}
            ]
        },
        {
            source:'/((?!api|_next/static|_next/image|favicon.ico).*)',
            has:[
                {type: 'header', key:'next-router-prefetch'},
                {type: 'header', key:'purpose', value:'prefetch'}
            ]
        },
        {
            source:'/((?!api|_next/static|_next/image|favicon.ico).*)',
            has:[{type: 'header', key:'x-present'}],
            missing:[{type: 'header', key:'x-missing', value:'prefetch'}]
        },
    ]
}

```

::: tip
`matcher`的值必须为常量,这样才能在打包的时候进行静态分析.如果是像变量一样的动态值,会被直接忽略.
:::

自己配置的匹配器有以下要求:
1. 必须以`/`开头
2. 可以包括具名参数:`/about/:path`会匹配`/about/a`,`/about/b`,但不会匹配`/about/a/c`
3. 可以为具名参数添加修饰符*(以`:`开头):`/about/:path*`能够匹配`/about/a/b/c`,因为`*`的意思是可以没有,或是多个;而`?`表示没有或只有一个 ;`+`表示至少一个或多个.
4. 可以在括号内使用正则表达式:`/about/(.*)`和`/about/:path*`是一样的.

::: tip
为了向后兼容,Next.js的理解中,`/public`跟`/public/index`是一样的,也就是说`/public/:path`会匹配到`/public`这个路径.
:::

### 条件语句
```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request:NextRequest) {
    if(request.nextUrl.pathname.startsWith('/about')){
        return NextResponse.rewrite(new URL('/about-2',request.url))
    }

    if(request.nextUrl.pathname.startsWith('/dashboard')){
        return NextResponse.rewrite(new URL('/dashboard/user',request.url))
    }
}

```

## `NextResponse`
`NextResponse`的作用有以下:
- 将当前请求`redirect`重定向到另外的URL去
- 重写`rewrite`某个特定的URL响应.(displaying a given URL?)
- 为API路由、`getServerSideProps`,`rewrite`目标地址设置请求头
- 设置响应cookies
- 设置响应头

如果在中间件里就作出响应,你可以:
1. `rewrite`到一个路由(可以是页面也可以是路由处理器),在这个路由中作出响应
2. 直接返回一个`NextResponse`. [更多关于作出响应](https://nextjs.org/docs/app/building-your-application/routing/middleware#producing-a-response)

## 使用Cookies
Cookies是一种常用的头部内容(请求头或响应头).在`Request`对象上,它存储在`Cookie`这个属性上.而`Response`,则在`Set-Cookie`上.Next.js提供了一些便于读取及操作Cookies的方法,就是在`NextRequest`和`NextResponse`的`cookies`属性上.  
1. 对于请求处理,`cookies`属性有以下操作:`get`,`getAll`,`set`,`delete`.你也可以通过`has`方法检查某个cookie值得存在,或是用`clear`方法清空所有cookies.
2. 对于响应发送,`cookies`也有`get`,`getAll`,`set`,`delete`这些方法.
```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middlware(request: NextRequest){
    // 假设要处理的请求中,带有"Cookie:nextjs=fast"这个请求头
    // 用`RequestCookies`API来获取请求头
    let cookie = request.cookies.get('nextjs');
    console.log(cookie);
    const allCookies = request.cookies.getAll();
    console.log(allCookies);  //[{name:'nextjs',value: 'fast'}];
    
    request.cookies.has('nextjs'); //true
    request.cookies.delete('nextjs');
    request.cookies.has('nextjs'); //false

    // 在响应头中设置新的cookies
    const response = NextRequest.next(); // ??这是什么
    response.cookies.set('vercel','fast');
    response.cookies.set({
        name: 'vercel',
        value:'fast',
        path:'/',
    });
    cookie = response.cookies.get('vercel');
    console.log(cookie); // { name:'vercel', value:'fast', path:'/'}
    // 以上的结果是在响应头里,有个`Set-Cookie:vercel=fast;path=/`
    return response;
}
```

## 头部设置
你可以用`NextResponse`这个API设置请求头和响应头.(请求头的设置需要Next v13.0+)
```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middlware(request:NextRequest){
    // 将请求头内容复制下来,并设置一个新的头部`x-hello-from-middleware1`
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hello-from-middlware1','hello');

    //你也可以通过`NextResponse.rewrite`额方法设置请求头(???)
    const response = NextResponse.next({
        reqeust:{
            // 这里是需要的新请求头
            headers: requestHeaders
        }
    });

    // 设置一个新的响应头
    response.headers.set('x-hello-from-middleware2','hello');
    return response;
}
```

::: tip
请不要将太多内容放在头部,因为这可能会导致报错,[`状态码431, 请求头内容量过大`](https://developer.mozilla.org/docs/Web/HTTP/Status/431)的问题.是否出错取决于你后端服务器的配置.
:::

### CORS
你可以在中间件中设置CORS请求头,从而实现跨域请求,当中也包括一些[简易](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)或[预检](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests)的请求.

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const allowOrigins = ['https://acme.com','https://my-app.org'];
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middlware(reqeust:NextRequest){
    // 检查请求源
    const origin = reqeust.headers.get('origin') ?? '';
    const isAllowedOrigin = allowOrigins.includes(origin);

    // 处理预检请求
    const isPreflighted = reqeust.method === 'OPTIONS';
    if(isPreflighted){
        const preflightHeaders = {
            ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
            ...corsOptions,
        };
        return NextResponse.json({},{headers:preflightHeaders});
    }

    // 处理简易请求
    const response = NextResponse.next();
    if(isAllowedOrigin){
        response.headers.set('Access-Control-Allow-Origin',origin);
    }
    Object.entries(corsOptions).forEach([key,value] => {
        resposne.headers.set(key,value)
    });
    return response;
}

export const config = {
    matcher:'/api/:path'
}

```
::: tip
你也可以在路由处理器中,为个别的路由专门设置CORS头部.
:::

## 作出响应
你可以在中间件通过返回`Response`或`NextResponse`实例,直接对请求作出响应.(Next v13.1.0版本后的特性)
```ts
// middlware.ts
import { NextRequest } from 'next/server';
import { isAuthenticated } from '@lib/auth';

// 仅对`/api/`开头的请求路径使用该中间件
export const config = {
    matcher: '/api/:function*',
}

export function middleware(request:NextRequest) {
    // 调用工具函数isAuthenticated,校验请求合法性
    if(!isAuthenticated(reqeust)){
        // 返回个JSON信息,告知请求错误
        return Response.json(
            { success:false,message:'authentication failed'},
            { status: 401}
        )
    }
}
```

### `waitUntil`和`NextFetchEvent`
`NextFetchEvent`这个对象扩展了原生的`FetchEvent`对象,前者还包含了一个`waitUntil`方法.  
这个`waitUntil`方法接收一个promise作为参数,并将中间件的执行时间,延长到了这个promise参数执行完毕后.这对于某些需要在后台执行的任务可能有用:
```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

export function middlware(req:NextRequest, event: NextFetchEvent){
    event.waitUntil(
        fetch('https://my-analytics-platform.com',{
            method:'POST',
            body: JSON.stringify({pathname: req.nextUrl.pathname})
        })
    )
    return NextResponse.next();
}

```

## 高级中间件标识
在Next `v13.1`版本中,我们为中间件添加了两个高级标识符:`skipMiddlwareUrlNormalize`和`skipTrailingSlashRedirect`.用来处理一些高级使用场景.  
`skipTrailingSlashRedirect`的作用是禁止Next,为重定向路径添加或删除[结尾斜线(trailing slash).](https://en.ryte.com/wiki/Trailing_Slashes/)通过这种可选的配置处理,我们能为一些路径保留结尾斜线,而为另一些路径不保留.这样做也让增量迁移(incremental migrations)变得更为容易.
```js
// next.config.js
module.exports = {
    skipTrailingSlashRedirect: true,
}
```

```ts
// middlware.ts
const legacyPrefixes = ['/docs', '/blog'];

export default async function middlware(req){
    const { pathname } = req.nextUrl;
    if(legacyPrefixes.some(prefix => pathname.startsWith(prefix))){
        return NextResponse.next();
    }

    // 添加结尾斜杠
    if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
    ) {
    req.nextUrl.pathname += '/'
    return NextResponse.redirect(req.nextUrl)
  }
}
```

`skipMiddlwareUrlNormalize`的作用则是,禁止Next对URL进行标准化,从而相同地看待直接访问及客户端切换(client-transitions?)两种行为.一些高级应用中,这个选项就能通过源URL进行更全面的控制了.
```js
// next.config.js
module.exports = {
    skipMiddlwareUrlNormalize:true
}
```

```js
// middlware.js
export default async function middlware(req){
    const { pathname } = req.nextUrl;

    // 对`/_next/data/build-id/hello.json`路径发送GET请求
    console.log(pathname);
    // 如果开启了这个flag,pathname的值就会是`/_next/data/build-id/hello.json`

    //而如果关闭了,则会被标准化为`/hello`
}

```

## 运行时环境
目前,中间件仅在Edge运行时环境支持,而在Node.js环境下是不可用的.

## 历史版本

| 版本号   | 变化 |
| ---  | ---|
| `v13.1.0`   | 添加了高级中间件选项 |
| `v13.0.0`   | 中间件可以修改请求头和响应头,并能响应请求 |
| `v12.2.0`   | 中间件功能稳定了 |
| `v12.0.9`   | Edge运行时环境下强制使用绝对路径 |
| `v12.0.0`   | 添加中间件功能 |
