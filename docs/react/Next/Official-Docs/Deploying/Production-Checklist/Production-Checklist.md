
# 部署前后的一些准备
> [原文地址](https://nextjs.org/docs/app/building-your-application/deploying/production-checklist)  
> 为什么想翻这篇? 是想了解如何运用Next,从构建项目开始,到开发,到后期部署.我们需要做些什么,Next为我们做了什么.  
> 算是一个开发完整流程的了解.

在将Next.js应用发布到生产环境时,我们需要实现一些优化操作,遵循一些模式,从而提升用户体验,应用性能及提高应用安全性.

## 自动优化
以下优化操作是Next.js自动完成的,你不需手动配置:
- [服务器组件](https://nextjs.org/docs/app/building-your-application/rendering/server-components): Next v15开始默认启用服务器组件.服务器组件是在服务器上运行的,无需等待JS代码在客户端上执行渲染.这样它们的存在就能减少客户端JS包的体积.当然,你也可以按需启用[客户端组件](https://nextjs.org/docs/app/building-your-application/rendering/client-components)来实现交互.
- [代码分割](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works): Next.js会自动按路由分块为单位,把代码分割成多个文件.你也可以采用[懒加载](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)客户端组件,或是三方库实现代码分割.
- [预获取](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching): 当路由上的链接进入到用户的视窗时,Next会在后台预获取该路由.从而在用户点击链接时,能快速响应.你也可以手动禁用掉这个功能.
- [静态渲染](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default): Next会在构建时,在服务器上静态渲染服务器组件和客户端组件,并对渲染结果进行缓存,从而提升应用性能.你也可以为特定用户设置[动态渲染](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering)
- [缓存](https://nextjs.org/docs/app/building-your-application/caching): Next会对数据请求,组件渲染结果,静态资源等等都进行缓存,从而减少发送到服务器,数据库,后端服务的请求数量.如果需要,你可以手动取消这些缓存功能.  

以上的默认行为都是为了提升您的应用性能,减少每次网络请求所需要传送的数据量及代价.

## 开发阶段
开发阶段,我们建议您使用Next提供的以下特性,以确保最佳的性能表现及用户体验:

### 路由及渲染
- [布局文件](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates#layouts): 使用布局文件创建共享的UI组件,并启用导航时的[部分渲染功能](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)
- [`<Link>`组件](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#link-component):  利用`<Link>`组件实现客户端导航并预获取路由内容.
- [错误处理](https://nextjs.org/docs/app/building-your-application/routing/error-handling): 通过创建自定义的出错展示页面,优雅地处理生产环境中可能会出现的[各种错误](https://nextjs.org/docs/app/building-your-application/routing/error-handling),及[路由访问错误404](https://nextjs.org/docs/app/api-reference/file-conventions/not-found).
- [复合模式](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns): 遵顼我们推荐的,服务器组件和客户端组件的复合模式,并检查`"use client"`指令的边界,可以有效减少客户端JS包的体积.
- [动态APIs](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-apis): 小心使用了像`cookies`方法和`searchParams`属性这些动态API的时候,它们的存在会把该路由变更为动态渲染.(甚者你在根布局文件下使用的话,整个应用都变成动态渲染的了).使用动态API时,合理放置使用它们的位置,限制它们影响的范围,需要时把它们包裹到`<Suspense>`中,都是非常有必要的.

::: tip
[部分预渲染](https://nextjs.org/blog/next-14#partial-prerendering-preview)可以使路由的某些部分变为动态渲染,而不是将整个路由都变为动态渲染.
:::

### 数据获取与缓存
- 服务器组件: 利用好服务器组件可以直接从服务器上获取数据这个优势.
- [路由处理器](https://nextjs.org/docs/app/building-your-application/routing/route-handlers): 客户端组件可以利用路由处理其访问后端资源.不过,不要在服务器组件里使用路由处理器,避免额外的服务器请求.
- [流式渲染](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming): 利用loading UI和`<Suspense>`,渐进式地将页面内容从服务器传送到客户端,这样也能避免数据获取与页面渲染进程发生冲突.
- [平行的数据获取](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#parallel-and-sequential-data-fetching): 合适利用平行获取数据可以减少网络流水.当然也可以考虑使用[数据预加载](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#preloading-data)功能.
- [数据缓存](https://nextjs.org/docs/app/building-your-application/caching#data-cache): 确保一下你的数据请求结果是否需要缓存.确保那些没有采用`fetch`方法请求获得的数据是否会被缓存下来.
- [静态图片](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets): 利用`public`目录,自动对应用的静态资源进行缓存.(比如图片)

### 界面及可访问性
- [表格与校验](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms):利用Server Actions来实现表单提交处理,服务器端校验,及后续错误提示.
- [字体模块](https://nextjs.org/docs/app/building-your-application/optimizing/fonts): Next提供的字体模块,可以把字体文件跟其它静态资源一样被处理,并移除字体资源的外部网络请求,减少字体变化导致的布局切换.
- [`<Image>`组件](https://nextjs.org/docs/app/building-your-application/optimizing/images): 你可以使用`<Image>`组件,自动优化图片资源,放置布局切换,并以WebP或AVIF格式输出.
- [`Script`组件](https://nextjs.org/docs/app/building-your-application/optimizing/scripts): 使用`<Script>`组件来优化加载三方脚本.它会自动延迟scripts的执行,防止它们阻塞主线程.
- [ESLint](https://nextjs.org/docs/architecture/accessibility#linting): 使用内置的`eslint-plugin-jsx-ally`插件,尽早捕获并修正网页访问性的问题.

### 安全性
- [数据污染Tainting](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#preventing-sensitive-data-from-being-exposed-to-the-client): 通过对传输数据对象或某些值进行"污染",来防止敏感数据暴露给客户端.
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#authentication-and-authorization): 确保可以调用Server Actions的用户是经过授权的.具体可以参考[关于安全性的实践建议](https://nextjs.org/blog/security-nextjs-server-components-actions)
- [环境变量](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables): 确保你所有的环境变量文件`.env.*`都添加到了`.gitignore`文件中.并遵循只有公开的公共变量,前缀为`NEXT_PUBLIC_`的命名规范.
- [内容安全策略](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy): 为防止应用被像XSS,clickjacking,及各种代码注入的攻击,你可以为应用设置内容安全策略.

### 元数据及SEO
- [元数据API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata): 合理利用Next为您提供的各种元数据API,如为页面添加titles,descriptions及其它元数据,从而提升应用的SEO.
- [Open Graph(OG)图片](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image): 为应用创建OG图片,以应对社交分享场景.(?我在说什么, for social sharing)
- [Sitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)和[Robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots): 通过为应用生成sitemaps和robots文件,帮助搜索引擎更好地爬取并索引您的网页内容.

### 类型安全
- Typescript和[TS 插件](https://nextjs.org/docs/app/api-reference/config/typescript): 使用Typescript和TS插件,编写类型安全的代码,及早捕获错误.

## 发布到生产阶段之前
发布前,你可以本地使用`next build`命令,本地构建应用,捕获任意可能的错误,然后用`next start`命令,对应用在"类生产"环境下的性能表现进行评估.

### 核心Web-vitals
- [Lighthouse](https://developers.google.com/web/tools/lighthouse): 使用lighthouse工具,更好地理解你自己开发的应用体验,并发现可以提升的地方.这只是一个对实际环境的模拟测试,你应该注重的点是工具提供的,关于页面的核心性能数据.(比如Web-vitals)
- [`useReportWebVitals` hook](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals): 利用这个hook,把Core Web Vitals性能数据发送到分析工具/网站去.

### 打包分析
使用`@next/bundle-analyzer`插件,可以分析打包后的JS体积,分辨项目内存在的,可能影响应用性能的大体积模块和依赖.  
此外,以下插件可以帮助你新依赖添加时对应用的影响:
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [Package Phobia](https://packagephobia.com/)
- [Bundle phobia](https://bundlephobia.com/)
- [bundlejs](https://bundlejs.com/)

## 部署之后
部署之后,你可以根据你具体部署的服务器,利用起它为我们提供的功能,更好地监控应用运行情况及应用性能表现.  

如果你部署到了Vercel上,我们建议您使用以下功能:
- [数据分析](https://vercel.com/analytics?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs): 内置的数据分析工具,包括访客数,页面查看率等其它相关数据.
- [速度分析](https://vercel.com/docs/speed-insights?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs): 基于访客数据的,应用真实性能表现.从而让你知道应用实际表现情况.
- [日志记录](https://vercel.com/docs/observability/runtime-logs?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs): 运行时及活动日志的存在,可以让你调试或监控生产环境中的应用.或者你还可以利用[这里提供的一系列三方库工具和服务](https://vercel.com/integrations?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs)来记录应用运行情况.

::: tip
部署到Vercel的最佳实践,可以参考[Vercel官方提供的指引](https://vercel.com/docs/production-checklist?utm_source=next-site&utm_campaign=nextjs-docs&utm_medium=docs)
::: 

如果你能遵循以上这些最佳实践,你就能构建出更快,更可靠,更安全的Next.js应用.

--- 
感谢你能看到这里!
