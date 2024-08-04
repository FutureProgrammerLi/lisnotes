# 动态路由
如果你不知道分块的准确命名会是什么,或是想通过一些动态的数据去生成对应的分块名称的话,你可以通过动态路由(Dynamic Segments)的方式,在请求时或是构建预渲染时生成最终的分块名称.

## 使用习惯
`[folderName]`,将文件夹名用方括号括起来,就是动态路由了.比如`[id]`或是`[slug]`.  
(标题是动态路由dynamic routes,这里又成dynamic segments了.不太理解) => `pages`目录里二者意思相同.

## 使用例子
举个例子,一个博客的文件路径可以是:`app/blog/[slug]/page.js`,这里的`[slug]`就是每个博客的唯一标识(比如id之类的区分其它博客的属性)
```tsx
// app/blog/[slug]/page.tsx
export default function Page({
    params
}:{
    params:{
        slug:string
    }
}) {
    return <div>My post:{params.slug}</div>
}
```

| 路由地址   | 解析出来的URL |  参数值`params` |
| ---  | ---| --- |
| `app/blog/[slug]/page.js`   | `/blog/a` | `{slug: 'a'}` |
| `app/blog/[slug]/page.js`   | `/blog/b` | `{slug: 'b'}` |
| `app/blog/[slug]/page.js`   | `/blog/c` | `{slug: 'c'}` |

[看看这里,`generateStaticParams()`](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params),学一下怎么为分块生成参数.

::: tip
在`pages`目录下,动态分块跟动态路由的意思是一样的.
:::

## 生成静态参数
`generateStaticParams`这个方法可以结合动态分块使用,在构建的时候静态生成(不确定名称的)路由,而不是等到请求时需要的时候再生成路由.
```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
    const posts = await fetch('https://.../posts').then(res => res.json())

    return posts.map(post => ({
        slug:post.slug
    }))
}
// ??? 真有必要吗? 有种顾此失彼的感觉
```

这样使用`generateStaticParams`的主要好处是,函数内你可以比较巧妙地获取回来自其它地方的数据作为路由名称.如果目标内容是通过`generateStaticParams`的`fetch`请求获得的,那这些请求会被自动的["记忆"起来](https://nextjs.org/docs/app/building-your-application/caching#request-memoization).也就是说,相同参数的`fetch`请求,无论是在多个`generateStaticParams`函数内,多个布局内,还是多个页面之内,都只会发送一次.这样才能减少打包时间.  
如果你先前用的是`/pages`目录,[可以看看这里,如何迁移到`/app`目录并使用.](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#dynamic-paths-getstaticpaths)  
[你也可以看看更多关于`generateStaticParams`的使用信息及高级用例](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

## 捕捉所有的备用路由(catch-all segments)
动态路由的另一种用法是,捕捉所有的,可能没有的分块.用法是在动态路由的基础上再加三个句号(没错,数组解构嗯)  
**`[...fileName]`**  
举个栗子,`app/shop/[...slug]/page.js`,不仅会匹配到`/shop/clothes`这个URL分块,还会捕捉到`/shop/clothes/tops`,`/shop/clothes/t-shirts`以及其它子路径.(只要`/shop/`之后的文件夹内,没有对应的`page.js`的话,这个页面就会作为候补了)
| 文件路径   | 可能的URL | 对应的参数`params` |
| ---  | ---| --- | 
|  `app/shop/[...slug]/page.js`  | `/shop/a` | `{slug: ['a']}` |
|  `app/shop/[...slug]/page.js`  | `/shop/a/b` | `{slug: ['a','b']}` |
|  `app/shop/[...slug]/page.js`  | `/shop/a/b/c` | `{slug: ['a','b','c']}` |

## 可选的捕捉所有的备用路由

那如何选择性地使用这个捕捉所有地备用路由呢?答案是用双方括号,再... : **`[[...fileName]]`**  

举例来说,`app/shop/[[...slug]]/page.js`不仅会匹配到`/shop`分块,还会比配到`/shop/clothes/`,`/shop/clothes/tops`,`/shop/clothes/tops/t-shirts`这些子分块.(匹配度是不是太高了点?)  
捕捉所有的后备路由,可选和不可选的区别就是,前者是可选的(???惊了,听君一席话,如听一席话).  
无论实际URL上后面有没有更多的参数,它都会匹配到这个路由.(就是上面的`/shop`也会被匹配到,这是不可选后备路由所不具备的)

| 文件路径   | 可能的URL | 对应的参数`params` |
| ---  | ---| --- | 
|  `app/shop/[[...slug]]/page.js`  | `/shop` | `{}` |
|  `app/shop/[[...slug]]/page.js`  | `/shop/a` | `{slug: ['a']}`|
|  `app/shop/[[...slug]]/page.js`  | `/shop/a/b` | `{slug: ['a','b']}` |
|  `app/shop/[[...slug]]/page.js`  | `/shop/a/b/c` | `{slug: ['a','b','c']}` |

## Typescript

当配合使用Typescript时,可以为`params`添加一些类型校验,从而限制路由分块应该长什么样.
```tsx
// app/blog/[slug]/page.tsx
export default function Page({params}:{
    params:{ slug: string}
}) {
    return <h1>My Page</h1>
}
```
| 路由路径   | `params`类型定义 |
| ---  | ---|
| `app/blog/[slug]/page.js`   | `{ slug: string }`  |
| `app/blog/[...slug]/page.js`   | `{ slug: string[] }`  |
| `app/blog/[[...slug]]/page.js`   | `{ slug?: string[] }`  |
|  `app/[categoryId]/[itemId]/page.js` | `{ categoryId: string,itemId: string` |

::: tip
以上功能未来可能凭借[TS插件](https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin)就能实现
:::

## 接下来
我们建议您去看以下这些模块学习更多与本章相关的内容.
* [链接与导航](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)
* [`generateStaticParams()`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
