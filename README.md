<div align="center">

<img src="public/Family-001.png" alt="YYC³ AI-PAI" width="100%" />

# YYC³ AI-PAI

**YanYuCloudCube · AI-Powered Application Intelligence**

*言启千行代码，语枢万物智能*

[![Version](https://img.shields.io/badge/version-4.8.4-blue.svg)](./package.json)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/tests-2067%20passed-brightgreen.svg)](https://vitest.dev/)
[![Coverage](https://img.shields.io/badge/coverage-72%25-yellowgreen.svg)](./coverage/)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/YYC-Cube/YYC3-AI-PAI/actions)
[![CI/CD](https://github.com/YYC-Cube/YYC3-AI-PAI/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YYC-Cube/YYC3-AI-PAI/actions/workflows/ci-cd.yml)
[![Demo](https://img.shields.io/badge/demo-ai--pai.yyc3.top-9cf.svg)](https://ai-pai.yyc3.top)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

</div>

---

## 目录

- [概览](#-概览)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [核心架构](#-核心架构)
- [功能模块](#-功能模块)
- [开发指南](#-开发指南)
- [测试](#-测试)
- [构建与部署](#-构建与部署)
- [文档导航](#-文档导航)
- [贡献指南](#-贡献指南)
- [团队与联系方式](#-团队与联系方式)

---

## 概览

YYC³ AI-PAI 是一款面向开发者的 **AI 驱动智能应用平台**，集成了代码编辑、AI 辅助、实时协作、性能监控、多主题系统等核心能力。采用 React + Vite + shadcn/ui + Radix UI + pnpm 技术栈，提供赛博朋克与极简双主题体验。

### 核心特性

| 特性 | 描述 |
|------|------|
| 🤖 AI 智能助手 | 代码生成、补全、分析、Agent 工作流 |
| 📝 Monaco 编辑器 | 多语言支持、协作编辑、代码差异 |
| 🎨 双主题系统 | Cyberpunk 赛博朋克 / Clean 极简 |
| 🌐 国际化 | 中文 / English 双语支持 |
| 📊 性能监控 | Web Vitals、组件渲染、API 追踪 |
| 🔌 插件系统 | 插件市场、动态加载、版本管理 |
| 🗄️ 数据库面板 | SQL 控制台、备份恢复 |
| 📡 离线优先 | PWA 支持、Service Worker 缓存 |
| 🔄 CRDT 协作 | Yjs 实时协作、WebSocket/WebRTC |
| 🎯 面板拖拽 | 多窗口、跨面板拖放、自由布局 |

### 项目数据

| 指标 | 数值 |
|------|------|
| 源文件 | 201 个 |
| 组件 | 111 个 |
| Store | 26 个 |
| Hooks | 7 个 |
| 服务 | 6 个 |
| 测试文件 | 33 个 |
| 测试用例 | 2063 个 |
| ESLint | 0 errors / 0 warnings |
| 循环依赖 | 0 |
| 构建时间 | ~2.3s |

---

## 技术栈

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.x | UI 框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 6.x | 构建工具 |
| pnpm | 8.x+ | 包管理 |

### UI & 样式

| 技术 | 用途 |
|------|------|
| shadcn/ui | 组件库 |
| Radix UI | 无障碍原语 |
| Tailwind CSS 4 | 原子化样式 |
| Motion (Framer Motion) | 动画引擎 |
| Lucide React | 图标库 |

### 状态 & 数据

| 技术 | 用途 |
|------|------|
| Zustand | 状态管理 |
| Immer | 不可变数据 |
| Yjs | CRDT 协作 |
| Monaco Editor | 代码编辑器 |

### 测试 & 质量

| 技术 | 用途 |
|------|------|
| Vitest | 单元测试 |
| Playwright | E2E 测试 |
| ESLint | 代码检查 |
| Prettier | 代码格式化 |

---

## 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **OS**: macOS / Linux / Windows

### 安装

```bash
# 克隆仓库
git clone https://github.com/YYC-Cube/YYC3-AI-PAI.git
cd YYC3-AI-PAI

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 浏览器访问 http://localhost:3100
```

### 可用脚本

```bash
# 开发
pnpm dev                # 启动开发服务器 (port 3100)

# 构建
pnpm build              # 生产构建

# 测试
pnpm test               # 运行全部测试
pnpm test:watch         # 监听模式
pnpm test:coverage      # 覆盖率报告
pnpm test:e2e           # E2E 测试

# 代码质量
pnpm lint               # ESLint 检查 (--max-warnings 0)
pnpm lint:fix           # ESLint 自动修复
pnpm format             # Prettier 格式化
pnpm format:check       # Prettier 检查
```

---

## 项目结构

```
YYC3-AI-PAI/
├── public/                    # 静态资源
│   ├── Family-001.png         # 项目主图
│   ├── yyc3-icons/            # 自定义图标集
│   └── yyc3-logo*.png         # 品牌标识
├── src/
│   ├── app/
│   │   ├── components/        # 111 个组件
│   │   │   ├── ui/            # shadcn/ui 基础组件
│   │   │   ├── settings/      # 设置面板
│   │   │   ├── ide/           # IDE 子组件
│   │   │   └── ...            # 功能面板组件
│   │   ├── store/             # 26 个 Zustand Store
│   │   ├── hooks/             # 7 个自定义 Hooks
│   │   ├── services/          # 6 个服务模块
│   │   ├── i18n/              # 国际化 (中/英)
│   │   └── types/             # TypeScript 类型定义
│   ├── main.tsx               # 入口文件
│   └── App.tsx                # 根组件
├── docs/                      # 项目文档 (14 个目录)
├── e2e/                       # Playwright E2E 测试
├── vitest.config.ts           # Vitest 配置
├── vitest.setup.ts            # 测试全局 Setup
├── vite.config.ts             # Vite 构建配置
├── eslint.config.mjs          # ESLint Flat Config
├── tsconfig.json              # TypeScript 配置
└── package.json
```

---

## 核心架构

### 状态管理 (Zustand)

项目使用 Zustand 进行全局状态管理，支持 `persist` 持久化和 `devtools` 调试：

```
┌─────────────────────────────────────────────┐
│                  App.tsx                     │
├─────────────────────────────────────────────┤
│  useThemeStore    → 主题/Token/效果          │
│  useIDEStore      → 布局/面板/终端           │
│  useFileStore     → 文件/标签/最近文件       │
│  usePreviewStore  → 预览/设备/控制台         │
│  useCollabStore   → CRDT/协作者/操作         │
│  usePluginStore   → 插件/市场/安装           │
│  useEditorPrefs   → 编辑器偏好/自动保存      │
│  ...                                         │
└─────────────────────────────────────────────┘
```

### 组件层次

```
App
├── IDEMode (主 IDE 布局)
│   ├── IDELeftPanel
│   │   ├── IDEFileExplorer
│   │   └── IDEChatPanel (AI 助手)
│   ├── CyberEditor (Monaco)
│   └── LivePreview (iframe)
├── FloatingWidget (浮动 AI)
├── FullscreenMode (全屏 AI)
├── CommandPalette (命令面板)
├── SettingsPanel (设置)
└── SystemPanel (系统)
```

### 双主题系统

| 主题 | 风格 | 特效 |
|------|------|------|
| **Cyberpunk** | 霓虹、深色、科技感 | Glitch、Scanline、CRT、Glow |
| **Clean** | 简洁、明亮、现代 | 无特效、极简设计 |

---

## 功能模块

### AI 系统

- **AI 聊天面板** — 多轮对话、上下文感知、代码建议
- **AI 补全** — 实时代码补全、多语言支持
- **Agent 工作流** — 多步骤任务编排、自动执行
- **代码生成** — 自然语言 → 可执行代码
- **智能工作流** — 预设模板、自定义工作流

### 编辑器

- **Monaco Editor** — 语法高亮、智能提示、多光标
- **协作编辑** — CRDT 实时同步、光标追踪
- **自动保存** — 定时保存 + 脏检查 + 版本快照
- **代码差异** — 版本对比、变更追踪

### 预览系统

- **实时预览** — iframe 沙箱、多设备模拟
- **响应式** — Desktop / Tablet / Mobile / 自定义
- **控制台捕获** — console 输出转发、错误追踪
- **性能模式** — 实时/延迟/智能三种刷新策略

---

## 开发指南

### 代码规范

| 工具 | 配置文件 | 规则 |
|------|---------|------|
| ESLint | `eslint.config.mjs` | Flat Config, 0 errors/warnings |
| Prettier | 内联配置 | Tailwind 类名排序 |
| TypeScript | `tsconfig.json` | Strict Mode |

### 提交规范

```
feat:     新功能
fix:      修复 Bug
docs:     文档更新
style:    代码格式
refactor: 重构
perf:     性能优化
test:     测试
chore:    构建/工具
```

### 新增组件模板

```bash
# 1. 在 src/app/components/ 下创建组件文件
# 2. 遵循 shadcn/ui 模式：forwardRef + cn()
# 3. 使用 useThemeStore() 获取主题 token
# 4. 使用 useI18n() 获取国际化
# 5. 编写对应的 .test.ts 测试文件
```

---

## 测试

### 运行测试

```bash
pnpm test                 # 全部测试 (Vitest)
pnpm test:watch           # 监听模式
pnpm test:coverage        # 覆盖率报告
pnpm test:e2e             # E2E 测试 (Playwright)
```

### 测试架构

| 层级 | 工具 | 文件数 | 用例数 |
|------|------|--------|--------|
| 单元测试 | Vitest | 33 | 2063 |
| E2E 测试 | Playwright | - | - |

### 全局 Setup

[vitest.setup.ts](./vitest.setup.ts) 提供以下浏览器 API Mock：

- `indexedDB` — IndexedDB 存储
- `navigator.gpu` — WebGPU API
- `ResizeObserver` — 尺寸监听
- `IntersectionObserver` — 可见性
- `RTCPeerConnection` — WebRTC
- `WebSocket` — WebSocket
- `BroadcastChannel` — 广播通道

---

## 构建与部署

### 构建产物

```bash
pnpm build    # 输出到 dist/
```

| 产物 | 大小 | 说明 |
|------|------|------|
| JS Chunks | ~1.9MB | 分割为 8+ 个 vendor chunk |
| CSS | ~单文件 | Tailwind 原子化 |
| 静态资源 | ~2.7MB | 图标/Logo/图片 |

### Bundle 分割策略

| Chunk | 内容 |
|-------|------|
| `vendor-react` | React + ReactDOM |
| `vendor-recharts` | Recharts 图表 |
| `vendor-monaco` | Monaco Editor (动态加载) |
| `vendor-yjs` | Yjs + 协作协议 |
| `vendor-motion` | Motion 动画 |
| `vendor-ui` | Radix UI 组件 |
| `vendor-icons` | Lucide 图标 |
| `vendor-state` | Zustand + Immer |

---

## 文档导航

| 文档 | 位置 | 描述 |
|------|------|------|
| 💡 快速开始 | [`docs/README.md`](./docs/) | 项目文档总览与快速导航 |
| 🏗️ 架构文档 | [`docs/P0-核心架构/`](./docs/P0-核心架构/) | 项目初始化、目录结构、构建配置 |
| 📦 开发文档 | [`docs/internal/DEVELOPER-DOCUMENTATION.md`](./docs/internal/DEVELOPER-DOCUMENTATION.md) | 开发者指南、开发规范 |
| 🎨 设计文档 | [`docs/YYC3-AI-设计文档/`](./docs/YYC3-AI-设计文档/) | UI/UX 设计系统与主题 |
| 🧪 测试文档 | [`docs/Testing/`](./docs/Testing/) | 测试报告与覆盖率 |
| 🚀 部署指南 | [`docs/internal/DEPLOYMENT-GUIDE.md`](./docs/internal/DEPLOYMENT-GUIDE.md) | 部署配置与流程 |
| 🔧 优化指南 | [`docs/internal/`](./docs/internal/) | 性能优化、错误处理、迁移策略 |
| 🤝 贡献指南 | [`CONTRIBUTING.md`](./CONTRIBUTING.md) | 如何参与贡献 |
| 🔒 安全政策 | [`SECURITY.md`](./SECURITY.md) | 安全漏洞报告 |
| 📜 行为准则 | [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) | 社区行为规范 |
| 📋 更新日志 | [`CHANGELOG.md`](./CHANGELOG.md) | 版本历史与变更记录 |

---

## 贡献指南

### 开发流程

1. **Fork** 仓库
2. **创建分支** `git checkout -b feature/amazing-feature`
3. **开发 & 测试** 确保通过 `pnpm lint` 和 `pnpm test`
4. **提交** `git commit -m 'feat: add amazing feature'`
5. **推送** `git push origin feature/amazing-feature`
6. **PR** 创建 Pull Request

### PR 检查清单

- [ ] `pnpm lint` 通过 (0 errors, 0 warnings)
- [ ] `pnpm test` 通过
- [ ] `pnpm build` 成功
- [ ] 新功能有对应测试
- [ ] 文档已更新

---

## 团队与联系方式

| 项目 | 信息 |
|------|------|
| **团队** | YanYuCloudCube Team |
| **邮箱** | <admin@0379.email> |
| **组织** | <https://github.com/YYC-Cube> |
| **Issues** | <https://github.com/YYC-Cube/YYC3-AI-PAI/issues> |

---

<div align="center">

**YanYuCloudCube**

*Words Initiate Quadrants, Language Serves as Core for Future*

*All things converge in cloud pivot; Deep stacks ignite a new era of intelligence*

</div>
