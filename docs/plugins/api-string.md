---
title: API String参数支持
layout: default
parent: 插件系统
nav_order: 3
---

# API String参数支持
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

# CSM API String Arguments Support
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

# CSM API String Arguments Support

## 概述

API String参数支持是CSM框架的一个强大插件，增强了通信状态机(CSM)的API参数功能，支持以纯文本格式传递各种数据类型，并特别优化了手动输入体验。

### 设计目标

API String Addon旨在解决以下问题：
1. **参数可读性**：直接在字符串中看到参数值，便于调试
2. **手动输入友好**：支持在调试控制台中手动输入参数
3. **多参数传递**：用一个字符串传递多个参数
4. **类型灵活性**：支持多种数据类型的文本表示

### 主要特点

1. **纯文本格式**：所有参数以纯文本形式表示，易于阅读和编辑
2. **多类型支持**：支持22种以上的数据类型
3. **灵活解析**：支持多种格式表示同一数据
4. **自动类型转换**：根据参考数据类型自动转换
5. **无参数类型标记**：通过`CSM - Argument Type VI`返回空，在默认分支处理
6. **手动输入优化**：支持多种便捷的输入格式

### 工作原理

API String不使用参数类型标记，而是：
1. 接收纯文本字符串作为参数
2. 根据参考数据类型（Prototype）解析
3. 自动转换为目标数据类型
4. 支持部分参数输入（缺失部分使用默认值）

### 与其他参数方式对比

| 特性 | API String | HEXSTR | MassData |
|------|------------|--------|----------|
| 可读性 | 高（纯文本） | 低（十六进制） | 低（地址引用） |
| 手动输入 | 容易 | 困难 | 不可能 |
| 数据量 | 小到中 | 小 | 大 |
| 性能 | 中 | 中 | 高 |
| 调试友好 | 高 | 中 | 低 |
| 适用场景 | API参数、配置 | 复杂结构 | 大数组 |

### 使用场景选择

**使用API String的场景**：
- 需要手动输入参数（调试、测试）
- 参数值需要可读性
- 配置文件中的参数
- 多参数API调用

**使用HEXSTR的场景**：
- 复杂数据结构
- 二进制数据
- 不需要可读性

**使用MassData的场景**：
- 大数据量（>1KB）
- 数组、波形、图像

## 参数类型识别

API String未定义参数类型标记，通过`CSM - Argument Type VI`获取的结果为空，通常在默认分支中处理。

```labview
CSM - Argument Type.vi
  Arguments: "ip:192.168.1.100;port:8080"
  → Type: ""  // 空字符串
  
// 在默认分支处理
Case: Default
  → 使用API String解析
```

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

### TRUE值的默认字符串

支持`1`, `Active`, `Enable`, `Non-null`, `On`, `T`, `True`, `valid`, `yes`
不区分大小写

### FALSE值的默认字符串

支持`0`, `Disable`, `F`, `False`, `Inactive`, `Invalid`, `No`, `Off`, `Void`, `null`
不区分大小写

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

## 1. Empty String to Typical data types.vi

### Overview

本范例展示了CSM API参数中支持的空字符串转换为典型数据类型的示例。空字符串在大多数情况下会被转换为参考数据类型连接的数值。例外场景：

- **String数据类型：**空字符串会被转换为空字符串。

### Introduction

展示不同的空字符串转换为典型数据类型的示例。特别注意String数据类型的例外情况。界面会显示参考值和转换后的值，供用户比较。

### Steps

- step1: 所有的普通类型，空字符串会被转换为参考数据类型连接的数值。
- step2: String 数据类型，空字符串会被转换为空字符串。
- step3: Timestamp 数据类型，空字符串会转换为当前时间。

## 2. CSM API String to Typical datatypes.vi

### Overview

本范例展示了CSM API参数中支持的字符串转换为典型数据类型的示例。

### Introduction

本范例展示了一些典型的字符串转换为典型的数据类型的实例。

### Steps

- step1: 路径字符串转换为path数据类型
- step2: 字符串数据类型的转换
- step3: 典型的Boolean数据类型的描述可以转换为Boolean数据类型。
- step4: i32数据类型转换
- step5: DBL数据类型的转换
- step6: 普通的enum类型转换
- step7: 具有编号的enum数据类型可以只描述枚举字符串，
- step8: 具有编号的enum数据类型转换也可以描述索引编号
- step9: 一维数组类型转换
- step10: Cluster数据类型转换
- step11: Cluster array数据类型转换
- step12: 二维数组类型转换


## 3. Incorrect usage collections.vi

