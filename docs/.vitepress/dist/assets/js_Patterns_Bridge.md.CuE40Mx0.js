import{_ as l}from"./chunks/ImageWithCaption.yiHrv4Rn.js";import{D as e}from"./chunks/Divider.DEAXDxeL.js";import{c as t,o as h,Z as p,H as n,x as i,a}from"./chunks/vendor.GdCD6OUn.js";import"./app.E6B-SwxD.js";const r="/refactoring/bridge/bridge.png",m=JSON.parse('{"title":"桥接模式","description":"","frontmatter":{},"headers":[],"relativePath":"js/Patterns/Bridge.md","filePath":"js/Patterns/Bridge.md","lastUpdated":1742216147000}'),k={name:"js/Patterns/Bridge.md"},F=Object.assign(k,{setup(d){return(o,s)=>(h(),t("div",null,[s[0]||(s[0]=p('<h1 id="桥接模式" tabindex="-1">桥接模式 <a class="header-anchor" href="#桥接模式" aria-label="Permalink to “桥接模式”">​</a></h1><blockquote><p><a href="https://refactoringguru.cn/design-patterns/bridge" target="_blank" rel="noreferrer">原文地址</a></p></blockquote><h2 id="意图" tabindex="-1">意图 <a class="header-anchor" href="#意图" aria-label="Permalink to “意图”">​</a></h2><p>桥接模式是一种结构设计模型,你可以把一个复杂的类,或是一些关系密切的类,分解为两个独立的层次结构--抽象部分和实现部分--从而独立地开发每一个部分.</p><p><img src="'+r+'" alt="bridge"></p><h2 id="可能遇到的问题" tabindex="-1">可能遇到的问题 <a class="header-anchor" href="#可能遇到的问题" aria-label="Permalink to “可能遇到的问题”">​</a></h2><p><em>抽象?</em> <em>实现?</em> 听到就害怕?别怕,我们来想想一个简单的例子:<br> 假设你有一个几何图形类<code>Shape</code>,其下有多个子类:<code>Circle</code>,<code>Square</code>.你想扩展这个类,添加一些颜色,因此创建了<code>Red</code>,<code>Blue</code>这样的形状子类.可是你已经有两个子类了,你是不是要排列组合,再创建出<code>RedSquare</code>,<code>BlueCircle</code>这样的子类呢?</p>',7)),n(l,{src:"/refactoring/bridge/bridge.png",caption:"图形越多,类组合是不是就要更多呢?"}),s[1]||(s[1]=i("p",null,[a("在层级里加上新的形状类型,新的颜色的话,类数量就会呈指数型增长."),i("br"),a(" 比如,加一个三角形类,你就要新增两个子类,每种颜色一个.之后如果又增加一种新颜色,你又要创建三个新子类,每个形状一个.实体特征越多,代码越💩.")],-1)),s[2]||(s[2]=i("h2",{id:"解决办法",tabindex:"-1"},[a("解决办法 "),i("a",{class:"header-anchor",href:"#解决办法","aria-label":"Permalink to “解决办法”"},"​")],-1)),s[3]||(s[3]=i("p",null,[a("这种问题之所以会出现,是因为需要在两种独立维度上扩展形状类:一个是形状,一个是颜色.这种情况在类继承中非常常见."),i("br"),a(" 桥接模式,通过对象组合的方式,解决类继承的问题.也就是说,你将其中一个维度提取到一个独立的类层次中,这样原本的类就可以通过这个类层次的对象引用,获得索引了,而不必在同一个类里声明所有的状态及行为.(?感觉很关键但看不懂)")],-1)),n(l,{src:"/refactoring/bridge/solution-en.png",caption:"通过将层级分为多个相关层级,以避免一个类上因扩展而导致的类爆炸"}),s[4]||(s[4]=p('<p>根据上面的描述,我们可以把颜色相关的代码提取到独自的子类中:<code>Red</code>和<code>Blue</code>.之后我们的形状类<code>Shape</code>中加上一个引用属性,指向我们的颜色对象.这个形状类后续就可以把任意与属性相关的操作委托给颜色对象了.<br> 这个引用对象就是我们所说的&quot;桥(bridge)&quot;,连接<code>Shape</code>和<code>Color</code>两个属类.此后,新颜色的添加就不会改变形状类的层级,反之亦然.</p><h3 id="抽象与实现" tabindex="-1">抽象与实现 <a class="header-anchor" href="#抽象与实现" aria-label="Permalink to “抽象与实现”">​</a></h3><p>GoF一书里,在桥接模式里引入了新的术语:抽象与实现(Abstraction and Implementation).依我看来,这两个术语有点太学术性了,搞得我们的模式听起来比实际实现出来更为复杂.稍微了解了我们上面的例子后,我们来剖析一下,Gof书中对这两个术语的定义:</p><p><strong>抽象(也叫接口Abstraction / Interface)</strong> 是一些实体的高级控制层.层级本身不应执行任何实际操作.它应该把工作委托给<strong>实现层(Implementation / Platform)</strong>.<br> 我们这里不是简单的谈论编程语言中的&quot;接口&quot;或&quot;抽象类&quot;.它们并不一样.<br> 在实际应用中,抽象层可由图形用户界面(GUI)所表现,实现层可以是系统底层操作代码(API),它们可被GUI层调用,以响应用户的交互.</p><p>一般来说你可以在两个层面上扩展这个应用: * 拥有不同的界面(GUIs),比如专门为一般用户设计一个界面,另外又专门为管理员开发一个界面. * 支持不同的APIs,比如可以在Windows,Linux,macOS上分别执行本应用.</p><p>最差的情况是,应用代码像个巨型意大利面碗一样(spaghetti bowl),各种条件语句连接着不同类型的GUI,GUI又各自调用不同的API.</p>',6)),n(l,{src:"/refactoring/bridge/bridge-3-en.png",caption:"要在庞大而单一的代码库中作出细小的改变都很困难,因为你不得不清晰了解每段代码的作用.而要在规模更小,定义更规范的模块中作出改变则相对容易"}),s[5]||(s[5]=i("p",null,[a("你可以按特定需求,将各个接口-平台(interface-platform)代码组合提取到独立的类去.可是很快你就发现很多这样的类.类层级又呈指数增长了,因为新界面/新接口又需要不同的类组合."),i("br"),a(" 我们尝试用桥接模式解决这个问题.将我们的类分为两个层级:")],-1)),s[6]||(s[6]=i("ul",null,[i("li",null,"抽象层:应用的GUI层"),i("li",null,"实现层: 操作系统的APIs")],-1)),n(l,{src:"/refactoring/bridge/bridge-2-en.png",caption:"组织跨平台应用的一种方式"}),s[7]||(s[7]=i("p",null,"抽象对象控制应用的展示,将实际的操作委任给链接的实现对象.不同的实现对象是可以交叉使用的,只要它们的接口层是通用的话,这样相同的GUI就可以在Windows和Linux下运行了.",-1)),n(e),s[8]||(s[8]=p(`<h2 id="可应用性" tabindex="-1">可应用性 <a class="header-anchor" href="#可应用性" aria-label="Permalink to “可应用性”">​</a></h2><p><strong>需要将一个庞大的类分开,并以某些功能为维度进行组织的话,你可以使用桥接模式.(比如一个类配合使用不同的数据库服务器)</strong><br> 一个类越大,程序员就越难理解它是怎么运行的,要想作出改变更是难上加难.一个功能的改变可能就需要改变整个类的代码,也就可能导致bug的出现,或是其它副作用的产生.<br> 桥接模式可以让你把庞大而单一的类分为多个类层级.之后你就可以独立地修改每个层级里的类了.这种方式简化了后续代码维护,降低程序崩溃的可能.</p><p><strong>当你需要在互相独立的维度上扩展一个类时,可以使用桥接模式.</strong><br> 桥接模式建议将独立的类层级分为多个维度.原始类将相关的操作委托给属于对应层级的对象,而不用由自己实现这些操作.</p><p><strong>如果你在运行时需要切换实现层时可以利用桥接模式.</strong><br> 虽然这是可选的,不过你可以在抽象层中切换具体实现对象.这种操作跟分配值给属性一样简单.<br> 顺便说下,这也是为什么大部分人难以区分桥接模式和策略模式的原因.记住,模式不仅仅是组织类的特定方式.它还可以用来交换意图,解决特定问题.</p><h2 id="如何实现" tabindex="-1">如何实现 <a class="header-anchor" href="#如何实现" aria-label="Permalink to “如何实现”">​</a></h2><ol><li>区分类中相互独立的维度.其中包含的独立抽象概念有: 抽象层/平台层, 域/基础结构, 前端/后端,或是接口/实现层.</li><li>找出客户端需要哪些擦偶哦,将它们定义到基础抽象类中.</li><li>决定接口上需要有哪些操作.在通用实现接口层中声明抽象层所需要的操作.</li><li>在域中的所有平台中,创建具体的实现类.确保它们都遵循相同的接口规范.</li><li>在抽象类中加上一个引用属性,指向具体的实现类.抽象层将大部分的操作分配给指向的这个实现对象.</li><li>如果你有多个高层逻辑变种,通过扩展基层抽象类,创建更完善的抽象类.</li><li>客户端代码需要把实现对象,传递给抽象层的constructor,以把二者连接起来.之后,客户端就可以只与抽象对象交互,而不用担心底层实现了.</li></ol><h2 id="优缺点" tabindex="-1">优缺点 <a class="header-anchor" href="#优缺点" aria-label="Permalink to “优缺点”">​</a></h2><p><strong>优点</strong></p><ul><li>你可以创建与平台无关的类和应用.</li><li>客户端代码只需与抽象层交互,无需与实现层交互.</li><li>开闭原则.独立增加新的抽象或实现,互不干扰.</li><li>单一职责原则.你可以分别关注抽象层中的逻辑,或是实现层中的平台细节(platform details).</li></ul><p><strong>缺点</strong></p><ul><li>可能由于高度耦合类的加入,导致整体代码的复杂度上升.</li></ul><h2 id="与其它模式的关系" tabindex="-1">与其它模式的关系 <a class="header-anchor" href="#与其它模式的关系" aria-label="Permalink to “与其它模式的关系”">​</a></h2><ul><li><strong>桥接模式</strong>一般在程序设计一开始时就要规划使用,这样你就可以独立地开发应用的每个层次了.另外,<strong>适配器模式</strong>则一般用于已有的应用,使某些可能不兼容的类可以协同工作.</li><li><strong>桥接模式,状态模式,策略模式(以及某种程度上的适配器模式)</strong> 在结构上比较相似.确实,它们都基于组合的原理,将任务委任到其它对象去.不过它们各自模式解决的问题各不相同.某种模式的应用并不是你组织代码唯一的途径.它们还可以用来与其他开发人员,实现沟通的效果,告知对方模式的应用解决了什么问题.</li><li>你可以同时使用<strong>抽象工厂模式和桥接模式</strong>.当抽象层由桥接模式定义时,且需与某些特定的实现层交互时,这两种模式的组合使用效果最佳.这种情况下,抽象工厂模式可以将这些关系给封装起来,将代码复杂性隐藏起来,无需面向客户端代码.</li><li>你可以结合<strong>构建者模式与桥接模式</strong>:&quot;主导类&quot;(director class)负责抽象工作,而&quot;构建者&quot;则负责实现工作.</li></ul><h2 id="代码示例" tabindex="-1">代码示例 <a class="header-anchor" href="#代码示例" aria-label="Permalink to “代码示例”">​</a></h2><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Abstraction</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    protected</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;"> implementation</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Implementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    constructor</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">implementation</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Implementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.implementation </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> implementation;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> operation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> result</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.implementation.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">operationImplementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`Abstraction: Base operation with:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">result</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ExtendedAbstraction</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Abstraction</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> operation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> result</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.implementation.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">operationImplementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> \`ExtendedAbstraction: Extended operation with:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\n</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">result</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Implementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    operationImplementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ConcreteImplementationA</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> implements</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Implementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> operationImplementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;ConcreteImplementationA: The result in platform A.&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ConcreteImplementationB</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> implements</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Implementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> operationImplementation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;ConcreteImplementationB: The result in platform B.&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> clientCode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">abstraction</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Abstraction</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    //..</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(abstraction.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">operation</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    //..</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> implementation</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ConcreteImplementationA</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> abstraction</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Abstraction</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(implementation);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">clientCode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(abstraction);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">implementation </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ConcreteImplementationB</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">abstraction </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ExtendedAbstraction</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(implementation);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">clientCode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(abstraction);</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br></div></div><hr><div class="language-txt vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Abstraction: Base operation with:</span></span>
<span class="line"><span>ConcreteImplementationA: Here&#39;s the result on the platform A.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ExtendedAbstraction: Extended operation with:</span></span>
<span class="line"><span>ConcreteImplementationB: Here&#39;s the result on the platform B.</span></span>
<span class="line"><span>Read next</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><hr><p>感谢你能看到这里!</p>`,19))]))}});export{m as __pageData,F as default};
