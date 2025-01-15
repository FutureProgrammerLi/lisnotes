import{_ as i,c as a,a0 as t,o as n}from"./chunks/framework.CGHvQLJz.js";const g=JSON.parse('{"title":"选择性注水","description":"","frontmatter":{},"headers":[],"relativePath":"react/Patterns/Render_Patterns/Selective-Hydration.md","filePath":"react/Patterns/Render_Patterns/Selective-Hydration.md"}'),p={name:"react/Patterns/Render_Patterns/Selective-Hydration.md"};function h(l,s,e,k,r,d){return n(),a("div",null,s[0]||(s[0]=[t(`<h1 id="选择性注水" tabindex="-1">选择性注水 <a class="header-anchor" href="#选择性注水" aria-label="Permalink to &quot;选择性注水&quot;">​</a></h1><blockquote><p><a href="https://www.patterns.dev/react/react-selective-hydration" target="_blank" rel="noreferrer">原文地址</a></p></blockquote><p>先前的文章中我们介绍了SSR是如何配合注水的功能提升用户体验的.React可以使用由<code>react-dom/server</code>提供的<code>renderToString()</code>方法,在服务器上快速生成DOM树,并将结果发送给客户端.而渲染好的HTML起初是不可互动的,直到获取到对应的JS代码并加载完后才是真正的加载完.而这个过程于React而言要做的,就是遍历DOM树,对节点进行注水,为节点绑定对应事件.</p><p>不过,由于当前的实现细节限制,这种方法还是可能会有性能问题.</p><p>服务器端渲染的HTML发送给客户端的前提是,所有的组件代码都已经准备好了.意思是,一些依赖于外部API的,或会导致某些延迟的组件,可能会阻塞另一些组件的渲染.</p><p>除了组件渲染阻塞的问题外,另一问题是,React只会向组件树进行一次注水.也就是说如果React需要对任意组件注水的前提是,所有组件的JS代码都已经被获取到了.结果可能会是,某些代码量小的组件不得不等待获取并加载另一些代码量大的组件,只有所有代码都被获取并加载到了React才可能对网页内容进行注水.而这整段的获取和加载时间内,网页都是不可交互的.</p><p>React v18为了解决这些问题,提出了一种结合了服务器端流式渲染和注水的新方式:选择性注水(Selective Hydration).</p><hr><p>为了使用选择性注水,我们先不使用之前提过的,<code>renderToString</code>方法,而使用新的,<code>pipeToNodeStream</code>方法,将渲染好的HTML从服务器流式传给客户端.</p><p>这种结合了<code>createRoot</code>和<code>Suspense</code>的方法,可以让我们不等待代码量大的组件加载的同时,将HTML流式传递给客户端.也就是说我们可以既使用SSR,也使用组件懒加载技术.</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-ioE7-" id="tab-D4bBdDF" checked><label data-title="server.ts" for="tab-D4bBdDF">server.ts</label><input type="radio" name="group-ioE7-" id="tab-lPrrpnU"><label data-title="App.ts" for="tab-lPrrpnU">App.ts</label><input type="radio" name="group-ioE7-" id="tab-LFQx2x3"><label data-title="index.ts" for="tab-LFQx2x3">index.ts</label></div><div class="blocks"><div class="language-ts vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { pipeToNodeStream } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;react-dom/server&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> render</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">res</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> data</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> createServerData</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">startWriting</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">abort</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> pipeToNodeStreamWritable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">DataProvider data</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{data}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">App assets</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{assets}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        &lt;/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">DataProvider</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ),</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    res</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        onReadyToStream</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            res</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">setHeader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Content</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&#39;,&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">html</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&#39;);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            res</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">write</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(&#39;&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">DOCUMENT</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> html</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&#39;);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            startWriting</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { Suspense, lazy } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;react&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Loader </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;./Loader&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> Comments</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lazy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./Comments&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> App</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Header </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Suspense fallback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{&lt;Loader /&gt;}</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Comments </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      &lt;/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Suspense</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      &lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Footer </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    &lt;/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">main</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  )</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { hydrateRoot } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;react-dom&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> App </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./App&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">hydrateRoot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(document, &lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">App</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;);</span></span></code></pre></div></div></div><p><code>Comments</code>组件(App.ts文件里)本来会降低树的生成速度,增加TTI,但把它包裹在<code>&lt;Suspense&gt;</code>问题就会有所缓解了.它会告诉React不让这个组件降低其余DOM树的生成.方法是在最初渲染的HTML里,Suspense里会先渲染fallback提供的内容,之后会去生成树的其它部分.同时,我们会去获取<code>Comments</code>组件所需的外部数据.</p><p>选择性注水可以让React先对已经发送到客户端的组件进行注水,甚至在<code>Comments</code>组件发送前就进行这个操作了.</p><p>当<code>Comments</code>组件所需的数据准备完成后,React就会将这个组件的HTML代码流式传输给客户端,并用<code>&lt;script&gt;</code>的方式取代之前的后备加载显示内容(fallback loading).</p><p>新HTML被注入后,React则开始另外的,还没完成的注水工作了.</p><hr><p>流式渲染的方式可以让我们在组件准备好时就开始流式传输代码,而不用担心某些或大或小的组件,因在服务器上渲染速度的快慢,而导致的FCP和TTI性能表现差劲问题.<br> 组件只要流式传送完到客户端后就可以开始被注水,因为选择性注水的技术能让我们,不需要等待所有JS代码加载完后才开始注水,也不需要等所有组件都注水完了,才获得一个可以互动的应用.</p>`,17)]))}const o=i(p,[["render",h]]);export{g as __pageData,o as default};
