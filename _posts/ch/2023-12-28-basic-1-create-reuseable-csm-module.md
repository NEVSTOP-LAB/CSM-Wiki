---
title: 创建基于 CSM 的可重用模块
author: nevstop
date: 2023-12-28
category: Basic
layout: post
lang: ch
page_id: basic-1-create-reuseable-csm-module
---

创建一个可重用模块通常不需要与其他模块进行消息交互；它只需要提供外部接口和发布模块的状态变化。因此，只要明确描述了这两个方面，就可以在不了解内部实现细节的情况下，调用可重用模块。

在CSM模块中，所有 case 分支都可以被视为调用的消息，但建议使用 API 分组作为外部接口。当发送状态更新时，通过发送 Status 或 Interrupt Status 来通知外部模块内部的状态变化。

可参考范例 ***/Example/1. Create a reusable module***
![img](../assets/img/slides/Baisic-1.Create%20Reuse%20Module(CN).png)
