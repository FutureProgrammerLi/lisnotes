# useTransition
> 从`startTransition`开始对transition进行理解.  
> 这个hook介绍很长,大概用法有很多?
> [官方原文](https://react.dev/reference/react/useTransition)

`useTransition`是个可以让你在后台渲染部分UI的React Hook.
```js
const [isPending, startTransition] = useTransition();
```
* [指引](#指引)
    * [`useTransition()`](#usetransition-1)
    * [`startTransition(action)`](#starttransition-action)
* [用法](#用法)
    * [配合Actions实现非阻塞更新](#配合actions实现非阻塞更新)
    * [从组件内暴露出`action` prop](#从组件内暴露出action-prop)
    * [展示一个表示进行中的可视化状态](#展示一个表示进行中的可视化状态)
    * [避免不想要的加载指示器](#避免不想要的加载指示器)
    * [构建一个启用了`Suspense`的路由器](#构建一个启用了suspense的路由器)
    * [配合错误边界向用户展示错误信息](#使用错误边界向用户展示错误)
* [可能遇到的问题](#可能遇到的问题)
    * [在Transition里更新输入时不起作用](#在transition里更新输入内容时失效)
    * [React没把我的状态更新函数视作Transition](#react没把我的状态更新函数视作transition)
    * [React没把我放在`await`之后的状态更新视作Transition](#react没把我放在await之后的状态更新视作transition)
    * [我想在组件外部调用`useTransition`](#我想在组件外部调用usetransition)
    * [我传给`startTransition`的函数立刻就被执行了](#我传给starttransition的函数立即被执行)
    * [Transitions里的状态更新不按我想要的顺序执行](#transitions里的状态更新没按顺序执行)

## 指引
## `useTransition`
在组件顶部调用`useTransition`,将一些状态更新标记为Transitions.
```jsx
import { useTransition } from 'react';

function TabContainer(){
    const [isPending, startTransition] = useTransition();
    //...
}
```
### 参数
`useTransition`不接受任何参数.

### 返回值
`useTransition`返回一个数组,包含两个元素:
1. `isPending`: 一个布尔值,表示是否有正在进行的Transition.
2. `startTransition`: 一个函数,可以用它将一些更新标记为Transition.

## `startTransition(action)`
`useTransition`返回的`startTransition`可以用来将一些状态更新标记为Transition.
```jsx
function tabcontainer(){
    const [isPending, startTransition] = useTransition();
    const [tab, setTab] = useState('about');

    function selectTab(nextTab){
        startTransition(() => {
            setTab(nextTab);
        })
    }

    // ...
}
```

::: tip
### `startTransition`里的函数被称为"Actions"
我们把传给`startTransition`的函数称为"Action".习惯上,`startTransition`里的回调都应命名为`action`,里面调用的函数都加上后缀`xxxAction`
```jsx
function SubmitButton({submitAction}){
    const [isPending, startTransition] = useTransition();

    return (
        <button
            disabled={isPending}
            onClick={() => {
                startTransition(() => {
                    submitAction();
                })
            }}
        >
            Submit
        </button>
    )
}
```
:::

### 参数
* `action`: 一个通过调用[一个或多个`set`](https://react.dev/reference/react/useState#setstate)以更新状态的函数.  
(这里指`useState`返回的第二个参数:`const [state, setState] = useState(initialState);`中的`setState`)  
React会立即调用不带参数的`action`,并对作为Transition的`action`内部的状态更新进行标记,把它们调度为同步更新(scheduled synchronously).  
所有`action`内的await异步调用,都会被包裹在transition中.不过以目前的实现,我们还需要把`await`后的`set`函数包裹到另外的`startTransition`中.  
标记为Transition的状态更新,是[不会阻塞的](https://react.dev/reference/react/startTransition#marking-a-state-update-as-a-non-blocking-transition),[不会展示任何不想要的加载指示器的](https://react.dev/reference/react/useTransition#preventing-unwanted-loading-indicators).

### 返回值
`startTransition`不会返回任何值.

## 注意事项
* `useTransition`是一个Hook,所以它只能在组件或自定义Hooks内被调用.如果你要在其它地方启用Transition的话(比如从数据三方库中),请单独调用`startTransition`.
* 你需要确保,将更新函数包裹到Transition之前,你是在这个更新函数的作用域之内的.如果你需要通过启用Transition,以响应一些prop或自定义hooks的返回值时,试试用`useDeferredValue`替代.
* 传给`startTransition`函数会被立即执行,对所有的状态更新进行标记,以Transitions的形式执行.如果你要在`setTimeout`里实现状态更新的话,这些更新不会被标记为Transition.  
* `startTransition`自身有个稳定的标识,所以你会很少会看到它出现在副作用的依赖里,不过把它作为依赖也不会重新触发副作用.如果你的代码校验器没报错,那把它省略掉一般也不会有问题.[更多关于移除副作用依赖的问题](https://react.dev/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* 被标记为Transition的状态更新会被其它的状态更新所终端.比如你要在一个Transition里更新某个图表组件,在图标重渲染的过程中应用接收了用户的输入内容,React此时就会先优先处理用户的输入,之后再重启图表组件的渲染工作.
* Transition内的更新函数不能用于控制文本输入.
* 如果同时有多个进行中的Transitions,React现在的处理方式是会同时批处理.这种处理方式之后可能会被变更.  

## 用法
## 配合Actions实现非阻塞更新
在组件顶部调用`useTransition`,创建Actions,并获取到Transition的执行状态:
```jsx
import { useState, useTransition } from 'react';

function CheckoutForm(){
    const [isPending, startTransition] = useTransition();
    //  ...
}
```
`useTransition`返回一个数组,包含两个元素:
1. `isPending`: 一个布尔值,表示是否有正在进行的Transition.
2. `startTransition`: 一个函数,用以创建Action.

为了启用Transition,像这样把Action传递给`startTransition`:
```jsx
import {useState, useTransition} from 'react';
import { updateQuery } from './api';

function CheckoutForm(){
    const [isPending, startTransition] = useTransition();
    const [quantity, setQuantity] = useState(1);

    function onSubmit(newQuantity){
        startTransition(async() => {
            const savedQuantity = await updateQuery(newQuantity);
            startTransition(() => {
                setQuantity(savedQuantity);
            });
        });
    }
    // ...
}
```
我们把传给`startTransition`的函数称为"Action".你可以在Action里实现状态更新,或触发一些副作用.这些都会在后台中进行,不会对用户的任意交互造成阻塞.一个Transition里可以包括多个Actions,而且当一个Transition进行时,你的界面还是可响应的.比如当用户点击一个标签,然后突然改变主意,又点了另外的标签,第二次点击会被立即响应,不用等待第一次点击造成的更新完毕后才处理第二次点击.  
为了告知用户正在进行的Transition状态,在首次调用`startTransition`时`isPending`的值会变为`true`,知道所有的Actions都执行完毕且更新后的状态都展示给用户后才变为`false`.Transitions可以确保Actions里的副作用在完成的同时,没有额外的加载指示标识,你还可以用`useOptimistic`为用户提供即时的关于Transition状态的反馈.  

### Actions和普通的事件处理器之间的区别

#### 1.在Action里更新数量  
例子1: 在Action里更新数量.我们用`updateQuantity`模拟发送给服务器的请求,以更新购物车中物品的数量.我们故意使这个函数有延迟,使之至少1秒才能完成请求.  
我们快速触发几次这个函数.你就能看到:点击后`Total`的值被提示为更新中,直到后台最后的一个请求完成了,计算出所有请求后的`Total`值后,`更新中`这个内容才会被最后的`Total`值所替代.这就是Action的作用:状态的更新被包裹为Action,"数量"这个状态哪怕后台请求正在进行中时,它也会被持续更新.

::: code-group
```jsx [App.jsx]
import { useState, useTransition } from 'react';
import { updateQuantity } from './api';
import Item from './Item';
import Total from './Total';
export default function App(){
    const [quantity, setQuantity] = useState(1);
const [isPending, startTransition] = useTransition();
const updateQuantityAction = async newQuantity => {
    // 要读取transition的状态的话,就要再次调用`startTransition`
    startTransition(async () => {
        const savedQuantity = await updateQuantity(newQuantity);
        startTransition(() => {
            setQuantity(savedQuantity)
        })
    })
}
return (
    <div>
        <h1>Checkout</h1>
        <Item action={updateQuantityAction}/>
        <hr />
        <Total quantity={quantity} isPending={isPending} />
    </div>
);
}
```
```jsx [Item.jsx]
import { startTransition } from "react";
export default function Item({action}) {
function handleChange(event) {
    // 要暴露一个action prop,就要在startTransition里调用回调函数
    startTransition(async () => {
    action(event.target.value);
    })
}
return (
    <div className="item">
    <span>Eras Tour Tickets</span>
    <label htmlFor="name">Quantity: </label>
    <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
    />
    </div>
)
}
```
```jsx [Total.jsx]
const intl = new Intl.NumberFormat("en-US", {
style: "currency",
currency: "USD"
});
export default function Total({quantity, isPending}) {
return (
    <div className="total">
    <span>Total:</span>
    <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
    </span>
    </div>
)
}
```
```js [api.js]
export async function updateQuantity(newQuantity) {
return new Promise((resolve, reject) => {
    // 模拟一个慢的网络请求
    setTimeout(() => {
    resolve(newQuantity);
    }, 2000);
});
}
```
:::
这是一个解释Action的简单例子,有点缺陷是没展示出后台请求没按顺序完成的情况时会怎样.当短时间内多次发送请求,先前的请求覆盖了后续的请求结果,导致更新的结果不一致也是有可能的.这种限制我们在以后也会着手解决.  

对于大部分的使用场景,React提供了以下内置抽象帮助解决:
* [`useActionState`](https://react.dev/reference/react/useActionState)
* [`<form> actions`](https://react.dev/reference/react-dom/components/form)
* [`服务器函数`](https://react.dev/reference/rsc/server-functions) 

#### 2.在Action之外更新数量
我们同样用`updateQuantity`模拟发送给服务器的请求,以更新购物车中物品的数量.我们故意使这个函数有延迟,使之至少1秒才能完成请求.  
同样快速触发多次函数,你就能看到差别了: 之前包裹在Action里的更新是直接显示最后的结果,而这次点击的更新是每次的结果逐个替换展示.  
**仅列出两个文件中的差异,其它代码是一样的.**  

::: code-group
```jsx [App.jsx]
function App(){
    const [isPending, setIsPending] = useState(false);
    const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
    };
    // ...
}
```

```jsx [Item.jsx]
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }

  // ...
}
```
:::

一种解决办法是在请求处理时,禁止用户发起下一次请求.
```jsx [Item.jsx]
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number" 
        disabled={isPending} //  [!code highlight]
        onChange={onUpdateQuantity}   
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```
这种方式明显没那么好,每点击一次都要等个一两秒(用户还不知道具体)才能点击下一次.或许还有其它更复杂的处理方式能解决这个问题,但Actions在这里就是解决这个问题比较直接的,内置的方法.

## 从组件内暴露出`action` prop
你可以从组件内暴露一个action prop,以供父组件调用.  
比如这里的`TabButton`组件,将`onClick`的逻辑包裹到了一个action prop里.  
```jsx [TabButton.jsx]
export default function TabButton({action, children, isActive}){
    const [isPending, startTransition] = useTransition();
    if(isActive){
        return <b>{children}</b>;
    }
    return (
        <button onClick={() =>
            startTransition(() => {
                action();
            })
        }>  
            {children}
        </button>
    )
}
```
由于父组件在`action`里更新状态,这个状态更新就会被标记为Transition.也就是说,你可以点击"Posts"后,立即点击"Contact"而不会被阻塞.

::: code-group
```jsx [App.jsx]
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```jsx [TabButton.jsx]
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}

```

```jsx [PostsTab.jsx]
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 模拟慢组件的渲染
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;

```

```jsx [AboutTab.jsx]
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}

```

```jsx [ContactTab.jsx]
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}

```
:::

## 展示一个表示进行中的可视化状态
你可以用`useTransition`返回的`isPending`布尔值,来告诉用户是否有Transition在进行中.  
比如说,为标签按钮添加一个特殊的"pending"视觉提示:
```jsx
function TabButton({action, children, isActive}){
    const [isPending, startTransition] = useTransition();
    // ...
    if(isPending){
        return <b className='pending'>{children}</b>;
    }
    // ...
}
```
加上上面这段代码再点击"Posts"标签,你大概就可以知道,你点击了,只是服务器还在处理你点击的这个请求.

## 避免不想要的加载指示器
我们再为`PostsTab`加点东西,用`use`API来获取数据.点击"Posts"标签后,`PostsTab`组件会被"挂起(suspends)",展示其组件树上最近的加载指示器:  
(官方的代码里并没有展示PostsTab的代码,需要[跳转到这里](#构建一个启用了suspense的路由器)才有用`use`获取数据的代码例子,*Biography.js)

::: code-group
```jsx [App.jsx]
import {Suspense, useState} from 'react';
import TabButton from './TabButton.jsx';
import AboutTab from './AboutTab.jsx';
import PostsTab from './PostsTab.jsx';
import ContactTab from './ContactTab.jsx';

export default function App(){
    const [tab, setTab] = useState('about');
    return (
        <Suspense fallback={<h1>🌀 Loading...</h1>}>
            <TabButton
                isActive={tab === 'about'}
                action={() => setTab('about')}
            >
                About
            </TabButton>
            <TabButton
                isActive={tab === 'posts'}
                action={() => setTab('posts')}
            >
                Posts
            </TabButton>
            <TabButton
                isActive={tab === 'contact'}
                action={() => setTab('contact')}
            >
                Contact
            </TabButton>
            <hr />
            {tab === 'about' && <AboutTab />}
            {tab === 'posts' && <PostsTab />}
            {tab === 'contact' && <ContactTab />}
        </Suspense>
    )
}
```
```jsx [PostsTab.jsx]
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}

```
:::

点击一个标签导致整个标签容器都被隐藏起来,看起来简直不要太搞笑.而如果在`TabButton`里使用`useTransition`,你就能为单独的标签按钮添加并展示独立的加载中状态了.  

加上下面的代码再点击"Posts",整个标签容器就不会被完全被Loading替代了.
```jsx [TabButton.jsx]
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
    const [isPending, startTransition] = useTransition();
    if(isActive){
        return <b>{children}</b>;
    }
    if(isPending){
        return <b className='pending'>{children}</b>;
    }
    return (
        <button onClick={() => {
            startTransition(() => {
                action();
            })
        }}>
            {children}
        </button>
    )
}
```

> [更多关于Suspense配合Transitions的用法](https://react.dev/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

::: tip
Transitions会为了避免隐藏那些已经被展示的内容而等待(比如上面的标签容器).如果Posts标签内还有嵌套的`<Suspense>`边界,这个Transition就不会再为它等待了.(?)
:::

## 构建一个启用了`Suspense`的路由器
如果你需要手动搭建React框架(比如没有使用Next),或要自行构造应用路由系统的话,我们建议你把页面的导航都标记为Transitions.
```jsx
function Router(){
    const [page,setPage] = useState('/');
    const [isPending, startTransition] = useTransition(); // [!code highlight]

    function navigate(url){
        startTransition(() => {  // [!code highlight]
            setPage(url);
        }); // [!code highlight]
    }
    // ...
}
```
以下是推荐的原因:
* Transitions是可被中断的,这样用户就不用等待上一次重渲染完成后再点击下一次了.
* Transitions可以避免不想要的加载指示器,用户的切换体验就可以更加友好.
* Transitions会等待所有进行中的actions,用户就可以在新页面展示之前,等待副作用的完成了.(?用户怎么知道什么是actions,什么是副作用?)

以下是利用Transitions实现导航的,简化版的路由系统:(代码轰炸)
::: code-group
```jsx [App.jsx]
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.jsx';
import ArtistPage from './ArtistPage.jsx';
import Layout from './Layout.jsx';

export default function App(){
    return (
        <Suspense fallback={<BigSpinner />}>
            <Router />
        </Suspense>
    )
}

function Router() {
    const [page, setPage] = useState('/');
    const [isPending, startTransition] = useTransition();

    function navigate(url){
        startTransition(() => {
            setPage(url);
        });
    }

    let content;
    if(page === '/'){
        content = (
            <IndexPage navigate={navigate}/>
        );
    } else if(page === '/the-beatles'){
        content = (
            <ArtistPage
                artist={{
                    id:'the-beatles',
                    name:'The Beatles',
                }}
            />
        )
    }
    return (
        <Layout>
            {content}
        </Layout>
    )
}

function BigSpinner(){
    return <h2>🌀 Loading...</h2>;
}
```

```jsx [Layout.jsx]
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}

```

```jsx [IndexPage.jsx]
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}

```

```jsx [ArtistPage.jsx]
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}

```

```jsx [Albums.jsx]
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

```

```jsx [Biography.jsx]
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

```

```jsx [Panel.jsx]
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}

```
:::

::: tip
启用了Suspense功能的路由默认期望导航的更新都是通过Transition来实现.
::: 

## 使用错误边界向用户展示错误
如果`startTransition`里的函数出错了,你可以使用错误边界向用户展示错误信息.用法是把调用了`useTransition`的组件包裹到`<ErrorBoundary>`里.一旦action出错了,错误边界定义的后备组件就会展示出来.
```jsx [AddCommentContainer.jsx]
import { useTransition } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function AddCommentContainer(){
    return (
        <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
            <AddCommentButton />
        </ErrorBoundary>
    )
}

function addComment(comment){
    if(comment == null){
        throw new Error("Example Error: An error thrown to trigger error boundary");
    }
}

function AddCommentButton(){
    const [isPending, startTransition] = useTransition();
    return (
        <button 
            disabled={isPending}
            onClick={() => {
                startTransition(() => {
                    // 故意不传内容以抛出错误
                    addComment();
                })
            }}
        >
            Add Comment
        </button>
    )
}
```

## 可能遇到的问题
## 在Transition里更新输入内容时失效
你**不可以用Transition控制作为输入内容的状态变量.**
```jsx
const [text, setText] = useState('');
// ...
function handleChange(e){
    // 错误
    startTransition(() => {
        setText(e.target.value);
    })
}
// ...
return <input value={text} onChange={handleChange} />;
```

这是因为Transitions是非阻塞的,可是更新输入这个事件需要同步发生.如果你真的要用Transition来响应用户的输入,你可以选择以下两种方式:
1. 声明两个独立的状态变量: 一个用在存储输入状态(这个需要时刻同步更新),另一个用于在Transition里更新.这样你就能确保输入内容是同步的,并将Transition的状态(这个值会"滞后于"实际的输入内容)传递给其余的渲染逻辑.(?)
2. 只用一个状态实现其实也行,但你需要用`useDeferredValue`定义,用它定义的值行为类似于上面用Transition包裹的值.它会自动触发非阻塞的重渲染,以"追赶上"最新的输入内容.

## React没把我的状态更新函数视作Transition
把状态更新包裹到Transition里时,确定一下它是在`startTransition`里调用的.
```js
startTransition(() => {
    // 在startTransition里设置状态*during
    setPage('/about')
});
```

你传给`startTransition`的函数必须是同步的.你不能像下面这样调用set functions:
```js
// 错误, 多了个中间层?
startTransition(() => {
    setTimeout(() => {
        setPage('/about')
    }, 1000);
});

// 正确
setTimeout(() => {
    startTransition(() => {
        // 在startTransition里设置状态*during
        setPage('/about')
    });
}, 1000);
```

## React没把我放在`await`之后的状态更新视作Transition
在`startTransition`里用了`await`后,`await`语句后的状态更新是不会被标记为Transitions的.你需要用另外的`startTransition`来重新包裹它.
```js
// 错误
startTransition(async () => {
    await someAsyncFunction();
    setPage('/about');
});

// 正确
startTransition(() => {
    await someAsyncFunction();
    startTransition(() => {
        setPage('/about');
    });
});
```
这是JS语法的限制,React丢失了异步上下文的作用域,等未来`AsyncContext`被引入后,这个问题应该就能解决了.

## 我想在组件外部调用`useTransition`
你**不可以**在组件外调用`useTransition`,因为它是一个**HOOK**.取代方法是直接用独立的`startTransition`函数.它们的行为是相同的,只是少了`isPending`这个标记而已.

## 我传给`startTransition`的函数立即被执行了
以下的代码运行结果是:1,2,3:
```js
console.log(1);
startTransition(() => {
    console.log(2);
    setPage('/about');
});
console.log(3);
```
期望的结果本来就该是1,2,3.你传给`startTransition`的函数没被延迟就执行了.它不像浏览器的`setTimeout`那样,在一段延迟后再执行回调.Actions会被立即执行,而内部的状态更新则会被调度,并标记为Transitions.你可以想象它们的运作方式如下:
```js
// 简化版React看待这些代码的流程
let isInsideTransition = false;

function startTransition(scope){
    isInsideTransition = true;
    scope();
    isInsideTransition = false;
}

function setState(){
    if(isInsideTransition){
        // .. 调度Transition的状态更新
    } else {
        // 调度急迫的状态更新(urgent)
    }
}
```

## Transitions里的状态更新没按顺序执行
如果你在`startTransition`里使用了`async/await`,你的更新结果可能就没按你想要的顺序执行.  
下面的`updateQuantity`模拟发送到服务器的请求,更新购物车里物品的数量.这个函数手动把其余先前的请求都返回了,以模拟网络请求的竞争态.  
试试先点击一次,再在短时间里点击多次.你可能会看到错误的结果:

```jsx [App.jsx]
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";


export default function App(){
    const [quantity, setQuantity] = useState(1);
    const [isPending, startTransition] = useTransition();

    // 把真正正确的状态存储到另外的变量以作比较
    const [clientQuantity, setClientQuantity] = useState(1);

    const  updateQuantity = (newQuantity) => {
        setClientQuantity(newQuantity);
        startTransition(async () => {
            const savedQuantity = await updateQuantity(newQuantity);
            startTransition(() => {
                setQuantity(savedQuantity);
            });
        });
    }
}
```

同时点击多次的话,前一次的结果覆盖后一次是有可能发生的.React目前还无法知晓正确的执行顺序是什么,因为更新的调度是异步安排的,React在异步的边界之间丢失了执行顺序的上下文.  

这也是可预料到的,因为Transition里的Action并不能确保执行顺序.大部分情况下,`useActionState`和`<form> actions`可以在更抽象的层级上解决执行顺序这个问题.而面对高级应用场景,你可能就需要自行实现调度队列及中断逻辑,以解决这个问题了.

--- 

感谢你能看到这里!内容较多,易有错误,欢迎指正!
