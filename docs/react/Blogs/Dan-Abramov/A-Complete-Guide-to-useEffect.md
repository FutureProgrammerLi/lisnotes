# 一份完整的useEffect使用指南
>原文: A Complete Guide to useEffect  
作者: Dan Abramov  
简介: 经典永不过时.作为React Hooks的"创始人"之一的Dan自己写的一篇教程,类似尤雨溪教你用vue,含金量可想而知.  
(像complete guide和best practice这样的词,中文翻译成完全指南和最佳实践,读出来感觉怪怪的.)  
三年前翻译的了,个人认为Dan最好的一篇教程.翻译完1.7w字,仅以此致敬曾经的自己吧.在云雀上也没人看到,就把它paste到这里了.Dan的blog其实之前也能切换语言看到中文,不过repo好像关掉了,全英了,有点可惜.  
不用全看完,只希望文章某一部分能对你有一点点帮助.  

你或许已经用hooks写过一些组件,或许甚至已经完成了一些小型的app.你对自己很是满意.一路上用新的API,踩过新的坑,达成了这些成就,那感觉简直爽极了.你甚至写过一些自定义hooks把重复的逻辑抽了出来,由此节省了成百上千行的代码.你向同事们展示了你的成果,他们连声称"牛B".  

但是有时当你用`useEffect`这个hook时,事情似乎并没有很按你预想的方向发展.你总会隐隐约约地感觉是不是少了点东西.它看起来跟类组件的生命周期很像.但,真是这样吗?尝试回答一下以下问题吧:
* 我要怎么用`useEffect`取代`componentDidMount`呢?
* 我要怎么正确使用`useEffect`来获取数据呢?第二个参数的数组是什么?
* 我要不要,或者能不能把函数作为副作用的依赖呢?
* 为什么我有时会无限循环地获取数据呢?
* 为什么有时候我会在`useEffect`里拿到旧的state或者props呢?

当我刚开始使用hooks的时候,我也经常被以上问题所困扰.尽管我在写官方教程的那个时候,我对某些细微的点还是不能百分百确定.我有很多感到"aha!原来如此!"的顿悟时刻,我想把它们分享与你.读完这篇文章,你或许就能清晰以上问题的答案了.  

为了得到答案,我们需要往回倒退一下.这篇文章并非像列表攻坚一样,逐个击破.而是想让你从整体上掌握使用`useEffect`这个hook.其实要学的东西没多少,我们接下来是要花时间"忘却".(作者的意思可能是接收hooks这种新的心智模式)  
我也是当我不再通过熟悉的类组件生命周期这个角度去看待`useEffect`这个hook时才明白了一切.(好绕口,但总体还是劝不要用class的角度去看待useEffect)

