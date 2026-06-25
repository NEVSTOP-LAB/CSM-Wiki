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
> 更多信息，请参考 [调试工具]({% link docs/plugins/tools.md %})。
>

## :question: 如何查看 CSM 运行时的消息流和日志？

CSM 内置了**全局日志系统**，可以记录所有模块的状态变化、模块间消息、广播事件、模块生命周期和错误信息。通过 Running Log Window 工具可以实时查看并过滤这些日志。

也可以通过 API 在代码中获取日志数据，用于开发自定义监控工具：

- **`CSM - Global Log Queue.vi`**：以队列方式获取日志（推荐，效率更高）
- **`CSM - Global Log Event.vi`**：以用户事件方式获取日志（适合与 UI 事件混合处理）

> 📓
> 更多信息，请参考 [全局日志系统]({% link docs/basic/global-log.md %}) 和 [调试工具]({% link docs/plugins/tools.md %})。
>

## :question: 如何单独测试 CSM 模块的 API？

使用 CSM 提供的 **Debug Console（调试控制台）**工具：

1. 启动要测试的 CSM 模块
2. 在 Debug Console 中选中该模块
3. 扫描模块的 API 列表
4. 选择 API、填写参数后发送消息，查看返回结果

> 📓
> 更多信息，请参考 [调试工具 - Debug Console]({% link docs/plugins/tools.md %}#debug-console调试控制台)。
>

## :question: 日志出现乱码，同时伴随 Unhandled State 或 ERROR42，如何排查？

当 CSM 日志中出现**乱码**，同时伴随 `Unhandled State` 或 `ERROR42` 等错误时，首先应怀疑参数中是否混入了**不可见字符（二进制数据）**。

**常见原因**：

- 将 LabVIEW 内存数据（数值、簇、数组等）直接"平滑（Flatten To String）"后作为 CSM 参数传递
- 将 TCP / UDP / 串口（Serial）等总线收到的**原始字节流**，未经处理直接作为参数传入 CSM

**根本原因**：

LabVIEW 中，内存数据的内部表示看起来就是一段字节串，很容易被误连到 CSM 的参数接线端。但 CSM 在解析参数时，按**可见字符串**的规则进行词法解析。若二进制数据中恰好包含 CSM 关键字（如 `>>`, `-@`, `,` 等），就会导致状态队列解析错误，引发 Unhandled State、ERROR42 及日志乱码等不可预期的问题。

**解决方案**：

将内存数据先编码为可见字符串，再作为 CSM 参数传递；接收方解码还原：

| 数据量 | 推荐方案 | 说明 |
|--------|---------|------|
| 小数据（< 1 KB） | **HEXSTR** | 将数据转为十六进制字符串，CSM 原生内置，无需插件 |
| 大数据（≥ 1 KB，如大数组、波形） | **MassData 插件** | 使用循环缓冲区高效传递大数据，零拷贝 |

- **发送方**：使用 `Flatten To String` → `CSM Build HEXSTR Parameter.vi` 将原始数据编码为 `<HEXSTR>...` 格式
- **接收方**：使用 `CSM Get HEXSTR Parameter.vi` → `Unflatten From String` 还原数据

> 📓
> 更多信息，请参考 [CSM 参数传递]({% link docs/basic/usage.md %}#step4-csm参数传递) 和 [MassData 插件]({% link docs/plugins/massdata.md %})。
>
