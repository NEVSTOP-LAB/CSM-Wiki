---
title: CSM插件机制
author: nevstop
date: 2024-01-01
layout: post
lang: zh-cn
page_id: CSM-Plugin-System
toc: true
permalink: /csm-plugin-system
---

# CSM插件机制概述

CSM插件机制提供了一种灵活且强大的方式来扩展CSM框架功能，允许开发者通过插件形式添加新的功能模块、模板和工具。CSM插件机制主要包括三个接口：Addon接口、Template接口和Tools接口。

通过插件机制，CSM实现了：
- **核心功能扩展**：通过Addon添加新的参数类型、API和功能模块
- **开发效率提升**：通过Template提供标准化的模块模板
- **调试能力增强**：通过Tools提供丰富的调试和开发工具

## 插件架构

CSM插件系统采用松耦合的架构设计：

```
CSM核心框架
    ├── Addon接口层
    │   ├── 参数扩展
    │   ├── API扩展
    │   └── 功能模块
    ├── Template接口层
    │   ├── 基础模板
    │   ├── UI模板
    │   └── 自定义模板
    └── Tools接口层
        ├── 调试工具
        ├── 开发工具
        └── 监控工具
```

# Addon 接口

Addon接口是CSM插件机制的核心，用于扩展CSM框架的核心功能。Addon可以添加新的参数处理方式、扩展API功能、或提供完整的功能模块。

## Addon分类

### 1. 参数扩展类Addon
用于扩展CSM的参数传递能力，支持更多的数据类型和传递方式。

**已有的参数扩展Addon**：
- **MassData Support**: 高效传递大数组、波形等大数据
- **API String Arguments Support**: 以纯文本格式传递多参数
- **INI-Variable Support**: 提供配置文件变量支持

### 2. 功能模块类Addon
提供完整的功能模块，增强CSM的实用功能。

**已有的功能模块Addon**：
- **WatchDog Addon**: 自动管理模块退出
- **File Logger Addon**: 全局日志文件记录
- **Loop Support Addon**: 循环状态支持
- **Attribute Addon**: 属性访问增强

### 3. API扩展类Addon
扩展CSM的API功能，提供更便捷的接口。

## 内置Addon详解

### WatchDog Addon

WatchDog Addon用于自动管理CSM模块的退出，确保在主程序退出后，所有异步启动的CSM模块都能正常退出。

#### 工作原理

LabVIEW VI退出时会自动释放所有队列、事件等句柄资源。WatchDog利用这一特性：
1. 创建一个WatchDog线程
2. 监控由主程序VI创建的队列资源
3. 当主VI退出后，队列资源被释放
4. 触发WatchDog线程给所有未退出的CSM模块发送`Macro: Exit`
5. 保证所有模块正常退出

#### 使用方法

**CSM - Start Watchdog to Ensure All Modules Exit.vi**

启动WatchDog线程，通常在主程序启动后立即执行。

**应用场景**：
- 主程序意外退出时自动清理所有CSM模块
- 多个异步启动的CSM模块需要统一管理
- 防止CSM模块成为"僵尸进程"

**使用示例**：
```labview
// 在主程序初始化时启动WatchDog
CSM - Start Watchdog to Ensure All Modules Exit.vi
输出：Watchdog Queue（保持引用直到程序结束）

// 程序正常运行
...

// 程序退出时，Watchdog Queue自动释放
// WatchDog自动向所有模块发送Macro: Exit
```

**最佳实践**：
- 在主程序启动时尽早调用
- 保持Watchdog Queue引用直到程序结束
- 不要手动释放Watchdog Queue（除非要提前停止监控）

### File Logger Addon

File Logger Addon提供全局日志文件记录功能，将应用中的所有运行记录保存到文本文件中，便于后期分析和错误定位。

#### 工作原理

1. 通过CSM Global Log API获取应用的所有运行记录
2. 应用过滤规则筛选需要记录的日志
3. 将日志格式化并保存到文本文件
4. 文件格式为`.csmlog`，可用文本编辑器打开
5. 自动管理文件大小和数量，防止文件过大

#### 文件限制机制

为防止长期运行的软件导致记录文件过大，设置了限制：
- **File Size**: 单个文件最大大小（字节），默认10MB
- **File Num**: LOG文件最多个数，默认2个

