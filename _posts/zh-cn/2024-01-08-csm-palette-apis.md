---
title: CSM 函数面板
author: nevstop
date: 2024-01-08
layout: post
lang: zh-cn
page_id: CSM-Palette-APIs
toc: true
---

_**CSM 函数面板**_

![csm-palette](https://nevstop-lab.github.io/CSM-Wiki/assets/img/CSM%20Palette.png)

# CSM API参考手册

## 概述

这是CSM（Communicable State Machine）的完整API手册，涵盖模块通讯、状态管理、参数处理等所有功能。

### API分类

1. **模板面板** - 创建CSM模块的各种模板
2. **核心功能** - Parse State Queue++.vi、Build Message系列
3. **参数处理** - 编码解码API（HEXSTR、ERRSTR、SAFESTR等）
4. **管理接口** - 模块检查、列表查询、状态获取、超时设置
5. **模块操作** - 消息发送、等待、异步启动、同步调用
6. **广播管理** - 状态订阅和注销
7. **全局日志** - 日志记录、过滤、订阅
8. **高级模式** - 协作者、责任链模式
9. **调试工具** - 调试辅助、开发支持
10. **实用工具** - 字符串处理、队列操作

### 使用说明

> **注意**：消息拼接类API只负责构建消息字符串，不会直接发送。消息需并入CSM状态队列，由Parse State Queue++.vi处理。熟悉CSM后可直接键入消息字符串，无需使用这些API。状态队列操作API与之类似，但包含队列输入，相当于直接插入消息到队列中。

### API快速参考

最常用的CSM API：

| API | 用途 | 分类 |
|-----|------|------|
| Parse State Queue++.vi | 解析状态队列，CSM核心 | 核心功能 |
| Build Message with Arguments++.vi | 构建消息字符串（多态VI） | 核心功能 |
| CSM - Send Message and Wait for Reply.vi | 同步消息，等待响应 | 模块操作 |
| CSM - Post Message.vi | 异步消息 | 模块操作 |
| CSM - List Modules.vi | 列出所有活动模块 | 管理接口 |
| CSM - Check If Module Exists.vi | 检查模块存在 | 管理接口 |
| CSM - Register State.vi | 注册状态订阅 | 广播管理 |
| CSM - Unregister State.vi | 注销状态订阅 | 广播管理 |

## 模板面板（Template Palette）

模板面板提供创建CSM模块所需的各种模板，详见[CSM开发模板](/2024/01/08/csm-templates.html)。

### CSM - No-Event Structure Template.vi

创建无用户界面的CSM模块模板。

**输入**：
- **Name("" to use uuid)**：模块名称
  - 空字符串 → 使用UUID，独立模式，不在模块列表中
  - '#'结尾 → 工作模式，相同名称模块共享消息队列，空闲的模块处理消息
  - 其他 → 作为模块名称，需保持唯一，重名会进入"Critical Error"

### CSM - With Event Structure Template.vi

创建带用户界面的CSM模块模板，包含用户事件结构。参数同上。

### CSM - With Event Structure Template - Tiny.vi

带用户界面的紧凑版CSM模板。参数同上。

### Parse State Queue++.vi

解析JKI状态机状态队列，返回将执行的下一个当前状态、参数等信息。

**输入**：

- **State Queue**: 整个状态队列，应来自CSM的移位寄存器
- **Error In (no error)**: 错误簇。如果有错误，当前状态输出将返回"Error Handler"状态
- **Name("" to use uuid)**: CSM模块名称
  - 空字符串 → 使用UUID，独立模式，不在模块列表中
  - '#'结尾 → 工作模式，相同名称模块共享消息队列
  - 其他 → 作为模块名称，需保持唯一，重名进入"Critical Error"
- **Response Timeout(5000ms)**: 同步调用时的响应超时设置，默认5000ms
- **Dequeue Timeout(0ms)**: 检查CSM消息队列的超时设置，默认0（不等待）
- **Response Arguments**: 来自上一个状态的响应参数，应连接CSM的移位寄存器

**输出**：

- **Remaining States**: 继续执行的所有状态及参数
- **Arguments**: 当前状态字符串中的参数（'>>'之后）
- **Current State**: 将执行的下一个状态
- **Name Used**: 分配给此CSM模块的实际名称
- **Argument - State**: 如果是CSM定义的内置状态，此参数表示前一状态
- **From Who**: 如果状态由外部发送，这是源CSM模块名称

### Build State String with Arguments++.vi

构建包含JKI状态机参数的状态字符串。

**示例**：

发送给本地状态机时，**Target Module ("")**应为空：
- `State = A` 无参数 → `A`
- `State = A, Arguments = B` → `A >> B`

发送给其他CSM（假设**Target Module**是"Target"）：
- 同步调用（等待返回）：
  - `State = A` → `A -@target`
  - `State = A, Arguments = B` → `A >> B -@target`
- 异步调用（收到"Async Response"）：
  - `State = A` → `A ->target`
  - `State = A, Arguments = B` → `A >> B ->target`

**输入**：

- **State**: 状态或消息名称字符串
- **Arguments ("")**: 状态的参数
- **Target Module ("")**: 目标CSM模块名称
- **Sync-Call(-@) T By Default/Async-Call(->) F**: TRUE=同步调用，FALSE=异步调用

**输出**：

- **State with Arguments**: 包含状态、参数等信息的完整字符串

### Build Message with Arguments++.vi

构建包含参数的CSM消息。该VI会解析输入消息的类型、消息字符串、参数和目标模块，并用新值替换相应部分。不同多态VI实例使用不同消息符号（`->|`, `->`, `-@`）。

**多态版本**：

- Build Message with Arguments(Auto Check).vi - 自动检测消息类型
- Build Asynchronous Message with Arguments.vi - 异步消息（->）
- Build No-Reply Asynchronous Message with Arguments.vi - 无返回异步（->|）
- Build Synchronous Message with Arguments.vi - 同步消息（-@）

**公共参数**：

- **State with Arguments**: 输入消息（可能包含参数或目标模块）
- **Arguments ("")**: 新参数（空则不包含参数）
- **Target Module ("")**: 新目标（空则使用原目标）
- **输出**: **State with Arguments** - 替换后的消息字符串

#### Build Message with Arguments(Auto Check).vi

自动检测并保持输入消息的类型。

**示例**：

```
输入: "API: DoSth" + Args: "Arguments" + Target: "Callee"
输出: "API: DoSth >> Arguments"（无符号）

输入: "API: DoSth >> Arguments -> Callee" + Args: "NewArguments"
输出: "API: DoSth >> NewArguments -> Callee"（保持->）

输入: "API: DoSth >> Arguments -@ Callee" + Args: "NewArguments"
输出: "API: DoSth >> NewArguments -@ Callee"（保持-@）
```

#### Build Asynchronous Message with Arguments.vi

强制使用异步符号`->`（有返回）。会将输入消息的符号替换为`->`。

#### Build No-Reply Asynchronous Message with Arguments.vi

强制使用无返回异步符号`->|`。会将输入消息的符号替换为`->|`。

#### Build Synchronous Message with Arguments.vi

强制使用同步符号`-@`。会将输入消息的符号替换为`-@`。

#### Build Interrupt Status Message.vi

构建中断状态消息，保持原消息类型。

**输入**：
- **State with Arguments**: 包含参数和目标的消息
- **Arguments ("")**: 新参数

**输出**：
- **State with Arguments**: 完整消息字符串

#### Build Normal Status Message.vi

构建普通状态消息，保持原消息类型。参数同上。

#### Build Register Status Message.vi

构建状态注册消息。

**格式**：`[源状态]@[源模块] >> [响应消息]@[响应模块] -><register>`

**示例**：
```
DownloadFinished@Downloader >> StartPlay@Player -><register>
DownloadFinished@Downloader >> StartPlay -><register>  // 响应模块为当前模块
DownloadFinished@Downloader -><register>  // 响应消息同源状态
DownloadFinished@* >> StartPlay@Player -><register>  // 任意模块的状态
```

**输入**：
- **Source CSM Name (* as Default)**: 源模块名（*表示任意）
- **CSM Name**: 响应模块名
- **Status**: 状态名
- **Response Message (if "", same as Source Message)**: 响应消息（空则同源消息）

**输出**：
- **State with Arguments**: 注册消息

#### Build Unregister Status Message.vi

构建状态注销消息。

**格式**：`[源状态]@[源模块] >> [响应模块] -><unregister>`

**输入**：
- **Source CSM Name (* as Default)**: 源模块名
- **CSM Name**: 响应模块名
- **Status**: 状态名

**输出**：
- **State with Arguments**: 注销消息

### Add State(s) to Queue By BOOL++.vi

根据Bool值和优先级插入状态到队列。多态VI支持不同数据类型。

**公共参数**：
- **State Queue("")**: 状态队列
- **TRUE("")**: Bool为True时插入的状态
- **False("")**: Bool为False时插入的状态
- **Bool**: 选择分支的标志
- **High Priority(FALSE)**: True=插入队列头部，False=追加尾部

**输出**：
- **State Queue Out**: 更新后的状态队列

**多态版本**：
- **Element**: 单个状态字符串
- **Array Left**: TRUE为数组，False为字符串
- **Array Right**: TRUE为字符串，False为数组
- **Array All**: TRUE和FALSE都是数组

### CSM - Broadcast Status Change.vi

向系统广播状态更改。已注册状态的CSM模块将接收到状态更改。

**输入**：
- **Status with Arguments**: 将被广播的状态及参数
- **State Queue("")**: 状态队列
- **Broadcast(T)**: 控制是否广播的开关

**输出**：
- **Remaining States**: 更新后的状态队列

## 参数处理（Arguments）

### CSM - Make String Arguments Safe.vi

'->','->\|','-@','-&','<-' 是关键字，不能出现在参数中。使用此VI保证参数安全。

**输入**：
- **Argument String**: 可能包含关键字的参数

**输出**：
- **Safe Argument String**: 安全参数

### CSM - Revert Arguments-Safe String.vi

将安全参数转换为原始参数。

**输入**：
- **Safe Argument String**: 安全参数

**输出**：
- **Origin Argument String**: 原始参数

### CSM - Convert Data to HexStr.vi

将复杂参数（变体）转换为十六进制字符串，可安全用作状态参数。

**输入**：
- **Variant**: 数据（变体格式）

**输出**：
- **HEX String (0-9,A-F)**: 十六进制字符串，不包含不可见字符

### CSM - Convert HexStr to Data.vi

将十六进制字符串参数转换回变体数据。

**输入**：
- **HEX String**: 十六进制字符串

**输出**：
- **Variant**: 原始数据（变体格式）
- **error out**: 错误簇

## 高级功能（Advance APIs）

### CSM - Start Async Call.vi

异步调用模板代码的VI片段。直接拖拽到程序框图使用。

### CSM - Synchronized Call.vi

同步调用模板代码的VI片段。直接拖拽到程序框图使用。

### CSM - Mark As Worker Module.vi

在CSM名称后添加"#"，标记为工作者模式。相同名称的工作者共享消息队列，实际名称为带UUID的唯一名称。

**输入**：
- **CSM Name**: CSM模块名称

**输出**：
- **CSM Name(marked as worker)**: 带"#"标记的CSM模块名称

### CSM - Compact Multiple States.vi

将多个状态合并为单个字符串。

**输入**：
- **States in Lines**: 多个状态的字符串数组

**输出**：
- **States**: 包含所有输入状态的字符串

### CSM - Check If Module Exists.vi

检查CSM模块是否存在。

**输入**：
- **CSM Name**: CSM模块名称
- **Error in**: 错误簇

**输出**：
- **Exist?**: True=存在，False=不存在
- **CSM Name(dup)**: 返回CSM Name
- **Error out**: 错误簇

### CSM - List Modules.vi

列出系统中所有活动的CSM模块。

**输入**：
- **Exclude Standalone CSM(T)**: 是否排除独立工作模式的模块
- **Error in**: 错误簇

**输出**：
- **Module Names**: 模块名称列表
- **Error out**: 错误簇

### CSM - Module Status.vi

获取CSM模块的工作状态。

**输入**：
- **CSM Name**: CSM模块名称
- **Error in**: 错误簇

**输出**：
- **Mode**: 工作模式（"Stand-alone"、"CSM"或"Action Worker"）
- **#As Worker**: 工作者模式下的工作者数量
- **#msg to be processed**: CSM消息队列中的待处理消息数
- **CSM Name(dup)**: 返回CSM Name
- **Error out**: 错误簇

### CSM - Register Status Change.vi

注册以接收其他CSM模块状态更改的通知。

**输入**：
- **CSM Name**: CSM模块名称
- **Source CSM Name (* as Default)**: 源CSM模块（"*"表示所有模块）
- **Status**: 状态字符串
- **Response Message (if "", same as Source Message)**: 响应消息（空则同Status）
- **Priority(T:As Status,F:As Interrupt)**: False=插入队列前面，True=追加尾部
- **Error in**: 错误簇

**输出**：
- **CSM Name(dup)**: 返回CSM Name
- **Error out**: 错误簇

### CSM - Unregister Status Change.vi

取消注册其他CSM模块状态更改的通知。

**输入**：
- **CSM Name**: CSM模块名称
- **Source CSM Name**: 源CSM模块（"*"表示所有模块）
- **Status**: 状态字符串
- **Error in**: 错误簇

**输出**：
- **CSM Name(dup)**: 返回CSM Name
- **Error out**: 错误簇

### CSM - Get New State Notifier Event.vi

获取新消息通知事件，用于中断事件结构等待。

**输入**：
- **Name("" to use uuid) in**: CSM模块名称
- **Error in**: 错误簇

**输出**：
- **New State Notifier Event**: 用户事件句柄
- **Error out**: 错误簇

## Non-CSM Support

### CSM - Post Message.vi

向指定CSM发送异步消息，不等待返回。

**输入**：
- **Target Module**: 目标CSM模块名称
- **State**: 消息字符串
- **Arguments ("")**: 消息参数
- **Error In (no error)**: 错误簇

**输出**：
- **error out**: 错误簇

### CSM - Send Message and Wait for Reply.vi

向指定CSM发送同步消息并等待回复，超时返回错误。

**输入**：
- **Target Module**: 目标CSM模块名称
- **State**: 消息字符串
- **Arguments ("")**: 消息参数
- **Response Timeout(5000ms)**: 等待返回的超时（默认5000ms）
- **Error In (no error)**: 错误簇

**输出**：
- **Arguments**: 响应返回值
- **error out**: 错误簇

### CSM - Status Change Event.vi

获取CSM全局日志事件引用。

**输入**：
- **Error in**: 错误簇
- **Name("" to use uuid) in**: 模块名称

**输出**：
- **Status Change Event**: 状态变化事件引用
- **Error out**: 错误簇

### CSM - Destroy Status Change Event.vi

释放CSM全局日志事件引用。

**输入**：
- **Status Change Event**: 状态变化事件引用
- **Error in**: 错误簇

**输出**：
- **Error out**: 错误簇

## Side-Loop Support

### CSM - Request CSM to Post Message.vi

申请CSM发送消息。用于与CSM并行的功能循环，这些循环与CSM一起完成完整模块功能。

**输入**：
- **Module Name**: 发送状态的CSM
- **Status**: 将被广播的状态
- **Arguments ("")**: 状态参数
- **Target Module**: 目标模块
- **Error In (no error)**: 错误簇

**输出**：
- **error out**: 错误簇

### CSM - Request CSM to Broadcast Status Change.vi

申请CSM广播状态。用于与CSM并行的功能循环。

**输入**：
- **Module Name**: 发送状态的CSM
- **Status**: 将被广播的状态
- **Arguments ("")**: 状态参数
- **Broadcast(T)**: 控制是否广播
- **Error In (no error)**: 错误簇

**输出**：
- **error out**: 错误簇

### CSM - Module Turns Invalid.vi

检查CSM是否已经退出。用于并行功能循环的退出条件。

**输入**：
- **CSM Name**: 模块名称

**输出**：
- **Turn Invalid(Exit)?**: 是否已退出

## 全局日志（Global Log Event）

### CSM - Global Log Event.vi

获取CSM全局状态用户事件句柄。

**输入**：
- **Error in**: 错误簇

**输出**：
- **CSM Global Log Event**: 全局日志事件句柄
- **Error out**: 错误簇

### CSM - Destroy Global Log Event.vi

释放CSM全局状态用户事件句柄。

**输入**：
- **CSM Global Log Event**: 全局日志事件句柄
- **Error in**: 错误簇

**输出**：
- **Error out**: 错误簇

### CSM - Generate User Global Log.vi

生成用户全局日志。

**输入**：
- **Error in**: 错误簇
- **From Who**: 发送者
- **ModuleName**: 模块名称
- **Log**: 日志内容
- **Arguments**: 参数

**输出**：
- **error out**: 错误簇

## 实用工具（Utility VIs）

### Build Error Cluster.vi

创建错误簇，以标准LabVIEW方式从调用链构建源字符串。

格式："**调用的VI** 在 **调用VI的调用者**->**调用VI的调用者的调用者**->..."

可选的'String to Prepend to source ("")'可添加额外描述信息。

**输入**：
- **code**: 错误码
- **String to Prepend to source ("")**: 错误信息字符串

**输出**：
- **error out**: 错误簇

### Build Internal State String.vi

构建包含JKI状态机状态、参数等信息的字符串。

**输入**：
- **State**: 状态字符串
- **Arguments ("")**: 状态的参数
- **Arg-State ("")**: 发送此消息时的状态
- **Source ("")**: 发送此消息的模块名称

**输出**：
- **State with Arguments**: 完整的状态字符串

### String History Cacher.vi

保存当前输入字符串到缓存，用于调试CSM历史状态。超出最大长度时，最先进入的字符串被覆盖。

**输入**：
- **String**: 待缓存字符串
- **length**: 缓存的最大字符串长度
- **Include Timestamp(F)**: 是否包含时间戳

**输出**：
- **String Cache**: 缓存的历史字符串

### Timeout Selector.vi

用于包含用户事件结构的模板中。

**输入**：
- **Timeout Expected**: 预期的超时设置
- **Remaining States**: 剩余状态

**输出**：
- **Timeout**: 仲裁后使用的超时设置（有剩余状态时为0，否则为预期值）

### Trim Both Whitespace.vi

从字符串开头、结尾或两者移除所有ASCII空白字符（空格、制表符、回车和换行）。

**输入**：
- **string**: 待处理字符串

**输出**：
- **trimmed string**: 处理后的字符串

### uuid.vi

根据标准方法生成**Universally Unique Identifier(UUID)**。

例如：59703F3AD837、106A470BA5EC、9B781DB313AF

**输入**：无

**输出**：
- **UUID**: 生成的UUID

### CSM - Broadcast Message Type.ctl

广播消息类型定义。

- **Interrupt**: 高优先级，作为中断
- **Status**: 普通优先级，作为消息

### CSM - Message Type.ctl

消息类型定义。

- **Async**: 异步消息（->）
- **Async without Reply**: 无返回异步消息（->|）
- **Sync**: 同步消息（-@）

### Global Log To String.vi

将全局日志转换为字符串。

**输入**：
- **Log**: 日志数据

**输出**：
- **String**: 字符串格式的日志

## API使用最佳实践

### 1. 消息构建

**推荐做法**：
- 使用`Build Message with Arguments++.vi`多态VI构建消息
- 自动检测版本根据输入自动确定消息类型
- 明确消息类型时使用特定版本提高性能

**示例**：
```
// 自动检测版本
Build Message with Arguments(Auto Check).vi
State with Arguments: "API: GetData"
Target Module: "DataProcessor"

// 特定版本（性能更好）
Build Synchronous Message with Arguments.vi
State with Arguments: "API: GetData"
Target Module: "DataProcessor"
```

### 2. 模块管理

**检查模块存在性**：
```
CSM - Check If Module Exists.vi
CSM Name: "TargetModule"
Exist?: TRUE/FALSE
```

**获取模块列表**：
```
CSM - List Modules.vi
Exclude Standalone CSM: TRUE
```

**获取模块状态**：
```
CSM - Module Status.vi
CSM Name: "MyModule"
// 返回：Mode, #As Worker, #msg to be processed
```

### 3. 消息发送

**同步消息**：
- 需要立即获得响应的场景
- 设置合理的超时时间
- 处理超时错误

```
CSM - Send Message and Wait for Reply.vi
Target CSM: "Server"
Message: "API: Calculate >> 100"
Response Timeout: 5000ms
```

**异步消息**：
- 不需要立即响应的场景
- 在"Async Response"状态处理响应
- 使用"Async Message Posted"跟踪发送状态

```
CSM - Post Message.vi
Target CSM: "Logger"
Message: "Log >> Info Message"
```

### 4. 状态订阅

**订阅模式选择**：
- **普通订阅**：订阅特定模块的特定状态
- **通配符订阅**：使用`*`订阅所有模块的特定状态
- **中断订阅**：用于高优先级状态通知

```
// 订阅特定模块的状态
CSM - Register State.vi
Source State: "DataReady@DataAcquisition"
Response Message: "Process Data"

// 订阅所有模块的错误状态
CSM - Register State.vi
Source State: "Error Occurred@*"
Response Message: "Error Handler"
```

### 5. 参数处理

**选择合适的参数格式**：
- **纯字符串**：简单数据，易于调试
- **HEXSTR**：小于4KB的数据结构
- **MassData**：大于4KB的数据（如图像、大数组）
- **API String**：可读配置参数

### 6. 错误处理

**统一错误处理流程**：
1. 捕获所有错误到"Error Handler"状态
2. 使用ERRSTR格式传递错误信息
3. 广播关键错误到所有模块
4. 记录错误到全局日志

### 7. 性能优化

**消息队列管理**：
- 避免消息堆积
- 合理设置`Dequeue Timeout`
- 使用高优先级队列处理紧急消息

**减少消息开销**：
- 批量处理而非逐个处理
- 使用MassData避免大数据序列化
- 缓存常用的VI引用

**超时设置**：
```
// 设置全局超时
CSM - Set TMO of Sync-Reply.vi
TMO: 5000ms

// 特定API使用自定义超时
Parse State Queue++.vi
Response Timeout: 10000ms
```

### 8. 调试技巧

**使用全局日志**：
```
CSM - Global Log.vi
CSM Name: "MyModule"
Message: "Processing started"
Arguments: "Parameter details"
```

**监控模块状态**：
```
CSM - Module Status.vi
#Elements In Queue: ?
// 如果持续增长，说明处理速度不足
```

**使用调试工具**：
- CSM Global Log Window：查看实时日志
- CSM State Dashboard：监控模块状态
- JKISM State Editor：设计和调试状态流程

### 9. 代码组织

**API设计规范**：
- 使用`API: `前缀标识公共API
- 使用描述性的API名称
- 在"Documentation"状态记录所有API

**状态命名规范**：
- 动词开头：`Initialize`, `Process`, `Update`
- 清晰的层次：`Data: Initialize`, `UI: Update`
- 避免缩写，保持可读性

### 10. 团队协作

**统一API约定**：
- 定义标准的消息格式
- 使用版本号管理API变更
- 文档化所有公共接口

**模块依赖管理**：
- 明确模块间的依赖关系
- 使用`CSM - Check If Module Exists.vi`检查依赖
- 实现优雅的降级机制

## 常见问题

### Q1: Parse State Queue++.vi中的Response Timeout设置为-2是什么意思？

`-2`表示使用全局超时设置。可以通过`CSM - Set TMO of Sync-Reply.vi`设置全局超时时间。这样可以统一管理所有模块的超时设置，便于调整和维护。

### Q2: 何时使用同步消息，何时使用异步消息？

- **同步消息（-@）**：需要立即获得响应的场景，如查询数据、执行计算
- **异步消息（->）**：不需要立即响应的场景，如日志记录、状态更新
- **异步无返回（->|）**：完全不需要响应的场景，如触发通知

### Q3: 如何处理消息超时？

1. 在Parse State Queue++.vi后检查当前状态
2. 如果状态为"Target Timeout Error"，实现重试或错误报告逻辑
3. 考虑增加超时时间或优化目标模块的响应速度
4. 记录超时事件到日志以便分析

### Q4: MassData和HEXSTR如何选择？

- **HEXSTR**：小于4KB的数据，简单数据结构
- **MassData**：大于4KB的数据，如图像、大数组
- **性能**：MassData通过共享内存避免数据复制，大数据场景性能更好
- **易用性**：HEXSTR更简单，不需要额外的缓冲区管理

### Q5: 如何避免消息队列堵塞？

1. **设计**：避免在状态中执行耗时操作，将耗时操作移到独立的子模块
2. **监控**：使用`CSM - Module Status.vi`监控队列长度
3. **优先级**：使用高优先级队列处理紧急消息
4. **过滤**：在必要时使用消息过滤避免处理不必要的消息
5. **分工**：使用协作者模式将负载分散到多个工作者

### Q6: 协作者模式和责任链模式有什么区别？

- **协作者模式（Worker Mode）**：
  - 多个工作者共享一个消息队列
  - 任意一个空闲的工作者处理消息
  - 用于负载均衡，提高吞吐量
  
- **责任链模式（Chain of Responsibility）**：
  - 消息按优先级顺序传递给节点
  - 节点可以处理或传递给下一个节点
  - 用于多级处理、验证、过滤等场景

### Q7: 如何实现模块的优雅关闭？

1. 设计专门的关闭API：`API: Shutdown`
2. 在关闭API中执行清理操作
3. 发送`Macro: Exit`状态退出主循环
4. 在`Data: Cleanup`中释放所有资源
5. 考虑通知依赖此模块的其他模块

### Q8: 为什么不建议使用CSM - Flush Queue.vi？

清空队列会丢失消息，可能导致：
- 同步调用者永远等待响应
- 重要的状态变化被忽略
- 系统行为不可预测

**更好的做法**：
- 通过设计避免消息堆积
- 使用消息过滤而非清空队列
- 优化模块处理速度

## 参考资源

### 相关文档

- [CSM开发模板](/2024/01/08/csm-templates.html) - 详细的模板使用指南
- [CSM基本概念](/2023/12/28/concepts.html) - 理解CSM的核心概念
- [CSM模块间通讯](/2023/12/29/communication.html) - 通讯机制详解
- [创建CSM复用模块](/2023/12/30/basic.html) - 模块开发指南
- [CSM高级模式](/2023/12/31/advance.html) - 协作者、责任链等高级特性
- [CSM插件机制](/2024/01/02/csm-plugin-system.html) - Addon和Template开发
- [CSM调试工具](/2024/01/03/csm-Tools.html) - 调试和开发工具
- [CSM全局日志](/2024/01/04/csm-global-log.html) - 日志系统详解

### 外部资源

- [CSM GitHub仓库](https://github.com/NEVSTOP-LAB/Communicable-State-Machine)
- [CSM示例项目](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/tree/main/examples)
- [JKI State Machine文档](http://jki.net/state-machine/)
- [NEVSTOP-LAB主页](https://github.com/NEVSTOP-LAB)

### API速查表

#### 消息构建

| VI | 用途 | 消息符号 |
|----|------|----------|
| Build Synchronous Message | 同步消息 | -@ |
| Build Asynchronous Message | 异步消息 | -> |
| Build No-Reply Async Message | 异步无返回 | ->\| |
| Build Status Broadcast | 状态广播 | -><all> |
| Build Interrupt Broadcast | 中断广播 | -><interrupt> |

#### 模块管理

| VI | 用途 |
|----|------|
| CSM - List Modules | 列出所有活动模块 |
| CSM - Check If Module Exists | 检查模块是否存在 |
| CSM - Module Status | 获取模块状态和队列信息 |
| CSM - Module VI Reference | 获取模块VI引用 |
| CSM - Set TMO of Sync-Reply | 设置全局超时时间 |

#### 消息发送

| VI | 用途 | 是否等待 |
|----|------|----------|
| Send Message and Wait for Reply | 发送同步消息 | 是 |
| Post Message | 发送异步消息 | 否 |
| Wait for Module | 等待模块启动 | 是 |
| Start Async Call | 异步启动模块 | 否 |

#### 状态订阅

| VI | 用途 |
|----|------|
| Register State | 注册状态订阅 |
| Unregister State | 注销状态订阅 |
| Register with Broadcast | 批量注册订阅 |
| Unregister All | 注销所有订阅 |

#### 参数处理

| VI | 支持格式 |
|----|----------|
| HEXSTR Converter | Cluster、数组等 |
| ERRSTR Converter | 错误簇 |
| SAFESTR Converter | 特殊字符字符串 |
| MassData Converter | 大数据 |
| API String Converter | 可读参数 |

## 总结

CSM API提供了完整的函数接口，用于构建模块化、可通讯的LabVIEW应用。通过合理使用这些API，可以实现：

1. **模块化设计**：清晰的模块边界和接口
2. **灵活通讯**：同步、异步、广播等多种通讯方式
3. **可扩展性**：通过Addon和插件扩展功能
4. **易于调试**：完善的日志和调试工具
5. **高性能**：优化的消息传递和内存管理

### 关键要点

- 使用`Parse State Queue++.vi`作为CSM核心
- 通过`Build Message with Arguments++.vi`构建规范的消息
- 合理选择同步和异步通讯方式
- 利用状态订阅实现松耦合设计
- 使用全局日志系统进行调试和监控
- 遵循API使用最佳实践确保代码质量

### 下一步

- 深入学习[CSM高级模式](/2023/12/31/advance.html)
- 探索[CSM插件机制](/2024/01/02/csm-plugin-system.html)
- 实践[创建CSM复用模块](/2023/12/30/basic.html)
- 使用[CSM调试工具](/2024/01/03/csm-Tools.html)优化开发流程

通过系统学习和实践，您将能够充分发挥CSM的强大功能，构建高质量的LabVIEW应用！
