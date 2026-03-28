---
title: 插件系统概述
layout: default
parent: 插件系统
nav_order: 1
---

# CSM插件机制

CSM提供三种插件接口：**Addon** 扩展核心能力，**Template** 提供模块模板，**Tools** 提供调试工具。

```
CSM框架
├── Addon：参数扩展、API扩展、功能模块
├── Template：基础模板、UI模板、自定义模板
└── Tools：调试工具、开发工具、监控工具
```

# Addon 接口

Addon是CSM的核心扩展接口，让你能添加新的参数类型、API功能或完整的功能模块。

## 常用Addon分类

**参数扩展类**：
- **MassData Support**：高效传递大数组、波形等大数据
- **API String Arguments Support**：用纯文本传多个参数
- **INI-Variable Support**：配置文件变量支持

**功能模块类**：
- **WatchDog Addon**：自动管理模块退出
- **File Logger Addon**：全局日志文件记录
- **Loop Support Addon**：循环状态支持
- **Attribute Addon**：属性访问增强
- **TCP Router Addon**：TCP远程控制和监控

## WatchDog Addon

主程序退出后，自动让所有CSM模块都正常退出。原理很简单：监控主程序创建的队列，队列释放了就说明主程序退了，这时给所有模块发送`Macro: Exit`。

**使用方法**：

在主程序启动后调用[`CSM - Start Watchdog to Ensure All Modules Exit.vi`]({% link docs/reference/api-09-build-in-addons.md %}#csm-start-watchdog-to-ensure-all-modules-exitvi)，保持返回的Watchdog Queue引用直到程序结束。程序退出时队列自动释放，WatchDog就会通知所有模块退出。

```labview
// 主程序初始化
CSM - Start Watchdog to Ensure All Modules Exit.vi
→ Watchdog Queue（保持引用）

// 程序运行...
// 程序退出，队列释放，所有模块自动收到Exit命令
```

**注意**：在主程序启动时尽早调用，不要手动释放Watchdog Queue。

详细说明请参阅：[WatchDog自动退出管理]({% link docs/plugins/watchdog.md %})

## File Logger Addon

把应用的所有日志保存到文本文件，方便事后分析和排错。日志文件是`.csmlog`格式，普通文本编辑器就能打开。详细说明参见[文件日志(File Logger)]({% link docs/plugins/csmlogger.md %})。

**文件管理**：
- **File Size**：单文件最大大小（默认10MB）
- **File Num**：最多保留文件数（默认2个）
- 超过限制自动滚动，删除最旧的文件

**使用方法**：

[`CSM - Start File Logger.vi`]({% link docs/reference/api-09-build-in-addons.md %}#csm-start-file-loggervi)启动日志记录线程。

主要参数：
- **Log File Path**：日志文件路径
- **Timestamp format**：时间格式，默认`%<%Y/%m/%d %H:%M:%S%3u>T`
- **Log Limit**：文件大小和数量限制
- **[Filter Rules]({% link docs/reference/api-07-global-log.md %}#filter-rules)**：过滤规则（通过`CSM - Convert Filter Rules VI`配置）

```labview
CSM - Start File Logger.vi
  Log File Path: "C:\Logs\application.csmlog"
  Log Limit: {File Size: 10MB, File Num: 2}
  → Log File, Watchdog Queue
```

**应用场景**：故障诊断、性能分析、审计追踪、用户支持。

**参考**：`Addons - Logger\CSM Application Running Log Example.vi`

## Loop Support Addon

在CSM里实现循环操作，同时不阻塞状态机、能响应外部消息。详细说明参见[Loop Support（循环状态支持）]({% link docs/plugins/loop-support.md %})。

## Attribute Addon

简化Attribute读写操作的多态VI，自动适应数据类型，不用手动指定类型。

- **CSM Set Module Attribute.vim**：多态写入
- **CSM Get Module Attribute.vim**：多态读取

用于快速读写模块属性、配置管理、Worker/Chain模式的节点间数据共享。

## TCP Router Addon

为 CSM 应用添加 TCP 远程控制能力，将本地程序转变为 TCP 服务器，实现远程访问和控制。详细说明参见[TCP Router（TCP远程控制）]({% link docs/plugins/tcp-router.md %})。

**核心特性**：
- 无侵入集成，无需修改原有代码
- 支持多客户端同时连接
- 完整支持 CSM 同步/异步消息、广播订阅
- 三层指令集：CSM 消息、Router 管理、Client 指令

**使用方法**：

```labview
// 在主程序初始化阶段启动 TCP Router
Initialize >> {
    Run Async: TCP-Router  // 使用默认端口
}
```

**应用场景**：仪器远程控制、自动化测试、分布式系统集成、远程调试。

**参考**：[TCP服务器应用示例]({% link docs/examples/csm-tcp-router.md %})

## 开发自己的Addon

**命名与注册**：
- Addon VI命名为`CSM-Addon-*.vi`或`CSM*.vi`，放到CSM目录下即可自动注册
- 也可通过API手动注册（适用于动态加载场景）

**开发建议**：
- 避免阻塞操作，合理管理资源
- 使用全局日志记录运行信息，用CSM Debug Console测试API

**参考项目**：
- [MassData Support](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)
- [API String Arguments Support](https://github.com/NEVSTOP-LAB/CSM-API-String-Arugments-Support)
- [INI-Variable Support](https://github.com/NEVSTOP-LAB/CSM-INI-Static-Variable-Support)

# Template 接口

Template让你快速创建标准化的CSM模块，提高开发效率和代码一致性。

## 模板类型

| 模板 | 说明 | 适用场景 |
|------|------|---------|
| **CSM Basic Template** | 单一CSM循环，无UI交互 | 后台服务、简单业务逻辑 |
| **CSM UI Template** | 包含事件结构，分离UI循环和CSM循环 | 用户交互模块 |
| **CSM DQMH-Style Template** | UI循环和CSM循环完全分离，通过消息通讯 | 大型应用 |
| **CSM API String Template** | 支持API String参数 | 复杂参数传递 |

## 开发自己的模板

模板应保持简洁，不包含业务逻辑，并提供充分的注释指导使用者修改。需要包含标准的初始化和退出流程，遵循CSM命名规范。

更多详情参考[CSM模板文档](../reference/templates)。

# Tools 接口

Tools是CSM的调试工具接口，所有工具都基于全局日志机制，通过订阅日志获取系统运行信息。

CSM内置了多种工具，包括运行时监控（Running Log Window、State Dashboard、Table Log Window）、开发调试（Debug Console、Interface Browser、Example Browser）和数据查看（MassData Cache Viewer、INI-Variable Viewer）等。详细使用说明参见[CSM调试与开发工具](./tools)。

## 开发自定义工具

自定义工具的核心是订阅全局日志队列并处理日志数据：

```labview
// 获取全局日志队列
CSM - Global Log Queue.vi → Global Log Queue

// 循环处理日志
Loop {
    Dequeue Element (Global Log Queue) → Log Data
    Process Log Data
    Update UI
}

// 清理
CSM - Destroy Global Log Queue.vi
```

**开发要点**：
- 实现日志过滤，只处理需要的日志，避免影响被监控系统性能
- 使用队列方式获取日志（比事件高效），批量更新UI

