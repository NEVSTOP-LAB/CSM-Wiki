---
title: CSM-TCP-Router 应用
layout: default
parent: 示例应用
nav_order: 2
---

# CSM-TCP-Router

CSM-TCP-Router 演示如何通过创建一个可复用的TCP通讯层，将本地程序变成一个TCP服务器，实现远程控制。通过这个案例，展示CSM框架的隐形总线的优点。

> 项目仓库：[https://github.com/NEVSTOP-LAB/CSM-TCP-Router-App](https://github.com/NEVSTOP-LAB/CSM-TCP-Router-App)

## 需求映射

在设计CSM-TCP-Router时，我们需要将远程控制的需求映射到CSM的模块和消息系统中。这个案例展示了如何通过分层架构和CSM隐形总线实现无侵入式的远程控制功能。

### 需求分析与架构设计

CSM-TCP-Router的核心挑战是为现有的CSM应用添加远程控制能力，但不能修改原有代码。这要求我们设计一个独立的通讯层，能够透明地转发客户端命令到CSM模块，并将响应返回给客户端。

``` mermaid
graph TB
    subgraph "需求层"
        direction TB
        N1[TCP服务器管理<br/>启动/停止/连接管理]
        N2[消息路由<br/>命令到CSM消息转换]
        N3[响应返回<br/>CSM响应到客户端]
        N4[模块管理<br/>列表/查询/帮助]
        N5[客户端交互<br/>连接/断开/切换]
    end
    
    subgraph "实现层"
        direction TB
        I1[TCP-Router Module<br/>CSM模块]
        I2[隐形总线<br/>消息透明传递]
        I3[分层指令集<br/>3层架构]
    end
    
    N1 --> I1
    N2 --> I2
    N3 --> I2
    N4 --> I3
    N5 --> I3
    
    style N1 fill:#e1f5ff
    style N2 fill:#e1f5ff
    style N3 fill:#e1f5ff
    style N4 fill:#e1f5ff
    style N5 fill:#e1f5ff
    style I1 fill:#fff4e6
    style I2 fill:#fff4e6
    style I3 fill:#fff4e6
```

### 分层指令集设计思路

解决方案的关键是采用三层指令集架构，每层处理不同类别的需求。第一层是CSM消息指令集，直接复用框架现有的消息系统，使得所有业务模块的API自动可以通过TCP访问，无需编写额外代码。第二层是Router指令集，提供模块发现和管理功能，让远程客户端能够了解系统中有哪些模块和API。第三层是Client指令集，在客户端软件中实现，提供更好的交互体验。

``` mermaid
graph TB
    Client[TCP客户端]
    
    subgraph "指令集层次"
        direction TB
        L3[第3层：Client指令<br/>Bye, Switch, TAB<br/>客户端软件实现]
        L2[第2层：Router指令<br/>List, List API, Help<br/>Router模块实现]
        L1[第1层：CSM消息<br/>Read, Start, Stop...<br/>业务模块API]
    end
    
    subgraph "CSM系统"
        Router[TCP-Router<br/>Module]
        Bus[隐形总线]
        Modules[业务模块<br/>AI, Controller...]
    end
    
    Client --> L3
    Client --> L2
    Client --> L1
    
    L3 -.->|客户端处理| Client
    L2 --> Router
    L1 --> Bus
    Bus --> Modules
    
    style L1 fill:#e8f5e9
    style L2 fill:#fff3e0
    style L3 fill:#e3f2fd
    style Bus fill:#fce4ec
```

### 通讯协议设计

TCP通讯协议需要支持不同类型的消息交互。协议定义了6种数据包类型：info用于服务器通知，error用于错误返回，cmd承载客户端指令，resp和async-resp分别对应同步和异步响应，status用于订阅消息的推送。每个数据包包含8字节的包头（数据长度、版本、标志位、类型）加上可变长度的文本数据，这种设计既保证了结构化的解析，又保持了文本内容的可读性。

### 消息流转过程

当客户端发送`Read >> ch0 -@ AI`命令时，整个处理流程如下：

``` mermaid
sequenceDiagram
    participant C as TCP客户端
    participant R as TCP-Router
    participant B as CSM隐形总线
    participant M as AI模块
    
    C->>R: cmd数据包<br/>Read >> ch0 -@ AI
    Note over R: 解析为CSM同步消息
    R->>B: 转发到隐形总线
    B->>M: 路由到AI模块
    activate M
    M->>M: 处理Read请求
    M-->>B: 返回通道数据
    deactivate M
    B-->>R: 接收响应
    Note over R: 封装为resp数据包
    R-->>C: TCP响应<br/>通道数据
```

这个流程展示了TCP-Router的核心价值：作为一个透明的桥梁，它不需要理解业务逻辑，只需要进行消息格式转换和路由。客户端使用标准的CSM消息语法，Router通过隐形总线将消息传递给目标模块，响应按原路返回。这种设计使得任何现有的CSM应用都可以通过添加TCP-Router模块立即获得远程控制能力。

### 设计优势体现

这种需求映射方法充分体现了CSM框架的核心优势。通过隐形总线，TCP-Router模块与业务模块完全解耦，实现了无侵入式的集成。分层指令集架构既保留了CSM消息系统的完整功能，又提供了额外的管理和交互能力。整个设计具有很强的可扩展性，添加新的业务模块时，Router无需任何修改就能自动支持远程调用。

## 系统架构

CSM-TCP-Router 作为TCP通讯层，连接远程客户端和本地CSM应用程序：

``` mermaid
graph TB
    subgraph "远程客户端"
        C1[TCP Client 1]
        C2[TCP Client 2]
        C3[TCP Client N]
    end
    
    subgraph "CSM-TCP-Router 服务器"
        TR[TCP-Router<br/>CSM Module]
        Bus[CSM 隐形总线]
    end
    
    subgraph "CSM 应用模块"
        M1[AI Module]
        M2[Controller Module]
        M3[Other CSM Modules]
    end
    
    C1 -->|TCP连接| TR
    C2 -->|TCP连接| TR
    C3 -->|TCP连接| TR
    
    TR <-->|CSM消息| Bus
    M1 <-->|CSM消息| Bus
    M2 <-->|CSM消息| Bus
    M3 <-->|CSM消息| Bus
    
    style TR fill:#e1f5ff
    style Bus fill:#fff4e6
```

## 功能介绍

- 本地所有可以发送的CSM消息，都可以使用CSM同步、异步消息格式，通过TCP连接发送给本地程序。
- 基于JKI-TCP-Server库，支持多个TCP客户端同时连接。
- [client] 提供一个标准的TCP客户端，可以连接到服务器，验证远程连接、消息发送等功能。

## 通讯协议

### TCP 数据包格式

CSM-TCP-Router 中 TCP 数据包格式定义如下：

```
┌─────────────┬──────────┬──────────┬──────────┬──────────┬────────────────────┐
│ 数据长度    │  版本    │  FLAG1   │  FLAG2   │  TYPE    │     文本数据       │
│   (4B)      │  (1B)    │  (1B)    │  (1B)    │  (1B)    │   (可变长度)       │
├─────────────┴──────────┴──────────┴──────────┴──────────┤                    │
│                    包头 (8 bytes)                        │   数据长度范围     │
└──────────────────────────────────────────────────────────┴────────────────────┘
```

### 数据包类型

数据包类型用于描述数据包的内容，为枚举类型，目前支持的数据包类型有：

| 类型代码 | 类型名称 | 说明 |
|---------|----------|------|
| `0x00` | info | 信息数据包 |
| `0x01` | error | 错误数据包 |
| `0x02` | cmd | 指令数据包 |
| `0x03` | resp | 同步响应数据包 |
| `0x04` | async-resp | 异步响应数据包 |
| `0x05` | status | 订阅返回数据包 |

详细的通讯协议定义，见项目仓库中的 [协议设计文档](https://github.com/NEVSTOP-LAB/CSM-TCP-Router-App/blob/main/.doc/Protocol.v0.(zh-cn).md)

## 支持的指令集

CSM-TCP-Router 支持三层指令集架构：

``` mermaid
graph LR
    Client[TCP客户端] -->|发送指令| Router[CSM-TCP-Router]
    
    subgraph "指令集层次"
        direction TB
        L3[3. Client指令集<br/>Bye, Switch, TAB]
        L2[2. Router指令集<br/>List, List API, Help]
        L1[1. CSM消息指令集<br/>业务模块的API]
    end
    
    Router --> L3
    Router --> L2
    Router --> L1
    L1 -->|CSM总线| Modules[CSM业务模块]
    
    style L1 fill:#e8f5e9
    style L2 fill:#fff3e0
    style L3 fill:#e3f2fd
```

### 1. CSM 消息指令集

由原有基于CSM开发的代码定义。由于CSM框架通过隐形的总线进行消息传递，所有的通讯可以不用侵入代码的方式实现。

例如，本程序中的AI CSM模块提供了：

- `Channels`: 列出所有的通道
- `Read`：读取指定通道的值
- `read all`：读取所有通道的值

这些消息可以通过TCP连接发送给本地程序，实现远程控制。

### 2. CSM-TCP-Router 指令集

由TCP通讯层 (CSM-TCP-Router) 定义。CSM模块管理的功能，通过定义指令，可以实现远程控制。

- `List` - 列出所有的CSM模块
- `List API`: 列出指定模块的所有API
- `List State`: 列出指定模块的所有CSM状态
- `Help` - 显示模块的帮助文件，存储在CSM VI的Documentation字段
- `Refresh lvcsm`: 刷新缓存文件

### 3. CSM-TCP-Router Client 指令集

代码中提供一个标准的CSM-TCP-Router Client。它也内置了一些指令，这些指令如果基于指令集进行开发，无法使用。

- `Bye`: 断开连接
- `Switch`：切换模块，便于输入时省略模块名，不带参数时切换回默认模式
- TAB键: 自动定位到输入对话框

## 使用方法

### 典型消息流程

以下是一个典型的远程调用流程示例：

``` mermaid
sequenceDiagram
    participant C as TCP Client
    participant R as TCP-Router
    participant B as CSM总线
    participant M as AI Module
    
    Note over C,M: 1. 建立连接
    C->>R: 连接请求
    R-->>C: 连接成功 (info)
    
    Note over C,M: 2. 查询模块列表
    C->>R: List (cmd)
    R->>B: 查询已注册模块
    B-->>R: 模块列表
    R-->>C: 模块列表 (resp)
    
    Note over C,M: 3. 同步调用CSM模块API
    C->>R: Read >> ch0 -@ AI (cmd)
    R->>B: 转发CSM同步消息
    B->>M: API: Read >> ch0
    activate M
    M->>M: 处理读取请求
    M-->>B: Response >> 23.5
    deactivate M
    B-->>R: 接收响应
    R-->>C: 23.5 (resp)
    
    Note over C,M: 4. 断开连接
    C->>R: Bye (cmd)
    R-->>C: 断开连接
```

### 使用步骤

1. 在VIPM中安装本工具及依赖
2. 在CSM的范例中打开范例工程CSM-TCP-Router.lvproj
3. 启动代码工程中的CSM-TCP-Router(Server).vi
4. 启动Client.vi，输入服务器的IP地址和端口号，点击连接
5. 输入指令，点击发送，可以在控制台看到返回的消息
6. 在Server程序的界面log中，可以看到执行过的历史消息
7. 在Client.vi中输入`Bye`断开连接
8. 关闭Server程序

## 下载

通过VIPM搜索 **CSM TCP Router**，即可下载安装。

## 依赖项

- Communicable State Machine(CSM) - NEVSTOP
- JKI TCP Server - JKI
- Global Stop - NEVSTOP
- OpenG

## 架构优势

这个示例充分展示了CSM框架隐形总线的优势：

- **无侵入式集成**：无需修改原有代码，即可为程序添加远程控制功能
- **统一消息格式**：所有本地消息都可以通过TCP发送，保持一致性
- **模块化设计**：TCP通讯层作为独立模块，可以轻松集成到任何CSM应用中
- **灵活扩展**：支持添加新的指令集，满足不同应用需求
