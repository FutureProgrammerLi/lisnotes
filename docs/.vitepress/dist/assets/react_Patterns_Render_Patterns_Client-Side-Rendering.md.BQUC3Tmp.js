import{_ as i}from"./app.E6B-SwxD.js";import{c as a,o as n,Z as e}from"./chunks/vendor.GdCD6OUn.js";const t="/RenderPatterns/CSR.png",o=JSON.parse('{"title":"客户端渲染","description":"","frontmatter":{},"headers":[],"relativePath":"react/Patterns/Render_Patterns/Client-Side-Rendering.md","filePath":"react/Patterns/Render_Patterns/Client-Side-Rendering.md","lastUpdated":1732632945000}'),l={name:"react/Patterns/Render_Patterns/Client-Side-Rendering.md"};function p(r,s,h,k,d,E){return n(),a("div",null,s[0]||(s[0]=[e(`<h1 id="客户端渲染" tabindex="-1">客户端渲染 <a class="header-anchor" href="#客户端渲染" aria-label="Permalink to “客户端渲染”">​</a></h1><blockquote><p><a href="https://www.patterns.dev/react/client-side-rendering" target="_blank" rel="noreferrer">https://www.patterns.dev/react/client-side-rendering</a></p></blockquote><p>如果你在React中使用了客户端渲染(Client-side Rendering,以下简称CSR)的方法,那服务器只会将页面的架构给渲染出来.<strong>页面的逻辑,数据获取,模板以及路由等需要展现到页面的内容,都会交由客户端的JS代码来处理执行.</strong><br> 对于单页面应用,CSR是比较流行的一种方案.它令用户用起来感觉更像一个应用,而非一个简单的网页.<br> 为了更好地了解其它模式的优势,我们先来了解一下,客户端渲染这种方法有什么好处,又有什么缺陷.</p><h2 id="基础结构" tabindex="-1">基础结构 <a class="header-anchor" href="#基础结构" aria-label="Permalink to “基础结构”">​</a></h2><p>先用简单的代码来展示一下,用这种模式的代码结构是怎样的.以下是展示并更新当前时间:</p><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> tick</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> element</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Hello World!&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;It is {</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Date</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toLocaleTimeString</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()}.&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ReactDOM.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">render</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(element,document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;root&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setInterval</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(tick,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>需要展示以上代码的HTML,只需一个id为<code>root</code>的<code>div</code>元素作为容器即可.内容的展示和更新完全交由Javascript来处理.这个页面的展示不需要与服务器交互,容器页面内容也能正确地实现更新.<br> 这里展示的内容可以不是时间,也可以是其它从API实时返回的汇率信息,股票价格等信息.它们都可以在不刷新页面,或与服务器交互的前提下实现内容的更新.</p><h2 id="javascript包和性能表现" tabindex="-1">Javascript包和性能表现 <a class="header-anchor" href="#javascript包和性能表现" aria-label="Permalink to “Javascript包和性能表现”">​</a></h2><p>不过,当一个页面的复杂程度逐渐提升,既要渲染图片,也要从仓库获取数据,还要处理用户在网页上触发的事件时,网页的代码量和项目体积就难免同时攀升了.可能导致的结果就是项目打包后体积过大,导致首次内容绘制(FCP)和页面达到可交互时间(TTI)都变长了.<br> (First Contentful Painting, Time To interactive,均为网页性能指标) <img src="`+t+'" alt="Clientside-Rendering"></p><p>如图片所示,当打包文件bundle.js体积增加时,FCP和TTI都会被推迟.也就是说页面加载时,用户就不得不看一段时间的白屏了.(FP到FCP,页面加载出来前一整段不明确的白屏时间)</p><h2 id="好处和坏处" tabindex="-1">好处和坏处 <a class="header-anchor" href="#好处和坏处" aria-label="Permalink to “好处和坏处”">​</a></h2><p>React大部分的应用逻辑都是直接在客户端上执行的,需要跟服务器交互的,一般是通过API从服务器获取数据,或向服务器发送存储数据.也就是说几乎所有界面的生成都是在客户端上完成.<br> 用户初次访问页面时,整个网页应用即从服务器请求返回.之后的导航,页面切换,网页都不再需要向服务器发起请求.视图/数据的变化都是在客户端上执行的.</p><p>这样做的一个好处是,页面的导航切换不需要刷新了.而且,由于数据改变视图的范围是有限的(?),页面之间的路由看起来会更快,应用响应性会更好.对于开发人员而言,这种方式也更好地区分了客户端代码和服务器端代码.</p><p>不过,正如每个硬币都有正反面,CSR也有其不足的地方:</p><ol><li><p><strong>搜索引擎优化方面的顾虑(SEO,Search Engine Optimization)</strong>:多数网页爬虫都是直接获取服务器渲染好的网页的.这对于CSR而言就有点尴尬了:大量的负载量和流水性的请求有可能导致网页有意义的内容渲染得不够迅速,致使爬虫软件无法对网页进行索引.爬虫软件可能能识别JS代码,但依旧存在限制.因此,CSR如果需要支持友好的SEO功能的话需要一些额外的操作.</p></li><li><p><strong>性能方面</strong>:用CSR确实能在某些场景提供更丝滑的用户体验.不过这都是之后的事情了,在页面首次渲染到客户端时,用户不得不等待JS代码从服务器上加载并执行分析.开头就体验不好,就可能没有后续了.你不能保证当应用大到一定程度时,页面加载到客户端需要花费多少时间,用户愿意等多久,更不用说要加载到性能参差不齐的用户设备上了.</p></li><li><p><strong>代码可维护性</strong>: 虽说CSR将客户端代码和服务器端代码分开了,但更有可能的是,前后端用的语言并不是同一种.也就是说前后端为实现某功能而编写的代码可能会重复,实际上我们并不能清晰地将前后端逻辑代码分离开来.举例来说就是数据的校验,货币和日期的格式化代码逻辑.</p></li><li><p><strong>数据获取</strong>: 客户端渲染的数据获取一般是事件驱动的(event-driven).页面初次加载时可以不从服务器获取任何数据,而在后续地网页事件中,触发了才去获取,比如页面的加载或触发API调用的按钮点击事件.你也不知道获取到的数据会是多少,也就是说这也有可能影响到用户加载/与应用交互所需要的时间.</p></li></ol><p>不同的应用对以上的缺陷会有不同的影响程度和考虑.开发者一般都会寻求SEO友好的,加载页面更快而不用顾虑相应加载时间的解决办法.而且不同的性能指标在不同的应用需求中优先级也会有所不同.说不定CSR在当前场景下能达到瑕不掩瑜的效果呢?说不定真的需要其它的解决方案呢?</p><h2 id="提升csr性能" tabindex="-1">提升CSR性能 <a class="header-anchor" href="#提升csr性能" aria-label="Permalink to “提升CSR性能”">​</a></h2><p>由于CSR的性能表现与代码打包的体积成反比,我们能做的是尽可能优化JS代码的结构.</p><p>试着遵循一下以下准则,或许管用呢?</p><ul><li><p><strong>限制JS的大小</strong>(Budgeting): 确保页面首次加载时JS的加载大小.一般首次加载包压缩后大小为&lt;100 - 170 KB是一个不错的参考值.某些功能的代码可以之后再按需导入.</p></li><li><p><strong>预加载</strong>: 这种技术可以用来加载那些网页必须的资源,在网页周期开始之前就将它们加载进来.我们可以在HTML头部,在<code>\\&lt;head&gt;</code>中使用以下指令加载这些必要资源:</p></li></ul><div class="language-html vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">link</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> rel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;preload&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;script&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> href</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;critical.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>这条指令会告知浏览器,在页面渲染机制开始之前,加载<code>critical.js</code>文件.因此,该文件里的代码也会被提前变得可用,不会阻塞页面的渲染进程,从而提升网页性能</p><ul><li><p><strong>懒加载</strong>:你可以用懒加载,将一些非必要的资源在需要的时候才对其进行加载.由于需要加载的资源少了,初次加载时间会随之减少.比如某个聊天小插件,在页面刚加载时是不需要的,我们就可以懒加载这个组件.</p></li><li><p><strong>代码分块</strong>: 为了避免JS包体积臃肿,你可以对包进行分块操作.你可以用像Webpack等的打包器,将代码分成多个块,在运行时再动态加载对应块.同时,代码分块使懒加载更加准确,进一步提升性能.</p></li><li><p><strong>利用service works实现应用外壳缓存</strong>: &quot;应用外壳&quot;,就是形成一个页面所需的,最小量的HTML,CSS,JS代码所构成的网页.而如果利用Service Workers技术将这个外壳给缓存起来,则可达到离线浏览的效果.对于那些需要提供原生单页面应用体验,剩余内容需要渐进式加载的场景比较有用.</p></li></ul><p>配合以上技术,CSR能更好地控制FCP和TTI指标,为用户提供较好的单页面应用体验.<br> 之后我们还会介绍与这种机制完全不同的渲染方式 -- 服务器渲染.</p>',24)]))}const b=i(l,[["render",p]]);export{o as __pageData,b as default};
