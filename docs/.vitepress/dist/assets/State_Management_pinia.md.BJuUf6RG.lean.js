import{_ as i,c as a,a as n,o as e}from"./app.DrsAtc4B.js";const c=JSON.parse('{"title":"初识Pinia","description":"","frontmatter":{},"headers":[],"relativePath":"State_Management/pinia.md","filePath":"State_Management/pinia.md","lastUpdated":1732593547000}'),t={name:"State_Management/pinia.md"};function l(p,s,h,k,r,d){return e(),a("div",null,s[0]||(s[0]=[n(`<h1 id="初识pinia" tabindex="-1">初识Pinia <a class="header-anchor" href="#初识pinia" aria-label="Permalink to &quot;初识Pinia&quot;">​</a></h1><blockquote><p>半夜三更了,我的想法跟烤架上刚熟五花肉的油一样滋滋往外冒.<br> 初衷是昨天的一篇Typescript的文章最后,提到的状态管理跟TS的结合,引起了我对Pinia这个库的学习兴趣.<br> 接下来想做的除了学习Pinia,还想拿它跟Zustand,类似的一个React状态管理库作为学习对比.此外还想翻译一下那边,通读下来,React的&quot;组件进化历史&quot;的一篇文章翻译. 就看看这个晚上,心血来潮潮能翻多高吧~ 0:51了~ Pinia 官网: <a href="https://pinia.vuejs.org/" target="_blank" rel="noreferrer">https://pinia.vuejs.org/</a></p></blockquote><h2 id="before-diving-in" tabindex="-1">Before diving in <a class="header-anchor" href="#before-diving-in" aria-label="Permalink to &quot;Before diving in&quot;">​</a></h2><p>从官网学习前对Pinia已有一点认识,关键概念是</p><ol><li><code>defineStore(key,content)</code></li><li><code>states</code></li><li><code>actions</code></li><li><code>getters</code></li></ol><p>从上到下,分别对应Vue的概念可以理解为:定义仓库,&quot;共享状态&quot;,&quot;共享函数&quot;,&quot;共享加工后的状态&quot;.<br> 其实对应Vuex也是有相关概念的,可以说是&quot;取其精华弃其糟粕&quot;的一个产物.</p><p>那么正式学习前的理解到此,以下是官网上的一些新认识.</p><h2 id="definestore-key-content" tabindex="-1"><code>defineStore(key, content)</code> <a class="header-anchor" href="#definestore-key-content" aria-label="Permalink to &quot;\`defineStore(key, content)\`&quot;">​</a></h2><ol><li>key为什么字符串就可以了?为什么不用像InjectionKey一样,拿<code>Symbol</code>作为key?</li><li>既然content可以用类似setup function一样引入,为什么<code>&lt;script setup&gt;</code>可以不用return就能在<code>&lt;template&gt;</code>中使用;而<code>defineStore</code>里,仍旧需要return object,将需要的内容暴露出来?</li><li>甚者,上面的问题越读越不明白.</li></ol><blockquote><p>&quot;setup function里定义的state,必须所有都返回出来,且不能是只读属性,否则会破坏SSR,devtools,and other plugins.&quot;</p></blockquote><ol start="4"><li></li></ol><p><code>content</code>可以有两种形式:一个<code>Options</code>对象,或是匿名函数返回.</p><h3 id="options" tabindex="-1"><code>Options</code> <a class="header-anchor" href="#options" aria-label="Permalink to &quot;\`Options\`&quot;">​</a></h3><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> useUserStore</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineStore</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;users&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    state</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        count:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        name:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Eduardo&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    getters:{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        double</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">state</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> state.count </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    actions:{</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        increment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.count</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h3 id="setup-function" tabindex="-1">Setup function <a class="header-anchor" href="#setup-function" aria-label="Permalink to &quot;Setup function&quot;">​</a></h3><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> useProductStore</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineStore</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;products&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> items</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">([]);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> itemsCount</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  computed</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> items.value.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">length</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> clearItems</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        items.value.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">length</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        items,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        itemsCount,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        clearItems</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Setup Store的一个优点是,可以在内部使用全局<code>provide</code>的值,就是说可以在store function内,<code>inject</code>某些内容,比如Router或Route信息.<br> 缺点是需要return一个对象,将所有定义的内容都返回出去,感觉有点多余.</p><p>而Options Store,优点明显就是向下兼容了,对Vue2习惯Options API的用户明显更容易使用; 且不用将定义的内容返回出去.<br> 缺点是灵活性没那么强;actions里使用state的内容甚至出现<code>this</code>,明显更容易出错,混淆.</p><p>如果需要重置仓库内容,Options API有<code>store.$reset</code>这个自带方法;Setup function则需要自定义方法,自行对需要重置的内容进行还原. <code>function $reset(){count.value = 0}</code></p></div><p><strong>仓库的创建时机是:实际调用<code>useXXXStore()</code>时.</strong><br> 不在<code>setup</code>里调用这个函数,仓库内容<strong>就不会被创建.</strong><br> 官方建议是,每个仓库的定义,分开到各自文件中去,这样能更好利用打包代码分块,以及Typescript类型推断.</p><h2 id="using-a-store" tabindex="-1">Using a store <a class="header-anchor" href="#using-a-store" aria-label="Permalink to &quot;Using a store&quot;">​</a></h2><p>使用的时候,各种潜在的问题就来了:</p><ol><li><code>useXXXStore()</code>返回的是一个<code>reactive</code>包裹的对象,因此: <ul><li>在setup里使用,不用<code>.value</code>.(<code>ref</code>包裹的才需要)</li><li><strong>解构需谨慎,直接解构可能仓库内容的响应性就消失了</strong></li></ul></li><li>为了解决可能的,解构导致内容响应性丢失的问题,你需要使用<code>storeToRefs()</code> API.(state和getters如需解构,则必须使用这个API.action则不需要,可以直接从store解构)</li></ol><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> store</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useUserStore</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">count</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">double</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> storeToRefs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(store);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">increment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> store;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="guess-what" tabindex="-1">Guess what <a class="header-anchor" href="#guess-what" aria-label="Permalink to &quot;Guess what&quot;">​</a></h2><p>漏了最最最基础的一步,<code>defineStore()</code>之前还要在全局注册插件:</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// main.ts</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { createPinia } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;pinia&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> pinia</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> createPinia</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// const app = createVue(App);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">app.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(pinia);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app.mount(&#39;#app&#39;);</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div>`,25)]))}const E=i(t,[["render",l]]);export{c as __pageData,E as default};
