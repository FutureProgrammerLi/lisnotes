import{_ as s,c as i,o as t,a3 as a}from"./chunks/framework.qbo0Fpj6.js";const m=JSON.parse('{"title":"Commit规范","description":"","frontmatter":{},"headers":[],"relativePath":"git/CommitSpec.md","filePath":"git/CommitSpec.md"}'),e={name:"git/CommitSpec.md"},n=a(`<h1 id="commit规范" tabindex="-1">Commit规范 <a class="header-anchor" href="#commit规范" aria-label="Permalink to &quot;Commit规范&quot;">​</a></h1><blockquote><p>初衷是在微信公众号里看到的关于git commit的一些规范,说实话,就是&quot;提交公式&quot;,但仅一个单词,一个冒号,就bring my work experience back了.<br> 自己开发commit过很多次,但在工作的时候,为数不多的commit,也是比自己开发的规范的.<br> 总结就是,<code>git commit -m&#39;fix: xxx/ feature: xxx&#39;</code>.也是工作规范之一吧,自己开发的话自己看懂就行,哪还会真的用上.But,what if? 自己开发的时候也把这些规范给用上会有什么好处是我没发现的呢?<br> 原文: <a href="https://mp.weixin.qq.com/s/MGWEetoARsFkJCIIBtsyag" target="_blank" rel="noreferrer">https://mp.weixin.qq.com/s/MGWEetoARsFkJCIIBtsyag</a><br> 作者公众号:快乐号</p></blockquote><h2 id="commit格式" tabindex="-1">Commit格式 <a class="header-anchor" href="#commit格式" aria-label="Permalink to &quot;Commit格式&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">type</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&gt;(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">scope</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">)</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">subject</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">blank</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">description</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">类型</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&gt;(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">范围</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">)</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">主题</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">空行</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">描述</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 原谅我在命令行里写中文..不知道text类型怎么高亮</span></span></code></pre></div><table><thead><tr><th>type</th><th style="text-align:center;">description</th></tr></thead><tbody><tr><td>feat</td><td style="text-align:center;">新增/新开发了xxx功能</td></tr><tr><td>fix</td><td style="text-align:center;">修复了xxx问题/bug</td></tr><tr><td>docs</td><td style="text-align:center;">变更了xxx文档</td></tr><tr><td>refactor</td><td style="text-align:center;">重构了xxx功能/页面/代码</td></tr><tr><td>test</td><td style="text-align:center;">测试xxx功能</td></tr><tr><td>chore</td><td style="text-align:center;">维护xxx模块/功能块</td></tr><tr><td>style</td><td style="text-align:center;">修改了xxx样式</td></tr></tbody></table><p>感觉自己可能会用到的是以下几个:</p><ul><li><code>feat</code>: 开发基本就是为了这个功能.介绍自己这次commit<strong>新开发/增添了什么功能</strong>.</li><li><code>fix</code>: 救火必备了.有bug就要fix,尽量与测试描述问题一致.</li><li><code>style</code>: 修改样式,虽然可能没那么重要,但也应该写到commit上来.</li><li><code>refactor</code>: 基本很小概率用到了,如果不是跟其他人开发相同模块,基本是写给自己看的.</li></ul><p>再重新解释下命令行内的各个词语意思吧,一切的一切都是<strong>git commit -m&#39;xxx&#39;</strong>, 这里的xxx.</p><ul><li><strong>类型</strong>: 提交的类型,在哪里做了什么修改,影响了项目什么.是commit的重中之重,相当于给这次commit&quot;定调&quot;.</li><li><strong>范围</strong>: 可选关键词,表明修改影响的模块或组件.</li><li><strong>主题</strong>: 简洁描述本次提交的内容,一般到这里就可以结束了,如果不是太严格或者需要额外说明的话.</li><li><strong>描述</strong>: 是主题的补充.主题描述不够说明提交内容的话可以在这里展开讲.</li></ul><p>示例:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;feat:(auth): 添加用户登录功能&#39;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;fix(ui):修复导航栏错位的问题</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">导航栏错位测试(commit换行测试)&#39;</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p><code>git commit -m&#39;&#39;</code> 怎么换行? 用单/双引号.<br> 单引号开始,不以单引号结尾,直接回车就时换行&gt;<br> 单引号结束,就是结束换行,完成提交.(双引号同理,-m后面什么引号,就以什么引号结束才算一条完整命令)</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;abc&quot;      # 回车</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&gt; defg&quot; # 回车</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&gt; this line will end&#39;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 回车则完成提交</span></span></code></pre></div></div><p><strong>注意事项:</strong></p><ul><li><strong>简洁明了</strong>:尽量压缩表达内容,但意思又要清楚.(算不算考验能力??)</li><li><strong>英文撰写</strong>:公式用英文,主题描述用不用英文看水平.(啊这这样打自己脸吗&gt;)</li><li><strong>避免合并提交</strong>: 合并分支时尽量使用<code>--no-ff</code>选项创建合并提交,保留分支的历史记录.</li></ul><h2 id="分支命名" tabindex="-1">分支命名 <a class="header-anchor" href="#分支命名" aria-label="Permalink to &quot;分支命名&quot;">​</a></h2><p>可能有用也可能没用,按实际开发需求.(多大规模才要连分支都要细分成这样呢?)</p><ul><li><strong>主分支<code>master/main</code>:</strong> 生产环境的稳定代码,重中之重的一条分支.项目最终的代码.发布所在分支,尽量避免直接提交代码到此分支上.(快照式何明或变基(merge/rebase))</li><li><strong>开发分支<code>develop</code>:</strong> 开发者主要所在分支.算是开发者日常.主分支是一栋大厦的话,开发分支算是楼层.(仅便于理解)</li><li><strong>发布分支<code>release</code>:</strong> 准备发布新版本时从开发分支分出.用于最后阶段测试,文档更新等,最终合并到<code>master/main</code>分支并打上<code>tag</code>.</li><li><strong>功能分支<code>feature</code>:</strong> 算是开发分支的子分支.&quot;楼层&quot;里的一个个&quot;工作室&quot;.</li><li><strong>修复分支<code>hotfix/bugfix</code>:</strong> 顾名思义,在该分支上对产品进行问题修复.</li></ul><p><strong>分支命名规范:</strong> 大概就是该分支的主要功能是什么,就以其作为名称.就是上面的<code>main/develop/release/feature/bugfix.</code><br> 这段的意思可能是在此基础上对其再次分出分支.例如<code>feature/login</code>,<code>hotfix/login-page</code>等等.</p><p class="text-xs text-blue-300 font-bold">阿所以项目要到什么规模才需要如此细致的分类呢?</p>`,19),l=[n];function h(p,o,r,k,d,g){return t(),i("div",null,l)}const F=s(e,[["render",h]]);export{m as __pageData,F as default};
