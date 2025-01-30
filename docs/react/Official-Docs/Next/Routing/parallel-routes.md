# 平行路由
平行路由(Parallel Routes)的作用是允许你在同一个布局中,同时或条件式地渲染一到多个页面内容.这对于那些动态程度较高的内容部分而言是相当有用的,像社交网站里的推荐首页(dashboard)或是评论区(feeds)  
比如你的首页(dashboard,看个人理解到底是哪个页面了),需要同时展示`team`和`analytics`两个页面:
![paralle-routes](imgs/parallel-routes.jpg)

## 插槽(Slots)
我们需要使用插槽(Slots)来创建平行路由.一般的插槽命名习惯是`@folder`.比如下图中我们就定义了两个插槽:`@analytics`和`@team`:
![slots-convention](imgs/parallel-routes-file-system.jpg)
插槽会作为`props`传给父级的布局文件.像上图这样,在`app/layout.js`里的组件,会有两个插槽属性`@analytics`和`@team`,我们可以平行地,将它们跟`children`属性,同时渲染出来:
```tsx
// app/layout.tsx
export default function Layout({
    children,
    analytics,
    team
}:{
    children:React.ReactNode
    analytics:React.ReactNode
    team:React.ReactNode
}) {
    return (
        <>
        {children}
        {team}
        {analytics}
        </>
    )
}
```
值得注意的是,插槽并不是路由分块,它不会影响URL的结构.比如对于`/@analytics/view`这个路径,URL还是为`/view`,因为`@analytics`只是个插槽.
::: tip
- 其实你可以把`children`当作一个,"不那么明显的插槽"(implicit slots),它不需要有对应的文件夹.换句话说,`app/page.js`跟`app/@children/page.js`是等价的.
:::

