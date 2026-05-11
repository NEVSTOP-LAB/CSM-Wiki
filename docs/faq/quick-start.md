---
title: 快速上手
layout: default
parent: 常见问题解答
nav_order: 1
---

# 快速上手

## :question: 如何下载 CSM?

CSM 通过 VIPM Library 的形式发布，您可以通过以下方式下载：

- 🥇 **推荐：通过 VIPM 应用搜索 CSM 获取 CSM 的最新发布版本，然后点击安装**

- **下载安装包(.vip 文件)，然后点击安装**

  - 通过 <https://www.vipm.io/> 下载 CSM 的最新发布版本，然后点击安装:<br/>
    <https://www.vipm.io/package/nevstop_lib_communicable_state_machine/>
  - 通过 GitHub 下载 CSM 的最新发布版本，然后点击安装:<br/>
    <https://github.com/NEVSTOP-LAB/Communicable-State-Machine/releases>
  - 如果想要下载 Pre-release 版本, 请访问: <br/>
    [NEVSTOP-LAB/Communicable-State-Machine 的 Action 页面](https://github.com/NEVSTOP-LAB/Communicable-State-Machine/actions/workflows/Build_VIPM_Library.yml?query=branch%3Amain)

> 📓
> 更多信息，请参考页面 [下载]({% link docs/download-and-install.md %})。
>

## :question: 在使用 VIPM 安装时弹出的编译对话框是什么?

CSM 是基于 JKISM 开发的程序框架，JKISM 提供了 JKI State Machine Editor, 用于辅助开发。CSM 安装时，为了保证 JKI State Machine Editor 同时能够支持 CSM, 对 JKI State Machine Editor 部分的 VI 进行了微调。为了保证加载速度，修改完毕后，重新编译了全部 JKI State Machine Editor 的支持 VI。

> CSM 安装的编译不会对 JKISM 或 JKI State Machine Editor 功能造成任何影响，也不会对用户代码造成任何影响。

## :question: 如何创建 CSM 模块？

CSM 提供了标准模板，在 LabVIEW 中通过模板创建 VI 即可开始使用。创建好的模块包含 CSM 核心解析 VI、消息队列和标准的 Case 结构，可以直接开始编写业务逻辑。

> 📓
> 详细步骤，请参考 [创建 CSM 模块]({% link docs/basic/usage.md %})。
>

## :question: 如何退出 CSM 模块?

通常，如果希望退出 CSM 模块，可以通过对 CSM 模块发送 `Macro: Exit` 消息来实现。

- 如果是多个模块需要退出，通常我们需要控制退出的顺序，这个时候可以使用同步消息，保证按照给定的顺序退出模块。
- 如果多个模块需要退出，且不需要控制退出的顺序，可以使用异步消息，这样可以保证退出的效率。

```csm
// 假如有两个模块需要退出，分别是 Module A 和 Module B

// 同步退出方式
Macro: Exit -@ Module A
Macro: Exit -@ Module B

// 异步退出方式
Macro: Exit -> Module A
Macro: Exit -> Module B
```

e.g. 范例:

![How-to-Exit-Example](https://nevstop-lab.github.io/CSM-Wiki/assets/img/QA/How-to-Exit-Example.png)

## :question: 如何在非 CSM 框架（如 DQMH、Actor Framework）中调用 CSM 模块？

CSM 提供了专用 API 供非 CSM 代码调用 CSM 模块：

- **`CSM - Post Message.vi`**：向 CSM 模块发送异步消息（无返回），适合单向通知。
- **`CSM - Send Message and Wait for Reply.vi`**：向 CSM 模块发送同步消息并等待返回，适合需要获取结果的场景。
- **`CSM - Register Broadcast.vi`**：订阅 CSM 模块的状态广播，通过用户事件接收通知。

> 📓
> 更多信息，请参考 [创建 CSM 模块 - 在其他框架中调用 CSM 模块]({% link docs/basic/usage.md %}#step3-在其他框架中调用csm模块)。
>
