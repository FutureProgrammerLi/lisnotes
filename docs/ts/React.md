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

