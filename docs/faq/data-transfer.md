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
>
