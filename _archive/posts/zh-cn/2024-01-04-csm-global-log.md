---
title: CSM全局日志系统
layout: default
nav_order: 25
parent: 基础文档
has_toc: true
---

# CSM全局日志系统
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

CSM全局日志系统是框架内置的调试和监控机制，记录系统运行时的各类事件，帮你快速了解模块交互、状态变化和错误信息。

## 功能概述

全局日志可以记录这些信息：

- **模块状态修改**: 每个状态的执行和参数
- **模块间消息**: 同步/异步消息和返回数据
- **状态发布**: 广播事件的发送
- **模块生命周期**: 创建和销毁
- **状态订阅**: 订阅关系的建立和取消
- **错误信息**: 各类错误事件
- **用户自定义事件**: 你自己添加的日志

基于日志功能可以开发各种调试工具，比如日志窗口、状态仪表板等。

## 获取日志的两种方式

### 队列方式（推荐）

队列方式效率更高，可以批量处理日志，性能最好。使用步骤：

1. 用`CSM - Global Log Queue.vi`获取队列句柄
2. 在循环中用`Dequeue Element`获取日志
3. 处理日志数据
4. 用`CSM - Destroy Global Log Queue.vi`释放资源

### 事件方式

通过LabVIEW用户事件机制接收日志，适合和UI事件一起处理的场景：

1. 用`CSM - Global Log Event.vi`获取事件句柄
2. 在事件结构中注册并处理
3. 用`CSM - Destroy Global Log Event.vi`释放资源

**怎么选？** 独立处理日志用队列方式，要和UI事件混合处理用事件方式。

## 日志过滤

为了减轻系统负担和提高日志可读性，CSM提供了完善的过滤机制。

### 源端过滤 vs 订阅端过滤

**源端过滤**（在CSM框架层设置）：
- 优点：日志源头就不产生，减轻系统负担，对所有订阅者生效
- 缺点：全局生效，影响所有工具
- 适用：确定某些日志都不需要，生产环境屏蔽调试日志

**订阅端过滤**（接收后再判断）：
- 优点：只影响当前订阅者，灵活性高，可动态调整
- 缺点：日志已产生，系统负担未减轻
- 适用：不同工具需要不同日志，开发调试阶段

### 过滤规则类型

#### 1. 全局规则（针对所有模块）

- **模块名称过滤**: 过滤指定模块的所有日志（如".Logger"模块）
- **日志类型过滤**: 过滤特定类型（状态、消息、广播、模块初始化等）
- **状态名称过滤**: 过滤任意模块的特定状态（如所有"Idle"状态）
- **状态类型过滤**: 按状态类型过滤（内部状态、外部消息等）

#### 2. 模块规则（针对特定模块）

- **模块的日志类型**: 过滤指定模块的特定日志类型（如"UIModule"的"广播"日志）
- **状态名称**: 过滤指定模块的特定状态（如"DataAcq"模块的"Read Data"状态）
- **状态类型**: 过滤指定模块的特定状态类型（如"Controller"模块的"外部消息"）

#### 3. 周期过滤规则（仅订阅端，针对高频日志）

