# 解释器模式
> 才发现refactoring里没有这个模式,这里就算意外,利用其它资源生成一篇文章吧.  
> 以为Iterator和Interpreter搞错了,导致前者有两个介绍的地方而后者没有.  
> 这是一篇生成文,可能没那么多口语化内容.  

## 简介
解释器模式是一种行为型设计模式，它定义了一个语言的语法，并且建立一个解释器来解释该语言中的句子。这种模式通常用于：
* 设计一个简单的语言
* 处理特定格式的文本
* 构建规则引擎
* 解析数学表达式

## 基本结构
解释器模式通常包含以下几个关键角色：
1. AbstractExpression（抽象表达式）：声明解释操作的接口
2. TerminalExpression（终结符表达式）：实现与文法中的终结符相关的解释操作
3. NonterminalExpression（非终结符表达式）：为文法中的非终结符实现解释操作
4. Context（上下文）：包含解释器之外的一些全局信息

## 代码示例

```ts
// 抽象表达式
class Expression {
    interpret(context) {
        throw new Error('必须实现interpret方法');
    }
}

// 数字表达式（终结符表达式）
class NumberExpression extends Expression {
    constructor(number) {
        super();
        this.number = number;
    }

    interpret(context) {
        return this.number;
    }
}

// 加法表达式（非终结符表达式）
class AddExpression extends Expression {
    constructor(leftExpression, rightExpression) {
        super();
        this.leftExpression = leftExpression;
        this.rightExpression = rightExpression;
    }

    interpret(context) {
        return this.leftExpression.interpret(context) + 
               this.rightExpression.interpret(context);
    }
}

// 使用示例
const context = {};
const expression = new AddExpression(
    new NumberExpression(10),
    new NumberExpression(20)
);

console.log(expression.interpret(context)); // 输出: 30
```

## 适用场景
1. 需要解析简单的语法规则
2. 需要实现一个简单的规则引擎
3. 处理数学表达式
4. 实现简单的DSL（领域特定语言）

## 优点
* 易于扩展和修改
* 易于理解和维护
* 易于实现和测试

## 缺点
* 对于复杂的语法规则，解释器模式可能会变得非常复杂
* 性能可能较低，特别是在处理大量数据时

## 更多相关资源
* [csdn blog: 设计模式-解释器模式-Interpreter Pattern](https://blog.csdn.net/wesigj/article/details/141969000)
* [GoF on Interpreter](https://www.javier8a.com/itc/bd1/articulo.pdf)(*页面跳转到263页,对应书本243页*)







