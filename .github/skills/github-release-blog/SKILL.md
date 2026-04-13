---
name: github-release-blog
description: '根据 GitHub Release 自动生成发布博客。适用于发布公告、版本回顾、变更总结、可直接发布的 Markdown 初稿。支持按指定 tag 校验、与上个版本对比、汇总区间内 release/PR/commit。'
argument-hint: '仓库名或仓库组、目标 tag、输出路径、受众'
user-invocable: true
---

# GitHub 发布博客生成

## 本技能产出
- 基于用户指定 tag 的可发布 Markdown 博客初稿。
- 基于目标版本与上一个版本的差异分析总结。
- 包含来源可追溯检查的发布材料（release/PR/commit）。
- 按仓库分组的发布内容，每个仓库独立展示变更结论。

## 适用场景
- 用户要求根据 GitHub Release 生成发布博客。
- 用户要求把 release notes 改写成用户可读的版本说明。
- 用户要求按变更类型输出亮点、修复、破坏性变更和升级指引。

## 默认仓库范围（CSM 相关）
默认分析以下仓库（除非用户明确缩小范围）：
- `NEVSTOP-LAB/Communicable-State-Machine`
- `NEVSTOP-LAB/CSM-MassData-Parameter-Support`
- `NEVSTOP-LAB/CSM-API-String-Arugments-Support`
- `NEVSTOP-LAB/CSM-INI-Static-Variable-Support`
- `NEVSTOP-LAB/CSM-Icon-Editor-Glyphs`
- `NEVSTOP-LAB/CSM-Mermaid-Plugin`
- `NEVSTOP-LAB/CSM-Continuous-Meausrement-and-Logging`
- `NEVSTOP-LAB/CSM-TCP-Router-App`

说明：`NEVSTOP-LAB/CSM-Wiki` 默认仅作为文档承载仓库，不作为发布变更分析源；仅在用户明确要求时纳入统计。

## 需确认输入
- 目标仓库：单仓库还是“CSM 仓库组”。
- 目标 tag：必填。
- 受众：终端用户、开发者或混合受众。
- 输出路径：默认为 `docs/release/<tag> - <short-title>.md`（示例：`docs/release/2026Q1 - 核心优化与插件增强.md`）。
- 语言与语气：默认中文、技术说明风格。
- 开头模板：默认使用用户提供的固定开场段与资源链接区。

## 固定开场模板（默认）
生成正文前，先输出以下开场结构（可替换月份与版本信息）：

```markdown
2025 年 7 月的 CSM 更新已经推送到 VIPM。Communicable State Machine Framework - Package List. 如果你觉得 CSM 对你有帮助，请在 GitHub/Gitee 上 star 对应的仓库！也欢迎有经验的 LabVIEW 高手参与到 CSM 的开发中来。

GitHub: HTTPS://GitHub.com/NEVSTOP-LAB
gitee: HTTPS://gitee.com/NEVSTOP-LAB
vipm: Communicable State Machine Framework - Package List
VIPM 打包好的 Release Package(VIPC)合集：(包含全部 Addon+Examples, 可以离线安装) 链接: HTTPS://pan.baidu.com/s/10fsnFmJpn-P_HLbpH9IFLg 提取码: CSMF
```

要求：
- 开头段落结构保持一致，月份、版本范围、链接可按当期发布更新。
- 不删除 GitHub/Gitee/VIPM/VIPC 四段资源入口。
- 语气保持“社区发布公告 + 邀请反馈”。
- 在 H1 主标题后添加“精简公告”引用块（blockquote，使用 `>` 开头），用于社群快速转发。
- 资源入口必须使用 Markdown 列表格式（`- `），且 GitHub/gitee/vipm/VIPC 均需为可点击链接。

## 执行流程
1. 逐仓库校验目标 tag 是否存在。
若某个仓库不存在该 tag，不报错，直接标记为“本期无该版本发布”并跳过该仓库后续分析。
若全部仓库都不存在该 tag，再提示用户确认 tag 或仓库范围。

2. 确定上一个发布基线。
优先按发布时间定位上一个 release；如顺序存在歧义，使用语义化版本号做兜底。

3. 收集对比区间原始数据。
围绕“上一个 release -> 目标 tag”区间，收集以下原始记录：
- 区间内 release
- 区间内已合并 PR
- 区间内 commit
这些记录是后续整理的唯一事实来源。

4. 分类整理变更。
按以下结构整理：亮点、功能新增、改进优化、问题修复、破坏性变更、迁移说明、已知问题。
并按优先级输出：
- 高优先级：功能行为变化、接口变化、性能或稳定性变化。
- 低优先级：文档、图标、示例、格式化和杂项维护（简短一句带过）。

