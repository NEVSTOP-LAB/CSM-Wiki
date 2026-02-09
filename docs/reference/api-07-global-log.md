---
title: 全局日志(Global Log)
layout: default
parent: 参考文档
nav_order: 17
---

# 全局日志(Global Log)

## CSM - Global Log Queue.vi
获取全局日志的队列句柄，可以从这个队列中获取全局日志事件。

> - Ref: CSM全局日志功能
> - Ref: CSM全局日志获取方法

<b>参考范例</b>：
- `4. Advance Examples\Filter From Source(Queue).vi`
- `4. Advance Examples\Filter From Subscriber(Queue).vi`

-- <b>输出控件(Indicators)</b> --
- <b>Global Log Queue</b>: 全局日志队列句柄。

## CSM - Global Log Event.vi
获取CSM全局日志用户事件句柄，用于从全局日志队列中获取全局日志用户事件。

> - Ref: CSM全局日志功能
> - Ref: CSM全局日志获取方法

<b>参考范例</b>：
- `4. Advance Examples\Filter From Source(Event).vi`
- `4. Advance Examples\Filter From Subscriber(Event).vi`

-- <b>输出控件(Indicators)</b> --
- <b>CSM Global Log Event</b>: CSM全局日志用户事件句柄。
- <b>Timeout In ms (5000ms)</b>: 超时时间，默认5000 ms。

## CSM - Destroy Global Log Queue.vi
释放全局日志队列句柄。

> - Ref: CSM全局日志功能
> - Ref: CSM全局日志获取方法

<b>参考范例</b>：
- `4. Advance Examples\Filter From Source(Queue).vi`
- `4. Advance Examples\Filter From Subscriber(Queue).vi`

-- <b>输入控件(Controls)</b> --
- <b>Global Log Queue</b>: 全局日志队列句柄。

## CSM - Destroy Global Log Event.vi
释放CSM全局日志用户事件句柄。

> - Ref: CSM全局日志功能
> - Ref: CSM全局日志获取方法

<b>参考范例</b>：
- `4. Advance Examples\Filter From Source(Event).vi`
- `4. Advance Examples\Filter From Subscriber(Event).vi`

-- <b>输入控件(Controls)</b> --
- <b>CSM Global Log Event</b>: CSM全局日志用户事件句柄。
- <b>Force Destroy? (F)</b>: 是否强制销毁，默认不强制。
- <b>Timeout In ms (5000ms)</b>: 超时时间，默认5000 ms。

## CSM - Global Log Error Handler.vi
CSM错误处理函数。如果发生错误，错误信息将通过CSM Global Log发布。从而可以将一些不在CSM框架的错误信息统一的记录在全局日志中。

