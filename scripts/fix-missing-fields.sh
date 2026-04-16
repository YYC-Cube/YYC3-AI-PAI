#!/bin/bash

# YYC3-AI 批量修复缺失字段脚本
# 批量修复缺少 @author 和 @license 字段的文件

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

# 修复文件标头
fix_header() {
    local file_path=$1
    
    if [ ! -f "$file_path" ]; then
        log_warn "文件不存在: $file_path"
        return
    fi
    
    local filename=$(basename "$file_path")
    log_info "修复 $filename 标头"
    
    # 读取文件内容
    local content=$(cat "$file_path")
    
    # 检查是否已有 @author 字段
    if echo "$content" | grep -q "@author"; then
        log_warn "$filename 已有 @author 字段，跳过"
        return
    fi
    
    # 检查是否有 @file 标记
    if ! echo "$content" | grep -q "@file"; then
        log_warn "$filename 没有 @file 标记，跳过"
        return
    fi
    
    # 使用 sed 添加缺失的字段
    sed -i '' '/@file/a\
 * @author YanYuCloudCube Team <admin@0379.email>' "$file_path"
    
    # 检查是否有 @license 字段
    if ! echo "$content" | grep -q "@license"; then
        sed -i '' '/@status/a\
 * @license MIT' "$file_path"
    fi
    
    log_info "✓ 已修复 $filename"
}

# 主函数
main() {
    log_info "开始批量修复缺失字段..."
    
    # 查找所有需要修复的文件
    find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
        fix_header "$file"
    done
    
    log_info "✓ 缺失字段批量修复完成！"
}

# 执行主函数
main
