---
title: 核心功能(Core Functions)
layout: default
parent: 参考文档
nav_order: 12
---

# 核心功能(Core Functions)

## Parse State Queue++.vi
解析CSM状态队列，返回将执行的下一个当前状态、参数等信息。


> [!NOTE]
> <b>CSM模块间通信类型</b>
>
> CSM模块间的通信分为两类: 消息和广播。
> - 消息: 模块间1:1的通信，根据消息处理的方式，又可分为同步调用(`-@`)、异步调用(`->`)、异步不等待返回(`->|`)等。
> - 广播: 模块间1:N的通信，广播模块会将广播推送给所有订阅了该广播的模块。根据广播处理的优先级，又可分为信号广播(status)和中断广播(interrupt)。

-- <b>输入控件(Controls)</b> --
- <b>Response Arguments</b>: 来自上一个状态的响应参数。它应该连接到 CSM的移位寄存器，用于传递外部调用的返回值。
- <b>Name ("" to use UUID)</b>: CSM模块名称。请参考<b>CSM名称规则</b>。
- <b>State Queue</b>: 整个状态队列被连接到此输入。这应该来自CSM的移位寄存器。
- <b>Previous Error</b>: 来自CSM的错误簇被连接到此输入。如果发生错误并出现在此输入上，则当前状态输出将返回`Error Handler`状态。
- <b>Dequeue (1 ms)</b>: 检查CSM消息队列的超时设置，默认为1 ms, 不设置为0是为了避免某些错误情况下产生海量的空消息。
- <b>Response Timeout (-2 Use Global Settings)</b>: 同步调用的超时时间，默认为-2，使用全局设置。您可以通过CSM - Set TMO of Sync-Reply VI设置全局超时时间。
- <b>Allowed Messages (Empty for All)</b>: 允许的消息名称列表，为空表示允许所有消息。

-- <b>输出控件(Indicators)</b> --
- <b>Name Used</b>: 分配给该CSM模块的实际名称。
- <b>Remaining States</b>: 拼接后的所有状态及参数。
- <b>Current State</b>: 将执行的下一个当前状态。
- <b>Arguments</b>: 返回可能在当前状态字符串中使用的任何参数，这些参数位于`>>`字符之后。<b>注意: </b>参数变量不得包含任何不可打印的字符，如换行符或回车符。
- <b>Additional Information</b>: 额外的补充信息。广播触发的状态中，该信息包含广播的名称、参数。
- <b>Source CSM</b>: 如果<b>Current State</b>由外部发送，则这是源CSM模块名称。

## Build State String with Arguments++.vi

该VI用于构建CSM消息字符串(包含状态、参数、目标模块、消息类型等信息)，以便发送到其他CSM模块。


> [!NOTE]
> <b>CSM消息类型</b>
>
> CSM消息分为三类: 同步调用(`-@`)、异步调用(`->`)、异步不等待返回(`->|`)。
> - 同步调用(`-@`): 模块会等待目标模块返回结果，才会继续执行后续代码。
> - 异步调用(`->`): 模块会立即继续执行后续代码，而不会等待目标模块返回结果。
> - 异步不等待返回(`->|`): 模块会立即继续执行后续代码，而不会等待目标模块返回结果。与异步调用(`->`)不同的是，异步不等待返回(`->|`)不会等待目标模块返回结果，也不会抛出错误。

