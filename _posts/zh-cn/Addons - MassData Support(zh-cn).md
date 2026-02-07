# CSM MassData Support Addon    

## 概述

MassData支持大数据传输（数组、波形等）和复杂数据类型的无损传递。通过内存引用而非数据拷贝实现高效传输。

### 特点

- 所有CSM模块共享循环缓冲区，满时覆盖旧数据
- 参数类型为`<MassData>`（通过CSM - Argument Type VI获取）
- 提供调试工具监控缓存状态

## 1. MassData参数格式 (MassData Argument Format.vi)

参数格式：`<massdata>Start:8057;Size:4004;DataType:1D I32`

- Start：内存起始地址
- Size：数据大小（字节）
- DataType：（可选）数据类型，取决于所用打包函数

示例展示两种打包方式：
- I32数组：使用`CSM - Convert MassData to Argument With DataType.vim`（包含DataType）
- 波形数据：使用`CSM - Convert MassData to Argument.vim`（不含DataType）

打包→解包后数据完全一致。

## 2. 查看缓存状态 (Show MassData Cache Status in FP.vi)

使用`CSM - MassData Update Status Indicator.vi`在前面板显示缓存使用情况。

步骤：设置缓存大小 → 循环生成数据 → 打包/解包 → 更新UI指示器（支持垂直/水平方向）

提示：可通过CSM-Tool更快捷查看缓存状态。

## 3. 非CSM框架中使用 (MassData in Non-CSM Framework.vi)

生产者-消费者模式示例：
- 生产者：构造数据 → 打包为MassData → 通过队列发送
- 消费者：从队列接收 → 解包MassData → 处理数据

MassData可用于任意LabVIEW架构，不限于CSM框架。

## 4. CSM框架中使用 (MassData in CSM.vi)

生产者（普通循环）→ 消费者（CSM模块）：
- 生产者：构造数据 → 打包为MassData → 通过`CSM - Wait and Send Message for Reply.vi`发送（API: Update Waveform）
- 消费者：CSM模块在API分支中解包MassData并显示
- 退出时发送"Macro: Exit"同步消息
