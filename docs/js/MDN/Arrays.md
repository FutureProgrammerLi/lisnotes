# MDN关于Array的介绍总结
> 原文地址:[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

## 创建数组
从一个疑问开始吧: 
```ts
const arr = new Array(10);
console.log(arr);
```

以上代码会创建一个长度为10的数组,还是10作为第一个元素的,只有一项的数组呢?  
提示一下,如果你知道Array.of()方法的作用,你就知道为什么要额外添加上这个静态方法了.(former one, 10*undefined)

## 数组的静态方法
总结下Array中的方法,常见的方法再展开说.不少是看参数就能看出作用的.  
发现了,MDN中的方法是根据A-Z排序的.也算是自己查找的一条线索吧.

* 静态方法
    * 1. Array.from()
    * 2. Array.of()
    * 3. Array.isArray()
    * 4. Array.fromAsync() // 不常用就不介绍了
* 实例属性
    * 1. Array.prototype.length
    * 2. Array.prototype.constructor
    * 3. Array.prototype\[Symbol.unscopables]
* 实例方法(主要, 省略了`Array.prototype`前缀)
    * 1. at(index)
    * 2. concat(arr2)
    * 3. copyWithin(target, start[, end])
    * 4. entries()
    * 5. every(callback)
    * 6. fill(value[, start, end])
    * 7. filter(callback)
    * 8. find(callback)
    * 9. findIndex(callback)
    * 10. findLast(callback[, thisArg])
    * 11. findLastIndex(callback[, thisArg])
    * 12. flat(depth)
    * 13. flatMap(callback)
    * 14. forEach(callback)
    * 15. includes(value[, fromIndex])
    * 16. indexOf(searchElement[, fromIndex])
    * 17. join(separator)
    * 18. keys()
    * 19. lastIndexOf(searchElement[, fromIndex])
    * 20. map(callback)
    * 21. pop()
    * 22. push(element1, element2, ...)
    * 23. reduce(callback)
    * 24. reduceRight(callback)
    * 25. reverse()
    * 26. shift()
    * 27. slice(start, end)
    * 28. some(callback)
    * 29. sort(compareFunction)
    * 30. splice(start, deleteCount, item1, item2, ...)
    * 31. toLocaleString()
    * 32. toReversed()
    * 33. toSorted(compareFunction)
    * 34. toSpliced(start, deleteCount, item1, item2, ...)
    * 35. toString()
    * 36. unshift(element1, element2, ...)
    * 37. values()
    * 38. with(index, value)
    * 39. \[Symbol.iterator]()

## 查找
1. 找元素
    * find(callback)
    * findLast(callback)
    * at(index)
    * includes(value[, fromIndex])

2. 找索引
    * indexOf(searchElement[, fromIndex])
    * lastIndexOf(searchElement[, fromIndex])
    * findIndex(callback)
    * findLastIndex(callback)
## 遍历
条件遍历:
1. every(callback)
2. some(callback)
3. filter(callback)
任意函数遍历:
1. forEach(callback)
2. map(callback)
3. reduce(callback)
4. reduceRight(callback)

## 修改
    增删改
    * push(element1, element2, ...)
    * pop()
    * shift()
    * unshift(element1, element2, ...)
**splice(start, deleteCount, item1, item2, ...)**

## 转换
1. 转换为字符串
    * join(separator)
    * toString()
    * toLocaleString()
2. 扁平化
    * flat(depth)
    * flatMap(callback) // 先map再flat

## 其它
前者改变原数组,后者返回新数组.
1. reverse() 和 toReversed()
2. sort() 和 toSorted()
3. splice() 和 toSpliced()

with(index, value)
splice(start, deleteCount, item1, item2, ...)
sort(compareFunction)
reduce(callback)


    
