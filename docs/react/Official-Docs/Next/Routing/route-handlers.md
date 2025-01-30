# 路由处理器

路由处理器,就是使用Web [Request](https://developer.mozilla.org/docs/Web/API/Request)和[Response](https://developer.mozilla.org/docs/Web/API/Response) API,为特定的路由,创建自定义的请求处理器.(request handlers)

![api-file](imgs/route-special-file.jpg)

::: tip
路由处理器只允许存在于`app`目录下.它们跟`pages`目录下的API路由([API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes))是等价的,也就是说你不需要同时使用API处理器和路由处理器.
:::

## 使用习惯
在`app`文件夹下定义`route.js|ts`文件,就是路由处理器.
```ts
// app/api/route.ts
export const dynamic = 'force-dynamic'; // 默认是auto
export async function GET(request:Request) {}
```

当然,路由处理器也可以像`page.js`,`layout.js`文件那样,嵌套在`app`目录下.不过同一路由分块下,不能同时存在`page.js`和`route.js`.

### 可用的HTTP方法
路由处理器支持以下[HTTP方法](https://developer.mozilla.org/docs/Web/HTTP/Methods):`GET`,`POST`,`PUT`,`PATCH`,`DELETE`,`HEAD`,`OPTIONS`.如果使用了这些以外的HTTP方法,Next则会返回状态码405,表示请求方法不可用.`405 Method Not Allowed`.

### 扩展的`NextRequest`和`NextResponse` API
除了支持原生的Request和Response,Next本身扩展了这两的功能,对应的就是`NextRequest`和`NextResponse`.里面的一些扩展方法可能能给你带来一些方便.

## 行为
### 缓存
路由处理器会自动缓存那些配合使用了`Response`对象的`GET`请求.
```ts
// app/api/route.ts
export async function GET() {
    const res = await fetch('https://data.mongodb-api.com/...', {
        headers: {
        'Content-Type': 'application/json',
        'API-Key': process.env.DATA_API_KEY,
        },
  });
    const data = res.json();
    return Response.json({data})
}

```
::: tip
关于TypeScript的提示:`Response.json()`这个方法仅对高于TypeScript 5.2版本有效.对于之前版本的TS,你可以用`NextResponse.json()`取代. 
:::

### 不缓存
如果你不需要缓存功能,你可以这样:
- 对于`GET`方法,使用`Request`对象
- 采用其它的HTTP请求方法
- 使用一些动态函数,像`cookies`和`headers`这些(?[Dynamic Functions](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-functions))
- 手动通过分块设置选项,具体化(specifies)动态模式行为.

比如说:
```ts
// app/products/api/route.ts
export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
        headers: {
        'Content-Type': 'application/json',
        'API-Key': process.env.DATA_API_KEY!,
        },
    });
    const product = await res.json();
    return Response.json({product}); 
}
// ? 哪把缓存行为取消掉了?
``` 

对于`POST`请求也是相似的,路由处理器也会被动态解析(evaluated dynamically):
```ts
// app/items/route.ts

export async function POST(){
    const res = await fetch('https://data.mongodb-api.com/...', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'API_Key': process.env.DATA_API_KEY!,
        },
        body:JSON.stringify({time:new Date().toISOString()})
    })

    const data = res.json();
    return Response.json(data)
}
```
::: tip
跟API路由相似,路由处理器也可以用来处理表单提交等使用场景.我们正在创建另一种新的,跟React高度整合的,[专门处理表单及状态变化](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)的抽象.
:::

### 路由解析
你可以认为,一个`路由(route)`,就是最底层的路由单元(lowest level routing primitive???)
- 它们不会像`page`那样展示到`layout`当中,或是参与任意的客户端导航.
- `route.js`文件,不能在同一分块层级,与`page.js`共存.

| Page   | Route | 结果 |
| ---  | ---| --- |
|  `app/page.js`  |  `app/route.js`  | 冲突 |
|  `app/page.js`  |  `app/api/route.js`  | 有效 |
|  `app/[user]/page.js`  |  `app/api/route.js`  | 有效 |

不同的`route.js`或`page.js`分别处理对应路由的所有HTTP行为.

```ts
// app/page.ts
export default function Page() {
    return <h1>Hello, Next.js</h1>
}

//如果同时还有以下文件,则会产生冲突.只能二者存在一个,或是把其中一个放到另外的目录下
// app/route.ts
export async POST(request){}
```

## 使用例子
下面几个例子,将介绍一下如何将路由处理器和Next提供的API特性结合使用.

### 重新校验缓存数据
你可以用`next.revalidate`选项,重新校验缓存过的数据(revalidate).
```ts
// app/items/route.ts

export async function GET(){
    const res = await fetch('https://data.mongodb-api.com/...',{
        next:{ revalidate: 60 } // 每60秒重新校验一次
    });

    const data = await res.json();
    return Response.json(data);
}
``` 
或者直接点,用分块配置选项`revalidate`
```ts
// layout.tsx | page.tsx | route.ts
export const revalidate = 60;  // 还可以是0, false,或任意以秒为单位的数字.(默认为false)
```

### 动态函数(dynamic functions)
路由处理器可以和动态函数配合使用,像`cookies`和`headers`这些.
#### Cookies
你可以从`next/header`这个包中到入`cookies`, 用它来读取或设置请求的`cookies`.  
它既可以直接在路由处理器中直接被调用,也可以在某个函数内嵌套使用.  
或者,你可以返回一个`Response`对象,在里面配置`Set-Cookie`这个header.
```ts
// app/api/route.ts

import { cookies } from 'next/server';

export async function GET(request:Request){
    const cookieStore = cookies();
    const token = cookieStore.get('token'); // 获取token这个cookie

    return new Response('Hello,Next.js!', {
        status:200,
        headers:{
            'Set-Cookie':`token=${token.value}`,  //在请求头中设置获取到的token值
        }
    })
}
```

你还可以直接用原生的Web API来读取请求(`NextRequest`)中的cookies.
```ts
// app/api/route.ts
import { type NextRequest } from 'next/server';

export async function GET(request:NextRequest){
    const token = request.cookies.get('token');
}

```

#### Headers
你可以用从`next/headers`导入的,`headers`函数来读取请求头.它跟`cookies`函数一样,既可直接在处理器中调用,也可以在其它函数内嵌套使用.
::: tip
两个函数都是从`next/headers`这个包中导入的.
```ts
import { headers, cookies } from 'next/headers'
```
:::
从这个函数返回的请求头实例,是**只读的(read-only)**.如果要设置请求头,你需要在返回的`Response`里设置新的`headers`.

```ts
// app/api/route.ts
import { headers } from 'next/headers';

export async function GET(request:Request){
    const headersList = headers();
    const refere = headersList.get('referer');

    return new Response('Hello,Next.js!',{
        headers:{
            referer
        }
    })
}
```

你还是可以直接用底层Web API(`NextRequest`)读取请求头:
```ts
// app/api/route.ts
import { type NextRequest } from 'next/server'

export async GET(request: NextRequest){
    const requestHeaders = new Headers(request.headers);
}
```

### 重定向
```ts
// app/api/route.ts

import { redirect } from 'next/navigation'

export async function GET(request:Request){
    redirect('https://nextjs.org')
}
```

### 动态路由分块
::: tip
我们建议您先阅读[这个页面](https://nextjs.org/docs/app/building-your-application/routing/defining-routes),再继续进行下面的阅读.
:::

路由处理器可以根据动态数据创建动态分块,并创建对应的请求处理器.
```ts
// app/items/[slug]/route.ts
export async GET(
    request:Request,
    { params }: {params: { slug: string}}
){
    const slug = params.slug; // 'a','b','c'等等slug的内容
}

```
| 路由路径   | 可能的URL | 解析出来的参数值`param` |
| ---  | ---|  --- |
| `app/items/[slug]/route.ts   |  `/items/a` | `{slug: 'a'}` |
| `app/items/[slug]/route.ts   |  `/items/b` | `{slug: 'b'}` |
| `app/items/[slug]/route.ts   |  `/items/c` | `{slug: 'c'}` |

### URL查询参数
路由处理器接收的参数,是一个`NextRequest`实例,这个实例中[包含了许多便利的方法](https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl),其中就包括请求查询参数的处理:
```ts
// app/api/search/route.ts
import { type NextRequest } from 'next/server';

export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    //如果请求路径是`/api/search?query=hello`的话, query的值会是hello.
}
```

### 流(Streaming)
流很多情况下会结合大型语言模型使用(Large Language Models,LLMs),用以传输AI生成内容,比如Open AI.  
[更多关于AI SDK的内容可以看这.](https://sdk.vercel.ai/docs)

```ts
// app/api/chat/route.ts
import OpenAI from 'oopenai'
import { OpenAIStream, StremingTextResponse } from 'ai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req:Request){
    const { messages } = req.json();
    const response = await openai.chat.completions.create({
        model:'gpt-3.5-turbo',
        stream: true,
        messages,
    });
    const stream = OpenAIStream(response);

    return new StremingTextResponse(stream);

}
```
这些创建流的API,底层其实还是Web API.你也可以直接用底层API,而不用这一层的抽象.

```ts
// app/api/route.ts

// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
 
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}
 
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
 
