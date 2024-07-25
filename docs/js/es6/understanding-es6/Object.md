# 对象

看完深入理解ES6的对象和Set/Map这两章,感觉能记住的不多,暂且先"盲"记录下来已经记住的内容吧.

1. Object.assign()
2. super
3. Set/Map特有的方法
4. WeakSet/WeakMap

## 1.Object.assign();
对象浅复制的一种方法.  
`Object.assign(target,source1,source2,source3)`  
将source1,2,3等多个源对象的属性复制到target对象上.如果source2,3对象有相同的属性名,那么值取更后的对象的值.(即后面覆盖前面,同名属性的值最终取source3的).  

## 2.super
对象的方法是怎么定义的?
```js
function greeting(){  //不是方法
    console.log('Hello!');
}

let person = {
    sayHi(){   //是方法
        super();
        console.log('Hi');
    },
    oldFashioned: function(){
        // super();  //Invalid
        console.log('An old way to say, emm, better call bye');
    }
}
```
`[[HomeObject]]`属性,前者没有,后者没有.是一个内部属性,用于跟踪函数在原型链中的原型对象.(?)  
`super`关键字的作用一般用于继承,**它不是一个对象**.

**用ES6定义的对象方法才能使用关键字`super()`,即上面的`sayHi()`.`oldFashioned:function(){//..}`这样就不是ES6新定义的方法.**

## 3. Set / Map
通用的方法有:
* `has()`
* `delete()`
* `clear()`
* `forEach(value,key,self)`

跟数组的区别是:
1. 不能通过索引访问值
2. 键名不能重复,通过`Object.is()`判定键名是否相同.
3. 键名不会像普通对象一样,强制转换为字符串.代码解释可以是以下:
```js
const key1 = {};
const key2 = {};

const obj ={};
obj[key1] = 'Nicholas';
obj[key2] = "understanding-es6";

obj.key1;  // undefined

obj;  //['[object Object]': "understanding-es6"]

const map = new Map([[key1,"Nicholas"],[key2,"understanding-es6"]]);

map.get(key1);  //'Nicholas'
map.get(key2);  //'understanding-es6'


```

Set新增的交并差等方法:[Set新增的一些方法](/docs/js/Set.md)  
`intersection(),union(),difference(),symmetricDifference()`.  
`isSubsetOf(),isSupersetOf(),isDisjointFrom()`.  
*希望你能从名称知道每个方法的作用(不然就是命名不够直觉化了不是你的问题hh)

## WeakSet / WeakMap
跟普通Set/Map对比,两个关键区别是**弱引用,不可迭代**.  
还有一个是:**键名只能是对象**,如果不是,直接初始化的时候就会报错.   

弱引用的后果是,程序没有其它强引用时该值会"消失",被垃圾回收.  
不可迭代的结果是,没有`clear()`方法,不能直接清空.

```js
const key1 = {};
const key2 = {};
let key3 = {};

const map = new Map([[key1,"Nicholas"],[key2,"understanding-es6"]]);
const weakMap = new WeakMap(map);

weakMap.set(key3,'transient value');
weakMap; // {{…} => 'Nicholas', {…} => 'understanding-es6', {…} => 'transient value'}

key3 = null;
weakMap.has(key3);  //false   //弱引用的结果
// weakMap.clear();  //TypeError: weakmap.clear is not a function. 不可迭代的结果
```