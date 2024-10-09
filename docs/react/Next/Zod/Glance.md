# 初试Zod

> 参考文章: https://zhuanlan.zhihu.com/p/688752427
在Next的官方教程里大概接触过Zod这个东西,用在了表单校验.  
那它跟Typescript又有什么关系呢?  
为什么有了Typescript的<静态类型检测>, 还要Zod进行下一步验证呢?  
浅浅尝试用了一下,有一点点答案.很可能还不完全.尝试记录一下Zod和Typescript的一个学习过程.  


## 浅得不能再浅的认识
Typescript的作用我还停留在:
```ts
type Person = {
    name: string,
    age: number,
}
```

而Zod的使用如下:
```ts
import { z } from 'zod';

const PersonSchema = z.object({
    name: z.string(),
    age: z.number(),
})

```

乍一看相似得不得了,都是检验`Person`这个对象类型,需要有字符串`name`属性,和数字类型`age`.  
那怎么把它们连接在一起呢?**答案是`z.infer()`函数**:
```ts
type Person = z.infer(typeof PersonSchema);

// 这里就取代了上面Person的类型定义了.
```

## 有了Typescript,为什么还要Zod呢?
这是我最初的疑问,功能相似,为什么还需要两个不同的工具呢?  
初步认识后我得出的答案是:  
**Typescript是针对前端代码,为前端开发者提供IDE代码提示的**  
**Zod结合后端代码,为实际前后端代码类型一致提供桥梁.**  
总结完上句,光看字面意思我自己也不懂.还是结合一下具体代码来解释吧:  

--- 

看下以下代码:
```ts
type Person = {
    name: string,
    age:number
}

async function Page(){
    const res = await fetcher('/person');      // fetcher是一个自己封装的数据获取函数.可以理解为fetch(url).then(res => res.json())

    return (<></>)
}
```
目前看来,我想通过`fetcher('/person')`,获取Person类型的数据对象.  
那要怎么对res进行验证呢?`type Person`是否就能完整胜任验证工作呢?  
**答案是否定的**
```ts
// 如果我返回的是以下数据:
// {
//     "name":"li",
//     "birthday":1997
// }

console.log(res.)  
```
停留在这里是想解释,**因为有了`type Person`的定义,这里的VSCode会提示两个属性,`res.name`和`res.age` 显然这是错误的,没有`res.age`这个属性.**  
这里就解释了,**Typescript是针对前端代码的**.  

那又怎么解释,Zod提供前后端代码类型一致的桥梁呢?  
方法是`PersonSchema.parse()`或者`PersonSchema.safeParse()`两个方法.(二者的区别之后再解释)

## `Schema.parse()`和`Schema.safeParse()`
返回的数据跟前端代码定义的类型产生了差异,定义了number age, 返回了number birthday.前端代码还"指导"你犯错.这就产生大问题了.  
解决这个预期和现实不一致的问题,就要用到`Schema.parse()`或`Schema.safeParse()`方法了:
```ts
// 假如我们已经定义了PersonSchema如下:
const PersonSchema = z.object({
    name:z.string(),
    age:z.number()
});
type Person = z.infer(typeof PersonSchema);

async function Page(){
    const res = await fetcher('/person');
    const person = PersonSchema.parse(res);
    console.log(person.age);
    // return ...
}
```
这里返回了`person.birthday`,而没有`person.age`,差别就出来了.

```text
 ⨯ ZodError: [
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "undefined",
    "path": [
      "age"
    ],
    "message": "Required"
  }
]

```
不仅页面运行不了,类型错误的提示也非常明显:**非法类型,`age`属性期望接收到数字类型值,结果接收到的是undefined**  
**这就是`Schema.parse()`的一个硬性检验工作:类型不过关,页面直接无法运行.**  
而用了`Schema.safeParse()`,**页面是可以运行的.**  
区别就是返回的结果是不一样的:
- `parse()`返回的是检验结果后的数据,通过验证,就会是**数据本身**;不通过验证,直接就是页面报错
- `safeParse()`返回一个包含三个属性的对象,所含属性分别是:`data`,`success`,`error`.作用也很明显了,方便前端判断类型校验是否通过,方便前端利用检验结果进行进一步调试,而不是直接就页面报错.
```ts
const checkWithStatus = PersonSchema.safeParse(res);
console.log(JSON.stringify(checkWithStatus));
// {
// "success":false,
// "error":{
//     "issues":[
//         {
//             "code":"invalid_type",
//              "expected":"number",
//              "received":"undefined",
//              "path":["age"],
//               "message":"Required"
//        }
//      ],
//      "name":"ZodError"}
// }

```

