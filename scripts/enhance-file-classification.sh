#!/bin/bash

# YYC3-AI 文件分类完善脚本
# 为不同类型的文件添加详细的分类和标签

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

# 为 Store 文件添加详细标签
enhance_store_files() {
    log_info "完善 Store 文件分类..."
    
    local store_files=(
        "src/app/store/theme-store.ts:theme,ui,state-management,critical"
        "src/app/store/ide-store.ts:ide,editor,state-management,critical"
        "src/app/store/settings-store.ts:settings,configuration,state-management"
        "src/app/store/project-store.ts:project,state-management,core"
        "src/app/store/editor-prefs-store.ts:editor,preferences,state-management"
        "src/app/store/panel-dnd-store.ts:panel,drag-drop,state-management"
        "src/app/store/shortcut-store.ts:shortcut,keyboard,state-management"
        "src/app/store/mcp-store.ts:mcp,ai,state-management"
        "src/app/store/quick-actions-store.ts:quick-actions,ai,state-management"
        "src/app/store/model-store.tsx:model,ai,state-management"
        "src/app/store/db-store.ts:database,storage,state-management"
        "src/app/store/crypto-store.ts:crypto,security,state-management"
        "src/app/store/file-store.ts:file,storage,state-management"
        "src/app/store/offline-store.ts:offline,sync,state-management"
        "src/app/store/task-store.ts:task,state-management,ai"
        "src/app/store/ai-metrics-store.ts:ai,metrics,state-management"
        "src/app/store/preview-store.ts:preview,state-management,core"
        "src/app/store/multi-instance-store.ts:multi-instance,state-management,core"
        "src/app/store/activity-store.ts:activity,logging,state-management"
        "src/app/store/plugin-store.ts:plugin,state-management,core"
        "src/app/store/collab-store.ts:collaboration,state-management,core"
    )
    
    for entry in "${store_files[@]}"; do
        local file="${entry%%:*}"
        local tags="${entry##*:}"
        
        if [ -f "$file" ]; then
            log_info "更新 $file 标签: $tags"
            sed -i '' "s/@tags .*/@tags $tags/" "$file"
        fi
    done
}

# 为组件文件添加详细标签
enhance_component_files() {
    log_info "完善组件文件分类..."
    
    local component_files=(
        "src/app/components/SettingsPanel.tsx:panel,settings,ui,critical"
        "src/app/components/MultiInstancePanel.tsx:panel,multi-instance,ui"
        "src/app/components/NotificationCenter.tsx:panel,notification,ui"
        "src/app/components/DiagnosticsPanel.tsx:panel,diagnostics,ui"
        "src/app/components/QuickActionsPanel.tsx:panel,quick-actions,ai,ui"
        "src/app/components/ShortcutCheatSheet.tsx:panel,shortcut,ui"
        "src/app/components/ActivityLog.tsx:panel,activity,ui"
        "src/app/components/GitPanel.tsx:panel,git,version-control,ui"
        "src/app/components/SnippetManager.tsx:panel,snippet,code,ui"
        "src/app/components/AIAssistPanel.tsx:panel,ai,assistant,ui"
        "src/app/components/GlobalSearch.tsx:component,search,ui"
        "src/app/components/TaskBoard.tsx:panel,task,ai,ui"
        "src/app/components/CodeGenPanel.tsx:panel,code-generation,ai,ui"
        "src/app/components/PerformanceDashboard.tsx:panel,performance,metrics,ui"
        "src/app/components/SystemPanel.tsx:panel,system,ui"
        "src/app/components/FloatingWidget.tsx:component,floating,ui"
        "src/app/components/FullscreenMode.tsx:component,fullscreen,ui"
        "src/app/components/IDEHeader.tsx:component,header,ide,ui"
        "src/app/components/CyberTooltip.tsx:component,tooltip,ui"
        "src/app/components/ProjectCreateModal.tsx:component,modal,project,ui"
        "src/app/components/PanelDropZone.tsx:component,drop-zone,drag-drop,ui"
        "src/app/components/LoadingSkeleton.tsx:component,skeleton,loading,ui"
        "src/app/components/GlitchText.tsx:component,text,glitch,ui"
        "src/app/components/FileContextMenu.tsx:component,context-menu,file,ui"
        "src/app/components/ModelSettings.tsx:component,settings,ai,ui"
        "src/app/components/ImageWithFallback.tsx:component,image,fallback,ui"
        "src/app/components/DetachedWindow.tsx:component,window,ui"
        "src/app/components/CyberpunkBackground.tsx:component,background,theme,ui"
        "src/app/components/IDEStatusBar.tsx:component,status-bar,ide,ui"
        "src/app/components/HoloCard.tsx:component,card,holographic,ui"
        "src/app/components/IDEMode.tsx:component,mode,ide,ui"
        "src/app/components/LivePreview.tsx:component,preview,real-time,ui"
        "src/app/components/CyberToast.tsx:component,toast,notification,ui"
        "src/app/components/EditorTabBar.tsx:component,tab-bar,editor,ui"
        "src/app/components/LangSwitcher.tsx:component,language,i18n,ui"
        "src/app/components/IDELeftPanel.tsx:component,panel,ide,ui"
        "src/app/components/CommandPalette.tsx:component,command,palette,ui"
        "src/app/components/CollabPanel.tsx:panel,collaboration,ui"
        "src/app/components/PreviewEngine.tsx:component,preview,engine,ui"
        "src/app/components/ThemePreview.tsx:component,preview,theme,ui"
        "src/app/components/CyberEditor.tsx:component,editor,code,ui"
        "src/app/components/DatabasePanel.tsx:panel,database,ui"
        "src/app/components/ThemeSwitcher.tsx:component,theme,switcher,ui"
        "src/app/components/VersionHistoryPanel.tsx:panel,version-control,history,ui"
        "src/app/components/RecentFilesPanel.tsx:panel,files,recent,ui"
        "src/app/components/StatDetailPanel.tsx:panel,statistics,detail,ui"
    )
    
    for entry in "${component_files[@]}"; do
        local file="${entry%%:*}"
        local tags="${entry##*:}"
        
        if [ -f "$file" ]; then
            log_info "更新 $file 标签: $tags"
            sed -i '' "s/@tags .*/@tags $tags/" "$file"
        fi
    done
}

