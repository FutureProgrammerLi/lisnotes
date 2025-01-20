import{_ as o}from"./app.DwUT4cp8.js";import{c as t,Y as c,o as a}from"./chunks/vue.C3nVHRy_.js";const q=JSON.parse('{"title":"Vue和React框架的对比","description":"","frontmatter":{},"headers":[],"relativePath":"comparisons/VueVSReact.md","filePath":"comparisons/VueVSReact.md","lastUpdated":1730123104000}'),i={name:"comparisons/VueVSReact.md"};function r(l,e,s,d,u,n){return a(),t("div",null,e[0]||(e[0]=[c('<h1 id="vue和react框架的对比" tabindex="-1">Vue和React框架的对比 <a class="header-anchor" href="#vue和react框架的对比" aria-label="Permalink to &quot;Vue和React框架的对比&quot;">​</a></h1><p>接触前端以来一直有的一个问题.我认为这是除了前端三个最基础的知识外,另外的一个决定性问题了.<br> HTML,CSS,JS是前端的最基础知识.接下来最可能遇到的就是上一层的框架选择了.<br> 以前可能还有JQuery,Angular,Svelte这些的犹豫,到现在,虽然不排除极少部分的情况,我们大概率遇到的选择就是:<strong>到底用Vue还是用React呢?</strong><br> 是个见仁见智的问题.本文以列举自己对这两个框架的一些认识,有参考ChatGPT的回答,但更多是自己的一些理解.</p><p>先抛开Nuxt和Next这两个又上一层了的抽象了吧,虽然目前看来是两个框架发展的重点.</p><h2 id="混乱对比" tabindex="-1">混乱对比 <a class="header-anchor" href="#混乱对比" aria-label="Permalink to &quot;混乱对比&quot;">​</a></h2><h3 id="vue" tabindex="-1">Vue <a class="header-anchor" href="#vue" aria-label="Permalink to &quot;Vue&quot;">​</a></h3><ol><li>响应性</li><li>模板语法</li><li><code>&lt;script setup&gt;</code></li><li>Composition API</li><li>Macro APIs</li></ol><h3 id="react" tabindex="-1">React <a class="header-anchor" href="#react" aria-label="Permalink to &quot;React&quot;">​</a></h3><ol><li>函数式组件</li><li>Hooks</li><li>Snapshots</li></ol><h2 id="响应性-composition-api-vs-snapshots-hooks" tabindex="-1">响应性 + Composition API VS. Snapshots + Hooks <a class="header-anchor" href="#响应性-composition-api-vs-snapshots-hooks" aria-label="Permalink to &quot;响应性 + Composition API VS. Snapshots + Hooks&quot;">​</a></h2><p>Vue一个引以为傲的特性就是它的<strong>响应性和模板语法</strong>,据官网介绍,这样的组件组成,&quot;更容易上手&quot;.<br> 确实,HTML≈template, <code>&lt;script setup&gt;</code>≈<code>&lt;script&gt;</code>.对于习惯&quot;三段式HTML&quot;页面开发的人而言,这种转变还是比较容易,没什么心智模型上的负担的.</p><p>转头看看React, JSX+Hooks,乍看都是复杂的概念.如果要进行开发,仅仅是了解各个Hooks的功能是不足够的.虽然对于我而言,JSX由于跟HTML还是更加相似的,在这一点上不比Vue的模板语法差.<br> 而且React主张的是一个不变性(Immutability),每次页面的状态就是一张快照(snapshot),如果需要重渲染,那该状态就会被重新赋值,可以说整个页面由于该状态的变化,&quot;全都发生变化了&quot;. Vue的可变性则完全不一样.<code>Reactive</code>是个Vue的核心概念,就是说&quot;随变&quot;,引起页面重渲染.这可能引起的一个困难就是,time travel没那么容易,状态的变化也没那么容易跟踪定位.</p><h3 id="编写组件模式所带来的一些差异" tabindex="-1">编写组件模式所带来的一些差异 <a class="header-anchor" href="#编写组件模式所带来的一些差异" aria-label="Permalink to &quot;编写组件模式所带来的一些差异&quot;">​</a></h3><p>Vue由于推荐&quot;三段式&quot;的组件结构,可能导致的一些缺点是:</p><ul><li>SFC,单文件组件,即一个文件就是一个组件.这从<code>&lt;script setup&gt;</code>中,默认采用文件名为组件名这个设定来看可以看出.<strong>Vue官方就是支持一个文件作为一个组件这种做法</strong>.</li><li>模板内容可能没有那么灵活.这是&quot;规定&quot;所带来的一些限制,如果需要跳出这些限制当然是可以的,但需要额外的手动支持.比如配置jsx,使用额外提供的<code>h()</code>.</li></ul><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>吐槽: 想结合<code>&lt;script setup&gt;</code>和jsx的便利,像React那样把状态/事件/JSX写在同一个作用域内,从而实现React没有的&quot;响应式&quot;便利.结果<code>&lt;script setup&gt;</code>里不能直接返回JSX.是自己的一次偷鸡失败..</p></div><p>React并不规定一个文件里只有一个组件(当然Vue也可以):一个文件里可以同时导出多个组件,一个大组件里也可以拆分出多个小组件.<br> 从颗粒度上说,我觉得React是比Vue上更细的.<br> 你当然可以反驳我Vue也可以高颗粒度.利用Vue的Composition以可以提高组件颗粒度,提高逻辑复用逻辑,这是Vue3的特性.这只是我对React和Vue的&quot;刻板印象&quot;,<strong>你的观点才是正确的</strong>.</p><p><strong>我更喜欢把状态-事件-渲染内容放到一起.</strong> 而且如果这样的组成冗余了,复杂了,也可以对代码进行优化,再次提取到更小单位的逻辑组件当中.一步一步提取直到自认为逻辑单位足够明了.</p><h3 id="composition-api-和hooks的一些对比" tabindex="-1">Composition API 和Hooks的一些对比 <a class="header-anchor" href="#composition-api-和hooks的一些对比" aria-label="Permalink to &quot;Composition API 和Hooks的一些对比&quot;">​</a></h3><p>Vue3引入了很多新的API,最基础的几个有:<code>ref()</code>,<code>reactive()</code>,<code>computed()</code>,<code>effect()</code>,<code>watchEffect()</code>等等.<br> 而React hooks,<code>useState()</code>,<code>useEffect()</code>,<code>useContext()</code>,<code>useReducer()</code>等等.</p><p>我当时的认识,是从React向Vue转变的.我的看法是:</p><ul><li>状态类: <code>useState()</code> ≈ <code>ref()</code>, <code>reactive()</code>,<code>computed()</code></li><li>事件类: <code>useEffect</code> ≈ <code>effect()</code>,<code>watchEffect()</code></li><li>全局注入类: <code>useContext()</code> ≈ Vue状态类组成的全局Composition 或是 <code>provide</code>+<code>inject</code></li></ul><p>React的<code>useContext()</code>和<code>useReducer()</code>,基本都可以用Vue的基本reactive API组合而成.这是Vue的一个优点.(当然React本身也可以利用几个自己的hooks,构成自定义的hooks就是了).<br> 基本事件都用function就可以定义了,这我认为是个很好的转变.(Vue2的methods可以说好也可以说不好).</p><p>为什么要将状态类分为三个API,而React只用一个就可以了呢?<br> 前者把变量的类型进行了分类,同时也保留了自己&quot;计算属性&quot;这一&quot;独创&quot;理解.<br> 后者得益于组件的渲染方式,不用顾虑类型不同所带来的更新方式不同,也可以把Vue计算属性这一特点,仅仅利用原生的JS功能就可以实现了.</p><h4 id="缓存" tabindex="-1">缓存 <a class="header-anchor" href="#缓存" aria-label="Permalink to &quot;缓存&quot;">​</a></h4><p>React和Vue的状态定义虽然不是完全的等价,比如<code>computed</code>还有缓存,而React的&quot;计算属性&quot;如果要实现这个功能,就要额外的包装了.<br><strong>单从缓存这一点上说,我认为Vue的API实现得更好.</strong><br><code>useCallback</code>,<code>useMemo</code>,<code>&quot;use cache&quot;</code>,你甚至可以说React Compiler,对,这些都能提升React应用的性能,<strong>但,这些都是额外(后来)的操作了.</strong></p><h2 id="macro-apis-ts对比" tabindex="-1">Macro APIs + TS对比 <a class="header-anchor" href="#macro-apis-ts对比" aria-label="Permalink to &quot;Macro APIs + TS对比&quot;">​</a></h2><p>Vue的另一优势是,<code>defineProps</code>,<code>defineEmits</code>,<code>defineSlots</code>等的这些宏编程存在.<br> 我认为这些是说明组件用法的,很好的方法.它们说明了组件需要接收哪些属性,本组件会&quot;发散&quot;出什么事件,需要接收怎么样的插槽,等等一系列需要预先知道的内容.</p><h3 id="数据流" tabindex="-1">数据流 <a class="header-anchor" href="#数据流" aria-label="Permalink to &quot;数据流&quot;">​</a></h3><p>说到<code>defineEmits()</code>又想到一个区别,为什么React没有向父组件触发事件的机制而Vue有呢?<strong>因为,React的数据是自上而下的,不允许反向操作.</strong><br> React这样的设计是出于多方面考虑的,也算是一种规定吧.<br> React里对应的说法是:状态提升, 受控组件.大概就是将子组件的某些状态,放到父组件中,并在父组件中进行统筹控制.</p><h3 id="插槽-vs-children" tabindex="-1">插槽 vs. <code>children</code> <a class="header-anchor" href="#插槽-vs-children" aria-label="Permalink to &quot;插槽 vs. `children`&quot;">​</a></h3><p>说到<code>defineSlots</code>,我又想起两个框架的区别.<br> 在React的对应说法是,<code>{children}</code>属性.<br> Vue里的默认插槽,具名插槽,在React里都以属性的方式,传递给了子组件了,相似的功能后者则需要更为复杂的额外操作.</p><p><strong>我认为一个React无法实现的功能是:作用域插槽.</strong><br> 当然很可能是我对React的认识不深,自己没想到React怎么实现.因为Vue中的这个功能与React的核心概念 <strong>&quot;单向数据流&quot;</strong> 是相悖的.要将子组件的状态暴露给父组件,再对其进行操作.在React就应该直接提升到父组件里了.<br><code>defineExposed</code>等的macros,我认为都属于Vue的优势特点了.</p><hr><p>关于TS的支持,由于macros的存在,或者说在类型提示方面而言,我认为是Vue做得比React好.<br><strong>没错,也是刻板印象.以你的观点为准.</strong></p><h2 id="nuxt-vs-next" tabindex="-1">Nuxt vs. Next <a class="header-anchor" href="#nuxt-vs-next" aria-label="Permalink to &quot;Nuxt vs. Next&quot;">​</a></h2><p>都是更抽象,面向更大规模应用开发的框架了,差异点就有点脱离Vue跟React了.但我认为Next的发展,导致我不得不对这两个框架进行对比.</p><p>随着React Server Component概念的推出,React似乎转变了发展的方向,专注于更大规模的应用开发了.<br> 但,<code>&quot;use client&quot;</code>这条命令,给了我一种用了Next你就要抛弃先前<code>useState()</code>,<code>useEffect()</code>等这些hooks的感觉.<br> 因为在Next App Router里,所有的组件<strong>默认都是服务器组件</strong>.服务器组件里是用不了这些原生hooks的,要在对应的组件内特意声明<code>&quot;use client&quot;</code>这条命令.<br> 啊这...</p><p>服务器组件的概念,我也不知道是利大于弊还是弊大于利.反正用起来没太感受到带来的便利.<br> 一些额外的Next优点是:</p><ul><li>提供效率更高的内置组件,像<code>&lt;Link&gt;</code>,<code>&lt;Image&gt;</code>等等</li><li>页面预获取</li><li><code>fetch</code> API的改良</li><li>基于文件系统的路由(Nuxt也有,但Next的规定貌似更复杂,功能更丰富?)</li></ul><hr><p>而Nuxt,我对它的认识比较少,但不得不一个巨好用的功能是,一个项目可以启动两个端口,一个作为客户端渲染,另一个作为服务器返回数据.<br> 没错这个功能我是真喜欢,这才符合&quot;全栈&quot;的概念.</p><p>再看看Next,我没看出&quot;服务器&quot;的功能在哪里.可能说是<code>ServerAction</code>?<br> 可是!里面还是要使用<code>fetch</code>,另外起服务器端口再返回数据.(我????)<br> 我都全栈了你还要我另起服务端口!??!!!差评.</p><hr><p>个人理解先大概梳理到这吧. To be continued...</p><h2 id="bonus" tabindex="-1">Bonus <a class="header-anchor" href="#bonus" aria-label="Permalink to &quot;Bonus&quot;">​</a></h2><p>梳理完自己对两个框架的差异,&quot;参考&quot;一下ChatGPT的回答,或许某些点又有&quot;感同身受&quot;呢?</p><p><strong>Vue3的优点:</strong></p><ol><li>易上手</li><li>响应式系统</li><li>组合式API</li><li>灵活性</li><li>生态系统丰富</li><li>内置的状态管理</li><li>文档友好</li><li>样式封装</li></ol><p><strong>缺点:</strong></p><ol><li>社区支持不如React丰富</li><li>大型项目管理需要更谨慎的规划</li></ol><p><strong>React的优点:</strong></p><ol><li>广泛的社区和生态系统</li><li>组件复用</li><li>强大的性能</li><li>企业级应用</li><li>跨平台</li></ol><p><strong>缺点:</strong></p><ol><li>学习曲线</li><li>JSX语法</li><li>频繁的更新</li><li>过度灵活性</li><li>依赖管理</li></ol><p><strong>总结:</strong></p><ul><li>选择Vue3: 上手速度快,语法结构清晰,项目规模较小;</li><li>选择React: 灵活性更大, 生态系统更为丰富, 更适用于大型企业级应用开发.</li></ul><p>(你是否赞同呢?我怎么觉得不少&quot;刻板印象&quot;...)</p>',57)]))}const b=o(i,[["render",r]]);export{q as __pageData,b as default};
