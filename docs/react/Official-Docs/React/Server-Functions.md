 # 服务器函数
 > [原文地址](https://react.dev/reference/rsc/server-functions)

::: tips
### React服务器组件
服务器函数适用于React服务器组件.  

2024年9月之前,我们都是直接把Server Actions跟服务器函数直接等价的.如果一个服务器函数传递给`action`这个prop,或在action里面被调用,那么我们就把它称作是Server Action.  
不过并非所有的服务器函数都是Server Actions的.本文档中的命名已经更新,反应服务器函数可用于多种不同的目的,而不限是Server Actions.  
:::

**服务器函数可以让客户端组件调用在服务器上执行的异步函数.(call async functions on the server)**

当你使用`"use server"`这个指令声明服务器函数时,你的框架会自动为这个函数创建引用(reference),并且把这个引用传递给客户端组件.当这些函数在客户端上被调用时,React会向服务器发送请求,执行这个函数,并将结果返回.  

服务器函数可以在服务器组件中被创建,以props形式传递给客户端组件.或者它们也可以直接被导入到客户端组件中并调用.  

## 用法
## 在服务器组件中创建服务器函数
服务器组件可以通过`"use server"`指令定义服务器函数:
```jsx
// 服务器组件
import Button from './Button';

function EmptyNote(){
    async function createNoteAction(){
        // 服务器函数
        "use server";
        await db.notes.create();
    }
    return <Button onClick={createNoteAction} />
}
```

当React执行`EmptyNote`这个服务器函数时,会创建一个指向`createNoteAction`这个函数的引用,并把这个引用传递给客户端组件`Button`.当按钮被点击时,React将带着函数的引用,向服务器发送执行`createNoteAction`这个函数的请求:

```jsx
"use client"
export default function Button({onClick}){
    console.log(onClick);
    // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
    // 这个symbol就是发送给服务器端的,函数的引用位置.
    return <button onClick={onClick}>Create Empty Note</button>
}
```
[更多关于`"use server"`指令的文档细节](https://react.dev/reference/rsc/use-server)

## 客户端组件内导入服务器函数
客户端组件可以从使用了`"use server"`指令定义了的文件内导入服务器函数.

```jsx
"use server"
export async function createNote(){
    await db.notes.create();
}
```
当打包器构建`EmptyNote`这个客户端组件时,它会在包内创建一个指向`createNote`的引用.当`button`被点击时,React会带着这个引用,向服务器发送执行`createNote`这个函数的请求.

```jsx
"use client"
import {createNote} from "./actions";

function EmptyNote(){
    console.log(createNote);
    // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
    return <button onClick={createNote} />
}
```

[更多关于`"use server"`指令的文档细节](https://react.dev/reference/rsc/use-server)

## Server Functions with Actions
(标题没翻译的原因是,我不认为将Actions译为"行为"是个恰当的翻译,虽然下文不得不采用这个翻译)  
服务器函数可以通过Actions的方法,在客户端上被调用:

```jsx
"use server"
export async function updateName(name){
    if(!name) return {error: "Name is required"};
    await db.users.update(name);
}
```

```jsx
import {updateName} from "./actions";

function UpdateName(){
    const [name, setName] = useState("");
    const [error, setError] = useState(null);

    const [isPending, startTransition] = useTransition();

    const submitAction = async () => {
        startTransition(async () => {
            const {error} = await updateName(name);
            if(!error){
                setError(error);
            }else{
                setName('');
            }
        });
    }

    return (
        <form action={submitAction}>
            <input type="text" name="name" disabled={isPending} />
            {state.error && <span>Failed: {state.error}</span>}
        </form>
    )
}
```

这样你就可以通过把服务器组件包裹到Action里,从而在客户端上读取到`isPending`这个状态了.  

更多相关内容,可以看看: [`<form>元素外调用服务器函数`](https://react.dev/reference/rsc/use-server#calling-a-server-function-outside-of-form)

## 服务器函数与表单行为
服务器函数在v19版本后可以配合新的Form特性一同使用.  

你可以把服务器函数传递给表单.它会自动把表单提交到服务器上:
```jsx
"use client"

import {updateName} from "./actions";

function UpdateName(){
    return (
        <form action={updateName}>
            <input type="text" name="name" />
        </form>
    )
}
```
表单成功提交后,React会自动重置表单内容.你可以进而使用`useActionState`,读取表单提交状态,上次的响应内容,或实现渐进式增强(progressive enhancement).  

[更多关于表单里的服务器函数内容](https://react.dev/reference/rsc/use-server#server-functions-in-forms)

## 配合`useActionState`的服务器函数
你可以用`useActionState`调用服务器函数.一般情况下,我们用这个hook读取到action具体执行的状态,以及上次返回的响应内容就够了.

```jsx
"use client"

import {updateName} from "./actions";
import {useActionState} from "react";

function UpdateName(){
    const [state, formAction, isPending] = useActionState(updateName, {error:null});

    return (
        <form action={formAction}>
            <input type="text" name="name" disabled={isPending} />
            {state.error && <span>Failed: {state.error}</span>}
        </form>
    )
}
```

这样搭配使用的话,React也是可以注水结束之前自动重置表单输入的内容的.也就是说用户可以在应用完成注水前就可实现交互了.  

[更多关于`useActionState`的文档介绍](https://react.dev/reference/react/useActionState)

## 利用`useActionState`实现渐进式增强
服务器函数可以通过`useActionState`的第三个参数,实现渐进式增强.
```jsx
"use client"

import { updateName } from "./actions";

function UpdateName(){
    const [,submitAction] = useActionState(updateName,null, `/name/update`);

    return (
        <form action={submitAction}>
            {/* .... */}
        </form>
    )
}
```

当你为`useActionState`提供了第三个参数时(这个参数叫`permalink`),React会在表单提交后,JS包加载前,重定向到这个URL去.  

[更多关于`useActionState`的文档介绍](https://react.dev/reference/react/useActionState)