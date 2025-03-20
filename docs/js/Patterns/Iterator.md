<script setup>
    import ImageWithCaption from './components/ImageWithCaption.vue'
    import Divider from './components/Divider.vue'
</script>

# 迭代器模式
> [原文地址](https://refactoring.guru/design-patterns/iterator)

## 意图
迭代器(Iterator)模式是一种行为设计模式,你可以在不暴露底层结构的情况下,遍历集合的元素.(像数组,栈,树等结构).

![iterator](/refactoring/iterator/iterator-en.png)

## 可能遇到的问题
集合是编程中最经常用到的数据类型之一.然而,一个集合可能只是一组对象的容器而已.  

<ImageWithCaption
src='/refactoring/iterator/problem1.png'
caption='各种类型的集合'
/>

大部分集合都是将元素存储到简单列表中.然而,有些集合可能会基于栈,树,图或其它复杂数据结构存储.  
不过无论集合是什么结构的,它都必须提供一些读取元素的方法,这样其它代码才能使用到这些被存储的元素.我们需要有对应的方法,遍历集合中的元素,而不是重复地读取同一个元素.  
当集合是基于列表形式存储时,这个方法比较简单.你只需要循环读取元素即可.不过,你要如何按顺序遍历一个,像树这样的复杂结构的元素呢?比如,你很聪明,会用深度优先搜索,遍历一棵树.可之后你又需要按广度优先搜索,遍历同一棵树.再然后,你又需要其它遍历方式,比如随机读取树的某个元素.此时你又要怎么办呢?

<ImageWithCaption
src='/refactoring/iterator/problem2.png'
caption='同一个集合可以有多种遍历方式'
/>

越来越多的遍历方式,可能会使集合原本的功能变得模糊,而集合的本身,就是为了存储效率我们才选用的.此外,一些遍历算法可能只适用于某个特定场景,如果把这些算法添加到通用集合中的话,那就太奇怪了.  
此外,客户端代码,可能根本不会在意他们使用的数据,背后是怎样存储起来的.可是由于各种集合都有不同的读取方法,你除了将代码耦合到特定集合类外,别无选择.  

## 解决方法
遍历器模式的主旨是,将集合的遍历行为提取到独立的对象中,我们将这个对象称为"迭代器".  

<ImageWithCaption
src='/refactoring/iterator/solution1.png'
caption='遍历算法由各种遍历器实现.多个遍历对象可以同时遍历相同的数据集合.'
/>

除了实现遍历算法外,遍历器对象会把所有遍历细节给封装起来,比如当前遍历到的位置,以及还剩多少元素没被遍历.因此,我们的遍历器对象互相独立,可以并行地遍历同一个集合.  
一般情况下,遍历器会有一个主要方法,用于获取集合的元素.客户端可以不断调用这个方法,直到它不再返回内容,也意味着遍历器已经遍历完所有元素了.  
所有的遍历器都需要实现相同的接口.这样客户端代码才能与任意集合类型或遍历算法所兼容,有合适的遍历器时才能正确实现遍历.如果你需要一个特殊的方法遍历集合,你只需要创建新的遍历器类,而不用修改集合类型,或是修改客户端代码.  

## 真实世界的比喻
<ImageWithCaption
src='/refactoring/iterator/iterator-comic-1-en.png'
caption='各种游罗马的方式'
/>

比如说你计划周游罗马,参观它的所有景点.但你到了那之后,如果瞎兜圈就太浪费时间了.  
不过,你可以在手机上下载虚拟导游应用来进行导航.这种方式又只能又省钱,你还可以在你觉得有趣的地方想停留多久就停留多久.  
而第三种方案是,你可以花些钱请导游,他对罗马可太熟悉了.他能根据你的喜好制定你的路线,为你讲解每个景点.金钱的力量可太强大了,如果你的实力允许的话.  
所有的选项--无头苍蝇一样乱逛/用手机导航/请导游--都是我们的"遍历器",用于浏览罗马的所有景点.  

<Divider />

## 可应用性
**如果你的数据结构是复杂的,需要隐藏不被客户端代码所知,(为了方便也好,为了安全也好),那你可以使用迭代器模式.**  
迭代器会封装遍历复杂数据结构的细节,仅向客户端提供足够简单的方法,以访问集合中的元素.这样对于客户端而言就足够方便了.而且对于集合本身而言,也保护了自身内部数据的安全性,避免用户直接,无意或恶意对数据进行操作.  

**此模式可用于减少遍历代码导致的冗余.**  
实际遍历方法可能会很臃肿.如果还将应用的逻辑混杂到一起,那前者就可能会使后者变得模糊,难以维护了.将遍历的代码移动到迭代器中,你的业务逻辑代码就更清晰,更简洁了.  

**当你需要遍历不同数据结构,或无法事先知道需要遍历的数据是什么结构时,你可以使用这种模式.**  
这种模式会为集合和遍历器都提供多个通用接口.只要你的代码调用这些接口,你就能配合各种类型的集合和遍历器一同正常工作.  

## 如何实现
1. 声明遍历器接口.它至少需要一个,从集合中获取下一个数据的方法.不过为了方便,你可以添加其它获取方法,比如获取上一个元素,记录当前遍历位置,或是校验遍历器是否已经遍历到元素尾部.
2. 声明集合接口和获取遍历器的方法.方法的返回类型应该与遍历器接口的类型相匹配.有时如果你需要有几个完全不同类别的遍历器时,这个方法的差异可能没那么大.
3. 实现具体的遍历器类,一种遍历器对应一种集合类型.遍历器对象必须与一个单独的集合实例所连接.而这个连接的建立一般在遍历器的constructor中完成.
4. 在集合类中实现集合接口.这里主要是要向客户端提供一个用于创建遍历器的捷径方法,专门为某个集合类而定制.集合对象必须将自身传递给遍历器的constructor,以实现二者的连接.
5. 将客户端代码原有的遍历集合方法替换为遍历器的调用.客户端每次需要遍历时,只需获取到对应的遍历器即可遍历所需的集合元素.

## 优缺点
**优点**  
* 单一职责原则.将遍历算法提取到独立类中,实现客户端代码和集合遍历的职责分离.
* 开闭原则.你可以在不修改已有代码的情况下,添加新的集合类型或新的遍历器类.
* 你可以并行遍历统一集合,因为遍历器对象之间是互相独立的.
* 同样,你可以延迟某次遍历,直到需要时才恢复进行.

**缺点**  
* 简单集合的遍历还用这种模式就显得有点大材小用了.
* 某些集合,自带高效遍历方式,再用自己的遍历器就可能反而没那么高效了.

## 与其它模式的联系
* 你可以用迭代器模式,遍历复合树
* 结合工厂模式和迭代器模式,让集合的子类,返回不同类型的迭代器,这样迭代器就可以与集合相兼容了(?).
* 结合备忘录模式和迭代器模式,捕获当前遍历的状态,必要时可进行回滚.
* 结合访问者模式和迭代器模式,遍历复杂数据结构,在某些节点上进行操作,哪怕这些节点是来自不同的类的.

## 代码示例

```ts [index.ts]
interface Iterator<T> {
    current(): T;
    next(): T;
    key(): number;
    valid(): boolean;
    rewind(): void;
}

interface Aggregator {
    getIterator(): Iterator<string>;
}

class AlphabeticalOrderIterator implements Iterator<string> {
    private collection: WordsCollection;
    private position: number = 0;
    private reverse: boolean = false;
    
    constructor(collection: WordsCollection, reverse: boolean = false) {
        this.collection = collection;
        this.reverse = reverse;
        if (reverse) {
            this.position = collection.getCount() - 1;
        }
    }

    public rewind(){
        this.position = this.reverse ?
            this.collection.getCount() - 1 :
            0;
    }

    public current(): string {
        return this.collection.getItems()[this.position];
    }

    public key(): number {
        return this.position;
    }

    public next(): string {
        const item = this.collection.getItems()[this.position];
        this.position += this.reverse ? -1 : 1;
        return item;
    }

    public valid(): boolean {
        if (this.reverse) {
            return this.position >= 0;
        }
        return this.position < this.collection.getCount();
    }
}

class WordsCollection implements Aggregator {
    private items: string[] = [];
    public getItems(): string[] {
        return this.items;
    }

    public getCount(): number {
        return this.items.length;
    }

    public addItem(item: string): void {
        this.items.push(item);
    }

    public getIterator(): Iterator<string> {
        return new AlphabeticalOrderIterator(this);
    }

    public getReverseIterator(): Iterator<string> {
        return new AlphabeticalOrderIterator(this, true);
    }
}

const collection = new WordsCollection();
collection.addItem("First");
collection.addItem("Second");
collection.addItem("Third");

const iterator = collection.getIterator();

console.log("Straight traversal:");
while (iterator.valid()) {
    console.log(iterator.next());
}

console.log("");
console.log("Reverse traversal:");
const reverseIterator = collection.getReverseIterator();
while (reverseIterator.valid()) {
    console.log(reverseIterator.next());
}

```

<hr>

```txt [Output.txt]
Straight traversal:
First
Second
Third

Reverse traversal:
Third
Second
First
```

--- 
感谢你能看到这里!