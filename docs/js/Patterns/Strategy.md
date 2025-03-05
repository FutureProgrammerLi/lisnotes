<script setup>
    import  ImageWithCaption from './components/ImageWithCaption.vue'
    import Divider from './components/Divider.vue'
</script>
# 策略模式

> [原文地址](https://refactoring.guru/design-patterns/strategy)

## 意图
策略模式是一种行为模式,你可以定义一系列算法,把它们应用到独立的类中,从而使对象变得可相互转变(interchangeable).  

![strategy](/refactoring/strategy/strategy.png)

## 可能遇到的问题
一天你突然想创建一个导航软件,给那些不知路况的旅游者使用.应用里集中了很多关于不同城市的各种地图,用户很快就能通过应用,快速定位到自己想去的地方.  
应用的一大特点使,它可以自动为你设计最佳路线.用户只需要输入目的地地址,就能看到最快到达的方式及路线.  
应用的最初版本可能只能根据路况制定线路.开车旅行的人自然高兴坏了.可是,并不是所有用户都是开车旅行的.应用的下一步,就是要为那些步行旅游的人也提供路线设计.之后,你还要为用户提供,通过公共设施到达目的地的路线设计.  

然而这只是应用的起步功能.后续你还要为骑单车的人提供路线,甚至你还需要为用户提供目的地不止一个的,游览整个城市的最佳路线推荐.

<ImageWithCaption 
src="/refactoring/strategy/problem.png"
caption="一开始还好,功能越多,项目可能就膨胀一片混乱了"
/>

尽管从商业角度上应用已经成功了,但从技术层面上讲,说它是代码屎山都不过分.每次要添加新的计算路线算法时,导航的主类规模都有可能代码量翻倍.山堆着堆着有什么问题,作为程序员都应该清楚了.  

如果要对算法进行修改,也有可能出现小问题,稍微调整某块砖都可能引起整座山塌掉.  
此外,山的堆砌对团队而言更是灾难.你的同事,新版本刚发布才被雇用的,很有可能抱怨,稍微整合一点代码都需要花费大量时间解决.为山"添砖加瓦",增加新功能时更是雪上加霜.

## 解决办法
策略模式建议,在一个类中定义专门解决一件事情的多种策略方法,将所有算法的具体实现提取到独立的类去,这些类就是我们所说的*策略(strategy)*.  
原本的类,称作上下文(context),必须存有策略的引用.由上下文分配接收到的任务,交由哪种算法策略来具体实现.而不是直接在上下文中执行.  
上下文并不是负责为任务选择合适的算法,而是用户将想采取的策略一同传递给上下文的.实际上上下文并不知道策略的大部分内容.它跟所有的策略都是通过一个相同的继承接口配合工作的,这个接口只会暴露一个方法,用以触发特定策略所封装的算法而已.  
这样我们的上下文就可以跟具体策略分离开来了.新算法的添加,旧算法的变更,都不会影响我们的上下文代码或是已存在的算法策略.  

<ImageWithCaption
src="/refactoring/strategy/solution.png"
caption='路线设计的各种策略'
/>

在我们的导航软件中,每个路线算法都可以提取到独立的包含`buildRoute`方法的类中.这个方法接收起点和终点,并返回一个路线集合.  
尽管接收到相同的参数,每个路线类都可能创建出不同的路线.我们的导航主类无需关注路线是采用哪种算法计算出来的,它只需要关注如何在地图上渲染两点之间的路线就可以了.这个类中还包含一个用于切换路线策略的方法,这样用户就可以切换所需的策略行为了.  

## 真实世界的类比

<ImageWithCaption
src='/refactoring/strategy/strategy-comic-1-en.png'
caption='到达机场的各种策略'
/>
想象一下你要去机场.你可以搭公交;打的士;或者踩单车去.这些都是交通工具选择导致路线的不同.你可以根据花费限制,或时间紧迫程度选择适合你的策略.  

<Divider />

## 可应用性
**一个对象中采取不同算法,或是需要在运行时切换算法的话,你可以考虑使用策略模式.**  
用策略模式的话,你可以在运行时间接切换对象的行为,把实现具体子任务的不同方法的不同子对象给联系起来就可以了(?).  

**当你有大量相似类,而它们只有实现某些操作时具备差异时,你可以考虑使用策略模式.**  
策略模式可以让你把多个行为提取到独立的类中,并把多个原始类整合成一个,这样就可以减少大量重复的代码了.  

**策略模式可以将类的业务逻辑和算法的具体实现细节区分开来,尽管后者可能没有上下文的逻辑代码那么重要,但怎么说也是分离开来了.**  
这种模式可以让你把代码,内部数据,算法依赖都独立开来.多个用户只需要一个简单接口以执行算法,或是在运行时切换就够了.  

**类中包含大量条件语句,以切换相同算法的不同变量时,你可以用策略模式.**  
这种模式可以缓解条件地狱,一个独立类代表一种算法,在里面实现相同的接口即可.原本的对象只需把执行任务分配给其中一个对象即可,无需实现接收不同参数时算法的变化.  

## 如何实现
1. 在上下文类中,找出那些经常会变化的算法.它可能是一连串的条件语句,只是在运行时选择并执行相同算法,只是接收的参数不同了而已.
2. 声明算法接收不同变量时,通用的策略接口.
3. 将算法逐个提取到各自独立类中去.它们的内部都需要实现我们的策略接口
4. 上下文类中,必须预留存储策略对象的引用.在内部提供一个设置器,以替换这个属性的值.上下文必须只经由策略接口,实现与策略对象的交互.上下文还可以定义一个可以让策略读取到数据的接口.
5. 上下文的使用者必须将合适的策略与上下文给联系起来(?).

## 优劣点
**优势**  
* 运行时可切换对象内部的算法
* 将算法的实现细节与调用给区分开来
* 复合替代继承
* 开闭原则.增加新策略的同时不修改上下文

**劣势**  
* 当你有多个算法,且很少变化时,我们没必要强行应用该模式,强行将已有代码复杂化,为程序突然添加新的类,接口
* 用户必须知道策略之间的区别,知道选择哪种策略才是最适合自己的
* 大部分现代编程语言都有相同算法的不同实现方法.你可以直接调用这些方法而不必强行添加策略对象,强行提取类和接口.  

## 与其它模式的联系
* 桥接模式,状态模式,策略模式(以及某种程度上的适配器模式),它们的结构都是相似的.而且它们都是基于复合的思想,将任务分配到其它对象去.不过它们解决的问题是各不相同的.模式的选用并不是为了强行限定你代码结构.相反,你可以用模式表明代码中存在什么问题,为什么需要使用这种模式来解决这种问题.
* 命令模式跟策略模式乍看很相似,因为你都可以用它们来参数化对象,向它们传递行为参数.不过模式的意图还是非常不同的:
    * 你可以用命令模式把任意操作转换成对象.操作需要的参数,就是对象的属性.这种转换可以让你延迟操作执行时机,队列化操作,存储命令执行历史,发送命令到远端服务等等...
    * 而策略模式通常是解决同一个问题的不同方法,从而在同一个上下文类中切换不同的算法策略.
* 装饰器模式改变对象的"表面"(skin),策略模式改变的是对象的"内在"(guts).
* 模板方法是基于继承实现的:你可以通过扩展子类中的某些部分,从而改变算法的部分实现.而策略模式则是基于复合实现的:你可以通过应用不同的策略,从而改变对象行为的某些部分.*模板方法*是在类层面上运作的,也就是静态的.而*策略模式*是在对象层面上运作的,可以在运行时变更对象的行为.
* *状态模式*可以说是*策略模式*的扩展.二者都是为了复合而诞生的:通过分配任务到助手对象,以改变上下文对象的行为.*策略模式*使这些对象相互独立.而*状态模式*并不限制具体状态间的依赖,可以随意变更上下文的状态.

## 代码
模式辨认:一个可由嵌套对象执行的具体方法,一个允许替换不同对象的设置器(?)
```ts [index.ts]
class Context{
    private strategy: Strategy;
    constructor(strategy:Strategy){
        this.strategy = strategy;
    }
    public setStrategy(strategy:Strategy){
        this.strategy = strategy;
    }

    public doSomeBussinessLogic(): void{
        // ...
        console.log('Context: Sorting data using the strategy (not sure how it\'ll do it)');
        const result = this.strategy.doAlgorithm(['a', 'b', 'c', 'd', 'e']);
        console.log(result.join(','));
        // ...
    }
}

interface Strategy {
    doAlgorithm(data:string[]): string[];
}

class ConcreteStrategyA implements Strategy{
    public doAlgorithm(data:string[]):string[]{
        return data.sort();
    }
}

class ConcreteStrategyB implements Strategy{
    public doAlgorithm(data:string[]):string[]{
        return data.reverse();
    }
}

const context = new Context(new ConcreteStrategyA());
console.log('Client: Strategy is set to normal sorting.');
context.doSomeBussinessLogic();

console.log('');

console.log('Client: Strategy is set to reverse sorting.');
context.setStrategy(new ConcreteStrategyB());
context.doSomeBussinessLogic();
```

<hr>

```txt [Output.txt]
Client: Strategy is set to normal sorting.
Context: Sorting data using the strategy (not sure how it'll do it)
a,b,c,d,e

Client: Strategy is set to reverse sorting.
Context: Sorting data using the strategy (not sure how it'll do it)
e,d,c,b,a
```