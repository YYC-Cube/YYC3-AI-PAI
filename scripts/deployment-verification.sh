#!/bin/bash

# ============================================
# YYC³ AI-PAI - 部署验证脚本
# ============================================

set -e

DOMAIN="${1:-ai-pai.yyc3.top}"
VERBOSE="${2:-false}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 部署验证工具${NC}"
echo "========================================"
echo "域名: https://$DOMAIN"
echo ""

# 成功计数器
PASS=0
FAIL=0
WARN=0

# 检查函数
check() {
    local name="$1"
    local command="$2"
    local expected="$3"

    if [ "$VERBOSE" = "true" ]; then
        echo "检查: $name"
    fi

    result=$(eval "$command" 2>/dev/null || echo "FAIL")

    if [ "$result" = "$expected" ]; then
        echo -e "${GREEN}✅${NC} $name"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC} $name"
        if [ "$VERBOSE" = "true" ]; then
            echo "   预期: $expected"
            echo "   实际: $result"
        fi
        ((FAIL++))
        return 1
    fi
}

# 警告函数
warn() {
    local name="$1"
    local command="$2"
    local condition="$3"

    result=$(eval "$command" 2>/dev/null || echo "0")

    if eval "[[ $result $condition ]]"; then
        echo -e "${YELLOW}⚠️${NC}  $name"
        if [ "$VERBOSE" = "true" ]; then
            echo "   值: $result"
        fi
        ((WARN++))
        return 1
    else
        echo -e "${GREEN}✅${NC} $name"
        ((PASS++))
        return 0
    fi
}

echo "📊 基础连接检查"
echo "----------------------------"

check "DNS解析" "dig +short $DOMAIN | head -1" "[0-9]*"
check "HTTP状态" "curl -s -o /dev/null -w '%{http_code}' https://$DOMAIN" "200"
check "HTTPS支持" "curl -s -o /dev/null -w '%{http_code}' https://$DOMAIN" "200"

echo ""
echo "⚡ 性能检查"
echo "----------------------------"

warn "TTFB < 1s" "curl -s -o /dev/null -w '%{time_starttransfer}' https://$DOMAIN" "< 1.0"
warn "总响应时间 < 2s" "curl -s -o /dev/null -w '%{time_total}' https://$DOMAIN" "< 2.0"
warn "下载速度 > 100KB/s" "curl -s -o /dev/null -w '%{speed_download}' https://$DOMAIN" "> 102400"

echo ""
echo "🔐 安全检查"
echo "----------------------------"

check "SSL证书" "echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | grep 'Verify return code: 0' | wc -l" "1"
warn "SSL有效期 > 7天" "echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -checkend 604800 | grep -c 'not'" "1"

# 安全头检查
SECURITY_HEADERS=(
    "X-Content-Type-Options"
    "X-Frame-Options"
    "X-XSS-Protection"
    "Strict-Transport-Security"
)

for header in "${SECURITY_HEADERS[@]}"; do
    if curl -s -I "https://$DOMAIN" | grep -q "$header"; then
        echo -e "${GREEN}✅${NC} $header"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠️${NC}  $header (缺失)"
        ((WARN++))
    fi
done

echo ""
echo "📦 资源检查"
echo "----------------------------"

# 检查关键资源
check "HTML加载" "curl -s -o /dev/null -w '%{http_code}' https://$DOMAIN/" "200"

# CSS检查
CSS_URL=$(curl -s "https://$DOMAIN/" | grep -o 'href="[^"]*\.css' | head -1 | cut -d'"' -f2)
if [ -n "$CSS_URL" ]; then
    CSS_STATUS=$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN$CSS_URL")
    if [ "$CSS_STATUS" = "200" ]; then
        echo -e "${GREEN}✅${NC} CSS加载"
        ((PASS++))
    else
        echo -e "${RED}❌${NC} CSS加载 (状态: $CSS_STATUS)"
        ((FAIL++))
    fi
fi

# JS检查
JS_URL=$(curl -s "https://$DOMAIN/" | grep -o 'src="[^"]*\.js' | head -1 | cut -d'"' -f2)
if [ -n "$JS_URL" ]; then
    JS_STATUS=$(curl -s -o /dev/null -w '%{http_code}' "https://$DOMAIN$JS_URL")
    if [ "$JS_STATUS" = "200" ]; then
        echo -e "${GREEN}✅${NC} JS加载"
        ((PASS++))
    else
        echo -e "${RED}❌${NC} JS加载 (状态: $JS_STATUS)"
        ((FAIL++))
    fi
fi

echo ""
echo "🌐 内容检查"
echo "----------------------------"

# 检查基本内容
CONTENT_CHECKS=(
    "YYC³ AI-PAI"
    "Figma"
    "AI"
)

for content in "${CONTENT_CHECKS[@]}"; do
    if curl -s "https://$DOMAIN/" | grep -q "$content"; then
        echo -e "${GREEN}✅${NC} 包含 '$content'"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠️${NC}  未找到 '$content'"
        ((WARN++))
    fi
done

echo ""
echo "========================================"
echo -e "${BLUE}📊 验证结果:${NC}"
echo -e "${GREEN}✅ 通过: $PASS${NC}"
echo -e "${YELLOW}⚠️  警告: $WARN${NC}"
echo -e "${RED}❌ 失败: $FAIL${NC}"
echo "========================================"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 部署验证通过!${NC}"
    echo -e "${GREEN}🌐 https://$DOMAIN${NC}"
    exit 0
else
    echo -e "${RED}❌ 部署验证失败${NC}"
    exit 1
fi