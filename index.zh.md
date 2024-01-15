---
title: 可通信状态机框架(CSM)
layout: home
lang: zh
permalink: /
---

<!--  [50%] HOME 页面(md-page[x]) - English[√] | Chinese [√]
- [x] CSM框架的介绍
- [x] CSM框架的特点
- [ ] CSM框架的应用场景
- [x] CSM框架的下载链接
- [x] 开源资源使用说明
 -->

[![Image](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/badge.svg?metric=installs)](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/)
[![Image](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/badge.svg?metric=stars)](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub all releases](https://img.shields.io/github/downloads/NEVSTOP-LAB/Communicable-State-Machine/total)](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases)
[![Build_VIPM_Library](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Build_VIPM_Library.yml/badge.svg?branch=main)](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Build_VIPM_Library.yml)
[![Check_Broken_VIs](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Check_Broken_VIs.yml/badge.svg?branch=main)](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Check_Broken_VIs.yml)

## 可通信状态机（CSM）简介

可通信状态机（CSM）是一个基于JKI状态机（JKISM）的LabVIEW应用框架。它遵循 JKISM 的模式，扩展了关键词以描述模块之间的消息通信，包括同步消息、异步消息、状态订阅/取消订阅等概念-这些是创建可重用代码模块所必需的要素。请访问CSM Wiki页面了解更多信息: <https://nevstop-lab.github.io/CSM-Wiki/>

- 关于 JKI State Machine(JKISM) 更多信息, 请访问: <http://jki.net/state-machine/>
- 关于 Communicable State Machine(CSM) 更多信息, 请访问: <https://github.com/NEVSTOP-LAB>

![CSM Async Call](assets/img/Homepage%20Image.png)

> 📓
> 如果想了解更多详细信息，请阅读 wiki 的技术细节章节
>

## CSM 的特点

- :anchor: 完全继承了 JKISM 易扩展、字符串格式消息、状态机的特点
- :anchor: 通过消息通信实现模块间的解耦，支持同步消息、异步消息、状态订阅/取消订阅
- :anchor: 同步消息、异步消息均支持响应，并会返回执行时发生的错误
- :anchor: CSM 编写的模块就是 VI，VI 就是模块，以子 VI 的方式进行调用
- :anchor: CSM 编写的模块不仅可以在 CSM 框架中使用，也提供在非 CSM 框架中使用的方式
- :anchor: 通过插件，增加参数传递能够携带的数据，以减弱 JKISM 只能携带 string 类型数据的限制
- :anchor: 内置全局的错误处理机制
- :anchor: 内置的协作者模式(worker mode), 能够很简单的实现任务并发机制
- :anchor: 内置的责任链模式(chain mode), 能够很简单的实现责任链
- :anchor: 提供了丰富的调试工具和接口，能够很方便的进行调试*

>
> 📓 说明：CSM 的调试工具，还有很多在开发中，敬请期待
>

## 下载

CSM 通过 VIPM Library 的形式发布，您可以通过以下方式下载：

- 🥇 **推荐：通过 VIPM 应用搜索 CSM 获取 CSM 的最新发布版本，然后点击安装**

<img src="assets/img/VIPM%20Search%20CSM.png" alt="vipm-search-csm" width="60%">

- **下载安装包(.vip 文件)，然后点击安装**

  - 通过 <https://www.vipm.io/> 下载 CSM 的最新发布版本，然后点击安装:<br/>
    <https://www.vipm.io/package/nevstop_lib_communicable_state_machine/>
  - 通过 GitHub 下载 CSM 的最新发布版本，然后点击安装:<br/>
    <https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases>

> 📓
> 更多信息，请参考页面 [下载](https://nevstop-lab.github.io/CSM-Wiki/release-of-csm)。
>

## 开源协议

CSM 采用 Apache 2.0 开源协议，您可以在 [LICENSE](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/blob/main/LICENSE) 中查看 Apache 2.0 开源协议的详细信息。

_**本站点使用了以下的开源项目或服务**_：

- 使用 [visual-studio-code](https://code.visualstudio.com/) 作为编辑器
- 使用 [copilot](https://copilot.github.com/) 作为提示工具,并补充部分内容
- 使用 [markdownlint](https://github.com/markdownlint/markdownlint) 用于 markdown 文件的语法检查
- 通过 [GitHub Pages](https://pages.github.com/) 服务发布页面
- 使用 [Jekyll](https://jekyllrb.com/) 静态网站生成器
- 使用 [sighingnow/jekyll-gitbook](https://github.com/sighingnow/jekyll-gitbook) 主题
- 使用 [untra/polyglot](https://github.com/untra/polyglot) ,一个Jekyll插件，用于多语言支持
- 使用 [gildesmarais/jekyll-loading-lazy](https://github.com/gildesmarais/jekyll-loading-lazy) ,一个Jekyll插件，用于惰性加载图片资源，提高网页相应速度
