import{a as n,D as p}from"./app.D2JXt0pu.js";import{c as e,o as h,Z as l,H as a,x as i}from"./chunks/vendor.GdCD6OUn.js";const t="/refactoring/visitor/visitor.png",g=JSON.parse('{"title":"访问者模式","description":"","frontmatter":{},"headers":[],"relativePath":"JS/Patterns/Visitor.md","filePath":"JS/Patterns/Visitor.md","lastUpdated":null}'),k={name:"JS/Patterns/Visitor.md"},c=Object.assign(k,{setup(r){return(E,s)=>(h(),e("div",null,[s[0]||(s[0]=l("",7)),a(n,{src:"/refactoring/visitor/problem1.png",caption:"将图信息导出到XML"}),s[1]||(s[1]=i("p",null,"这时,你接到任务,要把图信息导出到XML格式.刚开始可能还没那么难实现.你打算直接为每个节点类添加一个导出方法,递归遍历图里的每个节点,在每个节点上都执行这个导出方法.这种方法又简单又优雅:由于多态的特性,你不会把导出的方法跟具体的节点类给耦合到一起.",-1)),s[2]||(s[2]=i("p",null,"可现在问题是,从宏观上看,整体代码架构并不允许你这样做,你不可以修改已有的节点类.应用已经在生产环境运行了,你不可以有一点bug,导致整个应用崩溃.",-1)),a(n,{src:"/refactoring/visitor/problem2-en.png",caption:"导出方法不得不添加到每个节点类中,但这样就可能导致某个细小bug,将整个应用给毁掉"}),s[3]||(s[3]=l("",11)),a(n,{src:"/refactoring/visitor/visitor-comic-1.png",caption:"好的保险代理,总能为不同的组织提供不同的政策"}),s[4]||(s[4]=i("p",null,"想象一下,一个经验丰富的保险代理正招揽用户.他可以直接拜访各个楼层,向每个他见到的人都推销他的产品.而根据每个楼层的类型不同,他又可以为其提供专门化的保险政策推荐(原文是organization,我直接译成一栋楼里的不同部门似乎更容易理解)",-1)),s[5]||(s[5]=i("ul",null,[i("li",null,"如果一层是负责管理的,那他可以推销医疗保险"),i("li",null,"如果是银行相关的部门,他可以推销防盗政策"),i("li",null,"如果是咖啡店,他可以推销防火防水政策(?)")],-1)),a(p),s[6]||(s[6]=l("",17))]))}});export{g as __pageData,c as default};
