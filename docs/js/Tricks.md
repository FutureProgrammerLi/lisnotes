# JS的10个技巧(闭包,记忆等)
> 原文地址:https://medium.com/@bjprajapati381/10-advanced-javascript-tricks-you-dont-know-f1929e40703d  
> 回归基础的前提下了解一些"tricks",或许有悖初衷,但就是想了解,进阶一下.  

## 太长不看
* [1.解构别名](#解构别名)
* [2.函数柯里化](#函数柯里化)
* [3.防抖与节流](#防抖与节流)
* [4.记忆化](#记忆化)
* [5.代理](#代理)
* [6.Generators](#Generators)
* [7.合理利用console](#合理利用console)
* [8.结构化克隆](#结构化克隆)
* [9.自调用函数](#自调用函数)
* [10.带标签的模板字面量](#带标签的模板字面量)

(Cursor一直提示惰性函数,那又是什么?)  
Javascript是门多变的语言,你可以利用很多"隐藏式"的技巧,让你的开发更高效,代码更简洁.以下是10个你可能不知道的高级的Javascript技巧,希望对你有所帮助.


## 解构别名
解构赋值的作用是,直接将数组,或对象的某个属性值直接赋值到特定的变量中去.而别名则是在这个赋值的过程中,对变量进行重命名.这个功能在像从API等获取外部资源时格外有用.  

**用例**: 从API获取数据时,你可能需要为某些属性赋予更加有意义的名字,从而增加代码的可读性与可维护性.

```js
const apiResponse = { 
    first_name: 'John', 
    user_age: 30, 
    address: { 
        city: 'New York', 
        zip: '10001' 
        } 
};
const {
    first_name: firstName,
    user_age: userAge,
    address: { city: hometown, zip: postalCode }
} = apiResponse;

console.log(firstName, userAge, hometown, postalCode);  // John 30 New York 10001
```

**为什么要用?** 这样可以让变量的名字更具备语义化(self-explanatory),从而增加代码的可读性与可维护性.通过别名的方式,以避免名字冲突,提升代码清晰度,后续数据结构变得复杂了也不必过多担心.

## 函数柯里化
柯里化是一个过程,将一个接收多个参数的函数,转变为一个系列的,各自只接收一个参数的多个函数.这种技巧可以让你创造更多灵活度更好,可用性更强的函数.它在函数式编程中有着举足轻重的地位.

**用例**: 为了实现打折,你可以创建多个可重用,可配置的函数.你可以只创建一个柯里化的函数,而避免创建多个独立的,为了处理不同折扣的函数.
```js
const applyDiscount = (discount) => (price) => price - (price * discount / 100);
const tenPercentOff = applyDiscount(10);
const twentyPercentOff = applyDiscount(20);

console.log(tenPercentOff(100));  // 90
console.log(twentyPercentOff(100));  // 80

const applyTax = (taxRate) => (price) => price + (price * taxRate / 100);
const applyTenPercentTax = applyTax(10);

console.log(applyTenPercentTax(100));  // 110
console.log(applyTenPercentTax(twentyPercentOff(100)));  
//88  (100- 100 * 20%) + 80 +  80 * 10%
```

**为什么要用?** 它可以让你预设置函数的参数,从而创造更多模块化且可重用的代码.这种模式极大简化了一些高度可重用的工具函数的创建,从而让代码库更简洁,更易于维护.在函数需要部分被应用,或是根据不同配置而重复使用时,柯里化尤为有用.

## 防抖与节流
防抖和节流是控制某个函数执行频率的技巧.在优化事件处理器,避免过多调用某些函数导致应用性能下降时,我们很有必要使用它们.

### 防抖
防抖可以确保,一个函数在上次被调用后的一段时间里不再被触发时才执行,以避免多次调用.  
(同义)一个函数不再被调用,直到间隔上次最后被调用时一个规定时间之后,才被再次调用.  
(同义)一个函数短时间内被多次触发,只有上次最后被调用后间隔足够长时间,才会被最后调用.  
**像海绵反弹那样,我没完全回弹时你再压,那我继续不回弹.**  
(A function is not called again until a certain amount of time has passed since the last call.)
(感觉翻译都不是很能传达到我的意思..)  
举例场景是用户在搜索框输入,用户输入后一段时间后不再输入了,才真正调用API.  

**用例:** 可以用来优化搜索框输入,减少实际API调用次数,避免服务器过载,只在用户完成输入后真正请求API,以提升用户体验.  

```js
function debounce(func, delay){
    let timeoutId;
    return function(...args){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    }
}

const search = debounce((query) => {
    console.log(`Searching for ${query}`);
}, 300);
document.getElementById('searchInput').addEventListener('input', (e) => {
    search(e.target.value);
});
```

**为什么要用?** 防抖可以减少函数被频繁调用的次数,从而提升性能.只在用户停止触发行为后才真正调用函数,以提升用户体验.函数如果包含网络请求或计算量大的任务时这个技巧尤为必要.

### 节流
节流可以确保,一个函数在特定时间间隔内,每次只调用一次.  
短时间内触发多次,只在特定时间间隔内,每次调用一次.  
**像水龙头滴水那样,随便你触发几次,我只按我设置的频率触发,滴水.**  

**用例:** 优化滚动事件,避免浏览器被过多的事件调用而卡顿,为用户提供更顺滑,响应更快的体验.
```js
function throttle(func, interval){
    let lastCall = 0;
    return function(...args){
        const now = Date.now();
        if(now - lastCall >= interval){
            lastCall = now;
            func.apply(this, args);
        }
    }
}

const handleScroll = throttle(() => {
    console.log('Scrolled')
},300);

window.addEventListener('scroll', handleScroll);
```

**为什么要用?** 以确保函数在特定时间间隔内的执行次数这种方式,防止性能缓慢问题,减少浏览器的负载量,提升用户体验.对于像滚动或窗口大小调整这样的事件处理器而言节流的作用十分重要.  

## 记忆化
记忆化(Memoization)是一种优化技巧,通过缓存复杂运算的结果来避免相同输入,多次计算导致的性能损耗.使用对象也很明显了,就是需要复杂计算的个别函数,尤其是那些不但计算量大,调用频繁,输入参数还经常相同的函数.

**用例:** 提升像斐波那契数列这样的递归函数的性能.如果不用记忆化,每次调用斐波那契函数都会多次重复的计算之前计算过的结果,指数级的增加时间复杂度.

```js
const memoize = (fn) => {
    const cache = {}
    return (...args) => {
        const key = JSON.stringify(args);
        if(!cache[key]){
            cache[key] = fn(...args);
        }
        return cache[key];
    }
}

const fibonacci = memoize((n) => {
    if(n <=1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
});

console.log(fibonacci(40)); // 102334155
```

**为什么要用?** 避免多余的计算,大幅提升相同输入的函数计算能力.记忆化可以将一些效率不高,重复度高的计算转变为可管理的,时间线性的操作,大幅优化一些计算吃紧的任务的表现情况.  

## 代理
Proxy,顾名思义是为某个对象创建一个代理,从而介入对原始对象的一些操作,甚者重定义对原始对象的操作,比如属性读取,赋值,枚举,函数调用等等.我们还可以通过这种方式为对象添加自定义行为.  

**用例:** 对对象属性进行读写时,利用代理实现值校验,日志记录等操作.比如,限制对象某个属性的值只能是规定的类型,并记录到日志中.

```js
const user = {
    name: 'John',
    age:30
};

const handler = {
    get: (target, prop => {
        console.log(`Getting ${prop}`);
        return target[prop];
    }),
    set: (target, prop, value) => {
        if(prop === 'age' && value !=='number'){
            throw new TypeError('Age must be a number');
        }
        console.log(`Setting ${prop} to ${value}`);
        target[prop] = value;
        return true; // ?
    }
};

const proxyUser = new Proxy(user, handler);
console.log(proxyUser.name); // John
proxyUser.age = 35;  // Setting age to 35, successfully.
proxyUser.age = '35'; // Uncaught TypeError: Age must be a number
```

**为什么要用?** 为对象添加自定义行为,像校验,日志记录等,以更全面地控制对象的行为.代理还可以用来实现像控制读取和数据绑定这样复杂的逻辑工作.总之代理是个很灵活的工具,可以用来管理和扩展对象的行为.

## Generators
生成器是可以随时退出和重新执行,并在多次进出之间维持上下文和变量绑定的函数.它们在实现迭代器,以类似同步方式实现异步任务的场景下十分有效.  

**用例:** 实现一个对自定义对象遍历的迭代器.生成器提供简易的方式来定义制定化的迭代行为,这样遍历复杂数据结构时就更加简单了.  

```js
function* objectEntries(obj){
    for(let key of Object.keys(obj)){
        yield [key,obj[key]];
    }
}

const user = { name: 'John', age: 30, city: 'New York' };
for (let [key, value] of objectEntries(user)){
    console.log(`${key}: ${value}`);
}
// name: John
// age: 30
// city: New York
```

**为什么要用?** 生成器是一个十分强大的工具,我们可以利用它来自定义遍历行为,简化异步工作流.处理复杂迭代逻辑和异步工作时也更加容易,代码可读性和可维护性也更强了.利用`co`库,它还可以将异步操作任务,管理为更加直接,更加线性的代码风格.

## 合理利用console
**用例:** 调试复杂对象时增强日志功能.`console`对象的`console.table`,`console.group`,`console.time`等等,都可以提供更加结构化,更多提示化的调试信息.

```js
// 基本的日志功能
console.log('Simple log');
console.error('Error occurred');
console.warn('Warning message');

// 打印表单式数据
const users = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'San Francisco' },
];
console.table(users);

// 分组日志
console.group('User Details');
console.log('User 1');
console.log('User 2');
console.groupEnd();     // ? 没看懂这里的作用, 四条不如上面一条console.table

// 代码执行计时功能
console.time('Timer');
for(let i = 0; i < 1000000; i++){
    // 某些复杂运算
}
console.timeEnd('Timer');  //Timer: 1.18603515625 ms
```

**为什么要用?** 提升数据可读性,更好地组织调试信息,方便定位问题.合理的控制台方法调用可以大幅提升你的调试效率.

## 结构化克隆
利用新方法`structuredClone`深克隆对象.不像之前的浅克隆,结构化克隆方法可以创建对象的深克隆备份,确保嵌套的对象也能被复制.深克隆比较出名的方法还有`JSON.parse(JSON.stringify(obj))`,不过它无法处理像函数,`undefined`,循环引用这些问题.

**用例:** 克隆复杂对象.要改变对象数据而不希望变更原有对象时,深克隆就很有必要了.
```js
const obj = {
    a:1,
    b: {c:2},
    date: new Date(),
    arr: [1,2,3],
    nestedArr:[{d:4}]
};
const cloneObj = structuredClone(obj);

console.log(cloneObj);
console.log(obj === cloneObj); // false
console.log(obj.b === cloneObj.b); // false
console.log(obj.date === cloneObj.date); // false
console.log(obj.arr === cloneObj.arr); // false
console.log(obj.nestedArr[0] === cloneObj.nestedArr[0]); // false
```

**为什么要用?** 利用内置高效的方法,深克隆对象,从而避免手写深克隆可能带来的问题及麻烦.这种方法相较`JSON.parse(JSON.stringify(obj))`更加可靠,能更好处理复杂的数据结构.

## 自调用函数
自调用函数(Self-invoking functions)也被称为立即调用函数表达式(IIFE,Immediately Invoked Function Expressions),在被它们创建时就会被自动执行.它们用于封装代码,避免污染全局作用域,而这正是维持代码整洁性和代码模块化的关键.  

**用例:** 封装代码,避免污染全局作用域.在老旧的JS环境中,尤其是不支持块作用域(`let`或`const`),或需要立即执行某些代码来初始化逻辑的场景下,这种函数尤为有用.

```js
(function {
    const privateVar = 'This is private';
    console.log('Self-invoking function runs immediately');
    // 如需初始化环境则可在这定义
})();

// 里面的私有变量外部是无法访问的
// console.log(privateVar); // Uncaught ReferenceError: privateVar is not defined
```

**为什么要用?** 避免定义全局变量,执行初始化代码后无法在全局作用域中追踪.(?)这种方法可以在大型的代码库中避免冲突,更好地封装函数,提升代码可维护性,避免副作用的产生.

## 带标签的模板字面量
带标签的模板字面量可以让你自定义模板字面量被处理的方式.如果要创建像国际化,净化HTML内容,或生成动态SQL查询语句时,带标签的模板字面量作用十分明显.  

**用例:** 净化用户在HTML表单中输入的内容,以避免XSS攻击.利用这种技巧,可以确保用户的输入内容,安全地被插入到DOM,而中途不会执行任何可能存在的恶意脚本代码.
```js
function sanitize(strings, ...values){
    return strings.reduce((result, string,i) => {
        let value = values[i-1];
        if(typeof value === 'string'){
            value = value.replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#39;');
        }
        return result +value + string;
    })
}

const userInput = '<script>alert("XSS")</script>';
const message = sanitize`User input: ${userInput}`;

console.log(message); // User input: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

**为什么要用?** 这是一种控制和自定义模板字面量输出的机制,可以让你更安全,更灵活地创建模板.带标签的模板字面量除了增强安全性,还可以用来格式化字符串,生成动态内容,以提升代码的健壮性和多功能性(versatility).

## 结论
Javascript可太灵活了,你总能用各种语言特性,编写出更简洁高效的代码.通过将以上技巧结合到你的代码后,你就可以提升你的产能,写出可读性更强的代码.**解构别名,函数柯里化,防抖节流...** 等等,这些都算技巧了.Happy coding!

---

::: details 还记得开始的问题吗?
所以JS中的惰性函数是什么呢?以下由Cursor生成.

<h3>惰性函数</h3>  
惰性函数(Lazy Function)是一种优化技巧,用于减少函数在执行过程中的重复计算.它通过缓存计算结果,从而避免在每次调用时重新计算,提升性能.

**用例:** 在需要频繁调用某个函数,且每次调用结果都相同的情况下,惰性函数可以显著提升性能.

```js
function lazyFunction(){
    if(!lazyFunction.cachedResult){
        lazyFunction.cachedResult = expensiveOperation();
    }
    return lazyFunction.cachedResult;
}
```
(? 这不就是Memoization吗?)

:::

---

感谢你能看到这里!