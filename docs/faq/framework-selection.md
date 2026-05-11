---
title: 框架选型
layout: default
parent: 常见问题解答
nav_order: 6
---

# 框架选型

## :question: CSM 和 JKISM 的区别是什么?

JKI State Machine 是由 [JKI](http://jki.net/) 公司开发维护的 LabVIEW 开源项目，由事件结构、字符串消息队列和循环结构组成的状态机模板。JKISM 不是程序框架，主要用于开发 LabVIEW 界面逻辑。

CSM 是基于 JKISM 拓展的编程框架，依然延续 JKISM 的字符串消息设计，通过添加一些新的字符串规则，实现不同模块之间的消息交互。

SMO 是 JKI 基于 JKISM + OOP 设计的程序框架。

更多信息，请参考 [JKI State Machine 简介]({% link docs/basic/jkism.md %})。

> 📓
>
> - JKISM 虽然叫做状态机，但是它更像一个以字符串作为消息队列的生产者消费者结构。通常停留在 IDLE 状态等待用户事件，当消息队列中有消息时，优先处理消息。
> - JKISM 和生产者消费者模板(QMH)相比，由于它只有一个循环，所以消息处理不能有持续时间长的处理，否则用户会感知到卡顿。这也是选择 QMH 和 JKISM 的一个重要的考虑因素。
>

## :question: LabVIEW 不同的框架 CSM/DQMH/AF/SMO 有没有各自非常适合的应用场景? {#faq-framework-comparison}

CSM/DQMH/AF/SMO 都是 LabVIEW 的编程框架，通常没有特别的应用场景区分。但是，由于每个框架的设计思想不同，所以在不同的场景下，可能会有不同的选择。

下图展示了各框架在不同维度的对比：

![Compare-LabVIEW-Framework](https://nevstop-lab.github.io/CSM-Wiki/assets/img/slides/Compare-LabVIEW-Framework.png)

各框架的关键维度对比如下：

| 对比维度 | DQMH | SMO | Actor Framework | CSM |
| -------- | ---- | --- | --------------- | --- |
| **外部接口** | Script 辅助创建 API | 类公共接口 | 类封装的 Message | 字符串消息，非必须创建 API |
| **状态反馈** | User Event | User Event | 消息处理封装 | JKISM 机制传递，无需 User Event；可外部订阅 |
| **可复制模块** | 复杂（两套模板） | 容易（类实现） | 容易（类实现） | 容易（VI 属性决定） |
| **代码依赖** | 依赖自定义事件和参数定义 | 高度依赖模块实现 | 继承和消息依赖 | 不显式依赖，字符串传递 |
| **参数传递** | 任意类型（User Event） | 任意类型（User Event） | 需封装 Message 类 | 字符串（复杂类型需转换） |
| **执行效率** | 依赖 Event Structure | 依赖 Event Structure / OOP | LabVIEW OOP | 依赖参数解析 |
| **UI 编写** | 支持 | 支持 | 不推荐 | 支持 |
| **RTOS 支持** | 支持 | 不推荐 | 支持 | 支持 |
| **高级模式** | 自定义模板 | 可组合为子模块 | 继承 Actor Core.vi | 工作者模式 / 责任链模式 |

**各场景推荐**：

| 场景 | 推荐框架 |
| ---- | -------- |
| 企业级应用，团队经验丰富 | DQMH 或 CSM |
| 需要严格 OOP 设计的大型系统 | Actor Framework |
| 混合经验层次的团队 | CSM（学习曲线平滑） |
| ATE 自动化测试脚本化 | CSM（纯文本消息天然支持脚本化） |
| 插件化系统扩展 | CSM（虚拟总线，添加模块不修改现有代码） |
| 偏远部署、需要远程调试 | CSM（内嵌全局日志系统） |

> 📓
> 框架选择没有绝对好坏，应根据团队实际情况和项目需求决定。CSM 与 DQMH、SMO、Actor Framework 在实际工程中也可以互补使用。
>
