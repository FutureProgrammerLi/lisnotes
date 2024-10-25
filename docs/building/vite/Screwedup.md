# 是搞砸的一次经历
想优化一下这个网站,结果从原来的15s打包,变成了35秒!不愧是我!  
所以本篇的作用是自己在优化Vitepress时的一些总结,虽然反向优化了,但也要从中学习一点vite优化的操作.

## 抛砖引玉
> :How to optimize vitepress app?

> :1. Enable Gzip or Brotli Compression  
    2. Optimize images  
    3. Leverage Caching  
    4. Reduce Bundle Size  
    5. Minify CSS and JS  
    6. Preload important resources  
    7. Optimize fonts  
    8. Reduce API calls  
    9. Monitor Performance  
    10. Use CDN for assets  
    11. Utilize Vite plugins.  

应该不难看出,这就是标准的机器人回答了吧.  
那我就不客气了,一股脑利用插件给自己的应用,"提升"一下性能:
其实针对当前网站我只用了插件这一条,就是插件+自行配置完成一些资源的优化:
1. Gzip压缩,用的`vite-plugin-compression2`; 打包出来的dist多了个`.gz`文件,15M变6K.至于怎么用好像就要部署时再解压了.
2. 图片优化,用的`vite-plugin-image-optimizer`;似乎是压缩了图片,`assets`文件夹里多了好多小于10KB的新图片,命名还是加了乱码后缀的,应该是`ViteImageOptimizer()`的作用?
9. 监控性能, 用的`rollup-plugin-visualizer`,就是打包之后多个html文件,查看打包后的文件各个部分大小.对当前项目而言,最占地方的是Vitepress提供的搜索功能,打包后大小有1M,去掉后打包直接从35S降到之前的15S.
```JS
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';
export default defineConfig({
    plugins:[
        ViteImageOptimizer(),
        compression({
            filename:'whatever.gz'
        }),
        visualizer({
            open:true,
            filename:'bundle-visualizer.html'
        })
    ]
})
```
::: warning
吐槽一下,这里为什么还要专门安装vite,专门从vite引入`defineConfig`?  
以下代码是运行不了的,说是某个依赖vitepress处理不了?
```ts
import {defineConfig} from 'vitepress'

export default defineConfig({
    vite:{
        plugins:[
            /**内容与上面一样 */
        ]
    }
})

```
:::

一些优化操作,在Next看到了,但实际使用上又要过脑才行,起码要闪过:
2. 图片优化,在Next里的自带组件`<Image>`就是优化后的结果.(这就是为什么在Next建议用`<Image>`取代原生的`<image>`)  

3./6. 启用缓存和预加载重要资源. 
 Next自动对资源/请求进行缓存,是Next本身实现的优化,以及对`fetch`请求的一些interception optimizations.  
预加载也是自带组件`<Link>`的一个功能

7. 字体优化,也是Next构建项目时就有的优化操作了.实现细节不详,但Next就是有这个优化