> "Unlearn what you have learned." --Yoda
***
来读这篇文章的你,应该多少都了解过`useEffect`这个API的了.  
这篇文章很长,长到跟一本薄书一样了.这就是我想要的.但我还是写了个TLDR给你,如果你真的很赶时间或者并不关心细枝末节的话.  
如果你觉得自己现在的阶段不太适合那么深入地认识这个hook的话,你也可以先去别的教程看看,直到你懂为止.不过内容也是差不多的.就像React在2013年出来的时候,很多人也花了大量的时间才接受了这种与众不同的心智模型.  
(作者的意思是自己的语言可能没让你听懂,但你在别处看的,能看懂的,回过头来看这篇文章,也会出现在这里.)("居然有人比我还懂hooks!?")
## TLDR(太长不看)
(Too Long Don't Read)懒人福利.这个章节就是给没打算太深入了解的人准备的.如果有的地方你没太弄懂,你可以翻全文看看,大抵是能有你的答案的.  
如果你打算读完全文,那这一部分是可以略过的.It's all up to you. 
* 问题1: 我要怎么用`useEffect`取代`componentDidMount`呢?
* 问题2: 我要怎么正确使用`useEffect`来获取数据呢?第二个参数的数组是什么?
* 问题3:我要不要,或者能不能把函数作为副作用的依赖呢?
* 问题4:为什么我有时会无限循环地获取数据?
* 问题5:为什么有时候我会在`useEffect`里拿到旧的state或者props呢?
***
> **问题1: 我要怎么用`useEffect`取代`componentDidMount`呢?**  

你可以用`useEffect(fn,[])`来实现相同效果,但它们并非完全是等价的.  
不像`componentDidMount`, `useEffect`会捕获props和state.所以在这个回调函数fn里,你都会得到最初的props和state(指函数运行时那一刻).如果你想获取最新的东西,那你可以使用ref.不过总有更简单的代码组织方式让你不需要这样做.记住,副作用这个心智模式跟`componentDidMount`和其它生命周期时不一样的,尝试用后者来准确理解前者是不合理的.为了让你写代码更有效率,你需要用副作用的思维去思考.它的心智模型更像是实现同步而不是响应生命周期.  
(implementing synchronization rather than responding to lifecycle events)
> **问题2: 我要怎么正确使用`useEffect`来获取数据呢?第二个参数的数组是什么?**  

[这篇文章](https://www.robinwieruch.de/react-hooks-fetch-data/)能很好地教你用`useEffect`来获取数据.([我翻译过!](https://www.yuque.com/u12018688/edxwr9/axq78e))记得读完!它没这篇文章那么长.  
**空数组`[]`表明这个副作用不依赖于React数据流中的任何数据,因此这个副作用只会执行一次.**而且,副作用依赖的值不正确常常是bug的来源.你应该学习使用其它策略来移除副作用的依赖而不是单纯地把它给省去(主要是使用`useReducer`和`useCallback`).(题外:同样是依赖,我去掉就会有bug,别人去掉就会另外写东西来解决这个bug)
> **问题3:我要不要,或者能不能把函数作为副作用的依赖呢?**  

我的建议是,把不依赖props或者state的函数提升到组件以外,并且把那些仅被effect使用的函数放到effect里面.  
如果这样你的effect还是要用到组件内的函数(包括通过props传进来的函数),用`useCallback`把它们包裹起来吧.为什么这样做很重要?函数可以获取props和state的值,所以它们是参与数据流的.更多的细节可以看看这个[FAQ](https://legacy.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
**(所以是建议放组件外(不依赖props/state),或者放useEffect里(只使用一次),就是不建议放在组件内?)**
> **问题4:为什么我有时会无限循环地获取数据?**  

这种情况一般是你在用`useEffect`获取数据时,**没声明第二个依赖参数导致的**.没有它的话effect会在每次渲染后执行,而effect里面执行的内容又会改变state,改变state又会触发渲染.(渲染-effect-渲染-effect...)  
另一种可能是**你的依赖项总是在改变**.你可以逐个移除依赖,找出总是在改变的那个.不过,直接移除依赖,或者盲目地使用空数组也不是正确的修bug姿势.你应该要从源头修bug.比如,函数就是典型的bug之源,你可以把它们提升到组件外,或者定义在使用它的effect之内,又或是,用`useCallback`包裹这个函数.同样为了避免类似的问题,用`useMemo`来包裹状态对象(函数和对象在每一个snapshot都会是新的地址,导致它们的值是不同的,这或许会导致bug,这或许也是`useCallback`和`useMemo`的用途之一)
> **问题5:为什么有时候我会在`useEffect`里拿到旧的state或者props呢?**  

副作用总能获取那一次渲染时,外部的props和state.这个特性[有时很有用](https://overreacted.io/how-are-function-components-different-from-classes/),有时又很烦人.当遇上烦人的情况时,你可以用ref来显式维护某些值.(超链的文章结尾有解释).如果你在`useEffect`里意外地获取到了旧的props或者state,你或许是依赖没写对,写少了.你也可以用[这个插件](https://github.com/facebook/react/issues/14920)来锻炼锻炼自己写依赖,久而久之你就不会再出现这种问题了.你也可以从[这里](https://legacy.reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function)获取一些答案.~(eslint-plugin-react-hooks@next 也是Dan写的一个包)
***
希望以上的TLDR对你有用! 接下来是详细part! let's go!

## 每次渲染都有自己的props和state
谈副作用之前,我们需要先讲讲什么是渲染.  
这是一个计数器.仔细看段落`<p>`的内容.
```jsx
function Counter(){
    const [count,setCount] = useState(0);
    return (
        <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count+1)}>
            Click me
        </button>
        </div>
    )
}
```
它意味着什么?{count}的值会监测改变并自动更新吗?乍一看好像是这样的,但这不并完全符合[React的心智模式](https://overreacted.io/react-as-a-ui-runtime/).(?又是新坑?)  
例子中的count只是一个数字.它并非神奇的数据绑定,不是检测器,也不是代理或其它什么东西.它实际上就像以下那样,单纯的数字而已.
```jsx
const count = 42;
<p>You clicked {count} times</p>
```
首次渲染的时候,count这个变量的初始值由useState中获取,是0.当我们调用setCount(1)时,React会再次调用我们的组件函数.这时候,count的值就变为1了,以此类推.**(怎么在多次调用时维持的呢?)**
```jsx
//During first render
//首次渲染的时候
function Counter() {
  const count = 0; // 由useState()返回
  // ...
  <p>You clicked {count} times</p>
  // ...
}
// After a click, our function is called again
//点击按钮之后,组件函数再次被调用
function Counter() {
  const count = 1; // Returned by useState()
  // ...
  <p>You clicked {count} times</p>
  // ...
}

// After another click, our function is called again
//再次点击,再次调用
function Counter() {
  const count = 2; // Returned by useState()
  // ...
  <p>You clicked {count} times</p>
  // ...
}
```
每当我们更新状态时,React就会调用组件函数.每一次的渲染结果都有自己的count值--其实就是函数里的一个常量(constant inside our function).  
所以这行代码其实并没有实现什么数据绑定:
```jsx
<p>You clicked {count} times</p>
```
它只是把一个数字值嵌入到了渲染结果上.这个数字值,是由React提供的.调用`setCount`时,React就会采用这个新的值,重新调用组件函数.然后,React就根据这个最新的渲染结果,更新到DOM上.(React在这做了两件事,1.用新值调用组件;2.更新DOM. render和commit两个阶段,commit根据render的结果来实行.)  
(想深入了解这个过程,可以看[这篇文章](https://overreacted.io/react-as-a-ui-runtime/).)
## 每次渲染都有自己的事件处理
So far so good.那么,事件处理器呢?  
看个例子,它会在点击Show alert后三秒提示count的值.