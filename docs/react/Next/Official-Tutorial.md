# 自己官方教程的学习过程

> https://nextjs.org/learn/dashboard-app  
> 目前看了前两章,比较有趣.是通过项目学习的过程.仅以此记录自己的学习过程.  
> (github阿github为什么总出错,push自己的项目时出错,clone官方例子的时候又出错.重复执行你给我不同的结果?有时成功有时不成功?)  

<!-- ## Phase1  -->
* File Structure
* Styling and static assets
* Route: layouts and pages / navigation
* Data: database / fetching data


## App file structure
官方的例子给我们介绍了,用Next构建应用时的文件目录可以如何组织,把哪些内容放到哪些文件夹内.可以参考.  
*  `/app`: **路由,组件,逻辑文件.** 是大部分编写代码的地方,可以看做Vite的src目录
*  `app/lib`: libraries,一般把一些工具类的东西放这里,像**工具函数,可重用逻辑,数据获取**等等实用类内容.
*  `/app/ui`: UserInterface, **组件**放这,类似`/src/components/`,一般global reusable建议放这,不然我觉得还是按local reuseable components那样,仅放在那个路由使用到的文件夹中更好,可重用性比较低的组件不太需要放在这.官方举例的是`cards,tables,forms`这些重用性可能比较高的组件.
* `/public`: **静态资源**放这,像图片这些.
* `/scripts`: **操作数据库相关的文件**.例子中都是sql相关的JS函数.(用JS操作SQL,类似express里的app.js)
* **配置文件**: 顾名思义,有`.config`后缀的文件.例子中包括了两个在最外层:`next.config.ts`和`tailwind.config.ts`,对应的next本身和tailwindcss.  

## Placeholder for data
不是每次操作都要直接跟数据库交互的,这样很麻烦且很浪费时间.  
所以开发时还是建议*mock*,用模拟器,或本地假数据,先本地走通流程.  
在官方这个例子里,本地假数据放在了`/app/lib/placehoder-data.js`.
```js
const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  // ...
];
```

`/app/lib`里面还有个`definition.ts`,用来定义你需要的数据类型,避免把错误类型的数据传给组件,或是从数据库接收到,不一样类型的数据.(很有必要,**是双向的避免错误**,如果要额外处理,另说.)  
或许不用手动定义,可以用`Prisma`根据数据库的Schema生成数据类型.
```ts
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};
```

## Styling
* TailwindCSS
* CSS-modules
* Others like clsx, Sass, styled-jsx,styled-components, emotion.


### TailwindCSS
Next目录结构中,`/app/ui`下有个`global.css`的文件,里面包含了tailwind的那三条@tailwind指令以及一些CSS.  
**要在`/app/layout`里`import '@/app/ui/global.css;'`,你才能用到tailwindCSS的内容**  
是否相当于Vite config里的content?这里就是整个应用的入口?是否还有其它入口可配置项?
_`/app/layout`是整个项目的root layout._

