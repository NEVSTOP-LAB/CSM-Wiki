# 文档更新流程说明 (Documentation Update Process)

## 概述

本文档说明当 `.ref` 目录中的文档更新后，如何更新 `docs/reference` 和 `docs/examples` 目录中的对应文档。

## 背景

2026年2月，我们将中文API和Example文档从 `.ref` 目录迁移到了 `docs/reference` 和 `docs/examples` 目录，以便在网站上展示。`.ref` 目录中的原始文档被保留，用于未来的更新和对比。

### Callout格式转换

2026年2月11日：由于Just the Docs主题的callouts格式与GitHub格式不同，我们已经将 `docs/` 目录（不包括 `.ref/` 目录）中的所有callout从GitHub格式转换为Just the Docs格式。

**重要**: 当从 `.ref` 目录更新文档到 `docs/` 目录时，必须将callout格式从GitHub格式转换为Just the Docs格式。

#### Callout格式对照

GitHub格式 (`.ref` 目录中使用):
```markdown
> [!NOTE]
> 这是一个注释
> 可以有多行内容
```

Just the Docs格式 (`docs/` 目录中使用):
```markdown
{: .note }
> 这是一个注释
> 可以有多行内容
```

#### Callout类型映射

| GitHub格式 | Just the Docs格式 | 说明 |
|-----------|------------------|------|
| `> [!NOTE]` | `{: .note }` | 普通注释 |
| `> [!WARNING]` | `{: .warning }` | 警告信息 |
| `> [!TIP]` | `{: .tip }` | 提示信息 |
| `> [!IMPORTANT]` | `{: .important }` | 重要信息 |
| `> [!CAUTION]` | `{: .caution }` | 注意事项 |

#### 转换工具

使用以下Python脚本进行批量转换：

```python
#!/usr/bin/env python3
import re

def convert_callouts(content):
    """将GitHub格式的callout转换为Just the Docs格式"""
    callout_mapping = {
        'NOTE': 'note',
        'WARNING': 'warning',
        'TIP': 'tip',
        'IMPORTANT': 'important',
        'CAUTION': 'caution'
    }
    
    lines = content.split('\n')
    converted_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        match = re.match(r'^>\s*\[!(NOTE|WARNING|TIP|IMPORTANT|CAUTION)\]\s*$', line)
        if match:
            callout_type = match.group(1)
            just_the_docs_class = callout_mapping[callout_type]
            converted_lines.append(f'{{: .{just_the_docs_class} }}')
            i += 1
            while i < len(lines) and lines[i].startswith('>'):
                converted_lines.append(lines[i])
                i += 1
            continue
        else:
            converted_lines.append(line)
            i += 1
    
    return '\n'.join(converted_lines)
```

### 迁移的文件

#### API文档 (docs/reference/)
从 `.ref/VI Description/VI Description(zh-cn)/` 迁移了以下文件（排除 `_internal` 目录）：

1. **api-01-templates.md** ← VI Description(zh-cn) - 01. Templates.md
2. **api-02-core-functions.md** ← VI Description(zh-cn) - 02. Core Functions.md
3. **api-03-arguments.md** ← VI Description(zh-cn) - 03. Arguments.md
4. **api-04-management-api.md** ← VI Description(zh-cn) - 04 .Management API.md
5. **api-05-module-operation-api.md** ← VI Description(zh-cn) - 05. Module Operation API.md
6. **api-06-broadcast-registration.md** ← VI Description(zh-cn) - 06. Broadcast Registration.md
7. **api-07-global-log.md** ← VI Description(zh-cn) - 07. Global Log.md
8. **api-08-advanced-modes.md** ← VI Description(zh-cn) - 08. Advanced Modes.md
9. **api-09-build-in-addons.md** ← VI Description(zh-cn) - 09. Build-in Addons.md
10. **api-10-utility-vis.md** ← VI Description(zh-cn) - 10. Utility VIs.md
11. **api-12-debugdoctools.md** ← VI Description(zh-cn) - 12. Debug,Doc,Tools.md
12. **api-addon-api-string.md** ← VI Description(zh-cn) - Addon API String.md
13. **api-addon-ini-variable.md** ← VI Description(zh-cn) - Addon INI-Variable.md
14. **api-addon-massdata.md** ← VI Description(zh-cn) - Addon Massdata.md

**注意**: `api-11-obselete-vis.md` (废弃VIs) 已被移除，不再需要。

#### Example文档 (顶级菜单：参考范例)
从 `.ref/Examples/` 迁移了以下文件：

