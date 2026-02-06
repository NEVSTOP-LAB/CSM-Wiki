---
title: CSM 开发模板
author: nevstop
date: 2024-01-08
layout: post
lang: zh-cn
page_id: CSM-Templates
toc: true
# cover: assets/img/CSM%20Without%20Event%20Structure%20Template.png
---

_**CSM 代码模板**_

<!-- CSM 代码模板介绍:
[English](src/help/NEVSTOP/Communicable%20State%20Machine(CSM)/Template%20Description(EN).md) | [中文](src/help/NEVSTOP/Communicable%20State%20Machine(CSM)/Template%20Description(CN).md) -->

![csm-template](https://nevstop-lab.github.io/CSM-Wiki/assets/img/CSM%20Without%20Event%20Structure%20Template.png)

# CSM开发模板完整指南

## 概述

CSM（Communicable State Machine）开发模板是帮助开发者快速创建符合CSM规范的模块的起点。CSM基于JKI State Machine（JKISM）扩展，提供了完整的模块间通讯能力。本文档详细介绍所有可用的CSM模板、它们的使用场景、核心组件以及最佳实践。

### CSM与JKISM的关系

Communicable State Machine(CSM) 是一个基于 JKI State Machine（JKISM）扩展的 LabVIEW 应用框架。它遵循 JKISM 的模式，并扩展了关键词，用于描述模块之间的消息通信，包括同步消息、异步消息、状态订阅/取消订阅等概念，这些是创建可重用代码模块的基本要素。

- 有关 JKI State Machine 的使用说明，请访问: <http://jki.net/state-machine/>
- 有关 CSM 的信息，请访问: <https://nevstop-lab.github.io/CSM-Wiki/>
- 有关 NEVSTOP-LAB 的信息，请访问: <https://github.com/NEVSTOP-LAB>

## 模板分类

CSM提供了多种模板，以适应不同的应用场景：

### 按事件结构分类

1. **无事件结构模板（No-Event Template）**
   - 适用于后台服务、数据处理等无用户界面的模块
   - 轻量级、高性能
   - 最常用的模板类型

2. **带事件结构模板（With Event Structure Template）**
   - 适用于有用户界面需要响应用户操作的模块
   - 集成了用户事件处理
   - 可以响应UI控件事件

3. **DQMH风格模板（DQMH-Style Template）**
   - 用户事件处理循环独立分离
   - 适用于复杂的用户界面场景
   - 支持快速产生的事件（如鼠标移动）

### 按代码风格分类

1. **标准模板（Standard Template）**
   - 代码布局清晰、易于理解
   - 适合学习和教学
   - 注释详细

2. **紧凑模板（Tiny Template）**
   - 代码更加紧凑
   - 适合经验丰富的开发者
   - 功能与标准模板完全相同

## 主要模板详解

### 1. CSM Module Template.vi（无事件结构模板）

**用途**：创建无用户界面的CSM模块的模板。

**特点**：
- 这是最常使用的CSM模板
- 不包含用户事件结构，适合后台服务
- 包含一个用于调试中退出模块的事件响应循环
- **重要**：调试完成后，应删除调试用的事件响应循环

**适用场景**：
- 数据采集模块
- 数据处理模块
- 通讯协议模块
- 后台服务模块
- 算法运算模块

**输入控件**：
- **Name ("" to use UUID)**：CSM模块名称（参见CSM名称规则）

### 2. CSM User Interface(UI) Module Template.vi（带事件结构模板）

**用途**：创建带用户界面的CSM模块的模板。

**特点**：
- 包含用户事件结构用于响应用户操作
- 可以处理UI控件事件
- 事件结构与状态机集成在同一循环中

**适用场景**：
- 用户界面模块
- 配置界面
- 数据显示界面
- 简单的用户交互模块

**输入控件**：
- **Name ("" to use UUID)**：CSM模块名称（参见CSM名称规则）

### 3. CSM DQMH-Style Template.vi（DQMH风格模板）

**用途**：创建一个DQMH风格的CSM模块模板。

**特点**：
- 响应用户操作的用户事件结构外置在独立的循环中
- 主要用于处理复杂的用户操作场景
- 两个循环独立运行，提高响应性能

**适用场景**：
- 用户界面操作非常复杂，需要组合逻辑完成协同工作（例如鼠标按下拖动并释放后触发某事件）
- 用户界面需要响应会快速产生的事件（如鼠标移动、窗口大小调整等）
- 需要避免UI事件快速产生导致的消息队列堵塞

**组合使用**：
用户也可以通过组合`CSM - Flood of Events Handler Side Loop VI`与`CSM Module Template VI`来创建完整的DQMH风格的CSM模块模板。

**参考范例**：`[CSM-Example]\4. Advance Examples\CSMLS - Continuous Loop in CSM Example.vi`

**输入控件**：
- **Name ("" to use UUID)**：CSM模块名称（参见CSM名称规则）

### 4. 紧凑模板（Tiny Templates）

#### CSM Module Template - Tiny.vi
用于创建无用户界面的CSM模块的紧凑代码模板。该模板功能与CSM Module Template VI完全相同，区别仅在于代码更加紧凑。

#### CSM User Interface(UI) Module Template - Tiny.vi
用于创建带用户界面的CSM模块的紧凑代码模板。该模板功能与CSM User Interface(UI) Module Template VI完全相同，区别仅在于代码更加紧凑。

## CSM名称规则

CSM模块名称是模块的唯一标识符，必须遵循以下规则：

### 基本规则

1. **唯一性要求**
   - CSM模块名称必须唯一，否则将导致CSM进入`Critical Error`状态
   - 同一系统中不能有两个相同名称的模块

2. **空字符串（独立模式）**
   - 若输入为空字符串("")，系统将使用UUID作为模块名称
   - 该模块会被标记为独立模式，不会包含在模块列表中
   - 适用于临时模块或不需要被其他模块访问的模块

### 特殊模式标识

3. **协作者模式（Worker Mode）**
   - 若输入以`#`结尾，则会实例化一个协作者模式节点
   - 例如：`DataProcessor#`
   - 多个节点可共同组成一个协作者模式模块
   - 外部消息将由其中一个空闲的模块处理

4. **责任链模式（Chain of Responsibility Mode）**
   - 若输入以`$`加数字结尾，则会实例化一个责任链模式节点
   - 例如：`Validator$1`、`Validator$2`
   - 多个节点可共同组成一个责任链模式模块
   - 数字表示节点在责任链中的优先级

5. **系统级模块**
   - 若输入以`.`开头，则该模块为系统级模块
   - 例如：`.Logger`、`.ConfigManager`
   - 在默认参数下，此类模块不会被`CSM - List Modules VI`列出
   - 适用于实例化后台运行的模块

6. **子模块命名**
   - `.`也允许出现在名称之中，将模块名称分为多个部分
   - 每个部分之间用`.`分隔
   - 例如：`MainModule.SubModule1.SubModule2`
   - CSM中并没有严格意义上的子模块，仅通过模块名称中的`.`来标记不同模块的逻辑关系
   - 从实际运行角度来看，它们是独立的模块
   - 唯一区别在于可以通过`CSM - List Submodules VI`获取逻辑上的子模块列表

### 命名示例

```
正常模块：     "DataAcquisition"
独立模式：     ""
协作者模式：   "Worker#"
责任链模式：   "Handler$1", "Handler$2"
系统级模块：   ".SystemLogger"
子模块：       "MainApp.UI.ConfigPanel"
```

## CSM模板核心组件

### 1. 状态机循环（Main Loop）

CSM的核心是一个While循环，包含Case结构和状态队列管理。

**关键元素**：
- **状态队列（State Queue）**：保存待执行的状态序列
- **Parse State Queue++.vi**：解析状态队列，获取当前要执行的状态
- **Case结构（Case Structure）**：根据当前状态执行相应的代码
- **移位寄存器（Shift Register）**：保存状态数据和队列

### 2. 初始化和退出宏

#### Macro: Initialize

- **默认值**：与JKISM状态机保持一致，为`Macro: Initialize`
- **用途**：初始化CSM模块的状态机
- **行为**：CSM模块仅在完成该宏状态后，才会处理外部发送的消息
- **内容**：通常包含数据初始化、事件注册、UI初始化等

#### Macro: Exit

- **默认值**：与JKISM状态机保持一致，为`Macro: Exit`
- **用途**：退出CSM模块的状态机
- **行为**：CSM模块进入该状态后，将不会再处理外部发送的消息
- **内容**：通常包含资源清理、事件注销、数据保存等

### 3. 事件结构（Event Structure）

仅在带事件结构的模板中存在。

**关键事件**：
- **New State Notifier Event**：用于在收到新消息时中断事件结构中的等待
- **用户控件事件**：响应用户界面操作
- **Panel Close事件**：通常被丢弃，由`Macro: Exit`统一处理

### 4. 超时控制

**Timeout Selector.vi**：
- 适用于包含用户事件结构的模板
- 如果超时为-1时，`Remaining States`中依然还有剩余状态，那么超时值将被修改为0
- 目的：保证立刻跳出用户事件结构，并继续处理剩余状态

**Loop Rate控件**：
- `-1`：永远等待新状态的到来或用户操作在事件结构中被检测到
- `0`：不等待，持续运行
- `>0`：指定的超时时间（毫秒）

## 模板状态分类

CSM模板中的状态（Case）按功能分为多个类别：

### 系统状态

#### Default
- **用途**：捕获未处理的状态、消息和拼写错误
- **行为**：通常记录日志或报告错误
- **注意**：不要在这里放入业务逻辑

#### Documentation
- **用途**：保存CSM文档供参考
- **行为**：无实际功能，仅用于文档目的

#### Idle/Event Handler
- **用途**：当状态队列为空时执行此分支逻辑
- **内容**：
  - 事件结构（如果有）
  - 空闲时的处理逻辑

### 错误处理状态

#### Error Handler
- **用途**：处理模块错误
- **内部错误**：如果发生了错误，"Error Occurred"状态将被广播到整个系统
- **外部错误**：此分支的执行是由于本模块订阅了其他模块的"Error Occurred"状态

#### Critical Error
- **用途**：当不可恢复错误发生时，模块进入此分支
- **行为**：直接停止循环
- **警告**：除非完全了解修改带来的影响，不要修改此逻辑

#### Target Busy Error
- **用途**：当此模块尝试与忙碌的模块通讯时处理
- **建议**：可以实现重试逻辑或错误报告

#### Target Timeout Error
- **用途**：当此模块与其他模块消息超时未获得反馈时处理
- **建议**：检查超时设置，实现重试或回退逻辑

#### Target Error
- **用途**：当此模块尝试与不存在的模块通讯时处理
- **建议**：检查模块名称，确保目标模块已启动

### 消息响应状态

#### Response
- **用途**：处理同步调用响应（`-@`符号）
- **行为**：同步调用时，此模块在发送完同步消息后将等待，消息被执行完毕后，"Response"分支被立即执行

#### Async Response
- **用途**：处理异步调用响应（`->`符号）
- **行为**：异步调用消息发送后，"Async Message Posted"被执行；当消息被执行完毕后，"Async Response"分支被执行

#### Async Message Posted
- **用途**：在异步调用消息发送后（`->`或`->|`）执行
- **用途**：处理消息发送后的事件
- **技巧**：可以使用"Argument - State"分辨发送的异步消息内容

### 数据管理状态

#### Data: Initialize
- **用途**：初始化移位寄存器的数据
- **命名**：数据名称由连接到bundle函数中的内容决定

#### Data: Cleanup
- **用途**：清除所有数据和引用
- **调用**：由`Macro: Exit`自动调用

### 事件管理状态

#### Events: Register
- **用途**：注册用户事件
- **默认**：注册"New Message Event"以打破事件结构中的CSM等待

#### Events: Unregister
- **用途**：注销用户事件
- **调用**：由`Macro: Exit`自动调用

### UI管理状态

#### UI: Initialize
- **用途**：初始化界面
- **调用**：由`Macro: Initialize`自动调用

#### UI: Cursor Set
- **用途**：设置鼠标忙碌或空闲
- **用法**：`"UI: Cursor Set >> Busy|Idle"`

#### UI: Front Panel State
- **用途**：前面板打开或关闭
- **用法**：`"UI: Front Panel State >> Open|Close"`

### 初始化和退出

#### Initialize Core Data
- **用途**：确定退出时面板的行为
- **内容**：设置面板关闭时的行为

#### Exit
- **用途**：退出循环
- **注意**：这里发生的任何错误都不会被处理

### 用户自定义状态

#### API Example
- **用途**：API示例模板
- **使用**：复制/重命名创建新的API
- **参数**：
  - **>> From Who >>**：用于区分是谁发送的此消息（本模块时为空字符串）
  - **>> Arguments >>**：调用参数
  - **Response**：连接的字符串将作为响应返回给调用模块

#### Internal State
- **用途**：实现模块的内部逻辑状态
- **使用**：根据实际需求创建内部状态

#### Category Separator
- **用途**：分隔分支
- **警告**：不要在这个分支中放入任何代码

## 状态语法

CSM扩展了JKISM的状态语法，支持模块间通讯：

### 本地消息
```
DoSth: DoA >> Arguments
```

### 同步调用
```
API: xxxx >> Arguments -@ TargetModule
```
- 发送消息后等待响应
- 超时时间可配置
- 响应在"Response"状态中处理

### 异步调用
```
API: xxxx >> Arguments -> TargetModule
```
- 发送消息后立即返回
- 响应在"Async Response"状态中处理

### 异步调用（无返回值）
```
API: xxxx >> Arguments ->| TargetModule
```
- 发送消息后立即返回
- 不等待响应

### 状态发布（广播）
```
Status >> StatusArguments -> <all>
```
- 向所有订阅的模块广播状态

### 注释
使用`//`添加注释，右边的所有文本将被忽略：
```
UI: Initialize // This initializes the UI
// Another comment line
```

## 其他代码片段

CSM提供了一些常用的代码片段，帮助开发者快速构建特定功能：

### CSM - Start Async Call.vi
**用途**：异步启动CSM模块的代码片段。

**使用方法**：
1. 拖至程序框图
2. 将VI静态引用改为目标CSM模块

**参考范例**：`[CSM-Example]\3. Caller is Other Framework Scenario\CSM Example - Caller is NOT a CSM.vi`

### CSM - Synchronized Call.vi
**用途**：同步调用CSM模块的代码片段。

**特点**：实质上是把CSM模块当作子VI直接调用。

**参考范例**：`[CSM-Example]\2. Caller is CSM Scenario\CSM Example - Caller is a CSM.vi`

### CSM - Flood of Events Handler Side Loop.vi
**用途**：DQMH风格的CSM模块的用户事件结构循环模板。

**适用场景**：
- 用户界面操作非常复杂
- 需要组合逻辑完成协同工作

**参考范例**：`[CSM-Example]\4. Advance Examples\CSMLS - Continuous Loop in CSM Example.vi`

### CSM - Global Log Queue Monitoring Loop.vi
**用途**：创建一个全局日志队列监控循环。

**功能**：用于查询监控全局日志队列中的消息。

**参考范例**：`[CSM-Example]\4. Advance Examples\2. Chain of Responsibility Example\Chain of Responsibility Example.vi`

### CSM - Global Log Event Monitoring Loop.vi
**用途**：创建一个全局日志事件监控循环。

**功能**：用于查询监控全局日志队列中的消息。

**参考范例**：`[CSM-Example]\4. Advance Examples\4. Global Log Filter Example\`中的任一范例

## 模板支持VIs

### CSM - Get New State Notifier Event.vi
**用途**：获取用户事件句柄，适用于包含事件结构的CSM模块。

**功能**：
- 包含事件结构的CSM模块通常会在事件结构处等待
- 此事件用于在收到新消息时中断事件结构中的等待，使模块继续执行

**输入控件**：
- **Name ("" to use UUID)**：CSM模块名称

**输出控件**：
- **New State Notifier Event**：用户事件句柄

### Timeout Selector.vi
**用途**：超时选择器，适用于包含用户事件结构的模板。

**功能**：
- 如果超时为-1时，`Remaining States`中依然还有剩余状态，那么超时值将被修改为0
- 保证立刻跳出用户事件结构，并继续处理剩余状态

**输入控件**：
- **Timeout Expected**：预期的超时设置
- **Remaining States**：剩余状态队列

**输出控件**：
- **Timeout**：仲裁后使用的超时设置

## 模板错误处理VIs

CSM提供了一系列错误生成VIs，用于创建标准的CSM错误：

### CSM Critical Error.vi
**用途**：生成CSM严重错误描述的错误簇。

**说明**：
- 严重错误为CSM框架发生的严重错误消息，无法由用户代码处理恢复
- 常见原因是模块名称重复

**输入控件**：
- **CSM Name**：CSM模块名称
- **Arguments (As Reason)**：错误原因

### CSM No Target Error.vi
**用途**：生成CSM无目标消息错误描述的错误簇。

**说明**：
- 无目标消息错误发生在CSM尝试发送一个消息，但目标模块名称为空字符串

### CSM Target Error.vi
**用途**：生成CSM消息目标模块不存在的错误描述的错误簇。

**说明**：
- 目标模块不存在错误发生在CSM尝试发送一个消息到一个不存在的目标模块时

**输入控件**：
- **Arguments (As CSM Name)**：连接参数，传递目标模块名称

### CSM Target Timeout Error.vi
**用途**：生成CSM消息目标模块超时的错误描述的错误簇。

**说明**：
- 目标模块超时错误发生在CSM尝试发送一个同步消息到一个目标模块，但在指定的超时时间内未收到回复时

**输入控件**：
- **Arguments (As CSM Name)**：连接参数，传递目标模块名称

### CSM Target Busy Error.vi
**用途**：生成CSM消息目标模块忙碌的错误描述的错误簇。

**说明**：
- 目标模块忙碌错误发生在CSM尝试发送一个同步消息到一个正在处理其他同步消息的目标模块时

**输入控件**：
- **Arguments (As CSM Name)**：连接参数，传递目标模块名称

## 从模板开始开发的流程

### 1. 选择合适的模板

**决策树**：
1. **是否有用户界面？**
   - 否 → 使用 CSM Module Template
   - 是 → 继续

2. **用户交互是否复杂？**
   - 否 → 使用 CSM User Interface Module Template
   - 是（需要处理快速事件或组合逻辑）→ 使用 CSM DQMH-Style Template

3. **代码风格偏好？**
   - 标准布局（适合学习）→ 使用标准版
   - 紧凑布局（经验丰富）→ 使用 Tiny 版

### 2. 设置模块名称

根据模块的用途和在系统中的角色，选择合适的命名方式：
- 普通模块：使用描述性名称，如"DataAcquisition"
- 独立模块：使用空字符串""
- 协作者：名称以"#"结尾
- 责任链：名称以"$数字"结尾
- 系统级：名称以"."开头
- 子模块：使用"."分隔名称层次

### 3. 实现初始化逻辑（Macro: Initialize）

在"Macro: Initialize"中添加：
1. 调用"Data: Initialize"初始化数据
2. 调用"Events: Register"注册事件（如果需要）
3. 调用"UI: Initialize"初始化界面（如果有UI）
4. 其他初始化逻辑

### 4. 创建API状态

1. 复制"API Example"状态
2. 重命名为实际的API名称
3. 实现API逻辑
4. 设置响应数据

### 5. 实现内部状态

1. 在"Internal State"下创建内部状态
2. 实现状态逻辑
3. 设置状态转换

### 6. 实现错误处理

1. 在"Error Handler"中实现错误处理逻辑
2. 根据需要实现特定错误状态（Target Error、Timeout Error等）
3. 考虑是否需要订阅其他模块的错误状态

### 7. 实现清理逻辑（Macro: Exit）

在"Macro: Exit"中添加：
1. 调用"Data: Cleanup"清理数据
2. 调用"Events: Unregister"注销事件
3. 其他清理逻辑

### 8. 删除调试代码

**重要**：在CSM Module Template中，删除调试用的事件响应循环。

### 9. 测试和文档化

1. 单元测试每个API
2. 集成测试模块间通讯
3. 在"Documentation"状态中添加模块文档
4. 创建使用示例

## 模板使用最佳实践

### 1. 命名约定

**模块命名**：
- 使用PascalCase命名法：`DataAcquisition`
- 名称要有意义，能够反映模块功能
- 避免使用缩写，除非是广泛接受的

**状态命名**：
- 使用动词开头：`Initialize`、`Process`、`Update`
- API使用`API: `前缀：`API: GetData`
- UI状态使用`UI: `前缀：`UI: Update Display`
- 内部状态使用描述性名称：`Process Data`、`Calculate Result`

### 2. 数据管理

**使用移位寄存器**：
- 所有模块数据都应该存储在移位寄存器中
- 使用Cluster组织数据，便于扩展
- 在"Data: Initialize"中初始化所有字段
- 在"Data: Cleanup"中释放所有引用

**避免全局变量**：
- 尽量避免使用Functional Global Variables
- 如果必须使用，要明确文档化
- 考虑使用CSM的消息机制代替全局变量

### 3. 错误处理

**统一的错误处理模式**：
- 所有错误都应该流向"Error Handler"
- 实现一致的错误报告机制
- 考虑是否需要广播错误状态

**错误恢复策略**：
- 确定哪些错误是可恢复的
- 实现适当的重试逻辑
- 记录所有错误到日志

### 4. 性能优化

**避免不必要的状态转换**：
- 合并可以合并的状态
- 使用状态序列简化流程
- 避免循环调用导致的开销

**事件结构超时设置**：
- 根据实际需求设置合理的超时
- `-1`适用于事件驱动的模块
- `0`适用于持续运行的模块
- 正值适用于周期性检查的模块

### 5. 代码组织

**状态分类**：
- 使用"Category Separator"分隔不同类别的状态
- 保持状态列表的组织性
- 相关的状态放在一起

**代码复用**：
- 将通用逻辑封装成SubVI
- 避免在Case结构中重复代码
- 考虑使用CSM模块化设计

### 6. 调试技巧

**使用日志**：
- 利用CSM全局日志系统记录关键信息
- 记录状态转换和重要事件
- 在调试时启用详细日志

**状态历史**：
- 保存最近执行的状态历史
- 便于调试和问题追踪
- 可以使用移位寄存器保存历史记录

**断点状态**：
- 创建一个"Debug: Breakpoint"状态
- 在需要时插入此状态以暂停执行
- 调试完成后移除

### 7. 文档化

**代码文档**：
- 在"Documentation"状态中添加模块概述
- 为每个公共API添加说明
- 记录重要的设计决策

**API文档**：
- 说明每个API的功能
- 列出所有参数及其含义
- 说明返回值格式
- 提供使用示例

### 8. 测试策略

**单元测试**：
- 为每个API创建测试用例
- 测试正常情况和边界情况
- 测试错误处理逻辑

**集成测试**：
- 测试与其他模块的通讯
- 测试同步和异步调用
- 测试订阅和广播机制

### 9. 版本管理

**模块版本**：
- 在模块中维护版本信息
- 记录版本变更历史
- 考虑向后兼容性

**API版本**：
- 为API添加版本标识（如果需要）
- 支持旧版本API（渐进式废弃）
- 文档化API变更

### 10. 团队协作

**编码规范**：
- 团队要遵循一致的命名约定
- 使用相同的模板版本
- 统一错误处理模式

**代码审查**：
- 审查API设计
- 检查错误处理
- 验证资源清理

## 模板选择指南

### 场景对比表

| 场景 | 推荐模板 | 原因 |
|------|----------|------|
| 数据采集 | CSM Module Template | 无UI，高性能 |
| 数据处理 | CSM Module Template | 无UI，专注逻辑 |
| 配置界面 | CSM UI Module Template | 简单UI交互 |
| 实时显示 | CSM UI Module Template | 需要响应UI事件 |
| 复杂UI操作 | CSM DQMH-Style Template | 需要处理快速事件 |
| 图形编辑器 | CSM DQMH-Style Template | 鼠标拖放等复杂交互 |
| 后台服务 | CSM Module Template (系统级) | 独立运行，不在列表 |
| 通讯协议 | CSM Module Template | 无UI，协议处理 |
| 算法模块 | CSM Module Template | 纯计算，无UI |
| 监控面板 | CSM UI Module Template | 显示和简单控制 |

### 性能对比

| 模板类型 | 响应时间 | CPU使用率 | 内存占用 | 复杂度 |
|----------|----------|-----------|----------|--------|
| No-Event Template | ⭐⭐⭐⭐⭐ | 低 | 低 | 低 |
| With Event Template | ⭐⭐⭐⭐ | 中 | 中 | 中 |
| DQMH-Style Template | ⭐⭐⭐⭐⭐ | 中 | 中 | 高 |
| Tiny版本 | 与标准版相同 | 与标准版相同 | 略低 | 中-高 |

## 常见问题

### Q1: 应该使用标准模板还是Tiny模板？

**答案**：
- **新手或学习**：使用标准模板，代码布局清晰易懂
- **经验丰富**：使用Tiny模板，代码更紧凑
- **功能完全相同**：选择取决于个人偏好

### Q2: 何时使用DQMH-Style模板？

**答案**：在以下情况使用：
- UI操作需要组合逻辑（如拖放操作）
- UI事件产生频率很高（如鼠标移动）
- 需要避免消息队列被快速事件堵塞
- 其他情况使用标准UI模板即可

### Q3: 能否修改模板？

**答案**：
- 可以根据项目需求定制模板
- 建议保持核心结构不变
- 记录所有修改并团队共享
- 考虑使用CSM的扩展机制而非修改模板

### Q4: 如何在模板之间迁移？

**答案**：
- **无事件 → 有事件**：添加事件结构和相关状态
- **有事件 → DQMH**：分离事件循环到独立While循环
- **标准 → Tiny**：主要是代码布局调整，逻辑不变
- 建议：如果模块已经开发较多，保持当前模板

### Q5: 调试代码何时删除？

**答案**：
- CSM Module Template中的调试事件循环应在调试完成后删除
- 或者在部署到生产环境前删除
- 可以使用条件禁用结构保留调试代码

## 总结

CSM开发模板为创建模块化、可通讯的LabVIEW应用提供了坚实的基础。通过选择合适的模板、遵循命名规则、实现标准状态、并应用最佳实践，开发者可以快速构建高质量的CSM模块。

### 关键要点

1. **选择合适的模板**：根据是否有UI和UI复杂度选择
2. **遵循命名规则**：确保模块名称唯一性和语义清晰
3. **完整实现标准状态**：初始化、清理、错误处理
4. **使用CSM的通讯能力**：充分利用同步、异步、订阅机制
5. **文档化和测试**：确保模块可维护和可靠

### 下一步

- 学习[CSM基本概念](/2023/12/28/concepts.html)
- 了解[CSM模块间通讯](/2023/12/29/communication.html)
- 掌握[创建CSM复用模块](/2023/12/30/basic.html)
- 探索[CSM高级模式](/2023/12/31/advance.html)
- 查看[CSM Palette APIs](/2024/01/08/csm-palette-apis.html)

### 更多资源

- [CSM GitHub仓库](https://github.com/NEVSTOP-LAB/Communicable-State-Machine)
- [CSM示例项目](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/tree/main/examples)
- [JKI State Machine文档](http://jki.net/state-machine/)
- [CSM-Wiki主页](https://nevstop-lab.github.io/CSM-Wiki/)
