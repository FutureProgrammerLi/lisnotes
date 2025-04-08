# 一篇关于`use` api的文章
> 原文地址:https://dev.to/alperreha/react-19-use-hook-async-functions-in-client-components-made-easy-4g4b  
> 感觉`use`这个hook是被低估的,所以想稍微深入了解一下.  
> 目前已知的用途是,1.读取上下文的值, 2.读取Promise的返回值而不依赖await.  

## 官方资源
* [`use()` -- React官网的介绍](https://react.dev/reference/react/use)
* [React v19的介绍](https://react.dev/blog/2024/12/05/react-19)
* [Next.js v15使用`use()` API的例子](https://nextjs.org/docs/app/getting-started/fetching-data#with-the-use-hook)

本文用到的技术:
* Next.js 15 App Router
* React v19 - `<Suspense>`, `use()`
* Tailwindcss

// 将server action定义和组件定义分离,后者不再需要是Server Component,脱离`async/await`限制.  
// 文件组织方法, app/profiles/action, 将该页面用到的actions定义到与/page,/layout同级的目录下.甚至该页面的组件,可以命名为xxx.component.tsx  
// 结合Suspense,use,在客户端组件中调用server action. 并尝试xxx.component.tsx这种命名方式  
// [关于`use`的文章](/react/Official-Docs/React/APIs/use.html)  

## `use()`是什么
React衍生的框架,Remix和Next 14,都新增了"服务器组件"这个新概念,各自有服务器端的实现.  
而传统的React开发,一般是将逻辑代码和UI代码通过打包处理,以"客户端包"的概念发送给客户端.而后这些包在客户的浏览器中被执行.  

这个过程,由于服务器组件的出现而被改变了.如今我们的组件可以在服务器上渲染,将可用的内容直接发送给客户端.  
这样做的好处包括:
* 客户端上需要运行的JS代码量减少;
* 更好的用户体验;
* 更小的客户端包体积;
* 服务器端更容易捕获错误;

不过,这个过程中如果用到异步函数的话,就变得稍微复杂了一点.要么在客户端组件上利用`useEffect` hook,要么依赖三方库.  
而`use()`的诞生,大幅简化了我们在客户端组件使用异步函数的操作.

## Demo:客户端组件中调用服务器行为
我们创建一个列表数据页面,来展示如何在Client Component里调用Server actions.  
在`/profiles`页面,通过在服务器上获取用户主页内容,并展示在客户端组件中.  
![directory](/devto/dir.png)

首先我们写个获取数据的函数:
```ts
'use server'
// /app/profiles/action.ts
export async function getLatestUsers(){
    // 模拟3秒的延迟
    const wait3Sec = new Promise((resolve) => setTimeout(resolve, 3000));
    await wait3Sec;

    const data = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await data.json();

    return users;
}
```

写完action后,回到我们的页面来调用它,并结合`<Suspense>`来更丝滑地处理加载状态:
```tsx
// /app/profiles/page.tsx
'use server'
import { Suspense, use } from 'react'; // 这里import 的use有什么用?
import { getLatestUsers } from './action';
import {UsersList} from './users-list.component';

export default async function ProfilesPage(){
    // 不再需要使用await
    const userPromise = getLatestUsers();

    return (
        <div>
            <Suspense fallback={
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500' />
            }>
                <UsersList userPromise={userPromise} />
            </Suspense>`
        </div>
    )
}
```
我们不再需要使用`await`关键字(那为什么还要`async`?).从Reactv19开始,我们可以直接将Promises传给客户端组件.  
我们的客户端组件会在接收到API响应后开始渲染屏幕.React也能理解这个传参是一个Promise,在完成接收内容之前,展示`<Suspense>`中定义的`fallback`内容.接收完响应后,这个组件就会被渲染为`<UserList userPromise={userPromise} />`.  

接下来写我们的`UserList`组件,接收到数据后展示的内容.
```tsx
// app/profiles/users-list.component.tsx
'use client'
import { use } from 'react';

export function UsersList({userPromise}:{userPromise:Promise<any>}){
    // 直接把Promise传给use就行,async/await一个都不用.(?)
    const users = use(userPromise);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">Latest Users</h2>
            <ul className="divide-y divide-gray-100">
                {users.map((user) => (
                <li key={user.id} className="flex items-center p-3 gap-3">
                    <div className="flex-1 min-w-0">
                    {user.id} - {user.username} - {user.email}
                    </div>
                </li>
                ))}
            </ul>
        </div>
    )
}
```

## 结果展示
![result](/devto/result.png)

总结一下
1. 定义server actions;
2. 结合`<Suspense>`, 直接在服务器组件将promise传给客户端组件(如果这里的组件不用async定义是否可行?);
3. 在客户端组件中使用`use(Promise)`获取数据.

---
实践回来了,上面`fetch`的URL有问题,直接浏览器是可以获取到的,但到了Next里就获取不了了.  
**Fetch Failed**  
![fetch-failed](/devto/fetch-failed.png)
改到自己编写的接口就通了.哪怕新建的项目完全复制以上代码也会报错,是jsonplaceholder接口的问题.

---
感谢你能看到这里!


