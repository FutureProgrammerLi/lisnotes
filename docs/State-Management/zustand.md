# Zustand -- React状态管理库
> [官网](https://zustand.docs.pmnd.rs/getting-started/introduction)  
> (话说官网的域名也太难找了,会火吗这个框架?好像也不是新东西了吧?)  
> 为什么想学这个呢?没错这个类别下的内容太少了.除了React/Vue这个维度的框架,Router/State Management Tools在应用开发时都是相当重要的.  
> 那? 下一步是Router目录? 先填充一下这个目录的内容再说吧..  
> 本文是[Zustand的Readme](https://github.com/pmndrs/zustand), 我认为是最适合入门的一个介绍了.

::: details 一点私心  
稍微了解了Pinia,比较认同框架的理念:状态管理库重点应在**全局**上,作用应该是全局共享.为了实现这一功能而添加过多的概念,增加过多的模板代码,我认为属于得不偿失了.  
曾经的Vuex, 如今的Redux.前者存在一些不必要/重叠了的功能,后者过多代码模板(没有贬义,个人刻板).  
也就成就了现在的我,寻找可替换状态管理库的决心.  
我认为的全局状态库,需要的是**状态,方法**.至于像"计算属性","异步行为"等衍生来的概念,如果需要额外的代码来实现,我认为都会是负担.  
至此,我赞同Pinia所保留的三个主要概念:`state`,`actions`,`getters`.(虽然React里实现computed的功能,是不依赖于新的概念的.);  
所幸,Zustand的概念也不多,甚至很多相似点.
:::

Zustand是一个小型的,"可伸缩的"状态管理解决方案,主要遵循简化的flux原则.它具有少量基于hooks的,"简单"API,不会有过多的代码模板,也不会有过多的约定成俗.  

不要觉得它小,就很好"欺负".它的爪子可是很锋利的(Zustand的logo是只熊),在解决一些常见问题时可一点不会手软:比如React里可怕的["僵尸子节点"](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children)问题(stale props可能更好理解),[react并发](https://github.com/bvaughn/rfcs/blob/useMutableSource/text/0000-use-mutable-source.md)问题,以及混合渲染器出现的[上下文丢失](https://github.com/facebook/react/issues/13332)问题.它可能是唯一一个,轻松解决这些问题的React状态管理库.  
你可以直接[在这里](https://githubbox.com/pmndrs/zustand/tree/main/examples/demo)试着用一下.

## 创建仓库
你的仓库其实就是个hook.你可以随便往里面放东西:原始值,对象值,函数都是可以的.而状态的更新则需要以"不变"的方式实现,并依赖参数`set`函数,将新状态合并到仓库中.
```js
import { create } from 'zustand';

const useBearStore = create((set) => ({
    bears:0,
    increasePopulation:() => set((state) => ({ bears: state.bears +1 })),  // 函数返回对象作为参数
    removeAllBears:() => set({ bears: 0}),     // 对象直接作为参数
}));
```
* **set的参数是对象, 可以直接是对象,也可以是函数返回的对象,但终归是对象.**
* **用Typescript声明state和action时,类型声明是void.**
* **set函数的参数是对象,没有返回值.**

## 之后绑定到组件上就可以啦
既然是hook,自然就可以在任意组件中使用了,不需要额外的provider,context等什么东西.  
在组件中选择你需要的仓库内容,仓库内容变了,组件也会重新渲染.(留个疑问,为什么要选择呢?不直接把整个仓库的内容都导进组件里随意使用,这样不是更方便吗?答案也在题目里了,**重渲染**)
```js
function BearCounter(){
    const bears = useBearStore(state => state.bears);
    return <h1>{bears} around here...</h1>
};

function Controls(){
    const increasePopulation = useBearStore(state => state.increasePopulation);
    return <button onClick={increasePopulation}>one up</button>
};
```

### 为什么选择zustand而不用redux?
* 简单!不用套模板!
* 引用状态时,用hooks就行,不用什么新的概念
* 不需要什么上下文,什么提供者包裹起整个应用
* [可以告知组件某个状态临时变化而不引起重新渲染](https://github.com/pmndrs/zustand?tab=readme-ov-file#transient-updates-for-often-occurring-state-changes)

### 为什么用zustand而不用context上下文?
* 更少的模板代码
* 只在状态发生变化时才重渲染组件
* Zustand能集中化管理,基于行为实现状态管理

## 使用指南
### 整个导入
你当然可以把整个仓库的内容都导入到某个组件了.不过,这样仓库的某个状态发生变化,组件也会跟着重渲染了,无论这是否你想要的结果.
```js
const state = useBearStore();
```

### 选择多个状态切片
仓库的状态是否发生变化,默认是通过全等号`===`实现的.对于那些原子型状态而言,这种比较方式足够了:
```js
const nuts = useBearStore(state => stale.nuts);
const honey = useBearStore(state => stale.honey);
```

如果你从单一对象的仓库里同时挑选多个状态,那你可以像Redux的`mapStateToProps`那样,使用`useShallow`,从而防止状态在浅相等时导致的不必要的重渲染.(不用API的话,即使状态前后浅相等也会重渲染?)
```js
import { create } from 'zustand';
import {useShallow} from 'zustand/react/shallow';

const useBearStore = create(set => ({
    nuts:0,
    honey:0,
    treats:{},
    //..
}));

// 以对象解构的方式挑选仓库状态, 其中之一发生变化时都会导致重渲染
const {nuts, honey} = useBearStore(
    useShallow(state => ({nuts: state.nuts, honey: state.honey}))
);  // ? 居然用类似更新的方式,获取数据? 是否有点counter-intuitive了?

// 以数组方式挑选,同样任一变化都会导致组件重渲染
const [nuts,honey] = useBearStore(
    useShallow(state => [state.nuts,state.honey]),
);  // 感觉比对象简单,直观.

// 映射挑选,state.treats顺序/数量/键值变化都会导致组件冲渲染(?)
const treats = useBearStore(
    useShallow(state => Object.keys(state.treats));
); //??? 什么意思??? 拿到了什么东西??? treats的属性名?
// 是的没错,就是拿到对象的属性名
```

如果需要更好地控制组件是否重渲染,你或许需要定义自己的对比函数.([这个例子就用了`createWithEqualityFn`](https://github.com/pmndrs/zustand/blob/main/docs/migrations/migrating-to-v5.md#using-custom-equality-functions-such-as-shallow))
```js
const treats = useBearStore(
    state => state.treats,
    (oldTreats, newTreats) => compare(oldTreats,newTreats),
)

```

## 重写状态
`set`函数可以接收第二个参数,默认值是`false`.默认值下的行为是将变化后的状态,**整合**到仓库中,而这第二个参数的值为`true`时,这个设置就会变成了**替换**仓库内容.用上这个参数的时候多加注意吧,一不小心就把整个仓库的定义都变就恭喜发财咯.
```js
import omit from 'loadash-es/omit';
const useFishStore = create(set => ({
    salmon:1,
    tuna:2,
    deleteEverything: () => set({},true), // 把整个仓库清空,包括本方法
    deleteTuna:() => set(state => omit(state,['tuna']),true),  // 将tuna属性从本仓库中移除. (?一次性方法?)
}));
```

## 异步行为
数据准备好了直接调用`set`方法就行,zustand不在乎你定义的行为是否为异步:
```js
const useFishStore = create(set => ({
    fish:{},  // 原文档fishies...不知是否有意为之
    fetch: async (pond) => {
        const response = await fetch(pond);
        set({ fish: await pond.json() })
    },
}));
```

## 在方法中读取仓库状态
`set`方法可以接收函数更新的方法返回新的状态对象,(`set(state=> result)`),不过你也可以在`set`方法之外使用`get`方法读取当前状态.
```js
const useSoundStore = create((set,get) => ({
    sound: 'grunt',
    action:() => {
        const sound = get().sound;      // 没有set(state => ({/**... */})),那就用get()
        // ... 
    }
}));
```

**跳过了subscribe这一节,个人认为不是初学者能了解的使用技巧**

## 厌倦了reducers和嵌套状态的变更?用Immer吧!
React要改变嵌套状态时从来都是那么令人懊恼的,你不知道要变的在哪层,哪层又不用变.  
既然如此,借用三方工具Immer吧!
```js
import { produce } from 'immer';

const useLushStore = create(set => ({
    lush:{ forest: { contains:{ a:'bear'}}},
    clearForest:() => 
        set(
            produce(state => {
                state.lush.forest.contains = null
            })
        ) 
}));  // 已经晕了,不弄清每层的参数类型根本不知道哪里漏了括号
// set接收对象参数,produce内部又直接改变state...
const clearForest = useLushStore(state => state.clearForest);
clearForest();
```
当然你可以[选择其它解决方案](https://github.com/pmndrs/zustand/blob/main/docs/guides/updating-state.md#with-immer).

## 持久化中间件
你可以随便用存储方式,对你仓库的数据实现持久化.
```js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useFishStore = create(
    persist(
        (set,get) => ({
            fish:0,
            addFish:() => set({ fish: get().fish + 1})
        }),  // 仓库内容定义
        {
            name:'food-storage',       // 必须是唯一的,仓库在内存中的名字
            storage: createJSONStorage(() => sessionStorage),  //  自选的,默认值是'localStorage'
        }
    )
);
```
[更多关于中间件的内容可以查看文档.](https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md)

## Immer中间件
用了Zustand,不需要额外安装Immer依赖了,因为它部分功能已经被整合到Zustand,作为中间件就能引入了
```js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useBeeStore = create(
    immer(
        set => ({
            bees:0,
            addBees:(by) => 
                set((state) => {
                    state.bees += by
            })
    }))
);     // Immer + set也太奇怪了..参数混乱了我已经
```

## 离不开redux那样的reducers和action types?
```js
const types = { increase: 'INCREASE', decrease: 'DECREASE'};

const reducer = (state, { type, by = 1}) => {
    switch (type) {
        case types.increase:
            return { grumpiness: state.grumpiness + by}
        case types.decrease:
            return { grumpiness: state.grumpiness - by}
    }
};

const useGrumpyStore = create(set => ({
    grumpiness:0,
    dispatch:(args) => set(state => reducer(state,args)), // ... 闻者伤心听者流泪,用zustand模仿redux,何不直接用redux...
}));

const dispatch = useGrumpyStore(state => state.dispatch);
dispatch({type:types.increase, by:2});
```

又或者你可以直接用我们的redux中间件.它能直接连接起你定义的reducer,设置好仓库的初始状态,然后还有`dispatch`函数.
```js
import { redux } from 'zustand/middleware';

const useGrumpyStore = create(redux(reducer,initialState));
```

**跳过Redux调试软件部分.属于用Redux调试Zustand了**

## React上下文
用`create()`创建的仓库是不需要再用上下文包裹的了.但一些场景下,你还是会需要上下文,用于依赖注入也好,利用组件属性初始化仓库状态也好,总之就是有这些场景.由于一般的仓库本质上只是一个hook,直接将它作为值传给上下文就会违背hooks的原则了.  
那怎么办呢?这里给出一种解决办法,从Zustand v4起就支持,**使用原生仓库**.  
(Zustand可以不依赖React使用,因此也有对应的两套API:一套专门React,一套React以外.原生仓库就是React以外的那一套)
```js
import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';

const store = createStore(/**... */);  // 没有hooks的原生仓库
const StoreContext = createContext();

const App = () => (
    <StoreContext.Provider value={store}>
        {/* ... */}
    </StoreContext.Provider>
);

const Component = () => {
    const store = useStore(StoreContext);
    const slice = useStore(store,selector);
};
```

## 配合Typescript使用
Typescript有什么需要声明的吗?除了在创建时声明仓库内部状态的各个类型就够了:  
`create<\State & Action>(...)`
```ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {} from '@redux-devtools/extension';    //调试软件需要这个引入

interface BearState {
    bears:number;
    increase:(by:number) => void;
};

const useBearStore = create<BearState>()(
    devtools(
        persist(
            (set) => ({
                bears:0,
                increase:(by) => set((state) => ({bears: state.bears + by}))
            }),
            {
                name:'bear-storage'
            },
        ),
    ),
)

```

[更多关于Typescript的使用指南](https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md)

感谢你能看到这里!