---
name: collect-discussion-faq
description: '从 GitHub Discussions Q&A 分类中收集已解答的问题，并将其整理后添加到对应 FAQ 子页面（docs/faq/*.md）。适用于定期将社区讨论中的高质量问答沉淀为 Wiki FAQ 条目。'
argument-hint: 'Discussion 编号、Discussion URL，或直接输入"收集最近已解答的 Discussion"'
user-invocable: true
---

# 收集 Discussion Q&A 到 FAQ（collect-discussion-faq）

## 触发条件

- 用户发送 `收集最近已解答的 Discussion` 时触发（批量模式）。
- 用户发送 `收集 Discussion #<编号>` 时触发（单条模式）。
- 定时工作流（`.github/workflows/collect-discussion-faq.yml`）自动创建 Issue 后，Issue 被分配给 AI 助手时触发。

## 本技能产出

- 从指定的 GitHub Discussion（或批量已解答 Discussion）中提取 Q&A 内容。
- 在对应 FAQ 子页面（`docs/faq/*.md`）中新增或合并对应的常见问题解答条目。
- 将处理结果记录到 `.github/processed-discussions.txt`，避免重复处理。

## 执行流程

### 模式一：处理单条 Discussion

1. **获取 Discussion 内容**：通过 GitHub GraphQL API 获取指定 Discussion 的标题、正文及已接受的答案（Discussions 与 Issues 是不同的 API 资源，需使用 GraphQL `discussion(number: N)` 查询，而非 Issue API）。

2. **提取 Q&A**：
   - 问题：Discussion 标题 + 正文（简化后）。
   - 解答：优先使用"已接受答案"（`isAnswered` 为 true 对应的评论），其次使用 `@nevstop` 的回复，最后综合其他高赞回复。

3. **更新 FAQ 文件**：调用 `add-faq` 技能的逻辑（见 `.github/skills/add-faq/SKILL.md`），将提取的 Q&A 写入对应 FAQ 子页面（`docs/faq/*.md`）。

4. **记录已处理**：在 `.github/processed-discussions.txt` 追加该 Discussion 的 node ID（每行一个），防止后续重复收录。

### 模式二：批量处理未记录的已解答 Discussion

1. **读取追踪文件**：读取 `.github/processed-discussions.txt`，获取已处理的 Discussion node ID 集合。

2. **查询已解答 Discussion**：通过 GraphQL 查询 NEVSTOP-LAB 组织下 Q&A 分类中 `isAnswered: true` 的 Discussion 列表（最多最近 50 条）：

   ```graphql
   query {
     organization(login: "NEVSTOP-LAB") {
       discussions(first: 50, categorySlug: "q-a") {
         nodes {
           id
           number
           title
           body
           url
           isAnswered
           answer {
             body
             author { login }
           }
           createdAt
         }
       }
     }
   }
   ```

3. **过滤未处理的 Discussion**：排除已在追踪文件中的条目。

4. **逐条处理**：对每条未处理的已解答 Discussion，执行模式一的步骤 2-4。

5. **提交更新**：确认对应 FAQ 子页面（`docs/faq/*.md`）和 `.github/processed-discussions.txt` 均已更新。

## FAQ 文件格式规范

与 `add-faq` 技能保持一致：

```markdown
### :question: 问题标题

解答正文内容。

📓 参考链接：[Discussion 原帖](<Discussion URL>)，[相关文档]({% link docs/xxx/yyy.md %})
```

## 问题分类判断

将问题归入以下分类之一（对应 FAQ 子页面）：
- 快速上手（`docs/faq/quick-start.md`）
- 消息通信（`docs/faq/messaging.md`）
- 数据传递（`docs/faq/data-transfer.md`）
- 高级模式（`docs/faq/advanced-patterns.md`）
- 调试排查（`docs/faq/debugging.md`）
- 框架选型（`docs/faq/framework-selection.md`）

## 注意事项

- 若 Discussion 正文或解答内容过长，应精简后写入 FAQ，保持 FAQ 条目简洁易读。
- 若 FAQ 中已有与该 Discussion 相似的问题，合并内容而非重复添加，并更新参考链接。
- 处理过的 Discussion node ID **必须**写入 `.github/processed-discussions.txt`，格式为每行一个 ID。
- 只修改 FAQ 子页面（`docs/faq/*.md`）和 `.github/processed-discussions.txt`，不修改其他文件。

## 完成检查清单

- [ ] 已获取目标 Discussion 的标题、正文和已接受答案。
- [ ] 已判断问题分类并定位对应 FAQ 子页面（`docs/faq/*.md`）。
- [ ] FAQ 中无重复问题（相似问题已合并）。
- [ ] 已按 `### :question: 问题标题` 格式写入对应 FAQ 子页面。
- [ ] 已将 Discussion node ID 追加到 `.github/processed-discussions.txt`。
- [ ] 只修改了 FAQ 子页面（`docs/faq/*.md`）和 `.github/processed-discussions.txt`，无其他文件改动。
