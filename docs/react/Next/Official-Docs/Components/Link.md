# `<Link>`,Next里的导航组件

> [原文地址](https://dev.to/joodi/a-comprehensive-guide-to-the-nextjs-link-component-29jf?bb=205822)  
> 是个了解文,重点与官网内容相似,但并非官网内容,建议速读.
> 官方文档: [Link](https://nextjs.org/docs/app/api-reference/components/link)

Next里的`Link`组件是一个很好用的内置组件,可以助你构建更快,SEO更友好,可访问性更强的网站.  
它的作用是在客户端路由之间实现导航,大幅提升客户端性能及用户体验.本文主要介绍`Link`从基础用法,到高级场景的应用,比如处理访问过的链接.  

## Link组件的基本用法
`Link`组件的本质是替换HTML的`<a>`标签,以实现导航.以下是简单的例子:
```tsx
import Link from 'next/link';

export default function Home() {
  return (
    <nav>
      <Link href="/about">About</Link>
    </nav>
  );
}
```
### 为什么要使用这个内置组件Link呢?
* **客户端导航:** 防止页面完整重加载,加快路由切换速度.
* **预获取:** 自动在后台预获取页面,从而减少加载时间.
* **SEO优化:**  保留具备语义的HTML,利于搜索引擎抓取.

## 配合Typescript动态生成Link
当你需要动态的创建链接时,你可以利用数组,并对其遍历生成多个`Link`组件.以下是代码例子:
```tsx
import Link from 'next/link';

const links = [
    {href:'/home',title:'Home'},
    {href:'/about',title:'About'},
    {href:'/contact',title:'Contact'},
]

export default function Navbar() {
  return (
    <nav>
      {links.map((link) => (
        <Link key={link} href={link.href}>{link.title}</Link>
      ))}
    </nav>
  );
}
```
## 处理访问过的链接
处理导航中访问过的链接,是一个非常常见的场景.比如,当用户点击一个链接后,这个链接会变成已访问状态,并显示为灰色.  
Next.js本身不提供这个功能,不过你可以利用`usePathname`钩子来实现.

### 实现
既然要用到`usePathname`钩子,我们就必须在文件顶部使用"use client"指令,确保本文件是客户端组件.

::: tip
不要过多地使用`use client`指令.建议只在颗粒度较小的组件,比如导航栏Navbar,或脚注Footer中使用,以避免不必要的客户端渲染,从而影响SEO性能.
:::

以下是创建访问过链接系统的代码例子:
```tsx
"use client"

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
    {href:'/home',title:'Home'},
    {href:'/about',title:'About'},
    {href:'/contact',title:'Contact'},
]

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav>
        {links.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? 'text-blue-500' : 'text-gray-700'}>
                {link.title}
            </Link>
        ))}
    </nav>
  );
}
```
以上代码解析:
* 使用`usePathname`钩子获取当前路径.
* 根据当前路径条件式为链接添加样式,以表示已访问状态.(`item.href === pathname`)

## Link组件的高级特性
### 预获取
默认情况下,Next会在后台预获取视口内出现的链接.这样可以提升性能,不过必要的话也可以禁用这种行为:
```tsx
<Link href="/about" prefetch={false}>About</Link>
```

### `replace`和`push`
用`Link`实现跳转时,默认行为是将新的一帧,push到历史栈中的.如果要改变这种行为,你可以使用`replace`属性,将添加帧的行为变更为替换帧.(是路由实现的基础知识)
```tsx
<Link href="/about" replace>About</Link>
```

### 滚动行为
Next默认会滚动到新页面顶部,不过你可以使用`scroll`属性,来改变这种行为.
```tsx
<Link href="/about" scroll={false}>About</Link>
```


## 何时使用Link? 何时又使用`a`标签?
* 用`Link`: 在Next应用内的导航可以使用`Link`组件.它能优化应用性能,并实现客户端导航.
* 用`a`标签: 如果需要处理外部链接,或需要利用原生的浏览器行为,比如下载文件,或打开新窗口,则可以使用`a`标签.

用`a`标签打开外部链接的例子:
```html
<a href="https://example.com" target="_blank" rel='noopener noreferrer'>External Site</a>
```

## 最佳实践
1. **最小化客户端渲染:** 尽可能在"小组件"上利用"use client"指令.
2. **有策略地利用预获取功能:** 禁用掉那些不大可能会被访问的链接的预获取功能, 以避免不必要的性能开销.
3. **SEO友好的链接:** 使用明确的`href`属性,尽可能避免使用动态的`href`值.
4. **可访问的链接:** 尽可能提供有意义的链接文本,以提高可访问性.
5. **访问过的链接使用样式区分:** 确保访问过的链接足够清晰,能在视觉上与未访问的链接区分开来.

## 结论
`Link`组件是Next里创建快速,高效,SEO友好的导航链接的理想选择.通过合理利用其预获取,替换,滚动等高级特性,你可以进一步提升用户体验,并优化应用性能.无论你需要利用它构建小型或是复杂应用,高效利用`Link`组件都是必要的.  

---
感谢你能看到这里!