const encoder = new TextEncoder()
 
async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}
 
export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)
 
  return new Response(stream)
}
```

### 请求体
你可以用标准的Web API方式,读取`Request`对象的请求体:
```ts
// app/items/route.ts
export async function POST(req:Request){
    const res = await req.json();
    return Response.json({res})
}
```

### 请求体中的FormData
你可以用`request.formData()`这个方法来读取请求体中的`FormData`.
```ts
// app/items/route.ts
export async POST(request:Request){
    const formData = request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    return Response.json({name, email})
}
```

### CORS
你可以用标准Web方法,为特定的路由处理器设置CORS请求头.
```ts
// app/api/route.ts
export const dynamic = 'force-dynamic'; //默认值是'auto'

export async function GET(request: Request){
    return new Response('Hello, Next.js!',{
        status:200,
        headers:{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}
```

::: tip
- 如果你需要为多个路由处理器添加CORS请求头,你可以改用[中间件](https://nextjs.org/docs/app/building-your-application/routing/middleware#cors),或是[在`next.config.js`文件](https://nextjs.org/docs/app/api-reference/next-config-js/headers#cors)中进行设置.
- 更直接实现CORS的方法,那就用[专门的包](https://github.com/vercel/examples/blob/main/edge-functions/cors/lib/cors.ts).(链接是github的一个代码例子,不是包的地址)
:::

### Webhooks
(是没听过的东西,就不解释Webhooks这个单词了)  
你可以用路由处理器来接收来自第三方的webhooks.
```ts
// app/api/route.ts

export async function POST(request: Request){
    try {
        const text = await request.text();
        // 在这里使用webhook
    } catch (error) {
        return new Reponse(`Webhook Error:${error.message}`,{
            status:400
        })        
    }
    return new Response('Success',{
        status:200
    });
}
```
值得注意的是,你并不需要像页面路由中的API Routes那样,使用`bodyParser`才能添加一些其它的配置.(直接读取就可以了)

### Edge和Node环境下的路由处理器
在Edge和Node这些不同的运行时环境下,路由处理器提供的WebAPI是相同的,其中也包括流的操作也是一样的.  
由于路由处理器跟页面和布局文件一样,用的相同[路由分块配置](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config),它们因此也支持长时间等待的特性(long-awaited features),像一般用途的静态重启路由处理器(general-purpose statically regenerated Route Handlers)等.  
你可以直接指明需要的运行时环境:
```ts
export const runtime = 'edge'  // 默认值是'nodejs'
```

### 无关界面的响应
你可以用路由处理器返回一些跟UI无关的内容.像`sitemap.xml`,`robots.txt`,`app icons`,以及`open graph图像`这些都会内部支持.
```ts
// app/rss.xml/route.ts
export const dynamic = 'force-dynamic';

export async function GET(){
      return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
 
<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>
 
</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}

```

### 分块配置选项
路由处理器的配置项,跟页面和布局是一样的,你可以看看这里:[路由分块可配置项](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
```ts
// app/items/route.ts
// 以下都是默认值
export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = 'auto';
export const runtime = 'nodejs';
export const preferredRegion = 'auto'

```

## 接下来
* [更多关于`route.js`文件内容](https://nextjs.org/docs/app/api-reference/file-conventions/route)