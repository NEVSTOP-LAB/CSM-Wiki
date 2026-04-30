# CSM-Wiki 仓库背景知识

## 项目概述

本项目是基于 Jekyll 和 **Just the Docs** 主题构建的 **CSM（Communication State Machine，通信状态机）** Wiki 网站。源参考文档存放在 `.ref/` 目录，发布到网站的文档存放在 `docs/` 目录。

## 关键目录结构

- `.ref/` — 原始参考文档（不发布到网站），包含 VI 说明和示例的原始内容。
- `docs/` — 发布到网站的文档，分为 `reference/`、`examples/`、`basic/`、`plugins/` 子目录。
- `.process/` — 内部流程文档、历史记录及技术设计说明。
- `_pages/` — 顶级 Jekyll 页面。
- `_config.yml` — Jekyll 站点配置，包含 callout 类型定义。

## 文档映射：`.ref/` → `docs/`

从 `.ref/` 源文件更新发布文档时，使用以下映射关系。`.ref/` 下各子目录由 `.github/workflows/sync-from-repos.yml` 工作流定时从对应的源仓库同步，不要手工修改。

**核心 CSM 框架（`.ref/Communicable-State-Machine/`）**

| `.ref/Communicable-State-Machine/VI Description/VI Description(zh-cn)/` 中的源文件 | `docs/reference/` 中的目标文件 |
|--------------------------------------------------------------|------------------------------|
| VI Description(zh-cn) - 01. Templates.md | api-01-templates.md |
| VI Description(zh-cn) - 02. Core Functions.md | api-02-core-functions.md |
| VI Description(zh-cn) - 03. Arguments.md | api-03-arguments.md |
| VI Description(zh-cn) - 04 .Management API.md | api-04-management-api.md |
| VI Description(zh-cn) - 05. Module Operation API.md | api-05-module-operation-api.md |
| VI Description(zh-cn) - 06. Broadcast Registration.md | api-06-broadcast-registration.md |
| VI Description(zh-cn) - 07. Global Log.md | api-07-global-log.md |
| VI Description(zh-cn) - 08. Advanced Modes.md | api-08-advanced-modes.md |
| VI Description(zh-cn) - 09. Build-in Addons.md | api-09-build-in-addons.md |
| VI Description(zh-cn) - 10. Utility VIs.md | api-10-utility-vis.md |
| VI Description(zh-cn) - 12. Debug,Doc,Tools.md | api-12-debugdoctools.md |

**Addon 仓库（每个 Addon 一个独立同步目录）**

| 源文件 | `docs/reference/` 中的目标文件 |
|--------|------------------------------|
| `.ref/CSM-API-String-Arguments-Support/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - Addon API String.md` | api-addon-api-string.md |
| `.ref/CSM-INI-Static-Variable-Support/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - Addon INI-Variable.md` | api-addon-ini-variable.md |
| `.ref/CSM-MassData-Parameter-Support/VI Description/VI Description(zh-cn)/VI Description(zh-cn) - Addon Massdata.md` | api-addon-massdata.md |

**示例（`.ref/Communicable-State-Machine/Examples/`）**

| 源文件 | `docs/examples/` 中的目标文件 |
|--------|------------------------------|
| CSM Basic Example(zh-cn).md | example-csm-basic-example.md |
| CSM Advance Example(zh-cn).md | example-csm-advance-example.md |

**注意**：不要迁移 `_internal/` 子目录中的任何文件。

新增 API 文档放在 `docs/reference/`，命名格式为 `api-{name}.md`；新增示例文档放在 `docs/examples/`，命名格式为 `example-{name}.md`。

## Callout 格式转换

`.ref/` 文件使用 **GitHub callout 格式**，`docs/` 文件必须使用 **Just the Docs callout 格式**。从 `.ref/` 复制内容到 `docs/` 时，始终进行格式转换。

| GitHub 格式（`.ref/` 中使用） | Just the Docs 格式（`docs/` 中使用） |
|-------------------------|--------------------------------|
| `> [!NOTE]` | `{: .note }` |
| `> [!WARNING]` | `{: .warning }` |
| `> [!TIP]` | `{: .tip }` |
| `> [!IMPORTANT]` | `{: .important }` |
| `> [!CAUTION]` | `{: .caution }` |

### Callout 悬浮提示（callout-hover）

