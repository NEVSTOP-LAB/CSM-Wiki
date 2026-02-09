---
title: 状态订阅管理(Status Registration)
layout: default
parent: 参考文档
nav_order: 16
---

# 广播订阅管理(Broadcast Registration)

## CSM - Register Broadcast.vi
注册以接收其他CSM模块触发更改的通知。如果未连接<b>API</b>或输入为空，则将使用相同的触发名称作为响应消息。触发名称可以是源模块的广播名称，或者源模块的状态名称。

协作者模式和责任链模式下，输入节点的名称，会被自动解析为模块的名称，因为CSM是以模块为单位实现订阅的。

<b>参考范例</b>：`2. Caller is CSM Scenario\CSM Example - Caller is a CSM.vi`。


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
- <b>CSM Name</b>: CSM模块名称。
- <b>Source CSM Name (* as Default)</b>: 生成状态的CSM模块。您可以使用`*`来表示所有生成相同状态的模块。
- <b>Trigger</b>: 触发字符串。
- <b>API (if "", same as Trigger)</b>: 注册后，如果触发发生变化，将接收到此消息。
- <b>Priority (No Change)</b>: 订阅后的广播优先级。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Dup)</b>: 输入的CSM模块名称副本。

## CSM - Unregister Broadcast.vi
取消注册其他CSM模块状态更改的通知。

协作者模式和责任链模式下，输入节点的名称，会被自动解析为模块的名称，因为CSM是以模块为单位实现订阅的。

<b>参考范例</b>：`2. Caller is CSM Scenario\CSM Example - Caller is a CSM.vi`。


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
- <b>CSM Name</b>: CSM模块名称。
- <b>Source CSM Name (* as Default)</b>: 生成状态的CSM模块。您可以使用`*`来表示所有生成相同状态的模块。
- <b>Trigger</b>: 触发字符串。
- <b>API ("*" as Default)</b>: 取消注册的API名称。如果为空，则为所有API。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Dup)</b>: 输入的CSM模块名称副本。

## CSM - List Rules in Broadcast Registry.vi
列出CSM注册表中的的所有规则。


> [!NOTE]
> <b>CSM广播</b>
>
> CSM中的广播分为三种: 信号广播(Status)、中断广播(Interrupt)和状态广播(State)， 模块会将信号广播推送给所有订阅了该信号广播的模块。其中信号广播(Status)和中断广播(Interrupt)是需要显式调用的广播，状态广播(State)是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。
> 
> - 信号广播(Status): 普通优先级的广播，类似异步消息，会通过低优先级队列传递。当模块中存在其他未处理的异步消息或者信号广播时，会依次被处理。
> - 中断广播(Interrupt): 高优先级的广播，类似同步消息，会通过高优先级队列传递。当模块中存在其他低优先级的异步消息或者信号广播时，会被优先处理，但是如果存在其他未处理的同步消息或中断广播时，会被依次处理。
> - 状态广播(State): 状态广播是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。状态广播的参数，为CSM状态的Response。
> 
> 注意：
> - 信号广播或中断广播需要显示发送，名称不要和CSM状态名相同，否则可能出现多次触发的情况
> - 状态广播由于效率的考虑，只有订阅后才会发送，这就意味着必须注册才能在模块的广播事件中收到状态广播。

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

-- <b>输出控件(Indicators)</b> --
- <b>Rule Entries</b>: 所有规则条目。

## CSM - List Mapping Relationships in Broadcast Registry.vi
列出当前CSM模块的所有广播订阅关系。和规则不同，广播订阅关系是当前的CSM模块在当前的规则下所有的广播订阅关系。


> [!NOTE]
> <b>CSM广播</b>
>
> CSM中的广播分为三种: 信号广播(Status)、中断广播(Interrupt)和状态广播(State)， 模块会将信号广播推送给所有订阅了该信号广播的模块。其中信号广播(Status)和中断广播(Interrupt)是需要显式调用的广播，状态广播(State)是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。
> 
> - 信号广播(Status): 普通优先级的广播，类似异步消息，会通过低优先级队列传递。当模块中存在其他未处理的异步消息或者信号广播时，会依次被处理。
> - 中断广播(Interrupt): 高优先级的广播，类似同步消息，会通过高优先级队列传递。当模块中存在其他低优先级的异步消息或者信号广播时，会被优先处理，但是如果存在其他未处理的同步消息或中断广播时，会被依次处理。
> - 状态广播(State): 状态广播是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。状态广播的参数，为CSM状态的Response。
> 
> 注意：
> - 信号广播或中断广播需要显示发送，名称不要和CSM状态名相同，否则可能出现多次触发的情况
> - 状态广播由于效率的考虑，只有订阅后才会发送，这就意味着必须注册才能在模块的广播事件中收到状态广播。

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

-- <b>输出控件(Indicators)</b> --
- <b>Mapping Relationships</b>: 当前CSM模块的所有广播订阅关系。

## CSM - List Sources in Broadcast Registry.vi
列出当前所有广播订阅关系的广播名称。


