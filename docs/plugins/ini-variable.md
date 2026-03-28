---
title: INI/静态参数支持
layout: default
parent: 插件系统
nav_order: 5
---

# INI/静态参数支持

## 概述

CSM INI-Variable Support 为CSM框架提供配置文件支持，使用户无需显式读写配置文件即可管理应用程序配置。

**主要特点**：自动加载默认配置、多文件叠加覆盖、内存缓存加速读取、标准INI格式、嵌套变量引用、`[__include]`配置文件引用。

### 变量格式

格式定义: `${section.variable:defaultValue}`
- `section`(可选): 配置文件中的节名。省略时使用默认配置段 `SectionName=LabVIEW`。
- `variable`: 配置文件中的变量名。
- `defaultValue`(可选): 默认值，当变量不存在时使用。未指定时默认为空字符串。

### 配置文件路径

- **开发状态**：Application Directory中找到的第一个INI配置文件。若不存在，则默认为`csm-app.ini`。
- **编译后**：可执行文件所在目录中与可执行文件同名的INI配置文件（LabVIEW编译后自动生成）。

## CSM 可解析参数(1. Used as parameters parsed by CSM.vi)

展示如何使用INI变量作为CSM可解析参数。INI变量使用CSM API String格式，通过[`CSM - Populate Configuration Variables.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-populate-configuration-variablesvi)将字符串中的变量解析为实际值。

### Steps

- step1：生成临时INI文件，使用[`CSM - Load Configuration Variables From File.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-load-configuration-variables-from-filevi)加载。
- step2：使用普通循环模拟CSM模块，调用[`CSM - Populate Configuration Variables.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-populate-configuration-variablesvi)解析变量。运行后比较界面显示与注释是否一致。
    - step2.1：注意 section/variable 在配置信息中不存在的情况。
    - step2.2：step2.1 的期望结果。
    - step2.3：注意不只是参数，任意字段都可以使用INI变量。
    - step2.4：step2.3 的期望结果。

## 提供参考Cluster的配置加载 (2. Load the corresponding configuration by providing the prototype.vi)

通过提供Cluster prototype加载配置，支持从整个节或特定键加载。

支持此功能的函数：
 - [`CSM - Read Cluster Elements From Session.vim`]({% link docs/reference/api-addon-ini-variable.md %}#csm-read-cluster-elements-from-sessionvim)：Cluster prototype 中的元素名称作为配置文件中的变量名。
 - [`CSM - Read Cluster Elements From Key.vim`]({% link docs/reference/api-addon-ini-variable.md %}#csm-read-cluster-elements-from-keyvim)：需提供Key参数，cluster 使用API String格式存储在给定的section/key中。

如果配置文件中未定义该变量，将使用Cluster prototype中的元素数据作为默认值。

### Steps

- step1：生成临时INI文件，使用[`CSM - Load Configuration Variables From File.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-load-configuration-variables-from-filevi)加载。
- step2：使用[`CSM - Read Cluster Elements From Session.vim`]({% link docs/reference/api-addon-ini-variable.md %}#csm-read-cluster-elements-from-sessionvim)加载配置。
- step3：使用[`CSM - Populate Configuration Variables.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-populate-configuration-variablesvi)解析变量。



## 固化CSM API参数(3. In CSM API parameters.vi)

展示如何将CSM API参数固化在INI配置文件中。通过`Convert API String to Cluster(Default in Session).vim`或`Convert API String to Cluster(Default in Key).vim`实现，它们在CSM API String Support同名函数的基础上添加了INI配置读取功能。

数据来源具有明确的优先级：**CSM API参数 > 配置文件参数 > 默认常量参数**。参数可以部分指定，缺失的值会自动使用下一优先级的配置填充。

### Steps

- step1：生成一个临时的INI文件，使用`CSM - Load Configuration Variables From File.vi`加载该文件。
- step2：使用一个普通的循环模拟一个CSM模块，模块的名称为“network”。
- step3：假设传递过来的参数为“ip:11.22.33.44”，此时这个信息优先级最高，会覆盖配置文件中的配置。
    - step3.1：`Convert API String to Cluster(Default in Session).vim`转换，从section中载入同名的key。IP信息从参数中载入；port由于参数中没有提供，但是“network”中定义了port为8080，所以最后cluster中port为8080。
    - step3.2：[`Convert API String to Cluster(Default in Key).vim`]({% link docs/reference/api-addon-ini-variable.md %}#convert-api-string-to-clusterdefault-in-keyvim)转换，从给定的section/key载入配置。IP信息从参数中载入；port由于参数中没有提供，但是network.address1中定义了port为8081，所以最后cluster中port为8081。
- step4：假设传递过来的参数为空""，相当于没有提供参数，此时优先采用配置文件中的配置。
    - step4.1：[`Convert API String to Cluster(Default in Session).vim`]({% link docs/reference/api-addon-ini-variable.md %}#convert-api-string-to-clusterdefault-in-sessionvim)转换，从section中载入同名的key。ip信息使用network.ip，结果是10.144.41.41；port使用network.port，结果是 8080。
    - step4.2：[`Convert API String to Cluster(Default in Key).vim`]({% link docs/reference/api-addon-ini-variable.md %}#convert-api-string-to-clusterdefault-in-keyvim)转换，从给定的section/key载入配置。从network.address1中载入配置，结果为ip:10.144.42.42，port:8081。
- step5：假设传递过来的参数为空""，相当于没有提供参数；同时INI配置文件中也没有定义对应的配置，此时采用默认常量参数。
    - step5.1：[`Convert API String to Cluster(Default in Session).vim`]({% link docs/reference/api-addon-ini-variable.md %}#convert-api-string-to-clusterdefault-in-sessionvim)转换，"non-existing module" section不存在，使用提供的参考数据，结果为ip:127.0.0.1，port:80。
    - step5.2：[`Convert API String to Cluster(Default in Key).vim`]({% link docs/reference/api-addon-ini-variable.md %}#convert-api-string-to-clusterdefault-in-keyvim)转换，从给定的section/key载入配置，但是section/key都不存在。使用提供的参考数据，结果为ip:127.0.0.1，port:80。



## 多文件配置系统(4. Multi-file configuration system.vi)

展示多文件配置的支持，利用此功能可实现分布式配置文件系统。

加载多个文件时，后加载的文件覆盖先前文件中的相同配置项。保存修改时，变更会写入最后加载的配置文件。

### Steps

- step1：生成临时INI文件并加载。
- step2：再生成一个INI文件并加载，注意"RS232_Device" section中的resource key会被覆盖。
- step3：应用场景展示。
    - step3.1：使用`CSM - Read Cluster Elements From Session.vim`读取cluster配置。
    - step3.2：参数固化场景——无需发送串口信息，"SerialPort Initialize"直接使用配置文件中的信息。
    - step3.3：若发送了串口信息，则以发送的信息为准。



## 使用 [__include] 引用配置文件(5. import Config.ini with include section.vi)

配置文件中若包含 `[__include]` 段落，会自动引用指定的配置文件，实现分布式配置。注意事项：

- 相对路径相对于当前配置文件解析，绝对路径直接使用。
- 系统会记录已加载文件，重复加载同一文件时自动跳过，但仍需避免循环依赖。
- `[__include]` 中的key名称仅作标识，value中的路径才是实际引用。
- `[__include]` 引用的文件先加载（优先级低），当前文件的配置项会覆盖引用文件中的相同项。

### Steps

- step1：创建多个配置文件，注意内部引用关系。另外注意`[__include]`大小写不敏感。
- step2：使用[`CSM - Load Configuration Variables From File.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-load-configuration-variables-from-filevi)加载配置文件。
- step3：使用[`CSM - Configuration File Path.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-configuration-file-pathvi)获取所有已加载配置文件路径。
- step4：读取配置信息，注意覆盖关系后实际生效的配置。



## 嵌套变量(6. Read Nested Variables.vi)

支持嵌套变量解析，允许在键值中引用其他键，格式遵循 `${section.variable:defaultValue}`。

- **读取行为**：`CSM INI Read String.vi`获取原始值不解析嵌套变量，其他读取API自动解析。
- **写入行为**：所有写入API直接覆盖配置值。包含嵌套引用的键通常不应通过写入操作修改。

配置示例：

```
// 默认配置
[network]
host = ${protocol}://${ip}:${port}
protocol = http
ip = "192.168.0.1"
port = 8080
url = ${host}/API/v1/Get

[case1]
addr = "${network.host}/API/v1/case1/Get"

[case2]
network.host = 127.0.0.1
addr = "${network.host}/API/v2/case2/Get"

[RT]
select = 1
addr = ${case${select}.addr}

[info]
operator = mary
date = #fill by user
time =  #fill by user
test = board

[file]
root = d:/data
path = ${root}/${info.operator}/${info.date}/${info.test}${info.time}.tdms
```

场景1：读取`${file.path}`返回由其他配置项动态组合的文件路径。
场景2：通过修改`${RT.select}`，切换`${RT.addr}`在`[case1]`和`[case2]`之间的解析结果。

### Steps

- step1：生成临时INI文件并加载。
- step2：引用同一section的嵌套变量。
    - step2.1：[`CSM - Read INI String.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-read-ini-stringvi)返回原始配置，不解析嵌套变量。
    - step2.2：[`CSM - Read Configuration Variable.vim`]({% link docs/reference/api-addon-ini-variable.md %}#csm-read-configuration-variablevim)自动解析嵌套变量。
    - step2.3：[`CSM - Populate Configuration Variables.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-populate-configuration-variablesvi)同样会解析嵌套变量。
- step3：跨section引用——指明section时使用指定section，否则优先使用当前section的配置。
- step4：变量名中也可包含引用，例如`${case${select}.addr}`。
    - step4.1：修改`${RT.select}`为2。
    - step4.2：读取`${RT.addr}`返回`${case2.addr}`。
    - step4.3：(Optional) 将`${RT.select}`改为1，再次运行观察变化。
- step5：使用嵌套变量拼接动态路径，如`file.path = ${root}/${info.operator}/${info.date}/${info.test}${info.time}.tdms`。
    - step5.1：修改`info.date`和`info.time`后，`file.path`的解析结果随之变化。



## 修改配置信息(7. Write and Read Configuration.vi)

使用[`CSM - Write Configuration Variable.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-write-configuration-variablevim)和[`CSM - Write INI String.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-write-ini-stringvi)动态更新配置。由于读取API使用全局缓存优化性能，频繁修改会降低缓存效率，因此本库不建议用于需要频繁修改配置的场景。

注意事项：
- 内存中的修改不会自动同步到文件，需调用[`CSM - Sync Configuration Variables to File.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-sync-configuration-variables-to-filevi)手动同步。
- 仅原始配置文件中已定义的配置项才能同步保存。运行时新增的变量默认为临时变量，不会写入文件。
- 可调用[`CSM - Mark All Temp Variables as Permanent.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm-mark-all-temp-variables-as-permanentvi)将临时变量标记为永久变量，使其在同步时被保留。




## 核心API

详细说明请参考 [API参考文档]({% link docs/reference/api-addon-ini-variable.md %})。

### 加载和管理

| API | 说明 |
|-----|------|
| [`CSM - Load Configuration Variables From File.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm---load-configuration-variables-from-filevi) | 加载配置文件到内存，后加载文件覆盖先前配置 |
| [`CSM - Configuration File Path.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm---configuration-file-pathvi) | 获取所有已加载的配置文件路径 |

### 读取

| API | 说明 |
|-----|------|
| [`CSM - Read Configuration Variable.vim`]({% link docs/reference/api-addon-ini-variable.md %}#csm---read-configuration-variablevim) | 多态VI，自动解析嵌套变量 |
| [`CSM - Read INI String.vi`]({% link docs/reference/api-addon-ini-variable.md %}#csm---read-ini-stringvi) | 读取原始值，不解析嵌套变量 |
| [`CSM - Read Cluster Elements From Session.vim`]({% link docs/reference/api-addon-ini-variable.md %}#csm---read-cluster-elements-from-sessionvim) | 从Section读取Cluster配置，元素名对应Key名 |
| [`CSM - Read Cluster Elements From Key.vim`]({% link docs/reference/api-addon-ini-variable.md %}#csm---read-cluster-elements-from-keyvim) | 从指定Key读取Cluster配置（API String格式） |

### 写入和同步

| API | 说明 |
|-----|------|
| `CSM - Write Configuration Variable.vi` | 写入配置到内存，默认不自动保存 |
| `CSM - Write INI String.vi` | 写入原始字符串，不解析变量 |
| `CSM - Sync Configuration Variables to File.vi` | 同步内存配置到最后加载的文件 |
| `CSM - Mark All Temp Variables as Permanent.vi` | 将临时变量标记为永久，影响同步行为 |

### 解析和集成

| API | 说明 |
|-----|------|
| `CSM - Populate Configuration Variables.vi` | 解析字符串中的变量引用 |
| `Convert API String to Cluster(Default in Session).vim` | 结合API String和INI配置，三级优先级：参数 > INI > Prototype |
| `Convert API String to Cluster(Default in Key).vim` | 从指定Key读取默认值，支持完整Cluster配置 |

## 典型应用场景

- **应用程序配置管理**：各模块通过Section隔离配置，启动时一次加载，运行中按需读取。
- **多环境部署**：通过`[__include]`引用基础配置，各环境文件仅覆盖差异项。
- **用户偏好持久化**：运行时修改配置后调用同步API写回文件，下次启动自动恢复。
- **测试参数化**：测试数据外部化到INI文件，添加测试用例无需修改代码。
- **动态路径配置**：利用嵌套变量组合路径，如 `${root}/${operator}/${date}.tdms`。


## 最佳实践

1. **配置文件组织**：使用`[__include]`实现基础配置复用，按环境分文件管理。
2. **命名规范**：Section表示模块或功能域，Key使用驼峰或下划线命名，避免缩写。
3. **嵌套变量**：提供默认值（`${var:default}`），嵌套层次不超过3层，避免循环引用。
4. **默认值策略**：利用三级优先级（API参数 > INI配置 > 代码默认值），代码中始终提供合理默认值。
5. **读多写少**：本库使用全局缓存优化读取性能，适合启动时加载、运行中只读的场景，不适合高频更新。
6. **敏感信息**：使用环境变量引用或外部secrets文件（不加入版本控制），避免明文存储密码。
7. **调试技巧**：用`CSM - Configuration File Path.vi`查看已加载文件列表，用`CSM - Read INI String.vi`对比原始值与解析值。


## 常见问题

### Q1: 变量引用不工作？

检查：1) 变量名和Section名拼写是否正确；2) 是否使用了解析API（`Read INI String`不解析嵌套变量）；3) 是否提供了默认值。可用`CSM - Populate Configuration Variables.vi`调试解析结果。

### Q2: 多文件配置的覆盖顺序？

**规则**：
- 后加载覆盖先加载
- [__include]先加载（优先级低）
- 当前文件后加载（优先级高）

**示例**：
```ini
# base.ini
[A]
value = 1

# app.ini
[__include]
base = base.ini

[A]
value = 2  # 覆盖base.ini中的value

# 最终value = 2
```

### Q4: 如何重新加载配置？

配置加载后常驻内存，无法卸载单个文件。可重新调用`CSM - Load Configuration Variables From File.vi`加载更新后的文件，新值会覆盖旧值。

### Q5: INI-Variable vs API String vs Global Variable?

| 特性 | INI-Variable | API String | Global Variable |
|------|-------------|------------|-----------------|
| 用途 | 持久化配置 | 运行时参数 | 运行时共享 |
| 持久化 | ✅ | ❌ | ❌ |
| 用户可编辑 | ✅ | ❌ | ❌ |
| 适合场景 | 应用配置、用户偏好 | API参数、测试数据 | 模块间通讯、状态共享 |

**组合使用**：启动时从INI读取配置到Global Variable，运行时通过Global Variable快速访问，用户修改后写回INI。

