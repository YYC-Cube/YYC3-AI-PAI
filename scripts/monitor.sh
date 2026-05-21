#!/bin/bash

# ============================================
# YYC³ AI-PAI - 部署监控脚本
# ============================================

set -e

DOMAIN="${1:-ai-pai.yyc3.top}"
CHECK_INTERVAL=30
MAX_CHECKS=10

echo "📊 监控部署状态: https://$DOMAIN"
echo "========================================"

for i in $(seq 1 $MAX_CHECKS); do
    echo "🏥 健康检查 $i/$MAX_CHECKS..."

    # HTTP状态检查
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" || echo "000")

    # 响应时间检查
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "https://$DOMAIN" || echo "0")

    # SSL证书检查
    SSL_DAYS=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)

    echo "   HTTP状态: $HTTP_STATUS"
    echo "   响应时间: ${RESPONSE_TIME}s"
    echo "   SSL到期: $SSL_DAYS"

    # 检查关键资源
    echo "   关键资源检查:"

    # 检查CSS
    CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/assets/css/index" || echo "000")
    echo "     CSS: $CSS_STATUS"

    # 检查JS
    JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/assets/js/index" || echo "000")
    echo "     JS: $JS_STATUS"

    # 判断健康状态
    if [ "$HTTP_STATUS" = "200" ] && [ $(echo "$RESPONSE_TIME < 2.0" | bc -l 2>/dev/null || echo "0") -eq 1 ]; then
        echo "✅ 部署状态健康!"
        exit 0
    fi

    if [ $i -lt $MAX_CHECKS ]; then
        echo "⏳ 等待 ${CHECK_INTERVAL}秒后重试..."
        sleep $CHECK_INTERVAL
    fi
done

echo "⚠️ 监控完成，可能存在性能问题"
echo "请手动检查: https://$DOMAIN"