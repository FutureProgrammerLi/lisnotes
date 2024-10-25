import{_ as i,c as a,a2 as t,o as n}from"./chunks/framework.DPuwY6B9.js";const o=JSON.parse('{"title":"路由","description":"","frontmatter":{},"headers":[],"relativePath":"vue/Nuxt/Routing.md","filePath":"vue/Nuxt/Routing.md"}'),e={name:"vue/Nuxt/Routing.md"};function l(p,s,h,k,r,d){return n(),a("div",null,s[0]||(s[0]=[t(`<h1 id="路由" tabindex="-1">路由 <a class="header-anchor" href="#路由" aria-label="Permalink to &quot;路由&quot;">​</a></h1><blockquote><p>跟服务器端的文件结构功能相似,那个是后端,处理发送后的请求<br> 这个是前端的路由,页面切换.这大概也是前后端对于&quot;路由&quot;这个概念的差异,前者类似跳转,后者更像&quot;接口&quot;<br> 因此也可以配合跳转理解:<a href="./Server.html">Nuxt里的服务器文件夹</a></p></blockquote><ul><li><a href="https://nuxt.com/docs/guide/directory-structure/pages" target="_blank" rel="noreferrer"><code>pages</code>目录</a></li><li><a href="https://nuxt.com/docs/api/components/nuxt-link" target="_blank" rel="noreferrer"><code>&lt;NuxtLink&gt;</code>组件</a></li><li><a href="https://nuxt.com/docs/api/composables/use-route" target="_blank" rel="noreferrer"><code>useRoute</code>钩子函数</a></li><li><a href="https://nuxt.com/docs/guide/directory-structure/middleware" target="_blank" rel="noreferrer"><code>Middleware</code>目录</a></li><li><a href="https://nuxt.com/docs/api/utils/define-page-meta" target="_blank" rel="noreferrer">页面元数据</a></li></ul><p class="text-2xl font-bold">Nuxt的路由是基于文件结构实现的,它会为\`pages/\`目录下的每个文件创建对应的路由</p><hr><p>Nuxt的一个核心功能是文件系统路由器.每个在<code>pages/</code>目录下的文件都会创建一个对应的URL(或者说是路由),该路由就会显示对应文件的组件内容.结合页面的动态导入功能,Nuxt增强了代码划分的功能,最小化每次请求的路由JS加载量.</p><h2 id="页面" tabindex="-1">页面 <a class="header-anchor" href="#页面" aria-label="Permalink to &quot;页面&quot;">​</a></h2><p>Nuxt路由是基于<a href="https://router.vuejs.org/" target="_blank" rel="noreferrer">vue-router</a>实现的.每一个在<code>pages/</code>目录下的文件,会根据文件名生成对应的路由页面.<br> 文件结构系统,换句话说,可以说是沿袭命名规则,生成动态路由或是嵌套路由.<br> (应该是假定了你已经知道如何通过创建文件夹/文件,决定实际对应的URL和路由页面)</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-jnQl0" id="tab-KVEr8TG" checked><label data-title="Directory Structure" for="tab-KVEr8TG">Directory Structure</label><input type="radio" name="group-jnQl0" id="tab-OQ2V8GC"><label data-title="Generated Router File" for="tab-OQ2V8GC">Generated Router File</label></div><div class="blocks"><div class="language-text vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>| pages/</span></span>
<span class="line"><span>---| about.vue</span></span>
<span class="line"><span>---| index.vue</span></span>
<span class="line"><span>---| posts/</span></span>
<span class="line"><span>-----| [id].vue</span></span></code></pre></div><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>  &quot;routes&quot;: [</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;path&quot;: &quot;/about&quot;,</span></span>
<span class="line"><span>      &quot;component&quot;: &quot;pages/about.vue&quot;</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;path&quot;: &quot;/&quot;,</span></span>
<span class="line"><span>      &quot;component&quot;: &quot;pages/index.vue&quot;</span></span>
<span class="line"><span>    },</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>      &quot;path&quot;: &quot;/posts/:id&quot;,</span></span>
<span class="line"><span>      &quot;component&quot;: &quot;pages/posts/[id].vue&quot;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>}</span></span></code></pre></div></div></div><p class="text-xs text-blue-300">(Vitepress里面为什么没有这个功能啊啊啊啊,好麻烦啊啊啊啊)</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>更直接的,<a href="https://nuxt.com/docs/guide/directory-structure/pages" target="_blank" rel="noreferrer">去看<code>pages</code>目录</a>(跟Server类似,这里算是概括对应目录功能,注重&quot;可以怎么用&quot;.后者更像&quot;有什么用&quot;)</p></div><h2 id="导航" tabindex="-1">导航 <a class="header-anchor" href="#导航" aria-label="Permalink to &quot;导航&quot;">​</a></h2><p>你可以用<code>&lt;NavLink&gt;</code>这个组件实现路由的切换.本质上它会渲染一个属性的<code>&lt;a&gt;</code>标签,<code>href</code>的属性会被设置为对应的路由页面.(所以为什么要用这个而不直接用<code>&lt;a href&gt;</code>?)<br> 当应用被激活(hydrated)的时候,页面的切换就会通过URL的更新得以实现.这样可以防止整个页面的刷新,并在这个切换过程中实现一切动画过渡.<br> 当<code>&lt;NuxtLink&gt;</code>进入到用户的视线窗口时,Nuxt会自动预获取对应目标链接的组件代码,事先生成对应页面(?),从而加快页面切换速度.</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- pages/app.vue --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">header</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">nav</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">NuxtLink</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/about&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;About&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">NuxtLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">NuxtLink</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/posts/1&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Post 1&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">NuxtLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">NuxtLink</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> to</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/posts/2&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Post 2&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">NuxtLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">nav</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">header</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><a href="https://nuxt.com/docs/api/components/nuxt-link" target="_blank" rel="noreferrer">更多关于NuxtLink这个组件</a></p></div><h2 id="路由参数" tabindex="-1">路由参数 <a class="header-anchor" href="#路由参数" aria-label="Permalink to &quot;路由参数&quot;">​</a></h2><p>你可以在<code>&lt;script setup&gt;</code>或是<code>setup()函数</code>内,使用<code>useRoute()</code>这个钩子函数,获得当前路由的相关信息.</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- pages/posts/[id].vue --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> route</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useRoute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 当访问路径是posts/1时,id这个值就会是1.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(route.params.id);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><a href="https://nuxt.com/docs/api/composables/use-route" target="_blank" rel="noreferrer">更多关于<code>useRoute()</code>这个钩子函数.</a></p></div><h2 id="路由中间件" tabindex="-1">路由中间件 <a class="header-anchor" href="#路由中间件" aria-label="Permalink to &quot;路由中间件&quot;">​</a></h2><p>Nuxt为开发者提供了一整个可定制化的路由中间件框架(原文framework).如果你想对特定路由切换时做点限制或是验证或是~~任何页面切换前后的工作,你可以通过这个中间件系统实现.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>这里的路由中间件是前端Vue应用的一部分.虽然它跟服务器端的中间件名字相似,它们是完全不一样的两个东西.服务器中间件的运行是后端Nitro服务器的一部分.</p></div><p>路由中间件有三种:</p><ol><li><strong>匿名(或是行内)路由中间件:</strong> 这种中间件的定义是直接在页面内定义的,哪个页面用就在哪个页面内定义.(功能相对简单且不指望复用)</li><li><strong>具名路由中间件:</strong> 一般这种中间件是定义在<code>middleware/</code>这个目录下的,当页面要用到它们的时候会自动通过异步导入,自动加载到对应页面.(<strong>注意:</strong> 中间件一般用驼峰式命名(kebab-case),所以<code>someMiddleware</code>会变成<code>some-middleware</code>)???前者是什么,后者又是什么?函数名和组件名吗?</li><li><strong>全局路由中间件:</strong> 这种中间件也放在<code>middleware/</code>目录下,命名时可用<code>.global</code>作后续标识.每次路由变化时这种中间件都会被执行.<br> 以下是对<code>/dashboard</code>页面进行验证的一个<code>auth</code>中间件:</li></ol><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-Z9P_l" id="tab-pWJqTzg" checked><label data-title="middleware/auth.ts" for="tab-pWJqTzg">middleware/auth.ts</label><input type="radio" name="group-Z9P_l" id="tab-jDTuV5h"><label data-title="pages/dashboard.vue" for="tab-jDTuV5h">pages/dashboard.vue</label></div><div class="blocks"><div class="language-ts vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineNuxtRouteMiddleware</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">to</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">from</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">isAuthenticated</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> navigateTo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;/login&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   } </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ts&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    definePageMeta</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        middleware:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;auth&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Welcome to your dashboard&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div></div></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><a href="https://nuxt.com/docs/guide/directory-structure/middleware" target="_blank" rel="noreferrer">更多关于中间件的内容</a></p></div><h2 id="路由验证" tabindex="-1">路由验证 <a class="header-anchor" href="#路由验证" aria-label="Permalink to &quot;路由验证&quot;">​</a></h2><p class="text-xs text-blue-300">(和上面的中间件有什么区别?)</p><p>如果你想对特定的个别页面进行验证,你还可以用<code>definePageMeta()</code>方法中的<code>validate</code>方法实现路由验证.<br><code>validate</code>这个属性是个函数,参数是<code>route</code>,返回一个布尔值,从而决定当前路由是否需要渲染对应内容.如果这个函数返回<code>false</code>,而又找不到其它对应的路由,那么就会返回404错误.你也可以返回对象,包含<code>statusCode/statusMessage</code>来扔出错误.(这样的话路由就不会去检查是否还有其它路由跟当前请求是符合的了,<strong>扔出错误属于中断操作了</strong>)<br> 如果你的应用场景更为复杂的话,尝试改用匿名中间件吧.</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- pages/posts/[id].vue --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ts&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">definePageMeta</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    validate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">async</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">route</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 为什么要async? </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> typeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> route.params.id </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;string&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &amp;&amp;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">^</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\d</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">test</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(route.params.id);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><a href="https://nuxt.com/docs/api/utils/define-page-meta" target="_blank" rel="noreferrer">更多关于页面元数据</a></p></div>`,31)]))}const g=i(e,[["render",l]]);export{o as __pageData,g as default};
