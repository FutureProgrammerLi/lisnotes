# React Compiler的实操篇
> 翻译完一篇Lauren Tan关于React Compiler 的介绍文,发现内容跟实操其实没有什么联系..  
> 然后就有了本文了.终归是要回归到官网的.是官网+Tan在React Conf上内容的结合.

* [React Compiler的官方介绍](https://react.dev/learn/react-compiler)
* Lauren Tan对React Compiler的介绍:[原文github](https://github.com/reactwg/react-compiler/discussions/5) /[自己的翻译](./React-Compiler.md)
* [React Conf上,Lauren关于React compiler的演讲,B站视频](https://www.bilibili.com/video/BV1my411a7FY/)

## 想要的结果
对React Compiler(下文简写为RC)有初步了解的朋友应该知道,它的引入是简化了`useMemo`,`useCallback`,`React.memo`的操作.  
这些以前需要手动进行的优化操作有了RC后,就交由给这个"插件"完成了.  
所以,怎么知道RC是否生效了呢?我们的页面是否被优化了呢?有两种方式:
1. **直接利用React devTools查看组件树.** 优化后的组件都有"Memo✨"的标识:
![with-react-devtool](/blink.png)
2. **手动检验,父组件状态变化时,无相关props变化的子组件是否被重渲染.**
(3.执行命令`npx react-compiler-healthcheck`.需要额外下载依赖,并且可能命令执行成功但项目运行不起来.也有可能是我自己的问题)  
手动检测子组件是否被重渲染的代码:(当然还有很多其它校验组件是否被重渲染的方法,`useCallback`,`useEffect`,`useMemo`,`React.memo`等都是可以的)
```tsx
function Parent(){
    const [count, setCount] = useState(0);
    const [msg, setMsg] = useState('Hello compiler');
    return (
        <>
        <h1>Count: {count}</h1>
        <button onClick={setCount(count +1)}>Click to increment</button>
        <Child msg={msg}/> 
        </>
    )
};

function Child({msg}:{msg:string}){
    console.log('re-rendered');
    return <p>{msg}</p>
}

```

## 引入部分
需要的插件有点多?一通安装就是了:
```bash
npm install -D react-compiler-runtime eslint-plugin-react-compiler babel-plugin-react-compiler
# 如果执行npx react-compiler-healthcheck,可能还需要安装react-compiler-healthcheck
# npm install react-compiler-healthcheck
```

### Vite
假如你的项目脚手架是用Vite,那就去`vite.config.ts`配置
```ts
// vite.config.ts
//...
const ReactCompilerConfig = {
    target:'18',  //低于v19的版本都要声明,这里的值可选为'17' | '18' | '19'
    sources:(filename:string) => {          // debug的关键, 限定ReactCompiler的作用范围
        return filename.indexOf('src');     // 因为Compiler的引入就是想你逐步扩大范围的,先个别文件夹,最后再到整个应用优化这样
    }
}

export default defineConfig({
    plugins:[react({
        babel:{
            plugins:[
                ['babel-plugin-react-compiler',ReactCompilerConfig],      // 这里的插件顺序需要是第一个
            ]
        }
    })],
});

```

### Next.js
果然是亲生的,添加起来就是容易  
1. 安装`babel-plugin-react-compiler`
2. 在`next.config.ts`里设置`experimental:{reactCompiler:true}`就可以了
```ts
// next.config.ts
const nextConfig = {
    // ...
    experimental:{
        reactCompiler:true,
    }
}

```