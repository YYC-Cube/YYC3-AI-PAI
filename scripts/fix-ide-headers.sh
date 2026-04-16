#!/bin/bash

# YYC3-AI 批量修复组件标头脚本
# 批量修复组件文件的标头

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
    "ThemeSwitcher.tsx:主题切换器组件，提供主题切换功能:ide,theme,ui,component"
    "IDELayoutContext.tsx:IDE布局上下文，提供IDE布局状态管理:ide,layout,context,react"
    "useOverlayPanels.ts:IDE覆盖面板Hook，管理覆盖面板状态:ide,hook,overlay,react"
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
    if echo "$content" | grep -q "@file"; then
        log_warn "$filename 已有标准标头，跳过"
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
    log_info "开始批量修复 IDE 组件文件标头..."
    
    # 遍历所有 IDE 组件文件
    for entry in "${IDE_FILES[@]}"; do
        fix_header "$entry"
    done
    
    log_info "✓ IDE 组件文件标头批量修复完成！"
}

# 执行主函数
main
