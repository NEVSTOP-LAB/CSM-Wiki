---
title: 插件系统概述
layout: default
parent: 插件系统
nav_order: 1
---

# CSM插件机制

CSM提供三种插件接口来扩展功能：**Addon** 扩展核心能力，**Template** 提供模块模板，**Tools** 提供调试工具。通过这三个接口，你可以给CSM加上各种新功能，定制开发模板，还能开发调试工具。

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

## File Logger Addon

把应用的所有日志保存到文本文件，方便事后分析和排错。日志文件是`.csmlog`格式，普通文本编辑器就能打开。

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

在CSM里实现循环操作，同时不阻塞状态机、能响应外部消息。

**为什么需要Loop Support？**

传统循环方式有问题：在Case里用While循环会卡死状态机，用状态链循环响应不及时。Loop Support让循环运行时仍然能响应其他事件。

**限制**：不适用Worker模式和Chain模式（因为消息无法明确指定节点）。

**核心API**：

1. **CSMLS - Define Loop State(s).vi**：定义循环，用`-><loop>`标记循环状态

```labview
DAQ: Initialize
DAQ: Start
DAQ: Continue Check -><loop>  // 循环标记
DAQ: Stop
DAQ: Close -><end>             // 自动添加
```

2. **CSMLS - Append Continuous State.vi**：添加循环状态，维持循环

3. **CSMLS - Remove Loop Tag and previous State(s) to Break.vi**：立即跳出循环

4. **CSMLS - Remove Loop Tag to Break.vi**：完成当前状态后跳出循环

**响应机制**：
- 同步消息优先级高，立即打断循环
- 异步消息插入到`-><end>`后，下次循环前处理

**完整示例**：

```labview
DAQ: Initialize >> {
    // 定义循环
    CSMLS - Define Loop State(s).vi
        Loop States: "DAQ: Start\nDAQ: Acquire\nDAQ: Continue Check\nDAQ: Stop\nDAQ: Close"
}

DAQ: Acquire >> {
    // 采集数据
    Acquire Data
}

DAQ: Continue Check >> {
    If (Continue?) {
        CSMLS - Append Continuous State.vi
            Continuous State: "DAQ: Acquire"
        Wait 100ms
    } else {
        CSMLS - Remove Loop Tag to Break.vi
    }
}

// 外部消息中断循环
API: StopDAQ >> {
    CSMLS - Remove Loop Tag and previous State(s) to Break.vi
}
```

**参考**：`Addons - Loop Support\CSMLS - Continuous Loop in CSM Example.vi`

## Attribute Addon

简化Attribute读写操作的多态VI，自动适应数据类型，不用手动指定类型。

- **CSM Set Module Attribute.vim**：多态写入
- **CSM Get Module Attribute.vim**：多态读取

用于快速读写模块属性、配置管理、Worker/Chain模式的节点间数据共享。

## 开发自己的Addon

**开发流程**：需求分析 → 架构设计 → 实现 → 测试 → 文档 → 发布

**命名规范**：
- Addon VI：`CSM-Addon-*.vi`或`CSM*.vi`
- API命名清晰，参数类型明确
- 完善错误处理和文档

**注册方式**：

1. **自动注册**：把Addon VI放到CSM目录，命名为`CSM-Addon-*.vi`，框架会自动发现
2. **手动注册**：通过API手动注册（动态加载时用）

**最佳实践**：
- 避免阻塞操作，内存使用合理
- 使用全局日志记录运行信息
- 用CSM Debug Console测试API
- 编写完整的测试用例

