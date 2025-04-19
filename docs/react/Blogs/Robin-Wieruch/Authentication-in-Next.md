# Next.js中的认证

> [原文地址](https://www.robinwieruch.de/next-authorization/)  
> Authentication和Authorization是有区别的.具体可以看看[曾经翻译过的Next官网的介绍](/react\Official-Docs\Next\Authentication\Authentication)  
> 简单说,认证(Authentication)是登录前,确认用户是谁,授权(Authorization)是登录后,确认用户能做什么.

如今的React有了Next的加持,完全可以构建全站项目了.其中新问题又来了:我们要如何在全栈项目中实现各种授权操作呢?  
本篇指引中,我想探索介绍一下,如何搭配React服务器组件,以及App Router的Server Actions功能,在Next中实现授权操作.

虽然这篇文章编写于[最近Next出现安全问题](https://nextjs.org/blog/cve-2025-29927)之后,(吃瓜可以了解一下)但这并不是事件的直接回应.我事先授权操作时都时遵循Next团队给予的建议,尽可能接近数据源实现授权.所以本篇文章大概就是介绍我是如何在我自己编写的Next项目中实现授权的.  

## 目录
* [数据访问授权](#数据访问授权)
* [路由授权](#路由授权)
* [UI授权](#ui授权)
* [中间件授权](#中间件授权)

## 数据访问授权
毫无疑问,全栈项目中,授权是用户访问数据源之前,对数据进行读写的一个重要守卫.  
一般我们通过API层实现,因为我们需要在这一层处理客户端和服务器之间的请求与响应.  

```txt
  +----------------------------+    +---------------------------+
  |  React Server Component    |    |      React Component      |
  +-------------+--------------+    +-------------+-------------+
                |                                 |
                v                                 v
  +----------------------------+    +----------------------------+
  |    custom Query Function   |    |    React Server Action     |
  |       (authorization)      |    |       (authorization)      |
  |         [getPosts]         |    |         [createPost]       |
  +-------------+--------------+    +-------------+--------------+
                |                                 |
                +---------------+-----------------+
                                |
                                v
                  +----------------------------+
                  |         Database           |
                  +----------------------------+
```

在小型全栈项目中,你可能只用服务器组件和Server Actions就够了.可是直接在服务器组件中访问数据库这种操作我们是不建议的,你很可能还需要额外的获取数据函数,处于服务器组件和数据库之间.  
而此时正是我们实现授权最佳的位置.  

```ts
export const getPosts = async () => {
    const { user } = await getAuth();
    if (!user) {
        throw new Error('Unauthorized');
    }
    return await db.query('SELECT * FROM posts');
}
```
以上授权没通过的话你可以采用其它告知方法而不是直接抛出错误.  

Server Action中其它需要执行写操作的,都需要经过相同的授权校验.比如你有个用于创建博客的Server Action,你也要在用户将数据插入到数据之前,检验用户是否已经授权.

```ts
export const createPost = async (post: Post) => {
    const { user } = await getAuth();
    if (!user) {
        throw new Error('Unauthorized');
    }
    return await db.query('INSERT INTO posts SET ?', [post]);
}
```

`getAuth`函数会与数据库校验会话cookie的有效性.我们还可以利用React提供的cache API,以记住一个渲染周期内,`getAuth`的校验结果.  

```ts
export const getAuth = cache(async () => {
    const sessionToken = cookies().get('sessionToken')?.value?? null;

    if(!sessionToken) {
        return {
            user: null,
            session:null.
        }
    }

    // 某些高消耗的数据库操作
    return await validateSession(sessionToken);
});
```

我还在`getAuth`函数之上,使用了更多一层的授权`getAuthOrRedirect`.  
如果用户没授权的话,就用这个函数重定向到登录页面,而不是直接抛出错误.因为用户不太应该还没被授权就接触到项目的某些资源信息.

```ts
export const getAuthOrRedirect = async () => {
    const { user, session } = await getAuth();
    if(!user) {
        redirect('/login');
    }
    return {
        user,
        session,
    }
}
```
这个函数可以取代之前的`getAuth`函数用法.

---
当你的项目规模逐渐变大,日渐复杂,你可能就需要在API层和数据库层再添加抽象层了.而我们把这层,称为"服务层"和"数据访问层".(Service Layer and Data Access Layer)

```txt
  +----------------------------+    +---------------------------+
  |  React Server Component    |    |      React Component      |
  +-------------+--------------+    +-------------+-------------+
                |                                 |
                v                                 v
  +----------------------------+    +----------------------------+
  |    custom Query Function   |    |    React Server Action     |
  |   (first line of defense)  |    |   (first line of defense)  |
  |         [getPosts]         |    |         [createPost]       |
  +-------------+--------------+    +-------------+--------------+
                |                                 |
                +---------------+-----------------+
                                |
                                v
                  +--------------------------------+
                  |         Service Layer          |
                  | (role/permission/owner checks) |
                  |         [domain logic]         |
                  +---------------+----------------+
                                |
                                v
                  +----------------------------+
                  |       Data Access Layer    |
                  |    (last line of defense)  |
                  | [ORM, raw SQL, repository] |
                  +-------------+--------------+
                                |
                                v
                  +----------------------------+
                  |         Database           |
                  +----------------------------+
```

之前API层的授权只是一个最为基础的守卫,快速地鉴定用户授权状况,拒绝未被授权的操作,防止其进行下一步操作.  
而服务层则包含最核心的授权逻辑,将具体业务逻辑,包括是否允许,允许谁,允许哪些角色的访问进行控制,以确保只有授权的用户才能进行读写操作.  
数据访问层则是授权的最后一条防线,尽管它主要关注于数据操作而非许可校验,因为许可校验最好在服务层就搞定了的.  
不过对于一些数据敏感的应用,你可能需要在这一层再实现一层安全校验.  

---
能否在数据访问层之前正确处理授权,是权衡一个应用是否足够安全的重要参考.如果你恰当实现有效校验,你就可以尽可能确保应用的安全及保证数据的安全.  

之后我们将实现其它应用层面的授权,比如为路由,UI添加授权,以及通过中间件实现授权.

## 路由授权
Next.js应用中每个入口组件默认都是服务器组件.因此,你可以为那些读取到数据库的页面组件,添加上授权校验操作,以避免未授权的用户访问到某些特定的路由.

```tsx
export const PostsPage = async () => {
    await getAuthOrRedirect();

    return (
        <div>
        <h1>Posts</h1>
        <PostCreateForm />
        <PostList />
        </div>
    )
}
```
如果你没采用这一层的防御校验,未授权的用户可能会导航到这个页面(不应该出现),不过无法读取或写入页面数据(还好).(多亏其它层面的防御)
说你防得好,没授权的用户又能访问到这个页面;说你放得不好,未授权的用户又不能在这个页面上做什么..  

当然了,多一层防护,多一份安心,用户也能更放心使用你的应用.我们还是很建议你采用这一层的防御的.  

虽然在路由层面添加授权验证可能会代码冗余,还可能出错,不过方便起见,你可以把授权操作移到`layout`组件中,这样能通过布局共享的方法,沿着组件树运用起到校验功能.  

```tsx
export const AuthLayout = ({children}) => {
    await getAuthOrRedirect();
    return children;
}
```
这个布局文件应放到一个路由组中(下面的`authenticated`文件夹),文件夹内包含所有需要使用到这层校验的页面.

```txt
- app/
--- page.tsx           <--- public page
--- sign-in/
----- page.tsx         <--- public page
--- sign-up/
----- page.tsx         <--- public page
--- (authenticated)/
----- layout.tsx       <--- AuthLayout
----- posts/
------- page.tsx       <--- protected page
------- [postId]
--------- page.tsx     <--- protected page  
----- users/
------- page.tsx       <--- protected page
```
(上面的posts/page, posts/\[postId]/page, users/page 都使用了同一个layout,因为它们都需要这一层授权校验才能访问)  

**不过:** 将多个页面组件,通过同一个布局组件,以实现授权操作,一般更方便于开发人员,而非出于安全考虑才使用这种策略.(...)   

**安全隐患:** 如果某些恶意用户确实想攻击应用的话,他们确实可以跳过布局组件的授权校验,直接在服务器组件的页面组件中独立获取数据.因此,单独使用布局组件来实现校验是种不太安全的策略.  

**但是:** 我们还是有理由需要在布局组件中实现授权的.当然,一切的一切取决于你和你的团队选择.
* **防止人为错误:** 集中化实现授权可以减少人为错误,因为开发人员可能会在某些需要授权的页面组件中,漏了编写授权的逻辑.  
* **开发体验:** 集中化授权便于管理代码.通过简单地查看文件夹的结构你便能轻松看到哪些页面是受保护,需要授权才能访问的.  

**关键隐患:** 布局里授权虽然方便,但不是一种十分安全的方案.真正全面的授权操作必须在API/服务层/以及数据访问层中实现.  

策略1: 仅为提升开发者体验时使用布局校验,不过确认要在后端实现全面,健壮的授权校验.  
策略2: 具体在页面组件里实现授权,哪怕会牺牲开发者体验及便利性.  
策略3: 结合以上两个策略,略微平衡二者利弊(虽然很可能是多余的)  

---
随着应用规模的增大,你很可能需要多个布局组件以实现授权,尤其是当应用中的角色和权限类型变多时.  
比如,你有个`AdminLayout`,用以校验用户是否为管理员,如果是,才渲染其页面组件的内容.  

```tsx
export const AdminLayout = async ({children}) => {
    await getAdminOrRedirect();
    return children;
}
```
你的文件结构如下:

```txt
- app/
--- page.tsx           <--- public page
--- sign-in/
----- page.tsx         <--- public page
--- sign-up/
----- page.tsx         <--- public page
--- (user)/
----- layout.tsx       <--- UserLayout
----- posts/
------- page.tsx       <--- protected user-based page
------- [postId]
--------- page.tsx     <--- protected user-based page
----- users/
------- page.tsx       <--- protected user-based page
--- (admin)/
----- layout.tsx       <--- AdminLayout
----- admin/
------- page.tsx       <--- protected admin-based page
```

总而言之,路由授权是应用的关键部分之一.它是应用展示的第一层防线,它也值得以安全且可维护的方式被实现.

## UI授权
UI授权一般用于向用户提供更好的体验.  
比如,你可能需要根据用户的授权状态,隐藏或禁用某些UI元素.
```tsx
export const PostMoreMenu = () => {
    const { user } = useAuth();
    return (
        <Menu>
            <MenuItem>Share</MenuItem>
            {user? <MenuItem>Delete</MenuItem> : null}
        </Menu>
    )
}
```
不过之前也说过了,这只是提供更好用户体验的一种方法,而非安全措施,因为某些恶意用户如果想,还是可以直接操作客户端代码的.  
因此,再强调一次,API/服务层/数据访问层的授权校验才是应用安全最关键的部分.  

## 中间件授权

我们还可以结合中间件来实现授权.  
在Next.js中,你可以用中间件来保护App Router中的任意`page.tsx`,`route.ts`文件,以防止未授权的人访问到它们.  

```ts
export async function middleware(request: NextRequest) {
    const isAuthenticated = ture;

    const path = request.nextUrl.pathname;
    const isProtectedRoute = path.startsWith('/ticket') || path.startsWith('/users');

    if(isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}
```
不过以上代码还有个缺陷是,每个请求都会触发这个校验,就有可能导致性能下降.因此,我们不建议在中间件中实现与数据库有关的授权(不要在这里就与数据库有任何关联!)  

```ts
const {user} = await getAuth();
const isAuthenticated = !!user;
```

你可以在中间件里"预校验(pre-flight checks)",比如先检查用户是否带有活跃的session cookie,而非直接检查这个cookie是否跟数据库的一致.  
这种操作能一定程度提高应用性能.  

```ts
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isProtectedRoute = path.startsWith('/ticket') || path.startsWith('/users');

    const sessionToken = request.cookies.get('session')?.value; // [!code highlight]
    if(isProtectedRoute && !sessionToken) {         // [!code highlight]
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}
```

如果用户确实需要长时间保持登录状态,你可以在中间件中更新用户cookie的超时时间.  

不过话又说回来,如果你不想因为中间件实现校验,可能会导致应用性能下降的话,你就不要在中间件里实现与数据库进行密集地交互.还是将校验的重点,放回到API/服务层/数据访问层中吧.  

如果用中间件实现授权,你还需要考虑其它隐患:

* Edge运行时环境(Edge Runtime Environment)的考虑: Next的中间件可以在edge运行时环境中执行,它并非Node.js,就有可能实现不了某些Node才有的特性.  
比如,以前要运行类似Prisma的ORM并非易事.虽然如今Prisma(及其它三方库)已经有相关解决方案了,不过Next团队也在实现[中间件只在Node.js中运行的功能](https://nextjs.org/blog/next-15-2#nodejs-middleware-experimental).  
* 粗粒度中间件(Coarse-Grained Middleware): Next.js只允许你有一个middleware文件.因此,如果你想更细粒度地为应用不同部分,实现对应的功能的话会有点麻烦.相应的,Next目前在开发["拦截器(Interceptors)"](https://github.com/vercel/next.js/pull/70961)来缓解这个问题.  

## 总结
通篇下来我最想说的就是:**授权操作应该尽可能地接近数据源.**  
也就是说,尽可能在API/服务层/数据访问层中实现授权.它是应用最重要的部分之一,应以安全且可维护的方式被实现.

---

感谢你能看到这里!

::: details 中间件如何划分模块?(Deepseek生成,长文)
Next.js 中间件模块化划分方案
在 Next.js 中实现中间件的模块化划分可以通过以下几种方式：

#### 1. 按功能拆分中间件文件
在 middleware.js 主文件中引入并组合各个功能模块：

```javascript
// middleware.js
import { authMiddleware } from './middleware/auth'
import { analyticsMiddleware } from './middleware/analytics'
import { geoMiddleware } from './middleware/geo'

export function middleware(request) {
  // 按顺序执行各个中间件模块
  const authResponse = authMiddleware(request)
  if (authResponse) return authResponse
  
  const analyticsResponse = analyticsMiddleware(request)
  if (analyticsResponse) return analyticsResponse
  
  return geoMiddleware(request)
}
```
#### 2. 使用中间件链式组合
创建一个中间件链工具函数：

```javascript
// utils/middlewareChain.js
export function chainMiddlewares(middlewares) {
  return async (request) => {
    for (const middleware of middlewares) {
      const response = await middleware(request)
      if (response) return response
    }
    return NextResponse.next()
  }
}
```
```js
// middleware.js
import { chainMiddlewares } from './utils/middlewareChain'
import { authMiddleware } from './middleware/auth'
import { loggingMiddleware } from './middleware/logging'

export default chainMiddlewares([loggingMiddleware, authMiddleware])
```
#### 3. 按路由划分中间件
使用 Next.js 的配置匹配器结合条件逻辑：

```javascript
// middleware.js
import { authMiddleware } from './middleware/auth'
import { apiMiddleware } from './middleware/api'

export function middleware(request) {
  const pathname = request.nextUrl.pathname
  
  if (pathname.startsWith('/api')) {
    return apiMiddleware(request)
  }
  
  if (pathname.startsWith('/dashboard')) {
    return authMiddleware(request)
  }
  
  return NextResponse.next()
}
```
#### 4. 高级模块化方案
结合以上方法创建更灵活的架构：

```javascript
// middleware/
// ├── auth.js
// ├── analytics.js
// ├── geo.js
// └── index.js

// middleware/index.js
import { withAuth } from './auth'
import { withAnalytics } from './analytics'
import { withGeo } from './geo'

export const middlewarePipeline = [
  withAnalytics,
  withGeo,
  withAuth
]

export default function middleware(request) {
  let response = NextResponse.next()
  
  for (const middleware of middlewarePipeline) {
    response = middleware(request, response) || response
  }
  
  return response
}
```
最佳实践建议:
* 保持中间件单一职责：每个中间件文件只处理一个特定功能
* 明确执行顺序：注意中间件的执行顺序对功能的影响
* 合理使用条件逻辑：根据路径、环境等条件决定是否应用某些中间件
* 共享上下文：如果需要多个中间件共享数据，可以使用请求头或cookie传递

通过以上方法，你可以实现清晰、可维护的中间件模块化架构，便于团队协作和功能扩展。
:::