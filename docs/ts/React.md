# React里的Typescript

> 是经官网推荐资源而来的一篇文章,感觉比官网介绍的更为细致就选择这篇了.  
> 本文地址: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example  
> React官网使用的Typescript地址:https://react.dev/learn/typescript

```ts
type AppProps = {
    message:string;    // 'hello
    names:string[];   // ['hello','world','!']
    status:"waiting" | "success"; // 
    obj:{
        id:string;
        title:string;
    };    // {id:'abcd',title:'what happened?'}
    objArr:obj[]; // 对数组内的对象进行详细属性限制.
    dict1:{
        [key:string]: MyTypeHere;
    };
    dict2: Record<string,MyTypeHere>;    // 和dict1是一样的,限定对象键名为字符串,值为MyTypeHere

    // 以下是一些原生元素的常用类型声明
    // button / div or whatever else
    onClick: () => void;
    onClick:(event:React.MouseEvent<HTMLButtonElement>):void;
    // inputs
    onChange: (id:number) => void;
    onChange:(event:React.ChangeEvent<HTMLInputElement>) => void;
    optional?: OptionalType;  // 感觉这个搭配union type对可选参数限制很有用
    // 状态提升后,受控组件的修改方式提示,声明设置的目标值是数值类型<number>
    setState:React.Dispatch<React.SetStateAction<number>>;
}
```

但是,定义了`type`或`interface`之后,怎么在函数组件声明中代入呢?  
官网给的也是最常见的方式是:(虽然我不太喜欢,全混在参数定义里了)
```ts
interface MyButtonProps {
    title:string;
    disabled:boolean;
}

//1
function MyButton({title, disabled}:MyButtonProps){/* */}
//2
function MyButton({title,disabled}:{title:string,disabled:boolean}){/* */}
```
* 第一种你说好吧,确实好,甚至比声明FC\<Props>还好.  
(?一开始我不是这样想的,类型和props有什么分开在了两个地方.)
* 第二种就是我开头的问题,混在同一个地方了,虽然格式化一下能明了一点,但属性一多真不如提取到文件开头,甚至其它文件去.

## React里的事件声明
起初我只是想像Vue那样,实现子组件里`defineEmits()`的功能,结果看到事件的类型定义,人晕了.又多又看不懂.  

**有个问题,React有了状态提升,是否还需要`emits`声明呢?**  
为了告诉父组件,子组件有哪些事件,总共产生了三个事件?!  
父组件定义handleMyComponentClick => 通过onClick传给子组件 => 子组件调用handleMyComponentClick;

```ts !9
type MyComponentEvents = {
    onClick:(data:string) => void;
}
interface MyComponentProps extends MyComponentEvents {
    message:string;
}

// 这里由于extends了,把defineProps和defineEmits给整合了,可能会有歧义
const MyComponent = ({message, onClick}:MyComponentProps) => { 
    const handleClick = {
        onClick();  // 这里调用的是父组件传下来的handleMyComponentClick
    }
    return (
        <button 
        onClick={handleClick}>
            Click to trigger method on Parent Component
        </button>
    )
}

const App : React.FC = () => {
    const handleMyComponentClick = (data:string) => {
        console.log(data);
    }
    return (
        <MyComponent 
                onClick={handleMyComponentClick}
                message='trigger function on parent component'
                />
    )
}
```

**实际触发的事件在父组件上** (`defineEmits`好像也是这样?把实现细节交由父组件,子组件只是触发和向上传递数据.(`data`))

### 用`object`声明非原始类型值
`object`在Typescript中经常会引起误解.它的意思不是"任意类型的对象",而是"非原始类型"(non-primitive type).也就是说它代表的是除了`number`,`bigint`,`stirng`,`boolean`,`symbol`,`null`或`undefined`,**以外的所有类型**  

为非原始类型值声明类型其实在React里并不常见,也就是说你很少会见到某个类型为`object`.  

### 空接口,`{}`,和`Object`
标题的三个类型,代表的都是 **"非空值"** -- **不是什么空对象**.使用这些类型定义经常会带来歧义,所以还是尽量少用吧.
```ts
interface AnyNonNullishValue {} // 跟type AnyNonNullishValue = {} 或 type AnyNonNullishValue = Object都是等价的
let value: AnyNonNullishValue;

//以下都会通过类型检验,但并不是我们想要的
value = 1;
value = boolean;
value = () => alert('foo');
value = {};      // [!code highlight]
value = {foo: 'bar'} 

// 以下才会不通过类型校验
value = undefined;
value = null;
```

## 一些比较有用的React props类型
一些接收其它React组件为自己属性的,父组件相关类型声明:
```ts
export declare interface AppProps {
    children?: React.ReactNode;      // 最好的类型定义,意思是React能渲染的任何内容
    childrenElement: React.JSX.Element;  // 单独的一个React元素
    style?: React.CSSProperties; // 传递样式props
    onChange?: React.FormEventHandler<HTMLInputElement>;  // 表单事件.推断出来的泛型是`event.target`的类型
    props: Props & React.ComponentWithouRef<"button">; // 把原生的button属性"武装"添加到本元素,并显式声明不会转发该元素引用.(? 作用有待进一步发掘)
    props2: Props & React.ComponentPropsWithRef<MyButtonWithForwardRef>; // 把MyButtonWithForwardRef的所有属性添加到当前元素,并显式声明会转发该元素引用.
}

```

