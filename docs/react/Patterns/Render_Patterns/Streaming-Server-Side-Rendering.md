# 流式服务器端渲染

我们利用流式服务器端渲染网站内容,从而减少TTI的同时利用到服务器渲染技术.为了不用创建一个包含了当前路由所有必要的标记内容的HTML文件,我们可以将它们分割成多个更小的块.流(stream)可以让我们像水流一样,缓缓不断地向响应对象中输入数据,换句话说是,我们可以不断连续地发送数据到客户端.客户端一旦接收完某个块的数据后,对应内容就可以被渲染出来.  

React内置的`renderToNodeStream`方法,使得我们可以以块为单位将应用内容传输给客户端.由于客户端可以一边渲染UI,一边接收数据,用户就可以获得比较好的初次加载体验.之后在接收到的DOM节点上调用`hydrate`方法将对应事件处理器给绑定上后,用户就可以与页面互动了.  

假如说我们有一个向用户展示数千条与猫咪相关的信息组件要渲染:
```js
// server.js
import React from 'react';
import path from 'path';
import express from 'express';
import { renderToNodeStream } from 'react-dom/server';

import App from './src/App';

const app = express();
const DELAY = 500;
app.use('/client.js', (req,res) => res.redirect('/build/client.js'));
app.use((req,res,next) => {
    setTimeout(() => {
        next();
    }, DELAY);
});

const BEFORE = `
<!DOCTYPE html>
  <html>
    <head>
      <title>Cat Facts</title>
      <link rel="stylesheet" href="/style.css">
      <script type="module" defer src="/build/client.js"></script>
    </head>
    <body>
      <h1>Stream Rendered Cat Facts!</h1>
      <div id="approot">
`.replace(/
s*/g, "");

app.get('/',async (req,res) => {
    try {
        const stream = renderToNodeStream(<App/>);
        const start = Date.now();
        stream.on('data',function handleData(){
            console.log('Remder start at: ' ,Date.now() - start);
            stream.off("data",handleData);
            res.useChunkedEncodingByDefault = true;
            res.writeHead(200,{
                'content-type':'text/html',
                'content-transfer-encoding':'chunked',
                'x-content-type-options':'nosniff',
            });
            res.write(BEFORE);
            res.flushHeaders();
        });
        await new Promise((resolve,reject) => {
            stream.on('error', err => {
                stream.unpipe(res);
                reject(err);
            });
            stream.on('end',() => {
                console.log("Render end:", Date.now() - start);
                res.write('</div></body></html>');
                res.end();
                resolve();
            });
            stream.pipe(res,{end:false});
        })     
    } catch (err) {
        res.writeHead(500,{
            "content-type":'text/plain'
        });
        res.end(String((err && err.stack) || err));
        return;
    }
});

app.use(express.static(path.resolve(__dirname, "src")));
app.use("/build", express.static(path.resolve(__dirname, "build")));

const listener = app.listen(process.env.PORT || 2048, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
```

这样`App`组件就会通过`renderToNodeStream`方法被流式渲染.最初的HTML内容就会先发送到响应对象中,后续伴随着以块为单位的,App组件的数据.
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Cat Facts</title>
    <link rel="stylesheet" href="/style.css" />
    <script type="module" defer src="/build/client.js"></script>
  </head>
  <body>
    <h1>Stream Rendered Cat Facts!</h1>
    <div id="approot"></div>
  </body>
