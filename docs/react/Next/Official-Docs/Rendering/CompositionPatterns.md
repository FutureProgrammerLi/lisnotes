# 服务器和客户端组合模式
在构建React应用的时候,你需要认真考虑,哪些部分要在服务器上渲染,哪些部分要在客户端上渲染.  
本篇内容主要向您推荐,一些组合使用的模式,怎么选择,怎么混合.

## 何时使用服务器组件?何时又用客户端组件?
下表是对标题的问题一个简要总结:
| 组件的作用是?   | 服务器组件 |  客户端组件 |
| ---  | --- | --- |
|  获取数据  | √ |  × |
|  获取后端资源(直接获取)  | √  | × |
|  保护服务器端敏感信息(tokens,API keys等)  | √ | × |
|  保持大体积依赖于服务器上/减少客户端代码量  | √ | × |
|  需要可交互性,调用事件监听器(如`onClick`,`onChange`等)  | × | √ |
|  需要使用状态及生命周期副作用(`useState`,`useEffect`,`useReducer`等)  | × | √ |
|  需要调用浏览器API  |  × | √ |
|  需要调用自定义hooks,hooks内又可能包括了React自带的hooks或浏览器API,如以上两个  | × | √ |
|  需要使用React类组件  | × | √ |

## 服务器组件模式
在选用客户端渲染之前,你可能希望在服务器上先做些工作,比如,获取数据,读取数据库或一些其它后端服务.  
以下是一些服务器组件的常用模式:

### 组件之间共享数据
当你在服务器上获取数据后,你就可能需要在组件之间共享数据了.比如你有一个布局,一个页面,对同一个数据有所依赖.  

