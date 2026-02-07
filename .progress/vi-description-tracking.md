# VI Description 内容跟踪表

本文件用于跟踪.ref/VI Description(zh-cn)中的所有内容，确保在wiki文档中都有体现。

## 跟踪状态说明
- ✓ 已完全覆盖
- ○ 部分覆盖
- ✗ 未覆盖

## 文件跟踪列表

### 01. Templates (模板) - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 01. Templates.md`
- **Wiki位置**: `_posts/zh-cn/2024-01-08-csm-templates.md`
- **覆盖度**: 约30%
- **已覆盖内容**:
  - CSM模板基本介绍
  - Event Template和No-Event Template
- **待补充内容**:
  - CSM名称规则详解（部分在concepts.md中）
  - 模板支持VIs详细说明
  - 模板错误处理详解
  - 其他代码片段说明

### 02. Core Functions (核心功能) - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 02. Core Functions.md`
- **Wiki位置**: `_posts/zh-cn/2024-01-08-csm-palette-apis.md`
- **覆盖度**: 约60%
- **已覆盖内容**:
  - Parse State Queue++.vi基本说明
  - Build Message相关API
- **待补充内容**:
  - 详细的消息拼接API说明
  - 状态队列操作详解

### 03. Arguments (参数) - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 03. Arguments.md`
- **Wiki位置**: `_posts/zh-cn/2023-12-30-basic.md` (Step4)
- **覆盖度**: 约40%
- **已覆盖内容**:
  - 参数类型概述
  - HEXSTR、ERRSTR简介
- **待补充内容**:
  - 参数处理VI详细说明
  - 各类参数编解码详解
  - 参数使用场景和最佳实践

### 04. Management API (管理接口) - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 04 .Management API.md`
- **Wiki位置**: `_posts/zh-cn/2024-01-08-csm-palette-apis.md`
- **覆盖度**: 约20%
- **已覆盖内容**:
  - CSM工作模式概述（在advance.md中）
- **待补充内容**:
  - Check If Module Exists.vi详解
  - List Modules VI详解
  - 优先级队列设计详解

### 05. Module Operation API (模块操作接口) - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 05. Module Operation API.md`
- **Wiki位置**: `_posts/zh-cn/2024-01-08-csm-palette-apis.md`
- **覆盖度**: 约60%
- **已覆盖内容**:
  - 基本的模块操作API
- **待补充内容**:
  - Wait for Module相关API详解
  - Post Message和Send Message详解

### 06. Broadcast Registration (广播订阅管理) - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 06. Broadcast Registration.md`
- **Wiki位置**: `_posts/zh-cn/2023-12-29-communication.md` (状态订阅部分)
- **覆盖度**: 约70%
- **已覆盖内容**:
  - 订阅机制概述
  - 基本使用方法
- **待补充内容**:
  - Register/Unregister API详细参数说明

### 07. Global Log (全局日志) - ✓ 已完全覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 07. Global Log.md`
- **Wiki位置**: `_posts/zh-cn/2024-01-04-csm-global-log.md`
- **覆盖度**: 100%
- **状态**: 已完成

### 08. Advanced Modes (高级模式) - ✓ 已完全覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 08. Advanced Modes.md`
- **Wiki位置**: `_posts/zh-cn/2023-12-31-advance.md`
- **覆盖度**: 100%
- **状态**: 已完成

### 09. Build-in Addons (内置插件) - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 09. Build-in Addons.md`
- **Wiki位置**: `_posts/zh-cn/2024-01-02-csm-plugin-system.md`
- **覆盖度**: 约30%
- **已覆盖内容**:
  - Addon概述
- **待补充内容**:
  - CSM WatchDog详细说明
  - Attribute Addon详解
  - 其他内置插件说明

### 10. Utility VIs (工具VI) - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 10. Utility VIs.md`
- **Wiki位置**: `_posts/zh-cn/2024-01-08-csm-palette-apis.md`
- **覆盖度**: 约40%
- **待补充内容**:
  - 各类工具VI的详细说明

### 11. Obselete VIs (过时的VI) - ✗ 未覆盖（可选）
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 11. Obselete VIs.md`
- **状态**: 可选择不在主要文档中体现

### 12. Debug,Doc,Tools (调试、文档、工具) - ✓ 已大部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 12. Debug,Doc,Tools.md`
- **Wiki位置**: `_posts/zh-cn/2024-01-03-csm-Tools.md`
- **覆盖度**: 约80%
- **状态**: 基本完成，可选择性补充

### Addon - API String - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - Addon API String.md`
- **Wiki位置**: `_posts/zh-cn/Addons - API String Arguments Support(zh-cn).md`
- **覆盖度**: 约60%
- **待审查**: 需要审查内容完整性和补充应用场景

### Addon - INI-Variable - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - Addon INI-Variable.md`
- **Wiki位置**: `_posts/zh-cn/CSM INI-Variable Support(zh-cn).md`
- **覆盖度**: 约60%
- **待审查**: 需要审查内容完整性和补充应用场景

### Addon - Massdata - ○ 部分覆盖
- **参考文件**: `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - Addon Massdata.md`
- **Wiki位置**: `_posts/zh-cn/Addons - MassData Support(zh-cn).md`
- **覆盖度**: 约60%
- **待审查**: 需要审查内容完整性和补充应用场景

## Examples 跟踪

### CSM Basic Example - ○ 部分使用
- **参考文件**: `.ref/Examples/CSM Basic Example(zh-cn).md`
- **Wiki位置**: `_posts/zh-cn/VI Description(zh-cn)/CSM Basic Example(zh-cn).md`
- **状态**: 已存在，需审查是否需要更新

### CSM Advance Example - ○ 部分使用
- **参考文件**: `.ref/Examples/CSM Advance Example(zh-cn).md`
- **Wiki位置**: `_posts/zh-cn/VI Description(zh-cn)/CSM Advance Example(zh-cn).md`
- **状态**: 已存在，需审查是否需要更新

## 总体统计

- **完全覆盖**: 2个文件
- **部分覆盖**: 12个文件
- **未覆盖**: 1个文件（可选）

## 优先补充顺序

1. **高优先级** (影响基础理解):
   - 03. Arguments (参数)
   - 02. Core Functions (核心功能)
   - 05. Module Operation API (模块操作接口)

2. **中优先级** (完善功能说明):
   - 04. Management API (管理接口)
   - 09. Build-in Addons (内置插件)
   - 01. Templates (模板)

3. **低优先级** (补充细节):
   - 10. Utility VIs (工具VI)
   - Addon文档审查
   - Examples审查
