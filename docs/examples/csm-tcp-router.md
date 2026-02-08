---
title: CSM-TCP-Router 应用
layout: default
parent: 示例应用
nav_order: 2
---

# CSM-TCP-Router

CSM-TCP-Router 演示如何通过创建一个可复用的TCP通讯层，将本地程序变成一个TCP服务器，实现远程控制。通过这个案例，展示CSM框架的隐形总线的优点。

> 项目仓库：[https://github.com/NEVSTOP-LAB/CSM-TCP-Router-App](https://github.com/NEVSTOP-LAB/CSM-TCP-Router-App)

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
