---
title: 模块操作接口(Module Operation API)
layout: default
parent: 参考文档
nav_order: 15
---

# 模块操作接口(Module Operation API)

## CSM - Wait for Module to Be Alive.vi
在指定的超时时间内等待CSM模块上线，返回等待时间，超时后返回错误。内部通过1 ms的间隔，周期性使用CSM - Check If Module Exists VI检查模块是否上线。

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。
- <b>Wait (5000ms)</b>: 等待模块上线的超时时间，默认为5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Dup)</b>: CSM模块名称。
- <b>Waited (ms)</b>: 已等待的时间。

## CSM - Wait for All Modules to be Alive.vi
在指定的超时时间内等待一组CSM模块全部上线，返回等待时间，超时后返回错误及未上线的模块名称。内部通过5 ms的间隔，周期性使用CSM - List Module VI检查是否所有模块都已上线。

-- <b>输入控件(Controls)</b> --
- <b>CSM Names</b>: CSM模块名称。
- <b>Wait (5000ms)</b>: 等待模块上线的超时时间，默认为5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>CSMs Left</b>: 超时后还未上线的CSM模块。
- <b>Waited (ms)</b>: 已等待的时间。

## CSM - Wait for All Modules to Exit.vi
在指定的超时时间内等待一组CSM模块全部下线，返回等待时间，超时后返回错误及未下线的模块名称。通常用于程序退出。

-- <b>输入控件(Controls)</b> --
- <b>CSM Names</b>: CSM 模块名称。
- <b>Wait (5000ms)</b>: 等待模块上线的超时时间，默认为5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>CSMs Left</b>: 超时后还未下线的CSM模块。
- <b>Waited (ms)</b>: 已等待的时间。

## CSM - Post Message.vi
发送异步消息到指定的CSM模块。由于是异步发送，因此不会等待返回，消息发送后继续执行之后的代码。如果CSM模块不存在，将返回Target Error。

> ![NOTE]
> 使用API发送的异步消息均为异步无返回消息，无法获取异步消息的返回参数。


{: .note }
> <b>异步消息</b>
>
> 异步消息是消息的一种。CSM发出异步消息后，将立即继续执行后续代码，而不会等待被调用方完成消息处理。异步消息分为异步调用(`->`)和异步不等待返回(`->|`)，区别只在于异步无返回消息，当被调用方完成操作后，不会将结果返回给调用方。
> 
> 调用方会发生的错误:
> - 如果输入的目标模块为`""`，会产生`NO Target Error`。
> - 如果输入的模块不存在，会产生`Target Error`。
> 
> 调用方不会停留等待返回:
> - 如果调用方是CSM模块，会在Parse State Queue++ VI发送消息后，进入`Async Message Posted`状态。
> - 如果是API调用，会继续执行后续代码，API只能发送异步无返回异步消息。
> 
> 返回:
> - 如果调用方是CSM模块
>   - 正常情况下，会进入`Async Response`状态处理返回。被调用方发生的错误，此信息仍然是消息的结果，在`Async Response`状态处理，可以从Additional Information中获取此错误信息。
>   - 如果是调用方发生的错误，会导致CSM状态机进入`Error Handler`模块，处理错误。
> - API只能发送异步无返回异步消息，无返回。

{: .note }
> <b>CSM消息的目标模块说明</b>
>
> 普通模式下，CSM消息的目标模块为指定的模块名称。
> 系统级模块只是名称上以`.`起始，CSM消息的目标模块包含`.`的名称， 如申请的模块名称为`.System`，CSM消息的目标模块就是`.System`。
> 协作者模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称，例如申请的模块名称为`Worker#`，CSM消息的目标模块就是`Worker`。
> 责任链模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称。例如申请的模块名称为`Chain$1`，CSM消息的目标模块就是`Chain`。

-- <b>输入控件(Controls)</b> --
- <b>Current Module ("" to Generate an ID)</b>: 当前模块名称，当没有输入时，生成一个临时ID，便于调试判断位置。
- <b>State</b>: 消息字符串。
- <b>Arguments ("")</b>: 消息参数。
- <b>Target Module</b>: 目标模块的名称。

## CSM - Wait and Post Message.vi
发送异步消息到指定的CSM模块，由于是异步发送，因此不会等待返回，消息发送后继续执行之后的代码。如果CSM模块不存在，将会等待指定的超时时间，仍然超时会返回超时错误。


