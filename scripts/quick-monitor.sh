#!/bin/bash
# 快速健康检查脚本

echo "🔍 检查生产环境状态..."

# 网站健康检查
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://code.yyc3.top/)
echo "📡 HTTP状态: $HTTP_STATUS"

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✅ 网站正常"
else
  echo "❌ 网站异常！状态码: $HTTP_STATUS"
  exit 1
fi

# 响应时间检查
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://code.yyc3.top/)
echo "⚡ 响应时间: ${RESPONSE_TIME}s"

if (( $(echo "$RESPONSE_TIME > 2.0" | bc -l) )); then
  echo "⚠️  响应时间超过2秒"
else
  echo "✅ 响应时间正常"
fi

# 关键资源检查
echo "🔗 检查关键资源..."
curl -s -I https://code.yyc3.top/assets/js/index-*.js | head -5

echo "✅ 监控检查完成"