-- <b>输入控件(Controls)</b> --
- <b>Place ("" to Use VI's Name)</b>: 标记发生错误的位置，默认使用调用VI的名称。
- <b>Clear Error? (T)</b>: 是否清除错误。默认清除，经过此VI后，错误将被清除。

## CSM - Generate User Global Log.vi
生成一个自定义的用户日志，用于调试等场景。当此VI的输入参数中包含错误信息时，将调用CSM - Global Log Error Handler VI记录错误信息。

-- <b>输入控件(Controls)</b> --
- <b>Log</b>: 事件名称。
- <b>Arguments</b>: 事件参数。
- <b>From Who</b>: 来源。
- <b>ModuleName</b>: 模块名称。
- <b>Place ("" to Use VI's Name)</b>: 发生错误的地点，默认使用VI的名称。

## Filter Rules

### CSM - Set Log Filter Rules.vi
设置全局的源端过滤规则，当log满足过滤规则时，将不会在源头被发送，因此任何工具也将不能再检测到这个log记录。

> - Ref: 全局日志过滤位置
> - Ref: 全局日志过滤规则

<b>参考范例</b>：
- `4. Advance Examples\Filter From Source(Queue).vi`
- `4. Advance Examples\Filter From Source(Event).vi`

### CSM - List Log Filter Rules As Strings.vi
以字符串的格式将全局过滤规则列出来，每个规则占一行，可供用户查看。主要用于后台日志文件保存、调试界面查看等。

> - Ref: 全局日志过滤规则

-- <b>输出控件(Indicators)</b> --
- <b>Rule Strings</b>: 过滤规则字符串。

### CSM - Convert Filter Rules.vi
将过滤规则簇列表转换为过滤规则类实例。以类的形式提供接口可以保证接口的向前兼容，在功能修改后，旧的接口不变。目前这个VI主要用于CSM File Logger Addon.

> - Ref: 全局日志过滤规则

### CSM - Filter Global Log.vi
这是一个订阅端过滤VI，用于判断是否log被满足过滤规则。过滤判断发生在订阅端，因此不会影响其他工具的订阅。

> - Ref: 全局日志过滤规则

### Utility VIs

#### Global Log To String.vi
全局日志(Global Log)数据簇转换为字符串。

-- <b>输入控件(Controls)</b> --
- <b>Log</b>: 全局日志数据簇。

-- <b>输出控件(Indicators)</b> --
- <b>Log String</b>: 全局日志字符串。

#### Global Log To String(Source Time).vi
将全局日志(Global Log)数据簇转换为字符串，使用发送时间作为时间戳。

-- <b>输入控件(Controls)</b> --
- <b>Log</b>: 全局日志数据簇。
- <b>Format String</b>: 时间戳格式。

-- <b>输出控件(Indicators)</b> --
- <b>Log String</b>: 全局日志字符串。

#### Global Log History Cacher.vi
保存当前输入的字符串到缓存，缓存的历史字符串，当超出最大长度限制时，最先进入的缓存字符串将被覆盖。用于调试CSM的历史状态。

-- <b>输入控件(Controls)</b> --
- <b>Global Log Data</b>: 收到的Global Log信息数据包。
- <b>Length (10000)</b>: 缓存的历史字符串最大字符串长度。
- <b>Level (Normal)</b>: 处理等级，Normal为正常处理，更高的等级会省略不同的信息，以提高处理速度。
- <b>Time Format String</b>: 时间戳格式。
- <b>With Periodic Info? (T)</b>: 是否折叠周期性的log。
- <b>Remove Immediately? (F)</b>: 是否立即移除周期性的折叠信息。
- <b>Reset?</b>: 重置标志。
- <b>Settings</b>: 周期性的log配置信息，可以设置检测周期与周期性阈值，来判断是否折叠。

-- <b>输出控件(Indicators)</b> --
- <b>String Cache</b>: 缓存的历史字符串。

#### Auto Processing Level.vi
根据当前全局日志队列的日志数量，动态的推算推荐的日志处理等级。

-- <b>输入控件(Controls)</b> --
- <b>#Left In Q</b>: 全局日志队列中剩余的日志数量。
- <b>Debounce Period (5s)</b>: 日志处理升级时间，在指定时间内全局日志失踪在增加，将提高处理等级。
- <b>Period (0.1s)</b>: 检测周期，默认100 ms。
- <b>Reset? (F)</b>: 重置标志。

-- <b>输出控件(Indicators)</b> --
- <b>Level</b>: 处理等级，Normal为正常处理，更高的等级会省略不同的信息，以提高处理速度。
- <b>LogInQ Changing Speed (#/s)</b>: 当前全局日志队列的日志变化速度。
- <b>Since Upgraded (S)</b>: 自从上次升级处理等级以来的时间。

### Exit With Empty Queue Check.vi
此VI用于使用Global Log Queue的全局日志监控循环，例如`template/CSM - Global Log Queue Monitoring Loop.vi`或CSM File Logger的后台线程。

通常这些全局日志的监控循环的退出条件会在程序退出时成立，这时可能队列中的日志还没有完全的处理完毕，这个VI用于在<b>Stop</b>信号到来后，再给一段时间<b>Timeout (5s)</b>来处理队列中的日志。当队列中日志的数量为空或超时后，才会将 <b>Exit</b>置真，真正的退出循环。

-- <b>输入控件(Controls)</b> --
- <b>Queue</b>: 队列资源，例如Global Log Queue。
- <b>Stop</b>: 输入的停止信号，当此信号为真时，将开始检查队列是否为空。

-- <b>输入控件(Controls)</b> --
- <b>Timeout (5s)</b>: 超时时间，默认5 s。
- <b>Exit</b>: 真实的退出信号，当队列为空，或超时时为TRUE。
- <b>Since Exiting (s)</b>: 自退出开始的时间，单位为秒。
