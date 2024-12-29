# How to fetch data in React
> https://www.robinwieruch.de/react-fetching-data/  
> 之前翻译过同一作者的,React获取数据的方法.当时的方法是`useEffect`.到了今天方法也变了.仅以此文记录.

React获取数据的方式有很多种.本文以展示其中几种选择,包括过去用了很久的,也有当今较为前沿的方式.一些较新,较为推荐;一些则不那么推荐,尽量避免使用.  
那就开始吧!  
一些准备工作是不可少的:简而言之就是准备组件和后台(模拟)数据.本文用的是组件从"后台"获取一组`posts`数据并展示出来.这里的"后台"和API都是假的,具体目标还是展示,获取的方法.  

---
首先定义我们的`post`类型:
```ts
export type Post = {
    id:string;
    title:string;
}
```
之后定义我们的假数据:
```ts
import { Post } from '"./types';
export const POSTS: Post[] = [
  {
    id: "1",
    title: "Post 1",
  },
  {
    id: "2",
    title: "Post 2",
  },
]
```
随后定义一个返回promise的数据获取函数.函数的具体实现会因具体用例有所不同,但大体长这样:
```js
import {POSTS} from '../db';
export const getPosts = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 手动延迟
    return POSTS; //???
}
```
最后就是在组件中调用这个获取函数:
```js
import { Post } from '@/features/post/types';

const PostsPage = () => {
    const posts:Post[] = [];
    // TODO: 从API获取数据填充到这里;
    return (
        <div>
            <h1>Posts</h1>

            <ul>
                {posts.map((post) => (
                <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}
export default PostsPage;
```
至此我们就可以探讨各种获取数据的方式了.

