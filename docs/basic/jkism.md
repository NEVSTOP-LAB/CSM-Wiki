---
title: JKI State Machine
layout: default
parent: 基础文档
nav_order: 1
---

# JKI State Machine
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

# JKI State Machine(JKISM)
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

# JKI State Machine(JKISM)简介

## 什么是JKISM

JKISM 是 JKI 公司开发的轻量级 LabVIEW 框架，是社区最流行的设计模式之一。它基于**字符串队列状态机**，核心很简单：
- 用字符串表示状态
- 用队列管理状态序列  
- 循环中依次执行
- 状态可以动态添加新状态

**设计理念**：简单直观、灵活动态、轻量级、易扩展

## 基本结构

JKISM 包含三个核心：

**1. 状态队列**：用 LabVIEW 队列存储待执行的状态（FIFO 模式）

**2. While 循环**：不断从队列取状态执行
```
Loop {
    Dequeue -> Parse State -> Execute in Case -> Enqueue new states
}
```

**3. Case 结构**：根据状态字符串执行对应代码

### 状态字符串格式

```
"Initialize"                           // 单一状态
"Initialize                            // 多个状态（换行符分隔）
Read Configuration
Start Acquisition"
"Set Value: 100"                       // 带参数
```

## 优势与局限

### 适合 JKISM 的场景

✓ **简单顺序控制**：明确的步骤序列（仪器初始化、简单测试）  
✓ **小型应用**：代码量 <1000 行，功能单一  
✓ **原型开发**：快速验证想法，时间优先  
✓ **学习教学**：理解状态机概念，入门友好

### JKISM 的局限

这些限制在大型项目中会成为瓶颈：

1. **缺乏模块间通讯**：只有一个队列，多模块协同困难
2. **参数传递原始**：通过字符串编码/解析，无类型安全
3. **错误处理不完善**：需手动实现，难以统一
4. **缺乏高级特性**：无工作者模式、责任链、状态广播、插件机制
5. **调试工具有限**：主要靠前面板显示
6. **扩展性受限**：难以添加新功能

**CSM 的改进**：提供完整的模块通讯 API、多种参数类型（HEXSTR、MassData）、内置错误处理、工作者/责任链模式、全局日志窗口、插件系统等

## JKISM vs CSM 对比

| 特性 | JKISM | CSM |
|------|-------|-----|
| 基础架构 | 单队列状态机 | 多模块通讯状态机 |
| 模块化 | 不支持 | 完整支持 |
| 模块通讯 | 无 | 同步/异步/广播 |
| 参数传递 | 字符串解析 | 多种类型支持 |
| 错误处理 | 手动实现 | 内置机制 |
| 学习曲线 | 平缓 | 中等 |
| 适用规模 | 小型(<1K 行) | 中大型(1K+ 行) |

**性能**：JKISM 启动快、内存占用低；CSM 参数传递更高效

**调试**：JKISM 靠前面板；CSM 有全局日志、状态仪表板、状态表格窗口

**选择建议**：小型简单短期项目用 JKISM，中大型复杂长期项目用 CSM

## 工作流程示例

```labview
// 初始化
Queue = Create Queue
Enqueue(Queue, "Initialize")

// 主循环
While Loop {
    State = Dequeue(Queue)
    
    Case(State) {
        "Initialize": {
            Init Hardware
            Enqueue(Queue, "Idle")
        }
        
        "Idle": {
            Wait for Event
        }
        
        "Process Data": {
            Process(Data)
            Enqueue(Queue, "Update Display")
        }
        
        "Error": {
            Handle Error
            Enqueue(Queue, "Idle")
        }
        
        "Exit": {
            Cleanup
            Stop Loop
        }
    }
}

// 清理
Release Queue(Queue)
```

## 从 JKISM 迁移到 CSM

### 什么时候该迁移？

项目出现这些问题时，考虑迁移：规模增长难管理、需要多模块协同、需要更好的错误处理和调试

### 迁移策略

**渐进式**（大型项目）：新模块用 CSM，旧模块通过 API 调用，逐步重构  
**完全重写**（小型项目）：用 CSM Template 创建，一次性切换  
**并行开发**（中型项目）：保留 JKISM 核心，CSM 模块补充，最终迁移

### 概念对照

| JKISM | CSM | 说明 |
|-------|-----|------|
| 状态 | API/状态 | CSM 区分 API 和内部状态 |
| 入队 | 发送消息 | 使用 CSM 消息 API |
| 状态字符串 | 消息字符串 | 支持多种参数类型 |
| - | 模块通讯 | JKISM 无，CSM 新增 |

### 迁移示例

```labview
// JKISM
Enqueue(Queue, "Read Data")
Case: "Read Data" {
    Data = Read File
    Enqueue(Queue, "Process: " + Data)
}

// CSM
API: Read Data >> "" -> This Module
API: Read Data >> {
    Data = Read File
    API: Process Data >> Data -> This Module
}
```

**注意**：理解 CSM 的模块/API/状态概念，利用内置参数类型和错误处理，渐进式改进

---------------------------------------

# JKISM 编程实践

## 命名和设计

### 状态命名规范

**推荐**：动词开头，清晰表意
```
"Initialize Hardware"
"Read Sensor Data"  
"Calculate Results"
"Error: File Not Found"
```

