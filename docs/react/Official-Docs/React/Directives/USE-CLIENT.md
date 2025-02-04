# 'use client'
> [原文地址](https://react.dev/reference/rsc/use-client)

**`'use client'`用以标记那些可以在客户端上运行的代码.**

* [指引](#指引)
    * [`'use client'`](#use-client-1)
    * [`use client`是如何标记客户端代码的](#use-client是如何标记客户端代码的)
    * [何时需要使用`'use client'`](#何时需要使用-use-client)
    * [服务器组件返回的可序列化类型值](#由服务器组件返回的可序列化类型值)

* [用法](#用法)
    * [构建交互及状态](#构建交互及状态) 
    * [使用客户端APIs](#使用客户端apis) 
    * [使用第三方库](#使用第三方库) 

## 指引
## `'use client'`
你可以在文件顶部加上`'use client'`指令,以标记该模块及其相关的依赖为客户端代码.
```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({timestamp, text}) {
    const date = formatDate(timestamp);
    // ...
    const editButton = <Button />;
    //...
}
```
当服务器组件导入了一个用`'use client'`标记的文件时,打包器会将二者区分开来:分为服务器运行的和客户端运行的代码.  

上面的`RichTextEditor`例子中,`formatDate`和`Button`里无论是否包含`'use client'`指令,它们的代码都会在客户端上被解析.  
值得注意的是,由服务器运行代码导入的模块会在服务器上被解析,由客户端代码导入的模块会在客户端上被解析.(?有点绕)

### 警惕
* `'use client'`指令必须在整个文件的开头,先于任何后续需要导入的模块或代码(只有注释可以先于它).指令也只能用单引号或双引号括住,反引号也不行.
* 如果一个标记了`'use client'`的模块被另外的客户端渲染模块所引入,那么这个指令是没有作用的.
* 当一个组件模块中包含了`'use client'`指令,那无论如何使用,该组件可以确保只会是一个客户端组件.不过,一个不包含`'use client'`指令的组件,还是有办法在客户端上被解析的.(? 什么办法?)
    * 当模块本身使用`use client`标记,或由其它包含了`'use client'`标记的模块以依赖的方式引入了本模块时,本模块都会被认为是客户端组件.否则,它会被认为是服务器组件.
* 需要在客户端解析的代码不只是限制于组件代码.所有客户端模块子树中的代码,都会被发送到客户端并被运行.
* 当一个服务器端解析的模块从客户端模块导入值时,这些值必须是React组件,或是React支持的,序列化后可通过props传给客户端组件的类型值.(下文有这些类型的列表.) 其它任意类型的值传递时都会抛出异常.

## `use client`是如何标记客户端代码的
React应用中,组件通常会被划分为独立的文件或模块.  

使用了React服务器组件的应用默认是服务器端渲染的.`'use client'`提供了一个界限,用以区分[模块依赖树](https://react.dev/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree)里的服务器端和客户端,更高效地创建客户端模块的依赖子树.  

为了更好地解释,我们来看看以下地服务器组件应用:
::: code-group
```js [App.js]
import  FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
    return (
        <>
            <FancyText title text="Get Inspired App"/>
            <InspirationGenerator>
                <Copyright />
            </InspirationGenerator>
        </>
    )
}
```
```js [FancyText.js]
export default function FancyText({title, text}) {
    return title? <h1 className="fancy title'">{text}</h1> : <h3 className="fancy text">{text}</h3>;
}
```
```js [InspirationGenerator.js]
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
    const [index, setIndex] = useState(0);
    const quote = inspirations[index];
    const next = () => setIndex((index + 1) % inspirations.length);
    return (
        <>
            <p>Your inspiration quote is:</p>
            <FancyText  text={quote} />
            <butotn onClick = {next}>Inspire me again</butotn>
            {children}
        </>
    )
}
```
```js [Copyright.js]
export default function Copyright() {
    return <p className='small'>©️ {year}</p>;
}
```

```js [inspirations.js]
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];

```
:::
我们来分析一下这个应用中的模块依赖树:  
`InspirationGenerator.js`里的`'use client'`指令标记着这个模块,以及它内部所有导入的依赖,都是客户端模块.  
以`InspirationGenerator.js`为根节点的子树都会被认定是客户端模块:
![use_client_module_dependency](/use-client/use_client_module_dependency.webp)
`'use client'`将模块依赖树划分为客户端模块和服务器模块,标记着`InspirationGenerator.js`及其内部所有的依赖都是由客户端渲染的了.  

渲染过程是,框架先由整个应用的根部,在服务器上逐层遍历组件树.遇到`'use client'`标记的模块后,跳过这些应由客户端解析的代码.  
之后由服务器端渲染好的部分和渲染树会被发送到客户端上.客户端下载这些内容后,完成剩余的需要由客户端渲染的部分.  

![use_client_module_dependency](/use-client/use_client_module_dependency.webp)
以上是整个应用的渲染树.`InspirationGenerator`及其子组件`FancyText`都是在客户端标记了的代码内导出的,因此它们也会被认定为客户端组件.  

接着我们来介绍几个定义:
* **客户端组件**是渲染树中,在客户端上被渲染的组件.
* **服务器组件**是渲染树中,在服务器上被渲染的组件.  

根据定义,以上的`App`,`FancyText`,`Copyright`都是由服务器渲染的,都是服务器组件.而`InspirationGenerator.js`及内部依赖都被标记为了客户端代码,所以`InspirationGenerator`和它的子组件`FancyText`都是客户端组件.

::: details 为什么`FancyText`既是服务器组件又是客户端组件?
代入上面的定义,`FancyText`既是服务器组件,也是客户端组件.  
可,为什么会这样呢?  

首先,我们先要理解,"组件"的定义并不是十分准确的.我们可以从以下两个角度来理解,什么是"组件":
1. 组件,有其本身的字面意义:通常情况下它可以只是一个函数:(**component definition**)
```js
// definition of a component
function MyComponent() {
    return <p>My Component</p>;
}
```

2. 组件,也可以从它被如何使用进行定义:(**component usage**)
```js
import MyComponent from './MyComponent';
function App() {
    return <MyComponent />;
}
```

大部分情况下组件是不用如此细致地从定义上区分的.**不过,到了这里你就要区分了.**  

当我们探讨服务器组件和客户端组件时,我们所指的就是以上第二种定义.  
* 如果组件定义在有`'use client'`标记的文件中,或由客户端组件导入并使用,那这个组件就是客户端组件.
* 否则,我们就说这个组件的用途,是服务器组件.
![use_client_render_tree](/use-client/use_client_render_tree.webp)
以上是说明组件用法的一棵渲染树.  

回到关于`FancyText`这个组件的问题上,它本身内部没有用`'use client'`标记,并且它的用法有两种.  
`FancyText`作为`App`组件的子组件时,它被认定为服务器组件.而在`InspirationGenerator`中导入并使用`FancyText`时,它就被认定为客户端组件了,因为`InspirationGenerator`包含了`'use client'`指令,是个客户端组件.    

综上,`FancyText`既要在服务器上被解析,也要被发送到客户端并渲染出来.
:::

::: details 为什么`Copyright`是服务器组件?
`Copyright`作为`InspirationGenerator`的子组件,你可能会很惊讶它为什么不是客户端组件而是服务器组件.  
提示一下,`'use client'`的作用是,**在模块依赖树的层面上,** 定义服务器代码和客户端代码,而不是在渲染树上划分.  
![use_client_module_dependency](/use-client/use_client_module_dependency.webp)
`'use client'`定义了模块依赖树上,哪些代码是客户端代码,哪些是服务器代码.  

在模块依赖树上我们看到,`App.js`从`Copyright.js`中引入并调用`Copyright`组件.由于`Copyright.js`没有包含`'use client'`指令,所以`Copyright`会在服务器上被渲染.`App`作为应用的根组件,显然也会在服务器上被渲染.   

客户端组件是可以渲染服务器组件的,因为后者可以将JSX以props形式传递给前者.  
拿图中的例子说明,`Copyright`组件以`children`属性传递给了`InspirationGenerator`.可是实际上`InspirationGenerator`模块并没有直接引入`Copyright`模块,也没有调用`Copyright`组件,这些工作其实都是`App`组件完成的.其实,`Copyright`组件在`InspirationGenerator`开始渲染前,代码就已经执行完毕了.  

说了这么多我们希望你能理解:**组件之间看起来是父子组件关系时,并不代表它们的渲染环境是相同的.**  
(`InspirationGenerator`是客户端组件,`Copyright`是服务器组件,哪怕看起来是父子组件的关系)
:::

## 何时需要使用`'use client'`
`'use client'`指令就是用来指定哪些是客户端组件的.  
由于组件目录下默认都是服务器组件,所以我们来简要说明一下,众多服务器组件中声明个别客户端组件时的好处及限制.  
为了简单起见,我们所说的原则是针对服务器组件的.实际上它们也同样适用于所有应用中所有需要在服务器上运行的代码.
### 服务器组件的优势
* 服务器组件能减少需要发送给客户端的代码,后者自然需要执行的代码量也少了.只有客户端模块需要被打包发送至客户端并被解析.  
* 服务器组件在服务器上被执行本身就是一大优势.通过服务器,我们能直接访问到本地的文件系统,减少数据获取和网络请求的延迟.

### 服务器组件的限制
* 服务器组件内并不支持像事件处理器这样的交互事件,它们必须交由客户端代码注册并触发.
    * 比如`onClick`事件处理器就只能在客户端组件中定义.
* 服务器组件不能使用大部分的hooks.
    * 服务器组件渲染的结果,本质上是一系列需要由客户端渲染的组件.服务器组件不能在渲染后,于内存中维护自身内部的状态.

## 由服务器组件返回的可序列化类型值
React应用中,父组件向子组件传递数据是再正常不过的了.由于组件有可能会在不同环境中被渲染,因此,服务器组件向客户端组件传递数据时,需要一些额外的考虑.  

**服务器组件传递给客户端组件的值必须是可被序列化的.**  
* 原始类型
    * `string`
    * `number`
    * `bigint`
    * `boolean`
    * `undefined`
    * `null`
    * `symbol`,而且必须是通过`Symbol.for()`创建的.

* 包含可序列化值的可遍历值(iterables)
    * `String`
    * `Array`
    * `Map`
    * `Set`
    * `TypedArray` 和`ArrayBuffer`

* `Date`
* `FormData`实例
* 原生对象: 通过对象字面量创建的,属性是可序列化值的对象
* 服务器函数
* `Promises`

<div className='font-bold text-red-500 text-xl' >值得注意的是,以下类型是不支持的.</div>

* React元素,或者JSX
* 不是服务器函数的函数,包括组件函数
* 类
* 由类实例化的,或 `__proto__`为null的对象(除了之前提过的,由内置类实例化的对象),
* 不是全局注册的Stymbols(比如`Symbol('my new symbol')`)

## 用法
## 构建交互及状态
```jsx
'use client';
import {useState} from 'react';

export default function Counter({initialValue = 0}){
    const [countValue, setCountValue] = useState(initialValue);
    const increment = () => setCountValue(countValue + 1);
    const decrement = () => setCountValue(countValue - 1);
    return (
        <>
            <h2>Count Value: {countValue}</h2>
            <button onClick={increment}>+1</button>
            <button onClick={decrement}>-1</button>
        </>
    )
}
```
由于`Counter`组件既需要用到`useState`这个hook,又需要用到`onClick`以增加或减少对应值,所以它必须是客户端组件,必须要在顶部加上`'use client'`指令.  

作为对比,一个只用来渲染界面而无需任何交互的组件,就不用标记为客户端组件.
```jsx
import {readFile} from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer(){
    const initialValue = await readFile('/path/to/counter_value');
    return <Counter initialValue={initialValue} />;
}
```
上面的`CounterContainer`作为`Counter`的父组件,就不需要用`'use client'`指令标记,因为它内部没有任何的交互需求,也不需要维护自身状态.而且`CounterContainer`还必须是服务器组件,因为它需要在服务器上读取本地的文件系统,这个功能只有服务器组件才能实现.  

有时一些组件内部没有用到任何服务器或客户端组件独有的特性,你不知道它们需要在哪一端上被渲染.比如说我们之前的`FancyText`就是这样:
```jsx
export default function FancyText({title, text}){
    return title? <h1 className="fancy title'">{text}</h1> : <h3 className="fancy cursive">{text}</h3>;
}
```
这里我们就没为它加上`'use client'`指令,结果是`FancyText`的输出结果(注意这里不是组件的源代码)在服务器组件引用时,被发送到浏览器去.  
正如前面所说,`FancyText`既可被用作服务器组件,也可被用作客户端组件,取决于它在被哪些模块导入,哪些模块使用.  

不过,如果`FancyText`的HTML解析结果跟源代码比较相似时(包括内部的依赖代码),这时把它标记为客户端组件会更好.举个例子就是,返回一长串SVG路径字符串的组件.  

## 使用客户端APIs
React应用中难免需要使用客户端特有的APIs,比如调用网络存储功能的,音视频操作的,硬件设备操作的浏览器APIs,等等等等.  
下面的例子是,组件利用DOM APIs操作`canvas`元素.由于相关API都只能在浏览器中使用,所以我们必须定义组件为客户端组件.
```jsx
'use client';
import {useRef, useEffect} from 'react';

export default function Circle(){
    const ref = useRef(null);
    useLayoutEffect(() => {
      const canvas = ref.current;
      const context = canvas.getContext('2d');
      context.reset();
      context.beginPath();
      context.arc(100,75,50,0,2*Math.PI);
      context.stroke();
    });
    return <canvas ref={ref} />;
}
```

## 使用第三方库
React应用中也难免需要调用三方库,以处理常见的UI模式或逻辑.(patterns or logic)  

以下三方库需要依赖组件Hooks或客户端APIs.任何使用了以下React APIs的三方组件都必须在客户端上运行:
* `createContext`
* `react`和`react-dom`中的hooks,**不包括`use`和`useId`**
* `forwardRef`
* `memo`
* `startTransition`
* 使用了客户端特有的APIs的,比如DOM插入或原生平台视图展示相关APIs.

如果这些三方库更新到最新版本,支持React服务器组件功能的话,它们内部本身应是包括了`use client`指令的,这样你才能直接在服务器组件中使用它们.  
如果组件还未更新,或组件本身需要像事件处理器这些只能被客户端识别的props的话,你可能需要自行添加一个"中间客户端组件层",在需要使用三方库和服务器组件中间,手动加上"一层客户端组件".  

--- 
感谢你能看到这里!


