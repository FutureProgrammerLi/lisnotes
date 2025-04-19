# 定位
> [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Positioning)

定位可以让你将元素脱离普通文档流(document flow),使元素可以具有不同的表现.比如将某元素始终置于另外元素的上面,或总是逗留在浏览器的视窗内.本文将介绍`position`属性的不同值,以及如何使用它们.  


<h3>期望学习结果</h3>   

* `static` 静态定位使元素在页面上的默认定位  
*  相对定位的元素会保留在普通文档流中,但绝对定位(以及fixed和sticky)的元素会脱离文档流,独自处于一个分隔层上 
* 最终的布局位置可以使用`top`, `right`, `bottom`, `left`属性来修改,但它们会根据`position`的值而有不同的效果 
* 通过定位父元素,改变一个已经具有定位的元素所处的上下文(改父元素来改子元素) 
`position`: `static` , `relative` , `absolute` , `fixed` , `sticky` 

<div className="font-bold text-red-500">为什么要body:relative, element:absolute? <a href="#定位上下文">跳转</a></div>

<div>把<a href="#源码">最初的代码放到最后</a>了,不想占用过多位置才到正文.如果想跟做,建议先创建HTML文件,再回到这篇文章,你会更有成就感的!</div>


## 介绍
我们可以通过定位,实现许多覆盖(overriding)普通文档流的有趣操作.你要怎么从默认的文档流中脱离,稍微改变一下某些盒模型的定位呢?`position`属性就是干这事的.  
或者说,你要如何创建浮动于页面其它部分的元素,或者创建一个无论浏览器窗口怎么滚动,元素依旧保持于页面某个位置的元素呢?定位使之成为可能.(..)  

HTML元素的定位类型有很多种.要让某个定位作用于元素上的话,我们要用到`position`这个属性.

## 静态定位
静态定位是每个元素的默认定位.它的意义是:将元素放到普通文档流上默认的位置上就可以了 -- 一点特殊的变化都没有.  
要将元素设置为静态定位,实在简单不过了:
```html
<html>
    <body>
        <p class="positioned">...</p>
    </body>
</html>

<style>
    .positioned {
        position: static;
        background:yellow;
    }
</style>
```

