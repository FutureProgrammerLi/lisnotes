import{_ as e}from"./app.DwUT4cp8.js";import{c as t,Y as r,o as a}from"./chunks/vue.C3nVHRy_.js";const p=JSON.parse('{"title":"前端框架的一些选择考虑","description":"","frontmatter":{},"headers":[],"relativePath":"js/Frameworks-pick.md","filePath":"js/Frameworks-pick.md","lastUpdated":1719822345000}'),l={name:"js/Frameworks-pick.md"};function i(u,o,c,d,s,n){return a(),t("div",null,o[0]||(o[0]=[r('<h1 id="前端框架的一些选择考虑" tabindex="-1">前端框架的一些选择考虑 <a class="header-anchor" href="#前端框架的一些选择考虑" aria-label="Permalink to &quot;前端框架的一些选择考虑&quot;">​</a></h1><blockquote><p>原文:<a href="https://dev.to/strapi/5-considerations-when-choosing-a-front-end-framework-2ki0" target="_blank" rel="noreferrer">https://dev.to/strapi/5-considerations-when-choosing-a-front-end-framework-2ki0</a><br> 作者: Juliet Ofoegbu<br> 为什么是这篇?<br><strong>感觉有用</strong>,哪怕自己会的框架只是React和Vue.希望不只是框架选择,更是周边生态,工具选择上的一些建议.</p></blockquote><p>一个项目是否成功,跟你选择的前端框架是否合适有着至关重要的联系.可选的框架多,不一定就是好事.每个框架都有对应的好处及缺点.而本篇文章则关注于,如何深刻理解一些因素,从而作出更明智的选择.<span class="text-xs text-blue-300 font-bold">(当然没有完美的选项,都是在尽力合理化而已.最适合的才是最好的)</span></p><p><strong>本文主要分析五个实质性的问题,看看达到一个&quot;明智的选择&quot;需要经过怎样的过程.</strong> 面向的人群可以是前端开发者,技术大头,CTOs,甚者整个公司.只要你的目的是想&quot;比较正确&quot;的选择需要的框架.<br> 通过<strong>项目需求,社区讨论支持,性能,规模弹性以及学习曲线的分析</strong>,你将清晰如何正确选择框架从而更容易实现你的项目目标.<br> 废话到此,就开始吧.</p><h2 id="_1-项目需求" tabindex="-1">1.项目需求 <a class="header-anchor" href="#_1-项目需求" aria-label="Permalink to &quot;1.项目需求&quot;">​</a></h2><p>项目需求,是一个项目最为关键的因素.你必须清晰你的项目到底要实现什么具体功能,满足什么需要,才能完成接下来的步骤.<br> 每个项目都有具体的需求.项目可简可繁,但都有其独特的需求.因此你所选的框架必须跟这些需求保持一致.<br> 以下是一些根据需求选择框架需要考虑的因素:</p><ol><li>功能需求:<br> 你的项目跟什么相关?是需要实时数据更新,复杂的状态管理,电子商务的功能?用户跟踪或是商品跟踪?又还是以上这些的结合?<br> 这种情况其实比较好办.你可以去参考现成的,实际已经投入使用,已经被实践证明有用了的框架.(换人话就是,看看对应大厂用了什么技术你就可以跟着用).举例就是,你用<code>Astro或React</code>来构建电子商务应用.它们都支持基于组件结构的,易于管理及扩建的复杂应用网页搭建.你可以用这些框架编写可重用的,商品列表组件,购物车组件,结账过程逻辑等等. (?换个框架不可以嘛)</li><li>应用复杂度:<br> 项目比较简易,框架选择也应尽量轻量化,比如选用<code>Vue.js</code>,因为它足够灵活.<code>Svelte</code>也行,它们都是以&quot;轻量化&quot;著名的.<br> 而项目规模可能发展庞大,可能就需要选择回归<code>React或Angular</code>了.因为它们有着更为广阔的生态系统.(?真不是偏见嘛,Vue生态也不差吧?)</li></ol><h2 id="_2-社区支持及生态系统" tabindex="-1">2.社区支持及生态系统 <a class="header-anchor" href="#_2-社区支持及生态系统" aria-label="Permalink to &quot;2.社区支持及生态系统&quot;">​</a></h2><p>社区的力量是庞大的.你需要选择生态庞大,社区支持较好的前端框架.以下就是理由:</p><ol><li>社区规模,支持以及解决问题:<br> 如果框架背后的社区足够庞大及人员足够活跃,那简直能帮你大忙.更多的资源,包括学习指导,文档介绍以及讨论论坛,都能在你使用该框架遇到困难的时候拉你一把. 无论是刚上手,还是老手开发遇到未曾见过的问题,合理利用这些资源就更有可能帮你把困难解决.别人踩过的坑你可以跳过了.一些比较著名的,&quot;填土机&quot;(专门填坑的&quot;东西&quot;)就是,<code>Stack Overflow, Discord, GitHub, Reddit</code>.<br> 像React和Vue,它们的社区就很活跃.不少开发者也会主动帮助其它开发者,对框架的发展及维护出一份力.</li><li>库及工具生态<br> 另一个需要考虑的重要因素就是,对应框架的其它工具库.它们的存在能加速你的开发进程.这些第三方资源,像库,插件,现有组件及工具,整合到框架内后都能大幅提升你的开发效率.<br> 开发快了换句话说就是你能开发更多了(人话?).一些功能的实现直接借助已有的就行,不用再自己&quot;造火箭&quot;了.像<code>Vue</code>的配备<code>Vuex</code>,直接就能解决你开发的一大状态管理的问题了.</li><li>日常更新及长期可用性<br> 社区庞大的框架,更新维护,性能提升这些东西可以说是日常了.(不说是好是坏,反正有问题了更有可能被修复就是了)<br> 这些更新一般是随大流的,甚至是&quot;引领潮流&quot;的.开发安全问题大抵也不用过多担忧.也就是说,一个时常更新的框架能够给开发者带来持续的信心,项目在此基础也能进行长期开发与维护.</li></ol><h2 id="_3-性能" tabindex="-1">3.性能 <a class="header-anchor" href="#_3-性能" aria-label="Permalink to &quot;3.性能&quot;">​</a></h2><p>性能也是选择框架时的一个考虑,因为它直接影响用户的体验及应用的全面效用.以下细说:</p><ol><li>加载时间<br> 人类最初的注意力平均时间为8秒,因此你需要在这8秒内,留住用户.如果你失败了,网页加载慢了,用户很可能就走了.(那这个网页可以直接判为一个&quot;失败&quot;的作品了.对,不折不扣的失败.)<br> 加载时间越短,页面切换越丝滑,越能留住用户.<code>React,Astro,Vue</code>这些框架都在这方面实现得相当不错,想留住用户可以选择用这些.(?又是这些)</li><li>渲染效率<br> 框架渲染页面的方式,会影响项目的响应性.举例说,用Virtual DOM更新页面组件的框架,比如React,性能会更高.<br> 又比如,支持服务器端渲染的框架,像Next或Nuxt,也能通过在服务器上预渲染页面,减少在客户端上的加载时间,从而为用户提供更好的体验.</li><li>优化能力<br> 代码优化也能提高项目性能.像代码分块,懒加载,摇树这些技术,就是为了减少初次加载速度,提高项目性能而实现的.<code>React,Angular,Svelte</code>都提供了内置工具,助你优化应用性能.</li></ol><h2 id="_4-规模扩展及可维护性" tabindex="-1">4.规模扩展及可维护性 <a class="header-anchor" href="#_4-规模扩展及可维护性" aria-label="Permalink to &quot;4.规模扩展及可维护性&quot;">​</a></h2><p>可扩展性,指应用内容增加时的处理能力.(新功能能不能加?加了会不会崩?)<br> 可维护性,指维护应用时的难易程度,像问题修复,功能添加,或是功能添加这些,花的时间越少当然可维护性就越强了.<br> 以上两点也是你在选择框架时需要考虑的内容.越好,发展就更可能容易,更可能快,更经得住时间的考验.</p><ol><li>可扩展性<br> 项目功能多了,用户多了,你选的框架可能就要有足够能力面对这些挑战了.<code>Angular</code>,没错,&quot;为大型项目而生&quot;.</li><li>代码组织<br> 没有人喜欢乱七八糟的代码,如果你还要重构,那...祝你发财...<br> 代码的整洁高效,编写的代码规范,受益的不仅仅是现在的你,更是未来的自己或是未来的&quot;某某同事&quot;.<br><code>Vue.js</code>支持模块化,能清晰划分代码逻辑.这样你的代码如果要扩展,那对于follow the rules的Vue项目来说,应该不会很难.</li><li>组件可重用性<br> 组件如果可重用性高,那简直不要太爽.(对于用的而言爽,对于初次开发的,可不一定.参考各种UI组件库.)<br> 套着用就行,最多解决&quot;一点点&quot;Bug,但也比重新造火箭来得更方便.基于组件构建的框架,像React,可以说是这种特性发挥的&quot;最大受益人&quot;了.</li></ol><h2 id="_5-学习曲线" tabindex="-1">5.学习曲线 <a class="header-anchor" href="#_5-学习曲线" aria-label="Permalink to &quot;5.学习曲线&quot;">​</a></h2><p>框架的学习曲线,也是作为框架选择者需要考虑的事情.要评估要花多少人力时间,才能顺利开发,熟悉使用对应框架.<br> 如果你是&quot;被选择者&quot;,你要重新学一门,公司需要的,新的框架,那当然是越简单越好,越快能投入生产越好了.(公司不养闲人你说对吧)</p><ol><li>较为容易的学习路线<br><code>Vue</code>的学习曲线就比较平缓,新手上手相对简单.这对考虑共同开发的人员而言比较重要,毕竟&quot;人有所精&quot;,你会的别人不一定会,反之亦然,越快能同步开发越好.<code>Angular</code>,相反,学习曲线就比较陡峭了.新手完全理解框架的使用可能就要花更多的时间精力了.</li><li>高质量的文档内容及教程<br> 学习曲线的影响,很大程度由教学指导及技术文档决定.文档越通俗易懂,开发者也更有可能更快&quot;爱上&quot;这个框架.<code>React</code>就是其中之一,除了官方文档,方方面面的资源,都能帮助开发者理解框架的使用.</li><li>社区及技术支持<br> 活跃的社区也能帮助我们学习框架.像Discord这些论坛,有问题上去问,也很有可能得到解答.<code>Angular和React</code>,也可以去对应社区获取技术支持.</li></ol><h2 id="更换框架-为什么要换-什么时候要换" tabindex="-1">更换框架:为什么要换? 什么时候要换? <a class="header-anchor" href="#更换框架-为什么要换-什么时候要换" aria-label="Permalink to &quot;更换框架:为什么要换? 什么时候要换?&quot;">​</a></h2><p>有时尽管你考虑得足够仔细,但也有可能要切换框架.这些可能包括: 项目需求的变化,当前框架的限制,或是新技术的出现.清楚为什么,什么时候要更换框架,能让你的项目更加&quot;丝滑&quot;,&quot;高效&quot;.(?真不是在搞开发人员?大项目底层说换就换?)</p><h3 id="可能需要更换框架的场景" tabindex="-1">可能需要更换框架的场景 <a class="header-anchor" href="#可能需要更换框架的场景" aria-label="Permalink to &quot;可能需要更换框架的场景&quot;">​</a></h3><ol><li><p>性能出问题了:<br> 应用加载响应慢了,那就要考虑更换了.(?不先考虑性能优化?)<br> 当然这是项目规模依旧需要膨胀,已经采用可用的优化手段后,不得不选择的做法.<br> 选一个适用规模更大的项目吧,为了以后着想.(?早知如此何必当初?真不是私人项目变成&quot;跨国&quot;项目才可能遇到这种问题?)</p><p>举个例子:<br> 一开始,你的电商项目只是一个小小的在线商铺,为了方便你直接用了<code>Vue</code>.后来越卖越好,越来越多的功能,像实时库存量更新,商品追踪,以及买家评论展示等等,<code>Vue</code>&quot;力不从心&quot;了,就&quot;需要&quot;切换到更符合这种场景的框架,比如<code>Angular</code>了.(作为Vue&quot;忠实拥趸&quot;,懒得喷)</p></li><li><p>维护问题<br> 你用的框架作者跑路了,框架不更新维护了,&quot;大清玩蜡&quot;.这时你不得不换了.要么代码跑,要么你跑了就.换个可靠点的框架,你的工作才可能更稳定...</p></li><li><p>项目需求<br> 这是最有可能性的一个可能.项目需求变了,新功能的实现用与当前不同的框架更加方便.比如说,从<code>React</code>转变到<code>Next</code>就能带给你很多好处.(???这也算框架切换???)</p></li></ol><p><strong>切换框架的好处和坏处</strong><br> 开发中时,或是事后维护框架时切换使用的框架,有好,也有不好.(什么魔鬼)</p><ul><li><strong>好处</strong>: <ol><li>性能提升.从过时的换成&quot;符合当前开发潮流&quot;的框架,应该是能减少加载速度,提高应用性能的.</li><li>新框架,新技术.旧框架不能实现,或是需要polyfill自己修补漏洞的功能,新框架可能几行代码就搞定了.</li><li>换个大点的框架,有坑一起踩,有福各自享.</li></ol></li><li><strong>缺点</strong>: <ol><li>耗力.公司有可能要重新雇用精通这个新技术的人员,才能继续开发,重构现有代码.到时就真的是:&quot;你被优化了.&quot;<br> 个人而言就是要重新花精力去学习,这就考验你的根本学习能力了.</li><li>耗时.整个部门的人如果都不熟悉,那当然就要慢慢去熟悉框架的使用,实现的工作流程了.这就有可能拉低整个生产链的效率了.</li><li>新的框架,新的问题.借用经典土木meme就是:&quot;猜猜我今天挖爆了哪条电缆?(得意)&quot;<br> 你不知道任意一行的代码修改,都可能导致整个应用崩溃...</li></ol></li></ul><h2 id="结论" tabindex="-1">结论 <a class="header-anchor" href="#结论" aria-label="Permalink to &quot;结论&quot;">​</a></h2><p>每个框架的使用,都会有其优势及其挑战,因此作为开发者的你,更要谨慎地考虑选用哪个框架,哪个框架才能最好的&quot;面向需求&quot;.<br> 完整全面地评估以上这些因素,其实也是你能力及智慧的体现.选对框架,你就选对了未来.</p><p>Thanks for reading.</p><p class="text-xs text-blue-300 font-bold">越翻译到后面越&quot;放飞自我&quot;,尽量保持了意思,也有&quot;夹带私货&quot;,夹杂了一点点自己的理解可能就没那么准确了.</p>',29)]))}const h=e(l,[["render",i]]);export{p as __pageData,h as default};
