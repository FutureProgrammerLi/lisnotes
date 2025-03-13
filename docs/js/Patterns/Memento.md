<script setup>
    import ImageWithCaption from "./components/ImageWithCaption.vue"
    import Divider from "./components/Divider.vue"
</script>
# 备忘录模式(Memento)
> [原文地址](https://refactoring.guru/design-patterns/memento)

## 意图
备忘录是一种行为设计模式,用于存储和恢复一个对象先前的状态,而不用展示具体的实现.(reveal the details of implementation).  

![memento](/refactoring/memento/memento-en.png)

## 可能遇到的问题
假设你要开发一个文本编辑应用.除了简单的文本编辑,编辑器还需要实现文本格式化,插入内联图片等功能.  

后来,你决定为应用加上撤销文本操作.这个功能也不是什么新特性了,人们都会认为这是每个编辑器都具备的功能而已了.而你实现时你想采取最直接的方法.在进行任意操作之前,直接把所有对象的状态都记录,并保存到内存里就好了.之后如果对象想撤销操作,应用直接从历史内存中获取最近的快照,直接使用,恢复所有对象的状态就好了.

<ImageWithCaption
src='/refactoring/memento/problem1-en.png'
caption='执行任意操作之前应用都为对象状态保存快照,这样后续就可以直接恢复对象先前的状态了.'
/>

我们来分析一下那些状态快照.你要生成多准确的快照呢?你可能要遍历对象中的所有属性,把它们的值通通保存下来.当然这只会对那些内容没有限制,值可以自由访问的对象有效.实际上,多数对象是不会轻易让外部知道自身内部状态的,都会把重要属性给私有隐藏起来.  

先忽略这个问题,假设我们的对象就是允许这么做,还没私有属性这个概念的,随便与其它对象产生联系,所有属性都是公开的.虽然这种方法能解燃眉之急,可是后续也会产生大问题.后续你可能要重构某些编辑类,或增加/删除一些属性.听着简单,实际上这需要改变负责复制受影响对象的状态对应的类.

<ImageWithCaption
src='/refactoring/memento/problem2-en.png'
caption='如何复制对象的私有状态?'
/>

还有其它问题要考虑.我们想想编辑器状态实际的"快照".它包含了哪些数据?最少最少,它需要包含文本信息,光标位置,当前滚动位置等.而要拍下快照,你还需要收集这些值,把它们放到某个容器里.  
这样做的话你会产生很多这样的"容器对象",然后把这些容器存放到所谓的"历史列表"里.因此,容器可能会成为一个类的大量对象.这个类里没有方法,只有大量映射编辑器状态的属性.而要让其它对象写入到快照,或从快照读取数据,你还要公开它的属性.这样会暴露编辑器的所有状态,无论是否为私有状态.其它类在快照每次发生变化时都要依赖新的快照,否则就可能导致私有属性和方法发生变化,其它外部类不发生变化的问题.  
看来我们走上了条死路.要么暴露类内部的所有细节,这样类就很容易崩了;要么限制状态的读取,这样就生成不了快照了.  
还有没有其它方法生成快照呢?  

## 解决方法
以上所有问题,都是因为我们破坏了代码的封装性而产生的.有些对象想要完成某些不属于自己需要完成的工作.为了收集某些数据以执行某些操作,它们"入侵"了其它对象的"私有空间",而不是让这些对象本身来完成这些工作.  

备忘录模式将创建状态快照的操作,委任给状态本身的拥有者,我们的"原有对象(originator)".因此,与其让其它对象从外部复制我们的编辑器对象,不如直接将拍摄快照的任务交给编辑器类,因为它可以自由访问自身的状态.  

这种模式建议将对象状态的备份,存储到一个叫"备忘录"的特殊对象中.备忘录的内容除了产生它的对象外,其它的对象都无法访问.其它对象必须经由备忘录对象,一个暴露有限数据的接口,才能实现交流.  
这个备忘录对象用于获取快照的"原数据(metadata)",(像创建时间,进行了操作的名称等),而非直接返回快照中,原始对象的数据.

<ImageWithCaption
src='/refactoring/memento/solution-en.png'
caption='原始对象可以完全访问备忘录对象,而其它对象只能读取到备忘录对象的原数据.'
/>

使用这样的限制,你就可以将备忘录存储到其它对象中,我们称这些其它对象为"管理员(caretaker)".由于管理员只能与备忘录上受限的接口配合工作,因此它们是不能直接修改备忘录里的状态的.同时,原始对象可以直接访问备忘录中的所有数据,所以它可以任意恢复先前的状态.  

回到我们的编辑器例子,我们可以创建独立的历史类,把它作为我们的"管理员".管理员内部存储的栈备忘录,会在编辑器进行下次操作前增添上"一页".你甚至还可以将这个栈直接渲染到UI上,将用户过往的操作展示给用户.  

用户撤销时,历史类从栈中提取出最近的备忘页,传递给编辑器,并请求回滚操作.编辑器由于可以完全访问备忘录数据,所以这个过程只是把从备忘录的值,替换回它的状态罢了.  

<Divider />

## 可应用性
**生成对象状态的快照,以便于后续恢复.**  
备忘录模式可以让你完整备份对象的所有状态,包括私有属性,并将它们存储到独立于对象的地方.虽然大部分人都会因"撤销"操作而记住这种模式,可这种模式在处理事务transaction时也是不可缺少的.(比如错误操作后需回滚).

**直接访问对象属性/访问器/设置器,而不得不破坏代码封装性时,你可以使用这种模式.**  
备忘录模式令对象本身,为自己的状态创建快照.没有其它对象可以读取快照原本的信息,这样就可以保护对象信息的安全性了.  

## 如何实现
1. 确定哪些类会成为我们的原始对象(originator).提前知晓程序中,要用一个大型集中对象,抑或用多个细小对象,这很重要.
2. 创建备忘录类.在类的内部一对一的声明原始对象属性的映射.
3. 禁止外部修改备忘录类.一个备忘录类只允许通过constructor接收记录一次数据.不允许有其它设置器方法.
4. 如果你使用的编程语言支持嵌套类(nested classes),直接把备忘录类嵌套到原始对象类中去.如果不支持,那就从备忘录类中提取一个空的接口,让其它所有的对象通过这个接口访问我们的原始对象.你需要为这个接口添加上一些原数据的操作,不能直接暴露原始对象的内部状态.  
5. 编写用于为原始类创建备忘录类的方法.原始对象需要通过一个或多个参数,向备忘录传递自身的状态.  
这个方法的返回类型需要与你之前提取的接口类型一致(假设你把它们全都提取出来了).用于生成备忘录的方法底层需要直接与备忘录类进行交互.
6. 编写用于恢复原始对象状态的方法.方法的参数应是备忘录对象.如果你在之前提取了接口,那方法的参数也应是这个接口的类型.这种情况下,接收的对象参数类型必须总为备忘录类型,因为原始对象需要完整访问到那个对象.(?)
7. 管理员,无论是命令对象,历史栈,或是其它类型的对象,都要知道何时为原始对象添加新备忘录,如何存储备忘录,以及何时将某一页备忘录数据恢复到原始对象.
8. 管理员和原始对象的连接可以移动到备忘录类里.这样每个备忘录就需要知道是哪个原始对象创建它们的了.数据恢复的方法也可以移动到备忘录类里.不过,仅限备忘录类嵌套到原始对象,或原始对象类提供了足够的设置方法以重写它的状态时,这样做才是合理的.  

## 优缺点
**优点**  
* 你可以在不破坏对象封装性的前提下,创建对象状态的快照.
* 让管理员管理原始对象的状态历史,从而简化原始对象的内部代码.

**缺点**  
* 如果客户端过于频繁的创建备忘录,可能会导致大量内存被占用.
* 管理员需要追踪原始对象的生命周期,以销毁部分过时的备忘页.
* 大部分像PHP,Python,JS等动态语言,都不能确保备忘录里的数据不被修改.

## 与其它模式的关系
* 结合命令模式和备忘录模式,可以实现"撤销"功能.命令模式负责对目标对象实现多个操作,记忆模式负责在命令执行前,对应目标对象相关状态的储存.  
* 结合备忘录模式和遍历器模式,捕获当前遍历的状态,并在必要时实现回滚.
* 有时我们可以用原型模式实现简化版的备忘录模式.如果对象,或是你想储存的状态,是比较简单,不会与外部资源有联系,或联系易于重建的话,就能实现类似的功能.  

## 代码示例
**使用例子**: 利用序列化实现这种模式在TS中是很常见的.虽然这不是唯一且最有效的,创建对象状态快照的方法,但它能在保护原始对象数据的同时实现状态的备份.

```ts [index.ts]
class Originator{
    private state:string;
    constructor(state:string){
        this.state = state;
        console.log(`Originator: My initial state is: ${state}`);
    }

    public doSomething():void{
        console.log('Originator: I\'m doing something important.');
        this.state = this.generateRandomString(30);
        console.log(`Originator: and my state has changed to: ${this.state}`);
    }

    private generateRandomString(length:number = 10):string{
        const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return Array
        .apply(null, {length})
        .map(() => charSet.charAt(Math.floor(Math.random() * charSet.length)))
        .join('');
    }

    public save():Memento{
        return new ConcreteMemento(this.state);
    }

    public restore(memento:Memento):void{
        this.state = memento.getState();
        console.log(`Originator: My state has changed to: ${this.state}`);
    }
}

interface Memento{
    getState():string;
    getName():string;
    getDate():string;
}

class ConcreteMemento implements Memento{
    private state:string;
    private date:string;

    constructor(state:string){
        this.state = state;
        this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    
    public getState():string{
        return this.state;
    }

    public getName():string{
        return `${this.date} / (${this.state.substring(0, 9)}...)`;
    }

    public getDate():string{
        return this.date;
    }
}

class Caretaker{
    private mementos:Memento[] = [];
    private originator:Originator;

    constructor(originator:Originator){
        this.originator = originator;
    }

    public backup():void{
        console.log('\nCaretaker: Saving Originator\'s state...');
        this.mementos.push(this.originator.save());
    }

    public undo():void{
        if(!this.mementos.length){
            return;
        }

        const memento = this.mementos.pop();

        console.log(`Caretaker: Restoring state to: ${memento.getName()}`);
        this.originator.restore(memento);
    }

    public showHistory():void{
        console.log('Caretaker: Here\'s the list of mementos:');
        for(const memento of this.mementos){
            console.log(memento.getName());
        }
    }
}
const originator = new Originator('Super-duper-super-puper-super.');
const caretaker = new Caretaker(originator);

caretaker.backup();
originator.doSomething();

caretaker.backup();
originator.doSomething();

caretaker.backup();
originator.doSomething();

console.log('');
caretaker.showHistory();

console.log('\nClient: Now, let\'s rollback! \n');
caretaker.undo();

console.log('\nClient: Once more! \n');
caretaker.undo();

```

```txt [Output.txt]
Originator: My initial state is: Super-duper-super-puper-super.

Caretaker: Saving Originator's state...
Originator: I'm doing something important.
Originator: and my state has changed to: qXqxgTcLSCeLYdcgElOghOFhPGfMxo

Caretaker: Saving Originator's state...
Originator: I'm doing something important.
Originator: and my state has changed to: iaVCJVryJwWwbipieensfodeMSWvUY

Caretaker: Saving Originator's state...
Originator: I'm doing something important.
Originator: and my state has changed to: oSUxsOCiZEnohBMQEjwnPWJLGnwGmy

Caretaker: Here's the list of mementos:
2019-02-17 15:14:05 / (Super-dup...)
2019-02-17 15:14:05 / (qXqxgTcLS...)
2019-02-17 15:14:05 / (iaVCJVryJ...)

Client: Now, let's rollback!

Caretaker: Restoring state to: 2019-02-17 15:14:05 / (iaVCJVryJ...)
Originator: My state has changed to: iaVCJVryJwWwbipieensfodeMSWvUY

Client: Once more!

Caretaker: Restoring state to: 2019-02-17 15:14:05 / (qXqxgTcLS...)
Originator: My state has changed to: qXqxgTcLSCeLYdcgElOghOFhPGfMxo
```


---
感谢你能看到这里!



