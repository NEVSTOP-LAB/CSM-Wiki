---
title: INI/静态参数支持
layout: default
parent: 插件系统
nav_order: 5
---

# INI/静态参数支持
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

# CSM INI-Variable Support

## 概述

CSM INI-Variable Support是CSM框架的一个插件，为CSM提供简单易用的配置文件支持功能，使用户能够配置应用程序而无需显式读写配置文件。

### 主要特点

1. **默认配置处理**：首次调用库函数时自动加载默认配置文件，无需用户显式加载。
2. **多文件支持**：通过专用函数支持加载多个配置文件，后加载的文件会覆盖先前加载文件中的相同配置项。
3. **内存缓存**：在内存中维护一个缓存副本，应用程序从该缓存中获取配置信息。
4. **INI格式兼容**：配置文件和内存副本均采用标准INI格式，支持节和键值对。
5. **高效缓存机制**：使用全局修改标记优化性能，仅在配置发生修改时才重新读取内存副本。
6. **嵌套变量支持**：支持变量的嵌套引用，实现灵活的配置定义。
7. **配置文件引用**：支持通过`[__include]`节引用其他配置文件，实现分布式配置文件系统。

### 变量格式

格式定义: `${section.variable:defaultValue}`
- `${}`: 变量引用语法。
- `section`(可选): 配置文件中的节名。省略时，使用默认配置段 `SectionName=LabVIEW`。
- `variable`: 配置文件中的变量名。
- `defaultValue`(可选): 默认值，当变量不存在时使用。未指定时默认为空字符串("")。

### 配置文件路径

- **开发状态**：Application Directory中找到的第一个INI配置文件。若不存在配置文件，则默认为`csm-app.ini`。
- **编译后**：可执行文件所在目录中与可执行文件同名的INI配置文件。LabVIEW编译后会自动生成此文件。

## CSM 可解析参数(1. Used as parameters parsed by CSM.vi)

### Overview

本范例用于展示如何在CSM中使用INI Variable Support可解析参数的功能。

### Introduction

展示如何使用CSM INI Variable Support功能将参数信息固化在INI配置文件中。INI变量使用CSM API String的格式。

### Steps

- step1：生成一个临时的INI文件，使用CSM - Load Configuration Variables From File VI加载该文件。
- step2：使用一个普通的循环模拟一个CSM模块，使用CSM - Populate Configuration Variables VI将字符串中的变量解析为实际值。运行后，可以比较界面显示的信息是否与注释相同。
    - step2.1：这部分的代码中，注意section/variable 在配置信息中是不存在的。
    - step2.2：step2.1部分代码运行的期望结果。
    - step2.3：这部分的代码中，注意并不只是参数可以使用CSM INI Variable Support，任意字段都可以使用。
    - step2.4：step2.3部分代码运行的期望结果。

## 提供参考Cluster的配置加载 (2. Load the corresponding configuration by providing the prototype.vi)

### Overview

本范例展示通过提供Cluster prototype加载配置。您可以从整个节或特定键加载配置。

### Introduction

可以提供一个Cluster prototype来加载配置。

支持这个功能的函数为：
 - CSM - Read Cluster Elements From Session.vim：Cluster prototype 中的元素名称会被作为配置文件中的变量名。
 - CSM - Read Cluster Elements From Key.vim：需要提供Key参数，cluster 使用API String格式存储在给定的section/key中。

特殊情况说明：
- 如果配置文件中未定义该变量，将使用提供原型的Cluster的元素数据。

### Steps

- step1：生成一个临时的INI文件，使用CSM - Load Configuration Variables From File.vi加载该文件。
- step2：使用CSM - Read Cluster Elements From Session.vim加载配置。
- step3：使用CSM - Populate Configuration Variables.vi将字符串中的变量解析为实际值。



## 固化CSM API参数(3. In CSM API parameters.vi)

### Overview

本范例展示如何使用CSM INI Variable Support功能将参数信息固化在INI配置文件中。

### Introduction

展示如何使用CSM INI Variable Support功能将参数信息固化在INI配置文件中。只要依靠`Convert API String to Cluster(Default in Session).vim`或`Convert API String to Cluster(Default in Key).vim`来实现。它们和CSM API String Support中同名的函数功能相同，但是添加了读取INI配置文件的功能。

