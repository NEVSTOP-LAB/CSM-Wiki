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

## :question: CSM 实现 ATE 测试有优势吗？

**结论：有显著优势。** CSM 的模块化、消息驱动和隐形总线特性，天然适配 ATE 测试流程的「状态机 + 并发 + 设备通讯」需求。

ATE 测试本质上是一个有限状态机——每个测试步骤（等待 Handler 就绪、通讯放置产品、执行测试、通讯分选）都是一个状态，状态之间通过明确的触发条件转换。CSM 框架的核心正是通信状态机，可以将 ATE 系统中的不同角色拆分为独立的 CSM 模块：

- **LotManager**：管理 Lot 生命周期（开始、结束、统计）
- **Handler**：封装与 Handler 设备的通讯（放置、分选、状态查询）
- **Tester**：执行测试序列（测试项、结果判断）
- **Logger**：记录测试数据与日志

各模块通过消息驱动协作，隐形总线让消息传递无需显式连线，非常适合 ATE 中多设备并发通讯的场景。

**核心优势**：

1. **模块化复用**：CSM 良好的模块化设计可复用底层模块，不同项目的积累直接共享
2. **CSMScript 测试脚本化**：CSMScript 可替代 TestStand 的部分典型测试流程，与任何 CSM 模块结合使用（参考 [CSMScript-Lite 示例]({% link docs/examples/csm-script-lite.md %})）
3. **高级模式支持**：工作者模式（Worker Mode）实现测试任务并发，责任链模式（Chain Mode）实现测试项的顺序执行与提前终止
4. **内建调试工具**：调试控制台可在运行中向模块发送消息、观察状态，方便问题排查
5. **模块独立测试**：CSM 模块接口清晰，可先单独测试各模块再集成，降低调试难度

> 📓
> **未来展望**：CSM 路线图中还包括多语言框架支持——打通后可用 AI 生成模块，AI 也能辅助 CSMScript 脚本生成。目前该方向仍在研究中。

**常见坑**：

- **消息超时**：硬件通讯可能超时，需针对消息设置合理超时并设计重试/报警逻辑
- **状态机死锁**：确保消息流是单向依赖（LotManager → Handler → Tester → Handler → LotManager），避免双向等待
- **事件洪峰**：高速分选机频繁触发事件时，可用 CSM - Flood of Events Handler Side Loop 模板应对

{: .note }
> 如果 ATE 系统需要长期维护、多设备协同或未来扩展，CSM 是值得投入的选择。如果只是简单的单步测试，CSM 可能显得"重"，但模块化设计仍能带来结构清晰的好处。

> 📓
> 参考链接：[Discussion #104](https://github.com/orgs/NEVSTOP-LAB/discussions/104)
>
