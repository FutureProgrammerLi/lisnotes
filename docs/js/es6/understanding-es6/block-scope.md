# 块级作用域绑定

```js
let number = 1;
var number = 2;

//报错,var会全局提升,已经声明的变量let不能在相同作用域内重复声明.
```

```js
var number = 1;
if(condition){
    let number = 1;
}
// 不会报错,let的作用域不在全局
```

```js
let num =1;
function test(){
    var num =1;
    return 
}
//会报错,num被提升到全局而不是函数作用域内.
```

`let`和`const`在作用域上行为一致,区别是: **`const`声明的常量一旦被赋值,则不能再赋值.**  
`let`声明变量,`const`声明常量.不存在只声明的常量.
```js
let number; // 可行
const COLOR // 不可行,必须同时声明和赋值
// MISSING initializer in const declaration
```

`const`声明的对象,值可以修改,绑定不可以修改.  
内存空间不能变,存的内容可以随便变.
```js
const person = {
    name:"Nicholas"
};

person.name = "Greg";  //ok

person = {
    age: 20;
};  //wrong :TypeError, Assignment to constant variable
```

## 临时死区Temperal dead zone(TDZ)

神奇,你猜下面哪段代码会报错,哪段又不会报错?
```js
console.log(typeof value);  
if(true){
    let value = 1;
}
```

```js
if(true){
    console.log(typeof value);
    let value = 1;
}
```

答案揭晓:**第一段不报错,第二段会报错**.  
其实也可以理解,第一段代码全局作用域内本来就访问不了value的值,返回个undefined已经很给面子了.  
第二段报错,`Reference Error: Cannot access 'value' before initialization.  
**引擎知道代码段内有`value`这个变量,但你不能在这个变量的声明前就使用它.**

## 用IIFE解决循环中相同引用的问题
这么多年过去了这个例子还是这么难理解...
```js
var funcs = [];
for(var i = 0;i++;i<10){
    funcs.push(function(){
        console.log(i);
    });
}
```
期望行为是输出从0到9.实际行为是输出了10次10.  
原因是:"循环里的每次迭代同时共享着变量i,循环内部创建的函数全都保留了对相同变量的引用.循环结束时变量i的值为10,所以每次调用console.log都会输出数字10."  

解决办法1:IIFE
```js
var funcs = [];
for(var i=0;i++;i<10){
    funcs.push(
        (function(value){
        return function(){
            console.log(value);
        }
    }(i))
    )
}
```
解析:"在循环内部,IIFE表达式为接受的每个变量i都创建了一个副本并存储为变量value.这个变量的值就是相应迭代创建的函数所使用的值,因此能满足期望输出0~9."

解决办法2:`let`命令
```js
const funcs = [];
for(let i=0;i++<i<10){
    funcs.push(() => console.log(i);)
}
```