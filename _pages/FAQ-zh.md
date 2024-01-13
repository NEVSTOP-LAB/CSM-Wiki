---
title: CSM 常见问题解答
author: nevstop
date: 2022-02-10
category: information
layout: post
lang: zh
page_id: csm-faq
permalink: /FAQ
---

[TOC]

#### 如何下载 CSM?

#### CSM 和 JKISM 的区别是什么?

#### LabVIEW不同的框架 CSM/DQMH/AF/SMO 有没有各自非常适合的应用场景?

#### 如何退出CSM模块?

#### CSM 模块设计如何和需求映射？

#### 在使用 VIPM 安装时弹出的编译对话框是什么？

CSM 是基于 JKISM 开发的程序框架，JKISM 提供了JKI State Machine Editor, 用于辅助快速开发 JKISM 状态机。CSM 安装时，为了保证 JKI State Machine Editor 同时能够支持 CSM, 在 使用 VI Script 对 JKI State Machine Editor 部分的 VI 进行了微调, 为了保证 JKI State Machine Editor 的加载速度，修改完毕后，重新编译了全部 JKI State Machine Editor 的支持 VI.

这不会对原本的 JKISM 或 JKI State Machine Editor 功能造成任何影响，也不会对原本的代码造成任何影响。
