# 项目组织及文件存放

除了前文的路由文件夹及文件的命名习惯,Next其实是一个开放度很高的(unopinionated)框架,允许你以各种各样的方式组织和存放你的项目文件.  
本文介绍一些框架的默认行为及特性,从而帮助你更好的组织项目结构.
- [默认安全的文件共存(Safe colocation?)](#默认安全的文件共存)
- [项目组织特性](#项目组织特性)
- [项目组织策略](#项目组织策略)

## 默认安全的文件共存
在`app`文件夹内,嵌套的文件结构实际上就是对应的路由结构.  
每个文件夹都代表着一个路由分块,都会有与之对应的,实际URL路径的分块.(路由分组及一些特殊情况是例外)  
然而尽管路由结构由文件夹结构所定义,一个路由分块是否公开可访问,取决于对应文件夹内是否存在`page.js`或`route.js`文件.(是否有可访问的内容,page是展示,route是接口返回数据?)
![routes-not-accessible](imgs/project-organization-not-routable.jpg)
也就是说,一般的非特殊命名的文件,是可以存放于`app`目录之下的,它们不会突然地就被公开访问到.(对比`page.js`等conventional files)
![routes-accessibility](imgs/project-organization-accessibility.jpg)

::: tip
- 以上行为仅限于`app`目录下的路由组织.任意`pages`目录下的文件都会被认为是可访问的路由.(真的吗?)
- 你可以将必要的文件放在`app`目录下而不被外界访问,但这也不是必须的.[把一些需要的文件放在`app`目录以外组织](#将项目文件存放于app之外)也行,看你喜欢.
:::

## 项目组织特性
Next.js为您提供了一些特性,帮助你更好的组织项目.

### 私有文件夹
`_folderName`,这种在文件夹名前添加了下划线的,就是私有文件夹.  
这样的命名告诉了Next,文件夹的内容是一些私人定制化实现(private implementation),不需要作为应用的路由被看待.也就是说,整个文件夹,包括其子文件夹的内容都不作为路由部分.
![private-folders](imgs/project-organization-private-folders.jpg)
由于`app`目录下的文件本来就可以安全的共存,私有文件夹甚至不需要这个特性(not required for colocation).  
不过,以下场景下私有文件夹还是很有用的:
- 区分UI逻辑和路由逻辑
- 统一(Consistently?)组织项目内部文件及来自Next生态的相关文件(?)
- 在编辑器内实现文件夹的排序及分组(?)
- 避免自己的项目命名,与未来Next特性文件命名冲突.(今天的`page`,明天就变成`site`(举例,你也说不准未来会有什么特殊文件命名))

::: tip
- 下划线开头作为私有文件夹的命名方式其实不限于Next框架,在任何系统中我们都推荐,将下划线开头命名,作为私有文件夹的标记.
- 下划线通过URL编码加密的结果是`%5F`,这意味着你可以通过将文件夹命名为`%5FfolderName`,从而使`/_fileName`这个路由变得可以访问.(什么叛逆行为.又要私有又要下划线作为路径分块!?!?)
- 如果你不太愿意使用私有文件夹,那我们建议您去了解一些Next内,特殊的命名习惯,用以避免不必要的命名冲突.
:::

### 路由分组
`(fileName)`,用括号将文件夹名括起来,就表示这是一个路由分组.  
它的意思就是这个目录出于方便代码组织的原因,把相关路由放到同一个地方,而不被URL路径所包含.  
![organization-route-groups](imgs/project-organization-route-groups.jpg)
路由分组的作用是:
- 根据路由内容划分组,比如网站的不同部分,网页的不同内容,或是不同的网页制作团队.
- 在相同的路由分块内使用嵌套布局
    - 同一个分块内使用多个嵌套布局,也可以是多个根布局
    - 在一个共用的分块内,为整个子路由树添加一个通用的布局
[怎么用其实也说过,这里属于复述了](route-groups.md#路由分组)

### `src`目录
Next支持将整个应用的代码都存放于一个叫`src`的可选目录之下(包括`app`目录).这样做的原因是可以将应用的代码,跟项目的配置文件所区分开来.(像`next.config.js`,`package.json`这些一般就在项目的根目录内)
![optional-src-directory](imgs/project-organization-src-directory.jpg)

### 模块路径别名(Aliases)
Next支持模块路径别名的功能.这在引入一些嵌套很深的文件时很有用,而且可读性也会增加:
```js
// app/dashboard/settings/analytics/page.js
// 用别名前
import { Button } from '../../../components/button'

//用别名后
import { Button } from '@/components/button'
```

## 项目组织策略
Next项目组织的方式没有对错之分.  
接着我们来介绍一些比较"高级"的常用组织策略.我们建议您选择采取其中一种策略,然后在项目当中贯彻使用它.
::: tip
以下的例子中,我们会用到`components`和`libs`文件夹,其实更多只是用于告知(placeholder),而非强迫.您的项目当然可以使用其它更加具体的文件夹命名,比如`ui`,`utils`,`hooks`,`style`等等.怎么方便怎么来.
:::

### 将项目文件存放于`app`之外
这个策略的主要目的是,将`app`目录仅用于路由系统,而把其它组成部分都放在`app`之外另外组织.(????)
![outside-app-folder](imgs/project-organization-project-root.jpg)

### 将项目文件全都放在`app`里面
如标题所说,什么文件都放到`app`里统一管理.
![inside-app-folder](imgs/project-organization-app-root.jpg)

### 根据文件特性或路由区分项目文件
一些全局通用的应用代码放到`app`的顶层目录下,然后根据代码用途,路由相关性,再将文件夹进行下一步区分.
![feature-route-splitting](imgs/project-organization-app-root-split.jpg)

## 接下来
* [路由定义](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)
* [路由分组](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
* [`src`目录](https://nextjs.org/docs/app/building-your-application/configuring/src-directory)
* [绝对路径导入和模块路径别名](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)  
(前两个都翻译过了,这里还是链接去next官网吧.)
