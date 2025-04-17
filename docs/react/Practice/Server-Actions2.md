# 又在Server Actions问题里遇到的问题

## 问题
1. 结合了`use`API后才发现, 传递的Server Action Promise只针对GET请求;POST请求直接就会被执行而不是绑定事件处理器;
2. Mongo里的神奇问题: 格式校验不通过无法写入数据库.之前是可以的, Date类型的数据变字符串了(?)
3. redis缓存的问题(未解决): (GET)获取列表时直接返回对应键名的值, 更新(POST)之后,GET因为对应KEY值存在,直接返回了原始KEY的值,哪怕值已经被新插入数据.
4. 客户端组件触发Server Action能否脱离form组件?  
* 单一个button,要抽出来单独客户端组件先不说, 
* 还要包裹到form元素里;
* 还要调用`useActionState`, 绑定`formAction`事件;
<div className="font-bold text-gray-500 text-xl">太太太太太太麻烦了吧😣</div>

--- 

<div class="text-red-500 font-bold text-xl">
就算是总结一篇Server Actions的文章.包括ServerActions的传递问题
</div>

---
不知道校验这个问题把我带到哪了,先记录一下
想Next.js+Express+Mongoose实现类型安全,发现需要实现验证的地方有:
1. zod + server actions, `createUserScheme`, `schema.safeParse`对请求参数进行校验;
2. express + zod, 在Mongoose里,利用`model.safeParse`,在真正操作数据库前再进行一次验证.(只是为了跳过客户端,直接通过服务器端对数据库进行操作.校验是一样的,一个前端一个后端.)
3. 在models,利用TS,及创建database schema时对数据库类型进行约束.(?创建了之后不就没用了吗?)

优化点:
* 共享`createUserSchema`
* 利用`zod.infer`实现类型推导;
* 利用中间件进行数据校验?哪些请求需要?
* 怎么用monorepo共享schema?

// 使用monorepo, 共享了schema, 失去了dev turbopack. 前者用于校验, 后者用于快速启动项目

// left 用共享的schema实现next + express端的校验 + deepseek聊天记录