## 新的问题
上面展示了前后端类型不一致会导致的前端提示问题,可是,当实际收到的,比预期的要多的时候会发生什么呢?  
**结果是根据前端的Schema,仅展示Schema有定义的属性.`parse()`方法把不在Schema里的数据给过滤了**
```ts
// 实际返回的数据:
// {
//     name: 'li',
//     age: '20',
//     birthday:1997
// }
const PersonSchema = z.object({
    name:z.string(),
    age:z.coerce.number(),  //如果不用coerce将返回的字符串'20',转变成number又会报错了
});

const res = await fetcher('/person');
const person = PersonSchema.parse(res);
console.log(res.birthday, person.birthday);    // 1997 undefined
```

**VSC会报错,也是正确的:`person`没有`birthday`属性,被`parse()`方法给过滤了,原本的`res`对象上还是有这个属性的.**  
**`PersonSchema.safeParse(res)`甚至`success:true`,但`birthday`属性已经是被忽略了.(???)**  

简单来说是不是, 前端要拿什么属性由Schema决定:少了,类型错了-> 报错; 多了,Schema没定义,那就不是错.(?)

next: 用zod检验对象数组, 表单验证.

在用react-form之前,先看看怎么单独用Zod对表格进行校验, 有Zod就行的话,为什么还要React Form呢?

搭配原生的form,很麻烦,相当麻烦.  
粒度是每个输入框.type,placeholder,name,register函数这些等等,都要填入每个FormField里.  
问题最大的是好像跟zod,react-form都没什么关系,需要代码优化才能解决.  

https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/  
上面这篇看完也是云里雾里的,好像要我懂但我就是没懂.跟着可能看出每个属性的作用,自己想基本是想不出的.  
https://dev.to/majiedo/using-zod-with-react-hook-form-using-typescript-1mgk  
似乎跟上面一篇没什么区别,原来react-form-hook跟zod搭配就是要这样写?要死记硬背?  

---

记一下一些,如果没有框架,需要绑定的表单,跟校验需要哪些步骤吧:
1. 表单有哪些数据?
2. 每项数据分别是什么类型?需要进行怎样的校验?
3. Typescript方面要进行什么操作?Zod又要怎么操作?
4. 怎么把Typescript或Zod定义的,校验操作,绑定到对应表单项之中?

我能懂的,想到的步骤,先记录一下,缺了什么再重新去看.

1. 账号名username,密码password, 密码确认confirmPassword
2. string*3, minlength > 6, password === confirmPassword
3. TS和Zod任意选择先进行哪个定义.看起来利用`z.infer`,先定义Zod更方便.
::: tip
**区别先定义FormData还是先定义FormSchema:**
1. 先定义FormSchema, 则`type FormData = z.infer<typeof FormSchema>`
2. 先定义type FormData, 则FormSchema的类型是ZodType\<FormData>
:::

```ts
// 1. 先定义Schema
// @/types.ts
export const UserSchema = z.object({
    username:z.string().min(6,"minLength must be greater than 6!"),
    password:z.string().min(6,"minLength must be greater than 6!")
    confirmPassword:z.string().min(6,"minLength must be greater than 6!")
}).refine(data => data.password === data.confirmPassword,{'Passwords do not match!'})

export type User = z.infer<typeof UserSchema>  // [!code highlight]
```

```ts
// 2.先定义FormData
// @/types.ts
import {z, ZodType} from 'zod'
export type FormData = {
    username:string;
    password: string;
    confirmPassword:string;
}

export const FormSchema: Zodtype<FormData> = z.object({  // [!code highlight]
    username:z.string().min(6,"minLength must be greater than 6!"),
    password:z.string().min(6,"minLength must be greater than 6!")
    confirmPassword:z.string().min(6,"minLength must be greater than 6!")
}).refine(data => data.password === data.confirmPassword,{'Passwords do not match!'})

```

既然都要定义Zod,为什么不省事让Zod为我们实现类型推断呢?ZodType\<FormData>看起来除了提示外,不值得大费周章重新再定义.

---

回到FormField的定义, 收回之前的话, 对比FormField, 更麻烦的是(input& errors.message)的结合,前者起码把错误展示和输入框的类型整合到一起了.
```tsx
export default function FormField({
    type,
    register,
    placeholder,
    error,
    name
}) {
    return (
        <>
        <input 
            type={type}
            placeholder={placeholder}
            {...register(name)}
        />
        {error && error.message}
        </>
    )
}

```

```tsx
import { useForm } from 'react-hook-form';
import {zodResovler} from 'zod'
import FormField from '../components/FormField'
export default function Form(){
    const {
        register,
        formState:{errors},
        handleSubmit
    } = useForm<User>(
        {resolver: zodResovler(UserSchema)}
    );
    async function onSubmit(data:User){
        console.log(data)
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormField
                    type="text"
                    placeholder="username"
                    name="username"
                    register={register}
                    error={errors.username}
                    />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}
```

好的一点是可扩展性强,不用绑定input和errors.  
通过error prop,把errors.username.message(举例)拆解出来了,不用每次都`{errors && <span>{errors.username.message}</span>}`