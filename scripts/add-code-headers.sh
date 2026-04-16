#!/bin/bash

# YYC3-AI 代码标头批量添加脚本
# 为项目中所有代码文件添加标准团队标头

set -euo pipefail

# 配置
PROJECT_NAME="YYC3 AI Code"
AUTHOR_NAME="YanYuCloudCube Team"
AUTHOR_EMAIL="admin@0379.email"
VERSION="v1.0.0"
CREATED_DATE="2026-03-19"
UPDATED_DATE="2026-03-19"
STATUS="stable"
LICENSE="MIT"
COPYRIGHT_YEAR="2026"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# 根据文件路径生成标签
generate_tags() {
    local file_path=$1
    local tags="typescript"
    
    # 根据路径添加模块标签
    if [[ $file_path == *"components/ide"* ]]; then
        tags="$tags,ide,editor"
    elif [[ $file_path == *"components/ui"* ]]; then
        tags="$tags,ui,component"
    elif [[ $file_path == *"components/settings"* ]]; then
        tags="$tags,settings,configuration"
    elif [[ $file_path == *"store"* ]]; then
        tags="$tags,store,state-management"
    elif [[ $file_path == *"hooks"* ]]; then
        tags="$tags,hooks,react"
    elif [[ $file_path == *"i18n"* ]]; then
        tags="$tags,i18n,internationalization"
    elif [[ $file_path == *"tests"* ]]; then
        tags="$tags,test,testing"
    fi
    
    echo "$tags"
}

# 根据文件路径生成描述
generate_description() {
    local file_path=$1
    local filename=$(basename "$file_path" | sed 's/\.[^.]*$//')
    
    # 根据文件名生成描述
    case "$filename" in
        *Store*)
            echo "状态管理模块，管理${filename}相关的状态和操作"
            ;;
        *Panel*)
            echo "面板组件，提供${filename}的用户界面"
            ;;
        *Editor*)
            echo "编辑器组件，提供代码编辑功能"
            ;;
        *Button*)
            echo "按钮组件，提供基础按钮UI"
            ;;
        *Input*)
            echo "输入框组件，提供文本输入功能"
            ;;
        *Dialog*)
            echo "对话框组件，提供模态对话框"
            ;;
        *Tooltip*)
            echo "提示框组件，提供鼠标悬停提示"
            ;;
        *Card*)
            echo "卡片组件，提供卡片容器"
            ;;
        *Table*)
            echo "表格组件，提供数据表格展示"
            ;;
        *Settings*)
            echo "设置组件，提供配置界面"
            ;;
        *Theme*)
            echo "主题相关组件，提供主题切换功能"
            ;;
        *Layout*)
            echo "布局组件，提供页面布局"
            ;;
        *Context*)
            echo "上下文组件，提供React Context"
            ;;
        *Hook*)
            echo "自定义Hook，提供可复用逻辑"
            ;;
        *Utils*)
            echo "工具函数，提供通用工具方法"
            ;;
        *Types*)
            echo "类型定义，提供TypeScript类型"
            ;;
        *Test*)
            echo "测试文件，包含单元测试和集成测试"
            ;;
        *)
            echo "${filename}组件/模块"
            ;;
    esac
}

# 检查文件是否已有标头
has_header() {
    local file_path=$1
    if head -n 1 "$file_path" | grep -q "^/\*\*$"; then
        return 0
    elif head -n 1 "$file_path" | grep -q "^//"; then
        return 0
    elif head -n 1 "$file_path" | grep -q "^\"\"\""; then
        return 0
    fi
    return 1
}

# 生成TypeScript/JavaScript标头
generate_ts_header() {
    local file_path=$1
    local filename=$(basename "$file_path")
    local description=$(generate_description "$file_path")
    local tags=$(generate_tags "$file_path")
    
    cat << EOF
/**
 * @file ${filename}
 * @description ${description}
 * @author ${AUTHOR_NAME} <${AUTHOR_EMAIL}>
 * @version ${VERSION}
 * @created ${CREATED_DATE}
 * @updated ${UPDATED_DATE}
 * @status ${STATUS}
 * @license ${LICENSE}
 * @copyright Copyright (c) ${COPYRIGHT_YEAR} YanYuCloudCube Team
 * @tags ${tags}
 */

EOF
}

# 为文件添加标头
add_header_to_file() {
    local file_path=$1
    
    # 跳过已有标头的文件
    if has_header "$file_path"; then
        log_warn "跳过已有标头的文件: $file_path"
        return
    fi
    
    # 只处理 TypeScript 和 JavaScript 文件
    if [[ $file_path != *.ts && $file_path != *.tsx && $file_path != *.js && $file_path != *.jsx ]]; then
        return
    fi
    
    # 跳过测试文件
    if [[ $file_path == *.test.* ]]; then
        log_warn "跳过测试文件: $file_path"
        return
    fi
    
    log_info "处理文件: $file_path"
    
    # 生成临时文件
    local temp_file=$(mktemp)
    generate_ts_header "$file_path" > "$temp_file"
    cat "$file_path" >> "$temp_file"
    
    # 替换原文件
    mv "$temp_file" "$file_path"
    
    log_info "✓ 已添加标头: $file_path"
}

# 主函数
main() {
    log_info "开始为代码文件添加标头..."
    log_info "项目: ${PROJECT_NAME}"
    log_info "作者: ${AUTHOR_NAME}"
    
    # 查找所有 TypeScript 和 JavaScript 文件
    find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
        add_header_to_file "$file"
    done
    
    log_info "✓ 标头添加完成！"
}

# 执行主函数
main
