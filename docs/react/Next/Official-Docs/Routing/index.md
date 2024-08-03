# 路由基础

每个应用的基本骨架,都是由路由构成的.这篇文章是想向你讲述一些关于网页路由的基本概念,以及在Next.js当中,路由又是怎样的.

## 术语
首先你会看到,以下这些术语贯彻于整篇教程.下图是快速大概指引:
![terminology](./imgs/terminology-component-tree.jpg)
- **树:** 一种用来描述分层结构的可视化术语.举例说,组件树就有父组件和子组件.而文件夹和文件,也可以说是树.
- **子树:** 树的一部分就叫子树.始于新的根节点(Root),终于叶节点(Leave).
- **根节点:** 树或子树最顶部的节点叫根节点,比如说根布局(Root Layout).
- **叶子节点:** 子树中没有子节点的那些节点,叫叶子节点.比如说URL最后的那个部分.(/dashboard/settings/password 里面的password)
![url-term](./imgs//terminology-url-anatomy.jpg)
- **URL部分:** 用斜杠分开的,URL路径中的其中一个部分.
- **URL路径:** 由URL部分组成的,URL域名后面的一大串.(图里的acme.com后面,两个segment组成了一个路径)

## `app` 路由器
在Next v13中推出了一个新的应用路由器(App Router).它基于React服务器组件搭建,支持共享布局,嵌套路由,加载中状态,错误处理以及其它许多新的功能.  
说那么多,就是一个文件夹`app`.这个文件夹配合`pages`目录,从而实现增量适配应用.这样做的原因是,保持之前`pages`里面的路由行为的同时,在`app`里面的路由,具备一些新添加的功能.(就是`app`里的路由有新功能的同时,`pages`里的路由保持和v13之前功能一致(旧)).  
如果你的应用中使用了`pages`目录,那你可以通过[Pages Router](https://nextjs.org/docs/pages/building-your-application/routing)了解更多.(??? 给我导航去了目录是什么意思)
::: tip
App Router的优先级比Pages Router高.建议不同目录下的路由取不同的名字(不要有相同的URL,就是`app`和`pages`目录下尽量不要有相同名字的文件夹名或文件名).否则会在打包时因冲突而报错.  
:::
![directories](./imgs/next-router-directories.jpg)

默认情况下,`app`目录下的组件都是[React服务器组件](https://nextjs.org/docs/app/building-your-application/rendering/server-components).这是处于性能优化方面考虑的,在该目录中你也当然可以手动将它们改变为[客户端组件](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

::: tip
如果你对服务器组件不是很熟悉,[可以看看这里.](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
:::

## 文件夹和文件在应用中的地位
Next.js用的是基于文件系统的路由实现,因此具有以下特性:
- **文件夹**用来定义路由.一个路由就是处于嵌套文件夹内的单独路径(single path of nested folders),根据文件夹的结构,由顶的根目录,至底的包括一个`page.js`的,最终叶子文件夹来构成URL.
[可以看看这里](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)
???看得我云里雾里的. 文件夹就是segment,文件夹下有`page.js`就展示该页面,否则继续往下找.    
先有文件夹,后有`page.js`,最后才有URL.也可以说是面向程序员的URL.
- **文件**用来搭建UI界面,路由部分该显示什么就由文件决定.[更多相关](https://nextjs.org/docs/app/building-your-application/routing#file-conventions)

## 路由分块(Route Segments)
(上面的路由部分,跟这里的分块概念是一样的,都是segment的翻译)  
路由中的每个文件夹都代表着一个**路由分块**.每个路由分块都会跟URL路径中的部分所匹配.(就是文件夹名和URL的部分相匹配)
![segments](./imgs/route-segments-to-path-segments.jpg)

## 嵌套路由
路由的嵌套,在Next中就是文件夹的嵌套.举例说你想添加`/dashboard/settings`这个路由,实际就是在`app`目录下分别创建`dashboard`文件夹,再在`dashboard`下创建`settings`文件夹.  
`/dashboard/settings`这个路由由三个分块组成:
- `/`(根分块)
- `/dashboard`(分块)
- `settings`(叶子分块)

## 文件命名习惯
Nextjs中的文件名也有大智慧,不是随便起的.一些名字有特定的功能,就像js中的keyword关键字.
| 文件名 |  用途 | 
| ---- | --- | 
| `layout` | 当前分块下共用的页面布局 | 
| `page` | 路由具体展现的内容,允许通过URL访问到对应内容 | 
| `loading` | 页面加载时展示的内容 | 
|  `not-found` |  URL和文件名不对应时需要展示的内容(URL找不到page)  |
| `error` |  页面渲染出错时需要展示的内容  |
|  `global-error` |  任意页面出现错误时需要展示的内容  |
|  `route` |  服务器端提供的接口(???自建服务器是不是有救了?!?!)  |
|  `template` |  专门用来重渲染的布局UI  |
|  `default` |  平行路由的后补([Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes))  |

::: tip
`.js`,`.jsx`或是`.tsx`这些文件后缀也适用于以上这些特殊文件.  
(本质就是React UI组件,而它都能通过以上文件定义.)
:::

## 组件层级
同样是React组件,它们在Next的结构下具有不同的渲染层级.(先渲染哪些,哪些又嵌套在哪些之中)
- `layout.js`
- `template.js`
- `error.js` (React error boundary)
- `loading.js` (React suspense boundary)
- `not-found.js` (React error boundary)
- `page.js`或是嵌套的`layout.js`

![files-hierarchy](./imgs/file-conventions-component-hierarchy.jpg)

在嵌套的路由中,一个分块的所有组件,都会嵌套展示于它父分块的组件当中.

![nested-segments](./imgs/nested-file-conventions-component-hierarchy.jpg)

## 文件共存(Colocation)
除了一些特殊的文件外,你可以选择把一些其它的文件放在`app`目录下的文件夹当中.(像组件,样式,测试文件等等.)  
之所以能够这样,是因为尽管我们可以在文件夹中定义展示路由,最终可以展示的,或者说可以通过URL访问的内容,也只是`page.js`或`route.js`返回的UI.
![Files-Colocation](./imgs/project-organization-colocation.jpg)
[更多关于项目组织和文件共存的内容](https://nextjs.org/docs/app/building-your-application/routing/colocation)

## 高级路由模式
其实App Router的功能不仅于此,它还额外实现了一些高级的路由模式.它们包括:
- **平行路由(Parellel Routes):** 允许你在同一个视图中展示两个或多个的页面,每个路由中又可以独立的跳转到其它页面当中.(?)你可以为那些,具有独立分导航的视图添加这个功能.比如主页面Dashboard.
- **穿插路由(Intercepting Routes):** 允许你在一个路由中穿插,在其它路由上下文中展示.比如说你所在的路由中具有重要信息,而又不想因为路由的跳转而使这些信息消失,那就通过改变新来的Route,穿插到当前而保留这些信息.举例就是:既要看到所有的任务,又要修改当中的一个任务;或者说在评论中打开一张图片.

你可以用以上两种路由构建更为丰富且复杂的UI.这两种模式对于过去的开发者而言是需要花费不少的精力才能实现的.

## 接下来
看完概况,你应该对前端路由有一定的了解了.试着跟随以下的步骤,搭建属于你自己的路由吧!
* [路由定义](defining-routes.md)
* [页面及布局](pages-and-layouts.md)
* [链接和导航](linking-and-navigating.md)
* [加载中UI和流(Streaming)](loading-and-streaming.md)
* [错误处理](error-handling.md)
* [重定向](redirect.md)
* [路由分组](route-groups.md)
* 项目组织
* 动态路由
* 平行路由
* 穿插路由
* 路由处理器
* 中间件
* 国际化