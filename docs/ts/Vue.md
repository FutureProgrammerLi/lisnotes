# 怎么在Vue里用Typescript
> 是间歇性踌躇满志的周期,就是晚上喝咖啡半夜三更就起床不知道做什么的阶段.  
> 适逢最近对TS有点兴趣,就总结一下,Typescript如何在Vue,React组件中使用吧.  
> 参考文章: https://fadamakis.com/better-vue-components-with-typescript-12-examples-3bf141d39784

## `props` with Typescript
自然从最容易理解的属性入手了,用/不用TS限定一个组件需要的Props,是怎么样的:  
先说不用的,利用Vue提供的defineProps, Macro API进行限制:

```vue
<script setup>
const props = defineProps({
    msg:String,
    age:{
        required:true,
        type:Number
    }
});
// defeinProps({/** */})  // 直接用也是可以的,就不用解构,props.xxx了.
</script>
<template>
    <div>
        {{ props.msg }}
        {{ props.age }}
    </div>
</template>
```
目前看来,不用ts,报错的地方在浏览器控制台,还只是警告.VSC里完全没提示报错. ❌  
果然是自己配置错误,组件名里带了个Props,引入的时候就报错了.**两种方式报错方式都是一样的. IDE和控制台都有报错提示.** ✔

用TS又是怎样呢?硬说区别其实也不大,看利用的特性而已了.
```vue
<script setup lang="ts">
interface Proptypes {
    msg?: string,
    age: number
} 
defineProps<Proptypes>()
// defineProps<{msg :string}>()  // HelloWorld.vue自带的例子是这样的
</script>
```
一个用的传参,一个用的泛型.

## `emits` with Typescript
有`defineProps`,Vue里当然也少不了`defineEmits`了.既表明组件要接收什么内容,又要表明组件会发送什么内容,才可以说明组件怎样才可以正常运作.
```vue
<script setup>
    // defineEmits(['change','update']);
    defineEmits({
        press:Array,     // <eventName> : <expected arguement>
    })
</script>
```
是不是太简单了点? 只说明了会发送什么,期望接收什么参数.自身如果带一些参数,参数类型是什么,又要怎么说明呢?
那加上TS,又能补全一些什么功能呢?  
```vue
<script setup lang='ts'>
    // 自定义emit事件press,带的参数必须是一个数字数组,要怎么定义呢?
    defineEmits<{
        (e:'press', para:Number[]): void
    }>();
    // defineEmits<{
        // press:[para:Number[]]
    // }>()
</script>

<script setup lang='ts'>
    defineEmits<{   // 3.3+ 才有的功能. "More Succint syntax"
        change:[id:number],  
        update:[value:string]
    }>()
</script>
```
**精简下来,最方便的方法就是`defineEmits<{eventName:[arg:type]}>()`**

## `ref`& `reactive` with Typescript
由于Typescript的类型推断特点,用`ref`和`reactive`定义的"变量",在定义的时候就给"打上烙印",你改变它们的类型直接就会报错了.

```vue
<script setup lang="ts">
    import {ref, reactive} from 'vue';

    const count = ref(0);
    const person = reactive({
        gender:'male',
        age:20
    });
    function changeValue(){
        count.value = 'some other value';  // Type 'string' is not assignable to type 'number'.
        person.age = "22";      //Type 'string' is not assinable to type 'numebr'
    }
</script>

```

### Bonus: `computed` with Typescript
跟`ref`类似,定义的时候就会类型推断.不符合就会直接报错:
```vue
<script setup lang='ts'>
import {ref, computed} from 'vue';
const count = ref(0);
const double = computed(() => count.value.split(''));  // Property 'split' does not exist on type 'number'
// 直接显式限制computed类型
const tripple = computed<number>(() => count.value * 3);
</script>

```

## Response with Typescript
怎么用Typescript,结合Vue,限制服务器响应的数据类型呢?比如说如何规定,响应的数据必须带有某个属性?数据必须符合某种类型?

有点问题, 会自动补全`{{person?.name}}`,而无法准确预测获取到的数据会是怎样的.
```vue
<script setup lang='ts'>
    import { ref,onMounted } from 'vue';
    interface User {
        name: string,
        birthday: string
    }
    const person = ref<User | null>(null);
    onMounted(async () => {
        const res = await fetch('http://localhost:5000/person');
        const data = await res.json();
        person.value = data;
    });
</script>
<template>()
    <div>{{ person?.name }}</div>
</template>

```

## Typing Scoped Slot
`Slot`这种东西,弄了这么久还是不懂怎么用.加上Typescript能限制什么呢?用Slot有什么可以被限制的呢?目前还是云里雾里.  
给slot传Props有什么作用? `defineSlots`限制的是某个slot里需要具有某个props.  
比如,
```vue
<script setup lang='ts'>
defineSlots<{
    default(props:{msg:string}): any
}>()
</script>
```
限制默认插槽,都必须带有`msg`这个prop, 但是:
```vue
<template>
<slot msg='abcd'></slot>  
</template>
```
这里的作用是什么?  
作用是父组件能通过`v-slot="slotProps"`, `slotProps.msg`,获取到这个默认插槽向父组件传递的`msg`内容.  