在此情况下，数据的来源可能是：通过消息参数发送过的信息、配置文件中的参数或者当前编写时提供的默认常量参数。它们具有明确的优先级层次：CSM API参数 > 配置文件参数 > 默认常量参数。需要注意：
- 初始化时，显式发送的参数具有最高优先级。
- 若未发送参数，则使用配置文件中的参数。
- 在没有配置文件参数的情况下，应用默认常量参数。
- 参数可以部分指定，缺失的值会自动使用下一优先级的配置信息填充。

### Steps

- step1：生成一个临时的INI文件，使用`CSM - Load Configuration Variables From File.vi`加载该文件。
- step2：使用一个普通的循环模拟一个CSM模块，模块的名称为“network”。
- step3：假设传递过来的参数为“ip:11.22.33.44”，此时这个信息优先级最高，会覆盖配置文件中的配置。
    - step3.1：`Convert API String to Cluster(Default in Session).vim`转换，从section中载入同名的key。IP信息从参数中载入；port由于参数中没有提供，但是“network”中定义了port为8080，所以最后cluster中port为8080。
    - step3.2：`Convert API String to Cluster(Default in Session).vim`转换，从给定的section/key载入配置。IP信息从参数中载入；port由于参数中没有提供，但是network.address1中定义了port为8081，所以最后cluster中port为8081。
- step4：假设传递过来的参数为空""，相当于没有提供参数，此时优先采用配置文件中的配置。
    - step4.1：`Convert API String to Cluster(Default in Session).vim`转换，从section中载入同名的key。ip信息使用network.ip，结果是10.144.41.41；port使用network.port，结果是 8080。
    - step4.2：`Convert API String to Cluster(Default in Session).vim`转换，从给定的section/key载入配置。从network.address1中载入配置，结果为ip:10.144.42.42，port:8081。
- step5：假设传递过来的参数为空""，相当于没有提供参数；同时INI配置文件中也没有定义对应的配置，此时采用默认常量参数。
    - step5.1：`Convert API String to Cluster(Default in Session).vim`转换，"non-existing module" section不存在，使用提供的参考数据，结果为ip:127.0.0.1，port:80。
    - step5.2：`Convert API String to Cluster(Default in Session).vim`转换，从给定的section/key载入配置，但是section/key都不存在。使用提供的参考数据，结果为ip:127.0.0.1，port:80。



## 多文件配置系统(4. Multi-file configuration system.vi)

### overview

本范例展示CSM INI Variable Support API对于多文件配置的支持。

### Introduction

本范例展示CSM INI Variable Support API对于多文件配置的支持。利用多文件配置功能，可实现分布式配置文件系统。

CSM INI Variable Support API具有一个默认的配置文件，无需显示加载，会在程序实例启动时后台自动载入。

- 开发状态：Application directory中找到的第一个INI配置文件。若不存在配置文件，则默认为`csm-app.ini`。
- 编译后：可执行文件所在目录中与可执行文件同名的INI配置文件。LabVIEW编译后会自动生成此文件。

加载多个文件时，后加载的文件会覆盖先前加载文件中的相同配置项。将缓存更改保存到文件时，修改会保存到最后加载的配置文件中。

### Steps

- step1：生成一个临时的INI文件，使用`CSM - Load Configuration Variables From File.vi`加载该文件。
- step2：再生成一个临时的INI文件，使用`CSM - Load Configuration Variables From File.vi`加载该文件，需要注意的是，“RS232_Device” section中的resource key会被覆盖。
- step3：应用场景展示。
    - step3.1：使用`CSM - Read Cluster Elements From Session.vim`读取cluster配置。
    - step3.2：在参数固化中使用。可以看出，无需发送串口的信息，"SerialPort Initialize"中会使用配置文件中的信息初始化串口。
    - step3.3：step3.2中如果发送了串口信息，以发送的信息为准，"SerialPort Initialize"中会使用发送的信息初始化串口。



## 使用 [__include] 引用配置文件(5. import Config.ini with include section.vi)

### Overview

本范例展示CSM INI Variable Support API对于引用配置文件的支持。利用引用配置文件功能，可实现分布式配置文件系统。

### Introduction

CSM INI Variable Support API载入的配置文件中，若包含 [__include] 段落，会自动引用指定的配置文件。需要注意的是：

