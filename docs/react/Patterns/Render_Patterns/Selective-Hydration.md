# 选择性注水
> [原文地址](https://www.patterns.dev/react/react-selective-hydration)

先前的文章中我们介绍了SSR是如何配合注水的功能提升用户体验的.React可以使用由`react-dom/server`提供的`renderToString()`方法,在服务器上快速生成DOM树,并将结果发送给客户端.而渲染好的HTML起初是不可互动的,直到获取到对应的JS代码并加载完后才是真正的加载完.而这个过程于React而言要做的,就是遍历DOM树,对节点进行注水,为节点绑定对应事件.  

不过,由于当前的实现细节限制,这种方法还是可能会有性能问题.  

服务器端渲染的HTML发送给客户端的前提是,所有的组件代码都已经准备好了.意思是,一些依赖于外部API的,或会导致某些延迟的组件,可能会阻塞另一些组件的渲染.  

除了组件渲染阻塞的问题外,另一问题是,React只会向组件树进行一次注水.也就是说如果React需要对任意组件注水的前提是,所有组件的JS代码都已经被获取到了.结果可能会是,某些代码量小的组件不得不等待获取并加载另一些代码量大的组件,只有所有代码都被获取并加载到了React才可能对网页内容进行注水.而这整段的获取和加载时间内,网页都是不可交互的.  

React v18为了解决这些问题,提出了一种结合了服务器端流式渲染和注水的新方式:选择性注水(Selective Hydration).

---

为了使用选择性注水,我们先不使用之前提过的,`renderToString`方法,而使用新的,`pipeToNodeStream`方法,将渲染好的HTML从服务器流式传给客户端.

这种结合了`createRoot`和`Suspense`的方法,可以让我们不等待代码量大的组件加载的同时,将HTML流式传递给客户端.也就是说我们可以既使用SSR,也使用组件懒加载技术.

::: code-group
```ts [server.ts]
import { pipeToNodeStream } from 'react-dom/server';

export function render(res){
    const data = createServerData();
    const { startWriting, abort } = pipeToNodeStreamWritable(
        <DataProvider data={data}>
            <App assets={assets}/>
        </DataProvider>
    ),
    res,
    {
        onReadyToStream(){
            res.setHeader('Content-type','text/html');
            res.write('<DOCUMENT html>');
            startWriting();
        }
    }
}

```

```ts [App.ts]
import { Suspense, lazy } from "react";
import Loader from "./Loader";

const Comments = lazy(() => import("./Comments"));

function App() {
  return (
    <main>
      <Header />
      <Suspense fallback={<Loader />}>
        <Comments />
      </Suspense>
      <Footer />
    </main>
  )
}

```

```ts [index.ts]
import { hydrateRoot } from "react-dom";
import App from './App';

hydrateRoot(document, <App />);
```
:::

`Comments`组件(App.ts文件里)本来会降低树的生成速度,增加TTI,但把它包裹在`<Suspense>`问题就会有所缓解了.它会告诉React不让这个组件降低其余DOM树的生成.方法是在最初渲染的HTML里,Suspense里会先渲染fallback提供的内容,之后会去生成树的其它部分.同时,我们会去获取`Comments`组件所需的外部数据.  

选择性注水可以让React先对已经发送到客户端的组件进行注水,甚至在`Comments`组件发送前就进行这个操作了.

当`Comments`组件所需的数据准备完成后,React就会将这个组件的HTML代码流式传输给客户端,并用`<script>`的方式取代之前的后备加载显示内容(fallback loading).  

新HTML被注入后,React则开始另外的,还没完成的注水工作了.  

---

流式渲染的方式可以让我们在组件准备好时就开始流式传输代码,而不用担心某些或大或小的组件,因在服务器上渲染速度的快慢,而导致的FCP和TTI性能表现差劲问题.  
组件只要流式传送完到客户端后就可以开始被注水,因为选择性注水的技术能让我们,不需要等待所有JS代码加载完后才开始注水,也不需要等所有组件都注水完了,才获得一个可以互动的应用.