#!/bin/bash
# 紧急手动部署脚本 - 绕过CI/CD直接部署

echo "🚨 紧急部署 - 绕过CI/CD直接修复isCyberpunk错误"

# 检查我们是否有所需的SSH凭证
if [ -z "$PRODUCTION_HOST" ] || [ -z "$PRODUCTION_USER" ]; then
  echo "❌ 缺少SSH凭证。请从GitHub Actions secrets获取或手动部署。"
  echo ""
  echo "🔧 手动部署步骤："
  echo "1. 构建: pnpm build"
  echo "2. 上传dist/目录到服务器 /var/www/ai-pai.yyc3.top"
  echo "3. 重启web服务器"
  exit 1
fi

echo "📦 开始构建..."
pnpm build

if [ $? -ne 0 ]; then
  echo "❌ 构建失败"
  exit 1
fi

echo "🚀 开始部署到生产环境..."

# 这里需要实际的SSH部署逻辑
# 由于安全原因，我们暂时跳过实际部署

echo "⚠️  需要手动完成部署步骤："
echo "1. 将 dist/ 目录上传到生产服务器"
echo "2. 清除CDN缓存"
echo "3. 验证部署"