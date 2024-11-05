# 一些编写React时的技巧
> https://fettblog.eu/typescript-react-component-patterns/  
> 原文其实是React+Typescript的模式.不过我认为跟TS关系不大.但感觉很熟悉,就当复习了.   
> 翻译完了,关系很大,建议看完.

<!-- ## 目录
* [Basic function components](#basic-function-components)
* [Props](#Props)
* [Default Props](#default-props)
* [Children](#children)
* [WithChildrenHelper](#withchildren-helper-type)
* [Spread Attributes](#spread-attributes)
* [Preset Attributes](#preset-attributes)
* [Styled Components](#styled-components)
* [Requried Properties](#requried-properties)
* [Controlled input](#controlled-input) -->

## Basic function components
没有props的函数组件,也就不需要额外的类型定义了.直接IDE就能推断出来了.  
函数定义应该就不用多说了,新一点的也就箭头函数了.
```tsx
function Title(){
    return <h1>Welcome to this application</h1>;
}
```

## Props
组件的Props,通常用组件名加上Props命名,以表明这是属于本组件的props(ComponentName+Props,比如上面就是`TitleProps`).这里也不需要用到`FC`包裹层,或其它的东西了.
```tsx
type GreetingProps = {
    name:string;
};      // Props-suffix

function Greeting(props:GreetingProps){
    return <h1>Hi, {props.name}</h1>;
}
// 也可以解构提高代码可读性

function Greeting({name}:GreetingProps){
    return <h1>Hi, {name}</h1>;
}
```

## Default Props
对比类组件设置默认props,函数组件设置默认props的方法就简单多了,直接给属性设置默认值(函数参数值)就行了.  
我们在类型定义时,加上`?:`,表明这个属性是可有可无的.而默认值的设置能确保,`name`这个属性值不会为`undefined`.

```tsx
type LoginMsgProps = {
    name?: string;
}
function LoginMsg({ name: 'Guest'}: LoginMsgProps){
    return <p>Logged in as {name}</p>;
}
```

## Children
与其使用`React.FC`或`React.FunctionComponent`,我们不如直接显式声明`children`属性的类型,这样它就能跟其它的组件拥有相同的模式了.  
我们在这里把`children`的类型定义为`React.ReactNode`,因为它表示的类型范围较为广泛.(JSX元素,字符串等React可作为渲染内容的类型).

```tsx
type CardProps = {
    title:string;
    children:React.ReactNode;
};
export function Card({title,children}:CardProps){
    return (
        <section className='cards'>
            <h2>{title}</h2>
            {children}
        </section>
    )
};
```
这样显式声明`children`类型的另一个好处是,我们不会忽略掉,要为这个组件传递子内容这个步骤.
::: details 为什么要显式声明`children`类型?
```tsx
function Greeting({name}:{name:string}){
    return (
        <>
            <h1>hello,{name}</h1>
            {children}
        </>
    )
}
```
函数组件没有声明类型是`React.FC`/`React.FunctionComponent`,或是props里不包含`children`, **直接在JSX使用`{children}`,是会报错的.**  
:::

## WithChildren helper type
设置`children`一个更方便的方法是,自定义一个联合类型帮手:
```tsx
type WithChildren<T={}> = T & { children?: React.ReactNode };
type CardProps = WithChildren<{
    title:string;
}>;
```
这跟`FC`的类型声明相似,但这里用了默认泛型参数`{}`,灵活性就更高了:
```tsx
//  也是可行的
type CardProps = {title: string;} & WithChildren;
```
(如果用的Preact,`React.ReactNode`可以换为`h.JSX.Element`或`VNode`)

## Spread Attributes
将一系列属性解构到HTML元素上是一个相当不错的特性,这样你就能避免漏掉某个属性的操作了.  
举个例子,以下是一个按钮的包装器,我们直接将它接收到的所有属性,原封不动地解构到HTML元素,button上.而要将button所能接收的属性正确地赋上值,我们可以从`JSX.IntrinsicElements`获取到正确的属性.其中也包括`children`属性,我们一同传进去了.
```tsx
type ButtonProps = JSX.IntrinsicElements["button"];

function Button({...allProps}:ButtonProps){
    return <button {...allProps} />;
}
// 可否理解为,校验传进该组件的props是否为原生元素所具有的?如非原生属性则作出过滤?
```

## Preset Attributes
假如我们要预先设置,按钮的类型是预先设置好的,不让后来再使用该组件传新的相应属性,那要怎么做呢?  
比如我们不让button `type`为`submit`,以确保按钮不会导致页面刷新:
```tsx
type ButtonProps = Omit<JSX.IntrinsicElements['button'],'type'>;

function Button({...allProps}:ButtonProps){
    return <button type='button' {...allProps} />
}

const z = <Button type='button'>Hi</Button>  // 这样是会报错的,因为Omit不允许接收type类型的props
const x = <Button type='submit'>更加不行</Button>;
```

## Styled Components
不用担心跟*styled-components*这个CSS-IN-JS库搞混.我们这里是想根据已定义的props,设置元素的CSS类名而已.  
比如按钮的类型`type`,可以被设置为`primary`,或`secondary`.  
我们将原本的`type`和`className`通过Omit先给省略掉,再将我们自己定义的类型进行交叉(intersect):
```tsx
type StyledButtonProps = Omit<
    JSX.IntrinsicElements['button'],
    "type" | "className"
    > & {
        type: "primary" | "secondary"
    };  // className也不给设置???

function StyledButton({type,...allProps}: StyledButtonProps){
    return <Button className={`btn-${type}`} /> 
}
```
## Requried Properties
以上我们将元素的一些属性attributes,通过Omit的方式,给屏蔽后来设定,预先设置了一些值.  
接下来我们来确保某些元素,开发者必须手动传写props进去.(就是没预设,但是又必须有的某些属性)  
比如说`image`的`src`或`alt`属性.  
为此,我们自定义一个`MakeRequired`辅助函数,以去掉某些可选属性:
```tsx
type MakeRequired<T, K extends keyof T> = Omit<T,K> & Requried<{ [P in K]: T[P]}> ; 
// ? 什么天书类型
```
并使用这个辅助函数来定义我们的props:
```tsx
type ImgProps = MakeRequired<
    JSX.IntrinsicElements('img'),
    'alt' | 'src'
    >;

export function Img({alt,...allProps}: ImgProps){
    return <img alt={alt} {...allProps} />
}

const zz = <Img alt="..." src="..."/>;
```

## Controlled input
> \* 看不懂,硬翻  
当你在React里使用普通的输入元素,想预先输入某些值,你此后就不能对它再作修改了(?).因为`value`这个属性值是React控制的了.我们需要将`value`的值,作为组件的状态并对其进行控制.一般来说,将原生元素跟我们自己定义的类型进行交叉就足够了.我们也可以之后再将它的默认值设置为空字符串(?)
```tsx
type ControlledProps = 
    JSX.IntrinsicElements['input'] & {
        value?: string;
    }
```
或者我们可以把原有的给去掉,自己进行重写:
```tsx
type ControlledProps = 
    Omit<JSX.IntrinsicElements['input'],"value"> & {
        value?: string;
    }
    // ? 有何用处
```
之后搭配`useState`的默认值设置共同使用.在此,我们还转发了`onChange`这个事件处理器.
```tsx
function Controlled({
    value = "", onChange, ...allProps
}:ControlledProps){
    const [val, setVal] = useState(value);
    return (
        <input
            value={val}
            onChange={e => {
                setVal(() => e.target?.value);
                onChange && onChange(e);
            }}
            />
    )
}
```