**滚动机制**：
- 当文件大小超过File Size限制时，创建新文件
- 当文件个数超过File Num限制时，删除最早的文件
- 文件命名格式：`filename_001.csmlog`、`filename_002.csmlog`等

#### 使用方法

**CSM - Start File Logger.vi**

启动全局日志文件记录后台线程。

**参数说明**：
- **Log File Path**: 记录文件路径
- **Timestamp format**: 时间格式，默认`%<%Y/%m/%d %H:%M:%S%3u>T`
- **Log Limit**: 文件大小和数量限制
- **Filter Rules**: 过滤规则，通过`CSM - Convert Filter Rules VI`配置
- **Enable? (T)**: 是否启用，默认TRUE
- **WatchDog? (T)**: 是否启用WatchDog，默认TRUE
- **Exit When All Module Exist? (F)**: 所有模块退出后自动退出记录

**输出**：
- **Log File**: 实际的日志文件路径
- **Watchdog Queue**: WatchDog资源句柄

**使用示例**：
```labview
// 启动日志记录
CSM - Start File Logger.vi
  Log File Path: "C:\Logs\application.csmlog"
  Log Limit: {File Size: 10MB, File Num: 2}
  Filter Rules: 配置的过滤规则
  
// 正常运行，所有日志自动记录
...

// 程序退出时，日志线程自动停止
```

#### 应用场景

1. **故障诊断**: 记录完整的运行日志，事后分析问题
2. **性能分析**: 分析消息流动和处理时间
3. **审计追踪**: 满足审计要求
4. **用户支持**: 用户遇到问题时提供日志文件

**最佳实践**：
- 合理设置文件大小限制，避免单个文件过大
- 使用过滤规则，只记录有价值的日志
- 定期清理旧日志文件
- 在生产环境中启用，开发环境可选

**参考范例**：`Addons - Logger\CSM Application Running Log Example.vi`

### Loop Support Addon

Loop Support Addon提供标准化的循环实现方式，允许在CSM中实现连续循环操作，同时保持对外部消息的响应能力。

#### 设计原因

传统的循环实现方式存在问题：
1. **Case分支循环**: 在一个Case中使用While循环，会导致状态机卡死，无法响应外部消息
2. **状态链循环**: 在状态末尾插入下一个循环状态，响应外部消息不及时，且不直观

Loop Support的优势：
- 循环运行时仍然响应其他事件
- 不阻塞状态机运行
- 提供标准化的循环定义方式
- 支持循环中断和控制

#### 使用限制

**不适用场景**：
- Worker模式（协作者模式）
- Chain模式（责任链模式）

原因：这些模式由多个节点组成，消息不能明确指定某个节点执行，因此无法明确通知节点停止循环。

#### 核心API

**CSMLS - Define Loop State(s).vi**

定义循环操作，使用`-><loop>`标记重复循环的状态，自动添加`-><end>`标记循环结束。

**循环示例**：
```labview
DAQ: Initialize
DAQ: Start
DAQ: Continue Check -><loop>  // 循环标记
DAQ: Stop
DAQ: Close -><end>             // 自动添加结束标记
```

**参数**：
- **States Queue**: 状态队列
- **Loop States**: 循环状态
- **Add to Front? (F)**: 是否添加到所有状态前，通常为FALSE

**注意事项**：
- `Add to Front?`通常为FALSE
- 如果为TRUE，会等待循环结束后才返回（同步调用场景）
- 如果为FALSE，定义循环后立即返回（异步场景）

**CSMLS - Append Continuous State.vi**

添加循环状态，维持循环继续运行。在循环状态中调用此VI。

**参数**：
- **States Queue**: 状态队列
- **Loop State(s) and Arguments**: 循环状态
- **Continuous State**: 循环状态名称
- **Continuous Arguments**: 循环状态参数
- **Append(T)**: 是否添加

**CSMLS - Remove Loop Tag and previous State(s) to Break.vi**

移除`<loop>`标记和之前的所有状态，立即跳出循环。

**示例**：
```labview
// 队列中的状态：
DAQ: Acquire                    // 将被移除
DAQ: Continuous Check -><loop>  // 将被移除
DAQ: Stop
DAQ: Close

// 执行此API后，立即进入DAQ: Stop
```

