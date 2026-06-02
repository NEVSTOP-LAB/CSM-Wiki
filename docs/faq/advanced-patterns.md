---
title: 高级模式
layout: default
parent: 常见问题解答
nav_order: 4
---

# 高级模式

## :question: CSM 如何实现并发处理？

CSM 内置了**工作者模式 (Worker Mode)**，通过实例化多个相同模块并共享消息队列来实现并发处理。模块名称末尾加 `#` 即可启用工作者模式，外部只需与 Worker Agent 通信，框架自动将消息分配给空闲的 Worker 实例。

典型应用场景：并发下载、并发数据处理、TCP 服务器（每个 Worker 处理一个连接）等。

使用注意事项：

- 必须通过 Worker Agent 基础名称（不带 `#` 后缀）发送消息，不能直接与单个 Worker 实例通信。
- Worker 模式适合并发吞吐场景，不适合需要按固定顺序逐节点处理的流程。

> 📓
> 更多信息，请参考 [高级模式与特性 - 工作者模式]({% link docs/basic/advance.md %}#工作者模式)。
>

## :question: 什么是责任链模式？如何使用？

CSM 内置了**责任链模式 (Chain Mode)**，用于按优先级静态路由消息。具有相同基础名称（`$` 之前的部分）的节点会组成一个 Chain（例如 `Handler$1`、`Handler$2` 同属 `Handler` Chain）。节点名称末尾使用 `$` 加数字声明优先级，数字越小优先级越高。建议使用唯一的正整数优先级，避免同优先级带来的路由歧义。

框架会按消息类型从同一 Chain 的注册表中选择“优先级最高且可处理该消息”的节点进行**直接投递**；每条消息只由一个节点处理，不会在节点间逐级传递或回退。

典型应用场景：

- 不同功能模块组合成统一入口（如 `Calculator` Chain 统一对外提供加减乘除能力）。
- 同一功能的多版本覆盖（高优先级节点生效，低优先级节点作为后备实现）。

使用注意事项：

- 必须通过 Chain 基础名称（不带 `$N` 后缀）发送消息，不能直接向 `ChainName$N` 节点发送消息。
- 若没有任何节点声明可处理该消息类型，消息将无法命中处理节点，调用方可能观察到未处理或超时；可结合日志与相关配置排查。

> 📓
> 更多信息，请参考 [高级模式与特性 - 责任链模式]({% link docs/basic/advance.md %}#责任链模式)。
> 相关讨论：[Discussion #56](https://github.com/orgs/NEVSTOP-LAB/discussions/56)。
>

## :question: CSM 如何处理模块中的错误？

CSM 内置了统一的错误处理机制：当模块发生错误时，框架自动进入 `Error Handler` 状态，并广播 `Error Occurred` 状态通知订阅者。可以在主程序中通过订阅所有模块的错误广播来实现全局错误处理：

```csm
Error Occurred@* >> Error Handler -><register>
```

> 📓
> 更多信息，请参考 [高级模式与特性 - 内置的错误处理机制]({% link docs/basic/advance.md %}#内置的错误处理机制)。
>

## :question: 如何实现后台服务模块？

将 CSM 模块名称设置为以 `.` 开头（如 `.Logger`、`.Scheduler`），该模块即成为**系统级模块**，不会出现在 `CSM - List Modules.vi` 的返回列表中，适合实现全局后台服务（日志、调度、监控等）。

> 📓
> 更多信息，请参考 [高级模式与特性 - 系统级模块]({% link docs/basic/advance.md %}#系统级模块)。
>
