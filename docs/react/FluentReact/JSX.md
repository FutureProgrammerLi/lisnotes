# JSX
> 与JSX相关的内容大概跟翻译过的那篇文章一致:[How JSX works](../How-JSX-Works.md)  

## JSX相关
总结就是,JSX不能直接在浏览器环境中被执行.  
::: info
(inter:运行时环境除了浏览器,还有`Node.js`,Cloudflare的`Workers`.每个环境都有提供特定且仅限于对应环境的API.比如浏览器环境特有的是`document`和`window`;Node环境就有`fs`,`process`等等)  
:::

包含三个阶段,**tokenization -> parse -> code generation**  
需要在`parse`这个阶段,对生成的AST做手脚,才能实现语法的扩展.  
举个例子就是,`<`这个符号在JS中如果不是表达式,那么它是没有意义的;  
而对于JSX而言,它默认是一个函数的调用,是`React.createElement()`. (如果你不用JSX,可以用这个函数逐层嵌套实现你的仿生"JSX")

这个函数经过调整,可以理解为以下这样:
```jsx
<MyComponent value="hello">Content</Mycomponent>

// ->生成的JS函数,可以理解为
function pragma(tag,props,...children){};
//也就是
React.createElement('MyComponent',{value:'hello'},'Content')
```

有一点没懂,第三个参数中,为什么可以是表达式,不能是变量声明或是其它?是否依赖于eval()?原文没解释,只是说了,**可以是表达式,但不能是声明**   

然后的然后,书本就转向了说React的设计模式了(???),说是JSX的模式,实际适用于所有前端开发?

## JSX模式
### Presentational / Container Components
只说我看得懂的:(整篇文章何尝又不是?) 
* `Presentational components:` 关注的是组件该如何展示,它的数据交互,逻辑问题交由Container传给它的来处理,就是props决定它的行为,它本身配合就行;`<PostPreview />`
* `Container components:` 关注组件**状态逻辑,交互关系** ,状态一般在这里全局控制,作为父组件方便传递给子组件,怎么调度状态也在这里进行.`<PostList />`  

说是遵循了单一职责原则,把UI该怎么展示,UI该如何交互两个功能给分开了.  

### HOC

就是组件的嵌套,可以理解为`g(f(x))`.一个组件经过逐层专门的处理,获得了具备特定功能的组件.  
举个例子就是,多个组件都可能需要处理*加载中,加载错误,获取数据*等等的一些相同功能.  
那么你就可以把这个相同的功能提取出来,利用一个函数处理相同的事情,避免代码的重复.  
```jsx
const withAsync = (Component) => (props) => {
    if(props.loading){
        return 'Loading...'
    }
    if(props.error){
        return error.message
    }
    return (
        <Components {...props} />  //这个解构很有必要,不然传的props都作用不到原组件上了
    )
};
const Post = withAsync(BasicPost);
const Comment = withAsync(BasicComment);
const Blog = ({req}) => {
    const { loading:isPostLoading, error:postLoadError} = usePost(req.query.postId);
    const { loading:isCommentLoading, error:commentLoadError} = useComments({posId:req.query.postId});

    return (
        <>
        <Post
            id={req.query.postId}
            loading={isPostLoading}
            error={postLoadError}
        />
        <Comments
            postId={req.query.postId}
            loading={areCommentsLoading}
            error={commentLoadError}
        />
        </>
    )
}
```
这样把Loading功能抽离出来就不用再在每个组件中重复编写代码了.  
(还有好多React的设计模式,好好玩,慢慢来~)
