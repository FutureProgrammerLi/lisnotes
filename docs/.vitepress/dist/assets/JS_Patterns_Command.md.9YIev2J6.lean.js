import n from"./chunks/ImageWithCaption.CmznbF2c.js";import h from"./chunks/Divider.wdx8KBOV.js";import{c as k,o as e,_ as p,H as a,x as i,a as l}from"./chunks/vendor.bZs7jcXh.js";import"./app.D_13B_sJ.js";const t="/refactoring/command/command-en.png",c=JSON.parse('{"title":"命令模式","description":"","frontmatter":{},"headers":[],"relativePath":"JS/Patterns/Command.md","filePath":"JS/Patterns/Command.md","lastUpdated":null}'),r={name:"JS/Patterns/Command.md"},m=Object.assign(r,{setup(E){return(d,s)=>(e(),k("div",null,[s[0]||(s[0]=p("",6)),a(n,{src:"/refactoring/command/problem1.png",caption:"应用的所有按钮都源自一个相同的父类"}),s[1]||(s[1]=i("p",null,"虽然按钮看起来相似,但它们的作用是完全不同的.你要把每个按钮的事件处理代码放到哪里呢?最简单的一种解决方法是每个用到按钮的地方,各自创建子类,各自编写其中逻辑.这些子集各自包含按钮点击后需要执行的逻辑.",-1)),a(n,{src:"/refactoring/command/problem2.png",caption:"后续产生大量的子集.会产生什么问题呢?"}),s[2]||(s[2]=l(" 很快你就会发现这种方法已有很大的缺陷:子类的数量就不得不剧增,如果你不怕改父类代码导致子类崩溃的话,那还没那么大问题.换句话说,你整个应用的代码都变得十分依赖那些变化多端的逻辑代码了. ")),a(n,{src:"/refactoring/command/problem3-en.png",caption:"几个类都实现了相同的功能"}),s[3]||(s[3]=p("",5)),a(n,{src:"/refactoring/command/solution1-en.png",caption:"GUI对象有时可以直接读取业务逻辑对象"}),s[4]||(s[4]=i("p",null,[l("命令模式一般建议GUI对象不直接发送这些请求,而是把所有请求的细节,比如要调用的对象,方法名,参数列表,单独抽取到一个"),i("em",null,"命令(command)类"),l("中,用单独的方法来触发这个请求."),i("br"),l(" 命令对象的作用是作为连接GUI对象和业务逻辑对象的桥梁.有了它后GUI对象就不需要知道业务逻辑对象是如何接收请求,如何处理请求了.它只需要下达命令就能处理其它细节了.")],-1)),a(n,{src:"/refactoring/command/solution2-en.png",caption:"通过命令访问业务逻辑层"}),s[5]||(s[5]=i("p",null,"下一步要做的是让命令实现相同的接口.一般它只有一个不需要参数的执行方法.这个接口可以让同一个请求发送者,使用各种不同的命令,而不用与具体的命令类进行耦合.除此之外,你还可以将命令对象连接到发送者上,从而在运行时有效提升发送者的效率.",-1)),s[6]||(s[6]=i("p",null,"你可能已经发现我们漏了什么东西,对,就是命令参数.GUI层对象可能需要向业务层对象传递一些参数.由于下达命令时我们是传不了参数的(命令不接受),我们要怎么准确下达命令呢?我们的解决方法是:命令自身应预先配置好一些参数数据,或是命令需要自身去获取.",-1)),a(n,{src:"/refactoring/command/solution3-en.png",caption:"GUI对象通过命令分发工作"}),s[7]||(s[7]=i("p",null,[l("回到我们的文本编辑器.我们套用到命令模式后,我们就不需要那么多的按钮子类,才实现各种点击行为了.我们只需要在基类"),i("code",null,"Button"),l("中加上一个单独的属性,它的值是命令对象的索引,点击时执行不同的命令就够了.")],-1)),s[8]||(s[8]=i("p",null,"你可能需要实现很多不同的命令类,从而满足不同的操作的结果.并将这些命令与特定的按钮连接起来,这取决于具体按钮需要执行的操作.",-1)),s[9]||(s[9]=i("p",null,"其它GUI元素,像菜单,快捷键,或对话框,都可以用这种方式来实现.它们都会在用户触发时下达各自的命令.你也估计知道了,不同元素,相同的操作,对应的都是相同的命令,这样就不用再重复代码了.",-1)),s[10]||(s[10]=i("p",null,"这样,命令就作为一个中间层,减少了GUI和业务逻辑层之间的耦合了.这只是这种模式的一点点好处而已!",-1)),s[11]||(s[11]=i("h2",{id:"真实世界的比喻",tabindex:"-1"},[l("真实世界的比喻 "),i("a",{class:"header-anchor",href:"#真实世界的比喻","aria-label":"Permalink to “真实世界的比喻”"},"​")],-1)),a(n,{src:"/refactoring/command/command-comic-1.png",caption:"饭店里点菜"}),s[12]||(s[12]=i("p",null,"逛完街后,你去了饭店,坐到窗户旁.此时服务员过来问你点什么菜,写到菜单上.然后服务员把菜单贴到墙上.不久后,主厨看到,取下菜单,并按照菜单开始煮菜.煮好后放到菜盘上,服务员看到后,检查一下菜盘上的菜是否已经按照菜单煮好了,然后端到你面前.",-1)),s[13]||(s[13]=i("p",null,"这里的菜单就是命令.它要等到厨师有空时才会被开始制作.菜单里包含了所有需要煮的菜.这个过程就省掉了主厨直接跟你确认点单的麻烦了.",-1)),a(h),s[14]||(s[14]=p("",25))]))}});export{c as __pageData,m as default};
