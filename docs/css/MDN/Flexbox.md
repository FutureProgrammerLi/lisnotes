# 弹性盒子
> [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox)  
> justify:使每行排齐;  align:排列整齐;

弹性盒子是一种以行和列方式放置元素的布局方式.元素可以扩展额外的空间,或收缩到更小的空间.本篇文章便是介绍弹性盒子的基础

* 使用弹性盒子的目的 - 以一维方式,灵活的布置块或内联元素.
* 弹性布局中的术语 - 弹性容器, 弹性元素,主轴,副轴
* 了解设置`display:flex`默认会有什么行为
* 如何将内容包装套新的行和列中
* 灵活调整及控制灵活元素的顺序及大小
* justify/align 按一定规则布置内容
---

| 属性 | 描述 |
| --- | --- |
| `display` | 定义一个弹性盒子 |
| `flex-direction` | 定义弹性盒子的主轴方向,`row`,`column`,`row-reverse`,`column-reverse` |
| `flex-wrap` | 定义弹性盒子的换行方式,`nowrap`,`wrap`,`wrap-reverse` |
| `justify-content` | 定义弹性盒子的主轴对齐方式,`flex-start`,`flex-end`,`center`,`space-between`,`space-around` |
| `align-items` | 定义弹性盒子的交叉轴对齐方式,`flex-start`,`flex-end`,`center`,`baseline`,`stretch` |
| `align-self` | 定义弹性盒子的单个元素的交叉轴对齐方式,`auto`,`flex-start`,`flex-end`,`center`,`baseline`,`stretch` |
| `align-content` | 定义弹性盒子的多行对齐方式 |
| `order` | 定义弹性盒子的排列顺序 |
| `flex-grow` | 定义弹性盒子的扩展比例 |
| `flex-shrink` | 定义弹性盒子的收缩比例 |
| `flex-basis` | 定义弹性盒子的基准大小 |
| `flex` | 定义弹性盒子的缩写,对应以上 `flex:flex-grow flex-shrink flex-basis` |

## 为什么要用弹性盒子
CSS里的弹性盒子布局可以令你:
* 在父元素中垂直居中设置一整块内容(a block of content)
* 使一个容器中的所有子元素,无论有多少可占据的宽或高,都具有相同的宽度或高度.
* 多列布局中,哪怕内容高度有所不同,所有的列可以具有相同的高度.

弹性盒子的特性可能是你一维布局中较为完美的解决方案.我们深入学习一下吧!