## 利用服务器组件获取数据
如果你用的是基于React的框架(比如Next.js),它支持服务器组件的功能的话,那你就可以直接实现**服务器端的数据获取功能**了,因为服务器组件就是先在服务器上执行,再将HTML发送给客户端.
```js
import { getPosts } from '@/features/post/queries/get-posts';
const PostsPage = async () => {
    const posts = await getPosts();
    // ...
}
```
这个异步组件会等到异步操作都完成后才继续执行.Promise Resolved后,组件才会拿着获取到的数据继续进行渲染.对于RSC,只有HTML会被返回到客户端上.
::: tip
[Next中的Server Action](https://www.robinwieruch.de/next-server-actions/) 
:::
服务器组件设计的初衷就是用来在服务器上获取数据,因此,`getPosts`能直接从数据库中读取数据,不用额外的API了.可能需要的额外东西就是,ORM或数据库客户端,以获取数据:
```js
export const getPosts = async () => {
    return await db.query('SELECT * FROM posts');
}
```
如果你用的框架支持RSC,那我建议还是直接利用这个功能,从而避免客户端-服务器交互,直接从数据源获取数据.  
接下来的关注点就可以转变为提升用户体验了:比如增加错误处理,加载状态提示等.后者可以利用`<Suspense>`组件实现.  

## 利用React Query
如果没利用额外的框架,框架不支持RSC,我最为推荐的获取数据方式则是,利用像*React Query*这样专门的三方库.这个库的功能比较强大,不但有获取数据的hooks,还有对数据进行缓存,重校验等等的功能.
```js
"use client"
import { getPosts } from "@/features/post/queries/get-posts";
import { useQuery } from "@tanstack/react-query";

const PostsPage = () => {
    const { data:posts } = useQuery({
        queryKey:['posts'],
        queryFn: getPosts,
    });
    // ...
}
```
以上就是用`React Query`在客户端获取数据的例子.  
`useQuery`函数主要接收两个参数,`queryKey`和`queryFn`.前者是个数组,用以辨别查询的"id"(比如用来管理缓存);后者是个获取数据的函数.  
客户端数据获取的例子中,`getPosts`函数不能直接访问到后端代码内容(比如ORM,数据库),需要通过API搭建HTTP桥梁(a remote API over HTTP).其中较为常见的方法是用`fetch`或`axios`.你还要自行决定,用`async/await`语法,还是`.then`语法.
```js
export const getPosts = async () =>{
    const res = await fetch('/api/posts');
    return res.json();
}
```
跟服务器组件直接从服务器获取数据不同,用`fetch`或`axios`返回的数据并不能自动实现类型推导.你还需要额外的工具来实现类型推导限制,比如OpenAPI.  
此外由于客户端数据获取的限制,你还需要额外处理网络错误,状态加载及缓存行为设置.幸运的是ReactQuery为你提供了相关的功能,你不必再造轮子了.  
ReactQuery是React应用客户端获取数据工具的不二选择.它既能缓存,处理竞争态,还能重校验.如果还要错误处理,加载状态处理,那直接从`useQuery`返回的结果解构出`isLoading`,`error`属性就可以了.  
`ReactQuery`的另一替代是,`SWR`.而如果你用的API层不是`REST`方式而是`GraphQL`,那可选项还有`Relay`和`Apollo Client`.不过`ReactQuery`也可以配合`GraphQL`使用.

## 服务器组件和React Query的结合
直接在RSC获取数据,用React Query在客户端组件获取数据的例子你都见过了.如果,要把二者结合在一起,又会是怎样的呢?  
比如你要在RSC中,从服务器*获取初始数据*(如果支持的话),之后在客户端上,利用React Query完成后续另外的数据获取(比如无限滚动).  
应对这种较为"高级"的数据获取用例,你需要用服务器组件来获取初始数据,将初始数据以props方式传递给客户端组件;再在客户端组件中用React Query实现后续的数据获取.
```js
import { getPosts } from "@/features/post/queries/get-posts";
import { PostList } from "./_components/post-list";

const PostsPage = async () => {
    const posts = await getPosts();
    return (
        <div>
            <h1>RSC + React Query</h1>
            <PostList initalPosts={posts} />
        </div>
    )
}
export default PostsPage;
```
其实粗略地看服务器组件跟原本并没什么差异.不同点只是,之前直接就在服务器组件中渲染获取到的数据了,结合后需要把渲染的逻辑给提取到另外的组件去.这个另外的组件需要是客户端组件,将`posts`作为初始状态,完成后续另外的数据请求内容.
```js
'use client';
import { getPosts } from "@/features/post/queries/get-posts";
import { Post } from "@/features/post/types";
import { useQuery } from "@tanstack/react-query";

type PostListProp = {
    initalState:Post[];
};

const PostList  = ({initalPosts} : PostListProp}) =>{
    const { data: posts } = useQuery({  // 后续inifite scrolling
        queryKey:['posts'],
        queryFn:getPosts,
        initalState:initalPosts,
    });
    return (
        <ul>
        {posts?.map((post) => (         // render logics
            <li key={post.id}>{post.title}</li>
        ))}
        </ul>
    )
};
export default PostList;
```
客户端组件利用服务端组件传给它的`initialPosts`,作为`useQuery`的`initialState`.二者的连接至此就结束了.  
之后的缓存,重校验,数据更新都交由`React Query`处理了.  
这种方式很好地结合了先前两种方式的优点:既利用了RSC,也利用了客户端的React Query.  

`getPosts`的具体实现细节有所争议:既然能直接在RSC中读取数据源(参照RSC获取数据),你还不得不利用API,以在客户端组件获取数据(参照RQ获取数据).  

编写此文之时,你依旧需要编写两种`getPosts`.幸运的是,你可以利用`Server Action`,这样就能一种`getPosts`,同时应用于服务端组件和客户端组件了.  

## React `use()` API
React内置的`use()` API还处于实验性阶段.它允许你从服务器组件传一个Promise给客户端组件,之后在客户端中resolve.这样你就不会因为`await`而阻塞服务器组件的渲染了. (?)  
```js
import { Suspense } from "react";
import { getPosts } from "@/features/post/queries/get-posts";
import { PostList } from "./_components/post-list";

const PostsPage = async () => {
    const postsPromise = getPosts();
    return (
        <div>
            <h1>use(Promise)</h1>
            <Suspense>
                <PostList promisedPosts={postPromise}/>
            </Suspense>
        </div>
    )
}
export default PostsPage;
```
这个例子跟服务器组件获取数据类似.区别是以上没有直接`async/await`等待Promise resolve,而是将这个Promise传给了客户端组件,并在后者内部利用`use()`API处理这个Promise.
```js
"use client"
import { use } from 'react';
import { Post } from '@/features/post/types';

type PostListProp = {
    promisedPosts:Promise<Post[]>;
}

const PostList = ({promisedPosts}:PostListProp) => {
    const posts = use(promisedPosts);
    return (
        <ul>
        {posts?.map((post) => (
            <li key={post.id}>{post.title}</li>
        ))}
        </ul>
    );
}
```
个人觉得(*原作者)这样写更靠近实现异步客户端组件的功能了,尽管目前还未被实现.编写本文之时,只有服务器组件能用`async`标识为异步组件.  
一旦异步客户端组件功能实现了,我们就可以不再用`use()` API,直接在客户端组件中`async/await`,直接在客户端上,获取到数据再进行组件渲染了.

## 数据获取的Hooks
除了最方便地利用三方库获取数据,我们还可以自行编写数据获取的hooks,自行处理数据获取的各种状态.虽然于生产而言不太有利,但这是学习React数据获取基础的一个好方法.
```js
"use client";
import { getPosts } from "@/features/post/queries/get-posts";
import { Post } from "@/features/post/types";
import { useEffect, useState } from "react";

const PostPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
        const fetchPosts = async () =>{
            const posts = await getPosts();
            setPosts(posts);
        };
        fetchPosts();
    }, []);
    // return ... 
}
```
没有像React Query这样的三方库之前,开发者就是利用`useEffect()`和`useState()`获取数据的.当然以上只是实现的冰山一角,你还有各种各样的状态需要额外处理,比如状态加载,缓存,请求竞争等等.  

## TRPC For Typed Data Fetching
大部分的数据获取模型,都是客户端-服务器,经由REST结构实现.而客户端请求,大部分又由React Query实现.  
其中又有另外的问题了:无法跨越网络实现类型安全.(无法确保类型的正确性).你需要利用额外的库,如OpenAPI生成typed schema.  
生成类型schema的工具叫RPC(Remote Procedure Calls),tRPC就是一种.它是生成类型安全的一个API层.以下是结合tRPC获取数据的一个使用例子:
```js
"use client";
import {trpc} from '~/trp/client';
const PostPage = () => {
    const posts = trpc.posts.getPosts.useQuery();
    // ...
}
```
使用tRPC的一大好处就是,从数据获取的函数,到获取后的数据,都是类型安全的(具有类型推导,输入输出的类型都已事先推导).  
这样你就能避免一些运行时错误,拥有更好的开发体验了.但需要知道的是,tRPC是一种全栈解决方法,你需要Node.js搭配Typescript一起使用.
::: tip
[全栈Typescript与tRPC](https://www.robinwieruch.de/react-trpc/)
:::

## 总结
说了那么多,最推荐的React获取数据方式是什么呢?答案不一,看你选的技术栈.如果你用的技术支持React服务器组件,那我强烈建议利用RSC特性获取数据.如果你构建的应用是客户端渲染的,那我建议你用React Query.  
目前而言,构建单页面应用较好的数据获取方式是利用**React Query**.哪怕是一些高级的SSR应用,我也建议使用React Query.因为它实在太方便了,为我们处理了很多状况.(如竞争态,缓存,重校验,无限滚动等).  
如果你选择的技术栈支持RSC,以及需要支持更高级的数据获取模式,比如无限滚动,你可以结合使用RSC和ReactQuery.这样你可以利用RSC获取初始数据,再用RQ在客户端上完成后续其它数据请求.  
目前而言,实验性的`use()`API不太建议用于生产环境.此文仅用于知晓这一方式,预示未来的可能.  
如果作为初学者想学习React Query是怎样一步步实现各种数据获取的功能的,可以自行编写自己的hooks来获取数据.(`useEffect`+`useState`);  
到了实际应用我还是建议你利用RQ或RSC.  
如果你用的技术不支持RSC,而又要实现类型安全,那就用tRPC吧.它是一个提供类型安全的API层.仅在后端也是Typescript+Node.js时推荐使用,因为tRPC就是一种全栈解决方案.  

---
总结部分有些冗余了.感谢你能看到这里!