> [!NOTE]
> <b>CSM消息格式解析</b>
>
> `[CSM消息字符串(CSM Message)] >> [参数(Arguments)] [消息类型符号(Message Symbol) ->|,->,-@] [目标模块(Target Module)] // [注释(Comments)]`
> 
> - CSM 消息字符串(CSM Message): CSM的消息，不可包含CSM关键字和换行符。
> - `>>`: CSM消息字符串(CSM Message)和参数(Arguments)的分隔符。
> - 参数(Arguments): CSM消息的参数，不可包含CSM关键字和换行符。
> - 消息类型符号(Message Symbol): 消息类型符号，用于标识消息类型，包括同步调用(`-@`)、异步调用(`->`)、异步不等待返回(`->|`)等。
> - 目标模块(Target Module): 消息发送的目标模块，如为空，则表示消息会被本模块处理。为空时，消息类型符号也不能存在。
> - 注释(Comments): 注释信息，不会被解析。

      例如:
      发送给本地状态机时，<b>Target Module ("")</b>应设为空
            If State = A并且没有参数，那么<b>State with Arguments</b> = A
            If State = A , Arguments = B那么 <b>State with Arguments</b> = A >> B

      在发送给其他CSM的情况下，假设<b>Target Module ("")</b>的名称为"Target"。

      - 同步调用(发送消息后等待返回):
            If State = A并且没有参数，那么<b>State with Arguments</b> = A -@target
            If State = A , Arguments = B那么 <b>State with Arguments</b> = A >> B -@target

      - 异步调用(发送消息后将进入"Async Message Posted"状态，当外部模块处理完毕后，本地模块将收到"Async Response"消息):
            If State = A并且没有参数，那么<b>State with Arguments</b> = A ->target
            If State = A , Arguments = B那么<b>State with Arguments</b> = A >> B ->target

-- <b>输入控件(Controls)</b> --
- <b>State</b>: 状态或消息名称字符串。
- <b>Arguments ("")</b>: <b>State</b>的参数。
- <b>Target Module ("")</b>: 该消息发送的目标CSM模块名称。
- <b>Type</b>: 消息类型，可选Async、Async Without Reply、Sync。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Message String</b>: 拼接生成的CSM消息字符串。

## Build Message with Arguments++.vi
该VI用于构建CSM消息字符串及操作字符串。


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。


> [!NOTE]
> <b>CSM模块间通信类型</b>
>
> CSM模块间的通信分为两类: 消息和广播。
> - 消息: 模块间1:1的通信，根据消息处理的方式，又可分为同步调用(`-@`)、异步调用(`->`)、异步不等待返回(`->|`)等。
> - 广播: 模块间1:N的通信，广播模块会将广播推送给所有订阅了该广播的模块。根据广播处理的优先级，又可分为信号广播(status)和中断广播(interrupt)。

### Build Message with Arguments(Auto Check).vi
拼接生成CSM消息字符串，消息的类型符号会根据输入的<b>State with Arguments</b>自动检测。


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

> [!NOTE]
> <b>CSM消息的目标模块说明</b>
>
> 普通模式下，CSM消息的目标模块为指定的模块名称。
> 系统级模块只是名称上以`.`起始，CSM消息的目标模块包含`.`的名称， 如申请的模块名称为`.System`，CSM消息的目标模块就是`.System`。
> 协作者模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称，例如申请的模块名称为`Worker#`，CSM消息的目标模块就是`Worker`。
> 责任链模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称。例如申请的模块名称为`Chain$1`，CSM消息的目标模块就是`Chain`。

-- <b>输入控件(Controls)</b> --
- <b>State with Arguments</b>: CSM状态字符串，可包含参数和目标模块信息。
- <b>Arguments ("")</b>: 参数信息，<b>State with Arguments</b>中包含的参数将被替换。
- <b>Target Module ("")</b>: 目标模块，为空时将使用<b>State with Arguments</b>中的默认模块。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Message String</b>: 拼接生成的CSM消息字符串。

### Build Synchronous Message with Arguments.vi
拼接生成CSM同步消息字符串，消息类型符号为`-@`，例如:

      Message >> Arguments -@ Target


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

> [!NOTE]
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

> [!NOTE]
> <b>CSM消息的目标模块说明</b>
>
> 普通模式下，CSM消息的目标模块为指定的模块名称。
> 系统级模块只是名称上以`.`起始，CSM消息的目标模块包含`.`的名称， 如申请的模块名称为`.System`，CSM消息的目标模块就是`.System`。
> 协作者模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称，例如申请的模块名称为`Worker#`，CSM消息的目标模块就是`Worker`。
> 责任链模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称。例如申请的模块名称为`Chain$1`，CSM消息的目标模块就是`Chain`。

