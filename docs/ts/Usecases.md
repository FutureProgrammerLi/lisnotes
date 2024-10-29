# 7种Typescript的语法使用
> 原文地址: https://mp.weixin.qq.com/s/JIf2U2SkQkq4ExqIvVqfvw
> 原作者:前端宇宙  
> 作为学习Typescript语法使用的一篇较短文章.

## 1.Partial: 灵活处理可选属性

将类型T上的所有属性变为可选属性.

```ts
interface User{
    name:string;
    age:number;
    email:string;
}
function updater(user:User,updates:Partial<User>){
    return {...user,...updates};
}
```

感觉这个部分更新就是为这个场景诞生的,很符合React一些不可变状态更新的方法.  
单独拿出来的意义,为什么不在接口上直接将其全部变为可选属性呢?(`?:`)

* 提高函数参数灵活性
* 减少处理更新时的样板代码
* 过度使用可能适得其反,违背设计初衷

## 2.Required: 确保所有属性都被定义
```ts
interface Config{
    apiKey?:string;
    timeout?: number;
}
function intializeApp(config:Required<Config>){
    // 说是确保了这两个属性不会为`undefined`
}
```
感觉也是强行使用(专门为该场景设用)的场景案例.  
为什么不去掉`?:`,而另外用`Required`语法呢?

## 3.Readonly: 实现不可变数据
```ts
interface Point{
    x:number;
    y:number;
}
const origin:Point = {x:0, y:0}
// origin.x = 1; // error
```

## 4. Record\<K,T>:创建键值对类型
```ts
type Fruit = "apple" | "banana" | "orange";
type FruitInventory = Record<Fruit, number>;

const inventory: FruitInventory = {
    apple: 5,
    banana: 10,
    orange: 15,
}
```
用于限制键值对的类型,而不是单纯的受限于原始类型(上面的`type Fruit`就限制了生成的元组的键只能是特定值).

## 5.Pick\<T,K>:提取类型的子集
```ts
interface Article{
    title:string;
    content:string;
    author:string;
    publishData: Date;
}
type ArticlePreview = Pick<Article,"title" | "author">;       // 是二选一还是4选2? 答:是4选2,为什么用union而不是intersection?

const preview: ArticlePreview = {
    title:"Typescript",
    author:"xxx"
}
```

## 6.Omit\<T,K>:排除特定属性
```ts
interface Product{
    id:string;
    name:string;
    price:number;
    description:string;
}
type ProductWithoutDescription = Omit<Product,'description'>

const product: ProductWithoutDescription = {
    id:'001',
    name:'xxx',
    price:111
}
```

## 7.Exclude\<T,U>:从联合类型T中排除U中的类型
```ts
type AllowedColors = 'red' | 'green' | 'blue' | 'yellow';
type WarmColors = Exclude<AllowedColors,'blue' | 'green'>

const warmColor: WarmColors = 'red';  
// const invalidColor = 'green';     // error

```
`Exclude`和`Omit`有什么区别?前者排除的是联合类型,后者排除的是单一类型?  
`Exclude<AllowedColors,'blue'>`和`Omit<AllowedColors,'blue'|'green'>`会有什么不一样吗?  

### Omit和Exclude的区别是什么?
都可以省略一个或多个不需要的属性生成新类型.  
不过有点怪的是`Omit`省略多个属性时,提示的并非可选值,而是对应属性的详细描述.
```ts
type AllowedColors = 'red' | 'green' | 'blue' | 'yellow';
type Colors = Omit<AllowedColors,'blue' | 'green'>
// inference: type Colors = {
//     readonly [x: number]: string;
//     [Symbol.iterator]: () => StringIterator<string>;
//     toString: () => string;
//     charAt: (pos: number) => string;
//     charCodeAt: (index: number) => number;
//     concat: (...strings: string[]) => string;
//     ... 42 more ...;
//     matchAll: (regexp: RegExp) => RegExpStringIterator<RegExpExecArray>;
// }

type CorlorsExcluded = Exclude<AllowedColors,'blue'>
// inference: type CorlorsExcluded = "red" | "green" | "yellow"

```

来自ChatGPT的回答:
* `Exclude`主要用于联合类型,去除某些**类型**
* `Omit`主要用于对象类型,去除某些**属性**