{: .note }
> <b>异步消息</b>
>
> 异步消息是消息的一种。CSM发出异步消息后，将立即继续执行后续代码，而不会等待被调用方完成消息处理。异步消息分为异步调用(`->`)和异步不等待返回(`->|`)，区别只在于异步无返回消息，当被调用方完成操作后，不会将结果返回给调用方。
> 
> 调用方会发生的错误:
> - 如果输入的目标模块为`""`，会产生`NO Target Error`。
> - 如果输入的模块不存在，会产生`Target Error`。
> 
> 调用方不会停留等待返回:
> - 如果调用方是CSM模块，会在Parse State Queue++ VI发送消息后，进入`Async Message Posted`状态。
> - 如果是API调用，会继续执行后续代码，API只能发送异步无返回异步消息。
> 
> 返回:
> - 如果调用方是CSM模块
>   - 正常情况下，会进入`Async Response`状态处理返回。被调用方发生的错误，此信息仍然是消息的结果，在`Async Response`状态处理，可以从Additional Information中获取此错误信息。
>   - 如果是调用方发生的错误，会导致CSM状态机进入`Error Handler`模块，处理错误。
> - API只能发送异步无返回异步消息，无返回。

{: .note }
> <b>CSM消息的目标模块说明</b>
>
> 普通模式下，CSM消息的目标模块为指定的模块名称。
> 系统级模块只是名称上以`.`起始，CSM消息的目标模块包含`.`的名称， 如申请的模块名称为`.System`，CSM消息的目标模块就是`.System`。
> 协作者模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称，例如申请的模块名称为`Worker#`，CSM消息的目标模块就是`Worker`。
> 责任链模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称。例如申请的模块名称为`Chain$1`，CSM消息的目标模块就是`Chain`。

-- <b>输入控件(Controls)</b> --
- <b>Current Module ("" to Generate an ID)</b>: 当前模块名称，当没有输入时，生成一个临时ID，便于调试判断位置。
- <b>State</b>: 消息字符串。
- <b>Arguments ("")</b>: 消息参数。
- <b>Target Module</b>: 目标模块的名称。
- <b>Wait (5000ms)</b>: 等待模块上线的超时时间，默认为5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>Waited (ms)</b>: 已等待的时间。

## CSM - Send Message and Wait for Reply.vi
发送同步消息到CSM，等待返回后继续执行之后的代码。
- 超时未获取到返回消息，将返回CSM Timeout Error。
- 目标模块不存在，将返回Target Error。


{: .note }
> <b>同步消息</b>
>
> 同步消息是消息的一种。CSM发出同步消息后，将暂停状态变化，等待被调用方完成消息处理。同步消息通过`-@`描述。 一个JKISM模块通过同步消息对另一个模块的调用，叫做同步调用。
> 
> 调用方会发生的错误:
> - 如果输入的目标模块为`""`，会产生`NO Target Error`。
> - 如果输入的模块不存在，会产生`Target Error`。
> - 如果输入的模块存在，但是在指定的时间内还未完成处理，会产生`Timeout Error`。
> 
> 调用方会停留等待返回:
> - 如果调用方是CSM模块，会停留在Parse State Queue++ VI中。
> - 如果是API调用，会停留在调用VI，例如CSM - Send Message and Wait for Reply VI。
> 
> 返回:
> - 如果调用方是CSM模块
>   - 正常情况下，会进`Response`状态处理返回。
>   - 如果是调用方发生的错误，会导致CSM状态机进入`Error Handler`模块，处理错误。
>   - 如果是被调用方发生的错误，此信息仍然是消息的结果，在`Response`状态处理，可以从Additional Information中获取。
> - 如果是API调用
>   - Response输出为返回。
>   - 调用方和被调用方发生的错误，会合并到错误簇输出。
> - Ref: 全局超时时间设置

{: .note }
> <b>CSM消息的目标模块说明</b>
>
> 普通模式下，CSM消息的目标模块为指定的模块名称。
> 系统级模块只是名称上以`.`起始，CSM消息的目标模块包含`.`的名称， 如申请的模块名称为`.System`，CSM消息的目标模块就是`.System`。
> 协作者模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称，例如申请的模块名称为`Worker#`，CSM消息的目标模块就是`Worker`。
> 责任链模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称。例如申请的模块名称为`Chain$1`，CSM消息的目标模块就是`Chain`。

-- <b>输入控件(Controls)</b> --
- <b>Current Module ("" to Generate an ID)</b>: 当前模块名称，当没有输入时，生成一个临时ID，便于调试判断位置。
- <b>State</b>: 消息字符串。
- <b>Arguments ("")</b>: 消息参数。
- <b>Target Module</b>: 目标CSM模块名称。
- <b>Response Timeout (-2 Using Global Settings)</b>: 等待返回的超时设置，默认5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>Response</b>: 返回的响应。
- <b>Source CSM</b>: 返回的响应的来源CSM模块名称，在协作者模式或责任链模式下返回节点的名称。

## CSM - Wait and Send Message for Reply.vi
发送同步消息到CSM，等待返回后继续执行之后的代码。如果CSM模块不存在，将会等待指定的超时时间。可能出现以下错误:
- 如果模块发送时不存在，等待超时后返回超时错误。
- 可以发送消息，但超时未获取到返回消息，将返回CSM Timeout Error。