# 为 UI 组件添加详细标签
enhance_ui_files() {
    log_info "完善 UI 组件分类..."
    
    local ui_files=(
        "src/app/components/ui/button.tsx:ui,button,component"
        "src/app/components/ui/input.tsx:ui,input,form,component"
        "src/app/components/ui/textarea.tsx:ui,textarea,form,component"
        "src/app/components/ui/select.tsx:ui,select,form,component"
        "src/app/components/ui/checkbox.tsx:ui,checkbox,form,component"
        "src/app/components/ui/toggle.tsx:ui,toggle,form,component"
        "src/app/components/ui/switch.tsx:ui,switch,form,component"
        "src/app/components/ui/dialog.tsx:ui,dialog,modal,component"
        "src/app/components/ui/alert-dialog.tsx:ui,alert,dialog,component"
        "src/app/components/ui/drawer.tsx:ui,drawer,modal,component"
        "src/app/components/ui/sheet.tsx:ui,sheet,modal,component"
        "src/app/components/ui/tooltip.tsx:ui,tooltip,component"
        "src/app/components/ui/popover.tsx:ui,popover,dropdown,component"
        "src/app/components/ui/dropdown-menu.tsx:ui,dropdown,menu,component"
        "src/app/components/ui/context-menu.tsx:ui,context-menu,component"
        "src/app/components/ui/menubar.tsx:ui,menubar,navigation,component"
        "src/app/components/ui/navigation-menu.tsx:ui,navigation,menu,component"
        "src/app/components/ui/tabs.tsx:ui,tabs,navigation,component"
        "src/app/components/ui/toggle-group.tsx:ui,toggle-group,form,component"
        "src/app/components/ui/radio-group.tsx:ui,radio-group,form,component"
        "src/app/components/ui/card.tsx:ui,card,container,component"
        "src/app/components/ui/hover-card.tsx:ui,card,hover,component"
        "src/app/components/ui/separator.tsx:ui,separator,layout,component"
        "src/app/components/ui/sidebar.tsx:ui,sidebar,layout,component"
        "src/app/components/ui/breadcrumb.tsx:ui,breadcrumb,navigation,component"
        "src/app/components/ui/badge.tsx:ui,badge,indicator,component"
        "src/app/components/ui/avatar.tsx:ui,avatar,user,component"
        "src/app/components/ui/alert.tsx:ui,alert,notification,component"
        "src/app/components/ui/skeleton.tsx:ui,skeleton,loading,component"
        "src/app/components/ui/table.tsx:ui,table,data,component"
        "src/app/components/ui/pagination.tsx:ui,pagination,navigation,component"
        "src/app/components/ui/slider.tsx:ui,slider,form,component"
        "src/app/components/ui/progress.tsx:ui,progress,indicator,component"
        "src/app/components/ui/scroll-area.tsx:ui,scroll,container,component"
        "src/app/components/ui/resizable.tsx:ui,resizable,layout,component"
        "src/app/components/ui/collapsible.tsx:ui,collapsible,layout,component"
        "src/app/components/ui/accordion.tsx:ui,accordion,collapsible,component"
        "src/app/components/ui/calendar.tsx:ui,calendar,date,component"
        "src/app/components/ui/chart.tsx:ui,chart,data,visualization,component"
        "src/app/components/ui/carousel.tsx:ui,carousel,slider,component"
        "src/app/components/ui/command.tsx:ui,command,palette,component"
        "src/app/components/ui/input-otp.tsx:ui,input,otp,form,component"
        "src/app/components/ui/aspect-ratio.tsx:ui,aspect-ratio,layout,component"
        "src/app/components/ui/sonner.tsx:ui,toast,notification,component"
        "src/app/components/ui/label.tsx:ui,label,form,component"
        "src/app/components/ui/utils.ts:ui,utils,helper"
        "src/app/components/ui/use-mobile.ts:ui,hook,mobile,responsive"
    )
    
    for entry in "${ui_files[@]}"; do
        local file="${entry%%:*}"
        local tags="${entry##*:}"
        
        if [ -f "$file" ]; then
            log_info "更新 $file 标签: $tags"
            sed -i '' "s/@tags .*/@tags $tags/" "$file"
        fi
    done
}