-- <b>输入控件(Controls)</b> --
- <b>State with Arguments</b>: CSM状态字符串。
- <b>Arguments ("")</b>: 参数信息。<b>State with Arguments</b>中包含的参数会被替换。
- <b>Target Module ("")</b>: 目标模块。为空时，将使用<b>State with Arguments</b>中的默认模块。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Message String</b>: 拼接生成的CSM消息字符串。

### Build Asynchronous Message with Arguments.vi
拼接生成CSM异步消息字符串，消息类型符号为`->`，例如:

      Message >> Arguments -> Target


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

> [!NOTE]
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

> [!NOTE]
> <b>CSM消息的目标模块说明</b>
>
> 普通模式下，CSM消息的目标模块为指定的模块名称。
> 系统级模块只是名称上以`.`起始，CSM消息的目标模块包含`.`的名称， 如申请的模块名称为`.System`，CSM消息的目标模块就是`.System`。
> 协作者模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称，例如申请的模块名称为`Worker#`，CSM消息的目标模块就是`Worker`。
> 责任链模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称。例如申请的模块名称为`Chain$1`，CSM消息的目标模块就是`Chain`。

-- <b>输入控件(Controls)</b> --
- <b>State with Arguments</b>: CSM状态字符串。
- <b>Arguments ("")</b>: 参数信息。<b>State with Arguments</b>中包含的参数会被替换。
- <b>Target Module ("")</b>: 目标模块。为空时，将使用<b>State with Arguments</b>中的默认模块。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Message String</b>: 拼接生成的CSM消息字符串。

### Build No-Reply Asynchronous Message with Arguments.vi
拼接生成CSM异步无返回消息字符串，消息类型符号为`->|`，例如:

      Message >> Arguments ->| Target


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

> [!NOTE]
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

> [!NOTE]
> <b>CSM消息的目标模块说明</b>
>
> 普通模式下，CSM消息的目标模块为指定的模块名称。
> 系统级模块只是名称上以`.`起始，CSM消息的目标模块包含`.`的名称， 如申请的模块名称为`.System`，CSM消息的目标模块就是`.System`。
> 协作者模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称，例如申请的模块名称为`Worker#`，CSM消息的目标模块就是`Worker`。
> 责任链模式下，CSM消息的目标模块只能是整体模块名称，不能是节点的名称。例如申请的模块名称为`Chain$1`，CSM消息的目标模块就是`Chain`。

-- <b>输入控件(Controls)</b> --
- <b>State with Arguments</b>: CSM状态字符串。
- <b>Arguments ("")</b>: 参数信息。<b>State with Arguments</b>中包含的参数会被替换。
- <b>Target Module ("")</b>: 目标模块。为空时，将使用<b>State with Arguments</b>中的默认模块。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Message String</b>: 拼接生成的CSM消息字符串。

### Build Status Broadcast Message.vi
拼接普通状态消息字符串，消息格式如下:

      Status >> Arguments -><status>
      //以下字符串为等效操作，仅为了更容易键入记忆，定义了更多的操作字符。
      Status >> Arguments -><broadcast>
      Status >> Arguments -><all>


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

-- <b>输入控件(Controls)</b> --
- <b>State with Arguments</b>: CSM普通状态消息字符串。
- <b>Arguments ("")</b>: 参数信息。<b>State with Arguments</b>中包含的参数，会被替换。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Message String</b>: 拼接生成的CSM消息字符串。

### Build Interrupt Broadcast Message.vi
拼接中断状态消息，消息格式如下:

      Status >> Arguments -><interrupt>


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

-- <b>输入控件(Controls)</b> --
- <b>State with Arguments</b>: CSM中断状态消息字符串。
- <b>Arguments ("")</b>: 参数信息。<b>State with Arguments</b>中包含的参数会被替换。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Message String</b>: 拼接生成的CSM消息字符串。

### Build Register Message.vi
拼接注册状态操作消息字符串，消息格式如下:

      //[source-state]@[source-module] >> [response-message]@[response-module] -><register>
      status @ Source >> API @ Target -><register>

      举例: 将下载器模块的下载完毕消息，绑定到播放器模块的开始播放API

            //下载器模块的下载完毕消息，绑定到播放器模块的开始播放API
            DownloadFinished@Downloader >> StartPlay@Player -><register>
            //当播放器模块中执行消息时，Player 可缺省
            DownloadFinished@Downloader >> StartPlay -><register>
            //当多个模块都有下载完毕消息时，可以使用*表示将所有模块的该消息都绑定到播放器模块的开始播放API
            DownloadFinished@* >> StartPlay@Player -><register>


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

