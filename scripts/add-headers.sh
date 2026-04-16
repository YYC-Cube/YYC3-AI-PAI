#!/bin/bash

# 文档标头添加脚本
# 为所有项目文档添加标准标头

HEADER_TEMPLATE='---
@file: {FILENAME}
@description: {DESCRIPTION}
@author: YanYuCloudCube <admin@0379.email>
@version: v1.0.0
@created: 2026-03-19
@updated: 2026-03-19
@status: stable
@tags: {TAGS}
@category: project
@language: zh-CN
@project: yyc3-ai
@phase: planning
@audience: developers,managers,stakeholders
@complexity: intermediate
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

'

# 定义文档信息
declare -A DOCS=(
  ["YYC3-AI-项目-AI任务板交互设计.md"]="AI任务板交互设计,包含任务管理、提醒、推理描述、快捷操作等|P1,AI,task-board,interaction"
  ["YYC3-AI-项目-FigmaAI提示词.md"]="Figma AI提示词文档，包含AI辅助设计的提示词模板和最佳实践|design,figma,ai,prompts"
  ["YYC3-AI-项目-MVP功能扩展计划.md"]="MVP功能扩展计划，包含功能扩展的优先级和时间安排|project,mvp,planning,features"
  ["YYC3-AI-项目-MVP功能扩展计划1.md"]="MVP功能扩展计划第一版，包含核心功能扩展方案|project,mvp,planning,features"
  ["YYC3-AI-项目-多实例设计.md"]="多实例设计文档，包含多实例架构和实现方案|architecture,multi-instance,design"
  ["YYC3-AI-项目-左侧面板设计.md"]="左侧面板设计文档，包含面板布局和交互设计|design,ui,left-panel"
  ["YYC3-AI-项目-核心功能与技术方案.md"]="核心功能与技术方案文档，包含技术架构和实现方案|technical,architecture,core-features"
  ["YYC3-AI-项目-设置主页面.md"]="设置主页面文档，包含设置页面的设计和实现|design,settings,ui"
  ["YYC3-AI-项目-设置配置.md"]="设置配置文档，包含系统配置项和默认值|configuration,settings,config"
  ["YYC3-AI-项目-设置页面设计.md"]="设置页面设计文档，包含设置页面的UI/UX设计|design,settings,ui"
  ["YYC3-AI-项目-项目标准化.md"]="项目标准化文档，包含开发规范和标准流程|standards,project,development"
  ["YYC3-AI-项目-项目评审计划.md"]="项目评审计划文档，包含评审流程和标准|project,review,planning"
)

# 处理每个文档
for filename in "${!DOCS[@]}"; do
  info="${DOCS[$filename]}"
  description=$(echo "$info" | cut -d'|' -f1)
  tags=$(echo "$info" | cut -d'|' -f2)
  
  filepath="YYC3-AI-项目文档/$filename"
  
  if [ -f "$filepath" ]; then
    echo "处理: $filename"
    
    # 检查是否已有标头
    if ! head -n 1 "$filepath" | grep -q "^---$"; then
      # 替换模板中的占位符
      header=$(echo "$HEADER_TEMPLATE" | sed "s/{FILENAME}/$filename/g" | sed "s/{DESCRIPTION}/$description/g" | sed "s/{TAGS}/$tags/g")
      
      # 创建临时文件
      temp_file=$(mktemp)
      
      # 写入标头
      echo "$header" > "$temp_file"
      
      # 追加原内容
      cat "$filepath" >> "$temp_file"
      
      # 替换原文件
      mv "$temp_file" "$filepath"
      
      echo "✓ 已添加标头: $filename"
    else
      echo "- 已有标头: $filename"
    fi
  else
    echo "✗ 文件不存在: $filename"
  fi
done

echo ""
echo "处理完成！"
