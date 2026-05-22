#!/bin/bash
# 简化版性能基准线建立脚本

echo "📊 建立性能基准线..."

# 网站可用性检查
AVAILABILITY=$(curl -s -o /dev/null -w "%{http_code}" https://code.yyc3.top/)
echo "📡 可用性: HTTP $AVAILABILITY"

# 响应时间检查
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://code.yyc3.top/)
echo "⚡ 响应时间: ${RESPONSE_TIME}s"

# DNS解析时间
DNS_TIME=$(curl -s -o /dev/null -w "%{time_namelookup}" https://code.yyc3.top/)
echo "🌍 DNS解析: ${DNS_TIME}s"

# 连接时间
CONNECT_TIME=$(curl -s -o /dev/null -w "%{time_connect}" https://code.yyc3.top/)
echo "🔗 连接时间: ${CONNECT_TIME}s"

# SSL握手时间
SSL_TIME=$(curl -s -o /dev/null -w "%{time_appconnect}" https://code.yyc3.top/)
echo "🔒 SSL握手: ${SSL_TIME}s"

# 首字节时间
TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" https://code.yyc3.top/)
echo "📊 首字节时间(TTFB): ${TTFB}s"

# 下载时间
DOWNLOAD_TIME=$(curl -s -o /dev/null -w "%{time_download}" https://code.yyc3.top/)
echo "⬇️  下载时间: ${DOWNLOAD_TIME}s"

# 总页面大小
PAGE_SIZE=$(curl -s https://code.yyc3.top/ | wc -c)
echo "📄 页面大小: $(($PAGE_SIZE / 1024))KB"

# 创建基准线数据
cat > performance-baseline.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "availability": "$AVAILABILITY",
  "responseTime": "$RESPONSE_TIME",
  "dnsTime": "$DNS_TIME",
  "connectTime": "$CONNECT_TIME",
  "sslTime": "$SSL_TIME",
  "ttfb": "$TTFB",
  "downloadTime": "$DOWNLOAD_TIME",
  "pageSize": "$PAGE_SIZE"
}
EOF

echo ""
echo "✅ 性能基准线已保存到 performance-baseline.json"

# 性能评估
echo ""
echo "📊 性能评估:"

if [ "$AVAILABILITY" -eq 200 ]; then
  echo "  ✅ 网站可用性: 正常"
else
  echo "  ❌ 网站可用性: 异常 (HTTP $AVAILABILITY)"
fi

if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
  echo "  ✅ 响应时间: 优秀 (<1s)"
elif (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
  echo "  🟡 响应时间: 良好 (<2s)"
else
  echo "  ❌ 响应时间: 需要改进 (>2s)"
fi

if (( $(echo "$TTFB < 0.6" | bc -l) )); then
  echo "  ✅ 首字节时间: 优秀 (<0.6s)"
elif (( $(echo "$TTFB < 1.0" | bc -l) )); then
  echo "  🟡 首字节时间: 良好 (<1s)"
else
  echo "  ❌ 首字节时间: 需要改进 (>1s)"
fi

echo ""
echo "🎯 基准线建立完成！"