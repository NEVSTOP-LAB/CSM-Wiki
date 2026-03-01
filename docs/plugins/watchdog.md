---
title: WatchDog自动退出管理
layout: default
parent: 插件系统
nav_order: 6
---

# CSM WatchDog Addon

CSM WatchDog是一个**内置插件**，用于在主程序退出后，自动通知所有**异步启动**的CSM模块正常退出，避免孤儿模块残留。

{: .important }
> WatchDog 只负责管理**异步启动**的CSM模块。**同步调用**的模块必须由调用方自行管理退出：同步调用的模块若不退出，调用它的VI就无法继续执行后续代码退出，主程序VI就无法退出，WatchDog Queue也就不会被释放，退出流程也就不会被触发。

## 功能说明

### 问题背景

在CSM应用中，各功能模块通常以异步方式独立启动。当主程序退出时，如果没有显式通知这些模块退出，它们会继续运行，造成资源泄漏，甚至导致程序无法完全关闭。

### 实现原理

{: .note }
> **CSM WatchDog实现的原理**
>
> LabVIEW VI退出时，会自动释放所有队列、事件等句柄资源。因此，WatchDog通过创建一个专用的队列资源，由主程序VI持有该队列的引用。这个队列资源会随着创建主VI的退出而被LabVIEW自动回收，从而触发后台监控线程退出并广播 `Macro: Exit`：
> - 主程序运行时，队列存在，WatchDog保持等待；
> - 主程序VI退出时，LabVIEW自动回收队列资源；
> - WatchDog检测到队列已回收，立即向所有还未退出的CSM模块广播 `Macro: Exit`。

整个过程无需主程序编写任何退出逻辑，完全自动化。

```mermaid
sequenceDiagram
    participant Main as 主程序 VI
    participant WD as WatchDog 线程
    participant M1 as CSM 模块 1
    participant M2 as CSM 模块 2

    Main->>WD: CSM - Start Watchdog to Ensure All Modules Exit.vi<br/>（创建队列并启动WatchDog线程）
    Main->>M1: 异步启动
    Main->>M2: 异步启动
    Note over Main: 程序正常运行...
    Main-->>Main: VI 退出，LabVIEW 自动回收队列
    WD->>WD: 检测到队列已回收
    WD->>M1: 广播 Macro: Exit
    WD->>M2: 广播 Macro: Exit
    M1-->>M1: 正常退出
    M2-->>M2: 正常退出
```

## 函数说明

### API 一览

| 函数名 | 功能 | 调用时机 |
|--------|------|----------|
| [`CSM - Start Watchdog to Ensure All Modules Exit.vi`]({% link docs/reference/api-09-build-in-addons.md %}#csm-start-watchdog-to-ensure-all-modules-exitvi) | 启动WatchDog监控线程，返回Watchdog Queue引用 | 主程序初始化阶段，尽早调用 |

### CSM - Start Watchdog to Ensure All Modules Exit.vi

启动CSM WatchDog后台线程，用于监控主程序是否退出。**一般在主程序启动后立即调用**。

**输出控件**：
- **Watchdog Queue**：WatchDog监控队列引用。通常保持连接（连接到移位寄存器或局部变量）直至主程序VI结束，让LabVIEW随VI退出自动回收；如果明确知道要提前触发退出流程，也可以手动释放该队列引用，同样会激活WatchDog退出机制。

### 调用逻辑

```mermaid
flowchart TD
    A[主程序启动] --> B["调用 CSM - Start Watchdog to Ensure All Modules Exit.vi"]
    B --> C[获得 Watchdog Queue 引用]
    C --> D[保持 Watchdog Queue 引用\n（移位寄存器/局部变量）]
    D --> E[异步启动各 CSM 模块]
    E --> F{程序运行中}
    F -->|继续运行| F
    F -->|主程序 VI 退出| G[LabVIEW 自动回收 Watchdog Queue]
    G --> H[WatchDog 线程检测到队列已回收]
    H --> I["广播 Macro: Exit 给所有 CSM 模块"]
    I --> J[所有模块正常退出]
```

## 典型应用场景

### 场景一：标准多模块应用

这是最常见的用法——主程序启动多个**异步**功能模块，由WatchDog统一管理退出。

```text
// 主程序 VI 框架示意
Initialize >> {
    // 尽早启动 WatchDog
    CSM - Start Watchdog to Ensure All Modules Exit.vi
    → Watchdog Queue（存入移位寄存器）

    // 异步启动各功能模块（WatchDog 负责管理这些模块的退出）
    Run Async: DataAcquisitionModule
    Run Async: DataProcessingModule
    Run Async: UIModule
    // 注意：同步调用的模块不在 WatchDog 管理范围内，
    //       需要调用方自行确保其退出
}

// 程序运行...

// 主程序 VI 退出时：
// - LabVIEW 自动回收 Watchdog Queue
// - WatchDog 线程检测到，广播 Macro: Exit
// - 所有异步启动的模块正常退出
```

### 场景二：嵌入式/仪器控制应用

在仪器控制场景下，各硬件模块（DAQ、串口、GPIB等）通常以异步CSM模块运行。使用WatchDog可以避免仪器控制资源因模块未退出而被锁定。

```text
// 主控程序
Initialize >> {
    CSM - Start Watchdog to Ensure All Modules Exit.vi
    → Watchdog Queue

    // 异步启动硬件模块，WatchDog 负责在主程序退出后通知它们退出
    Run Async: DAQModule       // 数据采集模块
    Run Async: SerialModule    // 串口通信模块
    Run Async: DisplayModule   // 显示模块
}

// 即使操作员直接关闭主程序界面
// WatchDog 也能确保所有异步启动的硬件模块正确释放资源后退出
```

## 注意事项

{: .warning }
> - **仅管理异步模块**：WatchDog只会向异步启动的CSM模块发送 `Macro: Exit`。同步调用的模块不在WatchDog管理范围内，需调用方自行确保其退出。
> - **尽早调用**：在主程序初始化阶段（异步启动其他模块之前）调用，确保WatchDog在所有模块启动之前就已就绪。
> - **每个主程序只需调用一次**：多次调用会启动多个WatchDog线程，造成重复发送退出命令。
> - **Watchdog Queue的释放**：通常让LabVIEW随主程序VI退出自动回收；如果需要提前触发退出流程，也可以手动释放该队列引用。

## 更多参考

- **API 参考**：[内置插件 - CSM WatchDog Addon]({% link docs/reference/api-09-build-in-addons.md %}#csm-watchdog-addon)
- **示例代码**：LabVIEW中打开 `Addons - WatchDog\` 目录下的示例
- **File Logger联用**：[插件系统概述 - File Logger Addon]({% link docs/plugins/plugin-system.md %}#file-logger-addon)
