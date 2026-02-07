# Theme Migration - 主题迁移记录

**日期**: 2026-02-07  
**分支**: copilot/replace-theme-with-just-the-docs  
**状态**: ✅ 完成

## 迁移概述

将 CSM-Wiki 从 `sighingnow/jekyll-gitbook` 主题迁移到 `just-the-docs/just-the-docs` 主题。

## 主要变更

### 1. 主题配置 (2026-02-07)
- ✅ 更新 Gemfile：使用 just-the-docs gem (~> 0.8.0)
- ✅ 重写 _config.yml：配置 just-the-docs 功能
  - 启用搜索功能
  - 配置层级导航
  - 设置页脚和辅助链接
  - 启用返回顶部按钮

### 2. 内容重组 (2026-02-07)
- ✅ 创建 docs/ 目录结构
  - **基础文档** (docs/basic/) - 6个文档
  - **参考文档** (docs/reference/) - 2个文档
  - **插件系统** (docs/plugins/) - 5个文档
  - **示例应用** (docs/examples/) - 1个文档
- ✅ 从 _posts/zh-cn 迁移14个核心文档到 docs/
- ✅ 更新4个 _pages 文件

### 3. 模板清理 (2026-02-07)
- ✅ 删除自定义 layouts (4个文件)
- ✅ 删除自定义 includes (18个文件)
- ✅ 使用 just-the-docs 内置布局

### 4. 链接更新 (2026-02-07)
- ✅ 修复30+个内部链接
- ✅ 从日期格式 URL 改为路径格式
- ✅ 更新跨文档引用

### 5. TOC 优化 (2026-02-07)
- ✅ 移除所有文档中的手动目录
- ✅ 使用 just-the-docs 自动生成的右侧浮动目录
- ✅ 改进用户体验，内容直接可见

### 6. 文件归档 (2026-02-07)
- ✅ 将旧的 _posts 目录移动到 _archive/posts
- ✅ 在 _config.yml 中排除 _archive 目录
- ✅ 保留历史文件但不参与构建

## 文件统计

- **修改**: 11个文件 (配置、页面、README)
- **删除**: 24个文件 (自定义布局/包含文件)
- **创建**: 18个文件 (docs 结构)
- **归档**: 71个文件 (旧 _posts 文件)
- **总计**: 约50个活跃文件变更

## 新主题优势

1. 🔍 **更好的搜索** - 内置强大搜索功能
2. 📱 **移动响应** - 改进的移动端体验
3. 🎨 **现代设计** - 清晰、专业的文档外观
4. 🚀 **更好的性能** - 更快的页面加载
5. ♿ **可访问性** - 内置辅助功能
6. 🔧 **活跃维护** - 社区支持和持续更新
7. 📑 **自动目录** - 右侧浮动目录，不占用内容空间

## 新站点结构

```
Home (/) → 下载 → FAQ → 项目参与 → 框架比较
└── docs/
    ├── basic/ (基础文档, 6个文档)
    │   ├── JKI State Machine
    │   ├── 基本概念
    │   ├── 模块间通讯
    │   ├── 创建CSM模块
    │   ├── 高级模式与特性
    │   └── 全局日志系统
    ├── reference/ (参考文档, 2个文档)
    │   ├── CSM 函数面板
    │   └── CSM 模板
    ├── plugins/ (插件系统, 5个文档)
    │   ├── 插件系统概述
    │   ├── 调试工具
    │   ├── API String参数支持
    │   ├── MassData参数支持
    │   └── INI/静态参数支持
    └── examples/ (示例应用, 1个文档)
        └── 连续测量与记录项目
```

## 归档内容

原 `_posts/` 目录已移至 `_archive/posts/`，包含：
- 14个 zh-cn 主题文档（已迁移到 docs/）
- VI Description 子目录（约30个文件）
- _origin 目录（英文草稿和备份）

这些文件不会在新站点中构建，但保留作为历史参考。

## 添加新内容指南

### 添加新文档页面

1. **确定页面位置**
   - 基础教程 → `docs/basic/`
   - API参考 → `docs/reference/`
   - 插件说明 → `docs/plugins/`
   - 示例应用 → `docs/examples/`

2. **创建 Markdown 文件**
   ```markdown
   ---
   title: 页面标题
   layout: default
   parent: 基础文档  # 或其他父页面
   nav_order: 7      # 在父页面下的顺序
   ---

   ## 第一个标题

   内容开始...
   ```

3. **注意事项**
   - 使用 `layout: default`
   - 设置正确的 `parent` 对应父页面标题
   - `nav_order` 决定显示顺序
   - 不需要手动添加目录，just-the-docs 会自动生成

### 添加顶级页面

如果要添加像"FAQ"这样的顶级页面：

```markdown
---
title: 新页面标题
layout: default
nav_order: 13     # 在主导航中的位置
permalink: /new-page
has_children: false
---

内容开始...
```

### 添加新的文档分类

如果要添加新的主分类（如"高级主题"）：

1. 创建父页面 `docs/advanced.md`：
   ```markdown
   ---
   title: 高级主题
   layout: default
   nav_order: 60
   has_children: true
   permalink: /docs/advanced
   ---

   # 高级主题

   描述这个分类的内容。
   ```

2. 在 `docs/advanced/` 目录下创建子页面

## 提交记录

1. `e6c9f3c` - 初始配置和内容迁移
2. `070677f` - 移除自定义布局和引用
3. `c2ae868` - 修复重复标题
4. `14705c1` - 修复内部链接
5. `556e5c5` - 添加迁移总结文档
6. `e6f8414` - 更新 Jekyll 依赖版本

## 参考资源

- [Just the Docs 官网](https://just-the-docs.com/)
- [Just the Docs GitHub](https://github.com/just-the-docs/just-the-docs)
- [MIGRATION_SUMMARY.md](../MIGRATION_SUMMARY.md) - 详细迁移说明

---

**更新时间**: 2026-02-07  
**维护者**: AI助手  
**迁移状态**: ✅ 已完成
