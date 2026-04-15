---
name: add-vi-links
description: '为 docs/ 目录下的 Markdown 文件中出现的 VI 名称（如 `Xxx.vi`）添加 Jekyll 超链接，链接到 docs/reference/ 对应 API 章节。适用于新建文档或新增 VI 名称后的补全工作。'
argument-hint: 'docs/ 文件路径，如 "docs/basic/communication.md"'
user-invocable: true
---

# 添加 VI 超链接（add-vi-links）

## 触发方式

```
为 <docs文件路径> 添加VI超链接
```

示例：

```
为 docs/basic/communication.md 添加VI超链接
```

## 本技能产出

- 扫描指定 `docs/` 文件中所有未链接的 VI 名称。
- 为每个 VI 名称添加 Jekyll 链接语法，链接到 `docs/reference/` 对应 API 文档的章节锚点。
- 不修改其他内容，保持文件格式不变。

## VI 超链接格式

使用 Jekyll 链接语法：

```markdown
[`Parse State Queue++.vi`]({% link docs/reference/api-02-core-functions.md %}#parse-state-queuevi)
```

## 执行流程

1. **读取文件**：读取指定的 `docs/` 文件内容。

2. **扫描 VI 名称**：识别所有形如 `` `Xxx.vi` `` 的 VI 名称，排除以下情况：
   - 标题行（以 `#` 开头的行）中的 VI 名称。
   - 已有链接的 VI 名称（已被 `[...]()` 包裹的）。

3. **确定链接目标**：在 `docs/reference/` 各 API 文档中查找该 VI 对应的章节，确定目标文件和锚点。
   - 章节锚点由 kramdown 的 `auto_ids` 自动生成（标题转小写、特殊字符处理）。
   - 例如：`CSM - Send Data.vi` 的章节标题为 `## CSM - Send Data.vi`，锚点为 `#csm---send-datavi`。

4. **从最长名称开始替换**：先处理最长的 VI 名称，避免短名称误匹配长名称中的子串。

5. **添加链接**：将未链接的 VI 名称替换为带 Jekyll 链接语法的版本。

6. **提交更改**：保存文件并提交。

## 注意事项

- **不要链接标题行**：以 `#` 开头行中的 VI 名称不添加链接。
- **不重复链接**：已有链接的 VI 名称不再添加链接。
- **最长匹配优先**：从最长的 VI 名称开始处理，防止部分匹配错误（如先处理 `CSM - Send Data Async.vi` 再处理 `CSM - Send Data.vi`）。
- **图片路径规范**：不要使用 `{{ site.baseurl }}/assets/img/` Liquid 语法引用图片（仅在 Jekyll 构建时生效，GitHub Markdown 渲染时不可用）。

## 完成检查清单

- [ ] 文件中所有未链接的 VI 名称已找到。
- [ ] 每个 VI 名称已确认对应的目标 API 文档和锚点。
- [ ] 标题行中的 VI 名称已跳过。
- [ ] 已有链接的 VI 名称未被重复处理。
- [ ] 从最长名称开始匹配，无部分匹配错误。
- [ ] 文件内容除链接外无其他改动。
