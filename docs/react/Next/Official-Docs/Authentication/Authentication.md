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
