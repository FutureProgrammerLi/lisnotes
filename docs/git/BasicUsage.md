# 协调工具
> 除了git,当然还svn或是其它.svn用过一段事件,用的类似GitDesktop一样的可视化工具,表面上帮大忙,不过感觉不得劲,像开了长者模式一样,会用鼠标就"会"用这个工具.  
> 本文主要自己总结的,git的一些常用命令,以及可能会用到的流程.  
> 官网教程:https://git-scm.com/doc  
> 本文参考:https://juejin.cn/post/6869519303864123399?searchId=2024061915240942974E293AE2114BCDCB  
作者:TianTianUp

## 最日常的流程
```bash
# 开发前与远程仓库同步
$ git pull origin dev # 从远程的origin分支代码拉到本地dev分支上
# ... 处理可能的冲突
$ git commit -m 'solving conflicts'

# ... 开始本地开发
$ git add .
$ git commit -m 'This is a commit'
$ git push  #如果当前分支名和远程分支名相同的话可行 
```

## 从本地到远程的流程
![Git working flow](/gitflow.png)
**从右到左依次解释就是:**
* 在当前**workspace工作区**编写你的代码blablabla
* `git add`,将本地代码添加到**暂存区Index**.此时依旧与远程无关,一切还是在本地.
* `git commit`,将代码**从本地缓存区提交到本地仓库**.此时**可能与远程仓库有关**,这个操作已经写入日志.
* `git push`,**从本地仓库提交到远程仓库**.你的所有代码都与远程仓库同步,此时你所有本地进行过的操作都能从远程仓库上看到.  

***

**从左到右反向解释:**
* `git pull:`将远程代码全部拉到你的本地仓库之中.是`git fetch`和`git merge HEAD`两个操作的结合.
```bash
$ git pull <repository> <branchname>
#  same as the following two
$ git fetch <repository>
$ git merge <repository>/<branchname>
```
* `git fetch`或者`git clone`,将远程仓库代码拉到本地仓库.此时与你当前的工作区代码暂时还没有关系.
* `git merge`或者`git checkout -m`,将拉到本地仓库的代码,与当前你所在的工作区代码进行合并.*此时你可能会遇到冲突需要手动解决.  

## 基本的概念
* 工作区(workspace):未进行任何操作时的git仓库.
* 暂存区(Stage): `git add` 的目的地,暂时存放在磁盘(?)
* 本地仓库(Repository):`git commit`的目的地,开始"有迹可循"(别人不一定看到,你没push的话.但在自身电脑的git log上起码有条记录了.)
* 远程仓库(Remote):`git push`的目的地.多人协作的最终目的.在本地电脑上写的东西真正在这里与他人共享/合作.

### 什么都没有时,你可能需要的配置
1. 初始化git仓库: `git init`  
2. 配置当前仓库的个人信息(告诉仓库你是谁)
```bash
$ git config --global user.name "YourName"
$ git config --global user.email "YourEMail"
```
3. 将本地代码推送到远程用到的命令:
```bash
$ git add <filename>
$ git commit -m 'message' # m代表message
$ git branch -M main # 将当前的分支命名为main. M代表--move --force,移动或重命名分支名称.
$ git remote add origin https://github.com/FutureProgrammerLi/Get-a-readme.git 
# git remote add <name> <URL>
# <name>分支名,这里是origin, <URL>远程仓库的地址.
```
4. 将本地已存在的仓库推送到远程仓库:
```bash
$ git remote add origin https://github.com/FutureProgrammerLi/Get-a-readme.git
$ git branch -M main
$ git push -u origin main
# 将本地main分支推送到远程仓库的origin分支上.
```

## 一些需要知道的指令或配置(杂七杂八)
* `git checkout`
* `git branch` (?与`git checkout -b`有什么区别?)
* `git switch` (?这和上面两条又有什么区别?)
* `git stash`
* `git rebase`
* `git diff`

## 暂存区命令`git stash`
可能是比较有用的一条命令:当前分支开发时,不得不切换分支对其它问题进行修改,但当前分支又没开发完,用不着commit.
```bash
# ...为当前分支开发得满头大汗...
# ...被叫去其它分支修复BUG...
# ...working in main branch...
$ git stash  # 将当前修改内容放到暂存区
# git switch sub
$ edit emergency fix
$ git commit -a -m "Fix a hurry"
$ git switch main
$ git stash pop
```