1. **example-csm-basic-example.md** ← CSM Basic Example(zh-cn).md
2. **example-csm-advance-example.md** ← CSM Advance Example(zh-cn).md

并创建了顶级菜单页面 **reference-examples.md** (nav_order: 35，位于参考文档和插件系统之间)

### 未迁移的文件

- `.ref/VI Description/VI Description(zh-cn)/_internal/` 目录下的所有文件（内部文档）
- `.ref/VI Description/_internal/` 目录下的所有文件

## 更新步骤

当 `.ref` 目录中的文档更新后，按照以下步骤更新对应的文档：

### 步骤 1: 识别更新的文件

首先，使用 `git diff` 或其他工具识别 `.ref` 目录中哪些文件被更新了。

```bash
git diff HEAD -- .ref/
```

### 步骤 2: 提取NOTE/WARNING块

如果更新了 `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn).md` 文件中的NOTE或WARNING块，需要提取这些块的内容，因为它们会被引用到其他文档中。

NOTE/WARNING块的格式：
```markdown
{: .note }
> <b>标题</b>
>
> 内容...
```

主要的NOTE块标题包括：
- CSM模块间通信类型
- CSM消息类型
- CSM消息格式解析
- 同步消息
- 异步消息
- CSM广播
- CSM订阅
- 等等...

### 步骤 3: 处理更新的内容

对于每个更新的 `.ref` 文件，需要将更新应用到对应的 `docs/` 文件：

1. **移除原始NOTE/WARNING块**：从源文件中移除所有 `> [!NOTE]` 和 `> [!WARNING]` 块
2. **替换引用**：将所有 `> - Ref: XXX` 行替换为实际的NOTE/WARNING内容
3. **转换Callout格式**：将GitHub格式的callout (`> [!NOTE]`, `> [!WARNING]`等) 转换为Just the Docs格式 (`{: .note }`, `{: .warning }`等)。参见上面的"Callout格式转换"章节
4. **保持frontmatter**：确保目标文件的YAML frontmatter（title, layout, parent, nav_order等）保持不变

### 步骤 4: 使用迁移脚本

在 `/tmp/` 目录有迁移脚本的副本，但建议重新创建脚本以确保使用最新的NOTE块内容。

#### 创建迁移脚本

1. 从 `.ref/VI Description/VI Description(zh-cn)/VI Description(zh-cn).md` 提取所有NOTE/WARNING块
2. 创建一个字典，将标题映射到内容
3. 使用以下逻辑处理文件：
   - 读取源文件
   - 移除原始NOTE/WARNING块
   - 替换 `> - Ref:` 引用为实际内容

#### 脚本示例结构

```python
def process_file(source_path, target_path):
    # 1. 读取源文件
    content = read_file_with_encoding_fallback(source_path)
    
    # 2. 移除原始NOTE/WARNING块
    content = remove_note_warning_blocks(content)
    
    # 3. 替换引用
    content = replace_references(content)
    
    # 4. 保持frontmatter，写入目标文件
    write_file(target_path, content)
```

### 步骤 5: 验证更新

更新后，检查以下内容：

1. **语法正确**：确保Markdown语法正确
2. **链接有效**：确保所有内部链接都有效
3. **NOTE块正确替换**：确保所有引用都被正确替换
4. **frontmatter完整**：确保YAML frontmatter没有丢失

### 步骤 6: 提交更改

```bash
git add docs/reference/ docs/examples/
git commit -m "Update API/Example documentation from .ref updates"
git push
```

## 特殊注意事项

### 编码问题

`.ref` 目录中的某些文件可能使用非UTF-8编码（如ISO-8859-1、GBK）。处理这些文件时，需要尝试多种编码：

```python
encodings = ['gbk', 'gb2312', 'gb18030', 'utf-8', 'latin-1', 'iso-8859-1']
for encoding in encodings:
    try:
        with open(file_path, 'r', encoding=encoding) as f:
            content = f.read()
        break
    except UnicodeDecodeError:
        continue
```

**特别注意**: `VI Description(zh-cn) - 12. Debug,Doc,Tools.md` 使用GBK编码，需要特殊处理。

### 引用标题的变体

引用可能以不同格式出现：
- `> - Ref: CSM 模块间通信类型` （有空格）
- `> - Ref: CSM模块间通信类型` （无空格）
- `> - Ref: 模块间通信类型` （无"CSM"前缀）

脚本需要处理所有这些变体。

### 新文件

如果 `.ref` 中添加了新文件：

