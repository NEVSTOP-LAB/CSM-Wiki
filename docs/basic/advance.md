---
title: 高级模式与特性
layout: default
parent: 基础文档
nav_order: 5
---

# 高级模式与特性
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

本文介绍CSM的高级特性：错误处理、系统级模块、子模块、工作者模式、责任链模式和多循环支持。

## 内置的错误处理机制

CSM模块发生错误时会自动广播`Error Occurred`状态，订阅了该状态的模块可以收到通知并处理。

### 工作原理

1. 错误通过错误线传递到Parse State Queue++ VI
2. 模块自动转入`Error Handler`状态
3. 通过`Error Occurred`广播发送错误信息
4. 订阅该广播的模块收到通知并处理

### 错误类型

- **Critical Error**: 框架层面的严重错误（如模块名重复），模块会停止运行
- **No Target Error**: 目标模块为空
- **Target Error**: 目标模块不存在
- **Target Timeout Error**: 同步消息超时未响应
- **Unhandled State Error**: 未定义的状态

### 全局错误处理

在主程序中订阅所有模块的错误广播：

```
Error Occurred@* >> Error Handler -><register>
```

这样任何模块的错误都会触发主程序的`Error Handler`统一处理，适合全局日志记录、错误提示和恢复策略。

参考范例：***/Example/4. Advance Examples/1. Global Error Handling***

## 系统级模块

系统级模块用于实现后台服务，名称以`.`开头，默认不会被`CSM - List Modules VI`列出。这样可以将后台服务（日志、调度等）与业务模块分离。

### 命名规则

名称以`.`开头，例如：`.MainApp`、`.BackgroundTask`、`.Logger`、`.TCPDispatcher`。

使用`CSM - Mark As System-Level Module.vi`生成，或直接在名称前加`.`。其他功能与普通模块完全相同。

### 典型场景

将主程序命名为`.MainApp`，退出时使用：

```labview
Macro: Exit -> CSM - List Modules VI的结果
```

这样只退出业务模块，不影响主程序。

参考范例：`0. Base Concepts\7. System-Level Module.vi`

## 子模块

通过名称中的`.`实现逻辑分组。`ModuleA`和`ModuleA.SubmoduleB`是两个独立模块，没有特殊依赖关系，只是命名上的约定。使用`CSM - List Submodules VI`可以获取某个前缀下的所有模块。

### 应用场景

1. **逻辑分组**: `UI.MainWindow`、`UI.SettingsDialog`
2. **虚拟分组**: `DAQ.Channel1`、`DAQ.Channel2`（父模块可不存在）
3. **功能模块化**: `System.Logger`、`System.Config`

可与高级模式结合：`.System.Logger`、`Worker.Task#`、`Chain.Handler$1`。

## 工作者模式

通过实例化多个相同模块并共享消息队列，实现并发处理。适合并行处理大量相似任务的场景。

### 核心概念

- **Worker Agent**: 外部看到的模块名，如`Downloader`
- **Worker**: 实际的实例，如`Downloader#59703F3AD837`、`Downloader#106A470BA5EC`

### 工作原理

1. 名称后添加`#`，框架为每个实例生成唯一标识
2. 所有Worker共享同一个消息队列
3. 空闲的Worker从队列中获取消息处理
4. 外部只需与Worker Agent通讯，无需关心具体Worker数量

### 使用方式

```labview
// 申请名称为 module#，实例化2个Worker
// 实际名称：module#59703F3AD837、module#106A470BA5EC

// 发送消息只需使用Worker Agent名称
API: DoTask >> arguments -@ module  // 空闲Worker处理同步消息
API: DoTask >> arguments -> module   // 空闲Worker处理异步消息
```

### 典型场景

1. 并发服务（10086客服系统）
2. 并发下载
3. 并发编译
4. TCP服务器（每个Worker处理一个连接）
5. 数据处理

### 实现步骤

1. 使用`CSM - Mark As Worker Module.vi`生成名称（如`Downloader#`）
2. 异步调用多个相同的Worker
3. 向Worker Agent发送消息，自动分配给空闲Worker
4. 向Worker Agent发送`Macro: Exit`，所有Worker依次退出

### 注意事项

- 必须通过Worker Agent发送消息，不能直接向单个Worker发送
- Worker间不共享数据，独立处理任务
- 适合无状态任务，不适合带界面的模块

参考范例：`4. Advance Examples\1. Action Workers Example`

## 责任链模式

多个模块按顺序组成链条，消息按序传递，由第一个能处理的节点处理。

