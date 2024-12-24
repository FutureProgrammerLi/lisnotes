# Next里的路由系统
> 汇总的一个原因是,最近用到的Next文件`app/posts/[id]`,看得懂`app/posts/[...id],就看不懂了  
> 更不用说@,(),[[]]等等的文件夹和文件命名了.  
> 故有此文,分类汇总一下,**Next里的特殊文件命名, 以及特殊的命名符号.**  
> 想要的效果像这样:[Next.js全栈框架入门：带你一文搞定路由](https://juejin.cn/post/7426352106033004555#heading-32)  
> 感谢这位大佬的分享. (10月Next还才v13,现在12月就v15了..)

## 特殊的文件命名
| 文件名   | 文件作用 |
| ---  | --- |
| `layout`   |  页面布局定义 |
|  `page` |  页面内容定义  |
|  `loading`  |  正在加载当前路由时显示的UI  |
|  `not-found` | 未找到对应路由时显示的内容  |
|  `error` |  页面出错时显示的内容  |
|  `global-error` | 全局的,不受限于某个路由的出错内容显示   |
|  `route` | 服务器端API端点,跟page类比的话,`app/page.tsx`跟`app/api/route.ts`一样,请求路径都是`'/'`.(`localhost:3000/`,`await fetch('/')`)   |
|  `template` |  专门重新渲染的布局UI   |
| `default`  | 并行路由的后备UI   |

表格列举完留下的问题:
1. 怎么触发?比如我定义了个`loading`,怎么在`page`里显示这个页面?
2. 后两个只看说明看不懂具体作用,完成汇总后再回头探究它们的作用.
3. 有了App Router, 还需要`global-error`吗?

## 特殊的文件夹命名
| 文件夹命名   | 作用 |
| ---  | --- |
| `app/dashboard/setting`和`app/dashboard/profile`   |  嵌套路由 |
|  `[folderName]` |  动态路由片段,比如`app/posts/[id]`  |
|  `(folderName)` |  路由按某种逻辑进行分组;比如`app/(auth)/login/page.tsx`  |
| | |
|  `[...folderName]` |  捕获所有路由片段,比如`app/posts/[...slug]/page.tsx`  |
|  `[[...folderName]]` |  可选的综合路由片段,比如`app/posts/[[...slug]]/page.tsx`  |
|  `@folder`  | 在同一布局中同时或有条件地渲染一个或多个页面   |
| `(.)folder`  | 表示匹配同一层级;比如`app/@modal/(.)settings`   |
| `(..)folder`  | 表示匹配上一层级   |
| `(..)(..)folder`  | 表示匹配上两级   |
| `(...)folder`  | 表示从根目录拦截   |


(能不能举个例子看看作用?从[...folder]开始就看不懂了)

## `@folder`和`(.)folder`:平行路由和拦截路由
先从概念说起,再从用例稍微理解,最后详细认识.  

* **平行路由**:如果你需要在同一个布局文件内,同时渲染或条件渲染一个或多个页面时,这时你可以使用平行路由.
* **拦截路由**:如果你需要在当前布局中加载来自应用另外部分的路由时,你可以使用路由拦截.  

光看概念作用似乎相似,都是在一个布局的前提下,渲染另外的页面.使用上,也确实是搭配使用的.  
但要进行区分,平行路由更像`slot插槽`,拦截路由则更像一个新功能.  

### 为什么说平行路由更像插槽?
将插槽名称提取到文件系统,再在布局中引入并渲染对应内容,就是平行路由的具体实现.  
![parallel-routing](../Next/Official-Docs/Routing/imgs/parallel-routes.jpg)

**插槽名提取到文件系統**: 文件夹的名称就是插槽的名称.  
**在布局中引入并渲染对应内容**:`@team/page.tsx`和`@analytics/page.tsx`的内容,在`layout.tsx`中变成了对应的props,直接在布局中跟`{children}`一样,`{team}`,`{analytics}`就可以渲染出对应内容.

### 拦截路由:一种较新的功能
想象一下以下场景:  
进入一个页面,顶部有一个登录按钮.点击按钮后,你觉得是跳转到另外的登录页面,还是弹出一个对话框,直接在里面输入信息就可以登录. 两种结果你更偏向哪种呢?  

这跟拦截路由有什么联系? 拦截路由的存在可以同时满足以上两个场景.  
**同一个路由分块下,内容可以仅为一个弹窗,也可以是一个全新的页面.**
![intercepting-routes](../Next/Official-Docs/Routing/imgs/intercepted-routes-files.jpg)

### 用例:Modal弹窗的实现
拦截路由会改变URL,平行路由允许在同一个布局下渲染一个或多个页面的内容.  
**二者结合的结果是,同一个URL,可以有不同的展示内容.**  

![folder-tree](/folder-tree.png)
上图展示了两个层级,结合使用了平行路由和拦截路由所需的目录结构.  
理解顶层的`@popup`,`(.post)`,也就理解`/posts/`目录下,相同的`@apopup`和`(.)login`了.  

插槽可能比较好理解,有Vue经验的,React有利用过`children`或类似属性的,应该都可以理解.  
::: code-group
```tsx [app/layout.tsx]
export default function RootLayout({
    children,
    popup        // [!code highlight]
    // 这里的popup, 就是插槽名称,@popup, 可以是其它任意合法名称
}:ReadOnly<{
    children: React.ReactNode,
    popup:React.ReactNode  // [!code highlight]
}>){
    return (
        <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <h1>Root layout</h1>
        <Link href="/">Back to root</Link>
        {children}
        {popup}  // [!code highlight]
      </body>
    </html>
    )
}
```

```tsx [/@popup/(.)posts/page.tsx]
export default function Page(){
    return <div>Modal in app folder</div>
}
```

```tsx [/@popup/default.tsx]
export default function Default(){
    return null;
}
```
```tsx [/posts/page.tsx]
export default function Post(){
    return <div>Post content</div>
}

```
:::
以上三个文件定义完我们的`@popup`插槽后,在根目录下跳转到`/posts`时就可以达到,同一个URL,产生两种页面的内容.  

```tsx
// app/page.tsx
import Link from 'next/link'
export default function Page(){
    return (
        <>
            <div>Some content...</div>
            <Link href="/posts">To "/posts"</Link>
        </>
    )
}
```
点击跳转链接To "/posts"后,URL会发生变化,但根布局下的`Root Layout`标题,和根页面下的`Some content...`**不会变化**.而会在这些内容的底下,新增了`Modal in app folder`这个,位于`app/@popup/(.)posts/page.tsx`的内容.实现了弹窗效果的同时变更了URL.  
而此时对页面进行刷新,`Root Layout`的内容会保留,但`Some content...`会消失,取而代之的是`Post content`, 即`app/posts/page.tsx`的内容.实现了直接访问该URL时,对应需要显示的内容.

::: details 为什么需要一个不返回任何内容的`@popup/default.tsx`?
条件渲染是怎么实现的? 为什么default.js 返回 null时,插槽无内容,而跳转后,会显示插槽定义的page内容?
可以理解为这个文件返回**插槽的默认内容**.  
`page.tsx`和`default.tsx`的作用是不一样的,后者仅在路由无匹配时显示的默认内容.前者则有具体对应的子路由需要显示的内容.
:::
