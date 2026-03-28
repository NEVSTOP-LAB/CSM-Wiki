---
title: API String参数支持
layout: default
parent: 插件系统
nav_order: 3
---

# API String参数支持

## 概述

API String参数支持是CSM框架的参数传递插件，以纯文本格式传递各种数据类型，特别适合调试控制台中手动输入和多参数API调用。

API String不使用参数类型标记（[`CSM - Argument Type.vi`]({% link docs/reference/api-03-arguments.md %}#csm-argument-typevi)返回空，在默认分支处理），而是根据参考数据类型（Prototype）自动将纯文本字符串解析转换为目标数据类型，支持部分参数输入（缺失部分使用默认值）。

### 与其他参数方式对比

| 特性 | API String | HEXSTR | MassData |
|------|------------|--------|----------|
| 可读性 | 高（纯文本） | 低（十六进制） | 低（地址引用） |
| 手动输入 | 容易 | 困难 | 不可能 |
| 数据量 | 小到中 | 小 | 大 |
| 性能 | 中 | 中 | 高 |
| 调试友好 | 高 | 中 | 低 |
| 适用场景 | API参数、配置 | 复杂结构 | 大数组 |

### 支持的数据类型

- 字符串(String)
- 路径(Path)
- 布尔值(Boolean)
- 标签(Tag)
- 引用号(Refnum，包括IVI/VISA/UserDefinedRefnumTag)
- 整数(I8, I16, I32, I64, U8, U16, U32, U64)
- 浮点数(DBL/SGL)
- 复数(DBL/SGL)
- 时间戳(Timestamp)
- 枚举(Enum)
- 数组(Array)
- 簇(Cluster)
- 其他类型(使用 CSM-Hexstr 表示)

### Boolean值的字符串表示

**TRUE值**：`1`, `Active`, `Enable`, `Non-null`, `On`, `T`, `True`, `valid`, `yes`（不区分大小写）

**FALSE值**：`0`, `Disable`, `F`, `False`, `Inactive`, `Invalid`, `No`, `Off`, `Void`, `null`（不区分大小写）

### 浮点数默认格式

浮点数默认格式为`%.6p`。

### 带索引的枚举类型(Indexed Enum)

格式为`[索引编号(index)][分隔符(separator)][枚举字符串]`，索引编号支持多种数值表示方式

索引编号使用`==`分隔符示例:
`1 == boolean | 2 == string | 4 == dbl | 8 == number`

索引编号使用`--`分隔符示例:
`0x01 -- boolean | 0x02 -- string | 0x04 -- dbl | 0x08 -- number`

索引编号使用`__`分隔符示例:
`0b0001 __ boolean | 0b0100 __ dbl | 0b1000 __ number`

## 示例范例

### 1. Empty String to Typical data types.vi

展示空字符串转换为典型数据类型的行为。空字符串在大多数情况下会被转换为参考数据类型连接的数值，例外情况：String数据类型转换为空字符串，Timestamp数据类型转换为当前时间。

### 2. CSM API String to Typical datatypes.vi

展示典型字符串到各数据类型的转换，包括：路径、字符串、Boolean、I32、DBL、普通Enum、带索引Enum、一维数组、Cluster、Cluster Array和二维数组。

### 3. Incorrect usage collections.vi

演示不正确的API String描述情况。Cluster数据类型是重点场景，因为它支持标签-数据对（Tag:Value）和无标签两种模式，格式错误容易导致转换结果与预期不匹配。

## 常见普通类型数据的转换

### Float 类型(4.1 CSM API String to Float.vi)

API String支持的Float格式包括：普通浮点数、科学计数法以及特殊浮点数。

```
  - 1.2345
  - 1.23E+2
  - 1.23E-2
  - 1.23Y (1.23×10^24)
  - 1.23Z (1.23×10^21)
  - 1.23E (1.23×10^18)
  - 1.23P (1.23×10^15)
  - 1.23T (1.23×10^12)
  - 1.23G (1.23×10^9)
  - 1.23M (1.23×10^6)
  - 1.23k (1.23×10^3)
  - 1.23m (1.23×0.001)
  - 1.23u (1.23×0.000001)
  - 1.23n (1.23×10^-9)
  - 1.23p (1.23×10^-12)
  - 1.23f (1.23×10^-15)
  - 1.23a (1.23×10^-18)
  - 1.23z (1.23×10^-21)
  - 1.23y (1.23×10^-24)
  - 特殊浮点数值: `e`,`-e`,`pi`,`-pi`,`inf`,`+inf`,`-inf`,`NaN`
```

注意：
 - 空字符串将转换为原型（Prototype）的输入值。
 - 默认精度为6位有效数字。可以通过[`API String - Set Float Precision.vi`]({% link docs/reference/api-addon-api-string.md %}#api-string---set-float-precisionvi)修改精度。
 - 标签-数据对（Tag:Value）可以被正确解析。标签仅用于提高可读性，转换过程中会被忽略。

### Float类型，API String 中加入单位 (4.2 Float with Unit CSM API String to Float.vi)

API String带有单位的浮点数字符串也支持正确解析。关键规则：

如果浮点数字符串与单位字符串之间存在空格，则浮点数后面的所有内容（包括符号）都被识别为单位字符串。
例如：

1.23mA : 浮点数: 1.23m; 单位: A 

1.23 mA : 浮点数: 1.23; 单位: mA

对于科学计数法表示的浮点数，无论是否存在空格，浮点数后面的字符串都被识别为单位字符串。
例如：

1.23E+5mA: 浮点数: 1.23E+5; 单位: mA 

1.23E+5 mA: 浮点数: 1.23E+5; 单位: mA

e、-e、pi、-pi、inf、+inf、-inf和NaN等特殊浮点数值不支持单位。

### 复数(4.3 CSM API String to Complex Numeric.vi)

API String支持复数类型，格式为a+bi或a-bi，其中a和b支持所有浮点数的表达方式。

- 空字符串将转换为原型（Prototype）的输入值。
- 标签-数据对（Tag:Value）可以被正确解析，标签仅用于提高可读性。

### Timestamp 类型(4.4 CSM API String to TimeStamp.vi)

API String时间戳的标准格式为：`TimeStamp_String(Format_String)`。其中`Format_String`用于解析`TimeStamp_String`。

- 当字符串不包含`Format_String`时，`TimeStamp_String`应符合RFC3339标准格式。
- "`2023-10-31T14:49:39.597Z`" 为有效的表达方式.
- "`2023-10-31T22:49:39.597+08:00`" 为有效的表达方式.
- 空字符串将转换为当前时间。

### Enum 类型(4.5 CSM API String to Enum(special format).vi)

API String Enum 定义为[索引编号(index)\][枚举字符串\]格式的字符串。

- 索引编号支持NUMERIC类型的所有表达方式。例如：0x01,0b0001。
- 分隔符（separator）支持 =、-、_ 三种字符，重复个数不限。

转换规则：

- 转换规则1: 当没有索引编号时，通过字符串匹配进行转换。
- 转换规则2: 当包含索引编号时，既可以通过字符串匹配转换，也可以通过索引编号匹配转换。

示例1： 无索引编号的转换规则
```
示例：Enum = {AAA, BBBB, CCCC}

字符串 "AAA" 将转换为 Enum(AAA)，数字值为 0
字符串 "CCC" 将转换为 Enum(CCC)，数字值为 2
```

示例2： 有索引编号的转换规则
```
示例：Enum = {1- AAA, 5 - BBBB, 9 - CCCC}

字符串 "AAA" 将转换为 Enum(1- AAA)，数字值为 0
字符串 "5" 将转换为 Enum(5 - BBBB)，数字值为 1
字符串 "9 - CCCC" 将转换为 Enum(9 - CCCC)，数字值为 2
```

## Array 数据类型的支持

API String中，逗号(,)用于元素分隔，分号(;)用于行分隔。方括号([ 和 ])用作边界符号，对于非复杂的混合数据类型可以省略。

示例：

- `a,b,c,d,e`  `[a,b,c,d,e]`，`[a;b;c;d;e]` 都表示一个包含5个元素的数组：
- `a1, b1, c1, d1, e1; a2, b2, c2, d2, e2` 和 `[a1, b1, c1, d1, e1; a2, b2, c2, d2, e2]` 表示一个 2×5 的二维数组

空字符串将转换为原型（Prototype）的输入值。

### 5.1 CSM API String to Array.vi

演示一维和二维数组的API String转换。

### 5.2 Cluster 1D Array to CSM API String.vi

展示1D Cluster Array的CSM API String表达字符串。Cluster Array是Array中最复杂的情况。

### 5.3 Cluster 2D Array to CSM API String.vi

展示2D Cluster Array的CSM API String表达字符串。

## Cluster 数据类型支持

Cluster由多种普通数据类型组成，在API String中支持两种表达方式：

**1. 标签-数据对（Tag:Value）模式**

冒号(:)分隔标签和数据，分号(;)分隔不同元素。花括号({ 和 })用作边界符号，对于非复杂的混合数据类型可以省略。

规则：
- 标签对应簇中元素的名称，值会根据对应元素的数据类型进行转换
- 只需描述需要修改的元素，与数据原型一致的元素可以省略
- 通过名称匹配元素，顺序无关紧要
- 嵌套簇中，子簇元素的标签格式为"父簇标签.子簇元素标签"
- 如果子簇元素的标签名称唯一，可以省略父簇的标签

**2. 无标签模式**

仅输入数据字符串，各值之间用分号分隔。顺序与簇中元素顺序对应。
- 元素数量少于簇的元素数量时，剩余元素保持不变
- 元素数量多于簇的元素数量时，多余元素被忽略

### 6.1 Cluster to CSM API String.vi

演示Cluster到CSM API String的转换，包括标签-数据对模式和无标签模式。

### 6.2 CSM API String to Cluster.vi

演示CSM API String到Cluster的转换。包含以下场景：空字符串转换、通过tag名称修改单个元素、无标签模式、部分元素修改、多层嵌套下的点号(.)标签表示。

## 一些复杂的情况

###  7.1 Complex Cluster in Array.vi

展示复杂Cluster Array的CSM API String表达。这不是典型的推荐使用场景。

###  7.2 Cluster with 2D Array elements.vi

展示包含2D Array元素的Cluster的CSM API String表达。这不是典型的推荐使用场景。

## 核心API

**Convert API String to Cluster.vim** — 多态VI，根据Prototype解析字符串并自动转换为对应Cluster类型，支持部分参数输入。

**Convert Cluster to API String.vim** — 多态VI，将Cluster转换为标签-数据对格式的可读API String。

**[`API String - Set Float Precision.vi`]({% link docs/reference/api-addon-api-string.md %}#api-string---set-float-precisionvi)** — 设置浮点数精度，默认6位有效数字。

## 应用场景

### 调试和测试

在开发阶段，可以通过CSM Debug Console直接手动输入API String参数进行测试，无需编译：

```labview
// 使用CSM Debug Console
Module: DataProcessor
API: Configure
Arguments: "sampleRate:1000; channels:AI0,AI1,AI2; trigger:External"

// 模块内处理
API: Configure >> {
    Convert API String to Cluster.vim
      Arguments: API String
      Prototype: Config Cluster
      → Config
    
    Apply Configuration(Config)
}
```

### 配置文件参数

API String格式天然适合配置文件，用户可直接编辑：

```ini
[NetworkModule]
connection = "ip:192.168.1.100; port:8080; timeout:5000"
retry = "maxAttempts:3; interval:1000"
```

### 与INI-Variable结合

通过INI-Variable Support插件，可以实现三级优先级配置：参数 > INI > 默认值。

```labview
Convert API String to Cluster(Default in Session).vim
  Section: DAQ
  Arguments: "channels:AI0,AI1"  // 只覆盖channels
  Prototype: DAQ Config
  → Config  // sampleRate和samples从INI文件读取
```

## 最佳实践

### 使用标签-数据对模式

推荐使用Tag:Value模式，参数顺序无关，且只需提供需要修改的参数：

```labview
// 推荐：标签-数据对
"ip:192.168.1.100; port:8080"

// 可以只提供部分参数
"port:9090"  // 只修改port，其他保持默认值

// 顺序无关
"port:8080; ip:192.168.1.100"  // 同样有效
```

### 复杂数据类型处理

**Cluster嵌套**：使用点号表示层级，名称唯一时可省略父级。

```labview
"config.network.ip:192.168.1.100"
"ip:192.168.1.100"  // 如果名称唯一
```

**Array**：逗号分隔元素，分号分隔行。

```labview
"channels:AI0,AI1,AI2"
"data:1,2,3;4,5,6;7,8,9"  // 3x3二维数组
```

## 常见问题

### Q1: 如何处理包含特殊字符的字符串？

参数值中包含冒号、分号等特殊字符时：
1. 使用引号包围：`"text:\"value:with:colons\""`
2. 使用转义：`"text:value\:with\:colons"`
3. 使用HEXSTR：`"<HEXSTR>..."`

### Q2: 如何传递null或空值？

```labview
// 省略该参数（使用默认值）
"ip:192.168.1.100"  // port使用默认值

// 显式传递空字符串
"ip:192.168.1.100; description:\"\""

// Boolean的false
"enabled:false"  // 也支持 "0", "F", "Off" 等
```

## 更多资源

- **GitHub**: https://github.com/NEVSTOP-LAB/CSM-API-String-Arugments-Support
- **API参考**：[API String Addon参考文档]({% link docs/reference/api-addon-api-string.md %})
- **INI-Variable结合**：[INI-Variable参数支持]({% link docs/plugins/ini-variable.md %})
