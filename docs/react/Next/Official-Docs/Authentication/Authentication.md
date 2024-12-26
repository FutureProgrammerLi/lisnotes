# 认证 Authentication
> 初衷: 想知道怎么利用Next的文件系统路由实现Router拦截,属于Router hook的基本功能了,但结合到Next里又要怎么实现呢?  
> 问题: 路由跳转时,获取到跳转前和跳转后的路由信息.  
> 可能认证范围更广,我的问题大概开始就会被解决掉?  
> [官网原文](https://nextjs.org/docs/app/building-your-application/authentication)

为了保护网页应用的数据安全,身份认证是极其重要的一个功能.本文主要介绍如何通过React和Next的特性,实现认证功能.  
开始之前,我们认为需要把认证这个过程,分解为以下三个概念:
1. 认证Authentication: 校验用户是否就是他们认为的,自己的身份.这个过程需要用户提供能够证明他们身份的信息,比如用户名和密码.
2. 会话管理(Session Management): 用户请求时跟踪并确保用户的身份状态.
3. 授权(Authorization): 分辨用户可以访问的路由,可以访问到的数据.(看来我的问题要在这部分才得以解决?)  

下图展示了React和Next中,实现认证的流程:
![authentication-overview](./imgs/authentication-overview.png)
本文所使用的用户名和密码只是为了展示,除教育外无其它作用.你当然也可以实现自己的认证流程,不过为了更高的安全性和方便性,我们推荐您使用已有的授权三方库.它们可以为我们提供内置的解决方案,,从而实现认证,会话管理,授权,还有像社交账号登录,多条件认证,以及基于角色实现的访问控制等额外的功能.[你可以在这个页面了解更多认证库的功能.](https://nextjs.org/docs/app/building-your-application/authentication#auth-libraries)


## 认证Authentication
### 注册和登录功能
你可以结合React的Server Actions和`<form>`元素,还有`useActionState`这个hook来捕获用户的信息,校验表单字段,调用认证库提供的API或数据库API.  
由于Server Actions总是在服务器端上被执行的,因此你可以拥有一个比较安全的环境来处理具体的认证逻辑.  
**1. 捕获用户信息**  
你可以构建表单,在被提交后调用Server Action来获取用户的信息.  
比如下面的注册表单就是接收用户输入的名称,email,及密码信息:
::: code-group
```tsx [app/ui/signup-form.tsx]
import { signup } from '@/app/actions/auth';

export function SignupForm(){
    return (
        <form action={signup}>
            <div>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" placeholder="Name"/>
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="Email" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" />
            </div>
            <button type="submit">Sign up</button>
        </form>
    )
}
```
```tsx [app/actions/signup]
export async function signup(formData:FormData){}
```
:::
**2.在服务器上校验表单项**  
使用Server Action在服务器上校验表单项.如果你的认证提供库(Authentication provider)没有提供表单校验的功能,你可以自行选用像[Zod](https://zod.dev/)或[Yup](https://github.com/jquense/yup)这样的模式校验库.  
以Zod为例,你可以定义一个带有适当错误信息展示的表单模式.

```ts
// app/lib/definitions.ts
import { z } from 'zod';
export const SignupFormSchema = z.object({
    name: z.string()
                .min(2,{message:'Name must be at least 2 characters long'})
                .trim(),
    email:z.string().email({message:'Please enter a valid email'}).trim(),
    password:z.string()
                    .min(8,{message:'Be at least 8 characters long'})
                    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
                    .regex(/[0-9]/, { message: 'Contain at least one number.' })
                    .regex(/[^a-zA-Z0-9]/, {
                        message: 'Contain at least one special character.',
                    })
                    .trim(),
});

export type FormState = 
    | {
        errors?:{
            name?:string[]
            email?:string[]
            password?:string[]
        },
        message?:string
    }
    | undefined
```

为了避免不必要的验证API调用,你可以在Server Action里,遇到不符合规矩的表单项时,立即`return`退出当前校验,避免后续不必要的验证.
```ts
// app/actions/auth.ts
import { SignupFormSchema, FormState } from '@/app/lib/definitions.ts';

export async function signup(state:FormState,formData:FormData) {
    const validatedFields = SignupFormSchema.safeParse({
        name:formData.get('name'),
        email:formData.get('email'),
        password:formData.get('password'),
    });

    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    //  后续额外数据库操作...
}

```
回到`<SignupForm>`,你可以使用`useActionState()`这个hook来展示表单提交后,可能的校验错误信息.
```tsx
// app/ui/signup-form.tsx
'use client';

import { signup } from '@/app/actions/auth';
import { useActionState } from 'react';

export default function SignupForm(){
    const [state, action, pending] = useActionState(signup, undefined); // ![code highlight]

    return (
        <form action={action}>
        <div>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" placeholder="Name" />
        </div>
        {state?.errors?.name && <p>{state.errors.name}</p>}
    
        <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" placeholder="Email" />
        </div>
        {state?.errors?.email && <p>{state.errors.email}</p>}
    
        <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
        </div>
        {state?.errors?.password && (
            <div>
            <p>Password must:</p>
            <ul>
                {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
                ))}
            </ul>
            </div>
        )}
        <button disabled={pending} type="submit">
            Sign Up
        </button>
        </form>
    )
}

```

::: tip
- React19的`useFormStatus`会在返回的对象中包含额外的键值,比如数据,方法,行为等信息.而如果不是v19版本,那这个hook的键值只有`pending`.
- 在改变数据前,确保用户已经被授权进行相关操作.[了解认证和授权的内容.](https://nextjs.org/docs/app/building-your-application/authentication#authorization)
:::

**3. 创建用户或检查用户证书(credentials)**  
成功校验表单项后,你可以为用户创建新的账号,或是检查该用户是否已经存在.  
我们来完善一下上面的例子:
```ts
// app/actions/auth.ts
export async function signup(state:FormState, formData:FormData){
    // 1. 校验表单项
    // ...
    // 2. 准备需要插入到数据库的数据
    const { name, email, password } = validatedFields.data;
    // 举例来说,为用户的密码进行哈希加密
    const hashedPassword = await bcrypt.hash(password,10);

    // 3. 将用户的信息插入到数据库中
    const data = await db
        .insert(users)
        .values({
            name,
            email,
            password:hashedPassword,
        })
        .returning({id:users.id});    
    
    const user = data[0];
    if(!user){
        return {
            message:'Error occurred!'
        }
    }

    // TODO:
    // 4. 创建用户会话
    // 5. 页面重定向
}
```

成功创建用户账号,或校验用户证书后,你可以为其创建会话(session)来管理用户的认证状态.依据你创建的会话策略,你可以将会话以cookie或数据库,或二者结合的形式储存起来.想了解更多相关的内容,请继续阅读本文!

::: tip
- 以上的例子为了展示教育,代码显得有些冗余.换个角度说,如果你真要构建自己的安全校验方案,也很可能迅速变得"臃肿"起来.我们还是建议您利用已有的三方库以简化此过程.
- 你可能需要在注册流程中,提前校验email或用户名是否重复,以提升用户体验.比如说在用户输入完用户名或输入框失焦时就做校验.这样能减少不必要的表单提交,立即为用户提供相关反馈.你还可以在这个过程中利用`use-debounce`这样的hook,以更好地控制校验触发的频率.
:::

## 会话管理(Session Management)
会话管理的作用是确保用户在多个请求中,保持相同的认证身份状态.其中包括创建/存储/刷新/删除会话或tokens.  

会话的类型有以下两种:
1. 无状态会话: 将会话数据(或token)**存储到浏览器的cookies里**.这样cookie就会随着每次请求,一同发送到服务器,从而获取服务器端上的认证.这种方法从实现上更简单,但如果没有正确地实现的话,安全性也不会很高.
2. 数据库: 将会话数据**存储到数据库**中.这样用户的浏览器端就只会收到一个加密的对话ID.这种方法更为安全,但实现上则更加复杂,更占用服务器端资源.

::: tip
你可以选择其中一种方式或同时使用两种,不过我们建议您使用像[iron-session](https://github.com/vvo/iron-session)或[Jose](https://github.com/panva/jose)这样的三方会话管理库.
:::

### 无状态会话
你需要采用以下步骤来创建管理无状态对话:
1. 生成一个用于注册会话的密钥,并将其作为环境变量存储起来.
2. 利用会话管理库,编写对会话数据加密或解密的逻辑代码.
3. 利用Next.js提供的`cookies`API以管理cookies.

除了以上步骤外,你还需要考虑一些更新或刷新会话的功能,并在用户返回到应用或退出应用后触发它们.
::: tip
你可以好好了解自己选用的认证三方库是否包括会话管理的功能.如有,记得利用起来!别重新造轮子了!
:::

**1.生成密钥**  
生成会话密钥的方法有很多.比如你可以直接在命令行内利用`openssl`命令直接生成:
```bash
$ openssl rand -base64 32
```
这条命令就是生成一个32个字符的随机字符串,将这个字符串复制并存储到你的环境变量文件去.
```js
// .env
SESSION_SECRET=your_secret_key
```
然后你就可以在会话管理的逻辑文件中,引用这个环境变量了.
```js
// app/lib/session.js
const secretKey = process.env.SESSION_SECRET
```

**2. 加密和解密会话数据**  
之后你可以利用选好的会话管理库,对会话内容进行加密和解密了.继续以先前的例子为例,我们利用**Jose**(兼容Edge运行时)和React的`server-only`包,确保会话管理的逻辑只会在服务器端上执行.
```ts
// app/lib/session.ts
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/app/lib/definitions';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload:SessionPayload){
    return new SignJWT(payload)
        .setProtectedHeader({alg:'HS256'})
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
};

export async function decrypt(session:string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session,encodedKey,{
            algorithms:['HS256']
        });
        return payload
    } catch (error) {
        console.log('Failed to verify session');
    }
}

```

::: tip
- payload负载要求只包含后续请求中,用户相关的最少且唯一的信息,比如像用户ID,用户角色等.当中不应该包括切实关乎到用户本身的辨认信息,像手机号码,邮箱地址,信用卡信息,或其它像密码这样的敏感信息.
:::

**3. 设置cookies(推荐使用这种方案)**  
我们推荐利用Next.js提供的`cache`API来存储会话内容.我们建议在服务器端中设置cookie字段,并在添加时加上以下配置项:
- **HttpOnly**: 防止客户端通过JS访问到cookie内容
- **Secure**: 利用https发送cookie
- **SameSite**: 指明cookie能否跨域发送
- **Max-Age或Expires**: 一段时间后删除cookie
- **Path**: 为cookie定义URL路径(?)

[更多关于cookies的配置项,可以前往MDN文档查看更多.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

```ts
// app/lib/session.ts
import 'server-only';
import {cookies} from 'next/headers';

export async function createSession(userId:string){
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 *1000);
    const session = await encrypt({userId, expiresAt});
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        httpOnly:true,
        secure:true,
        expires: expiresAt,
        sameSite:'lax',
        path:'/'
    })
}
```
回到我们的Server Action定义内,我们在里面调用这里的`createSession()`函数,并用`redirect()`API,将用户重定向到对应的路由去.

```ts
// app/actions/auth.ts
import { createSession } from '@/app/lib/session';

export async function signup(state:FormState, formData:FormData){
    // 之前包括的步骤:
    // 1. 校验表单项
    // 2. 准备需要插入到数据库的数据
    // 3. 将用户的信息插入到数据库中或调用数据库API.

    // 4. 当前步骤: 创建用户对话
    await createSession(user.id);
    // 5. 页面重定向
    redirect('/profile');
}
```

::: tip
- **Cookies需要在服务器端上设置,以避免客户端代码对其进行修改**
- 关于Next无状态会话管理和认证的视频介绍 -- [Youtube 11分钟视频](https://www.youtube.com/watch?v=DJvM2lSPn6w)
:::

**更新或刷新会话**  
你还可以延长会话的持续时间.这样可以保持用户登入应用的状态,避免用户多次重新登录的操作:
```ts
//  app/lib/session.ts
import 'server-only';
import {cookies} from 'next/headers';
import { decrypt } from '@/app/lib/session';

export async function updateSession() {
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    if(!session || !payload){
        return null;
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly:true,
        secure:true,
        expires,           // 就是更新了cookies的expires这个字段
        sameSite:'lax',
        path:'/',
    })
}

```
::: tip
记得了解了解你选的认证库是否已经包含了刷新token这个功能!
:::

**删除会话**  
删除对话,可以说是直接删除对应的cookie:
```ts
// app/lib/session.ts
import 'server-only';
import {cookies} from 'next/headers';

export async function deleteSession(){
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
```

之后就可以在应用的各个地方调用这个删除会话的函数,比如在用户退出后就调用:
```ts
// app/actions/auth.ts
import {cookies} from 'next/headers';
import { deleteSession } from '@/app/lib/session';

export async function logout() {
    deleteSession();
    redirect('/login');
}
``` 

### 数据库对话
使用以下步骤来创建和管理数据库对话:
1. 在数据库中创建用于存储会话和数据的表格(或检查自己使用的三方认证库是否具备这个功能)
2. 实现插入/更新/删除会话的功能
3. 存储到客户端浏览器前对会话ID进行加密,并确保数据库的内容跟cookie内容保持同步一致.(这步是可选的,我们的建议是使用中间件实现积极性认证校验(optimistic auth checks))

用代码解释就是:
```ts
// app/lib/session.ts
import {cookies} from 'next/headers';
import { db } from '@/app/lib/db';
import { encrypt } from '@/app/lib/session';

export async function createSession(id:number){
    const expiresAt = new Date(Date.now() + 7*24*60*60*1000);

    // 1. 在数据库中创建表格
    const data = await db
        .insert(sessions)
        .values({
            userId:id,
            expiresAt,
        })
        .returning({id: sessions.id});
        // 返回对话的ID.

        const sessionId = data[0].id;

        // 2. 对会话ID进行加密
        const session = await encrypt({ sessionId,expiresAt });

        // 3. 将会话存到cookies以实现积极认证检测
        const cookieStore = await cookies();
        cookieStore.set({
            httpOnly:true,
            secure:true,
            expires:expiresAt,
            sameSite:'lax',
            path:'/',
        })
}
```

::: tip
- 您可以考虑用Vercel Redis以获取更快的数据返回体验.除了选用技术外,你还可以考虑将会话数据存储到你主要使用的数据库中,将数据请求结合起来,以减少查询次数.
- 如果你对数据库的操作足够熟悉,你还可以利用更多数据库的高级功能,比如追踪用户上次登录的时间,用户活跃设备的数量,或是一键退出所有设备的功能.
:::

实现完会话管理后,接下来要做的就是在应用中实现授权逻辑(authorization),对用户能访问什么内容,能进行什么操作进行限制.  
如果你对这些内容很感兴趣的话请继续阅读吧!

## 授权(Authorization)
用户被认证,会话被创建后,你就需要对用户在应用中能访问的内容,能进行的操作进行进一步的控制,实现授权功能了.  

授权的类型主要有两种:
1. **积极授权**: 校验用户是否有权利访问某个特定路由,或是根据cookie里存储的对话数据,能否进行某些特定的操作.这些校验一般用在一些短期快速的操作上,比如展示或隐藏某些界面,或是基于用户的权限和角色进行重定向.
2. **安全性授权**: 也是校验用户是否有权访问某个特定路由,或是根据存于数据库的会话数据进行某些操作.这种校验方式更加安全,用在一些需要读取敏感信息,或进行敏感操作的场景.

两种授权的实现,我们都建议:
- 为了集中化实现授权逻辑,**创建专门的数据读取层**,(Data Access Layer)
- 使用数据传输对象(DTO,Data Transfer Objects),仅返回必要的数据.
- 有选择性地使用中间件来实现积极性校验

### 使用中间件来积极性校验(可选项)
一些场景下你可能需要考虑使用中间件来实现,基于用户的权限来实现重定向:
- 实现积极性校验.中间件是可以在每个路由上都运行的,因此我们可以很好的利用它来集中管理需要重定向的逻辑,预过滤掉一些未授权用户.
- 保护一些会在不同用户间共享数据的静态路由(比如收费页面的内容,是需要每个用户都不一样的)

不过也是因为中间件会在每个路由上都运行的原因(包括预获取的路由),我们更推荐使用积极性更新,只从cookie读取会话,避免数据库校验,因为后者可能会引起一些性能问题.

```ts
//  middleware.ts
import { NextRequest, NextResponse }  from 'next/server';
import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';

//  1. 区分需要被保护的路由,公共路由.
const protectedRoutes = ['/dashboard'];
const publicRotues = ['/login','signup','/'];

export default async function middleware(req:NextRequest){
    // 2. 校验当前路由属于什么类型, 受保护路由还是公共路由?
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRotues.includes(path);

    // 3. 解密cookie上的session
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    // 4. 将未认证的用户重定向到'/login'
    if(!isProtectedRoute && !session?.userId){
        return NextResponse.redirect(new URL('/login',req.nextUrl));
    }
    
    // 5. 成功认证的用户,重定向到'/dashboard'
    if(
        isPublicRoute &&
        session?.userId &&
        !req.nextUrl.pathname.startsWith('/dashboard')
    ){
        return NextResponse.redirect(new URL('/dashboard',req.nextUrl));
    }

    return NextResponse.next();
}


// 声明中间件需要执行的具体路由匹配
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

虽然说中间件在初次校验时很有用,但它不应该作为数据安全的唯一防线.数据安全的操作应该尽可能地接近数据源.

::: tip
- 中间件里,你可以用`req.cookies.get('session').value`来读取cookie值
- 中间件用的是Edge运行时. 你可能需要确保一下你用的认证库是否兼容这个运行时环境
- 你可以在中间件里用`matcher`这个配置项来指明,中间件需要在哪些路由上被执行.虽然我们的建议是,用于认证的中间件在每个路由上都被执行.
:::

### 创建专门的数据读取层(DAL)
我们建议,创建数据读取层来集中处理数据请求和授权逻辑.  
数据读取层一般会有检验用户会话的功能.至少至少都要有检验用户会话是否合法有效的功能.之后根据校验的结果重定向或将用户的一些信息返回给用户,供后续的请求用.

比如说,为DAL创建包含`verifySession()`功能的,单独文件.而后使用`cache`API,将校验结果记存起来供后续使用.
```ts
// app/lib/dal.ts
import 'server-only';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('sessionId')?.value;
    const session = await decrypt(cookie);

    if(!session?.userId){
        redirect('/login');
    }

    return { isAuth:true, userId: session.userId}
})

```

之后你可以在数据请求/Server Actions/路由处理器里调用这个函数:
```ts
export const getUser = cache(async () => {
    const session = await verifySession();
    if(!session) return null;

    try {
        const data = await db.query.users.findMany({
                  where: eq(users.id, session.userId),
                // Explicitly return the columns you need rather than the whole user object
                // 显式返回需要返回的列, 而不是整个用户对象信息
                columns: {
                    id: true,
                    name: true,
                    email: true,
                },
                });
        const user = data[0];
        return user
    } catch (error) {
        console.log('Failed to fetch user');
        return null;
    }
})

```
::: tip
- DAL可以保护请求时的数据安全.不过对于那些用户共享数据的静态路由而言,数据的获取则要在构建时而非请求时.用中间件对静态路由进行一定程度的保护.
- 要实现安全性校验,你可以通过比较获取到的会话ID和数据库里的是否相同来判断有效性.记得用`cache`API来避免不必要的重复请求.
- 你也考虑使用JS的类整合任意相关数据请求,在这些方法被执行前,调用`verifySession()`.
:::

### 使用数据传输对象(DTO)
