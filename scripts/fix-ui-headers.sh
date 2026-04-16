#!/bin/bash

# YYC3-AI 批量修复 UI 组件标头脚本
# 批量修复 UI 组件文件的标头

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

# UI 组件文件列表
UI_FILES=(
    "aspect-ratio.tsx:宽高比组件，提供宽高比控制:ui,aspect-ratio,layout,component"
    "alert-dialog.tsx:警告对话框组件，提供警告对话框功能:ui,alert,dialog,component"
    "pagination.tsx:分页组件，提供分页功能:ui,pagination,navigation,component"
    "tabs.tsx:标签页组件，提供标签页切换功能:ui,tabs,navigation,component"
    "card.tsx:卡片组件，提供卡片容器:ui,card,container,component"
    "slider.tsx:滑块组件，提供滑块输入:ui,slider,form,component"
    "popover.tsx:弹出框组件，提供弹出框功能:ui,popover,dropdown,component"
    "progress.tsx:进度条组件，提供进度显示:ui,progress,indicator,component"
    "input-otp.tsx:OTP输入组件，提供OTP输入功能:ui,input,otp,form,component"
    "chart.tsx:图表组件，提供数据可视化:ui,chart,data,visualization,component"
    "hover-card.tsx:悬停卡片组件，提供悬停显示功能:ui,card,hover,component"
    "sheet.tsx:侧边栏组件，提供侧边栏功能:ui,sheet,modal,component"
    "scroll-area.tsx:滚动区域组件，提供滚动容器:ui,scroll,container,component"
    "resizable.tsx:可调整大小组件，提供大小调整功能:ui,resizable,layout,component"
)

# 修复文件标头
fix_header() {
    local entry=$1
    local filename=$(echo "$entry" | cut -d':' -f1)
    local description=$(echo "$entry" | cut -d':' -f2)
    local tags=$(echo "$entry" | cut -d':' -f3)
    
    local file_path="src/app/components/ui/$filename"
    
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
    log_info "开始批量修复 UI 组件文件标头..."
    
    # 遍历所有 UI 组件文件
    for entry in "${UI_FILES[@]}"; do
        fix_header "$entry"
    done
    
    log_info "✓ UI 组件文件标头批量修复完成！"
}

# 执行主函数
main