# 为 IDE 组件添加详细标签
enhance_ide_files() {
    log_info "完善 IDE 组件分类..."
    
    local ide_files=(
        "src/app/components/ide/IDEFileExplorer.tsx:ide,file-explorer,ui"
        "src/app/components/ide/IDETerminal.tsx:ide,terminal,ui"
        "src/app/components/ide/IDECodeEditorPanel.tsx:ide,editor,code,ui"
        "src/app/components/ide/IDEChatPanel.tsx:ide,chat,ai,ui"
        "src/app/components/ide/FileTreeNode.tsx:ide,file-tree,component"
        "src/app/components/ide/IDEOverlays.tsx:ide,overlay,ui"
        "src/app/components/ide/IDELayoutContext.tsx:ide,layout,context"
        "src/app/components/ide/ide-mock-data.ts:ide,mock-data,test"
        "src/app/components/ide/useIDEPanelResize.ts:ide,hook,resize"
        "src/app/components/ide/useIDEKeyboard.ts:ide,hook,keyboard"
        "src/app/components/ide/useAutoSave.ts:ide,hook,auto-save"
        "src/app/components/ide/useOverlayPanels.ts:ide,hook,overlay"
    )
    
    for entry in "${ide_files[@]}"; do
        local file="${entry%%:*}"
        local tags="${entry##*:}"
        
        if [ -f "$file" ]; then
            log_info "更新 $file 标签: $tags"
            sed -i '' "s/@tags .*/@tags $tags/" "$file"
        fi
    done
}

# 为设置组件添加详细标签
enhance_settings_files() {
    log_info "完善设置组件分类..."
    
    local settings_files=(
        "src/app/components/settings/WorkspaceTabs.tsx:settings,workspace,tabs,ui"
        "src/app/components/settings/AIServiceTabs.tsx:settings,ai-service,tabs,ui"
        "src/app/components/settings/SettingsShared.tsx:settings,shared,utils"
    )
    
    for entry in "${settings_files[@]}"; do
        local file="${entry%%:*}"
        local tags="${entry##*:}"
        
        if [ -f "$file" ]; then
            log_info "更新 $file 标签: $tags"
            sed -i '' "s/@tags .*/@tags $tags/" "$file"
        fi
    done
}

# 为工具文件添加详细标签
enhance_utils_files() {
    log_info "完善工具文件分类..."
    
    local utils_files=(
        "src/app/hooks/useKeyboardShortcuts.ts:hook,keyboard,shortcut,react"
        "src/app/i18n/translations.ts:i18n,translations,locale"
        "src/app/i18n/context.tsx:i18n,context,react"
        "src/app/types.ts:types,typescript,core"
        "src/main.tsx:main,entry,react"
        "src/app/App.tsx:app,root,react"
    )
    
    for entry in "${utils_files[@]}"; do
        local file="${entry%%:*}"
        local tags="${entry##*:}"
        
        if [ -f "$file" ]; then
            log_info "更新 $file 标签: $tags"
            sed -i '' "s/@tags .*/@tags $tags/" "$file"
        fi
    done
}

# 主函数
main() {
    log_info "开始完善文件分类..."
    
    enhance_store_files
    enhance_component_files
    enhance_ui_files
    enhance_ide_files
    enhance_settings_files
    enhance_utils_files
    
    log_info "✓ 文件分类完善完成！"
}

# 执行主函数
main
