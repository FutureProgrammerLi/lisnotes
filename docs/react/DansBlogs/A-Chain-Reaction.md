<script setup>
import Greeting from './components/Greeting.vue'
import CollapsableGreeting from './components/CollapsableGreeting.vue';
import WelcomePage from './components/WelcomePage.vue'
</script>
# A Chain Reaction 连锁反应
> https://overreacted.io/a-chain-reaction/  
> 作者:Dan Abramov  
> 好久没留意Dan的微博,发现居然更新了两篇我没看过的,作为忠实粉丝当然要trans一下啦(late迟到了)  
> 为了这篇文章,又遇到了vitepress和tailwindcss的使用问题..依赖是依赖不上了(估计是content配置没对上),直接引了tailwindcss的cdn. 为了写React,又遇到Vitepress暂时没兼容的问题.  
> 奇妙,React+TailwindCSS, 被我用Vue+cdn的方式解决...

我写了一点点JSX:
```jsx
<p className='text-2xl font-sans text-purple-400 dark:text-purple-500'>
    Hello, <i>Alice</i>!
</p>
```
现在这段代码仅仅存在于我的电脑.幸运的是,机缘巧合,你看到了这篇文章,我终于有机会向你展示我的代码了.  
<Greeting />

这到底是什么神奇魔法,能通过电脑向你传输我的代码的呢?  
你浏览器的内部,确定了种种规则,规定如何向你展示一个段落,或是一段斜体字.而这些规则代码会因浏览器的不同而变得不同,甚者,相同浏览器的不同版本也会不同.而且,如何绘制到你的显示器上,也会因计算机系统不同而不同.  
不过,这些实现由于拥有了相同的 _概念名称_(`<p`>代表段落,`<i>`代表斜体),我就可以向你展示我想展示的,而不需要顾虑你的电脑内部是如何把它们展现到你眼前的了.你问我具体怎么实现我也不知道,不过我可以用我所知道的信息,将内容按我所想那样展示给你看(比如给它们添加`className`).感谢互联网标准,满足了按我的方式向你打招呼的期望.（づ￣3￣）づ╭❤～  
像`<p>`和`<i>`这些标签,允许我们按照浏览器标准展示对应内容.不过,不是所有的名称都是有意义的,浏览器的标准仅且只能规定一部分的名称.比如那个紫色的打招呼,我就用了类名`text-2xl`和`font-sans`用以装饰.这些类名不是我想出来的,而是由CSS库Tailwind规定的.我把它引进来了,这篇文章中我就可以按照它的规定,使用它的内容了.  
> \<p>,\<i>-> text-2xl,font-sans  

**所以,我们为什么喜欢给一些东西命名呢?**  
我写标签`<p>`和`<i>`,编辑器能懂我意思.而对于浏览器而言,你也需要向它说,它能懂的语言.当然,你是做网页开发的,它懂的,你也要懂,甚至它还没懂,你就要比它先懂(?).也就是说,名称,使我们达成共识.(share what we understand).  
从根本上说,电脑所执行的都是一些基础得不能再基础的指令--数字相加,相乘,写入内存,读取内存,又或与外设交流,(比如显示器).单单是把`<p>`这个内容,正确地展示到你的显示器上就要执行成百上千条指令.  
如果你直接看这些指令,你很大可能不知道它只是把一个\<p>标签展示出来.这个过程就像你通过零零星星的音符旋律,推断出那首歌的名字一样困难.或许它的本身就不是让人来理解的.你需要抽离一下,抽象一下,翻译成你所知道的语言.  
复杂系统的实现,亦或是下达指令给系统实现,这个双向过程,需要一层一层不同语言的实现,每一层有每一层属于自己的,能够理解的语言,去执行自己的工作.  
每一层有每一层的理解:做驱动的,专注于如何把颜色传递到每个像素之上;做文字渲染的,专注于如何把每个字符转换成像素;到了我们做开发要考虑的,就是这个段落和斜体需要什么颜色了.  
**命名,让生活更便捷**(有了命名我们就可以不去考虑底层是如何实现了)  
我用过很多别人命名的东西.有些是浏览器内置的,比如`<p>`和`<i>`;有些是工具定义的,比如`text-2xl`和`font-sans`.那么这些由我利用他人命名出来搭建出来的东西,是不是也可以为它们命名一下呢?  
比如说,这段代码是什么意思?
```jsx
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    Hello, <i>Alice</i>!
</p>
```
<Greeting/>
你浏览器理解到的这段代码,是一段有CSS类的段落(这些类使文字变大变紫),以及段落内部,有一些文字(这些文字中又有一段斜体).  
可是可是,你理解到的,应该是向Alice打招呼的一段文字,不过这个打招呼的方式,恰巧是一个段落.我还是宁愿把这段代码,理解为这样:
```jsx
<Greeting person={alice} />
```
我自己为这段代码的命名,让我体验到了一些前所未有的灵活性(newfound flexibility).我可以同时向多个人打招呼,不用复制或粘贴之前一段段的代码.我还可以向它们传递不同数据.而如果我需要改变所有打招呼的样式或是方式,只需要在一处(一个代码段里)修改就行了.把这个打招呼的代码段命名一下,我需要关注的,就从原来的"怎么打招呼",变成了"我向谁打招呼了".  
不过,我又遇到了一个问题.  
这段代码虽然被我命名了,可是我的语言,跟你浏览器的语言还是不相通的.你的浏览器知道`<p>`,`<i>`的含义,但它不知道`<Greeting>`又是什么--这是我的语言,属于我的命名.我要把它翻译成你的电脑可以理解的语言,它才能正确地显示给你.  
我要翻译的内容,是把
```jsx
<Greeting person={alice} />
```
翻译成
```jsx
<p className='text-2xl font-sans text-purple-400 dark:text-purple-500'>
    Hello, <i>Alice</i>!
</p>
```
我要怎么做呢?  

