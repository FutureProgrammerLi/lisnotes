# Nestjs初识
> [书接上文](./backend.md),初始化Nestjs项目后先对目录结构进行分析,通过类比的方式学习.

## 创建项目

```bash
$ npm install -g @nestjs/cli
$ nest new project-name --strict  
# strict表示项目使用Typescript
```

## 目录结构
```txt
/src
├── app.controller.spec.ts  // 控制器测试文件
├── app.controller.ts       // 控制器文件
├── app.module.ts           // 模块文件
├── app.service.ts          // 服务文件
└── main.ts                 // 入口文件
```

根据Express的"伪分类"来类比,对应文件对应抽象层分别是:
1. 入口: `main.ts` => 对应Express的`app.js`
2. 路由层: `app.module.ts` => 对应Express的`routes`
3. 控制器层: `app.controller.ts` => 对应Express的`controller`,`router.get('/',(req,res) => {});`这里的`get` => `@Get()`
4. 服务层: `app.service.ts` => 对应Express的`router.get('/',(req,res) => {});`这里的`(res,req) => {});` 匿名函数的内容
5. 中间件层
6. 数据库层
7. 模型层

567层目前都还没有,而且还有个疑问,哪里决定的访问localhost:3000后,返回`Hello World`的?  
没有类似`app.get('/',(res,req) => {res.send('Hello World')});` 这里的`'/'`" ?

## 各个文件的标识
1. 入口: `app.listen(PORT)`
2. 模块:
```ts
@Module({
    imports:[],
    controllers:[],
    providers:[],
})
```
3. 控制器:
```ts
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
```
4. 服务层:
```ts
@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World';
    }
}
```
main => module => controller => service;  
::: warning 
如果controller里不得不调用service里的内容的话,是不是module里,有多少个controller,就要有多少个service?  
:::

