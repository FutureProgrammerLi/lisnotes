# 服务器组件
> 是Server Component 实践后引发的兴趣,觉得自己对服务器组件概念理解还不够深.  
> 指望翻译官网服务器组件和服务器函数的文档,来加深理解. 
> [原文地址](https://react.dev/reference/rsc/server-components)

**服务器组件是一种新类型的组件, 它会在一个跟客户端或SSR服务器独立的环境中,在被打包之前,预先被渲染.**  

这个"独立"的环境就是React服务器组件中的"服务器"部分.服务器组件既可在持续集成服务器上构建好后运行,也可以利用网络服务器,每请求一次就运行一次.  

本文章的内容概括:
* ["无服务器"的服务器组件](#无服务器的服务器组件)
* ["有服务器"的服务器组件](#有服务器的服务器组件)
* [在服务器组件中添加可交互内容](#在服务器组件中添加可交互内容)
* [服务器组件与异步组件的配合使用](#服务器组件与异步组件的配合使用)

::: tips
<div className='text-xl font-bold'>要怎么做才能在原有项目上支持服务器组件功能?</div>  

虽然React服务器组件在Reactv19版本后已经稳定且后续不太可能发生大的变化,不过底层实现服务器组件的APIs打包器或框架并不完全遵从相同的语义解释(semver),19.x版本之间反而可能还是会发生冲突.(???)  

为了解决这个问题,我们建议您的项目中使用特定的React版本,或直接采用Canary版本.我们会在后续持续与各打包器和框架的作者沟通,以确保它们能与React服务器组件的APIs兼容.  
:::

## 无服务器的服务器组件
服务器组件可以在构建的时候运行,因此,读取文件系统或获取静态内容都是可以的,这样连网络服务器都省掉了.  
举个例子,如果你要从某个内容管理系统中读取静态数据.如果没有服务器组件的话,你可能需要配合`useEffect`来在客户端中获取数据:
```js
// bundle.js
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';

function Page({page}){
    const [content, setContent] = useState('');
    // 以下内容只会在页面渲染后才开始加载
    useEffect(() => {
        fetch('/api/content')
        .then(res => res.json())
        .then(data => setContent(data.content))
    }, [page]);
    return <div>{sanitizeHtml(marked(content))}</div>;
}
```

```js
// api.js
app.get('/api/content', async (req, res) => {
    const page = req.params.page;
    const content = await file.read(page);
    res.send({content});
})
```

如果采用这种模式解决的话,客户端就需要下载并解析额外的,打包后还有75K三方库内容,而且还有在页面加载完后额外通过请求获取这些数据.而这些时间的耗费,仅仅是为了渲染一些无论页面怎么变,它也不会变的内容.  

而如果你用了服务器组件,你就可以直接在构建的时候就渲染好这些组件了:
```jsx
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
// 以上这些库都不会打包发送给客户端


export default function Page({page}){
    // 应用构建时,页面渲染的时候就会开始加载
    const content = await file.read(`${page}.md`);
    return <div>{sanitizeHtml(marked(page))}</div>;
}
```

渲染好的输出内容后续可被服务器渲染成HTML,并上传到CDN.  
应用加载的时候客户端时不会看到原本的`Page`组件的,也不知道用来渲染markdown的三方库的存在.客户端只会看到以下输出内容:
```html
<div><!-- html for markdown --></div>
```
也就是说,页面首次加载时这些markdown内容就已经是可见的了,客户端接收到的包内不会包含用于渲染这些内容的库.

::: tips
或许你已经注意到了,上面的服务器组件是个异步函数
```jsx
aysnc function Page({page}){}
```
异步组件是服务器组件的一个新特性,你可以在里面定义`await`,在渲染时等待异步操作完成.  
你可以跳到[这个章节](#服务器组件与异步组件的配合使用)了解更多相关内容.
:::
## 有服务器的服务器组件
服务器组件也可以在页面请求时在网络服务器上运行,这样你就可以直接访问数据层而无需构建API了.它们会在应用打包前被渲染,也可以将数据和JSX以props的方式传递给客户端组件.  

没有服务器组件的话,我们通常会用`useEffect`来在客户端上获取动态数据:  
```jsx
// bundle.js
function Note({id}){
    const [note, setNote] = useState(null);
    // 以下内容只会在页面渲染后才开始加载
    useEffect(() => {
        fetch(`/api/note/${id}`)
        .then(data => setNote(data.note))
    }, [id]);
    return (
        <div>
            <Author id={note.authorId} />
            <p>{note}</p>
        </div>
    )
};

function Author({id}){
    const [author, setAuthor] = useState('');
    useEffect(() => {
        fetch(`/api/author/${id}`)
        .then(data => {setAuthor(data.author)})
    }, [id]);
    return <span>By: {author.name}</span>;
}
```

```js
// api.js
import db from './database';

app.get('/api/notes/:id', async (req, res) => {
    // ? 什么js后端能直接获取id这个参数? req.params.id呢?
    const id = await db.notes.get(id);
    const note = await db.getNote(id);
    res.send({note});
});

app.get('/api/authors/:id', async (req, res) => {
    const author = await db.authors.get(id);
    res.send({author});
});
```

而用了服务器组件,你就可以直接在组件内读取并渲染这些数据了:
```jsx
import db from './database';

async function Note({id}){
    // 渲染时加载
    const note = await db.notes.get(id);
    return (
        <div>
            <Author id={note.authorId} />
            <p>{note}</p>
        </div>
    )
}

async function Author({id}){
    // 在Note组件之后加载, 不过数据在同一位置(co-located data)就可以更快了
    const author = await db.authors.get(id);
    return <span>By: {author.name}</span>;
}
```

打包器可以将数据库数据,渲染好的服务器组件,以及动态客户端组件打包到一起.之后你可以选择将这个包,通过服务器渲染(SSR),为页面创建初始的HTML内容. 当页面加载时,浏览器是看不到`Note`和`Author`组件的,它只会看到以下渲染好的内容:
```html
<div>
    <span>By: The React Team</span>
    <p>React 19 is...</p>
</div>
```
服务器组件也可以通过向服务器重复获取数据以变得更为"动态"(dynamic),这样就能重新读取并再次渲染了.  
这种新的应用架构结合了以服务器为中心,多页面应用的"请求/响应"模型,以及以客户端为中心的,单页面应用的无缝交互特点,从而令你更好的发挥两者的优势.  

## 在服务器组件中添加可交互内容
服务器组件是不会被发送到浏览器的,因此它不像客户端组件那样,可以使用`useState`,`useEffect`等钩子函数.  
如果你要服务器组件像客户端组件那样添加可交互内容,那你就需要用到`"use client"`指令了. 

::: tips
**没有声明服务器组件的指令.**  
(?? `"use server"`指令呢?)  

一种常见的误解是,以为使用了`"use server"`指令的组件就是服务器组件.  
实际上,这个指令的作用是为了**声明服务器函数的.**  

更多关于`"use server"`的信息,可以查看[这个文档](https://react.dev/reference/rsc/directives)
:::

下面的例子中:`Notes`这个服务器组件中,引入了`Expandable`客户端组件,后者内部使用了`useState`以管理`expanded`是否展开这个状态.

```jsx
// Server Component
import Expandable from './Expandable';

async function Notes(){
    const notes = await db.notes.getAll();
    return (
        <div>
            {notes.map(note => (
                <Expandable key={note.id} >
                    <p note={note} />
                </Expandable>
            ))}
        </div>
    )
}
```

```jsx
// Client Component 
"use client";

import { useState } from 'react';

export default function Expandable({children}){
    const [expanded, setExpanded] = useState(false);
    return (
        <div>
            <button onClick={() => setExpanded(!expanded)}>Toggle</button>
            {expanded && children}
        </div>
    );
}
```

工作原理是这样的: 先渲染服务器组件`Notes`,然后React指示打包器创建`Expandable`这个客户端组件包.  
在浏览器内,客户端组件只可看到服务器组件传递给它的`props`而不知服务器组件本身的内容.
```html
<head>
    <!-- 客户端组件的包 -->
     <script src='bundle.js'></script>
</head>
<body>
    <div>
        <Expandable key={1}>
            <p>this is the first note</p>
        </Expandable>
        <Expandable key={2}>
            <p>this is the second note</p>
        </Expandable>
        <!-- ...  -->
    </div>
</body>
```

## 服务器组件与异步组件的配合使用
服务器组件的诞生,促使了异步组件的诞生.我们可以使用`async/await`来编写服务器组件了.  
当你在异步组件中使用`await`时,React会在渲染时挂起并等待异步操作完成.  
它的实现原理是服务器和客户端的边界划定,以及`Suspense`流式传递的功能支持.  

你甚至可以在服务器上创建一个Promise,然后在客户端上`await`等待这个Promise完成. 
```jsx
// server component
import db from './database';

async function Page({id}){
    // 这里遇到await会挂起这个服务器组件
    const notes = await db.notes.get(id);

    // 这里不用await, 直接把Promise原封不动给客户端,也是可以的,那就在客户端上执行await这个Promise
    const commentsPromise = db.comments.get(note.id);   
    return (
        <div>
            {note}
            <Suspense fallback={<p>Loading comments...</p>}>
                <Comments commentsPromise={commentsPromise} />
            </Suspense>
        </div>
    );
}
``` 

```jsx
// client component
"use client";
import {use} from 'react';

function Comments({commentsPromise}){
    //这里会"接收"来自服务器的promise.挂起本组件,获取数据后再展示出来
    const comments = use(commentsPromise);
    return comments.map(comment => <p>{comment}</p>);
}
```

这里的`note`内容显然也是页面的主要内容,所以我们直接在服务器上`await`.而具体的评论内容是折叠起来的,相较没那么重要,所以我们在服务器上创建开始这个Promise,然后在客户端上用`use`API来等待它完成.  
这会导致客户端上被挂起,而不阻碍`note`内容的渲染.  

由于客户端上是不支持异步组件这个功能的,因此我们需要借用`use`来等待Promise完成.(await the promise).  


