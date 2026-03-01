# CSM 语法高亮实现说明

> 本文档供 AI 助手或开发者在修改 CSM 语法高亮时参考。

---

## 文件位置

| 文件 | 作用 |
|------|------|
| `_plugins/csm_lexer.rb` | Rouge 词法分析器，将 CSM 代码切分为 token |
| `assets/css/just-the-docs-default.scss` | 样式定义，底部 CSM 专属区块负责着色 |

---

## CSM 语法结构

每一行 CSM 代码的典型格式：

```
<command>[@<target>] [>> <argument>[@<target>]] [<send-sep> <module>] [// <comment>]
```

示例：

```csm
abc@target1 >> def@target2 -> ModuleA  // 注释
API: GetData >> params -@ Database
Start >> -> All
```

### 分隔符说明

| 分隔符 | 说明 |
|--------|------|
| `>>` | command / argument 分界（Arg Separator） |
| `->` | 异步发送，有返回（Send with return） |
| `->|` | 异步发送，无返回（Send without return） |
| `-@` | 同步调用（Synchronous call） |
| `//` | 单行注释 |

---

## Lexer 状态机（`_plugins/csm_lexer.rb`）

词法分析器使用 Rouge 的 `RegexLexer`，由三个状态组成：

### 常量

```ruby
SEND_SEP  = /->\||->|-@/      # 匹配 ->|  ->  -@（显式交替，->| 在 -> 前，确保匹配正确）
ARG_SEP   = />>/              # 匹配 >>
COMMENT   = /\/\//            # 匹配 //
SPECIAL   = /#{ARG_SEP}|#{SEND_SEP}|#{COMMENT}/  # 以上三者的并集，用于负向预查
```

### `:root` 状态（命令段）

规则按优先级从高到低：

| 规则 | 模式 | Token 类型 | 说明 |
|------|------|------------|------|
| 1 | `//[^\n]*` | `Comment::Single` | 行注释，吃掉整行剩余 |
| 2 | `>>` | `Operator` → 切换到 `:argument` | 参数分隔符 |
| 3 | `->\|`, `->`, `-@` | `Keyword` → 切换到 `:target` | 发送分隔符 |
| 4 | `\s+` | `Text` | 空白 |
| 5 | `@\S+` | `Name::Label` | 命令中嵌入的 `@target`，加粗显示 |
| 6 | `(?:(?!SPECIAL)[^\s@])+` | `Name::Function` | 命令文本本体（遇到 `@` 停止） |

### `:argument` 状态（参数段，`>>` 后进入）

| 规则 | 模式 | Token 类型 | 说明 |
|------|------|------------|------|
| 1 | `//[^\n]*` | `Comment::Single` + `pop!` | 行注释结束参数 |
| 2 | `\n` | `Text` + `pop!` | 换行结束参数 |
| 3 | `(?=SEND_SEP)` | `Text` + `pop!` | 遇发送符，弹出（不消费字符）|
| 4 | `[^\S\n]+` | `Text` | 非换行空白 |
| 5 | `@\S+` | `Literal::String::Interpol` | 参数中嵌入的 `@target`，加粗+灰色+斜体 |
| 6 | `[^\s@]+` | `Literal::String::Doc` | 参数文本本体（遇到 `@` 停止） |

### `:target` 状态（模块名，发送符后进入）

| 规则 | 模式 | Token 类型 | 说明 |
|------|------|------------|------|
| 1 | `//[^\n]*` | `Comment::Single` + `pop!` | 注释结束 |
| 2 | `\n` | `Text` + `pop!` | 换行结束 |
| 3 | `[^\S\n]+` | `Text` | 非换行空白 |
| 4 | `\S+` | `Text` + `pop!` | 模块名，默认色（不着色） |

---

## Token → CSS 类映射

Rouge 将 token 类型转换为 HTML `<span class="...">` 时，CSS 类名遵循固定规则：

