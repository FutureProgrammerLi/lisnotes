# ISR(Incremental Static Generation)
> [原文](https://www.patterns.dev/react/incremental-static-rendering)

静态生成(SSG)的方式解决了客户端渲染和服务器端渲染的大部分问题,但它一般也仅适用于渲染静态内容的网站.当网站的内容需要被动态渲染,或变化的频率比较高时,它就可能会遇到一些限制了.  

想象一下你有一个规模渐增的,有多篇文章的博客网站.你大概率不会只因为某篇文章里有个别错别字,你就对其进行修改,项目重打包,重新部署到服务器.(换我这个翻译人也不会,大不了等下一次有新产出了再一起build commit.)同样,一篇新的博客产出其实也不需要为已有的所有其它页面打包(?打我脸十八?).  
由此,面对大规模的网站和应用,单单使用静态网页生成技术则显得有点力不从心了.  

Incremental Static Generation,(也被称为iSSG),增量静态生成这一模式可认为是"升级版的SSG",目的是解决动态数据,及静态网页的某些经常改变的大量数据可能会产生的向相关问题.  
iSSG可以更新已有的页面内容,尽管在有新页面请求的情况下,也能通过在后台预渲染一系列页面的方式添加新内容.  

## 代码例子
iSSG主要通过两个方面来增量更新打包后的,已有的静态页面:
1. 允许新页面的添加
2. 允许对已有的页面进行更新,这种方式也被称为增量静态再生(Incremental Static "Re"generation)

### 新页面的添加
为了在网站打包后将新页面添加进来,我们需要理解懒加载的概念.也就是说新的页面会在首次请求时就立即被生成.而当页面处于生成状态时,我们需要向用户展示相应提示,可以是后备页面,也可以是等待指示器,转圈圈.对比SSG,我们在此用404页面提示用户访问了不存在的页面.  

我们看看如何在Nextjs里,利用iSSG技术,懒加载那些不存在的页面:
```ts
// pages/products/[id].ts

// 在getStaticPaths()里,你需要返回构建时所有要预渲染的,产品的id列表.
// 你可以先从服务器里获取到所有的产品信息以达到目的.

export async function getStaticPaths(){
    const products = await getProductsFromDatabase();

    const paths = products.map(product => ({
        params:{ id: product.id }
    }));
    return {
        paths,
        fallback:true,     // 这个参数表明缺失的页面也不会提示404,而是选择渲染后备页面
    }
};


export async function getStaticProps({ params }){
    return {
        props:[
            product: await getProductsFromDatabase(params.id)
        ]
    }
}
export default function Product({product}){
    const router = useRouter();
    if(router.isFallback){
        return <div>Loading...</div>
    }
    // render product
}
```
我们在这段代码用了`fallback:true`这个属性.这样当用户访问到某个不存在的产品时,就会看到后备页面,比如转圈圈加载指示器.同时,Next会在后台生成页面.完成后就会将内容缓存起来,并替换掉原先的后备页面.缓存起来的页面并不会在后续的访客请求时就立即展示出来.无论是新页面还是旧页面,我们都可以在Next里为它们设置一个过期时间,从而告诉Next何时重校验页面,何时更新该页面.方法就是使用Next的revalidate配置项.

### 已有页面的内容更新
我们要为已有的页面定义一个合理的超时时间,过时后就对页面进行重渲染,以达到内容更新的效果.这个时间甚至可低为1秒.页面完成重校验之前,用户看到的都只是先前版本的内容.也就是说,iSSG在页面重校验时,使用的是stale-while-revalidate的策略,用户看到的都是"过时"的内容,因为后台都有一个"超时"时间,时刻等待着页面的重校验.(stale->frontend, revalidate->background).  
而重校验的过程发生在后台,不需要完整的项目重构建.  

回到我们先前的例子,根据数据库里的数据为产品生成一系列的静态列表页面.为了实现列表相对动态的目标,我们为页面重建添加以下超时代码.以下是添加后页面的内容:
```tsx
export async function getStaticProps(){
    return {
        props:{
            product: await getProductsFromDatabase(),
            revalidate:60, // 这个参数会使页面在60秒后进行重校验
        }
    }
};

export default function Product({products}){
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
页面重校验的超时时间在`getStaticProps`返回的`revalidate`属性上.当接收到请求时,已有的静态页面会先展示出来.而这个静态页面每经过一分钟,就会在后台刷新一次,以此获取并展示新的数据内容.新内容生成,新请求接收,新内容展示.Next9.5以上的版本都支持这种功能.

## 模式优势
SSG静态网页生成的优势,iSSG全都有,前者没有的,后者也有.以下就是这些前者没有的:
1. 动态数据处理: 这也是为什么会有这种模式的原因.这种模式能在不重建网站的前提下,支持动态数据的展示.
2. 高效率: iSSG的效率至少能跟SSG持平,因为数据的获取和渲染都是在后台进行的.客户端或服务器端要处理的内容其实不多.
3. 可用性: 用户在线访问到的,基本都是网站最新的内容.哪怕后台的再生处理失败了,用户看到的也只是先前的带有部分过时数据的内容.
4. 性能一致性: 由于服务器上每次重新生成的页面都是少量的,因此对数据库和后端的负载都是较低的,性能都能保持一定的水准.也就不会突然的在某些页面上"性能跳水"了.
5. 易于分布处理: 正如(利用)SSG的网站,iSSG的网站也可以通过CDN的方式实现网页内容的预渲染和网络分布.