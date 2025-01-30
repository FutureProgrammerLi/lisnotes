# 错误处理
`error.js`文件,能帮你以比较优雅的方式,处理运行时的意外错误.

- 自动将路由分块及其子内容包裹在错误边界(Error Boundary)当中.
- 为专门的分块部分,根据文件系统的结构,创建遇到错误时需要展示的UI.
- 将遇到错误的分块独立开来,没出错的部分分块功能保留可用.
- 避免重加载整个页面的前提下,提供解决错误的一些功能方法.(Recover from errors)

方法就是在需要的那个路由分块下,创建`error.js`文件,并导出React UI组件.
![error-special-file](imgs/error-special-file.jpg)
```tsx
'use client' // 错误处理组件必须是客户端组件

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}:{
    error: Error & {digest?: string}
    reset: () => void
}) {
    useEffect(() => {
      console.error(error);
    }, [error])
    return (
        <div>
            <h2>Something went wrong!</h2>
                <button 
                onClick={() => reset()}>
                    Try again.
                </button>
        </div>
    )
}
```

## `error.js`是如何工作的
![errorjs-overview](imgs/error-overview.jpg)
- `error.js`会自动创建一个错误边界,用于包裹嵌套于内的子分块或是页面组件.
- 从`error.js`导出的组件,是子组件出错时,后备展示的展示组件.
- 如果错误边界中真的抛出了错误,那`error.js`的内容就会被展示,错误就会被另外处理(contained?)
- 展示了`error.js`的内容后,在错误边界以外的布局依然时可交互的,布局的状态也是会维持的.而在错误展示组件内则有一些功能函数,用于尝试从错误中恢复过来.

## 从错误中恢复
错误的出现有时只是暂时性的.这时可能只需要重新请求,重新渲染就能解决问题了.  
错误展示组件中有个`reset()`方法,可以让用户尝试刷新重试.这个函数的功能就是重新渲染错误边界之中的内容.如果真的刷新就能解决错误,那就,本该展示的内容取代回出错界面内容.
```tsx
// app/dashboard/error.tsx
'use client'
export default function Error({
    error,
    reset,
}:{
    error: Error & { digest?: string}
    reset: () => void
}) {
    return(
        <div>
            <h2>Something went wrong!</h2>
            <button onClick={() => reset()}>Try again</button>
        </div>
    )
}
```

## 嵌套路由
特殊命名的React组件,也会根据具体的嵌套层级,逐层地渲染出来.(`page.js`是最典型的,然后这个`page`,可以换成是`layout`,`error`)  
比如说,有着两个分块的嵌套路由,它同时包含了`layout.js`和`error.js`,那它变成代码嵌套的形式表现出来的话,是长这样的:  
(root layout=> root error=>segment layout=>segment error=> segment page)
![nested-hierarchy](imgs/nested-error-component-hierarchy.jpg)
从这个代码嵌套的结构中,我们可以看出`error.js`的一些行为:
- 子组件的出错,会冒泡到最近的错误边界当中,对错误进行相关处理.因此,你可以根据具体的需求,划定错误处理边界.
- 同级的`layout.js`和`error.js`,如果前者出现了错误,后者是不会进行相应处理的.因为你也看到了,`layout`包裹了`error`,`error`根本不知道`layout`出现了错误.

## 布局出错怎么解决
同层级的`error.js`是无法处理到`layout.js`和`template.js`抛出的错误的.没错,是故意的,这样才能保证错误出现的时候,底下的子路由还能看到顶层的布局,使用顶层的功能(比如导航).  
说来也简单,同层`layout`和`template`优先级较高,那就把`error.js`放在它们的上一级.  
那顶层的`layout`和`template`呢?特殊一点,用`global-error.js`这个文件替代一下.(error究极形态,global-error)

## 根布局的错误怎么解决
上面说过,`app/`下的`error.js`是处理不了`app/layout.js`和`app/template.js`抛出的错误的.  
那就,特意在`app/`下创建一个`global-error.js`的文件,专门处理根布局和根模板抛出的错误.  
`app/error.js`和`app/global-error.js`又有点不同,后者包裹的是整个应用.它的后备展示界面会取代根布局内容.因此,**`global.error.js`内部定义的后备展示UI,需要包含`<html>`和`<body>`标签.**  
`global-error.js`是最小粒度的错误展示界面了,可以作为整个应用无论出现了什么错误,都在这个页面处理的角色.不过由于根布局一般很少是动态的,这个页面实际很少会展示出来,一般相应层级的`error.js`错误处理页面就把对应的错误给处理掉了.  
我们建议,尽管定义了`global-error.js`,最好还是定义一个根错误处理页面,在根部局内显示相应内容  
(就是`app/global-error.js`,`app/layout.js`,`app/error.js`同时存在.这样不至于完全白屏,用户不知道到底哪里出了错.)

```tsx
// app/global-error.js
'use client'

export default function GlobalError({
    error,
    reset
}:{
    error: Error & {digest?: string}
    reset: () => void
}) {
    return (
        <html>
            <body>
                <h2>Something went wrong!</h2>
                <button onClick={() => reset()}>Try again!</button>
                </body>
            </html>
    )
}
```

## 处理服务器错误
上面这些说的都是客户端组件(Client Component)出错时的处理方式,那服务器组件(Server Component)里出错了怎么办呢?  
Next会将一个`Error`对象作为属性,发送给最近一层的`error.js`.(生产环境还会去除掉敏感错误信息)

### 保护一些敏感的错误信息
生产环境中,服务器发送给客户端的`Error`对象,只会包括一个通用(generic?)的`message`和`digest`属性.  
这样做就是为了避免把一些敏感的细节信息发送回给客户端.  
`message`顾名思义就是描述发生错误的一般描述,而`digest`属性则包含一个自动生成的关于错误的哈希值,用于匹配服务器上的错误日志.

## 接下来
* [更多关于`error.js`这个文件](https://nextjs.org/docs/app/api-reference/file-conventions/error)