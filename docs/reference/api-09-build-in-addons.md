---
title: 内置插件(Built-in Addons)
layout: default
parent: 参考文档
nav_order: 19
---

# 内置插件(Build-in Addons)

## CSM WatchDog Addon

{: .note .callout-hover }
> **CSM WatchDog实现的原理**
>
> LabVIEW VI退出时，会自动释放所有队列、事件等句柄资源。因此，您可以通过创建一个WatchDog线程，监控一个由主程序VI申请创建的队列资源，当这个队列资源在主VI退出后被释放时，触发WatchDog线程给还未退出的CSM模块发送`Macro: Exit`，保证他们正常的退出。

### CSM - Start Watchdog to Ensure All Modules Exit.vi
启动CSM Watchdog线程，用于监控主程序是否退出。一般在主程序启动后立即执行。

<b>应用场景</b>: 用于保证在主程序退出后，所有的异步启动的CSM模块都能正常退出。

### CSM Watchdog Thread.vi
CSM Watchdog线程，用于保证在主程序退出后，所有的异步启动的CSM模块都能正常退出。

-- <b>输入控件(Controls)</b> --
- <b>Watchdog Queue</b>: Watchdog队列资源。

## CSM File Logger Addon

### CSM - Start File Logger.vi
启动CSM Global Log文件记录后台线程，用于将应用中的全部运行记录保存到指定的文本文件中。

