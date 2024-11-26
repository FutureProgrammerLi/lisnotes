# React Compiler
> 跟React Server Component同时期提出的一个新工具,说是提升了性能,但还处在beta阶段,不推荐在生产环境使用.  
> 那就作为玩具,先了解一下吧~  
> [Introducing React Compiler(介绍文章,即本文)](https://github.com/reactwg/react-compiler/discussions/5)  
> [React Compiler(官网)](https://react.dev/learn/react-compiler)  

本文主要介绍ReactCompiler,以及如何在项目中运用它.  

::: warning
本文还在编写中,随时可能变化.更多讨论在[这里](https://github.com/reactwg/react-compiler/discussions),随时讨论到新东西随时更新到本文档中.  
!React Compiler主推者是Lauren Tan!
:::

ReactCompiler是一个新的构建时工具,用于自动优化React的性能表现,尤其提升页面更新(或是重渲染)时的效率.编译器就是为了配合已有的JS,TS代码,更好地履行并理解[React规则](https://react.dev/reference/rules)而被设计出来的.如果你的应用代码本来就很好的遵从了React的规则,那你大概是不用任何重写代码,直接把这个新东西引入到项目中就可以使用了.目前编译器仍处于Beta测试阶段,不过一些应用也将它投入到生产环境中使用了,比如比较出名的instagram.  

为了实现应用的优化,**ReactCompiler自动对你的部分代码进行记忆(memoize).** 你可能对一些已有的实现记忆功能的API有所熟悉,比如`useMemo`,`useCallback`,以及`React.memo()`.你可以用这些API,明确地告诉React,哪部分代码如果输入没发生变化的话,就不用对其进行重计算,从而减少更新时所需的工作量.虽然这样做确实相当有效,但这样的工作终归是手动进行的,你有可能忘记了哪些代码需要被记住,或者你知道它们是哪些,但只因错误使用而可能引起更多的麻烦.结果就是React不得不检查你的UI是否存在有意义的更新,最终降低了整个页面的更新效率.  

如果你认为已有的代码,在缓存方面已经做得非常好了,那恭喜你,你的代码编写能力相当棒!再引入编译器对性能的提升可能就没那么明显了.()在实践中精准地对代码段进行记忆,精准地找出依赖项,是一个相当困难的工作,而你我的英雄,你做到了!(开个玩笑,要做到全部及精准在应用层面上还是比较困难的.)  

虽然说编译器与`Babel`是解耦的,不过就目前而言,我们还是将大部分功能整合到其中了.大部分比较出名的React框架都支持`Babel`,因此,可以说,有Babel,就有React Compiler的功能了.你可以看看[对应的安装指南](https://react.dev/learn/react-compiler#installation).我们也会努力,把编译器的功能,整合到其它更多的工具中!  

## 编译器的功能
说了这么多,编译器到底是干什么的呢?(其实上面也有答案了)  
首先我们来了解一下,为什么现在的React应用中,内容记忆愈发重要:
1. **避免组件瀑布式地重渲染(cascading re-rendering).** 
    * 假设虽然只有`<Parent/>`组件发生了变化,它的整颗组件树都不得不被重渲染.(它以及其所有子组件)
2. **避免React以外的费时费力的计算.**
    * 比如你在组件里,或某个需要该数据的hook,调用了`expensiveProcessAReallyLargeArrayOfObjects()`
3. **记住副作用的依赖**
    * 为了确保某个hook的某个依赖,在重渲染之际保持全等状态,从而避免无限循环的错误.比如`useEffect()`的依赖.

初始版本的ReactCompiler聚焦于**提升更新效率**(比如重渲染已有组件),所以总的来说,ReactCompiler的作用主要是前两点.

### 优化重渲染
开发者使用React编写UI,主要是使用当时状态的函数(具体一点,当时状态包括props,state,context).当前实现中,每当组件的状态发生变化,React就会重渲染*对应组件*以及*其组件的所有子组件* -- 除非开发者手动地应用了记忆功能(比如`useMemo`,`useCallback`,`React.memo`等).  
举个例子,以下的代码中,每当`<FriendList/>`状态发生变化,`<MessageButton>`也会跟着重渲染.
```jsx
function FriendList({friends}){
    const onlineCount = useFriendOnlineCount();
    if(friends.length === 0){
        return <NoFriends />
    }
    return (
        <div>
            <span>{onlineCount} online</span>
            {friends.map((friend) => (
                <FriendListCard key={friend.id} friend={friend} />
            ))}
            <MessageButton />
        </div>
    )
}
```

而如果你使用了ReactCompiler,它就会自动将记忆的工作应用到`<MessageButton/>`上,从而确保只有相关的状态变化引起的重渲染,才引起该组件的重渲染.我们把这种自动记忆的功能称为"调试好的响应性"(fine-grained reactivity).  
还是上面的例子,ReactCompiler还会决定尽管`friends`状态发生变化,`<FriendListCard/>`的返回值依旧可被重用,避免重建这部分的JSX,避免状态`onlineCount`变化时引起`<MessageButton>`的重渲染.

### 计算量大的状态也会被记忆
编译器也可以自动记忆以下场景:
```jsx
// 以下方法不会被React Compiler记住,因为它不是组件或是hook.
function expensiveProcessAReallyLargeArrayOfObjects(){/*...*/}

// 以下会被RC记住,因为它是个组件
function TableContainer({items}){
    // 这个函数调用会被记住
    const data = expensiveProcessAReallyLargeArrayOfObjects(items);
    //...
}
```
不过,如果`expensiveProcessAReallyLargeArrayOfObjects()`真的十分耗时耗力,我们还是建议你在React之外实现针对性的记忆,因为:
* RC只会记忆React Components和hooks, 不是所有的函数都会被记住
* RC的记忆功能并不会在多个组件或hooks之间共享.  

因此,如果`expensiveProcessAReallyLargeArrayOfObjects()`函数在多个不同组件中都被调用了,哪怕传的参数是相同的,那这个函数还是会被重复地被调用.我们建议这样复杂的函数在形成之前,就对其进行一下"耗时衡量".([怎么衡量一个函数是否耗时耗力?](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive))

## 仍处于发展状态的一个功能:副作用的依赖记忆(Memoization for effects)
RC当前遇到的问题是,实际应用中,编译器对副作用的记忆项,跟源代码,已有的记忆项不相匹配.这大概是个优点?因为编译器找到的记忆项一般比开发者自己手动找的记忆项颗粒度更高.  
比如说,编译器的记忆功能用的是原始值记忆,而不是通过`useMemo`实现的,所以当需要生成记忆代码时不用遵循Hooks的规则,同时,它也能安全地记住hooks的调用.(?)  

不过因此可能产生的问题是,某些已经被记住的项,不久后发生了变化.这种常见出错的场景是,副作用hooks,`useEffect()`,`useLayoutEffect()` -- 为了避免无限循环,或不触发/过度触发,而依赖一些不会变化的状态.当你的应用中发现了React Compiler确实有这样的情况,记得向我们[提出问题](https://github.com/facebook/react/issues).  

React团队依旧在极力解决这个问题.当前的编译器,自动记忆的功能可以很大程度与手动记忆相同.如果二者记忆项不能确保相同,也就表明组件,或hook是安全的,RC已经不用对其发挥作用了.  

因此我们建议,代码中已有的`useMemo()`或`useCallback()`尽量维持原状,原有什么样就保持什么样.RC会尽可能生成更多可选的优化代码,但如果生成的代码影响原有的记忆行为,那它就会跳过自己生成的代码,保持原本的记忆行为.  
**已有的`useMemo`,`useCallback`就保持原状,新加入的代码,有了RC,就可以有意避免对这些API的依赖了.**

## 编译器会作用于哪些代码(assume)
编译器会作用于以下代码:
1. 合法有意义的JS代码
2. 测试中存在的,访问前被定义的,可空/可选的值和属性.(比如说启用了Typescript的`strictNullChecks`功能),  
举例说,`if(object.nullableProperty){object.nullableProperty.foo}`,或是可选链`object.nullableProperty?.foo
3. 遵循React规则的代码

RC可以静态校验多条React规则的使用,自动跳过违反规则的代码.对于产生错误的代码,我们建议使用[eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler)查看并改正错误

### 我写的代码被编译器纠错啦!
你可以看看[编译器是如何成功的找到代码库里的错误的](https://github.com/reactwg/react-compiler/discussions/8).

## 编译器的作用范围有多大?("see")
当前的RC每次以单个文件作为工作范围,也就是说RC会针对每个单独的文件进行代码优化.虽然乍看这个工作范围优点小,但我们却发现这个范围出奇的设置得好,而这一切,得益于React的编程理念:使用原生JS值,遵循对编译器友好的习惯和规则.当然,有得就有舍:无法得知其它文件的信息,实现更大程度的优化.但无论怎么说,当前单文件的工作范围设置,很好地平衡了编译器的工作复杂度及其输出质量,甚至可以说是利大于弊了.  

虽然当前的编译器没有使用像TS或Flow这样带有类型的JS,但它内部有自己的类型系统,足以比较完善地理解您的代码了.

感谢你能看到这里!