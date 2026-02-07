# CSM INI-Variable Support

## 概述

为CSM提供配置文件支持，无需显式读写即可配置应用程序。

### 特点

- 首次调用自动加载默认配置文件
- 多文件支持（后加载覆盖先加载）
- 内存缓存+全局修改标记优化性能
- 支持嵌套变量和配置文件引用（`[__include]`）

### 变量格式

`${section.variable:defaultValue}`
- section可选，默认为LabVIEW段
- defaultValue可选，默认为空字符串

### 配置文件路径

- 开发：Application Directory中第一个INI文件，不存在则为`csm-app.ini`
- 编译后：与可执行文件同名的INI文件

## 1. CSM参数解析 (Used as parameters parsed by CSM.vi)

INI变量使用CSM API String格式。展示如何将参数固化在配置文件中。

注意section/variable不存在时的处理。

## 2. Cluster配置加载 (Load the corresponding configuration by providing the prototype.vi)

提供Cluster prototype加载配置：
- `CSM - Read Cluster Elements From Session.vim`：元素名作为变量名，从section读取
- `CSM - Read Cluster Elements From Key.vim`：从指定section/key读取，使用API String格式

未定义变量时使用原型值。

## 3. 固化CSM API参数 (In CSM API parameters.vi)

使用`Convert API String to Cluster(Default in Session).vim`或`Convert API String to Cluster(Default in Key).vim`。

参数优先级：API参数 > 配置文件 > 默认常量。支持部分指定，缺失值自动补全。

## 4. 多文件配置 (Multi-file configuration system.vi)

默认配置文件自动加载（开发时为Application Directory首个INI，编译后为同名INI）。

后加载文件覆盖先加载文件的相同配置项。修改保存到最后加载的配置文件。

## 5. [__include]引用 (import Config.ini with include section.vi)

`[__include]`段落自动引用配置文件：
- 相对路径：相对当前配置文件
- 绝对路径：直接使用
- 避免循环依赖（已加载文件跳过）
- key名称不重要，value中的路径才重要
- 引用文件先加载，当前文件配置覆盖引用文件

大小写不敏感。

## 6. 嵌套变量 (Read Nested Variables.vi)

格式：`${section.variable:defaultValue}`

- 读取：`CSM INI Read String.vi`获取原始值不解析，其他读取API自动解析
- 写入：直接覆盖，包含嵌套引用的键不应直接写入

示例：
```
[network]
host = ${protocol}://${ip}:${port}
protocol = http
ip = 192.168.0.1
port = 8080
url = ${host}/API/v1/Get

[case1]
addr = ${network.host}/API/v1/case1/Get

[RT]
select = 1
addr = ${case${select}.addr}

[file]
root = d:/data
path = ${root}/${info.operator}/${info.date}/${info.test}${info.time}.tdms
```

应用场景：
- 动态组合文件路径
- 通过修改`${RT.select}`切换访问不同配置组

## 7. 修改配置 (Write and Read Configuration.vi)

使用`CSM - Write Configuration Variable.vi`和`CSM - Write INI String.vi`修改配置。

注意：
- 内存修改不自动同步，需调用`CSM - Sync Configuration Variables to File.vi`
- 只有原始文件定义的配置项才会保存，未定义的仅在内存中
- 可用`CSM - Mark All Temp Variables as Permanent.vi`将临时变量标记为永久

频繁修改会降低缓存效率，不建议用于频繁修改场景。
