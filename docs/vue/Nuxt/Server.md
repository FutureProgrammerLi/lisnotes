# Server

> https://nuxt.com/docs/guide/directory-structure/server  
> 用Nuxt的一大好处就是能同时写前端和接口.那在哪写,怎么写,又在应用中怎么用,当然是需要学的了.  
> 先从`/server` 这个目录学起,基本服务器相关的都是放在这里面的了.  

<p class="text-2xl font-bold">server/这个目录就是在编写API以及服务器响应的.</p>

***

Nuxt自动扫描这些目录下的文件,注册服务器API,生成服务器处理器,兼具热更新模块支持.  
就是三个目录:`server/api`,`server/routes`,`server/middleware`
```text
-| server/
---| api/
-----| hello.ts      # /api/hello
---| routes/
-----| bonjour.ts    # /bonjour
---| middleware/
-----| log.ts        # log all requests
```

每个文件内都应该导出一个用`defineEventHandler()`或是`eventHandler()`(前者的别名)定义的默认函数.  
这个处理器可以返回**JSON数据,`Promise`,或是`event.node.res.end()`**作为答复.  
```ts
//server/api/hello.ts
export default defineEventHandler((event) => {
    return {
        hello:'world'
    }
});
```

之后你就可以在你任意的客户端页面组件上这样获取这个数据了:
```vue
<script setup lang='ts'>
    const { data } = await useFetch('/api/hello');
</script>
<template>
    <pre>{{ data }}</pre>
</template>
```

## 浏览器路由
在`~/server/api`里的所有文件,其中的接口路径,都是带有`/api`前缀的.  
如果你不想请求时加上这个前缀,你可以把接口写在`~/server/routes`这个目录下面.  
```ts
// server/routes/hello.ts
export default defineEventHandler(() => 'Hello World');
```

这样你直接请求`/hello`路径,或是访问`localhost:3000/hello`,就会得到'Hello World'这个网络回复了.

::: tip
当前这样的设置文件名称,功能是没有`pages`那样完整的,毕竟还没有动态问题.
::: 

## 服务器中间件
Nuxt自动读取`~/server/middleware`里的每一个文件,为你的项目创建相应的服务器中间件.  
每当路由添加,请求头检查,日志请求,或是扩展事件请求对象**之前,中间件都会被执行.**(相当于告诉你中间件的作用了,在这些操作之前先过中间件这一层的关.)  

::: tip
中间件不应该返回任何东西,也不要关闭或者直接返回网络请求,它的作用一般是检查请求内容,或是扩展请求,又或是抛出错误.(抛出错误算不算关闭网络请求?)
:::

```ts
//server/middleware/log.ts
export default defineEventHandler((e) => {
    console.log('New Request:' + getRequestURL(event));
});
```

```ts
// server/middleware/auth.ts
export default defineEventHandler((e) => {
    event.context.auth = { user:123}
})
```

## 服务器插件
除了上面三个文件夹,`~/server/plugins`在这个目录里你可以编写Nitro的插件.这样可以扩展Nitro的运行时行为,在Nitro的生命周期里面做点你想做的.
```ts
// server/plugins/nitroPlugin.ts
export default defineNitroPlugin((nitroApp) => {
    console.log('Nitro plugin', nitroApp);
})
```