> [!NOTE]
> <b>CSM订阅</b>
>
> 订阅是将广播与绑定的接口(API)关联起来，当广播被触发时，会调用绑定的接口(API)。当然，也可以取消订阅。在CSM中，有以下两种广播:
> - 广播(Broadcast): 广播由模块显示的调用广播消息发送，参数需要显示给入。
> - 状态(State): CSM模块的任意一个状态，也可以被订阅。被触发的API收到的参数，为CSM状态的Response。
> 
> `// 注册`
> `[CSM广播(CSM Broadcast)]@[源模块(SourceModule)] >> [绑定的接口(API)]@[目标模块(TargetModule)] -><register> // [注释(Comments)]`
> `// 取消注册`
> `[CSM广播(CSM Broadcast)]@[源模块(SourceModule)] >> [绑定的接口(API)]@[目标模块(TargetModule)] -><unregister> // [注释(Comments)]`
> 
> - CSM广播: 由源模块定义，参考"CSM 广播格式解析"。
> - 源模块: 广播的模块，如果订阅任意模块的广播，源模块可以用`*`表示。
> - 绑定的接口: 由目标模块定义，为目标模块对外的接口。
> - 目标模块: 绑定的接口所在的模块。当在CSM模块中表示订阅到本模块，可忽略。同时省略前面的@分隔符。
> - `<register>`/`<unregister>`: 注册/取消订阅的操作类型定义。
> - 注释(Comments): 注释信息，不会被解析。

> [!NOTE]
> <b>CSM订阅位置</b>
>
> CSM订阅所添加的订阅规则，分为内部添加和外部添加两种。
> - 外部添加：外部添加的规则为全局规则，不会随着CSM模块的退出而自动删除，需要手动取消订阅。
>    - 使用`-<register>`语句添加的规则，如果指明了API所在的模块名称，则为外部添加。
>    - 使用 API CSM - Register Broadcast VI 添加的规则，均为外部添加。
> - 内部添加：CSM模块内部添加的规则，会随着CSM模块的退出而自动删除，无需手动取消订阅。
>   - 只有使用语句`-<register>`添加的规则，且API未指明模块名称时，才为内部添加。
> 
> 例如：
> `status@sourceModule >> API@TargetModule -><register> // 外部添加`
> `status@sourceModule >> API -><register> // 内部添加`

> [!NOTE]
> <b>CSM广播优先级</b>
>
> 从名称上就可以看出，广播是有优先级的。状态广播(State)是一种特殊的广播，默认它的优先级与信号广播(Status)相同。其中中断广播(Interrupt)为高优先级广播，与同步消息均使用高优先级队列进行传递；信号广播(Status)为低优先级广播，与异步消息均使用低优先级队列进行传递。
> 
> `// 默认的广播为信号广播，例如：`
> `ModuleInternalChange >> Arguments -> <broadcast> // 低优先级`
> `ModuleInternalChange >> Arguments -> <broadcast> // 低优先级`
> 
> 默认的优先级由发送方定义，通过广播格式中的广播类型(Broadcast Type)进行定义。
> 
> `// 发送方可以定义广播的优先级`
> `ModuleInternalChange >> Arguments -> <status> // 低优先级`
> `ModuleInternalChange >> Arguments -> <interrupt> // 高优先级`
> 
> 默认的订阅不会改变优先级，但可以通过特殊的订阅格式，改变订阅后的广播优先级。
> 
> `// 默认的订阅不改变优先级`
> `ModuleInternalChange@SourceModule >> API@TargetModule -><register>`
> `// 将订阅的广播改为普通优先级，无论之前是何优先级`
> `ModuleInternalChange@SourceModule >> API@TargetModule -><register as status>`
> `// 将订阅的广播改为高优先级，无论之前是何优先级`
> `ModuleInternalChange@SourceModule >> API@TargetModule -><register as interrupt>`

