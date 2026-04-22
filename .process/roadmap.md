# CSM-Wiki 路线图

本文件记录 CSM-Wiki 的内容规划与完成进度。详细的历史进度记录请参阅 [`.process/history/documentation-progress.md`](.process/history/documentation-progress.md)。

---

## 网站页面

负责人：[@nevstop](https://github.com/nevstop)

- [x] **HOME 页面** — 100%
  - CSM框架的介绍；特点；应用场景；下载链接；开源资源使用说明
- [x] **404 页面** — 100%
- [x] **下载页面** — 100%
  - 最新版本链接；历史版本更新记录
- [x] **FAQ 页面** — 100%
  - 常见问题解答
- [ ] **Contributors 页面** — 待完成
  - 如何参与项目；贡献者列表
- [ ] **框架对比页面** — 50%
  - 自身特点；与 JKISM 的比较；与 DQMH / SMO / AFW 等框架的比较

---

## 基础文档

负责人：[@KivenJia](https://github.com/KivenJia)

- [x] **JKISM 的介绍** — 95%
  - JKISM 概念与用法；优势；不足；应用场景
- [x] **JKISM 的推荐用法** — 95%
  - JKISM 最佳实践
- [x] **CSM 的基本概念** — 100%
  - CSM 全部基本概念说明
- [x] **CSM 模块间的通讯** — 90%
  - 同步消息；异步消息；状态
- [x] **创建 CSM 的复用模块** — 95%
  - 复用模块创建方法
- [x] **调用 CSM 的模块** — 95%
  - 被 CSM 框架调用；被其他框架调用
- [x] **CSM 的参数传递** — 95%
  - 参数传递特殊性；各场景推荐方式

---

## 进阶文档

- [x] **CSM 高级模式与特性** — 95%
  - 内置错误处理；系统级模块；子模块；工作者模式；责任链模式；多循环模式
- [x] **CSM 全局日志系统** — 100%
  - 全局日志功能；API 详解；过滤机制；应用场景；最佳实践

---

## 插件与 Addon

- [x] **Addon 接口** — 95%
  - Addon 接入点；添加 Addon 的方法；内置 Addon 详解
- [x] **Template 接口** — 95%
  - Template 接入点；添加 Template 的方法；模板开发指南
- [x] **Tools 接口** — 95%
  - Tools 接入点；添加 Tools 的方法；工具开发指南
- [x] **MassData 参数支持** — 95%
  - 应用场景；核心 API；最佳实践；常见问题
- [x] **API String 参数支持** — 95%
  - 应用场景；核心 API；最佳实践；常见问题
- [x] **INI / 静态参数支持** — 95%
  - 应用场景；核心 API；最佳实践；常见问题

---

## 调试工具

- [x] **CSM 调试与开发工具** — 95%
  - 运行时调试工具；开发辅助工具；接口管理工具；示例工具；JKISM State Editor 集成
- [x] **CSM Global Log Window** — 100%
- [x] **CSM State Dashboard Window** — 95%
- [x] **CSM State Table Window** — 95%
- [ ] **CSM Test Panel** — 待功能实现

---

## LabVIEW 插件（待实现）

- [ ] STRING 右键：弹出模块/消息列表并快速填写
- [ ] STRING 右键：替换为 SafeString

---

## API 参考

负责人：[@nevstop](https://github.com/nevstop)

- [x] **CSM Palette APIs** — 95%
  - 所有 CSM 函数；API 分类；使用最佳实践；快速参考表
- [x] **CSM Templates** — 95%
  - Event 模板；No-Event 模板；模板开发流程；使用最佳实践

---

## 应用示例

- [x] **CSM Basic Example** — 完成
- [x] **CSM Advance Example** — 完成
- [x] **G-Web Development with CSM** — 完成
- [ ] **Continuous Measurement and Logging Project** — 90%
- [ ] *（补充其他项目）*
