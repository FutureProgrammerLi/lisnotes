# 实践跟理论的差异

以为自己翻译过了Next官网的内容就对Next有一点理解了,结果ServerComponent一出来,哦豁,感觉跟没学一样.  
这里尤为切身的感受是,换了服务器组件后,路由的动态参数都不会拿了.
这篇文章就总结一下,实践下来,和理论之间的差异和理解.  

1. App动态路由的参数获取, params
2. `use()`hook 神奇般得以应用?
3.  `<Context>`需不需要`.Provider`?
4. SearchParams查询参数的获取

## Next App里的动态参数获取
**简单说,动态路由参数变成了Promise,你不能直接像普通参数prop那样解构了,需要额外的解决掉这个Promise.**  
(searchParams也变成了Promise了)
```ts
export default function Page({params}){
    const {id} = params;     // × Next15版本起不能直接解构了,因为params变成了一个Promise
} 
```
解决办法有两种:
1. 利用`async/await`解决掉Promise后再读取数据:
2. 利用`use()` API.
```ts {1,2,5,9,10,12,13}
type Params = { id:number };
type SearchParams = {[key:string]:string | string[]  | undefined}
// 以上这个类型乍看很绕,细看就是字符串组成的各种可能的类型

export default async function Page({
    params,
    searchParams
    }:{
        params:Promise<Params>,
        searchParams:Promise<SearchParams>
    }){
        const {id} = await params;
        const {query} = await searchParams;     // <input name="query" />
        return <div>dynamic id is :{id}, Query is {query}</div>
} 
```

```ts
import {use} from 'react';

export default function Page({params}:{params:Promise<{slug:string}>}){
    const {slug} = use(params);
    //  const {query} = use(searchParams);
    return <div>Dynamic slug is {slug}</div>
    //  为什么神奇呢? 因为`use()`API也是v19才稳定的一个特性.API的出现,参数变成Promise,谁先谁后不好说.
}
```
[关于`use()`这个hook的介绍可以看这里](/react/Hooks/use.md)

## `Context`需不需要`Provider`?
**不需要,但会报错.**  
是[React19的新特性](https://react.dev/blog/2024/12/05/react-19#context-as-a-provider),但在自己Next15的项目里不写`.Provider`还是会报错.  
除了这个新功能会报错外,上面的简单如`import {use} from 'react'`也会报错.原因是"react包里没导出use这个函数".  
<div className="text-red-700 font-bold text-3xl">但功能是正常的.</div>

## 查询参数的获取
跟路由的动态参数类似,都变成了Promise.因此需要额外的将这个Promise给处理掉.  
另外,**查询参数的获取还需要配合next提供的Form组件一起使用**.  
具体示范如下:
:::code-group
```tsx [app/page.tsx]
import Form from 'next/form';

export default function App(){
    return (
        <Form action={'/posts'}>
            <input name="query" />      {/*这里将决定添加到URL上,key的值是什么,即?query=xxx*/} 
            <button type="submit">Click to search</button>
        </Form>
    ) 
}
```
```tsx [app/posts/page.tsx]
import { use } from 'react';

type SearchParams = {[key:string]:string | string[]  | undefined};

export default function Page({searchParams}:{searchParams:Promise<SearchParams>}){
    const {query} = use(searchParams);
    return <div>The search parameter is :{query}</div>
}
```
:::