- 如果是相对路径，会相对于当前配置文件的路径进行解析；如果是绝对路径，会直接使用该路径。
- 请注意避免循环依赖，否则可能导致无限循环。CSM INI Variable Support API会维护已加载配置文件的记录，当第二次尝试加载同一文件时，将跳过该次加载操作。
- [__include] 中的key名称不重要，只作为一个标识，value中的路径才是重要的。
- [__include] 中的配置信息会先被载入，类似多文件加载时先加载，因此当前配置文件中的配置项会覆盖引用文件中的相同配置项。

### steps

- step1：创建多个配置文件，注意内部引用关系。另外注意[__include]大消息不敏感。
- step2：使用`CSM - Load Configuration Variables From File.vi`加载该文件
- step3：可以使用`CSM - Configuration File Path.vi`获取当前加载的所有配置文件路径。
- step4：尝试读取配置信息，请注意覆盖关系后，实际生效的配置。



## 嵌套变量(6. Read Nested Variables.vi)

### Overview

CSM INI Variable Support API支持嵌套变量解析，允许在键中引用其他键，实现更灵活的配置定义。格式遵循 ${section.variable:defaultValue}。本范例展示了如何在配置文件中定义和引用嵌套变量。

### Introduction

CSM INI Variable Support API支持嵌套变量解析，允许在键中引用其他键，实现更灵活的配置定义。格式遵循 ${section.variable:defaultValue}。

- 读取API行为：`CSM INI Read String.vi`获取原始配置值而不解析嵌套变量。其他所有读取API都会自动解析嵌套变量。
- 写入API行为：所有写入API都会直接覆盖配置值。通常情况下，包含嵌套引用的键不应通过写入操作直接修改。

举例：

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

使用上面的配置文件示例：

场景1：读取`${file.path}`会返回一个由其他配置项动态组合而成的实际文件路径，从而实现灵活的路径定义。
场景2：`[case1]`和`[case2]`节定义了两组不同的相关配置信息。通过修改`${RT.select}`，您可以切换访问`${RT.addr}`的结果。

### steps

- step1：生成一个临时的INI文件，使用`CSM - Load Configuration Variables From File.vi`加载该文件。
- step2：嵌套变量中引用同一个section的配置。
    - step2.1：`CSM - Read INI String.vi`加载的是原始配置，不会解析嵌套变量。
    - step2.2：`CSM - Read Configuration Variable.vim`会解析嵌套变量。
    - step2.3：`CSM - Populate Configuration Variables.vi`会解析嵌套变量。
- step3：嵌套变量中引用的其他section的配置，当指明section时，使用指定的section，否则优先使用当前section的配置。
- step4：展示嵌套变量中变量名也可以引用的情况，例如：`${case${select}.addr}`。
    - step4.1：修改$`{RT.select}`为 2。
    - step4.2：读取`${RT.addr}`会返回`${case2.addr}`。
    - step4.3：(Optional)手动修改 修改`${RT.select}`为1, 再次运行，查看配置信息的变化。
- step5：展示使用不同字段信息拼接产品路径的场景，例如定义了`file.path = ${root}/${info.operator}/${info.date}/${info.test}${info.time}.tdms`。
    - step5.1：通过修改`info.date`和`info.time`, 可以发现`file.path`实际解析的路径会根据配置信息动态变化。



## 修改配置信息(7. Write and Read Configuration.vi)

### overview

本范例展示CSM INI Variable Support API修改配置信息。

### Introduction

CSM INI Variable Support提供了修改配置信息的API。您可以使用这些API来动态更新配置文件中的键值对。请注意，由于CSM INI Variable Support为了提高效率，在读取函数处均使用全局缓存修改标志，当整体配置没有发生变化时，会快速的使用缓存的数据，提高读取效率。频繁的配置更改会降低读取VI中缓存机制的有效性。因此，本库不建议用于需要频繁修改配置的场景。

可以使用`CSM - Write Configuration Variable.vi`和`CSM - Write INI String.vi`来修改配置信息。

需要注意的是：
- 默认内存中修改的配置，不会自动同步到配置文件中，需要调用`CSM - Sync Configuration Variables to File.vi`来同步到配置文件中。
- 原始配置文件定义某些配置项，才可以在同步保存到配置文件时保留下来。如果原始配置文件没有定义某些配置项，修改的变量默认只会保存在内存中，不会同步到配置文件中。
- 可以调用`CSM - Mark All Temp Variables as Permanent.vi`将所有临时变量标记为永久变量，这样在同步保存到配置文件时，所有变量都会被保留下来。




