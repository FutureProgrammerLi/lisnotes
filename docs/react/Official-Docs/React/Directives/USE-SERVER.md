# 'use server'
> [原文地址](https://react.dev/reference/rsc/use-server)

`'use server'`可以将由客户端代码调用的函数,标记为服务器函数.  

## 目录
* [指引](#指引)
    * [`'use server'`](#use-server)
    * [安全考虑](#安全考虑)
    * [可序列化参数及返回值](#可序列化参数及返回值)

* [用法](#用法)
    * [表单里的服务器函数](#表单里的服务器函数)
    * [在`<form>`元素外调用服务器函数](#在-form-元素外调用服务器函数)

## 指引
### `'use server'`
在异步函数体的顶部加上`'use server'`,这个函数就会被客户端标记为是可调用的.  
我们称这些函数为服务器函数.  
```tsx
async function addToCart(data){
    'use server';

    //...
}
```
当客户端调用服务器函数时,客户端实质上是带着一些接收到的序列化参数,向服务器发送网络请求.如果服务器函数具有返回值,那么服务器就会将返回值序列化后发送回给客户端.  

你除了可以使用`'use server'`单独标记某些函数外,你还可以将指令添加到文件的最顶部,**将文件内所有导出的内容都标记为服务器函数**,其中也包括这个文件所导入的客户端代码.(?)  

## 值得注意的点
* `'use server'`必须放置在函数体顶部或模块顶部;先于任何从其它文件导入到本文件的内容(唯有注释可先于这条指令出现,如果你也不想有什么差错的话.)指令也必须用单引号或双引号括起来,反引号backticks也不行.
* `'use server'`只可用到服务器文件中.(?)服务器函数的处理结果可以通过props传递给客户端组件.[这里可以查看可支持的可序列化类型](https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values)(因为结果需要通过网络传递,所以需要序列化,也就要了解哪些类型是可以被序列化的了)
* 客户端代码如果要导入服务器函数,那么指令就必须在整个模块的顶部.  
* 由于底层的网络调用总是异步的,`'use server'`也只能用在异步函数上.
* **不要信任任何传递给服务器函数的参数,** 利用它们实现数据修改时记得提前做好授权和验证.本文后续有[关于安全性的内容](#安全考虑)讲解.
* 我们应要在[Transition](https://react.dev/reference/react/useTransition)里调用服务器函数.通过`<form action>`或`formAction`传递的服务器函数是自动利用transition调用的.
* 服务器函数本身就是为了更新服务器状态而诞生的;我们不建议利用它们来获取数据.因此,具备服务器函数功能的框架基本只能一次处理一个action,而没有将返回值缓存的方法.  

## 安全考虑
传递给服务器函数的参数**都是由客户端控制的.** 为了安全着想,绝对不要信任这些参数,一定要有适当校验并将参数转义.(escape)  
任意服务器函数内,都要对调用者的权限进行验证,确保其是否有权利调用这个函数.  

::: warning
为防止服务器函数将敏感信息发送给客户端,我们提供了一些实验性的,用于数据混淆(taint)的APIs.用它们可以避免将一些唯一值和对象内容发送到客户端上.
* [`experimental_taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue)
* [`experimental_taintObjectReference`](https://react.dev/reference/react/experimental_taintObjectReference)
:::

## 可序列化参数及返回值
由于客户端代码是通过网络请求来调用服务器函数的,所以传递给服务器函数的参数都需要是可被序列化的(serializable).    
以下是这些类型的列举:
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
* 事件处理器里的事件

## 用法
### 表单里的服务器函数
服务器函数最常见的用法就是用以变更数据.在浏览器里,用户使用HTML form表单元素提交数据变更是最为传统的一种手段.  
而React,利用服务器组件,提供了服务器函数作为表单Action的一类支持(first-class support?).  

以下是用于用户提交用户名的一个表单:
```js
// App.js

async function requestUsername(formData){
    'use server';
    const username = formData.get('username');
    // ...
}

export default function App(){
    return (
        <form action={requestUsername}>
            <input type="text" name='username' />
            <button type='submit'>Request</button>
        </form>
    )
}
```

例子里传给form action属性的`requestUsername`就是服务器函数.当用户点击提交按钮时,React就会通过网络请求,请求调用`requestUsername`函数.当用表单触发服务器函数时,React会把`FormData`作为函数的第一个参数,以方便开发者获得用户输入的内容.  

通过向form的`action`属性传递服务器函数,React还能渐进式增强表单功能.([progressive enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)) 也就是说表单可以在JS包加载前就被提交.

#### 处理表单的返回值
在上面的用户名表单中,我们有可能获取不到username的值.这时`requestUsername`就需要告诉我们函数执行成功与否.  
而要根据服务器函数的处理结果来更新客户端的界面的话,我们就要用到`useActionState`,增强表单功能了.  
::: code-group
```js [requestUsername.js]

'use server';

export async function requestUsername(formData){
    const username = formData.get('username');
    if(canRequest(username)){
        // ...
        return 'successful'
    }
    return 'failed'
}
```

```js {2,4,8} [UsernameForm.js]

'use client'; 

import { useActionState } from 'react';
import { requestUsername } from './requestUsername';

function UserNameForm(){
    const [state, formAction] = useActionState(requestUsername, null, 'n/a');
    return (
        <>
            <form action={formAction}>
                <input type="text" name='username' />
                <button type='submit'>Request</button>
            </form>
            <p>Last submission request returned: {state}</p>
        </>
    )
}
```
:::

**跟其它hooks一样,`useActionState`也只能在客户端代码中被调用.**

### 在`<form>`元素外调用服务器函数
服务器函数可以说是暴露的服务器接口,它们可以在客户端代码中被任意调用.  

而如果要在表单之外使用服务器函数的话,建议在[Transition](https://react.dev/reference/react/useTransition)里调用.这样你就可以展示加载状态,实现积极状态更新,更好地处理错误了.再提一次,表单调用的服务器函数是自动包裹在transition里调用的.
:::code-group
```jsx [LikeButton.js]
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
    const [isPending, startTransition] = useTransition();
    const [likeCount, setLikeCount] = useState(0);

    const onClick = () => {
        startTransition(async () => {
            const currentCount = await incrementLike();
            setLikeCount(currentCount);
        });
    };

    return (
        <>
            <p>Total likes: {likeCount}</p>
            <button onClick={onClick} disabled={isPending}>Like</button>
        </>
    )
}
```

```js [actions.js]

let likeCount = 0;

export async function incrementLike(){
    likeCount += 1;
    return likeCount;
}
```
:::
为了读取到服务器函数的返回值,你需要`await`它返回来的Promise.

---
感谢你能看到这里!

