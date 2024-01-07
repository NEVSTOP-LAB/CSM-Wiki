可通信状态机（CSM）是一个基于JKI状态机（JKISM）的LabVIEW应用框架。本仓库用于存储CSM的文档和示例代码。

- [可通讯状态机(CSM)框架源码](https://github.com/NEVSTOP-LAB/Communicable-State-Machine)
- [Wiki地址](https://nevstop-lab.github.io/CSM-Wiki/)

_**本仓库使用了以下的开源项目或服务**_：

- 通过 [GitHub Pages](https://pages.github.com/) 服务发布页面
- 使用了 [Jekyll](https://jekyllrb.com/) 静态网站生成器
- 使用了 [sighingnow/jekyll-gitbook](https://github.com/sighingnow/jekyll-gitbook) 主题
- 使用 [untra/polyglot](https://github.com/untra/polyglot) ,一个Jekyll插件，用于多语言支持

_**TODO LIST**_

``` text
网站部分：
- [ ] About 页面(md-page[√]) - English[-] | Chinese [-]
      关于CSM框架的介绍; 关于NEVSTOP-Lab 介绍
- [ ] Contact 页面(md-page[√]) - English[-] | Chinese [-]
      有问题如何联系我们
- [ ] Contributors 页面(md-page[√]) - English[-] | Chinese [-]
      如何参与到项目中来; 项目的贡献者列表
- [ ] Download 页面(md-page[-]) - English[-] | Chinese [-]
      下载CSM框架的最新版本的链接; 历史版本的更新记录
- [√] 404 页面(md-page[√]) - English[√] | Chinese [√]
      404页面
- [ ] 和其他框架比较的页面(md-page[-]) - English[-] | Chinese [-]
      和JKISM 的比较; 和DQMH/SMO/AFW等框架的比较

文档部分：
- JKISM内容介绍
  - [ ] JKISM的介绍(md-page[-]) - English[-] | Chinese [-]
        介绍JKISM的概念和用法; 介绍 JKISM 的优势；介绍 JKISM 的不足; 介绍 JKISM 的应用场景
  - [ ] JKISM的推荐用法(md-page[-]) - English[-] | Chinese [-]
        介绍JKISM的Best Practice

- CSM函数选板/Template
  - [ ] CSM Palette - English[-] | Chinese [-]
        介绍所有CSM的函数
  - [ ] CSM Template - English[-] | Chinese [-]
        介绍CSM的Event模板; 介绍CSM的No-Event模板

- 基础内容部分
  - [ ] CSM的基本概念(md-page[-]) - English[-] | Chinese [-]
        CSM 中所有的基本概念，其他地方用到的都是基于这里的概念来解释的
  - [ ] CSM模块间的通讯(md-page[-]) - English[-] | Chinese [-]
        模块间的同步消息；模块间的异步消息；模块间的状态
  - [ ] 创建CSM的复用模块(md-page[-]) - English[-] | Chinese [-]
        创建CSM的复用模块的方法
  - [ ] 调用CSM的模块(md-page[-]) - English[-] | Chinese [-]
    - [ ] 被CSM框架调用: 使用字符串方式进行调用；使用CSM的API进行调用；指向用到的函数
    - [ ] 被其他框架调用：使用CSM的API进行调用;指向用到的函数
  - [ ] CSM的参数传递(md-page[-]) - English[-] | Chinese [-]
        参数传递在CSM中的特殊性；不同场景目前应该使用的方式
  - [ ] FAQ 页面(md-page[-]) - English[-] | Chinese [-]
        常见问题的解答

- 进阶内容部分
  - [ ] CSM内置的错误处理机制(md-page[-]) - English[-] | Chinese [-]
        举例说明如何使用CSM内置的错误处理机制
  - [ ] 工作者模式(worker Mode)(md-page[-]) - English[-] | Chinese [-]
        说明工作者模式设计的思路；举例说明如何使用工作者模式
  - [ ] 责任链模式(Chain Mode)(md-page[-]) - English[-] | Chinese [-]
        说明责任链模式设计的思路；举例说明如何使用责任链模式

- 预留的插件机制
  - [ ] Addon 接口(md-page[-]) - English[-] | Chinese [-]
        addon留下接口的位置；如何给CSM添加addon
  - [ ] Template 接口(md-page[-]) - English[-] | Chinese [-]
        template留下接口的位置；如何给CSM添加template
  - [ ] Tools 接口(md-page[-]) - English[-] | Chinese [-]
        tools留下接口的位置；如何给CSM添加tools

- (还未实现) LabVIEW的CSM Plugin
  - [ ] (TODO) STRING右键：弹出模块、消息列表，并快速填写(md-page[-]) - English[-] | Chinese [-]
        (待功能实现后补充)
  - [ ] (TODO) STRING右键：替换为SafeString(md-page[-]) - English[-] | Chinese [-]
        (待功能实现后补充)

- 调试工具/调试方法
  - [ ] CSM内置的全局事件(md-page[-]) - English[-] | Chinese [-]
        说明CSM内置的全局事件包含的功能；如何使用全局事件；介绍函数
  - [ ] JKISM State Editor(md-page[-]) - English[-] | Chinese [-]
        介绍JKISM State Editor的功能；介绍如何使用JKISM State Editor
  - [ ] CSM Global Log Window(md-page[-]) - English[-] | Chinese [-]
        介绍CSM Global Log Window的功能
  - [ ] CSM State Dashboard Window(md-page[-]) - English[-] | Chinese [-]
        介绍CSM State Dashboard Window的功能
  - [ ] CSM State Table Window(md-page[-]) - English[-] | Chinese [-]
        介绍CSM State Table Window的功能
  - [ ] (TODO) CSM Test Panel(md-page[-]) - English[-] | Chinese [-]
        (待功能实现后补充)

- Addon/Plugins
  - [ ] MassData参数支持(md-page[-]) - English[-] | Chinese [-]
        说明MassData应用的场景, 链接到REPO
  - [ ] API String参数支持(md-page[-]) - English[-] | Chinese [-]
        说明API String应用的场景, 链接到REPO
  - [ ] INI/静态参数支持(md-page[-]) - English[-] | Chinese [-]
        说明INI/静态参数应用的场景, 链接到REPO

- 应用列表
  - [ ] Continuous Measurement and Logging Project(md-page[-]) - English[-] | Chinese [-]
  - [ ] <<补充其他的项目>>
```