`docs/reference/` 目录下的 API 参考文档中，所有 callout 必须添加 `.callout-hover` 类，使其显示为可悬浮展开的紧凑链接，减少重复内容对页面的干扰。

| 普通 callout 格式 | 参考文档中使用的格式 |
|-------------------|-------------------|
| `{: .note }` | `{: .note .callout-hover }` |
| `{: .warning }` | `{: .warning .callout-hover }` |
| `{: .tip }` | `{: .tip .callout-hover }` |
| `{: .important }` | `{: .important .callout-hover }` |
| `{: .caution }` | `{: .caution .callout-hover }` |

**重要**：连续多个 callout-hover 块时，每个 `{: .note .callout-hover }` 前面必须有一个空行，否则 kramdown 会将 IAL 应用到前一个 blockquote 上，导致样式错误。

```markdown
# 正确写法（连续 callout 之间有空行）
{: .note .callout-hover }
> <b>标题1</b>
>
> 内容1

{: .note .callout-hover }
> <b>标题2</b>
>
> 内容2
```

转换示例：

```markdown
# GitHub 格式（.ref/）
> [!NOTE]
> 这是一个多行注释。

# Just the Docs 格式（docs/）
{: .note }
> 这是一个多行注释。
```

## 处理 `.ref/` 文件更新

当 `.ref/` 文件有更新需要应用到 `docs/` 时：

1. **移除 NOTE/WARNING 块**：从源文件中移除所有 `> [!NOTE]` / `> [!WARNING]` 块（这些块来自 `VI Description(zh-cn).md`，由其他文件引用，不直接复制）。
2. **替换引用行**：将所有 `> - Ref: <标题>` 行替换为对应标题的 NOTE/WARNING 块实际内容。
   - **重要**：`> - Ref:` 行必须被完全展开，不能保留在最终的 `docs/` 文件中
   - 从 `.ref/Communicable-State-Machine/VI Description/VI Description(zh-cn)/VI Description(zh-cn).md` 和对应的各个源文件中查找标题匹配的 NOTE/WARNING 块
   - 标题匹配时需要忽略：空格、括号及其内容、引号、冒号等标点符号
   - 支持多种标题变体（如 `CSM 模块间通信类型`、`CSM模块间通信类型`、`模块间通信类型`、`模块间通信类型参数`）
   - 特殊映射：`全局超时时间设置` → `CSM同步消息全局超时`
   - 对于引用其他 VI API 的 Ref（如 `CSM - Set Module Attribute.vi`），这些是跨文档引用，应移除而非展开
3. **转换 Callout 格式**：将 GitHub 格式转换为 Just the Docs 格式（见上表）。
4. **保留 YAML frontmatter**：保持目标 `docs/` 文件中已有的 frontmatter（`title`、`layout`、`parent`、`nav_order` 等）不变，不要覆盖。

**验证方法**：完成更新后，使用以下命令验证所有引用都已展开：
```bash
grep -r "> - Ref:" docs/reference/
```
如果有输出，说明还有未展开的引用。

## 编码处理

部分 `.ref/` 文件（尤其是 `VI Description(zh-cn) - 12. Debug,Doc,Tools.md`）使用 **GBK 编码**。读取 `.ref/` 文件时，按以下顺序尝试编码：`gbk`、`gb2312`、`gb18030`、`utf-8`、`latin-1`。

## `docs/` 中的 VI 超链接

当 VI 名称（如 `` `Parse State Queue++.vi` ``）出现在 `docs/` 的 Markdown 文件中时，使用 Jekyll 链接语法将其链接到 API 参考文档的对应章节：

```markdown
[`Parse State Queue++.vi`]({% link docs/reference/api-02-core-functions.md %}#parse-state-queuevi)
```

- 不要链接标题行（以 `#` 开头的行）中的 VI 名称。
- 不要对已有链接的 VI 名称重复添加链接。
- 从最长的 VI 名称开始匹配，避免部分匹配问题。

## 构建与 Lint

- 本地构建命令：`bundle exec jekyll build`。
- Markdown lint 配置文件：`.markdownlint.json`。
- Jekyll 工作流定义：`.github/workflows/jekyll.yml`。

## 项目当前状态

> 详细进度记录保存在 `.process/history/` 目录，阅读该目录下的文件可了解完整历史。

**总体进度**：主要文档已完成（约167,000字，13个文档）。参考资料覆盖度90%+。

