# 渐进式JSON

> 原文:https://overreacted.io/progressive-json/

你知道什么是渐进式JPEG吗?(Progressive JPEGs)?[这里是一个比较好的解释](https://www.liquidweb.com/blog/what-is-a-progressive-jpeg/).大概的理念是与其将图片从顶到底加载,不如先将图片模糊化,然后渐进式地将图片变得清晰(crisp).  

如果,我们将这种理念应用到JSON传输上会是怎样的呢?  

假设你有这样一个JSON格式的数据:
```json
{
    "header":"Welcome to my blog",
    "post":{
        "content":"This is my article",
        "comments":[
            "First comment",
            "Second comment",
            //...
        ]
    },
    "footer":"Hope you like it"
}
```

假设你要将这组数据通过网络传输.由于数据的格式是JSON,在最后一个字节加载前你都无法得到一个有效的对象数据.你需要等待所有的数据加载后,再调用`JSON.parse()`,之后再处理这组数据.  

客户端在服务器传送最后一个字节前无法对这个JSON进行任何操作.如果JSON的某个部分在服务器上生成得很缓慢("难产"),(比如`comments`这条数据从数据库中获取需要很漫长的过程),**客户端就无法在服务器完成自身工作之前,进行任意的其它工作了.**  

你觉得对于工程人来说,这真的好吗?但这就是现状--99.9999%*的应用都是这样传输和处理JSON的.对此我们是否能做些什么来改进它呢?  

*这数据是我作的.()

## 流式传输JSON(Streaming JSON)
我们可以实现一个流式JSON解析器来改善状况(streaming JSON parser).流式JSON解析器可以根据不完整的输入来生成一个对象树.
```JSON
{
    "header":"Welcome to my blog",
    "post":{
        "content":"This is my article",
        "comments":[
            "First comment",
            "Second comment"
```
如果这时你就想访问请求结果,流式解析器就会给你这样的数据:
```JSON
{
  "header": "Welcome to my blog",
  "post": {
    "content": "This is my article",
    "comments": [
      "First comment",
      "Second comment"
      // 其余的评论会丢失
    ]
  }
  // footer属性会丢失
}
```
不过这样还是不够好.  

这种方法的一个缺陷是生成的对象有点"畸形"(malformed).比如,对象顶层应有3个属性(`header`,`post`,`footer`),但`footer`属性还没在流中出现.而且`post`属性本应具备三条`comments`数据,不过实际上你也说不出是否还会有更多的`comments`,或是已经加载完所有的`comments`了.  

某种程度上说,这就是流式传输自带的缺陷 -- 谁会想要不完整的数据呢? -- 只不过客户端上很难实际用上这样不完整的数据罢了.由于属性的缺失,数据类型也因而对应不上.我们无法知道数据什么时候是完整的,什么时候又不完整.这也就解释了流式传输JSON为什么不会流行,哪怕它在某些场合下非常有用.  
对于一些在逻辑中就假定得到的数据类型是正确的,传输准备即传输完整的应用,是无法利用这些数据的.  

在上面JPEG的类比中,这种原始的流式传输与默认的"自顶向下"加载机制是相匹配的.你看到的图片是清晰的,只是你仅能看到10%的图片.所以,除了高解析度,你其实根本看不到图片的内容.  

有趣的是,这也是流式HTML默认的工作原理.如果你网速很慢又要加载一个HTML页面,它就会以文档顺序流式传输:
```HTML
<html>
    <body>
        <header>Welcome to my blog</header>
        <article>
            <p>This is my article</p>
            <ul class="comments">
                <li>First comment</li>
                <li>Second comment</li>
```
这样作的好处是浏览器可以部分展示页面,但它也有缺陷.传输的结尾是不定的,浏览器上可能看到很奇怪的内容,或者整个页面的布局都是混乱的.是否会有更多内容,浏览器是不知道的.剩下的内容--像以上的footer标签--就被截断了,尽管它在服务器上已经准备完毕,可以更早的传给客户端.当我们按顺序地流式传输数据时,**一个部分的延迟将拖累整个应用.**  

我们再重复一遍:当我们按顺序的流式传输时,**一个部分的延迟足以拖累后续的全部.**   
于此,你有什么头绪吗?

## 渐进式JSON
还有其它实现流式传输的方法.  

目前为止,我们都是以*深度优先*的方式传输数据的.我们从对象顶层属性开始(`header`),然后是`post`属性,之后是`comments`属性,以此下去.如果某个属性获取慢了,其它所有步骤也都会被搁置下来.

有"深度优先"当然也就会有*广度优先*.  
假设我们以这样方式传递对象顶层属性:
```JSON
{
    "header":"$1",
    "post":"$2",
    "footer":"$3"
}
```
这里的`$1`,`$2`,`$3`是占位符,表示我们还未发送的信息片段.它们后续会被对应的信息所填充替换.  

比如,服务器后续又向流传输了几行数据:
```JSON
{
    "header":"$1",
    "post":"$2",
    "footer":"$3"
}

//  $1
"Welcome to my blog"

//  $3
"Hope you like it"
```
注意到,我们并非必须以特定顺序传输这些数据.以上就是我们发送完了`$1`和`$3`后,而`$2`还在路上.  
当客户端在此时尝试重构这棵数据对象树时,它大概长这样:
```JSON
{
    "header":"Welcome to my blog",
    "post":new Promise(/**还没完成 */),
    "footer":"Hope you like it"
}
```
我们暂且把还在传输的部分,以Promises的形式展示.  
假设后续服务器又向流中添加了数行数据:
```JSON
{
    "header":"$1",
    "post":"$2",
    "footer":"$3"
}

//  $1
"Welcome to my blog"

// $3
"Hope you like it"

// $2
{
    "content":"$4",
    "comments":"$5"
}

// $4
"This is my article"
```

这些"新来"的数据在客户端上看,就会"填充上"之前缺失的信息片段.
```json
{
    "header":"Welcome to my blog",
    "post":{
        "content":"This is my article",
        "comments":new Promise(/**还没完成 */)
    },
    "footer":"Hope you like it"
}
```

此时先前还是Promise的`post`属性,现在就变成了一个对象.不过我们还不知道`comments`的具体内容是什么,所以还是老样子,用Promise来表示. 

最后,当`comments`属性也加载完后,整体就会呈现这个过程:

```JSON
{
    "header":"$1",
    "post":"$2",
    "footer":"$3"
}

// $1
"Welcome to my blog"

// $3
"Hope you like it"

// $2
{
    "content":"$4",
    "comments":"$5"   
}

// $4
"This is my article"

// $5
["$6","$7","$8"]

// $6
"This is the first comment"

// $7
"This is the second comment"

//$8
"This is the third comment"
```

至此,整个数据对象树就完整了.  

```JSON
{
    "header":"Welcome to my blog",
    "post":{
        "content":"This is my article",
        "comments":[
            "This is the first comment",
            "This is the second comment",
            "This is the third comment"
        ]
    },
    "footer":"Hope you like it"
}
```

分块广度优先传输数据的好处是,我们可以渐进式地在客户端上处理数据.只要客户端上能够处理某些"未准备好的"部分(以Promises形式代替),并可以对其余数据进行处理,这!就是一种成功!

## 内联(Inlining)
读到这我们应该大概知道传输机制的基础了.那就再调整一下,看看如何更高效地产出数据.我们再回过头看看上面流式传输的过程是怎样的:
```JSON
{
    "header":"$1",
    "post":"$2",
    "footer":"$3"
}

// $1
"Welcome to my blog"

// $3
"Hope you like it"

// $2
{
    "content":"$4",
    "comments":"$5"
}

// $4
"This is my article"

// $5
["$6","$7","$8"]

// $6
"This is the first comment"

// $7
"This is the second comment"

// $8
"This is the third comment"
```
可能到这里跟"流式"的关系有点太扯了.除非数据某些部分的生成非常慢,不然我们完全无法从单独传输数据行中收益.  

假设现在我们有两个不同的慢操作:加载一篇博客,加载博客的评论.这种情况下,将数据的传输从总体上划分为3块比较合理.  

首先我们传输最外层:
```JSON
{
    "header":"Welcome to my blog",
    "post":"$1",
    "footer":"Hope you like it"
}
```
客户端中对应的数据就会立即变成:
```JSON
{
    "header":"Welcome to my blog",
    "post":new Promise(/**还没完成 */),
    "footer":"Hope you like it"
}
```

之后我们将`post`属性传输过去(不带`comments`):
```JSON
{
    "header":"Welcome to my blog",
    "post":"$1",
    "footer":"Hope you like it"
}
// $1
{
    "content":"This is my article",
    "comments":"$2"
}
```
客户端看到的数据是这样的:
```JSON
{
    "header":"Welcome to my blog",
    "post":{
        "content":"This is my article",
        "comments":new Promise(/**还没完成 */)
    },
    "footer":"Hope you like it"
}
```
最后再把`comments`以单独块传送出去:
```JSON
{
    "header":"Welcome to my blog",
    "post":"$1",
    "footer":"Hope you like it"
}

// $1
{
    "content":"This is my article",
    "comments":"$2"
}

// $2
[
    "This is the first comment",
    "This is the second comment",
    "This is the third comment"
]
```
这样客户端上就会看到完整的对象树了:
```JSON
{
    "header":"Welcome to my blog",
    "post":{
        "content":"This is my article",
        "comments":[
            "This is the first comment",
            "This is the second comment",
            "This is the third comment"
        ]
    },
    "footer":"Hope you like it"
}
```
这种实现方式不仅更简洁,目的也同样达到了.  
总体上说,这种格式让我们可以决定,何时将数据以单独块,何时以多块的形式传输.只要客户端一方可以处理数据不按顺序到达的情况的话,服务器就可以更自由,更"新式"地挑选打包和分块方式了.

## 外联(Outlining)
这种方式带给了我们一个很有趣的结果,我们自然而然地就减少了输出流中的重复内容.假如我们正在序列化一个之前见过的对象的话,我们只需要把它外联(outline)出来,并在后续重用.  

比如我们有个对象树是这样的:
```js
const userInfo = { name:"Dan" };

[
    { type:'header', user:userInfo },
    { type:'sidebar', user:userInfo },
    { type:'footer', user:userInfo }
]
```
如果我们要把上面的数据序列化为JSON格式,我们就不得不重复序列化`{name:"Dan"}`:
```JSON
[
    {"type":"header","user":{"name":"Dan"}},
    {"type":"sidebar","user":{"name":"Dan"}},
    {"type":"footer","user":{"name":"Dan"}}
]
```
而如果我们渐进式地加载JSON,我们就可以利用占位符的优势,outline一次就够了.
```JSON
[
    {"type":"header","user":"$1"},
    {"type":"sidebar","user":"$1"},
    {"type":"footer","user":"$1"}
]

// $1
{"name":"Dan"}
```
我们可以进一步提纯,选择一种更平衡的方式--比如,默认情况下为了简洁而采用内联(inline),当一些对象在两到多个地方被利用时,我们就可以单独外联出来,并在流中实现数据去重(dedupe the rest).  
也就是说,不仅像普通的JSON格式数据,我们利用这种方式还可以序列化循环对象.循环对象就时某个属性指向其自身流中的某行数据(own stream row).

## 流式传递数据 vs 流式传递UI
以上的方法其实就时RSC(React Server Components)的工作原理.  
假设你的页面里有这样一个RSC:
```tsx
function Page() {
    return (
        <html>
            <body>
                <header>Welcome to my blog</header>
                <Post />
                <footer>Hope you like it</footer>
            </body>
        </html>
    )
}

async function Post() {
    const post = await loadPost();
    return (
        <article>
            <p>{post.text}</p>
            <Comments />
        </article>
    )
}

async function Comments() {
    const comments = await loadComments();
    return (
        <ul>
            {comments.map(comment => (
                <li key={comment.id}>{comment.text}</li>
            ))}
        </ul>
    )
}
```

React会像渐进式JSON那样,处理`Page`组件的输出.在客户端上,它会被重建为渐进式的React树.  
最初的React树大概长这样:
```tsx
<html>
    <body>
        <header>Welcome to my blog</header>
        {new Promise(/**还没完成 */)}
        <footer>Hope you like it</footer>
    </body>
</html>
```
然后当`loadPost`在服务器上完成后,更多数据流入该结构
```tsx
<html>
    <body>
        <header>Welcome to my blog</header>
        <article>
            <p>This is my post</p>
            {new Promise(/**还没完成 */)}
        </article>
        <footer>Hope you like it</footer>
    </body>
</html>
```
最后当`loadComments`也完成后,客户端就会接收并加载完剩余部分:
```tsx
<html>
    <body>
        <header>Welcome to my blog</header>
        <article>
            <p>This is my post</p>
            <ul>
                <li key="1">This is the first comment</li>
                <li key="2">This is the second comment</li>
                <li key="3">This is the third comment</li>
            </ul>
        </article>
        <footer>Hope you like it</footer>
    </body>
</html>
```
不过这里就有问题了.  
你不希望页面每当有新数据就随机地在某处加载这些新来的数据.比如你肯定不像博客内容还没加载出来前就展示页面.  

**这就是为什么React不在Promises上"挖洞"的原因.对应展示的方式是该Promise结构上,最近的声明好的加载状态,以`<Suspense>`组件表示.**  

上面的例子中并没有`<Suspense>`边界.也就是说尽管React以流式方式接收数据,它也不会冒泡一样,哪条数据加载好了就在哪个地方填充展示.React会等待整个页面的数据都准备好后再展示.  

不过,你可以自主选择,将部分UI树用`<Suspense>`包裹起来.渐进式地展示加载中状态.这样并不会改变数据传递方式(它还是会尽可能地"流式传输"),只是它改变了React展示给用户的时机而已.  
比如:
```tsx
import { Suspense } from 'react';

function Page() {
    return (
        <html>
            <body>
                <header>Welcome to my blog</header>
                <Post />
                <footer>Hope you like it</footer>
            </body>
        </html>
    )
}

async function Post() {
    const post = await loadPost();
    return (
        <article>
            <p>{post.text}</p>
            <Suspense fallback={<CommentsGlimmer />}>
                <Comments />
            </Suspense>
        </article>
    )
}

async function Comments() {
    const comments = await loadComments();
    return (
        <ul>
            {comments.map(comment => (
                <li key={comment.id}>{comment.text}</li>
            ))}
        </ul>
    )
}
```

这样用户就会看到两个加载的阶段:
* 首先,博客内容跟标题(header),脚注(footer)以及"加载中"的评论一同展示.标题和脚注的内容不会单独出现.
* 然后,评论以自己的方式,加载到页面中.

**换句话说,页面展示的阶段跟数据传输的阶段分开了.可用的数据会被流式传输到客户端,但我们只想根据设计好的加载状态向用户展示内容.**  
某种意义上说你可以把React树上的Promises像`throw`关键字那样处理,而`<Suspense>`的作用就跟`catch`那样运作.只要数据无论以何种顺序,成功从服务器传输过来了,它们就会交给React优雅地按序展现加载,并让开发者控制数据展示.  

说了一大堆,其实跟SSR或HTML是没有关系的.我只是将流式渲染UI树的大概机制用JSON表示一下.你可以将JSON树转变为渐进式展示的HTML(React确实做得到),但这个转变的过程绝非限于表面,这种概念甚至可以应用到类SPA导航中去.  

## 结论
这篇文章我只是概括了RSC的其中一个核心变革.它为你的组件树由外至内注入属性,而不是以"大块"的数据形式传输.结果是,只要有任意加载状态需要展示,React就会在其它数据正在流式传输时展示这个加载状态.  

我的希望是,更多的工具支持渐进式流式传输数据这种方式.每当你遇到由于后端没完成工作导致前端无法开始工作的情况,这时你就可以考虑使用流式传输了.而当一项工作拖慢了后续的所有时,你也可以考虑用这种方式了.  

前文提过,单用流式传输是不够的--你还需要一种编程模式(programming model)来充分利用这种技术,优雅地处理那些不完整的信息.  
React的处理方式是利用`<Suspense>`显示加载状态.如果你知道其它更好的处理方式,我很乐意听听你的想法.

---

感谢你能看到这里!











