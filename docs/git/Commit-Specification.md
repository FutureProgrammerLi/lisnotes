# Commit规范

> 初衷是在微信公众号里看到的关于git commit的一些规范,说实话,就是"提交公式",但仅一个单词,一个冒号,就bring my work experience back了.  
> 自己开发commit过很多次,但在工作的时候,为数不多的commit,也是比自己开发的规范的.  
> 总结就是,`git commit -m'fix: xxx/ feature: xxx'`.也是工作规范之一吧,自己开发的话自己看懂就行,哪还会真的用上.But,what if? 自己开发的时候也把这些规范给用上会有什么好处是我没发现的呢?  
> 原文: https://mp.weixin.qq.com/s/MGWEetoARsFkJCIIBtsyag  
> 作者公众号:快乐号

## Commit格式

```bash
<type>(<scope>): <subject>
<blank>
<description>

<类型>(<范围>): <主题>
<空行>
<描述>
# 原谅我在命令行里写中文..不知道text类型怎么高亮
```

| type |  description  |
| ---- |  :---------: |
| feat | 新增/新开发了xxx功能 |
| fix  | 修复了xxx问题/bug |
| docs | 变更了xxx文档 | 
| refactor | 重构了xxx功能/页面/代码 |
| test | 测试xxx功能 |
| chore | 维护xxx模块/功能块 |
| style | 修改了xxx样式 |

感觉自己可能会用到的是以下几个:
* `feat`: 开发基本就是为了这个功能.介绍自己这次commit**新开发/增添了什么功能**.
* `fix`: 救火必备了.有bug就要fix,尽量与测试描述问题一致.
* `style`: 修改样式,虽然可能没那么重要,但也应该写到commit上来.
* `refactor`: 基本很小概率用到了,如果不是跟其他人开发相同模块,基本是写给自己看的.

再重新解释下命令行内的各个词语意思吧,一切的一切都是**git commit -m'xxx'**, 这里的xxx.  
* **类型**: 提交的类型,在哪里做了什么修改,影响了项目什么.是commit的重中之重,相当于给这次commit"定调".
* **范围**: 可选关键词,表明修改影响的模块或组件.
* **主题**: 简洁描述本次提交的内容,一般到这里就可以结束了,如果不是太严格或者需要额外说明的话.
* **描述**: 是主题的补充.主题描述不够说明提交内容的话可以在这里展开讲.

示例:
```bash
$ git commit -m'feat:(auth): 添加用户登录功能'
$ git commit -m'fix(ui):修复导航栏错位的问题
导航栏错位测试(commit换行测试)'
```
:::tip
`git commit -m''` 怎么换行? 用单/双引号.  
单引号开始,不以单引号结尾,直接回车就时换行\>  
单引号结束,就是结束换行,完成提交.(双引号同理,-m后面什么引号,就以什么引号结束才算一条完整命令)  
```bash
$ git commit -m'abc"      # 回车
> defg" # 回车
> this line will end'  # 回车则完成提交
```
:::

**注意事项:**
* **简洁明了**:尽量压缩表达内容,但意思又要清楚.(算不算考验能力??)
* **英文撰写**:公式用英文,主题描述用不用英文看水平.(啊这这样打自己脸吗>)
* **避免合并提交**: 合并分支时尽量使用`--no-ff`选项创建合并提交,保留分支的历史记录.


## 分支命名
可能有用也可能没用,按实际开发需求.(多大规模才要连分支都要细分成这样呢?)
* **主分支`master/main`:** 生产环境的稳定代码,重中之重的一条分支.项目最终的代码.发布所在分支,尽量避免直接提交代码到此分支上.(快照式何明或变基(merge/rebase))
* **开发分支`develop`:** 开发者主要所在分支.算是开发者日常.主分支是一栋大厦的话,开发分支算是楼层.(仅便于理解)
* **发布分支`release`:** 准备发布新版本时从开发分支分出.用于最后阶段测试,文档更新等,最终合并到`master/main`分支并打上`tag`.
* **功能分支`feature`:** 算是开发分支的子分支."楼层"里的一个个"工作室".
* **修复分支`hotfix/bugfix`:** 顾名思义,在该分支上对产品进行问题修复.

**分支命名规范:**
大概就是该分支的主要功能是什么,就以其作为名称.就是上面的`main/develop/release/feature/bugfix.`  
这段的意思可能是在此基础上对其再次分出分支.例如`feature/login`,`hotfix/login-page`等等.
<p class="text-xs text-blue-300 font-bold">阿所以项目要到什么规模才需要如此细致的分类呢?</p>