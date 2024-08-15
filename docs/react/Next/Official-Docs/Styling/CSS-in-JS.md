# CSS-in-JS

::: warning
一些需要Javascript运行时的CSS-in-JS三方库在目前的服务器组件中并没有得到支持.如果一些CSS-in-JS三方库要配合React最新的一些特性,像服务器组件和流这些功能的话,要求三方库支持最新版本的React,包括React的并行渲染功能.  
我们正和React开发团队共同开发上游(upstream?)API来处理CSS和JS静态资源,共同支持React服务器组件和流式工作流程这些功能.
:::

以下这些三方库在 **`app`目录下的客户端组件**中是可以使用的:(根据字母顺序排列,链接都是对应的官网)
- [ant-design](https://ant.design/docs/react/use-with-next#using-app-router)
- [chakra-ui](https://chakra-ui.com/getting-started/nextjs-app-guide)
- [fluentui/react-components](https://react.fluentui.dev/?path=/docs/concepts-developer-server-side-rendering-next-js-appdir-setup--page)
- [kuma-ui](https://kuma-ui.com/)
- [@mui/material](https://mui.com/material-ui/guides/next-js-app-router/)
- [@mui/joy](https://mui.com/joy-ui/integrations/next-js-app-router/)
- [pandacss](https://panda-css.com/)
- [styled-jsx](https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-jsx)
- [styled-components](https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components)
- [stylex](https://stylexjs.com/)
- [tamagui](https://tamagui.dev/docs/guides/next-js#server-components)
- [tss-react](https://tss-react.dev/)
- [vanilla-extra](https://vanilla-extract.style/)

以下则正在努力兼容,目前还不可用:
- [emotion(github issue)](https://github.com/emotion-js/emotion/issues/2928)

::: tip
我们正在测试不同的CSS-in-JS库,未来也会增加更多支持React18特性/或者说`app`目录功能的库.
:::

如果你需要**为服务器组件添加样式**,我们建议您使用**CSS模块**,或是其它输出CSS文件的方法,比如**PostCSS或TailwindCSS**.

## 配置`app`目录下的CSS-in-JS
如果要对`app`目录下的CSS-in-JS进行配置,则需要以下可选的三步:
1. 样式注册文件,收集渲染中需要用到的所有CSS规则.(**style registry**)
2. 用`useServerInsertedHTML`这个新的hook,在内容用到前提前注入规则
3. 初次服务器端渲染的时候,一个用样式注册文件包裹了应用的客户端组件.(?)

### `styled-jsx`
客户端组件用`styled-jsx`,后者版本需要`v5.1.0`以上.  
首先创建样式注册文件:
```tsx
// app/registry.tsx  
// 步骤1
import React, { useState } from 'first'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({
    children
}:{
    children:React.ReactNode
}) {
    // 用懒加载初次状态的方法,仅创建一次样式表
    // lazy-initial-state相关的内容: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    const [jsxStyleRegistry] = useState(() => createStyleRegistry())

    // 步骤2
    useServerInsertedHTML(() => {
        const styles = jsxStyleRegistry.styles();
        jsxStyleRegistry.flush()
        return <>{styles}</>
    });

    return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}

```

之后在根布局下用注册组件将子内容包裹起来:

```tsx
// app/layout.tsx
import StyledJsxRegistry from './registry'
 
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}){
    return (
      <html>
        <body>
            {/* 步骤3 */}
          <StyledJsxRegistry>{children}</StyledJsxRegistry>
        </body>
      </html>
    )
}

```
[看看实际用的例子是怎样的](https://github.com/vercel/app-playground/tree/main/app/styling/styled-jsx)

### Styled Components
以下是配置`styled-components@6`或以上版本的一个例子.  
首先在`next.config.js`中启用styled-components的功能:
```js
// next.config.js
// 步骤0.5
module.exports = {
    compilers:{
        styledComponents: true
    }
}

```

之后用`styled-components`API,创建一个用于收集所有CSS样式规则的全局注册组件,并用一个函数将这些规则返回回来.之后利用`useServerInsertedHTML`hook,将收集到的样式,在根布局中注入到`<html>`标签当中.
```ts
// lib/registry.tsx
// 步骤1
import React, {useState} from 'react';
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
    children
}:{
    children: React.ReactNode
}) {
    const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

    // 步骤2 
    useServerInsertedHTML(() => {
        const styles = styledComponentsStyleSheet.getStyleElement();
        styledComponentsStyleSheet.instance.clearTag();  //?
        return <>{styles}</>
    });

    if(typeof window !== 'undefined') return <>{children}</>

    return (
        <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
            {children}
        </StyleSheetManager>
    )
}

```
然后在根布局用这个样式注册组件,将children再包裹起来:
```tsx
// app/layout.tsx
import StyleRegistry from './lib/registry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {/* 步骤3 */}
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}

```

[github完整的代码例子](https://github.com/vercel/app-playground/tree/main/app/styling/styled-components)

::: tip
- 服务器渲染期间,样式会被提取到全局并进行注册,注入(flush)到HTML的`<head>`标签当中.这样能确保样式规则先定义,后使用.以后我们将利用新特性,再另外决定在哪里注入我们的样式.
- 流式传输时,来自不同分块的样式会被收集起来,并添加到已存在样式的尾部.在客户端hydration(注水)完毕后,`styled-components`会恢复正常工作并注入后来的动态样式.
- 我们要在组件顶层,专门用一个客户端组件来包裹样式注册功能的原因是,这样能更加有效地提取CSS规则.这样不会在后来的服务器渲染中,再重新生成样式.同时也能防止样式在服务器组件负载中传输.
- 其它更多专门的styled-components配置项,[可以看看我们官网的API指引](https://nextjs.org/docs/architecture/nextjs-compiler#styled-components).
:::