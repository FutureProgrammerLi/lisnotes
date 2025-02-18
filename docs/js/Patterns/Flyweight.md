# 享元模式
> [原文地址](https://refactoring.guru/design-patterns/flyweight/)
## 设计意图
**享元(flyweight)** 是一种结构设计模式,你可以通过共享多个对象中的相同部分来减少内存的使用,而不需要把所有的数据保存在各自独立的对象中.  

## 可能遇到的问题
假如,代码山堆叠起来后,你决定要创造一个简单的游戏: 玩家在地图上移动,互相射击.你选择实现一个真实的粒子系统,以作为游戏的特点之一.无数的子弹,导弹.弹片飞来飞去,以此为玩家提供良好的射击体验.  
游戏代码写完了,你发给你的朋友测试体验一下.虽然游戏能在你的机子上完美运行,可在你朋友的机子上却运行不了很久.你朋友的电脑玩了一会你的游戏程序就崩溃了.你在错误日志里找啊找,终于知道,是内存不足的导致的游戏崩溃.你发现你朋友的电脑跟你的对比起来,简直是步步高般的存在,也就解释了为什么他的电脑上游戏会崩溃了.  
实际上,出问题的是游戏内,粒子系统(particle system)的问题.每个粒子(一颗子弹,一颗导弹,或是一个弹片),背后其实都是一个包含了大量数据的独立对象.当游戏进行到一定程度时,粒子系统内存爆炸了,容不下新增的粒子对象了,游戏自然就崩溃了.  
![problem](/refactoring/flyweight/problem-en.png)

## 解决方案
细看我们的`Particle`类会发现,`color`和`sprite`两个属性会比其它属性占用更多的内存.更糟糕的是这两个属性还要在所有粒子对象中,存储几乎完全相同的数据.比如,所有的子弹都有相同的颜色和图像单元(color and sprite)
![solution1](/refactoring/flyweight/solution1-en.png)
其它像粒子坐标,移动向量及速度,这些粒子状态每个粒子各有不同.它们的值变化也各不相同.这些变化着的数据代表着粒子的存在及趋势,而`color`和`sprite`则代表粒子的"常态量".  
这些对象里不变的数据一般称为"内在状态"(Intrinsic State).它们存在于对象内部,其它对象只可以读取这些数据,而不能改变它们.  
而其它对象的状态,通常可以被外在的其它对象所改变,这些状态责备称为"外部状态"(Extrinsic State).  

享元模式建议你,不要再把外部状态存到对象里了.不如把这些状态传递给各自依赖它们的特定方法中去.只把内在状态保留到对象本身中,以在不同上下文中重复利用这些不变的状态.  
结果就是,你不再需要那么多对象了,因为它们的区别只是内部状态,它们的变化明显会比外在状态少很多.  
![solution3](/refactoring/flyweight/solution3-en.png)
回到我们开发的游戏.假如我们把外部状态从`particle`类提取出来后,那么只需要三个不同的对象,就能代表一场游戏内所有的粒子了:子弹对象,导弹对象和弹片对象.读到这你应该知道享元是什么了:只存储内部状态的一个对象,就叫一个享元.

## 外部状态的存储
只保留内在状态,那,外部状态要放到哪里呢?我们还是要有类来存储它们的吧?一般情况下,我们会把它们移动到容器对象(container object)中,这个对象会在我们使用这种模式前先集中我们的对象(aggregate objects)  
我们的代码里,`Game`对象就是用于存储所有粒子对象`particles`的容器.要把粒子的外部属性都移动到这个类中的话,你需要创建几个数组,以存储坐标/向量/粒子速度这些值.你还需要用另外的数组,以存储指向某个享元粒子的索引.这些数组之间需要相互配合,从而在使用相同索引时获取到该粒子的所有相关数据.  
![solution2](/refactoring/flyweight/solution2-en.png)
一种更优雅的方法是,创建独立的上下文类,以存储外部状态及与享元对象的关联.这种方法只需要在容器类中创建一个数组就够了.  

等等!我们不是一开始就不需要这么多上下文对象吗?技术上说,是的.但问题在于,这些对象相较以前体积已经少了太多太多了,最耗费内存的属性都被移动到几个享元对象去了.现在,上千个体积更小的上下文对象,都可以重用这些单独的,体积更大的享元对象,而不是傻傻地直接复制这些数据了.  

## 享元及不可变性
由于相同的享元对象可以在不同的上下文中使用,此时你就要确保这个对象的内部属性是不可变的了.  
一个享元对象应该只会通过构造器参数被初始化一次.它本身不应向外部暴露任何设置方法或公共属性.  

## 享元工厂
为了更方便构建我们的享元对象,你可以创建一个工厂方法,专门管理存在的享元对象池.这个方法从客户端接收目标享元对象的内部状态,查询已有的,与该状态相匹配的享元对象,如存在则返回.否则,创建新的享元对象,并添加到池中.  

这个方法可以在很多地方中定义.最明显的就是定义在享元容器中(flyweight container).你也可以创建新的工厂类.你还可以将工厂方法定义为静态的,并放置到真实的享元类中.  


<hr style="border: 1px solid red;"/>

**(分割线, 越说越靠近C++,就越不懂了.得赶紧跳回我们的Javascript去!)**  
**(跳过类结构分析和伪代码,下面贴TS代码代替这一部分吧)**

<hr style="border: 1px solid red;"/>

## 可应用性
当你的程序需要创建大量对象,数量甚至多到可能撑爆内存时,你可以考虑使用享元模式.  
这种模式的好处一般取决于你怎么使用,把它用在哪上.以下场景就非常有用:
* 应用需要产生大量的类似对象
* 应用可能会撑爆用户设备内存
* 各个对象中包含重复状态,而这些状态又可以被提取并在各个对象中共享.

## 如何实现这种模式
1. 将可以变为"享元"的对象类的属性分为两个部分:
    * 内在状态: 对象间可能重复的,包含不变数据的属性.
    * 外在状态: 每个对象中独有的包含上下文的属性数据.
2. 类定义中保留内在状态,并确保它们不会被修改.它们的初始值只应在被初始化时设置一次.
3. 找出需要利用外部状态的方法.方法内需要用到的属性,利用新的参数将这个属性值替换掉.
4. 你还可以创建工厂类,专门管理享元对象池.创建新享元前先查询池中是否已经存在.一旦工厂类实现后,用户必须只通过这个池来获取享元对象,通过将内部属性传递给工厂来获取想要的享元对象.
5. 用户必须存储或计算出外部状态的值,以调用享元的方法.方便起见,外部状态一般跟享元索引一同移动到独立的上下文类中.

## 优势与劣势
**优势**
* 可以减少内存使用  

**劣势**
* 用CPU性能替换RAM空间
* 代码变复杂了.后人看代码可能看不懂为什么要把实体的一些属性独立出来.

## 与其它模式的关系
* 把复合树的共享子叶节点以享元方式实现,从而减少内存占用
* 享元可以创建大量小体积对象,而外观(Facade)模式则时展示如何用一个对象来代表一个子系统.
* 如果你把对象所有的共享状态都压缩到一个对象上的话,享元模式跟单例模式就很像了.不过它们还是有以下两个根本不同的:
    * 1. 单例模式只允许有一个实例,享元类则可以有多个实例,多个不同的内部状态.
    * 2. 单例对象的属性是可变的,享元对象的属性是不可变的.


## 代码例子
(模式本意是减少内存占用,因为C语言很容易出现内存爆炸的情况.而到了JS,还会有这种顾虑吗?没那么常见了.因此它应用场景也发生些许变化了.)  
辨识: 构造方法里返回缓存对象,而不再次创建新对象,就是JS享元模式的体现了.(?)

```ts
class Flyweight {
    private sharedState: any;  // intrinsic

    constructor(sharedState: any) {      // initializer
        this.sharedState = sharedState;
    }

    public operation(uniqueState: any): void {
        const s = JSON.stringify(this.sharedState);
        const u = JSON.stringify(uniqueState);      // extrinsic
        console.log(`Flyweight: Displaying shared (${s}) and unique (${u}) state.`);
    }
}

class FlyweightFactory {
    private flyweights: {[key: string]: Flyweight} = <any>{};

    constructor(initialFlyweights: string[][]) {
        for (const state of initialFlyweights) {
            this.flyweights[this.getKey(state)] = new Flyweight(state);
        }
    }

    private getKey(state: string[]): string {
        return state.join('_');
    }

    public getFlyweight(sharedState: string[]): Flyweight {
        const key = this.getKey(sharedState);

        if(!(key in this.flyweights)) {
            console.log("FlyweightFactory: Can't find a flyweight, creating new one.");
            this.flyweights[key] = new Flyweight(sharedState);
        } else {
            console.log("FlyweightFactory: Reusing existing flyweight.");
        }

        return this.flyweights[key];
    }

    public listFlyweights(): void {
        const count = Object.keys(this.flyweights).length;
        console.log(`\nFlyweightFactory: I have ${count} flyweights:`);
        for (const key in this.flyweights) {
            console.log(key);
        }
    }
}

const factory = new FlyweightFactory([
    ['Chevrolet', 'Camaro2018', 'pink'],
    ['Mercedes Benz', 'C300', 'black'],
    ['Mercedes Benz', 'C500', 'red'],
    ['BMW', 'M5', 'red'],
    ['BMW', 'X6', 'white'],
]);

factory.listFlyweights();  // [!code highlight]

function addCarToPoliceDatabase(
    ff: FlyweightFactory, plates: string, owner: string,
    brand: string, model: string, color: string
) {
    console.log("\nClient: Adding a car to database.");
    const flyweight = factory.getFlyweight([brand, model, color]);
    flyweight.operation([plates, owner]);
}

addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'M5', 'red'); // [!code highlight]
addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'X1', 'red'); // [!code highlight]
factory.listFlyweights(); // [!code highlight]
```

```txt [Output.txt]
<!-- 第58行的输出 -->
FlyweightFactory: I have 5 flyweights:
Chevrolet_Camaro2018_pink
Mercedes Benz_C300_black
Mercedes Benz_C500_red
BMW_M5_red
BMW_X6_white

<!-- 第69行 -->
Client: Adding a car to database.
FlyweightFactory: Reusing existing flyweight.
Flyweight: Displaying shared (["BMW","M5","red"]) and unique (["CL234IR","James Doe"]) state.

<!-- 第70行 -->
Client: Adding a car to database.
FlyweightFactory: Can't find a flyweight, creating new one.
Flyweight: Displaying shared (["BMW","X1","red"]) and unique (["CL234IR","James Doe"]) state.

<!-- 第71行 -->
FlyweightFactory: I have 6 flyweights:
Chevrolet_Camaro2018_pink
Mercedes Benz_C300_black
Mercedes Benz_C500_red
BMW_M5_red
BMW_X6_white
BMW_X1_red
```
