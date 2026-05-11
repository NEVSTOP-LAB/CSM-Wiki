---
title: 调试排查
layout: default
parent: 常见问题解答
nav_order: 5
---

# 调试排查

## :question: CSM 提供了哪些调试工具？

CSM 提供了完整的调试和开发工具套件，通过 `Tools` → `Communicable State Machine(CSM)` → `Open CSM Tool Launcher...` 打开工具选择器：

- **Running Log Window**：实时显示所有 CSM 事件（状态变化、消息、广播等）
- **State Dashboard**：图形化展示所有模块的当前状态，一眼看清系统运行状况
- **Table Log Window**：以表格形式对比多模块并行状态，适合分析时序关系
- **Debug Console**：交互式测试模块 API，可手动发送消息并查看结果

> 📓
> 更多信息，请参考 [调试工具](https://nevstop-lab.github.io/CSM-Wiki/docs/plugins/tools)。
>

## :question: 如何查看 CSM 运行时的消息流和日志？

CSM 内置了**全局日志系统**，可以记录所有模块的状态变化、模块间消息、广播事件、模块生命周期和错误信息。通过 Running Log Window 工具可以实时查看并过滤这些日志。

也可以通过 API 在代码中获取日志数据，用于开发自定义监控工具：

- **`CSM - Global Log Queue.vi`**：以队列方式获取日志（推荐，效率更高）
- **`CSM - Global Log Event.vi`**：以用户事件方式获取日志（适合与 UI 事件混合处理）

> 📓
> 更多信息，请参考 [全局日志系统](https://nevstop-lab.github.io/CSM-Wiki/docs/basic/global-log) 和 [调试工具](https://nevstop-lab.github.io/CSM-Wiki/docs/plugins/tools)。
>

## :question: 如何单独测试 CSM 模块的 API？

使用 CSM 提供的 **Debug Console（调试控制台）**工具：

1. 启动要测试的 CSM 模块
2. 在 Debug Console 中选中该模块
3. 扫描模块的 API 列表
4. 选择 API、填写参数后发送消息，查看返回结果

> 📓
> 更多信息，请参考 [调试工具 - Debug Console](https://nevstop-lab.github.io/CSM-Wiki/docs/plugins/tools#debug-console调试控制台)。
>
