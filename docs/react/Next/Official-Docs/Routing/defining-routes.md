# 路由定义

:::tip
我们建议你先阅读一下[路由基础概念](./index.md),再进行以下阅读.
:::

这篇文章主要是教您在Next应用中,如何进行路由定义以及应该怎样组织.

## 创建路由
Next.js的路由系统是基于文件结构的.也就是说,文件夹,文件,即是路由.  
每个文件夹代表的,是路由的一个分块,它对应的就是URL中的一个分块.而嵌套路由的创建,就是文件夹和文件之间的相互嵌套.
![file-based-router](imgs/route-segments-to-path-segments.jpg)
而有点特殊的,`page.js`文件,则是使对应的路由分块得以公开访问的(通过URL访问到对应的页面).
![defining-routes](imgs/defining-routes.jpg)

解释一下上图:如果你访问的URL是`/dashboard/analytics`,那是会访问不到东西的.因为这个URL下并没有对应的`page.js`文件.你可以把一些组件定义,样式,图片或一些不是用于展示的文件放在这个目录当中.  
:::tip
`.js`,`.jsx`,`.tsx`后缀的文件,都可以作为特殊用途的文件.(文件特不特殊是由Next决定的,只是它们的后缀可以是这些.之前也解释过.)
:::

## 构建UI
一些特殊命名的文件,一般就是用来搭建UI的,它们决定用户访问对应URL时展示什么内容.其中最为普遍的一个特殊命名文件,当`pages.js`和`layout.js`莫属.它们决定着URL独特的UI展示及整个子路由下的布局应该是怎么样的.  
举例说,在`app`目录下创建个`page.js`,在其中导出一个React组件:
```tsx
// app/page.tsx
export default function Page(){
    return <h1>Hello, Next.js</h1>
}

```

## 接下来
之后的,是要学习创建页面和布局.