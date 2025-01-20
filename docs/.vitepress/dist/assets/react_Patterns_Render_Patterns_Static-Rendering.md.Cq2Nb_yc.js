import{_ as a}from"./app.DwUT4cp8.js";import{c as i,Y as n,o as p}from"./chunks/vue.C3nVHRy_.js";const l="/RenderPatterns/ssg.jpg",o=JSON.parse('{"title":"静态渲染","description":"","frontmatter":{},"headers":[],"relativePath":"react/Patterns/Render_Patterns/Static-Rendering.md","filePath":"react/Patterns/Render_Patterns/Static-Rendering.md","lastUpdated":1736321332000}'),e={name:"react/Patterns/Render_Patterns/Static-Rendering.md"};function t(h,s,r,k,d,c){return p(),i("div",null,s[0]||(s[0]=[n('<h1 id="静态渲染" tabindex="-1">静态渲染 <a class="header-anchor" href="#静态渲染" aria-label="Permalink to &quot;静态渲染&quot;">​</a></h1><p>了解过SSR后我们知道,服务器端处理请求时间长的话会影响TTFB,导致网页性能缓慢.同样的,客户端渲染也有弊端:大体积的JS包则会影响FCP,TTP,因为客户都不得不花大量时间去下载和处理这些脚本.</p><p>静态渲染,或说是静态生成(SSG),就是用来解决以上弊端的:在网站构建的时候,生成预渲染的HTML内容,并把这个HTML发送给客户端.</p><p>用户访问对应路由的静态HTML文件会预先被生成.这些静态HTML文件会先放置到服务器端上,或通过CDN可被访问到,用户可以随时请求获取到.</p><p>这些静态文件也因此可被缓存下来,具有更强的稳定性.由于这个HTML响应内容可以提前生成,服务器对应的处理时间自然可以忽略不计了,结果就是TTFB更快,性能更加优秀.理想情况下,客户端JS代码量应是最小的,静态页面在客户端接收到后不久就能变得可交互.总结来说,SSG这种方式就是能提升FCP/TTI两个性能指标.<br><img src="'+l+`" alt="ssg"></p><h2 id="基础结构" tabindex="-1">基础结构 <a class="header-anchor" href="#基础结构" aria-label="Permalink to &quot;基础结构&quot;">​</a></h2><p>恰如其名,静态渲染的出现就是为了静态内容渲染的.比如页面不需要根据登入的用户而定制化(比如个人推荐内容).像<em>About us</em>,<em>Contact us</em>, 博客页面或是电商产品页等内容,我们都建议使用静态渲染.Next.js,Gatsby,VuePress这些框架都支持静态生成功能.<br> 我们拿Next.js举例,静态渲染不带额外数据源的页面内容:</p><h3 id="next-js" tabindex="-1">Next.js <a class="header-anchor" href="#next-js" aria-label="Permalink to &quot;Next.js&quot;">​</a></h3><div class="language-jsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// pages/about.jsx</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> About</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;About us&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            {</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/**/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>构建网站的时候(<code>next build</code>命令后),以上页面就会被预渲染为<code>about.html</code>文件,通过访问<code>/about</code>路由查看对应内容.</p><h2 id="带有额外数据的静态生成" tabindex="-1">带有额外数据的静态生成 <a class="header-anchor" href="#带有额外数据的静态生成" aria-label="Permalink to &quot;带有额外数据的静态生成&quot;">​</a></h2><p>像<em>About us</em>,<em>Contact us</em>这些页面可以直接完整展示毫无动态的内容,不需从额外数据源获取数据.不过,有些页面像个人博客或产品页面这些,数据则可能需要从另外数据源获取,再整合到特定模板,再在构建时渲染为HTML.</p><p>生成多少HTML页面,分别取决于有多少条博客,以及由多少个商品.为了能够正确访问到这些页面,你可能需要对应详尽的格式化的,关于这些静态页面的信息列表.<br> 我们看看用Next.js如何根据已有的信息,静态生成对应的信息列表吧:</p><h3 id="列表页面-包含所有静态网页的关键信息" tabindex="-1">列表页面 - 包含所有静态网页的关键信息 <a class="header-anchor" href="#列表页面-包含所有静态网页的关键信息" aria-label="Permalink to &quot;列表页面 - 包含所有静态网页的关键信息&quot;">​</a></h3><p>页面内容需要根据外部数据生成时,你就需要生成对应的列表页面了.外部数据会在构建的时候从数据库获取,用以生成需要的页面.<br> 在Next中,我们可以在<code>page</code>文件中导出函数<code>getStaticProps()</code>来实现.这个函数会在构建时,从服务器上被调用,获取需要的数据.获取到的数据通过组件的<code>props</code>属性传到组件,以预渲染页面组件.<br> 我们拿<a href="https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation#all-products-page-static-generation-with-data" target="_blank" rel="noreferrer">这条博客</a>里的部分代码来展示一下具体是怎么用的:</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 以下函数会在构建时在构建服务器上被调用</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getStaticProps</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        props:{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            products: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getProductsFromDatabase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 组件会在构建时,接收到以上props.products的具体内容</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Products</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">products</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Products&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                {products.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">map</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">product</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> key</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{product.id}&gt;{product.name}&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                ))}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;/&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>这个异步函数不会被打包到客户端中,因此可以用来从数据库中获取后台数据.</p><h3 id="各自的具体信息-每个页面" tabindex="-1">各自的具体信息 -- 每个页面 <a class="header-anchor" href="#各自的具体信息-每个页面" aria-label="Permalink to &quot;各自的具体信息 -- 每个页面&quot;">​</a></h3><p>上面的代码生成了产品列表.我们需要通过点击每个产品,跳转到展示具体的产品信息页面.<br> 假设我们有<code>101</code>,<code>102</code>,<code>103</code>等产品.因此我们要生成<code>/products/101</code>,<code>/products/102</code>,<code>/products/103</code>等等的路由内容.为此,我们需要结合<code>getStaticPaths()</code>方法,还有<a href="https://nextjs.org/docs/routing/dynamic-routes" target="_blank" rel="noreferrer">动态路由</a>.</p><p>首先创建公共页面组件:<code>products/[id].js</code>,并导出<code>getStaticPaths()</code>函数.函数需要返回所有可能的产品id,以在构建的时候预渲染各自独立的产品页面.以下是用Next,大概实现这个功能的代码架构:(<a href="https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation#individual-product-page-static-generation-with-data" target="_blank" rel="noreferrer">具体看这</a>)</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// pages/products/[id].js</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 先确定具体要渲染的内容是什么,可直接从数据库获取到所有产品信息,并对信息进行过滤(比如只用产品的id来生成页面)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getStaticPaths</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> products</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getProductsFromDatabase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> paths</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> products.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">map</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">product</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        params: { id: product.id }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { paths, fallback:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // fallback属性表明,没有正确产品id的话,提示404</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// params包含每个生成页面对应的id</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getStaticProps</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">params</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}) {      </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 有点麻烦, path =&gt; /products/[id].js , props =&gt; product</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        props:{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            product: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> getProductsFromDatabase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(params.id),     </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Product</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">product</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}){</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // ... 渲染具体产品信息</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br></div></div><p>产品页的具体信息会根据<code>getStaticProps</code>获得的内容,在构建时填充到对应页面.注意一下上面的<code>fallback</code>标识.它的意思是如果没有对应的路由或产品id,则向用户提示404.</p><p>至此,我们学会了如何用SSG,预渲染包含不同类型内容的页面了.</p><h2 id="ssg-一些不得不考虑的东西" tabindex="-1">SSG -- 一些不得不考虑的东西 <a class="header-anchor" href="#ssg-一些不得不考虑的东西" aria-label="Permalink to &quot;SSG -- 一些不得不考虑的东西&quot;">​</a></h2><p>SSG能极大地提升网页性能,因为它省去了客户端和服务器端的处理时间.生成的网页也是SEO友好的,因为内容是预先生成的,网页爬虫可轻易爬取到.虽然说了SSG这么多的优点,不过你还是需要考虑以下因素,充分评估这项技术是否适用于你要开发的应用:</p><ol><li><strong>大量的HTML文件:</strong> 用户可能访问到多少个页面,就会有多少个HTML被生成.比如用以生成博客的话,有多少条博客对应就会生成多少个HTML文件存到数据仓库中.因此,对任意博客进行编辑,你都需要重新构建所有内容,才能将修改的内容反映到对应HTML文件中去.当HTML文件数量到达一定程度的话,维护起来还是会有难度的.</li><li><strong>依赖部署环境:(?)</strong> 如果你的SSG网站想加载又快响应又快,你就要慎重决定将它们部署到什么平台了.如果你网站本身优化配置好,平台部署技术领先,能利用多个CDNs处理边界缓存的话,你的网站就会有极致的性能表现.</li><li><strong>动态内容考虑:</strong> SSG网站内容每次的变化都需要重新构建和重新部署. 这就可能导致,开发者不重构建,重部署,网站内容就一直不更新,直到内容过时.换句话说,SSG不适用于展示高度动态的内容.</li></ol><hr><p>感谢你能看到这里!</p>`,28)]))}const b=a(e,[["render",t]]);export{o as __pageData,b as default};