-- <b>输入控件(Controls)</b> --
- <b>Target CSM</b>: 订阅状态的CSM模块名称。
- <b>Source CSM (* as Default)</b>: 发出状态的CSM模块名称。
- <b>Status</b>: 注册的状态。
- <b>API (If "", Same As "Status")</b>: 订阅状态模块响应的API名称。
- <b>Priority (No Change)</b>: 订阅后的广播优先级。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Message String</b>: 拼接生成的CSM消息字符串。

### Build Unregister Message.vi
拼接取消注册状态操作消息字符串，消息格式如下:

      //[source-state]@[source-module] >> [response-message]@[response-module] -><unregister>
      status @ Source >> API @ Target -><unregister>

      举例: 取消下载器模块的下载完毕消息，绑定到播放器模块的开始播放API

            //下载器模块的下载完毕消息，绑定到播放器模块的开始播放API
            DownloadFinished@Downloader >> StartPlay@Player -><unregister>
            //当播放器模块中执行消息时，Player 可缺省
            DownloadFinished@Downloader >> StartPlay -><unregister>

- 协作者模式(Worker Mode)下：模块的内部订阅规则，只会在全部节点退出后才会自动取消订阅。
- 责任链模式(Chain Mode)下：模块的内部订阅规则，节点的内部订阅规则，会随着节点的退出而自动取消订阅。


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

> [!NOTE]
> <b>CSM订阅</b>
>
> 订阅是将广播与绑定的接口(API)关联起来，当广播被触发时，会调用绑定的接口(API)。当然，也可以取消订阅。在CSM中，有以下两种广播:
> - 广播(Broadcast): 广播由模块显示的调用广播消息发送，参数需要显示给入。
> - 状态(State): CSM模块的任意一个状态，也可以被订阅。被触发的API收到的参数，为CSM状态的Response。
> 
> `// 注册`
> `[CSM广播(CSM Broadcast)]@[源模块(SourceModule)] >> [绑定的接口(API)]@[目标模块(TargetModule)] -><register> // [注释(Comments)]`
> `// 取消注册`
> `[CSM广播(CSM Broadcast)]@[源模块(SourceModule)] >> [绑定的接口(API)]@[目标模块(TargetModule)] -><unregister> // [注释(Comments)]`
> 
> - CSM广播: 由源模块定义，参考"CSM 广播格式解析"。
> - 源模块: 广播的模块，如果订阅任意模块的广播，源模块可以用`*`表示。
> - 绑定的接口: 由目标模块定义，为目标模块对外的接口。
> - 目标模块: 绑定的接口所在的模块。当在CSM模块中表示订阅到本模块，可忽略。同时省略前面的@分隔符。
> - `<register>`/`<unregister>`: 注册/取消订阅的操作类型定义。
> - 注释(Comments): 注释信息，不会被解析。

> [!NOTE]
> <b>CSM订阅位置</b>
>
> CSM订阅所添加的订阅规则，分为内部添加和外部添加两种。
> - 外部添加：外部添加的规则为全局规则，不会随着CSM模块的退出而自动删除，需要手动取消订阅。
>    - 使用`-<register>`语句添加的规则，如果指明了API所在的模块名称，则为外部添加。
>    - 使用 API CSM - Register Broadcast VI 添加的规则，均为外部添加。
> - 内部添加：CSM模块内部添加的规则，会随着CSM模块的退出而自动删除，无需手动取消订阅。
>   - 只有使用语句`-<register>`添加的规则，且API未指明模块名称时，才为内部添加。
> 
> 例如：
> `status@sourceModule >> API@TargetModule -><register> // 外部添加`
> `status@sourceModule >> API -><register> // 内部添加`

-- <b>输入控件(Controls)</b> --
- <b>Target CSM</b>: 订阅状态的CSM模块名称。
- <b>Source CSM (* as Default)</b>: 发出状态的CSM模块名称。
- <b>Status</b>: 注册的状态。
- <b>API (If "", Same As "Status")</b>: 取消订阅状态模块响应的API名称。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Message String</b>: 拼接生成的CSM消息字符串。

