# 国际化

Next具备路由配置及内容渲染国际化的能力.这样你的网站就包括了不同地区语言内容翻译的能力及国际化的路由,从而面向更多的地区用户.  
## 术语
- 语言设置(**Locale**): 一整套语言及格式化偏好的一种标识方式.通常包括用户的语言选择及可能的地理位置获取.
    - `en-US`: 英语
    - `nl-NL`: 荷兰
    - `nl`: 荷兰,不限地区(? 我在说什么)

## 路由概况
我们建议,用户浏览器的语言偏向是什么,我们的网页应用就选用哪个语言设置(locale).如果对用户的偏向语言进行改变,则需要对应用请求头的`Accept-Language`进行修改.  
比如说你要用以下这些库,你就可以根据接收到的请求(`Request`),头部内容,应用计划支持的地区以及默认的地区,决定最终使用的地区.
```js
// middleware.js
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

let headers = { 'accept-languege':'en-US,en;q=0.5'};
let languages = new Negotiator({headers}).languages();
let locales = ['en-US','nl-NL','nl'];
let defaultLocale = 'en-US';

match(languages,locales, defaultLocale);  // ==> 'en-US'
```

路由的国际化可以通过子路径(`/fr/products`)或域(domain,`my-site.fr/products`)的划分实现.根据选择实现的方法,你就可以在中间件里为用户重定向到对应地区的页面地址了.
```js
// middleware.js
import { NextResponse } from 'next/server';
let locales = ['en-US','nl-NL','nl'];

function getLocale(request){/*...*/} // 像上面那样或用库,读取请求用户的地区

export function middleware(request){
    // 检查路径中是否具有所支持的地区
    const { pathname } = reqeust.nextUrl;
    const pathnameHasLocale = locales.some(
        locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}` 
    )
    if(pathnameHasLocale) return;

    //如果没有对应地区,则将请求重定向
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`
    // 比如请求的路径是`/products`
    // 那就将URL变为`/en-US/products`, 因为locale的值默认为`en-US`

    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher:[
        // 跳过所有内部路径 (_next)
        '/((?!_next).*)',
        // 可选,仅运行于根URL(/)
        // '/'
    ]
}

```

最后需要注意的是,记得把原本`app/`底下的所有特殊命名文件,各自放到`app/[lang]`分组内.这样Next路由才能动态地处理不同地区地路由,并将`lang`参数转发到各自的布局及页面内,像这样:
```js
// app/[lang]/page.js

// 比如现在获取到的地区是en-US
// `/en-US/products`, lang的值就会变为'en-US'

export default async function Page({params: { lang }}){
    return /*... */
}
```
根布局也可以放在新的分组目录之下(比如`app/[lang]/layout.js`)

## 本地化
根据用户语言设置或地区设置切换展示内容的功能并不限于Next框架.以下这种模式也可以实现,而且还适用于各种网页应用.  
比如我们的应用需要支持英语和荷兰语.我们的实现方式可以是维护两本不同的"词典".我们可以从"词典"中查找某些关键字对应的语言:
```json
//  dictionaries/en.json
{
    "products":{
        "cart": " Add to Cart"
    }
}
```

```json
//  dictionaries/nl.json
{
    "products":{
        "cart": "Toevoegen aan Winkelwagen"
    }
}
```

然后根据这两本"词典",创建`getDictionary`函数,加载用户请求的翻译后的内容.

```js
// app/[lang]/dictionaries.js
import 'server-only';

const dictionaries = {
    en: () => import('./dictionaries/en.json').then(module => module.default),
    nl: () => import('./dictionaries/nl.json').then(module => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()
```

获取到选择的语言后,我们就可以在布局或页面内读取对应的"词典"了.

```js
// app/[lang]/page.js

import { getDictionary } from './dictionaries';

export default async function Page({params:{lang}}){
    const dict = getDictionary(lang);  //en
    return <button>{dict.products.cart}</button>   // Add to Cart
}

```

你不用担心这些翻译文件("词典")会影响客户端应用的打包大小,因为`app/`目录下的所有布局及页面默认都是服务器组件.**这些翻译的过程只会在服务器上进行,** 用户接收到的,都是翻译过后的HTML内容.

## 静态生成
如果要为给定的语言设定,静态生成路由,我们可以在任意页面或布局内,使用`generateStaticParams`方法.而要不限局部,需要全局语言选择,就可以在根布局下这样写:
```ts
// app/[lang]/layout.ts
export async function generateStaticParams(){
    return [{lang: 'en-US'}, { lang: 'de' }]
}

export default function Root({children,params}) {
    return (
        <html lang={params.lang}>
            <body>{children}</body>
        </html>     
    )
}

```

## 更多其它相关资源

- [最少代码量i18n,路由和翻译国际化](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing)   
(是github的例子,整个项目只介绍了如何在Next内实现国际化路由)
- [next-intl](https://next-intl-docs.vercel.app/docs/next-13)
- [next-international](https://github.com/QuiiBz/next-international)
- [next-i18n-router](https://github.com/i18nexus/next-i18n-router)