1. **API文档**：在 `docs/reference/` 创建新文件，使用命名模式 `api-{name}.md`
2. **Example文档**：在 `docs/examples/` 创建新文件，使用命名模式 `example-{name}.md`
3. 添加适当的frontmatter
4. 更新父页面（如果需要）

### Internal文档

永远不要迁移 `_internal` 目录中的文档到可见的 `docs/` 目录。

## 文件映射表

为了方便更新，这里是完整的文件映射表：

| 源文件 (.ref) | 目标文件 (docs) |
|---------------|----------------|
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 01. Templates.md | reference/api-01-templates.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 02. Core Functions.md | reference/api-02-core-functions.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 03. Arguments.md | reference/api-03-arguments.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 04 .Management API.md | reference/api-04-management-api.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 05. Module Operation API.md | reference/api-05-module-operation-api.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 06. Broadcast Registration.md | reference/api-06-broadcast-registration.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 07. Global Log.md | reference/api-07-global-log.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 08. Advanced Modes.md | reference/api-08-advanced-modes.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 09. Build-in Addons.md | reference/api-09-build-in-addons.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 10. Utility VIs.md | reference/api-10-utility-vis.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - 12. Debug,Doc,Tools.md | reference/api-12-debugdoctools.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - Addon API String.md | reference/api-addon-api-string.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - Addon INI-Variable.md | reference/api-addon-ini-variable.md |
| VI Description/VI Description(zh-cn)/VI Description(zh-cn) - Addon Massdata.md | reference/api-addon-massdata.md |
| Examples/CSM Basic Example(zh-cn).md | examples/example-csm-basic-example.md |
| Examples/CSM Advance Example(zh-cn).md | examples/example-csm-advance-example.md |

**注意**:
- `api-11-obselete-vis.md` (废弃VIs) 已移除，无需维护
- "参考范例" 现在是顶级菜单项 (nav_order: 35)，不再是"示例应用"的子页面

## VI和示例超链接

### 要求

在 `docs/` 目录下的所有 markdown 文件中，当提到 VI 名称（如 `Parse State Queue++.vi`）或示例名称时，应该添加超链接，指向相应的 API 参考文档或示例文档。这样用户可以直接点击链接跳转到详细说明。

### 实现方法

1. **识别VI引用**：扫描文档中的VI名称，通常出现在：
   - 代码块中：`` `VI Name.vi` ``
   - 粗体中：`**VI Name.vi**`
   - 普通文本中

2. **创建VI映射**：从API参考文档中提取所有VI名称及其对应的文件和锚点：
   ```python
   # 示例映射
   {
     "Parse State Queue++.vi": {
       "file": "docs/reference/api-02-core-functions.md",
       "anchor": "parse-state-queuevi"
     }
   }
   ```

3. **添加Jekyll链接**：
   - 对于代码块中的VI：
     ```markdown
     [`VI Name`]({% link docs/reference/api-XX.md %}#anchor)
     ```
   - 对于粗体VI：
     ```markdown
     **[VI Name]({% link docs/reference/api-XX.md %}#anchor)**
     ```

4. **注意事项**：
   - 不要链接标题中的VI名称（以 `#` 开头的行）
   - 不要重复链接已经有链接的VI
   - 链接时从最长的VI名称开始匹配，避免部分匹配问题

### 已添加链接的文件

- `docs/basic/communication.md` - 7个VI链接
- `docs/basic/advance.md` - 4个VI链接
- `docs/basic/global-log.md` - 6个VI链接
- `docs/basic/usage.md` - 5个VI链接
- `docs/plugins/` 目录下的文件 - 3个VI链接

### 示例脚本

使用Python脚本自动添加链接：

```python
import re
import json

# 1. 从API文档提取VI映射
vi_to_api = {}
api_files = ['docs/reference/api-*.md']
for api_file in api_files:
    headings = re.findall(r'^##\s+(.+)$', content, re.MULTILINE)
    for heading in headings:
        anchor = heading.lower().replace(' ', '-').replace('.', '')
        vi_to_api[heading] = {'file': api_file, 'anchor': anchor}

# 2. 在文档中添加链接
for vi_name, info in vi_to_api.items():
    pattern = rf'`({re.escape(vi_name)})`'
    replacement = rf'[`\1`]({{% link {info["file"]} %}}#{info["anchor"]})'
    content = re.sub(pattern, replacement, content)
```

### 维护

当添加新的API文档或更新VI名称时：
1. 重新生成VI映射
2. 运行链接添加脚本处理相关文档
3. 检查生成的链接是否正确

## 联系信息

如果在更新过程中遇到问题，请查看本次迁移的提交记录或联系原作者。

---
最后更新：2026年2月
