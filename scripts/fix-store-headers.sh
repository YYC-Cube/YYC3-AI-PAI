#!/bin/bash

# YYC3-AI Store 文件标头修复脚本
# 为 Store 文件添加标准团队标头

set -euo pipefail

# 配置
AUTHOR_NAME="YanYuCloudCube Team"
AUTHOR_EMAIL="admin@0379.email"
VERSION="v1.0.0"
CREATED_DATE="2026-03-19"
UPDATED_DATE="2026-03-19"
STATUS="stable"
LICENSE="MIT"
COPYRIGHT_YEAR="2026"

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

# Store 文件列表
STORE_FILES=(
    "theme-store.ts:主题状态管理模块，管理主题切换和主题令牌:theme,ui,state-management,critical"
    "ide-store.ts:IDE状态管理模块，管理IDE布局和状态:ide,editor,state-management,critical"
    "settings-store.ts:设置状态管理模块，管理用户设置和配置:settings,configuration,state-management"
    "project-store.ts:项目状态管理模块，管理项目数据和操作:project,state-management,core"
    "editor-prefs-store.ts:编辑器偏好状态管理模块，管理编辑器设置:editor,preferences,state-management"
    "panel-dnd-store.ts:面板拖拽状态管理模块，管理面板拖拽和布局:panel,drag-drop,state-management"
    "shortcut-store.ts:快捷键状态管理模块，管理键盘快捷键:shortcut,keyboard,state-management"
    "mcp-store.ts:MCP状态管理模块，管理MCP协议和连接:mcp,ai,state-management"
    "quick-actions-store.ts:快速操作状态管理模块，管理AI快速操作:quick-actions,ai,state-management"
    "model-store.tsx:模型状态管理模块，管理AI模型和配置:model,ai,state-management"
    "db-store.ts:数据库状态管理模块，管理本地数据库操作:database,storage,state-management"
    "crypto-store.ts:加密状态管理模块，管理加密和解密操作:crypto,security,state-management"
    "file-store.ts:文件状态管理模块，管理文件系统和操作:file,storage,state-management"
    "offline-store.ts:离线状态管理模块，管理离线同步和队列:offline,sync,state-management"
    "task-store.ts:任务状态管理模块，管理任务和待办事项:task,state-management,ai"
    "ai-metrics-store.ts:AI指标状态管理模块，管理AI性能指标:ai,metrics,state-management"
    "preview-store.ts:预览状态管理模块，管理实时预览状态:preview,state-management,core"
    "multi-instance-store.ts:多实例状态管理模块，管理多实例配置:multi-instance,state-management,core"
    "activity-store.ts:活动状态管理模块，管理用户活动和日志:activity,logging,state-management"
    "plugin-store.ts:插件状态管理模块，管理插件系统:plugin,state-management,core"
    "collab-store.ts:协作状态管理模块，管理实时协作状态:collaboration,state-management,core"
)

# 为 Store 文件添加标准标头
fix_store_header() {
    local entry=$1
    local filename=$(echo "$entry" | cut -d':' -f1)
    local description=$(echo "$entry" | cut -d':' -f2)
    local tags=$(echo "$entry" | cut -d':' -f3)
    
    local file_path="src/app/store/$filename"
    
    if [ ! -f "$file_path" ]; then
        log_warn "文件不存在: $file_path"
        return
    fi
    
    log_info "修复 $filename 标头"
    
    # 读取文件内容
    local content=$(cat "$file_path")
    
    # 检查是否已有标准标头
    if echo "$content" | grep -q "@file"; then
        log_warn "$filename 已有标头，跳过"
        return
    fi
    
    # 生成新标头
    local new_header=$(cat << EOF
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
)
    
    # 写入新文件
    echo "$new_header" > "${file_path}.tmp"
    echo "$content" >> "${file_path}.tmp"
    
    # 替换原文件
    mv "${file_path}.tmp" "$file_path"
    
    log_info "✓ 已修复 $filename"
}

# 主函数
main() {
    log_info "开始修复 Store 文件标头..."
    
    # 遍历所有 Store 文件
    for entry in "${STORE_FILES[@]}"; do
        fix_store_header "$entry"
    done
    
    log_info "✓ Store 文件标头修复完成！"
}

# 执行主函数
main
