<script setup>
    import ImageWithCaption from './components/ImageWithCaption.vue'
    import Divider from './components/Divider.vue'
</script>

# 桥接模式
> [原文地址](https://refactoringguru.cn/design-patterns/bridge)  

## 意图
桥接模式是一种结构设计模型,你可以把一个复杂的类,或是一些关系密切的类,分解为两个独立的层次结构--抽象部分和实现部分--从而独立地开发每一个部分.  

![bridge](/refactoring/bridge/bridge.png)

## 可能遇到的问题
*抽象?* *实现?* 听到就害怕?别怕,我们来想想一个简单的例子:  
假设你有一个几何图形类`Shape`,其下有多个子类:`Circle`,`Square`.你想扩展这个类,添加一些颜色,因此创建了`Red`,`Blue`这样的形状子类.可是你已经有两个子类了,你是不是要排列组合,再创建出`RedSquare`,`BlueCircle`这样的子类呢?  

<ImageWithCaption
src='/refactoring/bridge/bridge.png'
caption='图形越多,类组合是不是就要更多呢?'
/>

在层级里加上新的形状类型,新的颜色的话,类数量就会呈指数型增长.  
比如,加一个三角形类,你就要新增两个子类,每种颜色一个.之后如果又增加一种新颜色,你又要创建三个新子类,每个形状一个.实体特征越多,代码越💩.  

## 解决办法
这种问题之所以会出现,是因为需要在两种独立维度上扩展形状类:一个是形状,一个是颜色.这种情况在类继承中非常常见.  
桥接模式,通过对象组合的方式,解决类继承的问题.也就是说,你将其中一个维度提取到一个独立的类层次中,这样原本的类就可以通过这个类层次的对象引用,获得索引了,而不必在同一个类里声明所有的状态及行为.(?感觉很关键但看不懂)  

<ImageWithCaption
src='/refactoring/bridge/solution-en.png'
caption='通过将层级分为多个相关层级,以避免一个类上因扩展而导致的类爆炸'
/>

根据上面的描述,我们可以把颜色相关的代码提取到独自的子类中:`Red`和`Blue`.之后我们的形状类`Shape`中加上一个引用属性,指向我们的颜色对象.这个形状类后续就可以把任意与属性相关的操作委托给颜色对象了.  
这个引用对象就是我们所说的"桥(bridge)",连接`Shape`和`Color`两个属类.此后,新颜色的添加就不会改变形状类的层级,反之亦然.  

### 抽象与实现
GoF一书里,在桥接模式里引入了新的术语:抽象与实现(Abstraction and Implementation).依我看来,这两个术语有点太学术性了,搞得我们的模式听起来比实际实现出来更为复杂.稍微了解了我们上面的例子后,我们来剖析一下,Gof书中对这两个术语的定义:

**抽象(也叫接口Abstraction / Interface)** 是一些实体的高级控制层.层级本身不应执行任何实际操作.它应该把工作委托给**实现层(Implementation / Platform)**.    
我们这里不是简单的谈论编程语言中的"接口"或"抽象类".它们并不一样.  
在实际应用中,抽象层可由图形用户界面(GUI)所表现,实现层可以是系统底层操作代码(API),它们可被GUI层调用,以响应用户的交互.  

一般来说你可以在两个层面上扩展这个应用:
    * 拥有不同的界面(GUIs),比如专门为一般用户设计一个界面,另外又专门为管理员开发一个界面.
    * 支持不同的APIs,比如可以在Windows,Linux,macOS上分别执行本应用.  

最差的情况是,应用代码像个巨型意大利面碗一样(spaghetti bowl),各种条件语句连接着不同类型的GUI,GUI又各自调用不同的API.  

<ImageWithCaption
src='/refactoring/bridge/bridge-3-en.png'
caption='要在庞大而单一的代码库中作出细小的改变都很困难,因为你不得不清晰了解每段代码的作用.而要在规模更小,定义更规范的模块中作出改变则相对容易'
/>

你可以按特定需求,将各个接口-平台(interface-platform)代码组合提取到独立的类去.可是很快你就发现很多这样的类.类层级又呈指数增长了,因为新界面/新接口又需要不同的类组合.  
我们尝试用桥接模式解决这个问题.将我们的类分为两个层级:
* 抽象层:应用的GUI层
* 实现层: 操作系统的APIs

<ImageWithCaption
src='/refactoring/bridge/bridge-2-en.png'
caption='组织跨平台应用的一种方式'
/>

抽象对象控制应用的展示,将实际的操作委任给链接的实现对象.不同的实现对象是可以交叉使用的,只要它们的接口层是通用的话,这样相同的GUI就可以在Windows和Linux下运行了.  

<Divider />

## 可应用性
**需要将一个庞大的类分开,并以某些功能为维度进行组织的话,你可以使用桥接模式.(比如一个类配合使用不同的数据库服务器)**  
一个类越大,程序员就越难理解它是怎么运行的,要想作出改变更是难上加难.一个功能的改变可能就需要改变整个类的代码,也就可能导致bug的出现,或是其它副作用的产生.  
桥接模式可以让你把庞大而单一的类分为多个类层级.之后你就可以独立地修改每个层级里的类了.这种方式简化了后续代码维护,降低程序崩溃的可能.  

**当你需要在互相独立的维度上扩展一个类时,可以使用桥接模式.**  
桥接模式建议将独立的类层级分为多个维度.原始类将相关的操作委托给属于对应层级的对象,而不用由自己实现这些操作.  

**如果你在运行时需要切换实现层时可以利用桥接模式.**  
虽然这是可选的,不过你可以在抽象层中切换具体实现对象.这种操作跟分配值给属性一样简单.  
顺便说下,这也是为什么大部分人难以区分桥接模式和策略模式的原因.记住,模式不仅仅是组织类的特定方式.它还可以用来交换意图,解决特定问题.  

## 如何实现
1. 区分类中相互独立的维度.其中包含的独立抽象概念有: 抽象层/平台层, 域/基础结构, 前端/后端,或是接口/实现层.
2. 找出客户端需要哪些擦偶哦,将它们定义到基础抽象类中.
3. 决定接口上需要有哪些操作.在通用实现接口层中声明抽象层所需要的操作.
4. 在域中的所有平台中,创建具体的实现类.确保它们都遵循相同的接口规范.
5. 在抽象类中加上一个引用属性,指向具体的实现类.抽象层将大部分的操作分配给指向的这个实现对象.
6. 如果你有多个高层逻辑变种,通过扩展基层抽象类,创建更完善的抽象类.
7. 客户端代码需要把实现对象,传递给抽象层的constructor,以把二者连接起来.之后,客户端就可以只与抽象对象交互,而不用担心底层实现了.

## 优缺点
**优点**  
* 你可以创建与平台无关的类和应用.
* 客户端代码只需与抽象层交互,无需与实现层交互.
* 开闭原则.独立增加新的抽象或实现,互不干扰.
* 单一职责原则.你可以分别关注抽象层中的逻辑,或是实现层中的平台细节(platform details).

**缺点**  
* 可能由于高度耦合类的加入,导致整体代码的复杂度上升.

## 与其它模式的关系

* **桥接模式**一般在程序设计一开始时就要规划使用,这样你就可以独立地开发应用的每个层次了.另外,**适配器模式**则一般用于已有的应用,使某些可能不兼容的类可以协同工作.
* **桥接模式,状态模式,策略模式(以及某种程度上的适配器模式)** 在结构上比较相似.确实,它们都基于组合的原理,将任务委任到其它对象去.不过它们各自模式解决的问题各不相同.某种模式的应用并不是你组织代码唯一的途径.它们还可以用来与其他开发人员,实现沟通的效果,告知对方模式的应用解决了什么问题.  
* 你可以同时使用**抽象工厂模式和桥接模式**.当抽象层由桥接模式定义时,且需与某些特定的实现层交互时,这两种模式的组合使用效果最佳.这种情况下,抽象工厂模式可以将这些关系给封装起来,将代码复杂性隐藏起来,无需面向客户端代码.  
* 你可以结合**构建者模式与桥接模式**:"主导类"(director class)负责抽象工作,而"构建者"则负责实现工作.

## 代码示例

```ts [index.ts]
class Abstraction {
    protected implementation: Implementation;

    constructor(implementation: Implementation) {
        this.implementation = implementation;
    }

    public operation(): string {
        const result = this.implementation.operationImplementation();
        return `Abstraction: Base operation with:\n${result}`;
    }
}

class ExtendedAbstraction extends Abstraction {
    public operation(): string {
        const result = this.implementation.operationImplementation();
        return `ExtendedAbstraction: Extended operation with:\n${result}`;
    }
}

interface Implementation {
    operationImplementation(): string;
}

class ConcreteImplementationA implements Implementation {
    public operationImplementation(): string {
        return 'ConcreteImplementationA: The result in platform A.';
    }
}

class ConcreteImplementationB implements Implementation {
    public operationImplementation(): string {
        return 'ConcreteImplementationB: The result in platform B.';
    }
}

function clientCode(abstraction: Abstraction) {
    //..
    console.log(abstraction.operation());
    //..
}

const implementation = new ConcreteImplementationA();
const abstraction = new Abstraction(implementation);
clientCode(abstraction);

console.log('');

implementation = new ConcreteImplementationB();
abstraction = new ExtendedAbstraction(implementation);
clientCode(abstraction);
```

<hr>

```txt [Output.txt]
Abstraction: Base operation with:
ConcreteImplementationA: Here's the result on the platform A.

ExtendedAbstraction: Extended operation with:
ConcreteImplementationB: Here's the result on the platform B.
Read next
```

--- 

感谢你能看到这里!



