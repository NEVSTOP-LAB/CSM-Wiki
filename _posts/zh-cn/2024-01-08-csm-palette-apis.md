---
title: CSM 函数面板
author: nevstop
date: 2024-01-08
layout: post
lang: zh-cn
page_id: CSM-Palette-APIs
toc: true
# cover: assets/img/CSM%20Palette.png
---

_**CSM 函数面板**_

![csm-palette](https://nevstop-lab.github.io/CSM-Wiki/assets/img/CSM%20Palette.png)

<!-- CSM API 介绍:
[English](src/help/NEVSTOP/Communicable%20State%20Machine(CSM)/VI%20Description(EN).md) | [中文](src/help/NEVSTOP/Communicable%20State%20Machine(CSM)/VI%20Description(CN).md) -->

# CSM API参考手册

## 概述

CSM（Communicable State Machine）提供了一套完整的API函数面板，用于实现模块间通讯、状态管理、参数处理等功能。本文档详细介绍所有CSM API的功能、参数和使用方法。

### API分类

CSM API按功能分为以下几大类：

1. **模板面板（Template Palette）**
   - 用于创建CSM模块的各种模板
   - 包括无事件结构、带事件结构、DQMH风格等

2. **核心功能（Core Functions）**
   - Parse State Queue++.vi：状态队列解析
   - Build Message系列：消息构建API

3. **参数处理（Arguments）**
   - 各类参数编码解码API
   - HEXSTR、ERRSTR、SAFESTR等格式支持

4. **管理接口（Management API）**
   - 模块存在检查、列表查询
   - 模块状态获取、超时设置

5. **模块操作（Module Operation API）**
   - 消息发送和等待API
   - 异步启动、同步调用

6. **广播管理（Broadcast Registration）**
   - 状态订阅和注销
   - 广播注册管理

7. **全局日志（Global Log）**
   - 日志记录和获取
   - 日志过滤和订阅

8. **高级模式（Advanced Modes）**
   - 协作者模式API
   - 责任链模式API

9. **调试工具（Debug & Tools）**
   - 调试辅助工具
   - 开发支持VI

10. **实用工具（Utility VIs）**
    - 字符串处理
    - 队列操作等辅助功能

### 使用说明

#### 关于消息拼接API

> **注意**：消息拼接API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

#### 关于CSM状态队列操作API

> **注意**：该类型API不会直接发送消息，只是拼接消息字符串。在Parse State Queue++.vi中发送消息、执行操作。与消息拼接API不同的是，此类API会包含CSM的状态队列字符串输入，相当于在状态队列中插入消息。

### API快速参考

以下是最常用的CSM API及其用途：

| API | 用途 | 分类 |
|-----|------|------|
| Parse State Queue++.vi | 解析状态队列，CSM核心 | 核心功能 |
| Build Message with Arguments++.vi | 构建消息字符串（多态VI） | 核心功能 |
| CSM - Send Message and Wait for Reply.vi | 发送同步消息并等待响应 | 模块操作 |
| CSM - Post Message.vi | 发送异步消息 | 模块操作 |
| CSM - List Modules.vi | 列出所有活动模块 | 管理接口 |
| CSM - Check If Module Exists.vi | 检查模块是否存在 | 管理接口 |
| CSM - Register State.vi | 注册状态订阅 | 广播管理 |
| CSM - Unregister State.vi | 注销状态订阅 | 广播管理 |

## 模板面板（Template Palette）

模板面板提供了创建CSM模块所需的各种模板，详细说明请参考[CSM开发模板](/2024/01/08/csm-templates.html)文档。

### CSM - No-Event Structure Template.vi

用于创建具有无用户界面的 CSM 模块的模板

<b>输入控件:</b>

- <b>Name("" to use uuid)</b>: CSM 模块名称
  - 如果输入为 ""，将使用 UUID 作为模块名称。该模块被标记为独立模式，不会包含在模块列表中。
  - 如果输入以 '#' 结尾，则该模块将在工作模式下运行。具有相同名称的模块将共享同一消息队列。任何外部消息将由其中一个模块处理，取决于哪个模块空闲。
  - 否则，输入字符串将被用作模块名称，该名称应在系统中保持唯一。如果在系统中使用重复的模块名称，CSM 将进入 "Critical Error" 状态。

<b>输出控件:</b>

- 无

### CSM - With Event Structure Template.vi

用于创建具有用户界面的 CSM 模块的模板，模板中包含用户事件结构用于响应用户操作。

<b>输入控件:</b>

- <b>Name("" to use uuid)</b>: CSM 模块名称
  - 如果输入为 ""，将使用 UUID 作为模块名称。该模块被标记为独立模式，不会包含在模块列表中。
  - 如果输入以 '#' 结尾，则该模块将在工作模式下运行。具有相同名称的模块将共享同一消息队列。任何外部消息将由其中一个模块处理，取决于哪个模块空闲。
  - 否则，输入字符串将被用作模块名称，该名称应在系统中保持唯一。如果在系统中使用重复的模块名称，CSM 将进入 "Critical Error" 状态。

<b>输出控件:</b>

- 无

### CSM - With Event Structure Template - Tiny.vi

用于创建具有用户界面的 CSM 模块的模板，模板中包含用户事件结构用于响应用户操作。此模板的代码比较紧凑。

<b>输入控件:</b>

- <b>Name("" to use uuid)</b>: CSM 模块名称
  - 如果输入为 ""，将使用 UUID 作为模块名称。该模块被标记为独立模式，不会包含在模块列表中。
  - 如果输入以 '#' 结尾，则该模块将在工作模式下运行。具有相同名称的模块将共享同一消息队列。任何外部消息将由其中一个模块处理，取决于哪个模块空闲。
  - 否则，输入字符串将被用作模块名称，该名称应在系统中保持唯一。如果在系统中使用重复的模块名称，CSM 将进入 "Critical Error" 状态。

<b>输出控件:</b>

- 无

### Parse State Queue++.vi

解析JKI状态机状态队列，返回将执行的下一个当前状态、参数等信息。

<b>输入控件:</b>

- <b>State Queue</b>: 整个状态队列被连接到此输入。这应该来自 CSM 的移位寄存器。
- <b>Error In (no error)</b>: 来自JKI状态机的错误簇被连接到此输入。如果发生错误并出现在此输入上，则当前状态输出将返回 "Error Handler" 状态。
- <b>Name("" to use uuid)</b>: CSM 模块名称
  - 如果输入为 ""，将使用 UUID 作为模块名称。该模块被标记为独立模式，不会包含在模块列表中。
  - 如果输入以 '#' 结尾，则该模块将在工作模式下运行。具有相同名称的模块将共享同一消息队列。任何外部消息将由其中一个模块处理，取决于哪个模块空闲。
  - 否则，输入字符串将被用作模块名称，该名称应在系统中保持唯一。如果在系统中使用重复的模块名称，CSM 将进入 "Critical Error" 状态。
- <b>Response Timeout(5000ms)</b>:同步调用时的响应超时设置，默认 5000 ms.
- <b>Dequeue Timeout(0ms)</b>: 检查 CSM 消息队列的超时设置，默认为0，不进行等待。
- <b>Response Arguments</b>: 来自上一个状态的响应参数。它应该来连接 CSM 的移位寄存器，用于传递外部调用的返回值。

<b>输出控件:</b>

- <b>Remaining States</b>:  返回继续执行的所有状态及参数。 These should be passed through the current state in the state machine. These can also be modified or augmented within the current state if necessary.
- <b>Arguments</b>: 返回可能在当前状态字符串中使用的任何参数。这些参数位于“>>”字符之后。<b>注意：</b>参数变量不得包含任何不可打印的字符，比如换行符或回车符。
- <b>Current State</b>: 将执行的下一个当前状态
- <b>Name Used</b>: 分配给此CSM模块的实际名称
- <b>Argument - State</b>: 如果是 CSM 定义的内置状态，此参数表示此状态的前状态
- <b>From Who</b>: 如果<b>Current State</b> 是由外部发送的，则这是源CSM模块名称。

### Build State String with Arguments++.vi

构建一个包含JKI状态机参数的状态字符串。

<B>例如:</B>

发送给本地状态机时, <b>Target Module ("")</b> 应该为空.

      If State = A 并且没有参数, 那么 <b>State with Arguments</b> = A
      If State = A , Arguments = B 那么 <b>State with Arguments</b> = A >> B

在发送给其他CSM的情况下, 假设 <b>Target Module ("")</b> 的名称是 "Target"

- 同步调用，发送的消息后等待返回:

         If State = A 并且没有参数, 那么 <b>State with Arguments</b> = A -@target
         If State = A , Arguments = B 那么 <b>State with Arguments</b> = A >> B -@target

- 异步调用，发送消息后，将进入"Async Message Posted" 状态，当外部模块处理完毕后，本地模块将收到 "Async Response" 消息:

         If State = A 并且没有参数, 那么 <b>State with Arguments</b> = A ->target
         If State = A , Arguments = B 那么 <b>State with Arguments</b> = A >> B ->target

<b>输入控件:</b>

- <b>State</b>: 状态或消息名称字符串
- <b>Arguments ("")</b>: <b>State</b> 的参数
- <b>Target Module ("")</b>: 此消息发送的目标 CSM 模块名称
- <b>Sync-Call(-@) T By Default/Async-Call(->) F</b>: 同步调用输入"TRUE"; 异步调用输入"FALSE"

<b>输出控件:</b>

- <b>State with Arguments</b>: 包含 JKI 状态机状态、参数等信息的字符串

### Build Message with Arguments++.vi

Builds a message that contains arguments for CSM. This VI will parse "State with Arguments" for message type, message string, arguments and target module from input <b>State with Arguments</b> and replace corresponding parts in the message with input values. Different message type symbol(->\|,->,-@) will be used in different Polymorphic Vi instance.

Polymorphic Option:

- Build Message with Arguments(Auto Check).vi
- Build Asynchronous Message with Arguments.vi
- Build No-Reply Asynchronous Message with Arguments.vi
- Build Synchronous Message with Arguments.vi

<b>Inputs:</b>

- <b>State with Arguments</b>: Input Message which might contain Arguments or target Module
- <b>Arguments ("")</b>: The arguments which will be used to replace arguments in <b>State with Arguments</b>. if empty, no arguments will be included in output strings.
- <b>Target Module ("")</b>: The target which will be used to replace target in <b>State with Arguments</b>. if empty, target in <b>State with Arguments</b> will be used.

<b>Outputs:</b>

- <b>State with Arguments</b>: String stands for state with arguments

<b>Inputs:</b>

<b>Outputs:</b>

#### Build Message with Arguments(Auto Check).vi

Builds a message that contains arguments for CSM. This VI will parse "State with Arguments" for message type, message string, arguments and target module from input <b>State with Arguments</b> and replace corresponding parts in the message with input values. The message type from input <b>State with Arguments</b> will be used.

<B>For Example:</B>

If <b>State with Arguments</b> input is "API: DoSth"
<b>Arguments ("")</b> input is "Arguments"
<b>Target Module ("")</b> input is "Callee"
Then result string is "API: DoSth >> Arguments" as no message symbol is detected.

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is ""
Then result string is "API: DoSth >> NewArguments -> Callee"

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is "NewCallee"
Then result string is "API: DoSth >> NewArguments -> NewCallee"

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is ""
<b>Target Module ("")</b> input is "NewCallee"
Then result string is "API: DoSth -> NewCallee"

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -@ Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is ""
Then result string is "API: DoSth >> NewArguments -@ Callee"

<b>Inputs:</b>

- <b>State with Arguments</b>: Input Message which might contain Arguments or target Module
- <b>Arguments ("")</b>: The arguments which will be used to replace arguments in <b>State with Arguments</b>. if empty, no arguments will be included in output strings.
- <b>Target Module ("")</b>: The target which will be used to replace target in <b>State with Arguments</b>. if empty, target in <b>State with Arguments</b> will be used.

<b>Outputs:</b>

- <b>State with Arguments</b>: String stands for state with arguments

#### Build Asynchronous Message with Arguments.vi

Builds a message that contains arguments for CSM. This VI will parse "State with Arguments" for message string, arguments and target module from input <b>State with Arguments</b> and replace corresponding parts in the message with input values with async-message symbol "->" if <b>Target Module ("")</b> is specified.

<B>For Example:</B>

If <b>State with Arguments</b> input is "API: DoSth"
<b>Arguments ("")</b> input is "Arguments"
<b>Target Module ("")</b> input is "Callee"
Then result string is "API: DoSth >> Arguments -> Callee". It's different with Build Message with Arguments(Auto Check).vi. . Message Type Symbol is replaced with "->".

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is ""
Then result string is "API: DoSth >> NewArguments -> Callee"

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is "NewCallee"
Then result string is "API: DoSth >> NewArguments -> NewCallee"

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is ""
<b>Target Module ("")</b> input is "NewCallee"
Then result string is "API: DoSth -> NewCallee"

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -@ Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is ""
Then result string is "API: DoSth >> NewArguments -> Callee". Message Type Symbol is replaced with "->".

<b>Inputs:</b>

- <b>State with Arguments</b>: Input Message which might contain Arguments or target Module
- <b>Arguments ("")</b>: The arguments which will be used to replace arguments in <b>State with Arguments</b>. if empty, no arguments will be included in output strings.
- <b>Target Module ("")</b>: The target which will be used to replace target in <b>State with Arguments</b>. if empty, target in <b>State with Arguments</b> will be used.

<b>Outputs:</b>

- <b>State with Arguments</b>: String stands for state with arguments

#### Build No-Reply Asynchronous Message with Arguments.vi

Builds a message that contains arguments for CSM. This VI will parse "State with Arguments" for message string, arguments and target module from input <b>State with Arguments</b> and replace corresponding parts in the message with input values with No-Reply async-message symbol "->\|" if <b>Target Module ("")</b> is specified.

<B>For Example:</B>

If <b>State with Arguments</b> input is "API: DoSth"
<b>Arguments ("")</b> input is "Arguments"
<b>Target Module ("")</b> input is "Callee"
Then result string is "API: DoSth >> Arguments ->\| Callee". It's different with Build Message with Arguments(Auto Check).vi. Message Type Symbol is replaced with "->\|".

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is ""
Then result string is "API: DoSth >> NewArguments ->\| Callee". Message Type Symbol is replaced with "->\|".

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is "NewCallee"
Then result string is "API: DoSth >> NewArguments ->\| NewCallee". Message Type Symbol is replaced with "->\|".

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is ""
<b>Target Module ("")</b> input is "NewCallee"
Then result string is "API: DoSth ->\| NewCallee". Message Type Symbol is replaced with "->\|".

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -@ Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is ""
Then result string is "API: DoSth >> NewArguments ->\| Callee". Message Type Symbol is replaced with "->\|".

<b>Inputs:</b>

- <b>State with Arguments</b>: Input Message which might contain Arguments or target Module
- <b>Arguments ("")</b>: The arguments which will be used to replace arguments in <b>State with Arguments</b>. if empty, no arguments will be included in output strings.
- <b>Target Module ("")</b>: The target which will be used to replace target in <b>State with Arguments</b>. if empty, target in <b>State with Arguments</b> will be used.

<b>Outputs:</b>

- <b>State with Arguments</b>: String stands for state with arguments

#### Build Synchronous Message with Arguments.vi

Builds a message that contains arguments for CSM. This VI will parse "State with Arguments" for message string, arguments and target module from input <b>State with Arguments</b> and replace corresponding parts in the message with input values with sync-message symbol "-@" if <b>Target Module ("")</b> is specified.

<B>For Example:</B>

If <b>State with Arguments</b> input is "API: DoSth"
<b>Arguments ("")</b> input is "Arguments"
<b>Target Module ("")</b> input is "Callee"
Then result string is "API: DoSth >> Arguments ->\| Callee". It's different with Build Message with Arguments(Auto Check).vi. Message Type Symbol is replaced with "-@".

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is ""
Then result string is "API: DoSth >> NewArguments ->\| Callee". Message Type Symbol is replaced with "-@".

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is "NewCallee"
Then result string is "API: DoSth >> NewArguments -@ NewCallee". Message Type Symbol is replaced with "-@".

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
<b>Arguments ("")</b> input is ""
<b>Target Module ("")</b> input is "NewCallee"
Then result string is "API: DoSth -@ NewCallee". Message Type Symbol is replaced with "-@".

If <b>State with Arguments</b> input is "API: DoSth >> Arguments -@ Callee"
<b>Arguments ("")</b> input is "NewArguments"
<b>Target Module ("")</b> input is ""
Then result string is "API: DoSth >> NewArguments -@ Callee".

<b>Inputs:</b>

- <b>State with Arguments</b>: Input Message which might contain Arguments or target Module
- <b>Arguments ("")</b>: The arguments which will be used to replace arguments in <b>State with Arguments</b>. if empty, no arguments will be included in output strings.
- <b>Target Module ("")</b>: The target which will be used to replace target in <b>State with Arguments</b>. if empty, target in <b>State with Arguments</b> will be used.

<b>Outputs:</b>

- <b>State with Arguments</b>: String stands for state with arguments

#### Build Interrupt Status Message.vi

Builds a message that contains arguments for CSM. This VI will parse "State with Arguments" for message type, message string, arguments and target module from input <b>State with Arguments</b> and replace corresponding parts in the message with input values. The message type from input <b>State with Arguments</b> will be used.
<B>For Example:</B>
If <b>State with Arguments</b> input is "API: DoSth"
Then result string is "API: DoSth >> Arguments" as no message symbol is detected.
If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
Then result string is "API: DoSth >> NewArguments -> Callee"
If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
Then result string is "API: DoSth >> NewArguments -> NewCallee"
If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
Then result string is "API: DoSth -> NewCallee"
If <b>State with Arguments</b> input is "API: DoSth >> Arguments -@ Callee"
Then result string is "API: DoSth >> NewArguments -@ Callee"

- <b>State with Arguments</b>: Input Message which might contain Arguments or target Module
- <b>Arguments ("")</b>: The arguments which will be used to replace arguments in <b>State with Arguments</b>. if empty, no arguments will be included in output strings.
- <b>Target Module ("")</b>: The target which will be used to replace target in <b>State with Arguments</b>. if empty, target in <b>State with Arguments</b> will be used.
- <b>State with Arguments</b>: String stands for state with arguments

<b>Inputs:</b>

- <b>State with Arguments</b>:
- <b>Arguments ("")</b>:

<b>Outputs:</b>

- <b>State with Arguments</b>:

#### Build Normal Status Message.vi

Builds a message that contains arguments for CSM. This VI will parse "State with Arguments" for message type, message string, arguments and target module from input <b>State with Arguments</b> and replace corresponding parts in the message with input values. The message type from input <b>State with Arguments</b> will be used.
<B>For Example:</B>
If <b>State with Arguments</b> input is "API: DoSth"
Then result string is "API: DoSth >> Arguments" as no message symbol is detected.
If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
Then result string is "API: DoSth >> NewArguments -> Callee"
If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
Then result string is "API: DoSth >> NewArguments -> NewCallee"
If <b>State with Arguments</b> input is "API: DoSth >> Arguments -> Callee"
Then result string is "API: DoSth -> NewCallee"
If <b>State with Arguments</b> input is "API: DoSth >> Arguments -@ Callee"
Then result string is "API: DoSth >> NewArguments -@ Callee"

- <b>State with Arguments</b>: Input Message which might contain Arguments or target Module
- <b>Arguments ("")</b>: The arguments which will be used to replace arguments in <b>State with Arguments</b>. if empty, no arguments will be included in output strings.
- <b>Target Module ("")</b>: The target which will be used to replace target in <b>State with Arguments</b>. if empty, target in <b>State with Arguments</b> will be used.
- <b>State with Arguments</b>: String stands for state with arguments

<b>Inputs:</b>

- <b>State with Arguments</b>:
- <b>Arguments ("")</b>:

<b>Outputs:</b>

- <b>State with Arguments</b>:

#### Build Register Status Message.vi

Builds register status message. The message looks like:
[source-state]@[source-module] >> [response-message]@[response-module] -><register>
For examples:
DownloadFinished@Downloader >> StartPlay@Player -><register>
DownloadFinished@Downloader >> StartPlay -><register> // response-module is current module
DownloadFinished@Downloader  -><register> // response-module is current module. response-message is DownloadFinished
DownloadFinished@* >> StartPlay@Player -><register> // Any Module's DownloadFinished is registered to Player's StartPlay state.

<b>Inputs:</b>

- <b>Source CSM Name (* as Default)</b>:
- <b>CSM Name</b>:
- <b>Status</b>:
- <b>Response Message (if "", same as Source Message)</b>:

<b>Outputs:</b>

- <b>State with Arguments</b>:

#### Build Unregister Status Message.vi

Builds unregister status message. The message looks like:
[source-state]@[source-module] >> [response-module] -><unregister>
For examples:
DownloadFinished@Downloader >> StartPlay -><unregister>
DownloadFinished@Downloader  -><unregister>

<b>Inputs:</b>

- <b>Source CSM Name (* as Default)</b>:
- <b>CSM Name</b>:
- <b>Status</b>:

<b>Outputs:</b>

- <b>State with Arguments</b>:

### Add State(s) to Queue By BOOL++.vi

根据高优先级和Bool输入，此VI生成TRUE/False和剩余状态的连接状态。High Priority输入决定是否在剩余状态之前或之后连接TRUE或False字符串。Bool输入决定要连接的字符串是TRUE还是False。

<b>Inputs:</b>

- <b>State Queue("")</b>: 整个状态队列被连接到此输入
- <b>TRUE("")</b>: <b>Bool</b> 为 True 时插入的状态字符串
- <b>False("")</b>: <b>Bool</b> 为 False 时插入的状态字符串
- <b>Bool</b>: 选择连接到TRUE终端或False终端的状态字符串的标志。
- <b>High Priority(FALSE)</b>: 如果为True，状态将被插入到<b>State Queue("")</b>的顶部。如果为False，它被附加到尾部。

<b>Outputs:</b>

- <b>State Queue Out</b>: 返回继续执行的所有状态及参数。

#### Add State(s) to Queue By BOOL(Element).vi

根据高优先级和Bool输入，此VI生成TRUE/False和剩余状态的连接状态。High Priority输入决定是否在剩余状态之前或之后连接TRUE或False字符串。Bool输入决定要连接的字符串是TRUE还是False。

<b>Inputs:</b>

- <b>State Queue("")</b>: 整个状态队列被连接到此输入
- <b>TRUE("")</b>: <b>Bool</b> 为 True 时插入的状态字符串
- <b>False("")</b>: <b>Bool</b> 为 False 时插入的状态字符串
- <b>Bool</b>: 选择连接到TRUE终端或False终端的状态字符串的标志。
- <b>High Priority(FALSE)</b>: 如果为True，状态将被插入到<b>State Queue("")</b>的顶部。如果为False，它被附加到尾部。

<b>Outputs:</b>

- <b>State Queue Out</b>: 返回继续执行的所有状态及参数。

#### Add State(s) to Queue By BOOL(Array Left).vi

根据高优先级和Bool输入，此VI生成TRUE/False和剩余状态的连接状态。High Priority输入决定是否在剩余状态之前或之后连接TRUE或False字符串。Bool输入决定要连接的字符串是TRUE还是False。

<b>Inputs:</b>

- <b>State Queue("")</b>: 整个状态队列被连接到此输入
- <b>TRUE("")</b>: <b>Bool</b> 为 True 时插入的状态字符串
- <b>False("")</b>: <b>Bool</b> 为 False 时插入的状态字符串
- <b>Bool</b>: 选择连接到TRUE终端或False终端的状态字符串的标志。
- <b>High Priority(FALSE)</b>: 如果为True，状态将被插入到<b>State Queue("")</b>的顶部。如果为False，它被附加到尾部。

<b>Outputs:</b>

- <b>State Queue Out</b>: 返回继续执行的所有状态及参数。

#### Add State(s) to Queue By BOOL(Array Right).vi

根据高优先级和Bool输入，此VI生成TRUE/False和剩余状态的连接状态。High Priority输入决定是否在剩余状态之前或之后连接TRUE或False字符串。Bool输入决定要连接的字符串是TRUE还是False。

<b>Inputs:</b>

- <b>State Queue("")</b>: 整个状态队列被连接到此输入
- <b>TRUE("")</b>: <b>Bool</b> 为 True 时插入的状态字符串
- <b>False("")</b>: <b>Bool</b> 为 False 时插入的状态字符串
- <b>Bool</b>: 选择连接到TRUE终端或False终端的状态字符串的标志。
- <b>High Priority(FALSE)</b>: 如果为True，状态将被插入到<b>State Queue("")</b>的顶部。如果为False，它被附加到尾部。

<b>Outputs:</b>

- <b>State Queue Out</b>: 返回继续执行的所有状态及参数。

#### Add State(s) to Queue By BOOL(Array All).vi

根据高优先级和Bool输入，此VI生成TRUE/False和剩余状态的连接状态。High Priority输入决定是否在剩余状态之前或之后连接TRUE或False字符串。Bool输入决定要连接的字符串是TRUE还是False。

<b>Inputs:</b>

- <b>State Queue("")</b>: 整个状态队列被连接到此输入
- <b>TRUE("")</b>: <b>Bool</b> 为 True 时插入的状态字符串
- <b>False("")</b>: <b>Bool</b> 为 False 时插入的状态字符串
- <b>Bool</b>: 选择连接到TRUE终端或False终端的状态字符串的标志。
- <b>High Priority(FALSE)</b>: 如果为True，状态将被插入到<b>State Queue("")</b>的顶部。如果为False，它被附加到尾部。

<b>Outputs:</b>

- <b>State Queue Out</b>: 返回继续执行的所有状态及参数。

### CSM - Broadcast Status Change.vi

向系统广播状态更改。已注册状态的 CSM 模块将接收到状态更改。

<b>输入控件:</b>

- <b>Status with Arguments</b>: 将被广播的状态及参数
- <b>State Queue("")</b>: 整个状态队列被连接到此输入
- <b>Broadcast(T)</b>: 控制是否广播的开关输入

<b>输出控件:</b>

- <b>Remaining States</b>: 返回继续执行的所有状态及参数。

## Arguments

### CSM - Make String Arguments Safe.vi

'->','->\|','-@','-&','<-" 是关键字，不能出现在参数中。使用此 VI 保证参数安全。

<b>Inputs:</b>

- <b>Argument String</b>: 可能包含关键字的参数 '->','->\|','-@','-&','<-".

<b>Outputs:</b>

- <b>Safe Argument String</b>: 安全参数

### CSM - Revert Arguments-Safe String.vi

'->','->\|','-@','-&','<-" 是关键字，不能出现在参数中。使用<b>CSM Make String Arguments Safe.vi</b>保证参数安全。此VI用于将安全参数转换为原始参数。

<b>Inputs:</b>

- <b>Safe Argument String</b>: 安全参数

<b>Outputs:</b>

- <b>Origin Argument String</b>: 可能包含关键字的参数 '->','->\|','-@','-&','<-".

### CSM - Convert Data to HexStr.vi

将复杂参数（变体）转换为十六进制字符串，该字符串可以安全地用作状态参数，而不会破坏字符串队列逻辑。

<b>输入控件:</b>

- <b>Variant</b>: 数据，保存为变体(variant)格式

<b>输出控件:</b>

- <b>HEX String (0-9,A-F)</b>: Hex字符串格式，不包含不可见字符，符合 CSM 的参数要求

### CSM - Convert HexStr to Data.vi

将十六进制字符串参数转换回变体数据。

<b>输入控件:</b>

- <b>HEX String</b>: Hex字符串格式，不包含不可见字符，符合 CSM 的参数要求

<b>输出控件:</b>

- <b>Variant</b>: 数据，保存为变体(variant)格式
- <b>error out</b>: 错误簇

## Advance APIs

### CSM - Start Async Call.vi

异步调用模板代码的VI片段

<b>输入控件:</b>

- 无

<b>输出控件:</b>

- 无

### CSM - Synchronized Call.vi

同步调用模板代码的VI片段

<b>输入控件:</b>

- 无
 -

<b>输出控件:</b>

 - 无

### CSM - Mark As Worker Module.vi

在CSM名称后添加“＃”，以标记此模块为工作者，其与具有相同名称的其他工作者共享相同的消息队列。一个带有生成的UUID的实际名称将被分配给此CSM模块。

<b>输入控件:</b>

 - <b>CSM Name</b>: CSM 模块名称

<b>输出控件:</b>

 - <b>CSM Name(marked as worker)</b>: 添加“＃”标记 的CSM 模块名称

### CSM - Compact Multiple States.vi

将多个状态紧凑成单个字符串以供输入使用

<b>输入控件:</b>

 - <b>States in Lines</b>: 多个状态的字符串数组

<b>输出控件:</b>

 - <b>States</b>: 包含所有输入状态的字符串

### CSM - Check If Module Exists.vi

检查 CSM 模块是否存在

<b>输入控件:</b>

 - <b>CSM Name</b>: CSM 模块名称
 - <b>Error in</b>: 错误簇

<b>输出控件:</b>

 - <b>Exist?</b>: 返回模式是否存在，存在返回True，不存在返回False
 - <b>CSM Name(dup)</b>: 返回 <b>CSM Name</b>
 - <b>Error out</b>: 错误簇

### CSM - List Modules.vi

列出系统中所有活动的CSM模块。

<b>输入控件:</b>

 - <b>Exclude Standalone CSM(T)</b>: 是否包含独立工作模式的模块
 - <b>Error in</b>: 错误簇

<b>输出控件:</b>

 - <b>Module Names</b>: 模块名称列表
 - <b>Error out</b>: 错误簇

### CSM - Module Status.vi

获取CSM模块的状态

<b>输入控件:</b>

 - <b>CSM Name</b>: CSM 模块名称.
 - <b>Error in</b>: 错误簇

<b>输出控件:</b>

 - <b>Mode</b>: 返回模块的工作模式："Stand-alone", "CSM" 或 "Action Worker".
 - <b>#As Worker</b>: 工作者模式下，此模块的工作者数量
 - <b>#msg to be processed</b>: CSM消息队列中的待处理消息个数
 - <b>CSM Name(dup)</b>: 返回 <b>CSM Name</b>
 - <b>Error out</b>: 错误簇

### CSM - Register Status Change.vi

注册以接收其他CSM模块状态更改的通知。如果未连接 “Response Message” 或输入为空，则将使用相同的<b>Status</b> 名称作为响应消息。

<b>输入控件:</b>

 - <b>CSM Name</b>: CSM 模块名称.
 - <b>Source CSM Name (* as Default)</b>: 生成状态的CSM模块。您可以使用“*”来表示所有生成相同状态的模块。
 - <b>Status</b>: 状态字符串
 - <b>Response Message (if "", same as Source Message)</b>: 注册后，如果状态发生变化，将接收到此消息。
 - <b>Priority(T:As Status,F:As Interrupt)</b>: 如果响应消息为False，则将其插入到状态队列的前面；否则，将其附加到队列的尾部。
 - <b>Error in</b>: 错误簇

<b>输出控件:</b>

 - <b>CSM Name(dup)</b>: 返回 <b>CSM Name</b>
 - <b>Error out</b>: 错误簇

### CSM - Unregister Status Change.vi

取消注册其他 CSM 模块状态更改的通知。

<b>输入控件:</b>

 - <b>CSM Name</b>: CSM 模块名称.
 - <b>Source CSM Name</b>: 生成状态的CSM模块。您可以使用“*”来表示所有生成相同状态的模块。
 - <b>Status</b>: 状态字符串
 - <b>Error in</b>: 错误簇

<b>输出控件:</b>

 - <b>CSM Name(dup)</b>: 返回 <b>CSM Name</b>
 - <b>Error out</b>: 错误簇

### CSM - Get New State Notifier Event.vi

<b>输入控件:</b>

 - <b>Name("" to use uuid) in</b>: CSM 模块名称
 - <b>Error in</b>: 错误簇

<b>输出控件:</b>

 - <b>New State Notifier Event</b>: 用户事件句柄，用来当收到消息时，使用CSM模块中断在事件结构中的等待
 - <b>Error out</b>: 错误簇

## Non-CSM Support

### CSM - Post Message.vi

向指定的CSM发布一条消息，相当于异步调用，但不等待返回参数。

<b>输入控件:</b>

 - <b>Target Module</b>:目标 CSM 模块名称
 - <b>State</b>: 消息字符串
 - <b>Arguments ("")</b>: 消息参数
 - <b>Error In (no error)</b>: 错误簇

<b>输出控件:</b>

 - <b>error out</b>: 错误簇

### CSM - Send Message and Wait for Reply.vi

向指定的CSM发布一条消息并等待回复，相当于同步调用，在指定超时内没有收到返回，将返回超时错误。

<b>输入控件:</b>

 - <b>Target Module</b>: 目标 CSM 模块名称
 - <b>State</b>: 消息字符串
 - <b>Arguments ("")</b>: 消息参数
 - <b>Response Timeout(5000ms)</b>: 等待返回的超时设置，默认 5000ms.
 - <b>Error In (no error)</b>: 错误簇

<b>输出控件:</b>

 - <b>Arguments</b>: Response returned.
 - <b>error out</b>: 错误簇

### CSM - Status Change Event.vi

Obtain CSM Global Log Event Reference.

- <b>Error in</b>: Error cluster
- <b>CSM Global Log Event</b>: User event reference for CSM global log.
- <b>Error out</b>: Error cluster

<b>Inputs:</b>

 - <b>Error in</b>:
 - <b>Name("" to use uuid) in</b>:

<b>Outputs:</b>

 - <b>Error out</b>:
 - <b>Status Change Event</b>:

### CSM - Destroy Status Change Event.vi

Release CSM Global Log Event Reference.

- <b>CSM Global Log Event</b>:
- <b>Error in</b>: Error cluster
- <b>Error out</b>: Error cluster

<b>Inputs:</b>

 - <b>Error in</b>:
 - <b>Status Change Event</b>:

<b>Outputs:</b>

 - <b>Error out</b>:

## Side-Loop Support

### CSM - Request CSM to Post Message.vi

申请 CSM 发送消息。通常用于和CSM并行的功能循环，这些功能循环和 CSM 一起完成完整模块功能。

<b>Inputs:</b>

 - <b>Module Name</b>:发送状态的CSM
 - <b>Status</b>: 将被广播的状态
 - <b>Arguments ("")</b>: 将被广播的状态参数
 - <b>Target Module</b>:目标模块
 - <b>Error In (no error)</b>: 错误簇
 -

<b>Outputs:</b>

 - <b>error out</b>: 错误簇

### CSM - Request CSM to Broadcast Status Change.vi

申请 CSM 发布状态。通常用于和CSM并行的功能循环，这些功能循环和 CSM 一起完成完整模块功能。

<b>Inputs:</b>

 - <b>Module Name</b>:发送状态的CSM
 - <b>Status</b>: 将被广播的状态
 - <b>Arguments ("")</b>: 将被广播的状态参数
 - <b>Broadcast(T)</b>: 控制是否广播的开关输入
 - <b>Error In (no error)</b>: 错误簇

<b>Outputs:</b>

 - <b>error out</b>: 错误簇

### CSM - Module Turns Invalid.vi

检查CSM是否已经退出。通常用于和CSM并行的功能循环，这些功能循环和 CSM 一起完成完整模块功能。 本VI用于并行循环的退出条件。

<b>Inputs:</b>

 - <b>CSM Name</b>: 模块名称

<b>Outputs:</b>

 - <b>Turn Invalid(Exit)?</b>: 是否已经退出

## Global Log Event

### CSM - Global Log Event.vi

获取 CSM 全局状态用户事件句柄

<b>输入控件:</b>

 - <b>Error in</b>: 错误簇

<b>输出控件:</b>

 - <b>CSM Global Log Event</b>: CSM 全局状态用户事件句柄
 - <b>Error out</b>: 错误簇

### CSM - Destroy Global Log Event.vi

释放 CSM 全局状态用户事件句柄

<b>输入控件:</b>

 - <b>CSM Global Log Event</b>: CSM 全局状态用户事件句柄
 - <b>Error in</b>: 错误簇

<b>输出控件:</b>

 - <b>Error out</b>: 错误簇

### CSM - Generate User Global Log.vi

<b>Inputs:</b>

 - <b>Error in</b>:
 - <b>From Who</b>:
 - <b>ModuleName</b>:
 - <b>Log</b>:
 - <b>Arguments</b>:

<b>Outputs:</b>

 - <b>error out</b>:

## Utility VIs

### Build Error Cluster.vi

创建一个错误簇（error cluster），以标准 LabVIEW 的方式从调用 VI 的调用链中构建源字符串。构建的源字符串形式为：
"<B>调用的 VI</B> 在 <B>调用 VI 的调用者</B>-><B>调用 VI 的调用者的调用者</B>->等等...->等等..."
可选的 'String to Prepend to source ("")' 字符串输入可用于在源字符串中添加额外的描述信息。如果存在这个字符串，它将用括号括起来，并添加到源字符串之前。

<b>输入控件:</b>

 - <b>code</b>: 错误码
 - <b>String to Prepend to source ("")</b>: 错误信息字符串

<b>输出控件:</b>

 - <b>error out</b>: 错误簇

### Build Internal State String.vi

构建包含 JKI 状态机状态、参数等信息的字符串。

<b>输入控件:</b>s

 - <b>State</b>: 状态字符串
 - <b>Arguments ("")</b>: <b>State</b>的参数
 - <b>Arg-State ("")</b>: 发送此消息的模块在发送此消息时处于的状态
 - <b>Source ("")</b>: 发送此消息的模块名称

<b>输出控件:</b>

 - <b>State with Arguments</b>: 包含 JKI 状态机状态、参数等信息的字符串

### String History Cacher.vi

保存当前输入的字符串到缓存，缓存的历史字符串，当超出最大长度限制时，最先进入的缓存字符串将被覆盖。用于调试CSM的历史状态。

<b>输入控件:</b>

 - <b>String</b>: 待缓存字符串
 - <b>length</b>: 缓存的历史字符串最大字符串长度
 - <b>Include Timestamp(F)</b>: 是否在每行开头包含时间戳。

<b>输出控件:</b>

 - <b>String Cache</b>: 缓存的历史字符串

### Timeout Selector.vi

用于包含用户事件结构的模板中

<b>输入控件:</b>

 - <b>Timeout Expected</b>: 预期的超时设置
 - <b>Remaining States</b>: 如果还有剩余的状态，输出将为 0，否则输出为预期值

<b>输出控件:</b>

 - <b>Timeout</b>: 仲裁后使用的超时设置

### Trim Both Whitespace.vi

从 <B>string</B> 的开头、结尾或两者同时移除所有 ASCII 空白字符（空格、制表符、回车和换行）。

<b>输入控件:</b>

 - <b>string</b>: 待处理字符串

<b>输出控件:</b>

 - <b>trimmed string</b>: 处理后的字符串

### uuid.vi

根据标准方法生成 <b>Universally Unique Identifier(UUID)</b>。 例如:

     - 59703F3AD837
     - 106A470BA5EC
     - 9B781DB313AF

<b>输入控件:</b>

 - 无

<b>输出控件:</b>

 - <b>UUID</b>: 生成的 UUID

### CSM - Broadcast Message Type.ctl

广播消息类型定义。

- <b>Interrupt:</b> 高优先级，作为中端
- <b>Status:</b> 普通优先级，作为消息

### CSM - Message Type.ctl

消息类型定义。

- <b>Async:</b> 异步消息 (->)
- <b>Async without Reply:</b> 无返回异步消息 (->\|)
- <b>Sync:</b> 同步消息 (-@)

### Global Log To String.vi

<b>Inputs:</b>

 - <b>Log</b>:

<b>Outputs:</b>

 - <b>String</b>:

## API使用最佳实践

### 1. 消息构建

**推荐做法**：
- 使用`Build Message with Arguments++.vi`多态VI构建消息
- 自动检测版本可以根据输入自动确定消息类型
- 对于明确的消息类型，使用对应的特定版本提高性能

**示例**：
```
// 使用自动检测版本
Build Message with Arguments(Auto Check).vi
State with Arguments: "API: GetData"
Target Module: "DataProcessor"
// 自动识别为同步调用

// 使用特定版本（性能更好）
Build Synchronous Message with Arguments.vi
State with Arguments: "API: GetData"
Target Module: "DataProcessor"
```

### 2. 模块管理

**检查模块存在性**：
```
// 在发送消息前检查模块是否存在
CSM - Check If Module Exists.vi
CSM Name: "TargetModule"
Exist?: TRUE/FALSE
```

**获取模块列表**：
```
// 列出所有活动模块（不包含系统级）
CSM - List Modules.vi
Scope: Normal
With Nodes?: FALSE
```

**获取模块状态**：
```
// 查看模块工作模式和队列状态
CSM - Module Status.vi
CSM Name: "MyModule"
// 返回：Mode, #Nodes, #Elements In Queue
```

### 3. 消息发送

**同步消息**：
- 用于需要立即获得响应的场景
- 设置合理的超时时间
- 处理超时错误

```
CSM - Send Message and Wait for Reply.vi
Current Module: "Caller"
Target CSM: "Server"
Message: "API: Calculate >> 100"
Response Timeout: 5000ms
```

**异步消息**：
- 用于不需要立即响应的场景
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
- **HEXSTR**：小型数据结构（<4KB）
- **MassData**：大型数据（>4KB）
- **API String**：可读配置参数

**参数编解码示例**：
```
// 编码Cluster到HEXSTR
Arguments:HEXSTR Converter.vi
Variant: MyDataCluster
String: "0A1B2C3D..."

// 从HEXSTR解码
Arguments:HEXSTR Converter.vi
String: "0A1B2C3D..."
Variant: MyDataCluster
```

### 6. 错误处理

**统一错误处理流程**：
1. 捕获所有错误到"Error Handler"状态
2. 使用ERRSTR格式传递错误信息
3. 广播关键错误到所有模块
4. 记录错误到全局日志

```
// 在API中处理错误
Case: "API: MyAPI"
  If Error Occurred Then
    Build Asynchronous Message with Arguments.vi
    State: "Error Occurred"
    Arguments: ERRSTR格式的错误
    Target: "<all>"  // 广播到所有订阅者
  End If
```

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
// 设置合理的全局超时
CSM - Set TMO of Sync-Reply.vi
TMO: 5000ms  // 根据实际响应时间调整

// 对于特定API使用自定义超时
Parse State Queue++.vi
Response Timeout: 10000ms  // 针对耗时操作
```

### 8. 调试技巧

**使用全局日志**：
```
// 记录关键操作
CSM - Global Log.vi
CSM Name: "MyModule"
Message: "Processing started"
Arguments: "Parameter details"
```

**监控模块状态**：
```
// 定期检查模块队列
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

**答案**：`-2`表示使用全局超时设置。可以通过`CSM - Set TMO of Sync-Reply.vi`设置全局超时时间。这样可以统一管理所有模块的超时设置，便于调整和维护。

### Q2: 何时使用同步消息，何时使用异步消息？

**答案**：
- **同步消息（-@）**：需要立即获得响应的场景，如查询数据、执行计算
- **异步消息（->）**：不需要立即响应的场景，如日志记录、状态更新
- **异步无返回（->|）**：完全不需要响应的场景，如触发通知

### Q3: 如何处理消息超时？

**答案**：
1. 在Parse State Queue++.vi后检查当前状态
2. 如果状态为"Target Timeout Error"，实现重试或错误报告逻辑
3. 考虑增加超时时间或优化目标模块的响应速度
4. 记录超时事件到日志以便分析

### Q4: MassData和HEXSTR如何选择？

**答案**：
- **HEXSTR**：小于4KB的数据，简单数据结构
- **MassData**：大于4KB的数据，如图像、大数组
- **性能**：MassData通过共享内存避免数据复制，大数据场景性能更好
- **易用性**：HEXSTR更简单，不需要额外的缓冲区管理

### Q5: 如何避免消息队列堵塞？

**答案**：
1. **设计**：避免在状态中执行耗时操作，将耗时操作移到独立的子模块
2. **监控**：使用`CSM - Module Status.vi`监控队列长度
3. **优先级**：使用高优先级队列处理紧急消息
4. **过滤**：在必要时使用消息过滤避免处理不必要的消息
5. **分工**：使用协作者模式将负载分散到多个工作者

### Q6: 协作者模式和责任链模式有什么区别？

**答案**：
- **协作者模式（Worker Mode）**：
  - 多个工作者共享一个消息队列
  - 任意一个空闲的工作者处理消息
  - 用于负载均衡，提高吞吐量
  
- **责任链模式（Chain of Responsibility）**：
  - 消息按优先级顺序传递给节点
  - 节点可以处理或传递给下一个节点
  - 用于多级处理、验证、过滤等场景

### Q7: 如何实现模块的优雅关闭？

**答案**：
1. 设计专门的关闭API：`API: Shutdown`
2. 在关闭API中执行清理操作
3. 发送`Macro: Exit`状态退出主循环
4. 在`Data: Cleanup`中释放所有资源
5. 考虑通知依赖此模块的其他模块

### Q8: 为什么不建议使用CSM - Flush Queue.vi？

**答案**：清空队列会丢失消息，可能导致：
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