### CSM - Replace Marks in Messages.vi
该VI主要为了能够便捷地编辑多条CSM消息字符串，提供批量替换标记的功能。有4个标记可以替换:

- <param> 标记: 通常表示相同的参数
- <target> 标记: 通常表示相同的目标
- <1> 标记: 表示自定义标记1
- <2> 标记: 表示自定义标记2

例如: 接线端`<target>`连接了字符串为`DAQDevice`，<b>States with Replace Token</b> 字符串为:

      text
      Initialize -@ <target>
      Configure -@ <target>
      Read -@ <target>
      Close -@ <target>

<b>States</b>输出为:

      text
      Initialize -@ DAQDevice
      Configure -@ DAQDevice
      Read -@ DAQDevice
      Close -@ DAQDevice


> [!NOTE]
> <b>消息拼接API</b>
>
> 该类型API不会直接发送消息，仅用于拼接消息字符串。需将字符串并入CSM的状态队列后，在Parse State Queue++ VI中发送消息并执行操作。在熟悉CSM规则的情况下，可不必使用此类API，直接在字符串中键入对应的消息字符串或操作字符串。

-- <b>输入控件(Controls)</b> --
- <b>States with Replace Token</b>: 带有替换标记的CSM状态字符串。
- <b><param></b>: <param> 标记: 通常表示相同的参数。
- <b><target></b>: <target> 标记: 通常表示相同的目标。
- <b><1></b>: 自定义标记1。
- <b><2></b>: 自定义标记2。

-- <b>输出控件(Indicators)</b> --
- <b>States</b>: 替换后的状态字符串。

### CSM - Replace Mark with String Array.vi
将单条状态字符串中的标签替换为数组字符串，并合并成描述一组状态的符串。

<b>例如</b>: 对于`Draw >> <1> -@ Painter`，<b>Tag</b>应该选择`<1>`

输入数组`[Line,Circle,Rectangle]`，可以得到:

      Draw >> Line -@ Painter
      Draw >> Circle -@ Painter
      Draw >> Rectangle -@ Painter

-- <b>输入控件(Controls)</b> --
- <b>single-line text</b>:单条状态字符串，包含`<1>`、`<2>`、`<3>`等标签。
- <b>Substitution Mark</b>:要替换的标签，例如`<1>`、`<2>`、`<3>`等标签。
- <b>replace string</b>:待替换的数组字符串。

-- <b>输出控件(Indicators)</b> --
- <b>States</b>:合并后的状态字符串。

## CSM - Broadcast Status Change.vi
向系统广播状态更改，已注册状态的CSM模块将接收此状态更改，例如:

      //广播状态更改
      Status >> Arguments -><broadcast>


> [!NOTE]
> <b>CSM 的状态队列操作API</b>
>
> 该类型API不会直接发送消息，只是拼接消息字符串。在Parse State Queue++.vi中发送消息、执行操作。与消息拼接API不同的是，此类API会包含CSM的状态队列字符串输入，相当于在状态队列中插入消息。

-- <b>输入控件(Controls)</b> --
- <b>Status with Arguments</b>: 将被广播的状态及参数，支持多行，每行状态都将被添加`-><broadcast>`。
- <b>State Queue</b>: 整个状态队列被连接到此输入。
- <b>Broadcast? (T)</b>: 控制是否广播的开关输入。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 拼接后的所有状态及参数。

## Add State(s) to Queue By BOOL++.vi
将CSM消息字符串并入CSM消息队列中。提供了TRUE/FALSE两种状态的字符串选项，能够避免使用条件结构，提高代码可读性和编程效率。


> [!NOTE]
> <b>CSM 的状态队列操作API</b>
>
> 该类型API不会直接发送消息，只是拼接消息字符串。在Parse State Queue++.vi中发送消息、执行操作。与消息拼接API不同的是，此类API会包含CSM的状态队列字符串输入，相当于在状态队列中插入消息。

### Add State(s) to Queue By BOOL(Element).vi
将CSM消息字符串并入CSM消息队列中。提供了TRUE/FALSE两种状态的字符串选项，能够避免使用条件结构，提高代码可读性和编程效率。

> - Ref: CSM的状态队列操作API

