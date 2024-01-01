---
title: 在CSM框架中调用模块
author: nevstop
date: 2023-12-28
category: Basic
layout: post
lang: ch
page_id: basic-2-use-csm-as-application-framework
---

在这种情况下，模块之间的通信完全依赖于消息字符串队列操作，你可以使用 **Build Message with Arguments++.vi** 函数生成一个 Message 字符串，或者，如果你熟悉规则，你可以直接使用编写用于描述通讯的字符串。

```
#CSM 状态语法
    // 本地消息示例
    DoSth: DoA >> 参数

    // 同步调用示例
    API: xxxx >> 参数 -@ TargetModule

    // 异步调用示例
    API: xxxx >> 参数 -> TargetModule

    // 无应答异步调用示例
    API: xxxx >> 参数 ->| TargetModule

    // 广播正常状态：
    Status >> StatusArguments -><status>

    // 广播中断状态：
    Interrupt >> StatusArguments -><interrupt>

    // 将源模块的状态注册到处理程序模块
    Status@Source Module >> Handler Module@Handler Module -><register>

    // 取消注册源模块的状态
    Status@Source Module >> Handler Module -><unregister>

#CSM 注释
    // 要添加注释，请使用 "//"，右边的所有文本将被忽略。
    UI: Initialize // 初始化 UI
    // Another comment line

```
可参考范例 ***/Example/2. Caller is CSM Scenario***.
![img](../img/slides/Baisic-2.Call%20in%20CSM%20Framework(CN).png)