## 核心API

### 加载和管理API

**CSM - Load Configuration Variables From File.vi**
- 加载配置文件到内存
- 支持相对和绝对路径
- 后加载文件覆盖先前配置

**CSM - Configuration File Path.vi**
- 获取所有已加载的配置文件路径
- 用于调试和追踪

### 读取API

**CSM - Read Configuration Variable.vim**
- 多态VI，自动适应数据类型
- 解析嵌套变量
- 返回解析后的值

**CSM - Read INI String.vi**
- 读取原始配置值
- 不解析嵌套变量
- 用于特殊场景

**CSM - Read Cluster Elements From Session.vim**
- 从Section读取Cluster配置
- 元素名对应Key名
- 自动类型转换

**CSM - Read Cluster Elements From Key.vim**
- 从指定Key读取Cluster配置
- 使用API String格式
- 支持复杂结构

### 写入和同步API

**CSM - Write Configuration Variable.vi**
- 写入配置到内存
- 支持嵌套变量引用
- 默认不自动保存

**CSM - Write INI String.vi**
- 写入原始字符串
- 不解析变量
- 用于特殊场景

**CSM - Sync Configuration Variables to File.vi**
- 同步内存配置到文件
- 只保存永久变量
- 保存到最后加载的文件

**CSM - Mark All Temp Variables as Permanent.vi**
- 将临时变量标记为永久
- 影响同步行为
- 用于动态配置

### 解析API

**CSM - Populate Configuration Variables.vi**
- 解析字符串中的变量引用
- 支持嵌套变量
- 返回解析后的字符串

### 与API String集成

**Convert API String to Cluster(Default in Session).vim**
- 结合API String和INI配置
- 从Session读取默认值
- 三级优先级：参数 > INI > Prototype

**Convert API String to Cluster(Default in Key).vim**
- 从指定Key读取默认值
- 支持完整Cluster配置
- 灵活的配置管理

## 应用场景

### 场景1：应用程序配置管理

**需求**：
- 应用有多个模块
- 每个模块有独立配置
- 用户可修改配置文件

**方案**：
```ini
[Application]
name = MyApp
version = 1.0.0
logLevel = Debug

[Database]
host = localhost
port = 5432
database = mydb
username = admin
password = ${env.DB_PASSWORD}

[Network]
listenPort = 8080
maxConnections = 100
timeout = 30000
```

```labview
// 启动时加载
CSM - Load Configuration Variables From File.vi
  Path: "app.ini"

// 各模块读取配置
Database Module >> {
    CSM - Read Cluster Elements From Session.vim
      Section: Database
      → DB Config
    
    Connect to Database(DB Config)
}

Network Module >> {
    CSM - Read Cluster Elements From Session.vim
      Section: Network
      → Network Config
    
    Start Server(Network Config)
}
```

**优势**：
- 配置集中管理
- 用户可编辑
- 支持敏感信息（环境变量）

### 场景2：多环境配置

**需求**：
- 开发、测试、生产环境
- 不同环境不同配置
- 方便切换环境

**方案**：
```ini
# base.ini
[common]
appName = MyApp
logPath = ./logs

# dev.ini
[__include]
base = base.ini

[Database]
host = localhost
port = 5432
debug = true

# prod.ini
[__include]
base = base.ini

[Database]
host = prod-server.company.com
port = 5432
debug = false
```

```labview
// 根据环境加载
Environment = Get Environment()

If (Environment = "Production") {
    Load "prod.ini"
} else {
    Load "dev.ini"
}
```

**优势**：
- 基础配置复用
- 环境特定覆盖
- 配置清晰分离

### 场景3：用户自定义配置

**需求**：
- 用户可自定义界面
- 用户可保存偏好
- 下次启动恢复

**方案**：
```ini
[UI]
theme = Dark
fontSize = 12
language = zh-CN

[Recent]
file1 = C:\data\project1.dat
file2 = C:\data\project2.dat
```

```labview
// 启动时加载用户配置
Load User Config

// 应用UI配置
CSM - Read Cluster Elements From Session.vim
  Section: UI
  → UI Preferences

Apply UI Settings(UI Preferences)

// 用户修改后保存
User Changed Settings >> {
    CSM - Write Configuration Variable.vi
      Section: UI
      Key: theme
      Value: "Light"
    
    CSM - Sync Configuration Variables to File.vi
}
```

