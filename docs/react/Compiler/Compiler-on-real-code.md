# ReactCompiler在真实代码中表现如何?

> [原文地址](https://calendar.perfplanet.com/2024/how-does-the-react-compiler-perform-on-real-code/)  
> 难得看到React Compiler相关的文章,自己也缺乏这方面的实战经验.所以希望通过这篇文章,"见见世面".  
> 以下的Compiler指的都是React Compiler.

过去几年React社区最令人兴奋和期待的新功能之一,大概就是React Compiler了.(此前被称为"React Forget" by Hux!).为什么呢? 因为据官方介绍,编译器的使用可以提升React应用的整体性能.有了它,我们大概就不用再担心页面重渲染带来的性能影响,手动实现像数据记忆,`useMemo`,`useCallback`这样的优化手段了.  

不过,细想一下,影响React性能最为主要的因素是什么呢?为什么大部分开发者都非常渴望Compiler带来的"Forget"功能,不手动调用那些hooks呢?Compiler到底能多大程度上优化我们的应用性能呢?  

这就是我写这篇文章的目的: 总结了Compiler尝试解决的问题;没有Compiler我们又要如何去解决;Compiler是如何具体实现到代码上的呢?我在我的项目里尝试用上了Compiler,并测试了它到底为我带来了多大的性能优化.  

顺口说一句,这篇文章的内容和结构,跟我在React Advanced上演讲的是一致的.如果你更愿意看演讲而不是阅读文章,你可以到[youtube上看看我的这个视频](https://www.youtube.com/watch?v=T-rHmWSZajc).

## 目录
* [React里重渲染和记忆功能的问题](#react里重渲染和记忆功能的问题)
* ["天降Compiler"](#天降compiler)
* [Compiler在简单应用上的表现](#compiler在简单应用上的表现)
* [Compiler在实际应用上的表现](#真实应用上的react-compiler)
* [初始加载性能与Compiler](#初始加载性能与compiler)
* [交互性能与Compiler](#交互性能与compiler)
    * [首页性能的测量](#首页的测量)
    * [次页性能的测量](#次页的性能测量)
* [Compiler能捕获到所有的重渲染吗?](#compiler能捕获到所有的重渲染吗)
* [简单总结](#简单总结)

## React里重渲染和记忆功能的问题
首先我们先要明确要探讨的问题.    
大部分React应用都是要展示一些交互界面的.当用户在页面上进行操作后,我们通常都需要更新页面上的部分内容,以展示用户操作后的结果.  
为了实现这个过程,在React中对应的操作就是:**重渲染**.
![re-render in react](/compiler/re-renders.png)

React一般需要**瀑布式**地实现重渲染.一个组件需要重渲染,其内部嵌套的每个组件(以其为父节点的整颗组件树)也都需要被重渲染.
![nested re-render](/compiler/re-renders-in-motion.gif)

一般情况下我们其实也不用担心什么 -- React如今的性能还是很快的.  
不过,如果组件树中存在大体积的组件("heavy components",可以是代码量大,也可以是操作量大),或是一些过多被重渲染的组件(?),这时应用的性能还是会有所下降的.
![heavy-components in tree](/compiler/slow-app.png)

一种解决办法就是,除本身外,不让其它子组件进行重渲染.
![stop re-renders](/compiler/re-renders-stopped.png)

为此我们有许多的实现方式 -- [下放组件状态](https://www.developerway.com/posts/react-re-renders-guide#part3.2);[以属性方式传递组件](https://www.developerway.com/posts/react-re-renders-guide#part3.3);将状态提取到上下文以避免属性注入;等等等等...当然,记忆(memoization)也是其中一种.  

记忆功能需要使用[`React.memo`](https://react.dev/reference/react/memo)这个API -- 官方提供的高阶组件.我们只需要将原来的组件,传递给这个API,在需要的地方渲染这个"被记住"的组件就行了.
```jsx
// "记住"一个慢组件
const VerySlowCompMemo = React.memo(VerySlowComp);

const Parent = () => {
    // 在此触发某些可能的重渲染

    // 把原本的组件替换为被包裹后的组件
    return <VerySlowCompMemo />
}

```
此后当React检查到组件树里的这个组件时,就会校验组件的props是否发生了变化,如果没有就会停止继续往下检查,停止该组件以下的重渲染.  
不过,当这个组件内的任意props还是发生了变化,那这个Memo包裹就没有作用了.(本应如此)  

简单概括就是,要记住一个组件,就要确保组件接收的props不发生变化.  
对于像字符串和布尔值这样原始类型的值时,规则很简单:值没变,组件也就不用被重渲染.

```jsx
const VerySlowCompMemo = React.memo(VerySlowComp);

const Parent = () => {
    //  两次重渲染间,"data"字符串不会发生变化,记忆功能如常发挥.
    return <VerySlowCompMemo data="123" />
}
```
而像对象,数组以及函数这样的非原始类型值,则需要一些额外对比,才能发现它是否发生了变化.  

React内部校对这些非原始类型值的方法,是["引用比较"(referential equality)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).  
我们在组件内声明的**非原始类型值,每次重渲染都会被重新创建**,值的引用自然也就发生变化,记忆功能也随之失效.
```jsx
const VerySlowCompMemo = React.memo(VerySlowComp);

const Parent = () => {
    //  两次重渲染间,"data"字符串不会发生变化,记忆功能如常发挥.
    return <VerySlowCompMemo data="123" />
}
```
为此,我们需要使用`useMemo`和`useCallback`.它们的作用是在重渲染之间保持非原始值的引用.`useMemo`一般用来保持对象,数组的引用;`useCallback`用在函数上.把props包裹到这些hooks里,就是我们常说的,"记忆props"了("memoization props").  

```jsx
const Parent = () => {
    const data = useMemo(() => ({id: '123'}),[]);
    const onClick = useCallback(() => {},[]);
    // 以上,对象和函数的引用都会被保持,而不是在重渲染时重新被创建

    // 以下的props在重渲染时都不会发生变化了.
    // 记忆功能能被正确启用.
    return (
        <VerySlowCompMemo data={data} onClick={onClick} />
    )
}
```
此后,当React在渲染树上遇到`VerySlowCompMemo`组件时,它就会检查对应的props是否发生变化,没有,就跳过,不重渲染这个组件.这样我们的应用就不会那么慢了.  

当然这只是极简的一种记忆功能展示,不过看起来,好像也不简单了对吧?  
别怕还有更复杂的:如果我们还要把这些被记住的props一路沿组件树传递下去,它就更复杂啦 -- 对这些值的任意改变,我们都需要手动来回追踪这些值,确保这些值的引用不会在这里或那里丢失掉...  

那怎么办呢?要么不做,要么就要全做.这些记忆功能的实现,为了提升代码性能,增加了一大堆hooks,可读,可理解,都变得难度,难理解了.  
到底要怎么选呢?
![memoize-with-hooks](/compiler/app-under-re-renders.png)

**这!就是!我们!为什么!需要!React Compiler!**  

## "天降Compiler"
[React Compiler](https://react.dev/learn/react-compiler)本质是由React团队开发的一个Babel插件.2024年10月时发布了它的[Beta版本](https://react.dev/blog/2024/10/21/react-compiler-beta-release).  

ReactCompiler在构建时,会将"普通"代码,默认对组件,其props,以及hooks的依赖,统统为你记忆起来.  
最终表现出来的,就跟所有的代码都用`memo`,`useMemo`,`useCallback`给包裹起来了一样.  
![with-compiler](/compiler/react-compiler-pic.png)

当然,所有代码都包裹不过是夸张说法.实际上,Compiler内部还要实现非常复杂的代码转换,尽可能提升代码的执行效率.  
以下就是一个例子:
```jsx
function Parent() {
    const data = {id:'123'};
    const onClick = () => {};
    return <Component data={data} onClick={onClick} />
}
// 经Compiler转变后的代码会是:

function Parent(){
    const $ = _c(1);
    let t0;
    if($[0] === Symbol.for('react.memo_cache_sentinel')){
        const data = {
            id:'123',
        };
        const onClick = _temp;
        t0 = <Component onClick={onClick} data={data} />;
        $[0] = t0;
    }else{
        t0 = $[0];
    }
    return t0;
}
function _temp(){};
```
可以看到,`onClick`函数被缓存到`_temp`变量,而`data`的声明则被移动到了`if`语句当中.  
你可以去[Compiler Playground](https://playground.react.dev/)这里自己探索一下.  
其具体实现机制也是十分awesome的!你可以去看看React团队对它的解释([这里有个talk你可以看看](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=9309s&ab_channel=ReactConf))  

回到我们这篇文章,我还是想在这探讨它到底能有多实用,它的出现受众又是怎样的呢?  
大部分人听到,"Compiler可以记住所有东西".大概都会有以下疑问:
* **初始加载性能呢?** 虽然可以"记住一切",但是否就说明,为了记忆,就要预先进行操作,继而拉低应用整体性能呢?
* **总体上,性能会是提升,还是降低了呢?** 重渲染带来的影响真的值得引入这个Compiler功能吗?
* **编译器能准确捕捉到组件重渲染的时机吗?** JS向来由于其灵活性和歧义性而备受诟病.Compiler真能准确捕获到所有依赖吗?我们是否引入了Compiler就能一劳永逸了呢?  

为了回答以上问题,我在一些较为复杂的项目上尝试使用了React Compiler.

## Compiler在简单应用上的表现
先来看看第一个例子:
```jsx
const SimpleCase = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)}>
                toggle
            </button>
            {isOpen && <Dialog />}
            <VerySlowComponent />
        </div>
  );
};

```
以上是一个按钮,打开和关闭`Dialog`对话框,其下有个很慢的`VerySlowComponent`,我们假设重渲染这个"好家伙"需要500ms.  

正常情况下,组件变化,其本身及组件树下的所有组件都需要被重渲染.结果,由于我们"后腿"的存在,对话框不得不一小段时间后才能被弹出.  
而要解决,就要把这"好家伙"用memo包裹起来:
```jsx
const VerySlowCompMemo = React.memo(VerySlowComponent);
//....
const SimpleCase = () => {
    //...
    return (
        //....
    <VerySlowCompMemo />
    )
}

```
而用Compiler后会是怎样呢? 首先我们在React DevTools上看到以下:
![enable compiler](/compiler/react-compiler-working.png)
上图说明我们的`Button`和`VerySlowComponent`都被Compiler给"记住"了.如果我在`VerySlowComponent`里加一条console.log,父组件`SimpleCase`的组件发生变化时,控制台上也看不到这个log了.也就是说,Compiler发挥作用了,问题确实有被解决,性能确实有所提升.  
我们再切换对话框时也不会有延迟了.
![compiler-in-motion](/compiler/compiler-in-motion.gif)


接着是第二个例子,我们为我们的"好家伙"加上一点props:
```jsx
const SimpleCase = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)}>
                toggle
            </button>
            {isOpen && <Dialog />}
            {/* 添加"data"和"onClick"两个props */}
            <VerySlowComponent 
            data = {{id:'123'}}
            onClick={() => {}}
            />
        </div>
    );
}

```
如果不用React Compiler,我就要结合`React.memo`,`useMemo`,`useCallback`手动包裹对应内容才能实现优化了.
```jsx
const SimpleCase = () => {
  const [isOpen, setIsOpen] = useState(false);
  const data = useMemo(() => ({ id: '123' }), []);
  const onClick = useCallback(() => {}, []);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        toggle
      </button>
      {isOpen && <Dialog />}
      <VerySlowComponentMemo
        data={data}
        onClick={onClcik}
      />
    </div>
  );
};
```
上面加了一大段我们才能像之前那样,消除重渲染带来的延迟.

第三个例子,我们将另外的组件,以child形式传递给我们的"好家伙".  (真是劳模,对着后腿一顿凿)  
```jsx
const SimpleCase = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)}>
                toggle
            </button>
            {isOpen && <Dialog />}
            <VerySlowComponent>
                <Child />
            </VerySlowComponent>
        </div>
    );
}
```
你能很快地想出要怎样优化以上代码吗?很多人可能会想这样:
```jsx
const VerySlowComponentMemo = React.memo(VerySlowComponent);
const ChildMemo = React.memo(Child);
// ...
<VerySlowCompMemo>
    <ChildMemo/>
</VerySlowCompMemo>
```
不巧,错了.  
以上树形的结构不过是`children`prop传递的语法糖而已,二者其实无异.重写一下只是这样:
```jsx
<VerySlowComponentMemo children={<ChildMemo/>} />
```
而且这里的`<ChildMemo/>`也只是元素创建的语法糖,本质只是`React.createElement`的调用,是**一个`type`属性指向`ChildMemo`函数的对象而已**.

```jsx
<VerySlowComponentMemo children={{type:ChildMemo}} />
```
这样拆分你是不是就眼熟一点了,我们只是将一个对象,以语法糖的方式传递给了我们的"好家伙".  
传递没被记住的对象,引用没被记住,自然每次重渲染都要被创建,"好家伙"也被重渲染了.  

拆分到这份上我估计你也知道要怎么解决了.就是用`useMemo`把我们的"语法糖"对象给记忆起来:
```jsx
const children = useMemo(() => <ChildMemo />,[]);

<VerySlowComponentMemo>
    {children}
</VerySlowComponentMemo>

```
到这里我们才真正实现了React Compiler为我们实现的记忆功能.(没有你我可怎么办啊!!!)  

以上三个例子都是简单演示.接下来,我把它用到了真实的项目上,看看它是否还能如此提升性能.  

## 真实应用上的React Compiler
这个真实app是新项目来的,类型完整,无过时代码,只有hooks,代码也相当规范.它包含落地页,一些内部才可访问的页面,总体代码有15k行.  
或许应用规模不算大,但我觉得将Compiler用在项目上,能一定程度上测试出Compiler的实际提升.  

引用Compiler前,我用React团队提供的工具对这个项目进行了代码[健康检测及eslint代码规范校验](https://react.dev/learn/react-compiler),结果如下:
```bash
Successfully compiled 361 out of 363 components.
Found no usage of incompatible libraries.
```
我一条eslint规范都没违反!  
我还用了[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview)对应用的初始加载和交互性能进行了测试.  
所有的测试都是在生产环境下的"mobile"模式进行的,其中CPU性能骤降了4次.我总共运行了5次测试,并提取了平均数据,以下是我得出的答案:

## 初始加载性能与Compiler
我先测试了应用的落地页性能.以下是启用Compiler之前的数据表现:
![initial-per-before-compiler](/compiler/initial-load-stats-before.png)
启用编译器后(后面的blink就是Compiler生效才有的标记)
![enabling compiler](/compiler/initial-load-stats-before.png)
![intial-per-after-compiler](/compiler/intial-load-stats-after.png)
上图中,后图是启用前,前图是启用后.可以看到结果几乎是一样的.  

为了提高数据可信度,我又在其它页面上进行了相同的测试,得到的结果也是,几乎相同.  
至此,我认为Compiler又胜出了一个回合:Compiler的引入看起来对初始加载几乎毫无影响.它帮我们"记住"了一些内容的同时,没对初始加载性能有很大的影响.  

## 交互性能与Compiler
### 首页的测量
为了测量Compiler对需要交互的页面带来的影响,我用包含React组件的页面来进行测量.  
我在一个"设置"的预览页进行了性能测试:
![components-preview-re-renders](/compiler/components-preview-re-renders.gif)

以下则是引入了Compiler后,再进行交互时的性能测试结果:
![before-after-inter-per](/compiler/settings-page-re-renders-performance.png)
震惊!启用了Compiler后,总阻塞时间(Total Blcoking time)从280ms降到了0ms!  
吓死我了,这到底是怎么实现的?  
这个页面的代码大概长这样:
```tsx
export default function Preview() {
  const renderCode = useRenderCode();
  const darkMode = useDarkMode();

  return (
    <div
      className={merge(
        darkMode === 'dark'
          ? 'dark bg-buGray900'
          : 'bg-buGray25',
      )}
    >
      <LiveProvider code={renderCode.trim()} language="tsx">
        <LivePreview />
      </LiveProvider>
    </div>
  );
}
```
`LiveProvider`就是用于渲染整块`Settings`内容的代码.类比这篇文章之前的例子就是,这里的`LiveProvider`就是我们的"好家伙",之前的,带有props的`<VerySlowComponent>`.  

Compiler为我们记住了这个好家伙,还不错!不过这是否还是有点作弊了?...  
我们日常开发场景,更多的应该是中小规模的组件,这个好家伙的规模可能还展示不出Compiler实际的功能.  
所以我用另一个更实际的页面,再测试了一遍.

### 次页的性能测量
这个次页(second page)里,头部里就有不少组件,还有些脚注,还有一个卡片的列表.头部中有一些用于过滤的小组件:按钮,输入框,复选框.当我选中按钮时,下方的卡片列表内只出现,包含按钮的卡片.当我又选中复选框选项时,下方列表就会进一步筛选,只剩下既包含按钮,也包含复选框的卡片.(图片中还选中了输入框)
![second-page-before-compiler](/compiler/checkbox-re-renders-before-compiler.gif)
只拿点击checkbox选项时的性能前后对比,结果如下图:
![second-page-comparison](/compiler/checkbox-re-renders-before-compiler.gif)
Total Blcoking Time从130ms降到了90ms.看起来还不错,起码数据真实了一点.  
不过,如果页面的重渲染全都消除了,这个数字是否能降得更多呢?在已有的卡片列表上添加少数额外的卡片,应该瞬间就能完成了吧?  

我检查了这个页面的重渲染状况, 很不幸 -- 不能完全消除页面重渲染.  
虽然页面大部分的重渲染已经被消除了,但卡片组件本身,恰是影响页面性能的主体,还是会重渲染.  
![checkbox-re-renders-after-compiler](/compiler/checkbox-re-renders-after-compiler.gif)
为什么会这样呢?我也不知道了.这已经是我能编写出来,最为遵循React原则的代码了.map一个数组,在里面渲染出`<GalleryCard/>`组件.
```tsx
{
  data?.data?.map((example) => {
    return (
      <GalleryCard
        href={`/examples/code-examples/${example.key}`}
        key={example.key}
        title={example.name}
        preview={example.previewUrl}
      />
    );
  });
}
```
我调试Compiler的方法是,用传统的工具重现记忆的功能.用`React.memo`将卡片组件包裹起来.理想情况是,包裹后,已有的卡片不会被重渲染,也就是说Compiler不知出于什么原因,没有作用到这个组件上.
```tsx
const GalleryCardMemo = React.memo(GalleryCard);

{
  data?.data?.map((example) => {
    return (
      <GalleryCardMemo
        href={`/examples/code-examples/${example.key}`}
        key={example.key}
        title={example.name}
        preview={example.previewUrl}
      />
    );
  });
}
```
我调试失败了.  
编译器没有出错 -- 代码本身出现问题了.  

我们都知道,被记住的组件,只需一个props发生改变,记忆功能就会"消失"(不变才怪),组件就会被重渲染.看起来是props这里出了问题.  
再分析一下,所有props都是字符串, 除了`example.previewUrl`.这是一个对象:
```jsx
{
    light:'/public/light/...',
    dark:'/public/dark/...',
}
```
问题找到了:重渲染之际,对象的引用被改变了.不过,为什么会这样呢?  
这是用React Query查询的,从接口返回的,`data`里的一部分.
```tsx
const { data } = useQuery({
    queryKey:['examples', elements.join(',')],
    queryFn:async () =>{
        const json = await fetch(
            `/examples?elements=${elements.join(',')}`,
        );
        const data = await json.json();
        return data;
    }
});

```
React Query会根据`queryKey`,对`queryFn`返回的数据进行缓存.看起来我犯的错误是,我提供的key,需要由所选的元素,通过`join`方法将`elements`数组拼接组合而成.比如我选了Button选项,key值是`button`.而再选上Checkbox,key就会变成`button,checkbox`.  

所以我认为,ReactQuery内部判定,以上两个key值不同返回的数据是完全不同的.我大概懂了 -- 我以为获取到的数据只是在原有的数据上添加上去,实际上它们是完全不同的两个数组结果.  

所以理清一下思路就是,当React Query的键值从`button`变到`button,checkbox`后,RQ会重新去获取新的数据,返回一个全新的数组,其内部的对象引用自然也是全新的了.最后的结果就是,`GalleryCard`接收的props变成了新的引用,记忆功能自然就失效了,自然就重渲染了,哪怕此时你看到的数据似乎是一样的.  

找到问题了,解决起来也就不难了:把对象props变为原始值props,从根源上杜绝引用发生变化就行了.

```tsx
{
  data?.data?.map((example) => {
    return (
      <GalleryCardMemo
        href={`/examples/code-examples/${example.key}`}
        key={example.key}
        title={example.name}
        // pass primitives values instead of the entire object
        previewLight={example.previewUrl.light}  // [!code highlight]
        previewDark={example.previewUrl.dark}  // [!code highlight]
      />
    );
  });
}

```
果然!我的思路是对的!我消除了所有的重渲染!  
此时我们再来测试一下我们优化的怎样吧!
![re-renders fixed](/compiler/after-re-renders-are-fixed.png)

Boom!Blocking Time直接降到了0!Interaction to Next Paint所需时间也对半砍了!  
Compiler确实提升了页面性能,不过我认为我在它的基础上,做得更棒一点!(确实)  

至此我认为第二个问题也得到解决了:Copiler能提升交互性能吗?  
**可以**,可以显著提升性能.不过可能每个页面有所差异,如果你愿意再研究如何提升性能,你能比它做得更好.  

## Compiler能捕获到所有的重渲染吗
最后一个问题:Compiler是否足够智能,记住所有的东西呢?  
或许看完先前的例子我们已有答案: 不能.  

为了答案的严谨性,我还收集了一些应用中明显需要重渲染的场景,检查一下多少重渲染还是会进行,多少重渲染用了Compiler后就能避免了.  

我找到了9个重渲染的典型场景,比如tab改变时,整个画框都会被重渲染;等等. 以下是9个场景下得出的结果:
* 其中**两个**场景,重渲染被完全避免了.
* 其中**两个**场景,重渲染状况没发生一点变化.
* 其它,介乎前两种状态之间,优化了一点点但不完全.

拿引用了Compiler,重渲染一点没变化的一个例子来说,下面这行代码就是"祸害之源"(就是这行代码导致组件没得到优化)
```tsx
const filteredData = fuse.search(search);
```
我甚至没在其它地方用过`filteredData`这个变量.这里的`fuse`是一个外部的模糊查询库.所以我怀疑是这个库,内部的实现跟Compiler的工作发生了冲突,而这并不是我能控制的.  

至此问题答案就更加清晰了.**Compiler不能捕获所有的重渲染.**  
我们项目中总有外部依赖库,跟Compiler的工作原理是冲突的,或者说,三方库的某些实现违背了React实现记忆功能的前提.  
或者说,一些旧代码的实现,Compiler也不知道要如何对其进行处理.  
或者说,我写的代码本身并没有出错,只是不适用于"被记住".  

## 简单总结
文章至此,对我的测试进行一个简要总结吧:
![sum](/compiler/final-summary.png)
* **初始加载性能**: 我看不到有什么负面影响
* **交互性能**: 交互性能提升了,部分大幅提升,部分小幅提升
* **可以捕获到所有重渲染吗?**: 不能,以后也不能.  

这是否意味着,有了Compiler,我们就能forget the memoization,不需要手动优化了呢?  
**不尽然,看情况.**  
如果你的App不追求极限,性能过得去就行;可以更好,但我不知道如何下手优化.那你可以引入Compiler,它是低成本优化的一个好手段.  
至于"性能过得去"是怎样的定义,就要看实际情况了.我觉得大部分情况下,单引入Compiler就能很好提升性能了.  
不过,如果你对"过得去"的定义很严格,要压榨每一毫秒性能,我的建议是在此基础上再手动优化.  

对不起,对于非常严格的你,你不能忘记先前的优化手段.你不仅要知道Compiler做了什么,如何做到的,还要在此基础上进一步优化.  
你的工作压力又多了一点...不过应该很少真正需要到这种程度的优化吧..  
如果你想成为真正的高手,了解并避免页面重渲染,你可以去[我的其它文章](https://www.developerway.com/tags/performance)了解更多.我还发表了[不少演讲](https://www.youtube.com/playlist?list=PL6dw1BPCcLC4n-4o-t1kQZH0NJeZtpmGp),甚至我还为此写了[一本书](https://advanced-react.com/),如果有兴趣可以去看看!  

---
感谢你能看到这里!✨✨
