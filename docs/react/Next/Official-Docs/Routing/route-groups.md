# 路由分组

在`app`目录下,文件夹之间的嵌套,实际就是URL分块的区分.不过,你可以使用标记,将某个文件夹划分为*路由组(Route Group)*,从而将它从路由URL路径中区分开来.  
这样做的原因,是可以让你在将路由分块和项目文件划分为逻辑组的同时,不影响实际URL的路径结构.(?有点绕口,保留文件基础的URL分层的同时,实现分组?)  

路由分组在以下情形尤为有用:
- 根据路由的功能划分为多个组,比如根据网站分块,网页内容,或是团队制作,区分路由组.
- 允许在同等级的分块中使用嵌套的布局文件(?)
    - 在同一个分块内创建多个嵌套布局,也可以是多个根布局
    - 在一个共用的分块里,为整个子路由树添加一个布局.(?都是中文为什么我看不懂?)

## 使用习惯
路由分组,就是将文件夹的名字用括号包裹起来:`(folderName)`(???感觉把我前面学的东西全报废了???)

## 使用例子
### 不影响URL路径的前提下组织路由
为了在不影响URL路径的前提下组织路由,我们可以创建一个路由组,将所有相关的路由放到一起.用括号括起来的文件夹会被URL省略,不会出现在URL上:(比如下面的`(marketing)`和`(shop)`)

![route-group-overview](imgs/route-group-organisation.jpg)
尽管`(marketing)`和`(shop)`里面的路由处于同一层级的URL上(?同一父分块,都是/目录下的内容),你可以分别在它们的文件夹内添加`layout.js`,从而实现不同的布局.
![route-group-layouts](imgs/route-group-multiple-layouts.jpg)

### 将特定的分块适用于某一布局
如果要将特定的一些路由,改用为某个相同的布局,你可以创建一个路由分组(比如以下的`(shop)`),然后将这些路由(`acount`和`cart`)放到这个分组之内.在这个分组之外的路由不会用到这个特定的布局.(`checkout`):
![groups-opt-in-layouts](imgs/route-group-opt-in-layouts.jpg)

### 创建多个根布局
如果要使用多个根布局,你需要先删除顶层的`app/layout.js`,再将路由进行分组,最后在各个分组内添加专属于每个组的`layout.js`.这对于那些需要同一网页,但内容完全不同的应用可能有用.当然了,**每个根布局下,还是要包含到`<html>`和`<body>`标签的.**
![groups-with-multiple-rootlayout](imgs/route-group-multiple-root-layouts.jpg)
上图中`(marketing)/layout.js`和`(shop)/layout.js`都是根布局.

::: tip
- 路由的分组名称,除了为了方便组织外并无它用.反正它们都不会影响到实际的URL.
- 路由分组之间的路由,不应产生相同URL.(不能因有分组而创建同级的相同文件夹名.)  
    用例子来说就是,`(marketing)/about/page.js`和`(shop)/about/page.js`两个文件的路径,解析出来的URL是相同的,都是`/about/page`,这就会报错了.尽管分组不同,但最终的URL解析出来还是相同的.
- 如果你用了多个根布局,然后把顶层的`layout.js`也删除掉了,那你应用的入口`app/page.js`至少要放到其中一个分组中.比如`app/(marketing)/page.js`.
- 不同根布局的路由之间切换时,会加载整个页面(跟客户端导航行为相反).比如说你从使用了`app/(shop)/layout.js`的`/cart`路由,跳转到使用了`app/(marketing)/layout.js`的`/blog`,将导致整个页面的加载.这种不太好的行为只会出现在不同根布局之间的路由切换.
:::