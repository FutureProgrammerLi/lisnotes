# Typescript的三个面试问题
> 是没活硬整的一篇,虽然自己确实对这三个问题不明不白,(导致翻译完也可能不知道翻译的是什么东西).但总要有糊弄的功夫对吧  
> 原文: [Technical Interview Questions -- Typescript](https://dev.to/giulianaolmos/technical-interview-questions-part-2-typescript-1njn)  
> 作者:Giuliana Olmos

## 目录
1. Typescript中的泛型是什么?`<T>`又是什么意思?
2. `interface`和`type`的区别是什么?
3. `any`,`null`,`unknown`,`never`之间的区别又是什么?

## Typescript中的泛型和\<T>是什么?
*简答:*
> Typescript中的泛型用于创建可重用的函数、类和接口(interfaces),配合各种类型一起使用,从而不用声明特定的类型.这样就能避免使用`any`来作为什么类型都可以的,用了等于没用的类型限制候补(catch-all type)了.  
> 而`<T>`是声明泛型的语法,T不是限定的,你还可以用`<U>`,`<M>`,或任意其它提示符.

*它是如何工作的呢?*  
比如说我有个函数,接收的参数和返回的结果类型需要保持一致.如果我限定了该参数的类型,那代码大概会如下:

```ts
function returnElement(element:string):string{
    return element;
}
const stringData = returnElement('Hello world');
```

我当然知道,接收的参数必须是字符串类型的,因为我就是这样声明的.不过如果我要返回其它类型的结果呢?
```ts
const numberData = returnElement(5);
```
IDE会报错,因为实际接收的参数,和返回的结果类型,跟开始声明的并不一样:  
**Argument of type 'number' is not assignable to parameter of type 'string'.**  

解决方法也很简单,那就新创建一个,接收数字参数,返回数字结果的新函数咯?
```ts
function returnNumber(element:number):number{
    return element;
}
```
实现当然是可以实现的,但代码就明显重复冗余了.  
在这一种常见的错误是,为了避免类型不一致的错误,用`any`为参数定型.这就属于"背井离乡","忘记初心","本末倒置"了.  
用TS就是为了限定类型的,用了`any`就手动把这个功能给禁掉了.代码的可维护性也因这个`any`而丢失了.  
```ts
function returnElement2(element:any):any{
    return element;
}
```

为了解决"多态"这个问题,泛型可就有话要说了:
```ts
function returnGenericElement<T>(element:T):T {
    return element;
}
```
函数接收某个类型的参数;这个类型会作为T的值并在整个运行时维持相同的值.  
这样你就能消除冗余代码的同时,保持类型的安全了:
```ts
const stringData2 = returnGenericElement('Hello world');
const numberData2 = returnGenericElement(5);
```
*但我要怎么限定函数接收某种类型的数组呢?*  
我们可以将泛型用于声明数组:
```ts
function returnLength<T>(element:T[]):number{
    return element.length;
}

const stringLength = returnLength(['Hello','world']);
```
实际接收的类型,会成为泛型的值(实际收到字符串,则T为'string'):  
**function returnLength\<string>(element:string[]):number**  

我们还可以在类里面使用泛型:
```ts
class Addition<U>{
    add:(x:U,y:U) => U;
}
```
解释一下上述代码:
* `add`是匿名箭头函数
* 泛型的命名可以是任意的,上述是`<U>`,是`<T>`,如果你想还可以是`<Banana>`.
* 由于我们用的是泛型定义类型,具体类型还不得而知,因此我们不能在类里实现具体的操作.我们要先实例化该类,声明泛型的具体类型,之后再具体实现该函数

```ts
const operation = new Addition<number>();   //实例化

operation.add = (x,y) => x+y;  // 具体实现
console.log(operation.add(5,6)); // 11
```
关于这个问题我想说的最后一点是,泛型是Typescript的功能,它被编译成JS后使命就完成,就没有该功能的了.
```ts
function returnGenericElement<T>(element:T):T{
    return element;
}

// 编译后的JS就没有额外的语法了
function returnGenericElement(element){
    return element;
}
```

## 接口和类型的区别是什么?(interfaces and types)
*简答*
> 1. 接口声明可以合并,类型不可以  
> 2. 你不能在类同时使用`implements`和联合类型  
> 3. 你不可以在有联合类型的接口中使用`extends`关键字

声明合并(declaration merging)是什么东西呢?  
假如说我定义了两个相同名字的接口并在类中使用,那么类会将两个接口中声明的属性类型合并到一起(incorporate both definitions)
```ts
interface CatInterface{
    name:string;
    age:number;
}
interface CatInterface{
    color:string;
}
const cat: CatInterface = {
    name:'Tom',
    age:5,
    color:'Black'
}
```
这对于类型而言是不可行的.**如果你声明了两个相同名字的`type`,那TS就会抛错**
```ts
type dog = {
    name:string;
    age:number;
}
type dog = {        // duplicate identifier 'dog'
    color:string;
}
const dog1: dog ={
    name:'Tom',
    age:5,
    color:'Black',    // Object literal may only specify known properties, and 'color' does not exist in type 'dog'
}
```
可以看出,定义了两个相同命名的`type`,只会取第一个而不是像interface那样合并两个.  

接着"合并"这个话题,我们来分辨一下,`union`和`intersection`.

`联合类型`用以声明某个值可以为多个类型中的一种.这在某个变量需要为多种类型时有用.  
`交叉类型`用于合并多个类型为一体.用`&`操作符实现:
```ts
type cat ={
    name:string;
    age:number;
}
type dog = {
    name:string;
    age:number;
    color:string;
}
// 联合类型
type animal = cat | dog;

// 交叉类型
type intersectionAnimal = cat & dog
```

再回头看看最初的简答第二点你应该就明白什么意思了:类关键字`implements`不能与联合类型共同使用,它需要的是明确的类型或接口定义,否则TS就会抛错.
```ts
//type animal = cat | dog
class pet implements animal {
    name:string;
    age:number;
    breed:string;
    constructor(name:string,age:number,breed:string){
        this.name = name;
        this.age = age;
        this.breed = breed
    }
}
```
**A class can only implement an object type or intersection of object types with statically known members.**  

**`implements`关键字可以配合以下类型使用:**
1. 交叉类型:
```ts
// type intersectionAnimal = cat & dog;
class pet2 implements intersectionAnimal {
    //...
}
```
2. 接口
```ts
//  interface CatInterface {
//     name:string;
//     age:number;
//     color:string;
// }
class pet3 implements CatInterface{
    //...
}
```
3. 单一类型
```ts
type cat = {
    name:string;
    age:number
}
class pet4 implements cat{
    //...
}
```
相同的问题也会出现在`extends`关键字上,你也不能同时使用`extends`和联合类型.  
**接口不能扩展联合类型** 它不知道哪些类型的属性会被继承,需要明确的类型定义.
```ts
// type animal = cat | dog;
interface petUnionType extends animal {
    //...
}
```
**An interface can only extend on object type or intersection of object types with statically known members.**  

不过,你可以`extends`某个接口,交叉类型或单一类型:
```ts
// 接口
interface petCatInterface extends CatInterface{
        //..
    }
// 交叉类型
interface petInersectionType extends intersectionAnimal{
    //..
} 
// 单一类型
interface petCatType extends cat{
    //..
}
```

## `any`,`null`,`unknown`和`never`的区别是什么?
*简答:*
> `Any`, 是最顶层的类型变量(也可以说是全局类型或全局父类型).当我们为变量定型为`any`,那该变量可以是任意类型的值.  
> 一般我们会在变量具体类型不清楚时,或值的类型可能会发生变化时使用.当然我们不推荐使用`any`,我们建议尽量用泛型来取代.  

尽管`any`可以用来进行像函数调用的操作,但TS不会在这个阶段中捕获到任何错误.比如说:
```ts
let anyVariable : any;
anyVariable.trim();
anyVariable.length;
```
你也可以给`any`类型的变量赋任何值,甚至将这个不确定类型的值,赋给其它已经确定类型的值:
```ts
anyVariable = 5;
anyVariable = 'hello';

let booleanVariable : boolean = anyVariable;
let numberVariable : number = anyVariable;
```

> `unknown`,与`any`类型相似,也是"顶级类型",我们会在暂时不清楚变量类型,但之后会确定类型的场景下使用.跟`any`比较,`unknown`稍微"收敛"了一点,还是有使用意图而不是为所欲为的.

如果用`unknown`类型的变量直接调用方法,那会抛出编译时错误:
```ts
let unknownVariable : unknown;
unknown.trim();
unknown.length;
```
**'unknownVariable' is of type 'unknown'.**  

如果要使用它,我们需要先对其进行类型校验:
```ts
if(typeof unknownVariable === 'string'){
    unknownVariable.trim();
}
```
**`unknown`的值可以是任意类型的,但它不能赋值给其它类型已经确定了的变量.(`any`可以.)**  
**`unknown`可以赋值的,已知类型的变量,只有`unknown`和`any`.(所以说它为什么是"less permissive")**
```ts
unknownVariable = 5;
unknownVariable = 'hello';

let booleanVariable2 = unknownVariable;
```
**Type 'unknown' is not assignable to type 'number'**

> `null`, 可以是任意类型的变量.只是说明这个变量声明了,但没有赋值.(declared but not assigned).

如果你要对它赋值,那就改变了它的类型,就相当于出错了:
```ts
let nullVariable :null
nullVariable = 'Hello';
//Type 'Hello' is not assignable to type 'null'
```

> `never`,我们用这个`type`来声明,一个函数没有返回值(?void呢)  
> `void`返回值为空,`never`甚至没有`return`语句.

```ts
function throwError(message:string): never{
    throw new Error(message);
}

function infiniteLoop(): never{
    while (true){
        console.log('hello')
    }
}
```

就此.感谢你能看到这里!