### Overview

本范例演示一些不正确的API String描述情况。

### Instruction

选择**Action**后，运行VI并查看结果，不正确的格式转换后与预期数据不匹配。

### Introduction

Cluster数据类型是重点描述的情况，因为它的情况比较多。通常cluster数据类型的描述格式是：

1. 标签-数据对（Tag:Value）模式
2. 无标签模式

本范例演示了一些不正确的API String描述情况。

## 常见普通类型数据的转换

### Float 类型(4.1 CSM API String to Float.vi)

#### Overview

API String支持的Float格式包括：普通浮点数、科学计数法以及特殊浮点数。本范例演示了这些格式的转换。

#### Introduction

API String支持的Float格式包括：普通浮点数、科学计数法以及特殊浮点数。本范例演示了这些格式的转换。例如以下方式：

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
 - 默认精度为6位有效数字。可以通过API String - Set Float Precision.vi修改精度。
 - 标签-数据对（Tag:Value）可以被正确解析。标签仅用于提高可读性，转换过程中会被忽略。

#### Steps

- step1: 往INF方向的浮点数转换测试
- step2: 往-INF方向的浮点数转换测试
- step3: 10...0 字符串的转换测试

### Float类型，API String 中加入单位 (4.2 Float with Unit CSM API String to Float.vi)

#### Overview

本范例演示API String中包含单位的浮点数转换为浮点数的示例。

#### Introduction

API String带有单位的浮点数字符串也支持正确解析。

如果浮点数字符串与单位字符串之间存在空格，则浮点数后面的所有内容（包括符号）都被识别为单位字符串。
例如：

1.23mA : 浮点数: 1.23m; 单位: A 

1.23 mA : 浮点数: 1.23; 单位: mA

对于科学计数法表示的浮点数，无论是否存在空格，浮点数后面的字符串都被识别为单位字符串。
例如：

1.23E+5mA: 浮点数: 1.23E+5; 单位: mA 

1.23E+5 mA: 浮点数: 1.23E+5; 单位: mA

e、-e、pi、-pi、inf、+inf、-inf和NaN等特殊浮点数值不支持单位。

#### Steps

- step1: 不同情况的浮点数单位转换测试
- step2: API String中的转换依赖于String To Float_csm.vi，可以在函数选板找到这个函数。

### 复数(4.3 CSM API String to Complex Numeric.vi)

#### Overview

本范例用于演示API String对于复数的支持。

#### Introduction

API String支持复数类型。a+bi或a-bi格式表示复数。其中a和b支持所有浮点数的表达方式。

特殊情况说明：
- 空字符串将转换为原型（Prototype）的输入值。
- 标签-数据对（Tag:Value）可以被正确解析。标签仅用于提高可读性，转换过程中会被忽略。

### Timestamp 类型(4.4 CSM API String to TimeStamp.vi)

#### Overview

本范例用于演示API String对于时间戳的支持。

#### Introduction

API String时间戳的标准格式为：`TimeStamp_String(Format_String)`。其中`Format_String`用于解析`TimeStamp_String`。

特殊情况说明:
- 当字符串不包含`Format_String`时，`TimeStamp_String`应符合RFC3339标准格式。
- "`2023-10-31T14:49:39.597Z`" 为有效的表达方式.
- "`2023-10-31T22:49:39.597+08:00`" 为有效的表达方式.
- 对于时间戳，空字符串将转换为当前时间。

#### Steps

- step1: 空字符串转换为当前时间
- step2: 标准格式转换为时间戳
- step3: Timestamp转换为API String，并被正确解析回时间戳数据类型
- step4: TimeStamp_String(Format_String)格式的示例

### Enum 类型(4.5 CSM API String to Enum(special format).vi)

#### Overview

本范例用于演示API String对于枚举类型的支持。

#### Introduction

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

### 5.1 CSM API String to Array.vi

#### Overview

本范例用于演示API String对于数组类型的支持。

#### Introduction

API String中对于Array的定义，逗号(,) 用于元素分隔，分号(;) 用于行分隔。方括号([ 和 ]) 用作边界符号。对于非复杂的混合数据类型，方括号可以省略。

示例：

- `a,b,c,d,e`  `[a,b,c,d,e]`，`[a;b;c;d;e]` 都表示一个包含5个元素的数组：
- `a1, b1, c1, d1, e1; a2, b2, c2, d2, e2` 和 `[a1, b1, c1, d1, e1; a2, b2, c2, d2, e2]` 表示一个 2×5 的二维数组

特殊情况说明:

