---
title: 基本概念
layout: default
parent: 基础文档
nav_order: 2
---

# 基本概念

---

## CSM模块 (CSM Module)

CSM 是 Communicable State Machine 的缩写，简单说就是"会通讯的状态机"。在 LabVIEW 里，CSM模块就是一个 vi 文件，本质上是个状态机，只是加上了模块间通讯的能力。

### 模块命名规则

模块名称要唯一，重名会导致Critical Error。除此之外还有几个特殊规则：

- 空字符串("")：自动用UUID命名，独立运行不出现在模块列表里
- `.`开头（如`.MainApp`）：系统级模块，默认不会被列出，适合后台模块
- 中间有`.`（如`System.Logger`）：用来标记逻辑关系，并不是真的子模块
- `#`结尾（如`Worker#`）：协作者模式节点
- `$`加数字（如`Handler$1`）：责任链模式节点

更多高级模式说明请看[这里](./advance)。

### 模块接口

要使用一个CSM模块，你只需要知道三个接口：

- **消息接口**：能调用哪些消息、需要什么参数、会返回什么
- **广播接口**：能订阅哪些广播、参数是什么
- **属性接口**：有哪些属性、类型是什么

## 状态(State) 和 宏状态(Macro)

状态就是Case结构里的一个分支，是CSM的基本逻辑单元。CSM跟其他状态机的区别是用字符串来控制，并且有特定的语法规则。

宏状态是多个状态的组合，相当于一组固定的状态序列。CSM模板默认有两个宏状态：`Macro: Initialize`（启动时）和`Macro: Exit`（退出时）。

## 消息队列(Message Queue)

消息队列是CSM运行的核心机制。每个CSM模块维护两个队列，用于接收其他模块发来的消息：

- **高优先级队列**：接收同步消息（`-@`）和中断广播（`<interrupt>`），模块会优先处理此队列的内容。
- **低优先级队列**：接收异步消息（`->`、`->|`）和信号广播（`<status>`），在高优先级队列为空时才处理。

此外，模块内部还有一个**状态队列**（State Queue），用于存放本地待执行的状态序列（如宏状态展开后的多个步骤）。状态队列中的状态由模块自己生产和消费，不通过跨模块队列传递。