## 利用Mongoose,结合Nestjs连接数据库
[官网教程连接Mongoose/Nestjs](https://docs.nestjs.com/techniques/mongodb#mongo)  
以下只是实践中觉得需要提取的内容,我更推荐你去提取属于自己的理解,毕竟重点可能不同. 

### app.module.ts
```ts
@Module({
  imports: [
    ConfigModule.forRoot({      // 这里配置了全局变量,下面才能用`process.env.MONGO_URI`
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),  // 连接数据库
    CatModule       // 导入cat模块,这里导入了才能访问到localhost:3000/cats
  ],
  controllers: [AppController],
  providers: [AppService],
})
```

### 怎么变更访问路径
一开始以为跟前端路由一样,修改文件夹名就能改变访问路径(比如将cats文件夹改为animal,就能访问到localhost:3000/animal),结果不行.  

结果是`@Controller('cats')` 这里修改了访问路径.把`@Controller('cats')`改为`@Controller('animal')`就能访问到localhost:3000/animal,并返回相同内容了.  

::: details 修改访问路径的方法
1. 修改控制器前缀
```ts
@Controller('cats')
// ==>
@Controller('animal')
```
2. 使用路由重定向
```ts
// app.controller.ts
class AppController {
    @Get('cats')
    @Redirect('/animals', 301)
    redirectToAnimals() {}
    // ...
}
```
3. 同一个方法响应
:::
### Platform-supported
1. Express
2. Fastify
```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
// const app = await NestFactory.create<NestFastifyApplication>(AppModule);
```

## 控制器基本介绍
`@Controller('cats')`这里是路由的前缀,可以在类里的具体方法名内再添加路径,表示该前缀下,具体路径对应的方法,比如:
```ts
@Controller('cats')
export class CatsController {
    @Get('breed') // 对应的请求路径就成了@GET /cats/breed
}
```
响应请求的方法有两种,一种是直接返回JS的原始类型,其它交由Nest处理.  
另一种是利用装饰器,使用框架为我们封装的响应对象(比如用Express的),哪种更熟悉就用哪种.
```ts
// 方法2
// @Res()代表Express或Fastify, @Next()代表Express里的next()函数.
// 前者会直接禁用Nest的默认响应,需要手动调用send()/json()等方法,后者不会.
@GET()
findAll(@Res() response){
  response.status(200)send('Hello World');  // 这里就用到了Express里的东西了
}
```
说到响应体`@Res`,怎么少得了请求体呢?  
用`@Req`装饰器就可以获取请求体内容了.(??后续的`@Body`怎么办,你直接拿了我请求体里最重要的东西我还要请求体来做什么?)
```ts
import { Request } from 'express';  // 要先安装@types/express依赖才能引入
@Get()
findAll(@Req() request: Request){
  return `With request`;
}
// @Post()
// create(@Body() createCatDto: any){   // ???
//   return this.catsService.create(createCatDto);
// }
```
`@Req`是整个请求对象了(`@Res`也是), 如果只需要个别属性,可以直接使用对应的装饰器:
| 装饰器 | 描述 |
| --- | --- |
| `@Req()` | 整个请求体对象 |
| `@Res()` | 整个响应体对象 |
| `@Next()` | 中间件方法 |
| `@Body()` | 请求体 |
| `@Query()` | 请求参数 |
| `@Param()` | 请求参数 |
| `@Headers()` | 请求头 |

Nest有所有标准的HTTP请求方法装饰器,包括:

| 装饰器 | 描述 |
| --- | --- |
| `@Get()` | 获取资源 |
| `@Post()` | 创建资源 |
| `@Put()` | 更新资源 |
| `@Delete()` | 删除资源 |
| `@Patch()` | 更新资源 |
| `@Options()` | 获取资源选项 |
| `@Head()` | 获取资源头 |
| `@All()` | 匹配所有 |

上面的`@All()`针对的是所有请求方法, 而`*`针对的是该控制器路径下的**所有子路径**.  
比如:
```ts
@Controller('cats')
export class CatsController {
  @Get('*')
  allSubpaths():string{
    return 'All /cats/* will match this';
  }
}
```
## 状态码/响应头/重定向
状态码/响应头/重定向 这三个功能,你既可以使用装饰器设置,也可以使用框架封装的API作为响应
```ts
import {HttpCode, Header, Redirect, Res} from '@nestjs/common';
@Post()
@HttpCode(204)
@Header('x-powered-by', 'NestJS')
@Redirect('https://nestjs.com', 301)
create(){
  return 'Test'
}

// 如果利用框架封装,就成了这样:
import { Response } from 'express';
@Post()
create(@Res() response: Response){
  response.status(204).set('x-powered-by', 'NestJS').redirect('https://nestjs.com').send('Test');
}
// 这里需不需要return?
```

如果需要根据条件配合装饰器实现重定向,可以这样,返回一个`HttpRedirectReponse`这样格式的对象(由`@nestjs/common`提供)
```ts
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
@getDocs(@Query('version') version){
  if(version && version === '5'){
    return {  // 这里就是一个HttpRedirectReponse对象
      url:'https://docs.nestjs.com/v5/'     
    }
  }
}
```

## 动态路由参数
```ts
@Get(':id')
findOne(@Param() params: any): string{
  return `Cat id: ${params.id}`;
}

// 也可以直接在装饰器里声明你需要的动态参数名称
  import { Param } from '@nestjs/common';
@Get(':id')
findOne(@Param('id') id: string): string{
  return `Cat id: ${id}`;
}
```

## 子域路由(sub-domain routing)
`@Controller()`除了可以是字符串,还可以是一个对象,包含`host`属性,表示请求域名对应某些特定值(?)
```ts
@Controller({host: 'admin.example.com'})
export class CatsController {
  @Get()
  index(): string{
    return 'Admin page';
  }
}
```
(有点高级,不同主机host可以对应不同请求,先跳过)

::: details 访问不同host对应的控制器
1. 修改系统hosts文件  
编辑系统的 hosts 文件，添加自定义域名映射:  
* Windows: C:\Windows\System32\drivers\etc\hosts
*Mac/Linux: /etc/hosts
添加如下内容：
```plaintext
127.0.0.1   api.localhost
127.0.0.1   admin.localhost
127.0.0.1   tenant1.localhost
127.0.0.1   tenant2.localhost
```

然后访问：
* http://api.localhost:3000
* http://admin.localhost:3000
* http://tenant1.localhost:3000

2. 用`curl`或POSTMAN在请求时手动设置Host头  
```bash
curl -H "Host: api.localhost" http://localhost:3000
```
或在Postman访问`localhost:3000`时,在`Headers`里设置`Host`为`api.localhost`

P.S. 这里的api/admin/tenant1甚至可以是动态的,跟前面的动态路由参数类似.  
如果要获取该值,则用`@HostParam()`装饰器.
```ts
@Controller({host: ':account.example.com'})
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string){
    return account;
  }
}
```
:::

**Nest允许路由处理器返回RxJS的Observable streams**
```ts
@Get()
findAll(): Observable<any[]>{
  return of([1,2,3]);
}
```

## 请求负载(写完回填到上面)
DTO(Data Transfer Object),定义传输的对象数据格式是怎样的,需要有什么属性.  
Nestjs官方建议我们使用ES6的`class`来定义而不是用TS的`interface`,因为后者经转译后会在运行时丢失定义,后续的`Pipes`功能可能还会依赖这个定义.

```ts
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age:number;
  breed:string;
}

// cats.controller.ts
@Post()
async create(@Body() createCatDto: CreateCatDto){
  return 'This action adds a new cat';
}
```
## 查询参数
基本类型
```ts
@Get()
async findAll(@Query('age') age: number, @Query('breed') breed: string){
  return `Cat age: ${age}, breed: ${breed}`;
}

// /cats?age=1&breed=Persian
```
如果需要用查询参数传递复杂类型,你可以用`extended`编译器:
```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.set('query parser', 'extended');

// 如果是Fastify
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({
    querystringParser: (str) => qs.parse(str),       // 需要安装qs依赖 `npm install qs`
  }),
);
```

## One liner
一条命令总结生成上面所有:
```bash
$ nest g resource cats
```
做了什么?(以RESTful为例,如果不需要生成测试文件,可以加`--no-spec`参数)
1. 生成cats.controller/module/service.ts, 还有两个测试文件
2. 生成了dto和entities两个文件夹:dto包含了创建和更新cats时,前端需要传递的数据格式(cats需要有什么属性); entities定义了cats本身具有什么属性.
3. 在`app.module.ts`里导入了cats模块, 这样就可以访问到localhost:3000/cats了.

中间件/守卫/管道/拦截器/控制器方法/过滤器的执行顺序

中间件(middleware) -> 守卫(guards) -> 拦截器(interceptors) -> 管道(pipes) -> 控制器方法(controller method) -> 拦截器(interceptors) -> 过滤器(filters)

管道的作用:**一是数据验证,二是数据转换.**















