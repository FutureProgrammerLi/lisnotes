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
|   `handler.set()` | 设置对象属性时的劫持 |
|  `handler.deleteProperty()`  | `delete`操作符的劫持 |
|   `handler.has()` | `in`操作符的劫持 |
|  `handler.construct()`  | `new`操作符的劫持 |
|  `handler.defineProperty()`  | `Object.defineProperty`方法的劫持 |
|   `handler.ownKeys()` | `Object.getOwnPropertyNames`以及`Object.getOwnPropertySymbols`方法的劫持 |
|   `handler.setPrototypeOf()` | `Object.setPrototypeOf()`方法的劫持 |
|  `handler.getPrototypeOf()`  | `Object.getPrototypeOf()`方法的劫持|
|  `handler.apply()`  | 函数调用劫持(?) |
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
    * `value`,属性值;
    * `writable`, 值是否可以被修改;
    * `configurable`, 值是否可以被删除;
    * `enumerable`, 值是否可以被枚举;
    * `get`, 读取该值时,具体返回的内容操作;
    * `set`,设置该值时,具体的操作内容.
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

::: details
**enumerable:false** vs. **handler.has()**  
* `enumerable:false`影响的是属性枚举,比如某个属性该描述符为`false`,`for(const key in obj)`则会略过该属性:
```js
const obj = {b:123};
Object.defineProperty(obj,"a",{
    value:456,
    enumerable:false,
    writable:true,
    configurable:true
});

for(const key in obj){
    console.log(key);       // b,而不会有a
}

```
* `has`影响的是`in`操作符,是直接的操作符而不是上例的循环.
```js
// 引用前文的
"eyeCount" in monster; // true
"_secret" in monster; //false , 被`has()`方法拦截并return false了.
```
:::

### `handler.defineProperty()`
是[[DeineOwnProperty]]内部方法的一个拦截,代理的是对源对象进行`Object.defineProperty()`时的拦截操作.
```js
const handler = {
    defineProperty(target,key,descriptor){       // the descriptor for the property being defined or modified.
        invariant(key,'define');
        return true
    }
}
function invariant(key,action){
    if(key[0] === '_'){
        throw new Error(`Invalid attempt to ${action} private ${key} property`);
    }
}
const monster = {};
const proxy1 = new Proxy(monster,handler);
console.log(proxy1._secret = 'easily scared!'); // throw error: Invalid attempt to define private _secret property.
```

### `handler.deleteProperty()`
是`delete`操作符的拦截方法.通过对代理进行操作,从而作用到实际对象上
```js
const handler = {
    deleteProperty(target,prop){
        if(prop in target){
            // Reflect.deleteProperty(target[prop]);
            delete target[prop];        // 官方是用这个而不是Reflect.deleteProperty
        }
    }
}
const monster = {
    texture:'scaly'
};
const p = new Proxy(monster,handler);
delete p.texture;
monster.texture;  // undefined. 通过代理,该属性被删除
```
## 对Reflect的一些理解和思考
既然能直接在handler里对源对象进行操作,为什么还要看似多此一举地调用`Reflect.get/has/deleteProperty`等等?  
以下是MDN内容,先阅读,再回头看看这个问题得到解决没有.  

`Reflect`这个内置对象包含一些静态方法,用来调用JS对象内部的可拦截方法.它有的方法跟代理的处理器方法是一样的(Proxy Handler,就是最开头的表格内容);  

不像大部分的内置全局对象,`Reflect`并不是构建器,你不可以`new`一个Reflect,哪怕它是一个对象(只有静态方法的对象就不能`new`,怎么定义静态方法?),也不可以把它作为函数调用.`Reflect`所有的属性和方法都是静态的.(像`Math`对象那样)  

`Reflect`的大部分使用场景是,为代理处理器拦截提供默认的行为转发(default forwarding behavior).  
拦截器,当然是用来拦截对对象的某些操作的 -- **它可以用来自定义实现一些对象内置的方法.而`Reflect`API就是用来调用对应的内部方法的.**  
举例来说,下面的代码创建了一个代理`p`,和拦截器`deleteProperty`来拦截`[[Delete]]`这个内部方法.而这里的`Reflect.deleteProperty()`的作用是,直接调用`targetObject`上,默认的`[[Delete]]`行为.  
当然你可以直接用`delete`操作符进行操作,但 **`Reflect`的作用就是能让你省去每个内部方法所对应的语法.**  
(是否可以理解为,记住`Reflect.deleteProperty`,就不用记`delete`操作符?记住了`Reflect.has`,就不用记`in`?)
```js
const p = new Proxy({},
    {
        deleteProperty(target,property){        //  [!code highlight]
            console.log('Deleting property: ' + property);
            return Reflect.deleteProperty(target,property);     // [!code highlight]
        }
    }
)
```
**留意第三行和第五行,由于`handler`和`Reflect`的方法是一样的,所以在设置`handler`行为的时候,就能脱离源对象上相应操作的具体实现,利用`Reflect`帮你调用源对象的对应操作.反正方法名是一样的.**  

`Reflect`的方法还能对内部方法的调用进行更加精细的控制.比如`Reflect.construct()`,只能针对唯一的`new.target`值,构建对应的目标函数.如果你用`new`操作符来调用一个函数,`new.target`的值总是该函数自身.这在subclassing(?)中具有重要作用.  
再比如说,`Reflect.get()`能让那你执行自定义`this`指向的访问器属性,而如果直接调用对象的访问器属性,那`this`的指向只会是指向当前对象.  
几乎所有的`Reflect`方法,都可以通过其它语法或方法实现类似的功能.甚至一些方法直接是`Object`的静态方法,它们间的差异微乎其微.具体差异就要查看对应的`Reflect`方法介绍了.

问题解决了:
1. 记拦截器方法,就能记代理方法,因为是一样的;
2. 对象内部实现方法可能有差异,借用`Reflect`就能避免这些差异,"借用"代理的知识来"消除"内部差异.

---
除了`handler`有的方法,`Reflect`都有之外,`Reflect`还有个静态属性:
* `Reflect[Symbol.toStringTag]`:对应`Object.prototype.toString()`方法;`[Symbol.toStringTag]`的初始值是字符串`"Reflect"`.
* 对于用`Object.prototype.toString()`来判断值的类型时,这个属性可以用来"do some tricks".