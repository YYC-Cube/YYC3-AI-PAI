#!/bin/bash

# ============================================
# YYC³ AI-PAI - 实时部署监控仪表板
# ============================================

DOMAIN="${1:-ai-pai.yyc3.top}"
INTERVAL=5

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# 清屏并显示标题
clear
echo -e "${CYAN}${BOLD}🚀 YYC³ AI-PAI - 实时部署监控仪表板${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "域名: ${BOLD}https://$DOMAIN${NC}"
echo -e "监控间隔: ${INTERVAL}秒"
echo -e "开始时间: $(date)"
echo -e "${BLUE}========================================${NC}"
echo ""

# 监控函数
monitor() {
    local iteration=1

    while true; do
        # 创建当前状态
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null || echo "000")
        TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" https://$DOMAIN 2>/dev/null || echo "0.00")
        TOTAL_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://$DOMAIN 2>/dev/null || echo "0.00")
        SPEED=$(curl -s -o /dev/null -w "%{speed_download}" https://$DOMAIN 2>/dev/null || echo "0")

        # 转换单位
        SPEED_MB=$(echo "scale=2; $SPEED / 1024 / 1024" | bc)
        SIZE_MB=$(curl -s -o /dev/null -w "%{size_download}" https://$DOMAIN 2>/dev/null | awk '{print $1/1024/1024}')

        # 状态判断
        if [ "$STATUS" = "200" ]; then
            STATUS_COLOR="$GREEN"
            STATUS_TEXT="✅ 在线"
        else
            STATUS_COLOR="$RED"
            STATUS_TEXT="❌ 离线"
        fi

        # 性能判断
        if [ $(echo "$TOTAL_TIME < 1.0" | bc) -eq 1 ]; then
            PERF_COLOR="$GREEN"
            PERF_TEXT="优秀"
        elif [ $(echo "$TOTAL_TIME < 2.0" | bc) -eq 1 ]; then
            PERF_COLOR="$YELLOW"
            PERF_TEXT="良好"
        else
            PERF_COLOR="$RED"
            PERF_TEXT="慢"
        fi

        # 显示监控数据
        echo -e "${BLUE}📊 监控周期 #$iteration - $(date +%H:%M:%S)${NC}"
        echo "┌─────────────────────────────────────────────────┐"
        echo "│ ${BOLD}状态${NC}          │ $STATUS_COLOR$STATUS_TEXT${NC} ($STATUS)${NC} │"
        echo "├─────────────────────────────────────────────────┤"
        echo "│ ${BOLD}首字节时间${NC}    │ ${TTFB}s${NC}                            │"
        echo "│ ${BOLD}总响应时间${NC}    │ ${PERF_COLOR}${TOTAL_TIME}s${NC} (${PERF_TEXT})${NC}                   │"
        echo "│ ${BOLD}下载速度${NC}      │ ${SPEED_MB} MB/s${NC}                          │"
        echo "│ ${BOLD}传输大小${NC}      │ ${SIZE_MB} MB${NC}                             │"
        echo "└─────────────────────────────────────────────────┘"

        # SSL检查
        SSL_INFO=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
        if [ -n "$SSL_INFO" ]; then
            SSL_EXPIRE=$(echo "$SSL_INFO" | grep "notAfter" | cut -d= -f2)
            echo -e "📅 SSL到期: ${CYAN}$SSL_EXPIRE${NC}"
        fi

        # DNS检查
        DNS_IP=$(dig +short $DOMAIN | head -1)
        echo -e "🌐 DNS: ${CYAN}$DNS_IP${NC}"

        # 服务器信息
        SERVER=$(curl -s -I https://$DOMAIN 2>/dev/null | grep -i "Server:" | cut -d' ' -f2)
        if [ -n "$SERVER" ]; then
            echo -e "🖥️  服务器: ${CYAN}$SERVER${NC}"
        fi

        echo ""
        echo "按 Ctrl+C 停止监控"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        ((iteration++))
        sleep $INTERVAL
    done
}

# 信号处理
trap 'echo -e "\n${YELLOW}⏸️  监控已停止${NC}"; exit 0' INT TERM

# 开始监控
monitor