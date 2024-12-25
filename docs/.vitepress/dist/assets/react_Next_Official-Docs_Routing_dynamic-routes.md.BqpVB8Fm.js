import{_ as a,c as t,a0 as i,o as e}from"./chunks/framework.CGHvQLJz.js";const k=JSON.parse('{"title":"动态路由","description":"","frontmatter":{},"headers":[],"relativePath":"react/Next/Official-Docs/Routing/dynamic-routes.md","filePath":"react/Next/Official-Docs/Routing/dynamic-routes.md"}'),p={name:"react/Next/Official-Docs/Routing/dynamic-routes.md"};function n(d,s,l,h,o,r){return e(),t("div",null,s[0]||(s[0]=[i(`<h1 id="动态路由" tabindex="-1">动态路由 <a class="header-anchor" href="#动态路由" aria-label="Permalink to &quot;动态路由&quot;">​</a></h1><p>如果你不知道分块的准确命名会是什么,或是想通过一些动态的数据去生成对应的分块名称的话,你可以通过动态路由(Dynamic Segments)的方式,在请求时或是构建预渲染时生成最终的分块名称.</p><h2 id="使用习惯" tabindex="-1">使用习惯 <a class="header-anchor" href="#使用习惯" aria-label="Permalink to &quot;使用习惯&quot;">​</a></h2><p><code>[folderName]</code>,将文件夹名用方括号括起来,就是动态路由了.比如<code>[id]</code>或是<code>[slug]</code>.<br> (标题是动态路由dynamic routes,这里又成dynamic segments了.不太理解) =&gt; <code>pages</code>目录里二者意思相同.</p><h2 id="使用例子" tabindex="-1">使用例子 <a class="header-anchor" href="#使用例子" aria-label="Permalink to &quot;使用例子&quot;">​</a></h2><p>举个例子,一个博客的文件路径可以是:<code>app/blog/[slug]/page.js</code>,这里的<code>[slug]</code>就是每个博客的唯一标识(比如id之类的区分其它博客的属性)</p><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app/blog/[slug]/page.tsx</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Page</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    params</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    params</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">        slug</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">string</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;My post:{params.slug}&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><table tabindex="0"><thead><tr><th>路由地址</th><th>解析出来的URL</th><th>参数值<code>params</code></th></tr></thead><tbody><tr><td><code>app/blog/[slug]/page.js</code></td><td><code>/blog/a</code></td><td><code>{slug: &#39;a&#39;}</code></td></tr><tr><td><code>app/blog/[slug]/page.js</code></td><td><code>/blog/b</code></td><td><code>{slug: &#39;b&#39;}</code></td></tr><tr><td><code>app/blog/[slug]/page.js</code></td><td><code>/blog/c</code></td><td><code>{slug: &#39;c&#39;}</code></td></tr></tbody></table><p><a href="https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params" target="_blank" rel="noreferrer">看看这里,<code>generateStaticParams()</code></a>,学一下怎么为分块生成参数.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>在<code>pages</code>目录下,动态分块跟动态路由的意思是一样的.</p></div><h2 id="生成静态参数" tabindex="-1">生成静态参数 <a class="header-anchor" href="#生成静态参数" aria-label="Permalink to &quot;生成静态参数&quot;">​</a></h2><p><code>generateStaticParams</code>这个方法可以结合动态分块使用,在构建的时候静态生成(不确定名称的)路由,而不是等到请求时需要的时候再生成路由.</p><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app/blog/[slug]/page.tsx</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> async</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> generateStaticParams</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> posts</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> fetch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;https://.../posts&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">then</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">res</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> res.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">json</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> posts.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">map</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">post</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        slug:post.slug</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ??? 真有必要吗? 有种顾此失彼的感觉</span></span></code></pre></div><p>这样使用<code>generateStaticParams</code>的主要好处是,函数内你可以比较巧妙地获取回来自其它地方的数据作为路由名称.如果目标内容是通过<code>generateStaticParams</code>的<code>fetch</code>请求获得的,那这些请求会被自动的<a href="https://nextjs.org/docs/app/building-your-application/caching#request-memoization" target="_blank" rel="noreferrer">&quot;记忆&quot;起来</a>.也就是说,相同参数的<code>fetch</code>请求,无论是在多个<code>generateStaticParams</code>函数内,多个布局内,还是多个页面之内,都只会发送一次.这样才能减少打包时间.<br> 如果你先前用的是<code>/pages</code>目录,<a href="https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#dynamic-paths-getstaticpaths" target="_blank" rel="noreferrer">可以看看这里,如何迁移到<code>/app</code>目录并使用.</a><br><a href="https://nextjs.org/docs/app/api-reference/functions/generate-static-params" target="_blank" rel="noreferrer">你也可以看看更多关于<code>generateStaticParams</code>的使用信息及高级用例</a></p><h2 id="捕捉所有的备用路由-catch-all-segments" tabindex="-1">捕捉所有的备用路由(catch-all segments) <a class="header-anchor" href="#捕捉所有的备用路由-catch-all-segments" aria-label="Permalink to &quot;捕捉所有的备用路由(catch-all segments)&quot;">​</a></h2><p>动态路由的另一种用法是,捕捉所有的,可能没有的分块.用法是在动态路由的基础上再加三个句号(没错,数组解构嗯)<br><strong><code>[...fileName]</code></strong><br> 举个栗子,<code>app/shop/[...slug]/page.js</code>,不仅会匹配到<code>/shop/clothes</code>这个URL分块,还会捕捉到<code>/shop/clothes/tops</code>,<code>/shop/clothes/t-shirts</code>以及其它子路径.(只要<code>/shop/</code>之后的文件夹内,没有对应的<code>page.js</code>的话,这个页面就会作为候补了)</p><table tabindex="0"><thead><tr><th>文件路径</th><th>可能的URL</th><th>对应的参数<code>params</code></th></tr></thead><tbody><tr><td><code>app/shop/[...slug]/page.js</code></td><td><code>/shop/a</code></td><td><code>{slug: [&#39;a&#39;]}</code></td></tr><tr><td><code>app/shop/[...slug]/page.js</code></td><td><code>/shop/a/b</code></td><td><code>{slug: [&#39;a&#39;,&#39;b&#39;]}</code></td></tr><tr><td><code>app/shop/[...slug]/page.js</code></td><td><code>/shop/a/b/c</code></td><td><code>{slug: [&#39;a&#39;,&#39;b&#39;,&#39;c&#39;]}</code></td></tr></tbody></table><h2 id="可选的捕捉所有的备用路由" tabindex="-1">可选的捕捉所有的备用路由 <a class="header-anchor" href="#可选的捕捉所有的备用路由" aria-label="Permalink to &quot;可选的捕捉所有的备用路由&quot;">​</a></h2><p>那如何选择性地使用这个捕捉所有地备用路由呢?答案是用双方括号,再... : <strong><code>[[...fileName]]</code></strong></p><p>举例来说,<code>app/shop/[[...slug]]/page.js</code>不仅会匹配到<code>/shop</code>分块,还会比配到<code>/shop/clothes/</code>,<code>/shop/clothes/tops</code>,<code>/shop/clothes/tops/t-shirts</code>这些子分块.(匹配度是不是太高了点?)<br> 捕捉所有的后备路由,可选和不可选的区别就是,前者是可选的(???惊了,听君一席话,如听一席话).<br> 无论实际URL上后面有没有更多的参数,它都会匹配到这个路由.(就是上面的<code>/shop</code>也会被匹配到,这是不可选后备路由所不具备的)</p><table tabindex="0"><thead><tr><th>文件路径</th><th>可能的URL</th><th>对应的参数<code>params</code></th></tr></thead><tbody><tr><td><code>app/shop/[[...slug]]/page.js</code></td><td><code>/shop</code></td><td><code>{}</code></td></tr><tr><td><code>app/shop/[[...slug]]/page.js</code></td><td><code>/shop/a</code></td><td><code>{slug: [&#39;a&#39;]}</code></td></tr><tr><td><code>app/shop/[[...slug]]/page.js</code></td><td><code>/shop/a/b</code></td><td><code>{slug: [&#39;a&#39;,&#39;b&#39;]}</code></td></tr><tr><td><code>app/shop/[[...slug]]/page.js</code></td><td><code>/shop/a/b/c</code></td><td><code>{slug: [&#39;a&#39;,&#39;b&#39;,&#39;c&#39;]}</code></td></tr></tbody></table><h2 id="typescript" tabindex="-1">Typescript <a class="header-anchor" href="#typescript" aria-label="Permalink to &quot;Typescript&quot;">​</a></h2><p>当配合使用Typescript时,可以为<code>params</code>添加一些类型校验,从而限制路由分块应该长什么样.</p><div class="language-tsx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app/blog/[slug]/page.tsx</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Page</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">params</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">    params</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">slug</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;My Page&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><table tabindex="0"><thead><tr><th>路由路径</th><th><code>params</code>类型定义</th></tr></thead><tbody><tr><td><code>app/blog/[slug]/page.js</code></td><td><code>{ slug: string }</code></td></tr><tr><td><code>app/blog/[...slug]/page.js</code></td><td><code>{ slug: string[] }</code></td></tr><tr><td><code>app/blog/[[...slug]]/page.js</code></td><td><code>{ slug?: string[] }</code></td></tr><tr><td><code>app/[categoryId]/[itemId]/page.js</code></td><td><code>{ categoryId: string,itemId: string</code></td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>以上功能未来可能凭借<a href="https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin" target="_blank" rel="noreferrer">TS插件</a>就能实现</p></div><h2 id="接下来" tabindex="-1">接下来 <a class="header-anchor" href="#接下来" aria-label="Permalink to &quot;接下来&quot;">​</a></h2><p>我们建议您去看以下这些模块学习更多与本章相关的内容.</p><ul><li><a href="https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating" target="_blank" rel="noreferrer">链接与导航</a></li><li><a href="https://nextjs.org/docs/app/api-reference/functions/generate-static-params" target="_blank" rel="noreferrer"><code>generateStaticParams()</code></a></li></ul>`,29)]))}const g=a(p,[["render",n]]);export{k as __pageData,g as default};