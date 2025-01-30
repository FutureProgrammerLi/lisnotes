# Commonjs vs ESM
> 是自己写express接口时遇到的一些很基础问题.记录一下加深了解


## 二者有什么区别? 
来自后续自行了解的一些区别:  
1. 来源不同, 语法不同;
2. 环境不同;

## 来源不同,语法不同
**Commonjs是Node.js的社区规范, 主要语句是`require()`和`module.exports`;**  
它比ESM早出现,大概在2010年,是开发者们"都同意使用"的一套规范.
是在JS语法基础上,以函数的方式实现模块引入导出的方法.

```ts
const express = require('express');
const router = express.Router();
function add(){};

// 同一个文件中导出多个内容
module.exports = router;
exports.name = 'abcd';
module.exports.add = add;
// module.exports = {
//         add,
//         name
// };
```

**ESM是JavaScript的官方标准, 主要语句是`import`和`export`;**  
是ES6的标准语法之一,即在2015年才出现.
它就是JS的语法.

```ts
import { add } from './add.js';

export default function add(){};
// export { add };
```

## 环境不同
程序执行有两种环境: 编译时和运行时.

1. Commonjs是运行时加载
2. ESM是编译时加载

ESM也可以使用`import()`函数实现动态加载.弥补ESM不能动态导入的缺陷.(利用这个方法实现运行时加载)

个人理解: 
1. `require()`和`import()`是动态导入,所以不是必须要放到文件顶部.它们都可以放到条件语句或循环语句中. `import xxx from 'xxx'`则必须放到文件顶部.
2. 同步异步性: 
    - `require()`和`import xxx from 'xxx'`是同步的;
    - `import('xxx')`是异步的;

::: tip
什么是运行时和编译时? 这是维基百科的解释:
1. [编译时](https://en.wikipedia.org/wiki/Compile_time)
2. [运行时](https://en.wikipedia.org/wiki/Execution_(computing)#Runtime)  

编译时先于运行时. 编译产生的错误会导致程序无法启动运行;而运行时产生的错误,只有在该段出错代码被执行时才会使程序崩溃.(个人愚见)  
类型校验,变量注册,代码生成及优化,都是编译时需要完成的工作(也有个别例外).
:::

## 外部参考

### 文章
[原文地址](https://blog.csdn.net/qianyin925/article/details/144442868)

|  | Commonjs | ESM |
| --- | --- | --- |
| 语法 | `require()`,`module.exports` | `import`, `export` |
| 底层 | 普通函数 | 引擎语法底层支持 | 
| 环境 | 运行时 | 编译时 |
| 缓存机制 | 有 | 有 |
| 导出数据格式 | 基本类型导出的是值的拷贝, 引用对象导出的是引用地址 | 导出的是值的引用地址(即动态绑定) |
| 全局`this`指向 | 当前模块 | 等于`undefined` (?) |
| 动态加载  | 支持 | `import xxx from 'xxx'`是静态导入, 但`import('xxx')`是动态导入 |
| 循环引用 | 通过缓存机制实现,但可能取到空值 | 编译阶段就已经确定依赖关系,且值与变量是动态绑定的,不存在循环引用问题 |  



### from chatgpt:
|  | `require()` | `import xxx from 'xxx'`  | `import('xxx')` | 
| --- | --- | --- | --- |
| 规范 | Commonjs | ESM | ESM |
| 同步性 | 同步 | 同步 | 异步(返回一个`Promise`) |
| 可用位置 | 任意处 | 只能文件顶部 | 任意处 |
| Tree-shaking | 不支持 | 支持 | 支持 |
| 加载时机 | 运行时 | 脚本初始化时 | 运行时(懒加载) |
| 返回值 | 直接导出 | 直接导出 | 返回一个`Promise` |
| 浏览器兼容性 | 原生不支持 | 原生支持 | 原生支持 |
| 性能表现 | 直接加载完整模块,相较差 | 可用tree-shaking优化 | 可用懒加载优化 | 

**选用时机**: 
- 旧老项目,或需要在较老的Nodejs版本环境中运行的代码,用`require()`;
- 新项目,需要立即加载某些模块并在文件内用到的,用`import xxx from 'xxx'`;
- 需要动态导入,懒加载,条件加载等提升性能,减少初始代码加载量时,用`import('xxx')`;
