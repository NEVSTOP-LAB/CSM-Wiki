可通信状态机（CSM）是一个基于JKI状态机（JKISM）的LabVIEW应用框架。本仓库用于存储CSM的文档和示例代码。

- [可通讯状态机(CSM)框架源码](https://github.com/NEVSTOP-LAB/Communicable-State-Machine)
- [Wiki地址](https://nevstop-lab.github.io/CSM-Wiki/)

---

_**本仓库使用了以下的开源项目或服务**_：

- 使用 [visual-studio-code](https://code.visualstudio.com/) 作为编辑器
- 使用 [copilot](https://copilot.github.com/) 作为提示工具,并补充部分内容
- 使用 [markdownlint](https://github.com/markdownlint/markdownlint) 用于 markdown 文件的语法检查
- 通过 [GitHub Pages](https://pages.github.com/) 服务发布页面
- 使用 [Jekyll](https://jekyllrb.com/) 静态网站生成器
- 使用 [just-the-docs/just-the-docs](https://github.com/just-the-docs/just-the-docs) 主题

-----------------------------

## 如何为Wiki添加新内容

本Wiki使用 [Just the Docs](https://just-the-docs.com/) 主题构建。以下是添加新内容的指南：

### 添加新的文档页面

1. **选择合适的目录**
   - 基础教程 → `docs/basic/`
   - API参考 → `docs/reference/`
   - 插件说明 → `docs/plugins/`
   - 示例应用 → `docs/examples/`

2. **创建Markdown文件**，包含以下前置信息（front matter）：

   ```yaml
   ---
   title: 页面标题
   layout: default
   parent: 基础文档  # 父页面的标题
   nav_order: 7      # 在父页面下的显示顺序
   ---
   ```

3. **编写内容**
   - 使用标准Markdown语法编写内容
   - Just the Docs 使用 Kramdown 的 `{:toc}` 方法生成页内目录

### 添加页内目录 (Table of Contents)

对于内容较长的页面，建议添加页内目录：

```markdown
---
title: 页面标题
layout: default
parent: 基础文档
nav_order: 2
---

# 页面标题
{: .no_toc }

## 目录
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 第一节

内容...

## 第二节

内容...
```

**说明：**
- `{: .no_toc }` 用于排除某个标题不出现在目录中
- `{: .text-delta }` 为目录标题添加样式
- `1. TOC` 后的 `{:toc}` 会自动生成目录链接
- 可以在页面前置信息中添加 `has_toc: false` 来禁用某个页面的目录功能

### 添加顶级页面

如需添加像"FAQ"这样的顶级导航页面：

```yaml
---
title: 新页面标题
layout: default
nav_order: 13     # 在主导航中的位置
permalink: /new-page
has_children: false
---
```

### 添加新的文档分类

如需添加新的主分类（如"高级主题"）：

1. 创建父页面 `docs/advanced.md`：
   ```yaml
   ---
   title: 高级主题
   layout: default
   nav_order: 60
   has_children: true
   permalink: /docs/advanced
   ---

   # 高级主题
   
   这个分类的描述。
   ```

2. 在 `docs/advanced/` 目录下创建子页面

### 本地预览

```bash
bundle install
bundle exec jekyll serve
```

访问 `http://localhost:4000/CSM-Wiki/` 预览效果。

更多详情请参考 [Just the Docs 文档](https://just-the-docs.com/) 或查看 `.progress/theme-migration.md`。

_**TODO LIST**_

``` text
网站部分：- [@nevstop](https://github.com/nevstop)
- [√] HOME 页面 - 100%
      CSM框架的介绍; CSM框架的特点; CSM框架的应用场景; CSM框架的下载链接; 开源资源使用说明
- [√] 404 页面 - 100%
      404页面
- Contributors 页面 - 100%
      如何参与到项目中来; 项目的贡献者列表
- [√] Download 页面 - 100%
      下载CSM框架的最新版本的链接; 历史版本的更新记录
- 和其他框架比较的页面 - 50%
      本身的特点; 和JKISM的比较; 和DQMH/SMO/AFW等框架的比较
- [√] FAQ 页面 - 100%
      常见问题的解答

文档部分：
- JKISM内容介绍
  - [√] JKISM的介绍 - 95%
        介绍JKISM的概念和用法; 介绍 JKISM 的优势；介绍 JKISM 的不足; 介绍 JKISM 的应用场景
  - [√] JKISM的推荐用法 - 95%
        介绍JKISM的Best Practice

- 基础内容部分 - [@KivenJia](https://github.com/KivenJia)
  - [√] CSM的基本概念 - 100%
        CSM 中所有的基本概念，其他地方用到的都是基于这里的概念来解释的
  - [√] CSM模块间的通讯 - 90%
        模块间的同步消息；模块间的异步消息；模块间的状态
  - [√] 创建CSM的复用模块 - 95%
        创建CSM的复用模块的方法
  - [√] 调用CSM的模块 - 95%
    - 被CSM框架调用: 使用字符串方式进行调用；使用CSM的API进行调用；指向用到的函数
    - 被其他框架调用：使用CSM的API进行调用;指向用到的函数
  - [√] CSM的参数传递 - 95%
        参数传递在CSM中的特殊性；不同场景目前应该使用的方式

- 进阶内容部分
  - [√] CSM高级模式与特性 - 95%
        CSM内置的错误处理机制；系统级模块；子模块；工作者模式；责任链模式；多循环模式支持
  - [√] CSM全局日志系统 - 100%
        全局日志功能、API详解、过滤机制、应用场景、最佳实践

- 预留的插件机制
  - [√] Addon 接口 - 95%
        addon留下接口的位置；如何给CSM添加addon；内置Addon详解
  - [√] Template 接口 - 95%
        template留下接口的位置；如何给CSM添加template；模板开发指南
  - [√] Tools 接口 - 95%
        tools留下接口的位置；如何给CSM添加tools；工具开发指南

- (还未实现) LabVIEW的CSM Plugin
  - (TODO) STRING右键：弹出模块、消息列表，并快速填写
        (待功能实现后补充)
  - (TODO) STRING右键：替换为SafeString
        (待功能实现后补充)

- 调试工具/调试方法
  - [√] CSM调试与开发工具 - 95%
        运行时调试工具；开发辅助工具；接口管理工具；示例工具；JKISM State Editor集成
  - [√] CSM Global Log Window - 100%
        介绍CSM Global Log Window的功能
  - [√] CSM State Dashboard Window - 95%
        介绍CSM State Dashboard Window的功能
  - [√] CSM State Table Window - 95%
        介绍CSM State Table Window的功能
  - (TODO) CSM Test Panel
        (待功能实现后补充)

- Addon/Plugins
  - [√] MassData参数支持 - 95%
        说明MassData应用的场景、核心API、最佳实践、常见问题
  - [√] API String参数支持 - 95%
        说明API String应用的场景、核心API、最佳实践、常见问题
  - [√] INI/静态参数支持 - 95%
        说明INI/静态参数应用的场景、核心API、最佳实践、常见问题

- 应用列表
  - Continuous Measurement and Logging Project - 90%
  - <<补充其他的项目>>

- References - [@nevstop](https://github.com/nevstop)
  - [√] CSM Palette APIs - 95%
        介绍所有CSM的函数；API分类；使用最佳实践；快速参考表
  - [√] CSM Templates - 95%
        介绍CSM的Event模板; 介绍CSM的No-Event模板; 模板开发流程; 使用最佳实践
```
