<script setup>
import ImageWithCaption from './components/ImageWithCaption.vue'
import Divider from './components/Divider.vue'
</script>
# 调和者模式
> [原文地址](https://refactoring.guru/design-patterns/mediator)

## 意图
调和者模式是一种行为模式,用以减少对象之间可能混乱的依赖关系.该模式限制了对象之间的直接交流,迫使它们只能通过一个中介对象实现共同合作.

![mediator](/refactoring/mediator/mediator.png)

## 可能遇到的问题
假如你有一个创建和修改用户概况的对话框.它由多个像文本框,校验框,按钮等表单元素组成.

<ImageWithCaption
src="/refactoring/mediator/problem1-en.png"
caption="当应用规模变大时,用户界面的各种元素关系很可能因此也变得混乱"
/>

表单里的一些元素可能需要跟其它表单进行交互.比如说,当用户勾选了"我有一条狗的选项"后,会新增一个文本框,用以填入狗狗的名称.还有可能是,点击提交按钮前,需要对所有表单项进行校验.  

<ImageWithCaption 
src='/refactoring/mediator/problem2.png'
caption="元素之间可能有多种关系.因此,某些元素的变化可能会导致另外的元素也发生变化"
/>

如果你直接在元素定义的代码内解决它们之间的关系的话,那元素的可用性可能就会很低,类的定义也变得相当复杂了.  
比如,由于"我有一条狗"的选项框跟填入狗名称的文本框耦合到一起,你就无法在其它地方服用这个选项框了.这就导致,要么只能一起用,要么都不能用.

## 解决办法
调和者模式的主要思想是,避免组件之间直接联系,使组件各自互相独立.它们之间如果需要合作,就需要调用一个特别的"调和者"对象,将组件的关系重新连接起来.这样做的结果使,组件只会依赖于一个单独的调和者对象,而无需跟多个其它组件耦合到一起.  

回到我们的编辑概况表单,对话框类本身可以作为一个调和者.大部分情况下,对话框类是直到它具备哪些子元素的,所以你不再需要在里面再建立新的依赖.  
<ImageWithCaption 
src='/refactoring/mediator/solution1-en.png'
caption='界面元素需经过调和者对象实现间接交互合作'
/>

最重要的变化是实际表单上的元素.我们先拿提交按钮为例:之前每当用户点击这个按钮,它就会触发校验所有表单项的值.而使用了这种模式后,这个按钮的责任就变成了,简单得不得了的,告知dialog类(调和者对象)它被点击了就可以了.调和者对象得知它被点击后,就会自身实现验证操作,或是把某些任务传递给某个独立的元素.因此,我们的提交按钮不再被多个其它元素捆绑在一起了,它只依赖于调和者对象,dialog类.  

你可以按照这种解耦方式进一步下去,把所有通用接口提取出来,应用到各种对话框中去.接口内应具备一些告知的方法,这样表单元素就可以调用这些方法,告知作为调和者的接口,自身触发了哪些事件.因此,我们的提交按钮现在已经可以跟任意实现了这个接口的对话框类进行交互了.  

调和者模式可以让你把对象之间复杂的关系网,通过一个中介对象给封装起来.类的依赖越少,它本身就越不怕被修改,也越容易扩充,或是重用.  

## 真实世界的类比
<ImageWithCaption
src='/refactoring/mediator/live-example.png'
caption='飞行员之间不会直接互相沟通,以决定谁先着陆.所有的沟通都经由控制塔完成'
/>

飞行员起飞或降落时不会直接与其它飞行员沟通.他们会向"空中交通控制塔"发出指示,后者通过观察机场航道的情况决定各飞机的操作顺序.没有这个控制塔的话,飞行员就不得不直到机场里所有飞机的情况,与多个飞行员共同讨论各自着陆顺序了.真这样做我都不敢想飞机失事率会有多高了.  
控制塔不需控制飞机的整个飞行过程.它的存在只是限制飞行员到机场终点时的操作,因为一个机场里的情况是相当复杂的,这些情况的处理不应该由飞行员承担.

## 可应用性
**当一些类已经跟其它类高度耦合,难以对其进行修改了,你可以考虑使用调和者模式.**  
这种模式可以让类之间的关系提取出来,分隔到一个独立类中去,只改变某个特定组件而无需改变其它组件.  

**当你由于某个组件过度依赖其它组件,而无法在其它地方重用这个组件时,你可以考虑使用调和者模式.**  
使用模式后,组件就变得独立了,与其它组件的关系就变得松散了.它们之间依旧可以通过调和者对象实现间接交流.如果你要在不同的应用中重用相同的组件,你需要实现一个新的调和者类.

**当你创建了大量的组件子类,只是为了在不同上下文中重用一些基础操作时,你可以考虑使用调和者模式.**  
组件间的关系都封装到我们的调和者对象了,我们可以轻易地编写新地调和者类,定义新的组件沟通方式,而不用直接修改组件定义.  

## 如何实现
1. 找出高度耦合的类,想想如果将它们独立开来会有什么好处.(比如更容易维护,或更利于重用)
2. 声明调和接口,编写调和对象希望组件之间可以产生的联系.大部分情况下,一个单一的,从组件接收通知的方法就足够了.  
当你在不同上下文情况下重用组件时,这个接口时相当重要的.只要组件通过继承接口跟调和对象实现连接,你就可以将这个组件,与其它不同的调和对象实现连接.  
3. 实现具体的调和者类.在内部保存所有组件的引用,以通过调和者方法调用任意的组件.
4. 你还可以增强调和者的功能,在内部创建或删除组件对象.这样我们的调和者就更像一个"工厂(factory)",一个"牌面(facade)"了.
5. 组件本身应具备调和者对象的引用.这种联系的创建一般在组件的constructor里就定义好了,接收的参数就是调和者对象.
6. 变更组件的部分代码,把之前直接调用其它组件的方法,变更为调用调和者对象的共用通知方法.把调用其它组件的代码提取到调和者类去.当调和者收到通知时才调用这些具体的,与其它组件相关的代码.

## 优劣势

## 与其它模式的关系

## 伪代码
模式特征: 大部分情况下是简化组件之间的沟通流程."调和"的意思在TS里,跟MVC里的Controller一个样.

### 理念例子
例子用于说明模式代码结构,关注以下问题:
* 类由什么组成?
* 这些类的作用是什么?
* 这种模式下的元素是如何联系到一起的?

```ts [index.ts]
interface Mediator{
    notify(sender:object, event: string): void;
}

class ConcreteMediator implements Mediator{
    private component1: Component1;
    private component2: Component2;

    constructor(c1:Component1,c2:Component2){
        this.component1 = c1;
        this.component1.setMediator(this);
        this.component2 = c2;
        this.component2.setMediator(this);
    }
    public notify(sender:object, event:string): void{
        if(event === 'A'){
            console.log('Mediator reacts on A and triggers following operations:');
            this.component2.doC();
        }
        if(event === 'D'){
            console.log('Mediator reacts on D and triggers following operations:');
            this.component1.doB();
            this.component2.doC();
        }
    }
}
class BaseComponent{
    protected mediator: Mediator;
    constructor(mediator?:Mediator){
        this.mediator = mediator;
    }
    public setMediator(mediator: Mediator):void{
        this.mediator = mediator;
    }
}

class Component1 extends BaseComponent{
    public doA(): void{
        console.log('Component 1 does A.');
        this.mediator.notify(this,'A');
    }
    public doB(): void{
        console.log('Component 1 does B.');
        this.mediator.notify(this,'B');
    }
}
class Component2 extends BaseComponent{
    public doC(): void{
        console.log('Component 2 does C.');
        this.mediator.notify(this,'C');
    }
    public doD(): void{
        console.log('Component 2 does D.');
        this.mediator.notify(this,'D');
    }
}

const c1 = new Component1();
const c2 = new Component2();
const mediator = new ConcreteMediator(c1,c2);

console.log('Client triggers operation A.');
c1.doA();

console.log('');
console.log('Client triggers operation D.');
c2.doD();
```