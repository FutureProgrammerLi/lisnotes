import{_ as e,g as r,h as o,j as a}from"./app.6VWSqaS0.js";import"./chunks/sidebar.BmwjEMFp.js";const g=JSON.parse('{"title":"Introduction","description":"","frontmatter":{},"headers":[],"relativePath":"vue/Nuxt/Introduction.md","filePath":"vue/Nuxt/Introduction.md","lastUpdated":1717433316000}'),i={name:"vue/Nuxt/Introduction.md"};function n(s,t,l,u,c,d){return a(),r("div",null,t[0]||(t[0]=[o('<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-label="Permalink to &quot;Introduction&quot;">​</a></h1><blockquote><p>看完了Next.js的教程,对比一下Nuxt.js<br><a href="https://nuxt.com/docs/getting-started/introduction" target="_blank" rel="noreferrer">https://nuxt.com/docs/getting-started/introduction</a><br> &quot;跟自己&quot;对比一下就是,&quot;Nuxt的亿点点好处(本文)&quot; -&gt; <a href="/react/Next/Why-Next.html">&quot;Next的亿点点好处&quot;</a></p></blockquote><p style="font-size:1.125rem;line-height:1.75rem;">Nuxt的目标是让网页开发更加简单易懂,为网页开发者提供更高性能的开发体验</p><hr><p>Nuxt是一个免费开源的框架.它为Vue开发者提供一种可扩展的,类型安全的,高性能的,构建生产级别网页的方式.<br> 我们在框架里帮你做了很多东西,你可以轻松地编写<code>.vue</code>文件,并在开发中体验热模块更新带来的便捷,以及享受生产环境中自带的高性能服务器端渲染带来的好处.<br> Nuxt没有内置的三方依赖,你可以把用Nuxt写的项目部署到任何地方,甚至可以是<code>edge</code>.</p><div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p>💡如果你想在浏览器中体验,可以去这里, <a href="https://codesandbox.io/p/sandbox/github/nuxt/starter/tree/v3/" target="_blank" rel="noreferrer">Sandbox</a>或者<a href="https://stackblitz.com/github/nuxt/starter/tree/v3" target="_blank" rel="noreferrer">StackBlitz</a></p></div><hr><h2 id="自动化及一些习惯" tabindex="-1">自动化及一些习惯 <a class="header-anchor" href="#自动化及一些习惯" aria-label="Permalink to &quot;自动化及一些习惯&quot;">​</a></h2><p>Nuxt有一些&quot;约定成俗&quot;,你也可以说它是死板,就是利用固定的文件目录结构将一些需要重复的任务&quot;自动化&quot;,这样可以让开发者更专注于网页业务的开发.如果你想不那么&quot;死板&quot;,当然可以去配置文件自定义或者重写这些行为.</p><ul><li><strong>基于文件系统的路由:</strong> Nuxt自动根据你<a href="https://nuxt.com/docs/guide/directory-structure/pages" target="_blank" rel="noreferrer"><code>/page</code>目录</a>生成路由.这样更容易组织你的应用,避免手动配置路由.(VitePress怎么就没有这个功能还要在.vitepress/config里手动写呢??!?!)</li><li><strong>代码分割:</strong> Nuxt自动把你的代码分成小块(chunks),这样可以<em>减少页面首次加载时间</em>.</li><li><strong>自带服务器端渲染:</strong> Nuxt天然带有SSR的能力,你不需要独立分开设置你的服务器.(?怎么区分SSR和自己写的Components?)</li><li><strong>自动导入:</strong> 分别在对应的目录下编写可重用逻辑以及组件,你就不需要手动的引入了.而且这样自动导入的方式还能帮忙tree-shaking,优化JS打包.(?在<code>components/</code>,<code>/composables</code>里导出的东西,可以自动全局使用?这样真的不会造成困惑吗?)</li><li><strong>使用的数据获取工具:</strong> Nuxt有专门的composables处理数据获取,这种获取方式是跟SSR所匹配的.当然还有其它不同的策略帮助你实现数据获取.</li><li><strong>零配置Typescript支持:</strong> 不用强制学习Typescript后才能编写类型安全的代码,Nuxt内置自动生成类型,以及<code>tsconfig.json</code>供你配置.</li><li><strong>帮你配置好了的打包工具:</strong> 默认使用<a href="https://vitejs.dev/" target="_blank" rel="noreferrer">Vite</a>实现开发时的热更新,生产环境中的&quot;一键打包&quot;(baked-in)<br> Nuxt为你提供了以上及不限功能,还提供了前后端的一些工具,这样,<strong>你就可以更专注于构建你的网页应用了.</strong></li></ul><h2 id="服务器端渲染-ssr" tabindex="-1">服务器端渲染(SSR) <a class="header-anchor" href="#服务器端渲染-ssr" aria-label="Permalink to &quot;服务器端渲染(SSR)&quot;">​</a></h2><p>Nuxt默认带有服务器端渲染的功能,这样你就不需要额外配置服务器了.此外这样做的好处还有:</p><ul><li><strong>更快的页面首次加载速度:</strong> Nuxt把渲染好的HTML页面发给浏览器,这样页面就能立即被展示胡来了.页面能更快展示给用户,从而提高用户体验,尤其对于网络环境差或是设备配置低的情况下这种优化更为重要.</li><li><strong>更好的SEO:</strong> 搜索引擎能更好的为SSR渲染的页面作索引.因为HTML的内容都是立即可用(available),已经渲染好了的,不是在客户端请求JS再渲染出来的.</li><li><strong>在较差的设备上有更好的性能:</strong> 对于那些加载个网页都满头大汗的设备,Nuxt能减少需要加载的代码,从而减轻设备压力,提高用户体验.</li><li><strong>更高的可使用性:</strong> 页面初次加载即可用,者对于需要阅读屏幕,或是其它协助技术的用户来说简直太有必要了.</li><li><strong>更容易缓存:</strong> 页面可以在服务器端缓存,这样后期使用时就可以减少生成内容并发送给给客户端所需的时间了. 总结就是,服务器端渲染能提供更快更搞笑的用户体验,增强搜索引擎优化,提高网页访问量.<br> Nuxt不仅限于此,它还可以利用<code>nuxt generate</code>生成静态网页,<code>ssr:false</code>全局禁止SSR,甚至是配置<code>routeRules</code>这一项,实现混合渲染(hybrid rendering).(就是SSR,SSG,Hybrid可以根据需要自己选择)</li></ul><h2 id="服务器引擎" tabindex="-1">服务器引擎 <a class="header-anchor" href="#服务器引擎" aria-label="Permalink to &quot;服务器引擎&quot;">​</a></h2><p>Nuxt的全栈实现能力依赖于<a href="https://nitro.unjs.io/" target="_blank" rel="noreferrer">Nitro</a>引擎.<br> 开发阶段,Nitro使用Rollup和Node.js工人实现服务器端代码及上下文隔离.而且它通过读取<code>server/api/</code>及<code>server/middleware/</code>中的文件,生成服务器API和中间件.<br> 生产阶段,Nitro把你的应用及服务器全都打包到<code>.output</code>目录下.这个打包目录是很小的:因为它已经被代码最小化,脱离了Node Modules了(除开一些polyfills).你可以把这个包部署到任意支持JS的系统,比如Node.js,Serverless,Workers,Edge-side rendering,或者就让它纯静态的.</p><div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p><a href="https://nuxt.com/docs/guide/concepts/server-engine" target="_blank" rel="noreferrer">更多关于Nuxt的服务器引擎</a></p></div><h2 id="模块化" tabindex="-1">模块化 <a class="header-anchor" href="#模块化" aria-label="Permalink to &quot;模块化&quot;">​</a></h2><p>模块化系统让Nuxt更容易自定义功能,与第三方服务整合.</p><div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p><a href="https://nuxt.com/docs/guide/concepts/modules" target="_blank" rel="noreferrer">更多关于Nuxt的模块化功能</a></p></div><h2 id="总体结构" tabindex="-1">总体结构 <a class="header-anchor" href="#总体结构" aria-label="Permalink to &quot;总体结构&quot;">​</a></h2><p>Nuxt主要由以下几个关键包组成:</p><ul><li>核心引擎:nuxt</li><li>打包器: @nuxt/vite-builder 和 @nuxt/webpack-builder</li><li>命令行界面: nuxi</li><li>服务器端引擎: nitro</li><li>开发工具库: @nuxt/kit</li><li>Nuxt2连接工具: @nuxt/bridge(用于升级,兼容?)</li></ul><p>我们建议您了解每一个相关的核心概念以及包,从而对Nuxt的功能有更全面的认识.</p>',23)]))}const x=e(i,[["render",n]]);export{g as __pageData,x as default};
