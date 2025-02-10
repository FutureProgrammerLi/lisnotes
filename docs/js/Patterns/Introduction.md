# Javascript的设计模式
> 是深入了解前摘抄的一篇概括性文章, 后续可能会深入了解各种模式,本文相当于启动,了解.  
> [原文地址](https://www.freecodecamp.org/news/javascript-design-patterns-explained/#heading-what-are-design-patterns)  
::: details 另外的资源 
* [refactoring.guru](https://refactoring.guru/design-patterns)
* [patterns.dev](https://www.patterns.dev/vanilla)  
... 后续再加
:::

## 什么是设计模式?
设计模式的流行,是一本叫["Design Patterns: Elements of Reusable Object-Oriented Software"的书](http://www.javier8a.com/itc/bd1/articulo.pdf), 简称("GoF")所推动的.它由4位C++开发者所著, 于1994年发布.  
这本书探讨了面向对象编程的能与不能,介绍了23种使用的编程模式,用以解决多种常见的问题.  

这些模式不是什么算法, 具体实现也不尽相同.它们更像是"想法",是"建议",还是"实践抽象".可以在一些特定的场景下解决某一类的问题.  

模式的具体实现依赖于许多不同的因素.但重要的是模式背后的逻辑和思想,为我们提供更好的解决问题的方法.  

也就是说,这些模式是由C++编程者总结并提出的,但只要你所掌握的语言与面向对象有关,你都能或多或少从中学习并利用到实践.虽然它们应用到如JS或其它编程模式时不一定等价使用,有时甚至你还不得不加些死板代码进去.  
它们是否有用,取决于你如何使用它们.知道多一点通用知识总归是好的.(正如每个程序员离不开数据结构和算法一样)

## 设计模式分类
设计模式可以分为三大类:(分类是完整的,具体模式有23种,以下是本文介绍到的)  
* [<b>创建型模式</b>](#创建型模式)
    * [单例模式](#单例模式)
    * [工厂模式](#工厂模式)
    * [抽象工厂模式](#抽象工厂模式)
    * [构造者模式](#构造者模式)
    * [原型模式](#原型模式)

* [<b>结构型模式</b>](#结构型模式)
    * [适配器模式](#适配器模式)
    * [装饰器模式](#装饰器模式)
    * [外观模式](#外观模式)
    * [代理模式](#代理模式)


* [<b>行为型模式</b>](#行为型模式)
    * [责任链模式](#责任链模式)
    * [迭代器模式](#迭代器模式)
    * [观察者模式](#观察者模式)


## 创建型模式
创建型模式包含了各种用以创建对象的技巧.

### 单例模式
**单例**的意思是,一个类只允许创建一个不可变的实例(immutable instance).简单点说是,使用了单例模式,那这个类就只允许有一个对象,且不可被复制或修改.  
当我们的应用需要这种,"唯一真理来源"时,单例模式是非常实用的.  
比如说我们要把整个应用的所有配置,当放到一个单独的对象中.其它任意的重复配置,或对这个对象的修改,都是不被允许的.  
实现这种模式的两种方法是:**使用对象字面量或使用类**.  

::: code-group
```js [使用对象字面量]
const Config = {
    start: () => console.log("App has started"),
    update: () => console.log("App has updated"),
};

// 通过对这个对象进行冻结,我们禁止了任何新属性的加入,以及不让其它代码对这个配置对象进行修改或属性移除.
Object.freeze(Config);
Config.start();
Config.update();

Config.name = 'Robert';  // 尝试添加一个新属性
console.log(Config);    // { start: [Function: start], update: [Function: update] };   上面的代码没有生效, Object.freeze()的功劳
```

```js [使用类]
class Config {
    constructor() {}
    start() {console.log("App has started");}
    update() {console.log("App has updated");}
}

const instance = new Config();
Object.freeze(instance);
```

:::

### 工厂模式
工厂模式提供了一个接口,你可以用它来创建多个对象,创建的对象后续是可被修改的.  
这个模式的一大特点是,创建对象的逻辑都集中到一个代码段中,这样我们就可以用更简易及更好组织的方法来创建对象了.  
这种模式十分常用,也可以通过两种方式实现:**类,或是工厂函数(返回一个对象的函数)**.

::: code-group
```js [使用类]
class Alien {
    constructor(name, phrase) {
        this.name = name;
        this.phrase = phrase;
        this.species = "alien";
    }
    fly = () => console.log("Zzzzzziiiiiinnnnnggggg!!!");
    sayPhrase = () => console.log(this.phrase);
}

const alien1 = new Alien("Ali", "I'm Ali the alien!");
console.log(alien1.name);  // "Ali"
```

```js [使用工厂函数]
function Alien(name, phrase) {
    this.name = name;
    this.phrase = phrase;
    this.species = "alien";
}

Alien.prototype.fly = () => console.log("Zzzzzziiiiiinnnnnggggg!!!");
Alien.prototype.sayPhrase = () => console.log(this.phrase);

const alien1 = new Alien("Ali", "I'm Ali the alien!");
console.log(alien1.name);  // "Ali"
console.log(alien1.phrase);  // "I'm Ali the alien!"
alien1.fly();  // "Zzzzzziiiiiinnnnnggggg!!!"
```
:::

### 抽象工厂模式
抽象模式用于产出一系列相关的对象,而不用具体声明类(produce families of related objects without specifying concrete classes).  
当我们需要创建一些只有某些共同属性和方法的对象时这种模式是很有用的.  

我们需要实现客户端所交互的,一个抽象工厂的接口.由抽象工厂调用对应的具体工厂,交由具体工厂实现具体对象的构建.  
你可以理解为,这种模式是在工厂模式上的一层抽象,之后我们就能创建许多不同类型的对象了,只是具体实现还是交由具体工厂函数或类来完成.  

用代码来解释一下:比如说我们要模拟汽车制造工厂,为它提供原始模型.但有了这个原图,我们不仅可以用于造汽车,我们还能造摩托车,造卡车.

```js
// 每种交通工具有对应的具体类,或者说是具体工厂
class Car {
    constructor(){
        this.name = "Car";
        this.wheels = 4;
    }
    turnOn = () => console.log('Chacabum!!');
}

class Truck {
    constructor(){
        this.name = "Truck";
        this.wheels = 8;
    }
    turnOn = () => console.log('RRRRRRRRRRRRUUUUUUUUMMMMMM!!');
}

class Motorcycle {
    constructor(){
        this.name = "Motorcycle";
        this.wheels = 2;
    }
    turnOn = () => console.log('sssssssssssssssssssshhhhhhhhham!!');
}

// 而以下就是我们客户具体面对并指挥的唯一交互处
// 通过传入参数的不同,调用具体不同的工厂以创建我们想要的交通工具
const vehicleFactory = () => {
    createVehicle : function (type) => {
        switch (type) {
            case 'car':
                return new Car();
            case 'truck':
                return new Truck();
            case 'motorcycle':
                return new Motorcycle();
            default:
                return null;
        }
    }
}

const car = vehicleFactory.createVehicle('car');  // Car { turnOn: [Function: turnOn], name: 'Car', wheels: 4 }
const truck = vehicleFactory.createVehicle('truck');  // Truck { turnOn: [Function: turnOn], name: 'Truck', wheels: 8 }
const motorcycle = vehicleFactory.createVehicle('motorcycle');  // Motorcycle { turnOn: [Function: turnOn], name: 'Motorcycle', wheels: 2 }

```

### 构造者模式
构造者模式是通过"一步步"来创建对象.一般我们需要调用特定的函数或方法,才能对对象添加特定的属性及方法.  
这种模式的特点是,我们将对象属性和方法的创建,分离到各个不同的实体中.  
如果我们定义了一个类,或工厂函数,那通过这个方法实例化出来的对象一般都已经具备了类或函数内声明的,应有的所有属性和方法了.  
不过使用了构造者模式的话,我们可以创建对象,只把需要的属性或方法,通过调用特定方法,添加到对象里.这样的话我们的对象也就更加灵活了.  

这是一个谈["对象复合"](https://www.youtube.com/watch?v=wfMtDGfHWpA&t=3s)的视频,我们也有探讨[这个话题的文章](https://www.freecodecamp.org/news/object-oriented-javascript-for-beginners/#object-composition).

```js
// 先定义我们的对象
const bug1 = {
    name: 'Buggy McFly',
    phrase: "Your debuuger doesn't work with me!",
}
const bug2 = {
    name: 'Martiniano Buggland',
    phrase: "Can't touch this! Na na na na...",
}

//  以下函数接收一个对象作为参数,为对象加上一个方法
const addFlyingAbility = (obj) => {
    obj.fly = () => console.log(`Now ${obj.name} can fly!`);
}
const addSpeechAbility = (obj) => {
    obj.saySmthg = () => console.log(`${obj.name} walks the walk and talks the talk!`);
}

// 之后,我们把前面定义的函数,应用到我们的对象上
addFlyingAbility(bug1);
addSpeechAbility(bug2);

bug1.fly();  // Now Buggy McFly can fly!
bug2.saySmthg();  // Martiniano Buggland walks the walk and talks the talk!
```

### 原型模式
原型模式可以让你以其它对象为原型("blueprint"),从其它对象上继承到它的属性和方法.  

如果你熟悉Javascript,那你对原型链继承,以及JS是如何实现继承的原理应该不陌生.  

最终实现的结果跟我们用类实现继承是差不多的,不过这种模式更为灵活,因为对象之间的属性和方法可以互相分享("shared"),而不依赖于同一个类.

```js
// 先声明两个原型对象上的方法
const enemy = {
    attack: () => console.log("Pim Pam Pum!"),
    flyAway: () => console.log("Flyyyyy like an eagle!!"),
}

// 声明需要继承原型对象的另外一个对象
const bug1 = {
    name: 'Buggy McFly',
    phrase: "Your debuuger doesn't work with me!",
}

// 通过Object.setPrototypeOf的方法,设置对象间的继承关系
Object.setPrototypeOf(bug1, enemy);

// 用Object.getPrototypeOf(),读取对象的原型,确认先前的代码正常运行了
console.log(Object.getPrototypeOf(bug1));  // { attack: [Function: attack], flyAway: [Function: flyAway] }/

console.log(bug1.phrase);  // Your debuuger doesn't work with me!
console.log(bug1.attack());  // Pim Pam Pum!
console.log(bug1.flyAway());  // Flyyyyy like an eagle!!
```

## 结构型模式
结构型模式是指,如何将多个对象和类集成为更大的结构(ensemble into larger structures).  

### 适配器模式
适配器模式可以让我们将两个有着不兼容接口的对象,实现兼容交互.  

比如说你的应用通过API返回了XML格式的内容,并将这些内容发送到另外的API来处理.可是后者API只接受JSON格式的内容.这样你就不能直接把接收到的XML格式内容直接转发出去了,你需要先把信息**适配**一下.  

我们还可以用更简单的方式来解释:一个数组,数组项是由城市名和居住人口数量组成的对象;一个函数,返回这些城市中,人口最多的一个.  
本身数组的人口数量值得的单位是"百万", 但如果后续新增加时,**没有了数字的单位转化**,直接就是一长串数字了.  
这要怎么办呢? (要么变数组项,要么就要变函数了吧?)
```js
// 我们的数组
const citiesHabitantsInMillions = [
    { city: 'London', habitants 8.9 },
    { city: 'Rome', habitants 2.8 },
    { city: 'New York', habitants: 8.8 },
    { city: 'Paris', habitants 2.1 },
];

// 要加入到数组的新城市
const BuenoAires = {
    city:'Bueno Aires',
    habitants: 3100000,  // 异端,单位没有转化为百万
};

// 适配函数来了
// 参数是新加入的城市对象,将"habitants"的值转换为相同的单位,百万
const toMiilionAdapter = (city) => {
    city.habitants = parseFloat((city.habitants) / 1000000).toFixed(1);
}
toMiilionAdapter(BuenoAires);

citiesHabitantsInMillions.push(BuenoAires);

const MostHabitantsInMillions = () => {
    return Math.max(...citiesHabitantsInMillions.map(city => city.habitants));
}

console.log(MostHabitantsInMillions());  // 8.9
```

### 装饰器模式
装饰器模式可以通过包装的方法,向目标对象添加上新的行为.如果你对React稍微了解,HOC其实就是这个模式的体现.  
技术上讲,React里的组件时函数而非对象.但如果转头想想React的Context或Memo,我们其实就是在践行这种模式: 把组件作为参数传递给Context或Memo, 之后这些组件就增强,就多了某些新的特性了.  

以下例子中,我们把组件以props形式传递给ContextProvider:
```tsx
import { useState } from 'react';
import Context from './Context';

const ContextProvider: React.FC = ({ children }) => {
    const [darkModeOn, setDarkModeOn] = useState(true);
    const [englishLanguage, setEnglishLanguage] = useState(true);

    return (
        <Context.Provider value={{ 
            darkModeOn,
            setDarkModeOn,
            englishLanguage,
            setEnglishLanguage,
        }}>
            {children}
        </Context.Provider>
    )
}
export default ContextProvider;
```
之后我们将整个应用,利用上下文给包裹起来.
```tsx
export default function App() {
    return (
        <ContextProvider>
            <Router>
                <ErrorBoundary>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Header />
                    </Suspense>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        {/* ... */}
                    </Routes>
                </ErrorBoundary>
            </Router>
        </ContextProvider>
    )
}
```
之后我们就可以在应用的任何地方,通过`useContext`来获取上下文中的值了(就是`ContextProvider`中`value`的值).

```tsx
const AboutPage : React.FC = () => {
    const { darkModeOn, englishLanguage } = useContext(Context);
    return (
        // ...
    )
}
export default AboutPage;
```
重申一下,例子和原书所说的,关于装饰者模式的描述可能有些出入,不过我认为背后的应用原理是一致的:通过包装的方式,增强源对象的功能.

### 外观模式(Facade Mode?)
外观模式,提供一个简化的接口,接入到另外的库,框架,或任意其它复杂类.  
这种模式的应用几乎随处可见.React本身,其它无数三方库基本有用到这种模式.尤其是声明式编程思想中,这种思想主要就是要向开发者提供抽象接口,隐藏背后的实现细节.  

其中的例子有,Javascript原生的`map`,`sort`,`reduce`和`filter`方法.它们底层的实现都是依赖`for`循环的.  

组件库MUI也有用这种模式. 而在下面的例子中,库直接为我们提供了带有内置特性及方法的组件,这样我们就可以更快地编码了.  

当这些组件被编译到HTML后,功能是实现了,但具体是如何实现的,只有HTML理解.这些我们接触到的组件不过是方便我们使用而存在的.  

```tsx
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
){
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

```

### 代理模式
代理模式,是为一个对象提供一个替身.模式的用意是,在对真正的对象进行操作之前或之后,先让替身代理进行一些操作.  
这里我又要说了,如果你对ExpressJS熟悉的话,你应该又要熟悉这种模式了.  
因为Express就是NodeJS APIs的一个"替身",它的一大特性就是中间件(middlewares)的机制.  
中间件也不是什么特殊的东西,就是在请求真正到达接口之前/之时/之后,执行一些代码,仅此而已.  
比如我们有一个验证token有效性的函数.无需留意其细节,你只需知道函数的参数是token,执行结束后调用`next()`方法就可以了.
```js
const jwt = require('jsonwebtoken');

module.exports = function authenticaToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.status(401).send(JSON.stringify('No access token provided.'));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send(JSON.stringify('Wrong token provided.'));
        next()
    })
}
```

这个函数就是一个中间件.我们可以用以下方法,把它应用到任何需要验证token的接口上.  
我们只需把中间件放在接口地址和接口定义之间就可以了:
```js
router.get('/:jobRecordId', authenticateToken, (req, res) => {
    try {
        const job = await JobRecord.findOne({_id: req.params.jobRecordId});
        res.status(200).send(job);
    } catch (error) {
        res.status(500).json(error);
    }
});
```  
以上接口,如果请求中没提供token或token值错误的话,中间件就会返回对应的错误信息.而token是合法的话,中间件就会调用`next()`方法,之后执行接口内的逻辑.  

我们当然可以直接把中间件的定义,直接写到接口定义里,这样就不用担心中间件相关的事情了(顺序或者有没有执行).不过!重点是!我们把这些逻辑抽象出来了!可以在任何接口中重用了!  

再再重复一次,上面例子跟原书作者的描述可能有出入.但背后的逻辑是一样的:控制对象的访问,从而在特定时刻进行操作.(?)

## 行为型模式
行为设计模式,用于控制不同对象之间的交互及各自责任的分配.

### 责任链模式
责任链模式,是将请求沿着一系列处理器传递下去.每个处理器各自决定,要处理请求,还是直接把请求传递给下一环.  
这种模式的体现可以直接拿之前的例子来说明,它就是之前的Express中间件.它们本质上就是处理请求,或是传递给下一个处理器的,处理器统称.  

其它相关的例子是,任何需要通过链式步骤处理信息的系统.不同实体的每个步骤,各自负责自己能实现的操作.只在某些特定情况下,自身实体的处理信息才会传递到另外的实体中.  

典型的前端调用API的流程如下:
* 有专门用于渲染UI组件的函数
* 渲染完毕后,另外的函数调用API向后端请求
* 接口接收到正确参数后,信息会被传到另外的函数,在另外的函数中以特定方式对数据进行排序,并存储到变量去.
* 变量存储到需要的信息后,又有另外的函数把之前的信息渲染到UI上.

我们可以通过以上看到,不同的实体间是如何通过合作协调来实现某一具体任务的.一环负责一项任务.从代码上就能实现模块化,将逻辑分离开来了.  

### 迭代器模式
迭代器模式是用来遍历集合中的元素的.乍看起来简单得不得了,但实际上并非如此.  
Javascript内置的许多用于遍历数据的方法,就是这个模式的体现.(`for`,`forEach`,`for...of`,`for...in`,`map`,`reduce`,`filter`等)  
像树,图这些更为复杂的数据结构,也有各自更为复杂的遍历算法.这些也是迭代器模式的代表.  

### 观察者模式
观察者模式可以让你实现一种发布-订阅的机制,被观察的对象可以在发生变化时,通知所有订阅了这个对象的其它对象.  
你也可以理解为,我们为对象添加了一个事件监听器,当对象变化时,我们据此做些事情.  
React的`useEffect`钩子,就是这种模式的体现.这个函数的一种用法就是在声明后执行某些内容.  
这个hook主要有两个部分: 可执行的函数体,及依赖项数组.如果数组是空的话,函数体就会每在组件渲染后都执行一次.  
```js
useEffect(() => {
    console.log('Component has rendered.');
}, []);
```
而如果依赖项非空,函数体就会在依赖项发生变化时被执行
```js
useEffect(() => {
    console.log('var1 has changed.');
}, [var1]);
```
Javascript原生的事件监听器也可以看作是这种模式的体现.另外的像RxJS这样以"响应式"编程为理念的库,哪怕它们用于处理系统中的异步信息和事件的,也是这种模式的体现.

## 总结
如果你想了解更多关于这个模式的知识,我建议以下两个资源
* [great Fireship video(youtube, 要翻墙)](https://www.youtube.com/watch?v=tv-_1er1mWI)
* [refactoring.guru](https://refactoring.guru)


--- 
感谢你能看到这里!  
本文仅作入门了解,详细可以自行深入!