- 空字符串将转换为原型（Prototype）的输入值。

#### Steps

- step1: 空字符串转换为原型（Prototype）的输入值
- step2: 一维数组转换
- step3: 二维数组转换

### 5.2 Cluster 1D Array to CSM API String.vi

#### Overview

本范例用于演示Cluster 1D Array的CSM API String表达。

#### Introduction

Array是一种复合数据类型，可能包含不同的数据类型，其中以Cluster 最为复杂。本范例将展示1D Cluster Array的CSM API String表达字符串。

### 5.3 Cluster 2D Array to CSM API String.vi

#### Overview

本范例用于演示Cluster 2D Array的CSM API String表达。

#### Introduction

Array是一种复合数据类型，可能包含不同的数据类型，其中以 Cluster 最为复杂。本范例将展示2D Cluster Array的CSM API String表达字符串。

## Cluster 数据类型支持

### 6.1 Cluster to CSM API String.vi

#### Overview

本范例用于演示Cluster的CSM API String表达。

#### Introduction

Cluster是一种复杂类型，它由其他的普通数据类型组成。本范例将展示Cluster的CSM API String表达字符串。在API String中，Cluster可以表达为两种方式。

1. 标签-数据对（Tag:Value）模式

在标签-数据对模式下，输入字符串由多个标签-数据对组成，冒号(:)用于分隔标签和数据，分号(;)用于分隔不同元素。花括号({ 和 })用作边界符号。对于非复杂的混合数据类型，花括号可以省略。

2. 无标签模式

对于簇，也支持仅输入数据字符串，各值之间用分号分隔。

#### Steps

- step1: 标签-数据对（Tag:Value）模式
- step2: 无标签模式

### 6.2 CSM API String to Cluster.vi

#### Overview

本范例用于演示Cluster的CSM API String表达。

#### Introduction

Cluster是一种复杂类型，它由其他的普通数据类型组成。本范例展示Cluster的CSM API String表达字符串。在API String中，Cluster可以表达为两种方式。

1. 标签-数据对（Tag:Value）模式：在标签-数据对模式下，输入字符串由多个标签-数据对组成，冒号(:)用于分隔标签和数据，分号(;)用于分隔不同元素。花括号({ 和 })用作边界符号。对于非复杂的混合数据类型，花括号可以省略。其他规则如下：

   - 标签对应簇中元素的名称，值会根据对应元素的数据类型进行转换。

   - 只需描述需要修改的元素，与数据原型一致的元素可以省略。


   - 通过名称匹配元素，顺序无关紧要。


   - 对于嵌套簇，子簇元素的标签格式为"父簇标签.子簇元素标签"。


   - 嵌套簇中，如果子簇元素的标签名称唯一，可以省略父簇的标签。


2. 无标签模式：对于簇，也支持仅输入数据字符串，各值之间用分号分隔。顺序非常重要。第一个元素值将设置给簇的第一个元素，第二个元素值设置给簇的第二个元素，以此类推。
   - 如果输入字符串的元素数量少于簇的元素数量，剩余的元素将保持不变。
   - 如果输入字符串的元素数量多于簇的元素数量，多余的元素将被忽略。

#### Steps

- step1: 空字符串转换为参考数据
- step2: 可以只通过tag名称修改参考数据中的某个元素数据
- step3：没有标签且个数只有一个的情况下，将直接修改参考数据的第一个元素数据
- step4: 没有标签且个数只有一个的情况下，将直接修改参考数据的第一个元素数据，第一个是Array的情况
- step5: 无标签模式
- step6: 无标签模式，但是元素个数小于全部个数
- step7: 可以只通过tag名称修改参考数据中的某个元素数据
- step8: 无标签模式，但是其中的boolean 数据使用了其他的表达方式
- step9: 无标签模式，但是元素个数大于全部个数
- step10: 多层嵌套下，tag的名称可以包含点号(.)，用于表示嵌套簇的层级, 没有歧义的情况下，可以只写最终元素的名称，或者部分子嵌套层级的名称

## 一些复杂的情况

###  7.1 Complex Cluster in Array.vi

#### Overview

通常Array/Cluster的嵌套是一个复杂的情况，本范例展示复杂的Cluster Array的CSM API String表达字符串。但是这并不是一个典型的推荐使用场景。

###  7.2 Cluster with 2D Array elements.vi

#### Overview

通常Array/Cluster的嵌套是一个复杂的情况，本范例将展示2D Cluster Array的CSM API String表达字符串。但是这并不是一个典型的推荐使用场景。

## 核心API

