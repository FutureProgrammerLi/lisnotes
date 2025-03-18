<script setup>
import ImageWithCaption from './components/ImageWithCaption.vue'
import Divider from './components/Divider.vue'
</script>
# 组合模式
> [原文地址](https://refactoring.guru/design-patterns/composite)

## 意图
组合模式是一种结构设计模式,你可以将多个对象组合为树状结构,像使用单个对象一样使用它们.

## 问题
只有当应用的核心模型可以表示为树状结构时,组合模式才有意义.  
比如,假设你有两种类型的对象:产品对象与盒子对象(Products and Boxes).一个盒子可以包含多个产品,也可以包含多个规格更小的盒子(smaller boxes).这些小盒子里又可以装一些产品,或是规格更小的盒子.  
假设你需要创建一个订单系统,调用的就是以上类.订单中可以只包含产品而不要盒子,也可以是盒子中包含多个产品...以及更小的盒子.(意思就是可以随意套娃).你要如何决定订单中,盒子和产品的价格呢?  


## 解决办法
组合模式建议,定义一个通用的接口,在这里声明方法计算物品的总价格,以配合两个类:Products和Boxes共同工作.  

为什么这个方法可行?对于一个产品而言,它只需要返回自身的价格.对于一个盒子而言,则需要遍历它所包含的每个物体,其中包括更小的盒子以及产品,询问它们各自的价格,并返回这个盒子所包含的总价值.如果盒子中包含更小的盒子,那就再在这个小盒子上进行上一个盒子所进行的操作,直到所有盒子及产品价格都被询问并计算返回.一个盒子的话,还可以加上一些额外的费用到总价格中(比如包装费).  

<ImageWithCaption
src='/refactoring/composite/composite-comic-1-en.png'
caption='你可以利用组合模式,在树状对象结构上,递归执行某些操作'
/>

这种方法最大的好处是,你不需要关心树是由哪些具体对象组合而成的.你无需知道某个节点仅是一个简单的产品对象,还是复杂的盒子对象.你通过一个通用的接口,对它们进行相同的操作.你只需要调用这个方法,对象自身就会将请求沿树结构传递下去.

## 真实世界的类比
<ImageWithCaption
src='/refactoring/composite/live-example.png'
caption='军队里的上下属关系就可以用来作类比'
/>

大部分国家的军队都是分层级的.一个军队包含多个师,每个师又包含多个团,每个团又包含多个营,每个营又包含多个连...直到底层,由一个个真实存在的士兵组成.而命令的传递,也是从最高层级开始,逐层向下传递,直到对应需要执行层级的每个人都知晓并执行.  

<Divider />

## 可应用性
**当你不得不实现树状结构的对象时,可以使用组合模式.**  
组合模式为你提供了两种基本的元素类型,它们之间共用着一个通用接口: 简单的叶子节点及复杂容器节点.而容器节点又可以由其它的叶子节点和其它的容器节点组成.这样你就可以构建一个树状,嵌套的,递归对象结构.

**当你需要客户端代码同等地对待简单及复杂元素时,你可以使用这种模式.**  
利用组合模式定义的所有元素都会共用一个接口.客户端可以利用接口,忽视掉他们实际交互的具体元素对象.  

## 如何实现
1. 确保应用的核心模型可以表示为树状结构.试着把它们分类为简单元素节点及容器节点.而容器节点又可以包括其它节点及其它的容器节点.
2. 通用接口里要声明一系列的方法,确保无论是简单元素还是复杂容器都能正确执行这些方法.
3. 为简单元素创建子叶类(leaf class).一般程序都会包含大量的不同子叶类.
4. 为复杂元素创建容器类(container class).类定义中至少要有一个数组,用于存储子元素的索引.而且数组存储的类型必须既可以是子叶类,也可以是容器类,因此,确保好对应声明的组件接口类型.(?)  
你不仅要完善组件接口的具体实现方法,还要确保容器的作用:将大部分的工作委任给它的子元素.
5. 最后,在容器类中定义添加和删除子元素的方法.  
记住,这些操作可以在组件接口中声明.虽然这会违反接口隔离原则,因为子叶类中这些方法是空的.不过,用户哪怕需要操作树状结构的数据,他们也不会知道,"一视同仁".  

## 优缺点
**优点**  
- 你可以利用组合模式,更从容地处理复杂的树状结构数据:利用好多态和递归就好了.
- 开闭原则:你无需修改已有代码,就可以在应用的对象树上,添加新元素类型.

**缺点**  
- 通用接口的定义是很困难的,因为类与类之间的功能差异可能会很大.某些情况下,你可能需要"过度生成"一个组件的方法,这样代码就可能难以被理解了.

## 与其它模式的关系
* 利用**构建者模式**,创建复杂的"复合树"(Composite trees).前者用于创建后者需要递归操作的具体步骤.
* **责任链模式**通常会与**组合模式**一同使用.当子叶组件获取到请求时,它可以通过责任链,传递给所有的父组件,及对象树的根节点.(?)
* 你可以利用**遍历器模式**,遍历**复合树**.
* 你可以利用**访问者模式**,在完整的复合树上执行某个操作.
* 你可以将复合树上的某些节点,实现为"享元(Flyweight)",以节省内存.
* **组合模式和装饰器模式**的结构很相似,因为他们都依赖于递归组合,以组织可能数量无限(open-ended numbers)的对象.  
一个*装饰器*,跟只有一个子元素的*复合模式*很相似.此外还有另一个很重要的区别:装饰器会为被包装的对象添加额外的职责,而组合模式只会"统计"子元素的操作结果.  
不过两种模式还是可以配合使用的:利用装饰器,扩展复合树上某个特定对象的行为.
* 重度依赖组合模式和装饰器模式的程序设计,还可以从"原型链"模式中收益.利用原型链,你就可以复制复杂的结构数据,而不用重新构建.

## 代码示例
```ts [index.ts]
abstract class Component {
    protected parent: Component | null;
    public setParent(parent: Component | null) {
        this.parent = parent;
    }
    public getParent(): Component | null {
        return this.parent;
    }
    public add(component: Component): void {}
    public remove(component: Component): void {}
    public isComposite(): boolean {
        return false;
    }
    public abstract operation(): string;
}

class Leaf extends Component {
    public operation(): string {
        return "Leaf";
    }
}

class Composite extends Component {
    protected children: Component[] = [];

    public add(component: Component): void {
        this.children.push(component);
        component.setParent(this);
    }
    
    public remove(component: Component): void {
        const componentIndex = this.children.indexOf(component);
        this.children.splice(componentIndex, 1);
        component.setParent(null);
    }

    public isComposite(): boolean {
        return true;
    }

    public operation(): string {
        const results = [];
        for (const child of this.children) {
            results.push(child.operation());
        }
        return `Branch(${results.join("+")})`;
    }
}

function clientCode(component: Component) {
    console.log(`RESULT: ${component.operation()}`);
}

const simple = new Leaf();
console.log("Client: I've got a simple component:");
clientCode(simple);
console.log("");

const tree = new Composite();
const branch1 = new Composite();
branch1.add(new Leaf());
branch1.add(new Leaf());
const branch2 = new Composite();
branch2.add(new Leaf());
tree.add(branch1);
tree.add(branch2);

console.log("Client: Now I've got a composite tree:");
clientCode(tree);
console.log("");

function clientCode2(component1: Component, component2: Component) {
    if (component1.isComposite()) {
        component1.add(component2);
    }
    console.log(`RESULT: ${component1.operation()}`);
}

console.log("Client: I don't need to check the components classes even when managing the tree:");
clientCode2(tree, simple);
```

<hr>

```txt [Output.txt]
Client: I've got a simple component:
RESULT: Leaf

Client: Now I've got a composite tree:
RESULT: Branch(Branch(Leaf+Leaf)+Branch(Leaf))

Client: I don't need to check the components classes even when managing the tree:
RESULT: Branch(Branch(Leaf+Leaf)+Branch(Leaf)+Leaf)
```

--- 
感谢你能看到这里!


