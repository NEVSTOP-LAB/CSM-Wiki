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
- 将 GitHub callout 格式（`> [!NOTE]` 等）转换为 Just the Docs callout 格式：`docs/reference/` 中必须使用 `{: .note .callout-hover }` / `{: .warning .callout-hover }` 等带 `.callout-hover` 的格式，其它 `docs/` 目录使用普通 `{: .note }` / `{: .warning }` 等格式。
- 展开所有 `> - Ref: <标题>` 引用行，替换为实际内容。
- 保留目标文件已有的 YAML frontmatter 不变。

## 路径规则（关系，不是绝对路径）

`.ref/` 下各仓库子目录由 `.github/workflows/sync-from-repos.yml` 工作流定时从源仓库同步，目录结构可能随上游调整而变化，**不要硬编码具体路径**。源文件与目标文件的对应关系按以下规则推导（使用 glob 在 `.ref/` 下查找即可，不要假设固定的中间目录层级）。

### 通用查找原则

- 源文件统一位于 `.ref/<repo>/**/VI Description(zh-cn)/<source-name>.md` 或 `.ref/<repo>/**/Examples/<source-name>.md`。需要时直接用 `find .ref -path '*/_internal' -prune -o -name '<filename>' -print` 或 glob `.ref/**/<filename>` 查找。
- **必须忽略** 任意层级的 `_internal/` 子目录，凡是路径匹配 `.ref/**/_internal/**` 的内容都属于内部资料，不同步到 `docs/`。
- 所有 `docs/reference/` 文件统一存放 API 参考；所有 `docs/examples/` 文件统一存放示例。

### 命名映射规则

按文件名前缀分组，规则如下（`<NN>` 为两位数字章节号，`<slug>` 为去掉空格、转小写、特殊字符替换为 `-` 后的标题）：

| 源文件名形态 | 目标文件位置 | 目标文件名规则 |
|--------------|--------------|----------------|
| `VI Description(zh-cn) - <NN>. <Title>.md`<br>（如 `VI Description(zh-cn) - 02. Core Functions.md`） | `docs/reference/` | `api-<NN>-<slug>.md`（slug 由 `<Title>` 取小写、移除空格/标点后用 `-` 连接，如 `core-functions`、`module-operation-api`、`debugdoctools`） |
| `VI Description(zh-cn) - Addon <Name>.md`<br>（如 `VI Description(zh-cn) - Addon Massdata.md`） | `docs/reference/` | `api-addon-<slug>.md`（slug 由 `<Name>` 小写化得到，如 `api-string`、`ini-variable`、`massdata`） |
| `<Name>(zh-cn).md`（位于任意 `Examples/` 下）<br>（如 `CSM Basic Example(zh-cn).md`） | `docs/examples/` | `example-<slug>.md`（slug 由 `<Name>` 小写化、空格转 `-`） |

**反向查找**：拿到一个 `docs/reference/api-XX-yyy.md` 时，反推源文件名为 `VI Description(zh-cn) - XX. <Title>.md`（`<Title>` 由 `yyy` 还原），用 `find .ref -name 'VI Description(zh-cn) - XX*.md' -not -path '*/_internal/*'` 在 `.ref/` 中定位。

### 例外/约定

- 若同一文件名在多个仓库子目录中同时存在（多份副本），优先使用 `.ref/Communicable-State-Machine/**` 下的版本作为权威源；Addon 文件优先取自对应的 Addon 仓库目录（即包含 `Addon` 关键字的同步目录）。
- 现有目标文件清单可以通过 `ls docs/reference/api-*.md docs/examples/example-*.md` 查看；新增文件按上述命名规则创建。
- 章节号 `11` 在源端是 `Obselete VIs`，**不**同步到 `docs/`。

## 执行流程

1. **定位文件**：根据上述"路径规则"，按文件名形态推导目标路径，并使用 `find .ref -name '<filename>' -not -path '*/_internal/*'` 在 `.ref/` 下定位源文件。如果命中多个，按"例外/约定"挑选权威版本；如果源文件位于任意 `_internal/` 子目录，则立即停止，不进行同步。

2. **读取源文件**（注意编码处理）：
   - 部分 `.ref/` 文件（尤其是 `VI Description(zh-cn) - 12. Debug,Doc,Tools.md`）使用 GBK 编码。
   - 按以下顺序尝试解码：`gbk` → `gb2312` → `gb18030` → `utf-8` → `latin-1`。

3. **对比内容**：将源文件与目标文件现有内容对比，识别缺失或过时的内容。

4. **移除 NOTE/WARNING 块**：从源文件内容中移除所有 `> [!NOTE]` / `> [!WARNING]` 块（这些块来自 `VI Description(zh-cn).md`，由其他文件引用，不直接复制）。

5. **展开 Ref 引用**：将所有 `> - Ref: <标题>` 行替换为对应标题的 NOTE/WARNING 块实际内容。
   - **重要**：`> - Ref:` 行必须被完全展开，不能保留在最终的 `docs/` 文件中。
   - 从 `.ref/**/VI Description(zh-cn).md`（CSM 框架的总目录文件，包含全部 NOTE/WARNING 块）和当前正在同步的源文件中查找标题匹配的 NOTE/WARNING 块。用 `find .ref -name 'VI Description(zh-cn).md' -not -path '*/_internal/*'` 定位。
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
