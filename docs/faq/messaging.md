---
title: 消息通信
layout: default
parent: 常见问题解答
nav_order: 2
---

# 消息通信

## :question: CSM 是什么？

CSM 是 Communicable State Machine（可通信状态机）的缩写，是基于 JKI State Machine (JKISM) 扩展的 LabVIEW 应用框架。CSM 遵循 JKISM 的字符串消息模式，并通过添加新的字符串规则来描述模块间的消息通信，包括同步消息、异步消息、状态订阅/取消订阅等。

> 📓
> 更多信息，请参考 [基本概念](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/concepts)。
>

## :question: 同步调用（-@）和异步调用（->）有什么区别？

- **同步调用 (`-@`)**：发送消息后阻塞等待目标模块处理完毕并返回结果，才继续执行。适合需要立即获取结果的场景，但存在超时风险。
- **异步调用 (`->`)**：发送消息后立即继续执行，不等待目标模块。目标模块处理完毕后，调用方在 "Async Response" 状态接收返回值。
- **异步无返回 (`->|`)**：发送消息后立即继续执行，不会收到任何返回，适合单向通知场景。

> 📓
> 更多信息，请参考 [模块间通讯](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/communication)。
>

## :question: 消息（Message）和广播（Broadcast/Status）有什么区别？

- **消息**：CSM 模块间 **1对1** 的通信方式，通过 `-@`、`->`、`->|` 等符号向指定模块发送，需要明确目标模块名称。
- **广播**：CSM 的 **1对多** 通信方式，类似 Pub/Sub 模式。订阅者通过注册感兴趣的状态来接收通知，发送方无需知道谁在监听。

> 📓
> 更多信息，请参考 [基本概念 - 消息](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/concepts) 和 [模块间通讯 - 状态订阅](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/communication#状态订阅)。
>

## :question: CSM 广播会丢数吗？

CSM 的广播（Broadcast）机制是**无损的**，不会丢失数据。广播在后台通过队列实现，所有订阅者均会收到每一条广播消息，因此可以放心地用于连续数据采集等对数据完整性要求较高的场景。

但需要注意：**如果订阅关系是动态创建的**，必须保证数据包在订阅关系建立之后才发出。订阅关系创建之前发出的广播不会被新订阅者收到；一旦订阅关系建立完成，后续所有广播消息都会通过队列可靠地传递。

> 📓
> 更多信息，请参考 [模块间通讯 - 状态订阅](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/communication#状态订阅)。
>

## :question: 什么是 CSM 模块的 Response 和 Async Response？

- **Response**：处理同步消息（`-@`）后的回调状态。目标模块处理完消息后，调用方会进入此状态，携带返回的参数和来源模块名。
- **Async Response**：处理异步消息（`->`）后的回调状态。目标模块处理完毕后，调用方在此状态接收返回值。

> 📓
> 更多信息，请参考 [模块间通讯](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/communication)。
>
