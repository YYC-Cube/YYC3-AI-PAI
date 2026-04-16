#!/bin/bash

# YYC3-AI 修复标头脚本
# 修复 Store 文件的标头，保留标准标头，删除旧标头

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

# Store 文件映射
declare -A STORE_DESCRIPTIONS=(
    ["theme-store.ts"]="主题状态管理模块，管理主题切换和主题令牌"
    ["ide-store.ts"]="IDE状态管理模块，管理IDE布局和状态"
    ["settings-store.ts"]="设置状态管理模块，管理用户设置和配置"
    ["project-store.ts"]="项目状态管理模块，管理项目数据和操作"
    ["editor-prefs-store.ts"]="编辑器偏好状态管理模块，管理编辑器设置"
    ["panel-dnd-store.ts"]="面板拖拽状态管理模块，管理面板拖拽和布局"
    ["shortcut-store.ts"]="快捷键状态管理模块，管理键盘快捷键"
    ["mcp-store.ts"]="MCP状态管理模块，管理MCP协议和连接"
    ["quick-actions-store.ts"]="快速操作状态管理模块，管理AI快速操作"
    ["model-store.tsx"]="模型状态管理模块，管理AI模型和配置"
    ["db-store.ts"]="数据库状态管理模块，管理本地数据库操作"
    ["crypto-store.ts"]="加密状态管理模块，管理加密和解密操作"
    ["file-store.ts"]="文件状态管理模块，管理文件系统和操作"
    ["offline-store.ts"]="离线状态管理模块，管理离线同步和队列"
    ["task-store.ts"]="任务状态管理模块，管理任务和待办事项"
    ["ai-metrics-store.ts"]="AI指标状态管理模块，管理AI性能指标"
    ["preview-store.ts"]="预览状态管理模块，管理实时预览状态"
    ["multi-instance-store.ts"]="多实例状态管理模块，管理多实例配置"
    ["activity-store.ts"]="活动状态管理模块，管理用户活动和日志"
    ["plugin-store.ts"]="插件状态管理模块，管理插件系统"
    ["collab-store.ts"]="协作状态管理模块，管理实时协作状态"
)

declare -A STORE_TAGS=(
    ["theme-store.ts"]="theme,ui,state-management,critical"
    ["ide-store.ts"]="ide,editor,state-management,critical"
    ["settings-store.ts"]="settings,configuration,state-management"
    ["project-store.ts"]="project,state-management,core"
    ["editor-prefs-store.ts"]="editor,preferences,state-management"
    ["panel-dnd-store.ts"]="panel,drag-drop,state-management"
    ["shortcut-store.ts"]="shortcut,keyboard,state-management"
    ["mcp-store.ts"]="mcp,ai,state-management"
    ["quick-actions-store.ts"]="quick-actions,ai,state-management"
    ["model-store.tsx"]="model,ai,state-management"
    ["db-store.ts"]="database,storage,state-management"
    ["crypto-store.ts"]="crypto,security,state-management"
    ["file-store.ts"]="file,storage,state-management"
    ["offline-store.ts"]="offline,sync,state-management"
    ["task-store.ts"]="task,state-management,ai"
    ["ai-metrics-store.ts"]="ai,metrics,state-management"
    ["preview-store.ts"]="preview,state-management,core"
    ["multi-instance-store.ts"]="multi-instance,state-management,core"
    ["activity-store.ts"]="activity,logging,state-management"
    ["plugin-store.ts"]="plugin,state-management,core"
    ["collab-store.ts"]="collaboration,state-management,core"
)

# 修复文件标头
fix_header() {
    local file_path=$1
    local filename=$(basename "$file_path")
    local description=${STORE_DESCRIPTIONS[$filename]}
    local tags=${STORE_TAGS[$filename]}
    
    if [ -z "$description" ]; then
        log_warn "未找到 $filename 的描述"
        description="状态管理模块"
    fi
    
    if [ -z "$tags" ]; then
        log_warn "未找到 $filename 的标签"
        tags="store,state-management"
    fi
    
    log_info "修复 $filename 标头"
    
    # 读取文件内容
    local content=$(cat "$file_path")
    
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
    log_info "开始修复文件标头..."
    
    # 遍历所有 Store 文件
    for filename in "${!STORE_DESCRIPTIONS[@]}"; do
        local file_path="src/app/store/$filename"
        if [ -f "$file_path" ]; then
            fix_header "$file_path"
        fi
    done
    
    log_info "✓ 文件标头修复完成！"
}

# 执行主函数
main
