#!/bin/bash

# ============================================
# YYC³ AI-PAI - 部署脚本
# ai-pai.yyc3.top
# ============================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
DEPLOY_HOST="${DEPLOY_HOST:-ai-pai.yyc3.top}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PATH="/var/www/ai-pai.yyc3.top"
BACKUP_PATH="/var/backups/ai-pai.yyc3.top"

echo -e "${BLUE}🚀 YYC³ AI-PAI 部署脚本${NC}"
echo "=================================="

# 检查本地构建
echo -e "${YELLOW}📦 检查构建状态...${NC}"
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 构建目录不存在，请先运行 pnpm build${NC}"
    exit 1
fi

# 本地测试
echo -e "${YELLOW}🧪 运行本地测试...${NC}"
pnpm test --run 2>/dev/null || echo -e "${YELLOW}⚠️  测试未通过，但继续部署${NC}"

# 显示构建信息
echo -e "${YELLOW}📊 构建信息:${NC}"
echo "   大小: $(du -sh dist/ | cut -f1)"
echo "   文件数: $(find dist -type f | wc -l)"
echo "   时间: $(date)"

# 确认部署
read -p "确认部署到 ${DEPLOY_HOST}? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ 部署已取消${NC}"
    exit 1
fi

# SSH部署函数
deploy_ssh() {
    echo -e "${YELLOW}📡 连接到服务器...${NC}"

    ssh "${DEPLOY_USER}@${DEPLOY_HOST}" << 'ENDSSH'
set -e

echo "🎯 开始远程部署..."

# 配置
DEPLOY_PATH="/var/www/ai-pai.yyc3.top"
BACKUP_PATH="/var/backups/ai-pai.yyc3.top"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 创建备份
echo "📦 创建备份..."
mkdir -p "$BACKUP_PATH"
if [ -d "$DEPLOY_PATH" ]; then
    tar -czf "$BACKUP_PATH/backup_$TIMESTAMP.tar.gz" -C "$DEPLOY_PATH" .
    echo "✅ 备份创建成功: $BACKUP_PATH/backup_$TIMESTAMP.tar.gz"
fi

# 清理旧文件
echo "🧹 清理旧文件..."
mkdir -p "$DEPLOY_PATH"
cd "$DEPLOY_PATH"
find . -type f ! -name '.htaccess' ! -name 'robots.txt' -delete
find . -type d -empty -delete

# 设置权限
echo "🔐 设置权限..."
find "$DEPLOY_PATH" -type d -exec chmod 755 {} \;
find "$DEPLOY_PATH" -type f -exec chmod 644 {} \;

# 清理旧备份
echo "🧹 清理旧备份..."
cd "$BACKUP_PATH"
ls -t backup_*.tar.gz | tail -n +6 | xargs -r rm

echo "✅ 远程部署准备完成!"
ENDSSH
}

# SCP上传函数
upload_files() {
    echo -e "${YELLOW}📤 上传文件...${NC}"
    scp -r dist/* "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
    echo -e "${GREEN}✅ 文件上传完成${NC}"
}

# 健康检查
health_check() {
    echo -e "${YELLOW}🏥 健康检查...${NC}"

    sleep 5

    # 检查HTTP状态
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://${DEPLOY_HOST}" || echo "000")
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "https://${DEPLOY_HOST}" || echo "0")

    echo "HTTP状态: $HTTP_STATUS"
    echo "响应时间: ${RESPONSE_TIME}s"

    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ 部署成功!${NC}"
        echo -e "${GREEN}🌐 https://${DEPLOY_HOST}${NC}"
        return 0
    else
        echo -e "${RED}❌ 健康检查失败${NC}"
        return 1
    fi
}

# 执行部署
echo -e "${BLUE}📋 部署步骤:${NC}"
echo "1. SSH准备"
echo "2. SCP上传"
echo "3. 健康检查"
echo ""

deploy_ssh
upload_files
health_check

if [ $? -eq 0 ]; then
    echo -e "${GREEN}==================================${NC}"
    echo -e "${GREEN}🎉 部署完成!${NC}"
    echo -e "${GREEN}==================================${NC}"

    # 显示部署信息
    echo -e "${BLUE}部署信息:${NC}"
    echo "域名: https://${DEPLOY_HOST}"
    echo "时间: $(date)"
    echo "提交: $(git rev-parse --short HEAD)"

    # 可选：打开浏览器
    if command -v open &> /dev/null; then
        read -p "打开浏览器查看? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open "https://${DEPLOY_HOST}"
        fi
    fi
else
    echo -e "${RED}==================================${NC}"
    echo -e "${RED}❌ 部署失败${NC}"
    echo -e "${RED}==================================${NC}"
    exit 1
fi