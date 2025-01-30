# 为什么选择Next.js?

> https://dev.to/kharkizi/nextjs-unleashing-the-power-of-performance-and-seo-for-web-development-2go  
> 作者:Kha Nguyễn Viết  
> 简要翻译,不完全准确;老生常谈,从未深入的框架,至今分不清next,nuxt,nest.听说对应react,vue,node.  
> 23:45-0:04

**Next是React的又一层抽象,自带了各种构建网页应用需要的依赖.提供了一些额外的好处.**  

## 1.服务器端渲染及静态网页生成(Server-Side Rendering & Static Site Generation)
Next.js支持SSR和SSG,网页可以在服务器端渲染完再发给客户端(SSR),或直接就是完整的内容发给客户端(SSG).有SEO的好处(Search Engine Optimization),搜索引擎能找到,提高内容可查找性.(根据需求选择使用).  

## 2. SEO
前面说过了,SSR能提高搜索引擎上的可搜索性.更容易被找到,某些数据(比如访问量)可以提高.

## 3.整合了React和Typescript
是React上一层的抽象,支持React再正常不过.TS则可以根据需要自行选择.

## 4.简易路由
自带路由系统,文件名即实际URL路径名.可动态可hook自定义,灵活性强.也是自带的,会用就很有用.

## 5.容易部署
和Vercel,Netlify,AWS Amplify这些部署服务器比较契合.项目可以通过这些,比较简单的实际部署到生产环境.

## 6.社区强大,教学文档丰富
多人用,教程也很多很详细,想学很容易找到资源.踩坑也不怕没人孤独.(???多到不知哪个好,除了official的)

## 7.跟其它技术的整合还算灵活
像GraphQL,Redux,CSS-in-JS这些库要用在Next项目还不算太难.还是根据实际需求再选这些吧.

## 结论
Next.js是个强大的网页开发工具:灵活,多功能,为开发者提供巨大便利.  
**如果你要构建一定规模的应用**,Next是个不错选择.(不是绑定React了吗?)