**优势**：
- 用户体验个性化
- 配置持久化
- 便于迁移设置

### 场景4：测试配置参数化

**需求**：
- 自动化测试
- 参数化测试用例
- 易于维护测试数据

**方案**：
```ini
[TestCase1]
input = 100
expected = 200
tolerance = 0.01

[TestCase2]
input = -50
expected = -100
tolerance = 0.01

[TestSequence]
cases = TestCase1,TestCase2,TestCase3
```

```labview
// 读取测试序列
CSM - Read Configuration Variable.vim
  Section: TestSequence
  Key: cases
  → Test Cases List

// 执行每个测试用例
For Each Case in Test Cases {
    CSM - Read Cluster Elements From Session.vim
      Section: Case
      → Test Config
    
    Run Test(Test Config)
}
```

**优势**：
- 测试数据外部化
- 易于添加测试用例
- 不需要修改代码

### 场景5：动态路径配置

**需求**：
- 文件路径灵活配置
- 支持变量引用
- 便于部署和迁移

**方案**：
```ini
[Paths]
root = C:\Data
project = ${root}\Projects
logs = ${root}\Logs
temp = ${root}\Temp

[CurrentTest]
operator = John
date = 2024-02-06
testType = Functional

[Output]
logFile = ${logs}\${CurrentTest.operator}_${CurrentTest.date}_${CurrentTest.testType}.log
dataFile = ${project}\${CurrentTest.testType}\${CurrentTest.date}.tdms
```

```labview
// 读取动态路径
CSM - Read Configuration Variable.vim
  Section: Output
  Key: logFile
  → Log File Path  // 自动解析为实际路径
  
// 文件路径根据配置动态变化
Create File(Log File Path)
```

**优势**：
- 路径灵活配置
- 支持嵌套变量
- 便于组织文件

## 最佳实践

### 1. 配置文件组织

**推荐结构**：
```
project/
  ├── config/
  │   ├── base.ini          # 基础配置
  │   ├── dev.ini           # 开发环境
  │   ├── test.ini          # 测试环境
  │   ├── prod.ini          # 生产环境
  │   └── user.ini          # 用户配置
  ├── app.exe
  └── app.ini               # 默认配置
```

**加载顺序**：
```labview
1. 加载base.ini
2. 根据环境加载dev/test/prod.ini
3. 加载user.ini（如果存在）
```

### 2. Section和Key命名

**建议**：
```ini
# 好的命名
[Network]
serverAddress = 192.168.1.100
connectionTimeout = 5000

# 避免的命名
[net]          # 太简短
addr = ...     # 缩写不清晰
```

**原则**：
- Section表示模块或功能域
- Key使用驼峰或下划线
- 避免缩写
- 见名知意

### 3. 变量引用规范

**格式**：
```ini
${section.variable:defaultValue}
```

**建议**：
```ini
# 提供默认值
baseUrl = ${env.API_URL:http://localhost:8080}

# 合理的嵌套层次（不超过3层）
path = ${root}\${year}\${month}

# 避免循环引用
# 错误示例：
[A]
value = ${B.value}
[B]
value = ${A.value}  # 循环引用！
```

### 4. 使用[__include]引用

**优势**：
- 配置模块化
- 基础配置复用
- 环境特定覆盖

**示例**：
```ini
# base.ini
[common]
setting1 = value1

# app.ini
[__include]
base = base.ini

[common]
setting2 = value2  # 添加新配置
setting1 = override  # 覆盖base.ini中的配置
```

### 5. 敏感信息处理

**不要直接存储**：
```ini
# 不推荐
[Database]
password = admin123
```

**推荐方案**：

方案1：环境变量
```ini
[Database]
password = ${env.DB_PASSWORD}
```

方案2：外部文件
```ini
[__include]
secrets = secrets.ini  # 不加入版本控制
```

方案3：加密
```ini
[Database]
password = <ENCRYPTED>base64string...
```

### 6. 默认值策略

**三级默认值**：
```labview
Convert API String to Cluster(Default in Session).vim
  Arguments: "port:9090"  // 第一级：显式参数
  Section: Network        // 第二级：INI配置
  Prototype: {            // 第三级：代码默认值
    ip: "127.0.0.1"
    port: 8080
  }
  → Config
```

