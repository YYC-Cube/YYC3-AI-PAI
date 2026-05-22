#!/bin/bash
# 建立性能基准线

echo "📊 建立性能基准线..."

# 运行Lighthouse测试
echo "🚀 运行Lighthouse性能测试..."
npx lighthouse https://code.yyc3.top/ \
  --output=json \
  --output-path=./lighthouse-report.json \
  --quiet

# 提取关键指标
LCP=$(jq '.audits["largest-contentful-paint"].displayValue' lighthouse-report.json)
FID=$(jq '.audits["max-potential-fid"].displayValue' lighthouse-report.json)
CLS=$(jq '.audits["cumulative-layout-shift"].displayValue' lighthouse-report.json)
PERFORMANCE=$(jq '.categories[0].score' lighthouse-report.json)

echo "📈 性能基准线:"
echo "  LCP: $LCP"
echo "  FID: $FID"
echo "  CLS: $CLS"
echo "  性能分数: $PERFORMANCE"

# 保存基准线数据
cat > performance-baseline.json << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "lcp": "$LCP",
  "fid": "$FID",
  "cls": "$CLS",
  "performance": "$PERFORMANCE"
}