**CSMLS - Remove Loop Tag to Break.vi**

只移除`<loop>`标记，执行完当前状态后跳出循环。

**示例**：
```labview
// 队列中的状态：
DAQ: Acquire
DAQ: Continuous Check -><loop>  // 将被移除
DAQ: Stop
DAQ: Close

// 执行此API后，完成DAQ: Acquire后进入DAQ: Stop
```

#### 循环响应机制

**同步消息响应**：
- 同步消息优先级高，会立即打断循环
- 处理完同步消息后，继续循环

**异步消息响应**：
- 异步消息优先级低，会被插入到`-><end>`标记之后
- 通过`CSMLS - Append Continuous State`将状态提到队列前端
- 在下一次循环前处理异步消息

#### 完整使用示例

```labview
// 定义数据采集循环
DAQ: Initialize >> {
    // 初始化配置
    
    // 定义循环
    CSMLS - Define Loop State(s).vi
        Loop States: "DAQ: Start\nDAQ: Acquire\nDAQ: Continue Check\nDAQ: Stop\nDAQ: Close"
}

DAQ: Acquire >> {
    // 采集数据
    Acquire Data
}

DAQ: Continue Check >> {
    // 检查是否继续
    If (Continue?) {
        CSMLS - Append Continuous State.vi
            Continuous State: "DAQ: Acquire"
        
        // 添加延时，控制采集频率
        Wait 100ms
    } else {
        // 跳出循环
        CSMLS - Remove Loop Tag to Break.vi
    }
}

DAQ: Stop >> {
    // 停止采集
}

DAQ: Close >> {
    // 释放资源
}

// 外部可以通过发送消息中断循环
API: StopDAQ >> {
    CSMLS - Remove Loop Tag and previous State(s) to Break.vi
}
```

**参考范例**：`Addons - Loop Support\CSMLS - Continuous Loop in CSM Example.vi`

### Attribute Addon

Attribute Addon提供增强的属性访问功能，简化了CSM Attribute的读写操作。

#### 核心功能

**CSM Set Module Attribute.vim**

多态VI，自动适应输入数据类型，无需手动指定类型。

**优点**：
- 自动类型匹配
- 减少错误
- 提高开发效率

**CSM Get Module Attribute.vim**

多态VI，自动适应输出数据类型。

**使用场景**：
- 快速读写模块属性
- 配置管理
- 节点间数据共享（Worker/Chain模式）

## Addon开发指南

### 开发流程

1. **需求分析**
   - 确定Addon的功能和目标
   - 分析现有功能的不足
   - 设计Addon接口

2. **架构设计**
   - 确定Addon类型（参数扩展/功能模块/API扩展）
   - 设计API接口
   - 定义数据结构

3. **实现开发**
   - 实现核心功能
   - 实现API接口
   - 添加错误处理

4. **测试验证**
   - 单元测试
   - 集成测试
   - 性能测试

5. **文档编写**
   - API文档
   - 使用指南
   - 示例代码

6. **发布部署**
   - 打包Addon
   - 发布到社区
   - 维护更新

### 开发规范

#### 命名规范
- Addon VI命名：`CSM-Addon-*.vi`或`CSM*.vi`
- API命名：清晰描述功能
- 参数命名：符合LabVIEW规范

#### 接口规范
- 提供清晰的API接口
- 参数类型明确
- 错误处理完善
- 文档完整

#### 性能要求
- 避免阻塞操作
- 内存使用合理
- 响应时间快速

### 注册机制

#### 自动注册
将Addon VI放置在CSM目录下，CSM框架会自动发现并注册。

**命名要求**：
- `CSM-Addon-*.vi`格式
- 或放在特定目录

**发现机制**：
- CSM启动时扫描目录
- 加载符合命名规范的VI
- 自动注册到框架

#### 手动注册
通过调用CSM API手动注册Addon。

**适用场景**：
- 需要动态加载Addon
- Addon不在标准目录
- 需要条件性加载

### 调试方法

1. **使用全局日志**
   - 记录Addon的运行日志
   - 追踪调用链

2. **使用调试工具**
   - CSM Debug Console测试API
   - 查看状态变化

