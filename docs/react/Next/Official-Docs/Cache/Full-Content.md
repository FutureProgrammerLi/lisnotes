# 缓存
Next通过缓存渲染内容及减少数据请求的方式,提升应用性能,减少工作花费.  
本文较为深入地介绍了,Next内部地缓存机制、一些配合使用的APIs,以及如何协调使用这些API配置.  

::: tip
本页的内容是帮助你理解,Next底层的一些缓存工作原理的,非必要,对你产能可能没有帮助.  
大部分缓存的内容及实践,是由你如何使用API决定的.默认情况下Next已经帮你尽可能地将它们用于提供最好的性能配置了,你需要配置内容的可以说是没有,或是尽可能少了.  
(大概这是我一直拖延翻译这章的一个理由?嗯对一定是)
:::

## 概况
下图是对不同缓存机制以及相应操作目的的一个总结:
| 机制   | 是什么 | 在哪里执行 | 执行目的 | 执行持续时间 |
| ---  | --- | --- | --- | --- |  
| "记忆请求"  | 函数的返回值 | 服务器上 | 在组件树内重用数据 | 每次请求周期 | 
| 数据缓存区  | 数据 | 服务器上 | 用户请求和部署期间存储数据 | 持久化存储(可被重校验) | 
| 完整路由缓存  | HTML和RSC Payload | 服务器上 | 减少渲染耗费的资源,提升性能 | 持久化存储(可被重校验) | 
| 路由器缓存  | RSC Payload | 客户端上 | 减少导航时向服务器发送的请求量 | 客户会话时间内,或是某个设定时间内 | 

Next默认会尽可能地对内容进行缓存,以提升应用性能及减少耗费.也就是说你不专门设置的话,**路由会被静态渲染,数据请求会被缓存**.下图展现的是默认缓存行为的工作过程:路由在构建时被静态渲染,以及首次访问一个静态路由的情况:
![caching-overview](imgs/caching-overview.jpg)
缓存的行为,取决于:1. 路由是静态/动态渲染;2. 数据是否需要被缓存;3. 某个请求,是初次访问就要用到/还是后续导航才用到.根据具体的使用场景,你可以为单独的路由/请求设置,单独地设置缓存行为.

## 记忆请求(Request Memoization)
Next扩展了`fetch`这个API,会自动地对请求进行"记忆".同时也保留了原有的URL,配置选项设置.  
换句话说,你可以在组件树内,在不同地方调用获取相同数据的`fetch`请求.Next能确保**它们只会被执行一次**.
![request-memoization](imgs/deduplicated-fetch-requests.jpg)
比如说你要在一个路由中使用相同的数据,(一个路由包括Layout,Page,多个Components等等..),你**不需要**在组件树的顶部请求数据,然后利用props传递给子组件.你可以直接在需要这些数据的组件中调用获取函数,不用担心可能会产生的多个重复请求造成性能的损耗问题.(你调用了多个请求,实质Next一个叛逆就不给你执行了.Next觉得你请求来的都是相同数据,所以选择缓存而不是"亲力亲为").

```tsx
// app/example.tsx
async function getItem(){
    // `fetch`函数会被"记忆",请求结果会被缓存.
    const res = await fetch('https://...');
    return res.json();
}

// 被调用了两次,但实际只会执行第一次.
const item = await getItem();  // cache MISS.缓存没有对应内容,"亲力亲为"去服务器请求数据

const item = await getItem();  // cache HIT.缓存由对应请求及内容,选择使用缓存,不去发送真正的请求.
```

### 请求记忆是如何实现的?
![request-memoization](imgs/request-memoization.jpg)

- 渲染路由的时候,由于是第一次,因此会专门调用请求,请求的结果当然也不会存在于内存中,缓存就会处于缺失MISS状态.
- 因此,函数会在此时被执行,数据也会从外部资源处获取回来,各种结果则会相应存储于内存当中.
- 后续的,同一个渲染经过(render pass)内的请求函数调用,则会命中缓存区(HIT),数据也会直接从内存中直接返回,而不用再执行获取函数.
- 当路由被渲染完成,渲染过程也结束后,内存会被"重置(reset)",所有的请求记忆也会被清除.(?怎么判定render pass结束了?)

