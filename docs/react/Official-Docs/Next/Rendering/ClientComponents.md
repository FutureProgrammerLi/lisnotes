# 客户端组件
客户端组件是一些可交互的界面部分,它们能在服务器上预渲染,也是浏览器内可运行的JS代码.(?)  
这篇文章主要介绍客户端组件是如何工作的,它们是如何被渲染的,以及何时你可以使用它们.

## 客户端渲染的好处
在客户端上进行渲染的好处有以下:
- **可交互性:** 客户端组件内可以使用状态,副作用,和时间监听器.也就是说它们能为用户提供即时的交互反馈,即时地进行界面更新.
- **可用浏览器APIs:** 客户端组件内可以使用浏览器自带的Api, 比如[`geolocation`](https://developer.mozilla.org/docs/Web/API/Geolocation_API),[`localStorage`](https://developer.mozilla.org/docs/Web/API/Window/localStorage)等等.

## Next中使用客户端组件
要定义一个客户端组件,你需要在组件文件的最顶部(先于任何内容导入import),加一条[`"use client"`](https://react.dev/reference/react/use-client)指令.  
`"use client"`这条命令的作用是,[明确划分](https://nextjs.org/docs/app/building-your-application/rendering#network-boundary)服务器组件和客户端组件.也就是说,一个文件中使用了这条命令,那么导入进这个文件的其它内容,包括子组件在内,都会被认为是客户端打包内容的部分.
```tsx
// app/counter.tsx
'use client'

import { useState } from 'first'

export default function Counter() {
    const [counter, setCounter] = useState(0);

    return (
        <div>
            <p>You clicked {counter} times</p>
            <button onClick={()=> setCounter(count+1)}>Click me</button>
        </div>
    )
}

```

下图就说明了一个问题,如果你在嵌套组件(`toggle.js`)中用了`onClick`和`useState`,又没有明确定义`"use client"`的话,就会抛出错误.**因为默认情况下,App Router下的所有组件都是服务器组件.** 这些API它们是访问不到的.  
如果真的要在`toggle.js`内使用这些API,就声明该组件是客户端组件,顶部加上`"use client"`,这样它就能访问到了.  
![use-client-directive](imgs/use-client-directive.jpg)

::: info
**定义多个`use client`入口**  
你可以在React组件树中定义多个`"use client"`入口.结果只是应用被分出了很多个客户端包而已.  
不过不过,又不用每一个需要在客户端渲染的组件,都加上`"use client"`这条声明.你在一个文件中使用了这个"界限",那它所有的子组件,所有导入的模块,都已经被认为是客户端包的一部分了.
:::

## 客户端组件是如何被渲染的?
Next里的客户端组件渲染方式,视情况而不同:页面是否全部被渲染?(初次浏览或页面刷新) 后续路由切换导致组件重渲染?  

### 完整页面加载
为了优化初次页面加载,Next会调用React APIs,在服务器上同时为客户端组件和服务器组件,渲染出一个静态的HTML预览页面.就是在用户首次浏览你的网站时,他们可以立即查看到页面的内容,不用等待浏览器下载解析执行客户端的JS组件包.  

过程中服务器会发生的事情:
1. React将服务器组件转变成一种特殊的数据格式,RSC Payload,其中就包括了客户端组件的索引(references)
2. Next结合RSC Payload和客户端组件JS指令,在服务器上为每个路由渲染出HTML.  

之后在客户端上:
1. 将以上的HTML立即展示给用户.虽然这个页面暂时是不可交互的,只是该路由的一个预览内容而已.
2. 利用RSC Payload,对客户端组件树,和服务器组件树进行协调(reconcile),并更新DOM.
3. 利用客户端组件JS指令,对客户端组件进行["水合,注水"(hydrate)](https://react.dev/reference/react-dom/client/hydrateRoot),使客户端组件真正变得可交互.

::: tip
**"hydration", "水合"到底是什么?**  
水合是将事件监听器,添加到相应DOM上的一个过程,这样才能使静态HTML变得可以交互.  
实际上,水合过程利用的是[`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot)这个React API.
:::

### 后续路由切换的组件加载
如果是用户通过路由切换导致的客户端组件加载,那这个加载渲染过程完全是发生在客户端上的,不需要服务器渲染的HTML.  
这时的客户端包已经下载好,解析完了.当包一切都准备好后,React就利用RSC Payload,对客户端组件树和服务器组件树进行协调,更新DOM.

## 回到服务器环境
有时候,你在某个组件内定义了`"use client"`边界,之后却又想回到服务器环境了:比如你为了减少客户端包的大小,在服务器上获取数据;或是要调用仅限服务器环境的API,那要怎么办呢?  
你可以保留这些,理论上嵌套在客户端组件内,仅服务器上可运行的代码,客户端组件,服务器组件,服务器行为穿插着用(???).[更多关于这种混合模式页面的内容](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns),在之后的篇幅再介绍.