补充写作粒度：
- 对 feature/update/fix 类功能变更，给出“背景 -> 变化 -> 用户收益/影响 -> 简短示例”。
- 对 doc/ico 等非功能改动，只在仓库小节末尾用一句话汇总即可。

5. 应用写作规则。
- 以用户价值为导向重写，避免直接堆砌 commit 列表。
- 版本号、日期、仓库名必须准确。
- 保留关键技术名词、API 名称、VI 名称。
- 为关键结论补充来源链接（release、PR、commit）。
- 版式和语气仿照历史发布文章的组织方式，但不得逐字复制外部文章内容。
- 控制目录层级，避免过多二级菜单：保留“按仓库变更”和“按功能变更”两大总结入口。

6. 生成 Markdown 草稿。
默认写入 `docs/release/<tag> - <short-title>.md`（用户可覆盖）：

```markdown
---
title: 版本发布 vX.Y.Z
date: YYYY-MM-DD
---

# <tag>: <short-title>

> 【精简公告】一句话概括本期最重要更新与升级建议，便于复制转发。

开场：
本期发布说明延续历史文章的开场结构与语气，先总览范围，再按仓库分项说明。

资源入口：
GitHub / gitee / VIPM / VIPC（保持四项齐全）

- GitHub: [https://github.com/NEVSTOP-LAB](https://github.com/NEVSTOP-LAB)
- gitee: [https://gitee.com/NEVSTOP-LAB](https://gitee.com/NEVSTOP-LAB)
- vipm: [Communicable State Machine Framework - Package List](https://www.vipm.io/)
- VIPM 打包好的 Release Package(VIPC) 合集链接（含提取码）

## 版本亮点

## 按仓库变更

### 1. _Communicable-State-Machine_
#### 功能改动（重点）
建议格式：
- [important][feature] 标题 #Issue #PR
- 背景与问题
- 具体机制变化
- 典型应用场景
#### 文档与图标（简述）

### 2. _CSM-MassData-Parameter-Support_
#### 功能改动（重点）
#### 文档与图标（简述）

### 6. _其他仓库_
若仓库不存在目标 tag：标注“本期无该版本发布，已忽略”。

## 按功能变更

### 1. _功能新增_

### 2. _改进优化_

### 3. _问题修复_

## 破坏性变更

## 升级指引

## 完整变更来源
- GitHub Release：<url>
- 关键 PR：<url 或列表>
- 关键 Commit：<url 或列表>

## 结尾
欢迎大家使用并提出反馈！
```

命名与标题规则：
- 文件名格式：`<tag> - <short-title>.md`
- 文内 H1 格式：`<tag>: <short-title>`
- `<short-title>` 应为从本期变更中推断出的中文精简标题，避免过长。

7. 发布前质量校验。
- 不得包含无来源结论。
- 关键条目必须可追溯到 release/PR/commit。
- 破坏性变更必须明确影响范围和处理建议。
- 文稿应达到“可直接发布”质量。
- 文首必须包含精简公告引用块（blockquote）。
- 正文（包括“按仓库变更”与“按功能变更”）中出现的 Issue/PR 编号必须全部为可点击链接，不可只保留纯文本编号。
- 不单独创建“### Compare”与“### 关键 Issue/PR”子节，避免目录层级膨胀。
- 结构必须包含且仅包含两个总结入口：`## 按仓库变更` 与 `## 按功能变更`。
- “按仓库变更”与“按功能变更”的下一级标题必须使用“数字编号 + 下划线标题”格式（如 `1. _标题_`、`2. _标题_`）。
- 资源入口四项必须是列表格式，且每项都有可点击链接（尤其是 VIPM 项）。

## 决策点
- 上一个版本定位策略：
优先发布时间，语义化版本号兜底。

- 内容深度：
面向普通用户时强调影响与收益；面向开发者时增加技术细节与变更背景。

- 迁移信息缺失：
若存在破坏性变更但迁移步骤不完整，必须添加 TODO 并向用户确认后再最终发布。

## 完成检查清单
- 目标 tag 已校验存在。
- 上一个 release 基线已确认。
- 区间 release/PR/commit 数据已收集。
- 关键结论均附来源链接。
- 破坏性变更与升级建议已处理。
- Markdown 风格符合目标仓库规范。
- 输出文件已写入 `docs/release/<tag> - <short-title>.md` 或用户指定路径。
- 未命中 tag 的仓库已忽略且不作为错误处理。
- 功能改动描述详尽，文档/图标改动保持简述。
- 文中所有 Issue/PR 编号均为可点击链接。
- 无 `### Compare` 与 `### 关键 Issue/PR` 子节。
