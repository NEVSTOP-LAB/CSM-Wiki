# 右侧浮动目录 (TOC) 实现说明

## 概述

本文档说明如何为 Just the Docs 主题实现右侧浮动目录功能。

## 实现方式

### 1. 自定义布局 (_layouts/default.html)

覆盖主题的默认布局，添加了 TOC 容器：

```html
<div class="page-wrapper">
  <div class="main-content-container">
    <!-- 主内容 -->
  </div>
  <div class="page-toc-container">
    <!-- TOC -->
  </div>
</div>
```

### 2. TOC 模板 (_includes/toc.html)

提供 TOC 的 HTML 结构：

```html
<nav class="toc" id="toc">
  <div class="toc-header">
    <h4>目录 (Table of Contents)</h4>
  </div>
  <ul class="toc-list" id="toc-list">
    <!-- JavaScript 动态生成 -->
  </ul>
</nav>
```

### 3. CSS 样式 (assets/css/custom.scss)

关键样式：

- **Flexbox 布局**：主内容和 TOC 并排显示
- **Sticky 定位**：TOC 在滚动时保持可见
- **响应式设计**：小屏幕自动隐藏 TOC
- **视觉样式**：背景色、边框、悬停效果、激活状态

```scss
.page-wrapper {
  display: flex;
}

.page-toc-container {
  position: sticky;
  top: 4rem;
  width: 260px;
}

@media (max-width: 66.5rem) {
  .page-toc-container {
    display: none;
  }
}
```

### 4. JavaScript 功能 (assets/js/toc.js)

自动生成和管理 TOC：

1. **自动生成**：从页面中的 h2/h3/h4 标题生成 TOC
2. **Scroll Spy**：使用 IntersectionObserver 监听滚动，高亮当前章节
3. **平滑滚动**：点击 TOC 链接平滑跳转到对应位置
4. **智能隐藏**：无标题时自动隐藏 TOC

### 5. 资源加载 (_includes/head_custom.html)

在页面头部加载自定义 CSS 和 JS：

```html
<link rel="stylesheet" href="{{ '/assets/css/custom.css' | relative_url }}">
<script src="{{ '/assets/js/toc.js' | relative_url }}" defer></script>
```

## 功能特性

### 桌面端体验

- ✅ 右侧固定显示，宽度 260px
- ✅ 滚动时保持可见（sticky）
- ✅ 当前章节紫色高亮
- ✅ 悬停时显示背景色
- ✅ 支持多级标题嵌套

### 移动端体验

- ✅ 小于 66.5rem (1064px) 时自动隐藏
- ✅ 保持主内容全宽显示
- ✅ 不影响移动端阅读体验

### 交互体验

- ✅ 点击 TOC 链接平滑滚动
- ✅ 滚动时自动高亮当前章节
- ✅ 自定义滚动条样式
- ✅ 流畅的过渡动画

### 技术特性

- ✅ 纯 JavaScript 实现，无依赖
- ✅ IntersectionObserver API，性能优化
- ✅ 自动生成，无需手动维护
- ✅ 与 just-the-docs 主题无缝集成

## 使用方法

### 文档页面

所有使用 `layout: default` 的页面都会自动显示 TOC。

确保页面有标题结构：

```markdown
---
title: 页面标题
layout: default
---

## 第一章节

内容...

### 子章节

内容...

## 第二章节

内容...
```

### 自定义设置

如果某个页面不需要 TOC，可以在 CSS 中添加：

```css
.no-toc .page-toc-container {
  display: none;
}
```

然后在页面的 front matter 中添加自定义类：

```yaml
---
title: 页面标题
layout: default
custom_class: no-toc
---
```

## 技术细节

### 浏览器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- IE11: ⚠️ 部分支持（IntersectionObserver 需要 polyfill）

### 性能考虑

- 使用 IntersectionObserver API，避免频繁的滚动事件监听
- JavaScript 使用 `defer` 加载，不阻塞页面渲染
- CSS 使用硬件加速的属性（transform, opacity）

### 可访问性

- TOC 使用语义化的 `<nav>` 标签
- 所有链接可通过键盘访问
- 支持屏幕阅读器

## 文件说明

| 文件 | 用途 | 说明 |
|------|------|------|
| `_layouts/default.html` | 布局模板 | 覆盖主题默认布局，添加 TOC 容器 |
| `_includes/toc.html` | TOC 模板 | TOC 的 HTML 结构 |
| `_includes/head_custom.html` | 资源加载 | 加载自定义 CSS 和 JS |
| `assets/css/custom.scss` | 样式文件 | TOC 和布局的所有样式 |
| `assets/js/toc.js` | JavaScript | TOC 生成和交互功能 |

## 维护说明

### 修改 TOC 样式

编辑 `assets/css/custom.scss`：

```scss
.toc {
  background-color: #f5f6fa;  /* 背景色 */
  border: 1px solid #eeebee;  /* 边框 */
  border-radius: 6px;         /* 圆角 */
}

.toc-list a.active {
  color: #7253ed;             /* 激活颜色 */
}
```

### 修改 TOC 宽度

编辑 `assets/css/custom.scss`：

```scss
.page-toc-container {
  width: 260px;  /* 修改这里 */
}
```

### 修改响应式断点

编辑 `assets/css/custom.scss`：

```scss
@media (max-width: 66.5rem) {  /* 修改这里 */
  .page-toc-container {
    display: none;
  }
}
```

### 修改标题层级

编辑 `assets/js/toc.js`：

```javascript
// 当前支持 h2, h3, h4
const headings = mainContent.querySelectorAll('h2, h3, h4');

// 如果只想要 h2 和 h3
const headings = mainContent.querySelectorAll('h2, h3');
```

## 故障排查

### TOC 不显示

1. 检查页面是否有 h2/h3/h4 标题
2. 检查浏览器控制台是否有 JavaScript 错误
3. 确认 `assets/js/toc.js` 已正确加载

### TOC 样式异常

1. 清除浏览器缓存
2. 确认 `assets/css/custom.css` 已正确生成
3. 检查是否有其他 CSS 冲突

### 响应式不工作

1. 检查视口宽度
2. 确认媒体查询语法正确
3. 测试不同设备

## 总结

通过自定义 CSS/JS 和布局文件，成功为 Just the Docs 主题实现了右侧浮动 TOC 功能。该实现：

- ✅ 不破坏主题原有功能
- ✅ 完全响应式设计
- ✅ 性能优化
- ✅ 易于维护和自定义

---

**更新时间**: 2026-02-07  
**实现者**: AI助手
