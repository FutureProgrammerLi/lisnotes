import{_ as i,c as a,a2 as t,o as n}from"./chunks/framework.DPuwY6B9.js";const c=JSON.parse('{"title":"学习Typescript时一些自己的问题","description":"","frontmatter":{},"headers":[],"relativePath":"ts/Self-Explored.md","filePath":"ts/Self-Explored.md"}'),e={name:"ts/Self-Explored.md"};function h(l,s,k,p,d,r){return n(),a("div",null,s[0]||(s[0]=[t(`<h1 id="学习typescript时一些自己的问题" tabindex="-1">学习Typescript时一些自己的问题 <a class="header-anchor" href="#学习typescript时一些自己的问题" aria-label="Permalink to &quot;学习Typescript时一些自己的问题&quot;">​</a></h1><p><strong>1. 怎么声明一个参数是函数?</strong></p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useDebounce</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">args</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> :</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> any</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[]]) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">dealy</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">){</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/*... */</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useThrottle</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">callback</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">delay</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">){</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* */</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>二者的区别是什么? 为什么要利用泛型? 为什么不能直接<code>callback:Function</code>?</p><ul><li><code>Function</code>是Typescript的内置类型,表示所有函数的类型,是一个更宽泛的类型.</li><li>缺乏参数信息,如果只用<code>T extends Function</code>,就无法确定函数接收什么类型的参数,也无法保证函数的返回类型.所有的函数类型都符合<code>Function</code>类型,相当于没用.(仅次于<code>any</code>了吧?)</li></ul><hr><ul><li><code>T extends (...args:any[]) =&gt; void)</code>不仅要求T是一个函数,还表示它接收任意多个,任意类型的参数,且该函数无返回,或返回空值(<code>void</code>的意义)</li><li>类型安全,TS会检查函数的参数类型与期望的类型是否匹配.虽然这里是<code>(...args:any[])</code>,本意是剩余参数会整合成数组,而数组项的类型可以是任意的.</li></ul><hr><p><strong><code>(...args:any[]) =&gt; void</code>表示<code>T</code>是一个接收任意数量和任意类型参数的函数,并且没有返回值.<code>...args:any[]</code>表示一个参数列表,可以接受多个参数,类型为<code>any</code>.</strong> -- from GPT.</p><hr><p><strong><code>(...args:Parameters&lt;T&gt;) =&gt; {}</code>又是什么意思?</strong><br> 一个函数,接收的参数跟泛型T的类型一样,其实就是避免重写<code>(...args:any[]) =&gt; void</code>了.</p>`,11)]))}const g=i(e,[["render",h]]);export{c as __pageData,g as default};