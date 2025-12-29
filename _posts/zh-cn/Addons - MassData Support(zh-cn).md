# CSM MassData Support Addon    

## 概述

CSM Massdata参数支持提供了一种高效的参数传递机制，用于在CSM中传递大量数据，例如：数组、波形数据等。也用于无损的传递复杂数据类型数据等场景。

### 主要特点

1. **高效传输**：通过使用内存高效的引用机制而非直接传输数据，从而提高了参数传递的效率和性能。
2. **无损传输**：CSM Massdata数据传输是完全无损的，适合传递复杂数据类型。
3. **共享缓存**：同一应用程序内的所有CSM模块共享相同的Massdata缓冲区空间。
4. **循环缓冲区**：内部使用循环缓冲区机制，当缓冲区满时，新数据将从开始位置覆盖旧数据。
5. **类型支持**：支持多种数据类型，包括数组、波形数据等复杂数据类型。
6. **调试支持**：提供了调试工具，用于监控缓存使用情况，帮助优化配置。

### Massdata参数类型

CSM Massdata定义的参数类型为`<MassData>`，可以通过CSM - Argument Type VI获取。

### MassData参数格式 (1. MassData Argument Format.vi)

### Overview

Massdata 参数用于在 CSM 框架中传递大量数据，例如：数组、波形数据等。也用于无损的传递复杂数据类型数据等场景。本范例用于展示CSM API参数中支持的MassData参数格式。

### Introduction

本范例中模拟产生了两组数据：一组是I32数组数据，一组是波形数据，并将这两组数据转换为massdata 参数。

CSM的参数中支持的MassData参数格式如下：

```
<massdata>Start:8057;Size:4004;DataType:1D I32
```

每个部分的含义如下：

- <massdata>: 表示这是一个 MassData 参数。
- Start：MassData 数据在内存中的起始地址。
- Size：MassData 数据的大小（字节数）。
- DataType：(optional) MassData 数据的类型, 选择的打包函数不同，可以不包含该部分。

### Steps

- Step1: I32数组数据, 此部分选择的打包函数为`CSM - Convert MassData to Argument With DataType.vim`，因此包含DataType部分。
    - step1.1: 构造原始数据，在实际程序中来源与硬件采集、数据接收等情况。
    - step1.2: 调用`CSM - Convert MassData to Argument With DataType.vim`，将原始数据转换为massdata 参数。可以在前面板查看转换后的参数格式。
    - step1.3: 使用CSM - MassData Data Type String.vi 获取MassData 参数字符串中的数据类型。
    - step1.4: 使用CSM - Argument Type.vi 获取CSM参数标签，在这里是 <massdata>。
    - step1.5: 将 CSM massdata 参数转换回原始数据，可以在前面板查看转换后的数据，应该与原始数据完全匹配。

- Step2: 波形数据, 此部分选择的打包函数为`CSM - Convert MassData to Argument.vim`，因此不包含DataType部分。
    - step2.1: 构造原始数据，在实际程序中来源与硬件采集、数据接收等情况。
    - step2.2: 调用`CSM - Convert MassData to Argument.vim`，将原始数据转换为massdata 参数。可以在前面板查看转换后的参数格式，选择这个打包函数，不包含DataType部分。
    - step2.3: 使用CSM - Argument Type.vi 获取CSM参数标签，在这里是 <massdata>。
    - step2.4: 将 CSM massdata 参数转换回原始数据，可以在前面板查看转换后的数据，应该与原始数据完全匹配。


## 查看massdata缓存状态 (2. Show MassData Cache Status in FP.vi)

### Overview

Massdata 使用一个后台环形队列来缓存数据，队列的大小可以在CSM API参数中配置。本范例用于展示如何查看MassData缓存状态。

### Introduction

MassData 提供了一个帮助函数 CSM - MassData Update Status Indicator.vi，用于查看MassData缓存状态。本范例展示了如何使用这个函数。

### Steps

- step1: 使用 CSM - Config MassData Parameter Cache Size.vi 设置缓存大小，可以在界面直观的看到这个设置是生效的。
- step2: 每次循环中，构造一组新的数据。
- step3: 使用 CSM MassData 的API对数据进行打包解包，模拟实际程序中的使用情况。
- step4: 使用 CSM - MassData Update Status Indicator.vi 更新垂直方向的UI界面缓存状态控件刷新。
- step5: 使用 CSM - MassData Update Status Indicator.vi 更新水平方向的UI界面缓存状态控件刷新。
- Step6：循环间隔，每个循环会重复 step3~step4。
- Step7：(optional) 可以通过本插件提供的 CSM-Tool 更加快捷的查看MassData缓存状态。

## 在非CSM框架中使用MassData(3. MassData in Non-CSM Framework.vi)

### Overview

MassData 也可以在非CSM框架中使用。本范例用于展示如何在非CSM框架中使用MassData。

### Introduction

通过一个生产者消费者框架的范例，展示了如何在非CSM框架中使用MassData。数据生产者负责生产数据，将数据打包为MassData 参数，并通过队列传输给数据消费者，数据消费者负责消费数据，将MassData格式的数据解包为原始数据，并进行处理。本范例展示了这个过程。

### Steps

- step1: 使用 CSM - Config MassData Parameter Cache Size.vi 设置缓存大小。
- step2: 数据生产者循环
    - step2.1: 构造原始数据，在实际程序中来源与硬件采集、数据接收等情况。
    - step2.2: 调用 CSM - Convert MassData to Argument.vim 将原始数据转换为MassData参数。
    - step2.3: 将转换后的MassData参数通过队列传输给数据消费者。
- step3: 数据消费者循环
    - step3.1: 从队列中接收MassData 参数。
    - step3.2: 调用 CSM - Convert Argument to MassData.vim 将massdata 参数转换为原始数据。
    - step3.3: (optional) 使用 CSM - MassData Update Status Indicator.vi 更新UI界面缓存状态控件刷新。


## 在CSM框架中使用MassData(4. MassData in CSM.vi)

### Overview

本范例用于展示如何在CSM框架中使用MassData。

### Introduction

本范例通过一个生产者消费者的场景，展示了如何在CSM框架中使用MassData。

使用一个非CSM循环生成数据生产者负责生产数据，将数据打包为MassData 参数，并通过同步消息发送给作为数据消费者的CSM模块。本范例展示了这个过程。

### Steps

- step1: 使用 CSM - Config MassData Parameter Cache Size.vi 设置缓存大小。
- step2: 数据生产者循环，这个循环不是CSM模块。
    - step2.1: 构造原始数据，在实际程序中来源与硬件采集、数据接收等情况, 调用 CSM - Convert MassData to Argument.vim 将原始数据转换为MassData 参数。
    - step2.2: 使用 CSM - Wait and Send Message for Reply.vi 将数据作为 API: Update Waveform 的参数，发送给CSM模块，并标记发送者为Producer。
    - step2.3: 在 Generate 按钮为按下状态时，才发送数据。
    - step2.4: (optional) 使用 CSM - MassData Update Status Indicator.vi 更新UI界面缓存状态控件刷新。
- step3: 数据消费者循环，这个循环是CSM模块，名称为"CSM"。
    - step3.1: 在 API: Update Waveform 分支中，将收到的参数使用 CSM - Convert Argument to MassData.vim 将MassData 参数转换为原始数据并显示。
    - step3.3: (Optional) 其他分支和 template 一致，没有修改。
- step4: 程序退出过程中，使用 CSM - Wait and Send Message for Reply.vi 发送同步消息“Macro: Exit” 给 CSM 模块，使CSM模块退出。