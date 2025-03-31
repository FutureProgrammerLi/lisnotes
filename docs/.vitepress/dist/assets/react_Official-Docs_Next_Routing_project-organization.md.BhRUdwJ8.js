import{_ as e}from"./app.DOQjh19Y.js";import{c as i,o as s,ab as o}from"./chunks/vendor.Behu2R7A.js";const t="/assets/project-organization-not-routable.CRlT2kQd.jpg",r="/assets/project-organization-colocation.S9frZ4u6.jpg",l="/assets/project-organization-private-folders.aFjOUTUN.jpg",n="/assets/project-organization-route-groups.4BZcbEyD.jpg",p="/assets/project-organization-src-directory.b0bNGq1Y.jpg",c="/assets/project-organization-project-root.CPfSi2MP.jpg",d="/assets/project-organization-app-root.CawU1Dib.jpg",h="/assets/project-organization-app-root-split.C-Vz0v5W.jpg",y=JSON.parse('{"title":"项目组织及文件存放","description":"","frontmatter":{},"headers":[],"relativePath":"react/Official-Docs/Next/Routing/project-organization.md","filePath":"react/Official-Docs/Next/Routing/project-organization.md","lastUpdated":1738226181000}'),u={name:"react/Official-Docs/Next/Routing/project-organization.md"};function g(b,a,m,k,f,_){return s(),i("div",null,a[0]||(a[0]=[o('<h1 id="项目组织及文件存放" tabindex="-1">项目组织及文件存放 <a class="header-anchor" href="#项目组织及文件存放" aria-label="Permalink to “项目组织及文件存放”">​</a></h1><p>除了前文的路由文件夹及文件的命名习惯,Next其实是一个开放度很高的(unopinionated)框架,允许你以各种各样的方式组织和存放你的项目文件.<br> 本文介绍一些框架的默认行为及特性,从而帮助你更好的组织项目结构.</p><ul><li><a href="#默认安全的文件共存">默认安全的文件共存(Safe colocation?)</a></li><li><a href="#项目组织特性">项目组织特性</a></li><li><a href="#项目组织策略">项目组织策略</a></li></ul><h2 id="默认安全的文件共存" tabindex="-1">默认安全的文件共存 <a class="header-anchor" href="#默认安全的文件共存" aria-label="Permalink to “默认安全的文件共存”">​</a></h2><p>在<code>app</code>文件夹内,嵌套的文件结构实际上就是对应的路由结构.<br> 每个文件夹都代表着一个路由分块,都会有与之对应的,实际URL路径的分块.(路由分组及一些特殊情况是例外)<br> 然而尽管路由结构由文件夹结构所定义,一个路由分块是否公开可访问,取决于对应文件夹内是否存在<code>page.js</code>或<code>route.js</code>文件.(是否有可访问的内容,page是展示,route是接口返回数据?) <img src="'+t+'" alt="routes-not-accessible"> 也就是说,一般的非特殊命名的文件,是可以存放于<code>app</code>目录之下的,它们不会突然地就被公开访问到.(对比<code>page.js</code>等conventional files) <img src="'+r+'" alt="routes-accessibility"></p><div class="tip custom-block"><p class="custom-block-title">TIP</p><ul><li>以上行为仅限于<code>app</code>目录下的路由组织.任意<code>pages</code>目录下的文件都会被认为是可访问的路由.(真的吗?)</li><li>你可以将必要的文件放在<code>app</code>目录下而不被外界访问,但这也不是必须的.<a href="#将项目文件存放于app之外">把一些需要的文件放在<code>app</code>目录以外组织</a>也行,看你喜欢.</li></ul></div><h2 id="项目组织特性" tabindex="-1">项目组织特性 <a class="header-anchor" href="#项目组织特性" aria-label="Permalink to “项目组织特性”">​</a></h2><p>Next.js为您提供了一些特性,帮助你更好的组织项目.</p><h3 id="私有文件夹" tabindex="-1">私有文件夹 <a class="header-anchor" href="#私有文件夹" aria-label="Permalink to “私有文件夹”">​</a></h3><p><code>_folderName</code>,这种在文件夹名前添加了下划线的,就是私有文件夹.<br> 这样的命名告诉了Next,文件夹的内容是一些私人定制化实现(private implementation),不需要作为应用的路由被看待.也就是说,整个文件夹,包括其子文件夹的内容都不作为路由部分. <img src="'+l+'" alt="private-folders"> 由于<code>app</code>目录下的文件本来就可以安全的共存,私有文件夹甚至不需要这个特性(not required for colocation).<br> 不过,以下场景下私有文件夹还是很有用的:</p><ul><li>区分UI逻辑和路由逻辑</li><li>统一(Consistently?)组织项目内部文件及来自Next生态的相关文件(?)</li><li>在编辑器内实现文件夹的排序及分组(?)</li><li>避免自己的项目命名,与未来Next特性文件命名冲突.(今天的<code>page</code>,明天就变成<code>site</code>(举例,你也说不准未来会有什么特殊文件命名))</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><ul><li>下划线开头作为私有文件夹的命名方式其实不限于Next框架,在任何系统中我们都推荐,将下划线开头命名,作为私有文件夹的标记.</li><li>下划线通过URL编码加密的结果是<code>%5F</code>,这意味着你可以通过将文件夹命名为<code>%5FfolderName</code>,从而使<code>/_fileName</code>这个路由变得可以访问.(什么叛逆行为.又要私有又要下划线作为路径分块!?!?)</li><li>如果你不太愿意使用私有文件夹,那我们建议您去了解一些Next内,特殊的命名习惯,用以避免不必要的命名冲突.</li></ul></div><h3 id="路由分组" tabindex="-1">路由分组 <a class="header-anchor" href="#路由分组" aria-label="Permalink to “路由分组”">​</a></h3><p><code>(fileName)</code>,用括号将文件夹名括起来,就表示这是一个路由分组.<br> 它的意思就是这个目录出于方便代码组织的原因,把相关路由放到同一个地方,而不被URL路径所包含.<br><img src="'+n+'" alt="organization-route-groups"> 路由分组的作用是:</p><ul><li>根据路由内容划分组,比如网站的不同部分,网页的不同内容,或是不同的网页制作团队.</li><li>在相同的路由分块内使用嵌套布局 <ul><li>同一个分块内使用多个嵌套布局,也可以是多个根布局</li><li>在一个共用的分块内,为整个子路由树添加一个通用的布局 <a href="./route-groups.html#路由分组">怎么用其实也说过,这里属于复述了</a></li></ul></li></ul><h3 id="src目录" tabindex="-1"><code>src</code>目录 <a class="header-anchor" href="#src目录" aria-label="Permalink to “src目录”">​</a></h3><p>Next支持将整个应用的代码都存放于一个叫<code>src</code>的可选目录之下(包括<code>app</code>目录).这样做的原因是可以将应用的代码,跟项目的配置文件所区分开来.(像<code>next.config.js</code>,<code>package.json</code>这些一般就在项目的根目录内) <img src="'+p+`" alt="optional-src-directory"></p><h3 id="模块路径别名-aliases" tabindex="-1">模块路径别名(Aliases) <a class="header-anchor" href="#模块路径别名-aliases" aria-label="Permalink to “模块路径别名(Aliases)”">​</a></h3><p>Next支持模块路径别名的功能.这在引入一些嵌套很深的文件时很有用,而且可读性也会增加:</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// app/dashboard/settings/analytics/page.js</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 用别名前</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { Button } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;../../../components/button&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//用别名后</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { Button } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@/components/button&#39;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="项目组织策略" tabindex="-1">项目组织策略 <a class="header-anchor" href="#项目组织策略" aria-label="Permalink to “项目组织策略”">​</a></h2><p>Next项目组织的方式没有对错之分.<br> 接着我们来介绍一些比较&quot;高级&quot;的常用组织策略.我们建议您选择采取其中一种策略,然后在项目当中贯彻使用它.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>以下的例子中,我们会用到<code>components</code>和<code>libs</code>文件夹,其实更多只是用于告知(placeholder),而非强迫.您的项目当然可以使用其它更加具体的文件夹命名,比如<code>ui</code>,<code>utils</code>,<code>hooks</code>,<code>style</code>等等.怎么方便怎么来.</p></div><h3 id="将项目文件存放于app之外" tabindex="-1">将项目文件存放于<code>app</code>之外 <a class="header-anchor" href="#将项目文件存放于app之外" aria-label="Permalink to “将项目文件存放于app之外”">​</a></h3><p>这个策略的主要目的是,将<code>app</code>目录仅用于路由系统,而把其它组成部分都放在<code>app</code>之外另外组织.(????) <img src="`+c+'" alt="outside-app-folder"></p><h3 id="将项目文件全都放在app里面" tabindex="-1">将项目文件全都放在<code>app</code>里面 <a class="header-anchor" href="#将项目文件全都放在app里面" aria-label="Permalink to “将项目文件全都放在app里面”">​</a></h3><p>如标题所说,什么文件都放到<code>app</code>里统一管理. <img src="'+d+'" alt="inside-app-folder"></p><h3 id="根据文件特性或路由区分项目文件" tabindex="-1">根据文件特性或路由区分项目文件 <a class="header-anchor" href="#根据文件特性或路由区分项目文件" aria-label="Permalink to “根据文件特性或路由区分项目文件”">​</a></h3><p>一些全局通用的应用代码放到<code>app</code>的顶层目录下,然后根据代码用途,路由相关性,再将文件夹进行下一步区分. <img src="'+h+'" alt="feature-route-splitting"></p><h2 id="接下来" tabindex="-1">接下来 <a class="header-anchor" href="#接下来" aria-label="Permalink to “接下来”">​</a></h2><ul><li><a href="https://nextjs.org/docs/app/building-your-application/routing/defining-routes" target="_blank" rel="noreferrer">路由定义</a></li><li><a href="https://nextjs.org/docs/app/building-your-application/routing/route-groups" target="_blank" rel="noreferrer">路由分组</a></li><li><a href="https://nextjs.org/docs/app/building-your-application/configuring/src-directory" target="_blank" rel="noreferrer"><code>src</code>目录</a></li><li><a href="https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases" target="_blank" rel="noreferrer">绝对路径导入和模块路径别名</a><br> (前两个都翻译过了,这里还是链接去next官网吧.)</li></ul>',31)]))}const N=e(u,[["render",g]]);export{y as __pageData,N as default};
