import{_ as a}from"./app.CBpm7KR1.js";import{c as r,Y as t,o}from"./chunks/vendor.BmJYhjrt.js";const l="/assets/sequential-parallel-data-fetching.JIotolwy.jpg",n="/assets/server-rendering-with-streaming.BuBEUnFZ.jpg",b=JSON.parse('{"title":"服务器组件","description":"","frontmatter":{},"headers":[],"relativePath":"react/Next/Official-Docs/Rendering/ServerComponents.md","filePath":"react/Next/Official-Docs/Rendering/ServerComponents.md","lastUpdated":1724299494000}'),i={name:"react/Next/Official-Docs/Rendering/ServerComponents.md"};function s(d,e,c,p,h,g){return o(),r("div",null,e[0]||(e[0]=[t('<h1 id="服务器组件" tabindex="-1">服务器组件 <a class="header-anchor" href="#服务器组件" aria-label="Permalink to &quot;服务器组件&quot;">​</a></h1><p>React Server Components,就是允许在服务器上渲染和可选被缓存的UI组件.而用了Next,渲染的详细工作过程又被路由分块所进一步细分,以达到流式渲染及局部渲染的功能.以下是三种不同的服务器渲染策略:</p><ul><li><a href="#静态渲染默认">静态渲染</a></li><li><a href="#动态渲染">动态渲染</a></li><li><a href="#流式渲染">流式渲染</a></li></ul><p>这篇文章主要教您,服务器组件是如何工作的,我们什么时候可以使用它,以及不同渲染策略的介绍.</p><h2 id="服务器渲染的好处" tabindex="-1">服务器渲染的好处 <a class="header-anchor" href="#服务器渲染的好处" aria-label="Permalink to &quot;服务器渲染的好处&quot;">​</a></h2><p>在服务器上渲染的好处还是有不少的,包括以下:</p><ul><li><strong>数据获取:</strong> 服务器组件的一个功能就是允许你将数据获取的代码,直接放到服务器上,从而距离上离数据源更近.这样能减少获取渲染页面所需数据的时间和客户端发送请求的数量,从而提升网页性能.</li><li><strong>高安全性:</strong> 服务器组件允许你将一些像tokens,API钥匙这样的敏感信息和逻辑处理代码,停留在服务器上,不将它们暴露给客户端,避免不必要的泄露.</li><li><strong>缓存:</strong> 由于页面是在服务器上渲染的,因此,渲染的结果可以缓存在服务器上,在接下来的用户请求中,将缓存的结果传输给用户.这也能提升性能,因为减少了客户端每次请求时,所需的渲染工作量及数据获取量.</li><li><strong>高性能:</strong> 服务器组件还提供了一些额外的基础工具以提升性能.比如说,你的应用一开始全都是由客户端组件组成的,而后将一些非互动的页面移动(转换成)服务器组件,就能减少客户端所需的JS代码加载.这种优化可能不太明显,但对一些设备没那么好,网络环境较差的用户而言,有总比没有好;浏览器需要加载,分析及执行的JS代码实打实地减少了.</li><li><strong>提升初次页面加载速度(FCP):</strong> 通过服务器组件的方式,我们能在服务器上生成HTML,让用户立即看到相应的页面内容,不用再等客户端下载,分析,执行渲染页面的JS了.</li><li><strong>搜索引擎优化(SEO)和互联网可分享性:</strong> 利用服务器渲染好的HTML页面,会被搜索引擎机器人作为引擎索引,互联网机器人也会为你的页面生成相应的预览界面,从而让你的网站曝光度有所提升.</li><li><strong>流式渲染(Streaming):</strong> 服务器组件的渲染过程是,将本身分解成多个块(chunks),并在自身准备工作完成后,流式发送给客户端.这样用户就能提前浏览到网页的某些部分,而不用等待整页的内容都在服务器上被渲染好后才能互动了.</li></ul><h2 id="next-js中使用服务器组件" tabindex="-1">Next.js中使用服务器组件 <a class="header-anchor" href="#next-js中使用服务器组件" aria-label="Permalink to &quot;Next.js中使用服务器组件&quot;">​</a></h2><p>默认情况下Next就会启用服务器组件.你不需要额外的配置,Next自动就实现了服务器渲染.你如果要写客户端组件才需要额外的声明配置.<a href="https://nextjs.org/docs/app/building-your-application/rendering/client-components" target="_blank" rel="noreferrer">关于客户端组件</a></p><h2 id="服务器组件是如何被渲染的" tabindex="-1">服务器组件是如何被渲染的? <a class="header-anchor" href="#服务器组件是如何被渲染的" aria-label="Permalink to &quot;服务器组件是如何被渲染的?&quot;">​</a></h2><p>Next在服务器上利用React的API组织页面渲染.渲染工作被划分为多个块:以独立路由分块和<a href="https://react.dev/reference/react/Suspense" target="_blank" rel="noreferrer">Suspense边界</a>为单位.<br> 每个块又有以下两个渲染步骤:</p><ol><li>React将服务器组件,分析转化为一种特殊的数据格式.这种分析后的结果被称为ReactServerComponentPayload(RSC Payload).</li><li>Next利用以上转化而来的数据格式,结合客户端组件的JS指令,在服务器上渲染HTML.</li></ol><p>之后在客户端上,又会发生以下事情:</p><ol><li>初步渲染好的,暂时无法互动的HTML会立即被展示出来,作为对应路由的一个页面概况--作用仅仅是初次加载.</li><li>RSC Payload会被用来协调客户端和服务器端组件树,以及后续DOM的更新.</li><li>JS渲染指令,则用来为客户端组件进行hydrate(注水,水合),之后应用才真正变得可交互.</li></ol><div class="info custom-block"><p class="custom-block-title">INFO</p><p><strong>React Server Component Payload(RSC Payload)到底是什么?</strong><br> RSC Payload是,需要渲染的服务器组件树的,一种小型二进制符号代表.用于客户端上更新浏览器的DOM.它包括了:</p><ul><li>服务器组件的渲染结果</li><li>客户端组件需要渲染的占位符,以及对应JS文件的占位符.</li><li>客户端组件需要从服务器组件获取的props.</li></ul></div><h2 id="服务器渲染策略" tabindex="-1">服务器渲染策略 <a class="header-anchor" href="#服务器渲染策略" aria-label="Permalink to &quot;服务器渲染策略&quot;">​</a></h2><p>服务器渲染的策略分为三种:静态渲染,动态渲染和流式渲染.</p><h3 id="静态渲染-默认" tabindex="-1">静态渲染(默认) <a class="header-anchor" href="#静态渲染-默认" aria-label="Permalink to &quot;静态渲染(默认)&quot;">​</a></h3><p>静态渲染策略下,路由会在打包的时候,或是数据重校验后的后台中被渲染.渲染的结果可以被缓存,也可以存为<a href="https://developer.mozilla.org/docs/Glossary/CDN" target="_blank" rel="noreferrer">CDN(Content Delivery Network)</a>这样优化后,渲染的结果就可以在用户和服务器请求中分享了(?).<br> 当路由中的数据并不是限于某个用户的,在构建时已经是写死了的情况下比较有用,比如页面是静态博客,或是某个产品页面(落地页?).</p><h3 id="动态渲染" tabindex="-1">动态渲染 <a class="header-anchor" href="#动态渲染" aria-label="Permalink to &quot;动态渲染&quot;">​</a></h3><p>动态渲染策略下,路由会在每个用户请求时进行渲染.<br> 如果路由的数据是专门为某个用户展示的,或是说页面的信息只有在请求的时候才能确定的话(比如cookies或是URL里的查询参数),这个策略才能发挥作用.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p><strong>带有缓存数据的动态路由</strong><br> 大部分情况下,页面都不是纯静态或纯动态的 -- 基本都带点但不是全部.比如说,你有一个网购页面:产品内容用的缓存数据,每隔一段时间再去重校验;用户数据则是动态,不被缓存,个人定制的.<br> Next中,你可以利用动态渲染路由,从而同时包含一些缓存的/不被缓存的数据.这是因为RSC Payload跟数据的缓存是分开进行的.这样在你选择使用动态渲染的时候,不用去担心请求时获取数据对页面渲染效率的影响了.<br> 更多关于<a href="https://nextjs.org/docs/app/building-your-application/caching#full-route-cache" target="_blank" rel="noreferrer">路由缓存</a>和<a href="https://nextjs.org/docs/app/building-your-application/caching#data-cache" target="_blank" rel="noreferrer">数据缓存</a>的内容.</p></div><h4 id="切换到动态渲染" tabindex="-1">切换到动态渲染 <a class="header-anchor" href="#切换到动态渲染" aria-label="Permalink to &quot;切换到动态渲染&quot;">​</a></h4><p>在渲染过程中,Next一遇到一个动态函数,或时非缓存数据的请求,它就会将整个路由的渲染切换至动态渲染模式(?).<br> 下表展示的是动态函数和数据缓存,对于路由是静态渲染还是动态渲染的影响:</p><table tabindex="0"><thead><tr><th>是否有动态函数</th><th>是否有缓存数据</th><th>对应路由渲染策略</th></tr></thead><tbody><tr><td>否</td><td>是</td><td>静态渲染</td></tr><tr><td>是</td><td>是</td><td>动态渲染</td></tr><tr><td>否</td><td>否</td><td>动态渲染</td></tr><tr><td>是</td><td>否</td><td>动态渲染</td></tr></tbody></table><p>以上的表格表明,如果一个路由是完全静态的,那么该路由的所有数据都是被缓存的.不过在动态渲染的路由中,同时拥有缓存和非缓存数据获取,也是允许的.<br> 作为开发者的我们不用刻意选择静态还是动态渲染策略,因为Next会根据路由中使用的特性和API,自动选择最好的渲染策略.而你要做的是,什么时候缓存或重校验某个数据片段,以及页面的哪些部分需要流式渲染.</p><h4 id="动态函数" tabindex="-1">动态函数 <a class="header-anchor" href="#动态函数" aria-label="Permalink to &quot;动态函数&quot;">​</a></h4><p>动态函数依赖于一些只有在请求的时候才知道的信息,比如用户的cookies,请求头,或是URL查询参数.<br> Next中的动态函数有:</p><ul><li><a href="https://nextjs.org/docs/app/api-reference/functions/cookies" target="_blank" rel="noreferrer"><code>cookies</code></a></li><li><a href="https://nextjs.org/docs/app/api-reference/functions/headers" target="_blank" rel="noreferrer"><code>headers</code></a></li><li><a href="https://nextjs.org/docs/app/api-reference/functions/unstable_noStore" target="_blank" rel="noreferrer"><code>unstable_noStore</code></a></li><li><a href="https://nextjs.org/docs/app/api-reference/functions/unstable_after" target="_blank" rel="noreferrer"><code>unstable_after</code></a></li><li><a href="https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional" target="_blank" rel="noreferrer"><code>searchParam</code>属性</a></li></ul><p>使用任意以上的函数都会将对应路由变为动态渲染.</p><h3 id="流式渲染" tabindex="-1">流式渲染 <a class="header-anchor" href="#流式渲染" aria-label="Permalink to &quot;流式渲染&quot;">​</a></h3><p><img src="'+l+'" alt="sequential-and-parallel"> 流式渲染允许你从服务器上,渐进式地渲染页面.渲染工作会被分为多个块,每个块准备完成后都会向客户端流式渲染.这样用户就可以立即先看到网页的部分内容,而不用等到页面所有内容加载完后才能看到了.<br><img src="'+n+'" alt="server-rendering-with-streaming"> 流式渲染默认内置于Next.这样既能提升初次页面加载性能,也能改善那些可能由于获取数据速度缓慢而加载得慢的路由体验.比如某个产品页的评论界面.<br> 你可以通过使用<code>loading.js</code>页面,或是组件内使用<a href="https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" target="_blank" rel="noreferrer"><code>Suspense Boundary</code></a>,启用流式渲染路由分块.<a href="https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming" target="_blank" rel="noreferrer">更多关于<code>loading.js</code>和流式渲染的内容可以看这里.</a></p><h2 id="接下来" tabindex="-1">接下来 <a class="header-anchor" href="#接下来" aria-label="Permalink to &quot;接下来&quot;">​</a></h2><p>你可以去跳着学,学Next如何缓存数据,如何缓存静态渲染的结果的:</p><ul><li><a href="https://nextjs.org/docs/app/building-your-application/caching" target="_blank" rel="noreferrer">Next缓存</a></li></ul>',35)]))}const m=a(i,[["render",s]]);export{b as __pageData,m as default};
