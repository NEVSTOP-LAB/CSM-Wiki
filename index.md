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

### 独特之处

CSM 在设计上有以下五大独特之处：

- :anchor: **纯文本的流程控制** - 以字符串描述状态和消息，代码逻辑直观可读，支持注释、宏状态和外部脚本控制
- :anchor: **隐形的"通讯总线"** - 模块通过虚拟通讯总线交换消息，天然实现解耦，支持同步、异步、广播/订阅等多种通讯模式
- :anchor: **VI 即模块** - CSM 模块就是一个 VI，以子 VI 方式调用，可直接使用断点、探针、高亮执行等熟悉的调试手段
- :anchor: **内置超级详细的检查接口** - 内置全局日志系统和丰富的调试工具，支持非侵入式调试和远程运行状态分析
- :anchor: **拓展式的设计** - 通过插件机制扩展参数类型，通过订阅关系灵活扩展模块间协作

### 框架优势

- :anchor: 完善且独特的 LabVIEW 应用框架，可与 DQMH、SMO、Actor Framework 互补或替换
- :anchor: 虚拟总线通讯方式，天然支持插件化方案，新增功能模块无需修改已有代码
- :anchor: 纯文本描述流程，是 LabVIEW 实现自动化测试任务脚本化的最佳方案
- :anchor: 适合不同经验的工程师协同工作，新手与老手均可快速参与并行开发
- :anchor: 同步消息、异步消息均支持响应，并会返回执行时发生的错误
- :anchor: 全开源项目（MIT License），提供中文技术支持和持续更新迭代

### 高级特性

- :anchor: 内置的工作者模式(Worker Mode)，可实现任务并发和公平队列处理
- :anchor: 内置的责任链模式(Chain Mode)，能够很简单的实现责任链
- :anchor: 完善的消息订阅机制，通过文本语句控制订阅关系，可动态创建和取消
- :anchor: 模块接口清晰，支持模块独立测试，无需等待其他模块完成
- :anchor: 高度可复用的模块设计，适合跨项目使用

>
> 📓 说明：CSM 的调试工具，还有很多在开发中，敬请期待
>

## 应用场景

CSM 框架以**数据采集、存储与分析系统**为典型设计目标场景，专门解决该类项目中的常见挑战：

- **模块可替换** - 采集模块、算法模块等功能模块接口清晰，在算法不明确或硬件未到位时，可先用模拟模块开发，后期无缝替换真实模块
- **并行团队开发** - 模块之间完全解耦，不同经验的工程师可并行开发各自的模块，无需等待依赖模块完成
- **插件化系统扩展** - 虚拟总线设计使增加 TCP 通讯、数据备份等新功能模块无需修改现有代码，天然支持插件化架构
- **自动化测试脚本化** - 纯文本消息和状态脚本，适合 ATE 自动化测试平台的任务脚本化控制需求
- **远程控制与运维** - 内置详细日志系统，适合部署到偏远地区后需要远程调试和长期技术支持的应用
- **多框架对比选型** - 相比 DQMH、SMO、Actor Framework，CSM 具有更低的学习曲线，适合不同规模的团队和项目

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