### `docs/reference/` 文件完成情况

| 文件 | 对应 `.ref/` 源文件 | 状态 |
|------|-------------------|------|
| api-01-templates.md | VI Description(zh-cn) - 01. Templates.md | ✅ 完成 (100%) |
| api-02-core-functions.md | VI Description(zh-cn) - 02. Core Functions.md | ✅ 完成 (100%) |
| api-03-arguments.md | VI Description(zh-cn) - 03. Arguments.md | ✅ 完成 (100%) |
| api-04-management-api.md | VI Description(zh-cn) - 04 .Management API.md | ✅ 完成 (100%) |
| api-05-module-operation-api.md | VI Description(zh-cn) - 05. Module Operation API.md | ✅ 完成 (100%) |
| api-06-broadcast-registration.md | VI Description(zh-cn) - 06. Broadcast Registration.md | ✅ 完成 (100%) |
| api-07-global-log.md | VI Description(zh-cn) - 07. Global Log.md | ✅ 完成 (100%) |
| api-08-advanced-modes.md | VI Description(zh-cn) - 08. Advanced Modes.md | ✅ 完成 (100%) |
| api-09-build-in-addons.md | VI Description(zh-cn) - 09. Build-in Addons.md | ✅ 完成 (100%) |
| api-10-utility-vis.md | VI Description(zh-cn) - 10. Utility VIs.md | ✅ 完成 (100%) |
| api-12-debugdoctools.md | VI Description(zh-cn) - 12. Debug,Doc,Tools.md | ✅ 完成 (100%) |
| api-addon-api-string.md | VI Description(zh-cn) - Addon API String.md | ✅ 完成 (100%) |
| api-addon-ini-variable.md | VI Description(zh-cn) - Addon INI-Variable.md | ✅ 完成 (100%) |
| api-addon-massdata.md | VI Description(zh-cn) - Addon Massdata.md | ✅ 完成 (100%) |

### `docs/basic/` 文件完成情况

| 文件 | 内容 | 状态 |
|------|------|------|
| concepts.md | CSM基本概念 | ✅ 完成 (100%) |
| communication.md | CSM模块间通讯 | ✅ 完成 (90%) |
| usage.md | 创建CSM复用模块 / 参数传递 | ✅ 完成 (95%) |
| advance.md | CSM高级模式与特性 | ✅ 完成 (95%) |
| global-log.md | CSM全局日志系统 | ✅ 完成 (100%) |
| jkism.md | JKISM介绍与推荐用法 | ✅ 完成 (95%) |

### `docs/plugins/` 文件完成情况

| 文件 | 内容 | 状态 |
|------|------|------|
| plugin-system.md | CSM插件机制概述 | ✅ 完成 (95%) |
| massdata.md | MassData参数支持 | ✅ 完成 (95%) |
| api-string.md | API String参数支持 | ✅ 完成 (95%) |
| ini-variable.md | INI/静态参数支持 | ✅ 完成 (95%) |
| tools.md | CSM调试与开发工具 | ✅ 完成 (95%) |
| csmlogger.md | CSM File Logger Addon | ✅ 完成 (100%) |

### `docs/examples/` 文件完成情况

| 文件 | 对应 `.ref/` 源文件 | 状态 |
|------|-------------------|------|
| example-csm-basic-example.md | CSM Basic Example(zh-cn).md | ✅ 完成 |
| example-csm-advance-example.md | CSM Advance Example(zh-cn).md | ✅ 完成 |
| csm-gweb-development.md | （新增）G-Web-Development-with-CSM 应用说明 | ✅ 完成 |
| csm-script-lite.md | （新增）CSMScript-Lite 脚本化自动测试应用说明 | ✅ 完成 |

### `docs/release/` 文件完成情况

| 文件 | 内容 | 状态 |
|------|------|------|
| 2026Q1 - 核心优化与插件增强.md | CSM 2026Q1 版本发布博客 | ✅ 完成 |

### 待完成项目

- `_pages/framework-compare(zh-cn).md`：与其他框架的对比（当前50%）
- 英文文档翻译（所有中文文档的英文版本）

## 可用技能（Skills）

以下是本项目中可重复执行的标准化任务（"技能"）。技能定义文件位于 `.github/skills/` 目录，每个技能都有固定的触发提示词，发送对应提示词即可启动该技能。

