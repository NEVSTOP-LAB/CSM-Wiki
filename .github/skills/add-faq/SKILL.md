---
name: add-faq
description: '根据 GitHub Issue 内容，向 FAQ 子页面（docs/faq/*.md）添加常见问题解答。适用于 Issue 被分配给 AI 助手且判断属于常见问题类型时。'
argument-hint: 'Issue 编号或 Issue 内容描述'
user-invocable: true
---

# 添加常见问题解答（add-faq）

## 触发条件

- Issue 被分配给 AI 助手后，判断该 Issue 属于常见问题记录类型时触发。
- 用户明确要求将某个问题记录到 FAQ 时触发。

## 本技能产出

- 在对应 FAQ 子页面（`docs/faq/*.md`）中新增或合并一条常见问题解答。
- 保持 FAQ 父子页结构和已有分类不变。

## 执行流程

1. **读取 Issue 内容**：获取 Issue 标题、正文及所有评论，判断是否属于常见问题。

2. **确定解答内容**：
   - **有评论**：优先使用 @nevstop 回复的内容作为解答核心，再用 Wiki 相关内容补充。
   - **无评论**：直接根据 Wiki（`docs/` 目录）内容撰写解答。

3. **读取 FAQ 文件**：读取 `docs/faq/*.md`，查找是否有与当前 Issue 相似的问题：
    - **有相似问题**：合并问题描述和解答内容（取两者的并集，避免重复）。
    - **无相似问题**：根据问题内容判断归入哪个子页面，在对应子页面下追加新问题。

4. **确定问题分类**（对应 FAQ 子页面）：
   - 快速上手（`docs/faq/quick-start.md`）
   - 消息通信（`docs/faq/messaging.md`）
   - 数据传递（`docs/faq/data-transfer.md`）
   - 高级模式（`docs/faq/advanced-patterns.md`）
   - 调试排查（`docs/faq/debugging.md`）
   - 框架选型（`docs/faq/framework-selection.md`）

5. **写入 FAQ 子页面**：按照已有格式添加新问题，格式如下：

   ```markdown
   ### :question: 问题标题

   解答正文内容。

   📓 参考链接：[相关文档]({% link docs/xxx/yyy.md %})
   ```

6. **修改范围限制**：仅修改 FAQ 相关文件（`docs/faq/*.md`，必要时更新 `docs/faq(zh-cn).md` 索引页），不修改无关内容。

## FAQ 文件格式规范

- 问题标题使用 `### :question: 问题标题` 格式。
- 正文使用普通 Markdown，可包含代码块、列表等。
- 末尾附 📓 参考链接，指向相关 Wiki 文档。
- 保持各问题之间的间距与已有条目一致。

## 完成检查清单

- [ ] Issue 内容已读取，确认属于常见问题类型。
- [ ] 解答内容已确定（基于 @nevstop 评论或 Wiki 内容）。
- [ ] `docs/faq/*.md` 已读取，确认无重复问题。
- [ ] 新问题已归入正确分类。
- [ ] 格式符合 `### :question: 问题标题` + 正文 + 📓 参考链接规范。
- [ ] 仅修改了 FAQ 相关文件，且未改动无关内容。
