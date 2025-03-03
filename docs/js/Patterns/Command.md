<script setup>
import ImageWithCaption from './components/ImageWithCaption.vue';
import Divider from './components/Divider.vue';
</script>

# 命令模式
> [原文地址](https://refactoring.guru/design-patterns/command)

**命令模式**是一种行为设计模式,它把一个请求转化为一个包含与执行操作的独立对象.这种转化可以让你把请求以方法参数的方式,延迟或以队列的形式执行请求,此外还可以支持一些无法平常实现的操作.  

![command](/refactoring/command/command-en.png)

## 问题
假设你在开发一个文本编辑应用.你现在要创建一个工具栏,包含一系列编辑器可以进行的操作.你创建了一个很简单的`Button`类,用以在工具栏上及其它各种弹窗中重复继承使用.

<ImageWithCaption 
src="/refactoring/command/problem1.png" 
caption="应用的所有按钮都源自一个相同的父类" 
/>

虽然按钮看起来相似,但它们的作用是完全不同的.你要把每个按钮的事件处理代码放到哪里呢?最简单的一种解决方法是每个用到按钮的地方,各自创建子类,各自编写其中逻辑.这些子集各自包含按钮点击后需要执行的逻辑.  

<ImageWithCaption 
src="/refactoring/command/problem2.png" 
caption="后续产生大量的子集.会产生什么问题呢?" 
/>
很快你就会发现这种方法已有很大的缺陷:子类的数量就不得不剧增,如果你不怕改父类代码导致子类崩溃的话,那还没那么大问题.换句话说,你整个应用的代码都变得十分依赖那些变化多端的逻辑代码了.
<ImageWithCaption
src="/refactoring/command/problem3-en.png" 
caption="几个类都实现了相同的功能" 
/>

这就是最大的问题了.像复制粘贴文本这样的操作,需要从多个不同的地方调取.比如用户点击了"Copy"按钮,或选中右击菜单后复制,或直接Ctrl+C.  

起初,如果我们的应用只需一个工具栏就够了的话,把各种操作的逻辑放到多个不同子类中,稍微还可以接受.可是当你实现了上下文菜单,快捷键和其它功能的时候,你不得不重复存在于不同类之中的操作代码,或让新的操作依赖于这些按钮,这就有大麻烦了.  
(感觉自己也没看懂问题是什么?)

## 解决方法
好的设计模式总是能依赖分离原则(principle of separation of concerns)来解决问题的,它能把应用分成多个层次.  
最常见的例子是:一层用于UI展示,另一层用于处理业务逻辑.在C语言中,GUI层就是用于渲染漂亮的画面到屏幕上,捕获用户的输入,并展示用户的操作结果.  
而当需要进行一些关键操作时,比如计算月球轨道(?)或生成年度报告(?)时,GUI层就把这个任务交给专门的业务逻辑层来完成.  

实现的代码大致如此:GUI对象调用业务逻辑对象的一个方法,并将参数传递过去.这个过程通常也被说成:一个对象,向另一个对象发出*请求(request)*.

<ImageWithCaption
src="/refactoring/command/solution1-en.png" 
caption="GUI对象有时可以直接读取业务逻辑对象" 
/>

命令模式一般建议GUI对象不直接发送这些请求,而是把所有请求的细节,比如要调用的对象,方法名,参数列表,单独抽取到一个*命令(command)类*中,用单独的方法来触发这个请求.  
命令对象的作用是作为连接GUI对象和业务逻辑对象的桥梁.有了它后GUI对象就不需要知道业务逻辑对象是如何接收请求,如何处理请求了.它只需要下达命令就能处理其它细节了.

<ImageWithCaption
src="/refactoring/command/solution2-en.png" 
caption="通过命令访问业务逻辑层" 
/>

下一步要做的是让命令实现相同的接口.一般它只有一个不需要参数的执行方法.这个接口可以让同一个请求发送者,使用各种不同的命令,而不用与具体的命令类进行耦合.除此之外,你还可以将命令对象连接到发送者上,从而在运行时有效提升发送者的效率.  

你可能已经发现我们漏了什么东西,对,就是命令参数.GUI层对象可能需要向业务层对象传递一些参数.由于下达命令时我们是传不了参数的(命令不接受),我们要怎么准确下达命令呢?我们的解决方法是:命令自身应预先配置好一些参数数据,或是命令需要自身去获取.

<ImageWithCaption
src="/refactoring/command/solution3-en.png" 
caption="GUI对象通过命令分发工作" 
/>

回到我们的文本编辑器.我们套用到命令模式后,我们就不需要那么多的按钮子类,才实现各种点击行为了.我们只需要在基类`Button`中加上一个单独的属性,它的值是命令对象的索引,点击时执行不同的命令就够了.  

你可能需要实现很多不同的命令类,从而满足不同的操作的结果.并将这些命令与特定的按钮连接起来,这取决于具体按钮需要执行的操作.  

其它GUI元素,像菜单,快捷键,或对话框,都可以用这种方式来实现.它们都会在用户触发时下达各自的命令.你也估计知道了,不同元素,相同的操作,对应的都是相同的命令,这样就不用再重复代码了.  

这样,命令就作为一个中间层,减少了GUI和业务逻辑层之间的耦合了.这只是这种模式的一点点好处而已!

## 真实世界的比喻

<ImageWithCaption
src="/refactoring/command/command-comic-1.png" 
caption="饭店里点菜" 
/>

逛完街后,你去了饭店,坐到窗户旁.此时服务员过来问你点什么菜,写到菜单上.然后服务员把菜单贴到墙上.不久后,主厨看到,取下菜单,并按照菜单开始煮菜.煮好后放到菜盘上,服务员看到后,检查一下菜盘上的菜是否已经按照菜单煮好了,然后端到你面前.  

这里的菜单就是命令.它要等到厨师有空时才会被开始制作.菜单里包含了所有需要煮的菜.这个过程就省掉了主厨直接跟你确认点单的麻烦了.  

<Divider />

## 可应用性
**当你要将操作参数化为对象时可以使用这种模式.**  

命令模式可以将特定的方法调用转化为独立对象.这种转变开创了许多有趣的可能性:你可以以方法参数的方法下达命令,把它们存到别的对象里,运行时中切换命令等等.  
举个例子:你要开发GUI组件,是个上下文菜单,你想让用户自行编辑菜单里的选项,而不影响各个按钮的功能.  

**需要队列化操作,调度执行顺序,或远程执行时可使用命令模式.**  
命令对象跟其它对象一样可以被序列化,可以直接把它转换为字符串,存到文件或数据库里.后续再序列化一下就可以了.你可以以此延迟或调度命令的执行.不过当然不止于此,你还可以通过网络进行队列化,日志编写,或发送命令.  

**当你要实现可逆操作时可用这种模式**  
虽然有很多实现撤销或重做的方法,但命令模式是其中最常用的一种.  
为了实现撤销,你需要实现展示操作过的命令历史.它是一个包含所有执行过的命令对象的栈,其中包括对应时刻应用的相关状态备份.  
这种方法有两个缺陷:  
1. 不容易存储应用的状态,因为它们可能是私有的.这个问题可以改用Memento模式来缓解.
2. 状态的备份可能需要浪费相当多的内存.因此你可能需要寻求另外的实现方式:与其存储过去的状态,不如实现当前指令的逆向操作.虽然逆向操作没那么容易实现,或者根本实现不了就是了.  

## 如何实现这种模式
1. 声明命令接口,包含唯一的执行方法.
2. 把请求提取到具体的命令类中,在命令类中实现命令接口.每个类中都应包括多个用以存储请求参数的属性,以及一个指向实际接收者对象的引用.所有这些属性的值都要由命令构造器来实现初始化.  
3.区分作为命令发送者的类.为它们添加存储命令的属性.发送者只会通过命令接口,实现命令的交接.而且它们自身一般是不会创建命令对象的,只会从客户端代码中接收对象.
4. 把发送者变化一下,这样它们就不用直接发送请求到接收者,而是执行命令了.
5. 客户端应按照以下顺序初始化对象:
* 创建接收者对象.
* 创建命令,并按需把它们与接收者对象链接起来
* 创建发送者对象,并将它们与具体命令链接起来.

## 命令模式优缺点
**优点**  
* *单一职责原则*.将调用类和操作类解耦开来.
* *开闭原则*.你可以在不破坏已有代码的情况下,为应用添加新的命令.
* 实现撤销/重做操作.
* 实现操作的延迟执行.
* 把多条简单命令整合成一条复杂命令.

**缺点**  
* 代码可能会变得很臃肿,因为你在发送者和接收者之间增加了一个新的层面.

## 与其他模式的关系
* 责任链模式,命令模式,调和者模式,还有观察者模式,都是解决请求发送者和接收者之间耦合问题的.
    * *责任链模式*把请求按照链式传递下去,直到其中某个接收者完全解决完了相关问题.
    * *命令模式*实现了发送者和接收者的单边联系(unidirectional connection).
    * *调和者模式*消除了发送者和接收者间的直接联系,迫使它们必须经由调和对象才能实现通信.
    * *观察者模式*让接收者动态地订阅或取消订阅接收请求.

* 责任链模式中的处理器可以以命令的形式实现.这样你可以在同一个上下文对象(由请求提供)中实现多个不同的操作.  
不过还有其它的方法,就是直接把请求处理成一个*命令对象*.这样你就可以在连接成链的不同上下文中执行相同的操作了.

* 结合命令模式和记忆模式(Command and Memento)实现撤回操作.具体而言,命令模式负责对目标对象实现多个操作,记忆模式负责命令执行前对应目标对象的相关状态.
* 命令模式跟策略模式乍看很相似,因为你都可以用它们来参数化对象,向它们传递行为参数.不过模式的意图还是非常不同的:
    * 你可以用命令模式把任意操作转换成对象.操作需要的参数,就是对象的属性.这种转换可以让你延迟操作执行时机,队列化操作,存储命令执行历史,发送命令到远端服务等等...
    * 而策略模式通常是解决同一个问题的不同方法,从而在同一个上下文类中切换不同的算法策略.

* 原型继承可以在你需要把命令历史备份时帮上一点点忙.
* 你可以把"访客(Visitor)"模式看成一种强化版的命令模式.前者的对象可以在多个不同类的多个对象上执行操作.

## 代码示例
**使用例子**: 命令模式在Typescript里时相当常见的.一般这种模式用于候补,为UI元素提供行为参数.它也用于队列化任务,追踪操作历史等等.
**模式辨认**: 抽象接口类(发送者)调用另一个抽象接口类(接收者)内的方法,而这个方法在创建时已被命令的具体实现封装起来了.命令类一般限定于某些具体操作(?).

## 理念例子
以下例子解释了命令模式的代码结构,关注解决以下问题:
* 它需要包括哪些类?
* 这些类各自的作用是什么?
* 模式的各个元素是如何联系起来的?

```ts [index.ts]
// Command接口只声明一个执行命令方法
interface Command{
    execute(): void;
}

// 一些命令可以自行内部实现一些简单操作
class SimpleCommand implements Command{
    private payload:string;
    constructor(payload:string){
        this.payload = payload;
    }

    public execute():void{
        console.log(`SimpleCommand: See, I can do simple things like printing ${this.payload}`);
    }
}

// 然而一些命令可分配更复杂的操作给其它对象,这些对象称为"receivers",接收者
class ComplexCommand implements Command {
    private receiver: Receiver;

    // 私有数据,用于传递给receiver方法
    private a: string;
    private b: string;

    constructor(receiver:Receiver, a:string, b:string){
        this.receiver = receiver;
        this.a = a;
        this.b = b;
    }
    
    public execute(): void{
        console.log('ComplexCommand: Complex Stuff should be done by a receiver object.')
        this.receiver.doSomething(this.a);
        this.receiver.doSomethingElse(this.b);
    }

}
class Receiver {
    public doSomething(a:string):void{
        console.log(`Receiver: Working on ${a}`);
    }
    public doSomethingElse(b:string):void{
        console.log(`Receiver:Also working on ${b}`);
    }
}

class Invoker {
    private onStart: Command;
    private onFinish:Command;

    public setOnStart(command:Command):void{
        this.onStart = command;
    }
    public setOnFinish(command:Command):void{
        this.onFinish = command;
    }

    public doSomethingImportant():void{
        console.log('Invoker: Does anybody want something done before I begin?');
        if(this.isCommand(this.onStart)){
            this.onStart.execute()
        }
        console.log('Invoker: ...doing something really important...');

        console.log('Invoker: Does anybody want something done after I finish?');
        if(this.isCommand(this.onFinish)){
            this.onFinish.execute()
        }
    }

    public isCommand(object):object is Command{
        return object.execute !== undefined;
    } 
}

// 客户端代码可以用任意命令,参数化我们的调用器(parameterize the invoker)
const invoker = new Invoker();
invoker.setOnStart(new SimpleCommand('Say Hi!'));
const receiver = new Receiver();
invoker.setOnFinish(new ComplexCommand(receiver, 'Send email', ' Save report'));

invoker.doSomethingImportant();
```
<hr />
<hr />

```txt [Output.txt]
Invoker: Does anybody want something done before I begin?
SimpleCommand: See, I can do simple things like printing (Say Hi!)
Invoker: ...doing something really important...
Invoker: Does anybody want something done after I finish?
ComplexCommand: Complex stuff should be done by a receiver object.
Receiver: Working on (Send email.)
Receiver: Also working on (Save report.)
```




