| Token 类型（Ruby） | CSS 类 | 在 CSM 中的用途 |
|-------------------|--------|----------------|
| `Comment::Single` | `.c1` | 行注释 `// ...` |
| `Operator` | `.o` | `>>` 分隔符 |
| `Keyword` | `.k` | 发送符 `->` `->|` `-@` |
| `Name::Function` | `.nf` | 命令文本 |
| `Name::Label` | `.nl` | 命令中的 `@target` |
| `Literal::String::Doc` | `.sd` | 参数文本 |
| `Literal::String::Interpol` | `.si` | 参数中的 `@target` |
| `Text` | *(无额外样式)* | 空白、模块名、换行 |

---

## CSS 样式定义（`assets/css/just-the-docs-default.scss`）

所有规则都限定在 `.language-csm` 作用域下，不影响其他语言。

```scss
$csm-comment-color:  #22863a; // 绿色（注释）
$csm-argument-color: #6a737d; // 中灰色（参数）

.language-csm .c1  { color: $csm-comment-color; font-style: italic; }   // 注释
.language-csm .sd  { color: $csm-argument-color; font-style: italic; }   // 参数文本
.language-csm .k   { font-weight: bold; }                                 // 发送符
.language-csm .o   { font-weight: bold; }                                 // >> 运算符
.language-csm .nl  { font-weight: bold; }                                 // 命令中 @target
.language-csm .si  { color: $csm-argument-color; font-weight: bold;       // 参数中 @target
                      font-style: italic; }
```

`.nf`（命令文本）不设置任何规则，沿用主题默认颜色（深色）。

---

## 视觉效果对照表

以 `abc@target1 >> def@target2 -> ModuleA // 注释` 为例：

| 片段 | Token | 视觉效果 |
|------|-------|---------|
| `abc` | `Name::Function` | 深色（默认） |
| `@target1` | `Name::Label` | **加粗** |
| ` ` | `Text` | 默认 |
| `>>` | `Operator` | **加粗** |
| ` ` | `Text` | 默认 |
| `def` | `Literal::String::Doc` | *灰色斜体* |
| `@target2` | `Literal::String::Interpol` | ***灰色加粗斜体*** |
| ` ` | `Text` | 默认 |
| `->` | `Keyword` | **加粗** |
| ` ModuleA` | `Text` | 默认（黑色） |
| ` // 注释` | `Comment::Single` | *绿色斜体* |

---

## 修改指南

### 添加新的分隔符/关键字

1. 在 `SEND_SEP` 或新常量中添加模式。
2. 若需要进入新状态，在 `state :root` 中添加对应规则并定义新的 `state :xxx do ... end`。
3. 在 `SPECIAL` 中加入新模式（用于负向预查，防止命令/参数文本误吞新符号）。

### 更改某类 token 的颜色/字体

只需修改 `assets/css/just-the-docs-default.scss` 中对应的 `.language-csm .xx` 规则，无需改动词法器。

### 添加新的 token 类型

1. 在 `csm_lexer.rb` 对应 state 中添加新规则，选择合适的 Rouge token 类型（参考 [Rouge 官方 token 列表](https://rouge-ruby.github.io/docs/Rouge/Token/Tokens.html)）。
2. 确认该 token 对应的 CSS 类名（通常是类型路径的小写缩写，如 `Name::Label` → `.nl`）。
3. 在 `assets/css/just-the-docs-default.scss` 的 CSM 专属区块中添加对应的 `.language-csm .xx` 规则。

### 调试词法分析结果

在项目根目录运行：

```ruby
ruby -e "
require 'rouge'
require_relative '_plugins/csm_lexer'
lexer = Rouge::Lexers::CSM.new
lexer.lex('your code here').each { |tok, val| puts \"#{tok}: #{val.inspect}\" }
"
```

---

## 注意事项

- **规则顺序即优先级**：Rouge 按规则在 state 中的声明顺序匹配，第一条命中的规则生效。
- **`SPECIAL` 负向预查**：命令文本规则 `(?:(?!SPECIAL)[^\s@])+` 确保命令文本不会"吃掉"后续的 `>>` / `->` / `//`。修改或新增分隔符时务必同步更新 `SPECIAL`。
- **`@` 的处理**：命令和参数的"文本本体"规则均以 `[^\s@]+` 结束，遇到 `@` 即停止，下一条 `@\S+` 规则接管，确保 `cmd@Target` 被正确拆分为两个 token。
- **CSS 作用域**：所有 CSM 样式均以 `.language-csm` 为前缀，与其他代码块完全隔离。
