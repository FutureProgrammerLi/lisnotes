# Vue的渲染机制
> https://vuejs.org/guide/extras/rendering-mechanism.html  
> 官网内容.目标除了这篇还有一篇<Vue的渲染函数&JSX>  

Vue是怎么将模板的内容转变成真实的DOM节点的呢?又是怎么高效地对节点进行内容更新的呢?我们想通过这篇文章,深入了解Vue的渲染机制,从而对这些问题稍有眉目.  

## 虚拟DOM
你可能已经听说过,"虚拟DOM"这个术语,而这也是Vue渲染系统的基础.  
虚拟DOM(VDOM,VirtualDOM),是一个编程界的概念,是UI的一种理想化,"虚拟化"的代表,它们存于内存中,并与"真实"DOM保持同步.这个概念的先行者是React,许多其它的框架,包括Vue也相继各自实现了类似的概念.  
与其说虚拟DOM是一种具体话术,不如说它是一种模式,这样说来就没有规定要怎么实现,哪种实现是最为正确的了.我们用简单地例子来说明这点:
```js
const vnode = {
    type:'div',
    props:{
        id:'hello'
    },
    children:[
        /**更多的虚拟节点 */
    ]
}
```
上述代码中`vnode`实际上是一个原生的Javascript对象(也可以说是一个虚拟节点),它的意义其实是一个`<div>`元素.它包括了创建一个真实div元素所需要的所有信息.它也可以包括其它子节点信息,从而使其成为整个虚拟节点树的根节点.  

**运行时渲染器(runtime renderer)可以遍历一棵虚拟DOM树,并根据对应内容创建一棵真实的DOM树.这个处理过程称为mount(挂载?)** (VDOM -> DOM,mount)  

如果我们有某棵虚拟DOM树的两个备份,那渲染器也可以对这两棵树进行遍历和比较,找出它们的不同,并将这些不同点应用到真实DOM上.这个过程称为patch(更新),也可以被称为diffing(比对),或是"reconciliation"(协调?).  
虚拟DOM的一大优点是,开发者可以利用它,以声明式的方式,编程式地创建,检验,并复合出自己想要的UI界面,至于真实的DOM操作则交给渲染器来完成.

