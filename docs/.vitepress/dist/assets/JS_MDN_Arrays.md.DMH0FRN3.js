import{_ as i}from"./app.2yxPTDxC.js";import{c as a,o as t,ab as e}from"./chunks/vendor.cEhGAX-6.js";const m=JSON.parse('{"title":"MDN关于Array的介绍总结","description":"","frontmatter":{},"headers":[],"relativePath":"JS/MDN/Arrays.md","filePath":"JS/MDN/Arrays.md","lastUpdated":null}'),r={name:"JS/MDN/Arrays.md"};function o(s,l,n,c,d,p){return t(),a("div",null,l[0]||(l[0]=[e(`<h1 id="mdn关于array的介绍总结" tabindex="-1">MDN关于Array的介绍总结 <a class="header-anchor" href="#mdn关于array的介绍总结" aria-label="Permalink to “MDN关于Array的介绍总结”">​</a></h1><blockquote><p>原文地址:<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" target="_blank" rel="noreferrer">Array</a></p></blockquote><h2 id="创建数组" tabindex="-1">创建数组 <a class="header-anchor" href="#创建数组" aria-label="Permalink to “创建数组”">​</a></h2><p>从一个疑问开始吧:</p><div class="language-ts vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> arr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Array</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(arr);</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>以上代码会创建一个长度为10的数组,还是10作为第一个元素的,只有一项的数组呢?<br> 提示一下,如果你知道Array.of()方法的作用,你就知道为什么要额外添加上这个静态方法了.(former one, 10*undefined)</p><h2 id="数组的静态方法" tabindex="-1">数组的静态方法 <a class="header-anchor" href="#数组的静态方法" aria-label="Permalink to “数组的静态方法”">​</a></h2><p>总结下Array中的方法,常见的方法再展开说.不少是看参数就能看出作用的.<br> 发现了,MDN中的方法是根据A-Z排序的.也算是自己查找的一条线索吧.</p><ul><li>静态方法 <ul><li><ol><li>Array.from()</li></ol></li><li><ol start="2"><li>Array.of()</li></ol></li><li><ol start="3"><li>Array.isArray()</li></ol></li><li><ol start="4"><li>Array.fromAsync() // 不常用就不介绍了</li></ol></li></ul></li><li>实例属性 <ul><li><ol><li>Array.prototype.length</li></ol></li><li><ol start="2"><li>Array.prototype.constructor</li></ol></li><li><ol start="3"><li>Array.prototype[Symbol.unscopables]</li></ol></li></ul></li><li>实例方法(主要, 省略了<code>Array.prototype</code>前缀) <ul><li><ol><li>at(index)</li></ol></li><li><ol start="2"><li>concat(arr2)</li></ol></li><li><ol start="3"><li>copyWithin(target, start[, end])</li></ol></li><li><ol start="4"><li>entries()</li></ol></li><li><ol start="5"><li>every(callback)</li></ol></li><li><ol start="6"><li>fill(value[, start, end])</li></ol></li><li><ol start="7"><li>filter(callback)</li></ol></li><li><ol start="8"><li>find(callback)</li></ol></li><li><ol start="9"><li>findIndex(callback)</li></ol></li><li><ol start="10"><li>findLast(callback[, thisArg])</li></ol></li><li><ol start="11"><li>findLastIndex(callback[, thisArg])</li></ol></li><li><ol start="12"><li>flat(depth)</li></ol></li><li><ol start="13"><li>flatMap(callback)</li></ol></li><li><ol start="14"><li>forEach(callback)</li></ol></li><li><ol start="15"><li>includes(value[, fromIndex])</li></ol></li><li><ol start="16"><li>indexOf(searchElement[, fromIndex])</li></ol></li><li><ol start="17"><li>join(separator)</li></ol></li><li><ol start="18"><li>keys()</li></ol></li><li><ol start="19"><li>lastIndexOf(searchElement[, fromIndex])</li></ol></li><li><ol start="20"><li>map(callback)</li></ol></li><li><ol start="21"><li>pop()</li></ol></li><li><ol start="22"><li>push(element1, element2, ...)</li></ol></li><li><ol start="23"><li>reduce(callback)</li></ol></li><li><ol start="24"><li>reduceRight(callback)</li></ol></li><li><ol start="25"><li>reverse()</li></ol></li><li><ol start="26"><li>shift()</li></ol></li><li><ol start="27"><li>slice(start, end)</li></ol></li><li><ol start="28"><li>some(callback)</li></ol></li><li><ol start="29"><li>sort(compareFunction)</li></ol></li><li><ol start="30"><li>splice(start, deleteCount, item1, item2, ...)</li></ol></li><li><ol start="31"><li>toLocaleString()</li></ol></li><li><ol start="32"><li>toReversed()</li></ol></li><li><ol start="33"><li>toSorted(compareFunction)</li></ol></li><li><ol start="34"><li>toSpliced(start, deleteCount, item1, item2, ...)</li></ol></li><li><ol start="35"><li>toString()</li></ol></li><li><ol start="36"><li>unshift(element1, element2, ...)</li></ol></li><li><ol start="37"><li>values()</li></ol></li><li><ol start="38"><li>with(index, value)</li></ol></li><li><ol start="39"><li>[Symbol.iterator]()</li></ol></li></ul></li></ul><h2 id="查找" tabindex="-1">查找 <a class="header-anchor" href="#查找" aria-label="Permalink to “查找”">​</a></h2><ol><li><p>找元素</p><ul><li>find(callback)</li><li>findLast(callback)</li><li>at(index)</li><li>includes(value[, fromIndex])</li></ul></li><li><p>找索引</p><ul><li>indexOf(searchElement[, fromIndex])</li><li>lastIndexOf(searchElement[, fromIndex])</li><li>findIndex(callback)</li><li>findLastIndex(callback)</li></ul></li></ol><h2 id="遍历" tabindex="-1">遍历 <a class="header-anchor" href="#遍历" aria-label="Permalink to “遍历”">​</a></h2><p>条件遍历:</p><ol><li>every(callback)</li><li>some(callback)</li><li>filter(callback) 任意函数遍历:</li><li>forEach(callback)</li><li>map(callback)</li><li>reduce(callback)</li><li>reduceRight(callback)</li></ol><h2 id="修改" tabindex="-1">修改 <a class="header-anchor" href="#修改" aria-label="Permalink to “修改”">​</a></h2><pre><code>增删改
* push(element1, element2, ...)
* pop()
* shift()
* unshift(element1, element2, ...)
</code></pre><p><strong>splice(start, deleteCount, item1, item2, ...)</strong></p><h2 id="转换" tabindex="-1">转换 <a class="header-anchor" href="#转换" aria-label="Permalink to “转换”">​</a></h2><ol><li>转换为字符串 <ul><li>join(separator)</li><li>toString()</li><li>toLocaleString()</li></ul></li><li>扁平化 <ul><li>flat(depth)</li><li>flatMap(callback) // 先map再flat</li></ul></li></ol><h2 id="其它" tabindex="-1">其它 <a class="header-anchor" href="#其它" aria-label="Permalink to “其它”">​</a></h2><p>前者改变原数组,后者返回新数组.</p><ol><li>reverse() 和 toReversed()</li><li>sort() 和 toSorted()</li><li>splice() 和 toSpliced()</li></ol><p>with(index, value) splice(start, deleteCount, item1, item2, ...) sort(compareFunction) reduce(callback)</p>`,23)]))}const b=i(r,[["render",o]]);export{m as __pageData,b as default};
