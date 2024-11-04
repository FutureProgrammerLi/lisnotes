# 学习Typescript时一些自己的问题

**1. 怎么声明一个参数是函数?**
```ts
export function useDebounce<T extends (...args : any[]]) => void>(callback:T,dealy:number){/*... */}

export function useThrottle<T extends Function>(callback:T,delay:number){/* */}
```
二者的区别是什么? 为什么要利用泛型? 为什么不能直接`callback:Function`?

* `Function`是Typescript的内置类型,表示所有函数的类型,是一个更宽泛的类型.
* 缺乏参数信息,如果只用`T extends Function`,就无法确定函数接收什么类型的参数,也无法保证函数的返回类型.所有的函数类型都符合`Function`类型,相当于没用.(仅次于`any`了吧?)

---

* `T extends (...args:any[]) => void)`不仅要求T是一个函数,还表示它接收任意多个,任意类型的参数,且该函数无返回,或返回空值(`void`的意义)
* 类型安全,TS会检查函数的参数类型与期望的类型是否匹配.虽然这里是`(...args:any[])`,本意是剩余参数会整合成数组,而数组项的类型可以是任意的.

---
**`(...args:any[]) => void`表示`T`是一个接收任意数量和任意类型参数的函数,并且没有返回值.`...args:any[]`表示一个参数列表,可以接受多个参数,类型为`any`.** -- from GPT.  

---
**`(...args:Parameters<T>) => {}`又是什么意思?**  
一个函数,接收的参数跟泛型T的类型一样,其实就是避免重写`(...args:any[]) => void`了.