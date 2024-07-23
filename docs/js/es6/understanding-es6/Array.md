# Array
## Array.from()

ES6"新"添加的方法.**将类数组(array-like object),及具备Iterator接口的数据结构(Set/Map)转换为真正的数组**

常见的类数组是`document.querySelector('xx')`返回的内容,或是DOM操作返回的NodeList对象,或是具备`length`属性的对象.  
此外还有函数的`arguments`.  
`Array.from`能将具有`length`属性的对象转换为真实数组,这是扩展运算符所不能实现的.

`Array.from(object, mapFunction, thisPointer)`  
希望你能懂参数的意义:(不懂也没关系,有点背离函数本身名称作用)  
* `object`: 需要转换为数组的类数组
* `mapFunction`: 对转换后的数组内容进行map操作,并返回操作后的新数组内容.
```js
const objLike = {
    '0':2,
    '1':4,
    '2':6,
    length:'3'
}
const realArray = Array.from(objLike,v => v * v);

realArray; //[4,16,36]

```
* `thisPointer`: 改变数组的`this`指向.

::: tip
应用的两个例子:  
1. 填充或改变数组内容
```js
const fillEmptyWithZero = Array.from([1, ,3, ,5], n => n||0);
```
2. 检测数组每个值的类型
```js
function myTypeOf(...args){
    return Array.from(args,item => typeof item);
}

myTypeOf(...[3,true,null,undefined,{}])
//['number', 'boolean', 'object', 'undefined', 'object']
```

:::

## Array.of()
将传入的参数统一转换到一个数组当中.  
过去单独`Array`会出现的问题:
```js
Array();   //[]
Array(2);   //[empty*2]
Array(2,3,4);  //[2,3,4]
```
传一个参返回对应长度的空数组;传两个或以上参数,则返回参数作为内容的一个数组.  
传参个数不同,返回的内容也不同导致重载问题.  

`Array.from`和`Array.of`用ES5的方法写,都可以是:
```js
function ArrayFrom(arrayLike){
    return [].slice.call(arrayLike);
}
function ArrayOf(){
    return [].slice.call(arguments);
}

```