## 用`type`还是`interface`呢?

用`type`和`interface`都可以声明Props和State,那问题来了,该用哪个呢?  

**除非你不得不用`type`,最好还是用`interface`吧 -- [orta](https://twitter.com/orta/status/1356129195835973632?s=20)**  

### 一些建议
* 写库或三方类型定义时,多用`interface`,因为如果真的漏了某些类型定义,**后来者能声明合并,扩展原有接口.**
* 建议用`type`为React组件编写Props和State,因为它**限制多一点**(?)  
(性能上interface更好,但非极端情况影响都不大,take this with a grain of salt~)  

类型有用就有用在"联合类型",(比如`type MyType = TypeA | TypeB`)  
而接口在声明字典形的数据更有用, 因为能让后来者`implements` 或`extends`,实现扩展.  

用表格总结一下类型和接口的一些适用场景吧:

| 用途   | 类型 | 接口 | 
| ---  | --- | --- |
|  描述函数  | ✅ | ✅  | 
|  描述构建函数  | ✅ | ✅  | 
|  描述元组  | ✅ | ✅  | 
|  可用接口来扩展(extends)  | ⚠️仅某些场景 | ✅  | 
|  可用类来扩展  | 🚫 | ✅  | 
|  可用类来实现(implements)  | ⚠️仅某些场景  | ✅  | 
|  可用另一个类/接口实现交叉  | ✅ |  ⚠️仅某些场景  | 
|  可用另一个类/接口实现联合  | ✅ |  🚫  | 
|  用于创建映射类型  | ✅ | 🚫  | 
|  可与其它映射类型映射  | ✅ | ✅  | 
|  会在错误信息和记录中展开 | ✅ | 🚫  | 
|  可被增强  | 🚫 | ✅  | 
|  可递归  |  ⚠️仅某些场景 | ✅  | 


(感觉上面的表需要很久很久的实践才能完全理解..)

## 函数组件的类型声明
```ts
type AppProps = {
    message: stirng;
}; /**如果props要被导出并被使用者扩展,那就改用`interface` */

const App = ({message}: AppProps) => <div>message</div>;  //声明函数组件的最简方法;返回类型会被自动推断.

// 你也可以显式声明函数组件的返回类型,避免返回其它类型内容导致其它错误.
const App = ({message}:AppProps) : React.JSX.Element => <div>{message}</div>;

// 你还可以把类型定义写在行内,从而不用为props这个类型设置名字,(就是不用自己声明"AppProps"这个东西),不过看起来代码是重复的
const App = ({message}:{message:string}) => <div>{message}</div>;

// 又或者,你可以显式声明函数组件,用`React.FunctionComponent`,或`React.FC`
// 不过有了最新的React类型和Typescript的5.1版本后,这变成了可选项,而非必须项了.
const App:React.FunctionComponent<{message:string}> = ({message}) => <div>{message}</div>;

const App: React.FC<AppProps> = ({message}) => <div>{message}</div>
```

::: details 为什么不再需要`React.FC`或者`React.FunctionComponent` / `React.VoidFunctionComponent`?
``` ts
const App:React.FunctionComponent<{message}:string> = ({message}) => <div>{message}</div>
```
上面代码应该在React+Typescript的应用中很常见.不过现在新的使用习惯是,把`React.FunctionComponent`或者`React.FC`都省略掉了.如果你用的是React17或低于5.1版本的TS的话,这些甚至已经不支持使用.  
其实差别都不是很大,如果你要全都去掉这些声明,你可以用这个[库](https://github.com/gndelia/codemod-replace-react-fc-typescript).

这样声明,跟普通的函数声明还是有点区别的:
* `React.FunctionComponent`显式声明了返回的类型,普通函数显然跟它的返回类型有所差异;
* 这样声明可以提供一定的静态属性类型检测,或是自动补全功能,比如`displayName`,`propTypes`,`defaultProps`等  
    * 注意,`defaultProps`搭配`React.FunctionComponent`一起使用会有一些[额外注意的问题](https://github.com/typescript-cheatsheets/react/issues/87).我们会专门写文解释`defaultProps`的使用.  
* React 18之前的版本,用`React.FunctionComponent`可以提供对`children`属性的隐性声明,这个功能其实是拖后腿的,也是`React.FC`被CRA的TS模板所移除掉的一个原因.
```ts
// React 18版本前的类型
const Title: React.FunctionComponent<{title:string }> = ({
    children,
    title
}) => <div title={title}>{children}</div>;
```
* 以后的props声明可能会自动标记为`readonly`类型.虽然当中还存在一定的争议点,比如从参数列表中解构出来的props对象.  

大部分情况下用不用这些显式声明区别其实不大,只能说多一个声明,多一个说明.(多一个冗余?)
:::