***
要命名,先定义.(???)
比如说,`alice`并无意义,直至我给`alice`下定义.
```js
const alice = {
    firstName:'Alice',
    birthYear:1970
}
```
现在,`alice`就有意义了,是一个Javascript对象.  
相似的,我需要定义`Greeting`的意思.  
我需要定义,`Greeting`是向`person`打招呼的一个段落,内容是'Hello',后面接着的是那个人的名,这个名需要用斜体修饰.最后有一个感叹号.
```jsx
function Greeting({person}){
    return (
       <p className='text-2xl font-sans text-purple-400 dark:text-purple-500'>
        Hello, <i>{person.firstName}</i>!
       </p>
    )
}
```
跟`alice`不同,我定义的`Greeting`是一个函数.因为它的内容是根据具体的人物所决定的.`Greeting`是一个代码段--它实现数据的转化,或者可以说是语言的翻译.它把一些数据,转化翻译成了UI界面.  
这个代码段,连接了我和你的电脑(???这个翻译器让我和你的电脑能够交流了)
```jsx
<Greeting person={alice} />
```

没有这个翻译器,你的浏览器就理解不了`Greeting`是什么.而这个翻译器,就把我的理解,转换成了浏览器能够理解的东西.你也看到了,我想要的打招呼,就是一个文字段落而已.(人机交流真是太难了)
```jsx{3-5}
function Greeting({person}){
    return (
        <p className='text-2xl font-sans text-purple-400 dark:text-purple-500'>
            Hello, <i>{person.firstName}</i>!
        </p>
    )
}
```
加上之前对`alice`的定义,最终我获得了这段JSX:
```jsx
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
  Hello, <i>Alice</i>!
</p>
```
终于翻译过来了,把我的理解转换成了浏览器能理解的概念.
<Greeting />
现在我们再教教电脑做其它事吧!  

***

我们来看看,JSX是由什么组成的.(接下来,我们要翻译的语言,是JSX).  
```jsx
const originalJSX = <Greeting person={alice}/>
console.log(originalJSX.type); // Greeting
console.log(originalJSX.props); // { person: { firstName: 'Alice', birthYear: 1970 } }
```
JSX底层为我们创建了一个对象:其中的`type`属性,值是对应的标签名,`props`属性对应的,是该这段JSX中该标签所接收的属性(attributes).  
这里,你可以认为`type`是"代码"(?code?),而`props`是"数据".为了得到想要的东西,我们需要像之前那样,把这些数据"插入"到对应代码之中.  
这是我编写一小段,完成这个"插入"操作的翻译器:
```jsx
function translateForBrowser(originalJSX){
    const {type, props} = originalJSX;
    return type(props);  //?这里又做了什么?只为了提取"数据"和"代码"吗?
}
```
`Greeting`是`type`,`{person:alice}`是`props`,应该不难看出.所以经过这个翻译器的处理,我们得到的结果是:调用`Greeting`函数,参数是`{person:alice}`.  
**Greeting({person:alice})**  
大概变成这个形式了,你会回想起,它的结果会是什么:
```jsx
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
  Hello, <i>Alice</i>!
</p>
```
这就是我想要的!  
你可以理解为,将一段JSX代码传给这个翻译器`translateForBrowser`,得到的是"浏览器端JSX",也就是浏览器能够理解的代码段,能对应上`<p>``<i>`这些浏览器能懂的概念.
```jsx{7-9}
const originalJSX = <Greeting person={alice} />
console.log(originalJSX.type);
console.log(originalJSX.props);

const browserJSX = translateForBrowser(originalJSX);
console.log(browserJSX.type); //'p'
console.log(browserJSX.props); 
    // className:'text-2xl font-sans text-purple-400 dark:text-purple-500',
    // children: [
    //     'Hello', 
    //     { type: 'i',  props: { children: 'Alice' }, '!'
    //     ] 
```
我们可以对这段"browserJSX"做很多东西.比如说,把它转化为HTML字符串再传给浏览器.我也可以先把它转换成一系列操作,用以更新当前已经存在的DOM节点.不过我们先不关注这些.最重要的是我们现在已经得到了这段"浏览器端JSX",浏览器已经可以理解了,我们无需再翻译了.  
我的概念已经向浏览器解释清楚了,剩下的可以交给浏览器了.(`<Greeting/>`消失啦,剩下`<p>`和`<i>`了).  
***

