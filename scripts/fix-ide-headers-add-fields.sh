#!/bin/bash

# YYC3-AI 批量修复 IDE 组件标头脚本
# 批量修复 IDE 组件文件的标头，添加缺失的字段

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

# IDE 组件文件列表
IDE_FILES=(
    "IDEOverlays.tsx:IDE覆盖面板组件，显示各种覆盖面板:ide,overlay,ui,component"
    "useAutoSave.ts:自动保存Hook，提供自动保存功能:ide,hook,auto-save,react"
    "useIDEKeyboard.ts:IDE键盘Hook，管理IDE键盘快捷键:ide,hook,keyboard,react"
    "FileTreeNode.tsx:文件树节点组件，显示文件树节点:ide,file-tree,component"
    "useIDEPanelResize.ts:IDE面板调整Hook，管理面板大小调整:ide,hook,resize,react"
    "IDEChatPanel.tsx:IDE聊天面板组件，提供AI聊天功能:ide,chat,ai,ui,component"
    "IDECodeEditorPanel.tsx:IDE代码编辑器面板组件，提供代码编辑功能:ide,editor,code,ui,component"
    "IDETerminal.tsx:IDE终端面板组件，提供终端功能:ide,terminal,ui,component"
    "ide-mock-data.ts:IDE模拟数据，提供测试数据:ide,mock-data,test"
    "IDEFileExplorer.tsx:IDE文件浏览器组件，提供文件浏览功能:ide,file-explorer,ui,component"
)

# 修复文件标头
fix_header() {
    local entry=$1
    local filename=$(echo "$entry" | cut -d':' -f1)
    local description=$(echo "$entry" | cut -d':' -f2)
    local tags=$(echo "$entry" | cut -d':' -f3)
    
    local file_path="src/app/components/ide/$filename"
    
    if [ ! -f "$file_path" ]; then
        log_warn "文件不存在: $file_path"
        return
    fi
    
    log_info "修复 $filename 标头"
    
    # 读取文件内容
    local content=$(cat "$file_path")
    
    # 检查是否已有标准标头
    if echo "$content" | grep -q "@created"; then
        log_warn "$filename 已有完整标头，跳过"
        return
    fi
    
    # 检查是否有 @file 标记
    if ! echo "$content" | grep -q "@file"; then
        log_warn "$filename 没有 @file 标记，跳过"
        return
    fi
    
    # 使用 sed 添加缺失的字段
    sed -i '' '/@version/a\
 * @created 2026-03-19\
 * @updated 2026-03-19\
 * @status stable\
 * @copyright Copyright (c) 2026 YanYuCloudCube Team\
 * @tags '"$tags"'
' "$file_path"
    
    log_info "✓ 已修复 $filename"
}

# 主函数
main() {
    log_info "开始批量修复 IDE 组件文件标头..."
    
    # 遍历所有 IDE 组件文件
    for entry in "${IDE_FILES[@]}"; do
        fix_header "$entry"
    done
    
    log_info "✓ IDE 组件文件标头批量修复完成！"
}

# 执行主函数
main
