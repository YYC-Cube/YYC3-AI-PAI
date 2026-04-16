#!/bin/bash

# YYC3-AI 标头验证脚本
# 验证所有代码文件的标头是否符合团队规范

set -euo pipefail

# 配置
REQUIRED_FIELDS=(
    "@file"
    "@description"
    "@author"
    "@version"
    "@created"
    "@updated"
    "@status"
)

OPTIONAL_FIELDS=(
    "@license"
    "@copyright"
    "@tags"
)

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 统计变量
TOTAL_FILES=0
VALID_FILES=0
INVALID_FILES=0
WARNING_FILES=0

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_file() {
    echo -e "${BLUE}[FILE]${NC} $1"
}

# 验证单个文件
validate_file() {
    local file_path=$1
    local filename=$(basename "$file_path")
    local has_errors=false
    local has_warnings=false
    
    # 检查文件是否存在
    if [ ! -f "$file_path" ]; then
        log_error "文件不存在: $file_path"
        return 1
    fi
    
    # 检查文件类型
    if [[ $file_path != *.ts && $file_path != *.tsx && $file_path != *.js && $file_path != *.jsx ]]; then
        return 0
    fi
    
    # 跳过测试文件
    if [[ $file_path == *.test.* ]]; then
        return 0
    fi
    
    log_file "验证: $filename"
    
    # 读取文件前 50 行
    local header=$(head -n 50 "$file_path")
    
    # 检查是否有标头
    if ! echo "$header" | grep -q "^/\*\*$"; then
        log_error "  ✗ 缺少标头"
        ((INVALID_FILES++))
        return 1
    fi
    
    # 验证必填字段
    for field in "${REQUIRED_FIELDS[@]}"; do
        if ! echo "$header" | grep -q "$field"; then
            log_error "  ✗ 缺少必填字段: $field"
            has_errors=true
        fi
    done
    
    # 验证版本号格式
    local version=$(echo "$header" | grep -o '@version [^*]*' | sed 's/@version //' | head -1)
    if [ -n "$version" ]; then
        if [[ ! $version =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            log_warn "  ⚠ 版本号格式不正确: $version (应为 v1.0.0 格式)"
            has_warnings=true
        fi
    fi
    
    # 验证日期格式
    local created=$(echo "$header" | grep -o '@created [^*]*' | sed 's/@created //' | head -1)
    local updated=$(echo "$header" | grep -o '@updated [^*]*' | sed 's/@updated //' | head -1)
    
    if [ -n "$created" ]; then
        if [[ ! $created =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
            log_warn "  ⚠ 创建日期格式不正确: $created (应为 YYYY-MM-DD 格式)"
            has_warnings=true
        fi
    fi
    
    if [ -n "$updated" ]; then
        if [[ ! $updated =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
            log_warn "  ⚠ 更新日期格式不正确: $updated (应为 YYYY-MM-DD 格式)"
            has_warnings=true
        fi
    fi
    
    # 验证状态值
    local status=$(echo "$header" | grep -o '@status [^*]*' | sed 's/@status //' | head -1)
    if [ -n "$status" ]; then
        case "$status" in
            draft|dev|test|stable|deprecated)
                ;;
            *)
                log_warn "  ⚠ 状态值不正确: $status (应为 draft/dev/test/stable/deprecated)"
                has_warnings=true
                ;;
        esac
    fi
    
    # 验证作者邮箱格式
    local author=$(echo "$header" | grep -o '@author [^*]*' | head -1)
    if [ -n "$author" ]; then
        if ! echo "$author" | grep -q '<.*@.*\.'; then
            log_warn "  ⚠ 作者邮箱格式不正确: $author"
            has_warnings=true
        fi
    fi
    
    # 统计结果
    if [ "$has_errors" = true ]; then
        ((INVALID_FILES++))
    elif [ "$has_warnings" = true ]; then
        ((WARNING_FILES++))
    else
        log_info "  ✓ 标头验证通过"
        ((VALID_FILES++))
    fi
    
    return 0
}

# 生成验证报告
generate_report() {
    echo ""
    echo "=========================================="
    echo "  YYC3-AI 标头验证报告"
    echo "=========================================="
    echo ""
    echo "验证统计:"
    echo "  总文件数: $TOTAL_FILES"
    echo "  有效文件: $VALID_FILES"
    echo "  无效文件: $INVALID_FILES"
    echo "  警告文件: $WARNING_FILES"
    echo ""
    
    local success_rate=0
    if [ $TOTAL_FILES -gt 0 ]; then
        success_rate=$((VALID_FILES * 100 / TOTAL_FILES))
    fi
    
    echo "通过率: ${success_rate}%"
    echo ""
    
    if [ $INVALID_FILES -gt 0 ]; then
        log_error "发现 $INVALID_FILES 个无效文件，需要修复"
    fi
    
    if [ $WARNING_FILES -gt 0 ]; then
        log_warn "发现 $WARNING_FILES 个文件有警告，建议优化"
    fi
    
    if [ $INVALID_FILES -eq 0 ] && [ $WARNING_FILES -eq 0 ]; then
        log_info "✓ 所有文件标头验证通过！"
    fi
    
    echo ""
    echo "=========================================="
}

# 主函数
main() {
    log_info "开始验证代码文件标头..."
    echo ""
    
    # 查找所有 TypeScript 和 JavaScript 文件
    local files=()
    while IFS= read -r -d '' file; do
        files+=("$file")
    done < <(find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -print0)
    
    # 遍历所有文件
    for file in "${files[@]}"; do
        ((TOTAL_FILES++))
        validate_file "$file"
    done
    
    # 生成报告
    generate_report
    
    # 返回退出码
    if [ $INVALID_FILES -gt 0 ]; then
        exit 1
    elif [ $WARNING_FILES -gt 0 ]; then
        exit 2
    else
        exit 0
    fi
}

# 执行主函数
main