- **Threshold (#/s)**: 单位时间内超过此数量视为高频
- **CheckPeriod (s)**: 检查窗口时间
- 示例：10秒内出现超过100次的"Data Updated"状态，折叠显示

### 过滤相关API

- `CSM - Set Log Filter Rules.vi`: 设置源端过滤（多态VI，选最新版本）
- `CSM - List Log Filter Rules As Strings.vi`: 查看当前过滤规则
- `CSM - Filter Global Log.vi`: 订阅端判断日志是否被过滤（多态VI）

## 核心API

### 日志获取

#### CSM - Global Log Queue.vi
获取全局日志的队列句柄。

**输出**: Global Log Queue

**参考**: `4. Advance Examples\Filter From Source(Queue).vi`

#### CSM - Global Log Event.vi
获取全局日志用户事件句柄。

**输出**: 
- CSM Global Log Event
- Timeout In ms (5000ms)

**参考**: `4. Advance Examples\Filter From Source(Event).vi`

### 资源释放

#### CSM - Destroy Global Log Queue.vi
释放队列句柄。

**输入**: Global Log Queue

#### CSM - Destroy Global Log Event.vi
释放事件句柄。

**输入**: 
- CSM Global Log Event
- Force Destroy? (F)
- Timeout In ms (5000ms)

### 日志生成

#### CSM - Global Log Error Handler.vi
将非CSM框架的错误记录到全局日志。

**输入**: 
- Place ("" to Use VI's Name): 错误位置，默认用调用VI的名称
- Clear Error? (T): 是否清除错误

**用途**: 统一记录LabVIEW代码错误，集成第三方库错误

#### CSM - Generate User Global Log.vi
生成自定义用户日志。

**输入**: 
- Log: 事件名称
- Arguments: 事件参数
- From Who: 来源信息
- ModuleName: 模块名称
- Place: 发生地点

**用途**: 记录业务逻辑节点、性能测量点、用户操作、自定义调试信息

**注意**: 输入参数包含错误信息时，会自动调用`CSM - Global Log Error Handler.vi`。

## 工具函数

### 日志转换

#### Global Log To String.vi
将日志数据转为字符串。

#### Global Log To String(Source Time).vi
将日志转为字符串，用发送时间作为时间戳。

**输入**: Log, Format String  
**输出**: Log String

### 日志处理

#### Global Log History Cacher.vi
缓存历史日志字符串，用于调试和显示。

**输入**: 
- Global Log Data
- Length (10000): 最大缓存长度
- Level (Normal): 处理等级，更高等级会省略信息以提高速度
- Time Format String
- With Periodic Info? (T): 是否折叠周期性日志
- Remove Immediately? (F)
- Reset?
- Settings: 周期性日志配置（检测周期、阈值）

**输出**: String Cache

**特性**: 限制缓存长度避免内存溢出，支持周期性日志折叠，多级处理等级

#### Auto Processing Level.vi
根据队列中的日志数量，动态推算推荐的处理等级。

**输入**: 
- #Left In Q: 队列中剩余日志数量
- Debounce Period (5s)
- Period (0.1s)
- Reset? (F)

**输出**: 
- Level: 推荐处理等级
- LogInQ Changing Speed (#/s)
- Since Upgraded (S)

**工作原理**: 日志产生速度超过处理速度时，队列会持续增加。此VI通过监测队列长度变化速度，动态调整处理等级：正常情况用Normal等级显示完整信息，日志堆积时提升等级加快处理，稳定后降低等级。

#### Exit With Empty Queue Check.vi
用于日志监控循环的优雅退出，确保队列中的日志被完整处理。

**输入**: 
- Queue: 队列资源
- Stop: 停止信号
- Timeout (5s)

**输出**: 
- Exit: 真实的退出信号
- Since Exiting (s)

**工作原理**: Stop信号到来时不立即退出，继续处理队列中的剩余日志。只有队列为空或超时后才输出Exit信号。

## 典型应用场景

**调试工具开发**: 实时日志窗口、状态仪表板、消息流图、性能分析器

**问题诊断**: 错误追踪、时序分析、状态追踪、死锁检测

**性能监控**: 消息统计、处理时间分析、瓶颈识别、负载分析

**日志记录**: 操作历史、审计追踪、故障分析、统计报表

## 最佳实践

**合理使用过滤**
- 开发阶段保留更多日志，生产环境适当过滤
- 优先用源端过滤减轻系统负担
- 高频日志用周期过滤规则

**性能考虑**
- 用队列方式获取日志
- 根据日志堆积动态调整处理等级
- 避免在日志处理中执行耗时操作
- 考虑用独立线程处理日志

**自定义日志**
- 在关键业务节点添加日志
- 用清晰的日志名称和参数
- 避免在高频循环中产生日志

**工具开发**
- 提供友好的显示界面
- 支持日志搜索和筛选
- 提供导出和保存功能
- 考虑性能和资源占用

## 参考范例

CSM提供了多个使用范例：

- `4. Advance Examples\Filter From Source(Queue).vi` - 源端过滤（队列）
- `4. Advance Examples\Filter From Source(Event).vi` - 源端过滤（事件）
- `4. Advance Examples\Filter From Subscriber(Queue).vi` - 订阅端过滤（队列）
- `4. Advance Examples\Filter From Subscriber(Event).vi` - 订阅端过滤（事件）
- `template/CSM - Global Log Queue Monitoring Loop.vi` - 队列监控模板
- `template/CSM - Global Log Event Monitoring Loop.vi` - 事件监控模板

## 总结

CSM全局日志系统为调试、监控和问题诊断提供了强大支持。合理使用可以大大提高开发效率，快速定位和解决问题。