> [!NOTE]
> <b>CSM广播</b>
>
> CSM中的广播分为三种: 信号广播(Status)、中断广播(Interrupt)和状态广播(State)， 模块会将信号广播推送给所有订阅了该信号广播的模块。其中信号广播(Status)和中断广播(Interrupt)是需要显式调用的广播，状态广播(State)是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。
> 
> - 信号广播(Status): 普通优先级的广播，类似异步消息，会通过低优先级队列传递。当模块中存在其他未处理的异步消息或者信号广播时，会依次被处理。
> - 中断广播(Interrupt): 高优先级的广播，类似同步消息，会通过高优先级队列传递。当模块中存在其他低优先级的异步消息或者信号广播时，会被优先处理，但是如果存在其他未处理的同步消息或中断广播时，会被依次处理。
> - 状态广播(State): 状态广播是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。状态广播的参数，为CSM状态的Response。
> 
> 注意：
> - 信号广播或中断广播需要显示发送，名称不要和CSM状态名相同，否则可能出现多次触发的情况
> - 状态广播由于效率的考虑，只有订阅后才会发送，这就意味着必须注册才能在模块的广播事件中收到状态广播。

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

-- <b>输出控件(Indicators)</b> --
- <b>Broadcast Names</b>: 当前所有广播订阅关系的广播名称。

## CSM - Check Mapping Relationship in Broadcast Registry.vi
检查CSM模块的某广播名称对应所有的订阅关系。


> [!NOTE]
> <b>CSM广播</b>
>
> CSM中的广播分为三种: 信号广播(Status)、中断广播(Interrupt)和状态广播(State)， 模块会将信号广播推送给所有订阅了该信号广播的模块。其中信号广播(Status)和中断广播(Interrupt)是需要显式调用的广播，状态广播(State)是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。
> 
> - 信号广播(Status): 普通优先级的广播，类似异步消息，会通过低优先级队列传递。当模块中存在其他未处理的异步消息或者信号广播时，会依次被处理。
> - 中断广播(Interrupt): 高优先级的广播，类似同步消息，会通过高优先级队列传递。当模块中存在其他低优先级的异步消息或者信号广播时，会被优先处理，但是如果存在其他未处理的同步消息或中断广播时，会被依次处理。
> - 状态广播(State): 状态广播是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。状态广播的参数，为CSM状态的Response。
> 
> 注意：
> - 信号广播或中断广播需要显示发送，名称不要和CSM状态名相同，否则可能出现多次触发的情况
> - 状态广播由于效率的考虑，只有订阅后才会发送，这就意味着必须注册才能在模块的广播事件中收到状态广播。

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

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。
- <b>Broadcast Name</b>: 广播的名称。

-- <b>输出控件(Indicators)</b> --
- <b>Mapping Relationships</b>: 当前CSM模块的某广播名称对应所有的订阅关系。

## CSM - Remove Module in Broadcast Registry.vi
从广播注册中删除所有与指定CSM模块相关的订阅关系。


> [!NOTE]
> <b>CSM广播</b>
>
> CSM中的广播分为三种: 信号广播(Status)、中断广播(Interrupt)和状态广播(State)， 模块会将信号广播推送给所有订阅了该信号广播的模块。其中信号广播(Status)和中断广播(Interrupt)是需要显式调用的广播，状态广播(State)是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。
> 
> - 信号广播(Status): 普通优先级的广播，类似异步消息，会通过低优先级队列传递。当模块中存在其他未处理的异步消息或者信号广播时，会依次被处理。
> - 中断广播(Interrupt): 高优先级的广播，类似同步消息，会通过高优先级队列传递。当模块中存在其他低优先级的异步消息或者信号广播时，会被优先处理，但是如果存在其他未处理的同步消息或中断广播时，会被依次处理。
> - 状态广播(State): 状态广播是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。状态广播的参数，为CSM状态的Response。
> 
> 注意：
> - 信号广播或中断广播需要显示发送，名称不要和CSM状态名相同，否则可能出现多次触发的情况
> - 状态广播由于效率的考虑，只有订阅后才会发送，这就意味着必须注册才能在模块的广播事件中收到状态广播。

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

-- <b>输入控件(Controls)</b> --
- <b>CSM Name</b>: CSM模块名称。

-- <b>输出控件(Indicators)</b> --
- <b>CSM Name (Dup)</b>: 输入的CSM模块名称副本。

## CSM - Drop Broadcast Registry.vi
重置后台广播注册的所有信息，应用在完全重置订阅关系的场景中。


> [!NOTE]
> <b>CSM广播</b>
>
> CSM中的广播分为三种: 信号广播(Status)、中断广播(Interrupt)和状态广播(State)， 模块会将信号广播推送给所有订阅了该信号广播的模块。其中信号广播(Status)和中断广播(Interrupt)是需要显式调用的广播，状态广播(State)是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。
> 
> - 信号广播(Status): 普通优先级的广播，类似异步消息，会通过低优先级队列传递。当模块中存在其他未处理的异步消息或者信号广播时，会依次被处理。
> - 中断广播(Interrupt): 高优先级的广播，类似同步消息，会通过高优先级队列传递。当模块中存在其他低优先级的异步消息或者信号广播时，会被优先处理，但是如果存在其他未处理的同步消息或中断广播时，会被依次处理。
> - 状态广播(State): 状态广播是隐式的广播，在订阅关系存在的情况下，当CSM运行完成某个状态，就会自动触发状态广播(State)。状态广播的参数，为CSM状态的Response。
> 
> 注意：
> - 信号广播或中断广播需要显示发送，名称不要和CSM状态名相同，否则可能出现多次触发的情况
> - 状态广播由于效率的考虑，只有订阅后才会发送，这就意味着必须注册才能在模块的广播事件中收到状态广播。

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
