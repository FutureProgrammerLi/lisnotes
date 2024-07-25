# Set 新增的一些方法

> 原文地址:https://mp.weixin.qq.com/s/KFaXNSbdHlSj0uC4hQmSTg  
> 作者:  林三心不学挖掘机  
> 感觉有点用,是原本数组需要polyfill才能完成的.现在Set数据类型直接原生自带就实现了.

共新增了7个方法: 交并差集(123),差集的并集(4).  
是否为子集,是否为超集,是否无交集(567,故返回的都是`true/false`)
* 1. `intersection`, 找相同
* 2. `union`, 合并,去重
* 3. `difference`, 找不同, 有先后顺序,谁调用的就保留谁的
* 4. `symmetricDifference`, 找不同,无先后顺序,两者不同的放到结果当中

* 5. `isSubsetOf`, 调用的该集合,所有元素是否都存在于另一个集合当中.所有都在则true,有一个或多个不在,则返回false.
    少的,在另一个多的之中是否都存在.(我有的是不是你早就有了,甚至比我还多?)
* 6. `isSupersetOf`, 调用的集合,是否为另一集合的超集.父集且我有你没有,则返回true.
    多的,在另一个少的之中是不是早都存在了.(我有的你是不是有一部分?)
* 7. `isDisjointFrom`, 调用的集合是否与另一个集合无交集.
```js
const set1 = new Set([1,2,3]);
const set2 = new Set([2,3,4]);
const set3 = new Set([4,5,6]);

const set4 = new Set([1,2]);  //for illustration

set1.intersection(set3).size === 0? true : false;  //true
set1.isDisjointFrom(set3);  //true

set1.intersection(set2);  // [2,3]
set1.union(set2);  //[1,2,3,4]
set1.difference(set2); //[1,4]

set4.isSubsetOf(set1); //true
set1.isSupersetOf(set4); // true
```