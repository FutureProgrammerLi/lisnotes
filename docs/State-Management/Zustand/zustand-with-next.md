# 在Next.js中使用Zustand
> 原文地址:https://zustand.docs.pmnd.rs/guides/nextjs  
> 为什么接触到Next之后,很少了解Zustand或者其它状态管理工具了呢?  
> 因为服务器组件的特性,状态管理库是客户端工具,依赖useState,useEffect等hooks.而服务器组件天生不支持这些客户端hooks.  
> 当然,应用是离不开状态管理/全局状态的,因此,学会整合Next和Zustand就很有必要了.  

原文的结构是先介绍Next使用Zustand的好处及建议,再介绍如何使用.这种方式符合叙事结构,当然是知道为什么要用,才告诉你后续怎么用,对吧?  
不过我认为先从代码入手,再从代码具体分析后续的好处,更能理解每一行代码的用处.所以,就小小的调整一下顺序了.  

## 使用前的建议
* **不要用全局仓库.(?)**  - 多次请求之间不应共享某个仓库,我们不应该将仓库定义为全局变量.相反,我们应该为每次去请求都创建一个仓库.(???)
* **服务器组件内的代码不应读写任何的仓库.** - 服务器组件无法使用hooks或是上下文.它们设计初衷就不应是具备状态的.任何试图在服务器组件中读写全局仓库的操作,都会导致Next应用崩溃.  

## 为每个请求都创建一个仓库
为了实现这种效果,我们可以利用工厂函数,为每个请求都创建一个新的仓库.

```js
// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla';

export type CounterState = {
    count: number;
}

export type CounterActions = {
    increment: () => void;
    decrement: () => void;
}

export type CounterStore = CounterState & CounterActions;

export const defaultInitialState: CounterState = {
    count: 0,
}

export const createCounterStore = (
    initState: CounterState = defaultInitialState
) => {
    return createStore<CounterStore>((set) => ({
        ...initState,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
    }));
}
```

## 提供仓库给客户端组件

在组件中调用我们上面定义的`createCounterStore`,通过context provider在组件中共用.
```js
// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react';
import {useStore} from 'zustand';

import {type CounterStore, createCounterStore} from '@/stores/counter-store';

export type CounterStoreApi = ReturnType<typeof createCounterStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined);

export interface CounterStoreProviderProps {
    children: ReactNode;
}

export const CounterStoreProvider = ({
    children,
}: CounterStoreProviderProps) => {
    const storeRef = useRef<CounterStoreApi | null>(null);

    if (storeRef.current === null) {
        storeRef.current = createCounterStore();
    }

    return (
        <CounterStoreContext.Provider value={storeRef.current}>
            {children}
        </CounterStoreContext.Provider>
    )
}

export const useCounterStore = <T,>(
    selector: (store: CounterStore) => T
): T => {
    const counterStoreContext = useContext(CounterStoreContext);
    if (!counterStoreContext) {
        throw new Error('useCounterStore must be used within a CounterStoreProvider');
    }

    return useStore(counterStoreContext, selector);
}
```

::: info
我们在例子中假设了组件通过值引用的校验时,组件是不会被重校验的(re-render-safe),这样我们的仓库才可以只创建一次.这个组件只会在服务器上,每请求一次,就重渲染一次.不过如果组件树里,这个组件的父组件是某些具备状态的客户端组件的话,或是该组件内包含其它可能导致重渲染的可变状态的话,这个组件还是会在客户端中被多次重渲染的.
:::

## 初始化仓库
```js
// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla';

export type CounterState = {
    count: number;
}

export type CounterActions = {
    increment: () => void;
    decrement: () => void;
}

export type CounterStore = CounterState & CounterActions;

export const initCounterStore = (): CounterStore => {
    return {count:new Date().getFullYear()}
}

export const defaultInitState: CounterState = {
    count: 0,
}

export const createCounterStore = (
    initState: CounterState = defaultInitState
) => {
    return createStore<CounterStore>()((set) => ({
        ...initState,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
    }));
}
```

---

```js
// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react';
import {useStore} from 'zustand';

import {type CounterStore, createCounterStore, initCounterStore} from '@/stores/counter-store';

export type CounterStoreApi = ReturnType<typeof createCounterStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined);

export interface CounterStoreProviderProps {
    children: ReactNode;
}

export const CounterStoreProvider = ({
    children,
}: CounterStoreProviderProps) => {
    const storeRef = useRef<CounterStoreApi | null>(null);

    if (storeRef.current === null) {
        storeRef.current = createCounterStore(initCounterStore());
    }

    return (
        <CounterStoreContext.Provider value={storeRef.current}>
            {children}       
        </CounterStoreContext.Provider>
    )
}

export const useCounterStore = <T,>(
    selector: (store: CounterStore) => T
): T => {
    const counterStoreContext = useContext(CounterStoreContext);
    if (!counterStoreContext) {
        throw new Error('useCounterStore must be used within a CounterStoreProvider');
    }

    return useStore(counterStoreContext, selector);
}
```