{: .note }
> <b>同步消息</b>
>
> 同步消息是消息的一种。CSM发出同步消息后，将暂停状态变化，等待被调用方完成消息处理。同步消息通过`-@`描述。 一个JKISM模块通过同步消息对另一个模块的调用，叫做同步调用。
> 
> 调用方会发生的错误:
> - 如果输入的目标模块为`""`，会产生`NO Target Error`。
> - 如果输入的模块不存在，会产生`Target Error`。
> - 如果输入的模块存在，但是在指定的时间内还未完成处理，会产生`Timeout Error`。
> 
> 调用方会停留等待返回:
> - 如果调用方是CSM模块，会停留在Parse State Queue++ VI中。
> - 如果是API调用，会停留在调用VI，例如CSM - Send Message and Wait for Reply VI。
> 
> 返回:
> - 如果调用方是CSM模块
>   - 正常情况下，会进`Response`状态处理返回。
>   - 如果是调用方发生的错误，会导致CSM状态机进入`Error Handler`模块，处理错误。
>   - 如果是被调用方发生的错误，此信息仍然是消息的结果，在`Response`状态处理，可以从Additional Information中获取。
> - 如果是API调用
>   - Response输出为返回。
>   - 调用方和被调用方发生的错误，会合并到错误簇输出。
> - Ref: 全局超时时间设置

{: .note }
> <b>CSM消息的目标模块说明</b>
>
> 普通模式下，CSM消息的目标模块为指定的模块名称。
> 系统级模块只是名称上以`.`起始，CSM消息的目标模块包含`.`的名称， 如申请的模块名称为`.System`，CSM消息的目标模块就是`.System`。
> 协作者模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称，例如申请的模块名称为`Worker#`，CSM消息的目标模块就是`Worker`。
> 责任链模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称。例如申请的模块名称为`Chain$1`，CSM消息的目标模块就是`Chain`。

-- <b>输入控件(Controls)</b> --
- <b>Current Module ("" to Generate an ID)</b>: 当前模块名称，当没有输入时，生成一个临时ID，便于调试判断位置。
- <b>State</b>: 消息字符串。
- <b>Arguments ("")</b>: 消息参数。
- <b>Target Module</b>: CSM模块名称。
- <b>Wait (5000ms)</b>: 等待模块上线的超时时间，默认为5000 ms。
- <b>Response Timeout (-2 Using Global Settings)</b>: 同步调用的超时时间，默认为-2，使用全局设置。你可以通过CSM - Set TMO of Sync-Reply VI设置全局超时时间。

-- <b>输出控件(Indicators)</b> --
- <b>Response</b>: 返回的响应。
- <b>Source CSM</b>: 返回的响应的来源CSM模块名称，在协作者模式或责任链模式下返回节点的名称。
- <b>Waited (ms)</b>: 已等待的时间。

## CSM - Run Script.vi
一次性的执行多条CSM指令，支持同步消息、异步消息和订阅。

<b>临时变量支持</b>

CSM - Run Script.vi 支持一个额外的补充语法，将返回值保存到指定的临时变量中，供后续指令使用。使用 `=>` 符号将返回值保存到变量中，变量名不区分大小写。在之后的指令中，可以通过 `${变量名}` 的语法引用该变量。

示例如下：

```
API: Random -@ csm => var1
API: Random -@ csm => var2
API: echo >> ${var1} -@ csm
API: echo >> ${var2} -@ csm
API: echo >> ${var1},${var2} -@ csm
```

<b>额外指令支持</b>

- Wait: 等待指定的毫秒数，语法为 `Wait >> 毫秒数`，例如 `Wait: 1000` 表示等待1000毫秒。

```
API: Do Something -@ csm
Wait: 1000 // 等待1000毫秒，然后继续执行下一条指令
API: Do Something Else -@ csm
```


{: .note }
> <b>CSM消息的目标模块说明</b>
>
> 普通模式下，CSM消息的目标模块为指定的模块名称。
> 系统级模块只是名称上以`.`起始，CSM消息的目标模块包含`.`的名称， 如申请的模块名称为`.System`，CSM消息的目标模块就是`.System`。
> 协作者模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称，例如申请的模块名称为`Worker#`，CSM消息的目标模块就是`Worker`。
> 责任链模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称。例如申请的模块名称为`Chain$1`，CSM消息的目标模块就是`Chain`。

