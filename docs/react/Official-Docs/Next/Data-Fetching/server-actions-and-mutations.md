# 服务器行为及变化

服务器行为(Server Actions)是在服务器上执行的异步函数.它们可以在服务器组件和客户端组件中被调用,以处理表格提交操作及数据处理.  
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

### 传递额外的参数
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

### 嵌套表单元素
你也可以在`<form>`元素内的一些其它元素触发服务器行为,像`<button>`,`<input type="submit">`,`<input type="image">`等等.这些元素都接受`formAction`属性或事件处理器.  
对于一个表单内需要触发多个服务器行为的场景下比较有用.比如说一个表单内,你既要一个`<button>`来存为草稿,又要另一个`<button>`来发表表单内容.[更多关于React `<form>`的文档知识](https://react.dev/reference/react-dom/components/form#handling-multiple-submission-types)

### 编程式表单提交
你可以用`requestSubmit()`方法,编程式地触发表单提交.比如用户用`⌘ + Enter`快捷键提交表单,你可以用`onKeyDown`事件处理器来捕获并触发表单提交:
```tsx
// app/entry.tsx
'use client'
export function Entry(){
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(
            (e.ctrlKey || e.metaKey) && 
            (e.key === 'Enter' || e.key === 'NumpadEnter')
        ){
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    }

      return (
        <div>
            <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
        </div>
  )
}

```

这样就可以快捷键触发位置最近的`<form>`表单元素(nearest form ancestor?),调用服务器行为来处理了.

### 服务器端表单校验
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

当所有的表单项都通过服务器端校验后,你就可以在行为中返回一个可序列化的对象,并用`useActionState`向用户展示相关处理信息了.
- 把行为(Action)传递给`useActionState`后,这个行为的第一个参数就变成了新的`prevState`或`initialState`了.(?)
- `useActionState`是一个React hook,因此必须只在客户端组件上使用.
```ts
// app/actions.ts
'use server'
import { redirect } from 'next/nevigation'
export async function createUser(prevState: any, formData: FormData){
    const res = await fetch('https//...');
    const json = await res.json();
    if(!res.ok){
        return { message: 'Please enter a valid email' }
    }
    redirect('/dashboard');
}

```

之后你可以把行为传递给`useActionState`,并用上它返回的`state`值,作为错误信息展示:
```tsx {11,18-20}
// app/ui/signup.tsx
'use client'
import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
    message: '',
}

export function Signup(){
    const [state, formAction] = useActionState(createUser, initialState);

    return (
        <form action={formAction}>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" required />
            {/* ... */}
            <p aria-live="polite" className="sr-only">
                {state?.message}
            </p>
            <button>Sign up</button>
        </form>
    )
}
```

::: tip
- 在对提交数据进行下一处理前,你应确保提交用户已经是授权了的,是有权调用这个行为的.[关于授权和认证的内容](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization)
- 在之前的React版本中,这个API其实是ReactDOM的其中之一,之前叫`useFormState`.
:::

### 即将更新的状态
`useActiontState`返回值包含一个`pending`状态,用以告知行为执行时,所进行的状态,并以此展示加载指示.

```tsx
// app/submit-button.tsx
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
    message:'',
}

export function Signup(){
    const [state, formAction, pending] = useActionState(createUser,initialState);
    return (
        <form action={formAction}>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" required />
            {/* ... */}
            <p aria-live="polite" className="sr-only">
                {state?.message}
            </p>
            <button aria-disabled={pending} type="submit">
                {pending ? 'Submitting...' : 'Sign up'}
            </button>
        </form>
    )
}

```
::: tip
你也可以用`useFormStatus` hook,为特定的表单展示一个提交进度的状态显示.
:::

### 积极更新
你可以用React提供的`useOptimistic` hook,在服务器行为执行结束前就积极更新部分UI,而不用等待这个行为的回复再去更新UI.  
```tsx
// app/page.tsx
'use client'
import { useOptimistic } from 'react'
import { send } from './actions'

type Message = {
    message : string
}

export function Thread({messages}:{messages: Message[]}){
    const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[],string>(
        messages,(state,newMessage) => [...state,{ message: newMessage }]
        );
    const formAction = async (formData) => {
        const message = formData.get('message') as string
        addOptimisticMessage(message);
        await send(message);
    }
     
    return (
        <div>
            {optimisticMessages.map((m, i) => (
                <div key={i}>{m.message}</div>
            ))}
            <form action={formAction}>
                <input type="text" name="message" />
                <button type="submit">Send</button>
            </form>
        </div>
    )
} 

```

### 事件处理器
虽然服务器行为通常是被`<form>`表单元素所触发,但其实它也可以在像`onClick`这些事件处理器中被触发.  
举例是点击后喜欢数+1(increment a like count)
```tsx
// app/like-button.tsx
'use client'
import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({initialLikes}:{
    initialLikes:number
}) {
    const [likes,setLikes] = useState(initialLikes);

    return (
        <>
            <p>Total Likes: {likes}</p>
            <button
                onClick={async () => {
                    const updatedLikes = await incrementLike();
                    setLikes(updatedLikes);
                }}
            >
                Like
            </button>
        </>
    )
}

```

你也可以为表单元素添加事件处理器.比如在某个表单项改变时保存表单内容,添加`onChange`事件:
```tsx
// app/ui/edit-post.tsx
'use client'
import { publishPost, saveDraft } from './actions'

export default function EditPost() {
    return (
        <form action={publishPost}>
            <textarea
                name="content"
                onChange={async (e)=> {await saveDraft(e.target.value)}}
            />
            <button type="submit">Publish</button>
        </form>         
    )
}

```
对于以上这种可能短时间触发多个事件处理器的场景,我们建议使用防抖(debounce)的措施避免短时多次触发服务器行为.

### `useEffect`
你可以用`useEffect` hook,在组件挂载时或是依赖发生变化时触发服务器行为.这对于一些依赖于全局事件的变化或需要被自动触发的场景比较有用.  
比如监听到`onKeyDown`事件,或是用`observer`监听无限下滑事件,又或是挂载某个组件来更新视图计数(?update a view count):

```tsx
// app/view-count.tsx
'use client'
import { incrementViews } from './actions'
import { useState,useEffect } from 'react'

export default function ViewCount({initialViews}: {initialViews: number}) {
    const [views, setViews] = useState(initialViews);

    useEffect(() => {
        const updateViews = async () => {
            const updatedViews = await incrementViews();
            setViews(updateViews);
        }
        
        updateViews()
    },[])

    return <p>Total Views:{views}</p>
}

```

记得[正确使用`useEffect`](https://react.dev/reference/react/useEffect#caveats)

### 错误处理
当某个页面抛出错误后,这个错误会在客户端上被最近的`error.js`或`<Suspense>`边界所捕获.我们建议您用`try/catch`语句返回错误并在对应UI中处理错误.  
比如,服务器行为可能以返回一条错误信息的方法,表示创建新事项时遇到了错误:
```tsx
// app/actions.tsx
'use server'

export async function createToDo(prevState: any, formData: FormData){
    try {
        // 数据处理
    } catch (e) {
        throw new Error('Failed to create task')     
    }
}

```

::: tip
- 除了抛出错误,你还可以返回一个对象,交由`useActionState`进行下一步处理.[关于服务器校验和错误处理的内容](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-form-validation)
:::

### 重校验数据
你可以在服务器行为中,用`revalidatePath` API,重校验Next内部的缓存.
```ts
// app/actions.ts
'use server'
import { revalidatePath } from 'next/cache'

export async function createPost(){
    try {
        // ...
    } catch (error) {
        // ...
    }

    revalidatePath('/posts')
}
```

或者用`revalidateTag`重校验某些特定的请求:
```ts
// app/actions.ts
'use server'
import { revalidateTag } from 'next/cache'

export async function createPost(){
    try {
        // ...  
    } catch (error) {
        // ...
    }

    revalidateTag('posts')
}

```

### 重定向
你也可以在服务器行为处理完后,将用户重定向到另外的路由去,用的是`redirect`这个API.  
注意这个API需要在`try/catch`块之外被调用:
```ts
// app/actions.ts
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function createPost(id: string){
    try {
        // ...
    } catch (error) {
        // ...       
    }
    
    revalidateTag('posts');  // 更新缓存内容
    redirect(`/posts/${id}`);  // 重定向到新的博客页面去
}

```

### Cookies
你可以用[`cookies`函数](https://nextjs.org/docs/app/api-reference/functions/cookies),在服务器行为中,对cookies进行`get`,`set`,`delete`操作:
```ts
// app/actions.ts
'use server'
import { cookies } from 'next/headers'

export async function exampleAction(){
    // 读取cookie
    const value = cookies().get('name')?.value; 

    // 设置cookie
    cookies().set('name','Delba');

    // 删除cookies
    cookies().delete('name');
}

```

[其它在服务器行为中删除cookie的方法和例子](https://nextjs.org/docs/app/api-reference/functions/cookies#deleting-cookies)  
(1. `delete` 2. 设置为空 `set('name','')` 3. 设置最大寿命为0,set的第三个参数, `set(name,value,{maxAge:0})` )

## 安全性
### 认证与授权
你应该将服务器行为跟其它公开的API终端一样,同等看待,确保只有已授权的用户才能触发某个行为.  
比如说:
```ts
// app/actions.ts
'use server'
import { auth } from './lib'

export function addItem(){
    const { user } = auth();
    if(!user){
        throw new Error('You must be signed in to perform this action')
    }

    // ...
}
``` 

### 闭包与加密
在组件定义中定义服务器行为会创建一个闭包,该行为可以访问到外部作用域的内容.  
比如以下的`publish`行为就能访问到`publicVersion`这个变量:
```tsx
// app/page.tsx
export default async function Page() {
    const publicVersion = await getLatesVersion();

    async function publish(){
        "use server"
        if(publicVersion !== await getLatesVersion()){
            throw new Error('The version has changed since pressing publish')
        }
        // ...
    }

    return (
        <form>
            <button formAction={publish}>Publish</button>
        </form>
    )
}

```

闭包在需要捕获某个渲染时内部的数据的快照(snapshot)时很有用,这样你就能在之后触发行为时使用当时对应的数据了.(比如这里的`publicVersion`)  
但是也是由于这个现象,这个被捕获的变量值会被发送到客户端,并在行为被出发后返回到服务器端.为了避免敏感信息的暴露,Next会自动为这些通过闭包访问到的数据进行加密处理.每次Next应用打包时会为**每个action生成新的私有密钥**.也就是说行为的触发跟应用的打包是想联系的.(每次打包,相同的action都会有不同的私钥)

::: tip
我们不建议过度依赖于Next对敏感信息的加密能力.尽量利用[React提供的`taint APIs`](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#preventing-sensitive-data-from-being-exposed-to-the-client),主动为指定数据进行隐私保护,不暴露给客户端.
:::

### 重写密钥(高级用法)
当你的应用需要自主在多个服务器上搭建,这样尽管是同一个应用,由于所在服务器的不同,每个服务器的密钥也会因此不同,这样可能会导致一些行为的不一致.  
为了缓解可能带来的不便,你可以自己重写这个打包后的密钥,方法是修改`process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`这个环境变量.指定这个环境变量的值后,你就能确保每个服务器上的应用实例用的是相同的密钥了.(之后的打包,服务器的不同不会影响这个密钥的值)  
这是当你需要多服务器部署时维持加密行为一致的高级用法.你还应该考虑其它一些标准的安全性实践,像key rotation和signing.(?是一些安全性策略)
::: tip
如果你的Next应用是部署到Vercel上的,那Vercel会帮你解决这些问题.
:::

### 设置可允许访问源(高级用法)
`<form>`元素能触发服务器行为,意思是它可能会被利用,向服务器端发起[CSRF攻击](https://developer.mozilla.org/en-US/docs/Glossary/CSRF).  
服务器行为本质上是用`POST`方法发起请求,这也是唯一一种能触发它的HTTP方法.这已经防御了大量的CSRF攻击了,尤其是默认的[**SameSite Cookies**](https://web.dev/articles/samesite-cookies-explained) (?我在说什么)  
而其它的一些保护行为是,Next的服务器行为会对比Origin Header和Host Header(或是`X-Forwarded-Host`).如果它们的值不相等,那相应的请求也会被中断.也就是说,服务器行为只可以被同源的请求所调用.  
对于一些用了反向代理或多层后端结构的大型应用而言(服务器API在生产环境中有所变化的),我们建议使用配置项:`serverActions.allowedOrigins`,来知名一系列安全的请求源.这个配置项接受一个字符串数组:
```js
// next.config.js
/** @type {import('next').NextConfig} */

module.exports = {
    experimental:{
        serverActions:{
            allowedOrigins:['my-proxy.com','*.my-proxy.com'],
        }
    }
}

```

[更多关于服务器行为安全性的内容](https://nextjs.org/blog/security-nextjs-server-components-actions)

## 一些额外的资源
更多关于服务器行为的内容,可以去看看以下React官方文档的介绍:
- [Server Actions](https://react.dev/reference/rsc/server-actions)
- [`"use server"`](https://react.dev/reference/react/use-server)
- [`<form>`](https://react.dev/reference/react-dom/components/form)
- [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [`useActionState`](https://react.dev/reference/react/useActionState)
- [`useOptimistic`](https://react.dev/reference/react/useOptimistic)

## 接下来
你可以去学学如何配置服务器行为:
- [serverActions](https://nextjs.org/docs/app/api-reference/next-config-js/serverActions)