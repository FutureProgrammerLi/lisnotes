# 每次导航的来回

你觉得,每次导航到一个新的页面时,你需要发送多少个请求?  

最简单的情况是:一次导航一次请求.你点击一个链接,浏览器请求获得对应URL的HTML内容,然后将其展示出来.  
实际上,情况要复杂一些.大部分页面还可能需要展示一些图片,加载一些客户端脚本,添加一些额外的样式等等.如此一个请求很可能是不够的.  
而多个请求就有可能导致渲染阻塞(render-blocking),浏览器因此也会延迟渲染页面内容,剩下的内容就像变得"可有可无"了("nice-to-have").  
或许剩下的才是交互的重点,但浏览器此时已经可以展示加载到的内容了.  

好吧,不过对于加载数据而言呢?  
我们要调用多少个API请求,才能获取到下一个页面所需的数据呢?  

## HTML
对于以前的网页开发者而言,这个问题似乎是不合理的,因为那时的客户端交互需要开发量少之又少.根本没有"请求API"的概念,因为你不会将之前的服务器想象为API服务器--服务器就是服务器,返回HTML就够了.  

**对于传统的"HTML"应用,(也称作网站)只需要一次网络来回就能获取到所有数据了.**用户点击一个链接,服务器返回HTML,之后所有用于展示下一个页面的必要的数据也就嵌入到那个HTML中了.返回的HTML本身就是所有的数据了,不需要额外的处理--时刻可以被展示出来了:
```HTML
<article>
    <h1>One Roundtrip Per Navigation</h1>
    <p>How many requests should it take to navigate to another page?</p>
    <ul class="comments">
        <li>You're just reinventing HTML<li>
        <li>You're just reinventing PHP<li>
        <li>You're just reinventing GraphQL<li>
        <li>You're just reinventing Remix<li>
        <li>You're just reinventing Astro<li>
    </ul>
</article>
```
(是的,技术上说,像图片,脚本,样式这些静态,可重用,可缓存的部分已经被"描述(outlined)"出来了,不过你必要时随时可以内联(inline)再添加新内容)

## "REST"
当我们需要将更多的应用逻辑添加到客户端时,事情就变得复杂了.我们需要获取的数据一般由需要展示的UI所决定.当我们需要展示一篇博客,我们就要获取博客相关的数据.当需要展示博客的评论时,我们就要获取相关的评论.  
所以,你又要发送多少个请求呢?  

JSON APIs,也叫REST,是一种根据每个抽象概念"资源"而向外暴露的端点(endpoint)技术.没人知道这个"资源"具体是什么,但它的定义一般交由后端团队来决定.所以你获得的,可能是"博客资源",也可能是"博客评论资源".通过两次的获取资源,你就能为博客页面加载对应数据了.  

可是,这两次的获取是在哪里发生的呢?  

对于以服务器为中心的HTML应用,你可以在一次请求中发送两次REST APIs,将所有获取到的数据整合到一次响应中.*因为REST API请求是发生在服务器上的*.REST API一般用作数据层的显式边界(explicit boundary),不过这一层的存在又不是必须的(不少框架喜欢用一种可导入的in-process数据层来表示--像Rails或Django).HTML(数据)可以无视REST的结果,一次传递结果到客户端(浏览器).  

当向客户端UI添加更多的交互时,我们自然除了要保持原有的REST APIs,还要在客户端向服务器发送(`fetch`)请求了.这不就是JSON APIs带给我们的巨大便利性之一吗?一切数据都变成了一个JSON API:
```ts
const [post, comments] = await Promise.all([
    fetch(`/api/posts/${postId}`).then(res => res.json()),
    fetch(`/api/posts/${postId}/comments`).then(res => res.json()),
])
```

**可结果是,现在我们要在客户端发送两次请求了:一次获取博客内容,一次获取对应评论.** 一个页面--一次链接点击--通常需要获取多个"REST资源".  
最好的情况是一次请求,后端处理多个端点然后统统返回就"大功告成"了.最差的情况是,为了获取N个资源,触发N个端点;或者像瀑布一样,一个接一个地发送请求.(先获取某些数据,前端计算这些数据,之后又用前面的结果向服务器请求更多数据)

这时就有效率问题了.在服务器端处理多个REST请求都是很轻易的("cheap"),因为我们可以控制如何部署代码(?).如果这些REST端点服务器离我们很远,我们可以选择近一点的服务器,或是将代码移到进程中(in-process).我们可以利用复制或服务器端缓存技术.当某些资源"卡住了",我们可以在服务器端利用多种技术来改善那些不足.可以为服务器端提升性能的工具和技术有很多很多.  

