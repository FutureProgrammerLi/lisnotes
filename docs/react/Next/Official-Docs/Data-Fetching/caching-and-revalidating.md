# 缓存和重校验
## 缓存
缓存就是将数据存储起来,以此减少向服务器发送请求的次数.  
Next为您提供内置的数据缓存,单独地将请求缓存起来,给予你更细颗粒度的缓存行为控制.

### `fetch`请求
Next v15**默认不会缓存**`fetch`请求.  
要为单个请求设置缓存,你需要添加配置项:`cache:'force-cache'`
```js
fetch('https://...',{cache:'force-cache'});
```

### 数据请求库和ORMs
你可以使用`unstable_cache`这个API,为某个特定的请求设置缓存:
```js
import { getUser } from './data'
import { unstable_cache } from 'next/cache'

const getCachedUser = unstable_cache(async (id) => getUser(id),['my-app-user']); //? 第二个参数是什么?

export default async function Component({userID}){
    const user = await getCachedUser(userID);
    return user;
}
```

## 重校验数据
重校验是清除数据缓存处(DataCache,是Next内部专门缓存的地方),重新获取最新数据的一个过程.这样做既能确保数据变化后页面能展示这些最新的数据,也能享受静态渲染的快速.  
缓存数据的重校验有两种方式:
- **基于时间的重校验:** 过了一段既定的时间后自动重新校验数据.一般一些不经常改变的,数据实时性没那么重要的数据会采用这种方案.
- **按需重校验:** 根据某个事件手动触发重校验(比如表单提交时).按需重校验可以用基于标识(tag-based)或基于路径(path-based)的方法,一次将多组数据进行重校验.这在你需要尽可能快地展示最新数据的场景较为有用(比如无头部内容管理系统(Headless CMS)的内容需要更新)

### 基于时间的重校验
你可以在`fetch`选项的`next.revalidate`属性上,为数据获取添加一个时间间隔,从而为`fetch`获取到的数据缓存设置一个生存时间.

```js
fetch('https://...',{ next: { revalidate: 3600 }})
// 需要是静态值而不能是evaluated的值, 60 * 60也不可以, 单位是秒
```

如果你要重校验一个路由分块内的所有`fetch`请求,你可以用[分块配置项(Segment config options)](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)

```js
// layout.js | page.js
export const revalidate = 3600 // 至多每小时对整个页面的fetch请求进行重校验操作.
// 上面是单个fetch层面,这个是整个页面.
```

[看看基于时间的重校验是如何实现的](https://nextjs.org/docs/app/building-your-application/caching#revalidating-1)

::: tip
- 如果**静态路由**中有多个`fetch`请求,每一个内部都有不同的重校验频率,那它们之间的**最小值**会作为重校验的时间.
- **动态路由**的话,每个请求的频率就是自己的频率,不用顾虑其它路由的重校验频率.
- 为了节省服务器资源,我们建议您尽可能地设置一个较大的重校验时间间隔.比如1小时重校验1次,而不是1秒1重验.如果你需要实时的数据的话,试试[动态渲染](https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-rendering),或是客户端数据获取(?).
:::

### 基于需求的重校验
基于需求的重校验可以通过`revalidatePath`和`revalidateTag`这两个API实现.  
在服务器行为或路由处理器中,用`revalidatePath`为特定路由实现数据重校验:
```js
import { revalidatePath } from 'next/cache'

export async function createPost(){
    // 一系列数据操作...
    revalidatePath('/posts');
}

```

你也可以用`revalidateTag`,为各个路由不同的`fetch`请求实现数据重校验.  
1. 你可以在`fetch`请求的配置项中设置一或多个缓存标签.
2. 然后,你可以通过调用`revalidateTag`函数,对打了特定标签的请求实现重校验.(?重新触发带了tag的个别请求?)  
比如下面的`fetch`请求就被打上了`collection`缓存标签:
```tsx
// app/page.tsx
export default async function Page(){
    const res = await fetch('https://',{
        next:{
            tags:['collection']
        }
    });
    const data = res.json();
    // ...
}

```

之后你就可以在其它地方,调用`revalidateTag`触发这个带了`coleection`标签的请求了.
```tsx
// app/actions/ts
'use server'
import { revalidateTag } from 'next/cache'

export async function action(){
    revalidateTag('collection')
}

```

[看看基于需求的重校验是如何实现的](https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation)

### 错误处理与重校验
如果在尝试重校验的时候报错了,那重校验的结果就是缓存中,上一次成功获取的数据.在之后的请求中,Next再重新尝试校验相应数据.(?)