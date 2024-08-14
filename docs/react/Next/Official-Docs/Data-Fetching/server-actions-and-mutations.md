# 服务器行为及变化

服务器行为(Server Actions)是在服务器上执行的异步函数.它们可以用来处理来自服务器端和客户端的表格提交及数据处理.  
::: tip
**视频:** [一个用Server Actions处理表单及变化的Youtube视频(时长10分钟)](https://youtu.be/dDpZfOQBMaU?si=cJZHlUu_jFhCzHUg)
:::

## 使用方法
服务器行为可以用[`use server`](https://react.dev/reference/react/use-server)这条指令来定义.  
你既可以在异步函数内的顶部用`use server`,标记这个函数是服务器行为;也可以在文件内容顶部用这条指令,表明该文件所有导出的内容都是服务器行为.

### 服务器组件
服务器组件可以在两个层面标记服务器行为:函数行内和模块层级.(对应就是单独函数和整个文件的所有函数),标记方法就是`use server`这条指令.  
要在行内标记服务器行为,则在函数体顶部,加上`use server`指令:
```tsx
// app/page.tsx
// 服务器组件
export default function Page(){
    async function create(){
        'use server'
        //...
    }

    return (/*...*/)
}

```  

### 客户端组件
客户端组件**只可以在模块层面**定义服务器行为.  
要在客户端组件调用服务器行为的话,先创建一个新文件,并在文件顶部写上`use server`指令.这个文件内的所有函数都将被标记为服务器行为,可公客户端组件和服务器端组件重用:
```tsx
// app/actions.ts
'use server'

export async function create(){
    // ...
}

```

```tsx
// app/ui/button.tsx

import { create } from '@/app/actions'

export function Button(){
    return (
        // ...
    )
}
``` 

你甚至可以将服务器行为作为属性,传给客户端组件
```jsx
<ClientComponent updateItem={updateItem} />
```

```jsx
'use client'
export default function ClientComponent({updateItem}) {
    return <form action={updateItem}> {/**...*/}</form>
}
```

## 行为
- 服务器行为可以被`<form>`元素的`action`属性调用
    - 服务器组件默认支持渐进式增强(?progressive enhancement),也就是说尽管浏览器的JS没加载完全或是被禁用了,相应的表单还是会被提交(?)
    - 在客户端组件内,调用了服务器行为的表单会优于客户端"注水"(client hydration),在JS没加载时就将提交任务列入队伍了.
    - 注水完成后,浏览器不会刷新表单的提交.
- 服务器行为不限于`<form>`元素,它还可以在其它的事件处理器,`useEffect`,第三方库或其它表单元素中被调用,比如`<button>`.
- 服务器行为与Next的缓存和重校验模块相整合.当一个行为被触发时,Next能在一次请求来回中,同时返回更新好的界面和最新的数据.
- 行为内部用的是`POST`方法,只有这种HTTP方式可以调用服务器行为
- Server Actions的参数和返回值必须由React序列化(?).[React文档关于可序列化参数和值的内容]https://react.dev/reference/react/use-server#serializable-parameters-and-return-values)
- 服务器行为本质是函数,可以在你应用的任意地方重用
- 服务器行为的运行时环境,与页面或布局的环境相同,继承于二者之一.
- 服务器行为的路由分块设置与页面或布局的配置相同,包括像`maxDuration`这样的字段设置.

## 例子
### 表单
React扩展了原生的HTML`<form>`元素,从而让其可以通过`action`属性触发服务器行为.  
当服务器行为是在表单中被触发的时候,这个行为会自动接收一个[`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData)对象作为参数.你不必为这些表单项状态设置`useState`来管理,直接用[原生的`FormData`的方法](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods)就能读取到了.

```tsx
// app/invoices/page.tsx
export default function Page() {
    async function createInvoice(formData:FormData){
        'use server'

        const rawFormData = {
            customId: formData.get('customId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
        }
        // 数据处理
        // 重校验或缓存设置 ...
    }

    return <form action={createInvoice}>...</form>
}
```

::: tip
- 另外的例子:[配合加载和错误状态的表单(github例子)](https://github.com/vercel/next.js/tree/canary/examples/next-forms)
- 如果你的表单有多个表单项(fields),你就可能需要用`entries`方法以及JS原生的`Object.fromEntries()`方法了.比如说:`const rawFormData = Object.fromEntries(formData)`.值得注意的是`formData`还会包括一些额外的`$ACTION_`属性(?)
- [更多关于React `<form>`元素的内容](https://react.dev/reference/react-dom/components/form#handle-form-submission-with-a-server-action)
:::

#### 传递额外的参数
你可以用Javascript的`bind`方法,为服务器行为添加额外的参数.
```ts{6}
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }: { userId: string} ){
    const updateUserWithId = updateUser.bind(null,userId);  // ?? 也,太麻烦了点

    return (
        <form action={updateUserWithId}> 
            <input type="text" name="name"/>
            <button type="submit">Update User Name</button>
        </form>
    )
}

``` 

这样服务器行为就会接收除了表单数据外,`userId`这个参数了.

```js
// app/action.js
'use server'
export async function updateUser(userId, formData){
    // ...
}

```

::: tip
- 另一种可选的为action传递参数的做法是,在表单内加一个隐藏的输入项.(比如`<input type="hidden" name="userId" value={userId} />`)不过这样添加的值会被作为HTML部分渲染,并且内容不会被编码(encoded).
- `.bind`这种方法在服务器组件和客户端组件上都适用.它同样支持渐进式增强.(? progressive enhancement,还是没想到前后联系?)
:::

#### 即将更新的状态
当表单正在被提交时,你可以用`useFormStatus`这个hook来展示知晓表单提交的状态变化.
- `useFormStatus`返回某个特定表单的状态,因此,它**必须作为`<form>`元素的一个子属性(?a child?)**.
- 因为`useFormStatus`是React的一个钩子函数,所以它只能在客户端组件上被调用.

```tsx
// app/submit-button.tsx
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton(){
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending}>
            Add
        </button>
    )
}

