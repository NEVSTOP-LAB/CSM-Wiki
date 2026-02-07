---
title: 基本概念
layout: default
parent: 基础文档
nav_order: 2
---

# 基本概念
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

# 基本概念
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## `CSM模块` (CSM Module)

CSM 是 Communicable State Machine 的缩写，简单说就是"会通讯的状态机"。在 LabVIEW 里，CSM模块就是一个 vi 文件，本质上是个状态机，只是加上了模块间通讯的能力。

### 模块命名规则

模块名称要唯一，重名会导致Critical Error。除此之外还有几个特殊规则：

- 空字符串("")：自动用UUID命名，独立运行不出现在模块列表里
- `.`开头（如`.MainApp`）：系统级模块，默认不会被列出，适合后台模块
- 中间有`.`（如`System.Logger`）：用来标记逻辑关系，并不是真的子模块
- `#`结尾（如`Worker#`）：协作者模式节点
- `$`加数字（如`Handler$1`）：责任链模式节点

更多高级模式说明请看[这里](./2023-12-31-advance.html)。

### 模块接口

要使用一个CSM模块，你只需要知道三个接口：

- **消息接口**：能调用哪些消息、需要什么参数、会返回什么
- **广播接口**：能订阅哪些广播、参数是什么
- **属性接口**：有哪些属性、类型是什么

## `状态`(State) 和 `宏状态`(Macro)

状态就是Case结构里的一个分支，是CSM的基本逻辑单元。CSM跟其他状态机的区别是用字符串来控制，并且有特定的语法规则。

宏状态是多个状态的组合，相当于一组固定的状态序列。CSM模板默认有两个宏状态：`Macro: Initialize`（启动时）和`Macro: Exit`（退出时）。

## `消息`(Message)

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

### 消息类型

**同步消息** (`-@`)：
- 发出后等待对方处理完才继续
- 会在Response状态收到返回
- 可能出现超时、目标不存在等错误

**异步消息** (`->`)：
- 发出后立即继续，不等待
- 对方处理完后在Async Response状态收到返回
- 只检查目标是否存在

**异步无返回** (`->|`)：
- 发出后立即继续
- 不会收到任何返回
- "发完就忘"的模式

### 特殊操作消息

CSM还定义了一些系统操作，格式是`<操作类型>`：

```
// 发送广播"TCP Connected"，参数为"192.168.1.100"
TCP Connected >> 192.168.1.100 -> <broadcast>

// 订阅TCPModule的广播，触发时调用UI模块的UpdateLED
TCP Connected@TCPModule >> UpdateLED@UI -><register>
```

## `响应`(Response)

响应就是被调用模块的返回字符串。比如A调用B的"API: DoSth"，B处理完后可以返回"Received"确认收到。模板里的响应默认是空字符串。

- 同步消息在"Response"状态处理响应
- 异步消息在"Async Response"状态处理响应

## `广播`(Broadcasting)

广播是CSM的1对多通讯方式，类似Pub/Sub模式。必须先订阅才能收到广播，目前只支持同一个LabVIEW应用内的模块。

### 广播类型

有三种广播：

- **信号广播**(Status)：普通优先级，需要显式发送，走低优先级队列
- **中断广播**(Interrupt)：高优先级，需要显式发送，走高优先级队列  
- **状态广播**(State)：任何状态都能被订阅，运行完自动触发，参数是状态的Response

注意：广播名称别跟状态名重复，可能导致多次触发。状态广播只在有订阅时才发送。

### 广播格式和订阅

```
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

## `参数`(Arguments) 和 `属性`(Attribute)

**参数**：消息、响应、广播都能携带的数据，都是字符串形式。

**属性**：模块的配置数据，提供直接读写的方法：
- 外部可以通过模块名+属性名直接读写，不需要发消息
- Worker模式和Chain模式的多个节点共享同一个属性空间
- 属性有明确的数据类型（LabVIEW数据类型）
- 常用于存配置参数、状态数据等

详细用法看[CSM函数面板](./2024-01-08-csm-palette-apis.html)。

## 概念小结

CSM框架的核心就这么几个概念：

- **模块、状态、消息、广播**是基础构成
- **同步/异步调用**是两种通讯方式  
- **订阅机制**实现1对多通知
- **参数和属性**用来存数据

掌握了这些概念，就可以开始用CSM开发了。具体用法看Wiki的其他章节。