3. **单元测试**
   - 编写测试用例
   - 验证各种场景

## Addon使用最佳实践

### 选择合适的Addon

根据需求选择或开发Addon：
- **大数据传递**: MassData Support
- **多参数API**: API String Arguments Support
- **配置管理**: INI-Variable Support
- **日志记录**: File Logger Addon
- **循环操作**: Loop Support Addon

### 性能优化

1. **合理使用缓存**：避免重复计算
2. **异步操作**：耗时操作使用异步
3. **资源管理**：及时释放不用的资源

### 错误处理

1. **完善错误检查**：验证输入参数
2. **错误传播**：使用Error Cluster
3. **错误记录**：记录到全局日志

## Addon示例项目

可以参考以下开源Addon项目：

1. **MassData Support**
   - GitHub: https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support
   - 功能：高效传递大数据
   - 适用：数组、波形、图像等

2. **API String Arguments Support**
   - GitHub: https://github.com/NEVSTOP-LAB/CSM-API-String-Arugments-Support
   - 功能：纯文本多参数
   - 适用：复杂API调用

3. **INI-Variable Support**
   - GitHub: https://github.com/NEVSTOP-LAB/CSM-INI-Static-Variable-Support
   - 功能：配置文件变量
   - 适用：配置管理

更多Addon请访问CSM社区。

# Template 接口

Template接口用于扩展CSM框架的模板系统，允许开发者创建自定义的CSM模块模板，提高开发效率和代码标准化。

## 模板系统概述

### 模板的作用

1. **快速创建**：通过模板快速创建标准化的CSM模块
2. **代码规范**：确保团队内代码风格和结构一致
3. **最佳实践**：将最佳实践固化到模板中
4. **降低门槛**：新手也能快速创建符合规范的模块

### 模板分类

#### 1. Event-based Template (事件模板)
基于事件结构的CSM模块模板，适合需要UI交互的模块。

**特点**：
- 包含事件结构处理用户操作
- 分离UI循环和CSM循环
- 适合复杂的用户界面

#### 2. No-Event Template (非事件模板)
纯粹的CSM状态机模板，适合后台服务模块。

**特点**：
- 单一CSM循环
- 无UI交互
- 适合后台任务和服务

#### 3. DQMH-Style Template (DQMH风格模板)
类似DQMH架构的CSM模板，分离UI和业务逻辑。

**特点**：
- UI循环和CSM循环分离
- 通过消息通讯
- 适合大型应用

## 已有的模板

### 1. CSM Basic Template
最基础的CSM模块模板，适合初学者和简单场景。

**包含**：
- 基本的状态机结构
- Macro: Initialize和Macro: Exit
- 响应和错误处理状态

**适用场景**：
- 后台服务模块
- 简单的业务逻辑
- 学习CSM框架

### 2. CSM UI Template  
带UI的CSM模块模板，适合需要用户交互的模块。

**包含**：
- 事件结构处理UI操作
- CSM状态机结构
- UI和业务逻辑分离

**适用场景**：
- 用户界面模块
- 需要UI反馈的功能
- 交互式应用

### 3. CSM DQMH-Style Template
DQMH风格的CSM模块模板，适合复杂应用。

**包含**：
- 完整的UI循环
- 独立的CSM循环
- 消息转发机制

**适用场景**：
- 大型应用
- 需要清晰的架构分层
- 团队协作开发

### 4. CSM API String Template
支持API String参数的CSM模板。

**包含**：
- API String参数解析
- 多参数支持
- 标准的CSM结构

**适用场景**：
- 需要复杂参数传递
- API接口丰富的模块
- 与其他系统集成

## 模板开发指南

### 开发流程

1. **确定模板类型**
   - 分析目标场景
   - 选择基础模板类型
   - 确定特殊需求

2. **设计模板结构**
   - 定义标准状态
   - 设计错误处理
   - 规划代码组织

3. **实现模板VI**
   - 创建模板VI
   - 实现基本功能
   - 添加注释和文档

4. **测试模板**
   - 使用模板创建示例
   - 验证功能完整性
   - 测试各种场景

5. **注册和发布**
   - 将模板放在指定位置
   - 编写使用文档
   - 分享给社区

### 模板开发规范