-- <b>输入控件(Controls)</b> --
- <b>Current Module ("" to Generate an ID)</b>: 当前模块名称，当没有输入时，生成一个临时ID，便于调试判断位置。
- <b>CSM Scripts</b>: 待运行的CSM指令。
- <b>Continue If Error? (F)</b>: 发生错误时是否继续执行, 默认不继续执行。
- <b>Wait (5000 ms)</b>: 等待超时时间，默认为5000 ms。
- <b>Response Timeout (-2 Using Global Settings)</b>: 同步调用的超时时间，默认为-2，使用全局设置。你可以通过CSM - Set TMO of Sync-Reply VI设置全局超时时间。

-- <b>输出控件(Indicators)</b> --
- <b>Response</b>: 执行脚本的返回结果。只有同步消息才会携带返回，其他的指令对应列为空字符串。
- <b>Scripts Left</b>: 剩余未执行的脚本。

## CSM - Broadcast Event.vi
获取CSM状态更改事件句柄。

-- <b>输入控件(Controls)</b> --
- <b>CSM Module</b>: CSM模块名称。
- <b>Wait (5000 ms)</b>: 等待超时时间，默认为5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>Status Change Event</b>: CSM状态更改事件句柄。
- <b>Waited (ms)</b>: 已等待的时间。

## CSM - Destroy Broadcast Event.vi
释放CSM状态更改事件句柄。

-- <b>输入控件(Controls)</b> --
- <b>Status Change Event</b>: CSM状态更改事件句柄。

## CSM - Module Exit Event.vi
获取CSM模块退出事件句柄，如果模块不存在，将会等待指定的超时时间。超时过后如果模块还不存在，将返回超时错误。

CSM高级模式的模块(协作者模式、责任链模式)只有在最后一个节点退出后，才会触发模块退出事件。

-- <b>输入控件(Controls)</b> --
- <b>Name ("" to Use UUID) In</b>: CSM模块名称。请参考<b>CSM名称规则</b>。
- <b>Wait (5000 ms)</b>: 等待超时时间，默认为5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Exit Event</b>: CSM模块退出事件句柄。
- <b>Waited (ms)</b>: 已等待的时间。

## 属性(Attribute)

### CSM - Set Module Attribute.vi
设置指定模块的属性值。如果属性不存在，将创建一个新的属性，<b>Replaced</b>返回FALSE, 否则返回TRUE。如果CSM模块不存在，将会等待指定的超时时间，超时会返回超时错误。

> - Ref: CSM模块属性

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\6. Module Attributes.vi`。

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。
- <b>Attribute</b>: 属性名称，不能为空字符串。
- <b>Value</b>: 属性数据。
- <b>Wait (5000 ms)</b>: 等待超时时间，默认为5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Dup)</b>: 输入的CSM模块名称副本。
- <b>Replaced</b>: 属性是否被替换。
- <b>Waited (ms)</b>: 已等待的时间。

### CSM - Get Module Attribute.vi
读取指定模块的属性值。如果属性不存在，将返回默认值，<b>Found</b>返回FALSE, 否则返回TRUE。如果CSM模块不存在，将会等待指定的超时时间，超时会返回超时错误。

> - Ref: CSM模块属性

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\6. Module Attributes.vi`。

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。
- <b>Attribute</b>: 属性名称，不能为空字符串。
- <b>Default Value (Empty Variant)</b>: 默认值，当属性不存在时返回。
- <b>Wait (5000 ms)</b>: 等待超时时间，默认为 5000ms。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Dup)</b>: 输入的CSM模块名称副本。
- <b>Found</b>: 属性是否存在。
- <b>Value</b>: 属性值。
- <b>Waited (ms)</b>: 已等待的时间。

### CSM - List Module Attributes.vi
列出指定模块的所有属性名称。如果CSM模块不存在，将会等待指定的超时时间，超时会返回超时错误。

> - Ref: CSM模块属性

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\6. Module Attributes.vi`。

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。
- <b>Include Value? (F)</b>: 是否包含属性值，默认不包含。
- <b>Wait (5000 ms)</b>: 等待超时时间，默认为5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Dup)</b>: 输入的CSM模块名称副本。
- <b>Attributes</b>: 属性名称列表。
- <b>Values</b>: 属性值列表。
- <b>Waited (ms)</b>: 已等待的时间。

### CSM - Delete Module Attribute.vi
删除指定模块的属性。如果属性不存在，将返回FALSE, 否则返回TRUE。如果CSM模块不存在，将会等待指定的超时时间，超时会返回超时错误。

> - Ref: CSM模块属性

<b>参考范例</b>：`[CSM-Example]\0. Base Concepts\6. Module Attributes.vi`。

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。
- <b>Attribute</b>: 属性名称，不能为空字符串。
- <b>Wait (5000 ms)</b>: 等待超时时间，默认为5000 ms。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Dup)</b>: 输入的CSM模块名称副本。
- <b>Found</b>: 属性是否存在。
- <b>Waited (ms)</b>: 已等待的时间。
