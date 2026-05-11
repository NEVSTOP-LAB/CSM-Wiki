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

> 📓
> 更多信息，请参考 [高级模式与特性 - 工作者模式](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/advance#工作者模式)。
>

## :question: 什么是责任链模式？如何使用？

CSM 内置了**责任链模式 (Chain Mode)**，多个模块按顺序组成链条，消息从链首依次传递，由第一个能处理该消息的节点处理后停止传递。模块名称末尾加 `$` 和编号（如 `Handler$1`）即可启用。

典型应用场景：权限审批流程、插件式功能扩展、多级数据过滤等。

> 📓
> 更多信息，请参考 [高级模式与特性 - 责任链模式](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/advance#责任链模式)。
>

## :question: CSM 如何处理模块中的错误？

CSM 内置了统一的错误处理机制：当模块发生错误时，框架自动进入 `Error Handler` 状态，并广播 `Error Occurred` 状态通知订阅者。可以在主程序中通过订阅所有模块的错误广播来实现全局错误处理：

```csm
Error Occurred@* >> Error Handler -><register>
```

> 📓
> 更多信息，请参考 [高级模式与特性 - 内置的错误处理机制](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/advance#内置的错误处理机制)。
>

## :question: 如何实现后台服务模块？

将 CSM 模块名称设置为以 `.` 开头（如 `.Logger`、`.Scheduler`），该模块即成为**系统级模块**，不会出现在 `CSM - List Modules.vi` 的返回列表中，适合实现全局后台服务（日志、调度、监控等）。

> 📓
> 更多信息，请参考 [高级模式与特性 - 系统级模块](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/advance#系统级模块)。
>
