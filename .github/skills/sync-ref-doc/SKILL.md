---
name: sync-ref-doc
description: '将 .ref/ 目录下的源参考文档同步到 docs/ 目录，处理编码转换、callout 格式转换、Ref 引用展开，并保留已有 frontmatter。适用于 .ref/ 文件有更新需要应用到发布文档时。'
argument-hint: '.ref/ 源文件名，如 "VI Description(zh-cn) - 02. Core Functions.md"'
user-invocable: true
---

# 同步参考文档（sync-ref-doc）

## 触发方式

```
同步参考文档：<.ref源文件名>
```

示例：

```
同步参考文档：VI Description(zh-cn) - 02. Core Functions.md
```

## 本技能产出

- 将 `.ref/` 源文件中的最新内容同步到对应的 `docs/` 目标文件。
- 将 GitHub callout 格式（`> [!NOTE]` 等）转换为 Just the Docs callout 格式（`{: .note }` 等）。
- 展开所有 `> - Ref: <标题>` 引用行，替换为实际内容。
- 保留目标文件已有的 YAML frontmatter 不变。

## 文档映射表

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

## 执行流程

1. **定位文件**：根据文档映射表，找到 `.ref/` 源文件和 `docs/` 目标文件路径。

2. **读取源文件**（注意编码处理）：
   - 部分 `.ref/` 文件（尤其是 `VI Description(zh-cn) - 12. Debug,Doc,Tools.md`）使用 GBK 编码。
   - 按以下顺序尝试解码：`gbk` → `gb2312` → `gb18030` → `utf-8` → `latin-1`。

3. **对比内容**：将源文件与目标文件现有内容对比，识别缺失或过时的内容。

4. **移除 NOTE/WARNING 块**：从源文件内容中移除所有 `> [!NOTE]` / `> [!WARNING]` 块（这些块来自 `VI Description(zh-cn).md`，由其他文件引用，不直接复制）。

5. **展开 Ref 引用**：将所有 `> - Ref: <标题>` 行替换为对应标题的 NOTE/WARNING 块实际内容。
   - **重要**：`> - Ref:` 行必须被完全展开，不能保留在最终的 `docs/` 文件中。
   - 从 `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn).md` 和对应的各个源文件中查找标题匹配的 NOTE/WARNING 块。
   - 标题匹配时需要忽略：空格、括号及其内容、引号、冒号等标点符号。
   - 支持多种标题变体（如 `CSM 模块间通信类型`、`CSM模块间通信类型`、`模块间通信类型`、`模块间通信类型参数`）。
   - 特殊映射：`全局超时时间设置` → `CSM同步消息全局超时`。
   - 对于引用其他 VI API 的 Ref（如 `CSM - Set Module Attribute.vi`），这些是跨文档引用，应移除而非展开。

6. **转换 Callout 格式**：将 GitHub 格式转换为 Just the Docs 格式：

   | GitHub 格式（`.ref/` 中使用） | Just the Docs 格式（`docs/reference/` 中使用） |
   |-------------------------------|------------------------------------------------|
   | `> [!NOTE]` | `{: .note .callout-hover }` |
   | `> [!WARNING]` | `{: .warning .callout-hover }` |
   | `> [!TIP]` | `{: .tip .callout-hover }` |
   | `> [!IMPORTANT]` | `{: .important .callout-hover }` |
   | `> [!CAUTION]` | `{: .caution .callout-hover }` |

   **重要**：连续多个 callout 块时，每个 IAL（`{: .note .callout-hover }`）前面必须有一个空行，否则 kramdown 会将 IAL 应用到前一个 blockquote 上，导致样式错误。

   正确写法示例：
   ```markdown
   {: .note .callout-hover }
   > <b>标题1</b>
   >
   > 内容1

   {: .note .callout-hover }
   > <b>标题2</b>
   >
   > 内容2
   ```

   **注意**：`.callout-hover` 类仅用于 `docs/reference/` 目录下的 API 参考文档。`docs/` 其他目录的文件使用普通格式（`{: .note }`、`{: .warning }` 等）。

7. **保留 frontmatter**：保持目标 `docs/` 文件中已有的 YAML frontmatter（`title`、`layout`、`parent`、`nav_order` 等）不变，不要覆盖。

8. **更新文件并提交**：将处理后的内容写入目标文件并提交。

## 验证

完成更新后，运行以下命令验证所有引用都已展开：

```bash
grep -r "> - Ref:" docs/reference/
```

如果有输出，说明还有未展开的引用，需要继续处理。

## 完成检查清单

- [ ] 源文件已找到并正确读取（编码处理正确）。
- [ ] 目标文件路径已确认。
- [ ] 所有 `> [!NOTE]` / `> [!WARNING]` 块已从源内容中移除。
- [ ] 所有 `> - Ref:` 引用行已完全展开（不保留原始引用行）。
- [ ] GitHub callout 格式已转换为 Just the Docs 格式，`docs/reference/` 下使用 `.callout-hover` 类。
- [ ] 连续 callout 之间有空行（kramdown IAL 间距规则）。
- [ ] 目标文件的 YAML frontmatter 保持不变。
- [ ] `grep -r "> - Ref:" docs/reference/` 无输出（无残留引用）。
