<script setup>
    import Example from './components/Example.vue'
</script>

# Reusing style

> https://tailwindcss.com/docs/reusing-styles#using-editor-and-language-features  
我为什么很喜欢用这个样式框架?会CSS就会用它.  
符合我play around的特性,不用相当细致,但够用.  
为什么单独翻译这章?  
一直有个困扰,乍看单写类确实方便,但一堆类加起来才能获得想要的样式的话,到底要怎么抽离?  
就是类似再抽象一层,利用TailwindCSS封了一层,怎么再将它封一层.  

举个例子我的red paragraph snippet长这样:
```text
<p class='font-bold text-red-600'>Content</p>
```
怎么把它再包一层?像这样:
```text
.my-para{
    font-bold,
    text-red-600
}   
完全臆想,如果能实现就好了.
```
**总结问题就是,单个类够实用了,多个类怎么又堆叠到一起而做到不冗余?**

*** 
回到官方教程.是自己的理解+教程的结合,不完全按照原文翻译.

有时,冗余在所难免.举个例子:
<Example/>
```html
<div>
  <div class="flex items-center space-x-2 text-base">
    <h4 class="font-semibold text-slate-900">Contributors</h4>
    <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">204</span>
  </div>
  <div class="mt-3 flex -space-x-2 overflow-hidden">
    <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
    <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
    <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt=""/>
    <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
    <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
  </div>
  <div class="mt-3 text-sm font-medium">
    <a href="#" class="text-blue-500">+ 198 others</a>
  </div>
</div>
```

密密麻麻的类足以令人头大.那就查查文章,看看有哪些解决方法,什么时候用哪种方法吧.
## 1. "天才"用法,利用编辑器快捷键
* `ctrl+D`选择下一个相同的单词并同时进行修改
* `Alt+鼠标左键`多个光标同时修改
* `Ctrl+Alt+Up/Down`,上面的快捷键版本, 1=2+3+人力找相同
> "There's no benefit to introducing any additional abstraction if you can edit them simultaneously."....

## 2. 利用循环,HTML里写CSS
其实更像写JSX,不是循环生成元素,而是循环生成样式.

```HTML
<div>
  <div class="flex items-center space-x-2 text-base">
    <h4 class="font-semibold text-slate-900">Contributors</h4>
    <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">204</span>
  </div>
  <div class="mt-3 flex -space-x-2 overflow-hidden">
    {#each contributors as user}
      <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white" src="{user.avatarUrl}" alt="{user.handle}"/>
    {/each}
  </div>
  <div class="mt-3 text-sm font-medium">
    <a href="#" class="text-blue-500">+ 198 others</a>
  </div>
</div>
```
<p class='text-xs text-blue-300 font-bold'>用CDN的我已经阵亡了...跟模板语法一样,越学越倒退了.</p>
除了循环你也可以用`map`循环生成元素.将JSX的内容,扩展到样式上面去.(???好像就是JSX)
```html
<nav className="flex sm:justify-center space-x-4">
  {[
    ['Home', '/dashboard'],
    ['Team', '/team'],
    ['Projects', '/projects'],
    ['Reports', '/reports'],
  ].map(([title, url]) => (
    <a href={url} className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">{title}</a>
  ))}
</nav>
```

## 3.样式重复?用组件就不用重复了
展示元素能抽成组件文件,样式放到组件里不就行了?  
好像也对.样式粒度跟组件粒度一样就不用担心重复了.  
例子代码就不复述了.就是普通的组件文件+CSS类样式的结合.

## 4.跟传统HTML和CSS在同一个文件里有什么区别?
区别在于HTML可以用JSX写.看你要抽象的是CSS还是HTML了.  
抽象HTML,就是JSX.抽象CSS,就是原生古早的html文件.  
这是React的功劳还是Tailwind的功劳?  
传统HTML文件长这样:
```HTML
<!-- 原生CSS也会各种重复 -->
<!-- Even with custom CSS, you still need to duplicate this HTML structure -->
<div class="chat-notification">
  <div class="chat-notification-logo-wrapper">
    <img class="chat-notification-logo" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div class="chat-notification-content">
    <h4 class="chat-notification-title">ChitChat</h4>
    <p class="chat-notification-message">You have a new message!</p>
  </div>
</div>

<style>
  .chat-notification { /* ... */ }
  .chat-notification-logo-wrapper { /* ... */ }
  .chat-notification-logo { /* ... */ }
  .chat-notification-content { /* ... */ }
  .chat-notification-title { /* ... */ }
  .chat-notification-message { /* ... */ }
</style>
```
<p class='font-bold text-red-600'>真不是简化了类名?</p>
用了组件化框架,比如这里的React:

```jsx
function Notification({ imageUrl, imageAlt, title, message }) {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
    {/* 不是还没解决一堆类名的问题? */}
      <div className="shrink-0">
        <img className="h-12 w-12" src={imageUrl.src} alt={imageAlt}>
      </div>
      <div>
        <div className="text-xl font-medium text-black">{title}</div>
        <p className="text-slate-500">{message}</p>
      </div>
    </div>
  )
}
```

## 利用@apply

<button class='btn-primary'>Save changes</button>
