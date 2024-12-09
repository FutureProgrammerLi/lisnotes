# useActionState
> 什么情况下会接触到这个hook? 又有什么用? 以下是我的理解:  
> Next Server Actions. 作为表单的action属性时,它就把Server Component和Server Action给"连接"起来了.可能是专门这样设计的,也可能是巧合.因为这个hook也可以在Client Component里使用  
> 以下是官网API介绍的自我翻译,希望借此对这个hook有进一步的认识:  
> [官方地址](https://react.dev/reference/react/useActionState)

`useActionState`是一个可以基于form action操作结果,以更新某些状态的hook.  
```ts
const [state,formAction,isPending] = useActionState(fn,initialState,permalink?);
```

::: tip
React的旧版本中,这个API其实已经存在了,是`ReactDOM`的部分,叫`useFormState`.(就是v19前,你可以从ReactDOM里导入`useFormState`,这两个hook的功能其实是相同的.)
:::

* 介绍
    * `useActionState(fn,initialState,permalink?)`
* 用途
    * 获取form action返回的信息
* 可能遇见的问题
    * 我的form action为什么读取不到表单提交的数据?

## 介绍
### `useActionState(fn,initialState,permalink?)`
你可以在组件顶部调用这个hook,用以获取组件中,由表单提交时,对应的表单数据.  
你需要向这个hook传递一个form action函数,以及表单的初始状态.而hook会返回表单的最新状态,一个用于传给form元素,action属性的,新的action,以及一个表示当前action是否依旧处理中的布尔状态值.表单的最新状态,也会传给你提供的第一个函数,作为函数的第一个参数存在.
```ts
import { useActionState } from 'react';
async function increment(previousState, formData) {
    return previousState + 1;
};
function StateForm(){
    const [state, formAction] = useActionState(increment, 0);
    // 可以思考一下,跟useState有什么区别? 和useReudcer又有什么相似点?
    return (
        <form>
        // <form action={formAction}>
            {state}
            <button formAction={formAction}>Increment</button>
        </form>
    )
}
```
::: details 自己的思考
1. 跟`useState`的区别?  
* 都可以作为组件的状态管理方法.
* `useState`只可以在客户端组件中使用, `useActionState`不受组件类型限制,既可以在服务器组件中使用,也可以在客户端组件中使用
* 事件绑定的方法不一样.  
    `useActionState`针对`<form>`元素,添加的方法是`<form action={formAction}>`, 或者是`<button formAction={formAction}/>`;  
    `useState`比较自由,`setXXX`可以在各种地方而不限于表单元素.

2. 跟`useReducer`的差异呢?
    * 为什么会觉得像呢? 因为参数类型都是`reducer`,`initialState`.只是`useActionState`的第一个参数不叫`reducer`而已,状态的内容也不是`useReducer`那样,而只是表单中对应的数据.状态的最新状态,都是经过"Action"之后返回的,最新的一份独立内容.(reducer => state, fn => state).某种程度上说,`useActionState`是`useReducer`的表单限定款?
    * 不同也有,`useActionState`返回的第三个结果`isPending`,以及可传的第三个参数`permalink`.这个意义上说二者又没有相似了.
:::
(回到官网)  
`state`值是表单最后一次提交时,对应action返回的最新表单内容.如果表单没有被提交过,那`state`的值就是你传给这个hook时的`initialState`的值.  
而如果跟服务器函数搭配使用时,`useActionState`可以在hydration(React渲染时的一个阶段)结束前,获取并展示表单提交后的服务器响应结果.(?)

### 参数解析
* `fn`:表单提交时或按钮被点击时调用的函数.当函数被调用时,它接收的第一个参数是先前表单提交时的状态(如果是被首次调用,那这个参数就是你传进去的`initialState`),之后的参数则是普通表单行为可以接收的参数类型.(一般是`formData`);
* `initialState`:你希望的表单初始值,它可以是任意可被序列化的值.这个参数在表单行为首次被触发之后,它的作用也就消失了.
* **可选的**`permalink`:表单提交后跳转的,表示页面唯一的对应URL字符串.对于那些渐进式增强的带有动态内容的页面而言:如果`fn`是服务器函数,表单在JS包加载前就被提交的话,浏览器会导航到这个特定的URL,而不是当前页面的URL.你最好确保一下,调用了这个hook的表单组件,在这个目标URL页面中也会被渲染.(包括相同的`fn`和`permalink`参数),这样React才能知道如何传递组件状态.当表单被hydrate后,这个参数的作用也消失了.

### 返回值解析
`useActionState`会返回包含以下值的数组:
1. 当前的表单状态.首次渲染时,这个值就是参数`initialState`的值.表单行为被触发后,它的值就会是经过action处理后,返回的新的值了.
2. 一个新的action,你可以将这个action作为form的属性传给form(`<form action={formAction}>`),也可以把它传给form中的button,以formAction的值传给它.  
`<form><button formAction={formAction}/></form>`
3. `isPending`标识符,表示action的进程状态.

### 可能踩雷的点
* 如果你用的是支持React Server Component功能的框架的话,`useActionState`会在JS代码在客户端执行之前,就使表单组件变得可交互.而如果不是搭配服务器组件使用,那它跟组件的本地状态并无二样.
* `useActionState`的第一个参数函数,第一个参数是一个特别的参数,表示初始表单状态或先前表单状态,(就是`fn(previousState,formData)`这里的`previousState`).**这个就是跟原生form action区别的,最为根本的`useActionState`的作用.**

## 用途
### 获取并利用表单行为返回的表单数据
组件顶层调用`useActionState`,你可以获取到表单上次提交时由action返回的对应表单数据.
```ts
import {useActionState} from 'react';
import { action } from './actions.js'

function MyComponent(){
    const [state, formAction] = useActionState(action,null);
    //...
    return (
        <form action={formAction}>
        {/**... */}
        </form>
    );
}
```

`useActionState`会返回包含以下值的数组:
1. 表单的当前状态,这个值的初始值就是你提供的`initialState`.表单被提交后,这个值就会变成由对应action返回的值.
2. 一个新的`action`,你可以把这个值传给表单的`action`属性.
3. 一个进程标识状态,用以表示表单行为处理的进度.

表单被提交时,你提供的`action`函数就会被调用.函数的返回值,则作为最新的表单状态值.  
你提供的`action`函数也会接收一个新的第一个参数,也就是变更前的表单"当前状态".表单初次被提交时,这个参数的值就是你提供的参数`initialState`,而之后的表单提交,这个参数的值都会是上一次action返回的值.其它的参数都会像没用过`useActionState`一样,维持原状.
```ts
function action(currentState, formData){
    // ... 
    return 'next state';
};
// initialState *action => currentState *action => previousState
```

## 例子1:显示表单提交后的信息
如果要显示由服务器函数返回的,像错误信息或提示内容,你可以把这个action包裹到`useActionState`.
::: code-group
```js [App.js]
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
      {/* 牛的,直接用返回结果message来显示... */}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```
```js [actions.js]
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
```
:::

## 例子2:表单提交后展示结构化信息
服务器函数返回的值可以是任意可被序列化的值.比如把表示action操作是否成功的标识值,错误信息,或是更新后的信息,包裹到一个对象中.
::: code-group
```ts [App.ts]
import { useActionState, useState } from 'react';
import { addToCart } from './actions.js';

function AddToCartForm({itemID, itemTitle}){
    const [formState, formAction] = useActionState(addToCart,{});
    return (
        <form action={formAction}>
            <h2>{itemTitle}</h2>
            <input type="hidden" name="itemID" value={itemID}/>
            <button type="submit">Add to Cart</button>
            {
                formState?.success &&
                <div className="toast">
                    Added to cart! Your cart now has {formState.cartSize} items.
                </div>
            }
            {
                formState?.success === false &&
                <div className="error">
                    Failed to add to cart: {formState.message}
                </div>
            }
    )
}
export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js [actions.js]
"use server";

export async function addToCart(prevState,queryData) {
    const itemID = queryData.get('itemID');
    if(itemID === '1'){
        return {
            success:true,
            cartSize:12,
        };
    }else{
        return {
            success:false,
            message:'The item is sold out',
        }
    }
}
```
:::

## 可能遇到的问题
### 为什么我的action读取不到表单提交时的数据
当你把普通的action包裹到`useActionState`时,**这个action会有一个新的第一个参数**.表单提交的数据因此会**在第二个参数中**而不是第一个参数.这个新的第一个参数表示的是表单的当前状态.
```js
function action(currentState, formData){
    //...
}
```
---
感谢你能看到这里!