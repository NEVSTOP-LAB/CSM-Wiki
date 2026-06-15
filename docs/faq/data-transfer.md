---
title: 数据传递
layout: default
parent: 常见问题解答
nav_order: 3
---

# 数据传递

## :question: CSM 如何传递复杂数据（如大数组、波形）？

CSM 仅支持字符串类型参数，但可以通过以下方式传递各种数据：

| 方式 | 适用场景 |
|------|---------|
| 纯字符串 | 简单文本、数值、文件路径 |
| SAFESTR | 包含 CSM 关键字或特殊字符的字符串 |
| HEXSTR | 任意 LabVIEW 数据类型（数组、簇等），适合 <1KB 数据 |
| ERRSTR | LabVIEW 错误簇 |
| [MassData](https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support) 插件 | 大数组、波形等大数据（>1KB） |

> 📓
> 详细信息，请参考 [CSM 参数传递]({% link docs/basic/usage.md %}#step4-csm参数传递)。

### :question: Hexstr 和 API String 之间有什么区别？又有什么关系？

**一句话结论**：HEXSTR 是一种底层、通用的二进制序列化方案，用于在 CSM 消息中传递任意 LabVIEW 数据类型；API String 则是一种更上层、可读性更高的参数传递方式。两者是「底层通用方案」与「上层友好封装」的关系。

| 对比维度 | HEXSTR | API String |
|---------|--------|------------|
| 数据表示 | 纯十六进制字符串（不可读） | 纯文本（可读性高） |
| 手动输入 | 困难，需工具转换 | 容易，直接写数字/字符串/布尔值 |
| 支持的数据类型 | 任意 LabVIEW 数据类型（通过变体序列化） | 常用类型（字符串、路径、布尔、数值、枚举、簇、数组等）；**不支持**句柄、引用等无法用字符串表示的内存格式 |
| 性能 | 中等（变体转换开销） | 中等（文本解析开销） |
| 调试难度 | 高（需解码查看原始数据） | 低（直接看字符串即知含义） |
| 适用场景 | 复杂结构、小数据（<1KB） | API 参数、配置数据、手动测试 |

**关系**：API String 在内部使用 HEXSTR 作为兜底方案 —— 对于常用数据类型提供直观的文本表示（如 `1000`、`"AI0,AI1"`、`True`），但对于 API String 不直接支持的类型（如句柄、引用），会自动将其编码为 `<HEXSTR>十六进制字符串` 的形式，从而保证任意数据类型都能传递。因此，大部分情况下无需关心 HEXSTR 的存在，框架会自动处理转换。

**如何选择**：
- 需要手动输入参数进行测试，或参数主要是简单类型 → 优先使用 **API String**
- 传递的是复杂结构且数据量 <1KB → 可直接使用 **HEXSTR**，或继续使用 API String（自动兜底）
- 数据量 >1KB（大数组、图像等） → 应使用 **MassData** 以获得更高性能

📓 参考链接：[Discussion #82](https://github.com/orgs/NEVSTOP-LAB/discussions/82)，[API String 支持文档]({% link docs/reference/api-addon-api-string.md %})