**所以总结就是,`defineSlots`,限定了哪个插槽,会向父组件传递怎么样的数据.**  
一开始的例子解释就是,默认插槽default,会向父组件传递`msg`这个值.

## `Provide` & `Inject` with Typescript
如果`props`和`slot`用来传递单层的数据,那`provide`,`inject`则可以理解为跨越组件层级的传递数据.  
既然也是传递数据,那当然也可以用TS来限制传递什么样的数据了.  
试了一下,根本限制不了,无论是`provide`和`inject`,IDE都不会报错.  
正常情况是:
```vue
<script setup lang='ts'>
import { key } from '../keys/InjectionKeys'
// export const key = Symbol() as InjectionKey(string)

import { provide } from 'vue';

provide(key,'foo'); // 如果不是`foo`这个字符串类型的值就会报错.因为InjectionKey<string>这里进行了值的限制
</script>

```
结果是`provide(key,1234)`也没有报错!!!  
还是`InjectionKey<string>`并没有对提供的值进行限制?要在inject的时候再进行限制?  

## Generics with Vue
看起来很有用,限定了组件对一组相同类型的数据,可以进行怎样的操作.  
关键词是`items`,`selected`.在一堆相同类型的数据中,选取其中的一或多个.
```vue
<!-- ListComponent -->
<script setup lang='ts' generic='T'>
defeinProps<{
    items:T[],
    selected:T
}>()
</script>
<template>
    <div>
        <h2>{{ selected }} </h2>
    <ul>
        <li v-for="(item,index) in items" :key="index">
            {{ item}}
        </li>
    </ul>
    </div>
</template>
```

之后就可以输入不同类型的数据,得到对应形式的输出了.
```vue
<script setup lang='ts'>
import ListComponent from './ListComponent.vue';
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Doe' }
];

const selectedUser: User = users[0];
</script>
<template>
<!-- 以下T分别为number, string, User -->
    <ListComponent :items="[1,2,3,4]" :selected="2" /> 
    <ListComponent :items="["Apple","Banana","Cherry"]" selected="Cherry" />
    <ListComponent :items="users" :selected="selectedUser" />
</template>
```

## Composables with Typescript
自己写的除了组件,在Vue中还会有自己的Composition API.就是自定义Vue hooks.  
同样可以利用Typescript告诉其它开发者,自己编写的Composables需要哪些类型的输入,输出的类型又是怎样的.
```js
import { ref, watchEffect, Ref } from 'vue';
interface UseLocalStorageOptions<T>{
    key:string;
    defaultValue?: T;
} 

export function useLocalStorage<T>(options:UseLocalStorageOptions<T>):Ref<T>{
    const { key, defaultValue = null } = options;
    const value:Ref<T> = ref(defaultValue) as Ref<T>;
    watchEffect(() => {
        const item = localStorage.getItem(key);
        if(item){
            try {
                value.value = JSON.parse(item)
            } catch (e) {
                localStorage.removeItem(key);
            }
        } else{
            localStorage.setItem(key,JSON.stringify(value.value));
        }
    });
    return value
}

```
先忽略内部实现细节,单看函数声明你就可以知道以下信息:
1. 该自定义hook接收一个`options`参数,参数包括一个必选属性,字符串`key`,及可选属性,任意类型的默认值`defaultValue`
2. 返回一个`ref()`值.  

到此TS的作用对于这个hook而言已经完全发挥出来了.

## State Management with Typescript
据说,Vue另起炉灶,抛弃Vuex,改用Pinia的原因之一就是,Pinia有更好的Typescript支持.  
Pinia精简下来就是,只提取了必要的功能:`State`,`Actions`,`Getters`.  
直接用Pinia的代码解释Typescript在其中的作用吧.其实类似于普通setup里面的ref,computed,和function.
```ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Customer } from '@/types';

export const useCustomerStore = defineStore('customerStore', () => {
    const isRequestLoading = ref(false); // auto inferred, as boolean
    const totalCustomers = ref(0); // inferred as number;

    //  complex type inferrence;
    const customers = ref<Array<Customer>>([]); // typed as an array of Customer

    // Action
    function setCustomers(newCustomers:Customer[]){
        customers.value = newCustomers;
        totalCustomers.value = newCustomers.length;
    }

    // Getter
    const activeCustomers = computed(() => {
        return customers.value.filter(cus => cus.isActive);
    });

    return {
        customers,
        totalCustomers,
        isRequestLoading,
        setCustomers,
        activeCustomers
    }
})

```
可能有点用的就是,`const customers = ref<Array<Customer>>([])`这条语句了,限定了这个ref是个对象数组,对象的属性都要符合`Customer`这个interface.

接下来,就去React看看,Typescript是否还需要限制这么多东西,又能限制些什么其它的东西了.