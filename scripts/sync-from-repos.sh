#!/usr/bin/env bash
# sync-from-repos.sh
#
# 从多个源 repo 的指定目录同步文件到本 wiki repo 的目标目录。
#
# 必需环境变量：
#   CSM_WIKI_SYNC_CONFIG   - JSON 数组，定义同步规则（见下方格式说明）
#                            通过 GitHub Actions Variable（vars.CSM_WIKI_SYNC_CONFIG）传入
#   CSM_WIKI_SYNC_TOKEN    - 具有源 repo 读权限的 GitHub Personal Access Token
#                            通过 GitHub Actions Secret（secrets.CSM_WIKI_SYNC_TOKEN）传入
#
# CSM_WIKI_SYNC_CONFIG 格式示例：
#   [
#     {
#       "source_repo":   "OWNER/REPO",
#       "source_branch": "main",
#       "source_path":   "docs/images",
#       "dest_path":     "assets/img/external"   ← 可选，默认 .ref/<reponame>
#     },
#     {
#       "source_repo":   "OWNER2/REPO2",
#       "source_branch": "main",
#       "source_path":   "wiki"
#     }
#   ]
#
# 说明：
#   - source_path 为必填相对路径（不以 / 开头）。
#   - dest_path 可选，省略时默认为 .ref/<reponame>（reponame 为 source_repo 的仓库名部分）。
#   - 目标目录会被完全替换为源目录的最新内容。
#   - 脚本执行后不自动 commit，commit 由 workflow 负责。

set -euo pipefail

# ── 参数校验 ─────────────────────────────────────────────────────────────────

if [[ -z "${CSM_WIKI_SYNC_CONFIG:-}" ]]; then
  echo "::error::环境变量 CSM_WIKI_SYNC_CONFIG 未设置或为空。"
  exit 1
fi

if [[ -z "${CSM_WIKI_SYNC_TOKEN:-}" ]]; then
  echo "::error::环境变量 CSM_WIKI_SYNC_TOKEN 未设置或为空。"
  exit 1
fi

# ── 依赖检查 ─────────────────────────────────────────────────────────────────

for cmd in git jq realpath; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "::error::缺少依赖命令：$cmd"
    exit 1
  fi
done

# ── 工作目录（脚本所在 repo 的根目录）────────────────────────────────────────

WIKI_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

echo "Wiki 根目录：$WIKI_ROOT"
echo "临时工作目录：$WORK_DIR"

# ── 配置 git 凭据（写入临时凭据文件，避免 token 暴露在进程参数中）────────────

GIT_CRED_FILE="$(mktemp --tmpdir="$WORK_DIR" git-creds.XXXXXX)"
chmod 600 "$GIT_CRED_FILE"
printf 'https://x-access-token:%s@github.com\n' "$CSM_WIKI_SYNC_TOKEN" > "$GIT_CRED_FILE"
git config --global credential.helper "store --file=${GIT_CRED_FILE}"

# ── 工具函数：校验路径安全性 ──────────────────────────────────────────────────

