# 静态渲染

了解过SSR后我们知道,服务器端处理请求时间长的话会影响TTFB,导致网页性能缓慢.同样的,客户端渲染也有弊端:大体积的JS包则会影响FCP,TTP,因为客户都不得不花大量时间去下载和处理这些脚本.  

静态渲染,或说是静态生成(SSG),就是用来解决以上弊端的:在网站构建的时候,生成预渲染的HTML内容,并把这个HTML发送给客户端.  

用户访问对应路由的静态HTML文件会预先被生成.这些静态HTML文件会先放置到服务器端上,或通过CDN可被访问到,用户可以随时请求获取到.  

这些静态文件也因此可被缓存下来,具有更强的稳定性.由于这个HTML响应内容可以提前生成,服务器对应的处理时间自然可以忽略不计了,结果就是TTFB更快,性能更加优秀.理想情况下,客户端JS代码量应是最小的,静态页面在客户端接收到后不久就能变得可交互.总结来说,SSG这种方式就是能提升FCP/TTI两个性能指标.  
![ssg](/RenderPatterns/ssg.jpg)

## 基础结构
恰如其名,静态渲染的出现就是为了静态内容渲染的.比如页面不需要根据登入的用户而定制化(比如个人推荐内容).像*About us*,*Contact us*, 博客页面或是电商产品页等内容,我们都建议使用静态渲染.Next.js,Gatsby,VuePress这些框架都支持静态生成功能.  
我们拿Next.js举例,静态渲染不带额外数据源的页面内容:

### Next.js
```jsx
// pages/about.jsx
export default function About(){
    return (
        <div>
            <h1>About us</h1>
            {/**/}
        </div>
    )
}
```
构建网站的时候(`next build`命令后),以上页面就会被预渲染为`about.html`文件,通过访问`/about`路由查看对应内容.

## 带有额外数据的静态生成
像*About us*,*Contact us*这些页面可以直接完整展示毫无动态的内容,不需从额外数据源获取数据.不过,有些页面像个人博客或产品页面这些,数据则可能需要从另外数据源获取,再整合到特定模板,再在构建时渲染为HTML.  

生成多少HTML页面,分别取决于有多少条博客,以及由多少个商品.为了能够正确访问到这些页面,你可能需要对应详尽的格式化的,关于这些静态页面的信息列表.  
我们看看用Next.js如何根据已有的信息,静态生成对应的信息列表吧:

### 列表页面 - 包含所有静态网页的关键信息
页面内容需要根据外部数据生成时,你就需要生成对应的列表页面了.外部数据会在构建的时候从数据库获取,用以生成需要的页面.  
在Next中,我们可以在`page`文件中导出函数`getStaticProps()`来实现.这个函数会在构建时,从服务器上被调用,获取需要的数据.获取到的数据通过组件的`props`属性传到组件,以预渲染页面组件.  
我们拿[这条博客](https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation#all-products-page-static-generation-with-data)里的部分代码来展示一下具体是怎么用的:

```js
// 以下函数会在构建时在构建服务器上被调用
export async function getStaticProps(){
    return {
        props:{
            products: await getProductsFromDatabase(),
        }
    }
}

// 组件会在构建时,接收到以上props.products的具体内容
export default function Products({products}) {
    return (
        <>
            <h1>Products</h1>
            <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </>
    )
}

```
这个异步函数不会被打包到客户端中,因此可以用来从数据库中获取后台数据.

### 各自的具体信息 -- 每个页面
上面的代码生成了产品列表.我们需要通过点击每个产品,跳转到展示具体的产品信息页面.  
假设我们有`101`,`102`,`103`等产品.因此我们要生成`/products/101`,`/products/102`,`/products/103`等等的路由内容.为此,我们需要结合`getStaticPaths()`方法,还有[动态路由](https://nextjs.org/docs/routing/dynamic-routes).  

首先创建公共页面组件:`products/[id].js`,并导出`getStaticPaths()`函数.函数需要返回所有可能的产品id,以在构建的时候预渲染各自独立的产品页面.以下是用Next,大概实现这个功能的代码架构:([具体看这](https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation#individual-product-page-static-generation-with-data))
```js
// pages/products/[id].js

// 先确定具体要渲染的内容是什么,可直接从数据库获取到所有产品信息,并对信息进行过滤(比如只用产品的id来生成页面)
export async function getStaticPaths(){
    const products = await getProductsFromDatabase();

    const paths = products.map(product => ({
        params: { id: product.id }
    }));

    return { paths, fallback:false}
    // fallback属性表明,没有正确产品id的话,提示404
}

// params包含每个生成页面对应的id
export async function getStaticProps({params}) {      
    // 有点麻烦, path => /products/[id].js , props => product
    return {
        props:{
            product: await getProductsFromDatabase(params.id),     
        }
    }
}

export default function Product({product}){
    // ... 渲染具体产品信息
}

```
产品页的具体信息会根据`getStaticProps`获得的内容,在构建时填充到对应页面.注意一下上面的`fallback`标识.它的意思是如果没有对应的路由或产品id,则向用户提示404.  

至此,我们学会了如何用SSG,预渲染包含不同类型内容的页面了.

## SSG -- 一些不得不考虑的东西
SSG能极大地提升网页性能,因为它省去了客户端和服务器端的处理时间.生成的网页也是SEO友好的,因为内容是预先生成的,网页爬虫可轻易爬取到.虽然说了SSG这么多的优点,不过你还是需要考虑以下因素,充分评估这项技术是否适用于你要开发的应用:
1. **大量的HTML文件:** 用户可能访问到多少个页面,就会有多少个HTML被生成.比如用以生成博客的话,有多少条博客对应就会生成多少个HTML文件存到数据仓库中.因此,对任意博客进行编辑,你都需要重新构建所有内容,才能将修改的内容反映到对应HTML文件中去.当HTML文件数量到达一定程度的话,维护起来还是会有难度的.  
2. **依赖部署环境:(?)** 如果你的SSG网站想加载又快响应又快,你就要慎重决定将它们部署到什么平台了.如果你网站本身优化配置好,平台部署技术领先,能利用多个CDNs处理边界缓存的话,你的网站就会有极致的性能表现.  
3. **动态内容考虑:** SSG网站内容每次的变化都需要重新构建和重新部署. 这就可能导致,开发者不重构建,重部署,网站内容就一直不更新,直到内容过时.换句话说,SSG不适用于展示高度动态的内容.

---
感谢你能看到这里!