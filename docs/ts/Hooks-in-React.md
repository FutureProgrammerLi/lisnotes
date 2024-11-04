# Hooks
Hooks的类型声明支持需要依赖`@types/react`, 以及React v16.8起

## useState
简单类型的值,TS能轻易推断出来
```ts
const [state, setState] = useState(false);
// `state`会被推断为boolean类型
// `setState`只接受布尔型值
```
如果你需要使用复杂类型推断,请看这一章[Using inferred Types](https://react-typescript-cheatsheet.netlify.app/docs/basic/troubleshooting/types/#using-inferred-types)  

不过大多数情况下,hooks的初始值会是可空的值(null-ish).这种情况又要为其声明什么类型呢?  
**显式声明该类型,并使用联合类型:**
```ts
const [user, setUser] = useState<User | null>(null);
// 之后使用setUser

setUser(newUser);
```
如果状态在定义后会被初始化,并有对应的值,那么你也可以用类型断言:
```ts
const [user, setUser] = useState<User>({} as User);
// 看起来没有上面好用."soon"和"after"限制了使用时机?
```
这样的声明其实是暂时性地骗过Typescript编译器,`{}`就是类型`User`.你应该在之后就设置`user`这个状态 -- **否则你其它的代码就会真的信了这个状态就是`User`类型的对象,而没有`null`的情况**,从而导致意想不到的错误了.

## useCallback
你可以像声明普通函数一样,声明`useCallback`的类型.

```ts
const memoizedCallback = useCallback(
  (param1:string,param2:string) => {
    console.log(param1,param2);
    return { ok:true}
  },
  [...],
);
/**VSC会推断出这样的东西:
 * const memoizedCallback:
 * (param1:string, param2:string) => {ok:boolean}
 */
```
对于v18版本以下的React,`useCallback`的函数参数类型推断,默认是`any[]`:
```ts
function useCallback<T extends (...args:any[]) => any>(
    callback:T,
    deps:DependencyList
):T;

```
而18版本以上的React,则会由以下类型推断:
```ts
function useCallback<T extends Function>(callback:T, deps:DependencyList):T;
```
因此以下的代码会在18版本以上的React产生错误`Parameter 'e' implicitly has an 'any' type.'`,而17版本或以下不报错:
```ts
useCallback((e) => {}, []);

useCallback((e:any) => {},[])
```

## useReducer
你可以用可辨识联合类型,对reducer的行为进行类型定义.还有,不要忘了给reducer定义返回类型,否则TS就会自动推断了.  
```tsx
import {useReducer} from 'react';

const initialState = { count:0};

type ACTIONTYPE = 
| { type:"increment"; payload:number}
| { type:"decrement"; payload:string};

function reducer(state: typeof initialState, actions:ACTIONTYPE){
    switch (action.type) {
        case 'increment':
            return {count: state.count + action.payload}
        case 'decrement':
            return {count: state.count - Number(action.payload)}
        default:
            throw new Error();
    }
};

function Counter(){
    const [state, dispatch] = useReducer(reducer,initialState);
    return (
        <>
        Count: {state.count}
        <button onClick={() => dispatch({ type: "decrement", payload: "5" })}>
            -
        </button>
        <button onClick={() => dispatch({ type: "increment", payload: 5 })}>
            +
        </button>
        </>
    );  
}
```

::: details 配合使用`redux`和`Reducer`
如果你用redux来写reducer函数,那它会给你提供个工具来完成返回类型推断的功能:`Reducer<State,Action>`,上面的代码就会变成:
```ts
import {Reducer} from 'redux';

export function reducer:Reducer<AppState,Action>(){};
```
:::

## useEffect / useLayoutEffect
这两个hooks都是用来实现副作用的,都是可选地返回一个清除函数,也就是说如果它们并无需要处理的返回值,也就不需要类型定义了.  
用`useEffect`时记得不要返回除了函数或`undefined`以外的东西,否则TS和React都会对你发出警告.不过你用了箭头函数定义,那问题就没那么严重:
```ts
function DelayedEffect(props:{timerMs:number}){
    const {timerMs} = props;
    useEffect(
        () =>       // 问题在这,没有花括号
            setTimeout(() => {
                // do something
            }, timerMs),
      // 反例!setTimeout隐式返回了一个数字值因为箭头函数体并没有被花括号包裹起来.
         [timerMs])
      return null;
}


// solution解决办法
function DelayedEffect(props:{timerMs: number}){
    const { timerMs } = props;
    useEffect(() => {
        setTimeout(() => {
            // do something
        }, timerMs);
    },[timerMs]);
    return null; // 这样更好,显式声明没有返回内容
}
```

## useRef
TS会推断,`useRef`的返回值是只读的,还是可变的,这取决于你的类型参数完整覆盖了初始值与否.从以下两个选项中选择适合你需求的场景吧:
### 选项一: DOM元素的引用
如果要直接获取原生的元素,那我们可以直接只声明这个`useRef`的类型参数,而用`null`作为它的值.  
这样返回的引用值就会有个只读的`.current`属性,由React来管理.TS也会期望你为这个ref提供一个元素的`ref prop`.
```tsx
function Foo(){
    // 尽可能具体声明需要引用的元素类型,比如这里的HTMLDivElement就比HTMLElement更好,更比Element好
    // 这里会返回RefObject<HTMLDivElement>
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // 这里的divRef.current值可能会为null.因为你不一定就会渲染出这个被引用元素,或者你压根就没指明需要被引用的元素
      if(!divRef.current) throw('divRef is not assigned');
      doSomethingWithElement(divRef.current);
    ));

    // 在这里绑定需要被引用的元素
    return <div ref={divRef}>etc</div>;
}

```

如果你能确保`divRef.current`的值必然不会为`null`,那你可以用非null断言操作符 `!`:
```tsx
const divRef = useRef<HTMLDivElement>(null!);
// 之后用的话就不需要检查该值是否为null了
doSomethingWithElement(divRef.current);
```
不过用了断言操作符就相当于你少采用了类型安全策略了 -- 如果你忘了指定需要被引用的元素,或是被引用的元素由于条件渲染而没被渲染出来的话,那就可能报错(runtime error)了.

::: details 如何选择具体要用哪个元素类型?
引用的声明需要具体到元素类型 -- 只用`HTMLElement`显然是不够的.如果你不清楚你要声明的元素类型具体名字是什么,你可以查看[`lib.dom.ts`](https://github.com/microsoft/TypeScript/blob/v3.9.5/lib/lib.dom.d.ts#L19224-L19343), 或者先故意声明一个"泛类型"的元素,由提示告诉你需要具体什么元素类型:
![Element-type](/element-type.png)
:::

### 选项二: 可变值的引用
如果要引用可变值,声明你想要的该值的类型,并确保这个初始值始终属于该类型:
```tsx
function Foo(){
    // 这里会返回MutableRefObject<number | null>类型
    const intervalRef = useRef<number | null>(null);

    // 你在这里管理引用的变化(所以说为什么类型是MutableRefObject)
    useEffect(() => {
      intervalRef.current = setInterval(/**... */);
      return () => clearInterval(intervalRef.current);
    }, []);

    // 没有任何的ref属性用到上面声明的引用.*no ref prop
    return <button onClick={}>Cancel timer</button>
}
```

## useImperativeHandle
```tsx
// Countdown.tsx

// 定义传给forwardRef的处理器类型
export type CountdownHandle = {
    start: () => void;
};

type CountdownProps = {};

const Countdown = forwardRef<CountdownHandle, CountdownProps>((props,ref) => {
    useImperativeHandle(ref,() => ({
        // 这里的start()就会有类型推断,符合CountdownHandle的start:() => void;
        start(){
            alert("Start")
        },
    }));
    return <div>Countdown</div>
})
```

```tsx
// 使用以上Countdown组件的其它组件
import Countdown, { CountdownHandle } from './Countdown.tsx';

function App(){
    const countdownEl = useRef<CountdownHandle>(null);
    useEffect(() => {
        if(countdownEl.current){
            // 这里的start()也会有类型推断
            countdownEl.current.start();
        }
    },[])
};
```
## 自定义hooks
如果你要在自定义hooks里返回数组,你就会希望TS不会将这个数组类型,推断为联合类型(你就是想要每项不同类型的数组).  
要怎么办呢? 用TS 3.4的,常量断言(const assertions):
```ts
import { useState } from 'react';

export function useLoading(){
    const [isLoading, setState] = useState(false);
    const load = (aPromise: Promise<any>) => {
        setState(true);
        return aPromise.finally(() => setState(false));
    }

    return [isLoading, load] as const;     //这里会推断为[boolean, typeof load], 而不是(boolean | typeof load)[]
}
```

这样当你解构时就能根据解构的位置,获取到正确的类型了.

::: details 另一种用法:断言返回类型为元组tuple
如果你不熟悉常量断言,你还可以直接对函数的返回类型进行断言或定义:
```ts
import { useState} from 'react';

export function useLoading(){
    const [isLoading,setState] = useState(false);
    const load = (aPromise: Promise<any>) => {
        setState(true);
        return aPromise.finally(() => setState(false));
    };
    return [isLoading,load] as [
        boolean,
        (aPromise:Promise<any>) => Promise<any>
    ];
}
```

如果你要写比较多的自定义hooks,那在此基础上编写为元组实现类型定义的工具函数还是非常有用的:
```ts
function tupify<T extends any[]>(...elements:T){
    return elements;
}

function useArray(){
    const numberValue = useRef(3).current;
    const functionValue = useRef(() => {}).current;
    return [numberValue, functionValue]; // type is (number | (() => void))[]
}

function useTuple() {
  const numberValue = useRef(3).current;
  const functionValue = useRef(() => {}).current;
  return tuplify(numberValue, functionValue); // type is [number, () => void]
}
```
:::

React推荐的用法是,当自定义需要返回多余两个值的时候改用对象,而不是用元组.

更多关于Hooks+Typescript的学习资源:
* https://medium.com/@jrwebdev/react-hooks-in-typescript-88fce7001d0d
* https://fettblog.eu/typescript-react/hooks/#useref
* https://github.com/mweststrate/use-st8
* https://github.com/palmerhq/the-platform
* https://github.com/sw-yx/hooks