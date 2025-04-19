# 弹性盒子
> [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox)

弹性盒子是一种以行和列方式放置元素的布局方式.元素可以扩展额外的空间,或收缩到更小的空间.本篇文章便是介绍弹性盒子的基础

* 使用弹性盒子的目的 - 以一维方式,灵活的布置块或内联元素.
* 弹性布局中的术语 - 弹性容器, 弹性元素,主轴,副轴
* 了解设置`display:flex`默认会有什么行为
* 如何将内容包装套新的行和列中
* 灵活调整及控制灵活元素的顺序及大小
* justify/align 按一定规则布置内容
---
// 回来再总结所有相关属性  

| 属性 | 描述 |
| --- | --- |
| `display` | 定义一个弹性盒子 |
| `flex-direction` | 定义弹性盒子的主轴方向 |
| `flex-wrap` | 定义弹性盒子的换行方式 |
| `justify-content` | 定义弹性盒子的主轴对齐方式 |

## 为什么要用弹性盒子
CSS里的弹性盒子布局可以令你:
* 在父元素中垂直居中设置一整块内容(a block of content)
* 使一个容器中的所有子元素,无论有多少可占据的宽或高,都具有相同的宽度或高度.
* 多列布局中,哪怕内容高度有所不同,所有的列可以具有相同的高度.

弹性盒子的特性可能是你一维布局中较为完美的解决方案.我们深入学习一下吧!

::: tips
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

你可以用像`display: inline flex`的方法,将容器设置为内联,这样容器与非容器元素就以内联的方式排列了.之前的``display:inline-flex`也可以实现这种效果.  
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



## 源码
```html
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