### CSS-modules
用`create-next-app`创建项目时会问你需不需要tailwindcss,所以可以说是默认项了.  
更默认的,直接没问你是不是用,用就是支持,**CSS-modules**.(甚至找到[怎么才能禁用它的](https://zhuanlan.zhihu.com/p/405198686))23333  
要用CSS-modules,三步:
* 另外建立xxx.module.css文件,在里面编写自己的样式(建议还是抽离出来比较好)
* 在需要的页面`import styles from '@/app/ui/xxx.module.css;'
* 在元素上添加类:`<div className={styles.xxx}>`

### clsx & others
额外说的clsx,用于根据条件切换样式,个人感觉为了方便,有没必要额外引库看实际.
```jsx
import clsx from 'clsx';
<span className={clsx(
    'inline-flex items-center rounded-full px-2 py-1 text-sm',
    {
        'bg-gray-100 text-gray-500': status === 'pending',
        'bg-green-500 text-white':status === 'paid',
    }
)}>...</span>
```

大概能看出来,根据status的值,适用`bg-gray-100 text-gray-500`或者`bg-green-500 text-white`这两个类.

<!-- Phase 2 -->

### Fonts and Images
* 怎么全局改字体?  
* 图片为什么要用`<Image/>`组件,而不是本身的<image/>就可以了?它为我们做了什么?  
> 怎么全局改字体?  

1. 在`/app/ui`下面创建个font.tsx文件,在里面导出你想用的字体.
```tsx
import { Inter } from 'next/font/google'; //是google库里的一种字体,直接导就行,不用安装

export const inter = Inter({ subsets: 'latin' });   //这里的subsets是必须的,是fallback.Inter应用不了就用latin.
// 其它字体可能还会有其它额外的必须配置,比如secondaryFonts例子的Lusitana,除了subsets还要weight,值还限定'400'| '700',还限定是字符串.(???)
```
2. 在全局的layout里面,你猜猜是哪个文件,应用到那个入口文件里.(答案在下面)
* hint: 跟刚开始使用tailwindcss时相同,你曾经在这导入过全局样式.
```tsx
import {inter} from '@/app/ui/fonts';
//...
<html>
  <body className={`${inter.className} antialiased`}>{children}</body> 
  {/* 这里的antialiased不是必要的 */}
</html>
```
**答案揭晓:这个全局入口是`/app/layout.tsx`**  

> 图片为什么要用`<Image/>`组件,而不是本身的`<image/>`就可以了?它为我们做了什么? 

四个原因:
* 防止图片死板不响应
* 可以设置根据不同设备显示不同大小,(?image不也可以)
* 防止加载图片时导致布局发生变化
* **自带懒加载**(算是我唯一一个记得住的好处了)

> 怎么用?
```tsx
import Image from 'next/image';

<Image src={} alt={} weight={} height={}  className="hidden md:block" />
//src和alt是必须填的,其它根据需要设置
```

## Layout & Pages / Routing

基于文件系统的路由应该不用多介绍了.  
简单说就是:文件名就是路径名,文件夹嵌套就是路径嵌套.  
**page.tsx** 就是 当前路径下要显示的东西.  
```text
app
├─ dashboard
│  ├─ page.tsx
│  └─ layout.tsx
├─ page.tsx
└─ layout.tsx
```

这里就解释了:为什么在`app/layout.tsx`里引入`global.css`以及`Inter font`,因为它们就是**整个应用的入口**.(Page是真正的入口,但layout包括了page)

你猜上面的目录结构,url要样才能访问到`/app/dashboard/page.tsx`?很容易吧.`localhost:3000/dashboard`  
***
知道文件怎么组织之后,就要学怎么在这些页面中跳转了.
> 1. `<Link/>`和原生的`<a>`有什么区别?为什么要用它给的?  

区别就是**后者原生会整个页面刷新,前者只会刷新部分路由**.(without seeing a full refresh)  
这是肉眼可见的,底层实现是因为Link实现了`Code Spliting`,每个路由下的页面都是独立分开的,要更新也只是更新了对应部分的page.  
而且,`<Link/>` 还会在该组件出现到用户浏览器视口时,自动在后台预获取目标路由的代码,这样就提升了路由跳转的效率了.
* 防止整面刷新,实现局部更新;
* code spliting实现的,预获取目标路由代码,提高页面跳转效率;
> 2. `<NavLink/>`有什么用? 怎么用?

**配合`usePathname()`,实现用户当前所在路由的提示.(提示用户当前在哪个路由页面,"高亮");**
::: warning
由于这两个的使用,是在客户端发生的.工作过程中需要获取客户端当前URL才能实现,因此,要添加`'use client'`在当前组件最开头.
:::

```tsx{1}
'use client'
import {usePathname} from 'next/navigation';

export default function NavLinks(){
  const pathname = usePathname();
  //...
}
```

之后,可以使用之前的`clsx`,根据当前路由进行样式匹配. `pathname === link.href`
```tsx{9}
import clsx from 'clsx';
//...
 <Link
  key={link.name}
  href={link.href}
  className={clsx(
     'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 texfont-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start mdmd:px-3',
    {
      'bg-sky-100 text-blue-600': pathname === link.href,
    },
  )}
          >
```

## Data (Fetching and Populate)
抽象起来了,要部署了,用起数据库了;给的东西太多,自己的东西少起来了.  
用的Vercel部署和Postgres数据库.  
用Vercel部署就不多说了,注册,链接github,deploy.  
用的Postgres数据库也不说了,甚至它都帮你把数据都填好到数据库里面了.  
怎么填的数据库,用了`scripts/seed.js`里的,多一条命令,在package.json里的scripts加上就能执行了,具体干了什么我也看不懂.
```json{3}
//package.json
"scripts":{
  // ...
  "seed": "node -r dotenv/config ./scripts/seed.js"
}
```

```bash
npm run seed
```

***
**获取数据的几种方法**:
* _API层:_ 第三方服务提供的API;给客户端用的,由服务器端提供的接口.Next.js里,你可以用[Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers). (就是自带的路由切换时的方法,GET/POST/DELETE等等这些)
* _数据库查询:_ API层逻辑不够写,把操作扔给数据库自身,搞定了再给我返回来我想要的.
* _服务器端组件:_ 直接在写组件的时候就用`async await`语法来fetch,就不用再费劲嵌套到`useEffect`里或者用其它的获取数据的库了.
* _SQL查询:_ 用`import sql from '@vercel/postgres';`这个函数,你甚至可以直接在js文件里写SQL语句,直接把数据库操作完获得的数据返回给需要的地方.`app/lib/data.ts`里就全是这种操作.

例子中用了两种查询方式,是服务器端组件和SQL查询.  
用`async await`的服务器端组件获取数据时就会出现**request waterfall**请求瀑布的问题.
```jsx
//app/lib/data.ts
export async function fetchRevenue() {
  try {
    const data = await sql<Revenue>`SELECT * FROM revenue`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

//app/dashboard/page.tsx
export default async function Page(){ 
const revenue = await fetchRevenue();
const latestInvoices = await fetchLatestInvoices(); // 这要等fetchRevenue()
const cardData = await fetchCardData(); // 这要等fetchLatestInvoices()
//...
}
```
好处是可以解决数据依赖的问题,比如获取到id才能获取密码.  
坏处是如果数据各不相关,网络效率就会很低.  
解决办法之一是利用JS原生的`Promise.all()`或者`Promise.allSettled()`.  
这时就又有问题了,如果有一个请求特别特别慢呢?