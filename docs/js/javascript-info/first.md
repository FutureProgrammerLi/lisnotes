# Javascript.info

显而易见,是 www.javascript.info/ 的一个学习记录.  
基础的重要性我认为再怎么学都不为过.所以,看到哪记录到哪.标题也不知道我会读到哪些内容.So..

## Semicolon
```js
alert('hello')
[1,2].forEach(alert);
```
会报错,只弹窗'hello'.**建议每行代码以分号结尾,是习惯也是避免错误的一个方式.**

## `use strict`
一般用在整段脚本最开头,或是针对单个函数,函数定义开头内使用'use strict'.  
为什么要用?
* 遵循更严格的语法规则,避免一些常见的开发错误,使代码更规范和易于维护.
* 一说是ES5带来的新改变可能会导致更老的代码无法运行,需要使用严格模式开启相关功能.
* 一些举例限制是:变量必须先声明后使用;变量不可重新声明;无法运用`delete`运算符;函数内`this`默认为`undefined`而不是指向全局对象;禁止`with`语句;等等...
```js
'use strict'  // at the very top before any other code except comments.

//  or
function add(){
    'use strict'  //strict it only in the function scope.
}
```

## Variables
### var & let
> A variable is a "name storage" for data.  
> Declaration: 
```js
let message;
```
> Assignment:
```js
message = 'Hello';
```

:::info
`var` vs `let`  
跳了跳了,advanced了,在这做个[标记](https://javascript.info/var)
:::

**命名规则**:只包含字母,数字,或这两个特殊符号`$`,`_`.且不能以数字开头.  
* camelCase: words go one after another, each word except first starting with a capital letter.
* Case matters. 大小写不同,变量就完全不同.
**一些引擎自带的关键字就不要用来作为变量名称了,属于砸场子行为.**
```js
let let = 1;
let return =1; 
let function = 1;//hhhhhh都是砸场子行为
// etc..
```

### const
值不会变,也不能变的值叫常量,用`const`声明.  
一种习惯是全英文大写,`_`连接命名某些常量,用于记忆,不易拼错(difficult-to-remember values).  
(aliases for 'hard-coded' values)
```js
const COLOR_RED = "#F00";
const COLOR_GREEN = "#0F0";
const COLOR_BLUE = "#00F";
const COLOR_ORANGE = "#FF7F00";

// ...when we need to pick a color
let color = COLOR_ORANGE;
alert(color); // #FF7F00
``` 



