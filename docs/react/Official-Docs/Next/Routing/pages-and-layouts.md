# 页面及布局

::: tip
我们建议您先阅读[基础路由概念](./basis.md)及[定义](./defining-routes.md)后再进行以下阅读,方便您更好的理解.
:::

这篇文章教的是如何运用`layout.js`,`page.js`,`template.js`这三个特殊的文件,为路由构建出对应的用户界面.

## 页面
一个页面,就是专属于一个路由的用户界面.页面的定义,实际就是在`page.js`文件中导出一个React组件.  
最为基础的就是,为整个应用添加一个刚打开的时的页面,方法就是在`app`目录下创建`page.js`文件.
![index-for-app](./imgs/page-special-file.jpg)
```tsx
// 点进去第一时间看到的内容: localhost:5173/
export default function Page(){
    return <h1>Hello, Home page</h1>
}
```

而要创建更多的界面,其实就是创建新文件夹,并在其中创建`page.js`就行了.  
比如要为`/dashboard`添加展示内容,那就在`app`目录下创建`dashboard`文件夹,在`dashboard`内创建`page.js`文件就行了.(之后简化这个过程为`app/dashboard/page.js`,希望你能够理解)
```tsx
export default function Page(){
    return <h1>Hello, Dashboard Page!</h1>
}
```
::: tip
- 路由展示内容的文件后缀,可以是:`.js`,`.ts`,`.tsx`
- 一个页面,通常是路由子树中的叶子节点
- 要使一个URL由内容展示,通常需要一个`page.js`文件,并在其中导出React组件
- 默认情况下,页面都是服务器组件((Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)),你也可以通过手动的方式将其设置为[客户端组件](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- 页面内部可以获取数据.更多相关的内容可以直接[跳到这里了解](https://nextjs.org/docs/app/building-your-application/data-fetching)
:::

## 布局
布局是当前树下,组件展示的整体架构.多个子路由共享相同的页面布局.  
页面之间切换的时候(导航),布局组件会保持状态的不变,原有的交互也不会变,更不会重新进行渲染.  
布局也是可以嵌套的.  

默认的布局定义,就是在文件夹中创建`layout.js`文件,并导出React组件.这个组件要求接受一个`children`属性(prop),用于子布局或页面内容的填充.(变children不变layout)  
举例说,定义一个共享于`/dashboard`和`/dashboard/settings`页面的布局,可以这样写:
![structure-of-layouts](imgs/layout-special-file.jpg)
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
    children, //可以是页面,也可以是子布局
}){
    return (
        <section>
            {/* 需要共同展示的内容,标题/侧边栏等等 */}
            <nav></nav>
            {children}
        </section>
    )
}
```

## 根布局(必需)
根布局,应用于所有的路由界面.它就是在`app`目录下的一个普通文件而已(`app/layout.tsx`).但它是**必须要有的.** 它必须包含`html`和`body`标签,从而允许你修改由服务器返回的初始HTML内容.(感觉很有深意,但不太懂)
```tsx
export default function RootLayout({
    children,
}:{
    children:React.ReactNode
}){
    return (
        <html lang='en'>
            <body>
                {/* Layout UI */}
                <main>{children}</main>
            </body>
        </html>
    )
}
```

## 嵌套布局
默认情况下,布局会随文件夹的嵌套,实现分层的布局.也就是说,有父布局和子布局的概念.子布局的功能通过父布局的`children`属性实现.  
简单说就是,在分块文件夹下创建`layout.js`文件,这个就是子布局了.  
(根布局必然是`app/layout.js`,子布局自然就可以是`app/dashboard/layout.js`了)  
下面这个例子就是,为`/dashboard`这个路由,创建嵌套路由,`/dashboard/layout.js`.
![nested-layout](imgs/nested-layout.jpg)
```tsx
export default function DashboardLayout({
    children
}:{
    children:React.ReactNode
}) {
    return <section>{children}</section>
}
```

如果你要结合上面定义的两个布局,根布局`app/layout.js`包裹Dashboard的布局(`app/dashboard/layout.js`),然后又包裹着`app/dashboard/*`下的所有分块,就可以用以下文件结构实现:
![nested-layout-ui](imgs/nested-layouts-ui.jpg)

::: tip
- `.js`,`.ts`,`.tsx`文件均可作为布局文件对待.
- 只有根布局允许包含`<html>`和`<body>`标签
- 当同一文件夹下,既有`layout.js`也有`page.js`文件,布局文件将包裹页面内容.
- 布局文件默认是服务器组件,不过你可以手动设置为客户端组件
- 布局文件内可以获取数据.更多相关的内容可以直接[跳到这里了解](https://nextjs.org/docs/app/building-your-application/data-fetching)
- 通过父布局实现和子组件进行数据传递是不可行的.不过你可以在一个路由之中多次请求相同的数据,React会自动减少去除相同的请求,而不影响页面性能.
- 布局文件访问不了它底下的文件分块.如果真的要访问所有的路由分块,你可以在客户端组件中通过`useSelectedLayoutSegment`或者`useSelectedLayoutSegments`实现.(???)
- 你可以路由分组的方式,选择使用或不使用特定的布局.
- 你也可以用路由分组,创建多个根布局.(看看这个例子.)[https://nextjs.org/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts]
- 从`pages`目录迁移过来:在新版本中,根布局代替了`_app.js`和`_document.js`文件.[更多关于迁移的内容](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#migrating-_documentjs-and-_appjs)  
:::

## 模板
模板和布局有点相似,它们都会包裹子布局或页面.它们又有点不像,布局内容不会改变,状态也会维持,但模板则会在每次导航时都为其子内容创建新的实例.换句话说,当用户在不同的路由切换,而这些切换的路由之间使用的是同一个模板,新的组件实例就会被挂载,DOM元素就会被重新创建,状态也不会持久,副作用也会重新进行同步.  
有时候你就是需要这些特定的页面行为,也就是模板比布局更加合适的情况.  
举例:
- 依赖于`useEffect`(比如记录页面视图)和`useState`(比如每个页面的反馈表格)的特定功能.
- 改变默认的框架行为.比如布局里的Suspense Boundaries只在布局初次加载时会展示它的后备展示页面,而不在页面切换时展示.而使用了模板,每次导航都会展示这个Suspense Boundaries对应的候补页面.  

模板的定义,就是在目录下创建`template.js`文件,并导出React组件.这个组件需要接受`children`属性.
![template-def](imgs//template-special-file.jpg)
```tsx
// app/template.tsx
export default function Template({
    children
}:{
    children: React.ReactNode
}) {
    return <div>{children}</div>
}
```
而模板的嵌套,则是在`Layout`和`children`属性中渲染.以下是个简要的演示.
```tsx
<Layout>
    <Template key={routeParam}>{children}</Template>
</Layout>
```
1. 好像要在布局文件中使用模板
2. 需要为模板组件添加一个unique key.(处于性能考虑?)

## 元数据
在`app`目录中,你可以使用[Next为您提供的API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)修改`<head>`HTML元素,像`title`,`meta`这些.  
元数据的定义,还可以通过在`layout.js`或`page.js`文件中,导出一个元数据对象(`metadata object`),或是`generateMetada`函数.
```tsx
// app/page.tsx
import { MetaData } from 'next'

export const metadata: MetaData = {
    title:'Next.js'
}

export default function Page(){
    return '...'
}
```
::: tip
我们不建议您通过手动在根布局中,添加`<head>`标签,从而修改`title`,`meta`这些内容.  
我们为您提供的专门处理应用元数据的API,会自动处理一些高级需求,像streaming,`<head>`元素去重等等.
:::

[如果需要了解更多关于元数据的内容,可以看这.](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)