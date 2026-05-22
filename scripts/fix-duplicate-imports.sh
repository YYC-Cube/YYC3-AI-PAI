#!/bin/bash
# 修复重复导入的脚本

echo "🔧 开始修复重复导入问题..."

# 找到所有有重复导入错误的文件并修复
files=(
  "src/app/components/ide/IDEChatPanel.tsx"
  "src/app/components/settings/AIServiceTabs.tsx"
  "src/app/hooks/usePerformanceMonitor.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 处理: $file"
    # 这里需要手动处理每个文件
  fi
done

echo "⚠️  一些重复导入需要手动修复"