---
title: MassData参数支持
layout: default
parent: 插件系统
nav_order: 4
---

# MassData参数支持

## 概述

MassData Addon为CSM提供高效的大数据参数传递机制，适用于数组、波形、图像等大数据量或复杂数据类型的无损传递。所有CSM模块共享同一个循环缓冲区实现高效数据交换，该机制也可用于非CSM框架。

### 工作原理

MassData不直接传递数据本身，而是通过共享的循环缓冲区实现引用传递：
1. 发送方将数据写入缓冲区，获得起始地址和大小
2. 将地址和大小编码为参数字符串传递给接收方
3. 接收方通过地址和大小从缓冲区读取数据
4. 缓冲区满时，新数据从头覆盖最旧的数据

### 与HEXSTR的对比

| 特性 | MassData | HEXSTR |
|------|----------|--------|
| 适用数据量 | 大数据（>1KB） | 小数据（<1KB） |
| 性能 | 高（引用传递） | 中（编码解码开销） |
| 内存开销 | 低（共享缓冲区） | 高（字符串拷贝） |
| 实现复杂度 | 中 | 低 |
| 调试难度 | 中（需工具查看） | 低（直接查看字符串） |
| 适用场景 | 数组、波形、图像 | 小簇、配置数据 |

## Massdata参数类型

