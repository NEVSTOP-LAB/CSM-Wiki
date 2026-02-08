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

在设计CSM-TCP-Router时，我们需要将远程控制的需求映射到CSM的模块和消息系统中。

### 应用需求分析

这个TCP路由应用的核心需求包括：

1. **TCP服务器管理**：启动/停止TCP服务器，管理客户端连接
2. **消息路由**：将TCP客户端的命令转换为CSM消息，发送给目标模块
3. **响应返回**：将CSM模块的响应返回给TCP客户端
4. **模块管理**：列出活动模块、查询模块API、获取模块帮助信息
5. **客户端交互**：支持客户端连接、断开、切换工作模式

### 需求到模块的映射

| 需求领域 | CSM模块 | 职责 |
|---------|---------|------|
| TCP通讯层 | `TCP-Router Module` | 处理TCP连接、解析数据包、路由消息 |
| 业务逻辑 | `AI Module`、`Controller` 等 | 提供实际的业务功能API |
| 全局消息总线 | CSM隐形总线 | 连接所有模块，实现透明的消息传递 |

### 需求到指令集的映射

CSM-TCP-Router 的设计特点是分层指令集，将不同层次的需求映射到相应的指令层：

**第1层：CSM消息指令集**（业务需求）
- 需求：调用业务模块的功能 → 直接使用CSM消息格式
- 示例：`Read >> ch0 -@ AI` （读取AI模块的ch0通道）
- 实现方式：利用CSM框架的隐形总线，TCP-Router只需转发即可

**第2层：Router指令集**（管理需求）
- 需求：列出所有模块 → 指令: `List`
- 需求：查询模块API → 指令: `List API`
- 需求：查询模块状态 → 指令: `List State`
- 需求：获取模块帮助 → 指令: `Help`
- 需求：刷新缓存 → 指令: `Refresh lvcsm`

**第3层：Client指令集**（客户端交互需求）
- 需求：断开连接 → 指令: `Bye`
- 需求：切换工作模块 → 指令: `Switch`
- 需求：快速输入 → 快捷键: `TAB`

### 通讯协议映射

将TCP通讯需求映射到数据包格式：

| 需求 | 协议类型 | 说明 |
|-----|---------|------|
| 发送信息 | `0x00 - info` | 服务器通知信息 |
| 报告错误 | `0x01 - error` | 错误信息返回 |
| 发送指令 | `0x02 - cmd` | 客户端发送的指令 |
| 同步响应 | `0x03 - resp` | CSM同步调用的响应 |
| 异步响应 | `0x04 - async-resp` | CSM异步调用的响应 |
| 状态订阅 | `0x05 - status` | 订阅的状态广播 |

### 消息流映射

```
客户端指令 → TCP数据包 → Router解析 → CSM消息 → 目标模块
目标模块 → CSM响应 → Router封装 → TCP数据包 → 客户端
```

具体映射示例：

| 客户端输入 | TCP数据包 | CSM消息 | 目标模块处理 |
|-----------|----------|---------|-------------|
| `Read >> ch0 -@ AI` | cmd类型数据包 | `Read >> ch0 -@ AI` | AI模块执行读取操作 |
| `List` | cmd类型数据包 | 查询CSM模块列表 | Router内部处理 |
| `Help -@ AI` | cmd类型数据包 | 读取AI模块文档 | Router读取VI文档 |

### 关键设计决策

**为什么采用三层指令集架构？**

1. **第1层（CSM消息）**：充分利用现有CSM消息系统，无需重复造轮子
   - 优势：所有CSM模块的API自动可用，无需额外代码
   - 实现：TCP-Router通过隐形总线透明转发

2. **第2层（Router指令）**：提供管理和查询功能
   - 优势：远程客户端可以发现和了解可用的模块和API
   - 实现：Router模块实现这些管理指令

3. **第3层（Client指令）**：改善用户体验
   - 优势：简化客户端操作，提供快捷功能
   - 实现：在客户端软件中实现

**为什么选择无侵入式设计？**
- 需求：为现有CSM应用添加远程控制能力，但不修改原有代码
- 实现：利用CSM的隐形总线特性，TCP-Router作为独立模块接入
- 优势：现有应用无需任何修改即可支持远程控制

### 设计总结

通过需求映射，CSM-TCP-Router实现了：

1. **分层设计**：三层指令集各司其职，清晰明确
2. **无侵入集成**：利用CSM隐形总线，无需修改现有代码
3. **协议规范**：明确的数据包格式，支持多种消息类型
4. **易于扩展**：添加新指令或业务模块无需修改通讯层

这种需求映射方法体现了CSM框架的核心优势：通过隐形总线实现模块间的松耦合通讯，使得功能扩展变得简单自然。

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
