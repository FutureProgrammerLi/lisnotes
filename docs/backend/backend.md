# 是没被Nestjs"污染前"的认识
不知为何,最近对Express的分层有点兴趣.  
起初是利用Express的中间件,路由,控制器层实现鉴权时,目录结构的划分,引起了我对后端功能划分结构的兴趣.  

![express-scaffold](/backend/express-scaffold.png)

这种连接数据库, 控制器层,中间件层,模型层,路由层的分层结构吸引了我的注意.  
因为像"Service","Controller"等这样的词汇一般是后端才比较熟悉的.  
虽然Express也是后端,但对比Java,Python这种正儿八经的后端语言,利用Javascript兼项后端还是略显逊色.  
随即转向Nestjs,发现Nest很多概念是"借鉴"Java的Spring框架的.也算是跨界的第一步了,了解Nest变相相当于了解Spring了.  

在了解Nest前简要阐述我对Express目录分层,对应目录下,代码所完成的工作吧.  

## Express里的"伪分层"
* 1. 入口
* 2. 路由层
* 3. 控制器层
* (3+1. 服务层)
* 4. 中间件层
* 5. 数据库层
* 6. 模型层

---

1. 入口,`app.js`: 这里是后端的总开关,后续所有的分层都要在这里汇总
```ts
const express = require('express');
const app = express();

const connect = require('./db/connect');
connect();

app.use('/',indexRouter);

app.listen(PORT,() => {});
```

---
2. 路由("地址")层,`routes`: 这里管理接口URL,就是决定访问哪个URL会是404?处理某些逻辑?还是返回某些数据的地方.
```ts
// routes/index.ts
router.get('/',(req,res) => {
    res.send('Hello World');
});
module.exports = router;
```

---
3. 控制器层: 这层在前端的必要性目前看来有待商榷.因为它本质上是将上面路由层的匿名函数单独提取到了新的文件夹中,用代码理解一下吧:
```ts
router.post('/register',(req,res) => {});  // 路由层这里有个匿名函数

// 用了控制器层后就是将这个匿名函数提取到另外文件中
// controller/authController.ts
const register = async  (req, res) => {};

// 之后回到我们的路由层就变成这样
const { register } = require('../controller/authController');
router.post('/register',register);
```

是好是坏,是否有必要,交由你来权衡.

---
4. 中间件层  
相比控制器层,中间件单独提取到独立文件夹的必要性更为突出.控制器(上面的匿名函数)是必要的,而中间件层则不一定.后者是**加强某个路由的功能的**.
```ts
// middleware/authMiddleware.ts
const verifyToken = (req,res,next) => {/* */}; 
module.exports = verifyToken;

// 回到我们的路由层就变成这样
// routes/index.ts
const {verifyToken} = require('../middleware/authMiddleware');
router.post('/register',verifyToken,register);  // 显然这里的verifyToken不是必要的
```

---
5. 数据库层
这里规定后端如何连接数据库.**连接**而已,还没开始对数据库进行操作.

---
6. 模型层  
通过这里定义数据库长什么样.数据库里有哪些字段,字段类型是什么,字段之间有什么关系.

---
(3+1. 服务层 services)  
为什么是3+1,因为按照rbac那个项目的划分,控制器又可以有两个功能: 一个处理HTTP请求,另一个处理数据库交互(比如在数据库里创建新的词条).  
二者同时整合到控制器层了,如果项目确实比较规范,则要将控制器层拆分出以上两个功能.  

---
好了,去Nestjs研究一下了,回来再验证一下我的初步认识是否正确吧.
