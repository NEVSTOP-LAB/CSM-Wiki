---
title: 常见问题解答
layout: default
nav_order: 10
permalink: /FAQ
has_children: false
---

# 常见问题解答
{: .no_toc }

## 目录
{: .no_toc .text-delta }

1. TOC
{:toc}

---

<!-- ----------------------------------------------- -->
## 下载/安装

### :question: 如何下载 CSM?

CSM 通过 VIPM Library 的形式发布，您可以通过以下方式下载：

- 🥇 **推荐：通过 VIPM 应用搜索 CSM 获取 CSM 的最新发布版本，然后点击安装**

- **下载安装包(.vip 文件)，然后点击安装**

  - 通过 <https://www.vipm.io/> 下载 CSM 的最新发布版本，然后点击安装:<br/>
    <https://www.vipm.io/package/nevstop_lib_communicable_state_machine/>
  - 通过 GitHub 下载 CSM 的最新发布版本，然后点击安装:<br/>
    <https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases>
  - 如果想要下载 Pre-release 版本, 请访问: <br/>
    [NEVSTOP-LAB/Communicable-State-Machine 的 Action 页面](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Build_VIPM_Library.yml?query=branch%3Amain)

> 📓
> 更多信息，请参考页面 [下载](https://nevstop-lab.github.io/CSM-Wiki/release-of-csm)。
>

### :question: 在使用 VIPM 安装时弹出的编译对话框是什么?

CSM 是基于 JKISM 开发的程序框架，JKISM 提供了JKI State Machine Editor, 用于辅助开发。CSM 安装时，为了保证 JKI State Machine Editor 同时能够支持 CSM, 对 JKI State Machine Editor 部分的 VI 进行了微调。 为了保证加载速度，修改完毕后，重新编译了全部 JKI State Machine Editor 的支持 VI.

>
> CSM 安装的编译不会对 JKISM 或 JKI State Machine Editor 功能造成任何影响，也不会对用户代码造成任何影响。
>

---

<!-- ----------------------------------------------- -->
## 基本概念

### :question: CSM 是什么？

CSM 是 Communicable State Machine（可通信状态机）的缩写，是基于 JKI State Machine (JKISM) 扩展的 LabVIEW 应用框架。CSM 遵循 JKISM 的字符串消息模式，并通过添加新的字符串规则来描述模块间的消息通信，包括同步消息、异步消息、状态订阅/取消订阅等。

> 📓
> 更多信息，请参考 [基本概念](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/concepts)。
>

### :question: 同步调用（-@）和异步调用（->）有什么区别？

- **同步调用 (`-@`)**：发送消息后阻塞等待目标模块处理完毕并返回结果，才继续执行。适合需要立即获取结果的场景，但存在超时风险。
- **异步调用 (`->`)**：发送消息后立即继续执行，不等待目标模块。目标模块处理完毕后，调用方在 "Async Response" 状态接收返回值。
- **异步无返回 (`->|`)**：发送消息后立即继续执行，不会收到任何返回，适合单向通知场景。

> 📓
> 更多信息，请参考 [模块间通讯](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/communication)。
>

### :question: 消息（Message）和广播（Broadcast/Status）有什么区别？

- **消息**：CSM 模块间 **1对1** 的通信方式，通过 `-@`、`->`、`->|` 等符号向指定模块发送，需要明确目标模块名称。
- **广播**：CSM 的 **1对多** 通信方式，类似 Pub/Sub 模式。订阅者通过注册感兴趣的状态来接收通知，发送方无需知道谁在监听。

> 📓
> 更多信息，请参考 [基本概念 - 消息](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/concepts) 和 [模块间通讯 - 状态订阅](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/communication#状态订阅)。
>

### :question: 什么是 CSM 模块的 Response 和 Async Response？

- **Response**：处理同步消息（`-@`）后的回调状态。目标模块处理完消息后，调用方会进入此状态，携带返回的参数和来源模块名。
- **Async Response**：处理异步消息（`->`）后的回调状态。目标模块处理完毕后，调用方在此状态接收返回值。

> 📓
> 更多信息，请参考 [模块间通讯](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/communication)。
>

---

<!-- ----------------------------------------------- -->
## 应用场景/框架比较

### :question: CSM 和 JKISM 的区别是什么?

JKI State Machine 是由[JKI](http://jki.net/)公司开发维护的 LabVIEW 开源项目，由事件结构、字符串消息队列和循环结构组成的状态机模板。JKISM 不是程序框架，主要用于开发 LabVIEW 界面逻辑。
CSM 是基于 JKISM 拓展的编程框架，依然延续 JKISM 的字符串消息设计，通过添加一些新的字符串规则，实现不同模块之间的消息交互。

更多信息，请参考 [CSM vs JKISM vs SMO](https://nevstop-lab.github.io/CSM-Wiki/pros-and-cons#csm-vs-jkism-vs-smo) 和 [JKI State Machine 简介](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/jkism)。

> 📓
>
> - JKISM 虽然叫做状态机，但是它更像一个以字符串作为消息队列的生产者消费者结构。通常停留在 IDLE 状态等待用户事件，当消息队列中有消息时，优先处理消息。
> - JKISM 和生产者消费者模板(QMH)相比，由于它只有一个循环，所以消息处理不能有持续时间长的处理，否则用户会感知到卡顿。这也是选择 QMH 和 JKISM 的一个重要的考虑因素。
>

### :question: LabVIEW不同的框架 CSM/DQMH/AF/SMO 有没有各自非常适合的应用场景?

CSM/DQMH/AF/SMO 都是 LabVIEW 的编程框架，通常没有特别的应用场景区分。但是，由于每个框架的设计思想不同，所以在不同的场景下，可能会有不同的选择。
具体的选择，可以参考 [CSM vs DQMH/SMO/AF](https://nevstop-lab.github.io/CSM-Wiki/pros-and-cons#csm-vs-dqmhsmoaf)。

---

<!-- ----------------------------------------------- -->
## 使用方法

### :question: 如何创建 CSM 模块？

CSM 提供了标准模板，在 LabVIEW 中通过模板创建 VI 即可开始使用。创建好的模块包含 CSM 核心解析 VI、消息队列和标准的 Case 结构，可以直接开始编写业务逻辑。

> 📓
> 详细步骤，请参考 [创建CSM模块](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/usage)。
>

### :question: 如何退出CSM模块?

通常，如果希望退出 CSM 模块，可以通过对 CSM 模块发送 "Macro: Exit" 消息来实现。

- 如果是多个模块需要退出，通常我们需要控制退出的顺序，这个时候可以使用同步消息，保证按照给定的顺序退出模块。
- 如果多个模块需要退出，且不需要控制退出的顺序，可以使用异步消息，这样可以保证退出的效率。

``` c

// 假如有两个模块需要退出，分别是 Module A 和 Module B

// 同步退出方式
Macro: Exit -@ Module A
Macro: Exit -@ Module B

// 异步退出方式
Macro: Exit -> Module A
Macro: Exit -> Module B
```

e.g. 范例:

![How-to-Exit-Example](https://nevstop-lab.github.io/CSM-Wiki/assets/img/QA/How-to-Exit-Example.png)

### :question: 如何在非 CSM 框架（如 DQMH、Actor Framework）中调用 CSM 模块？

CSM 提供了专用 API 供非 CSM 代码调用 CSM 模块：

- **`CSM - Post Message.vi`**：向 CSM 模块发送异步消息（无返回），适合单向通知。
- **`CSM - Send Message and Wait for Reply.vi`**：向 CSM 模块发送同步消息并等待返回，适合需要获取结果的场景。
- **`CSM - Register Broadcast.vi`**：订阅 CSM 模块的状态广播，通过用户事件接收通知。

> 📓
> 更多信息，请参考 [创建CSM模块 - 在其他框架中调用CSM模块](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/usage#step3-在其他框架中调用csm模块)。
>

### :question: CSM 如何传递复杂数据（如大数组、波形）？

CSM 仅支持字符串类型参数，但可以通过以下方式传递各种数据：

| 方式 | 适用场景 |
|------|---------|
| 纯字符串 | 简单文本、数值、文件路径 |
| SAFESTR | 包含 CSM 关键字或特殊字符的字符串 |
| HEXSTR | 任意 LabVIEW 数据类型（数组、簇等），适合 <1KB 数据 |
| ERRSTR | LabVIEW 错误簇 |
| [MassData](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support) 插件 | 大数组、波形等大数据（>1KB） |

> 📓
> 详细信息，请参考 [CSM参数传递](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/usage#step4-csm参数传递)。
>

---

<!-- ----------------------------------------------- -->
## 高级功能

### :question: CSM 如何实现并发处理？

CSM 内置了**工作者模式 (Worker Mode)**，通过实例化多个相同模块并共享消息队列来实现并发处理。模块名称末尾加 `#` 即可启用工作者模式，外部只需与 Worker Agent 通信，框架自动将消息分配给空闲的 Worker 实例。

典型应用场景：并发下载、并发数据处理、TCP 服务器（每个 Worker 处理一个连接）等。

> 📓
> 更多信息，请参考 [高级模式与特性 - 工作者模式](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/advance#工作者模式)。
>

### :question: 什么是责任链模式？如何使用？

CSM 内置了**责任链模式 (Chain Mode)**，多个模块按顺序组成链条，消息从链首依次传递，由第一个能处理该消息的节点处理后停止传递。模块名称末尾加 `$` 和编号（如 `Handler$1`）即可启用。

典型应用场景：权限审批流程、插件式功能扩展、多级数据过滤等。

> 📓
> 更多信息，请参考 [高级模式与特性 - 责任链模式](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/advance#责任链模式)。
>

### :question: CSM 如何处理模块中的错误？

CSM 内置了统一的错误处理机制：当模块发生错误时，框架自动进入 `Error Handler` 状态，并广播 `Error Occurred` 状态通知订阅者。可以在主程序中通过订阅所有模块的错误广播来实现全局错误处理：

```c
Error Occurred@* >> Error Handler -><register>
```

> 📓
> 更多信息，请参考 [高级模式与特性 - 内置的错误处理机制](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/advance#内置的错误处理机制)。
>

### :question: 如何实现后台服务模块？

将 CSM 模块名称设置为以 `.` 开头（如 `.Logger`、`.Scheduler`），该模块即成为**系统级模块**，不会出现在 `CSM - List Modules.vi` 的返回列表中，适合实现全局后台服务（日志、调度、监控等）。

> 📓
> 更多信息，请参考 [高级模式与特性 - 系统级模块](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/advance#系统级模块)。
>

---

<!-- ----------------------------------------------- -->
## 调试工具

### :question: CSM 提供了哪些调试工具？

CSM 提供了完整的调试和开发工具套件，通过 `Tools` → `Communicable State Machine(CSM)` → `Open CSM Tool Launcher...` 打开工具选择器：

- **Running Log Window**：实时显示所有 CSM 事件（状态变化、消息、广播等）
- **State Dashboard**：图形化展示所有模块的当前状态，一眼看清系统运行状况
- **Table Log Window**：以表格形式对比多模块并行状态，适合分析时序关系
- **Debug Console**：交互式测试模块 API，可手动发送消息并查看结果

> 📓
> 更多信息，请参考 [调试工具](https://nevstop-lab.github.io/CSM-Wiki/docs/plugins/tools)。
>

### :question: 如何查看 CSM 运行时的消息流和日志？

CSM 内置了**全局日志系统**，可以记录所有模块的状态变化、模块间消息、广播事件、模块生命周期和错误信息。通过 Running Log Window 工具可以实时查看并过滤这些日志。

也可以通过 API 在代码中获取日志数据，用于开发自定义监控工具：

- **`CSM - Global Log Queue.vi`**：以队列方式获取日志（推荐，效率更高）
- **`CSM - Global Log Event.vi`**：以用户事件方式获取日志（适合与 UI 事件混合处理）

> 📓
> 更多信息，请参考 [全局日志系统](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/global-log) 和 [调试工具](https://nevstop-lab.github.io/CSM-Wiki/docs/plugins/tools)。
>

### :question: 如何单独测试 CSM 模块的 API？

使用 CSM 提供的 **Debug Console（调试控制台）**工具：

1. 启动要测试的 CSM 模块
2. 在 Debug Console 中选中该模块
3. 扫描模块的 API 列表
4. 选择 API、填写参数后发送消息，查看返回结果

> 📓
> 更多信息，请参考 [调试工具 - Debug Console](https://nevstop-lab.github.io/CSM-Wiki/docs/plugins/tools#debug-console调试控制台)。
>