每次循环，[`Parse State Queue++.vi`]({% link docs/reference/api-02-core-functions.md %}#parse-state-queuevi) 会先从状态队列取状态执行；状态队列为空时，再从消息队列（高优先级优先）中取消息。

## 消息(Message)

消息是CSM模块间1对1通讯的方式。模块A发送消息"API: DoSth"给模块B，B就会进入"API: DoSth"状态。

在LabVIEW里，消息就是一个符合特定语法的字符串，包含了状态名、参数、消息类型等信息。CSM提供了VI来帮你生成这些字符串，不用手写。

### 消息格式

基本格式是这样的：
```
[消息名] >> [参数] [符号] [目标模块] // [注释]
```

- 消息名：要调用的状态名
- `>>`：分隔符
- 参数：传递的数据
- 符号：`-@`（同步）、`->`（异步有返回）、`->|`（异步无返回）
- 目标模块：接收消息的模块，为空表示自己处理
- 注释：`//`后面的内容，不会被解析

### 同步消息(Synchronous Message)

**同步消息**（`-@`）发出后，发送方会暂停状态变化，等待目标模块处理完毕并返回结果，才继续执行后续状态。

- 返回结果在发送方的 `Response` 状态处理
- 默认超时时间为 `-2`（使用全局设置），可通过 [`CSM - Set TMO of Sync-Reply.vi`]({% link docs/reference/api-04-management-api.md %}#csm---set-tmo-of-sync-replyvi) 统一调整
- 目标为空字符串时产生 `NO Target Error`，目标不存在时产生 `Target Error`，超时时产生 `Timeout Error`

### 异步消息(Asynchronous Message)

**异步消息**（`->`）发出后，发送方立即进入 `Async Message Posted` 状态继续执行，不等待目标模块的返回。目标模块处理完毕后，会将结果回传给发送方，由发送方在 `Async Response` 状态处理。

- 目标为空字符串时产生 `NO Target Error`，目标不存在时产生 `Target Error`
- 不受超时限制

### 异步无返回消息(Asynchronous No-Reply Message)

**异步无返回消息**（`->|`）与异步消息类似，发出后立即继续执行，但目标模块处理完成后**不会**回传结果，发送方也不会进入 `Async Response` 状态。"发完就忘"的模式，适合不需要确认结果的通知场景。

### 特殊操作消息

CSM还定义了一些系统操作，格式是`<操作类型>`：

```csm
// 发送广播"TCP Connected"，参数为"192.168.1.100"
TCP Connected >> 192.168.1.100 -> <broadcast>

// 订阅TCPModule的广播，触发时调用UI模块的UpdateLED
TCP Connected@TCPModule >> UpdateLED@UI -><register>
```

## 响应(Response)

响应就是被调用模块的返回字符串。比如A调用B的"API: DoSth"，B处理完后可以返回"Received"确认收到。模板里的响应默认是空字符串。

- 同步消息在"Response"状态处理响应
- 异步消息在"Async Response"状态处理响应

## 系统预置状态

CSM 的预置状态以 JKISM 为基础进行扩展。JKISM 预置了用于控制状态机生命周期的基本状态，CSM 在此之上追加了处理模块间通讯生命周期所需的额外状态。每个 CSM 模块都应包含这些状态的处理逻辑：

| 预置状态 | 来源 | 触发时机 |
|---|---|---|
| `Macro: Initialize` | JKISM | 模块启动时进入，完成初始化后才开始接收外部消息 |
| `Macro: Exit` | JKISM | 收到退出请求时进入，退出后不再接收外部消息 |
| `Error Handler` | JKISM | 模块发生错误时自动进入，CSM 还会同步广播 `Error Occurred` 状态以便外部捕获 |
| `Response` | CSM 扩展 | 收到同步消息的返回值时自动进入 |
| `Async Response` | CSM 扩展 | 收到异步消息的返回值时自动进入 |
| `Async Message Posted` | CSM 扩展 | 发出异步消息后立即进入，用于跟踪已发送的异步请求 |
| `Target Timeout Error` | CSM 扩展 | 同步消息超时未响应时进入 |
| `Target Error` | CSM 扩展 | 目标模块不存在时进入 |
| `Critical Error` | CSM 扩展 | 框架级严重错误（如模块名重复）时进入，模块将停止运行 |

在同步/异步消息的 `Response` / `Async Response` 状态中，可以从 `Additional Information` 获取被调用方的错误信息，也可以通过 `Source CSM` 输出得知返回值来自哪个模块。

## 广播(Broadcast)

广播是CSM的1对多通讯方式，类似Pub/Sub模式。必须先订阅才能收到广播，目前只支持同一个LabVIEW应用内的模块。

### 信号广播(Status Broadcast)

信号广播（`<status>` 或 `<broadcast>`）是普通优先级的广播，通过**低优先级队列**传递，行为类似异步消息。模块需要显式调用才能发出：

```csm
ModuleStatus >> Arguments -> <status>
```

当模块中还有未处理的异步消息或其他信号广播时，信号广播会依次排队处理。

### 中断广播(Interrupt Broadcast)

中断广播（`<interrupt>`）是高优先级的广播，通过**高优先级队列**传递，行为类似同步消息，会被优先处理。模块同样需要显式调用：

```csm
UrgentEvent >> Arguments -> <interrupt>
```

当模块中存在其他低优先级的消息或信号广播时，中断广播会被优先处理。

### 状态广播(State Broadcast)

状态广播是 CSM 特有的**隐式广播**机制。CSM 模块的任意一个状态，都可以被外部模块订阅。当该状态执行完毕时，框架会自动将该状态的 Response 作为参数触发广播，无需在代码中显式发送。

{: .note }
> 状态广播出于效率考虑，只有存在订阅关系时才会发送。

注意：信号广播/中断广播名称不应与状态名重复，否则可能出现重复触发的情况。

### 广播格式和订阅

```csm
// 信号广播（默认）
ModuleStatus >> Arguments -> <status>

// 中断广播
UrgentEvent >> Arguments -> <interrupt>

// 订阅/取消订阅
Status@SourceModule >> API@TargetModule -><register>
Status@SourceModule >> API@TargetModule -><unregister>

// 订阅时改变优先级
Status@SourceModule >> API@TargetModule -><register as interrupt>
interrupt@SourceModule >> API@TargetModule -><register as status>
```

订阅可以用`*`匹配任意源模块。在本模块订阅时可以省略目标模块名。

**订阅的生命周期**：
- 指定了目标模块名：全局规则，模块退出后不会自动删除
- 未指定目标模块名：内部规则，模块退出时自动删除

## 参数(Arguments) 和 属性(Attribute)

**参数**：消息、响应、广播都能携带的数据，都是字符串形式。

**属性**：模块的配置数据，提供直接读写的方法：
- 外部可以通过模块名+属性名直接读写，不需要发消息
- Worker模式和Chain模式的多个节点共享同一个属性空间
- 属性有明确的数据类型（LabVIEW数据类型）
- 常用于存配置参数、状态数据等

详细用法看[CSM函数面板](../reference/palette-apis)。

### 参数数据类型

由于参数只能是字符串，传递复杂数据时需要先编码、收到后再解码。CSM内置了三种编码方案：

- **HEXSTR**：将任意LabVIEW数据先转为变体再序列化为十六进制字符串，格式为 `<HEXSTR>十六进制字符串`。适合传递簇、数组等复杂类型，但数据量大时字符串较长。
- **ERRSTR**：专为LabVIEW错误簇设计，将错误码和描述格式化为可读字符串，格式为 `<ERRSTR>[Error: 错误码] 描述`。
- **SAFESTR**：将包含CSM关键字（如 `->`、`;`、`\r` 等）的字符串中的特殊字符转义为 `%Hex` 格式，格式为 `<SAFESTR>已转义字符串`。

通过 [`CSM - Argument Type.vi`]({% link docs/reference/api-03-arguments.md %}#csm---argument-typevi) 可提取编码类型标记，再调用对应的解码VI还原数据。也可以通过插件（Addon）扩展自定义数据类型。

## 事件结构支持

带用户界面的CSM模块通常包含**事件结构**（Event Structure）来响应用户操作。事件结构会阻塞等待事件，但外部消息到来时需要立即跳出等待去处理消息——CSM通过以下机制解决这个问题：

- **`<New State Notifier Event>`**：CSM为每个含事件结构的模块提供一个用户事件句柄。当模块收到外部消息时，框架自动触发该事件，使事件结构立即中断等待，进入消息处理流程。
- **[`Timeout Selector.vi`]({% link docs/reference/api-01-templates.md %}#timeout-selectorvi)**：辅助VI，当状态队列（Remaining States）非空时自动将超时设为 `0`，保证挂起的状态能被立刻处理，不会被事件结构的超时等待阻塞。
- **`Events: Register` / `Events: Unregister`**：在 `Macro: Initialize` 和 `Macro: Exit` 中注册/注销用户事件，管理事件句柄的生命周期。

对于用户操作逻辑非常复杂的场景（如鼠标拖动组合操作、高频事件过滤），可以使用 **DQMH 风格的 CSM 模板**，将事件结构循环独立放在一个专用的循环中，通过 [`CSM - Flood of Events Handler Side Loop.vi`]({% link docs/reference/api-01-templates.md %}#csm---flood-of-events-handler-side-loopvi) 模板实现。

## 概念小结

CSM框架的核心就这么几个概念：

- **模块、状态、消息、广播**是基础构成
- **消息队列**是驱动状态机运行的底层机制，高优先级队列处理同步/中断，低优先级队列处理异步/信号
- **同步/异步调用**是两种通讯方式，同步调用有全局超时控制
- **系统预置状态**（Response、Async Response、Error Handler 等）处理通讯生命周期
- **订阅机制**实现1对多通知
- **参数和属性**用来存数据，参数提供 HEXSTR/ERRSTR/SAFESTR 编码支持复杂类型
- **事件结构支持**让含UI的模块能在等待用户操作的同时响应外部消息

掌握了这些概念，就可以开始用CSM开发了。具体用法看Wiki的其他章节。