### Skill 1：同步参考文档（sync-ref-doc）

详见 `.github/skills/sync-ref-doc/SKILL.md`。

**触发提示词**：
```
同步参考文档：<.ref源文件名>
```

---

### Skill 2：添加VI超链接（add-vi-links）

详见 `.github/skills/add-vi-links/SKILL.md`。

**触发提示词**：
```
为 <docs文件路径> 添加VI超链接
```

---

### Skill 3：添加常见问题解答（add-faq）

详见 `.github/skills/add-faq/SKILL.md`。

**触发条件**：Issue 被分配给 AI 助手后，判断该 Issue 属于常见问题记录类型时触发。

---

## Wiki 修改后自动检查

每次修改 `docs/` 目录下的文件后，**自动执行**以下检查，无需用户显式触发：

1. **Callout 格式**：检查被修改的文件中是否存在 GitHub callout 格式（`> [!NOTE]` 等），如有则立即转换为 Just the Docs 格式（`{: .note }` 等）。对于 `docs/reference/` 目录下的文件，还需确保所有 callout 包含 `.callout-hover` 类。

2. **进度更新**：如果本次修改涉及文档内容的新增或完善，同步更新 `.github/copilot-instructions.md` 中"项目当前状态"对应文件的完成度。

3. **页面标题中文检查**：检查被新建或修改文件的 frontmatter `title` 和 H1 主标题（`# ...`），确保符合以下规则：
   - **`title` 字段**（左侧导航）：必须以中文开头，技术英文词汇可以附在括号中（如 `循环状态支持(Loop Support)`），不能以纯英文作为标题（如 `Addon API String`、`JKI State Machine` 均不合格）。
   - **H1 主标题**：必须以中文开头，或以产品名（`CSM`）开头后紧跟中文（如 `# CSM插件机制` 合格）。纯英文 H1（如 `# CSM Debug Tools`、`# CSM File Logger Addon`）均不合格。
   - **缺少 H1**：每个 `docs/` 文件都应有 H1 标题，缺少时自动补充与 `title` 相同的 H1。

## 图片路径规范

在 `docs/` 目录下的 Markdown 文件中，**禁止使用** `{{ site.baseurl }}/assets/img/` 这种 Jekyll Liquid 语法引用图片。

这种语法只在 Jekyll 构建时生效，在 GitHub Markdown 渲染器（如 PR 预览、README 展示）中**无法显示**。

### ⚠️ 自定义 Permalink 的特殊情况

如果文件设置了自定义 `permalink`，其 **URL 深度**可能与文件的**目录深度**不一致，导致相对路径在网页上失效。

**规则**：当文件设置了自定义 `permalink`，必须使用绝对 URL 引用图片。

| 文件位置 | permalink | 正确图片路径写法 |
|----------|-----------|----------------|
| `docs/xxx.md` | 无（默认） | `../assets/img/filename.png` |
| `docs/basic/xxx.md` | 无（默认） | `../../assets/img/filename.png` |
| `docs/xxx.md` | `/xxx`（单层） | `https://nevstop-lab.github.io/CSM-Wiki/assets/img/filename.png` |
| `docs/xxx.md` | `/FAQ`、`/download-and-install` 等 | `https://nevstop-lab.github.io/CSM-Wiki/assets/img/filename.png` |

**原因**：`permalink: /FAQ` 将页面托管在 `/CSM-Wiki/FAQ`，此时浏览器解析 `../assets/img/` 会跳出 `/CSM-Wiki/` baseurl，导致图片 404。

### 已知使用绝对 URL 的文件（含自定义 permalink）

- `docs/download-and-install.md`（`permalink: /download-and-install`）
- `docs/faq(zh-cn).md`（`permalink: /FAQ`）

### 默认路径（无自定义 permalink）

**正确做法**：使用相对路径：
- `docs/` 目录下的文件：`../assets/img/filename.png`
- `docs/basic/` 等子目录下的文件：`../../assets/img/filename.png`

**示例（正确，无自定义 permalink）**：
```markdown
![图片描述](../assets/img/example.png)
```

**示例（正确，有自定义 permalink）**：
```markdown
![图片描述](https://nevstop-lab.github.io/CSM-Wiki/assets/img/example.png)
```

**示例（错误，不要使用）**：
```markdown
![图片描述]({{ site.baseurl }}/assets/img/example.png)
```
