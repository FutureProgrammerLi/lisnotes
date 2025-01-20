import{_ as a}from"./chunks/parallel-routes.CxydWzUH.js";import{_ as i}from"./chunks/intercepted-routes-files.BpFdNxlm.js";import{_ as t,c as n,a as e,o as l}from"./app.DrsAtc4B.js";const p="/folder-tree.png",y=JSON.parse('{"title":"Next里的路由系统","description":"","frontmatter":{},"headers":[],"relativePath":"react/Next/Routing-Summary.md","filePath":"react/Next/Routing-Summary.md","lastUpdated":1735055722000}'),d={name:"react/Next/Routing-Summary.md"};function h(r,s,k,o,c,g){return l(),n("div",null,s[0]||(s[0]=[e('<h1 id="next里的路由系统" tabindex="-1">Next里的路由系统 <a class="header-anchor" href="#next里的路由系统" aria-label="Permalink to &quot;Next里的路由系统&quot;">​</a></h1><blockquote><p>汇总的一个原因是,最近用到的Next文件<code>app/posts/[id]</code>,看得懂`app/posts/[...id],就看不懂了<br> 更不用说@,(),[[]]等等的文件夹和文件命名了.<br> 故有此文,分类汇总一下,<strong>Next里的特殊文件命名, 以及特殊的命名符号.</strong><br> 想要的效果像这样:<a href="https://juejin.cn/post/7426352106033004555#heading-32" target="_blank" rel="noreferrer">Next.js全栈框架入门：带你一文搞定路由</a><br> 感谢这位大佬的分享. (10月Next还才v13,现在12月就v15了..)</p></blockquote><h2 id="特殊的文件命名" tabindex="-1">特殊的文件命名 <a class="header-anchor" href="#特殊的文件命名" aria-label="Permalink to &quot;特殊的文件命名&quot;">​</a></h2><table tabindex="0"><thead><tr><th>文件名</th><th>文件作用</th></tr></thead><tbody><tr><td><code>layout</code></td><td>页面布局定义</td></tr><tr><td><code>page</code></td><td>页面内容定义</td></tr><tr><td><code>loading</code></td><td>正在加载当前路由时显示的UI</td></tr><tr><td><code>not-found</code></td><td>未找到对应路由时显示的内容</td></tr><tr><td><code>error</code></td><td>页面出错时显示的内容</td></tr><tr><td><code>global-error</code></td><td>全局的,不受限于某个路由的出错内容显示</td></tr><tr><td><code>route</code></td><td>服务器端API端点,跟page类比的话,<code>app/page.tsx</code>跟<code>app/api/route.ts</code>一样,请求路径都是<code>&#39;/&#39;</code>.(<code>localhost:3000/</code>,<code>await fetch(&#39;/&#39;)</code>)</td></tr><tr><td><code>template</code></td><td>专门重新渲染的布局UI</td></tr><tr><td><code>default</code></td><td>并行路由的后备UI</td></tr></tbody></table><p>表格列举完留下的问题:</p><ol><li>怎么触发?比如我定义了个<code>loading</code>,怎么在<code>page</code>里显示这个页面?</li><li>后两个只看说明看不懂具体作用,完成汇总后再回头探究它们的作用.</li><li>有了App Router, 还需要<code>global-error</code>吗?</li></ol><h2 id="特殊的文件夹命名" tabindex="-1">特殊的文件夹命名 <a class="header-anchor" href="#特殊的文件夹命名" aria-label="Permalink to &quot;特殊的文件夹命名&quot;">​</a></h2><table tabindex="0"><thead><tr><th>文件夹命名</th><th>作用</th></tr></thead><tbody><tr><td><code>app/dashboard/setting</code>和<code>app/dashboard/profile</code></td><td>嵌套路由</td></tr><tr><td><code>[folderName]</code></td><td>动态路由片段,比如<code>app/posts/[id]</code></td></tr><tr><td><code>(folderName)</code></td><td>路由按某种逻辑进行分组;比如<code>app/(auth)/login/page.tsx</code></td></tr><tr><td></td><td></td></tr><tr><td><code>[...folderName]</code></td><td>捕获所有路由片段,比如<code>app/posts/[...slug]/page.tsx</code></td></tr><tr><td><code>[[...folderName]]</code></td><td>可选的综合路由片段,比如<code>app/posts/[[...slug]]/page.tsx</code></td></tr><tr><td><code>@folder</code></td><td>在同一布局中同时或有条件地渲染一个或多个页面</td></tr><tr><td><code>(.)folder</code></td><td>表示匹配同一层级;比如<code>app/@modal/(.)settings</code></td></tr><tr><td><code>(..)folder</code></td><td>表示匹配上一层级</td></tr><tr><td><code>(..)(..)folder</code></td><td>表示匹配上两级</td></tr><tr><td><code>(...)folder</code></td><td>表示从根目录拦截</td></tr></tbody></table><p>(能不能举个例子看看作用?从[...folder]开始就看不懂了)</p><h2 id="folder和-folder-平行路由和拦截路由" tabindex="-1"><code>@folder</code>和<code>(.)folder</code>:平行路由和拦截路由 <a class="header-anchor" href="#folder和-folder-平行路由和拦截路由" aria-label="Permalink to &quot;`@folder`和`(.)folder`:平行路由和拦截路由&quot;">​</a></h2><p>先从概念说起,再从用例稍微理解,最后详细认识.</p><ul><li><strong>平行路由</strong>:如果你需要在同一个布局文件内,同时渲染或条件渲染一个或多个页面时,这时你可以使用平行路由.</li><li><strong>拦截路由</strong>:如果你需要在当前布局中加载来自应用另外部分的路由时,你可以使用路由拦截.</li></ul><p>光看概念作用似乎相似,都是在一个布局的前提下,渲染另外的页面.使用上,也确实是搭配使用的.<br> 但要进行区分,平行路由更像<code>slot插槽</code>,拦截路由则更像一个新功能.</p><h3 id="为什么说平行路由更像插槽" tabindex="-1">为什么说平行路由更像插槽? <a class="header-anchor" href="#为什么说平行路由更像插槽" aria-label="Permalink to &quot;为什么说平行路由更像插槽?&quot;">​</a></h3><p>将插槽名称提取到文件系统,再在布局中引入并渲染对应内容,就是平行路由的具体实现.<br><img src="'+a+'" alt="parallel-routing"></p><p><strong>插槽名提取到文件系統</strong>: 文件夹的名称就是插槽的名称.<br><strong>在布局中引入并渲染对应内容</strong>:<code>@team/page.tsx</code>和<code>@analytics/page.tsx</code>的内容,在<code>layout.tsx</code>中变成了对应的props,直接在布局中跟<code>{children}</code>一样,<code>{team}</code>,<code>{analytics}</code>就可以渲染出对应内容.</p><h3 id="拦截路由-一种较新的功能" tabindex="-1">拦截路由:一种较新的功能 <a class="header-anchor" href="#拦截路由-一种较新的功能" aria-label="Permalink to &quot;拦截路由:一种较新的功能&quot;">​</a></h3><p>想象一下以下场景:<br> 进入一个页面,顶部有一个登录按钮.点击按钮后,你觉得是跳转到另外的登录页面,还是弹出一个对话框,直接在里面输入信息就可以登录. 两种结果你更偏向哪种呢?</p><p>这跟拦截路由有什么联系? 拦截路由的存在可以同时满足以上两个场景.<br><strong>同一个路由分块下,内容可以仅为一个弹窗,也可以是一个全新的页面.</strong><img src="'+i+'" alt="intercepting-routes"></p><h3 id="用例-modal弹窗的实现" tabindex="-1">用例:Modal弹窗的实现 <a class="header-anchor" href="#用例-modal弹窗的实现" aria-label="Permalink to &quot;用例:Modal弹窗的实现&quot;">​</a></h3><p>拦截路由会改变URL,平行路由允许在同一个布局下渲染一个或多个页面的内容.<br><strong>二者结合的结果是,同一个URL,可以有不同的展示内容.</strong></p><p><img src="'+p+`" alt="folder-tree"> 上图展示了两个层级,结合使用了平行路由和拦截路由所需的目录结构.<br> 理解顶层的<code>@popup</code>,<code>(.post)</code>,也就理解<code>/posts/</code>目录下,相同的<code>@apopup</code>和<code>(.)login</code>了.</p><p>插槽可能比较好理解,有Vue经验的,React有利用过<code>children</code>或类似属性的,应该都可以理解.</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-yBVkO" id="tab-qSk7mO6" checked><label data-title="app/layout.tsx" for="tab-qSk7mO6">app/layout.tsx</label><input type="radio" name="group-yBVkO" id="tab-Sq-ARzd"><label data-title="/@popup/(.)posts/page.tsx" for="tab-Sq-ARzd">/@popup/(.)posts/page.tsx</label><input type="radio" name="group-yBVkO" id="tab-Rp0QZIw"><label data-title="/@popup/default.tsx" for="tab-Rp0QZIw">/@popup/default.tsx</label><input type="radio" name="group-yBVkO" id="tab-edWtQKY"><label data-title="/posts/page.tsx" for="tab-edWtQKY">/posts/page.tsx</label></div><div class="blocks"><div class="language-tsx vp-adaptive-theme active line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark has-highlighted vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> RootLayout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    children</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line highlighted"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    popup</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 这里的popup, 就是插槽名称,@popup, 可以是其它任意合法名称</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ReadOnly</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    children</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> React</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ReactNode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line highlighted"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    popup</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">React</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ReactNode</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}&gt;){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">html</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;en&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">body</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> className</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">geistSans</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">variable</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">} \${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">geistMono</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">variable</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Root layout&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Link</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> href</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Back to root&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Link</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        {children}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        {popup}  // [!code highlight]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">body</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">html</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Page</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Modal in app folder&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Post</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Post content&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div></div></div><p>以上三个文件定义完我们的<code>@popup</code>插槽后,在根目录下跳转到<code>/posts</code>时就可以达到,同一个URL,产生两种页面的内容.</p><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app/page.tsx</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Link </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;next/link&#39;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Page</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Some content...&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Link</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> href</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/posts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;To &quot;/posts&quot;&lt;/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Link</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;/&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>点击跳转链接To &quot;/posts&quot;后,URL会发生变化,但根布局下的<code>Root Layout</code>标题,和根页面下的<code>Some content...</code><strong>不会变化</strong>.而会在这些内容的底下,新增了<code>Modal in app folder</code>这个,位于<code>app/@popup/(.)posts/page.tsx</code>的内容.实现了弹窗效果的同时变更了URL.<br> 而此时对页面进行刷新,<code>Root Layout</code>的内容会保留,但<code>Some content...</code>会消失,取而代之的是<code>Post content</code>, 即<code>app/posts/page.tsx</code>的内容.实现了直接访问该URL时,对应需要显示的内容.</p><details class="details custom-block"><summary>为什么需要一个不返回任何内容的<code>@popup/default.tsx</code>?</summary><p>条件渲染是怎么实现的? 为什么default.js 返回 null时,插槽无内容,而跳转后,会显示插槽定义的page内容? 可以理解为这个文件返回<strong>插槽的默认内容</strong>.<br><code>page.tsx</code>和<code>default.tsx</code>的作用是不一样的,后者仅在路由无匹配时显示的默认内容.前者则有具体对应的子路由需要显示的内容.</p></details>`,28)]))}const m=t(d,[["render",h]]);export{y as __pageData,m as default};
