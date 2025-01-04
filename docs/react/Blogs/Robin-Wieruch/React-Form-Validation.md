# React表格验证
> [原文地址](https://www.robinwieruch.de/react-form-validation/)  
> 结合了zod, Server Action, useActionState. 通过此文对React表单验证有进一步认识.

由于React世界里,服务器组件和服务器行为的诞生,前端就此能够以无缝且类型安全的方式,连接到后端.无论是授权,认证还是其它业务逻辑,后端的反馈都是必不可少的.因此我们还需要把这些内容,扩充到表单验证上.  

这也是为什么我的React全栈项目里的表单验证中,以服务器端为首,而暂时不用表单库的原因.因为当你需要把验证功能延申到客户端时,你可以有选择性地,在客户端使用或不使用表单三方库.(?不是很懂)  

当服务器端的反馈都覆盖到后,无论用户访问到你想或不想访问的路径,后端从结构上就把这些情况都解决了.这也成了后续,为客户端添加验证功能的基础.  

---
### 先用服务器端表单校验的好处是什么?
**开发者/用户体验方面:** 你创建的反馈,不单单可用于表单(比如401,404状态码).虽然错误操作的反馈基本都是事后考虑(afterthought?),但这些反馈对于用户而言都是必不可少的.  

**公共APIs:** 服务器端结构化的反馈(表单项错误,授权错误等...),可以为用户提供一个一致的公共API,以解决一类问题(?)  

**重用性:** 你可以相同的校验模式(schema validation),同时对服务器端和客户端数据进行校验.这样你也可以确保,不同端的应用,应用的校验规则是一致的.

---
### 为什么还要客户端校验?
**用户体验:** 这种校验可以绕过等待服务器响应(server roundtrip),立即为用户提供输入反馈.  
**性能:** 客户端校验通过避免向服务器发送不必要的请求,从而减少服务器端负载,提升性能.  

---
### 为什么你依旧需要选用三方表单库?
**避免重新造轮子:** 表单三方库提供了很多开箱即用的方法特性,开发者就不必再创建类似的功能了.当然,三方库功能有限,是否需要使用三方库的功能,是否需要自己研发,还是要看具体需求.不过相同点是,你还是要在服务器端编写大概的反馈逻辑,前面我们编写的服务器端表单校验好处就在这时就体现出来了.  

**团队共识:** 当作为团队一员开发时,一套使用规则的设定是很有必要的.三方库则自带这个功能.无论是为功能健壮性,表单功能介绍文档,还是表单的高级用法, 一个合格的三方表单库都能很好的提供这些内容特性,团队也能依赖于此共同的框架.  

**用户体验:** 三方表单库一般都能为用户提供更好的使用体验.它们都能在表单项变化,内容虚焦,或提交时处理表单校验.而且都能实时提供输入反馈,从而给用户更好的体验.  

---

好处说完了,接下来深入了解一下要怎么实现吧.我们先介绍功能实现的一切基础:React表单,React Server Action,以及React表单组件:
```tsx
"use client"

import { createInvoice } from '../actions/create-invoice';

const InvoiceCreateForm = () => {
    return (
        <form action={createInvoice}>
            <label htmlFor="title">Title:</label>
            <input type="text" name="title" id="name" />

            <label htmlFor="amount">Amount:</label>
            <input type="number" name="amount" id="amount" />

            <label htmlFor="draft">Draft:</label>
            <input type="checkbox" name="draft" id="draft" />

            <label htmlFor="feature1">Feature1</label>
            <input type="checkbox" name="features" id="feature1" value="feature1" />
            <label htmlFor="feature2">Feature2</label>
            <input type="checkbox" name="features" id="feature2" value="feature2" />

            <button type="submit">Send</button>
        </form>
    )
}
export default InvoiceCreateForm;
```

接着是Server Action,处理表单提交后的数据逻辑:
```ts
"use server";
import {z} from 'zod';
import {ztd} from 'zod-form-data';

const createInvoiceSchema = zfd.formData({
    title: ztd.text(z.string().min(3).max(191)),
    amount:ztd.numeric(z.number().positive()),
    draft:ztd.checkbox(),
    features:ztd.repeatable(),
});

export const createInvoice = async (formData:FormData) => {
    const { title, amount, draft, features } = createInvoiceSchema.parse(formData);

    console.log(title,amount,draft,features);
}
```
通过以上代码,我们就创建了一个React表单组件,通过Server Action获取并校验用户的输入内容了.当模式校验检测到错误时,应用就会直接崩溃了.(??? crash in its current state).  

::: tip
[关于React里的FormData](https://www.robinwieruch.de/react-form-data/])
:::
我们先说React里的服务器端校验,之后再说客户端表单校验吧.

## React服务器端表单校验
首先,我们需要处理Server Action里,表单校验出错时的问题.以下的方式能稍微比直接崩溃好一点,把出错内容打印到控制台:
```ts{2,5-8}
export const createInvoice = async (formData:FormData) => {
    try{
        const { title, amount, draft, features } = createInvoiceSchema.parse(formData);
        console.log(title,amount,draft,features);
    }catch(error){
        console.log(error)
    }
    console.log('Success')
}

```
直接调用schema(模式)`parse()`方法的话,校验出错,应用也会直接崩溃.解决方法要么是使用`try-catch`块,要么可以使用`safeParse()`这个方法,它能返回一个包含错误信息的对象.  

Server Action里,需要分别处理不同类型的错误.比如,当模式校验失败,就提示用户哪个表单项数据不通过校验.而当错误并不是表单校验抛出的话,则要返回另外的错误信息提示.
```ts {6-25}
export const createInvoice = async (formData:FormData) => {
    try {
        const { title, amount, draft, features } = createInvoiceSchema.parse(formData);
        console.log(title,amount,draft,features);
    } catch (error) {
        if(error instanceof ZodError){
            return {
                message: "",
                fieldErrors: error.flatten().fieldErrors,
            }
        } else if( error instanceof Error){
            return {
                message: error.message,
                fieldErrors:[]
            } 
        } else {
            return {
                message: 'An unknown error',
                fieldErrors:[],
            } 
        }
        return {
            message:'Invoice created',
            fieldErrors:[],
        }
    }
}

```
以上就解决了少部分情况的错误情况了,通过返回一个带有message和fieldErrors的对象,告知用户哪里出了错.对象内容当然可以有更多(比如`data`,`status`),不过基本结构也算是定下了.  

`message`属性是给用户看的(可以用弹窗方式告知信息内容),而`fieldErrors`是表单项的名称和对应的错误信息字典(也可展示到表单一侧).  

为了让错误处理在Server Actions间变得更加通用,我们可以将上面的部分内容,提取到额外的助手函数内,并定义更多的功能类型和常量(以下的ActionState和EMPTY_ACTION_STATE):
```ts
import { ZodError } from 'zod';

export type ActionState = {
    message:string;
    fieldErrors:Record<string,string[] | undefined>; 
};
export const EMPTY_ACTION_STATE: ActionState = {
    message:'',
    fieldErrors:[],
}

export const fromErrorToActionState = (error: unknown): ActionState => {
        if(error instanceof ZodError){
            return {
                message: "",
                fieldErrors: error.flatten().fieldErrors,
            }
        } else if( error instanceof Error){
            return {
                message: error.message,
                fieldErrors:[]
            } 
        } else {
            return {
                message: 'An unknown error',
                fieldErrors:[],
            } 
        }
        return {
            message:'Invoice created',
            fieldErrors:[],
        }
};

export const toActionState = (message:string): ActionState => ({
    message,
    fieldErrors:{},
});
```
通过把错误类型和一些其它提取到助手函数内之后,我们就可以在Server Action里利用它们,更清晰地编写并返回对应状态了.  
我们仅在一个Server Action里重用这个逻辑,你当然可以把这些helper functions用在其它Server Action里了.

```ts
export const createInvoice = async (formData: FormData) => {
    try {
        const { title, amount, draft, features } = createInvoiceSchema.parse(formData);
        console.log(title,amount,draft,features);
        // TODO: create invoice
    } catch (error) {
        fromErrorToActionState(error);           // [!code highlight]
    }
    return toActionState('Invoice created');  // [!code highlight]
}
```

之后我们需要在表单组件内,获得表单提交后的处理结果.  
这里我们可以使用`useActionState()`这个hook,它接收server action,和表单初始状态两个参数,返回后续的表单数据,和增强后的`formAction`.
```tsx
import { useActionState } from 'react';

const InvoiceCreateForm = () => {
    const [actionState, formAction] = useActionState(createInvoice, EMPTY_ACTION_STATE);
    return (
        <form action={formAction}>
            {/* ... */}
            <button type="submit">Send</button>
            {actionState.message}
        </form>
    )
}
```
这样我们就能在提交按钮下面,得知表单校验的状态了.这只是最简单的展示方式,你可以结合其它组件以展示对应处理结果.  

由于我们使用了`useActionState()`这个hook,我们因此也要改变`createInvoice`所接收的参数内容:
```ts
export const createInvoice = async (
    _actionState:ActionState,
    formData:FormData
) => {
  try {
    // ...
  } catch (error) {
    return fromErrorToActionState(error);
  }
  return toActionState("Invoice created");
};

```
之后我们可以利用server action返回的`fieldErrors`属性,在对应的表单项旁边,提示对应的校验错误信息.  
由于这个属性是个嵌套对象,我们要通过表单项名称来获取对应的错误信息.之后仅展示每个表单项可能出现的第一个错误:
```tsx {5,9,13,21}
return (
  <form action={formAction}>
    <label htmlFor="title">Title:</label>
    <input type="text" name="title" id="name" />
    <span>{actionState.fieldErrors.title?.[0]}</span>     

    <label htmlFor="amount">Amount:</label>
    <input type="number" name="amount" id="amount" />
    <span>{actionState.fieldErrors.amount?.[0]}</span> 

    <label htmlFor="draft">Draft:</label>
    <input type="checkbox" name="draft" id="draft" />
    <span>{actionState.fieldErrors.draft?.[0]}</span> 

    <label htmlFor="feature1">Feature 1:</label>
    <input type="checkbox" name="features" value="feature1" id="feature1" /> 

    <label htmlFor="feature2">Feature 2:</label>
    <input type="checkbox" name="features" value="feature2" id="feature2" />

    <span>{actionState.fieldErrors.features?.[0]}</span>  

    <button type="submit">Send</button>
    {actionState.message} 
  </form>
);

```
::: tip
[如何(不)重置ServerAction处理后的表单?](https://www.robinwieruch.de/react-form-data/)
:::

我们可以提取出`FieldError`组件,为表单项提示错误信息:
```tsx
import { ActionState } from './helper';

type FieldErrorProps = {
    actionState: ActionState;
    name:string;
};

const FieldError = ({actionState, name}: FieldErrorProps) => {
    const message = actionState.fieldErrors[name]?.[0];
    if(!message) return null;

    return <span className="text-xs text-red-500">{message}</span>
}

export { FieldError };

```
之后再把它整合到我们原本的表单组件中:
```tsx {5,9,13,21}
return (
  <form action={formAction}>
    <label htmlFor="title">Title:</label>
    <input type="text" name="title" id="name" />
    <FieldError actionState={actionState} name="title" />

    <label htmlFor="amount">Amount:</label>
    <input type="number" name="amount" id="amount" />
    <FieldError actionState={actionState} name="amount" />

    <label htmlFor="draft">Draft:</label>
    <input type="checkbox" name="draft" id="draft" />
    <FieldError actionState={actionState} name="draft" />

    <label htmlFor="feature1">Feature 1:</label>
    <input type="checkbox" name="features" value="feature1" id="feature1" />

    <label htmlFor="feature2">Feature 2:</label>
    <input type="checkbox" name="features" value="feature2" id="feature2" />

    <FieldError actionState={actionState} name="features" />

    <button type="submit">Send</button>
    {actionState.message}
  </form>
);
```

有了以上代码,你就可以用你喜欢的UI库,把上面的`label,input,button`组件给替换掉了.  

至此,你就自行实现了一个不依赖三方表单库的,带有服务器端校验的表单组件了.  
你还可以将功能扩展到客户端上.接下来我们就讲讲如何将其进行扩展.

## React客户端表单校验
接下来我们把表单组件的验证功能扩展到客户端.最简单的校验方法就是利用HTML的多个自带属性对表单项进行验证,如`required`,`min`,`max`,`pattern`,`maxLength`等.
```html{2}
<label htmlFor="title">Title:</label>
<input type="text" name="title" id="name" required maxLength={10} />     

<label htmlFor="amount">Amount:</label>
<input type="number" name="amount" id="amount" required min={0} max={999} />     
```
可惜的是,原生HTML元素提供的校验功能有限,难以自定义化.如果需要更多的输入控制,我们不建议使用原生属性功能.  

如何把服务器端校验共用到客户端呢? 先把Server Action里的校验模式提取到一个单独的文件去,这样我们就可以把这个校验模式导出,公用了.后续我们会在客户端校验中重用这个模式:
```ts
import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const createInvoiceSchema = zfd.formData({
    title:zfd.text(z.string().min(3).max(191)),
    amount:zfd.numeric(z.number().positive()),
    draft:zfd.checkbox(),
    features:zfd.repeatable(),
});
```
之后我们根据这个模式,为表单组件编写绑定一个事件处理器,触发服务器行为之前,在客户端对数据进行校验:
```html
<form action={formAction} onSubmit={handleSubmit}>
    <!-- ... -->
</form>
```
事件内部,我们先获取到表单数据项,并用模式对这些输入数据进行校验.  
如果校验失败,则阻止表单提交,不触发服务器行为.否则,将数据通过服务器行为发送到服务器端.  
这里同样地,如果你不想用`try-catch`块,你可以用`safeParse()`方法取代`parse()`方法,从而获得一个包含可选错误属性的对象:
```ts
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    try {
        createInvoiceSchema.parse(formData);
    } catch (error) {
        event.preventDefault();
    }
}
```
为了展示校验错误时的提示,我们需要在表单组件中得知具体出错的表单项内容.因此,我们使用客户端组件的`useState` hook来管理表单错误信息.不要忘了每次表单提交前重置这个校验状态.

```tsx
const [validation, setValidation] = useState<ActionState | null>(null);

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);

    setValidation(null); // [!code highlight]

    try {
        createInvoiceSchema.parse(formData);
    } catch (error) {
        setValidation(fromErrorToActionState(error));     // [!code highlight]
        event.preventDefault();
    }
```

至此,如果表单项输入有错,我们可以在其旁边展示错误信息了.如果没有,则会进而触发服务器端的校验:
```tsx
<label htmlFor="title">Title:</label>
<input type="text" name="title" id="name" />
<FieldError actionState={validation ?? actionState} name="title" />

<label htmlFor="amount">Amount:</label>
<input type="number" name="amount" id="amount" />
<FieldError actionState={validation ?? actionState} name="amount" />
```

而要展示其它校验结果信息,我们可以用弹窗,或在表单下方进行提示.不过展示的前提是,表单项内容校验已经通过了:
```tsx
<button type="subtmi">Send</button>
{validation? validation.message : actionState.message}
```

以上就是不使用表单三方库,自行实现客户端表单校验的大概.你可以在此基础上添加更多更复杂的校验规则,错误信息提示,以及更全面的错误处理.你还可以在表单项发生变化,或虚焦时就进行校验,而不用像上面,在提交时才进行校验.  

我建议您使用三方库,以便于添加更复杂的表单校验规则,定制错误信息,并提供更好的用户体验.不过这都取决于你,表单足够简单的话也就不需要了.  

---
全栈应用中,服务器端的反馈是必不可少的.它不仅为用户提供一致的反馈,还能为用户提供一个结构化的API.从服务器端开始就对数据进行校验,无论对错,都能从结构化上进行正确地处理.而这是后续扩展到客户端验证所需的扎实基础.  

感谢你能看到这里!