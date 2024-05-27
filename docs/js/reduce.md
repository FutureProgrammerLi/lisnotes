# Array.reduce() 是最最最最伟大的
>https://dev.to/mattlewandowski93/arrayreduce-is-goated-1f1j?context=digest  
>作者: Matt Lewandowski  
>许多算法都能利用这个方法,集合了map和filter,以及性能方面也不错.学到就是赚到.  
>23:42 - 2:00 zzz performance considerations  
>vitepress 有个问题,右边h2h3排版不对,显示h2,就没有h3子标题了

# preivew
标题就是我整篇文章都想说的.我想介绍一下,我认为Javascript里数组最最最最最最棒的一个方法,就是Array.reduce().我知道还有其它不错的数组方法,但我还是想说,reduce()不单单是一个方法,它,可以是,一种生活方式!✨  
我不是吹.刚开始接触这个方法时我也害怕搞不懂这个方法.不过用过很多次之后,我已经完全懂了,代码很多片段里都能用到它.它能够帮助我轻易地对数组进行复杂的操作,把数组项转变成我想要的样子.我的代码变得又简洁又效率了.
当然,光用嘴说是没有的.接下来我就举几个应用例子,看看它到底能做些什么,为什么我称它是最最最最最棒的.🐐
# Array.reduce()的9种应用场景

