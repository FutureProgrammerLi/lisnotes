# `<script setup>` 
> 玩着玩着没有了方向,不知道要弄清什么了.所以去官网学习一下.  
> https://vuejs.org/api/sfc-script-setup.html  

`<script setup>`是SFCs使用Composition API时的一种编译时语法糖.我们推荐你在同时使用SFCs和CompositionAPI时使用这个语法糖.它提供的以下优点是普通`<script>`标签所不具备的:
1. 代码更简洁,更少固定代码块(less boilerplate)
2. 直接利用Typescript,声明组件的props和emits
3. 更好的运行时性能(模板内容会被编译到一个处在相同作用域的`render`函数,不再需要额外的中间代理proxy)
4. 更好的IDE类型推导性能(可以说将类型推导的功能,转移到其它部分上去了)

自学过程产生的问题:
1. 模板中用ref为什么不用`.value`了?
2. 没有`setup`语法时,动态组件需要如何注册或实现?
3. 语法糖内为什么可以直接用`defineProps`等API?

## 基本语法
```vue
<script setup>
</script>
```
`<script setup>`里的内容经编译后,都会称为组件`setup()`函数的内容.换句话说就是,**普通没利用语法糖的`<script>`标签,只会在组件被导入时执行一次.而用了`<script setup>`,里面的代码就会在每次组件实例被创建时,都会被执行.**  

### 顶层的绑定直接暴露到模板中
(用自己的话说就是,不用`return`模板就能直接用到定义的变量了.官网原文也是这个意思).  
用了语法糖,任意顶层的绑定声明(包括变量,函数声明,引入)都能直接在模板中访问到.
```vue
<script setup>
// 变量
const msg = 'Hello!';
//函数声明
function log(){
    console.log(msg);
}
</script>
<template>
    <button @click="log">{{msg}}</button>
</template>
```
模块的导入也是相同的.你可以直接在模板语法中使用导入的模块方法,不用再通过`methods`选项将其暴露给模板.
```vue
<script setup lang='ts'>
import { capitalize } from './helpers'
</script>
<template>
    <div>{{capitalize('hello')}}</div>
</template>
```

## 响应性
响应式状态依旧需要用响应式API声明.与直接从`setup()`函数返回的值相似,`ref()`声明的值在模板内会自动解除包装(模板内方位ref不用`xxx.value`).(怎么实现的呢?)
```vue
<script setup lang='ts'>
    import { ref } from 'vue';
    const count = ref(0);
</script>
<template>
    <button @click="count++">{{count}}</button>
</template>
```

## 使用其它组件
`<script setup>`作用域里的值,也可以直接作为自定义组件标签名:
```vue
<script setup lang='ts'>
    import MyComponent from './MyComponent.vue'
</script>
<template>
    <MyComponent />
</template>
```
你可以将`MyComponent`作为一个变量一样被访问(referenced).如果你用的是JSX(而不是template语法),思维还是相似的.  
在模板里用kebab-case调用组件是可行的,(就是`<MyComponent/>`变成`<my-component>`也不会出错)但我们还是建议使用PascalCase,以保持组件命名的一致性.它也可以用于区分自定义组件和原生标签.

### 动态组件(开始陌生了)
由于组件的引入,更多像引入其它变量一样,而不是像之前用字符串键来注册了,因此我们需要用动态的`:is`绑定并调用这些动态组件了.
```vue
<script setup lang='ts'>
    import Foo from './Foo.vue'
    import Bar from './Bar.vue'
</script>
<template>
    <component :is="Foo" />
    <component :is="someCondition? Foo : Bar" />
</template> 
```
这里可以留意一下,组件可以像值一样被运用到?:语法中.(ternary,三元运算符)

### 递归组件
一个SFC可以通过文件名,隐式地指向自己.举例说就是,名为`FooBar.vue`的组件,其模板中可以直接用`<FooBar/>`指向自己.  
注意点是,这样调用的优先级比其它导入的组件优先级要低.如果你另外导入的组件跟当前组件名冲突,那你可以利用`import`语句的别名功能:
```js
import { FooBar as FooBarChild } from './components'
```

