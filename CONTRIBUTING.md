# 如何为 CSM-Wiki 贡献内容

本 Wiki 使用 [Just the Docs](https://just-the-docs.com/) 主题构建。以下是为本项目添加或修改内容的完整指南。

---

## 添加新的文档页面

1. **选择合适的目录**
   - 基础教程 → `docs/basic/`
   - API 参考 → `docs/reference/`
   - 插件说明 → `docs/plugins/`
   - 示例应用 → `docs/examples/`

2. **创建 Markdown 文件**，包含以下前置信息（front matter）：

   ```yaml
   ---
   title: 页面标题
   layout: default
   parent: 基础文档  # 父页面的标题
   nav_order: 7      # 在父页面下的显示顺序
   ---
   ```

3. **编写内容**
   - 使用标准 Markdown 语法编写内容
   - Just the Docs 使用 Kramdown 的 `{:toc}` 方法生成页内目录

## 添加页内目录 (Table of Contents)

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

## 添加顶级页面

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

## 添加新的文档分类

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

## 本地预览

```bash
bundle install
bundle exec jekyll serve
```

访问 `http://localhost:4000/CSM-Wiki/` 预览效果。

更多详情请参考 [Just the Docs 文档](https://just-the-docs.com/) 或查看 [`.process/history/theme-migration.md`](.process/history/theme-migration.md)。

---

## AI 助手技能指南

本仓库配置了 GitHub Copilot 自定义指令（`.github/copilot-instructions.md`），其中定义了可重复执行的标准化任务（"技能"）。向 AI 助手发送以下提示词即可触发对应技能：

| 技能 | 触发提示词示例 | 说明 |
|------|-----------|------|
| **同步参考文档** | `同步参考文档：VI Description(zh-cn) - 02. Core Functions.md` | 将 `.ref/` 中的源文件更新同步到 `docs/` 对应文件，包含格式转换和内容合并 |
| **添加VI超链接** | `为 docs/basic/communication.md 添加VI超链接` | 为指定文档中所有未链接的 VI 名称添加 Jekyll 超链接 |
| **添加常见问题解答** | Issue 被分配给 AI 且判断为 FAQ 类型时自动触发 | 从 Issue 及 Wiki 中提取解答，合并同类问题后更新对应 FAQ 子页面（`docs/faq/*.md`） |
| **收集 Discussion Q&A** | `收集最近已解答的 Discussion` 或 `收集 Discussion #123` | 从 GitHub Discussions Q&A 分类中获取已解答问题，整理后添加到对应 FAQ 子页面（`docs/faq/*.md`） |

> 每次修改 `docs/` 文件后，AI 会**自动**检查 callout 格式并在需要时更新项目进度，无需手动触发。详见 `.github/copilot-instructions.md`。
