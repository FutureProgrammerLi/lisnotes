# 运行时环境
Next.js有两个服务器运行时环境:
- Node.js 运行时(默认环境),在这你可以访问到所有Node.js提供的API,以及来自该生态环境的所有匹配包.
- Edge运行时,相对Node提供的API可能会少一点了.([Edge提供的APIs](https://nextjs.org/docs/app/api-reference/edge))

## 使用场景
- Node运行时用于渲染你的应用
- Edge运行时用于中间件执行(执行一些路由规则,像重定向,重写,或是头部内容设置)

## 警惕点
- Edge运行时暂不支持所有的Node APIs.一些包可能因此不能正常工作.[可以去看看Edge环境不支持的一些API.](https://nextjs.org/docs/app/api-reference/edge#unsupported-apis)
- Edge运行时不支持增量静态重生成(?ISR, Incremental Static Regeneration)
- 两个运行时都支持流式渲染,具体执行情况依赖于你的基础部署情况.

## 接下来
你可以去看看Edge运行时支持的一些API.
- [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)