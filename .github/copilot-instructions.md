# CSM-Wiki 仓库背景知识

## 项目概述

本项目是基于 Jekyll 和 **Just the Docs** 主题构建的 **CSM（Communication State Machine，通信状态机）** Wiki 网站。源参考文档存放在 `.ref/` 目录，发布到网站的文档存放在 `docs/` 目录。

## 关键目录结构

- `.ref/` — 原始参考文档（不发布到网站），包含 VI 说明和示例的原始内容。
- `docs/` — 发布到网站的文档，分为 `reference/`、`examples/`、`basic/`、`plugins/` 子目录。
- `.process/` — 内部流程文档。
- `.progress/` — 进度跟踪记录。
- `_pages/` — 顶级 Jekyll 页面。
- `_config.yml` — Jekyll 站点配置，包含 callout 类型定义。

## 文档映射：`.ref/` → `docs/`

从 `.ref/` 源文件更新发布文档时，使用以下映射关系：

| `.ref/VI Description/VI Description(zh-cn)/` 中的源文件 | `docs/reference/` 中的目标文件 |
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
| VI Description(zh-cn) - Addon API String.md | api-addon-api-string.md |
| VI Description(zh-cn) - Addon INI-Variable.md | api-addon-ini-variable.md |
| VI Description(zh-cn) - Addon Massdata.md | api-addon-massdata.md |

| `.ref/Examples/` 中的源文件 | `docs/examples/` 中的目标文件 |
|----------------------------------|------------------------------|
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
3. **转换 Callout 格式**：将 GitHub 格式转换为 Just the Docs 格式（见上表）。
4. **保留 YAML frontmatter**：保持目标 `docs/` 文件中已有的 frontmatter（`title`、`layout`、`parent`、`nav_order` 等）不变，不要覆盖。

引用标题可能有多种变体（如 `CSM 模块间通信类型`、`CSM模块间通信类型`、`模块间通信类型`），需全部兼容处理。

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
