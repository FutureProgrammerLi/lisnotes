# startTransition
> 这个和[`use`](./use.md)一样,也是个API.  
> 对这个感兴趣是因为`useActionState`中提到,它返回的action用到表单时,会自动包裹到Transition中.  
> [`'use server'`指令介绍文](#在-form-元素外调用服务器函数)也提到,在表单外调用服务器函数时也要把该函数包裹到Transition中.遂有此文    
> [官方原文](https://react.dev/reference/react/startTransition)   
> 什么是Transition? `useTransition`又要如何使用?

`startTransition`可以让你在后台渲染部分UI界面.  
```js
startTransition(action);
// 番外:
// use(Promise) || use(Context)
```
* [指引](#指引)
    * [`startTransition(action)`](#starttransition-action)
* [用法](#用法)
    * [将状态的更新标记为不会阻塞的Transition](#把状态的更新标记为非阻塞transition)  
    (转变? Transition又是什么?该如何译为中文?官方中文翻译也没翻出来) 

## 指引
## `startTransition(action)`
`startTransition`可以让你把一些状态的更新标记为Transition.  
```jsx
import { startTransition } from 'react';

function TabContainer(){
    const [tab, setTab] = useState('about');

    function selectTab(nextTab){
        startTransition(() => {
            setTab(nextTab);
        });
    }
}
```

## 参数
* `action`: 一个通过调用[一个或多个`set`](https://react.dev/reference/react/useState#setstate)以更新状态的函数.  
(这里指`useState`返回的第二个参数:`const [state, setState] = useState(initialState);`中的`setState`)  
React会立即调用不带参数的`action`,并对作为Transition的`action`内部的状态更新进行标记,把它们调度为同步更新(scheduled synchronously).  
所有`action`内的await异步调用,都会被包裹在transition中.不过以目前的实现,我们还需要把`await`后的`set`函数包裹到另外的`startTransition`中.(?[下面代码](https://react.dev/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)是说明这个问题的,并非原文自带.)  
标记为Transition的状态更新,是[不会阻塞的](https://react.dev/reference/react/startTransition#marking-a-state-update-as-a-non-blocking-transition),[不会展示任何不想要的加载指示器的](https://react.dev/reference/react/useTransition#preventing-unwanted-loading-indicators).
```js
startTransition(async () => {
    await someAsyncFunction();
    // 以下的set function不会被标记为transition,你需要用额外的startTransition再包裹一次
    // ❌
    setPage('/about');
});
```  
```js
startTransition(() => {
    await someAsyncFunction();

    // ✅
    startTransition(() => {
        setPage('/about');
    });
});
```
会出现以上问题,是因为Javascript的限制: React丢失了异步上下文中的作用域.  
未来如果[`AsyncContext`](https://github.com/tc39/proposal-async-context)新功能实现了,我们就不再需要再包裹这一层了.

## 返回值
`startTransition`不会返回任何值.

## 注意事项
* `startTransition`不提供追踪Transition状态的方法.如果需要展示Transition的执行状态指示器,你需要使用[`useTransition`](https://react.dev/reference/react/useTransition)替代.
* 你需要确保,将更新函数包裹到Transition之前,你是在这个更新函数的作用域之内的.如果你需要通过启用Transition,以响应一些prop或自定义hooks的返回值时,试试用`useDeferredValue`替代.
* 传给`startTransition`函数会被立即执行,对所有的状态更新进行标记,以Transitions的形式执行.如果你要在`setTimeout`里实现状态更新的话,这些更新不会被标记为Transition.
* 你必须把在异步函数之后的所有状态更新,都用另外的`startTransition`再包裹起来,把它们标记为Transitions.这个问题我们在上面也提过了,会在未来得到解决.
* 被标记为Transition的状态更新会被其它的状态更新所终端.比如你要在一个Transition里更新某个图表组件,在图标重渲染的过程中应用接收了用户的输入内容,React此时就会先优先处理用户的输入,之后再重启图表组件的渲染工作.
* Transition内的更新函数不能用于控制文本输入.
* 如果同时有多个进行中的Transitions,React现在的处理方式是会同时批处理.这种处理方式之后可能会被变更.  

## 用法
## 把状态的更新标记为非阻塞Transition
你可以把状态的更新,用`startTransition`包裹起来,以标记为非阻塞的Transition.  
```js
import { startTransition } from 'react';

function TabContainer(){
    const [tab, setTab] = useState('about');

    function selectTab(nextTab){
        startTransition(() => {
            setTab(nextTab);
        });
    }
}
```
哪怕用户响应速度较为缓慢,Transitions的应用也可以确保界面的即时更新.  
用了Transition,你的界面就可以在重渲染之时,也保持响应性.比如当用户点击一个标签,然后突然改变主意,又点了另外的标签,此时这种操作是可行的,用户不必等待第一次点击导致的重渲染完成,也可以看到第二次点击的标签.

::: tip
`startTransition`跟`useTransition`十分相似,只是前者不提供`isPending`标签,以追踪Transition的执行状态.你可以在不适用`useTransition`的情况下使用`startTransition`.比如组件定义之外的某些数据三方库(data library).  

[关于Transitions及`useTransition`](https://react.dev/reference/react/useTransition)
:::
