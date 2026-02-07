---
title: 可通信状态机框架(CSM)
layout: home
lang: zh-cn
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

## 什么是 CSM？

CSM（可通信状态机）是基于 JKI 状态机开发的 LabVIEW 框架，让模块之间能够方便地进行消息通信。它在 JKISM 基础上扩展了同步消息、异步消息、状态订阅等功能，帮你更轻松地写出可复用的代码模块。

- 想了解 JKISM？看这里: <http://jki.net/state-machine/>
- 想了解 CSM？访问: <https://github.com/NEVSTOP-LAB>

![CSM Async Call](https://nevstop-lab.github.io/CSM-Wiki/assets/img/Homepage%20Image.png)

## 主要特点

- 继承 JKISM 的优点：易扩展、字符串格式消息
- 模块间通信：支持同步/异步消息、状态订阅
- 消息响应：能返回执行结果和错误信息
- 模块即 VI：写出来就是普通 VI，可以当子 VI 调用
- 兼容性好：既能在 CSM 框架里用，也能在其他框架中调用
- 参数灵活：通过插件支持更多数据类型，不局限于字符串
- 内置错误处理：统一的错误处理机制
- Worker 模式：轻松实现任务并发
- Chain 模式：方便实现责任链
- 调试工具：提供多种调试接口（持续完善中）

## 如何下载

CSM 以 VIPM Library 形式发布，有两种获取方式：

**推荐方式：** 🥇 在 VIPM 应用中搜索 "CSM"，直接安装最新版

<img src="assets/img/VIPM%20Search%20CSM.png" alt="vipm-search-csm" width="60%">

**下载安装包：** 从 [VIPM.io](https://www.vipm.io/package/nevstop_lib_communicable_state_machine/) 或 [GitHub Releases](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases) 下载 .vip 文件后安装

详细信息见 [下载页面](https://nevstop-lab.github.io/CSM-Wiki/release-of-csm)

## 开源协议

CSM 采用 Apache 2.0 协议，详见 [LICENSE](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/blob/main/LICENSE)

**本站使用的工具：** VS Code、Copilot、markdownlint、GitHub Pages、Jekyll、jekyll-gitbook 主题、polyglot 多语言插件、jekyll-loading-lazy 图片加载插件
