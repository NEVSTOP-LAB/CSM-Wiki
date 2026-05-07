可通信状态机（CSM）是一个基于JKI状态机（JKISM）的LabVIEW应用框架。本仓库用于存储CSM的文档和示例代码。

- [可通讯状态机(CSM)框架源码](https://github.com/NEVSTOP-LAB/Communicable-State-Machine)
- [Wiki地址](https://nevstop-lab.github.io/CSM-Wiki/)

---

_**本仓库使用了以下的开源项目或服务**_：

- 使用 [visual-studio-code](https://code.visualstudio.com/) 作为编辑器
- 使用 [copilot](https://copilot.github.com/) 作为提示工具，并补充部分内容
- 使用 [markdownlint](https://github.com/markdownlint/markdownlint) 用于 markdown 文件的语法检查
- 通过 [GitHub Pages](https://pages.github.com/) 服务发布页面
- 使用 [Jekyll](https://jekyllrb.com/) 静态网站生成器
- 使用 [just-the-docs/just-the-docs](https://github.com/just-the-docs/just-the-docs) 主题
- 使用 [translate.js](https://github.com/xnx3/translate) 提供多语言机器翻译

---

想要贡献内容？请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 外部仓库同步 Workflow

本仓库包含一个 GitHub Actions Workflow（[`.github/workflows/sync-from-repos.yml`](.github/workflows/sync-from-repos.yml)），可定期将外部仓库的指定目录同步到本 Wiki 仓库。

**触发方式**：

- 定时执行：每周一北京时间 02:00（UTC 周日 18:00）自动运行
- 手动触发：在 GitHub Actions 页面点击 **Run workflow**

**配置说明**：

需要在仓库的 **Settings → Secrets and variables → Actions** 中设置以下内容：

| 名称 | 类型 | 说明 |
|------|------|------|
| `CSM_WIKI_SYNC_CONFIG` | **Variable**（变量） | JSON 数组，定义同步规则（见下方格式） |
| `CSM_WIKI_SYNC_TOKEN` | **Secret**（密钥） | 具有源仓库读取权限的 GitHub Personal Access Token |

**`CSM_WIKI_SYNC_CONFIG` 格式**：

```json
[
  {
    "source_repo":   "OWNER/REPO",
    "source_branch": "main",
    "source_path":   "docs/images",
    "dest_path":     "assets/img/external"
  },
  {
    "source_repo":   "OWNER2/REPO2",
    "source_branch": "main",
    "source_path":   "wiki"
  }
]
```

字段说明：

- `source_repo`（必填）：源仓库，格式为 `OWNER/REPO`
- `source_branch`（可选）：源分支，默认为 `main`
- `source_path`（必填）：源仓库中要同步的目录路径（相对路径，不以 `/` 开头）
- `dest_path`（可选）：同步到本仓库的目标路径，省略时默认为 `.ref/<reponame>`