我们试试做些复杂点的功夫:把打招呼这个内容,用`<detail>`标签包裹起来,这样默认下打招呼就需要被展开才能被看到了.
```jsx{1,3}
<detail>
    <Greeting person={alice}/>
</detail>
```
在浏览器中你看到的情况应该是这样的.(点开"详情"可以折叠我的"招呼"~)
<CollapsableGreeting />
现在我要想的是如何把上面的代码转变成下面这样:
```jsx
<details>
    <p className='text-2xl font-sans text-purple-400 dark:text-purple-500'>
            Hello, <i>{person.firstName}</i>!
        </p>
</details>
```

我们先试试之前造的翻译器到这里还好不好用吧?(`translateForBrower`)
```jsx{2-4,9}
const originalJSX = (
    <details>
        <Greeting person={alice} />
    </details>
);
console.log(originalJSX.type); //'details'
console.log(originalJSX.props); //{ children: { type: Greeting, props: { person: alice } } }

const browserJSX = translateForBrowser(originalJSX);
```

你的代码会报错,是`translateForBrowser`里的问题.
```jsx
function translateForBrowser(originalJSX){
    const {type, props} = originalJSX;
    return type(props);  // [!code error]
    //TypeError: type is not a function
}
```

怎么回事呢?原来,`translateForBrowser`中默认`originalJSX.type`是一个函数,像`Greeting`那样.  
然而这次翻译中,我们得到的`type`是字符串`details`.
```jsx{6}
const originalJSX = (
  <details>
    <Greeting person={alice} />
  </details>
);
console.log(originalJSX.type);  // 'details'
console.log(originalJSX.props); // { children: { type: Greeting, props: { person: alice } } }
```

JSX的标签中,如果首字母是小写字母的话(比如`<details>`),它会认为这是内置已有的标签,而不是你所定义的所谓函数.  
由于内置标签的具体实现行为跟你写的代码是没有关联的(它是怎么实现终归由浏览器决定),你也不知道它是怎么实现的,你知道的只是这个标签名字以及它会展示的内容,所以,这里的`type`就只能是`detail`了.  
那,分开处理一下?改一下翻译器?
```jsx{3,5-7}
function translateForBrowser(originalJSX){
    const {type, props} = originalJSX;
    if(typeof type === 'function'){
        return type(props);
    }else if(typeof type === 'string'){
        return originalJSX;  //? return translateForBrowser(originalJSX);
                            //要递归也不是直接递归原JSX,上面的注释是错的,记录自己错误的思路就不改了.下面有答案
    }
}
```

这样改了之后,`translateForBrowser`就只会在`originalJSX.type`是函数时(像`Greeting`那样),才会调用,否则直接返回原本的JSX.  
_(递归一下是不是更好?例子里不就变了什么都没处理了吗?)_

这就是我想要的结果了吗?
```jsx
<details>
    <Greeting person={alice} />
</details>
```

等等,我想要的是这样:
```jsx
<details>
  <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    Hello, <i>Alice</i>!
  </p>
</details>
```

我想跳过`<details>`标签,因为我不知道它是怎么实现的,也不是我想要的可以调用的东西("something functional").可是可是,`<details>`里面的东西,我还是要翻译的啊!  
我们再改改吧:
```jsx{6-12}
function translateForBrowser(originalJSX) {
  const { type, props } = originalJSX;
  if (typeof type === 'function') {
    return type(props);
  } else if (typeof type === 'string') {
    return {
        type,
        props:{ //还有把props传给自带标签的? <details person={alice}></detail> ???
            ...props,
            children:translateForBrowser(props.children)
        }
    };
  }
}
```

这样递归一下,翻译器就会在碰到像`<details>...</details>`这样的情况是,直接返回`<details>...</details>`标签,不过里面的内容,就可以被我的翻译程序所执行了--`Greeting`这样就能被翻译了.
```jsx
<details>
  <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    Hello, <i>Alice</i>!
  </p>
</details>
```

浏览器这回应该听得懂我说的话了吧?
```jsx
<CollapsableGreeting />
```

`Greeting`终于被包裹了.
***

