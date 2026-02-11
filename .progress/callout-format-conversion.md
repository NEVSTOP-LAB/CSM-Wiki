# Callout格式转换记录

## 日期
2026年2月11日

## 背景

Just the Docs主题使用的callout格式与GitHub的格式不同。为了在网站上正确显示callout，我们需要将GitHub格式转换为Just the Docs格式。

## 格式对比

### GitHub格式 (用于 `.ref` 目录)
GitHub使用以下格式表示callout：

```markdown
> [!NOTE]
> 这是一个注释
> 可以有多行内容
```

### Just the Docs格式 (用于 `docs/` 目录)
Just the Docs使用以下格式表示callout：

```markdown
{: .note }
> 这是一个注释
> 可以有多行内容
```

## Callout类型映射

| GitHub格式 | Just the Docs格式 | 用途 |
|-----------|------------------|------|
| `> [!NOTE]` | `{: .note }` | 普通注释 |
| `> [!WARNING]` | `{: .warning }` | 警告信息 |
| `> [!TIP]` | `{: .tip }` | 提示信息 |
| `> [!IMPORTANT]` | `{: .important }` | 重要信息 |
| `> [!CAUTION]` | `{: .caution }` | 注意事项 |

## 已转换的文件

以下文件已从GitHub格式转换为Just the Docs格式（2026年2月11日）：

1. `docs/basic/advance.md`
2. `docs/reference/api-02-core-functions.md`
3. `docs/reference/api-04-management-api.md`
4. `docs/reference/api-05-module-operation-api.md`
5. `docs/reference/api-06-broadcast-registration.md`
6. `docs/reference/api-10-utility-vis.md`
7. `docs/reference/api-addon-massdata.md`
8. `.process/UPDATE_INSTRUCTIONS.md`

## 未转换的文件

`.ref` 目录中的所有文件保持GitHub格式不变，因为它们将从GitHub源仓库更新。

## 未来更新流程

**重要**: 当从 `.ref` 目录更新文档到 `docs/` 目录时，必须执行callout格式转换！

### 自动转换脚本

可以使用以下Python脚本自动转换callout格式：

```python
#!/usr/bin/env python3
"""
Convert GitHub-style callouts to Just the Docs format
"""
import re
import sys

def convert_callouts(content):
    """
    Convert GitHub-style callouts ([!NOTE], [!WARNING], etc.) to Just the Docs format
    
    GitHub format:
    > [!NOTE]
    > content here
    > more content
    
    Just the Docs format:
    {: .note }
    > content here
    > more content
    """
    
    # Mapping of GitHub callout types to Just the Docs classes
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
        
        # Check if this line starts a GitHub-style callout
        match = re.match(r'^>\s*\[!(NOTE|WARNING|TIP|IMPORTANT|CAUTION)\]\s*$', line)
        if match:
            callout_type = match.group(1)
            just_the_docs_class = callout_mapping[callout_type]
            
            # Add the Just the Docs callout marker
            converted_lines.append(f'{{: .{just_the_docs_class} }}')
            
            # Skip the [!TYPE] line and process subsequent lines
            i += 1
            
            # Continue processing lines that are part of the callout (start with >)
            while i < len(lines) and lines[i].startswith('>'):
                converted_lines.append(lines[i])
                i += 1
            
            # Don't increment i again since we already moved past the callout
            continue
        else:
            converted_lines.append(line)
            i += 1
    
    return '\n'.join(converted_lines)

def process_file(filepath):
    """Process a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        converted = convert_callouts(content)
        
        # Only write if there were changes
        if converted != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(converted)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}", file=sys.stderr)
        return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: convert_callouts.py <file1> [file2] ...")
        sys.exit(1)
    
    modified_count = 0
    for filepath in sys.argv[1:]:
        if process_file(filepath):
            print(f"✓ Converted: {filepath}")
            modified_count += 1
        else:
            print(f"  No changes: {filepath}")
    
    print(f"\nTotal files modified: {modified_count}")
```

### 使用方法

```bash
# 转换单个文件
python3 convert_callouts.py docs/reference/api-01-templates.md

# 批量转换多个文件
python3 convert_callouts.py docs/reference/*.md

# 排除 .ref 目录
find docs -name "*.md" -type f | xargs python3 convert_callouts.py
```

## 注意事项

1. **只转换 `docs/` 目录**: `.ref` 目录中的文件保持GitHub格式，不要转换
2. **更新后必须转换**: 每次从 `.ref` 更新到 `docs/` 后，都要执行callout格式转换
3. **保留blockquote内容**: 只转换callout标记，blockquote内部的内容（包括`<b>`标签等）保持不变
4. **检查转换结果**: 转换后应检查文件，确保格式正确

## 验证

转换后可以通过以下命令验证：

```bash
# 检查docs目录是否还有GitHub格式的callout（应该没有）
grep -r '\[!NOTE\]\|\[!WARNING\]\|\[!TIP\]\|\[!IMPORTANT\]\|\[!CAUTION\]' docs/

# 检查.ref目录是否保持GitHub格式（应该有）
grep -r '\[!NOTE\]\|\[!WARNING\]\|\[!TIP\]\|\[!IMPORTANT\]\|\[!CAUTION\]' .ref/
```

## 相关文档

- `.process/UPDATE_INSTRUCTIONS.md` - 文档更新流程说明（已更新包含callout转换步骤）
- Just the Docs Callouts文档: https://just-the-docs.com/docs/ui-components/callouts/

## 总结

Callout格式转换已完成，所有 `docs/` 目录中的文件已转换为Just the Docs格式，`.ref` 目录保持GitHub格式。未来更新时请务必记得执行转换！