::: tip
[Scrimba](https://scrimba.com/learn-html-and-css-c0p/~017?via=mdn)中介绍了flexbox在网页应用中有多常见.你可以通过这个视频见识一下flexbox的强大之处.(属于打广告,Schimba是MDN的合作伙伴)
:::

## 一个简单的例子
本文中你会用到很多代码例子.先写段最基础的,后续用来发挥的展示代码.(放文章最后了)

### 声明哪些元素需要在弹性盒子之内
首先我们要选择哪些元素需要弹性盒子布局.  
我们在这些元素的父元素上设置`display:flex`,使其成为盒子容器.这里我们要排列`<article>`元素,所以,我们设置`<section>`元素的`display`属性为`flex`.

```CSS
section {
    display: flex;
}
```
这样设置,`<section>`元素就变成了弹性容器(**flex container**),其子元素,即`<article>`就变成了弹性元素(**flex items**).

单这句属性声明似乎已经就给了我们很多想要的布局,对吧?  
我们获得了多列等宽布局,而且它们的高度也是一样的.  
这是因为弹性容器中的弹性元素本身就是用来解决这样常见的问题的.  

我们再细看一句`display:flex`为我们做了什么.  
我们将一个元素设置为了弹性容器.这个容器以块级内容的方式,与页面中其余元素进行交互.当一个元素被设置为弹性容器,则其子元素就会转换并以弹性元素的方式展示.  

你可以用像`display: inline flex`的方法,将容器设置为内联,这样容器与非容器元素就以内联的方式排列了.之前的`display:inline-flex`也可以实现这种效果.  
本文中我们主要关注容器内的弹性元素表现,如果你想了解内联和块级布局的效果,你可以看看[`display`不同值的表现对比](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_value_comparison)

后续将更详尽地介绍什么是弹性元素(flex items),设置了弹性容器后元素会发生什么变化.

## 弹性模型
当元素以弹性元素方式排列时,它们会沿着两条轴线排列:
![弹性容器的主轴和交叉轴](/MDN/flexbox/flex_terms.png)

* **主轴(main axis)**是沿着flex元素放置的方向延伸的轴(?)(比如以一行一行的方式横向排列在页面,或以一列一列的方式纵向往下排列.) 轴的起始与结尾位置分别称为**main start和main end**.两点的距离称为**main size**.
* **交叉轴(cross axis)**是与弹性元素排列方式相垂直的轴.交叉轴的起始与结尾位置分别称为**cross start和cross end**.两点的距离称为**cross size**.
* 我们设置`display:flex`的元素称为**弹性元素**.(上面的`<section>`元素就是)
* 弹性容器内的元素称为**弹性元素**.(上面的`<article>`元素就是)

**后续的教学中都会用到这些术语.你会常回来看它们的定义的!**

## 行还是列?
弹性盒子中有个属性`flex-direction`,用来设置主轴的方向(弹性元素按哪个方向排列).默认情况下它的值是`row`,横向排列元素(从左到右).  
试下将以下规则添加到你的`secion`样式中?
```CSS
flex-direction: column;
```
可以看到,元素又回到最初的纵向排列了.  
好这行代码展示就到此.删掉再继续阅读下文吧,知道这个属性的作用即可.  
::: tip
这个值还可以设置为`row-reverse`和`column-reverse`,分别表示从右到左和从下到上排列.
:::

## 换行wrapping
等宽或等高布局会有个问题:弹性元素内容可能会溢出容器,导致布局混乱.  
给`<article>`元素设置个最小宽度为700px,内容就溢出容器,出现横向滚动条了.(原文是5个article,min-width:400px.以下结果是一样的,还不用额外添加元素)  

```css
article{
    /* ... */
    min-width: 700px;
}
```
这是因为浏览器默认会将弹性元素全都压缩到同一行/列之中(对应`flex-direction`为`row`或`column`).  
一种解决方式是在容器中设置属性`flex-wrap: wrap;`就可以了.
```CSS
section{
    /* ... */
    flex-wrap: wrap;
}
```  
这样我们就有多行,每行都有合适宽度的弹性元素.溢出的都会被换到另一行去了.  
不过我们还可以实现更多.试试将`flex-direction`设置为`row-reverse`.此时可以看到我们还是有多行,但元素的排列方向是从右往左,与开始相反的方向排列的.  

## flex-flow的简写
结合前两个所学的属性,我们介绍个新的属性,是`flex-direction`和`flex-wrap`的结合体:`flex-flow`.  
用法也很简单了,只是将两个属性结合到一个属性:
```CSS
secion{
    /* flex-direction: row;
    flex-wrap: wrap; */
    flex-flow: row wrap; /* 简写 */
}
/* 后续代码article的没有了min-width的设置,需要自行移除 */
```

## 弹性元素的"弹性尺寸"
回到我们开头的例子,看看我们可以如何控制弹性元素可以占据什么比例的空间.  
为`article`加上以下样式:
```CSS
article{
    flex: 1;
}
```
这是一个没有单位的值,表示对应每个元素可以占据主轴多少比例的空间.  
这里每个`<article>`元素占据主轴上相同比例的空间,其中包括设置了元素内外边距之后的剩余空间.(比例里包括了margin/padding内外边距).  
这个值表示的是弹性元素占据空间的比例,你给每个元素设置`40000`,它展示的效果也是一样的.  

以下代码才会产生点点不同:
```CSS
article:nth-of-type(3){
    flex:2;
}
```
可以看到,第三个元素的宽度是前两个的2倍.因为我们把主轴分成了4份(1+1+2).前两个元素各自占据1份,宽度也就是容器主轴上的1/4.而第三个元素占据2份,故宽度是整条轴宽度的2/4,一半.  

你也可以在`flex`属性中指定元素的最小尺寸值.试下以下样式:
```CSS
article{
    flex: 1 100px;
}
article:nth-of-type(3){
    flex: 2 100px;
}
/* 宽度变大了,但没体现出100px的作用 */
```
这样设置值其实是说: 每个弹性元素都会先有`100px`的空间.之后其余空间根据比例分配的值进行分配.  
你可以看到空间分配上是如何区别开来的.(?没看出来)  

弹性元素都有个最小宽度值100px--是利用`flex`设置的.弹性容器剩余空间的分配共分为4份,前两个元素各占据1份,第三个元素占据2份.前二者等宽,第三者是前二者宽度的两倍.  

这个值的设置价值可以体现在视窗大小发生变化/响应式布局中.你重新调整浏览器窗口大小或加上新的`<article>`元素,布局也会根据这个比例进行调整.  

## flex: 缩写还是全写?
`flex`其实是一个缩写,具体可以划分为三个不同的值:
* 第一个是无单位的比例值,表示元素占据主轴的剩余空间的比例.其实我们可以用`flex-grow`具体声明这个比例.
* 第二个也是无单位比例值,`flex-shrink`,它在弹性元素溢出容器时发挥作用.这个值指明元素需要收缩多少才能避免溢出.这是弹性盒子的一个高级特性,我们先不在本文中作讨论.(???)
* 第三个是元素的最小尺寸.我们可以用`flex-basis`单独声明这个值.  

我们建议使用缩写,除非真的需要覆盖先前设置的某些值.全写不但代码量多,还很容易让人看不懂.(?缩写不是才看不懂吗)  

## 水平与垂直排列
你可以利用弹性盒子的特性沿着主轴或交叉轴排列弹性元素.  
我们再用一个新的例子来说明(文章底部中的`alignment.html`):  
现在你看到的是一行挤在左上角的按钮.我们接下来把它们转变成简单灵活的按钮,工具栏.  
把以下样式添加到底部:
```CSS
div {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
```
可以看到,按钮现在能居中排列了.我们是通过两个属性来实现的.  
* `align-items: center;`: 使按钮沿交叉轴居中排列
* `justify-content: space-around;`: 使按钮沿主轴均匀分布,且在两侧有相同的间距.

`align-items`属性是用来控制弹性元素如何在交叉轴上排列的.  
* 默认值是`normal`,跟弹性盒子里的`stretch`表现一致(?).它会将所有弹性元素沿着交叉轴方向填充父元素空间.如果父元素在交叉轴方向无固定大小,则所有弹性元素将变得与最长弹性元素一样长(或与最宽元素一样宽).这就是我们的第一个例子中,所有元素等高的原因.  
* 而以上我们用了`center`,使元素维持原有的维度,并沿交叉轴居中排列.这就是为什么我们的按钮能在垂直方向居中排列的原因.
* `align-items`的值还可以是`flex-start`,`self-start`,`start`,`flex-end`,`self-end`,`end`.各自变更元素沿交叉轴的排列方向.而`baseline`值,则沿其基线排列;一般每个弹性元素底部的首行文本都会跟元素的首航底部对齐,间距是交叉轴起始位与基线的最大距离.  
[更多关于`align-items`属性的信息可以看这.](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)  

你可以使用`align-self`来覆盖个别弹性元素的排列方式(默认统一按`align-items`排列).  
试下以下样式:
```CSS
button:first-child{
    align-self: flex-end;
}
```
唯独第一个按钮被移到底部了.好了,这行代码可以删了再继续了.

`justify-content`控制弹性元素如何在主轴上排列.
* 默认值是`noral`,跟`start`值表现一样,将所有元素沿主轴从开始方向一路排列下去.
* `end`,`flex-end`,则使它们沿主轴从结束方向排列.
* `left`,`right`跟`start`,`end`表现一致.
* `center`则使它们沿主轴居中排列.
* `space-between`,使元素平均分布到主轴上,且在两侧有相同的间距.
* `space-around`,与`space-between`类似,但**两端并不会留有空间**.  

`justify-items`属性在在弹性布局中是没有作用的,会被忽略.  
我们建议你先认真了解这个属性各个值的表现,再继续往下阅读.  

## 弹性元素的排序
弹性盒子可以不影响源码的前提下,改变元素的排列方式.这种做法在传统布局方法中是无法实现的.  

试下以下样式:
```CSS
button:first-child {
  order: 1;
}
```
"Smile"按钮去到主轴的最后了.我们再展开讲讲`order`属性.
* 默认所有弹性元素的`order`值为0.
* `order`值越高,元素越靠后.
* 值相等的元素,按源码中出现的先后顺序排列.(参考所有都是0时的排列).如果你有4各元素,order值为2,1,1,0.则展示顺序会是4th,2nd,3rd,1st.
* 第三个元素出现在第二个元素之后就是因为它们的`order`值相同,但源码中第二个元素先出现.  

你可以将`order`值设置为负值,使其先出现于其它值为0的元素之前.比如,将"Blush"按钮出现在最前端,可以设置:
```CSS
button:last-child {
    order: -1;
}
```
`order`可以改变元素的排序,没设置该值的则按源码出现顺序排序.改变可聚焦元素时需要主要,它可能会改变键盘输入用户的可用性!(impact usability of keyboard users)

## 嵌套的弹性盒子
有了弹性盒子我们就可以创造很多复杂又漂亮的布局了.当然,弹性元素本身也可以作为新的弹性容器,使其子元素又作为新的弹性元素.  
例子在[底部](#源码)的`nested-box.html`.  

这个例子就有点复杂了,不过也只是两个弹性盒子的嵌套.结构如下:
`<section>`元素有三个`<article>`元素.  
第三个`<article>`元素有三个`<div>`元素.  
第一个`<div>`元素有五个`<button>`元素.  

```txt
section - article
          article
          article - div - button
                    div   button
                    div   button
                          button
                          button
```
`<section>`是个弹性盒子,`<article>`是弹性元素.  
第三个`<article>`元素是嵌套的弹性盒子,其子元素又是弹性元素.不过我们将其展示方式改为列.
```CSS
article{
    flex:1 100px;
}

article:nth-of-type(3){
    flex:3 100px; /**还记得这两个是什么属性的缩写吗? */
    display: flex;
    flex-flow: column;
}
```

之后我们选择第一个`<div>`,设置为`flex:1 100px`,给个最小高度`100px`,并将其也设置为弹性容器 (或者说将子元素也设置为弹性元素).  
之后以换行且居中的方式排列第一个div里的button元素.

```CSS
article:nth-of-type(3) div:first-child {
  flex: 1 100px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-around;
}
```
最后我们设置按钮的大小.我们可以给它设置为`flex:1 auto`.这个值的设置很有趣,当你改变窗口大小时,按钮会自动尽可能填充空间:大部分情况下一行足以,如果不够它就会自动换行.  

```CSS
button {
  flex: 1 auto;
  margin: 5px;
  font-size: 18px;
  line-height: 1.5;
}
```

## 总结
弹性盒子的基础就先到这了.希望你学有所获,学有所成!接下来我们还会讲另一种重要的CSS布局:网格布局.

--- 
感谢你能看到这里!

## 源码
::: code-group
```html [flexbox.html]
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flexbox</title>
</head>
<body>
    <header>
        <h1>Sample flexbox example</h1>
    </header>
    <section>
        <article>
            <h2>First article</h2>
            <p>Content…</p>
        </article>
        <article>
            <h2>Second article</h2>
            <p>Content…</p>
        </article>
        <article>
            <h2>Third article</h2>
            <p>Content…</p>
        </article>
    </section>
</body>
</html>

<style>
    body {
        font-family: sans-serif;
        margin: 0;
    }
    header {
        background: purple;
        height: 100px;
    }
    h1 {
        text-align: center;
        color: white;
        line-height: 100px;
        margin: 0;
    }
    section {
        zoom: 0.8;
        display: flex;
    }
    article {
        padding: 10px;
        margin: 10px;
        background: aqua;
    }
    /* Add your flexbox CSS below here */
</style>
```

```html [alignment.html]
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alignment</title>
</head>
<body>
    <div>
        <button>Smile</button>
        <button>Laugh</button>
        <button>Wink</button>
        <button>Shrug</button>
        <button>Blush</button>
    </div>
</body>
<style>
    body {
        font-family: sans-serif;
        width: 90%;
        max-width: 960px;
        margin: 10px auto;
    }
    div {
        height: 100px;
        border: 1px solid black;
    }
    button {
        font-size: 18px;
        line-height: 1.5;
        width: 15%;
    }
</style>

</html>
```

```html [nested-box.html]
<header>
  <h1>Complex flexbox example</h1>
</header>
<section>
  <article>
    <h2>First article</h2>
    <p>Content…</p>
  </article>
  <article>
    <h2>Second article</h2>
    <p>Content…</p>
  </article>
  <article>
    <div>
      <button>Smile</button>
      <button>Laugh</button>
      <button>Wink</button>
      <button>Shrug</button>
      <button>Blush</button>
    </div>
    <div>
      <p>Paragraph one content…</p>
    </div>
    <div>
      <p>Paragraph two content…</p>
    </div>
  </article>
</section>
<style>
    body {
  font-family: sans-serif;
  margin: 0;
}
header {
  background: purple;
  height: 100px;
}
h1 {
  text-align: center;
  color: white;
  line-height: 100px;
  margin: 0;
}
article {
  padding: 10px;
  margin: 10px;
  background: aqua;
}
section {
  display: flex;
  zoom: 0.8;
}
article {
  flex: 1 170px;
}
article:nth-of-type(3) {
  flex: 3 170px;
  display: flex;
  flex-flow: column;
}
article:nth-of-type(3) div:first-child {
  flex: 1 100px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-around;
}
button {
  flex: 1 auto;
  margin: 5px;
  font-size: 18px;
  line-height: 1.5;
}
</style>
```
:::
