# 服务器组件
React Server Components,就是允许在服务器上渲染和可选被缓存的UI组件.而用了Next,渲染的详细工作过程又被路由分块所进一步细分,以达到流式渲染及局部渲染的功能.以下是三种不同的服务器渲染策略:
- [静态渲染](#静态渲染默认)
- [动态渲染](#动态渲染)
- [流式渲染](#流式渲染)

这篇文章主要教您,服务器组件是如何工作的,我们什么时候可以使用它,以及不同渲染策略的介绍.

## 服务器渲染的好处
在服务器上渲染的好处还是有不少的,包括以下:
- **数据获取:** 服务器组件的一个功能就是允许你将数据获取的代码,直接放到服务器上,从而距离上离数据源更近.这样能减少获取渲染页面所需数据的时间和客户端发送请求的数量,从而提升网页性能.
- **高安全性:** 服务器组件允许你将一些像tokens,API钥匙这样的敏感信息和逻辑处理代码,停留在服务器上,不将它们暴露给客户端,避免不必要的泄露.
- **缓存:** 由于页面是在服务器上渲染的,因此,渲染的结果可以缓存在服务器上,在接下来的用户请求中,将缓存的结果传输给用户.这也能提升性能,因为减少了客户端每次请求时,所需的渲染工作量及数据获取量.
- **高性能:** 服务器组件还提供了一些额外的基础工具以提升性能.比如说,你的应用一开始全都是由客户端组件组成的,而后将一些非互动的页面移动(转换成)服务器组件,就能减少客户端所需的JS代码加载.这种优化可能不太明显,但对一些设备没那么好,网络环境较差的用户而言,有总比没有好;浏览器需要加载,分析及执行的JS代码实打实地减少了.
- **提升初次页面加载速度(FCP):** 通过服务器组件的方式,我们能在服务器上生成HTML,让用户立即看到相应的页面内容,不用再等客户端下载,分析,执行渲染页面的JS了.
- **搜索引擎优化(SEO)和互联网可分享性:** 利用服务器渲染好的HTML页面,会被搜索引擎机器人作为引擎索引,互联网机器人也会为你的页面生成相应的预览界面,从而让你的网站曝光度有所提升.
- **流式渲染(Streaming):** 服务器组件的渲染过程是,将本身分解成多个块(chunks),并在自身准备工作完成后,流式发送给客户端.这样用户就能提前浏览到网页的某些部分,而不用等待整页的内容都在服务器上被渲染好后才能互动了.

## Next.js中使用服务器组件
默认情况下Next就会启用服务器组件.你不需要额外的配置,Next自动就实现了服务器渲染.你如果要写客户端组件才需要额外的声明配置.[关于客户端组件](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

## 服务器组件是如何被渲染的?
Next在服务器上利用React的API组织页面渲染.渲染工作被划分为多个块:以独立路由分块和[Suspense边界](https://react.dev/reference/react/Suspense)为单位.  
每个块又有以下两个渲染步骤:
1. React将服务器组件,分析转化为一种特殊的数据格式.这种分析后的结果被称为ReactServerComponentPayload(RSC Payload).
2. Next利用以上转化而来的数据格式,结合客户端组件的JS指令,在服务器上渲染HTML.  

之后在客户端上,又会发生以下事情:
1. 初步渲染好的,暂时无法互动的HTML会立即被展示出来,作为对应路由的一个页面概况--作用仅仅是初次加载.
2. RSC Payload会被用来协调客户端和服务器端组件树,以及后续DOM的更新.
3. JS渲染指令,则用来为客户端组件进行hydrate(注水,水合),之后应用才真正变得可交互.

::: info
**React Server Component Payload(RSC Payload)到底是什么?**  
RSC Payload是,需要渲染的服务器组件树的,一种小型二进制符号代表.用于客户端上更新浏览器的DOM.它包括了:
- 服务器组件的渲染结果
- 客户端组件需要渲染的占位符,以及对应JS文件的占位符.
- 客户端组件需要从服务器组件获取的props.
:::

## 服务器渲染策略
服务器渲染的策略分为三种:静态渲染,动态渲染和流式渲染.

### 静态渲染(默认)
静态渲染策略下,路由会在打包的时候,或是数据重校验后的后台中被渲染.渲染的结果可以被缓存,也可以存为[CDN(Content Delivery Network)](https://developer.mozilla.org/docs/Glossary/CDN)这样优化后,渲染的结果就可以在用户和服务器请求中分享了(?).  
当路由中的数据并不是限于某个用户的,在构建时已经是写死了的情况下比较有用,比如页面是静态博客,或是某个产品页面(落地页?).

### 动态渲染
动态渲染策略下,路由会在每个用户请求时进行渲染.  
如果路由的数据是专门为某个用户展示的,或是说页面的信息只有在请求的时候才能确定的话(比如cookies或是URL里的查询参数),这个策略才能发挥作用.

:::info
**带有缓存数据的动态路由**  
大部分情况下,页面都不是纯静态或纯动态的 -- 基本都带点但不是全部.比如说,你有一个网购页面:产品内容用的缓存数据,每隔一段时间再去重校验;用户数据则是动态,不被缓存,个人定制的.  
Next中,你可以利用动态渲染路由,从而同时包含一些缓存的/不被缓存的数据.这是因为RSC Payload跟数据的缓存是分开进行的.这样在你选择使用动态渲染的时候,不用去担心请求时获取数据对页面渲染效率的影响了.  
更多关于[路由缓存](https://nextjs.org/docs/app/building-your-application/caching#full-route-cache)和[数据缓存](https://nextjs.org/docs/app/building-your-application/caching#data-cache)的内容.
:::

#### 切换到动态渲染
在渲染过程中,Next一遇到一个动态函数,或时非缓存数据的请求,它就会将整个路由的渲染切换至动态渲染模式(?).  
下表展示的是动态函数和数据缓存,对于路由是静态渲染还是动态渲染的影响:
| 是否有动态函数   | 是否有缓存数据 | 对应路由渲染策略 |
| ---             |          --- | --- |
|  否             |           是  |  静态渲染 | 
|  是             |           是  |  动态渲染 | 
|  否             |           否  |  动态渲染 | 
|  是             |           否  |  动态渲染 | 

以上的表格表明,如果一个路由是完全静态的,那么该路由的所有数据都是被缓存的.不过在动态渲染的路由中,同时拥有缓存和非缓存数据获取,也是允许的.  
作为开发者的我们不用刻意选择静态还是动态渲染策略,因为Next会根据路由中使用的特性和API,自动选择最好的渲染策略.而你要做的是,什么时候缓存或重校验某个数据片段,以及页面的哪些部分需要流式渲染.  
#### 动态函数
动态函数依赖于一些只有在请求的时候才知道的信息,比如用户的cookies,请求头,或是URL查询参数.  
Next中的动态函数有:
- [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers)
- [`unstable_noStore`](https://nextjs.org/docs/app/api-reference/functions/unstable_noStore)
- [`unstable_after`](https://nextjs.org/docs/app/api-reference/functions/unstable_after)
- [`searchParam`属性](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional)

使用任意以上的函数都会将对应路由变为动态渲染.

### 流式渲染
![sequential-and-parallel](imgs/sequential-parallel-data-fetching.jpg)
流式渲染允许你从服务器上,渐进式地渲染页面.渲染工作会被分为多个块,每个块准备完成后都会向客户端流式渲染.这样用户就可以立即先看到网页的部分内容,而不用等到页面所有内容加载完后才能看到了.  
![server-rendering-with-streaming](imgs/server-rendering-with-streaming.jpg)
流式渲染默认内置于Next.这样既能提升初次页面加载性能,也能改善那些可能由于获取数据速度缓慢而加载得慢的路由体验.比如某个产品页的评论界面.  
你可以通过使用`loading.js`页面,或是组件内使用[`Suspense Boundary`](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming),启用流式渲染路由分块.[更多关于`loading.js`和流式渲染的内容可以看这里.](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

## 接下来
你可以去跳着学,学Next如何缓存数据,如何缓存静态渲染的结果的:
- [Next缓存](https://nextjs.org/docs/app/building-your-application/caching)