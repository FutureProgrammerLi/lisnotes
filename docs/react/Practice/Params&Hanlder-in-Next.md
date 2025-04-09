# 动态路由参数和路由处理器在Next15中的变化
> 摘自[Nextjs v15的更新文档](https://nextjs.org/docs/app/building-your-application/upgrading/version-15#params--searchparams)  
> 之前直接能从函数参数解构出来的`params`和`searchParams`变成Promise了, 类型声明也一直没搞懂.  
> 希望这篇文章的整理能稍微理清自己的认识.  
> 之前也有相关实践的总结,有点忘记了.[自己总结过的文章](/react/Practice/react19-next15.html#next-app里的动态参数获取)

* 异步和同步layout中,获取参数的区别
* 异步和同步page中获取参数的区别
* 路由处理器中获取参数的区别
## `params` & `searchParams`

::: code-group 

``` tsx [async-layout.tsx]
// before
// 额外用`generateMetadata`获取参数,为了实现"异步"
type Params = { slug: stirng}

export function generateMetadata({ params }: { params: Params }) {  // [!code highlight]
    const { slug } = params; // [!code highlight]
};

export default async function Layout({  // 那这里的async有什么意义?
    children,
    params,
}:{
    children: React.ReactNode,
    params: Params
}){
    const { slug } = params;
}

// after
// 同样也要用`generateMetadata`,但变成了一个Promise, 需要async/await了
type Params = Promise<{slug: string}>

export async function generateMetadata({ params }: { params: Params }) { // [!code highlight]
    const { slug } = await params; // [!code highlight]
}

export default async function Layout({
    children,
    params,
}:{
    children: React.ReactNode,
    params: Params
}){
    const { slug } = await params; // [!code highlight]
}
```

```tsx [sync-layout.tsx]
// before
type Params = { slug: string}

export default function Layout({
    children,
    params,
}:{
    children: React.ReactNode,
    params: Params
}){
    const { slug } = params;
}

// after
import { use } from 'react';

type Params = { slug: string}
export default function Layout(props:{
    children: React.ReactNode,
    params: Params
}){
    const params = use(props.params);
    const slug = params.slug;  // 官方为什么不用解构? 会有Vue那样的问题吗?应该不是吧?
    // const { slug } = params;
}
```
:::

::: code-group

```tsx [async-page.tsx]
// before 
type Params = { slug: string}
type SearchParams = { 
    [key:string]:string | string[] | undefined
}
// 1. 查询参数是个对象
// 2. 键名是字符串
// 3. 值可以是字符串,也可以是字符串数组,还可以是undefined
//  http:localhost:3000/?category=shoes&tags=sale&tags=popular
// { category:'shoes', tags:['sale','popular']}

export function generateMetadata({ 
    params, 
    searchParams 
}: { 
    params: Params, 
    searchParams: SearchParams 
}) {
    const { slug } = params;
    const {query} = searchParams;
}

export default async function Page({
    params,
    searchParams,
}:{
    params: Params,
    searchParams: SearchParams
}){
    const { slug } = params;
    const {query} = searchParams;
}


// After
type Params = Promise<{slug: string}>
type SearchParams = Promise<{
    [key:string]:string | string[] | undefined
}>

export async function generateMetadata({ 
    params, 
    searchParams 
}: { 
    params: Params, 
    searchParams: SearchParams 
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const { slug } = params;
    const {query} = searchParams;
}

export default async function Page({
    params,
    searchParams,
}:{
    params: Params,
    searchParams: SearchParams
}){
    const params = await props.params;
    const searchParams = await props.searchParams;
    const { slug } = params;
    const {query} = searchParams;
}
// 也太多boilerplate了, 还不知道传进来的是什么.
```

```tsx [sync-page.tsx]
'use client'

// before
type Params = { slug: string}
type searchParams = {
    [key:string]:string | string[] | undefined
}

export default function Page({
  params,
  searchParams,
}:{
    params: Params,
    searchParams: SearchParams
}){
    const { slug } = params;
    const {query} = searchParams;
}

// after
import { use } from 'react';

type Params = Promise<{ slug: string}>
type SearchParams = Promise<{
    [key:string]:string | string[] | undefined
}>

export default function Page(props:{
  params: Params,
  searchParams: SearchParams
}){
    const params = use(props.params);
    const searchParams = use(props.searchParams);
    const { slug } = params;
    const {query} = searchParams;
}
```

```js [sync-use-page.js]
'use client'
// before
export default function Page({
    params,
    searchParams
}){
    const { slug } = params;
    const {query} = searchParams;
}
//after
import { use } from 'react';

export default function Page(props){
    // const {slug} = use(props.params);       // ![code highlight]
    // const {query} = use(props.searchParams);  // ![code highlight]
    const params = use(props.params);
    const searchParams = use(props.searchParams);
    const { slug } = params;
    const {query} = searchParams;
}

```
:::

## 路由处理器

::: code-group
```ts [app/api/route.ts]
//before 
type Params = { slug:string}

export async function GET(
    request:Request,
    segmentData:{
        params:Params
    }
){
    const params = segmentData.params;
    const { slug } = params;
}

// after
type Params = Promise<{slug: string}>

export async function GET(
    request:Request,
    segmentData:{
        params:Params
    }
){
    const params = await segmentData.params;
    //  params = use(segmentData.params);
    const { slug } = params;
}
```

```js [app/api/route.js]
// before
export async function GET(request, segmentData){
    const params = segmentData.params;
    const { slug } = params;
}

// after
export async function GET(request, segmentData){
    const params = await segmentData.params;
    //  params = use(segmentData.params);
    const { slug } = params;
}
```
:::

--- 
## 总结
1. 要"异步",就要`generateMetadata`;
2. 由于`params`和`searchParams`都变成了Promise, 所以`generateMetadata`,`Layout()`,`Page()`都要用`async/await`.
3. 用`use()`可以方便获取Promise的值.  

// 笔记项目里怎么用的route handler? 参数是怎么声明跟提取的?

`searchParams`怎么用? 与跳转关联不大,是跳转后传参的一种方式;  
`params`也是传参的一种,但会导致实际页面跳转.可能会404.

个人实践结合:
::: code-group 
```tsx [app/sync/page.tsx]
import Form from 'next/form'
import Link from 'next/link'
export default function SyncPage() {
    return (
        // <Link href="/sync/1">To Some User</Link>
        <Form action={'/sync/1'}>
            <input type="text" name="name" />  
            <button type="submit">Submit</button>
        </Form>
    )
}
```

```tsx [app/sync/[id]/page.tsx]
import { use } from 'react';
type Params = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function UserPage(props: {
    params: Params,
    searchParams: SearchParams
}) {
    const { id } = use(props.params)
    const { name } = use(props.searchParams)
    return (
        <>
            <h1>The dynamic params:{id}</h1>
            <h2>The search params:{name}</h2>
        </>

    )
}
```
:::




