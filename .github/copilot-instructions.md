# CSM-Wiki Repository Background Knowledge

## Project Overview

This is a Jekyll-based wiki website for **CSM (Communication State Machine)** using the **Just the Docs** theme. Source reference documents live in `.ref/` and published website documents live in `docs/`.

## Key Directory Structure

- `.ref/` — Raw source reference documents (not published to website). Contains original VI descriptions and examples.
- `docs/` — Published website documents. Organized into `reference/`, `examples/`, `basic/`, `plugins/`.
- `.process/` — Internal process documentation.
- `.progress/` — Progress tracking notes.
- `_pages/` — Top-level Jekyll pages.
- `_config.yml` — Jekyll site configuration, including callout type definitions.

## Document Mapping: `.ref/` → `docs/`

When updating published docs from source `.ref` files, use the following mappings:

| Source file in `.ref/VI Description/VI Description(zh-cn)/` | Target in `docs/reference/` |
|--------------------------------------------------------------|------------------------------|
| VI Description(zh-cn) - 01. Templates.md | api-01-templates.md |
| VI Description(zh-cn) - 02. Core Functions.md | api-02-core-functions.md |
| VI Description(zh-cn) - 03. Arguments.md | api-03-arguments.md |
| VI Description(zh-cn) - 04 .Management API.md | api-04-management-api.md |
| VI Description(zh-cn) - 05. Module Operation API.md | api-05-module-operation-api.md |
| VI Description(zh-cn) - 06. Broadcast Registration.md | api-06-broadcast-registration.md |
| VI Description(zh-cn) - 07. Global Log.md | api-07-global-log.md |
| VI Description(zh-cn) - 08. Advanced Modes.md | api-08-advanced-modes.md |
| VI Description(zh-cn) - 09. Build-in Addons.md | api-09-build-in-addons.md |
| VI Description(zh-cn) - 10. Utility VIs.md | api-10-utility-vis.md |
| VI Description(zh-cn) - 12. Debug,Doc,Tools.md | api-12-debugdoctools.md |
| VI Description(zh-cn) - Addon API String.md | api-addon-api-string.md |
| VI Description(zh-cn) - Addon INI-Variable.md | api-addon-ini-variable.md |
| VI Description(zh-cn) - Addon Massdata.md | api-addon-massdata.md |

| Source file in `.ref/Examples/` | Target in `docs/examples/` |
|----------------------------------|------------------------------|
| CSM Basic Example(zh-cn).md | example-csm-basic-example.md |
| CSM Advance Example(zh-cn).md | example-csm-advance-example.md |

**Do not migrate** anything from `_internal/` subdirectories.

New API docs go in `docs/reference/` as `api-{name}.md`; new example docs go in `docs/examples/` as `example-{name}.md`.

## Callout Format Conversion

The `.ref/` files use **GitHub callout format**. The `docs/` files must use **Just the Docs callout format**. Always convert when copying content from `.ref/` to `docs/`.

| GitHub format (`.ref/`) | Just the Docs format (`docs/`) |
|-------------------------|--------------------------------|
| `> [!NOTE]` | `{: .note }` |
| `> [!WARNING]` | `{: .warning }` |
| `> [!TIP]` | `{: .tip }` |
| `> [!IMPORTANT]` | `{: .important }` |
| `> [!CAUTION]` | `{: .caution }` |

Example conversion:

```markdown
# GitHub format (.ref/)
> [!NOTE]
> This is a note with multiple lines.

# Just the Docs format (docs/)
{: .note }
> This is a note with multiple lines.
```

## Processing `.ref/` Updates

When a `.ref/` file is updated and needs to be applied to `docs/`:

1. **Remove NOTE/WARNING blocks** from the source content (blocks from `VI Description(zh-cn).md` are referenced by other files, not duplicated).
2. **Replace `> - Ref: <title>` lines** with the actual NOTE/WARNING block content referenced by that title.
3. **Convert callout format** from GitHub format to Just the Docs format.
4. **Preserve the existing YAML frontmatter** (`title`, `layout`, `parent`, `nav_order`, etc.) of the target `docs/` file — do not overwrite it.

Reference titles may appear with variations (e.g., `CSM 模块间通信类型` vs `CSM模块间通信类型` vs `模块间通信类型`); handle all variants.

## Encoding

Some `.ref/` files (notably `VI Description(zh-cn) - 12. Debug,Doc,Tools.md`) use **GBK encoding**. When reading `.ref/` files, try encodings in this order: `gbk`, `gb2312`, `gb18030`, `utf-8`, `latin-1`.

## VI Hyperlinks in `docs/`

When VI names (e.g., `` `Parse State Queue++.vi` ``) appear in `docs/` markdown files, link them to the corresponding section in the API reference using Jekyll link syntax:

```markdown
[`Parse State Queue++.vi`]({% link docs/reference/api-02-core-functions.md %}#parse-state-queuevi)
```

- Do not link VI names inside headings (lines starting with `#`).
- Do not re-link a VI name that is already linked.
- Match longest VI names first to avoid partial matches.

## Build & Lint

- Run `bundle exec jekyll build` to build the site locally.
- Markdown linting config is in `.markdownlint.json`.
- The Jekyll workflow is defined in `.github/workflows/jekyll.yml`.
