#!/bin/bash

# YYC3-AI 清理重复标头脚本
# 清理文件中的重复标头，只保留标准团队标头

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

# 清理文件中的重复标头
clean_duplicate_headers() {
    local file_path=$1
    local filename=$(basename "$file_path")
    
    log_info "清理 $filename 重复标头"
    
    # 读取文件内容
    local content=$(cat "$file_path")
    
    # 找到第一个标头结束位置
    local first_end=$(echo "$content" | grep -n "^ \*/$" | head -1 | cut -d':' -f1)
    
    if [ -z "$first_end" ]; then
        log_warn "$filename 没有标头结束标记"
        return
    fi
    
    # 提取第一个标头之后的内容
    local new_content=$(echo "$content" | tail -n +$((first_end + 1)))
    
    # 写入新内容
    echo "$new_content" > "${file_path}.tmp"
    
    # 替换原文件
    mv "${file_path}.tmp" "$file_path"
    
    log_info "✓ 已清理 $filename"
}

# 主函数
main() {
    log_info "开始清理重复标头..."
    
    # 查找所有 Store 文件
    find src/app/store -name "*.ts" -o -name "*.tsx" | while read -r file; do
        clean_duplicate_headers "$file"
    done
    
    log_info "✓ 重复标头清理完成！"
}

# 执行主函数
main
