# 自己写Server Actions遇到的问题

::: danger
重点放开头: Next app目录下,actions文件夹的内容默认**不是**在服务器上运行的.  
<span className="text-red-500 font-bold">记得在actions的文件里,手动添加上"use server"这条指令.</span>
:::

## 调试过程
问题根源: 单独触发一个server action时,可以正常运行,添加或删除数据库的内容.  
**但**,更新后的内容没有触发页面的重渲染.  
简单说:
1. 有3个server actions: `getList`,`createItem`,`deleteItems`.分别是获取全部内容,添加新内容,删除内容.
2. 触发`createItem`,或`deleteItems`时,页面没有重渲染.数据库的内容被变更了,但没有反应到页面上.

尝试解决办法:
1. 调用`revalidatePath('/')`, 以及`revalidateTag('item')`.无果, 报错: "static generation store missing in revalidatePath  / revalidateTag."
2. 以为fetch缓存出现问题, 设置了`export const dynamic = 'force-dynamic`,以及`export const revalidate = 0`.无果.
3. 以为fetch本身设置出现问题,改用axios发起请求.无果.

4. 参考之前官方例子,用的是`useActionState`,跟自己的区别是例子里都要把事件触发改为form action.硬要把某些元素包裹到form里,比如input,button.只是不显示到页面上而已.  
于是把`createItem`改为form action.触发元素包裹到form里.跟官方的例子进行一一比对.  
```tsx
const [state,formAction] = useActionState(getList,null);
return (
    <form action={createItem}>
        <input type="text" name="item" />
        <button type="submit">Create</button>
    </form>
)
```

最后还是无果,不过初见端倪:  
这时应该要了解到了,<span className="text-red-500 font-bold">同样的console.log()语句,官方可行的例子会出现到终端命令行,而自己写的例子则出现到了浏览器控制台.</span>  

5. 改用`useActionState`依然无果, 直接在Next安装了mongoose,连接,创建访问数据库collection.  
新问题又出现了, 同样的`new Blog({/**...*/})`创建新文档语句,同样的`BlogModel.save()`保存语句.  
**官方例子里log出来是Async function,自己log出来的是undefined.**  

## 结果
问题的答案找出来了:**自己写的actions被当作客户端函数,在客户端上被执行了.**  
Server Actions你猜为什么是"Server" Actions? 因为它就是要服务器上运行才是正确的.  

<span className="text-red-500 font-bold text-xl">重复一句: 记得在actions的文件里,手动添加上"use server"这条指令.</span>

--- 
回头看这个问题实在幼稚, 自己在各种论坛上找各种解决办法,其实解决办法别人也是说过的,(x的一条post以及论坛上的一条评论都说过),但自己就是没留意到.
虽然这个问题是解决了,但中途找到了React官方文档更新了关于Server Actions的文档,很感兴趣,去翻译了解一下.  

感谢你能看到这里!