### 命名空间组件
你可以使用点语法作为组件标签.比如`<Foo.Bar>`.这在你需要从一个文件中导入多个组件时比较有用.  
(自己的理解是,导入源导出了多个组件,而用了这种语法,就可以把这些组件像属性一样,添加到一个对象上,而这个对象就是你自命名的`as something`)
```vue
<script setup lang='ts'>
    import * as Form from './form-components';
</script>
<template>
    <Form.Input>
        <Form.Label>label</Form.label>
    </Form.Input>
</template>
```

## 使用自定义指令
全局注册的自定义指令并没发生变化.而`<script setup>`变的是局部指令的定义:你不需要显式注册了,但这些指令的命名必须遵循`vNameOfDirective`这种命名模式.(就是自定义指令命名必须为`vXXXX`)
```vue
<script setup lang='ts'>
    const vMyDirective = {
        beforeMount:(el) => {
            // do something with the element
        }
    }
</script>
<template>
    <h1 v-my-directive>This is a Heading</h1>
</template>
```
如果你要从别处导入指令,那这条命令也需要重命名为`vXXX`以遵循命名规则.
```vue
<script setup lang='ts'>
  import { myDirective as vMyDirective } from './Mydirective.js'
</script>
```

## `defineProps()` & `defineEmits()`
为了声明props和emits,并有较好的类型推断,我们可以用`defineProps()`和`defineEmits()`这两个API.它们在语法糖内是直接可用的,不需要额外的导入.(?为什么可以)
```vue
<script setup lang='ts'>
  const props = defineProps({
    foo:String
  });
  const emit = defineEmits(['change','delete']);
</script>
```
* `defineProps`和`defineEmits`是**编译宏API(compiler macros)**,仅限于`<script setup>`内使用.它们不需要被导入,在处理`<script setup>`的时候这些代码会被编译为其它内容(compiled away).
* `defineProps`接收的值跟`props`选项一样,`defineEmits`接收的值也跟`emits`选项一样.
* `defineProps`和`defineEmits`根据传进的参数,自带类型推断.
* 给这两个API传进去的配置项,会**被提升到模块作用域而不是限于`setup()`.** 因此配置项内无法访问到setup作用域的局部变量.**如果你在这两个API中访问本作用域内的任意变量,都会造成编译错误.** 不过你可以访问从其它地方引入的绑定值,因为它们的作用域也是模块作用域.

### 针对类型(Type-only)的props/emit声明
Props和Emits,可以用纯正的类型语法来声明.方法是向其传一个字面量类型参数(literal type argument).
```ts
const props = defineProps<{
    foo:string;
    bar?:number;
}>();

const emit = defineEmits<{
    (e:'change',id:number):void
    (e:'update',value:string):void
}>{}

// 3.3+可选语法,更加简洁了
const emit = defineEmits<{
    change:[id:number],
    update:[value:string]
}>()
```
::: tip
`$emit`只接受两个参数,第一个是事件名,第二个是单值/字符串/数组/对象.(多于一个参数都要以数组或对象塞到第二个参数中去了)
:::