#### 代码规范
- 清晰的状态命名
- 完善的错误处理
- 详细的注释说明
- 统一的代码风格

#### 结构规范
- 标准的初始化流程
- 一致的退出处理
- 规范的API命名
- 清晰的广播定义

#### 文档规范
- 模板使用说明
- 参数说明
- 修改指南
- 示例代码

### 模板最佳实践

1. **保持简洁**：模板应简洁明了，不包含业务逻辑
2. **充分注释**：添加详细的注释，指导使用者修改
3. **标准化**：遵循CSM的标准和最佳实践
4. **可扩展**：设计时考虑扩展性
5. **示例齐全**：提供丰富的使用示例

## 使用模板

### 使用步骤

1. **选择模板**：根据需求选择合适的模板
2. **创建VI**：使用模板创建新的VI
3. **修改名称**：修改模块名称和描述
4. **实现功能**：添加具体的业务逻辑
5. **测试验证**：测试模块功能

### 模板定制

可以基于现有模板创建定制模板：
- 添加公司标准
- 集成常用Addon
- 预置常用API
- 固化最佳实践

## 模板注册

### 自动发现
将模板VI放在LabVIEW的模板目录，LabVIEW会自动发现。

### 手动注册
通过LabVIEW的模板管理器手动注册模板。

更多关于CSM模板的详细信息，请参考[CSM模板文档](./2024-01-08-csm-templates.html)。

# Tools 接口

Tools接口用于扩展CSM框架的调试工具系统，允许开发者创建自定义的调试和开发工具。

## 工具系统概述

CSM工具系统基于全局日志机制，所有工具都通过订阅全局日志来获取系统运行信息。

### 工具分类

#### 1. 运行时监控工具
实时监控CSM应用的运行状态。

**已有工具**：
- CSM Running Log Window
- CSM State Dashboard Window  
- CSM Table Log Window

#### 2. 开发调试工具
辅助开发和调试的工具。

**已有工具**：
- CSM Debug Console
- CSM Interface Browser
- CSM Example Browser

#### 3. 数据查看工具
查看特定数据和状态的工具。

**已有工具**：
- CSM MassData Cache Status Viewer
- CSM INI-Variable Viewer

## 工具入口

CSM调试工具可以通过以下方式打开：

1. **LabVIEW菜单栏**：`Tools` -> `Communicable State Machine(CSM)` -> `Open CSM Tool Launcher...`
2. **CSM函数面板**：`Communicable State Machine(CSM)` -> `CSM Tools`
3. **快捷方式**：可以创建桌面快捷方式

## 工具开发指南

### 开发基础

所有CSM工具都基于全局日志系统开发：

```labview
// 获取全局日志队列
CSM - Global Log Queue.vi
→ Global Log Queue

// 循环处理日志
Loop {
    Dequeue Element (Global Log Queue)
    → Log Data
    
    // 处理日志数据
    Process Log Data
    
    // 更新UI显示
    Update UI
}

// 清理资源
CSM - Destroy Global Log Queue.vi
```

### 开发流程

1. **确定工具功能**
   - 分析需求
   - 确定要监控的信息
   - 设计用户界面

2. **实现日志订阅**
   - 获取全局日志
   - 实现过滤逻辑
   - 处理日志数据

3. **设计用户界面**
   - 清晰的信息展示
   - 友好的交互设计
   - 性能考虑

4. **测试和优化**
   - 测试各种场景
   - 优化性能
   - 完善用户体验

5. **文档和发布**
   - 编写使用文档
   - 注册工具
   - 分享社区

### 工具开发规范

#### 性能要求
- 不应影响被监控系统的性能
- 高效处理日志数据
- 内存使用合理
- UI响应流畅

#### 功能要求
- 提供清晰的信息展示
- 支持日志过滤
- 支持数据导出
- 错误处理完善

#### 用户体验
- 界面友好直观
- 操作简单明了
- 提供帮助文档
- 支持快捷键

### 工具最佳实践

1. **使用队列方式**：比事件方式更高效
2. **实现过滤**：只处理需要的日志
3. **批量处理**：积累一定数量后批量更新UI
4. **动态调整**：根据日志量自动调整处理策略
5. **优雅退出**：确保队列中的日志被处理完