**建议**：
- 代码中提供合理默认值
- INI文件记录常用配置
- 参数覆盖用于特殊情况

### 7. 配置变更管理

**不频繁修改**：
```labview
// INI-Variable Support使用全局缓存
// 频繁修改会降低缓存效率

// 推荐：初始化时加载，运行中只读
Load Configuration at Startup
Use Configuration (Read Only)

// 不推荐：运行中频繁修改
Loop {
    Modify Configuration  // 降低性能
    Read Configuration
}
```

**适合场景**：
- 启动时加载配置
- 用户设置持久化
- 测试参数化

**不适合场景**：
- 高频更新的运行时参数
- 临时计算结果
- 实时状态信息

### 8. 调试技巧

**查看加载的配置文件**：
```labview
CSM - Configuration File Path.vi
  → File List
Display: File List
```

**查看解析后的值**：
```labview
// 原始值
CSM - Read INI String.vi
  → Raw Value

// 解析后的值
CSM - Read Configuration Variable.vim
  → Parsed Value
  
// 对比两者，理解变量引用
```

**使用日志**：
```labview
// 记录配置加载
Log: "Loaded config: " + File Path

// 记录关键配置值
Log: "Database Host: " + DB Host
```

## 常见问题

### Q1: 如何处理配置文件不存在？

**方案**：
```labview
Path = Build Path("config", "app.ini")

If (File Exists?(Path)) {
    CSM - Load Configuration Variables From File.vi
      Path: Path
} else {
    // 使用默认配置
    Create Default Config File(Path)
    Load Configuration(Path)
}
```

### Q2: 变量引用不工作？

**检查点**：
1. 变量名拼写正确？
2. Section名正确？
3. 使用了解析API？（不是Read INI String）
4. 变量有默认值？

**调试**：
```labview
// 使用Populate Variables查看解析结果
CSM - Populate Configuration Variables.vi
  Input: "${section.var:default}"
  → Output: "actual value" 或 "default"
```

### Q3: 多文件配置的覆盖顺序？

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

**不支持卸载**：
- 配置加载后常驻内存
- 无法卸载单个文件

**重新加载**：
```labview
// 方法1：重启应用
Restart Application

// 方法2：重新加载并覆盖
CSM - Load Configuration Variables From File.vi
  Path: Updated Config File
// 新值覆盖旧值
```

### Q5: INI-Variable vs API String vs Global Variable?

**INI-Variable**：
- 配置持久化
- 跨会话使用
- 用户可编辑
- 适合：应用配置、用户偏好

**API String**：
- 运行时参数
- 可读性好
- 调试友好
- 适合：API参数、测试数据

**Global Variable**：
- 运行时共享
- 快速访问
- 不持久化
- 适合：模块间通讯、状态共享

**组合使用**：
```labview
// INI文件存储持久配置
[Settings]
updateInterval = 1000

// 启动时读取到Global Variable
Read INI -> Global Var

// 运行时使用Global Variable
Use Global Var in Loop

// 用户修改后写回INI
User Change -> Write INI
```

## 示例范例说明

本Addon包含7个详细的示例范例，涵盖各种使用场景。

## 总结

CSM INI-Variable Support Addon提供了强大的配置管理能力：

### 核心优势
- **配置持久化**：INI格式，用户可编辑
- **灵活引用**：支持变量嵌套和引用
- **多文件支持**：模块化配置管理
- **无缝集成**：与API String完美结合

### 使用建议
1. **应用配置**：使用INI文件管理
2. **环境配置**：使用[__include]引用
3. **敏感信息**：使用环境变量
4. **动态路径**：使用变量引用

### 典型应用
- 应用程序配置管理
- 多环境部署
- 用户偏好设置
- 测试参数化
- 动态路径配置

### 与其他Addon配合
- **+ API String**：灵活的参数管理
- **+ MassData**：配置 + 大数据
- **+ CSM Framework**：完整的配置解决方案

### 更多资源
- **GitHub**: https://github.com/NEVSTOP-LAB/CSM-INI-Static-Variable-Support
- **示例代码**：参考本文档中的7个详细范例
- **API String集成**：查看API String Support文档

通过合理使用INI-Variable Support Addon，可以构建灵活、可维护的配置管理系统，大大简化应用程序的部署和维护工作。
