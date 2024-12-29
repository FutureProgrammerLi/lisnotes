# React组件的类型
> Robin Wieruch, 看了Blog才知道,很久前翻译过他一篇how to fetch data in react. 才发现好熟悉.  
> 既然那么有缘,而且文章内容也算不错,就也翻译一下吧.
> 算是对React组件进化史的一个了解了.  
> 原文地址: https://www.robinwieruch.de/react-component-types/

自React诞生的2013年起,各种各样的组件类型也随之出现.一些对现代React应用仍是至关重要的,而另一些没那么适用现代环境的,可能就留存在旧项目中了.  
本篇文章主要为初学者介绍一下,现代组件和模式的一个概况,再进一步分析,为什么一些会被沿用至今,一些则被历史海浪所淹没.读完这篇文章你大概就能分辨出,哪些组件和模式,是"历史遗物",哪些又是"现代"前沿的组件类型.  

## 内容目录
- 回顾历史
    * `createClass`
    * Mixin (Pattern)
    * Class Component
    * Higher-Order Component(Pattern) 
- 认清现在,展望未来
    * Function Components
    * Server Components
    * Async Components

(ClassComponent -> FC -> RSC,为了方便理解,暂且不翻译标题)

## React CreateClass
最初的React用的是`createClass`(已弃用),像"工厂模式"一样,定义并创建ReactClassComponent.这样就不需要原生的Javascript类了.这是2015年,ES6正式加入类特性前,创建React Component的标准方法.ES6之前,JS都是缺少原生的类语法的.
```js
import createClass from 'create-react-class';

const CreateClassComponent = createClass({
    getInitialState: function (){
        return {
            text:""
        };
    },
    handleChangeText: function (event){
        this.setState({text:event.target.value});
    },
    render: function (){
        return (
            <div>
                <p>Text:{this.state.text}</p>
                <input 
                    type="input"
                    value={this.state.text}
                    onChange={this.handleChangeText}
                />
            </div>
        )
    }
});

export default CreateClassComponent;

```
例子解释开来就是,`createClass`工厂接受一个对象作为参数,这个对象中为React组件定义各种方法.  
`getInitialState()`,用于定义组件的初始状态;而`render`这个必须要有的函数,用以搭配JSX,处理需要展示的内容.  
一些额外的方法,比如`incrementCounter()`,可以以对象方法的方式,作为组件的事件处理器,添加到组件中.  

一些处理副作用的生命周期方法也是可用的.比如,把输入值text,从组件状态转存为浏览器localStorage,我们则可以用`componentDidUpdate()`方法.此外,对应值也可以在组件接收到初始状态值时,从localStorage中读取出来.
```js
import createClass from 'create-react-class';

const CreateClassComponent = createClass({
    getInitialState: function(){
        return {
            text: localStorage.getItem('text') || ''
        }
    },
    componentDidUpdate: function (){
        localStorage.setItem('text',this.state.text)
    },
    handleChangeText: function (event) {
    this.setState({ text: event.target.value });
  },

  render: function () {
    return (
      <div>
        <p>Text: {this.state.text}</p>
        <input
          type="text"
          value={this.state.text}
          onChange={this.handleChangeText}
        />
      </div>
    );
  },
})
```
`createClass()`这个方法已经被ReactCore移除了.如果你想试试,可以专门下载node package: `create-react-class`.

## React Mixins(Pattern)
**React Mixins**, 也是被降级了的一种模式了.它的出现是想解决React逻辑复用的问题.**有了混合模式,我们就可以将React组件中的某部分逻辑,提取到独立对象中了.**当组件选择使用了Mixin,那Mixin的全部逻辑,都不得不应用到该组件去了.(是好是坏呢?)
```js
import createClass from 'create-react-class';

const LocalStorageMixin = {
    getInitialState: function (){
        return {
            text:localStorage.getItem('text') || '',
        }
    },
    componentDidUpdate: function (){
        localStorage.setItem('text',this.state.text);
    }
}

const CreateClassWithMixinComponent = createClass({
    mixins: [LocalStorageMixin],
    handleChangeText: function(event){
        this.setState({text:event.target.value});
    },
    render: function () {
        return (
        <div>
            <p>Text: {this.state.text}</p>

            <input
            type="text"
            value={this.state.text}
            onChange={this.handleChangeText}
            />
        </div>
        );
    },
})
```
将文本内容存到localStorage的逻辑,提取到了`LocalStorageMixin`中:初始化text,并用`componentDidUpdate`,更新text在localStorage里的值.  
之后再在需要用到这个逻辑的组件中,添加到`mixins`数组中.这样任意组件都可以重用这部分功能,而不用编写大量重复代码了.  

不过,Mixins没有被沿用至今也是[有原因的](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html),只会在`createClass`组件中被使用.  
(甚至介绍mixin缺点的文章都已经是过期了,更不用说Mixin这个特点有多..outdated了)

## React Class Components
有点回到现代的感觉了,起码是一些比较熟悉的概念..  
**React Class Component**(现在不推荐使用了), 在2015年的3月首次被提出.在此之前是用`createClass`定义组件的,在当时,类组件就是`createClass`API的替代品.(正如函数组件之于类组件)  

