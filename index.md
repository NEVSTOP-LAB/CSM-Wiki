---
title: 可通信状态机框架(CSM)
layout: default
nav_order: 1
description: "Communicable State Machine(CSM) - 基于JKI状态机的LabVIEW应用框架"
permalink: /
---

# 可通信状态机框架(CSM)
**使用AI更新文档中!请谨慎使用**

{: .fs-9 }

基于JKI状态机（JKISM）的LabVIEW应用框架，扩展了关键词以描述模块之间的消息通信
{: .fs-6 .fw-300 }

[快速开始](#下载){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[常见问题解答]({{ site.baseurl }}/FAQ){: .btn .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View on GitHub](https://github.com/NEVSTOP-LAB/Communicable-State-Machine){: .btn .fs-5 .mb-4 .mb-md-0 }

---

<!--  [60%] HOME 页面
- [x] CSM框架的介绍
- [x] CSM框架的特点
- [x] CSM框架的应用场景
- [x] CSM框架的下载链接
- [x] 开源资源使用说明
 -->

[![Image](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/badge.svg?metric=installs)](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/)
[![Image](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/badge.svg?metric=stars)](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
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

### 核心特性

- :anchor: 完全继承了 JKISM 易扩展、字符串格式消息、状态机的特点
- :anchor: 通过消息通信实现模块间的解耦，支持同步消息、异步消息、状态订阅/取消订阅
- :anchor: 同步消息、异步消息均支持响应，并会返回执行时发生的错误
- :anchor: CSM 编写的模块就是 VI，VI 就是模块，以子 VI 的方式进行调用
- :anchor: CSM 编写的模块不仅可以在 CSM 框架中使用，也提供在非 CSM 框架中使用的方式
- :anchor: 通过插件，增加参数传递能够携带的数据，以减弱 JKISM 只能携带 string 类型数据的限制

### 高级特性

- :anchor: 内置全局的错误处理机制和日志系统，支持远程调试和问题定位
- :anchor: 内置的工作者模式(Worker Mode)，可实现任务并发和公平队列处理
- :anchor: 内置的责任链模式(Chain Mode)，能够很简单的实现责任链
- :anchor: 完善的消息订阅机制，通过文本语句控制订阅关系，可动态创建和取消
- :anchor: 提供了丰富的调试工具和接口，能够很方便的进行调试

### 团队协作优势

- :anchor: 模块接口清晰，便于多人并行开发和团队协作
- :anchor: 支持模块独立测试，无需等待其他模块完成
- :anchor: 高度可复用的模块设计，适合跨项目使用

>
> 📓 说明：CSM 的调试工具，还有很多在开发中，敬请期待
>

## 应用场景

CSM 框架特别适合以下应用场景：

- **测试测量系统** - 数据采集、存储、分析的模块化系统开发
- **多模块协作** - 需要多个功能模块相互通信和协调的复杂应用
- **团队开发项目** - 多人协作开发，需要清晰的模块接口定义
- **可扩展系统** - 需要后期增加功能模块或远程控制的系统
- **长期维护项目** - 需要部署到偏远地区并长期支持的应用

CSM 相比其他 LabVIEW 框架 (DQMH、SMO、Actor Framework) 具有更低的学习曲线、更灵活的模块设计和更好的代码复用性。

## 下载

CSM 通过 VIPM Library 的形式发布，您可以通过以下方式下载：

- 🥇 **推荐：通过 VIPM 应用搜索 CSM 获取 CSM 的最新发布版本，然后点击安装**

<img src="assets/img/VIPM%20Search%20CSM.png" alt="vipm-search-csm" width="60%">

- **下载安装包(.vip 文件)，然后点击安装**

  - 通过 VIPM.io 下载 CSM 的最新发布版本，然后点击安装:<br/>
    <https://www.vipm.io/package/nevstop_lib_communicable_state_machine/>
  - 通过 GitHub 下载 CSM 的最新发布版本，然后点击安装:<br/>
    <https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases>
  - 通过 Gitee 下载 CSM 的最新发布版本，然后点击安装:<br/>
    <https://gitee.com/nevstop-lab/Communicable-State-Machine/releases>

> 📓
> 更多信息，请参考页面 [下载](https://nevstop-lab.github.io/CSM-Wiki/release-of-csm)。
>

## 开源协议

CSM 采用 MIT 开源协议，您可以在 [LICENSE](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/blob/main/LICENSE) 中查看 MIT 开源协议的详细信息。

## CSM公开演讲资料

更多 CSM 架构设计、应用场景和实例分析，请参考 [csm-keynotes-collection](https://github.com/NEVSTOP-LAB/csm-keynotes-collection) 仓库中的公开演讲资料。

_**本站点使用了以下的开源项目或服务**_：

- 使用 [visual-studio-code](https://code.visualstudio.com/) 作为编辑器
- 使用 [copilot](https://copilot.github.com/) 作为提示工具,并补充部分内容
- 使用 [markdownlint](https://github.com/markdownlint/markdownlint) 用于 markdown 文件的语法检查
- 通过 [GitHub Pages](https://pages.github.com/) 服务发布页面
- 使用 [Jekyll](https://jekyllrb.com/) 静态网站生成器
- 使用 [just-the-docs/just-the-docs](https://github.com/just-the-docs/just-the-docs) 主题
