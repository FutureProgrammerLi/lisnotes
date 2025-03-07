<script setup>
    import ImageWithCaption from './components/ImageWithCaption.vue'
    import Divider from './components/Divider.vue'
</script>

# 访问者模式
> [原文地址](https://refactoring.guru/design-patterns/visitor)

## 意图
访问者模式是一种行为设计模式,你可以把算法从实际运行的对象中分离出来.  

![vistor](/refactoring/visitor/visitor.png)

## 可能遇到的问题
假设你的团队开发了一个应用,是基于一行巨型图的相关地理信息.图的每个节点代表着一个像城市这样的实体,它还可以代表像某个行业,某个观光景点等的意义.如果实体之间是可以互通的话,那这些节点就会被连接(connected)起来.每个节点底层都由其自身类所代表,每个具体节点实际上就是一个对象.  

<ImageWithCaption
src='/refactoring/visitor/problem1.png'
caption='将图信息导出到XML'
/>

这时,你接到任务,要把图信息导出到XML格式.刚开始可能还没那么难实现.你打算直接为每个节点类添加一个导出方法,递归遍历图里的每个节点,在每个节点上都执行这个导出方法.这种方法又简单又优雅:由于多态的特性,你不会把导出的方法跟具体的节点类给耦合到一起.  

可现在问题是,从宏观上看,整体代码架构并不允许你这样做,你不可以修改已有的节点类.应用已经在生产环境运行了,你不可以有一点bug,导致整个应用崩溃.  

<ImageWithCaption
src='/refactoring/visitor/problem2-en.png'
caption='导出方法不得不添加到每个节点类中,但这样就可能导致某个细小bug,将整个应用给毁掉'
/>

此外,团队方质疑,将XML导出的代码放到节点类中是否合理,因为这些类的主要职责其实是处理地理信息,如果把导出方法放到里面去反而会显得格格不入.  
还有一个问题就是,尽管这样可以暂时解决问题,但如果销售部要让你把数据导出成别的格式的话,或干点别的事情的话,你又要怎么处理呢?你是不是又要直接修改你那脆弱无比的节点类代码呢?

## 解决方法
访问者模式就是用来解决这个问题的.你可以把新的行为定义到一个独立类中,而不是直接整合到已有类去,我们把这个新的类称为"访问者(visitor)".这样,要进行新操作的对象就可以作为参数,传递给我们的访问者方法中,这样对象就既可以实现新操作,也可以保留,操作自身的数据了.  
那当新的行为可以在不同类的对象上执行时又会怎样呢?比如我们上面的XML导出方法,实际运行到各种类节点时可能有些许不同.因此访问者类中可能就要定义不止一个方法,而时要一系列方法,每个方法接收不同的节点类型或参数,像这样:
```cpp
class ExportVisitor implements Vistor is
    method doForCity(City c){...}
    method doForIndustry(Industry f){...}
    method doForSightseeing(Sightseeing ss) {...}
    //...
```

可是我们要定义多少不同方法才能详细解决问题呢? 何况它要处理的是一整张图的节点?  
这些方法的参数是不同的,我们不能简单利用多态.要为传递进来的对象选择一个正确的访问者方法的话,我们要校验它的类.听着就很难实现对吧?
```cpp
foreach (Node node in graph)
    if (node instanceof City)
        exportVisitor.doForCity((City) node);
    if (node instanceof Industry)
        exportVisitor.doForIndustry((Industry) node);
    //...
```
你可能会疑问,为什么不用方法重载呢?它难道不就是用相同的方法名,接收不同参数以进行不同操作的吗?  
很遗憾地说,尽管假设我们使用的编程语言支持重载(比如Java和C#),它还是解决不了我们的问题.因为我们无法提前知道节点对象对应的类到底是哪个,重载机制无法决定要执行哪个方法.它只能默认执行基类`Node`对应对象的方法.  

访问者模式解决的就是这类问题.它利用了一种叫"二次分配(double dispatch)"的技术,不借助复杂条件语句的前提下,将正确的方法应用到我们的对象中.与其让用户选择调用哪个方法,不如直接将这个过程分配到对象本身去,把它作为参数传到我们的访问者方法去.  
对象本身当然知道它是由哪个类实例化来的,它们自然也就知道应该采取哪个类所对应的方法了.它们"接收"一个访客,告知它自己要执行哪个方法.  

```csharp
// Client code
foreach (Node node in graph)
    node.accept(exportVisitor);

// City
class City is
    method accept(Visitor v) is
        v.doForCity(this);

// Industry
class Industry is
    method accept(Visitor v) is
        v.doForIndustry(this);
    //...
```

好吧我们还是要改节点类.不过这种细小的改变还是可接受的,如果后续还要增加新功能的话起码也不用改太多了.  
如果我们现在为所有的访问者提取出一个通用接口,那我们的节点就可以接收任意的,新的访问者了.如果你要实现新的,需要运行到节点上的操作的话,你只需要编写新的访问者类就够了.  

## 真实世界的类比
<ImageWithCaption
src='/refactoring/visitor/visitor-comic-1.png'
caption='好的保险代理,总能为不同的组织提供不同的政策'
/>

想象一下,一个经验丰富的保险代理正招揽用户.他可以直接拜访各个楼层,向每个他见到的人都推销他的产品.而根据每个楼层的类型不同,他又可以为其提供专门化的保险政策推荐(原文是organization,我直接译成一栋楼里的不同部门似乎更容易理解)
* 如果一层是负责管理的,那他可以推销医疗保险
* 如果是银行相关的部门,他可以推销防盗政策
* 如果是咖啡店,他可以推销防火防水政策(?)

<Divider />

## 可应用性
**需要将某个操作运行到一个复杂对象结构上的所有元素的话,你可以考虑使用访问者模式.**  
通过实现了相同操作不同变体的访问者对象,你可以将一个操作运作到一系列由不同类实例化出来的对象,对应关系交由访问者对象来处理.  

**清理辅助行为的业务逻辑**  
这种模式可以让你应用的主类专注于其核心业务逻辑,将所有其它行为提取到一系列访问者类中去就可以了.  

**某个行为只在类层级上的某些类上有效,而在其它层级上无效时,可以考虑使用这种模式.**  
将行为提取到独立的访问者类,只在接收到想要的类实例化的对象时才实现访问者方法,而不想管的类对象传入时就不执行任何操作.  

## 如何实现
1. 声明访问者接口,内部定义一系列"访问者方法",每个方法对应程序中每个具体的元素类.
2. 声明元素接口.如果你已经有具体的元素类层级了,那就把抽象的,"接收"函数,添加到类顶层中.这个方法应该接收一个访问者对象作为参数.
3. 定义"接收函数"对应每个具体元素的具体执行内容.这些函数必须直接重定向,将访问者对象上的访问者方法,对应到具体的元素类去.
4. 元素类仅可通过访问者接口,与访问者工作.而访问者本身必须知晓所有的具体元素类,以参数类型形式传递给访问者方法.
5. 如果行为无法在元素层级上实现的话,你可以创建新的访问者类,并在内部实现所有的访问者方法  
有时访问者需要读取元素类中的私有成员变量,此时你需要将它们变成公共的,哪怕拆解了元素的封装;或者,你要把访问者类嵌套到元素类中.后面这种方法是否可行,取决于你使用的编程语言是否支持嵌套类.
6. 用户必须创建访问者对象,并通过"接收函数",传递到元素中.  

## 优缺点
**优点:**  
* 开闭原则.不改变类前提下,为不同类的对象添加新的操作
* 单一职责原则.你可以把相同行为的多个实现版本封装到一个类当中.
* 访问者对象可以在工作时收集多个对象的信息.这个特性可能在你需要遍历复杂对象结构,并将访问者方法应用到每个对象时很有用.

**缺点:**  
* 某个类从元素层级上被新增或移除时,你可能需要更新所有的访问者对象
* 访问者对象可能缺乏访问私有变量或方法的能力,读不到数据或方法自然就崩溃了.

## 与其它模式的关系
* 你可以认为访问者模式是更"强力的"命令模式.访问者对象可以在不同类对象上都执行操作
* 你可以利用访问者模式,在一整棵"复合树"上执行操作.
* 结合访问者模式和迭代模式,遍历复杂的数据结构,操作之上的一些元素,哪怕这些元素的类并不相同.

## 代码
```ts [index.ts]
interface Component{
    accept(visitor: Visitor):void;
}

class ConcreteComponentA implements Component{
    public accept(visitor: Visitor):void{
        visitor.visitConcreteComponentA(this);
    }
    public exclusiveMethodOfConcreteComponentA():string{
        return 'A'
    }
}

class ConcreteComponentB implements Component{
    public accept(visitor: Visitor):void{
        visitor.visitConcreteComponentB(this);
    }
    public specialMethodOfConcreteComponentB():string{
        return 'B'
    }
}

interface Visitor{
    visitConcreteComponentA(element: ConcreteComponentA):void;
    visitConcreteComponentB(element: ConcreteComponentB):void;
}

class ConcreteVisitor1 implements Visitor{
    public visitConcreteComponentA(element: ConcreteComponentA):void{
        console.log(`${element.exclusiveMethodOfConcreteComponentA()} + ConcreteVisitor1`);
    }
    public visitConcreteComponentB(element: ConcreteComponentB): void {
        console.log(`${element.specialMethodOfConcreteComponentB()} + ConcreteVisitor1`);
    }
}
class ConcreteVisitor2 implements Visitor {
    public visitConcreteComponentA(element: ConcreteComponentA): void {
        console.log(`${element.exclusiveMethodOfConcreteComponentA()} + ConcreteVisitor2`);
    }

    public visitConcreteComponentB(element: ConcreteComponentB): void {
        console.log(`${element.specialMethodOfConcreteComponentB()} + ConcreteVisitor2`);
    }
}

function clientCode(components: Component[], visitor: Visitor) {
    // ...
    for (const component of components) {
        component.accept(visitor);
    }
    // ...
}

const components = [new ConcreteComponentA(), new ConcreteComponentB()];
console.log('The client code works with all visitors via the base Visitor interface:');
clientCode(components, visitor1);
console.log('');

console.log('It allows the same client code to work with different types of visitors:');
const visitor2 = new ConcreteVisitor2();
clientCode(components, visitor2);

```

<hr>

```txt [Output.txt]
The client code works with all visitors via the base Visitor interface:
A + ConcreteVisitor1
B + ConcreteVisitor1

It allows the same client code to work with different types of visitors:
A + ConcreteVisitor2
B + ConcreteVisitor2
```