类组件就是JS原生类的一个扩充使用了.(ES6和类组件都是2015年出现的)因为到这时ES原生才真正支持类语法.
```js
import React from 'react';
class ClassComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            text:""
        };
        this.handleChangeText = this.handleChangeText.bind(this);
    }
    handleChangeText(event){
        this.setState({text:event.target.value})
    }
    render() {
        return (
        <div>
            <p>Text: {this.state.text}</p>

            <input
            type="text"
            value={this.state.text}
            onChange={this.handleChangeText}
            />
        </div>
        );
    }
}
export default ClassComponent;
```
React组件用上JS类,就更加方便,带上一些额外的方法了,比如`constructor`-- 在React的作用是设置初始组件状态,以及方法绑定 -- 还有一个必须有的渲染函数,`render`,返回JSX作为最终展示.  

所有的组件逻辑,都是基于**面向对象的继承特性的.** 不过值得注意的是,除了必要的`constructor`,更多的继承特性都是不推荐再使用了.官方更加推荐的,从来都是使用复合(composition),而不是继承.  
::: tip
[关于React里的复合](https://www.robinwieruch.de/react-component-composition/)
:::

另一种更好的用JS类定义React类组件的方法是,用ES6的箭头函数定义事件处理器 -- 这样就能自动绑定事件而不用手动`this.method.bind(this)`了.

```js
class ClassComponent extends React.Component {
    constructor(props){/** 
    // not needed for :
    // this.handleChangeText = this.handleChangeText.bind(this);
    */}
    handleChangeText = (event) => {
        this.setState({text: event.target.value});
    }
}
// ...
```
类组件也有几个生命周期方法:挂载,更新,卸载等.  
以之前的`localStorage`为例子来说明用法就是,把其中逻辑,放到不同的生命周期方法中:
```js
constructor(props){
    super(props);
    this.state = { text: localStorage.getItem('text') || ''}
}
componentDidUpdate(){
    localStorage.setItem('text',this.state.text)
}
// ...
```

到了2019年2月,随着React16.8,React Hooks新概念的推出,函数组件,配合Hooks,成为了前端行业的标准.  
React类组件尽管渲染效率不低,但也被Hooks的光芒所掩盖,逐渐成为过去了.  
换句话说,hooks的推出,真正使Class Component失去了光辉.因为没有hooks,类组件和函数组件是**可以共存**的.因为函数组件功能还不够完善.有了Hooks,函数组件自己也能处理自己的状态了,自己也能处理副作用了.至此,Hooks+FC, "彻底"取代了类组件.

## React Higher-Order Components(Pattern)
React高阶组件(HOCs,)(也不推荐使用了),也是风光一时的一种模式.它也能很好地重用组件逻辑.
::: tip
[更多关于HOCs的内容](https://www.robinwieruch.de/react-higher-order-components/)
:::
HOCs最简单的解释就是: 一个接收组件的组件,最终输出就是多了某些功能的组件.  
还是以上面LocalStorage的功能作为讲解吧:
```js
import React from 'react';

const withLocalStorage = (storageKey) => (Component) => {
    return class extends React.Component{
        constructor(props){
            super(props);
            this.state = {
                value: localStorage.getItem(storageKey) || '',
            }
        }
        componentDidUpdate() {
            localStorage.setItem(storageKey, this.state.value);
        }
        onChangeValue = (event) => {
            this.setState({value: event.target.value});
        }
        render(){
            return(
                <Component
                    value={this.state.value}
                    onChange={this.onChangeValue}             
                    {...this.props}
            )
        }
    }
}

class ClassComponent extends React.Component {
    render(){
        return (
            <div>
                <p>Text:{this.props.value}</p>
                <input
                    type="text"
                    value={this.props.value}
                    onChange={this.props.onChangeValue}
                    />
            </div>
        )
    }
}
export default withLocalStorage('text')(ClassComponent)
```

另一种比较流行的高级React模式是**Render Prop Components**,是HOCs的一种替代方案.  
不过这两种模式不限于什么类型的组件.类组件,函数组件,都是可以使用这些模式的.
::: tip
[更多关于Render Prop Components](https://www.robinwieruch.de/react-render-props/)
:::

不过有点遗憾的是,两种模式都没有被过多地使用了.  
当今的准则是,用函数组件和Hooks,在组件之间共享逻辑.

## React Function Components
React函数组件,是类组件的替代品.之前用类定义的组件,现在直接用函数就可以定义了.  
过去的函数组件里是没办法处理状态和副作用的,因此过去的FC也被称为"函数式无状态组件"(Functional Stateless Components).但随着Hooks的加入,这个名号也是被打假了.
::: tip
[关于React 函数组件](https://www.robinwieruch.de/react-function-component/)  
[关于React hooks](https://www.robinwieruch.de/react-hooks/)  
:::

Hooks的推出,为函数组件赋予了处理组件状态和副作用的能力,使之成为了*当今React应用的行业标准*.React不仅内置了各种Hooks,你还可以自定义自己的hooks.  
接着我们来看下,如何将之前的Class Component转化成当今的Function Component吧.
```js
import { useState } from 'react';
const FunctionComponent = () => {
    const [text,setText] = useState('');

    const handleChangeText = (e) => {
        setText(e.target.value);
    };
    return (
        <div>
            <p>Text: {text}</p>
            <input type="text" value={text} onChange={handleChangeText} />
        </div>
    )
}
```
以上的函数组件展示了如何用`useState`来管理组件状态.此外,React Hooks另一比较常用的,是`useEffect`,用以处理组件副作用.以下则是用例,每当状态发生改变时都会执行这个副作用hook.
```js
import { useEffect, useState } from 'react';

const FunctionComponent = () => {
    const [text, setText] = useState(localStorage.getItem('text') || '');
    
    useEffect(() => {
      localStorage.setItem('text',text);
    }, [text])

    const handleChangeText = (e) => {
        setText(e.target.value);
    }
    return (
        <div>
        <p>Text: {text}</p>

        <input type="text" value={text} onChange={handleChangeText} />
        </div>
    );
}

```
此外我们还可以把这些hooks提取封装到自己定义的hooks里,同样实现组件状态和localStorage的内容同步.  
提取后的自定义hook最后将必要的值和设置函数返回出来,(custom hooks)就可以在任意组件中被使用了.
```js
const useLocalStorage = (storageKey) => {
    const [value, setValue] = useState(localStorage.getItem(storageKey) || '');
    useEffect(() => {
        localStorage.setItem(storageKey);
    },  [storageKey,value])
    
    return {value, setValue}
}

const FunctionComponent = () => {
    const [text,setText] = useLocalStorage('text');
    const handleChangeText = (e) => {
        setText(e.target.value);
    }
    // ...
}
```

存在localStorage的逻辑本来就是从函数组件中提取出来的,自然它也能被任意函数组件重复使用.这是一层逻辑抽象,等同于之前Mixins,Render Prop, HOCs的高级模式.
::: tip
[更多关于React自定义hooks](https://www.robinwieruch.de/react-custom-hook/)
:::
Mixins仅限于`createClass`组件,HOCs,Render Prop两种模式则对类组件和函数组件都为适用.**不过,函数组件的逻辑复用,仍旧是推荐使用自定义Hooks实现.**

## React Server Components
React较为新的一种组件是,2023年推出的服务器组件(RSC).开发者能在服务器上执行组件代码.  
它的优点包括:只有HTML会发送给客户端;组件自身能访问到服务器端资源;等等...  
由于RSC在服务器上运行了,用途都发生变化了,就不再用之前的例子讲解了.  
那就,面向用途举例吧..以下是服务器组件从服务器端资源(比如数据库)获取数据后,再将渲染好的HTML发送给客户端的一个例子.
```js
const ReactServerComponent = async () => {
    const posts = await db.query("SELECT * FROM posts");
    return (
        <div>
            <ul>
                {posts?.map((post) => (
                <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default ReactServerComponent;
```
有服务器组件,自然会有客户端组件.也不是新的概念了,没错,之前写的所有React组件都可以被称为"客户端组件".  
服务器组件跟客户端组件一个明显的区别就是,**前者不能使用React Hooks或JS(?比如绑定事件处理器),因为它们会在服务器上运行.**(存疑.事件处理器都不能绑定了?)  
::: tip
[用Next.js进行全栈开发](https://www.road-to-next.com/)
:::
React本身只提供了底层构建服务器组件的规范和代码块(specification and building blocks),但具体的实现还是依靠更高一层的React框架(比如Next.js).

## Async Components
当前而言,异步组件只支持服务器组件;支持客户端组件实现还是未来的事.如果组件被标记为异步,那它就可以实现一些异步的操作(比如数据获取).  
你其实也见识过这种行为了(上面的RSC其实就是异步组件).就是先从服务器获取好数据,再将渲染好的HTML发送给客户端.这对于客户端组件而言是不可行的,因为异步的操作会阻碍客户端上的渲染.  
当前你只可以向客户端组件传一个JS Promise:
```js
import { Suspense } from 'react';
const ReactServerComponent = () => {
    const postPromise = db.query('SELECT * FROM posts');
    return (
        <div>
            <Suspense>
                <ReactClientComponent promisedPosts={postsPromise} />
            </Suspense>
        </div>
    );
}
```
然后用React的`use` API,在这个客户端组件中Resolve the Promise.
```js
`use client`
import { use } from 'react';
const ReactServerComponent = ({postPromise}) => {
    const posts = use(postPromise);
    return (
        <ul>
        {posts?.map((post) => (
            <li key={post.id}>{post.title}</li>
        ))}
        </ul>
  );
}
``` 
未来,客户端组件才可能实现异步的功能,才能在客户端组件先获取数据,才进行渲染.

## Conclusion
所有类型的React组件的共同点是,利用Props从组件树自上而下地传递信息.不同点则是,函数组件和类组件处理自身状态及副作用的方式有所差异.  
本文为您展示了React所有不同类型的组件,它们是如何定义的,以及部分组件为何会被弃用.[代码的例子可以看这里.](https://github.com/rwieruch/examples/tree/main/react-component-types)  
感谢你能看到这!