## 渲染流程(Render Pipeline)
从宏观角度介绍Vue挂载的过程的话,大概如下:
1. **编译(Compile):** Vue模板会先被编译成**渲染函数(render functions):** 就是返回虚拟DOM树的函数.这个过程既可以在构建步骤预先完成,也可以用运行时编译器(runtime compiler)在运行时(on-the-fly)再完成.
2. **挂载(Mount):** 运行时渲染器调用上述生成的渲染函数,遍历得到的虚拟DOM树,并创建对应真实的DOM树.这一步的实现其实是通过[响应式作用](https://vuejs.org/guide/extras/reactivity-in-depth.html)来完成的,所以它会追踪所有用到的响应式依赖.
3. **更新(patch):** 挂载过程中某个依赖发生变化的话,副作用就需要重新运行.运行的结果是一棵新的,更新完的虚拟DOM树.运行时渲染器就会又遍历这棵树,将其与旧树对比,并将必要的更新应用到真实的DOM树上.
![render-pipeline](images/render-pipeline.png)

## 模板与渲染函数
之前提过,模板内容会被编译成渲染函数.当然了,如果你技术够硬,你完全可以跳过这个模板编译阶段,直接利用Vue为你提供的API实现自己的渲染函数.渲染函数显然在处理一些动态逻辑时比模板编写更为灵活,因为你可以直接利用JS的所有技巧,直接操作vnode.  
所以为什么Vue默认推荐使用模板编写呢?原因如下:
1. 模板语法跟真实的HTML更为相似.这样就能方便地重用HTML代码段,提供更好的可访问体验,整合CSS,便于设计师理解并修改相关内容了.
2. 由于模板内容都是固定语法,因此要对其进行静态分析其实是更简单的.同时,Vue的模板编译器也可以在这个过程中应用一些编译优化,从而提升VDOM的性能(更多这方面的内容我们会在后续内容探讨到)

实际开发中,模板语法足以覆盖绝大多数应用场景.渲染函数一般也只会在一些复用性高,动态逻辑较为复杂的组件.[更多渲染函数的内容就在另一篇文章了.](https://vuejs.org/guide/extras/render-function.html)

## 带编译器信息的虚拟DOM(Compiler-Informed VDOM)
React及大部分的前端框架实现的VDOM都是运行时的:协调过程利用的算法无法得知即将被更新的虚拟DOM树长什么样,因此渲染器不得不完整地遍历这棵树,正确地比对每个虚拟节点的props.此外,尽管树的某些部分内容是不会发生变化的静态内容,渲染器都不得不重新为它们创建新的虚拟节点.这也是VDOM备受争议的一个点:这种"不过脑",简单粗暴的协调过程,为了争取代码的可声明性及正确性,大大牺牲了代码执行的效率.  

但我们真的需要这样吗?当然不是.Vue同时控制着编译器和运行时的工作.这样我们就能实现许多编译时的优化了 -- 这是紧耦合的渲染器才能实现的一个功能.编译器可以对模板进行静态分析,在生成的代码中留下一些提示,从而令运行时尽可能地走捷径.(?)同时,我们为用户保留了直接采用渲染函数的方式,应对某些边缘案例.  
我们称这种混合的方式为:**带有编译器信息的虚拟DOM(Compiler-Informed Virtual DOM)**.  
下文中我们会介绍Vue模板编译器为了提升运行时性能,所采用的一些优化措施.

### 静态提升
我们经常可以看到,模板内存在一些不包含动态绑定的内容:
```vue
<template>
    <div>
        <div>foo</div>  <!--会被提升 -->
         <div>bar</div> <!-- 也会被提升 -->
        <div>{{ dynamic }}</div>
    </div>
</template>
``` 
以上的`foo`和`bar` divs都是静态的 -- 完全没有必要每次都为它们重新创建虚拟节点和比对它们的内容.  
Vue编译器会自动将这两个虚拟节点的创建调用提取到了渲染函数之外(?template explorer里还是在render()里),每次渲染直接重用相同的虚拟节点即可.渲染器检测到新旧节点是同一个后,也会直接跳过比对它们的内容.  
此外,当检验到足够多的连续静态元素时,它们就会被压缩到一个单独的"静态节点"中,它包括的是所有这些节点的原生HTML字符串.([例子中用了5个连续相同静态元素说明](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=)).这些静态节点的挂载方式是直接设置`innerHTML`.当然这些内容在初次挂载时也会被缓存下来 -- 如果相同的内容在应用的其它部分被重用,那直接用原生`cloneNode()`创建新DOM节点即可,从而提高DOM创建的效率.

### 更新标识(Patch flags)
对于那些具有动态绑定的单一元素而言,我们可以在编译时从中推断出许多信息:
```html
<!-- 只有类绑定 -->
<div :class="{active}"></div>
<!-- 只有id和值绑定(?) -->
<input :id="id" :value="value">
<!-- 只有文本子节点 -->
<div>{{ dynamic }}</div>
```
为这些节点生成渲染函数时,Vue会在构建虚拟节点的调用中,为每个节点的绑定类型进行编码:
```js
createElementVNode("div",{
    class:_normalClass({active: _ctx.active })
},null,2 /*CLASS*/)
```
以上函数的最后参数`2`,就是我们的更新标识.一个元素可以拥有多个更新标识,不过最终都会汇总成单一一个数字.运行时渲染器使用位运算符对标识进行校验,决定该元素是否需要进行某些操作.
```js
if(vnode.patchFlag & PatchFlags.CLASS /**2 */){
    // 更新该元素的类名
}
```
按位校验(bitwise check)的速度是很快的.配合更新标识的作用,Vue能够利用最少的操作量,最大效率地更新元素的动态绑定.  
Vue同时也会对虚拟节点的子节点类型进行编码.比如说,模板具有多个根节点作为一个"分块(fragment")这样的场景.大部分情况下我们可以确认,这些根节点的顺序是不会发生变化的(?),所以我们可以将这个信息,以更新标识的形式传递给运行时:
```js
export function render(){
    return (_openBlock(), createElementBlock(_Fragment, null,[
        /** children */
    ], 64 /** STABLE FLAG */))
}
```
运行时就可以据此,为这个根分块跳过子节点顺序协调这个操作.(? skip child-order reconciliation)

### 扁平化树结构
回头再看看我们之前生成的编译代码,你会发现,返回的虚拟DOM树,根节点的创建使用了一个特殊的`createElementBlock()`函数调用:
```js
export function render(){
    return (_openBlock(), createElementBlock(_Fragment, null,[
        /**children */
    ], 64 /**STABLE FLAG */))
}
```
从概念上解释的话,一个"块"(block)是模板内具有内部稳定的一种结构.这样的前提下,整个模板只有一个单独的块,因为它没有任何可能改变结构的一些指令,比如`v-for`和`v-if`.  
每个块,都需要**跟踪各自带有更新标识的后代节点**(不单单是直接子节点,还包括二级/三级等子节点).  
比如说:
```html
<div>  <!-- 顶层块 -->
    <div>...</div> <!-- 因为没有标识符而不需被跟踪 -->
    <div :id="id"></div>    <!-- 需要被跟踪 -->
    <div>               <!-- 不需要被跟踪 -->
        <div>{{ bar }}</div>  <!-- 需要被跟踪 -->
    </div>
</div>
```
以上模板经编译后会生成一个数组,内容是一个只包含动态绑定的后代节点:
```text
div (根节点)
- 有:id绑定的div
- 有{{bar}}绑定的div
```
当这个组件需要重渲染时,渲染器只需要遍历这棵扁平化后的树就行了,不用大费周章地再去遍历那些没被标识的内容.  
这个过程叫**树结构扁平化(Tree Flattening).**它极大程度地减少了VDOM进行协调过程时,需要遍历的节点数量.模板中所有的静态部分都因它的存在而被有效忽略了.  
而当`v-if`或`v-for`这些可能改变模板结构的指令存在时,渲染器会为它们创建新的块节点:
```vue !4
<template>
    <div>
        <div>
             <div v-if>  
                ...
            </div>
        </div>
    </div>
</template>
```
子块会以父块的动态后代子节点数组的形式被跟踪.这样就能保持父块的稳定结构了.

### 对SSR Hydration(激活?)的影响
更新标识和树结构扁平化的存在,都对Vue SSR激活的性能带来了巨大的提升:
* 单一元素的激活可以根据虚拟节点的更新标识,快速地实现定位.(take fast paths)
* 激活期间只有块节点和其动态后代节点需要被遍历,有效地在模板层面实现部分激活.