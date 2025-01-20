import{_ as r,c as t,a as n,o as a}from"./app.DrsAtc4B.js";const o="/assets/client-and-server-environments.DdMT7-xk.jpg",h=JSON.parse('{"title":"渲染","description":"","frontmatter":{},"headers":[],"relativePath":"react/Next/Official-Docs/Rendering/Rendering.md","filePath":"react/Next/Official-Docs/Rendering/Rendering.md","lastUpdated":1735146166000}'),i={name:"react/Next/Official-Docs/Rendering/Rendering.md"};function l(s,e,p,c,d,g){return a(),t("div",null,e[0]||(e[0]=[n('<h1 id="渲染" tabindex="-1">渲染 <a class="header-anchor" href="#渲染" aria-label="Permalink to &quot;渲染&quot;">​</a></h1><p>渲染,是将代码转化成用户界面的一个过程.React和Next都允许&quot;混合模式&quot;搭建网页应用:部分代码在服务器上渲染,部分代码在客户端上渲染.本篇内容主要介绍不同渲染环境,渲染策略及运行时之间的区别.</p><h2 id="基础" tabindex="-1">基础 <a class="header-anchor" href="#基础" aria-label="Permalink to &quot;基础&quot;">​</a></h2><p>首先,我们先要清楚三个基本的网络概念:</p><ul><li>应用代码能够在哪些环境(<a href="https://nextjs.org/docs/app/building-your-application/rendering#rendering-environments" target="_blank" rel="noreferrer">Environments</a>)下被执行:服务器上和客户端上.</li><li>当用户访问页面时,<a href="https://nextjs.org/docs/app/building-your-application/rendering#request-response-lifecycle" target="_blank" rel="noreferrer">请求响应的生命周期</a>是怎样的?</li><li>区分服务器和客户端代码的<a href="https://nextjs.org/docs/app/building-your-application/rendering#network-boundary" target="_blank" rel="noreferrer">&quot;网络边界&quot;</a>又是什么?</li></ul><h3 id="渲染环境" tabindex="-1">渲染环境 <a class="header-anchor" href="#渲染环境" aria-label="Permalink to &quot;渲染环境&quot;">​</a></h3><p>网络应用能够在两种环境下被渲染:服务器端和客户端. <img src="'+o+'" alt="environments"></p><ul><li><strong>客户端</strong>,指的是用户设备上,向服务器端发送代码请求的浏览器.它将服务器端的响应转化为用户看到的界面.</li><li><strong>服务器端</strong>,是数据中心的计算器(the computer),用于存储你应用的代码,接收来自客户端的请求,将对应的请求答复给客户端.</li></ul><p>过去的开发者不得不使用不同的语言(比如JS和PHP)和框架,分别编写代码以供服务器和客户端运行.而用了React框架,开发者就能使用相同的开发语言(JS)和相同的框架(比如Next或其它选择)开发两端代码了.这种灵活性能够让你无缝地编写两端代码,不用担心上下文知识的切换了.(context switching)</p><p>不过每个框架都有所长(chang),所短.因此,为服务器端编写的代码,通常跟为客户端的代码不尽相同.某些特定的操作(像数据获取,或是用户状态的管理),在某个的环境下进行会更加方便合适(better suited).</p><p>了解之间的不同对于使用React和Next框架是相当重要的.我们会在之后的介绍中涵盖更多更为细节的,服务器端页面和客户端页面的区别及使用案例.目前而言,我们还是先继续介绍一些基础知识吧.</p><h3 id="请求-响应生命周期" tabindex="-1">请求-响应生命周期 <a class="header-anchor" href="#请求-响应生命周期" aria-label="Permalink to &quot;请求-响应生命周期&quot;">​</a></h3><p>广义上讲,所有的网页都有相同的<strong>请求-响应生命周期</strong>(Request-Response Lifecycle):</p><ol><li><strong>用户行为(User Action):</strong> 用户与网页应用发生互动.这个互动可以是点击了一条链接,可以是提交了一个表单,也可以是直接从浏览器输入栏中输入并访问了某个URL.</li><li><strong>HTTP请求:</strong> 客户端向服务器端发送一个HTTP请求,该请求内包括了一些如需要请求到的资源是什么,使用的请求方法是什么(如<code>GET</code>,<code>POST</code>),以及一些必要的额外信息.</li><li><strong>服务器操作:</strong> 服务器对接收到的请求进行处理并以相应的资源进行回复.这个过程可能包括一系列像路由,数据获取等的操作.</li><li><strong>HTTP回复:</strong> 处理完请求后,服务器会将一个HTTP响应回复给客户端.该响应内包括一个状态码(告知客户端请求是否成功),以及请求对应的资源(比如HTML,CSS,JS,静态资源等等).</li><li><strong>客户端处理:</strong> 客户端对响应的资源进行分析,并渲染到用户界面上.</li><li><strong>用户行为:</strong> 页面渲染完成后,用户就可以在页面上再进行互动了.之后的过程就是不断重复以上的步骤了.</li></ol><p>如果要构建一个&quot;混合&quot;的网页应用,十分重要的一点是决定要如何划分不同周期内的代码,应该把&quot;网络边界&quot;(Network Boundary)放到哪里.</p><h3 id="网络边界" tabindex="-1">网络边界 <a class="header-anchor" href="#网络边界" aria-label="Permalink to &quot;网络边界&quot;">​</a></h3><p>网络开发中,网络界限是一条&quot;概念线&quot;,用以区分不同的环境.比如说,客户端和服务器端,或是服务器端和数据仓库.<br> 而在React,服务器端和客户端的界限交由你决定,只要足够合理即可(makes most sense).<br> 实际上,两端的工作分为两部分进行:<strong>客户端模块图和服务器模块图</strong>.(client/server module graph).服务器模块图包含了所有需要在服务器上渲染的组件,客户端模块图则包含了所有需要在客户端上渲染的组件.<br> 将模块图视为一种应用文件互相依赖的视觉表现(visual representation),能够更好地帮你理解其中的内容.(?)<br> 你可以用<code>&quot;use client&quot;</code>来定义客户端组件;也可以用<code>&quot;use server&quot;</code>标记服务器组件,告诉React在服务器上做些计算工作.</p><h2 id="构建混合应用" tabindex="-1">构建混合应用 <a class="header-anchor" href="#构建混合应用" aria-label="Permalink to &quot;构建混合应用&quot;">​</a></h2><p>当你需要同时在两个环境中运行时,将代码流向(flow of the code)想象为单向的比较好.换句话说就是,在响应过程中,应用代码的流向一个方向:从服务器端流向客户端.<br> 如果要从客户端访问到服务器端,那你则需要向服务器端发送一个新的请求,而不是复用(re-use)一个相同的请求.这样才有利于你理解,你的组件需要在哪个环境下被渲染,你的网络边界又要放在哪里.<br> 实际应用中,这种心智模型能帮助开发者思考,在响应请求和使页面变得可互动之前,他们要在服务器端上进行什么操作.<br> 当你要在组件树中混合使用服务器端组件和客户端组件时,上面的思考结果则显得更为清晰重要了.</p><ul><li><a href="https://nextjs.org/docs/app/building-your-application/rendering/server-components" target="_blank" rel="noreferrer">服务器组件</a></li><li><a href="https://nextjs.org/docs/app/building-your-application/rendering/client-components" target="_blank" rel="noreferrer">客户端组件</a></li><li><a href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns" target="_blank" rel="noreferrer">混合模式</a></li><li><a href="https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering" target="_blank" rel="noreferrer">部分预渲染</a></li><li><a href="https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes" target="_blank" rel="noreferrer">运行时</a></li></ul>',20)]))}const f=r(i,[["render",l]]);export{h as __pageData,f as default};