{: .note .callout-hover }
> <b>全局日志过滤规则</b>
>
> 全局日志过滤规则是可以将一类日志进行过滤，不出现在全局日志中。
>
> 目前有三类:
> - 全局规则，针对符合条件的所有模块，目前可设置:
>    - 模块名称: 该模块所有名称均会被过滤。
>    - 日志类型: 如状态、消息、广播、模块初始化等。
>    - 状态名称: 任意模块的该名称状态都会被过滤。
>    - 状态类型: 状态的类型，内部状态、外部消息等。
>
> - 模块规则，可针对模块设置对应的规则，目前可设置:
>    - 模块的日志类型: 该模块的日志类型会被过滤。
>    - 状态名称: 该模块的同名状态会被过滤。
>    - 状态类型: 该模块的状态类型会被过滤。
>
> - 周期过滤规则: 此规则目前只能针对订阅处有效，因为发布位置不容易统计数目。
>    - 是否启用周期过滤。
>    - Threshold(#/s): 周期过滤阈值。
>    - CheckPeriod(s): 检查窗口时间。

<b>参考范例</b>:  [CSM应用日志记录示例]({% link docs/plugins/csmlogger.md %}#使用示例) - `Addons - Logger\CSM Application Running Log Example.vi`。

-- <b>输入控件(Controls)</b> --
- <b>Log File Path</b>: 记录文件路径。
- <b>Timestamp format</b>: 时间格式，默认为`%<%Y/%m/%d %H:%M:%S%3u>T`。
- <b>Log Limit</b>: 记录文件大小限制。File Size为单个文件的最大大小，单位为字节(byte)，默认为10MB；File Num为LOG文件最多个数，默认值为2。
- <b>Filter Rules</b>: 过滤规则，通过CSM - Convert Filter Rules VI进行配置。
- <b>Enable? (T)</b>: 是否启用文件记录功能，默认为启用，当输入为FALSE时，文件记录功能不启用。
- <b>WatchDog? (T)</b>: 是否启用 WatchDog功能，默认启用，当调用的VI退出后，分配的WatchDog资源会自动释放，触发记录线程也会自动退出；也可以手动释放WatchDog资源，触发记录线程也会自动退出。
- <b>Exit When All Module Exist? (F)</b>: 全部CSM模块退出后自动退出记录。默认不启用。如果启用该选项，在主程序不是CSM时，在运行中所有的CSM模块都退出，记录线程也会自动退出。

-- <b>输出控件(Indicators)</b> --
- <b>Log File</b>: CSM lOG文件路径。
- <b>Watchdog Queue</b>: WatchDog资源句柄。

### CSM-Logger-Thread.vi
CSM - Start File Logger VI中使用的线程VI。

{: .note .callout-hover }
> <b>CSM File Logger实现的原理</b>
>
> 通过CSM的Global Log API，获取应用中的全部运行记录，并保存到指定的文本文件中，用于后期分析和错误定位。文件格式为文本文件，后缀名为`.csmlog`，可以通过记事本等文本编辑查询工具打开。

### CSM-Logger-Thread(Event).vi
CSM - Start File Logger VI中原本使用的线程VI。已废弃，目前使用CSM-Logger-Thread VI。

{: .note .callout-hover }
> <b>CSM File Logger实现的原理</b>
>
> 通过CSM的Global Log API，获取应用中的全部运行记录，并保存到指定的文本文件中，用于后期分析和错误定位。文件格式为文本文件，后缀名为`.csmlog`，可以通过记事本等文本编辑查询工具打开。

## CSM周期状态支持(CSM Loop Support Addon)

### CSMLS - Define Loop State(s).vi
定义循环操作，通过标记`-><loop>`来标识重复循环的状态。这个循环也会在最后添加`-><end>`标记循环的结束。

例如可以定义以下循环:

    DAQ: Initialize
    DAQ: Start
    DAQ: Continue Check -><loop> //在此循环中调用CSMLS - Append Continuous State VI重复采集，并等待一段时间，用于循环间隔
    DAQ: Stop
    DAQ: Close -><end> // -><end> 会自动添加

在循环过程中，同步消息由于优先级高，因此会打断循环，立即执行同步消息。异步消息优先级低，会被出队列后加入`-><end>`标记之后，此时经过`DAQ: Continue Check`中的CSMLS - Append Continuous State VI，会将`-><end>`标记之后的状态提到队列前端，这样就会在循环过程中响应异步消息了。

可以通过移除`-><loop>`来表示循环已结束，两个API可供选择:
- CSMLS - Remove Loop Tag and previous State(s) to Break VI: 移除`-><loop>`标记所在行以及之前的所有状态，用于跳出循环。
- CSMLS - Remove Loop Tag to Break VI: 移除`-><loop>`标记所在行，用于跳出循环。

<b>参考范例</b>:  [连续循环示例]({% link docs/examples/example-csm-advance-example.md %}#多循环模块示例main---call-and-monitor-tcp-trafficvi) - `Addons - Loop Support\CSMLS - Continuous Loop in CSM Example.vi`。

{: .note .callout-hover }
> <b>CSM LOOP Support设计的原因</b>
>
> 循环是状态机运行的基本单位，它会在状态机运行时不断地执行。用户可以自己通过逻辑来定义循环的条件，也可以使用CSM推荐的Loop Support Addon来定义循环。
>
> 通常定义的循环方案，可能会有以下的问题:
> - 如果在一个Case分支中使用循环实现，会导致状态机的卡死在此状态中，无法正常切换，也不能响应外部的消息；
> - 如果通过在状态循环的最后一个状态中，继续插入下一个循环的状态，也会导致不能很好的响应外部的消息，且很不直观。
>
> Loop Support定义循环的方式，它的优势是可以在循环运行时，依然响应其他事件，而不会阻塞状态机的运行。
> 使用CSM Loop-Support VIs来定义、附加和终止循环，通过定义特殊的标记，来标识循环对应的状态，和结束状态。
> 因此，这个插件主要是为了提供一个标准的循环实现方式，解决以上的问题。

{: .warning .callout-hover }
> <b>CSM LOOP Support应用范围</b>
>
> CSM 的协作者模式(worker) 和 责任链(chain)模式，是由多个运行的节点组成特殊的模块，发送的消息，并不能明确的让某个节点执行。当某节点使用此模式时，就不能明确的使用消息通知它停止循环，因此，不建议在协作者模式(worker) 和 责任链(chain)模式中使用CSM LOOP Support。

-- <b>输入控件(Controls)</b> --
- <b>States Queue</b>: 整个状态队列被连接到此输入。
- <b>Loop States</b>: 循环状态。
- <b>Add to Front? (F)</b>: 是否添加到所有状态前，通常为FALSE。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 处理后的消息队列。

### CSMLS - Append Continuous State.vi
添加循环状态，维持循环继续运行。

<b>参考范例</b>:  [连续循环示例]({% link docs/examples/example-csm-advance-example.md %}#多循环模块示例main---call-and-monitor-tcp-trafficvi) - `Addons - Loop Support\CSMLS - Continuous Loop in CSM Example.vi`。

-- <b>输入控件(Controls)</b> --
- <b>States Queue</b>: 整个状态队列被连接到此输入。
- <b>Loop State(s) and Arguments</b>: 循环状态。
- <b>Continuous State</b>: 循环状态名称。
- <b>Continuous Arguments ("")</b>: 循环状态参数。
- <b>Append(T)</b>: 是否添加。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 剩余的消息队列。

### CSMLS - Remove Loop Tag and previous State(s) to Break.vi
通过移除`<loop>`标记和`<loop>`标记前的所有状态，达到停止循环。

<b>举例</b>: 假如CSM的消息队列中，还存在以下消息，此时执行当前API操作，将移除注释所在的消息。

    DAQ: Acquire                    //将被移除
    DAQ: Continuous Check -><loop>  //将被移除
    DAQ: Stop
    DAQ: Close

相当于不会执行任何DAQ操作，立即直接进入停止和释放。

-- <b>输入控件(Controls)</b> --
- <b>States Queue</b>: 整个状态队列被连接到此输入。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 剩余的消息队列。

### CSMLS - Remove Loop Tag to Break.vi
通过移除`<loop>`标记，达到停止循环。

举例: 假如CSM的消息队列中，还存在以下消息，此时执行当前API操作，将移除注释所在的消息。

    DAQ: Acquire
    DAQ: Continuous Check -><loop>  //将被移除
    DAQ: Stop
    DAQ: Close

相当于依然会执行当前的DAQ操作，然后进入停止和释放。

-- <b>输入控件(Controls)</b> --
- <b>States Queue</b>: 整个状态队列被连接到此输入。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 剩余的消息队列。

### CSMLS - Add Exit State(s) with Loop Check.vi
退出时检查循环标记。由于这个VI很容易忘记调用，因此已经在Parse State Queue++ VI中针对`Macro: Exit`状态添加了调用。因此已从函数选板移除。

-- <b>输入控件(Controls)</b> --
- <b>States Queue</b>: 整个状态队列被连接到此输入。
- <b>Exiting States</b>: 退出所需的状态。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 处理后的消息队列。
- <b><loop> Found</b>: 找到 <loop>标记。

## CSM Attributes 补充功能

### CSM Set Module Attribute.vim
此API提供CSM - Set Module Attribute VI自动适应输入数据类型的版本。


### CSM Get Module Attribute.vim
此API提供CSM - Get Module Attribute VI自动适应输入数据类型的版本。

