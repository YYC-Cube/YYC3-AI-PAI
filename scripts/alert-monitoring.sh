#!/bin/bash
# 监控告警检查

echo "🚨 检查告警条件..."

# 检查错误率
ERROR_RATE=$(curl -s https://code.yyc3.top/api/health | jq '.errorRate // 0')

if (( $(echo "$ERROR_RATE > 0.1" | bc -l) )); then
  echo "❌ 错误率过高: $ERROR_RATE%"
  # 这里可以触发告警通知
else
  echo "✅ 错误率正常: $ERROR_RATE%"
fi

# 检查响应时间
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://code.yyc3.top/)
if (( $(echo "$RESPONSE_TIME > 5.0" | bc -l) )); then
  echo "❌ 响应时间过长: ${RESPONSE_TIME}s"
else
  echo "✅ 响应时间正常: ${RESPONSE_TIME}s"
fi

echo "✅ 告警检查完成"
