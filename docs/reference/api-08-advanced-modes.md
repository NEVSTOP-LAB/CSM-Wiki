---
title: 高级模式(Advanced Modes)
layout: default
parent: 参考文档
nav_order: 18
---

# 高级模式

## 系统级模块 (System-Level Module API)

### CSM - Mark As System-Level Module.vi
在输入字符串前添加`.`，即可将此模块标记为系统级模块，例如输入为`UIModule`，输出为`.UIModule`。

<b>参考范例</b>:  `0. Base Concepts\7. System-Level Module.vi`。

> - Ref: 名称拼接API
> - Ref: CSM系统级模块

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Marked As System-Level Module)</b>: 添加`.`标记的CSM模块名称。

## 子模块

### Concatenate Submodule Name.vi
拼接生成子模块名。

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。
- <b>Name</b>: 要拼接的名称。

-- <b>输出控件(Indicators)</b> --
- <b>Submodule Name</b>: 拼接生成的子模块名。

## 工作者模式 (Work Mode API)
### CSM - Mark As Worker Module.vi
在CSM名称后添加`#`，以标记此模块为协作者模式模块。

<b>参考范例</b>:  `4. Advance Examples\1. Action Workers Example`。

> - Ref: 名称拼接API
> - Ref: CSM工作者模式(Worker Mode)

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Marked As Worker)</b>: 添加`#`标记的CSM模块名称。

## 责任链模式 (Chain of Responsibility API) - 待完善

### CSM - Mark As Chain Module.vi

拼接责任链模式模块的名称，使用`$`作为分隔符。注意Order不必连续，但是必须唯一，编号小的节点，将排列在责任链的前面。

<b>参考范例</b>:  `4. Advance Examples\2. Chain of Responsibility Example`。

> - Ref: CSM责任链模式(Chain of Responsibility Mode)
> - Ref: 名称拼接API

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>:  CSM模块名称。
- <b>Order</b>: 责任链模式下的顺序，编号小的节点，将排列在责任链的前面。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Marked As Chain)</b>: 添加`$`标记的CSM模块名称。

### CSM - Resolve Node Module.vi
通过将高级模式的节点名称解析出对应的CSM模块名称。

例如:
- 工作者模式节点的名称为`module#59703F3AD837`，得到的结果是`module`。
- 责任链模式节点的名称为`module$1`，得到的结果是`module`。

-- <b>输入控件(Controls)</b> --
- <b>CSM Module Name</b>: CSM模块名称。
- <b>Node Name</b>: 节点名称。

## 多循环模式支持(Multi-Loop Support)

### CSM - Request CSM to Post Message.vi
申请CSM模块给出异步消息。此API主要用于CSM多循环模式下，其他模块中申请CSM发出消息。

在此场景下，通常也可以使用CSM - Post Message VI，但是它发送的时刻无法确定，而且也不能获得异步消息的返回值。此VI是一个补充。

<b>参考范例</b>：`4. Advance Examples\5. Multi-Loop Module Example\TCP Server Module(Multi-Loop Support).vi`。

> - Ref: CSM多循环模式(Multi-Loop Mode)

-- <b>输入控件(Controls)</b> --
- <b>Module Name</b>: 发送状态的CSM。
- <b>State</b>: 消息名称。
- <b>Arguments ("")</b>: 将被广播的状态参数。
- <b>Without Reply? (F)</b>: 是否需要返回。当需要返回时，发出的是异步消息；不需要返回时，发出的是异步无返回消息。
- <b>Target Module ("" By Default)</b>: 目标模块。
- <b>Immediately? (F)</b>: 立即执行选项。立即发送会让此消息在CSM循环中立即被处理，而不是等待CSM循环中现存的消息执行完毕。

### CSM - Request CSM to Broadcast Status Change.vi
申请CSM发送广播。此API主要用于CSM多循环模式下，其他模块中申请CSM发出广播，通知其他模块状态改变。

<b>参考范例</b>：`4. Advance Examples\5. Multi-Loop Module Example\TCP Server Module(Multi-Loop Support).vi`。

> - Ref: CSM多循环模式(Multi-Loop Mode)

-- <b>输入控件(Controls)</b> --
- <b>Module Name</b>: 发送状态的CSM。
- <b>Status</b>: 将被广播的状态。
- <b>Arguments ("")</b>: 将被广播的状态参数。
- <b>Broadcast? (T)</b>: 控制是否广播的开关输入。
- <b>Priority ("Status")</b>: 广播的优先级, 默认为"信号广播(Status)"，或"中断广播(Interrupt)"。
- <b>Immediately? (F)</b>: 立即执行选项。立即发送会让此消息在CSM循环中立即被处理，而不是等待CSM循环中现存的消息执行完毕。

### CSM - Forward UI Operations to CSM.vi
此VI主要应用于多循环模式下，将并行于CSM循环的UI循环中用户操作产生的时间，转发到CSM循环中处理。CSM DQMH-Style Template VI模板就是这个逻辑。

<b>参考范例</b>：`Addons - Loop Support\CSMLS - Continuous Loop in CSM Example.vi`。

> - Ref: CSM多循环模式(Multi-Loop Mode)

-- <b>输入控件(Controls)</b> --
- <b>State(s) In ("")</b>: 待处理的状态。
- <b>Name ("" to Use UUID)</b>: 模块的名称。
- <b>High Priority? (T)</b>: 立即执行选项。立即发送会让此消息在CSM循环中立即被处理，而不是等待CSM循环中现存的消息执行完毕。

-- <b>输出控件(Indicators)</b> --
- <b>States Out</b>: 输入始终为空，是为了在模板中保证连线一致性设置的输出端。

### CSM - Module Turns Invalid.vi
检查CSM是否已经退出。通常用于和CSM并行的功能循环的跟随CSM循环退出。

CSM高级模式的模块(协作者模式、责任链模式)只有在最后一个节点退出后，才会触发模块退出事件。

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。

-- <b>输出控件(Indicators)</b> --
- <b>Turn Invalid (Exit)?</b>: CSM模块是否已经退出。
