#!/bin/bash

# ============================================
# YYC³ AI-PAI - GitHub Secrets 检查脚本
# ============================================

echo "🔍 GitHub Secrets 配置检查"
echo "========================================"

# 检查是否安装了gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI 未安装"
    echo "请安装: https://cli.github.com/"
    exit 1
fi

# 检查是否已登录
if ! gh auth status &> /dev/null; then
    echo "❌ 未登录 GitHub"
    echo "请运行: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI 已安装并登录"

# 获取仓库信息
REPO=$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')

if [ -z "$REPO" ]; then
    echo "❌ 无法获取GitHub仓库信息"
    exit 1
fi

echo "📦 仓库: $REPO"
echo ""

# 检查必需的 Secrets
REQUIRED_SECRETS=(
    "PRODUCTION_HOST"
    "PRODUCTION_USER"
    "PRODUCTION_SSH_KEY"
)

OPTIONAL_SECRETS=(
    "PRODUCTION_PORT"
    "SLACK_WEBHOOK"
)

echo "🔑 检查必需的 Secrets:"
echo "----------------------------"

for secret in "${REQUIRED_SECRETS[@]}"; do
    if gh secret list -R "$REPO" | grep -q "^$secret"; then
        echo "✅ $secret"
    else
        echo "❌ $secret (未配置)"
    fi
done

echo ""
echo "🔧 检查可选的 Secrets:"
echo "----------------------------"

for secret in "${OPTIONAL_SECRETS[@]}"; do
    if gh secret list -R "$REPO" | grep -q "^$secret"; then
        echo "✅ $secret"
    else
        echo "⚠️  $secret (未配置 - 可选)"
    fi
done

echo ""
echo "========================================"
echo "📋 配置指南:"
echo ""
echo "1. 生成SSH密钥:"
echo "   ssh-keygen -t ed25519 -C \"github-actions@ai-pai\" -f ~/.ssh/github_actions"
echo ""
echo "2. 复制公钥到服务器:"
echo "   ssh-copy-id -i ~/.ssh/github_actions.pub user@ai-pai.yyc3.top"
echo ""
echo "3. 设置Secrets:"
echo "   gh secret set PRODUCTION_HOST --body \"ai-pai.yyc3.top\""
echo "   gh secret set PRODUCTION_USER --body \"username\""
echo "   gh secret set PRODUCTION_SSH_KEY < ~/.ssh/github_actions"
echo "   gh secret set PRODUCTION_PORT --body \"22\""
echo ""
echo "4. 设置Slack通知 (可选):"
echo "   gh secret set SLACK_WEBHOOK --body \"https://hooks.slack.com/...\""
echo ""
echo "========================================"