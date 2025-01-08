# 服务器渲染
服务器渲染(Server-side Rendering,SSR),是渲染网页内容的一种最为古老的方法了.用户请求服务器,服务器将完整的HTML内容返回给客户端.这些内容就包括了来自数据库或外部API的数据.  

连接数据库和数据获取的操作,全都在服务器上进行.用于格式化内容的HTML也是在服务器上生成.因此给我们带来的好处是,客户端不用额外的网络来回,以请求数据或获取内容模板.而且,用于渲染的代码也不需要在客户端上执行,对应的JS代码也不用发送给客户端了.  

使用SSR技术的话,客户端的每个请求都是独立处理,被服务器端视为新请求那样一一处理的.哪怕连续两个的请求,回复的内容没有什么区别,服务器都会"从零开始",对请求进行处理,回复.由于服务器都会面向多个客户端,因此,服务器的处理能力在特定时间内是跟所有活跃用户共享的.  

## 典型的SSR实现
用代码举例,如何利用典型的SSR和JS代码,生成一个展示当前时间的网页:
::: code-group
```html [index.html]
<!DOCTYPE html>
<html>
   <head>
       <title>Time</title>
   </head>
   <body>
       <div>
       <h1>Hello, world!</h1>
       <b>It is <div id=currentTime></div></b>
       </div>
   </body>
</html>

```

```js [index.js]
function tick() {
    var d = new Date();
    var n = d.toLocaleTimeString();
    document.getElementById("currentTime").innerHTML = n;
}
setInterval(tick, 1000);
```
:::

你可以看看之前,[我们是如何用客户端渲染生成相同的内容的](./Client-Side-Rendering.md#基础结构).值得注意的是,尽管这个HTML内容是由服务器端生成的,但这个时间还是客户端的本地时间,因为这个时间是由JS代码的`tick()`函数生成并填充上去的.  
如果你想展示一些服务器相关的数据,比如服务器端上的时间是什么,那你就要在HTML被渲染前,提前将这些数据嵌入进去.也就是说,这些服务器数据如果后续不通过网络请求重新获取的话,对应的服务器数据也是不会刷新的.

## 好处和坏处
在服务器上执行页面渲染代码,减少发送给客户端的JS代码,还有以下好处: (?这两个不就是吗)  

### 1.更少的JS代码意味着更短的FCP和TTI
(FCP,First Contentful Painting; TTI, Time To Interactive)  
当页面有大量的UI元素及逻辑处理时,SSR跟CSR对比,能减少大量的JS代码.于是用于加载和处理脚本的时间自然也会减少了.FP,FCP,TTI所需时间都会更少,而且FCP=TTI,首屏即可交互.用户不再需要等待屏幕上各个元素逐步出现,逐个变得可交互.
![fcp-tti](/RenderPatterns/fcp-tti-ssr.jpg)

### 2.客户端JS代码可相应增加
(?服务器端减少了你就能给客户端自行增加了是吧?)  
开发团队为达到相应的性能指标,需要对页面的JS代码进行一定的限制.而用了SSR,你就能直接消除部分用于渲染的JS代码了,也就会空出额外的余量,用来引入三方JS或是实现其它的功能了.  

### 3.启用了SEO
服务器渲染的应用,能轻易被搜索引擎爬虫爬到,因此页面的搜索引擎优化程度也就更高了.  

---
**SSR确实适合一些静态内容较多的网站.不过,它当然也有不适用的场景:**

### 1.缓慢的TTFB
(TTFB,Time to First Byte)  
因为所有的请求处理都是在服务器上进行的,所以以下场景就很可能出现响应迟缓的情况:
* 多个用户同时请求导致服务器过载
* 网络环境差
* 服务器端本身的处理代码不够好,没有很好的优化

### 2.一些交互导致整个页面的重加载
由于渲染的代码都不在客户端上,所以一些比较重要的操作,不得不发送请求到服务器端上处理,由此产生频繁的网络来回,频繁的全页面重加载.用户同时进行多个重要操作时,处理的所需时间就会更长了,用户也不得不长时间等待.因此单页面应用基本都不会使用SSR.  

为了解决以上问题,如今许多框架和库都能同时在服务器和客户端进行渲染.后面我们会进一步介绍.我们先来看看Next.js是如何更简单实现SSR的.

## Next.js的SSR
Next.js框架支持SSR功能.每次请求它都能在服务器端上预渲染相应页面.具体实现如下:在页面内导出`getServerProps()`的异步函数:
```ts
export async function getServerProps(context){
    return {
        props:{}, // 这里的内容会作为props传递给当前页面的组件
    }
}

```
这个函数的`context`参数是一些关键信息,包括HTTP请求和响应对象,路由参数,查询参数,locale(请求地址?),等等.  

以下是较为详细的,`getServerProps()`方法的具体使用,利用React将一些服务器端数据渲染到页面上再发送给客户端.[完整的代码可以看这里.](https://medium.com/swlh/fetching-and-hydrating-a-next-js-app-using-getserversideprops-and-getstaticprops-65bfe42afed8)

```tsx
// 利用`getServerSideProps`从外部数据源获取数据并渲染到页面上
const Users = ({users, error}) => {
    return (
        <section>
            <header>
                <h1>List of users</h1>
            </header>
            {error & <div>There was an error.</div>}
            {!error & users & (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user,key) => (
                            <tr key={key}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    )
}

export async function getServerProps(){
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();

    return {
        props:{
            data
        }
    }
}
```

## React的服务器端
React是可以多端渲染的(isomorphically),换句话说,React既可在浏览器上渲染,也可以在其它平台上渲染(比如服务器上).所以,我们可以用React在服务器上渲染UI元素(?).  

React甚至具有代码通用的功能,一套代码多环境运行.这一功能的实现依赖于Node.js.因此,通用的JS代码可用于在服务器端上获取数据,并用同构React对其进行渲染.  

让我们看看我们说的是什么吧(?):
```ts
ReactDOMServer.renderToString(element);
```
这个函数返回一个该React元素对应的HTML字符串,而这个字符串能快速地被渲染到客户端上(?).  

`renderToString()`还能搭配`ReactDOM.hydrate()`使用.结果是HTML渲染归渲染.注水?加载后再说.  
为此,我们分别用不同的js文件进行处理:服务器端的js用以渲染HTML,客户端的js用以注水.  
假设我们`app.js`文件里有个`App`组件.这样服务器和客户端React都能辨认出这个`App`元素.  

假设`ipage.js`是服务器端处理文件:(??? 莫名奇妙的ipage)
```js
// ipage.js
app.get("/",(req,res) => {
    const app = ReactDOMServer.renderToString(<App />);
});
```

这样`<App/>`就成了HTML渲染的容器了.而客户端上的`ipage.js`则用以下代码对`App`的内容进行注水:
```js
ReactDOM.hydrate(<App />, document.getElementById("root"));
```

[完整的代码例子可以看这里.](https://www.digitalocean.com/community/tutorials/react-server-side-rendering)

---
感谢你能看到这里!