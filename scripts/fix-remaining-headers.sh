#!/bin/bash

# YYC3-AI 批量修复剩余组件标头脚本
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

# 剩余组件文件列表
REMAINING_FILES=(
    "PanelDropZone.tsx:面板拖拽区域组件，提供拖拽区域功能:panel,drag-drop,ui,component"
    "CodeGenPanel.tsx:代码生成面板组件，提供AI代码生成功能:panel,code-gen,ai,ui,component"
    "ErrorBoundary.tsx:错误边界组件，提供错误捕获功能:error-boundary,ui,component"
    "SystemPanel.tsx:系统面板组件，提供系统信息功能:panel,system,ui,component"
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
    
    # 检查是否已有标准标头
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
    log_info "开始批量修复剩余组件文件标头..."
    
    # 遍历所有剩余组件文件
    for entry in "${REMAINING_FILES[@]}"; do
        fix_header "$entry"
    done
    
    log_info "✓ 剩余组件文件标头批量修复完成！"
}

# 执行主函数
main