你可以看到它一点变化都没有,除了背景变成了黄色. 这太正常了,因为之前就说过,**元素的默认定位就是静态定位**.  
[官方例子](https://mdn.github.io/learning-area/css/css-layout/positioning/1_static-positioning.html)

## 相对定位
相对定位是我们首先要了解的非默认定位.它跟静态定位很相似,占据普通文档流中的位置,但你仍可以修改它的最终位置,包裹使其与页面上的其它元素发生重叠.试试将`position`的值改为`relative`看看?

```css
position: relative;
```
直接改定位属性是不会看到有什么变化的.所以要怎么改变元素的位置呢?使用`top`, `right`, `bottom`, `left`属性,我们接下来进一步介绍.

### `top`, `right`, `bottom`, `left`
`top`,`right`,`bottom`,`left`四个属性,一般都会跟`position`值一同设置,用来具体声明将元素移动到哪个位置.试试在`.positioned`类上加上以下属性?
```css
top: 30px;
left: 30px;
```
这些属性的值可以是任意长度单位,比如`px`,`mm`,`rem`,`%`等.  
保存刷新后你会发现黄色的段落发生了偏移.帅吧?  
好吧这可能不是你想要的,为什么我们声明的是`top`,`left`,而它会向下,向右移动呢?有点反直觉吧?  
这样想:某种看不见的力将这个定位盒子,"推动"到了使之相反的方向.所以,比如你声明的是`top:30px`,那就像这个力从盒子顶部往下推了30px.

## 绝对定位
绝对定位变化就大了.

### 先把`position`设置为`absolute`
```css
position: absolute;
```
最明显的区别,黄色底色的段落直接不再在它文档流原先的位置上了.第一个和第三个段落直接凑合到一起,就像第二个段落不存在一样了.  
好吧这就是绝对定位的作用:绝对定位的元素不再存在于普通文档流中了.它自己处于一个有别于其它元素的层面上了.  
你还别说,这很有用:我们可以创建独立的UI元素,而不干扰页面布局上的其它元素了.(?真是好事吗).  
比如,弹窗,控制菜单,回滚侧边栏,或者一些可以拖拽的元素等等.  

其次,你还可以看到元素的位置也改变了.因为`top`,`bottom`,`left`,`right`在`position`的值为`absolute`时会表现得不同.相对定位下这四个属性,是根据元素原本处于文档流中的位置时,发生对应偏移的量.而绝对定位下,这四个属性则指定元素应举例每个包含元素的边的距离.(?)  
换句话说,绝对定位的元素,应距离它最近的祖先元素的边,而不是文档流的边,顶部和左侧30像素.(containing element?)  

::: tip
你甚至可以用这四个属性来调整元素的大小(resize?).试试设置`top:0;bottom:0;left:0;right:0;margin:0;`,看看会发生什么!(...整无语了,确实可以)  
:::

:::tip
是的,`margin`依旧会影响定位后的元素.不过边界重合(margin collapse)不会,还好.
:::

### 定位上下文
哪个元素是绝对定位元素的"containing element"?这取决于祖先元素的`position`属性值.(官方翻译直接将ancestor翻译为父元素了.正确与否请自行判断)  

如果祖先元素都没有明确声明`position`的值,那默认所有祖先元素都是静态定位的.结果是我们绝对定位的元素,被包含在"初始块容器"中(initial containing block).这个初始块容器与浏览器视口一样尺寸,也是包含`<html>`元素的块容器.也就是说,绝对定位的元素会展示在`<html>`元素之外,相对最初的视口进行定位(官方:根据浏览器视口定位).  

从HTML源码上看,我们的绝对定位元素位于`<body>`之内,但其最终定位是距离页面视口上部和左侧30px的位置.  
我们可以改变**定位上下文**,也就是改变绝对定位元素的相对位置元素.我们改变该元素的其中一个祖先元素的定位就可以了:一个绝对定位元素的直接祖先元素(改变非祖先元素的定位是无法改变绝对定位元素的相对位置的.)  
我在说什么?试试将`position:relative`加到`<body>`上看看?

```css
body {
    position: relative;
}
```

看到区别了吗? absolute元素受到限制了,不是任由其在页面上放置了.  
定位元素现在相对于`<body>`元素放置了.  

### `z-index`属性
绝对定位还挺有趣对吧?不过我们还没考虑一个特性.当元素发生重叠时,怎么决定哪个元素在上,哪个在下?  
我们的例子到目前,只有一个处于定位上下文的元素,而且看起来,有定位的元素就是会置于没有定位的元素之上.  
但,如果我们不只一个元素具有定位呢?  
试试将下面的代码加到第一个段落上?
```css
p:nth-of-type(1) {
  position: absolute;
  background: lime;
  top: 10px;
  right: 30px;
}
```
可以看到我们的第一个绿色段落,也移出了文档流,稍微向上移动了一点.它也跟我们之前的黄色段落叠在一起了.  
这是因为`.positioned`类的段落是源码中的按顺序属下来的第二个段落,而源码中越迟定位的元素,其优先级就会高于先定位的元素.  

那你可以改变它们的堆叠顺序吗?可以的,`z-index`就行."z-index"就是"z轴"的表示.之前的教程里说过页面的x-y轴.(0,0)就是窗口的左上角,x轴向右,y轴向下.  

页面其实还有z轴:从屏幕内向外延申(或是任意你可以理解的想法).`z-index`的值影响对应定位元素所处的z轴位置:正值向外,负值向底.而默认定位元素`z-index`的值是`auto`,等效于`0`.

试试下列代码改变元素的z轴位置:
```css
p:nth-of-type(1) {
  z-index: 1;
}
```
绿色段落应该是置于黄色段落上了.  
值得注意的是,**它的值必须是无单位的**.你不能说什么"置于z轴之上23px的位置",没用的.值大的元素会置于值小的元素之上.值在2/3大部分情况下跟值为300? 40000? 没有区别.

## 固定定位
我们再看看固定定位.它跟绝对定位的工作方式一模一样,主要的不同是:绝对定位将元素固定在相对于其位置最近的祖先元素(如果没有那就是相对初始块容器).而固定定位固定元素则是相对于浏览器视口本身.也就是说你可以用它来创建固定位置的UI元素,比如无论如何滚动都始终处于视口内的导航栏.  

用例子说明一下吧.
1. 删除`p:nth-of-type(1)`和 `.positioned`这两个样式类.
2. 移除掉body上的`position:relative`,并为它加个高度:`height:1400px;`
3. 给`<h1>`加上以下样式,`position:fixed`,让其置于视口的顶部.
```css
h1 {
  position: fixed;
  top: 0;
  width: 500px;
  margin-top: 0;
  background: white;
  padding: 10px;
}
```

`top:0`属性是必须的,让其始终置于视窗的顶部.我们让这个标签的宽度与body一样宽,白色背景,一点内外边距,使其不至于不被看到.  

保存刷新后你会看到我们的标题位置被固定了--无论页面怎么滚动,我们的内容哪怕消失了,标题依旧在视窗顶部.  
不过一些内容被我们的标题挡住了.这是因为固定定位的标题也脱离了文档流,所以剩余的内容就会认为它不存在,顺势上移了.  
我们可以将段落下移一点,加上以下样式即可:
```css
p:nth-of-type(1) {
  margin-top: 60px;
}
```
内容应该正常了.

## 粘性定位
`position`还有一个`sticky`值,它比其它值"新"一点.它是相对定位和固定定位的混合体.  
它允许一个定位元素向相对定位元素那样,直到视口被滚动到某个特定位置,然后它就固定在那个位置.  

### 基础例子
粘性定位可以用来构建导航栏,页面滚动时它一起动,滚动到某个特定位置后就固定在页面的顶部.

```css
.positioned {
    position:sticky;
    top:30px;
    left:30px;
}
```

### 滚动索引
粘性定位的一种有趣且常见的用法时,创建一个带有滚动索引的页面,滚动到不同位置,就有不同的标题固定在视口顶部.  
HTML代码大致如下:
```HTML
<h1>Sticky positioning</h1>

<dl>
  <dt>A</dt>
  <dd>Apple</dd>
  <dd>Ant</dd>
  <dd>Altimeter</dd>
  <dd>Airplane</dd>
  <dt>B</dt>
  <dd>Bird</dd>
  <dd>Buzzard</dd>
  <dd>Bee</dd>
  <dd>Banana</dd>
  <dd>Beanstalk</dd>
  <dt>C</dt>
  <dd>Calculator</dd>
  <dd>Cane</dd>
  <dd>Camera</dd>
  <dd>Camel</dd>
  <dt>D</dt>
  <dd>Duck</dd>
  <dd>Dime</dd>
  <dd>Dipstick</dd>
  <dd>Drone</dd>
  <dt>E</dt>
  <dd>Egg</dd>
  <dd>Elephant</dd>
  <dd>Egret</dd>
</dl>
```

CSS代码大致如下. 普通文档流的`<dt>`元素会随内容滚动.而我们为其加上`position:sticky`,以及`top:0`后,如果浏览器支持这个特性的话,标题它就会固定到视口的顶部.视口每个位置对应的标题会相应取代并正确展示.
```css
dt {
  background-color: black;
  color: white;
  padding: 10px;
  position: sticky;
  top: 0;
  left: 0;
  margin: 1em 0;
    
}
```

"粘性"元素,会通过"滚动机制",黏住相对最近的祖先元素.而"滚动机制"就是祖先元素的`overflow`属性值.

## 源码
```HTML
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Static positioning</title>

    <style>
      body {
        width: 500px;
        margin: 0 auto;
      }

      p {
        background: aqua;
        border: 3px solid blue;
        padding: 10px;
        margin: 10px;
      }

      span {
        background: red;
        border: 1px solid black;
      }

      .positioned {
        position: static;
        background: yellow;
      }
    </style>
  </head>
  <body>
    <h1>Static positioning</h1>

    <p>I am a basic block level element. My adjacent block level elements sit on new lines below me.</p>

    <p class="positioned">By default we span 100% of the width of our parent element, and our are as tall as our child content. Our total width and height is our content + padding + border width/height.</p>

    <p>We are separated by our margins. Because of margin collapsing, we are separated by the width of one of our margins, not both.</p>

    <p>inline elements <span>like this one</span> and <span>this one</span> sit on the same line as one another, and adjacent text nodes, if there is space on the same line. Overflowing inline elements <span>wrap onto a new line if possible — like this one containing text</span>, or just go on to a new line if not, much like this image will do: <img src="long.jpg" alt="a wide but short section of a photo of several fabrics"></p>

  </body>
</html>
```
---


感谢你能看到这里.

