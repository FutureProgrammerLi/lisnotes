# CSS
Next支持多种处理CSS样式的方法,包括:
- [CSS模块](#css模块)
- [全局样式](#全局样式)
- [外部样式表](#外部样式表)

## CSS模块
Next内部自带CSS模块支持,直接把样式后缀命名为`.module.css`就行.  
CSS模块实现样式本地化的方法是自动创建一个唯一的类名(?).这样你就可以在不同的文件中使用相同的类名,而不用担心类名冲突问题了.也正是这个好处,让CSS模块变成一种非常适合运用于组件层级的编写样式方法.

### 例子
CSS模块可以被`app`目录下的任意文件所导入:
```tsx
// app/dashboard/layout.tsx
import styles from './styles.module.css'

export default function DashboardLayout({
    children
}:{
    children: React.ReactNode
}) {
    return <section className={styles.dashboard}>{children}</section>
}

```

```css
/* app/dashboard/styles.module.css */
.dashboard {
    padding: 24px;
}

```
CSS模块的功能**仅作用于那些`.module.css`和`.module.sass`类型的文件**.  
到了生产环境,所有的CSS模块文件都会被自动整合到**许多个,经压缩和代码分块后的`.css`文件**中.这些`.css`文件是一些应用中的热执行路径(?hot execution path),以此确保尽可能少的CSS代码量被加载到应用中,只用到渲染所必须的样式.

## 全局样式
全局样式可以直接被`app`目录下的布局,页面,或是任意组件所导入.  
::: tip
- 这跟`pages`目录下的样式导入有所不同,`pages`目录下的全局样式,只能在`_app.js`中导入.
- Next本身不支持使用全局样式,除非这些样式真的是全局被使用的,整个应用的生命周期的所有页面都需要用到的.因为Next用的是React内置样式支持的方式,与Suspense整合到一起的.这种内置的支持在目前来说不会在你切换路由时移除样式.正因如此,我们的建议是尽量使用CSS模块而非全局样式.
:::

以下是全局样式`app/global.css`的使用例子:
```css
/* app/global.css */
body {
    padding: 20px 20px 60px;
    max-width: 680px;
    margin: 0 auto;
}

```
在根布局文件中,导入全局样式,为应用所有的路由添加相应样式:
```tsx
// app/layout.tsx
// 这样导入会把css文件的样式,作用于应用的所有路由
import './global.css'

export default function RootLayout({children}:{children:React.ReactNode}}) {
    return (
        <html lang='en'>
            <body>{children}</body>
        </html>
    )
}
```


## 外部样式表
由外部包所发布的样式,可以直接导入到`app`目录下,其中包括同级的组件(? colocated components):
```tsx
// app/layout.tsx

import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({children}:{children:React.ReactNode}) {
    return (
        <html lang="en">
            <body className={container}>{children}</body>
        </html>
    )
}
```

::: tip
外部样式表的导入,可以从npm包导入,可以下载好并放到代码库内,但**不能用`<link rel="stylesheet" />`**.
:::

## 应用顺序和样式结合
Next会在生产打包时,自动将CSS分块(整合).这里采用CSS的顺序是根据你导入样式表的代码顺序所执行的.(?不同文件怎么判断导入顺序?)  
比如说,`base-button.mmodule.css`将先序于`page.module.css`,因为`<BaseButton>`是先导入到`<Page>`里的.(?)
```tsx
// base-button.tsx
import styles from './base-button.module.css'

export function BaseButton(){
    return <button className={styles.primary} />
}

```

```ts
// page.ts
import { BaseButton } from './base-button'
import styles from './page.module.css'

export function Page(){
    return <BaseButton className={styles.primary} />
}

```

为了维持一个可以预测的样式使用顺序,我们建议:
- 单个JS/TS文件中只导入一个CSS文件
    - 如果要用到全局类名,那按照你想应用的样式顺序,将全局样式也导入到该文件当中.
- 尽量选择使用CSS Modules,而少用全局样式
    - CSS模块的类名规则应保持一致.比如说,用`<name>.module.css`,而不是`<name>.tsx`.(?)
- 将共用的样式,提取到一个单独的,共用的组件当中.(?)
- 如果用到了Tailwind,将样式表的导入写在文件顶部,最好还是根目录当中导入.
- 关闭那些可能会将你的引入进行排序的插件,像ES lint的`sort-import`就是之一.它们可能在你不知情的情况下修改样式引入顺序,而恰巧引入顺序又影响实际展示效果.

::: tip
- 开发模式下CSS应用顺序可能会有所不同,因此建议,确保打包后,样式的展示是否依旧保持正确.
- 你可以在`next.config.js`中配置[`cssChunking`](https://nextjs.org/docs/app/api-reference/next-config-js/cssChunking),自行决定CSS的分块方式.
:::

## 一些额外的特性
Next还有一些额外的特性来提升增加样式的体验:
- 本地执行`next dev`命令时,本地样式表(包括全局和CSS模块)会利用[Fast Refresh](https://nextjs.org/docs/architecture/fast-refresh)的技术,修改并立即应用到浏览器上.
- `next build`打包时,CSS文件会被打包成代码量更少的,数量更少的`css`文件,这样能减少网络获取样式的请求次数.
- 尽管如果你的浏览器禁用了JS,用`next start`命令启动项目,应用的样式还是会被加载出来.不过要恢复即改即现的功能的话(上面的"Fast Refresh),你还是要用回`next dev`启动项目.