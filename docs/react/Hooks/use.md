# use()
> 跟`useActionState`一样, 是React v19才稳定的一个新API.  
> 我的印象是可以整合Suspense, server action, fallback.  
> 那实际上是否可行呢? Why not give it a try?  
> [官网](https://react.dev/reference/react/use#)

`use`是一个React API,你可以用它来读取来自Promise或上下文提供的值.  
```ts
const value = use(resource);
```

* 介绍
    * `use(resource)`
* 用法
    * 用`use`读取上下文
    * 将数据从服务器端流式传递给客户端
    * 处理被拒绝的Promises (rejected)
* 可能遇到的问题
    * "挂起错误:这根本就不是真正的错误!"

## 介绍
### `use(resource)`
你可以在组件中用`use`来读取某些资源的值,这些资源可以是Promises,也可以是上下文.
```ts
import { use } from 'react';

function MessageComponent({messagePromise}){
    const message = use(messagePromise);
    const theme = use(ThemeContext);
    //...
}
```

**跟常规的hooks不同,`use`可以在循环语句,条件语句中被调用.**  
**跟hooks相似,调用`use`的函数必须是React组件,或是自定义React hooks内.**  

当`use`接收的参数是一个Promise,那它的作用就是整合了`Suspense`和错误边界(error boundaries).  
当Promise处于pending状态时,该组件也会被挂起.如果这个组件是被`<Suspense>`所包裹的话,那就会显示对应提供的fallback内容.  
当Promise完成了,数据获取成功了,fallback就会被已经完成数据填充的组件内容所替代;而数据获取失败的话,组件的内容就会被组件层级中最近的错误边界内容所替代.  
[相关例子可继续阅读下文](#用法)  
(resovled -> content with fetched data / rejected -> nearest error boudary)

### 参数解析
* `resource`: 表明你想从哪里读取数据,数据源是什么.它的值可以是Promise,也可以是context上下文.

### 返回值
返回值取决于你的资源是如何返回的,Promise/Context返回的内容是什么,对应的格式,对应的值就是什么.

### 警告
* `use`必须在组件内,或hook内调用.
* 我们建议,当需要在服务器组件中获取数据时,使用`async await`,而少用`use()`. `async await`会在`await`语句被调用时开始渲染,而`use`则会在获取数据成功后,重新渲染组件.(???? 一句话把我开头的兴趣给毁了)
* 建议在服务器组件里创建Promises定义,并将它们传递给客户端组件; 而不建议直接在客户端组件内定义Promises.后者导致的结果是,组件每次重渲染都会导致Promises重新被构造.而由服务器组件创建并传递给客户端的Promises都是稳定的,不会因重渲染而重新被创造.

## 用法
### 用`use`读取上下文
当`use`接收到的参数是一个上下文,这时它就像`useContext`那样工作了.要说区别就是,`useContext`必须在组件顶层被调用,而`use`则可以在循环或条件语句中被调用.  
这种场景下我们更建议使用`use`,因为它可以比`useContext`更为灵活.
```ts
import { use } from 'react';

function Button(){
    const theme = use(ThemeContext);
    //...
}
```
这里`use`的返回值就是`ThemeContext`提供的上下文值.React会查找组件树中,位置最近的上下文提供者所提供的值是什么.  
要把这个上下文值提供给`Button`组件,你需要用对应的上下文提供者,直接把它包裹,或将它的父级组件包裹起来.  
(以下是包裹其父级组件`Form`. v19的一个新改变是,没必要再用`.Provider`了.以下是没利用该新特性的)
```ts
function MyPage(){
    return (
        <ThemeContext.Provider value="dark">
            <Form />
        </ThemeContext.Provider>     
    )
}

function Form(){
    // ... 在这渲染Button并读取上下文的值
}
```
你不用在意这个提供者和消费者之间隔了多少层组件.你在`Form`里使用了`Button`组件,在`Button`里使用了`use(ThemeContext)`,你就能获取到`"dark"`这个值.  
再强调一次,`use`可以在条件语句和循环语句中被调用,而`useContext`不可以.

```tsx
function HorizontalRule({show}){
    if(show){
        const theme = use(ThemeContext);
        return <hr className={theme} />
    }
    return false;
}
```
`use`在条件语句中被调用的话,你就可以有条件地从某个上下文中读取对应值了.

::: danger
跟`useContext`相似,`use`会向组件树上层寻找最近的上下文提供者.**如果`use`和`Context.Provider`处于组件树同一层的话,它是读取不了这个上下文的值的.**  
(向上寻找/非同级)
:::

::: code-group
```js [App.js]
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp(){
    return (
        <ThemeContext.Provider value="dark">
            <Form />
        </ThemeContext.Provider>
    )
};
function Form(){
    return (
        <Panel title="Welcome">
            <Button show={true}>Sign up</Button>
            <Button show={false}>Log in</Button>
        </Panel>
    )
};

function Panel({title, children}){
    const theme = use(ThemeContext);
    const className = `panel-${theme}`
    return (
        <section className={className}>
            <h1>{title}</h1>
            {children}
        </section>
    )
};

function Button({show, children}){
    const theme = use(ThemeContext);
    const className = `button-${theme}`;
    if(show){
        <button className={className}>
            {children}
        </button>
    }
    return false;
}
```
:::

### 服务器流式传递数据给客户端
将Promise从服务器组件,以prop的方法传递给客户端组件的话,就可实现数据的流式传递了.
```ts
// 这里是服务器组件
import { fetchMessage } from './lib.js'
import { Message } from './message.js'

export default function App(){
    const messagePromise = fetchMessage();
    return (
        <Suspense fallback={<p>waiting for a message ... </p>}>
            <Message messagePromise={messagePromise} />
        </Suspense>
    );
}
```
之后客户端组件就可以接收这个Promise Prop,并作为参数传给`use()`API.客户端组件就能读取这个由服务器组件创建的,Promise的返回值了.

```js
// message.js
// 这里是客户端组件
"use client";
import { use } from 'react';

function Message({messagePromise}){
    const messageContent = use(messagePromise);
    return <p>Here is the message: { messageContent }</p>;
};
```
由于`Message`组件是包裹在`Suspense`里的,Promise没完成,相应显示的内容则会是fallback的内容;Promise完成了的话,`Message`组件就会以填充了`{messageContent}`的内容,替代回fallback的内容.

```js
// message.js
"use client";
import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

::: tip
如果将Promise从服务器组件传递给客户端组件的话,那这个Promise的返回值必须是可被序列化的,这样才能正确地在服务器端和客户端之间被传递.像函数这样不能被序列化的数据类型就不能作为Promise的返回值.
:::

::: details 我应该在服务器端还是客户端组件上完成Promise?
Promise可以由服务器端传递给客户端,并在客户端中用`use()`API将Promise解决.  
同样你也可以直接在客户端组件中用`await`将Promise解决,获取返回值,并将返回值以prop方式传递给客户端组件.
```ts
export default async function App(){
    const messageContent = await messagePromise();
    return <Message messageContent={messageContent} />
}
```
可是在服务器端调用`await`可能回导致渲染被阻塞,直到`await`语句完成后才恢复.  
而如果直接将Promise传递给客户端组件的话则可以防止Promise的执行阻塞服务器组件的渲染.   
(???next-form-example里你可不是这样做的..还不是直接await-> prop to client... )
:::

### 处理被拒绝的Promises
有时候,`use`接收的Promise结果可能会是rejected.你可以用以下方式处理这种情况:
1. 利用错误边界向用户展示对应错误信息
2. 用`Promise.catch`,提供额外可选值.
::: tip
Promise有三个状态: pending, fulfilled, rejected.
:::

::: warning
**`use`不能在try-catch块里被调用.**你要将组件包裹到错误边界中,或是用`Promise.catch()`方法提供处理错误时的候选值.
:::

#### 利用错误边界向用户展示对应错误信息
你可以利用错误边界在Promise被拒绝时向用户展示错误信息.方法就是,你在哪个组件里用了`use`,就用错误边界将这个组件给包裹起来(当然包裹它的父级组件也是可以的).  
此时当Promise被拒绝,对应错误边界的fallback内容就会显示出来.
```js
// message.js
"use client";
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function MessageContainer({messagePromise}){
    return (
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
            <Suspense fallback={<p>⌛Downloading message...</p>}>
                <Message messagePromise={messagePromise} />
            </Suspense>
        </ErrorBoundary>
    )
};

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```
::: tip
**Takeaway**:  
Suspense fallback用于Message的Promise加载时的**间歇展示**; Loading...  
ErrorBoundary fallback用于Promise rejected时的**错误展示**. Error occurred...
:::

#### 用`Promise.catch`提供额外可选值
当`use`的Promise被拒绝时,你可以用`Promise.catch`为其提供一个候补值.
```js
import { Message } from './message.js';

export default function App(){
    const messagePromise = new Promise((resolve, reject) => {
        reject();
    }).catch(() => {
        return "no new message found";
    });
    return (
        <Suspense fallback={<p>wating for message</p>}>
            <Message messagePromise={messagePromise} />
        </Suspense>
    );
}
```
你需要直接调用Promise对象上的`catch`方法.这个方法接收一个参数:一个接收错误信息为参数的函数.这个函数的返回值会作为最后的Promise返回值.

## 可能遇到的问题
### "挂起异常:这根本就不是错误!"
有时你会在React组件之外,hook定义之外,或在try-catch块内调用`use`API.(这些都是不被允许的)  
解决try-catch内调用`use`的方法是,利用错误边界将组件包裹起来,或是用`Promise.catch`为Promise提供错误候补值.  
而在组件外,hook外使用了`use`的解决办法,自然就是把`use`移动回这些"合法范围"之内了.
```js
function MessageComponent({messagePromise}){
    function download(){
        // ❌ the function calling `use` is not a Component or Hook
        // 错误地在组件定义之外,或是hook之外调用了use
        const message = use(messagePromise);
        //...
    }
}
```
把`use`移动回组件定义内就好了:
```js
function MessageComponent({messagePromise}){
    // ✅ `use` is being called from a component. 
    // 在组件定义之内调用use
    const message = use(messagePromise);
    //..
}

```

--- 
感谢你能看到这里!