要实现这个目的,你不必用React Context(服务器上也用不了),或以props形式传递数据.你可以用`fetch`或React的`cache`函数来获取组件需要的数据,也不用担心相同数据会产生重复请求.因为React扩展了`fetch`的功能,自动记住了这些数据请求;而`cache`则可以在`fetch`函数使用不了的情况下使用.  
[更多关于React记忆(memoization)的内容](https://nextjs.org/docs/app/building-your-application/caching#request-memoization)

### 客户端环境内不应有仅服务器环境运行的代码
由于JS模块是可以在服务器组件和客户端组件之间共享的,结果就可能是某些仅能在服务器环境运行的代码,莫名奇妙就传到了客户端环境当中.  
比如说以下这个获取数据的函数:
```ts
// lib/data.ts
export async function getData(){
    const res = await fetch('https://external-service.com/data',{
        headers:{
            authorization: process.env.API_KEY
        }
    });

    return res.json();
}

```

一眼看这函数,它在两个环境下都能运行.但细看后,请求中包含了`API_KEY`,属于敏感信息了,就要限制于服务器环境执行了.  
`API_KEY`这个环境变量由于不是`NEXT_PUBLIC`作为前缀,那它就是一个服务器环境中的"私有变量".为了避免它暴露给客户端,Next会将这个私有环境变量替代为空字符串.  
结果就是,尽管它可能会被导入并在客户端上被执行,它也不会像预期一样工作.那,把它变成一个公开的变量?让它在客户端上也能正常被执行?那这个`KEY`的作用也就报废了.敏感信息就不应暴露给客户端.  

要避免这种无意的使用错误,我们可以用`server-only`这个包.如果其他开发者意外地在客户端组件使用了这些模块,就会在打包时抛出错误.  

用这个包的前提就是安装:
```bash
$ npm install server-only
```

然后在对应的模块中直接导入这个包就行了

```js
// lib/data.js
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
```

之后任意客户端组件要导入`getData()`这个函数,在打包的时候就会报错了,因为这个模块仅限于服务器环境下运行.  
相应的也有一个包叫`client-only`,用于标记模块代码仅限于客户端上运行 -- 比如代码中用到了`window`对象.  

### 使用第三方包和供应商
服务器组件是React的一个新特性,生态中的三方库也是逐渐在为各自的,用了`useState`,`useEffect`,`createContext`这些仅限客户端组件的特性模块,添加`"use client"`指令.  
到了今天,不少`npm`包的组件都用了客户端限定特性,还没有`"use client"`指令限定.结果就是,你声明了的客户端组件内能使用这些包,你没有特意声明的,又用了这些包的服务器组件,就会出错了.  

比如假设你安装了`acme-carousel`这个包,用了里面的`<Carousel />`组件,这个组件内部又用了`useState`这个client-only hook,你的Next组件还没有定义`"use client"`.  

客户端组件内用这个三方组件是不会出错的:
```tsx
// app/gallery.tsx
'use client'
import { useState } from 'react'
import { Carosel } from 'acme-carosel'

export default function Gallery() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <butotn onClcik={() => setIsOpen(true)}>View pictures</button>
            {/*  能正常运行,因为这个文件就是一个客户端组件 */}
            {isOpen && <Carosel />}
        </div>
    )
}

```

而如果省略了最顶端的`"use client"`声明,就会报错了:
```tsx
// app/page.tsx

import { Carosel } from 'acme-carosel'

export default function Page() {
    <div>
        <p>View pictures</p>
        {/* Error: `useState` can not be used within Server Components */}
        <Carosel />
    </div>
}

```

报错的原因是Next不知道`<Carosel />`组件用了仅限客户端的某些特性.(算知道还是不知道?不知道怎么报的错?)

要解决这个问题,你可以将这个三方库的组件,手动地包裹到自己定义的客户端组件当中:
```tsx
// app/carosel.tsx
'use client'
import { Carosel } from 'acme-carosel'

export default Carosel
```

之后你就可以直接在服务器组件中使用这个包裹了一层的组件了:
```tsx
// app/page.tsx
import { Carosel } from './carosel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
 
      {/* 能正常运行,因为这里的Carosel已经变成客户端组件了 */}
      <Carousel />
    </div>
  )
}
```

我们不期望你将大量的三方组件都像上面那样包裹多一层,因为你还是可能在客户端组件中使用它们的.不过一个例外是,React Providers,因为它最基本的工作,就要依赖于状态和上下文,而且还要依赖于整个应用的根入口.  

#### 使用上下文提供器(Context Providers)
为了能共享一些全局可用的数据内容,上下文提供器基本都要在组件树的顶层,甚至是应用顶层被调用.而更明显的问题是,服务器组件,**不支持上下文功能.** 在应用根节点创建上下文,只会出现错误.
```tsx
// app/layout.tsx
import { createContext } from 'react'

export const ThemeContext = createContext({});

export default function RootLayout({children}) {
    return (
        <html>
            <body>
                <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
            </body>
        </html>
    )
}

```

而要解决这个问题,你就要将上下文,和对应的提供器,提取到客户端组件当中:
```tsx
// app/theme-provider.tsx
'use client'
import { createContext } from 'react'

export const ThemeContext = createContext({});

export default function ThemeProvider({children}:{children: React.ReactNode}) {
    return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

这样再在服务器组件中使用它就能被辨别出来了,因为它是一个客户端组件.  

```tsx
// app/layout.tsx
import ThemeProvider from "./theme-provider";

export default function RootLayout({children}:{children:React.ReactNode}) {
    return (
        <html>
            <body>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    )
}

```

这样在根布局中包裹了一个provider的话,你应用中的所有客户端组件就都能读取到这个上下文了.(consume the context)  
::: tip
我们建议你尽可能在组件树的底部包裹这个provider -- 参考以上`<ThemeProvider>`只包裹了`{children}`,而不是整个`<html>`文档.这样能帮助Next更好的优化服务器组件内的静态部分.
:::

#### 给三方库作者的一些建议
相似地,我们希望库的作者在创作包的时候,能够用上`"use client"`这个标志.这样后续使用的时候就可以直接导入到服务器组件中,而不需要用户再手动地将三方库的内容包裹多一层了.  
你可以通过在组件树尽可能底层的地方,放置`"use client"`指令,这样就可以让尽可能多的组件称为服务器组件模块图里的部分了.  
值得留意的是,一些打包器会把`"use client"`指令给删除掉.遇到这种情况的话,你可以去[`React Wrap Balancer`](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13)和[`Vercel Analytics`](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30)的仓库看看,如何通过配置esbuild,保留`"use client"`指令.

## 客户端组件
### 尽可能将客户端组件移动到组件树低的地方
为了减小客户端的JS包大小,我们建议您将客户端组件放到组件树尽可能低的地方.  
举个例子,你有一个布局页面,里面既有静态元素(像logo,链接这些),也有使用了React状态的搜索栏.  
这样情况下,你不必将整个布局页面都作为服务器组件看待,你可以只将互动的逻辑,放到客户端组件中去(像这里的`<SearchBar />`搜索栏),然后还是把布局当作服务器组件.也就是说这样不会把布局的组件渲染JS代码发送到客户端上.  
```tsx
// app/layout.tsx
import SearchBar from "./searchbar";
import Logo from './logo' 
// SearchBar是客户端组件, Logo是服务器组件,当前布局也是服务器组件

export default function Layout({children}:{children:React.ReactNode}) {
    return (
        <>
            <nav>
                <Logo />
                <SearchBar />
            </nav>
            <main>{children}</main>
        </>
    )
}   

```

### 将props从服务器组件传到客户端组件(序列化)
如果你在服务器组件里获取了数据,你可能会想把这些数据,通过props传递给客户端组件.这个过程也是可行的,只是**这个props需要被React序列化操作**. (be serializable for React,[怎么判断数据是否可被序列化?](https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values))  
如果客户端组件依赖的数据是不可被序列化的话,你可以改用[在客户端上,用三方库去获取数据](https://nextjs.org/docs/app/building-your-application/data-fetching/caching-and-revalidating#data-fetching-libraries-and-orms),或是在服务器上,改用[路由处理器](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).

## 穿插使用服务器组件和客户端组件
如果你不得不混合使用服务器组件和客户端组件,那把UI视作一棵组件树对你后续开发是很有帮助的.从根布局这个服务器组件开始,然后在底下,通过添加`"use client"`指令,渲染出若干客户端组件子树.  
在这些由客户端组件组成的子树内部,你依然可以嵌套服务器组件,或是调用服务器行为(Server Actions),不过可能需要注意以下几点:
- 在一个请求-相应周期内,你的代码从服务器端移动到客户端上.如果需要读取到服务器的数据或资源,那你还是需要向服务器发送**新的请求** - 而不是将同一个请求来回复用.
- 当请求发送到服务器端后,所有的服务器组件会先被渲染,包括那些嵌套在服务器组件中的客户端组件.渲染的结果是React Server Components Payload(RSC Payload),里面会包括客户端组件的定位指引(哪些地方是客户端组件,怎么访问到它们).之后在客户端上,React又利用RSC Payload,将服务器组件和客户端组件,协调成为一棵单树.
- 由于服务器组件是先于客户端组件渲染的,因此你不能够在客户端组件模块中引入服务器组件(因为本该是需要另一个新的请求才能完成的事).正确的做法应该是,将服务器组件作为props,传递给客户端组件.你可以看看下面,不支持的模式和已经支持的模式是怎样的.

### 不支持的模式:将服务器组件导入到客户端组件
以下的模式是不支持的,你不能将服务器组件导入到客户端组件中.
```tsx {11}
// app/client-component.tsx
'use client'
// 你不能够这样做
import ServerComponent from './server-component'

export default function ClientComponent({children}:{children:React.ReactNode}) {
    const [count,setCount] = useState(0);
    return (
        <>
            <button onClick={() => setCount(count + 1)}>{count}</button>
            <ServerComponent />
        </>
    )
}
```

### 支持的模式:把服务器组件作为Props传递给客户端组件
以下的模式才是Next支持的:将服务器组件作为props传递给客户端组件.  
一种比较常见的使用模式是,在客户端组件中使用`children`属性,在自身内部创建插槽"slot".  
下面就是,`<ClientComponent>`接收`children`属性:
```tsx
// app/client-component.tsx
'use client'
import { useState } from 'react'

export default function ClientComponent({children}:{children:React.ReactNode}) {
    const [count, setCount] = useState(0);
    return (
        <>
        <button onClick={() => setCount(count + 1)}>{count}</button>
        {children}
        </>
    )
}

```
以上,`<ClientComponent>`是不知道`children`属性的内容,会是一个服务器组件.它本身的作用,仅仅是决定将这个`{children}`放置到哪个地方.  
而如果在同一个顶层服务器组件内,你可以同时引入`<ClientComponent>`和`<ServerComponent>`,将`<ServerComponent>`作为孩子节点,传递给`<ClientComponent>`.
```tsx
// app/page.tsx
// 这种模式是可行的:
// 将服务器组件作为子节点,或是props,传递给客户端组件

import ServerComponent from './server-component';
import ClientComponent from './client-component';

export default function Page() {
    return (
        <>
            <ClientComponent >
                <ServerComponent />
            </ClientComponent>    
        </>
    )
}

```

这样`<ClientComponent>`就跟`<ServerComponent>`解耦了(decoupled),互相独立地被渲染.在`<ClientComponent>`于客户端上被渲染之前,`<ServerComponent>`已经能够在服务器上被渲染出来了.

::: tip
- 这种"内容提升"的模式其实很早就出现了,不过之前是用于避免,父组件重渲染时嵌套子组件又重渲染的问题.
- `children`这个属性并不是写死的,你可以使用任何props来传递JSX.
:::