CSM Massdata定义的参数类型为`<MassData>`，可以通过[`CSM - Argument Type.vi`]({% link docs/reference/api-03-arguments.md %}#csm-argument-typevi)获取。

### 参数格式

MassData参数有两种格式：

#### 格式1：带数据类型
```
<massdata>Start:8057;Size:4004;DataType:1D I32
```

使用[`CSM - Convert MassData to Argument With DataType.vim`]({% link docs/reference/api-addon-massdata.md %}#csm-convert-massdata-to-argument-with-datatypevim)生成。包含数据类型信息，接收方可进行类型验证，适合数据类型不固定或需要调试的场景。

#### 格式2：不带数据类型
```
<massdata>Start:8057;Size:4004
```

使用[`CSM - Convert MassData to Argument.vim`]({% link docs/reference/api-addon-massdata.md %}#csm-convert-massdata-to-argumentvim)生成。参数字符串更短，性能略高，适合数据类型固定的场景。

### 参数组成

- **<massdata>**: 参数类型标记
- **Start**: 数据在缓冲区中的起始地址（字节）
- **Size**: 数据大小（字节）
- **DataType**: 数据类型描述（可选）

## 核心API

### 编码API

**CSM - Convert MassData to Argument.vim**
- 将数据转换为MassData参数（不带类型）
- 多态VI，自动适应输入类型
- 返回参数字符串

**CSM - Convert MassData to Argument With DataType.vim**
- 将数据转换为MassData参数（带类型）
- 多态VI，自动适应输入类型
- 返回参数字符串和类型信息

### 解码API

**CSM - Convert Argument to MassData.vim**
- 将MassData参数转换回数据
- 多态VI，自动适应输出类型
- 从缓冲区读取数据

### 配置API

**[`CSM - Config MassData Parameter Cache Size.vi`]({% link docs/reference/api-addon-massdata.md %}#csm-config-massdata-parameter-cache-sizevi)**
- 配置缓冲区大小
- 必须在使用MassData前调用
- 默认大小可能不满足需求

### 监控API

**[`CSM - MassData Update Status Indicator.vi`]({% link docs/reference/api-addon-massdata.md %}#csm-massdata-update-status-indicatorvi)**
- 更新UI状态指示器
- 显示缓冲区使用情况
- 辅助调试和优化

**[`CSM - MassData Data Type String.vi`]({% link docs/reference/api-addon-massdata.md %}#csm-massdata-data-type-stringvi)**
- 从参数中提取数据类型信息
- 用于类型验证

## 缓冲区管理

### 缓冲区配置

使用[`CSM - Config MassData Parameter Cache Size.vi`]({% link docs/reference/api-addon-massdata.md %}#csm-config-massdata-parameter-cache-sizevi)配置缓冲区大小，必须在使用MassData前调用。建议按以下公式计算：

```labview
Buffer Size = 单次最大数据量 × 并发数据数量 × 安全系数(2~3)
// 例：1MB × 5 × 2 = 10MB
```

### 循环覆盖机制

缓冲区满时，新数据从头覆盖最旧的数据。因此需要确保数据在被覆盖前已被接收方读取，必要时拷贝数据到本地变量。

### 监控缓冲区状态

- 使用[`CSM - MassData Update Status Indicator.vi`]({% link docs/reference/api-addon-massdata.md %}#csm-massdata-update-status-indicatorvi)在前面板显示缓冲区使用状态
- 或使用CSM Tools中的MassData Cache Status Viewer实时监控

## 应用场景

### 场景1：数据采集系统

DAQ硬件连续采集大量波形数据，需要高效传递给处理模块：

```labview
// 采集模块
DAQ: Acquire >> {
    Acquire Data -> Waveform Array
    
    // 转换为MassData
    CSM - Convert MassData to Argument.vim
      Data: Waveform Array
      → Arguments: <massdata>...
    
    // 发送给处理模块
    API: ProcessData >> Arguments -> ProcessModule
}

// 处理模块
API: ProcessData >> {
    // 解码MassData
    CSM - Convert Argument to MassData.vim
      Arguments: <massdata>...
      → Data: Waveform Array
    
    // 处理数据
    Process Data...
}
```

### 场景2：图像处理（广播）

相机捕获MB级图像，通过广播分发给多个处理模块，一次写入、多次读取：

```labview
// 相机模块
Camera: Capture >> {
    Capture Image -> 2D Array
    
    // 转换为MassData
    CSM - Convert MassData to Argument With DataType.vim
      Data: Image Array
      → Arguments: <massdata>...Start:xxx;Size:yyy;DataType:2D U8
    
    // 广播给多个处理模块
    ImageReady >> Arguments -> <broadcast>
}

// 处理模块1：显示
ImageReady Subscription >> {
    CSM - Convert Argument to MassData.vim
      → Image
    Display Image...
}

// 处理模块2：分析
ImageReady Subscription >> {
    CSM - Convert Argument to MassData.vim
      → Image
    Analyze Image...
}
```

### 场景3：生产者-消费者模式（非CSM框架）

MassData也可在非CSM框架中使用，例如通过队列在生产者-消费者循环间传递大数据：

```labview
// 生产者循环
Loop {
    Produce Data -> Array
    
    CSM - Convert MassData to Argument.vim
      → MassData String
    
    Enqueue(Queue, MassData String)
}

// 消费者循环
Loop {
    Dequeue(Queue) -> MassData String
    
    CSM - Convert Argument to MassData.vim
      → Array
    
    Consume Data...
}
```

## 最佳实践

### 1. 及时处理数据

由于循环缓冲区会覆盖旧数据，接收方应尽快解码MassData参数。如需长期保留数据，应立即拷贝到本地变量：

```labview
API: ProcessData >> {
    // 立即解码
    CSM - Convert Argument to MassData.vim
      → Data
    
    // 如果需要保存，立即拷贝
    If (Need Save) {
        Local Copy = Data
    }
    
    // 处理数据
    Process Data...
}
```

### 2. 性能优化

1. **批量传递**：一次传递多个数据项而不是多次单项传递
2. **异步处理**：使用异步消息，避免阻塞
3. **选择合适格式**：性能敏感时使用不带类型的格式
4. **监控使用**：定期检查缓冲区使用率

## 常见问题

### Q1: 缓冲区满了怎么办？

**现象**：新数据覆盖了还未使用的旧数据

**解决方案**：
1. 增大缓冲区
2. 加快数据处理速度
3. 减少并发数据量
4. 对重要数据及时拷贝到本地变量

### Q2: MassData vs 队列传递？

**MassData优势**：与CSM消息集成、自动内存管理、支持广播

**队列优势**：更灵活的流控、可缓冲多个数据

**选择建议**：CSM框架内优先MassData；需要流控时使用队列；也可以结合使用——队列中传递MassData参数字符串。

## 示例范例

### Overview

本范例展示CSM API参数中支持的MassData参数格式的使用方法。

### Introduction

范例中模拟产生了两组数据：I32数组和波形数据，分别演示两种MassData参数格式。

### Steps

- Step1: I32数组数据，使用`CSM - Convert MassData to Argument With DataType.vim`打包（包含DataType）。
    - step1.1: 构造原始数据（实际中来自硬件采集等）。
    - step1.2: 调用打包函数，将原始数据转换为massdata参数。
    - step1.3: 使用[`CSM - MassData Data Type String.vi`]({% link docs/reference/api-addon-massdata.md %}#csm---massdata-data-type-stringvi)获取参数中的数据类型。
    - step1.4: 使用[`CSM - Argument Type.vi`]({% link docs/reference/api-03-arguments.md %}#csm---argument-typevi)获取CSM参数标签（<massdata>）。
    - step1.5: 将massdata参数转换回原始数据，验证与原始数据完全匹配。

- Step2: 波形数据，使用`CSM - Convert MassData to Argument.vim`打包（不包含DataType）。
    - step2.1: 构造原始数据。
    - step2.2: 调用打包函数，将原始数据转换为massdata参数。
    - step2.3: 使用[`CSM - Argument Type.vi`]({% link docs/reference/api-03-arguments.md %}#csm---argument-typevi)获取CSM参数标签。
    - step2.4: 将massdata参数转换回原始数据，验证数据匹配。


## 查看massdata缓存状态 (2. Show MassData Cache Status in FP.vi)

### Overview

展示如何在前面板查看MassData循环缓冲区的使用状态。

### Introduction

MassData提供帮助函数[`CSM - MassData Update Status Indicator.vi`]({% link docs/reference/api-addon-massdata.md %}#csm---massdata-update-status-indicatorvi)用于刷新缓存状态控件。

### Steps

- step1: 使用[`CSM - Config MassData Parameter Cache Size.vi`]({% link docs/reference/api-addon-massdata.md %}#csm---config-massdata-parameter-cache-sizevi)设置缓存大小。
- step2: 每次循环构造一组新数据。
- step3: 使用MassData API对数据进行打包解包，模拟实际使用。
- step4: 使用[`CSM - MassData Update Status Indicator.vi`]({% link docs/reference/api-addon-massdata.md %}#csm---massdata-update-status-indicatorvi)更新垂直方向缓存状态控件。
- step5: 使用[`CSM - MassData Update Status Indicator.vi`]({% link docs/reference/api-addon-massdata.md %}#csm---massdata-update-status-indicatorvi)更新水平方向缓存状态控件。
- Step6：循环间隔，每个循环重复step3~step5。
- Step7：(optional) 可通过本插件提供的CSM-Tool更快捷地查看MassData缓存状态。

## 在非CSM框架中使用MassData(3. MassData in Non-CSM Framework.vi)

### Overview

展示如何在非CSM的生产者-消费者框架中使用MassData传递大数据。

### Introduction

生产者将数据打包为MassData参数，通过队列传给消费者解包处理。

### Steps

- step1: 使用[`CSM - Config MassData Parameter Cache Size.vi`]({% link docs/reference/api-addon-massdata.md %}#csm---config-massdata-parameter-cache-sizevi)设置缓存大小。
- step2: 数据生产者循环
    - step2.1: 构造原始数据。
    - step2.2: 调用CSM - Convert MassData to Argument.vim将原始数据转换为MassData参数。
    - step2.3: 将MassData参数通过队列传输给消费者。
- step3: 数据消费者循环
    - step3.1: 从队列接收MassData参数。
    - step3.2: 调用CSM - Convert Argument to MassData.vim将参数转换为原始数据。
    - step3.3: (optional) 使用[`CSM - MassData Update Status Indicator.vi`]({% link docs/reference/api-addon-massdata.md %}#csm---massdata-update-status-indicatorvi)更新缓存状态控件。


## 在CSM框架中使用MassData(4. MassData in CSM.vi)

### Overview

展示如何在CSM框架中使用MassData进行模块间大数据传递。

### Introduction

使用非CSM循环作为数据生产者，将数据打包为MassData参数，通过同步消息发送给CSM消费者模块。

### Steps

- step1: 使用[`CSM - Config MassData Parameter Cache Size.vi`]({% link docs/reference/api-addon-massdata.md %}#csm---config-massdata-parameter-cache-sizevi)设置缓存大小。
- step2: 数据生产者循环（非CSM模块）。
    - step2.1: 构造原始数据并调用CSM - Convert MassData to Argument.vim转换为MassData参数。
    - step2.2: 使用[`CSM - Wait and Send Message for Reply.vi`]({% link docs/reference/api-05-module-operation-api.md %}#csm---wait-and-send-message-for-replyvi)将数据作为API: Update Waveform的参数发送给CSM模块，标记发送者为Producer。
    - step2.3: 仅在Generate按钮按下时发送数据。
    - step2.4: (optional) 使用[`CSM - MassData Update Status Indicator.vi`]({% link docs/reference/api-addon-massdata.md %}#csm---massdata-update-status-indicatorvi)更新缓存状态控件。
- step3: 数据消费者循环（CSM模块，名称为"CSM"）。
    - step3.1: 在API: Update Waveform分支中，使用CSM - Convert Argument to MassData.vim将收到的MassData参数转换为原始数据并显示。
    - step3.3: (Optional) 其他分支与template一致，无修改。
- step4: 退出时使用[`CSM - Wait and Send Message for Reply.vi`]({% link docs/reference/api-05-module-operation-api.md %}#csm---wait-and-send-message-for-replyvi)发送同步消息"Macro: Exit"给CSM模块。

## 更多资源

- **GitHub**: https://github.com/NEVSTOP-LAB/CSM-MassData-Parameter-Support
- **调试工具**：CSM Tools中的MassData Cache Status Viewer
