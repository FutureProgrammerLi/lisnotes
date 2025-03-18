# 设计模式的分类
> 是Javascript设计模式的种类合集, 这篇FCC的文章介绍了一部分,也告知了模式的缘由.  
> 本文先总结前文未包括的,后续方便对前文进行补充.  
> 以下来自[GoF](http://www.javier8a.com/itc/bd1/articulo.pdf)一书.属于设计模式的一本"圣经"了.  
> 共23种, 前文介绍了12种.  
> Done 5+适配/装饰/外观/代理 4 + 责任链/迭代器/观察者 3 =12  
> 参考:https://refactoring.guru/design-patterns/catalog

## 分类
1 for brief and 2 for in-depth, 0 for left
* [Creational Patterns](./A-For-Start#创建型模式)
    * [Abstract Factory抽象工厂模式](./A-For-Start#抽象工厂模式)√  1
    * [Builder构造者模式](./A-For-Start#构造者模式)√ 1
    * [Factory Method工厂方法模式](./A-For-Start#工厂模式)√  1
    * [Prototype原型模式](./A-For-Start#原型模式)√ 1
    * [Singleton单例模式](./A-For-Start#单例模式)√ 1
* Structural Patterns
    * [Adapter适配器模式](./A-For-Start#适配器模式)√ 1
    * [Bridge桥接模式](Bridge) 2
    * [Composite组合模式](Composite) 2
    * [Decorator装饰器模式](./A-For-Start#装饰器模式)√ 1
    * [Facade外观模式](./A-For-Start#外观模式)√ 1
    * [Flyweight享元模式](Flyweight) √ 2
    * [Proxy代理模式](./A-For-Start#代理模式) √ 1 

* Behavioral Patterns
    * [Chain of Responsibility责任链模式](./A-For-Start#责任链模式)√ 1
    * [Command命令模式](Command) √ 2
    * Interpreter解释器模式]() 0
    * [Iterator迭代器模式](./A-For-Start#迭代器模式)√ 1
    * [Mediator中介者模式](Mediator) √ 2
    * [Memento备忘录模式](Memento) √ 2
    * [Observer观察者模式](./A-For-Start#观察者模式)√ 1
    * State状态模式]() 0
    * [Strategy策略模式](Strategy) √ 2
    * [Template Method模板方法模式](Template-Method) √ 2
    * [Visitor访问者模式](Visitor) √ 2

Todo:
1. Flyweight √
2. Command √
3. Mediator √
4. Strategy √
5. Template Method √
6. Visitor √
7. Memento √
8. Bridge √
9. Composite √

left:
1. Interpreter
2. State

## 简单介绍
[Brief Introduction](./A-For-Start) * 同一篇文章里简要介绍多个模式
* [<b>创建型模式</b>](./A-For-Start#创建型模式)
    * [单例模式](./A-For-Start#单例模式)
    * [工厂模式](./A-For-Start#工厂模式)
    * [抽象工厂模式](./A-For-Start#抽象工厂模式)
    * [构造者模式](./A-For-Start#构造者模式)
    * [原型模式](./A-For-Start#原型模式)

* [<b>结构型模式</b>](./A-For-Start#结构型模式)
    * [适配器模式](./A-For-Start#适配器模式)
    * [装饰器模式](./A-For-Start#装饰器模式)
    * [外观模式](./A-For-Start#外观模式)
    * [代理模式](./A-For-Start#代理模式)
* [<b>行为型模式</b>](./A-For-Start#行为型模式)
    * [责任链模式](./A-For-Start#责任链模式)
    * [迭代器模式](./A-For-Start#迭代器模式)
    * [观察者模式](./A-For-Start#观察者模式)

## 完整介绍
**In-depth patterns(每一个模式都是一篇文章)**

* [Bridge桥接模式](./Patterns/Bridge)
* [Composite组合模式](./Patterns/Composite)
* [Flyweight享元模式](./Patterns/Flyweight)

* [Command命令模式](./Patterns/Command)
* [Mediator中介者模式](./Patterns/Mediator)
* [Memento备忘录模式](./Patterns/Memento)
* [Strategy策略模式](./Patterns/Strategy)
* [Template-Method模板方法模式](./Patterns/Template-Method)
* [Visitor访问者模式](./Patterns/Visitor)










