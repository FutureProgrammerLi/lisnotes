<script setup>
    import ImageWithCaption from './components/ImageWithCaption.vue'
    import Divider from './components/Divider.vue'
</script>
# 模板方法模式
> [原文地址](https://refactoring.guru/design-patterns/template-method)

## 意图
模板方法是一种行为设计模式,它在一个超集里定义了某种算法的骨架,而其子类则可以重写该算法的具体步骤,不用改变算法的整体结构.  

![template-method.png](/refactoring/template-method/template-method.png)

## 可能遇到的问题
假如你要开发一个数据挖掘的应用,它需要分析大量的公司文档.用户会上传各种格式的文档到应用中(PD,DOC,CSV等),而软件的作用就是要从这些文档中提取有用的数据,并整合到相同的格式中.  

起初,应用可以只处理DOC格式的文档.而后,支持CSV文档.再一个月后,你"教会"了应用,会处理PDF文件了.  

<ImageWithCaption
src='/refactoring/template-method/problem.png'
caption='用于数据挖掘的类中存在了大量重复代码'
/>

应用发展起来后,你发现三个类中存在大量相似的代码.虽然说各自类里处理不同格式数据的代码是完全不同的,可是用于数据处理和分析的代码确实几乎完全相同的.有没有什么办法,消除代码重复的同时,保留算法结构呢?  

另外还有一个问题,是客户调用这些类时可能会出现的.代码中存在大量根据处理对象不同,而选择不同操作的条件代码.如果说三个处理类有一个共同的接口,或是相同的基类,我们是否就可以消除这些条件代码,利用多态来调用具体方法,具体处理我们的目标对象呢?  

## 解决办法
模板方法模式的理念是,将一种算法分解成一系列步骤,将这些步骤转换为方法,并将这些方法的调用封装到一个单独的*模板方法*中.这些步骤可以是`抽象(abstract)`的,也可以自带一些实现.而要完整使用拆解后的算法,用户额需要提供具体的子类,实现所有的抽象步骤,并在必要时重写一些可选项(但不可以重写整个模板方法自身).  

看看以上拆解放到我们数据挖掘的例子中是如何体现的吧.我们可以为三种遍历算法创建一个基类.这个类中定义了一系列文档处理的步骤,组成我们的*模板方法*.  

<ImageWithCaption
src='/refactoring/template-method/solution-en.png'
caption='算法被分解成多个步骤,这样子类就可以重写这些步骤,而不是重写实际的方法了.'
/>

开头我们可以把所有的步骤都定义为`抽象(abstract)`的,这样子类就必须提供各自实现算法的具体代码了.还好,我们的例子中已经有各自必要的实现了,我们需要做的只是调整方法的参数,以匹配超类中的方法.  

之后我们看看如何消除重复代码.看起来用于打开/关闭文件,提取/遍历数据的代码是因数据格式不同而不同的,所以我们没必要调整这部分代码.不过,像分析原数据,生成汇报等的其它步骤还是很相似的.所以这些代码可以提取到基类中,这样它的子类就可以共享这部分代码了.  

总结以上,我们将步骤的类型分为以下两种:
* *抽象步骤*, 每个子类都需要有自己的实现.
* *可选步骤*,自身已经有一些默认实现,但如果必要则可以重写.

其实还可以有另一类型步骤:*hooks,钩子步骤*.一个hook其实就是一种只有架构没有实体的一种可选步骤.模板方法中如果不重写当中的hook也是可以运作的.一般情况下,hooks会放到算法的一些关键步骤之前或之后被执行,这样子类就可以为算法提供额外的操作了.  

## 真实世界的类比
<ImageWithCaption
src='/refactoring/template-method/live-example.png'
caption='建筑结构可以为了更好的迎合用户的需求进行轻微的变化'
/>

模板方法可以体现在房屋的建设中.构建房屋的蓝图只是确保能利用它造出房子,屋主可以根据实际对房屋进行进一步的扩展.  
像建基,镶边(framing),搭墙,安装水管,接水电等的装修步骤,都可以稍微变化以达成最终的结果.  

<Divider />

## 可应用性
**当你想让用户只改变整个算法的某些特定步骤而不是整个算法时,使用模板方法模式.**  
模板方法可以让你将一个完整的算法分解成多个独立的步骤,这样子类就可以在保持超类中算法整体结构的同时,扩展其中的某些步骤了.  

**多个类中包含几乎相同的算法,各类只有略微不同时,可以考虑使用模板方法模式.这样你就不用在算法发生变化时修改这些相似的类了.**  
当你把算法转变成模板方法时,你还可以子类中相似的代码提升到超类,基类中,以减少代码的重复.而那些不相似的代码,可以由子类自行实现.

## 如何实现
1. 分析目标算法是否可以分解成多个步骤.考虑哪些步骤是子类通用的,哪些步骤又是需要各自被实现的.
2. 创建抽象基类,声明模板方法和一系列代表算法步骤的抽象方法.通过执行对应的步骤,将算法的整体结构勾勒出来.用`final`修饰一些方法,以防子类错误重写它们.  
3. 如果你发现所有的步骤都是抽象的,那其实也没什么问题.不过,一些步骤如果有自己默认的实现的话还是有些好处的.这样子类就不需自身再定义具体的实现了.
4. 考虑为算法的某些步骤添加hooks.
5. 为每个算法的变体(variation)创建具体的子类.它必须实现基类中的所有步骤,必要时重写一些可选步骤.

## 优缺点
**优点**  
* 允许用户只重写算法的某些步骤,这样就不至于动某块砖导致整栋楼塌了
* 将重复代码提取到基类中,减少代码重复  

**缺点**  
* 部分用户可能不满于只修改算法的个别步骤
* 如果通过子集实现某个默认步骤,你就可能违反了 *Liskov Substitution Principle(LSP)* 原则了
* 模板方法可能在步骤多的时候难以维护.

::: details LSP原则
LSP原则即里氏替换原则（Liskov Substitution Principle），是面向对象设计中的一项重要原则。它指出：子类应当可以替换父类并出现在父类能够出现的任何地方，而程序的行为不会受到影响。换句话说，子类对象应该能够在不改变程序正确性的前提下替换父类对象。
:::

## 与其它模式的联系
* 工厂模式是模板方法的一种实现方式.同时,*工厂方法*可以是*模板方法*中的其中一个步骤.
* *模板方法*是基于继承实现的:通过在子类中扩展,以改变算法的某些部分.而*策略模式*是基于复合实现的:通过提供相应行为的不同策略改变对象的行为.前者在类的层面上实现,所以是静态的.后者在对象层面上实现,从而在运行时选择对象的行为.

## 代码
模式辨别: 基类中有一个方法,方法里面调用了一堆其它要么抽象的,要么空的方法.

```ts [index.ts]
abstract class AbstractClass{
    public templateMethod():void{
        this.baseOperation1();
        this.requiredOperations1();
        this.baseOperation2();
        this.hook1();
        this.requiredOperations2();
        this.baseOperation3();
        this.hook2();
    }

    protected baseOperation1():void{
        console.log('AbstractClass says: I am doing the bulk of the work');
    }
    protected baseOperation2():void{
        console.log('AbstractClass says: But I let subclasses override some operations');
    }
    protected baseOperation3():void{
        console.log('AbstractClass says: But I am doing the bulk of the work anyway');
    }

    protected abstract requiredOperations1():void;
    protected abstract requiredOperations2():void;
    protected hook1():void{}
    protected hook2():void{}
}

class ConcreteClass1 extends AbstractClass{
    protected requiredOperations1():void{
        console.log('ConcreteClass1 says: Implemented Operation1');
    }
    protected requiredOperations2(): void {
        console.log('ConcreteClass1 says: Implemented Operation2');
    }
}
class ConcreteClass2 extends AbstractClass{
    protected requiredOperations1():void{
        console.log('ConcreteClass2 says: Implemented Operation1');
    }
    protected requiredOperations2(): void {
        console.log('ConcreteClass2 says: Implemented Operation2');
    }
    protected hook1(): void {
        console.log('ConcreteClass2 says: Overridden Hook1');
    }
}

function clientCode(abstractClass:AbstractClass){
    abstractClass.templateMethod();
}
console.log('Same client code can work with different subclasses:')
clientCode(new ConcreteClass1());
console.log('');

console.log('Same client code can work with different subclasses:');
clientCode(new ConcreteClass2());
```

<hr>

```txt [Output.txt]
Same client code can work with different subclasses:
AbstractClass says: I am doing the bulk of the work
ConcreteClass1 says: Implemented Operation1
AbstractClass says: But I let subclasses override some operations
ConcreteClass1 says: Implemented Operation2
AbstractClass says: But I am doing the bulk of the work anyway

Same client code can work with different subclasses:
AbstractClass says: I am doing the bulk of the work
ConcreteClass2 says: Implemented Operation1
AbstractClass says: But I let subclasses override some operations
ConcreteClass2 says: Overridden Hook1
ConcreteClass2 says: Implemented Operation2
AbstractClass says: But I am doing the bulk of the work anyway
```