### 核心概念

- **Chain**: 外部看到的模块名，如`Handler`
- **Chain Node**: 实际实例，如`Handler$1`、`Handler$2`、`Handler$3`

### 工作原理

1. 名称后添加`$`和编号，如`Handler$1`、`Handler$2`
2. 消息按节点编号从小到大传递
3. 每个节点只处理自己能力范围内的消息
4. 被第一个能处理的节点处理后，不再向后传递
5. 整条链都无法处理则返回错误

### 使用方式

```labview
// 申请名称为 Handler$，实例化4个节点
// Handler$1 (链首) -> Handler$2 -> Handler$3 -> Handler$4 (链尾)

// 假设Handler$3和Handler$4都能处理"API: Process"
API: Process >> arguments -@ Handler
// 消息被Handler$3处理，Handler$4不会收到
```

### 典型场景

1. **权限审批**: 普通员工请假→组长审批，组长请假→经理审批，经理请假→总经理审批
2. **功能拼接**: 验证 -> 转换 -> 存储，或解析 -> 路由 -> 执行
3. **功能覆盖**: 基础节点提供默认实现，扩展节点覆盖特定场景
4. **灵活配置**: 动态调整节点顺序和能力

### 实现步骤

1. 定义每个节点能处理的消息（在case结构中实现）
2. 使用`CSM - Mark As Chain Module.vi`生成节点名称（输入名称和Order编号，输出如`Handler$1`）
3. 按顺序启动各节点
4. 向Chain发送消息，自动按序传递
5. 向Chain发送`Macro: Exit`，所有节点依次退出

注意：Order编号不必连续但必须唯一，编号小的优先处理。节点只实现能处理的状态，其他消息自动传递给下一节点。

### 与工作者模式的区别

| 特性 | 工作者模式 | 责任链模式 |
|------|-----------|-----------|
| 消息分配 | 空闲Worker处理 | 按顺序传递 |
| 处理能力 | 所有Worker能力相同 | 每个节点能力不同 |
| 并发性 | 高并发 | 顺序处理 |
| 适用场景 | 相同任务并发 | 不同任务串行 |
| 带界面 | 不适合 | 可以 |

注意：必须通过Chain名称发送消息；节点顺序很重要；链条过长影响效率。

参考范例：`4. Advance Examples\2. Chain of Responsibility Example`

## 多循环模式支持

一个CSM模块包含多个并行循环，将通讯逻辑与功能逻辑分离。

### 应用场景

1. **改造现有代码**: 在现有功能循环外围添加CSM通讯循环，避免重构
2. **实时性要求**: 功能循环用定时循环保证实时性，CSM循环处理通讯
3. **复杂界面**: 界面循环与功能循环分离，提高响应性
4. **连续采集**: 采集循环不能被打断，CSM循环处理控制命令

### 核心API

#### CSM - Request CSM to Post Message.vi

非CSM循环通过此API请求CSM循环发送消息。可指定立即执行（优先处理）、支持异步消息获取返回值。

参数：Module Name、State、Arguments、Without Reply?、Target Module、Immediately?

#### CSM - Request CSM to Broadcast Status Change.vi

非CSM循环通过此API请求CSM循环发送广播。仅应在模块内部使用。

参数：Module Name、Status、Arguments、Broadcast?、Priority、Immediately?

#### CSM - Forward UI Operations to CSM.vi

将UI循环的用户操作转发到CSM循环，DQMH-Style模板的核心机制。

参数：State(s) In、Name、High Priority?

#### CSM - Module Turns Invalid.vi

检查CSM模块是否已退出，用于功能循环跟随退出。注意：高级模式的模块只有在最后一个节点退出后才触发。

### 设计模式

通常包含：CSM循环（处理通讯和控制）、功能循环（执行实际功能）、UI循环（可选，处理界面事件）。循环间通过队列、用户事件交互。

参考范例：
- `4. Advance Examples\5. Multi-Loop Module Example\TCP Server Module(Multi-Loop Support).vi`
- `Addons - Loop Support\CSMLS - Continuous Loop in CSM Example.vi`

## 总结

这些高级特性可以灵活组合使用：

- **错误处理**: 统一的错误捕获和处理
- **系统级模块**: 系统服务与业务逻辑分离
- **子模块**: 命名分组
- **工作者模式**: 并发处理和负载均衡
- **责任链模式**: 顺序处理和功能组合
- **多循环支持**: 循环分离和协作

灵活组合可构建高性能、高可维护性的LabVIEW应用。
