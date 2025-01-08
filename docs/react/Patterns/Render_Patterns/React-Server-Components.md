# React服务器组件
> [原文](https://www.patterns.dev/react/react-server-components)  
> 翻译这篇文章的时候React已经v19了.v18的内容我就自动忽略了.

React团队正在开发着0打包体积的服务器组件功能,旨在将服务器驱动的心智模式(server-driven mental model)运用到用户体验上.这跟服务器渲染组件的概念大有不同,可以获得更小的客户端JS打包代码体积.  

这个开发方向是令人振奋的,虽然目前还未能用到生产环境,但我们认为您应该持续关注这方面消息.你可能会对以下内容感兴趣:

* [Dan Abramov和Lauren Tan的演讲](https://www.youtube.com/watch?v=TQQPAU21ZUw&feature=emb_title),以及这个[RFC](https://github.com/reactjs/rfcs/blob/bf51f8755ddb38d92e23ad415fc4e3c02b95b331/text/0000-server-components.md).

## 服务器端渲染的一些限制
如今的服务器端渲染客户端JS代码的方法并不是最优的.组件代码在服务器上被渲染成HTML字符串,这些字符串被发送到浏览器上,之后被解析渲染出来.结果看起来是不错的,首屏有意义及最大有意义渲染所需的时间(FCP,LCP)都很小.  

不过,JS代码仍旧需要从服务器上获取,通过注水的方式使得页面内容可交互.服务器端渲染一般只用来提升首屏加载性能,而完成注水后我们就很少利用到这个技术了.  

**值得注意的是:**  
尽管我们可以构建一个完全使用SSR的React应用,直接不在客户端上注水了,可是,以这种模式实现的,互动性强的应用,很可能就要超出React范围了.而如果采用了这种"混合"模式,运用服务器组件的话,就能以组件的单位决定,前面提过的,可能会超出React范围的内容界定.  

有了服务器组件,我们可以频繁地重新从服务器上获取组件代码.应用虽然有些组件,数据更新时就要重渲染,但它是在服务器上进行的,这样可以限制发送给客户端所需的代码量.

> **"[RFC]: 开发者经常要决定使用什么三方库来渲染网页内容.用库来渲染一些Markdown,或格式化日期数据对于开发者而言确实会更方便,但后果是,扩大了应用代码体积,影响了用户性能."**

```JS
// NoteWithMarkdown.js
// 没有服务器组件时渲染markdown内容,三方库的体积:
import marked from "marked"; // 35.9K (11.2K gzipped)
import sanitizeHtml from "sanitize-html"; // 206K (63.3K gzipped)

function NoteWithMarkdown({text}) {
  const html = sanitizeHtml(marked(text));
  return (/* render */);
}
```

## 服务器组件
React服务器组件,弥补了服务器端渲染的一些缺点:不增加打包体积的前提下,增加渲染了一层中间抽象的格式.这不仅可让不丢失状态的情况下,结合服务器端树和客户端树,还能让组件的规模逐渐变大.  

服务器组件不是用来取代SSR的.我们可以配合使用它们,利用服务器组件可以快速渲染出一个中间层格式,利用服务器端渲染,提升首屏渲染.我们服务器渲染客户端组件,而用服务器组件,参考SSR获取数据的机制,对组件内容进行更新.  

这样可以大幅度减少打包后的代码体积.初步估计能减少个18-29%.而React团队仍致力于这方面的工作,力求进一步的提升.

> **[RFC]: 我们可以直接把上面的代码,完整迁移到服务器组件当中,保持原有功能的前提下,不将包发送给客户端 - 这样起码减少了240K的代码量(未被压缩的情况下).**
```JS
// NoteWithMarkdown.server.js
import marked from "marked"; // zero bundle size
import sanitizeHtml from "sanitize-html"; // zero bundle size

function NoteWithMarkdown({text}) {
  // same as before
}

```

## 自动代码分割
使用代码分割,只将用户用到的代码发送给用户,向来是一种好方法.通过代码分割,可以把应用代码分成多个小块,尽可能少地发送给客户端.在服务器组件诞生之前,开发者可能需要调用`React.lazy()`API,手动划分"分割点",或者利用一整套打包工具提供的功能才能实现,比如通过划分路由/页面,创建不同的新快.
```JS
// PhotoRenderer.js
import React from 'react';

// 当需要渲染到客户端上时,以下的一种才会开始渲染
const OldPhotoRenderer = React.lazy(() => import("./OldPhotoRenderer.js"));
const NewPhotoRenderer = React.lazy(() => import("./NewPhotoRenderer.js"));

function Photo(props) {
  // Switch on feature flags, logged in/out, type of content, etc:
  //根据标识,登入登出,内容的类型采用不同的渲染器
  if (FeatureFlags.useNewPhotoRenderer) {
    return <NewPhotoRenderer {...props} />;
  } else {
    return <PhotoRenderer {...props} />;
  }
}
```

**代码分割可能遇到的困难会是:**  
* 如果你没有采用一些像Next这样的框架(meta-framework),你可能就要手动编写这种优化代码了,手动将`import`替换成动态导入.
* 用户用到才开始加载组件的方法可能会影响到用户体验

服务器组件自带代码分块功能,将客户端组件内的导入都视为"分割点".也让开发者可以选择那些组件需要更早地被渲染(在服务器上进行),客户端更早地在渲染过程中获取某些组件代码.

```js
// PhotoRenderer.js
import React from "react";

// one of these will start loading *once rendered and streamed to the client*:
// 区别是省掉了lazy, 动态引入的内容
import OldPhotoRenderer from "./OldPhotoRenderer.client.js";
import NewPhotoRenderer from "./NewPhotoRenderer.client.js";

function Photo(props) {
  // Switch on feature flags, logged in/out, type of content, etc:
  if (FeatureFlags.useNewPhotoRenderer) {
    return <NewPhotoRenderer {...props} />;
  } else {
    return <PhotoRenderer {...props} />;
  }
}

```

## 服务器组件将来会取代Next的SSR吗?
不会,它们其实很不同.服务器组件的初次采用及后续的功能实现,进一步开发都需要使用Next这样的meta-framework.  

借用Dan Abramov的话,对SSR和服务器组件的区别进行一个总结:
* **服务器组件的代码不会发送给客户端.** React实现的SSR,组件代码都会以打包的方式发送给客户端,而这个过程可能会使网站的首次可交互时间变长.
* **服务器组件可在组件树的任意位置读取到后端代码.** 用Next的话,你可用`getServerProps()`访问后端,不过限制是你必须页面的顶端使用.npm组件是实现不了这个功能的.
* **服务器组件代码可在维持客户端状态的状态下,重新从服务器端获取.** 因为其中的传输机制更为丰富与复杂,而不仅限于HTML字符串.这种机制可以不改变组件状态(比如搜索框输入的内容/聚焦/文本选择等)的同时,重新获取某些由服务器端渲染的部分片段(比如搜索结果列表).  

早期如果要整合服务器组件功能,需要webpack组件实现以下功能:
* 定位所有的客户端组件
* 构建匹配关系,将块ID对应到块URL上
* Node.js加载器,将客户端内的导入内容,替换成以上匹配规则
* 有些插件还需要更多更复杂的适配条件(比如还要结合配置路由规则),因此我们还是建议您使用像Next这样的框架实现这个功能.

正如Dan所说,服务器组件的功能其实是为了让Next框架变得更好的.

## 更多相关学习资源及使用反馈
更多服务器组件相关内容,我的建议是看[Dan和Lauren的这个演讲](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html),自己上手[尝试一下](http://github.com/reactjs/server-components-demo).十分感谢Sebastian Markbåge,Lauren Tan, Joseph Savnoa和Dan Abramov对服务器组件开发的贡献!

相关内容:
* [Lauren Tan谈服务器组件](https://twitter.com/sugarpirate_/status/1341141198258524163)
* [Sophie Alpert的解释](https://twitter.com/sophiebits/status/1341098388062756867)
* [Sebastian Markbåge关于注水的讨论](https://twitter.com/sebmarkbage/status/1341102430147276803)
* [HN discussion on thread](https://news.ycombinator.com/item?id=25497065)