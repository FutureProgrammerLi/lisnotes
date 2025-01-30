# 链接和导航

在Next应用中,切换路由的方法有四种:
- 使用`<Link>`组件
- 使用`useRouter` hook(限客户端组件)
- 使用`redirect`函数 (限服务器组件)
- 使用原生的History API

本篇文章旨在教学如何使用以上四种方式,并稍微深入了解,导航是如何工作的.

## `<Link>`组件
`<Link>`组件是Next框架的一个内置组件,它扩展了原本HTML `<a>`标签的功能,提供页面预取(prefetch)和客户端路由切换的功能.它是Next应用中,比较主要且为推荐使用的导航切换方式.  
你可以从`next/link`包中引入这个组件,同时也要把`href`属性传给该组件:
```tsx
// app/page.tsx
import Link from 'next/link';

export default function Page() {
    return <Link href="/dashboard">Dashboard</Link>
}
```

可以传给`<Link>`组件的属性还有很多,[可以看看这里.](https://nextjs.org/docs/app/api-reference/components/link)

### 使用例子
#### 链接到动态的分块(dynamic segments)
当需要链接到动态分块时,你可以使用模板字符串和插值的方式,生成一系列的链接.举个例子,以下是生成一串博客链接:
```tsx
// app/blog/PostList.js
import Link from 'next/link';

export default function PostList({posts}) {
    return (
        <ul>
            {posts.map(post => (
             <li key={post.id}>
                <Link href={`/blog/${post.id}`}>{post.title}</Link>
             </li>    
            ))}
        </ul>
    )
}
```

#### 检验是否为活跃链接(是否已经点击查看过的目标链接)
你可以使用`usePathname()`来判断一个链接是否活跃.比如说,如果链接是活跃的,那就给它添加一个样式类,从而达到区分的效果.具体方法就是检查当前路由的`pathname`和链接的`href`属性是否匹配:
```tsx
`use client`

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Links() {
    const pathname = usePathname();

    return (
        <nav>
            <ul>
                <li>
                    <Link clssName={`link ${pathname === '/'? 'active' : ''}` href='/'}>
                        Home                 
                    </Link>
                </li>
                <li>
                    <Link clssName={`link ${pathname === '/about'? 'active' : ''}` href='/about'}>
                        About
                    </Link>
                </li>
            </ul>
        </nav>
    )
}
```

#### 滚动到某个特定`id`值对应的内容
Next App Router的默认行为是:滚动到一个新路由的顶部,或是保持在跳转前后,页面所滚动到的相对位置.  
如果你想在导航后,滚动到特定`id`对应的内容,你可以在跳转后的URL后加上`#`及对应内容,或是直接在传`href`属性时,加上`#`内容.这样能成功,是因为`<Link>`组件本质只是`<a>`标签而已.
```jsx
<Link href="/dashboard#settings">Settings</Link>

// 会变成这样
<a href="/dashboard#settings">Settings</a>
```

::: tip
如果哈希链接没有对应的内容,那就跟普通展示页面行为没有区别.  
(比如没有#settings的内容,那就跟直接导航到`/dashboard`的行为没有区别)
:::

#### 禁用滚动恢复
前面说过,导航的结果可能是展示页面的顶部,也可能是跳转前后已经滚动到的位置.如果你想禁止后面这种行为,每次跳转都展示页面的最顶部,可以给`<Link>`组件传prop: `scroll={false}`; 或是在`router.push()`,`router.replace()`中传入`scroll:false`选项:
```jsx
// Link prop
<Link href="/dashboard" scroll={false}>Dashboard</Link>

// programmatic disable scrolling
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard',{ scroll: false});
```

## `useRouter()`钩子函数
这个钩子函数允许你在客户端组件中,编程式地实现路由的转换.
```js
// app/page.js
'use client'
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    return (
        <button onClick={() => router.push('/dashboard')} type='button'>
            Click to Dashboard
        </button>
    )
}
```
如果你想知道`useRouter()`可使用的所有方法(除了`push`和`replace`),[你可以看看这里.](https://nextjs.org/docs/app/api-reference/functions/use-router)

::: tip
路由跳转一般还是建议使用`<Link>`组件,除非你有具体的需求才建议你用`useRouter()`.
:::

## `redirect`函数
对于服务器组件,取代`useRouter()`相关功能的,是`redirect`函数.
```tsx
// app/team/[id]/page.tsx
import { redirect } from 'next/navigation';

async function fetchTeam(id:String) {
    const res = await fetch('https://...');
    if(!res.ok) return undefined;
    return res.json();
}

export default async function Profile({params}: {params:{id:string}}) {
    const team = await fetchTeam(params.id);
    if(!team){
        redirect('/login')
    }
    //...
}
```

::: tip
- 默认情况下用`redirect`重定向会返回**307**状态码(临时重定向).而在服务器行为(Server Action)中使用这个方法时,它会作为POST请求的一个结果,返回303状态码,表示重定向成功.(???一通解释云里雾里)
- `redirect`内部行为会抛出一个错误.因此它不应该在`try/catch`内部中被调用.
- `redirect`其实也可以在客户端组件中被调用.但这个调用是在页面渲染过程中调用的而不是在事件处理器当中.这种情况你应该用`useRouter`取而代之.
- `redirect`接受绝对路径(absolute URLs)作为参数.也就是说它可以重定向到外部链接.
- 如果你想在页面渲染之前就重定向,可以参考配置[`next.config.js`](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs)或是[使用中间件](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware).
:::

`redirect`方法的更多选项,[可以看看这里.](https://nextjs.org/docs/app/api-reference/functions/redirect)

## 使用原生的History API
在Next之中使用原生的`window.history.pushState`和`window.history.replaceState`方法,这样是可行的.这些方法能实现更新浏览器历史栈的同时不重新加载页面.  
`pushState`和`replaceState`方法的调用跟Next内部的路由器的行为是一致的.也就是说调用这些方法后,`usePathname`,`useSearchParams`这些钩子函数所获得的信息,也会保持到最新的状态.

### `window.history.pushState`
这个方法会为浏览器历史栈中添加一帧.使用者可以根据这个调用栈,返回到先前的页面当中.比如说,对一个产品列表进行排序(???不是在说浏览器历史栈吗?)
```tsx
`use client`
import { useSearchParams } from 'next/navigation';

export default function SortProducts() {
    const searchParams = useSearchParams();

    function updateSorting(sortOrder: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort',sortOrder);
        window.history.pushState(null,'',`?${params.toString()}`);
    }
    
    return (
        <>
            <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
            <button onClick={() => updateSorting('desc')}>Sort Descending</button>
        </>
    )
}
```
### `window.history.replaceState`
用这个方法,可以替换掉当前的浏览器历史栈的一帧.这样用户就不能返回到上一个帧了(被替换掉了).比如说用它来切换应用的语言(locale):
```tsx
`use client`
import { usePathname } from 'next/navigation';

export default function LocaleSwitcher() {
    const pathname = usePathname();

    function swtichLocale(locale: string) {
        // e.g. '/en/about' 或是'/fr/contact'
        const newPath = `/${local}${pathname}`;
        window.history.replace('',null,newPath);
    }
    
    return (
        <>
            <button onClick={() => swtichLocale('en')}>Sort Ascending</button>
            <button onClick={() => swtichLocale('fr')}>Sort Descending</button>
        </>
    )
}
```

## 路由和导航是如何工作的
App Router用了一种混合的方式来实现路由及导航.在服务器上时,你的应用代码,会自动根据路由分块进行代码分割(code split).而在客户端时,Next.js则会预先获取(prefetch)和对路由分块进行缓存.也就是说,当用户切换到一个新的路由时,浏览器不会重新加载页面,而只会重渲染路由分块发生变化的那一部分 -- 这样就能提高切换效率及用户体验了.

### 1. 代码分割(Code Splitting)
简单说就是把应用代码分成多个更小的包,这样浏览器需要下载和执行的内容就可以更小了.而且,每次请求需要传输的数据量,执行的时间也会因此减少,带来的好处自然就是更好的网页性能了.  
服务器组件能够自动根据路由分块,对代码进行分割.也就是说每次导航,只加载当前路由需要的代码,仅此而已.

### 2.预获取(Prefetching)
预获取是后台在用户浏览前,提前加载路由的一种方式.  
Next.js中实现预获取的方法有两种:
- 使用`<Link>`组件:只要链接出现在用户的视口后,路由就会自动被预获取.也就是说,预获取发生在页面首次加载时,或是该链接出现在用户视口的时候.
- `router.prefetch()`: `useRouter()`返回的路由中,就有这个方法,让你能够编程式地实现路由预获取.

`<Link>`默认的预获取行为(比如没专门为组件传入`prefetch` prop或设置为null)会根据你的`loading.js`而变得不一样.  
只有布局文件,以及其下的组件树(直到遇见的第一个`loading.js`文件)会被预获取并缓存30秒.(layout到loading之间的内容会别prefetched?) 这样就可以减少获取整个动态路由的花费代价,以及展示一个即时的加载状态,从而给予用户一个更好的视觉反馈了.  
(??? 没懂,为什么预取了layout到loading之间的内容,就适合给用户一个加载反馈?)  
如果要禁用预取功能,就给`<Link>`组件传`prefecth={false}`的prop.反之,你可以传`prefetch={true}`,在加载页面的时候将整个页面的数据全都预获取回来.  
[看这了解更多`<Link>`组件的API.](https://nextjs.org/docs/app/api-reference/components/link)

::: tip
- 开发环境下预获取功能是不会启用的,只在生产环境会启用这个功能.
:::

### 3. 缓存
Next.js有种在客户端内存中缓存的东西(in-memory client-side cache),叫路由器缓存(Router cache).  
当用户在应用中切换路由时,React的服务器组件负载(React Server Component Payload)就会将预获取到的路由分块和已经浏览过的路由进行缓存,存储在这片缓存空间之中.  
也就是说,路由切换时,Next会尽量重用缓存,而不是一次又一次地向服务器发送请求 -- 也就减少请求次数和数量,提高应用性能了.

### 4.部分渲染
部分渲染说的是,客户端路由切换时,只有变化的那个路由分块会发生重渲染,其它的分块是会保持不变的.  
举例来说就是,在两个同级的路由间切换时,`/dashboard/settings`和`/dashboard/analytics`,只有`settings`和`analytics`的页面会重渲染,它们共享的`/dashboard`布局则会维持不变.  
![partial-rendering](imgs/partial-rendering.jpg)
如果不用部分渲染机制,那每次浏览器路由的切换都会导致整个页面的重渲染.而只重选变化的路由分块则能尽可能地减少数据运输量及代码执行时间,实现更好性能表现.

### 5."软导航"
浏览器本身的页面导航是"硬导航"(hard navigation)的.而Next应用则用"软导航",只重渲染改变了的,需要更新的部分(部分渲染).这也使得客户端的React内部状态在导航时能够维持(React preserved state).

### 6.向后向前的导航
默认情况下,用户前进或后退时,Next会保持用户先前已经滚动到的位置,并重用Router Cache里已经缓存起来的东西.

### 7.`pages/`和`app/`里的路由
当你逐渐需要从`pages/`里的路由,转换到`app/`里,Next路由器会自动处理好二者路由之间的硬导航.  
为了检测从`pages/`的路由到`app/`路由的转变,Next有一个客户端路由过滤器,它用的是基于概率的检测机制.它有时候甚至会检测错误,(?判定路由在哪个位置错误吗?)但据我们估计,估错的概率大概只有0.01%.这个估计的概率可以通过`experimental.clientRouterFilterAllowedRate`选项,在`next.config.js`中自定义.不过要注意的是,如果真的要降低这个判定的概率,可能会使打包出来的客户端包变大.  
而如果你想禁止Next内部帮你处理`pages/`路由和`app/`路由的切换,改用手动处理二者差异,可以在`next.config.js`里把`experimental.clientRouterFilter`的值设为`false`.当这个功能被手动关闭后,任何`pages/`内的动态路由,要切换到`apps/`里的路由的话,都不会被正常地切换过去.(能切换吗?从`pages/`到`app/`?)

## 接下来
(缓存我还能理解,导去学Typescript是为什么?)
* [缓存](https://nextjs.org/docs/app/building-your-application/caching)
* [Typescript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)