更多关于CSM工具的详细信息，请参考[CSM调试与开发工具](./2024-01-03-csm-Tools.html)。

# 插件开发完整指南

## 插件开发流程总览

```
需求分析 → 架构设计 → 实现开发 → 测试验证 → 文档编写 → 发布维护
```

## 详细开发步骤

### 1. 需求分析

**确定插件类型**：
- 是参数扩展还是功能模块？
- 是全新功能还是改进现有功能？
- 目标用户是谁？

**分析使用场景**：
- 什么情况下需要使用？
- 解决什么问题？
- 有哪些限制条件？

**评估可行性**：
- 技术可行性
- 性能影响
- 兼容性考虑

### 2. 架构设计

**API设计**：
- 定义清晰的接口
- 参数和返回值规范
- 错误处理机制

**数据结构设计**：
- 内部数据结构
- 持久化需求
- 资源管理

**性能设计**：
- 性能目标
- 优化策略
- 资源限制

### 3. 实现开发

**编码规范**：
- 遵循LabVIEW编码规范
- 使用清晰的命名
- 添加详细注释

**错误处理**：
- 完善的错误检查
- 错误传播机制
- 错误日志记录

**资源管理**：
- 正确申请和释放资源
- 避免内存泄漏
- 线程安全考虑

### 4. 测试验证

**单元测试**：
- 测试各个API
- 边界条件测试
- 异常情况测试

**集成测试**：
- 与CSM框架集成测试
- 与其他Addon兼容性测试
- 真实场景测试

**性能测试**：
- 性能基准测试
- 压力测试
- 内存泄漏检测

### 5. 文档编写

**API文档**：
- 每个VI的功能说明
- 参数详细描述
- 返回值说明
- 使用示例

**用户指南**：
- 安装方法
- 基本使用
- 高级功能
- 常见问题

**开发者文档**：
- 架构说明
- 实现原理
- 扩展方法
- 注意事项

### 6. 发布维护

**打包发布**：
- 创建安装包
- 编写版本说明
- 发布到社区

**持续维护**：
- 收集用户反馈
- 修复Bug
- 添加新功能
- 更新文档

## 插件注册和使用

### 插件注册

#### 自动注册方式

1. 将Addon VI命名为`CSM-Addon-*.vi`格式
2. 放置在CSM目录下
3. CSM框架启动时自动发现并注册

#### 手动注册方式

通过调用CSM API手动注册（适用于动态加载场景）。

### 插件使用

#### 安装插件
1. 下载插件VI
2. 复制到CSM目录
3. 重启LabVIEW（或手动注册）

#### 使用插件
1. 在CSM模块中调用插件API
2. 配置插件参数
3. 测试功能

## 插件发布清单

发布插件前的检查清单：

- [ ] 功能完整且稳定
- [ ] 所有测试通过
- [ ] 文档完整详细
- [ ] 示例代码齐全
- [ ] 性能满足要求
- [ ] 与CSM兼容
- [ ] 代码规范符合标准
- [ ] 开源协议明确
- [ ] 版本号正确
- [ ] 发布说明完整

## 插件示例项目

学习插件开发的最佳方式是参考现有项目：

1. **MassData Support**
   - https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support
   - 功能：高效传递大数据
   - 特点：循环缓冲区，高性能

2. **API String Arguments Support**
   - https://github.com/NEVSTOP-LAB/CSM-API-String-Arugments-Support
   - 功能：纯文本多参数
   - 特点：简单易用，灵活

3. **INI-Variable Support**
   - https://github.com/NEVSTOP-LAB/CSM-INI-Static-Variable-Support
   - 功能：配置文件变量
   - 特点：配置管理，动态变量

## 总结

CSM插件机制提供了强大而灵活的扩展能力：

- **Addon接口**：扩展核心功能，添加新的参数类型和功能模块
- **Template接口**：提供标准化的模板，提高开发效率
- **Tools接口**：创建调试工具，增强开发和调试能力

通过插件机制，CSM框架可以不断进化，适应各种应用场景。无论是开发新的Addon，还是创建自定义模板和工具，CSM都提供了完善的支持和文档。

欢迎开发者为CSM社区贡献自己的插件，共同完善CSM生态系统！