`git stash`, `git commit`, `git switch sub`会有三种不同的内容.  
在main分支上,`git stash`的内容,是在`git commit`上一次提交之后进行的修改.这些内容如果你不进行新一次的commit,或者再stash,是**无法进行分支切换的**.  
新一次stash或者commit之后,你可以切换到其它分支`git switch sub`.对应内容是sub分支的上一次commit内容.  
而在sub分支上完成修改commit以后,你才可以切换到main分支,`git stash pop`对你已经修改的内容继续修改.  
上一次commit -> 新修改 -> (中断需要去别的分支) -> stash -> switch -> 其它分支上的新修改并commit -> 切换到原来的分支 -> stash pop继续修改
![Stash flow](/stash-flow.png)
<p class="text-xs font-bold text-blue-300">自己画的流程,希望之后再看还能看懂吧(!?)</p>

::: danger
stash的东西是分不清分支的,你在main分支的东西,可以在sub分支上pop.一般不这样用,但确实可以这样做错.
:::

弄清`git stash`这条命令之后,可以对它进行一些细节操作了:(增删改查)
* (增)`git stash -m 'Stash with some message'` (类似`git commit -m 'message'`)
* (改/删)`git stash pop` 或者`git stash apply [--index] [<stash>] + git stash drop [--index] [<stash>]`.区别就是`pop`默认用stash栈上的第一个,后者`apply`不会对stash栈进行删除.(一般都是用--index,格式是stash@{0}这样的.\<stash>这个哈希值不知道从哪查的)
```bash
$ git stash pop 
# 等价于
$ git stash apply stash@{0}
$ git stash drop stash@{0}
```
* (查) `git stash list`:查看stash过哪些,如果不加message根本分不清stash了哪些内容.
* (删) `git stash clear`: 清空stash栈.

---

## git分支 branch
* (增)创建分支
```bash
$ git branch <branchname>
# 或者
$ git checkout -b <branchname>

$ git checkout -b <branchname> origin/<remote_branch_name>
# 把远程remote_branch_name的内容拉取到本地的branchname这个分支上,并切换到branchname分支

# 创建远程分支
$ git push -u origin local_branchname:remote_new_branch
$ git push origin remote_new_branch
$ git push origin HEAD # 本地分支与远程分支名称一样时要这样操作,把HEAD指回当前main分支
```
* (删)删除分支
```bash
$ git branch -d <branchname1> <branchname2> #...

# 删除远程分支
$ git push origin -d <branchname>
```

* (改)分支重命名/复制并重命名
```bash
$ git branch -m oldName newName
# 复制并重命名
$ git branch -c oldName sameAndNew
```

* (改)切换分支
```bash
$ git switch <branchname>
# 语义上switch更清晰,但实际运用上 checkout -b好像更多!?
# 或者,创建并切换到该分支
$ git checkout -b <branchname>
# 等价于
$ git branch <branchname>
$ git switch <branchname>
```
::: danger
`git switch`到一个不存在的分支时会报错.
:::

* (查)查看本地/远程分支
```bash
$ git branch -a # 包括本地及远程仓库的所有分支
$ git branch [--list] # 查看本地仓库的分支 
$ git branch -r # 查看远程仓库分支
```

* 合并分支
```bash
$ git merge <branchname>

$ git pull
```

## 切换到某次commit,撤销某次commit
* 切换到某次commit
```bash
$ git checkout <commit-hash>
$ git checkout main~0 # 切换回main分支最新的一次commit上
# 或者
$ git checkout main
$ git reset --hard HEAD     # 同上,切换到最新的main commit上
```

* 撤销某次commit
```bash{4}
$ git revert commit_hash

# 撤销到第四次commit并创建一次新的commit with reverted changes
$ git revert HEAD~3 # 好用好理解

# 放弃上面的修改内容返回到revert之前的状态
$ git revert --abort
```

## 文件状态分析
![File status](/status-flow.png)
新建的文件<span class="text-green-400 inline">Untracked</span>->  
`git add`之后,<span class='text-green-400'>Staged/Index Added</span>->   
`git commit`之后, 该文件变成<span class='text-orange-300'>Tracked</span>->  
再对该文件进行修改<span class='text-orange-300'>Modified</span>   

***
一般VSC的颜色提示就能知道文件的状态.如无提醒可用`git status`查看当前仓库下各文件状态.
![File Status hinted by IDE](/file-status.png)