# 确保路径为安全相对路径：不为空、不以 / 开头、不包含 .. 分量
validate_relative_path() {
  local path="$1" label="$2" rule_num="$3"
  if [[ -z "$path" || "$path" == "null" ]]; then
    echo "::error::规则 ${rule_num} 的 ${label} 为空，跳过。"
    return 1
  fi
  if [[ "$path" == /* ]]; then
    echo "::error::规则 ${rule_num} 的 ${label} 不允许为绝对路径：'${path}'，跳过。"
    return 1
  fi
  if [[ "$path" =~ (^|/)\.\.(/|$) ]]; then
    echo "::error::规则 ${rule_num} 的 ${label} 包含路径遍历 '..'：'${path}'，跳过。"
    return 1
  fi
  return 0
}

# 确认解析后的绝对路径仍在指定根目录下
assert_within_root() {
  local full_path="$1" root="$2" label="$3" rule_num="$4"
  local resolved
  resolved="$(realpath -m "$full_path")"
  if [[ "$resolved" != "${root}"/* && "$resolved" != "$root" ]]; then
    echo "::error::规则 ${rule_num} 的 ${label} 路径 '${full_path}' 解析后逃逸出根目录 '${root}'，跳过。"
    return 1
  fi
  return 0
}

# ── 解析 CSM_WIKI_SYNC_CONFIG ────────────────────────────────────────────────

ENTRY_COUNT=$(echo "$CSM_WIKI_SYNC_CONFIG" | jq 'length')

# 打印完整配置（隐藏 token）
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  CSM_WIKI_SYNC_CONFIG（共 $ENTRY_COUNT 条规则）"
echo "════════════════════════════════════════════════════════════════"
echo "$CSM_WIKI_SYNC_CONFIG" | jq '.'
echo "════════════════════════════════════════════════════════════════"
echo ""

if [[ "$ENTRY_COUNT" -eq 0 ]]; then
  echo "CSM_WIKI_SYNC_CONFIG 为空数组，无需同步。"
  exit 0
fi

# ── 主循环：逐条处理同步规则 ─────────────────────────────────────────────────

for i in $(seq 0 $((ENTRY_COUNT - 1))); do
  SOURCE_REPO=$(echo   "$CSM_WIKI_SYNC_CONFIG" | jq -r ".[$i].source_repo")
  SOURCE_BRANCH=$(echo "$CSM_WIKI_SYNC_CONFIG" | jq -r ".[$i].source_branch // \"main\"")
  SOURCE_PATH=$(echo   "$CSM_WIKI_SYNC_CONFIG" | jq -r ".[$i].source_path")
  DEST_PATH_RAW=$(echo "$CSM_WIKI_SYNC_CONFIG" | jq -r ".[$i].dest_path // \"null\"")

  # dest_path 可选：未填写时默认为 .ref/<reponame>
  REPO_NAME="${SOURCE_REPO##*/}"
  if [[ -z "$DEST_PATH_RAW" || "$DEST_PATH_RAW" == "null" ]]; then
    DEST_PATH=".ref/${REPO_NAME}"
  else
    DEST_PATH="$DEST_PATH_RAW"
  fi

  echo ""
  echo "─────────────────────────────────────────────────────────────"
  echo "规则 $((i+1))/$ENTRY_COUNT"
  echo "  源 Repo   : $SOURCE_REPO"
  echo "  源 分支    : $SOURCE_BRANCH"
  echo "  源 路径    : $SOURCE_PATH"
  echo "  目标路径   : $DEST_PATH"
  echo "─────────────────────────────────────────────────────────────"

  # 基本校验
  if [[ -z "$SOURCE_REPO" || "$SOURCE_REPO" == "null" ]]; then
    echo "::error::规则 $((i+1)) 缺少 source_repo 字段，跳过。"
    continue
  fi

  # 路径安全校验
  validate_relative_path "$SOURCE_PATH" "source_path" "$((i+1))" || continue
  validate_relative_path "$DEST_PATH"   "dest_path"   "$((i+1))" || continue

  # 克隆目录（sparse checkout 节省流量，token 通过凭据文件传入）
  CLONE_DIR="$WORK_DIR/repo_$i"

  echo "正在 sparse-clone $SOURCE_REPO ($SOURCE_BRANCH)..."
  git clone \
    --depth 1 \
    --filter=blob:none \
    --sparse \
    --branch "$SOURCE_BRANCH" \
    "https://github.com/${SOURCE_REPO}.git" \
    "$CLONE_DIR" 2>&1

  # 仅 checkout 需要的子目录
  (cd "$CLONE_DIR" && git sparse-checkout set "$SOURCE_PATH" 2>&1)

  SRC_FULL="$CLONE_DIR/$SOURCE_PATH"
  DEST_FULL="$WIKI_ROOT/$DEST_PATH"

  # 确认解析后的路径不逃逸出各自根目录
  assert_within_root "$SRC_FULL"  "$CLONE_DIR" "source_path" "$((i+1))" || continue
  assert_within_root "$DEST_FULL" "$WIKI_ROOT"  "dest_path"   "$((i+1))" || continue

  if [[ ! -e "$SRC_FULL" ]]; then
    echo "::warning::源路径 '$SOURCE_PATH' 在 $SOURCE_REPO 中不存在，跳过。"
    continue
  fi

  # 完全替换目标目录（删除重建，确保 dotfiles 也被清除）
  echo "正在同步到 $DEST_FULL ..."
  rm -rf "${DEST_FULL:?}"
  mkdir -p "$DEST_FULL"

  if [[ -d "$SRC_FULL" ]]; then
    # 源是目录：将目录内容复制到目标目录
    cp -r "$SRC_FULL"/. "$DEST_FULL/"
  else
    # 源是单个文件：直接复制
    cp "$SRC_FULL" "$DEST_FULL/"
  fi

  echo "✅ 规则 $((i+1)) 同步完成。"
done

echo ""
echo "所有同步规则处理完毕。"
