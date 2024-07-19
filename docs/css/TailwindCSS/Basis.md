# 基础
> 安装这个我也没资格去总结,毕竟这个项目虽然用了,也只是用的cdn(根据官方文档来都搞不定,隔壁Nuxt项目直接用DevTool给加上了)  
> 这篇基础主要是掘金一位作者的文章个人总结,感觉能比个人直接看文档稍微系统一点.感谢.  
> https://juejin.cn/user/2154698521972423/posts  
> 标题:听说你还不会TailwindCSS  
> 作者:菠萝的蜜

好了,学到的终于用到了.可以收回开头第一句,Tailwind CDN转用官方配置了.  
[是在`Stackoverflow`上找到的答案,Vitepress里怎么配置TailwindCSS. ](https://stackoverflow.com/questions/77638671/tailwindcss-in-vitepress)  
Tailwind有针对Vite使用方法,没针对VitePress的..  

## 安装
1. 基本安装
```bash
$ npm install -D tailwindcss postcss autoprefixer
$ npx tailwindcss init -p # 生成具有一定内容的配置文件tailwindcss / postcss
```
2. 修改/添加样式适用范围:
```js
// tailwind.config.js
module.exports = {  //export default{}
    content:[
        './docs/**/*.{md,js,vue,ts}', //这里针对Vitepress
    //      "./index.html",           
    // "./src/**/*.{vue,js,ts,jsx,tsx}", //这两行针对一般Vite创建的Vue项目
    ]
}
```

3. **自己找的,官网也没找到的内容:**
* 在`docs/.vitepress/`下创建`theme`文件夹.  
* 创建CSS文件,用于放指令.
```CSS
/* docs/.vitepress/theme/custom.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer components {
    .btn-primary {
        @apply py-2 px-5 bg-violet-500 text-white font-semibold rounded-full shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-400 focus:ring-opacity-75;
    }
}
```
* 创建`index.ts`文件,用于引入样式
```ts
/* docs/.vitepress/theme/index.ts */
import DefaultTheme from 'vitepress/theme'
import './custom.css'
export default DefaultTheme
```

然后就可以用了.  
<p class='text-xs text-blue-300 font-bold'>根本不知道这个theme文件夹,也不知道这个`DefaultTheme`又是什么.更不知道项目的入口还要自己创建.</p>

开始时以为没正确配置,一直捣鼓`tailwind.config.js`的`content`,结果解决方法跟这个文件关系不大.

4. 如果是一般Vite项目,把`src/style.css`的内容改为`tailwind`指令就可以了.这个`style.css`会在`src/main.js`中被引入.(如果你没手动删除掉的话)
```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```js
// src/main.js
import './style.css'
```

## CSS知识
没错,用框架学原生.

### box-sizing
| Class | Properties|
| ---   | ---       |
| box-border | box-sizing: border-box;|
| box-content | box-sizing: border-content | 

**`border-box`:盒子的宽度和高度,包括`border`和`padding`的宽度.**  
**`border-content`:不包括盒子的`border`和`padding`,给的宽高只是内容的宽高,一般实质盒子的宽高大于这个数.**  

### display
| Class   | Properties |
| ---  | ---|
| block   | display:block; |
|  inline-block |  display:inline-block  |
|  inline |  display:inline;  |
|  flex | display:flex;   |
|  inline-flex |  display:inline-flex;  |
|  table |  display:table; |
|  inline-table |  display:inline-table;  |
|  grid  | display:grid;   |
|  hidden |  display:none;  |

* 块级对象元素单独占行,多个block元素为各自新奇一行,并可设置width和height
* 内联对象元素前后不会产生换行,多个inline元素都在一行内显示,直到该行排满,不可设置width和height
* 既有宽高,又可同行显示,则为`inline-block`.*之后的内联对象元素会被排列在同一行内.*

### Objection position
可视范围超出图片大小时,将可看到的内容聚焦到特定方位上.
`object-*`: `left-top`,`top`,`right-top`,`left`,`center`,`right`,`left-bottom`,`bottom`,`right-bottom`.

### Overflow
溢出内容后的内容要怎么显示.  
`overflow-*`:`auto`,`visible`,`hidden`,`scroll`,`clip`.(可以加xy轴限制特定方向,比如`x-scroll`,横向滑行条可拉动)

* 默认`visible`.
* `overflow:scroll`,总是显示滚动条.
* `overflow:auto`是什么意思? 根据内容多少决定它的值?除了变`scroll`还有什么情况?
* `overflow:clip`,对溢出的内容进行裁剪,配合`overflow-clip-margin`.否则与`hidden`行为相似.

### Position

| Class   | Properties |
| ---  | ---|
| static   | position:static; |
|  fixed |  position:fixed;  |
|  absolute |  position:absolute;  |
|  relative |  position:relative;   |
|  sticky |  position:sticky;  |