</html>
```
这些数据包含了一个页面正确渲染所必须的信息,比如文档的title和样式表.如果我们利用`renderToString`方法,服务器端渲染`App`组件,我们就不得不等到所有的数据都获取到了,才开始加载和处理以上的元数据.于是我们利用`renderToNodeStream`方法,开始加载和处理这些元数据的同时,接收关于App组件的块信息.  
> **"更多关于渐进式注水和服务器端渲染的例子,可以到[这个github仓库查看](https://github.com/GoogleChromeLabs/progressive-rendering-frameworks-samples)"**  

> **[看看styled-components是如何利用流式渲染优化样式的传输的](https://medium.com/styled-components/v3-1-0-such-perf-wow-many-streams-c45c434dbd03)**

## 概念
跟渐进式注水相似,流式传输是另一种可以提升SSR性能的渲染机制.恰如其名,"流"的意思是被分块的HTML在服务器端生成后,会像流水一样"流向"客户端.这样哪怕是代码量大的页面,客户端页也能更早地接收到内容的"字节",人话就是TTFB减少了,而且值是相对稳定的.主流的浏览器都能更早地编译和渲染流式传输回来的,或是来自响应的部分内容.由于这个渲染过程是渐进式的,自然就有更好的FP和FCP性能了.  

流式传输能较好地适应各种网络状况.当网络被阻塞,不再能传输字节时,渲染器会被告知相关信号并停止渲染,直到网络恢复后才继续先前的工作.因此,服务器占用的内存量会更少,可以更快地响应其它I/O条件.换种方式解释就是,你的Node服务器可以同时渲染多个请求,而不会因某个请求的工作量大而长时间阻塞其它工作量较小的请求.最终的效果是,哪怕服务器工作量大,网站的响应也能保证一定的均衡速度.  

## React里的流式传输
React在2016年的v16版本就开始支持流式传输的功能.以下由`ReactDOMServer`提供的API就是用来实现流式传输的:

1. `ReactDOMServer.renderToNodeStream(element)`: 这个函数输出的HTML跟`ReactDOMServer.renderToString(element)`是相同的,不同的是,前者格式是[Node.js的可读流(readable stream)](https://nodejs.org/api/stream.html#stream_readable_streams),而后者是字符串.这个函数只能在服务器上运行,把HTML渲染为流.接收到这个流的客户端可以用`ReactDOM.hydrate()`方法,对网页元素进行注水,使之变得可交互.  
2. `ReactDOMServer.renderToStaticNodeStream(element)`:这个方法跟`ReactDOMServer.renderToStaticMarkup(element)`相对应.同样是HTML输出相同,但格式不同,前者是流式格式.它用于在服务器上渲染静态的,无需交互的页面,并将结果流式传输给客户端.  

通过以上两个方法生成的可读流,一旦你开始读取它,它就能发送字节给你.具体实现就是把这个可读流,通过管道的方式变成可写流(writable streams,比如响应对象(?)).响应对象就会渐进式地将数据块发送给客户端的同时,等待新的需要被渲染的块.  

结合以上,我们看看具体的代码架构是怎样的([具体代码看这](https://mxstbr.com/thoughts/streaming-ssr/)):
```js
// server.js
import { renderToNodeStream } from 'react-dom/server';
import Frontend from '../client';

app.use('*',(request,response) => {
  // 向浏览器发送HTML的起始内容
  response.write('<html><head><title>Page</title></head><body><div id="root">');

  // 将前端内容渲染为流,并以网络响应的方式传给客户端
  const stream = renderToNodeStream(<Frontend />);
  stream.pipe(response, { end: false});
  // 告知流不要在渲染器结束工作时自动停止响应

  // 当React完成渲染后,把HTML网页剩余的标签内容给补全
  stream.on('end',() => {
    response.end('</div></body></html>')
  });
});

```

下图是使用普通SSR和使用流式传输时,Time to First Byte和First Meaningful Paint的性能对比:(TTFB/FMP)
![comparison](/RenderPatterns/comparison-ssr-streaming.png)

## 流式渲染的SSR -- 好处和坏处
流式传输的目标是提升React SSR的速度,具有以下优点:

1. **性能提升:** 服务器开始渲染后不久,网站首字节就能传输到客户端上,TTFB自然就可以比普通的SSR更好了.而且它可以一定程度上忽略网站的具体大小,在各种规模的网站都保持一致的性能表现.客户端在接收到HTML的时候就可以开始解析内容,FP和FCP所需的时间自然也就更少了.  
2. **缓解网络状况:** 流式传输在网络压力巨大,或者说网络拥堵时同样能表现优秀,在网络条件苛刻时也能保持一定的响应速度.  
3. **支持SEO:** 流式传输的响应可被搜索引擎爬虫所读取,因此网站的搜索引擎优化也是得到支持的.  

值得注意的是,实现流式传输不是简单地把`renderToString`替换成`renderToNodeStream()`方法.有时候利用SSR实现的代码,到流式传输时就不能如常工作了.    
以下情况就是不容易实现方法切换的例子:**(坏处)**
1. 一些需要在服务器渲染的块之前,就要由服务器渲染,生成标记,并插入到文档的框架.比如一些需要动态决定,哪些CSS样式在HTML文档开头就要用`<style>`标签插入;或是在渲染时通过文档的`<head>`标签,把元素添加到文档的框架.[一些折中的解决办法可以看看这里](https://medium.com/styled-components/v3-1-0-such-perf-wow-many-streams-c45c434dbd03#:~:text=Streaming%20server%2Dside%20rendering%20was,handle%20back%2Dpressure%20more%20easily.)(或者看不懂我说的"框架"到底是什么也可以去看看这个讨论,medium).
2. 用`renderToStaticMarkup`生成网站模板,并要用`renderToString`生成动态内容的代码.由于这些场景下,组件渲染的字符串是必须要有的,所以这时候就不能将它们替换成流来传输.  
[代码举例](https://hackernoon.com/whats-new-with-server-side-rendering-in-react-16-9b0d78585d67)如下:
```js
res.write("<!DOCTYPE html>");

res.write(renderToStaticMarkup(
   <html>
   <head>
     <title>My Page</title>
   </head>
   <body>
     <div id="content">
       { renderToString(<MyPage/>) }
     </div>
   </body>
 </html>);
)

```

流式传输和渐进式注水,都能提升SSR和CSR的体验.  
后续你可以比较所有的渲染模式,探索一下它们各自适用的场景.  

--- 
感谢你能看到这里.React设计模式这个系列就结束了.希望对你有帮助!