可是当你将服务器想象为黑盒时,你就不能利用这些技术提升API的效率了.如果服务器不是并行处理请求,同时返回所有数据的话,你就优化不了客户端/服务器端瀑布式请求.如果服务器没有提供一个API返回多个所需资源的端点的话,你就无法减少并行请求的数量了.  

这样下去前端性能迟早会崩溃的.(hit a wall).

## 组件
上述问题对于效率和封装要求不那么严谨的情况下并不会特别突出.作为开发者,我们自然想将加载数据的逻辑,和数据利用的代码尽可能整合在相近的地方.  
这时可能就有人说了,这样肯定会导致"意大利面式代码(spaghetti code)"了,我们不想写出这种代码!这种观念根深蒂固.  
还记得之前说的吗?UI决定数据.你需要的数据,取决于你需要展示的内容.数据获取的逻辑跟UI的逻辑**天生就是耦合的**--一方改变,另一方至少就要知晓.有页面没数据(underfetching),有数据页面不展示(overfething)都是不可取的.  
问题是,你要如何保持UI逻辑跟数据获取的同步呢?  

最直接的方法是,将数据加载的逻辑直接放到UI组件中.之前`Backbone.View`里的`$.ajax`,`useEffect`里的`fetch`都是这么干的.React开发的应用大部分都是这样做的--现在依旧如此.  
这样做的好处是相关代码相邻(colocation):加载数据的代码跟消耗数据的代码就在同一个位置.不同开发者可以编写依赖不同数据源的组件,然后将它们组合起来.  

```jsx
function PostContent({ postId }) {
    const [post, setPost] = useState();
    useEffect(() => {
        fetch(`/api/posts/${postId}`)
            .then(res => res.json())
            .then(setPost)
    },[])
    if(!post) return null;
    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            <Comments postId={postId} />
        </article>
    )
}

function Comments({ postId }) {
    const [comments, setComments] = useState();
    useEffect(() => {
        fetch(`/api/posts/${postId}/comments`)
            .then(res => res.json())
            .then(setComments)
    },[])
    return (
        <ul className="comments">
            {comments.map(comment => (
                <li key={comment.id}>{comment.text}</li>
            ))}
        </ul>
    )
}
```

可是,这样做只会将前述的问题放大.不但渲染一个页面需要调用多个请求,这些请求还分散在各个代码块里.那要怎么处理呢?  

一些开发者可能想修改组件代码,加上一些数据加载的逻辑上去,为用到这些组件的页面加上瀑布流等加载技术.如果我们的组件只在服务器上运行--像[Astro的组件](https://docs.astro.build/en/basics/astro-components/)那样--最好时没有数据获取,最坏时数据内容是可预测到的.但在客户端上,数据获取逻辑随组件树深度散布下去,还没有什么好方法解决的话--我们还不能将客户端向服务端靠近(网络上和物理上都是).(而且瀑布式请求还无法在客户端解决--哪怕用预获取的方式也只是缓解而已).  

我们看看能不能为获取数据的代码添加一些"结构代码"能不能解决这个问题.  

## 查询工具
有趣的是,结构化的数据获取工具--像`React Query,(useQuery)`-- 自身也无法避免这个问题.它们对于`useEffect`里的`fetch`方法好一点,能缓存,能有很多优化方案.可是你还是无法避免,多个资源多个请求,瀑布式请求的问题.
```jsx
function usePostQuery(postId) {
  return useQuery(
    ['post', postId],
    () => fetch(`/api/posts/${postId}`).then(res => res.json())
  );
}
 
function usePostCommentsQuery(postId) {
  return useQuery(
    ['post-comments', postId],
    () => fetch(`/api/posts/${postId}/comments`).then(res => res.json())
  );
}
 
function PostContent({ postId }) {
  const { data: post } = usePostQuery(postId);
  if (!post) {
    return null;
  }
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <Comments postId={postId} />
    </article>
  );
}
 
function Comments({ postId }) {
  const { data: comments } = usePostCommentsQuery(postId);
  return (
    <ul className="comments">
      {comments.map(c => <li key={c.id}>{c.text}</li>)}
    </ul>
  );
}

```
其实客户端缓存真实作用并不大(red herring).在客户端按后端按钮时能立即展示之前的页面,能重用像标签栏这样的缓存资源(所以能用还是建议用).可是对于大多数页面切换--主要是点击链接--用户实际上还是想看到新鲜的内容的.