**使用前缀分类**：
```
"Init: Hardware"      // 初始化类
"Process: Data"       // 处理类
"Error: Timeout"      // 错误类
"Cleanup: Resources"  // 清理类
```

**避免**：拼写模糊（"State1"、"DoIt"）

### 设计原则

**1. 单一职责**：每个状态只做一件事
```labview
// 好
Case: "Read File" { Read -> Enqueue("Parse Data") }
Case: "Parse Data" { Parse -> Enqueue("Validate") }

// 差：一个状态做太多事
Case: "Do Everything" { Read + Parse + Validate + Process + Save }
```

**2. 明确转换路径**
```labview
Case: "Initialize" {
    If (Success) { Enqueue("Idle") }
    Else { Enqueue("Error: Init Failed") }
}
```

**3. 避免循环陷阱**
```labview
// 问题：无限循环
Case: "A" { Enqueue("B") }
Case: "B" { Enqueue("A") }

// 解决：加计数器或退出条件
Case: "A" {
    Counter++
    If (Counter < Max) { Enqueue("B") }
    Else { Enqueue("Done") }
}
```

## 数据和错误处理

### 数据管理

**使用 Shift Register**：
```labview
Shift Register: {
    Config, Data, Status, Error
}
```

**参数传递**：
```labview
// 方法1：字符串编码
"Set Value: 100"  // 需手动解析

// 方法2：Variant（类型安全）
State with Variant Attribute

// 方法3：HEXSTR（集成CSM工具）
"Set Config: <HEXSTR>..."
```

### 错误处理

**统一错误状态**：
```labview
Case: "Error" {
    Log Error
    Display to User
    Cleanup
    If (Can Recover) { Enqueue("Retry") }
    Else { Enqueue("Fatal Error") }
}
```

**每个状态检查错误**：
```labview
Case: "Read Data" {
    Data, Error = Read File
    If (Error?) { Enqueue("Error: Read Failed") }
    Else { Enqueue("Process Data") }
}
```

**重试机制**：
```labview
Case: "Retry Operation" {
    Retry Count++
    If (Retry Count < Max) {
        Wait(Delay)
        Enqueue("Try Operation")
    } Else {
        Enqueue("Error: Max Retries")
    }
}
```

## 性能和调试

### 性能优化

**合并相关操作**：
```labview
// 差：太多小状态
Enqueue("Read1\nRead2\nRead3...")

// 好：合并
Case: "Read All" { Read1; Read2; Read3 }
```

**周期性任务**：用 Timeout 实现
```labview
Dequeue with Timeout = 100ms
If (Timeout) { Enqueue("Periodic Check") }
```

**批量处理**：
```labview
// 差：逐个入队
For Each Item { Enqueue("Process: " + Item) }

// 好：批量处理
Case: "Process All" { For Each Item { Process(Item) } }
```

### 调试技巧

**状态历史记录**：
```labview
Append Current State to History Array
```

**执行时间监控**：
```labview
Case: Each State {
    Start = Get Time
    ... // 执行
    Duration = Get Time - Start
    Log("State: " + Name + " Duration: " + Duration)
}
```

**前面板显示**：显示当前状态、历史、队列长度

**断点状态**：
```labview
Case: "Debug Breakpoint" {
    Pause = Dialog("Continue?")
}
```

## 常见问题

### 1. 拼写错误
```labview
Enqueue("Initialize")  // 正确
Case: "Initalize"      // 拼写错了，永远不会执行
```
**解决**：用常量/枚举定义状态名，或用 JKISM State Editor

### 2. 忘记入队下一状态
```labview
Case: "Some State" {
    Do Something
    // 忘记Enqueue，程序卡住
}
```
**解决**：每个状态明确下一步，用 Default Case 处理，或添加"Idle"默认状态

### 3. 队列阻塞
```labview
State = Dequeue(Queue)  // 队列空时永远等待
```
**解决**：用 Timeout
```labview
State = Dequeue(Queue, Timeout = 100ms)
If (Timeout) { Enqueue("Idle") }
```

### 4. 状态名冲突
**解决**：用前缀区分（"ModuleA: Process"、"ModuleB: Process"）

### 5. 状态过于复杂
**解决**：拆分成多个状态，用 SubVI 封装逻辑

## 实践经验

- **从简单开始**：初始设计保持简单，只在需要时添加复杂性
- **文档化流程**：绘制状态转换图，注释关键状态
- **定期重构**：识别重复代码，提取公共逻辑
- **适时升级**：项目超过 3000 行或需要多模块协作时，考虑 CSM
- **团队规范**：统一命名规范，定义状态分类，代码审查

## 总结

**JKISM 的价值**：简单易学、代码清晰、灵活动态、快速开发  
**局限性**：缺乏模块化、通讯机制简单、扩展性受限

**何时用 JKISM**：小型简单短期项目、学习原型  
**何时用 CSM**：中大型复杂长期项目、需要模块化和高级特性

**最佳实践**：清晰命名、单一职责、统一错误处理、避免不必要转换、记录状态历史、文档化、适时升级

更多资源：[JKI 官网](http://www.jki.net/) | [CSM GitHub](https://github.com/NEVSTOP-LAB/Communicable-State-Machine) | [CSM Wiki](https://nevstop-lab.github.io/CSM-Wiki/)
