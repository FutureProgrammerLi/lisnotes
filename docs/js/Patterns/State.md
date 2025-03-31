<script setup>
    import ImageWithCaption from './components/ImageWithCaption.vue'
    import Divider from './components/Divider.vue'
</script>

# 状态模式
> [原文地址](https://refactoring.guru/design-patterns/state)

## 意图
状态模式是一种行为设计模式,意思是一个对象根据状态的变化,改变它自身的行为.看起来就像是对象改变了自身的类.

![state](/refactoring/state/state-en.png)

## 问题
状态模式跟*有限状态机Finite-State Machine*的概念紧密相关.
<ImageWithCaption
src='/refactoring/state/problem1.png'
caption='有限状态机图示'
/>

它的主要理念是,任意时刻时,程序的运行都有对应数量的状态所表示.而处于每个独立的状态时,程序的行为也会有所不同,同时也可以即时从一个状态切换到另外的状态.  
不过,程序是否切换到另外的状态,取决于当前的状态是否需要切换.而切换的规则,我们称为 *"转换(transition)"*,同样是有限且预先决定了的.  

你也可以将这种方式应用到对象上.假设我们有个`Document`类.一个文档可以有其中一种状态:`Draft草稿`,`Moderation修改中`,`Published已发布`.而`publish`方法的表现,因文档对应当时的状态而表现得有些许差异:
* 草稿状态时,将文档转变为修改中状态.
* 修改状态时,只有当当前用户是管理员时,将文档变得公开.
* 已发布状态时,这个方法不会有任何操作.

<ImageWithCaption
src='/refactoring/state/problem2-en.png'
caption='文档对象可能会有的状态及转变'
/>

状态机一般需要多条状态语句来实现(`if`或`switch`),从而根据对象当前状态,选择合适的行为表现.这个"状态"一般是对象多个属性的值的集合.虽然你可能没听说过有限状态机这个概念,但你可能已经使用过这种方式,只是你不知道这个叫状态机而已.  
看下下面这段代码会不会觉得有点眼熟?

```js
// 伪代码, 设置为js只为高亮
class Document is
    field state: string;
    //...
    method publish(){
        switch(state){
            "draft":
                state = 'moderation'
            'moderation':
                if(currentUser.isAdmin){
                    state = 'published'
                }
            'published':
                // do nothing
                break;
// ...
```
状态机最大的缺陷是,当我们需要将更多状态添加到这个类时,代码会变得冗余;对象行为可能会依赖多个状态而非单一状态.大部分方法会包含十分糟糕的条件语句,才能根据当前状态选择合适的行为.  
这种代码非常难以维护,因为任意转换逻辑的变更,都要改变每个状态中的转换条件.  

项目越大,问题就越突出.我们很难在设计阶段就预测项目中所有的状态及可能需要转换的条件.因此,一个起始状态简单的状态机,随着时间推移,也有可能变成一个复杂无比的东西.  

## 解决办法
状态模式建议,为一个对象所有可能的状态都创建新的类,并将所有对应状态的行为提取到这些新的类里.  

与其让原始对象(我们称为"上下文context")定义实现所有的行为,不如让其存储索引,指向其中一种代表目标状态的状态对象,并将所有状态相关的行为委任到该对象上.  

<ImageWithCaption
src='/refactoring/state/solution-en.png'
caption='文档将工作委任到状态对象'
/>

为了将上下文切换到另外的状态去,文档需要将当前活跃的状态对象,切换到目标的,新状态所对应的新对象上.为了实现这种功能,我们所有的状态类都需要实现相同的接口,上下文本身也需要通过这个接口与状态对象进行交互.  

这种代码接口与**策略模式**有点相似,不过有一个显著不同点.状态模式中,特定状态下会知道其他状态的存在,并可以触发状态转换.而策略模式几乎是不知道其它策略的存在的.  

## 真实世界的比喻
你手机上的按钮和切换按钮,就是根据不同状态实现不同行为的很好的例子:
* 手机解锁了,点击不同按钮会触发不同行为
* 手机没解锁,点击任何按钮都会引导到需要你解锁的画面
* 手机电量低了,点击任何按钮都会展示要你充电的画面(?)

<Divider />

## 可应用性
**需要对象根据不同状态,采取不同行为时可以采用这种模式.尤其是状态可能有很多,或是对应状态的表现行为代码时长发生变化的时候.**  
模式建议你将所有特定状态的代码,提取到各自独立对应的类中.这样你就可以比较轻易地增加已有对象的新状态,或是改变已有状态,互相独立,且减少维护所需成本了.  

**一个类中被大量条件语句所污染,根据当前类的某些属性值而改变类的行为时,你可以采用这种模式.**  
状态模式让你将条件语句所产生的分支,提取到对象状态类的方法里.这样你就可以将那些存在于主类中,与具体状态相关的临时值和助手方法给分离开来了.  

**当你在多个相似状态和转换方式时,你可以用这种模式减少重复代码.**  
状态模式可以让你复合多个状态类的层级,通过提取共用代码到抽象基类中的方法,减少代码的重复.  

## 如何实现
1. 决定哪些类作为上下文.它可以是已有的,依赖状态的类;如果特定状态的代码需要分配到多个类时,它也可以是新的类.
2. 声明状态接口.虽然它可能会将上下文中的所有方法都镜像化,但你也可以只声明那些特定状态的行为.
3. 对于每个状态,根据状态接口,为它们创建一个类.然后遍历上下文的方法,将所有与该状态相关的代码提取到新创建的类中.  
将代码移到状态类时可能会有问题,就是它们可能会依赖上下文中的私有成员.我们也有解决方法:
    * 将这些成员或方法公有化.
    * 将你当前提取的行为设置为上下文中公开的方法,并在状态类中调用.这种方法虽丑陋,但有效.你可以后续再返回来解决这个问题.(?)
    * 如果你的编程语言支持类嵌套的话,将状态类嵌套到上下文类中.
4. 在上下文类中添加一个状态接口类型的指针索引,还有一个公开的设置器,用于重写这个指针的值.
5. 再次遍历上下文的方法,将空状态条件,替换为状态对象相应方法的调用(?)
6. 为了切换上下文的状态,我们要创建其中一个类状态的实例并传递给上下文.你可以直接在上下文中实现,也可以在状态类里实现,甚至直接在客户端实现.无论在哪实现,类都要依赖于实例化它自身的具体状态类(?)

## 优缺点
**优点**  
* 单一职责原则.将每个状态的行为封装到各自独立的类中,可以让你避免臃肿的`switch`或`if`语句.
* 开闭原则.你可以增加新的状态,而无需改变上下文或其它状态类.
* 通过消除大量的状态切换代码,从而简化上下文中的代码

**缺点**  
* 如果程序中的状态很少,或是很少切换,那么使用状态模式反而会显得繁琐.

## 与其它模式的关系
* 桥接模式,状态模式,策略模式(以及某种程度上的适配器模式),代码结构都很相似.不过也确实,这些都是基于复合而实现的,将特定工作委任到其它对象上.不过它们解决的问题各不相同.一个模式的存在不单是以特定方式组织代码的诀窍.它还能告诉其它开发者,模式的应用解决了什么问题.  
* 状态模式被认为是策略模式的一种扩展.两种模式都是基于复合而成:通过将任务委任到其它助手对象,以改变上下文的行为.*策略*的存在,让这些对象完全独立,无法知晓彼此的存在.而*状态*则不然,具体状态之间不限于依赖,可随意改变上下文的状态.

## 代码示例

```ts [index.ts]
class Context {
    private state: State;
    constructor(state: State) {
        this.transitionTo(state);
    }
    public transitionTo(state: State) {
        console.log(`Context: Transition to ${<any>state.constructor.name}.`);
        this.state = state;
        this.state.setContext(this);
    }

    public request1() {
        this.state.handle1();
    }
    public request2() {
        this.state.handle2();
    }
}

abstract class State {
    protected context: Context;
    public setContext(context: Context) {
        this.context = context;
    }
    public abstract handle1(): void;
    public abstract handle2(): void;
}

class ConcreteStateA extends State {
    public handle1(): void {
        console.log('ConcreteStateA handles request1.');
        console.log('ConcreteStateA wants to change the state of the context.');
        this.context.transitionTo(new ConcreteStateB());
    }
    public handle2(): void {
        console.log('ConcreteStateA handles request2.');
    }
}

class ConcreteStateB extends State {
    public handle1(): void {
        console.log('ConcreteStateB handles request1.');
    }
    public handle2(): void {
        console.log('ConcreteStateB handles request2.');
        console.log('ConcreteStateB wants to change the state of the context.');
        this.context.transitionTo(new ConcreteStateA());
    }
}

const context = new Context(new ConcreteStateA());
context.request1();
context.request2();
```

<hr>

```txt [Output.txt]
Context: Transition to ConcreteStateA.
ConcreteStateA handles request1.
ConcreteStateA wants to change the state of the context.
Context: Transition to ConcreteStateB.
ConcreteStateB handles request2.
ConcreteStateB wants to change the state of the context.
Context: Transition to ConcreteStateA.
```


---
感谢你能看到这里!