### 转换API

**Convert API String to Cluster.vim**
- 多态VI，自动适应Cluster类型
- 根据Prototype解析字符串
- 支持部分参数输入

**Convert Cluster to API String.vim**
- 多态VI，自动生成API String
- 支持标签-数据对模式
- 便于生成可读字符串

### Float精度设置

**API String - Set Float Precision.vi**
- 设置浮点数的精度
- 默认6位有效数字
- 影响Float到String的转换

## 应用场景

### 场景1：调试和测试

**需求**：
- 在开发阶段测试API
- 手动输入不同参数
- 快速验证功能

**方案**：
```labview
// 使用CSM Debug Console
Module: DataProcessor
API: Configure
Arguments: "sampleRate:1000; channels:AI0,AI1,AI2; trigger:External"

// 模块内处理
API: Configure >> {
    // 解析参数
    Convert API String to Cluster.vim
      Arguments: API String
      Prototype: Config Cluster
      → Config
    
    // 应用配置
    Apply Configuration(Config)
}
```

**优势**：
- 无需编译，直接测试
- 参数一目了然
- 快速迭代验证

### 场景2：配置文件

**需求**：
- 从配置文件读取参数
- 用户可编辑配置
- 参数可读性好

**方案**：
```ini
[NetworkModule]
connection = "ip:192.168.1.100; port:8080; timeout:5000"
retry = "maxAttempts:3; interval:1000"
```

```labview
// 读取并应用配置
Read INI String
  Section: NetworkModule
  Key: connection
  → Connection String

// 解析并连接
API: Connect >> Connection String -@ NetworkModule
```

**优势**：
- 配置文件可读
- 用户可以手动修改
- 无需二进制解析

### 场景3：多参数API

**需求**：
- API需要多个参数
- 参数类型不同
- 便于调用

**方案**：
```labview
// 定义API
API: CreateReport >> {
    // 参数Cluster
    {
        Title: String
        StartDate: Timestamp
        EndDate: Timestamp
        Format: Enum {PDF, Excel, HTML}
        IncludeImages: Boolean
    }
    
    // 解析API String
    Convert API String to Cluster.vim
      → Report Config
    
    // 生成报告
    Generate Report(Report Config)
}

// 调用示例
API: CreateReport >> "Title:Monthly Report; StartDate:2024-01-01T00:00:00Z; EndDate:2024-01-31T23:59:59Z; Format:PDF; IncludeImages:True" -@ ReportModule
```

**优势**：
- 一次传递多个参数
- 参数名称明确
- 便于维护和修改

### 场景4：与INI-Variable结合

**需求**：
- 配置固化在INI文件
- 运行时动态加载
- 可部分覆盖

**方案**：
```ini
[DAQ]
channels = AI0,AI1,AI2,AI3
sampleRate = 1000
samples = 1000
```

```labview
// 使用INI-Variable Support
Convert API String to Cluster(Default in Session).vim
  Section: DAQ
  Arguments: "channels:AI0,AI1"  // 只覆盖channels
  Prototype: DAQ Config
  → Config  // sampleRate和samples从INI文件读取
```

**优势**：
- 配置管理灵活
- 支持部分覆盖
- 三级优先级：参数 > INI > 默认值

### 场景5：Web接口

**需求**：
- Web前端发送参数
- JSON格式转换
- 传递给CSM模块

**方案**：
```labview
// Web请求: {"ip": "192.168.1.100", "port": 8080}
Parse JSON
  → ip, port

// 构建API String
Format String: "ip:%s;port:%d"
  → API String: "ip:192.168.1.100;port:8080"

// 发送到CSM
API: Configure >> API String -@ NetworkModule
```

**优势**：
- 与Web技术集成
- 格式转换简单
- 保持可读性

## 最佳实践

### 1. 参数命名规范

**建议**：
```labview
// 好的命名
"sampleRate:1000; channelCount:4"
"ipAddress:192.168.1.100; port:8080"

// 避免的命名
"sr:1000; cnt:4"  // 缩写不清晰
"1000;4"  // 无标签，不清晰
```

**原则**：
- 使用完整单词
- 驼峰命名法或下划线
- 见名知意

### 2. 使用标签-数据对模式

**优势**：
- 参数顺序无关
- 只需提供需要的参数
- 易于维护

**示例**：
```labview
// 推荐：标签-数据对
"ip:192.168.1.100; port:8080"

// 可以只提供部分
"port:9090"  // 只修改port

// 顺序无关
"port:8080; ip:192.168.1.100"  // 同样有效
```

### 3. 处理空字符串