```

这样任意表单内都能调用`<SubmitButton/>`这个组件了.

```tsx
// app/page.tsx
import { SubmitButton } from '@/app/submit-button'
import { createItem } from '@/app/actions'

export default async function Home(){
    return (
        <form action={createItem}>
            <input type="text" name="field-name" />
            <SubmitButton />
        </form>
    )
}
```

#### 服务器端校验及错误处理
我们建议,使用HTML元素自带的`required`或`type='email'`这些自带的校验项,在客户端就实现一些简单的校验.  
而另外的更加严格的服务器端校验,则可以使用像[zod](https://zod.dev/)这样的三方库,在数据处理前对数据进行更精确的校验.

```ts
// app/actions.ts
'use server'
import { z } from 'zod'

const schema = z.object({
    email: z.string({
        invalid_type_error: 'Invalid Email',  //??
    }),
});

export default async function createUser(formData: FormData){
    const validatedFields = schema.safeParse({
        email: formData.get('email')
    });

    //如果校验不通过则提前结束处理
    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors, //???
        }
    }

    // 进一步处理数据
}

```

当所有的表单项都通过服务器端校验后,你就可以在行为中返回一个可序列化的对象,并用`useFormStatus`向用户展示相关处理信息了.
- 把行为传递给`useFormStatus`后,这个行为的第一个参数就变成了新的`prevState`或`initialState`了.(?)
- `useFormStatus`是React hook的一个,因此必须只在客户端组件上使用.
```ts
// app/actions.ts
'use server'
export async function createUser(prevState: any, formData: FormData){
    //... 
    return {
        message: 'Please enter a valid email'
    }
}

```

之后你可以把行为传递给`useFormState`,并用上它返回的`state`值,作为错误信息展示:
```tsx
// app/ui/signup.tsx
'use client'
import { useFormState } from 'react-dom'
import { createUser } from '@/app/actions'

const initialState = {
    message: '',
}

export function Signup(){
    const [state, formAction] = useFormState(createUser, initialState);

    return (
        <form action={formAction}>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" required />
            {/* {} */}
            <p aria-live="polite" className="sr-only">
                {state?.message}
            </p>
            <button>Sign up</button>
        </form>
    )
}
```

::: tip
在对提交数据进行下一处理前,你应确保提交用户已经是授权了的,是有权调用这个行为的.[关于授权和认证的内容](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization)
:::