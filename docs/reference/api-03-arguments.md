---
title: 参数(Arguments)
layout: default
parent: 参考文档
nav_order: 13
---

# 参数(Arguments)

## CSM - Argument Type.vi
从编码后的参数字符串中提取参数的编码类型标记。

> - Ref: CSM参数类型

-- <b>输入控件(Controls)</b> --
- <b>Arguments</b>: 参数字符串。

-- <b>输出控件(Indicators)</b> --
- <b>Arguments (Dup)</b>: 输入的参数字符串副本。
- <b>Argument Type</b>: 参数字符串的编码类型标记。

## CSM - Keywords.vi
用于罗列CSM消息中的关键字及其%Hex格式。

> - Ref: CSM消息关键字

-- <b>输出控件(Indicators)</b> --
- <b>keywords</b>: CSM关键字列表。
- <b>Keywords (%Hex Format)</b>: CSM关键字列表的%Hex格式。

## CSM - Make String Arguments Safe.vi
将参数字符串中的CSM关键字转换为%Hex格式，确保不影响CSM消息字符串解析。

> - Ref: CSM消息关键字
> - Ref: CSM安全字符串参数

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\4.3 Arguments - Safe Arguments if it contains key words of CSM.vi`。

-- <b>输入控件(Controls)</b> --
- <b>Argument String</b>: 字符串参数。
- <b>Ignore Argument Type(F)</b>: 不添加参数类型标记`SAFESTR`。

-- <b>输出控件(Indicators)</b> --
- <b>Safe Argument String</b>: 安全的字符串参数。

## CSM - Revert Arguments-Safe String.vi
将安全的字符串参数中的%Hex格式的CSM关键字转换回普通格式。

- 当<b>Force Convert (F)</b>为FALSE时，仅当参数类型标记为`SAFESTR`时才进行转换。
- 当<b>Force Convert (F)</b>为TRUE时，无论参数类型标记为何值均进行转换。

> - Ref: CSM消息关键字
> - Ref: CSM安全字符串参数

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\4.3 Arguments - Safe Arguments if it contains key words of CSM.vi`。

-- <b>输入控件(Controls)</b> --
- <b>Safe Argument String</b>:  安全的字符串参数。
- <b>Force Convert (F)</b>: 强制转换，即使参数类型标记不是`SAFESTR`。

-- <b>输出控件(Indicators)</b> --
- <b>Origin Argument String</b>: 字符串参数。

## CSM - Convert Data to HexStr.vi
将LabVIEW任意数据类型转换为HEXSTR格式参数字符串。

> - Ref: CSM参数类型
> - Ref: CSM HEXSTR格式参数

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\4.1 Arguments - Complex Data As Arguments.vi`。

-- <b>输入控件(Controls)</b> --
- <b>Variant</b>: LabVIEW数据，通过变体支持任意数据类型。

-- <b>输出控件(Indicators)</b> --
- <b>HEX String (0-9,A-F)</b>: CSM HEXSTR格式参数。

## CSM - Convert HexStr to Data.vi
将十六进制字符串参数转换回变体数据。

> - Ref: CSM参数类型
> - Ref: CSM HEXSTR格式参数

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\4.1 Arguments - Complex Data As Arguments.vi`。

-- <b>输入控件(Controls)</b> --
- <b>HEX String</b>: CSM HEXSTR格式参数。

-- <b>输出控件(Indicators)</b> --
- <b>Variant</b>: LabVIEW数据，通过变体支持任意数据类型。

## CSM - Convert Error to Argument.vi
将LabVIEW错误簇转换为CSM错误参数格式。

> - Ref: CSM 参数类型
> - Ref: CSM ERRSTR 格式参数

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\4.2 Arguments - Error As Arguments.vi`。

-- <b>输入控件(Controls)</b> --
- <b>Error</b>: LabVIEW错误簇。

-- <b>输出控件(Indicators)</b> --
- <b>Argument</b>: CSM错误参数格式。

## CSM - Convert Argument to Error.vi
将CSM错误参数格式转换为LabVIEW错误簇。

> - Ref: CSM参数类型
> - Ref: CSM ERRSTR格式参数

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\4.2 Arguments - Error As Arguments.vi`。

-- <b>输入控件(Controls)</b> --
- <b>Argument</b>: CSM错误参数格式。

-- <b>输出控件(Indicators)</b> --
- <b>Error</b>: LabVIEW错误簇。
