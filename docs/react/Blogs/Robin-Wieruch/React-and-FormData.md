# React与FormData
> [原文地址](https://www.robinwieruch.de/react-form-data/)

当你在React里利用form的action属性触发表单提交时,你有可能遇到的问题是,不知道如何处理提交获得的,FormData类型的表单项数据.更不用说要把这些数据经处理后再提交给服务器端了.  

我们用代码举例:以下是一个用于创建发票的表单组件.当用户点击提交后,表单项内容就会通过form action发送到服务器端.

```tsx
import { createInvoice } from '../actions/create-invoice';

const InvoiceCreateForm = () => {
    return (
        <form action={createInvoice}>
            <label htmlFor="title">Title:</label>
            <input type="text" name="title" id="name" />

            <label htmlFor="amount">Amount:</label>
            <input type="number" name="amount" id="amount" />

            <button type="submit">Send</button>
        </form>
    )
}
export default InvoiceCreateForm;
```

这个从`actions`目录导入的`createInvoice`行为,会得到FormData格式的数据,并将数据提取成JS对象格式.后续你可能会将数据发送到服务器(通过客户端行为),或者如果你用了像Next框架,则可以通过服务器端行为,直接再数据库中创建invoice数据.  
```ts
export const createInvoice = (formData:FormData) => {
    const data = {
        title:formData.get('title'),
        amount:formData.get('amount'),
    };
}
```
而如果这个行为需要在服务器端上运行,或是在服务器组件内定义的,则要在文件顶部添加上`"use server"`指令,并使之成为异步函数:
```ts {1,2}
"use server";
export const createInvoice = async(formData:FormData) => {
    const data = {
        title:formData.get('title'),
        amount:formData.get('amount'),
    }
};
```
为了简便,我们只以客户端行为为例.  
现在的问题是,如何更好地处理这个FormData格式的数据呢?  
要不,先不通过属性名,一个个通过`.get()`获取,改用更为简洁的办法把FormData格式的数据转换成JS对象形式?
```ts
export const createInvoice = (formData: FormData) => {
    const data = Object.fromEntries(formData); // ![code highlight]
}
```
为了让代码可读性更好,你可以从返回的这个对象中解构出你想要的具体属性
```ts
export const createInvoice = (formData: FormData) => {
    const {title, amount} = Object.fromEntries(formData); // ![code highlight]
}
```

最后,你可能会想确保它们的类型都是你想要的.个人喜欢用Zod(受限于库的体积,推荐在服务器端上使用):
```ts
import {z} from 'zod';

const createInvoiceSchema = z.object({
    title:z.string().min(3).max(191),
    amount:z.coerce.number().positive(),
});

export const createInvoice = (formData:FormData) => {
    const { title, amount } = createInvoiceSchema.parse(
        Object.fromEntries(formData)
    );
}
```

利用模式校验输入数据对象,你就可以确保数据类型是正确的了.如果校验错误,则直接会崩溃.(可用`safeParse()`方法取代`parse()`).  

不过,利用`Object.fromEntries()`方法转变对象时可能会有个问题,就是不能正确地处理同一个键名的多个值(?).  
举例来说,以下的多选框,就可能出现同一个`name`,多个值的情况:
```tsx
// ...
<label htmlFor="draft">Draft:</label>
<input type="checkbox" name="draft" id="draft" />

<label htmlFor="feature1">Feature 1:</label>
<input type="checkbox" name="features" id="feature1" value="feature1" />
<label htmlFor="feature2">Feature 2:</label>
<input type="checkbox" name="features" id="feature2" value="feature2" />

<label htmlFor="opts">Options:</label>
<select name="opts"multiple id="opts">
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
</select>

//  ...
```
以上如果还用`Object.fromEntries`处理获取到的数据,就会只取得同个键名的最后一个值.因为这个方法本来就不是用以这样转化的.这种情况下,你可以利用`formData.getAll()`方法,特殊处理这种多个值只取最后一个值的情况.

```ts
import { z } from 'zod';

const createInvoiceSchema = z.object({
    title: z.string().min(9).max(191),
    amount:z.coerce.number().positive(),
    draft: z.coerce.boolean(),
    features:z.array(z.string()).optional(),
    opts: z.array(z.string()).optional(),
});

export const createInvoice = (formData:FormData) => {
    const { title, amount,draft,features,opts } =  createInvoiceSchema.parse({
        ...Object.fromEntries(formData),
        features:formData.getAll('features'),
        opts:formData.getAll('opts'),           // ... 怎么又回到列举的方式获取了
    });
}
```
之后你就能正确的处理相同键名的多个值了.  
不过当你有多个这样的表单,又不想每次都特殊情况特殊处理,你可以使用像`zod-form-data`这样的库为你解决:
```ts
import {z} from 'zod';
import {zfd} from 'zod-form-data';

const createInvoiceSchema = zfd.formData({
    title:zfd.text(z.string().min(3).max(191)),
    amount:zfd.numeric(z.number().positive()),
    draft:zfd.checkbox(),
    features:zfd.repeatable(),
    opts:zfd.repeatable(),
});

export const createInvoice = (formData:FormData) => {
    // 把转换的工作交给了schema?FormData => JS Object, to avoid dealing with edge cases.
    const { title, amount, draft, features, opts} = createInvoiceSchema.parse(formData);
}
```

总结一下就是,你既可以用`Object.fromEntries()`将FormData格式数据简便地转换成Javascript对象格式,也可以结合Zod,对对象属性和数据类型进行限制校验.而使用`formData.getAll()`,可以正确处理同个键名多个键值的问题.而这种表单项情况如果还是常见的话,你还可以引入`zod-form-data`库进一步简化你的代码.