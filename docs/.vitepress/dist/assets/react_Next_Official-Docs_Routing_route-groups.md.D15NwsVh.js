import{_ as e,c as a,a2 as t,o as c}from"./chunks/framework.DPuwY6B9.js";const r="/assets/route-group-organisation.CMdiD9KN.jpg",l="/assets/route-group-multiple-layouts.DP-VP9Xe.jpg",s="/assets/route-group-opt-in-layouts.B2rRZnUZ.jpg",d="/assets/route-group-multiple-root-layouts.IV-3h3TJ.jpg",f=JSON.parse('{"title":"路由分组","description":"","frontmatter":{},"headers":[],"relativePath":"react/Next/Official-Docs/Routing/route-groups.md","filePath":"react/Next/Official-Docs/Routing/route-groups.md"}'),i={name:"react/Next/Official-Docs/Routing/route-groups.md"};function p(u,o,n,h,g,m){return c(),a("div",null,o[0]||(o[0]=[t('<h1 id="路由分组" tabindex="-1">路由分组 <a class="header-anchor" href="#路由分组" aria-label="Permalink to &quot;路由分组&quot;">​</a></h1><p>在<code>app</code>目录下,文件夹之间的嵌套,实际就是URL分块的区分.不过,你可以使用标记,将某个文件夹划分为<em>路由组(Route Group)</em>,从而将它从路由URL路径中区分开来.<br> 这样做的原因,是可以让你在将路由分块和项目文件划分为逻辑组的同时,不影响实际URL的路径结构.(?有点绕口,保留文件基础的URL分层的同时,实现分组?)</p><p>路由分组在以下情形尤为有用:</p><ul><li>根据路由的功能划分为多个组,比如根据网站分块,网页内容,或是团队制作,区分路由组.</li><li>允许在同等级的分块中使用嵌套的布局文件(?) <ul><li>在同一个分块内创建多个嵌套布局,也可以是多个根布局</li><li>在一个共用的分块里,为整个子路由树添加一个布局.(?都是中文为什么我看不懂?)</li></ul></li></ul><h2 id="使用习惯" tabindex="-1">使用习惯 <a class="header-anchor" href="#使用习惯" aria-label="Permalink to &quot;使用习惯&quot;">​</a></h2><p>路由分组,就是将文件夹的名字用括号包裹起来:<code>(folderName)</code>(???感觉把我前面学的东西全报废了???)</p><h2 id="使用例子" tabindex="-1">使用例子 <a class="header-anchor" href="#使用例子" aria-label="Permalink to &quot;使用例子&quot;">​</a></h2><h3 id="不影响url路径的前提下组织路由" tabindex="-1">不影响URL路径的前提下组织路由 <a class="header-anchor" href="#不影响url路径的前提下组织路由" aria-label="Permalink to &quot;不影响URL路径的前提下组织路由&quot;">​</a></h3><p>为了在不影响URL路径的前提下组织路由,我们可以创建一个路由组,将所有相关的路由放到一起.用括号括起来的文件夹会被URL省略,不会出现在URL上:(比如下面的<code>(marketing)</code>和<code>(shop)</code>)</p><p><img src="'+r+'" alt="route-group-overview"> 尽管<code>(marketing)</code>和<code>(shop)</code>里面的路由处于同一层级的URL上(?同一父分块,都是/目录下的内容),你可以分别在它们的文件夹内添加<code>layout.js</code>,从而实现不同的布局. <img src="'+l+'" alt="route-group-layouts"></p><h3 id="将特定的分块适用于某一布局" tabindex="-1">将特定的分块适用于某一布局 <a class="header-anchor" href="#将特定的分块适用于某一布局" aria-label="Permalink to &quot;将特定的分块适用于某一布局&quot;">​</a></h3><p>如果要将特定的一些路由,改用为某个相同的布局,你可以创建一个路由分组(比如以下的<code>(shop)</code>),然后将这些路由(<code>acount</code>和<code>cart</code>)放到这个分组之内.在这个分组之外的路由不会用到这个特定的布局.(<code>checkout</code>): <img src="'+s+'" alt="groups-opt-in-layouts"></p><h3 id="创建多个根布局" tabindex="-1">创建多个根布局 <a class="header-anchor" href="#创建多个根布局" aria-label="Permalink to &quot;创建多个根布局&quot;">​</a></h3><p>如果要使用多个根布局,你需要先删除顶层的<code>app/layout.js</code>,再将路由进行分组,最后在各个分组内添加专属于每个组的<code>layout.js</code>.这对于那些需要同一网页,但内容完全不同的应用可能有用.当然了,<strong>每个根布局下,还是要包含到<code>&lt;html&gt;</code>和<code>&lt;body&gt;</code>标签的.</strong><img src="'+d+'" alt="groups-with-multiple-rootlayout"> 上图中<code>(marketing)/layout.js</code>和<code>(shop)/layout.js</code>都是根布局.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><ul><li>路由的分组名称,除了为了方便组织外并无它用.反正它们都不会影响到实际的URL.</li><li>路由分组之间的路由,不应产生相同URL.(不能因有分组而创建同级的相同文件夹名.)<br> 用例子来说就是,<code>(marketing)/about/page.js</code>和<code>(shop)/about/page.js</code>两个文件的路径,解析出来的URL是相同的,都是<code>/about/page</code>,这就会报错了.尽管分组不同,但最终的URL解析出来还是相同的.</li><li>如果你用了多个根布局,然后把顶层的<code>layout.js</code>也删除掉了,那你应用的入口<code>app/page.js</code>至少要放到其中一个分组中.比如<code>app/(marketing)/page.js</code>.</li><li>不同根布局的路由之间切换时,会加载整个页面(跟客户端导航行为相反).比如说你从使用了<code>app/(shop)/layout.js</code>的<code>/cart</code>路由,跳转到使用了<code>app/(marketing)/layout.js</code>的<code>/blog</code>,将导致整个页面的加载.这种不太好的行为只会出现在不同根布局之间的路由切换.</li></ul></div>',15)]))}const R=e(i,[["render",p]]);export{f as __pageData,R as default};
