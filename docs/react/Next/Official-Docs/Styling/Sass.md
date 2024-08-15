# Sass
安装Sass包后,Next自带支持整合Sass功能,`.scss`和`.sass`后缀的样式文件都是支持的.你可以在组件层面上配合CSS模块和`.module.scss`或`.module.sass`后缀文件,使用Sass.  

首先,安装`sass`包:
```bash
$ npm install --save-dev sass
```

::: tip
[Sass本身有两种语法](https://sass-lang.com/documentation/syntax),每种语法对应的文件后缀名是不同的.文件后缀是`.scss`的话要求你使用[SCSS语法](https://sass-lang.com/documentation/syntax#scss);是`.sass`后缀,则要求使用["缩进"语法(Indented Syntax,"Sass")](https://sass-lang.com/documentation/syntax#the-indented-syntax)
:::

## 自定义Sass配置项
如果你需要自行配置Sass的编译器,那你可以使用`next.config.js`里的`sassOptions`选项:
```js
// next.config.js
const path = require('path');

module.exports = {
    sassOptions:{
        includePaths: [path.join(__dirname,'styles')],
    },
}
```

## Sass变量
Next支持由CSS模块导出的Sass变量.  
比如像下面,使用导出的`primaryColor`这个Sass变量:
```scss
// app/variables.module.scss
$primary-color: #64ff00;

:export {
    primaryColor: $primary-color
}

```

```jsx
// app/page.js
import variables from './variables.module.scss'

export default function Page() {
    return <h1 style={{ color: variables.primaryColor }}>Hello, Next.js!</h1> 
}

```