# CSM API String Arguments Support

## 概述

API String支持纯文本格式传递各种数据类型，优化手动输入体验。未定义参数类型（Argument Type为空），通常在默认分支处理。

### 支持的数据类型

String、Path、Boolean、Tag、Refnum、整数(I8/I16/I32/I64/U8/U16/U32/U64)、浮点数(DBL/SGL)、复数、Timestamp、Enum、Array、Cluster、其他类型(CSM-Hexstr)

### 布尔值/浮点数/枚举

- TRUE值：`1`, `Active`, `Enable`, `On`, `True`, `yes`等（不区分大小写）
- FALSE值：`0`, `Disable`, `False`, `Off`, `null`等（不区分大小写）
- 浮点数默认格式：`%.6p`（6位有效数字）
- 带索引枚举：`[index][separator][string]`，分隔符支持`=`、`-`、`_`（可重复）
  - 示例：`1==boolean | 2==string | 4==dbl`

### 通用注意事项

- 空字符串转换为原型（Prototype）值，String和Timestamp除外（String为空，Timestamp为当前时间）
- 标签-数据对（Tag:Value）可被正确解析，标签仅用于提高可读性
- Array用`,`分隔元素，`;`分隔行，方括号`[]`可选
- Cluster用`:`分隔标签和值，`;`分隔元素，花括号`{}`可选

## 1. 空字符串转换 (Empty String to Typical data types.vi)

展示空字符串转换规则。UI显示原值和转换值对比。

## 2. 典型类型转换 (CSM API String to Typical datatypes.vi)

支持Path、String、Boolean、I32、DBL、枚举、一维/二维数组、Cluster、Cluster array等类型转换。

## 3. 错误用法集锦 (Incorrect usage collections.vi)

演示不正确的API String格式。重点：Cluster数据类型支持两种模式（标签-数据对、无标签模式）。

## 4. 常见类型详解

### 4.1 Float类型 (CSM API String to Float.vi)

支持格式：
- 普通浮点数：`1.2345`
- 科学计数法：`1.23E+2`, `1.23E-2`
- 工程计数法：`1.23k`(×10³), `1.23M`(×10⁶), `1.23G`(×10⁹), `1.23m`(×0.001), `1.23u`(×10⁻⁶), `1.23n`(×10⁻⁹)等
- 特殊值：`e`, `pi`, `inf`, `-inf`, `NaN`

精度可通过`API String - Set Float Precision.vi`修改。

### 4.2 带单位Float (Float with Unit CSM API String to Float.vi)

支持单位解析：
- 无空格：`1.23mA` → 浮点数1.23m，单位A
- 有空格：`1.23 mA` → 浮点数1.23，单位mA
- 科学计数法：无论是否有空格，后面都是单位（`1.23E+5mA` → 浮点数1.23E+5，单位mA）
- 特殊值不支持单位

转换依赖`String To Float_csm.vi`。

### 4.3 复数 (CSM API String to Complex Numeric.vi)

格式：`a+bi`或`a-bi`，其中a和b支持所有浮点数表达方式。

### 4.4 Timestamp (CSM API String to TimeStamp.vi)

标准格式：`TimeStamp_String(Format_String)`
- 无Format_String时，需符合RFC3339格式：`2023-10-31T14:49:39.597Z`或`2023-10-31T22:49:39.597+08:00`
- 空字符串转换为当前时间

### 4.5 Enum (CSM API String to Enum(special format).vi)

格式：`[index][separator][string]`
- 索引编号支持所有数值表达方式（0x01、0b0001等）
- 分隔符支持`=`、`-`、`_`（重复个数不限）

转换规则：
- 无索引：通过字符串匹配
- 有索引：既可通过字符串匹配，也可通过索引匹配

示例：
```
Enum = {1-AAA, 5-BBBB, 9-CCCC}
"AAA" → Enum(1-AAA)，值为0
"5" → Enum(5-BBBB)，值为1
"9-CCCC" → Enum(9-CCCC)，值为2
```

## 5. Array支持

### 5.1 Array转换 (CSM API String to Array.vi)

格式：`,`分隔元素，`;`分隔行，方括号`[]`可选

示例：
- `a,b,c,d,e`或`[a,b,c,d,e]` → 5元素数组
- `a1,b1,c1;a2,b2,c2` → 2×3二维数组

### 5.2 Cluster 1D Array (Cluster 1D Array to CSM API String.vi)

展示1D Cluster Array的API String表达。

### 5.3 Cluster 2D Array (Cluster 2D Array to CSM API String.vi)

展示2D Cluster Array的API String表达。

## 6. Cluster支持

### 6.1 Cluster转API String (Cluster to CSM API String.vi)

两种表达方式：
1. 标签-数据对：`{tag1:value1; tag2:value2}`，花括号可选
2. 无标签模式：`value1;value2;value3`（顺序重要）

### 6.2 API String转Cluster (CSM API String to Cluster.vi)

**标签-数据对模式**：
- 标签对应簇元素名称，通过名称匹配（顺序无关）
- 只需描述需修改的元素，其他保持原型值
- 嵌套簇：子元素标签格式为`父标签.子标签`，标签唯一时可省略父标签

**无标签模式**：
- 按顺序设置，元素数少于簇元素数时剩余保持不变
- 元素数多于簇元素数时多余的被忽略

## 7. 复杂场景

### 7.1 Cluster in Array (Complex Cluster in Array.vi)

展示复杂Cluster Array的API String表达（非典型推荐场景）。

### 7.2 Cluster with 2D Array (Cluster with 2D Array elements.vi)

展示包含2D Array的Cluster的API String表达（非典型推荐场景）。