现在假设我们要定义`ExpandableGreeting`,可展开的打招呼.(???不是上面就一直是可展开了吗?还要分开定义?)
```jsx
function ExpandableGreeting({person}){
    return (
        <details>
            <Greeting person={person}/>
        </details>
    )
}
```

如果把这段JSX丢给翻译器,我会得到:(`translateForBrowser()`)
```jsx
<details>
  <Greeting person={alice} />
</details>
```

这不是我想要的,我不要看到`<Greeting/>`这个我懂浏览器不懂的概念.  
其实这是翻译器`translateForBrowser`里的bug.它遇到`ExpandableGreeting`这个函数时,直接就调用它.死板地执行后就直接返回结果了,根本没考虑过,接收的`originalJSX`里面,可能既包含内置标签(`detail`),也包含自定义的标签(`Greeting`).  
不过还好,问题很好解决:碰到自定义标签函数(比如这里的`ExpandableGreeting`),把它先处理,再处理它返回来的结果就好了.
```jsx{4,5}
function translateForBrowser(originalJSX){
    const {type,props} = originalJSX;
    if(typeof type === 'function'){
        const returnedJSX = type(props);
        return translateForBrowser(returnedJSX);
    }else if (typeof type === 'string') {
    return {
      type,
      props: {
        ...props,
        children: translateForBrowser(props.children)
      }
    };
  }
}
```
这个过程需要一个终点:把所有"我的"概念,全部转换成了"浏览器的"概念时就可以停止了.比如说,ifelse路径全部走的string,全都变回了浏览器内置标签;或是翻译器接收到的,是`null`时.把它完善一下,我们的"翻译器"就算是完成了.(覆盖了大部分场景)  
```jsx{2-7}
function translateForBrowser(originalJSX) {
    if(originalJSX == null || typeof originalJSX !== 'object'){
        return originalJSX;
    }
    if(Array.isArray(originalJSX)){
        return originalJSX.map(translteForBrowser); //???还可以是数组!?
    }
    const { type, props } = originalJSX;
    if (typeof type === 'function') {
        const returnedJSX = type(props);
        return translateForBrowser(returnedJSX);
    } else if (typeof type === 'string') {
        return {
        type,
        props: {
            ...props,
            children: translateForBrowser(props.children)
        }
        };
    }
}
```

比如说我一开始是这样的:
```jsx
<ExpandableGreeting person={alice}/>

//经过一次处理
<details>
    <Greeting person={alice} />
</details>

//经过二次处理
<details>
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
        Hello, <i>Alice</i>!
    </p>
</details>
```

到这,我们就向浏览器解释完全了.
***

我们再再深入一点点?  
我要定义一个这样的组件`<WelcomePage />`
```jsx
function WelcomePage(){
    return (
        <section>
            <h1 className='text-3xl font-sans pb-2'>Welcome</h1>
            <ExpandableGreeting person={alice}/>
            <ExpandableGreeting person={bob}/>
            <ExpandableGreeting person={crystal}/>
        </section>
    )
}
```

我们的`originalJSX`是这样的:
```jsx
<WelcomePage />
```

看到这,你能在脑里过一下,它是怎么一步一步转变成浏览器能理解的语言的了吗?  
我们一起逐步过一下吧.  
首先先第一层处理,把`WelcomePage`"溶解掉":
```jsx{1-6}
<section>
    <h1 className='text-3xl font-sans pb-2'>Welcome</h1>
    <ExpandableGreeting person={alice}/>
    <ExpandableGreeting person={bob}/>
    <ExpandableGreeting person={crystal}/>
</section>
```

然后,"溶解掉"`ExpandableGreeting`:
```jsx{3-8}
<section>
    <h1 className='text-3xl font-sans pb-2'>Welcome</h1>
    <details>
        <Greeting person={alice} />
    </details>
    <details>
        <Greeting person={bob} />
    </details>
    <details>
        <Greeting person={crystal} />
    </details>
</section>
```

最后再来"溶解掉"`Greeting`:
```jsx{4-6,9-11,14-16}
<section>
  <h1 className="text-3xl font-sans pb-2">Welcome</h1>
  <details>
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
      Hello, <i>Alice</i>!
    </p>
  </details>
  <details>
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
      Hello, <i>Bob</i>!
    </p>
  </details>
  <details>
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
      Hello, <i>Crystal</i>!
    </p>
  </details>
</section>
```

没了!我定义的所有概念都翻译完了!

<WelcomePage />

这像不像连锁反应?你把一段代码和一些数据混合执行,然后它一步一步地被翻译,直到所有的内容都被翻译成浏览器可以理解的内容.  
你说有个库可以为我们搞定这些你说多好啊对吧对吧!?(自卖自夸是吧,这就转头用Vue)  
等等,什么,你说你的电脑和我之间已经在某处实现了这个过程了?那这个过程又是在哪呢?  
在你电脑?还是--