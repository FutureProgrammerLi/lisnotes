# React设计模式
> React的模式我看一些分类,有*设计模式*和*渲染模式*两种区别.本文主要是设计模式,一些在书籍中更有可能介绍的模式.  
> 渲染模式比较靠近程序员,更多是渲染机制的介绍,后续会有文章介绍.  
> 留个坑: https://www.patterns.dev/react  
> 本文原地址: https://refine.dev/blog/react-design-patterns/

**文章最近的一次更新是2024/9/5.增加了一些关于"错误边界",懒加载组件,记忆模式的内容.**

## 简要
React开发者为什么要学习使用设计模式呢?因为它们能为你提供解决某些特定问题的简要方案,只要遵循它们,就能帮你省时省力地解决或避免掉某些问题.它们可以通过将模块解耦,从而创建可维护,有一定规模,性能高效的应用.本文主要探究一些React的设计模式,分析一下它们是如何提升我们应用的开发体验的.  

内容涵括:  
* [容器和表现模式](#容器表现模式)
* [通过Hooks实现复合的组件模式](#通过hooks将组件复合)
* [使用Reducers实现状态管理](#用reducers实现状态管理)
* [通过Providers实现数据管理](#利用providers实现数据管理)
* [利用HOCs,实现组件功能的提升(Higher-order components)](#利用高阶组件增强组件功能)
* [复合组件](#复合组件)
* [属性整合](#属性整合)
* [受控输入](#受控输入)
* [React中的错误边界模式](#react中的错误边界模式)
* [通过forwardRefs管理自定义组件](#用forwardRefs管理自定义组件)
* [React中的懒加载组件](#react中的懒加载组件)
* ["记忆模式"](#react中的memo)
* [总结](#总结)

## 容器表现模式
容器表现模式,用于**将表现的代码和事务逻辑的代码分离开来**,从而让代码变得更加模块化,更加便于测试.这样做也遵循了代码设计的单一原则.大部分的React应用里,我们都需要在组件中向后端/仓库获取数据,又或要表现一些用户操作后的相应内容.遇到这些场景时我们的这个模式就发挥作用了:**根据组件的作用进行不同的分类**:
* 容器组件:那些用于获取数据,或实现组件逻辑的组件;
* 表现组件:用于将获取到的数据,或计算过后的数据展示出来的界面组件

用代码来讲解这种模式的例子如下:
```ts filename='Container.tsx'
import React, {useState, useEffect} from 'react';
import CharacterList from './CharacterList';
import {Character} from './types';

const StarWarsCharactersContainer: React.FC = () => {
    const [characters, setCharacters] = useState<Character>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getCharacters = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                "https://akabab.github.io/starwars-api/api/all.json",
            );
            const data = await response.json();
            setIsLoading(false);
            if(!data) return;
            setCharacters(data);
        } catch (err) {
            setError(true)
        } finally{
            setIsLoading(false);
        }
    };
    useEffect(() => {
      getCharacters();
    }, [])
    
    return(
        <CharacterList loading={loading} error={error} characters={characters} />
    )
};

export default StarWarsCharactersContainer;
```

```ts filename='CharacterList.tsx'
import React from 'react';
import { Characters } from './types';

interface CharacterListProps {
    loading:boolean;
    error:boolean;
    users:Character[];
}

const CharacterList: React.FC<CharacterListProps> = ({
    loading,
    error,
    characters
}) => {
    if(loading && !error) return <div>Loading...</div>
    if(!loading && error) return <div>error occured. unable to load characters</div>;
    if(!characters) return null;

    return (
        <ul>
            {characters.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    )
}

export default CharacterList;
```

## 通过Hooks将组件复合
Hooks是React16.8推出的新特性.自那起Hooks的作用在React开发中起到至关重要的作用.它们本质上是一些函数,为函数组件提供了状态管理,类似生命周期方法的实现(Hooks之前函数组件是无法做到的,只有类组件才有相关方法).Hooks可以说弥补了函数组件的"最后一块拼图",满足了函数组件的相关需求,提供了一些额外的使用场景.  

如今配合hooks,我们可以将所有有状态的逻辑分离开来 -- 一些逻辑需要对应的状态变量 -- 通过自定义hooks的方式,复合到需要的组件当中.这样做的好处是,代码更加模块化,更加便于测试了.因为逻辑的实现,与组件耦合分离了,可以分别对其进行测试.  

用代码展示这种模式:

```tsx
// 自定义hooks来获取数据

export const useFetchStarWarsCharacters = () => {
    const [characters, setCharacters] = useState<Character>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const controller = new AbortController();

    const getCharacters = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                "https://akabab.github.io/starwars-api/api/all.json",
                {
                method: "GET",
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                signal: controller.signal,
                },    
            );
            const data = await response.json();
            setIsLoading(false);
            if (!data) return;
            setCharacters(data);
        } catch (err) {
        setError(true);
        } finally {
        setIsLoading(true);
        }
        useEffect(() => {
            getCharacters();
            return () => {
                control.abort();
            }
        },[]);
    }
    return [characters,isLoading,error];
}
```
定义好我们的hooks后,我们就可以在组件中引入,使用它了:
```tsx
// 在组件内引入自定义hook来获取数据

import React from "react";
import { Character } from "./types";
import { useFetchStarWarsCharacters } from "./useFetchStarWarsCharacters";

const StarWarsCharactersContainer: React.FC = () => {
  const [characters, isLoading, error] = useFetchStarWarsCharacters();

  return (
    <CharacterList loading={loading} error={error} characters={characters} />
  );
};

export default StarWarsCharactersContainer;
```

## 用Reducers实现状态管理
大部分情况下,只用`useState`来管理组件的状态是不够的.(虽然都是组件相关的,但状态多起来的话反而难以处理了).  
而采用reducer模式则能避免这种状态变多而导致难以管理的处境.我们可以通过reducers将状态分类开来.使用特定的actions,管理特定分类的states.  

这种模式让开发者便于控制管理组件状态,让组件状态的变化变得更为可预测,更直观,更容易追溯.  

使用代码来解释一下这种模式:
```tsx
// component with reducers
import React, {useReducer} from 'react';

const initState = {
    loggedIn:false,
    user:null,
    token:null,
};

function authReducer(state,action){
    switch (action.type) {
        case 'login':
            return {
                loggedIn:true,
                user:action.payload.user,
                token:action.payload.token,
            };
        case 'logout':
            return initState;
        default:
            break;
    }
}

const AuthComponent = () => {
    const [state, dispatch] = useReducer(authReducer, initState);
    
    const logIn = () => {
        dispatch({
            type:'login',
            payload:{
                user:{name:'John Doe'},
                token:'token'
            }
        });
    };
    const logOut = () => {
        dispatch({type:'logout'});
    }

    return (
        <div>
        {state.loggedIn ? (
            <div>
            <p> Welcome {state.user.name} </p>
            <button onClick={logOut}></button>
            </div>
        ) : (
            <form onSubmit={logIn}>
            <input type="text" />
            <input type="password" />
            <button type="submit"></button>
            </form>
        )}
        </div>
    )
}
```
上面的代码分发了两种行为(dispatch two actions,是reducer的术语):
* 'login'行为,触发了reducer的`case 'login'`,将三个初始状态值都改变了
* 'logout'行为,触发了`case 'logout'`, 将状态值初始化了.

## 利用Providers实现数据管理
提供者模式的本质是利用上下文API,顺着组件树将数据传递下去.它可以解决"属性注入"的问题 -- 一个困扰了React开发和多年的问题.(简单说,顶层传了某个数据,**需要该数据的组件就自己用context取,其它不需要的,就不用只传不用了**)  

要实现这一模式,我们先要创建一个"提供者组件"(Provider Component").本质上讲,"提供者组件"是一个高阶组件:在顶层提供一个上下文对象,其中包括需要传递的数据.  
我们用`createContext`方法,创建上下文对象:
```tsx
export const ThemeContext = React.createContext(null);

export function ThemeProvider({children}){
    const [theme, setTheme] = useState('light');
    return (
        <ThemeContext.Provider value={{theme,setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}
```
创建完这个对象后,我们需要选择,组件树的哪个部分来使用它所提供的数据.(Consumer)    
具体的"消费者"组件中,我们要用到`useContext`来使用这个上下文所提供给我们的数据.(代码中是`ThemeContext`)
```tsx
import {useContext} from 'react';
import { ThemeProvider, ThemeContext} from '../context';

const HeaderSection = () => {
    <ThemeProvider>
        <TopNav />
    </ThemeProvider>
};

const TopNav = () => {
    const {theme,setTheme} = useContext(ThemeContext);

    return (
        <div style={{ backgroundColor: theme === "light" ? "#fff" : "#000 " }}>
        ...
        </div>
    )
}
```

## 利用高阶组件增强组件功能
高阶组件,通过接收组件作为参数的方法,为组件添加一些额外的数据或是功能.为什么React会有高阶组件呢?因为React更喜欢"复合"而不是"继承".  

HOC提供了一种机制,组件可以通过这种方法增强,修改自身功能,简易实现组件和代码的重用.  

用代码展示如下:
```tsx
import React from 'react';

const higherOrderComponent = Component => {
    return class HOC extends React.Component {
        state = {
            name: 'John Doe'
        }
        
        render(){
            return <Component name={this.state.name} {...this.props} />
        }
    }
}

const AvatarComponent = (props) => {
  return (
    <div class="flex items-center justify-between">
      <div class="rounded-full bg-red p-4">
          {props.name}
      </div>
      <div>
          <p>I am a {props.description}.</p>
      </div>
    </div>
  )
}

const SampleHOC = higherOrderComponent(AvatarComponent);

const App = () => {
    return (
        <div>
            <SampleHOC description="Frontend Engineer" />
        </div>
    )
};
export default App;
```
上面的HOC就是为组件增加了一个`state.name`的属性,而不影响其它功能.

## 复合组件
复合组件模式其实是用于管理那些由子组件组合而成的父组件的.(?)  
这个模式的主要原则是将父组件,分解成多个规模更小的组件,然后通过props,context或其它技术实现管理各组件件的数据交互.  
这种模式对于那些需要创建可重用性高,由多个较小组件组合而成的多功能组件而言相对有用.开发者采用这种模式时,在用高自定义化,可扩展性强的组件,复合成复杂的UI界面同时,保持简要清晰的代码结构.
```tsx
import React, {createContext, useState} from 'react';

const ToggleContext = createContext();

function Toggle({children}){
    const [on, setOn] = useState(false);
    const toggle = () => setOn(!on);
    return (
        <ToggleContext.Provider value={{on,toggle}}>
            {children}
        </ToggleContext.Provider>
    )
}

Toggle.On = function ToggleOn({children}){
    const { on } = useContext(ToggleContext);
    return on? children : null;
}

Toggle.Off = function ToggleOff({children}){
    const { on } = useContext(ToggleContext);
    return on? null: children;
}

Toggle.Button = function ToggleButton(props){
    const { on,toggle } = useContext(ToggleContext);
    return <button onClick={toggle} {...props} />
}

function App(){
    return (
        <Toggle>
            <Toggle.On>The button is On</Toggle.On>
            <Toggle.Off>The button is OFF</Toggle.Off>
            <Toggle.Button>Toggle</Toggle.Button>
        </Toggle>
    )
}
```

## 属性整合
简单说,将几个相关的props提取出来整合成一个对象,再将这个对象作为props传给需要的组件.  
这种模式能使我们的代码更为简洁,更容易管理props.如果我们需要传递一大堆props时就可以用这种模式.
```ts
import React from 'react';

function P(props) {
  const { color, size, children, ...rest } = props;
  return (
    <p style={{ color, fontSize: size }} {...rest}>
      {children}
    </p>
  );
}
function App(){
    const paragraphProps = {
        color:'red',
        size:'20px',
        lineHight:'22px'
    };
    return <P {...paragraphProps}>This is a P</P>
}

```

## 受控输入
顾名思义,该模式用于控制输入内容.其中包括使用事件处理器更新组件的状态,并将当前输入框的内容存储为组件的状态.  
由于组件的状态和行为都由React进行内部控制,我们则需要采用这种模式,使组件代码变得更加可预测,可读性更强.而不使像非受控组件那样,不采用状态或直接通过DOM对其实现控制.  
```ts
import React,{useState} from 'react';

function ControlledInput(){
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }
    return <input type='text' value={inputValue} onChange={handleChange} />
}

```

## React中的错误边界模式
错误边界模式,让我们在React中更为优雅的处理出错.  
React中的一种错误是某个组件中出错,导致整个页面的崩溃.这种部分导致整体崩溃的表现可能就会让用户不满了.  
而错误边界的引入则能让我们追踪到底组件树的哪一部分出错,为出错组件设置一个后备展示,而非直接导致整个应用崩溃.  
怎么用类组件定义错误边界呢?使用`componentDidCatch`和`getDerivedStateFromError`:
```ts
class ErrorBoundary extends React.Component {
    constructor(props){
        super(props);
        this.state = { hasError: false};
    }
    static getDerivedStateFromError {
        return {hasError:true};
    }
    componentDidCatch(error,errorInfo){
        console.log(error,errorInfo);
    }
    render(){
        if(this.state.hasError){
            return <h1>Something went wrong</h1>
        }
        return this.props.children;
    }
}

```
我们可以将可能出错的组件利用上面代码包裹起来,这样当组件树中的某部分出错时就会有提示信息,而不是莫名奇妙的崩溃了.  

## 用forwardRefs管理自定义组件
React有个自带的高阶组件,就是`forwardRef`: 它接收任意组件作为参数,并生成一个带有原生组件引用的新组件.通过这个高阶组件的"增强",父组件就可以通过这种方式,获得子组件的引用,从而对子组件的DOM节点或实例进行操作了.  

在你创建了一些需要跟三方库或其它组件交互的组件时,这种模式能大幅提升你的工作效率.通过获取到库的DOM节点或实例,你就能自由地控制这些组件了.  
```ts
import React, {useRef,useEffect, forwardRefs} from 'react';

const CustomInput = forwardRefs((props,ref) => (
    <input type="text" {...props} ref={ref}>
));

const ParentComponent = () => {
    const inputRef = useRef(null);
    useEffect(() => {
      inputRef.current.focus()
    }, []);

    return <CustomInput ref={inputRef} />
}
```
上面的代码解释一下:用`forwardRefs`的方法,实现在`\<ParentComponent/>`中调用`\<CustomInput/>`的`focus()`方法.  

## React中的懒加载组件
个人觉得,React中的懒加载组件模式相当有用,尤其是在要处理大量组件或路由组件的时候.  
相对于懒加载,另一种加载方式是"勤奋加载"(eager loading),就是提前加载需要的组件.  
懒加载的作用是减少初次加载所需时间,从整体上提升用户的体验.  
React里实现懒加载的方式是,`React.lazy()`,和`\<Suspense>组件:
```tsx
import React,{ Suspense } from 'react';
const MyComponent = React.lazy(() => import('./MyComponent'));

function App(){
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <MyComponent />
            </Suspense>
        </div>            
    )
}
```
上面的例子中,只有当`\<MyComponent/>`需要展示时才会去获取相关代码.用户在代码获取过程中会展示"Loading..."提示词.  
对于那些不需要立即展示到页面上的组件(像路由或提示框)而言,这种模式相当有用.虽然看起来简单,但它对某些复杂的项目而言会有很大的体验提升.  

## React中的memo
::: warning
有了React Compiler后,下文介绍的API都可以不用手动添加了.前提是你知道如何引入React Compiler,或者,你也可以了解React Compiler背后是如何为我们提升性能的:本质就是自动为我们添加了下面的API.
:::
在此我想简要介绍React中的"记忆"方式:`React.memo`,`useMemo`和`useCallback`.这些都是提升性能的好方法,它们还能避免一些不必要的,耗时耗力的页面重渲染.  

1. `React.memo`:这也可以说是一个HOC:作为参数的函数组件,只有当属性变化时才重新渲染.(区别`useMemo`,这个`memo`没有明确声明是哪个props,只要props变了(浅对比),参数组件还是会重渲染.)
```ts
const MyComponent = React.memo(({count}) => {
    console.log('Component rendered');
    return <div>{count}</div>
})
```
包装后的`Mycomponent`只有在`count`变化时才会被重渲染.

::: details 限制某个特定props才重渲染
是文章以外的个人理解:  
`memo(Com,propsAreEqual)`接收两个参数,一个是函数组件的定义,另一个是**props的对比函数.**  
我们可以通过显式定义对比函数,限制某个特定的props,而不是某个不相关的props变化时,导致组件的重渲染:
```ts
import {memo} from 'react'
const Mycomponent = memo((props) => {
    return (
        <>
            <h1>{props.importantProp}</h1>
            <h2>{props.irrelevantProp}</h2>
        </>)
},(previousProps, nextProps) => {
    return previousProps.importantProp === nextProps.importantProp
})
```
这样,**`irrelevantProp`变化时不会重渲染;**,`importantProps`变化时才会重渲染.
:::

2. `useMemo`:该hook用于记住某个函数的结果,这样只有当声明的依赖发生变化时函数才会去重新计算这个函数的新结果了.  
这对于某些重渲染导致需要重新计算繁杂结果的场景而言就很有用了.
```ts
const expensiveCalculation = (num) => {
    console.log('Calculating...');
    return num * 2;
};

const MyComponent = ({number}) => {
    const calculatedValue = useMemo(
        () => expensiveCalculation(number),
        [number]
    );
    return <div>{calculatedValue}</div>
}
```
`expensiveCalculation`只会在`number`发生变化时才重新调用.页面需要重渲染,`number`不变,函数也不会被调用了.

3. `useCallback`:这个hook跟`useMemo`有相似点,不过它是**用于记住函数本身,而非函数结果的.**  
什么场景下有用呢?需要把回调函数传给子组件,而又不想父组件每次重渲染时又重新构建的时候.(?)

```ts
const Mycomponent = ({handleClick}) => {
    console.log('Component rendered');
    return <button onClick={handleClick}>Click me</button>
};

const ParentComponent = () => {
    const handleClick = useCallback(() => {
        console.log('Button clicked');
    },[])
    return <MyComponent handleClick={handleClick} />
}
```
这里的`handleClick`被"记"住了,每次渲染时它就不会被重新创建了.  

以上三种"记忆"方式在处理复杂UI逻辑和大量数据集时,可以提升应用的整体性能.

## 总结
本文内容就到此为止了.我们在本文中介绍了一些React设计模式,其中包括**高阶组件,容器表现模式,复合组件,受控组件以及其它模式.** 通过编码时有意地使用这些模式,你就能提升项目的代码质量,促进团队合作,从而使你的应用更具规模化,更具灵活性,以及更具可维护性了.  

感谢您能看到这里!