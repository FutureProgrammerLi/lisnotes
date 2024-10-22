# 渲染函数和JSX
> https://vuejs.org/guide/extras/render-function.html  
> 官网的内容,也是打算翻译的官网最后一篇.  

Vue建议您使用模板语法来构建大部分应用场景.不过,当你能力足够强,对Vue足够有信心时,你可能就会不满于模板语法,希望能完全发挥JS的力量了.Vue当然有这样的backdoor了,它就是渲染函数render function.
::: tip
如果你对虚拟DOM和渲染函数的概念比较陌生,我们建议您先去看看[渲染机制](https://vuejs.org/guide/extras/render-function.html)这篇内容.  
我自己也有[这篇文章的翻译](rendering.md),可以参考一下.
:::

## 基本用法
### 创建虚拟节点
Vue提供一个专门创建虚拟节点的函数:`h()`:
```js
import { h } from 'vue'
const vnode = h(
    'div',
    {id:'foo',class:'bar'},
    [
        /**children */
    ]
)
```
`h()`是**hyperscript**的简写 -- 意思是生成HTML的Javascript代码.这个名字是由许多虚拟DOM实现时,沿袭下来的惯例.(就是用着用着就成名了).另一个更为形象的命名是`createVNode()`,不过名字短的好处自然是要多次调用时,编写更少的代码了.  

`h()`函数主打的就是一个灵活:
```js
//  h(type,props,children)
// 除了元素类型,其它所有参数都只是可选的
// 第一个参数:
h('div')
h('div',{id:'foo'})

// 第二个参数:
// 元素特有属性,或是自定义属性,都可以作为props,第二个参数内容
// Vue会自行决定,将对应属性进行分配
h('div',{class:'bar', innerHTML:'hello'})

// 像`.prop`,`.attr`专业昂的属性修饰器也可以通过第二个属性添加
// 各自对应的前缀是`.`和`^`
h('div',{'name':'some-name','^width':'100' })

// 类和样式,跟在模板中添加的方式一致,可以是数组,也可以是对象
h('div',{class:[ foo, { bar }] , style:{color:'red'}]})

// 事件处理器则需要以onXxx形式传入
h('div',{ onClick: () => {}});

// 第三个参数:
// 子节点可以是字符串
h('div', { id:'foo'}, 'hello');

// 当元素没有需要的属性时,也可以直接忽略:
h('div','hello');
h('div',[h('span','hello')]);

// 第三个参数的子节点数组,可以同时包含虚拟节点和字符串
h('div',['hello',h('span','hello')]);
```
生成的虚拟节点有以下主要属性:
```js
const vnode = h('div',{id:'foo'}, []);

vnode.type; // div
vnode.props; // {id:'foo'}
vnode.children; //[]
vnode.key; //null
```

::: warning
完整的VNode对象还有许多其它内部属性,但我们强烈建议不要对那些以上没有列出来的属性进行操作.这样才能尽可能避免一些由于内部属性变化而带来的运行意外.
:::

### 声明渲染函数
当Composition API配合Template使用时,`setup()`函数需要返回暴露一些值后,模板才能使用它们.而改用了渲染函数后,我们可以直接在`setup()`里返回渲染函数:
```vue
<script>
import { ref,h } from 'vue';

export default {
    props:{},
    setup(props){
        const count = ref(0);

        // 直接返回渲染函数:
        return () => h('div',props.msg + count.value);  // 注意这里的函数返回,确保每个实例的内容相互独立
    }
}
</script>
```
我们直接在`setup()`内声明渲染函数,自然是可以直接访问到组件的`props`和相同作用域内的任意响应式变量的.  
除了直接返回单独一个虚拟节点,你还可以返回字符串或数组:
```js
export default {
    setup(){
        return () => 'hello world!'
    }
}
```

```js
import {h} from 'vue';
export default {
    setup(){
        return () => [
            h('div'),
            h('div'),
            h('div'),
        ];  // div*3
    }
}
```

::: tip
一定要返回一个函数,而不是直接返回值!`setup()`函数在每个组件中都只会被调用一次,而返回的渲染函数很可能会被多次调用.
:::

如果一个组件的渲染函数不需要任何实例状态,它们甚至可以以函数的形式来声明.
```js
function Hello(){
    return 'hello world'
}
```
是的,这也是合法的Vue组件!你可以去看看这种[函数组件语法的更多内容](https://vuejs.org/guide/extras/render-function.html#functional-components).

### 虚拟节点必须是唯一的
组件树中的所有虚拟节点,都必须是唯一的.举个反例就是:
```js
function render(){
    const p = h('p','hi');
    return h('div',[
        // 会报错,虚拟节点重复了
        p,
        p
    ])
}
```
如果你真的需要多次复制相同的元素或组件,你需要改用"工厂函数".比如以下的方式,就很好地生成了20个完全相同的段落元素:
```js
function render(){
    return h(
        'div',
        Array.from({length:20}).map(() => {
            return h('p','hi')
        })
    )
};

//果然是到了一定阶段才能想出来的使用方式, v-for不行吗?
```

## JSX / TSX
JSX是类XML的一种扩充语法,能让我们利用JS的方式编写HTML:
```jsx
const vnode = <div>hello</div>
```
在JSX表达式中,我们需要用花括号来使用绑定值:
```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```
`create-vue`和Vue CLI在创建项目时,都会询问你的项目是否支持JSX语法.而如果你要手动配置JSX,请移步了解`@vue/babel-plugin-jsx`插件,查询更多的实现细节.  
虽然这种语法由React首次提出,但JSX在运行时的语法是没有明确规定的,可以编译成各种不同的结果.如果你之前编写过JSX,那你要清楚,**Vue JSX和React JSX的转换方式(JSX transform)是不一样的.**因此你不能在Vue应用中使用React转换.一些较React不同的点还包括:
* 你可以直接使用HTML的某些属性,包括`class`和`for` -- 而不用React的`className`和`htmlFor`.
* 将子节点传递给组件会产生与React不同的行为(Vue的理解里,是slots.)([有什么区别?](https://vuejs.org/guide/extras/render-function.html#passing-slots))  

Vue的类型定义也会为TSX类型推断提供帮助.当你用到TSX语法时,一定要配置`tsconfig.json`里的`"jsx":"preserve"`,这样TS才会保留JSX语法,从而让Vue JSX转换器来处理.

### JSX类型推断
跟转换相似,Vue里JSX同样需要不同的类型定义.  
从Vue3.4版本开始,Vue不再隐式注册全局的`JSX`命名空间了.如果要让TS使用VueJSX的类型推断,你需要在`tsconfig.json`中进行以下配置:
```json
{
    "compilerOptions":{
        "jsx":"preserve",
        "jsxImportSource":"vue",
        //...
    }
}
```
不用全局配置的话,也可以在需要的文件顶部添加注释:`/* @jsxImportSource vue */`.  
如果你的代码中依赖于全局JSX命名空间,你可以保留v3.4前的做法,在项目中显式引入或引用`vue/jsx`,全局注册`JSX`命名空间.

## 渲染函数的一些使用指南(Recipes)
后续的内容,我们将提供一些渲染函数/JSX的使用方法,以实现模板语法中的相似功能.

### `v-if`
```vue
<template>
    <div>
        <div v-if="ok">yes</div>
        <span v-else>no</span>
    </div>
</template>
```

以上模板等价于以下:
```jsx
// render function
h('div',[ok.value? h('div','yes') : h('div','no')]);
// JSX expressions
<div>{ok.value? <div>yes</div> : <div>no</div>}</div>
```

### `v-for`

```vue
<template>
    <ul>
        <li v-for="{id,text} in items" :key="id">
            {{ text }}
        </li>
    </ul>
</template>
```

```jsx
h(
    'ul',
    // 假设items是一个ref绑定的数组
    items.value.map(({id, text}) => {
        return h('li',{key:id},text)
    })
)

<ul>
    {items.value.map(({id, text}) => {
        return <li key={id}>{text}</li>
    })}
</ul>
```

### `v-on`
以`on`开头,后接大写字母开头单词的属性,会被视为事件处理器.比如说,`onClick`对应模板语法就是`@click`:
```jsx
h(
    'button',
    { 
        onClick(event){
            /*... */
         }
    },
    'Click me'
)

<button onClick={(event)=>{/** */}}>Click me</button>
```

#### 事件修饰符
如果你需要用到`.passive`,`.capture`,`.once`这些事件修饰符,可以直接在事件最后利用驼峰命名,连接(concatenate)到事件最后.
```jsx
h('input',{
    onClickCapture(){
        /** capture mode下的监听器 */
    },
    onKeyupOnce(){
        /**只会被触发一次 */
    },
    onMousseoverOnceCapture(){
        /** once + capture */
    }
});

<input 
    onClickCapture={() => {}} 
    onKeyupOnce={() =>{}} 
    onMousseoverOnceCapture={() => {}}
/>
```
你还可以用`withModifiers`函数来使用其它更多的事件修饰符和键位修饰符.

```jsx
import {withModifiers} from 'vue';
h('div',{
    onClick: withModifiers(() => {},['self'])
})

<div onClick={withModifiers(() => {},['self'])} />
```

### 组件
要为组件创建虚拟节点,我们就要将组件的名称作为`h()`函数的第一个参数传入.也就是说,当我们在用渲染函数时,我们不必先注册,后再使用引入的组件了 -- 你可以直接调用引入的组件:
```js
import Foo from './Foo.vue'
import Bar from './Bar.vue'
function render(){
    return h('div',[h(Foo),h(Bar)])
}

function render(){
    return (
        <div>
            <Foo/>
            <Bar/>
        </div>
    )
}
```

如你所见,`h()`函数可以跟从其它文件导入的任意形式组件协同工作,只要引入的组件是合法组件即可.  
动态组件,配合渲染函数使用就更加简洁明了了:
```js
import Foo from './Foo.vue'
import Bar from './Bar.vue'
function render(){
    return ok.value ? h(Foo) : h(Bar)
}

function render(){
    return ok.value? <Foo/> : <Bar/>
}
```
如果一个组件由`name`属性名注册,不能直接引入当前文件(比如某些库全局注册的组件),你可以引用`resolveComponent()`助手函数来解决这个问题.

### 插槽渲染
在渲染函数中,你可以通过`setup()`的第二个参数解构出插槽内容.解构出来的`slots`对象,包括了所有插槽,而每个插槽的具体内容,是返回一个包含虚拟节点数组的**函数**.  
::: tip
内容似乎没涵括`script setup`语法糖.没有了`setup(props,context)`函数,用语法糖,就要利用`const slots = defineSlots();`
```vue
<script>
export default {
    setup(props, { slots }){  // 这里的props和slots
        //...
    }
}
</script>

<!-- 等价于 -->
<script setup>
const props = defineProps();
const slots = defineSlots();
</script>
```
:::

```js
export default {
    props:['message'],
    setup(props,{ slots }){
        return () => [
            // 默认插槽: <div><slot /></div>
            h('div',slots.default()),

            //  具名插槽: <div><slot name="footer" :text="message" /></div>
            h(
                'div',
                slots.footer({
                    text: props.message
                })
            )
        ]
    }
}

<div>{slots.default}</div>
<div>{slots.footer({text:props.message})}</div>
```

### 插槽传递
向组件传递子节点,与向元素传递子节点有点不同.向元素传子节点用的是数组形式,而向组件传递子节点需要用到**插槽函数,或是由插槽函数组成的对象.**插槽函数可以返回任何渲染函数可以返回的内容 -- 它们都会在子组件访问到时,被标准化为虚拟节点数组.
```js
// 单一默认插槽
h(MyComponent,() => 'hello');

// 具名插槽,注意这里的`null`参数时必须的,以避免插槽对象被认为是props
h(MyComponent,null,{
    default:() => 'default slot',
    foo:() => h('div','foo'),
    bar:() => [h('span','one'),h('span','two')]
})

<MyComponent>{() => 'hello'}</MyComponent>
<MyComponent>{{
        default: () => 'default slot',
        foo:() => <div>foo</div>,
        bar:() => [<span>one</span>,<span>two</span>]     
    }}
</MyComponent>
```

以函数形式传递插槽能够只在子组件被调用时才惰性地调用它们.这样就能让插槽的依赖由子组件收集跟踪,而不是父组件去完成这个工作了.这样后续的更新也能更精准和高效完成了.

### 作用域插槽
要在父组件中渲染作用域插槽的话,父组件就要将插槽传递给子组件.注意以下的插槽例子中的`text`参数.这个插槽会被子组件调用,而子组件也会利用这个`text`,将数据传递给父组件.
```js
// 父组件
export default {
    setup(){
        return () => h(MyComp, null, {
            default:({text}) => h('p',text)
        })
    }
}
```
记得把第二个参数设置为`null`以避免插槽函数被作为属性误处理掉了.
```js
// 子组件
export default {
    setup(props,{slots}){
        const text = ref('hi');
        return () => h('div',null,slots.default({text:text.value}))
    }
}
// 等价JSX:
<MyComp>
{{ default : ({ text }) => <p>{text}</p>}}
</MyComp>
```

### 内置组件
像`<KeepAlive>`,`<Transition>`,`<TransitionGroup>`,`<Teleport>`和`<Suspense>`这些内置的组件,都必须先显式地从`vue`中导入后才能在渲染函数中使用.
```js
import {h,KeepAlive,Transition,TransitionGroup,Teleport,Suspense } from 'vue';

export default {
    setup(){
        return () => h(Transition,{mode:'out-in'},/*... */)
    }
}
```

### `v-model`
`v-model`指令会在模板编译期间,扩展为`modelValue`和`onUpdate:modelValue`两个属性 -- 因此我们要在渲染函数中使用的话,需要手动添加这两个属性:
```js
export default{
    props:['modelValue'],
    emits:['update:modelValue'],
    setup(props,{emit}){
        return () => 
        h(SomeComponent,{
            modelValue:props.modelValue,
            'onUpdate:modelValue':(value) => emit('update:modelValue',value);
        })
    }
}
```

### 自定义指令
自定义的指令可以利用`withDirectives`函数,应用到虚拟节点上:
```js
import {h, withDirectives } from 'vue';

// 自定义的指令
const pin = {
    mounted(){/** */},
    updated(){/** */},
};
const vnode = withDirectives(h('div'),[
    [pin,200,'top',{animate:true}]
])
```
而如果指令的注册利用了自定义的名称(指指令名从别处导入,文件名不是指令名的情况?),不能直接从别处导入的话,可以利用`resolveDirective`助手函数帮忙.

### 模板引用(Template Refs)
有了Composition API,我们可以直接用`ref()`,作为属性传递给该虚拟节点:
```js
import { h,ref } from 'vue';
export default {
    setup(){
        const divEl = ref();
        return () => h('div',{ref : divEl })
    }
}

```

## 函数组件
函数组件是不包含自身状态的,组件的另一种形式.它们的角色像纯函数(pure functions,是函数式编程的一个概念)那样:输入props,输出vnodes.它们被渲染时,不会创建组件实例(比如没有`this`指向),也不会像普通组件那样具有声明周期函数.  

我们可以使用原始的函数定义来创建函数组件,而不是像Vue2那样使用配置项对象来创建.函数自身,就是组件的`render`函数.  
函数组件所接收的参数,跟`setup()`函数一样:
```js
function MyComponent(props,{slots,emit,attrs}){
    /*... */
}
```
普通组件中使用到的大部分配置项,是不能在函数组件中使用的.不过,也可以通过属性添加的方法,为组件添加`props`和`emits`.
```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```
如果函数中没有配置`props`选项,那函数接收到的`props`对象就会包含对应所有的属性,跟`attrs`一样.除非`props`显式声明了,否则它的名称也不会被标准化为驼峰命名形式.  
对于显式声明了`props`的函数组件而言,属性替补(attributes fallthrough)的功能会跟普通的组件一样工作.  
而那些没有显式声明`props`的函数组件,默认只会从`attrs`属性继承到`class`,`style`和`onXxx`这些属性和事件监听器.甚者,你还可以通过设置`inheritAttrs:false`,取消掉这些继承而来的属性.
```js
MyComponent.inheritAttrs = false;
```
函数组件可以跟普通组件一样,被注册和被使用.如果你向`h()`函数传递一个函数,那这个函数就会被认为是函数组件.  

### 为函数组件定型(typing)
函数组件可以根据它是具名的还是匿名的,进行类型定义.当你在SFC中使用函数组件时,Vue的官方扩展器也提供为函数组件实现类型推断的功能. 

**具名函数组件**
```tsx
import type {SetupContext} from 'vue'
type FComponentProps = {
    message: string
}

type Events = {
    sendMessage(message:string):void
}

function FComponent(
    props:FComponentProps,
    context:SetupContext<Event>
){
    return (
        <button onClick={() => context.emit('sendMessage',props.message)}>
            {props.message} {'  '}
        </button>
    )
}

FComponent.props = {
    message:{
        type: String,
        required:true
    }
}

FComponent.emits ={
    sendMessage: (value:unkown) => typeof value === 'string'
}
```

**匿名函数组件**
```tsx
import type { FunctionalComponent } from 'vue';
type FComponentProps ={
    message: string
}
type Events ={
    sendMessage(message:string): void
}

const FComponent: FunctionalComponent<FComponentProps,Events> = (
    props,
    context
) => {
    return (
        <button onClick={() => context.emit('sendMessage',props.message)}>
            {props.message} {'  '}
        </button>
    )
}
FComponent.props = {
    message:{
        type: String,
        required:true
    }
}

FComponent.emits ={
    sendMessage: (value:unkown) => typeof value === 'string'
}
```