-- <b>输入控件(Controls)</b> --
- <b>State Queue ("")</b>: 整个状态队列被连接到此输入。
- <b>Condition</b>: 选择连接到TRUE终端或FALSE终端的状态字符串的标志。
- <b>High Priority? (F)</b>: 如果为TRUE，状态将被插入到<b>State Queue ("")</b>的前端；如果为FALSE，它被附加到尾部。
- <b>TRUE ("")</b>: <b>Condition</b>为TRUE时插入的状态字符串。
- <b>FALSE ("")</b>: <b>Condition</b>为FALSE时插入的状态字符串。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 拼接后的所有状态及参数。

### Add State(s) to Queue By BOOL(Array Left).vi
将CSM消息字符串并入CSM消息队列中。提供了TRUE/FALSE两种状态的字符串选项，能够避免使用条件结构，提高代码可读性和编程效率。

> - Ref: CSM的状态队列操作API

-- <b>输入控件(Controls)</b> --
- <b>State Queue ("")</b>: 整个状态队列被连接到此输入。
- <b>Condition</b>: 选择连接到TRUE终端或FALSE终端的状态字符串的标志。
- <b>High Priority? (F)</b>: 如果为TRUE，状态将被插入到<b>State Queue ("")</b>的前端；如果为FALSE，它被附加到尾部。
- <b>TRUE ("")</b>: <b>Condition</b>为TRUE时插入的状态字符串。
- <b>FALSE ("")</b>: <b>Condition</b>为FALSE时插入的状态字符串。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 拼接后的所有状态及参数。

### Add State(s) to Queue By BOOL(Array Right).vi
将CSM消息字符串并入CSM消息队列中。提供了TRUE/FALSE两种状态的字符串选项，能够避免使用条件结构，提高代码可读性和编程效率。


> [!NOTE]
> <b>CSM 的状态队列操作API</b>
>
> 该类型API不会直接发送消息，只是拼接消息字符串。在Parse State Queue++.vi中发送消息、执行操作。与消息拼接API不同的是，此类API会包含CSM的状态队列字符串输入，相当于在状态队列中插入消息。

-- <b>输入控件(Controls)</b> --
- <b>State Queue ("")</b>: 整个状态队列被连接到此输入。
- <b>Condition</b>: 选择连接到TRUE终端或FALSE终端的状态字符串的标志。
- <b>High Priority? (F)</b>: 如果为TRUE，状态将被插入到<b>State Queue ("")</b>的前端；如果为FALSE，它被附加到尾部。
- <b>TRUE ("")</b>: <b>Condition</b>为TRUE时插入的状态字符串。
- <b>FALSE ("")</b>: <b>Condition</b>为FALSE时插入的状态字符串。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 拼接后的所有状态及参数。

### Add State(s) to Queue By BOOL(Array All).vi
根据高优先级和Boolean输入，该VI生成TRUE/FALSE与剩余状态的连接状态。其中，<b>High Priority</b>输入决定是否在剩余状态之前或之后连接TRUE或FALSE字符串；<b>TRUE</b>和<b>FALSE</b>输入决定要连接的字符串是TRUE还是FALSE。


> [!NOTE]
> <b>CSM 的状态队列操作API</b>
>
> 该类型API不会直接发送消息，只是拼接消息字符串。在Parse State Queue++.vi中发送消息、执行操作。与消息拼接API不同的是，此类API会包含CSM的状态队列字符串输入，相当于在状态队列中插入消息。

-- <b>输入控件(Controls)</b> --
- <b>State Queue ("")</b>: 整个状态队列被连接到此输入。
- <b>Condition</b>: 选择连接到TRUE终端或FALSE终端的状态字符串的标志。
- <b>High Priority? (F)</b>: 如果为TRUE，状态将被插入到<b>State Queue ("")</b>的前端；如果为FALSE，它被附加到尾部。
- <b>TRUE ("")</b>: <b>Condition</b>为TRUE时插入的状态字符串。
- <b>FALSE ("")</b>: <b>Condition</b>为FALSE时插入的状态字符串。

-- <b>输出控件(Indicators)</b> --
- <b>Remaining States</b>: 拼接后的所有状态及参数。
