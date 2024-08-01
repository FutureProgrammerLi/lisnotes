# 页面加载和流(Streaming)

Next当中,`loading.js`是一个特殊的文件命名,它允许你搭配[`React Suspense`](https://react.dev/reference/react/Suspense)来构建有意义的,加载中界面.  
有了这样的惯有行为,你就可以在页面内容加载的时候,展示一个即时的加载状态了.这个状态会在页面的内容完全渲染后,立马被替换掉.
![loading-ui](imgs/loading-ui.jpg)

## 即时的加载状态
即时加载状态,就是路由切换之后立刻显示出来的,后备的反馈页面而已.你可以预渲染一些加载指示器,像骨架屏,或是转圈指示器(spinner),又或是页面大概要展示的内容部分,这些告诉用户页面正在加载的技术.  
为页面添加加载中UI的方法很简单,就是在对应路由文件夹中创建`loading.js`文件:
![loading-special-file](imgs/loading-special-file.jpg)
```tsx
// app/dashboard/loading.tsx
export default function loading() {
    // 任意用于提示界面正在加载的UI都是可以的.
    return <LoadingSkeleton/>
}
```
由于`loading.js`和`layout.js`可能同级,前者会嵌套显示在后者当中.而`loading.js`的内容,又会自动包裹着`page.js`,以及任意处于`<Suspense>`界限之内的子内容.
![loading-nesting](imgs/loading-overview.jpg)

::: tip
- 导航都是即时发生的,哪怕你用的是App Router(Server-centric routing,围绕服务器端的路由?)
- 导航的过程是可干预的.也就是说一个路由的改变,不需要等到当前路由的内容完全加载,就可以切换到另一个新的路由了.
- 如果用的是相同的布局,那布局的内容在新的路由分块加载的时候,依旧是可使用,可互动的.
:::

::: info
建议: 能用`loading.js`命名就用这个命名,像`layout.js`和`page.js`那样,因为Next会优化它们的功能.(???)
:::

## 用挂起(Suspense),实现流(Streaming)
除了使用`loading.js`这个基于文件的,添加页面加载中动画的功能外,你还可以手动为自己的UI组件设置挂起边界(Suspense Boundaries).App Router的挂起(Streaming with Suspense)功能在Node和Edge环境也是支持的.
::: tip
一些浏览器中会对流回复(streaming response)进行缓存.你可能会看不到低于1024字节流回复.不过结果基本只会对比较小型的应用产生影响,对实际的应用很小可能实际产生影响.(?我都不懂什么是流回复)
:::

## 那,什么是流(Streaming)?
如果要知道在React和Next之中,流是如何工作的,那就很有必要先了解一下什么是服务器渲染以及它的限制.(Server-Side Rendering,SSR).  
如果启用了服务器渲染,那就要在用户看到,交互到界面之前,多加一系列的步骤了:
1. 首先,某个特定页面的所有数据都先从服务器上获取.
2. 之后,在服务器端上渲染HTML.
3. 然后把对应页面的HTML,CSS,JS统统发送给客户.
4. 用户收到一个暂时未可交互的界面,代码层面仅包含渲染好的HTML和CSS.
5. 最后,React对页面内容进行"注水"(hydrate),这样界面才真正变得可交互.(hydrate的理解因人而异,我觉得像填充,liven,把字符串变成真正可执行的代码的过程)

![ssr-loading-procedure](imgs/server-rendering-without-streaming-chart.jpg)

这些步骤是按顺序执行的,一步完成了才能进行下一步.也就是说只有当所有的数据都从服务器中拿到后,服务器才可能开始渲染HTML.以及在客户端方面,React只有在页面的所有组件都已下载后,才能进行'hydrate(注水)'操作,才能使页面变得可交互.  
SSR的一个优点就是它减少了加载的时间,在服务器端渲染,然后先给到客户端一个可展示的界面内容.(是否可交互?另说,先展示了再说.)
![ssr-without-streaming](imgs/server-rendering-without-streaming.jpg)

不过显然,串行的操作就有可能产生堵塞.必须先在服务器上获取所有的数据,才可能将页面展示给用户.  
**流(Streaming)**的作用,就是允许你把页面的HTML,分解为多个更小的代码块(chunks),(progressively)增量地将这些分块从服务器端发送到客户端上.
![ssr-with-streaming](imgs/server-rendering-with-streaming.jpg)
这样页面的逐个部分就能更快地展示出来了,不用再等到所有的数据都获取到了才开始渲染UI.  
流的工作机制跟React的组件模型搭配得很好,因为每个组件本身就可以认为是一个块(chunk).一些比较重要的组件(比如产品信息)或是不依赖于数据的组件(比如布局文件),就可以先发送给客户端,React也就可以更早地进行'注水'了(hydrate).而那些不太重要地组件(比如评论,相关产品组件等)则可以在之后的服务器请求,对应的所有数据都已获取到之后,再发送回客户端.  
![ssr-with-streaming-chart](imgs/server-rendering-with-streaming-chart.jpg)

当你的需要传输的数据大到阻塞了页面的渲染时,流的作用就非常明显了.它能降低TTFB和FCP这两个网页性能指标(Time To First Byte / First Contentful Paint).它也会减少TTI(Time to Interactive,步骤五,React对页面进行'注水hydrate'),对性能较差的设备尤其有用.

## 举例
`<Suspense>`组件的工作机制,是先将需要执行异步操作的组件(比如获取数据)包裹起来,在异步操作的过程中展示一个加载中的提示界面,最后当异步操作完成后,再用组件的内容替换掉加载中的那个界面.  
```tsx
// app/dashboard/page.tsx
import {Suspense} from 'react';
import {PostFeed, Weather} from './Components';

export default function Posts() {
    return (
        <section>
            <Suspense fallback={<p>Loading feed...</p>}>
                <PostFeed />
            </Suspense>
            <Suspense fallback={<p>Loading weather...</p>}>
                <Weather />
            </Suspense>
        </section>
    )
}
``` 
使用`<Suspense>`组件的好处有以下:
1. 流式化服务器渲染(Streaming Server Rendering) - 渐进式地从服务器渲染HTML页面,到客户端上.
2. 选择性地'注水'(Selective hydration) - React将为你决定,用户界面的哪些组件需要先变得可交互,哪些组件的交互实现过程可以之后再实现.(步骤5)

## 搜索引擎优化(SEO)
- Next将界面流式传输给客户端之前,还是会等待通过`generateMetadata`获取数据的完成的.这样才能保证第一个传输给客户端的流式相应(Streamed Response)中包含`<head>`标签.
- 尽管流是在服务器上渲染的,但它不会影响搜索引擎优化(SEO).你可以试试用Google的富结果测试工具(?Rich results Test tool)来测试你的Next应用,看看你的页面对于Google网页爬虫获得的内容及序列化的HTML长什么样.[一些资料](https://web.dev/rendering-on-the-web/#seo-considerations)

## 状态码
流式传递时,响应码会是200,表明请求是成功的.  
服务器依旧可以通过流式内容,向客户端传递错误或是问题,比如使用了`redirect`或是`notFound`.由于响应头已经返回给客户端了,响应码自然是不能是更新的了.这还是不会影响SEO.(???你在说什么?303,307,404了你还是200,交流?交流了个什么???)