::: tip
- 请求记忆是React的一个特性,它并不是Next特有的.我们在这介绍这个特点,是要展示它是如何结合其它缓存机制,一起工作的.
- 记忆功能仅适用于`fetch`请求的`GET`方法.
- 记忆功能仅适用于React组件树,换句话说是:  
    - `generateMetaData`,`generateStaticParams`,布局组件,页面组件,及其它服务器组件,这些组件内的`fetch`请求,都会适用这种缓存机制.
    - **路由处理器里的`fetch`请求不适用这种机制,** 因为它们不属于组件树的一部分.
- 一些场合下可能用不了`fetch`请求(比如数据库客户端,CMS客户端,或是GraphQL客户端).这种情况下你可以考虑适用React提供的`cache`工具函数,来记忆你需要缓存的相应函数.
:::

### 持续时间
缓存的持续时间,是一个服务器请求生命周期,组件树渲染完后,缓存也将消失.

### 重校验
由于这种记忆功能并不能跨请求共享,也只有渲染期间才生效,因此我们没有必要对这种缓存进行重校验.

### 选择不使用这种机制(Opting out)
这种记忆功能只会应用于`fetch`的`GET`方法,其它比如`POST`,`DELETE`等方法结果都是不会被缓存的.这种默认行为属于React的一种优化机制,我们并不建议取消这种功能机制.  
如果要对特定的某个请求进行设置,你可以使用`AbortController`的`signal`属性来实现.不过这也不会导致行为发生变化,而只会中断进行中的请求.
```js
// app/example.js
const { signal } = new AbortController();
fetch(url,{signal});
```

