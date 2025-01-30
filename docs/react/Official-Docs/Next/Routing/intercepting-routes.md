# 穿插路由
穿插路由(Intercepting routes)的意思是,允许你在当前布局下,加载来自应用另一部分的路由.这种路由行为(paradigm)用于不想用户切换上下文环境下,展示另一个路由的内容.  
比如说,你点击了评论区的一张照片,你可以以弹窗的形式展示它,将评论区覆盖在底部.这里就可以用到穿插路由:用`/photo/123`路由,暂时将`/feed`路由给覆盖起来.
![intercept-routes](imgs/intercepting-routes-soft-navigate.jpg)
而如果直接通过分享而来的URL访问图片,或是打开了图片后进行页面刷新,页面则会展示整张图片而不是之前的弹窗.这种情况下不应产生路由穿插的情况.
![no-intercept-routes](imgs/intercepting-routes-hard-navigate.jpg)

## 使用习惯
`(..)folderName`,这是定义穿插路由的方法.这跟相对路径的命名方式相似(`../`),不过这次是针对分块而已.  
你可以这样用:
- `(.)`,用来匹配相同等级的分块(segments)
- `(..)`,用来匹配上一级的分块
- `(..)(..)`,用来匹配上两级的分块
- `(...)`,用来匹配根目录`app`下的分块

比如说你要在`feed`分块中,通过创建`(..)photo`目录的方式,穿插`photo`分块:
![intercept-with-photo](imgs/intercepted-routes-files.jpg)

::: tip
`(..)`这种命名习惯是基于路由分块的,不是基于文件系统的.
:::

## 使用例子
### 弹窗
穿插路由可以搭配平行路由使用,用来创建弹窗.这能解决一些创建目录时经常遇到的问题,比如:
- 使弹窗的内容,通过URL的方式,变得可以共享(shareable)
- 页面刷新时能够维持上下文,而不是将弹窗关掉
- 向后导航时关闭弹窗,而不时返回到先前的路由
- 向前导航时,重新打开弹窗

思考以下的界面展示:用户既可以通过客户端导航的方式,在图片展(gallery)种打开图片弹窗,也可以直接通过URL,打开对应的图片:
![modal-example](imgs/intercepted-routes-modal-example.jpg)

上面的例子种,`photo`分块可以使用`(..)`匹配器.这是因为`@modal`只是一个插槽而不是一个实在的分块.换句话说,尽管看起来`photo`路由和`(..)photo`路由相差了两级,但实际上只是相差了一级.(所以用了`(..)`表示上一级)

你可以看看[平行路由的文档](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals),或者去[这个实例](https://github.com/vercel-labs/nextgram)了解一下.
::: tip
应用的另一例子是:登录弹窗既可以通过顶部导航栏打开(or somewhere else),也可以通过专门的`/login`路径访问专门的页面,或是在侧边栏弹窗内打开购物车.(?最后这个是什么意思)
:::

## 接下来
你可以通过结合平行路由和穿插路由的知识,创建自己的弹窗.
* [平行路由](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)