* `defineProps`或`defineEmits`只能用一种语法声明:运行时声明(作为函数参数进行限制),**或,**类型声明(作为Typescript特性运行前对类型限制).同时使用两种声明会导致编译错误.
* 用类型声明进行限制时,编译器能自动通过静态分析生成等价的运行时声明,从而避免"双重声明",维持正常的运行时行为.
    * 开发模式下,编译器会尝试从类型中推断对应的运行时验证.比如说这里的`foo:String`,就是从`foo:string`类型推断出来的.如果一个类型被推断为另外的导入类型,那推断的结果会是`foo:null`(等价于`any`类型),因为编译器并不能知道外部文件的任意信息.
    * 生产模式下,编译器会生成数组格式的声明,从而减少打包体积的大小.(以上的props会被编译成`['foo','bar'])
* 在Vue3.2及以下版本,`defineProps`接收的泛型参数仅限是类型字面量,或是本地接口的引用.  

这种限制在v3.3后被解除了.最新版本的Vue支持引用导入的,或是某些复杂的类型.不过由于类型推断在运行时的实现依旧是基于AST的,一些需要实际类型分析的复杂类型还未能得到支持,比如条件类型等.你可以利用条件类型来限制某个特定的prop,但不能用于整个prop对象.

### 响应式Props的解构
从Vue3.5版本开始,从`defineProps`的返回值解构出来的变量也具备响应性了.当`<script setup>`里的代码尝试访问由`defineProps`返回的,解构后的变量,Vue编译器会自动为这些变量添加`props.`前缀.(?)
```js
const { foo } = defineProps(['foo']);

watchEffect(() => {
    console.log(foo);
})
```
以上代码会被编译成这样:
```js
const props = defineProps(['foo']);
watchEffect(() => {
    console.log(props.foo);
});
```
(?是否可以理解为并非解构后依旧带有响应式,而是编译器为其添加了`props.`前缀?)  

此外你可以利用JS原生的解构默认值语法,为某个props设定默认值.这在需要使用基于类型的props声明的场景下相当有用.
```ts
interface Props {
    msg?:string;
    labels?:string[]
}
const { msg = 'hello', labels=['one','two']} = defineProps<Props>();
```

### 使用类型声明时props的默认值
如上所说,自3.5版本起,props默认值的设置允许利用解构赋值设置.但以下的版本设置响应式默认值时依旧需要依赖其它的API来实现,这个API就是`withDefault()`,它也是一个编译宏(compiler macro).
```ts
interface Props{
    msg?:string;
    labels?:string[]
}
const props = withDefault(defineProps<Props>(),{
    msg:'hello',
    labels:() => ['one','two'],
});  // 注意这里的labels需要是个返回数组的函数.原理类似Pinia State需要是个函数.以确保每次调用都是新的值.
```

以上会被编译成等价于以前`default`选项的设置.此外,`withDefault()`具有检查默认值类型的功能,同时避免类型定义中`?:`和设置了默认值时发生冲突.
::: info
注意,当用`withDefault`设置的默认值是引用类型的数值(比如数组或对象)时,需要使用函数将它们返回,从而避免引起意外的修改和外部的副作用(?).同时也能确保每个组件实例拥有属于自己的默认值.  
而如果你用的是解构默认值设置的话就没有这个烦恼了.
:::

## `defineModel()`
* 该功能仅v3.4+版本支持

这个宏的功能是,声明一个可以双向绑定的prop,通过父组件的`v-model`来使用.(?)使用的例子可以看[组件v-model的介绍](https://vuejs.org/guide/components/v-model).  
这个宏的底层实现可以理解为,它**同时声明了一个prop和一个对应更新这个prop的事件**.如果接收的首个参数是一个字符串,那这个字符串就会作为prop的名称;否则这个prop的名称就会默认是`modelValue`.你还可以为这个宏传递一个对象作为参数,这个对象包含prop的配置及这个model ref值的一些变换配置(prop's options and model ref's value transform options)
```js
const model = defineModel(); // 不传任何参数,则prop的名为`modelValue`

const model = defineModel({type:String}); // 或是声明`modelValue`这个prop,并限定它的值为String类型.(以上的prop's options)

model.value = 'hello'; // 当这个值发生变化时触发(emits)"update: modelValue"这个事件

const count = defineModel('count');  // 声明count这个prop,父组件通过`v-model:count`使用

const count =defineModel('count',{ type: Number, default:0}); // 或是声明的同时对其进行一些限制.

function inc(){
    count.value++; // 这个函数触发的同时,触发`update:count`事件.(因为它是一个v-model,父组件也会被通知)
}

```

::: warning
当你在子组件定义`defineModel`时为prop设定了默认值,而在父组件又没有为其设置值,那么可能会引起父子组件不同步的问题(de-synchronization).  
以下的例子就是,父组件的`myRef`是undefined,但却在子组件中设置了`model`的默认值为1.
```js
//子组件
const model = defineModel({default:1});
// 父组件
const myRef = ref();
<Child v-model="myRef" />     // ??? 是这样用的吗?
```
:::

### 修饰符和转换器
如果要访问到`v-model`指令使用的修饰符,我们可以通过解构`defineModel()`的返回值来实现:
```js
const [modelValue, modelModifiers] = defineModel();
// 对应v-model.trim()
if(modelModifiers.trim){
    //...
}
```
如果`v-model`使用了修饰符,我们则很可能需要对值进行一些转换才能读取或将其同步返回给父组件.(?)我们可以通过`get`和`set`这两个变换选项配置:
```js
const [modelValue, modelModifiers] = defineModel({
    // 这里省略了`get()`,因为并不需要用到
    set(value){
        if(modelModifiers.trim){
            return modelValue.trim();
        }
        return value;
    }
})
```

### 配合使用Typescript
与`defineProps`和`defineEmits`相似,`defineModel`也可以接受类型参数,从而对值和修饰器进行类型限制:
```ts
const modelValue = defineModel<string>();

const modelValue = defineModel<string>({reqruied:true});

const [modelValue,modelModifiers] = defineModel<string,'trim' | 'uppercase'>();
// 限定修饰器只能是'trim'或'uppercase'
```

## `defineExpose()`
使用了`<script setup>`的组件默认是闭合的 -- 也就是说通过模板索引(template refs)或是`$parent`链访问到的,组件的公共实例,是不会向外暴露任何在`<script setup>`内声明的绑定值的.  
要显式地暴露组件setup内的属性的话,就要使用`defineExpose`这个宏来声明.
```vue
<<script setup lang='ts'>
    import {ref} from 'vue';
    const a = 1;
    const b = ref(2);
    defineExpose({
        a,b
    })
</script>
```
当父组件通过模板索引获取到这个组件的实例时,返回实例的内容长这样:`{a:number,b:number}`.(refs会像普通实例那样被自动解除包装(?))  

## `defineOptions()`
* 仅支持3.3+版本
这个宏用以直接在`<script setup>`内直接声明组件的配置项而不再需要另外的`<script>`标签了.
```vue
<script setup lang='ts'>
defineOptions({
    inheritAttrs:false,
    customOptions:{/** */}
})
</script>
```
* 这是个宏API,也就是说配置项会被提升到模块作用域(module scope),因此这内部不能访问到局部的变量.(not literal constants?常量就能被访问到了吗?不是作用域限制的问题吗?)

## `defineSlots()`
* 仅支持3.3+版本
这个宏的作用是为IDE提供插槽名字和props类型的检查和提示.  
`defineSlots()`仅接受一个类型参数,不接受运行时参数.这个类型参数需要是一个类型字面量:属性名是插槽的名字,值的类型是插槽函数(?).  
函数的第一个参数是这个插槽期望接收到的props,对应的类型就是期望它用在模板时对应的类型.(?)  
函数的返回类型当前可以忽略,也可以是`any`,不过以后我们可能会增加对插槽内容检测的功能.  
这个宏也会返回一个`slots`对象,这个对象跟setup context返回的,或用`useSlots()`返回的对象是等价的.
```vue
<script setup lang='ts'>
const slots = defineSlots<{
    default(props: { msg: string }) : void
}>()
</script>
```

## `useSlots()` & `useAttrs()`
在`<script setup>`里用到`slots`和`attrs`的场景其实是比较少见的,因为你可以直接在模板中通过`$slots`和`$attrs`访问到.如果真的需要用到,那可以借助`useSlots()`和`useAttrs()`两个工具函数实现.
```vue
<script setup lang='ts'>
import { useSlots, useAttrs } from 'vue';
const slots = useSlots();
const attrs = useAttrs();
</script>
```
它们两个都是运行时函数,返回值跟`setupContext.slots`,`setupContext.attrs`是等价的.普通的Composition API函数中也能使用它们.

## 和普通的`<script>`一起使用
`<script setup>`可以跟普通的`<script>`标签一同使用.  
什么场景下我们依旧需要用到普通的`<script>`标签呢?(edge cases of setup script?)
* 声明一些无法在`<script setup>`内声明的配置项.比如`inheritAttrs`或插件提供的自定义选项.(v3.3+就不受这个限制了)(?不是才说完`defineOptions`就是用来实现这个的吗?)
* 显式声明组件导出的名称(默认情况文件名则为组件名)
* 那些只执行一次的副作用或只创建一次的某些对象.
```vue
<script>
    runSideEffectOnce();
    export default {
        inheritAttrs:false,
        customOptions:{/** */}
    }
</script>
<script setup lang='ts'>
// 每个实例都会执行的,`setup()`内容
</script>
```
以上是一些同一组件需要共同使用两种`<script>`的场景.一些另外需要注意的事情是:
* `<script setup>`里定义了的内容就不要再用普通的`<script>`再定义了,比如定义好了的`props`和`emits`.
* `<script setup>`内创建的变量不会被添加到组件的实例上,也就是说不能通过Options API再访问语法糖内的内容.当然,我们也是非常不建议混合使用两种类型的API的.  

如果你真的发现某些场景`<script setup>`是无法实现的,那我们建议你改用显式声明的`setup()`函数来取代这个语法糖.(或许有用,但绝而不是混合使用Options/Composition.)

## 顶层的`await`
`<script setup>`内可以使用顶层的`await`.编译后的结果会是`async setup()`.仅此而已.
```vue
<script setup lang='ts'>
const post = await fetch(/** */)
</script>
```
此外,`await`语句会被自动编译成`await`之后的保留当前组件实例上下文的格式.(?)
::: warning
`async setup()`必须配合`Suspense`使用,而后者目前还在实验性阶段.我们计划不久后完善它并作文档介绍.如果你现在就对这个功能比较好奇,可以去[这里](https://github.com/vuejs/core/blob/main/packages/runtime-core/__tests__/components/Suspense.spec.ts)看看它是如何工作的.
:::

## 泛型
泛型参数可以在`<script>`标签上加上`generic`属性来声明.
```vue
<script setup lang='ts' generic="T">
defineProps<{
    items:T[]
    selected:T
}>()
</script>
```
`generic`跟Typesript内的`<...>`参数列表工作方式一模一样.比如,你可以使用多个参数,或是`extends`限制符,默认类型,或引用导入的类型:
```vue
<script setup lang='ts' generic="T extends string | number, U extends Item">
import type { Item } from './types'
defineProps<{
    id:T
    list:U[]
}>()
</script>
```
而如果你要用`ref`引用一个泛型组件,那你需要`vue-component-type-helpers`三方库来实现,因为`InstanceType`是实现不了的.
```vue
<script setup lang='ts'>
import componentWithoutGenerics from '../component-without-generics.vue';
import genericComponent from '../generic-component.vue';

import type { ComponentExposed } from 'vue-component-type-helpers';

ref<InstanceType<typeof componentWithoutGenerics>>(); // 对非泛型组件有效
ref<ComponentExposed<typeof genericComponent>>() // 泛型组件则要利用外部函数ComponentExposed
</script>
```

## 限制
* 由于模块语法的执行差异,`<script setup>`内的代码依赖于SFC上下文.如果把这些代码移动到其它`.js`,`.ts`文件内,开发者和开发工具都会理解不了这些代码.因此,`<script setup>`不能跟`src`属性一起使用.(这里的`src`属性是指<script src="xxx.js"`这种用法)
* `<script setup>`不支持In-DOM Root Component Template.([相关讨论](https://github.com/vuejs/core/issues/8391))