**行为**：
- 空字符串 → Prototype值
- Timestamp例外 → 当前时间

**应用**：
```labview
// 利用空字符串获取默认值
API: Configure >> "" -@ Module
// 将使用Prototype中的所有默认值
```

### 4. 复杂数据类型处理

**Cluster嵌套**：
```labview
// 使用点号表示嵌套
"config.network.ip:192.168.1.100"

// 如果名称唯一，可省略父级
"ip:192.168.1.100"  // 如果只有一个ip
```

**Array**：
```labview
// 使用逗号分隔元素
"channels:AI0,AI1,AI2"

// 二维数组使用分号分隔行
"data:1,2,3;4,5,6;7,8,9"  // 3x3数组
```

### 5. 性能考虑

**解析开销**：
- 字符串解析有开销
- 复杂Cluster解析较慢
- 频繁调用考虑缓存

**优化**：
```labview
// 缓存解析结果
Static Variable: Parsed Config

If (Config String Changed?) {
    Convert API String to Cluster.vim
      → Config
    Parsed Config = Config
} else {
    Config = Parsed Config
}
```

### 6. 错误处理

**验证输入**：
```labview
// 检查关键参数
Convert API String to Cluster.vim
  → Config

If (Config.IP = "") {
    // 使用默认IP
    Config.IP = "127.0.0.1"
}

If (Config.Port < 1024 OR Config.Port > 65535) {
    // 无效端口
    Error...
}
```

### 7. 调试技巧

**查看原始值**：
```labview
// 在开发时显示
Display: Arguments String
Convert API String to Cluster.vim
  → Config
Display: Config
```

**使用日志**：
```labview
// 记录API调用
Log: "API: Configure >> " + Arguments
```

### 8. 文档化

**在代码中说明**：
```labview
// API: Configure
// 参数格式：
//   sampleRate (I32): 采样率，1-10000 Hz
//   channels (String): 通道列表，如"AI0,AI1,AI2"
//   trigger (Enum): 触发方式，Internal/External
// 示例：
//   "sampleRate:1000; channels:AI0,AI1; trigger:External"
```

## 常见问题

### Q1: 如何处理包含特殊字符的字符串？

**问题**：参数值中包含冒号、分号等特殊字符

**解决方案**：
1. 使用引号包围：`"text:\"value:with:colons\""`
2. 使用转义：`"text:value\:with\:colons"`
3. 使用HEXSTR：`"<HEXSTR>..."`

### Q2: 性能与HEXSTR比较？

**API String**：
- 解析开销较大
- 适合小到中等数据
- 调试友好

**HEXSTR**：
- 编解码开销
- 适合复杂结构
- 性能相近

**建议**：
- 可读性重要 → API String
- 二进制数据 → HEXSTR
- 大数据 → MassData

### Q3: 如何传递null或空值？

**方法**：
```labview
// 省略该参数（使用默认值）
"ip:192.168.1.100"  // port使用默认值

// 显式传递空字符串
"ip:192.168.1.100; description:\"\""

// Boolean的false
"enabled:false"
"enabled:0"
"enabled:F"
```

### Q4: 与CSM INI-Variable结合使用？

**完美结合**：
```labview
// INI文件
[Module]
ip = 192.168.1.100
port = 8080

// 代码中
Convert API String to Cluster(Default in Session).vim
  Section: Module
  Arguments: "${Module.ip}; port:9090"  // INI变量 + 覆盖
  → Config
```

**优势**：
- 配置灵活
- 支持变量引用
- 三级优先级

## 示例范例说明

本Addon包含丰富的示例范例，涵盖各种数据类型和使用场景。

## 总结

CSM API String Arguments Support Addon提供了友好的参数传递方式：

### 核心优势
- **可读性强**：纯文本，易于理解
- **易于使用**：手动输入友好
- **灵活性高**：支持多种数据类型
- **调试方便**：参数值清晰可见

### 使用建议
1. **调试测试**：首选API String
2. **配置参数**：使用标签-数据对
3. **多参数API**：减少参数数量
4. **与INI结合**：实现灵活配置

### 典型应用
- 手动测试和调试
- 配置文件参数
- Web接口集成
- 多参数API调用

### 更多资源
- **GitHub**: https://github.com/NEVSTOP-LAB/CSM-API-String-Arugments-Support
- **示例代码**：参考本文档中的丰富示例
- **与INI结合**：查看INI-Variable Support文档

通过合理使用API String Addon，可以大大提高CSM应用的可读性和可维护性，特别是在开发和调试阶段。