## 活跃的状态和导航
默认情况下,Next会追踪每个插槽里,活跃的状态(或子页)(active *state or subpage*).不过通过插槽渲染出来的内容是否能够维持,取决于用户的导航类型:(软导航和硬导航,[Next用的就是软导航](linking-and-navigating.md#5软导航))

- **软导航(Soft navigation):** 客户端上的导航期间,Next用的是部分渲染的方式更新,只改变插槽内的子页.同时会维持其它插槽中活跃的子页,哪怕它们与当前的URL并不匹配.(?都是中文我为什么看不懂自己在写什么)
- **硬导航(Hard Navigation):** 如果页面是整个重新加载的,比如浏览器的刷新操作之后,Next并不能知道那些跟当前URL不相匹配的插槽中,到底哪些状态是活跃的,哪些是不活跃的.这种情况下应用会为这些不匹配的插槽,渲染出名为`default.js`的内容,如果没有,那就报错`404`.(404也可以是文件其实)

### `default.js`
初次加载或页面重加载时,你可以为那些没有匹配到的插槽,定义一个`default.js`文件,展示一个后备的页面.  
分析一下下图的文件结构:插槽`@team`下有`/settings/page.js`页面,而`@analytics`没有.
![slots-with-default](imgs/parallel-routes-unmatched-routes.jpg)
当切换到`/settings`路由时,用了`@team`插槽的页面,就会渲染`/settings`页面.(?) 同时,页面也会保持着当前页面下,使用了`@analytics`插槽的内容.  
页面刷新时,Next会为`@analytics`插槽渲染`default.js`的内容.而如果没有这个文件,则会渲染`404`.  
除此之外,当Next不能从父页面的活跃状态恢复过来的时候,你应该为这种情况创建一个`default.js`后备内容展示,因为`children`只是一个不明显的插槽.(?cannot recover from active state是什么情况?什么意思?)

### `useSelectedLayoutSegment(s)`
`useSelectedLayoutSegment`和`useSelectedLayoutSegments`两个函数都接收一个叫`parallelRoutesKey`的参数,用以读取插槽内活跃的路由分块.
```tsx
// app/layout.tsx
'use client'

import { useSelectedLayoutSegment } from 'next/navigation';
export default function Layout({auth}:{auth:React.ReactNode}) {
    const loginSegment = useSelectedLayoutSegment(auth);
    // ...
}
```
当用户导航到`app/@auth/login`(或是说`/login`这个URL时),`loginSegment`的值将为字符串`"login"`.

## 使用例子
### 条件渲染路由
你可以使用平行路由,根据特定条件,渲染特定路由.比如根据用户角色渲染不同的路由,为普通用户渲染普通主页,为管理人员渲染管理页面:(`/admin` for admins, `/user` for users):
![conditional-routes](imgs/conditional-routes-ui.jpg)
```tsx
// app/dashboard/layout.tsx
import { checkUserRole } from '@/lib/auth'

export default function Layout({
    user,
    admin,
}:{
    user: React.ReactNode
    admin: React.ReactNode
}) {
    const role = checkUserRole();
    return <>{role === 'admin'? admin : user}</>
}
```

### 标签分组(Tab groups)
你可以在插槽当中添加布局,从而让用户能够独自地在插槽内实现导航.着对于创建标签栏而言很有用.  
举个例子,以下的`@analytics`插槽有两个子页面:`/page-views`和`/visitors`.
![parallel-for-tabs](imgs/parallel-routes-tab-groups.jpg)
在`@analytics`目录下创建`layout.js`文件,从而在这两个页面中共享标签.(? share the tabs)
```tsx
// app/@analytics/layout.tsx
import Link from 'next/link';
export default function Layout({
    children
}:{
    children:React.ReactNode
}) {
    return (
    <>
        <nav>
            <Link href="/page-views">Page Views</Link>
            <Link href="/visitors">Visitors</Link>
        </nav>
        <div>
            {children}
        </div>
    </>
    )
}
```

### 弹窗(Modals)
平行路由可以搭配插入路由([Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)),以创建弹窗.这可以为你解决一些创建弹窗时可能会遇到的麻烦,比如:
- 通过一条URL,使弹窗的内容变得可以共享.(?)
- 页面被刷新时维持上下文,而不是关闭弹窗.
- 向后导航时关闭弹窗,而不是跳转到先前的路由.
- 向前导航时能够重新打开弹窗.  
(??? 我在说什么)  
比如我有以下的文件结构,用户既要在`layout.js`界面打开登录弹窗,也可以通过专门访问`/login`这个页面.(?)
![auth-modal](imgs/parallel-routes-auth-modal.jpg)
要实现这种模式,先为`/login`路由创建主要的登录页面.(就是访问`/login`这个路由,暂时还没跟插槽有关系.难怪图片之前的第二句我都不知道在说什么)
![main-login](imgs/parallel-routes-modal-login-page.jpg)
```tsx
// app/login/page.tsx
import { Login } from '@/app/ui/login'

export default function login() {
    return <Login />;  
}
```
之后在`@auth`文件夹内,添加`default.js`,仅返回null即可.这是为了确保当弹窗没被触发时,什么也不需要渲染.
```tsx
// app/@auth/default.tsx
export default function Default() {
    return null;
}
```

在`@auth`插槽内,通过把login文件夹名改为`/(.)login`的方式,穿插到`/login`路由.(???)  
将`<Modal>`组件与其子组件导入到这个被穿插的路由当中, `/(.)login/page.tsx`.
```tsx
// app/@auth/(.)login/page.tsx
import { Modal } from '@/app/ui/modal';
import { Login } from '@/app/ui/login';

export default function Page() {
    return (
        <Modal>
            <Login />
        </Modal>
    )
}
```

::: tip
- 通常穿插路由的方式是在文件夹名前添加`(.)`,这是基于你的文件系统结构而定的.(?) [更多关于路由穿插的内容,看这里](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes#convention)
- 通过将弹窗代码(`<Modal>`),跟需要弹窗的页面(`<Login>`)代码分开,你可以确保弹窗的内容是服务器组件.[你可以看看更多关于客户端组件和服务器组件之间的穿插内容](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props)
:::

#### 打开弹窗
到这里,你可以学者利用Next路由打开关闭弹窗了.这样编写的弹窗,能够保持弹窗开启,或前后导航时,确保URL保持正确更新.  
要打开弹窗,将`@auth`插槽作为属性传给父布局,与布局内的`children`属性同级渲染即可.
```tsx
// app/layout.tsx
import Link from 'next/link';

export default function Layout({
    children,
    auth,
}:{
    children:React.ReactNode
    auth:React.ReactNode
}) {
    return (
        <>
            <nav>
                <Link href='/login'>Open Modal</Link>
            </nav>
            <div>{auth}</div>
            <div>{children}</div>
        </>
    )
}
```
当用户点击Open Modal这个`<Link>`组件时就会有个弹窗弹出,而不是切换去`/login`界面.不过,当用户刷新,或是初次加载的时候,直接导航到`/login`这个URL的话则会展示另外的界面`app/login/page.tsx`.

#### 关闭弹窗
你可以用`router.back()`方法,或是使用`<Link>`组件,实现弹窗的关闭.
```tsx
// app/ui/modal.tsx
'use client'
import { useRouter } from 'next/navigation';

export function Modal({
    children
}:{ children: React.ReactNode}){
    const router = useRouter();
    return (
        <>
            <button
                onClick={() => {router.back()}}
            >
                Close Modal
            </button>
            <div>{children}</div>     
        </>
    )
}
```

而如果需要用`<Link>`,从一个不再需要渲染`@auth`插槽内容的页面切换出去的话,我们可以用一个捕捉所有的路由,返回`null`就可以了.
```tsx
// app/ui/modal.tsx
import Link from 'next/link';
export function Modal({
    children
}:{
    children:React.ReactNode
}){
    return (
        <>
            <Link href="/">Close Modal</Link>
            <div>{children}</div>
        </>
    )
}
```

```tsx
// app/@auth/[...catchAll]/page.tsx
export default function CatchAll() {
    return null;
}
```

::: tip
- 我们在`@auth`插槽内用捕捉所有的路由,是基于[活跃状态和导航的行为](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#active-state-and-navigation)来定的.由于客户端导航到一个不再匹配于当前插槽的路由时,路由内容依旧是可见的,我们因此则需要将插槽匹配到一个仅返回`null`的路由,从而达到关闭弹窗的目的.(???)
- 使用例子其实还可以是,在图片画框(gallery)中打开某个特定的图片弹窗的同时,展示一个对应的`/photo/[id]`界面,或是在另外的弹窗内打开一个购物车栏(?我在说什么,本意是打开一个弹窗的同时,展示另一个内容,而不影响URL)
:::

### 加载中和出错时的展示界面
平行路由的内容可以独自实现流,也就是说你可以为每个路由,单独地定义对应地错误展示及加载状态.
![streamed-independently](imgs/parallel-routes-cinematic-universe.jpg)
更多关于[加载界面](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming),和[错误处理](https://nextjs.org/docs/app/building-your-application/routing/error-handling)的内容,看看各自的文档介绍.

## 接下来
* [`default.js`](https://nextjs.org/docs/app/api-reference/file-conventions/default)