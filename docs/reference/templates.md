---
title: CSM 模板
layout: default
parent: 参考文档
nav_order: 2
---

# CSM 模板
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

_**CSM 代码模板**_

![csm-template](https://nevstop-lab.github.io/CSM-Wiki/assets/img/CSM%20Without%20Event%20Structure%20Template.png)

# CSM开发模板指南

## 概述

CSM（Communicable State Machine）基于 JKI State Machine 扩展，提供了模块间通讯能力。本文档介绍 CSM 模板的使用方法和最佳实践。

**参考链接**：
- JKI State Machine: <http://jki.net/state-machine/>
- CSM Wiki: <https://nevstop-lab.github.io/CSM-Wiki/>
- NEVSTOP-LAB: <https://github.com/NEVSTOP-LAB>

## 模板分类

### 按功能分类

1. **无事件结构模板**：用于无UI的后台服务、数据处理等，最常用，性能最好
2. **带事件结构模板**：用于需要响应用户操作的简单UI模块
3. **DQMH风格模板**：用于复杂UI场景，事件循环独立，适合处理高频事件（如鼠标移动）

### 代码风格

- **标准版**：布局清晰，注释详细，适合学习
- **Tiny版**：代码紧凑，功能相同，适合有经验的开发者

## 主要模板说明

### 1. CSM Module Template.vi（无事件结构）

**最常用的模板**，用于创建无UI的后台模块。

**适用场景**：数据采集、数据处理、通讯协议、算法运算等

**特点**：
- 包含调试用的事件循环（调试完成后应删除）
- 性能最优，适合后台服务

**输入参数**：
- **Name ("" to use UUID)**：模块名称（参见命名规则）

### 2. CSM User Interface(UI) Module Template.vi（带事件结构）

用于创建带UI的模块，事件结构与状态机在同一循环中。

**适用场景**：配置界面、数据显示、简单的用户交互

**输入参数**：
- **Name ("" to use UUID)**：模块名称

### 3. CSM DQMH-Style Template.vi（DQMH风格）

用于复杂UI场景，事件循环独立于状态机。

**适用场景**：
- UI操作需要组合逻辑（如鼠标拖放）
- 需要响应高频事件（如鼠标移动、窗口调整）
- 避免快速事件导致消息队列堵塞

**提示**：也可以组合使用 `CSM - Flood of Events Handler Side Loop VI` 和 `CSM Module Template VI` 来创建

**参考范例**：`[CSM-Example]\4. Advance Examples\CSMLS - Continuous Loop in CSM Example.vi`

**输入参数**：
- **Name ("" to use UUID)**：模块名称

### 4. 紧凑模板（Tiny版）

功能与标准版完全相同，只是代码更紧凑。包括：
- **CSM Module Template - Tiny.vi**
- **CSM User Interface(UI) Module Template - Tiny.vi**

## 模块命名规则

模块名称是唯一标识符，命名时注意：

### 基本规则

1. **名称必须唯一**，否则会触发 `Critical Error`
2. **空字符串**：使用UUID作为名称，独立模式，不出现在模块列表中

### 特殊模式

3. **协作者模式**：名称以 `#` 结尾（如 `DataProcessor#`），多个节点组成协作者池，外部消息由空闲节点处理
4. **责任链模式**：名称以 `$数字` 结尾（如 `Validator$1`），数字表示优先级
5. **系统级模块**：名称以 `.` 开头（如 `.Logger`），默认不被 `CSM - List Modules VI` 列出，适合后台服务
6. **子模块**：用 `.` 分隔名称层次（如 `MainApp.UI.ConfigPanel`），仅表示逻辑关系，实际上是独立模块

### 示例

```
正常模块：     "DataAcquisition"
独立模式：     ""
协作者模式：   "Worker#"
责任链模式：   "Handler$1", "Handler$2"
系统级模块：   ".SystemLogger"
子模块：       "MainApp.UI.ConfigPanel"
```

## 模板核心组件

### 1. 状态机循环

核心是一个While循环，包含状态队列、Parse State Queue++.vi（解析状态）、Case结构（执行状态）和移位寄存器（保存数据）。

### 2. 初始化和退出

- **Macro: Initialize**：初始化状态机，完成后才会处理外部消息，通常包含数据初始化、事件注册、UI初始化等
- **Macro: Exit**：退出状态机，进入后不再处理外部消息，通常包含资源清理、事件注销、数据保存等

### 3. 事件结构

仅在带事件结构的模板中存在。关键事件包括：
- **New State Notifier Event**：收到新消息时中断等待
- **用户控件事件**：响应UI操作
- **Panel Close事件**：通常被丢弃，由 `Macro: Exit` 统一处理

### 4. 超时控制

- **Timeout Selector.vi**：当超时为-1且还有剩余状态时，超时值改为0，保证立刻处理剩余状态
- **Loop Rate控件**：
  - `-1`：永远等待
  - `0`：不等待，持续运行
  - `>0`：指定超时时间（毫秒）

## 模板状态说明

模板中的状态按功能分为以下几类：

### 系统状态

- **Default**：捕获未处理的状态和拼写错误，通常记录日志
- **Documentation**：保存模块文档，无实际功能
- **Idle/Event Handler**：状态队列为空时执行，包含事件结构和空闲逻辑

### 错误处理状态

- **Error Handler**：处理模块错误，内部错误会广播"Error Occurred"，也会接收其他模块的错误订阅
- **Critical Error**：不可恢复错误，直接停止循环（不要随意修改）
- **Target Busy Error**：目标模块忙碌时的处理（可实现重试逻辑）
- **Target Timeout Error**：消息超时未响应的处理
- **Target Error**：目标模块不存在时的处理

### 消息响应状态

- **Response**：同步调用（`-@`）的响应处理
- **Async Response**：异步调用（`->`）完成后的响应处理
- **Async Message Posted**：异步消息发送后立即执行

### 数据和事件管理

- **Data: Initialize**：初始化移位寄存器数据
- **Data: Cleanup**：清理数据和引用，由 `Macro: Exit` 自动调用
- **Events: Register**：注册用户事件，默认注册"New Message Event"
- **Events: Unregister**：注销事件，由 `Macro: Exit` 自动调用

### UI管理状态

- **UI: Initialize**：初始化界面，由 `Macro: Initialize` 调用
- **UI: Cursor Set**：设置鼠标状态，用法：`"UI: Cursor Set >> Busy|Idle"`
- **UI: Front Panel State**：控制前面板，用法：`"UI: Front Panel State >> Open|Close"`

### 初始化和退出

- **Initialize Core Data**：设置退出时面板行为
- **Exit**：退出循环（这里的错误不会被处理）

### 用户自定义状态

- **API Example**：API模板，复制后创建新API
  - **>> From Who >>**：发送者（本模块时为空）
  - **>> Arguments >>**：调用参数
  - **Response**：返回值
- **Internal State**：内部逻辑状态
- **Category Separator**：分隔分支（不要放代码）

## 状态语法

CSM扩展了JKISM的状态语法，支持模块间通讯：

**本地消息**：
```
DoSth: DoA >> Arguments
```

**同步调用**：发送后等待响应，响应在"Response"状态处理
```
API: xxxx >> Arguments -@ TargetModule
```

**异步调用**：发送后立即返回，响应在"Async Response"状态处理
```
API: xxxx >> Arguments -> TargetModule
```

**异步调用（无返回值）**：发送后立即返回，不等待响应
```
API: xxxx >> Arguments ->| TargetModule
```

**状态广播**：向所有订阅者发送
```
Status >> StatusArguments -> <all>
```

**注释**：使用 `//` 添加注释
```
UI: Initialize // This initializes the UI
// Another comment line
```

## 辅助代码片段

### CSM - Start Async Call.vi
异步启动CSM模块，拖至程序框图后将VI静态引用改为目标模块即可。

**参考**：`[CSM-Example]\3. Caller is Other Framework Scenario\CSM Example - Caller is NOT a CSM.vi`

### CSM - Synchronized Call.vi
同步调用CSM模块，相当于把CSM模块当子VI使用。

**参考**：`[CSM-Example]\2. Caller is CSM Scenario\CSM Example - Caller is a CSM.vi`

### CSM - Flood of Events Handler Side Loop.vi
DQMH风格的用户事件循环模板，用于处理复杂或高频UI事件。

**参考**：`[CSM-Example]\4. Advance Examples\CSMLS - Continuous Loop in CSM Example.vi`

### CSM - Global Log Queue/Event Monitoring Loop.vi
全局日志监控循环，用于查询全局日志队列中的消息。

**参考**：
- Queue版：`[CSM-Example]\4. Advance Examples\2. Chain of Responsibility Example\`
- Event版：`[CSM-Example]\4. Advance Examples\4. Global Log Filter Example\`

## 模板支持VIs

### CSM - Get New State Notifier Event.vi
获取用户事件句柄，用于包含事件结构的CSM模块。收到新消息时中断事件结构的等待。

**输入**：Name ("" to use UUID)  
**输出**：New State Notifier Event

### Timeout Selector.vi
超时选择器，用于包含事件结构的模板。当超时为-1且还有剩余状态时，超时值改为0，保证立刻处理剩余状态。

**输入**：Timeout Expected, Remaining States  
**输出**：Timeout

## 错误处理VIs

CSM提供了一系列错误生成VIs，用于创建标准错误：

- **CSM Critical Error.vi**：严重错误（通常是模块名重复）
- **CSM No Target Error.vi**：目标名称为空
- **CSM Target Error.vi**：目标模块不存在
- **CSM Target Timeout Error.vi**：同步消息超时
- **CSM Target Busy Error.vi**：目标模块正忙（正在处理其他同步消息）

所有这些VI的输入都是：**CSM Name** 和 **Arguments (As Reason/CSM Name)**

## 开发流程

### 1. 选择模板

- 无UI → CSM Module Template
- 简单UI → CSM User Interface Module Template
- 复杂UI（高频事件/组合逻辑）→ CSM DQMH-Style Template
- 代码风格：标准版（学习）或 Tiny版（有经验）

### 2. 设置模块名称

根据用途选择命名方式：普通模块、独立模块（""）、协作者（#）、责任链（$数字）、系统级（.开头）、子模块（.分隔）

### 3. 实现初始化（Macro: Initialize）

依次调用：Data: Initialize → Events: Register → UI: Initialize → 其他初始化

### 4. 创建API状态

复制"API Example"状态，重命名为实际API名称，实现逻辑并设置响应数据

### 5. 实现内部状态

在"Internal State"下创建内部状态，实现逻辑和状态转换

### 6. 实现错误处理

在"Error Handler"中实现错误处理，根据需要实现特定错误状态（Target Error、Timeout Error等）

### 7. 实现清理（Macro: Exit）

依次调用：Data: Cleanup → Events: Unregister → 其他清理

### 8. 删除调试代码

在CSM Module Template中，删除调试用的事件响应循环

### 9. 测试和文档

单元测试API，集成测试通讯，在"Documentation"状态添加文档

## 最佳实践

### 命名约定

- **模块命名**：使用PascalCase（如 `DataAcquisition`），名称要有意义
- **状态命名**：动词开头，API加 `API:` 前缀，UI加 `UI:` 前缩，内部状态使用描述性名称

### 数据管理

- 所有数据存储在移位寄存器的Cluster中，便于扩展
- 在"Data: Initialize"初始化，在"Data: Cleanup"释放引用
- 避免使用全局变量，考虑用CSM消息机制代替

### 错误处理

- 所有错误流向"Error Handler"，实现统一的错误报告
- 确定哪些错误可恢复，实现重试逻辑
- 记录所有错误到日志

### 性能优化

- 合并可合并的状态，避免不必要的状态转换
- 事件结构超时设置：-1（事件驱动）、0（持续运行）、正值（周期检查）

### 代码组织

- 使用"Category Separator"分隔不同类别的状态
- 将通用逻辑封装成SubVI，避免重复代码

### 调试技巧

- 利用CSM全局日志系统记录关键信息
- 保存状态历史便于调试
- 创建"Debug: Breakpoint"状态以暂停执行（调试后移除）

### 文档和测试

- 在"Documentation"状态添加模块概述和API说明
- 为每个API创建测试用例，测试正常和边界情况
- 测试与其他模块的通讯和订阅广播机制

### 版本管理和团队协作

- 在模块中维护版本信息，记录变更历史
- 团队遵循一致的命名和错误处理规范
- 代码审查时检查API设计、错误处理和资源清理

## 模板选择指南

| 场景 | 推荐模板 | 原因 |
|------|----------|------|
| 数据采集/处理 | CSM Module Template | 无UI，高性能 |
| 配置界面 | CSM UI Module Template | 简单UI交互 |
| 实时显示 | CSM UI Module Template | 需要响应UI事件 |
| 复杂UI（图形编辑器等） | CSM DQMH-Style Template | 鼠标拖放等复杂交互 |
| 后台服务 | CSM Module Template（系统级） | 独立运行，不在列表 |
| 通讯协议/算法模块 | CSM Module Template | 纯计算，无UI |

**性能对比**：
- No-Event Template：响应最快 ⭐⭐⭐⭐⭐，CPU/内存占用低，复杂度低
- With Event Template：响应快 ⭐⭐⭐⭐，CPU/内存占用中，复杂度中
- DQMH-Style Template：响应最快 ⭐⭐⭐⭐⭐，CPU/内存占用中，复杂度高
- Tiny版：性能与标准版相同，内存略低

## 常见问题

**Q1: 标准模板还是Tiny模板？**  
新手用标准版（布局清晰），有经验用Tiny版（代码紧凑），功能完全相同。

**Q2: 何时用DQMH-Style？**  
UI操作需要组合逻辑（如拖放）、UI事件频率很高（如鼠标移动）、需要避免消息队列堵塞时使用。其他情况用标准UI模板即可。

**Q3: 能否修改模板？**  
可以定制，但建议保持核心结构不变，记录修改并团队共享，优先考虑用CSM扩展机制而非修改模板。

**Q4: 如何在模板间迁移？**  
无事件→有事件：添加事件结构；有事件→DQMH：分离事件循环；标准→Tiny：调整布局。如果模块已开发较多，建议保持当前模板。

**Q5: 调试代码何时删除？**  
CSM Module Template中的调试事件循环应在调试完成或部署前删除，或用条件禁用结构保留。

## 总结

选择合适的模板，遵循命名规则，完整实现标准状态（初始化、清理、错误处理），充分利用CSM的通讯能力（同步、异步、订阅），确保模块可维护和可靠。

### 相关资源

- [CSM基本概念](/2023/12/28/concepts.html)
- [CSM模块间通讯](/2023/12/29/communication.html)
- [创建CSM复用模块](/2023/12/30/basic.html)
- [CSM高级模式](/2023/12/31/advance.html)
- [CSM Palette APIs](/2024/01/08/csm-palette-apis.html)
- [CSM GitHub仓库](https://github.com/NEVSTOP-LAB/Communicable-State-Machine)
- [CSM示例项目](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/tree/main/examples)
- [JKI State Machine文档](http://jki.net/state-machine/)
- [CSM-Wiki主页](https://nevstop-lab.github.io/CSM-Wiki/)