## 在不同结构的Next中使用仓库
不同结构指的是Next中App Router和Pages Router, 前者针对Nextv14及以后, 后者针对Nextv13及以前.它们虽然大体相同,但还是有细微差别.  

### App Router
```tsx
// src/components/pages/home-page.tsx
'use client'

import {useCounterStore} from '@/providers/counter-store-provider';

export const HomePage = () => {
    const { count, incrementCount, decrementCount } = useCounterStore(state => state)

    return (
        <div>
            <p>Count: {count}</p>
            <hr />
            <button onClick={incrementCount}>Increment</button>
            <button onClick={decrementCount}>Decrement</button>
        </div>
    )
}
```

---

```tsx
// src/app/layout.tsx
// ...
import {CounterStoreProvider} from '@/providers/counter-store-provider';

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <CounterStoreProvider>
                    {children}
                </CounterStoreProvider>
            </body>
        </html>
    )   
}
```

```tsx
// src/app/page.tsx
import { HomePage } from '@/components/pages/home-page';

export default function Home() {
    return <HomePage />
}
```

::: info
如果需要为每个路由都创建一个仓库的话,你就要在page或route组件层面,创建并分享这个仓库.如果不需要为每个路由都创建仓库的话那就不必这样做了.
:::

```tsx
// src/app/page.tsx
import { CounterStoreProvider } from '@/providers/counter-store-provider';
import { HomePage } from '@/components/pages/home-page';

export default function Home() {
    return (
        <CounterStoreProvider>
            <HomePage />
        </CounterStoreProvider>
    )
}
```

### Pages Router
```tsx
// src/components/pages/home-page.tsx
import { useCounterStore } from '@/providers/counter-store-provider';

export const HomePage = () => {
    const { count, incrementCount, decrementCount } = useCounterStore(state => state)

    return (
        <div>
            <p>Count: {count}</p>
            <hr />
            <button onClick={incrementCount}>Increment</button>
            <button onClick={decrementCount}>Decrement</button>
        </div>
    )
}
```

---
```tsx
// src/_app.tsx
import type { AppProps } from 'next/app';
import {CounterStoreProvider} from '@/providers/counter-store-provider';

export default function App({Component, pageProps}: AppProps) {
    return (
        <CounterStoreProvider>
            <Component {...pageProps} />
        </CounterStoreProvider>
    )
}
```

```tsx
// src/pages/index.tsx
import { HomePage } from '@/components/pages/home-page';

export default function Home() {
    return <HomePage />
}
```

::: info
如果需要为每个路由都创建一个仓库的话,你就要在page或route组件层面,创建并分享这个仓库.如果不需要为每个路由都创建仓库的话那就不必这样做了.
:::

```tsx
// src/pages/index.tsx
import { CounterStoreProvider } from '@/providers/counter-store-provider';
import { HomePage } from '@/components/pages/home-page';

export default function Home() {
    return (
        <CounterStoreProvider>
            <HomePage />
        </CounterStoreProvider>

    )
}
```

## 回到开头
**为什么我们要在Next中使用Zustand呢?**  
Next.js怎么说都是React框架进化而来的产品,用于服务器渲染.而要结合Next与Zustand我们不得不面临一些挑战.  
挑战是什么呢?  
Zustand本身就是全局变量仓库(也可以说是模块状态),它不依赖上下文`Context`,用不用都是一样的.而具体的挑战是:
* **每个请求都要创建一个仓库**: Next服务器可以同时处理多个请求.也就是说仓库需要为每个请求都创建一次,且不应在请求之间共用仓库.
* **友好的SSR支持:** Next的应用会渲染两次:一次在服务器上,一次在客户端上.而两次渲染的结果如果不同的话会导致"注水错误(hydration errors,是React的术语)".因此,仓库必须在服务器上被初始化,然后在客户端上用相同的数据,再初始化一遍,这样才能避免发生错误.更多关于如何避免这种错误的细节可以参考[这篇文章](https://zustand.docs.pmnd.rs/guides/ssr-and-hydration).
* **友好的单页面应用路由支持:** Next支持混合模型的客户端路由,也就是说,要重置仓库的话,我们需要在组件层面上利用`Context`对仓库进行初始化.
* **服务器缓存友好:**  新版本的Next.js(尤其是用了App Router的应用)支持激进(aggressive)的服务器缓存策略.由于我们的仓库本质上是*模块状态*,因此,它对这种缓存是完全兼容的.  

--- 
感谢你能看到这里.

ps. 说实话,全文翻译下来感觉还是云里雾里的.  
一个是服务器组件结合客户端状态管理库,感觉会有很多麻烦,势必跟之前完全客户端应用有很大出入.  
第二个是原本客户端+js,应用起来代码量很少.但结合了服务器端+ts,好处是更规范了,坏处是boilerplate有点多.(不得不妥协?)

先去敲敲代码用起来吧.光理论还是很难理解的.

