# 部分预渲染
部分预渲染(Partial Prerendering,PPR)能够让你在同一个路由中,既有静态组件,也有动态组件.  
在构建的时候,Next会尽可能多地预渲染路由的内容.如果检测到了像是读取请求这样的[动态代码](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering),你就可以将相关组件,用Suspense边界包裹起来.这个Suspense边界的备用界面,会作为预渲染的HTML内容展示出来.

::: warning
部分预渲染在目前还是个**实验性功能**,有可能发生变化.因此不建议用于生产环境.
:::
![ppr](imgs/thinking-in-ppr.jpg)

::: info
为什么要用PPR?它是怎么工作的?[看下这个视频](https://www.youtube.com/watch?v=MTcPrTIBkpA)
:::

## 背景知识
PPR能让Next服务器,立即发送一些预渲染好的内容.  
为了避免客户端接收到服务器端瀑布式传输,动态组件会在初次预渲染的同时,开始流式平行地从服务器端传输内容到客户端.这样能确保在客户端JS代码加载到浏览器之前,动态组件已经开始渲染了.  
而为了防止每个动态组件创建多个HTTP请求,PPR则将静态预渲染和动态组件,结合在了同一个HTTP请求当中.这样就能确保每个动态组件,不用通过多个网络来回才实现最终效果了.  

## 使用部分预渲染
### 增量适应(Next 15版本)
在Next v15中,你可以在布局和页面之中增量适用部分预渲染的功能,方法是在`next.config.js`中,将`ppr`的值设置为`incremental`;或者在文件的顶部,将`experimental_ppr`的值设置为`true`后,将其导出即可.(类似其他路由配置项);
```ts
// next.config.ts
import type {NextConfig} from 'next';

// 方法1
const nextConfig: NextConfig = {
    exprimental:{
        ppr:'incremental'
    }
}

export default nextConfig;
```

```tsx
// app/page.tsx
import { Suspense } from 'react'
import { StaticComponent, DynamicComponent, Fallback } from '@/app/ui';

//方法2
export const experimental_ppr = true;

export default function Page() {
    return (
        <>
            <StaticComponent />
            <Suspense fallback={<Fallback />}>
                <DynamicComponent />
            </Suspense>
        </>
    )
}   

```

::: tip
- 路由中不明确声明的话,`experimental_ppr`的值会是`false`,路由也就不会被部分预渲染.用这种方式的话你需要专门为每个需要的路由专门配置.
- `experimental_ppr`会应用于该路由分块及其所有的子路由分块,包括嵌套的布局跟页面.因此你也不用每个文件都专门设置,设置在组件子树的顶部即可.
- 如果子路由分块需要关闭PPR,就要在该子路由分块中,专门设置`experimental_ppr = false`了.  
(说了一大通,默认不用,根用子就用,子不用就要额外声明.)
:::

### 启用PPR(Next 14版本)
对于Next v14,你可以采用上面的第一种方法,在`next.config.js`中添加`experimental`,`ppr:true`,为每个路由都开启PPR功能.

```ts
import type { NextConfig } from 'next';

const nextConfig:NextConfig = {
    experimental:{
        ppr:true
    }
}

export default nextConfig;
```

## 动态组件 
在打包`next build`的时候为路由构建预渲染的话,Next需要确保动态函数是包裹在Suspense里的.这样`fallback` prop的内容才能包括到预渲染内容当中,被预渲染.  
比如组件用了动态函数`cookies()`,或`headers()`:
```tsx
// app/user.tsx
import { cookies } from 'next/headers'

export function User(){
    const session = cookies().get('session')?.value;
    return '...'
}

```

这个组件本身需要读取请求时cookies的内容.如果你还要为它添加PPR功能,就要将它包裹在Suspense当中了:
```tsx
// app/page.tsx
import { Suspense } from 'react'
import { User, AvatarSkeleton } from './user'

export const experimental_ppr = true;

export default function Page() {
    return (
        <section>
            <h1>This will be prerendered</h1>
            <Suspense fallback={<AvatarSkeleton />}>
                <User />
            </Suspense>        
        </section>
    )
}

```
组件只有在cookies的值被获取到后,才选择使用动态渲染.  
比如说如果你要从一个页面中读取`searchParams`,你可以将这个值通过属性的方式,转发给其它的组件:
```tsx
// app/page.tsx
import { Table } from './table'

export default function Page({searchParams}:{searchParams:{sort: string}}) {
   return (
    <section>
        <h1>This will be prerendered</h1>
        <Table searchParams={searchParams} />
    </section>
   ) 
}

```
在table组件中,读取`searchParams`这个值,组件也就跟着动态的运行了:
```tsx
// app/table.tsx
export default function Table({searchParams}:{searchParams:{sort:string}}){
    const sort = searchParams.sort === 'true';
    return '...'
}

```