---
title: JKI State Machine
layout: default
parent: 基础文档
nav_order: 1
---

# JKI State Machine (JKISM)
{: .no_toc }

---

1. TOC
{:toc}

---

## JKISM 简介

JKI State Machine (JKISM) 是一个 LabVIEW **事件驱动队列消息状态机**，核心是**队列消息状态机 + 用户界面交互处理**模式。JKISM 采用规定格式的字符串描述状态，利用字符串类型的移位寄存器构建消息队列。

![JKISM 简介](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-10.png)

### 优点

1. 字符串格式的消息队列、消息，易于编辑、操作和查看
2. 字符串消息可以携带附加的额外信息，构成**消息 + 数据**队列状态机
3. 支持注释、宏消息
4. 状态过程可通过文本描述，可以实现外部控制状态转换
5. 模板内置错误处理机制
6. JKISM Editor 工具

{: .note }
> JKISM 开源地址：[JKISoftware/JKI-State-Machine (github.com)](https://github.com/JKISoftware/JKI-State-Machine)

---

## 核心结构：Parse State Queue.vi

`Parse State Queue.vi` 是 JKISM 的**消息处理核心**，负责：

1. 取出消息队列中下一条消息
2. Error 时进入 `"Error Handler"` 状态

消息队列为空时，程序进入事件结构等待用户操作。

![JKISM 核心结构](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-11.png)

### 消息格式

```text
//打开前界面
UI: Front Panel State >> Open
```

| 元素 | 说明 |
|------|------|
| `//打开前界面` | 注释（以 `//` 开头） |
| `UI: Front Panel State` | 消息（状态名） |
| `>> Open` | 消息参数 |

### Core Category（内置核心状态）

| 状态 | 说明 |
|------|------|
| `Default` | 严重错误，捕获编程中使用未定义状态 |
| `Initialize Core Data` | 初始化框架所需资源 |
| `Error Handler` | 处理错误 |
| `Exit` | 退出 |

---

## JKISM 探针 (Probe)

JKISM 提供了专为 JKI 状态机设计的**自定义探针**，应用在状态连线上，显示下一个状态；如果没有则显示空字符串。

![JKISM 探针](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-12.png)

### 使用方法

在 LabVIEW 的连线右键菜单中，选择 **Custom Probe → JKI State Queue Cyclic Table** 即可插入 JKISM 专用探针。

在四个状态对应的代码中插入探针后，每个状态的运行结果会依次显示在探针窗口中。

### History 探针

VIPM 中有多个历史列表探针库，安装后可以看到**轮转的历史状态列表**，方便追踪状态执行顺序。

---

## JKISM 编辑器

JKISM Editor 是 JKISM 的配套开发工具，提供可视化的状态管理界面。

![JKISM 编辑器](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-13.png)

### 主要功能

- **打开方式**：通过 JKISM 工具栏按钮或菜单打开
- **状态跳转 / 过滤状态**：快速定位和筛选已定义的状态
- **调用状态跳转**：点击状态名即可跳转到对应的 Case 分支

---

## JKISM 编程技巧

### 技巧总览

1. **不要在子 VI 中隐藏状态字符串**
2. **不要在事件结构中添加代码和逻辑判断**
3. **保留原生架构尺度，尽量不催生壮大架构**
4. **使用宏替代链式序列状态**
5. **左对齐替代右对齐状态字符串**

---

### 技巧 1：不要在子 VI 中隐藏状态字符串

状态字符串应直接写在 Case 分支中，而不是封装到子 VI 内部。子 VI 内的状态字符串难以阅读和维护。

![技巧1：不要在子VI中隐藏状态字符串](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-14.png)

{: .tip }
> 将状态字符串直接暴露在 Case 分支中，阅读代码时无需打开子 VI 即可了解状态流转逻辑。

---

### 技巧 2：不要在事件结构中添加代码和逻辑判断

事件结构只负责**产生消息**，不应包含业务逻辑。复杂逻辑应放在对应的状态 Case 中处理。

![技巧2：不要在事件结构中添加代码和逻辑判断](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-15.png)

{: .note }
> 简单的条件逻辑（如判断是否入队某状态）可以放在事件结构中，但业务逻辑应保持在状态 Case 内。

---

### 技巧 3：保留原生架构尺度，尽量不催生壮大架构

- 尽量**保留原生尺寸**
- 尽量避免拖拽复制大量代码
- 关闭 **Auto Grow** 功能

![技巧3：保留原生架构尺度](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-16.png)

---

### 技巧 4：使用宏替代链式序列状态

使用**宏消息（Macro）**将多个连续状态打包，代替手动链式入队多个状态，使代码更简洁。

```text
// 链式序列（不推荐）
State 1
State 2
State 3

// 使用宏（推荐）
Macro: Initialize
```

其中 `Macro: Initialize` 展开后等价于：

```text
Data: Initialize
Initialize Core Data
UI: Initialize
UI: Front Panel State >> Open
```

![技巧4：使用宏替代链式序列状态](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-17.png)

---

### 技巧 5：左对齐替代右对齐状态字符串

状态字符串常量应使用**左对齐**，而非右对齐，以便阅读。

![技巧5：左对齐替代右对齐状态字符串](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-18.png)

{: .tip }
> 在 LabVIEW 字符串常量属性中将对齐方式设为左对齐，多行状态队列字符串会更易读。

---

## Demo：了解 JKISM

以下是学习 JKISM 的推荐动手步骤：

![JKISM Demo 步骤](https://nevstop-lab.github.io/CSM-Wiki/assets/img/jkism/slide-19.png)

1. 后面板放置一个 JKISM，了解 JKISM 的**创建方法**
2. 在 JKISM String Queue 连线上点击 **Probe**，高亮运行，了解 JKISM 的**运行逻辑**
3. 展示 JKISM 的 **Probe**（自定义探针）
4. 展示 **JKISM Editor**

---

## 参考资料

- [JKI State Machine GitHub](https://github.com/JKISoftware/JKI-State-Machine)
- [JKI 官方网站](http://jki.net/state-machine)
- [CSM GitHub](https://github.com/NEVSTOP-LAB/Communicable-State-Machine)