**参考项目**：
- [MassData Support](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)
- [API String Arguments Support](https://github.com/NEVSTOP-LAB/CSM-API-String-Arugments-Support)
- [INI-Variable Support](https://github.com/NEVSTOP-LAB/CSM-INI-Static-Variable-Support)

# Template 接口

Template让你快速创建标准化的CSM模块，提高开发效率和代码一致性。

## 模板类型

**Event-based Template（事件模板）**：
- 包含事件结构处理UI操作
- 分离UI循环和CSM循环
- 适合复杂的用户界面

**No-Event Template（非事件模板）**：
- 单一CSM循环
- 无UI交互
- 适合后台任务和服务

**DQMH-Style Template**：
- UI循环和CSM循环完全分离
- 通过消息通讯
- 适合大型应用

## 已有模板

1. **CSM Basic Template**：最基础的模板，适合后台服务和简单业务逻辑
2. **CSM UI Template**：带UI的模板，适合用户交互模块
3. **CSM DQMH-Style Template**：DQMH风格，适合大型应用
4. **CSM API String Template**：支持API String参数，适合复杂参数传递

## 开发自己的模板

**步骤**：确定类型 → 设计结构 → 实现VI → 测试 → 注册发布

**规范要点**：
- 清晰的状态命名和注释
- 标准的初始化和退出流程
- 统一的代码风格
- 详细的使用说明

**最佳实践**：
- 保持简洁，不包含业务逻辑
- 充分注释，指导使用者修改
- 遵循CSM标准和最佳实践
- 提供丰富的使用示例

**使用模板**：
1. 选择合适的模板
2. 创建新VI
3. 修改模块名称
4. 添加业务逻辑
5. 测试验证

更多详情参考[CSM模板文档](../reference/templates)。

# Tools 接口

Tools让你开发调试工具来监控和调试CSM应用。所有工具都基于全局日志机制，通过订阅日志获取系统运行信息。

## 工具分类

**运行时监控工具**：
- CSM Running Log Window
- CSM State Dashboard Window
- CSM Table Log Window

**开发调试工具**：
- CSM Debug Console
- CSM Interface Browser
- CSM Example Browser

**数据查看工具**：
- CSM MassData Cache Status Viewer
- CSM INI-Variable Viewer

## 打开工具

三种方式：
1. LabVIEW菜单：`Tools` → `Communicable State Machine(CSM)` → `Open CSM Tool Launcher...`
2. CSM函数面板：`Communicable State Machine(CSM)` → `CSM Tools`
3. 创建桌面快捷方式

## 开发自己的工具

**基本框架**：

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
- 确定要监控的信息，设计用户界面
- 实现日志订阅和过滤
- 优化性能，不影响被监控系统
- 清晰的信息展示，友好的交互

**性能建议**：
- 使用队列方式（比事件高效）
- 实现过滤，只处理需要的日志
- 批量更新UI
- 根据日志量动态调整策略

更多详情参考[CSM调试与开发工具](./tools)。

# 插件开发完整指南

## 开发流程

```
需求分析 → 架构设计 → 实现开发 → 测试验证 → 文档编写 → 发布维护
```

**1. 需求分析**：确定插件类型、使用场景、评估可行性

**2. 架构设计**：
- API设计：清晰接口、参数规范、错误处理
- 数据结构：内部结构、持久化、资源管理
- 性能设计：性能目标、优化策略、资源限制

**3. 实现开发**：
- 遵循LabVIEW编码规范
- 完善错误检查和传播
- 正确管理资源，避免泄漏

**4. 测试验证**：
- 单元测试：测试各API、边界条件、异常情况
- 集成测试：与CSM框架集成、与其他Addon兼容性
- 性能测试：基准测试、压力测试、内存泄漏检测

**5. 文档编写**：
- API文档：功能说明、参数描述、使用示例
- 用户指南：安装方法、基本使用、常见问题
- 开发者文档：架构说明、实现原理、扩展方法

**6. 发布维护**：
- 打包发布、编写版本说明
- 收集反馈、修复Bug、添加新功能

## 发布清单

- [ ] 功能完整且稳定
- [ ] 所有测试通过
- [ ] 文档完整详细
- [ ] 示例代码齐全
- [ ] 性能满足要求
- [ ] 与CSM兼容
- [ ] 代码规范符合标准
- [ ] 开源协议明确

## 学习参考

参考现有开源项目是最快的学习方式：

1. **[MassData Support](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support)**：循环缓冲区，高性能大数据传递
2. **[API String Arguments Support](https://github.com/NEVSTOP-LAB/CSM-API-String-Arugments-Support)**：简单易用的纯文本多参数
3. **[INI-Variable Support](https://github.com/NEVSTOP-LAB/CSM-INI-Static-Variable-Support)**：配置文件管理和动态变量

# 总结

CSM插件机制提供了三个强大的扩展接口：

- **Addon**：扩展核心功能，添加参数类型和功能模块
- **Template**：提供标准化模板，提高开发效率
- **Tools**：创建调试工具，增强开发能力

通过这些接口，CSM能不断进化、适应各种应用场景。欢迎为CSM社区贡献你的插件！
