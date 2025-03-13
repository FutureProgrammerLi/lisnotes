import{_ as n}from"./chunks/ImageWithCaption.yiHrv4Rn.js";import{D as p}from"./chunks/Divider.DEAXDxeL.js";import{c as h,o as k,Z as l,H as a,x as i}from"./chunks/vendor.GdCD6OUn.js";import"./app.E6B-SwxD.js";const t="/refactoring/memento/memento-en.png",c=JSON.parse('{"title":"备忘录模式(Memento)","description":"","frontmatter":{},"headers":[],"relativePath":"js/Patterns/Memento.md","filePath":"js/Patterns/Memento.md","lastUpdated":1741837881000}'),e={name:"js/Patterns/Memento.md"},b=Object.assign(e,{setup(r){return(E,s)=>(k(),h("div",null,[s[0]||(s[0]=l("",8)),a(n,{src:"/refactoring/memento/problem1-en.png",caption:"执行任意操作之前应用都为对象状态保存快照,这样后续就可以直接恢复对象先前的状态了."}),s[1]||(s[1]=i("p",null,"我们来分析一下那些状态快照.你要生成多准确的快照呢?你可能要遍历对象中的所有属性,把它们的值通通保存下来.当然这只会对那些内容没有限制,值可以自由访问的对象有效.实际上,多数对象是不会轻易让外部知道自身内部状态的,都会把重要属性给私有隐藏起来.",-1)),s[2]||(s[2]=i("p",null,"先忽略这个问题,假设我们的对象就是允许这么做,还没私有属性这个概念的,随便与其它对象产生联系,所有属性都是公开的.虽然这种方法能解燃眉之急,可是后续也会产生大问题.后续你可能要重构某些编辑类,或增加/删除一些属性.听着简单,实际上这需要改变负责复制受影响对象的状态对应的类.",-1)),a(n,{src:"/refactoring/memento/problem2-en.png",caption:"如何复制对象的私有状态?"}),s[3]||(s[3]=l("",5)),a(n,{src:"/refactoring/memento/solution-en.png",caption:"原始对象可以完全访问备忘录对象,而其它对象只能读取到备忘录对象的原数据."}),s[4]||(s[4]=i("p",null,'使用这样的限制,你就可以将备忘录存储到其它对象中,我们称这些其它对象为"管理员(caretaker)".由于管理员只能与备忘录上受限的接口配合工作,因此它们是不能直接修改备忘录里的状态的.同时,原始对象可以直接访问备忘录中的所有数据,所以它可以任意恢复先前的状态.',-1)),s[5]||(s[5]=i("p",null,'回到我们的编辑器例子,我们可以创建独立的历史类,把它作为我们的"管理员".管理员内部存储的栈备忘录,会在编辑器进行下次操作前增添上"一页".你甚至还可以将这个栈直接渲染到UI上,将用户过往的操作展示给用户.',-1)),s[6]||(s[6]=i("p",null,"用户撤销时,历史类从栈中提取出最近的备忘页,传递给编辑器,并请求回滚操作.编辑器由于可以完全访问备忘录数据,所以这个过程只是把从备忘录的值,替换回它的状态罢了.",-1)),a(p),s[7]||(s[7]=l("",18))]))}});export{c as __pageData,b as default};
