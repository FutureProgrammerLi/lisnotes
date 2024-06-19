# 协调工具
> 除了git,当然还svn或是其它.svn用过一段事件,用的类似GitDesktop一样的可视化工具,表面上帮大忙,不过感觉不得劲,像开了长者模式一样,会用鼠标就"会"用这个工具.  
> 本文主要自己总结的,git的一些常用命令,以及可能会用到的流程.  
> 官网教程:https://git-scm.com/doc  
> 本文参考:https://juejin.cn/post/6869519303864123399?searchId=2024061915240942974E293AE2114BCDCB  
作者:TianTianUp

## 最日常的流程
```bash
$ git add .
$ git commit -m 'This is a commit'
$ git push
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
* 工作区
* 暂存区
* 本地仓库
* 远程仓库

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
$ git stash  # 将当前修改内容放到暂存区
$ edit emergency fix
$ git commit -a -m "Fix a hurry"
$ git stash pop
```

test: do some changes.blablabla,test which branch will the stash change.

This line is commited on the main branch.