::: tip
[这里看更多Nitro插件相关的内容.](https://nitro.unjs.io/guide/plugins)
:::

## 服务器工具函数
服务器路由是由`unjs/h3`支持的,因此[它提供了很多工具函数](https://www.jsdocs.io/package/h3#package-index-functions).  
你觉得不够还可以自己在`~/server/utils`下写更多的工具函数.  
比如说你可以自己在原有事件处理器上再包括一层,在这一层里实现你额外的功能之后再把网络回复返回给客户端.  
```ts
// server/utils/handler.ts
import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    try {
      // do something before the route handler
      const response = await handler(event)
      // do something after the route handler
      return { response }
    } catch (err) {
      // Error handling
      return { err }
    }
  })

```
和middleware有什么区别? 功能是否有重叠?网络请求之前如果需要额外操作,用middleware还是handler wrapper?

## 服务器类型
::: warning
Nuxt版本>=3.5才有这个声明功能.我clone下来的版本自带就有,可以说有用也可以说没用
:::
为了让你的IDE更好地从'nitro'和'vue'自动导入,实现类型推断提示,你可以在`~/server/tsconfig.json`中作以下配置:
```json
{
    "extends":"../.nuxt/tsconfig.server.json"
}
```
现在用`nuxi typecheck`作类型检查时以上代码是没什么用的,但在你的IDE中应该会获得更好的类型推断及提示.

## 使用指南
### 路由参数
服务器路由可以使用中括号作为文件名,开启动态参数的功能.  
比如说文件名是`/api/hello/[name].ts`,那么就可以在`event.context.params`中获取`[name]`这个参数.  

```ts
// server/api/hello/[name.ts]
export default defineEventHandler(e => {
    const name = getRouterParam(event,'name'); //??? 这又是什么composables?还真有!
    return `Hello `${name}!`
})
```

:::tip
你也可以用`getValidateRouterParams`,配合Zod的类型校验实现运行时的类型安全(???)
:::
访问`localhost:3000/api/hello/nuxt`, 你就会获得`Hello Nuxt!`字符串了.  

### 对应请求方式
处理器文件(这里一般指`/api`或者`/routes`目录下)的名字可以使用前缀来对应请求方法.  
就是在文件名中添加`.get`,`.post`,`.put`,`.delete`这些来对应请求方法.  (如果要集合呢?文件夹下放4.5个同名但前缀不同的文件吗?真的只能一个文件处理一个请求吗?)
```ts
//server/api/test.get.ts
export default defineEventHandler(() => 'Test get handler')
```

```ts
//server/api/test.post.ts
export default defineEventHandler(() => 'Test post handler')
```
同样请求`/api/test`这个路径,请求方法不同,返回内容也不同:GET就返回'Test get handler',POST就返回'Test post handler'.
其它的请求方式由于没对应文件,就会返回405错误. 

**你可以在目录下用`index.[method].ts`来命名接口,同一请求路径下,处理不同的请求方式.**如果要命名空间的话这样做事很有用的.
```text
-| server/
---| api/
-----| foo/     
-------| index.get.ts      
-------| index.post.ts      
-------| index.delete.ts      
```

### 捕捉所有的路由
如果**请求路径没有对应**的处理器,那么一个捕捉所有请求的路由作为候补是很有用的.  
方法就是创建`[...].ts`这个文件,如果我的请求是`/api/foo/bar/baz`,那么:
```ts
// server/api/foo/[...].ts
export default defineEventHandler((e) => {
    //完整的请求路径 -> /api/foo/bar/baz 
    const fullPath = e.context.path;
    // 匹配不到的部分 -> bar/baz
    const unmatched = e.context.params._;  //这里有条下划线
    return `Default foo handler`
})
```

如果要获取到匹配不到的部分的名称,可以在命名的时候给它加上,这样就不用有下划线这么不明显了: `[...slug].ts`
```ts
// server/api/foo/[...slug].ts
export default defineEventHandler(e => {
   const unmatched = e.context.params.slug; 
   return `Default foo handler`; 
})
```

### 处理请求体
```ts
// server/api/submit.post.ts
export default defineEventHandler(async(e) => {
  const body = await readBody(e);
  return { body }
})
```
对应的请求就要这样:

```vue
<script setup lang='ts'>
async function submit(){
  const { body } = $fetch('/api/submit',{
    method:'post',
    body:{test:123}
  })
} 
</script>
```

::: info
`POST`请求才能把参数放在`body`请求体上,用`GET`把参数放到`body`上是不生效的(原本就不支持).如果此时还用`readBody`会报405网络错误
:::

### 处理请求参数
如果我的请求路径要是这样:`/api/query?foo=bar&baz=qux`,那么请求时就要这样:
```ts
export default defineEventHandler((e) => {
  const query = getQuery(e);
  return {a:query.bar, b:query.baz}
})
```

### 错误处理
不报错的话就会返回状态码`200 OK`.  
出错了但没有对应处理则报错`500 Internal Server Error`.  
如果出错了,想**返回其它错误状态码**,可以使用`createError()`:
```ts
// server/api/validation/[id].ts
export default defineEventHandler(e => {
  const id = parseInt(e.context.params.id) as number;
  if(!Number.isInteger(id)){
    throw createError({
      statusCode:400,
      statusMessage:'ID should be an integer'
    })
  }
  return 'All good'
})
```

### 自定义状态码
可以用`setResponseStatus`返回想要的状态码给客户端.ex
```ts
export default defineEventHandler(e => {
  setResponseStatus(e,202)
})
```

### 运行时配置(全局变量)

::: code-group

```ts [server/api/foo.ts]
export default defineEventHandler(async (e) => {
  const config = useRuntimeConfig(e);

  const repo = await fetch('https://api.github.com/repos/nuxt/nuxt',{
    headers:{
      Authorization: `token ${config.githubToken}`
    }
  });
  return repo;
})
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  runtimeConfig:{
    githubToken:''
  }
})
```

```text [.env]
NUXT_GITHUB_TOKEN='<my-super-token>'
```
:::

::: info
没看懂这里怎么用的`.env`里面的变量,自己摸索了Nuxt里使用全局变量的方法.
* `.env`文件里定义变量,例如`GLOBAL_VAR`;
* 通过`process.env.GLOBAL_VAR`访问你定义的变量
:::

### 处理请求时的Cookies
```ts{3}
// server/api/cookies.ts
export default defineEventHandler(e => {
  const cookies = parseCookies(e);
  return {
    cookies
  }
})
```

## 高级用法(难懂,尽量翻译完成整篇篇章)
### Nitro设置
你可以在`nuxt.config`文件中设置`nitro`内核的配置([可以设置哪些,看这里](https://nitro.unjs.io/config))  
::: warning
这是一个高级配置项.自定义这些配置可能会影响到生产环境部署:因为Nitro自己本身是会升级的,如果你自定义化了一些东西,然后这些东西升级了不适配了,你就可能要承担这部分更新成本了.
:::

```ts 
//nuxt.config.ts
export default defineNuxtConfig({
  nitro:{
    //...blablablah
  }
})
```

### 嵌套路由
类似express的一种用法那样,把所有的路由集中到一个文件中,利用`useBase`拼接接口地址:
```ts
// server/api/hello/[...slug].ts
import { createRouter, defineEventHandler, useBase } from 'h3';