## 数据缓存区
Next内置了一个数据缓存区,用以持久化服务器请求及部署时的数据请求结果.这也属于Next扩充`fetch`API的一个结果,扩充后每个请求自身,就能设置在服务器上的持久时间了.
::: tip
在浏览器看来,`fetch`请求的`cache`设置项,表明该请求如何与浏览器的HTTP缓存交互.在Next看来,这个`cache`配置项,表明该请求如何与服务器端的数据缓存区进行交互.(? browser cache -> HTTP cache/ Next cache -> Data Caches' cache | server cache)
:::

你可以使用`cache`和`next.revalidate`选项来为`fetch`请求设置缓存行为.

### 数据缓存区是如何工作的?
![data-cache](imgs/data-cache.jpg)
- 第一次请求时,带有`force-cache`的`fetch`请求会在渲染时被调用(?).Next会检查数据缓存区是否有对应的,已经缓存了的响应.
- 如果区域内存在缓存响应,则它会被立即返回,并被记忆下来(?)
- 而如果缓存响应不存在,则会向数据源发出请求,相应的结果则会被存于数据缓存区,并被记忆下来.(stored, 和memoized的区别?)
- 对于那些没被缓存的请求(比如请求中没专门设置`cache`配置项,或`{cache:'no-store'}`),则会被每次重新从数据源中获取,记忆.
- 无论请求结果是否被缓存,请求本身都会被Next所记住.这样才能在React渲染过程中避免相同数据的重复请求.
::: tip
**数据缓存区和记忆请求的区别**  
两种机制都通过重用缓存数据以提升性能.区别是持续时间的不同:数据缓存区的数据会持久化于接收请求时与部署时;请求记忆吃灰维持于一个请求周期内.
:::

### 持续时间
数据缓存区的内容会持久化于接收请求时与部署时.除非你专门重校验某个特定请求,或选择不使用这个功能,持续时间才会发生变化.

### 重校验
缓存过的数据可以用以下两种方式进行重校验:
- 基于时间的重校验: 经过特定时间后重新发起请求,对相应数据进行重校验.这对那些不经常变化的数据,或数据实时性没那么重要的内容比较有用.
- 基于需求的重校验: 基于事件的重校验(如表单提交时重校验某些数据).你可以用标签式,或是路径式的按需重校验,同时对某个分组的数据进行重校验.这在你需要确保最新数据尽可能快展示给用户时的场景下相当好用(比如当headless CMS内容变化时)

#### 基于时间的重校验
你可以在`fetch`选项的`next.revalidate`属性上,为数据获取添加一个时间间隔,从而为`fetch`获取到的数据缓存设置一个生存时间.

```js
fetch('https://...',{ next: { revalidate: 3600 }})
// 需要是静态值而不能是evaluated的值, 60 * 60也不可以, 单位是秒
```
如果你要重校验一个路由分块内的所有`fetch`请求,或者某些无法使用`fetch`请求的场景,你可以用[分块配置项(Segment config options)](https://nextjs.org/docs/app/building-your-application/caching#segment-config-options)


#### 基于时间的重校验是如何实现的
![time-based-revalidation](imgs/time-based-revalidation.jpg)
- 首次带有`revalidate`选项的请求被调用时,数据会从外部数据源中返回,并存储到数据缓存区.
- 特定时间帧内的所有请求(比如60秒),都会返回对应的缓存数据
- 特定时间帧过后,下一个请求依旧会返回缓存中的数据(已经过期了的)
    - Next后台会触发数据重校验
    - 如果新数据成功返回,Next会用这些新鲜数据替代掉数据缓存区对应的过时内容.
    - 如果重校验获取失败,则对应请求依旧返回过时数据

以上行为实际上与[`stale-while-revalidate(SWR)`](https://web.dev/stale-while-revalidate/)的行为相似.

#### 基于需求的重校验
基于需求的重校验可以通过路径重校验,或是标签重校验的方法实现.(`revalidatePath`,`revalidateTag`)

#### 基于需求的重校验是如何实现的
![on-demand-revalidation](imgs/on-demand-revalidation.jpg)
- 首次`fetch`请求被调用时,数据会从外部数据源返回,并存于Next数据缓存区.
- 当按需重校验被触发时, 相应的已缓存项就会被删除.这跟基于时间的重校验行为不同,后者只会在新数据返回后再覆盖旧的缓存数据.
- 触发下次请求后,状态依旧会是缓存缺失(MISS),再次从外部数据源中获取回来.

#### 选择不使用这种机制
如果你不想对响应进行缓存,可以这样做:
```js
let data = await fetch(url,{cache:'no-cache'})
```

## 全路由缓存
::: info
**相关术语:**  
下文可能使用`自动化静态优化`,`静态网站生成`,或是`静态渲染`这些术语,它们指代的都是在构建时渲染及缓存应用路由的这个过程.
:::

Next自动在构建时渲染及对路由进行缓存.这是一种页面加载的优化行为,允许你使用缓存后的路由,而不是每次请求都在服务器上进行渲染.  
为了全面了解这个工作过程,我们建议先来了解React是如何实现渲染,如何对这些渲染结果进行缓存的:

### 1. 服务器上的渲染
在服务器上时,Next调用React APIs来组织各种渲染行为.渲染工作会被分为多个块进行(chunks):一种是单独的路由分块;另一种是带有Suspense边界的组件.  
每个块则会经由两个步骤渲染:  
1. React将服务器组件,渲染为一种特殊的数据格式.这种格式是专门为流式渲染所优化的,叫`React Server Component Payload, RSC Payload`
2. Next使用上述的结果,RSC Payload,结合客户端组件指令,在服务器上初步渲染出HTML.  

也就是说我们不用等待所有内容都渲染好了后才对其进行缓存,才作出响应,而是流式地,将工作结果传递响应给客户端.

::: info
**React Server Component Payload是什么东西?**  
RSC Payload是一种服务器组件树的二进制代表.服务于React,以更新客户端上的浏览器DOM.它包括:
- 服务器组件的渲染结果
- 客户端组件的占位符,告知需要被渲染的位置在哪里,以及对应的JS文件是什么.
- 一些由服务器组件传递给客户端组件的props.  
更多相关内容可以去看[服务器组件的介绍文档](https://nextjs.org/docs/app/building-your-application/rendering/server-components).
:::

### 2.Next在服务器上的缓存(全路由缓存)
![full-route-cache](imgs/full-route-cache.jpg)

Next的默认行为就会将路由渲染的结果缓存在服务器上(具体点就是RSC Payload和HTML).这种缓存机制适用于打包时的静态渲染路由或是重校验期间.

### 3.React在客户端上的水合和协调(hydration and reconciliation)
请求期间,客户端上会发生的事情:  
1. 从服务器端返回的,快速的暂时无法交互的HTML先用于展示,这HTML属于客户端组件和服务器组件的预览.
2. RSC Payload会被用于协调客户端和渲染好的服务器组件树,并用来更新浏览器DOM.
3. Next使用JS指令,水合客户端组件,使页面变得最终可交互.  

### 4.客户端上的Next缓存(路由器缓存)
RSC Payload会被存储在客户端[路由器缓存处](https://nextjs.org/docs/app/building-your-application/caching#client-side-router-cache) -- 一个以路由分块划分的,独立的内存缓存区.这个路由器缓存区以存储浏览过的路由,预获取可能要浏览的路由,两种方式来提升导航性能体验.

### 5.后续的导航
在后续的导航或预获取路由期间,Next会检查路由器缓存区里是否已有对应的RSC Payload.如果已经有了,就直接从这里取而不不会向服务器发起请求.  
如果相应内容不存在于缓存中时,那Next就向服务器请求获取,将对应内容展示到客户端上.(populate the Router Cache?)

### 静态渲染和动态渲染
路由是否会在构建时被缓存下来,取决于该路由是静态渲染,还是动态渲染的.静态路由默认就会被缓存下来;动态路由正则在请求周期内被渲染,不会被缓存.  
下图展示的是带有缓存数据/没有缓存数据的,静态渲染和动态渲染的路由区别:
![static-and-dynamic-rendering](imgs/static-and-dynamic-routes.jpg)
[更多关于静态渲染和动态渲染的内容](https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-rendering-strategies)

### 持续时间
默认全路由缓存是持久化的.也就是说渲染的结果会缓存于所有请求之间(across user requests).

### 无效化
停用全路由缓存的方法有两种:
- [重校验数据](https://nextjs.org/docs/app/building-your-application/caching#revalidating):重校验数据缓存区会使路由器缓存区内容失效,因为会重渲染服务器上的组件,转而缓存新的渲染结果.
- 重新部署:不像数据缓存区那样,缓存的内容会在各个部署中都持久下来.全路由缓存每次部署都会被清空.

### 选择不使用功能
你可以选择不用全路由缓存,换句话说就是,每次请求都动态渲染组件,方式如下:
- **使用动态函数:** 这就是显式表明不用全路由缓存,请求时动态渲染该路由了.此时数据缓存区还是可用的.
- **使用路由分块配置`dynamic = 'force-dynmaic'或'revalidate = 0'`:** 这样配置会同时跳过全路由缓存和数据缓存.也就是说,每次向服务器请求时,组件都会被重新渲染,数据也会被重新获取.此时的路由器缓存是可用的,因为它是客户端上的缓存区.
- **选择不使用数据缓存区:** 如果路由中有`fetch`请求是不被缓存的,那么会致使该路由不使用全路由缓存这个功能.某些特定的`fetch`请求数据会在每次请求时重新获取.其它没有选择不用缓存的`fetch`请求,依旧会缓存于数据缓存区.也就产生一种"混合"的缓存行为,一些被缓存,另一些不被缓存.