## 场景1:累加数组
Array.reduce()最直接的一种使用方法,就是对数组项的数字进行累加并获取结果.比如说一个数字数组,你想获取它所有项的和:
```ts
const numbers:number[] = [1,2,3,4,5];
const sum:number = numbers.reduce((acc,cur) => acc + cur, 0);
consle.log(sum); //15
```
只需一行代码,你就能计算整个数组所有项的和,厉害吧........  
在这里,初始值我们设定为0,而在每次迭代(iteration),我们就把当前遍历到的元素值,添加到累积值中.  
** 提醒一下:如果你没有设定初始值,那么该数组的第一项就会作为初始值.不过我的做法是每次都设置初始值,这利于我阅读这段代码.
## 场景2:扁平化数组
你遇到过,数组里面嵌套数组的情况吗?(就是数组项依旧是数组)这时你会不会想,"怎么才能把这个数组里嵌套数组,转化成只有一层的普通数组呢?"
```ts
const nestedArray:number[][] = [[1,2],[3,4],[5,6]];
const flattenedArray:number[] = nestedArray.reduce((acc,cur)=>acc.concat(cur),[]);

//如果是多层嵌套,用函数实现需要递归,以下代码是自己的理解非原文
function flattenArray(arr){
  return arr.reduce((acc,cur) => acc.concat(Array.isArray(cur)?flattenArray(cur):cur),[]);
}
//甚者可以直接用Array.flat()
arr.flat(Infinity);
```
例子中我们设置空数组为初始值.然后每次迭代,都把当前遍历到的数组项"连接(concatenate)到累加值上,最后我们就能得到一个由两层嵌套,到普通的数组了.  
我知道你也知道Array.flat()这个方法.不过,我还是建议你知道这个扁平化的过程,这样你能在这基础上作出更多的操作.
## 场景3:对象分类
想象一下你现在有一个全是对象的数组,你要根据对象的某个属性值对它们进行分类.这时候reduce()就有大用处了.
```ts
interface Person{
  name:string;
  age:number
}
const people:People[] = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 },
  { name: 'Dave', age: 30 }
];

const groupeByAge:{[key:number]:Person[]} = people.reduce((acc,cur) => {
  if(!acc[cur.age]){
    acc[cur.age] = [];
  }
  acc[cur.age].push[cur];
  return acc;
},{});

//思路是目标获得一个对象,属性名是年龄,属性值是该年龄的整个对象
//没有年龄,那就创建年龄,值是空数组
//有年龄,就把这个年龄的对象给添加到这个数组.
```
这里我们把一个空对象作为初始值.先查找累积获得的对象中是否已经存在跟当前遍历到的对象的年龄的属性.如果没有就为这个年龄创建一个属性,值是空数组.之后我们把当前这个对象添加到对应年龄的数组之中.最终我们获得的,是一个由年龄是属性名,值为对应年龄的对象数组的,对象.  
当然当然,你也知道groupBy这个自带的分类方法.我也知道你知道我要说什么:这就是基础,看看如何自己实现罢了.
## 场景4:构造查找表(lookup map)
我最喜欢reduce()方法的一个原因就是,我可以利用它,由一个数组创建出一份查找表.这对于性能和代码可读性来说是相当重要的.试试用它替换掉之前的find()或filter()吧.
```ts
interface Produce{
  id:number;
  name:string;
  price:number;
}
const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 699 },
  { id: 3, name: 'Tablet', price: 499 },
];

const productMap:{[key:number]:Product} = products.reduce((acc,cur) => {
  acc[cur.id] = cur;
  return acc;
},{});
console.log(productMap);
/*
Output:
{
  '1': { id: 1, name: 'Laptop', price: 999 },
  '2': { id: 2, name: 'Phone', price: 699 },
  '3': { id: 3, name: 'Tablet', price: 499 }
}
*/
```
这样通过reduce()处理后,你就能通过它们的id直接获取到对应元素了,不需要通过循环来查找某个特定项了.
(????是否有点本末倒置?)
## 场景5:计算项的出现次数
假设你要统计相同元素在数组中出现的次数,reduce()能帮到你.
```ts
//思路是项作为属性,出现的次数作为对应属性值,无则创建并设为1,有则当前对应的值+1;
const fruits: string[] = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const fruitsCount = fruits.reduce((acc,cur) => {
  acc[cur] = (acc[cur] || 0) +1;
  return acc;
},{});
/*
Output:
{
  'apple': 3,
  'banana': 2,
  'orange': 1
}
*/
```
初始值是空对象,我们遍历检查当前元素是否已经作为对象属性存在于累积对象中.如果已经有了,那就在对应的属性中把值加1.如果没有,就把元素名作为属性名,属性值为1添加到累积对象上.最终得到的结果就是一个,数组项作为属性名,出现次数作为对应属性值的对象.
## 场景6:组合函数
这个功能简直函数式编程者狂喜.reduce()对于复合函数来说简直太有用了.你可以用它来创建一连串的函数,一步一步地处理你的数据.
```ts
const add5 = (x:number):number => x+5;
const multiply3 = (x:number):number = > x * 3;
const subtract2 = (x:number):number => x -2;
const composedFunctions = ((x:number) => number)[] =[add5, multiply3,subtract2];

const result: number = composedFunctions.reduce((acc,cur) => {
  return cur(acc);
},10);

console.log(result); //43 => (10+5)*3-2
```
以上就是,把一连串需要进行的函数操作,通过数组的方式,利用reduce,逐个作用到初始值10上面.每经过一个函数的操作,就把该处理结果传给下一个函数继续操作,以此类推.最终得到的结果就是按数组顺序处理获得的计算结果.
## 场景7:实现一个类Redux的状态管理器
如果你用过Redux,你就知道它在状态管理方面有多好用了.不过现在,你可以直接用reduce实现一个简易版的Redux.
```ts
interface State{
  count:number;
  todos:string[];
}
interface Action{
  type:string;
  payload?:any;
}

const initialState:State = {
  count:0,
  todos:[],
}
const actions:Action[] = {
  {type:'INCREMENT_COUNT'},
  {type:'ADD_TODO',payload:'Learn Array.reduce()'},
  {type:'INCREMENT_COUNT'},
  {type:'ADD_TODO',payload:'Master Typescript'},
};

const reducer = (state:State, action:Action):State  => {
  switch(action.type){
    case:'INCREMENT_COUNT':
      return {...state,count:state.count+1};
    case 'ADD_TODO':
      return {...state,todos:[...state.todos,action.payload];
    default:
      return state;
  }
};

const finalState:State = actions.reduce(reducer,initialState);

console.log(finalState);
/*
Output:
{
  count: 2,
  todos: ['Learn Array.reduce()', 'Master TypeScript']
}
*/
//可以看最后一句,熟悉得不得了了,actions.reduce(reducer,initialValue)
//通过处理一下initialValue和reducer,直接变成了一个庞大的,作用于整个项目的状态管理工具了.
```
这个例子中,我们有一个初始状态对象,以及一系列的actions操作.我们的reducer函数中,把状态对象作为累积值,把action作为作用于状态对象的函数,最后返回一个经过一系列处理的,最终状态对象.这一系列操作,就是通过reduce()遍历完成的.其实,这就是一个简易版的Redux.  
类比一下,
reduce((acc,cur) =>{/.../},{});  
reduce(reducer,initialValue);  
对应的,就是 reducer == (acc,cur) => {/.../}  
再对应一下上面的compose functions, return cur[acc]  
actions.reduce(reducer,initialValue);  
Redux的本质是,对状态对象,进行相应的操作,而该对应的行为,定义及发生在reducer之中,最后返回经过一系列操作后的状态对象.
## 场景8:生成无重复项的数组
有时候你的数组中的值可能会重合,而你又要使其唯一.reduce()可以轻易帮你实现这个功能.
```ts
const numbers:number[] = [1,2,3,2,4,3,5,1,6];
const uniqueNumebrs:number[] = numbers.reduce((acc,cur) => {
  //acc.includes(cur)?null : acc.push(cur);
  if(!acc.includes(cur)) acc.push(cur);
  return acc;
},[]);

console.log(uniqueNumbers); // Output: [1, 2, 3, 4, 5, 6]
```
空数组作为初始累加值.遍历到的原数组元素,检查一下是否已经存在于累加器中,这里通过includes()检查.  
如不存在,则添加到累加器;否则直接返回跳过.
## 场景9:计算平均值
那么,要怎样计算数组的平均值呢?reduce()也可以帮到你!(?)
```ts
// 思路, 先计算和,累加到最后一项后除以数组长度.
const grades: number[] = [85, 90, 92, 88, 95];

const average:number = grades.reduce((acc,cur,index,arr) => {
  acc+=cur;
  if(index === arr.length -1){
    return acc / arr.length
  }
  return acc;
},0);
```
我们设置初始值为0.每次迭代到数组项时就把它加到累加值上.当我们迭代到最后一个元素时(通过迭代到的索引值index和整个数组的长度对比),我们就把累加的值除以数组项的个数即可.