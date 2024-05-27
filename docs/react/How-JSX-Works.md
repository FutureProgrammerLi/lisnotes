# How JSX works
> https://dev.to/taichim/how-jsx-works-46fi  
> 作者:Taichi Murai  
> 第一次用vsc写md文件,没有预览,跟写代码一样,有点奇怪.  
> 0:00 - 1:01

---
## JSX是什么?
`JSX(JavaScript Syntax eXtension)`是一种语法扩展(不是一种独立的语言!).它允许我们像写HTML一样,编写我们想要的Javascript代码.
它一开始是被Meta研发出来,帮助开发React应用的,不过渐渐的,可能是由于太好用了,其它前端框架也慢慢采用适应了这种语法.

## JSX的好处
* `更高的安全性` ...JSX代码会被先编译成JS,后者能够生成移除了可能产生歧义的HTML字符串,像`<`,`>`,它们能被利用生成新的元素.而由JS代码生成的HTML串,则会把尖括号用大于小于号取代,从而让代码在这种场景下更加安全(sanitization)
* `支持基于组件的代码结构` ...JSX支持基于组件的代码组织方式.这能让代码更加容易模块化及便于维护.

## JSX的缺点
* `需要使用额外工具` ...JSX代码要能被执行,需要使用特定的工具转换成JS代码才能实现.这让开发工具链上又多了一步(真会计较吗?加多个babel依赖就会有大影响吗?).而其它框架,比如Vue.js,可以直接在`<script>`写代码,直接就在浏览器环境中运行了.
* `混合带来的烦恼` ...有些开发者认为,JSX结合了HTML的语法以及JS逻辑代码,这样反而更难从需要展示的内容,跟内容需要表现的逻辑分开开来了.

## 它是如何工作的
JSX代码需要编译器.编译器就是将一些由高级语言编写的源代码,根据一定的规则转换成语法树的一种软件.这个过程包括以下几个步骤:语法分析,解析,语义分析,优化,以及生成代码(lexical analysis -> parse -> semantic analysis -> optimization -> code generation)  
而编译器解析时,又有以下三个步骤:
### 1. 标记
本质上这个过程是把一串字符串分解成一些有意义的标记.当一个标记器是有状态的,以及每个标记都包含了它父/子标记的状态,那么这个标记器就可以称为一个`lexer`(双工器?).然后这个lexer就会把一些关键词,跟一些可枚举的值一一对应,怎么对应的,则需要根据这些关键字的具体实现.  
举例来说就是,`const`变成0,`let`变成1,`function`变成2,等等等等.
### 2.语法分析
这是一个处理标记,然后把它们转换成语法树的过程.语法树是一种表现代码结构的数据结构.
```js
{
type: "Program",
body: [
    {
    type: "VariableDeclaration",
    declarations: [
        {
        type: "VariableDeclarator",
        id: {
            type: "Identifier",
            name: "a"
        },
        init: {
            type: "Literal",
            value: 1,
            raw: "1"
        }
        }
    ],
    kind: "const"
    },
    {
    type: "VariableDeclaration",
    declarations: [
        {
        type: "VariableDeclarator",
        id: {
            type: "Identifier",
            name: "b"
        },
        init: {
            type: "Literal",
            value: 2,
            raw: "2"
        }
        }
    ],
    kind: "let"
    },
    {
    type: "ExpressionStatement",
    expression: {
        type: "CallExpression",
        callee: {
        type: "Identifier",
        name: "console"
        },
        arguments: [
        {
            type: "BinaryExpression",
            left: {
            type: "Identifier",
            name: "a"
            },
            right: {
            type: "Identifier",
            name: "b"
            },
            operator: "+"
        }
        ]
    }
    }
]
}
```
### 3.代码生成
编译器通过`抽象语法树(AST,Abstract Syntax Tree)`,生成机器可运行的代码.其中包括将AST中的代码,转换成一系列可以直接由处理器执行的指令.而这些最终的指令,就可以被JS引擎执行了.  
(?所以最终执行的是处理器还是JS引擎?)

## 通过JSX扩展JS语法
为了扩展JS语法,我们需要在它被JS引擎执行前,处理好我们的新语法.
我们要做的是创建属于我们自己的lexer(stateful tokenizer and tokens about parent)和parser(语法分析器).  
它需要做到,接收并理解一段代码字符串.然后在它被转换成机器码前,把这颗语法树,先转换成原生的,不含有新语法的JS代码,这样所有JS引擎就都能执行了.而这就是Babel在Javascript生态中的作用,其它需要语法转换的还包括TypeScript,Traceur,swc等等.  
这就是为什么JSX不能直接在浏览器中运行,而需要额外一步,利用自定义的语法解析,之后再生成语法树的原因.这些代码之后会转换成原生JS代码,打包成最终可分配(distributable)的包之中.  
这叫做`transpilation`:转变,编译后的过程(transformed -> compiled).

## JSX注解(pragma)
JSX的注解,由小于号<开始,它的单独出现,在JS当中,如果不是用于比较的话,是一个无法辨认的字符.而这个注解,对于编译器来说,是完全不同的意思:它能被理解为函数的调用.
而这个由<调用的函数名字是可配置的.在React中默认是React.createElement,或是_jsxs --一种更新的处理方式.

## 总结
JSX编译过程包括标记化,语法分析,代码生成.  
标记化,就是把代码分解成标记.而这些标记则会通过语法分析,转换成语法树.最后,这颗语法树就会被转换成机器码,被JS引擎执行.(一个句号一个阶段)  
而如果我们需要利用JSX扩展JS语法,则需要构建我们自己的lexer和parser,把JSX代码转编为(transpile)原生JS代码.而这个过程需要另外的构建步骤,因为JSX是不能直接在浏览器环境所执行的.JSX注解,一般指<字符,会被转编成函数调用,具体的函数可以是React.createElement或者_jsxs.