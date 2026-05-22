#!/bin/bash
# 批量修复 isCyberpunk 未定义问题

echo "🔧 开始批量修复 isCyberpunk 默认值问题..."

files=(
  "src/app/components/ide/IDEChatPanel.tsx"
  "src/app/components/MultiInstancePanel.tsx"
  "src/app/components/DatabasePanel.tsx"
  "src/app/components/CyberEditor.tsx"
  "src/app/components/PreviewEngine.tsx"
  "src/app/components/CollabPanel.tsx"
  "src/app/components/NotificationCenter.tsx"
  "src/app/components/CommandPalette.tsx"
  "src/app/components/AIAssistantPanel.tsx"
  "src/app/components/FullscreenMode.tsx"
  "src/app/components/IDELeftPanel.tsx"
  "src/app/components/DiagnosticsPanel.tsx"
  "src/app/components/LangSwitcher.tsx"
  "src/app/components/QuickActionsPanel.tsx"
  "src/app/components/IDEHeader.tsx"
  "src/app/components/ShortcutCheatSheet.tsx"
  "src/app/components/EditorTabBar.tsx"
  "src/app/components/LivePreview.tsx"
  "src/app/components/IDEMode.tsx"
  "src/app/components/HoloCard.tsx"
  "src/app/components/IDEStatusBar.tsx"
  "src/app/components/ActivityLog.tsx"
  "src/app/components/GitPanel.tsx"
  "src/app/components/CyberpunkBackground.tsx"
  "src/app/components/DetachedWindow.tsx"
  "src/app/components/ModelSettings.tsx"
  "src/app/components/SettingsPanel.tsx"
  "src/app/components/CRDTCollabPanel.tsx"
  "src/app/components/LoadingSkeleton.tsx"
  "src/app/components/AIAssistPanel.tsx"
  "src/app/components/RecentFilesPanel.tsx"
  "src/app/components/StatDetailPanel.tsx"
  "src/app/components/VersionHistoryPanel.tsx"
  "src/app/components/IntelligentWorkflowPanel.tsx"
  "src/app/components/GlobalSearch.tsx"
  "src/app/components/FloatingWidget.tsx"
  "src/app/components/TaskBoard.tsx"
  "src/app/components/ProjectCreateModal.tsx"
  "src/app/components/CodeGenPanel.tsx"
  "src/app/components/SystemPanel.tsx"
)

fixed_count=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # 使用sed替换 isCyberpunk 为 isCyberpunk = false
    if sed -i '' 's/isCyberpunk }/isCyberpunk = false }/g' "$file"; then
      echo "✅ 已修复: $file"
      ((fixed_count++))
    else
      echo "❌ 修复失败: $file"
    fi
  else
    echo "⚠️  文件不存在: $file"
  fi
done

echo ""
echo "🎉 修复完成！共修复了 $fixed_count 个文件"