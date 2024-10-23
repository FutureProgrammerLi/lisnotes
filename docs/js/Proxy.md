# Proxy
今天的缘分是,**Proxy**,一个Vue3用到的内置对象.  
探讨方式是自行MDN:
* [Proxy / handler](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)
* [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

## 基本用法
```js
new Proxy(target, handler)
```
两个参数**都是必须的**.`handler`的定义内容也是有规定的.  
很迷惑的一点是,既然要代理,为什么还要重新定义代理的行为?直接采用目标对象的方法,改为代理执行不就可以了吗?  
限定了代理的行为,不会导致无法代理到源对象的所有行为吗?  
所以想解决的问题有:
1. `handler`规定了代理能完成什么行为?
2. 为什么只能代理部分行为?(似乎是代理只能执行某些源对象具有的内部属性的操作)

## `handler`能代理哪些行为
直接图表解析吧:
| Handler Functions   | Usage |
| ---  | ---|
|  `handler.get()`  | 读取属性值时的劫持  |
|  `handler.deleteProperty()`  | `delete`操作符的劫持 |
|  `handler.defineProperty()`  | `Object.defineProperty`方法的劫持 |
|   `handler.set()` | 设置对象属性时的劫持 |
|   `handler.has()` | `in`操作符的劫持 |
|   `handler.ownKeys()` | `Object.getOwnPropertyNames`以及`Object.getOwnPropertySymbols`方法的劫持 |
|   `handler.setPrototypeOf()` | `Object.setPrototypeOf()`方法的劫持 |
|  `handler.getPrototypeOf()`  | `Object.getPrototypeOf()`方法的劫持|
|  `handler.apply()`  | 函数调用劫持(?) |
|  `handler.construct()`  | `new`操作符的劫持 |
|  `handler.getOwnPropertyDescriptor()`  | `Object.getOwnPropertyDescriptor`方法的劫持  |
|   `handler.isExtensible()` | `Object.isExtensible()`方法的劫持 |
|   `handler.preventExtensions()` | `Object.preventExtensions`方法的劫持 |

### 浅析代理的定义和作用
以下对象有两个属性,一个是经代理访问的,一个是不经代理访问的.我们要做到:
1. 定义对象属性
2. 定义代理行为:对象的某些属性访问经由代理来处理(访问`proxied`属性值时,代理对其进行修改而不返回真正对象的对应值)
3. 为对象添加代理


```js
//1.
const target = {
    proxied:"the real message",
    notProxied:'an exposed message'
};
//2.
const handler = {
    get(target,prop,receiver){        // 这里的receiver是p: Proxy(Object)
        if(prop === 'proxied'){
            return 'a fake message'
        }
        return Reflect.get(...arguments)
    }
}
//3.
const p = new Proxy(target,handler);

p.proxied;       // 'a fake message'
p.notProxied;  // 'an exposed message'
```

就接着这个例子,解析一下`handler.get()`这个方法:  
* 是`[[Get]]`对象内部方法的一个劫持,
* 用于拦截对象属性读取.

```js
new Proxy({},{
    get(target,prop,receiver){}
})
```
* `target`是目标代理对象
* `prop`是需要读取的属性名,可以是字符串也可以是Symbol
* `receiver`,是`this`的指向,一般是代理自身或是继承于该代理的对象

这个方法可以拦截对象属性的访问,如`proxy[foo]`,`proxy.bar`;也可以拦截`Reflect.get()`,或是其它调用内部方法`[[Get]]`的操作.

代理方法有以下要求:
1. 被代理的属性必须是`writable`,`configurable`为`true`.换个说法就是,`Reflect.getOwnPropertyDescriptor`所获取的描述符,必须跟源对象相应属性的描述符一致.
2. 被代理的属性如果没有设置访问器属性,即源对象某属性的get方法为`undefined`,那代理方法的返回也应该返回`undefined`

* 给个前置知识,直接用`Object.defineProperty`为对象设置属性,如果只设置`value`,那其它没有显式声明的配置项全部为`false`;
* `descriptor`的值有以下:
    * `value`
    * `writable`
    * `configurable`
    * `enumerable`
    * `get`
    * `set`
```js
const obj = {};
Object.defineProperty(obj,'a',{
    value:[1,2,3],
    // writable:false,      // 不声明下这些是默认值
    // enumerable:false,
    // configurable:false,
});
const handler = {
    get(target,prop){
        return [5,6,7]
    }
}
const p = new Proxy(obj,hanlder);
p.a;        // 报错,属性值只读,不可配置
```

### `handler.set()`
```js
new Proxy({},{
    set(target,property,value,receiver){}
})
```
限制与`handler.get()`大致一样:对象属性需要是`writable,configurable`; 描述符如果是`configurable:false,set:undefined`,则需要返回假值undefined.

```js
const p = new Proxy({},{
    set(target,prop,value,receiver){
        target[prop] = value;
        console.log(`property set: ${prop} = ${value}`);
        return true;         // ? 不返回会怎样? 没看到影响?
    }
});
console.log("a" in p);  // false
p.a = 10;
console.log("a" in p) // true
console.log(p.a)
```

### `handler.has()`
```js
new Proxy(target,{
    has(target,property){}
})
```
`has`方法必须返回`Boolean`布尔值,返回其它类型的值也会被强制转换为布尔值.

```js
const handler = {
    has(target,key){
        if(key.startsWith('_')){
            return false;
        }
        return key in target;
    }
}
const monster = {
    _secret:'easily scared',
    eyeCount:4
};

const p = new Proxy(monster,handler);
"eyeCount" in p; // true
"_secret" in p; // false
```