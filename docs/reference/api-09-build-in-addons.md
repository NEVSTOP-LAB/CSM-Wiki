---
title: 内置插件(Built-in Addons)
layout: default
parent: 参考文档
nav_order: 19
---

# 内置插件(Build-in Addons)

## CSM WatchDog Addon

### CSM - Start Watchdog to Ensure All Modules Exit.vi
启动CSM Watchdog线程，用于监控主程序是否退出。一般在主程序启动后立即执行。

<b>应用场景</b>: 用于保证在主程序退出后，所有的异步启动的CSM模块都能正常退出。

> - Ref: CSM WatchDog实现的原理

### CSM Watchdog Thread.vi
CSM Watchdog线程，用于保证在主程序退出后，所有的异步启动的CSM模块都能正常退出。

> - Ref: CSM WatchDog实现的原理

-- <b>输入控件(Controls)</b> --
- <b>Watchdog Queue</b>: Watchdog队列资源。

## CSM File Logger Addon

### CSM - Start File Logger.vi
启动CSM Global Log文件记录后台线程，用于将应用中的全部运行记录保存到指定的文本文件中。

> - Ref: 全局日志过滤规则

<b>参考范例</b>:  `Addons - Logger\CSM Application Running Log Example.vi`。

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

> - Ref: CSM File Logger实现的原理

### CSM-Logger-Thread(Event).vi
CSM - Start File Logger VI中原本使用的线程VI。已废弃，目前使用CSM-Logger-Thread VI。

> - Ref: CSM File Logger实现的原理

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

<b>参考范例</b>:  `Addons - Loop Support\CSMLS - Continuous Loop in CSM Example.vi`。

> - Ref: CSM Loop Support设计的原因
> - Ref: CSM LOOP Support应用范围

-- <b>输入控件(Controls)</b> --
- <b>States Queue</b>: 整个状态队列被连接到此输入。
- <b>Loop States</b>: 循环状态。
- <b>Add to Front? (F)</b>: 是否添加到所有状态前，通常为FALSE。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 处理后的消息队列。

### CSMLS - Append Continuous State.vi
添加循环状态，维持循环继续运行。

<b>参考范例</b>:  `Addons - Loop Support\CSMLS - Continuous Loop in CSM Example.vi`。

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

> - Ref: CSM - Set Module Attribute.vi

### CSM Get Module Attribute.vim
此API提供CSM - Get Module Attribute VI自动适应输入数据类型的版本。

> - Ref: CSM - Get Module Attribute.vi