const router = createRouter();
router.get('/test',defineEventHandler(e => 'Hello World'));

export default useBase('/api/hello',router.handler);  //这里的handler很具有迷惑性?!?
//最终的接口路径是/api/hello/test
```

### 发送流
```ts
import fs from 'node/fs';
import { sendStream } from 'h3';

export default defineEventHandler(e => {
  return sendStream(e, fs.createReadStream('/path/to/file')); // ???这是什么???我的PostPreview有救了!?!?
})
```

### 发送重定向请求
```ts
// server/api/foo.get.ts
export default defineEventHandler(async(e) => {
  await sendRedirect(e,'/path/redirect/to',302); //??? 直接有sendRedirect这种API???
})
```

### 旧处理器或中间件
跟嵌套路由那样,**像node一样使用服务器的话**,可以用这种方式定义接口/处理器/中间件:
```ts
//server/api/legacy.ts
export default fromNodeMiddleWare((req,res) => {
  res.end('Legacy handler'); // express的老朋友了
})
```

```ts
// server/middleware/legacy.ts
export default fromNodeMiddleWare((req,res,next) => {
  console.log('Legacy middleware');
  next(); //也是老朋友了
})
```

::: warning
不要在用了`async`或者返回`Promise`的中间件里使用`next()`.
:::

### 服务器存储
Nitro有一层跨平台的存储层.如果需要配置额外的存储挂载点(??storage mount point,我也不知道是什么东西),你可以使用`nitro.storage`或是其它的服务器插件:
```ts
export default defineNuxtConfig({
  nitro:{
    storage:{
      redis: {
        driver: 'redis',
        /* redis connector options */
        port: 6379, // Redis port
        host: "127.0.0.1", // Redis host
        username: "", // needs Redis >= 6
        password: "",
        db: 0, // Defaults to 0
        tls: {} // tls/ssl
      }
    }
  }
})
```

之后在你的API处理器当中这样用:
```ts
// server/api/storage/test.ts
export default defineEventHandler(async(e) => {
  const key = await useStorage('redis').getKeys();  //? useStorage是什么?
  await useStorage('redis').setItem('foo','bar');
  await useStorage('redis').removeItem('foo');

  return {}
})
```

如果你不是用Nitro提供的这层存储层,而是用额外的服务器插件存储的话,可以这样:

:::code-group 
```ts [server/plugins/storage.ts]
import redisDriver from 'unstorage/drivers/redis';

export default defineNitroPlugin(() => {
  const storage = useStorage();

   // Dynamically pass in credentials from runtime configuration, or other sources
  const driver = redisDriver({
      base: 'redis',
      host: useRuntimeConfig().redis.host,
      port: useRuntimeConfig().redis.port,
      /* other redis connector options */
    })

  // Mount driver
  storage.mount('redis', driver)
})

```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  runtimeConfig:{
    redis:{
      host:'',
      port:0,
      /* other redis connector options */
    }
  }
})
```
:::