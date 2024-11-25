# 一通自言自语

是无意义的自我对话,是阅读后的自我总结,虽然也不知道做过的,读过的还能记得多少,但以之前的经验来看,这样做还算不错.  
之前读过的书,做过的书评虽然大部分都不记得了,但做个summary,跟自己对话一下,self-taught,告诉一下自己看过什么,可能比无意义地略过更容易记住.  

废话到此.

## React docs
https://react.dev/learn/referencing-values-with-refs  
`useRef`, 直观理解为没有`setState`的`useState`.
```ts
function myUseRef(initialValue){
    const [state,nouse] = useState(initialState);
    return state;
}  // 仅用于理解
```

差别可以说很多:
1. 组件状态的变化会引起重渲染,`useRef`不会re-render(官网的challenge2,on/off)
2. 一般用`useRef`来存不用于视图展示的值,因为它的更新不会引起重渲染,变了都不知道.  
    可以用它来存跨越renders之间的值.challenge1就是用`useRef`区分/记住某个interval返回的ID,并依据该ID进行`clearInterval`
3. 变了都不知道的另一个原因是,`useRef`返回的是带有`current`属性的普通对象,你可以直接对它进行修改. `textRef.current = e.target.value;`是可以的,不像`useState`必须用`setState`. 
4. 不重渲染之余,`useRef`可以获取到最新的值.(challenge4,明显突出state和ref在获取值时的区别) 

感觉很好理解的一种方式是, `ref`是`state`的**escape hatch**.都可以用来存东西,但时间跨度不一样:**一个是snapshot,一个是across renders.**(希望读到这的你也能区分这里说的哪个是state,哪个是ref.)

## Clear Thinking
自从上次看到的四个self, 后面内容就没继续了.甚至四个self都要忘记有什么了:(重新找书找出来的)
1. self-knowledge
2. self-confidence
3. self-accountability
4. self-control(?) 

前4节分别解释了这四个分别是什么,后4节仅用两个例子解释,how to combine?? 某个决策如何体现这四个方面? 怪怪的,然后转向model,idol的作用.  

---

比较有感触的点是:  
1. 优秀的人有更高的标准: 达到普通的标准,你就会和大部分人一样,达到普通的结果;想要杰出,就需要有更高的标准.
2. 周围的人,周围的环境在不断无意识地塑造着你. 你选择了与什么人交往,也就选择了怎么样的自己. Most of time,people around us are chosen by chance, instead of our will.(大意是这样)
3. **Personal Boards of directors:** 属于自己的"董事会".就是你idol的合集,可以是任何人,(前人,虚构人,现实人,手机人),只要他们身上有值得你去学习的点,他们就都可以"加入"到你的"决策候审团"中.  
4. 现实环境中我们遇到的人可能无法全然让我们去选择,但手机世界不一样:**我们可以主动选择,自己想模仿,自己想成为的,一切可能的人物.**我们可以去读喜欢的人的作品,看喜欢的人的演讲,了解他们的思想,了解他们的习惯,从而"让他们成为我们自己".  
5. "人无完人",当然偶像也会有缺点,不过关系不大,我们要学的是他们的优点.实在受不了了,瑕掩不了瑜了,那就把他fire掉.自己的董事会,自己选择!

---

现在的自言自语,是"费曼学习法"的一种.虽然感觉把自己脑海里的东西写下来,是用来忘记,也是用来记忆的,但,还挺有趣?  
todos写下来就是为了忘记;读书笔记写下来是为了教育自己,整理自己看过什么内容.  
就此,不如去了解一下费曼学习法? 好主意!
