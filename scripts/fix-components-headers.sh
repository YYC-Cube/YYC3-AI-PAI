#!/bin/bash

# YYC3-AI 批量修复组件标头脚本
# 批量修复剩余组件文件的标头

set -euo pipefail

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 组件文件列表
COMPONENT_FILES=(
    "SettingsShared.tsx:设置共享组件，提供设置共享功能:settings,shared,utils"
    "AIServiceTabs.tsx:AI服务标签页组件，提供AI服务标签页:settings,ai-service,tabs,ui,component"
    "WorkspaceTabs.tsx:工作区标签页组件，提供工作区标签页:settings,workspace,tabs,ui,component"
    "PerformanceDashboard.tsx:性能仪表板组件，提供性能监控:panel,performance,ui,component"
    "DatabasePanel.tsx:数据库面板组件，提供数据库管理:panel,database,ui,component"
    "CyberEditor.tsx:赛博编辑器组件，提供代码编辑功能:editor,code,ui,component"
    "ThemePreview.tsx:主题预览组件，提供主题预览功能:theme,preview,ui,component"
    "PreviewEngine.tsx:预览引擎组件，提供实时预览:preview,engine,ui,component"
    "CollabPanel.tsx:协作面板组件，提供协作功能:panel,collaboration,ui,component"
    "NotificationCenter.tsx:通知中心组件，提供通知管理:panel,notification,ui,component"
    "CommandPalette.tsx:命令面板组件，提供命令执行:panel,command,ui,component"
    "DiagnosticsPanel.tsx:诊断面板组件，提供诊断信息:panel,diagnostics,ui,component"
    "LangSwitcher.tsx:语言切换器组件，提供语言切换:language,switcher,ui,component"
    "ShortcutCheatSheet.tsx:快捷键提示组件，提供快捷键帮助:shortcut,help,ui,component"
    "EditorTabBar.tsx:编辑器标签栏组件，提供标签页管理:editor,tabs,ui,component"
    "LivePreview.tsx:实时预览组件，提供实时预览:preview,live,ui,component"
    "IDEMode.tsx:IDE模式组件，提供IDE模式切换:ide,mode,ui,component"
    "HoloCard.tsx:全息卡片组件，提供全息效果:card,hologram,ui,component"
    "ActivityLog.tsx:活动日志组件，提供活动记录:activity,log,ui,component"
    "GitPanel.tsx:Git面板组件，提供Git功能:panel,git,ui,component"
    "CyberpunkBackground.tsx:赛博朋克背景组件，提供背景效果:background,cyberpunk,ui,component"
    "DetachedWindow.tsx:分离窗口组件，提供窗口管理:window,management,ui,component"
    "ModelSettings.tsx:模型设置组件，提供模型配置:settings,model,ai,ui,component"
    "FileContextMenu.tsx:文件上下文菜单组件，提供文件菜单:context-menu,file,ui,component"
    "GlitchText.tsx:故障文本组件，提供故障效果:text,glitch,ui,component"
    "LoadingSkeleton.tsx:加载骨架组件，提供加载状态:loading,skeleton,ui,component"
    "SnippetManager.tsx:代码片段管理器组件，提供代码片段管理:snippet,manager,ui,component"
    "AIAssistPanel.tsx:AI助手面板组件，提供AI助手功能:panel,ai,assist,ui,component"
    "RecentFilesPanel.tsx:最近文件面板组件，提供最近文件管理:panel,recent,files,ui,component"
    "StatDetailPanel.tsx:统计详情面板组件，提供统计信息:panel,stat,detail,ui,component"
    "VersionHistoryPanel.tsx:版本历史面板组件，提供版本历史:panel,version,history,ui,component"
    "GlobalSearch.tsx:全局搜索组件，提供全局搜索功能:search,global,ui,component"
    "FloatingWidget.tsx:浮动组件，提供浮动窗口:widget,floating,ui,component"
    "TaskBoard.tsx:任务板组件，提供任务管理:panel,task,ui,component"
    "ProjectCreateModal.tsx:项目创建模态框组件，提供项目创建:modal,project,create,ui,component"
)

# 修复文件标头
fix_header() {
    local entry=$1
    local filename=$(echo "$entry" | cut -d':' -f1)
    local description=$(echo "$entry" | cut -d':' -f2)
    local tags=$(echo "$entry" | cut -d':' -f3)
    
    local file_path="src/app/components/$filename"
    
    if [ ! -f "$file_path" ]; then
        log_warn "文件不存在: $file_path"
        return
    fi
    
    log_info "修复 $filename 标头"
    
    # 读取文件内容
    local content=$(cat "$file_path")
    
    # 检查是否已有完整标头
    if echo "$content" | grep -q "@created"; then
        log_warn "$filename 已有完整标头，跳过"
        return
    fi
    
    # 找到第一个标头结束位置
    local first_end=$(echo "$content" | grep -n "^ \*/$" | head -1 | cut -d':' -f1)
    
    if [ -z "$first_end" ]; then
        log_warn "$filename 没有标头结束标记"
        return
    fi
    
    # 提取第一个标头之后的内容
    local code_content=$(echo "$content" | tail -n +$((first_end + 1)))
    
    # 生成标准标头
    local standard_header=$(cat << EOF
/**
 * @file ${filename}
 * @description ${description}
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-19
 * @updated 2026-03-19
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags ${tags}
 */

EOF
)
    
    # 写入新内容
    echo "$standard_header" > "${file_path}.tmp"
    echo "$code_content" >> "${file_path}.tmp"
    
    # 替换原文件
    mv "${file_path}.tmp" "$file_path"
    
    log_info "✓ 已修复 $filename"
}

# 主函数
main() {
    log_info "开始批量修复组件文件标头..."
    
    # 遍历所有组件文件
    for entry in "${COMPONENT_FILES[@]}"; do
        fix_header "$entry"
    done
    
    log_info "✓ 组件文件标头批量修复完成！"
}

# 执行主函数
main
