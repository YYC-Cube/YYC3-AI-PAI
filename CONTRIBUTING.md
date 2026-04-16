---
file: CONTRIBUTING.md
description: YYC³ AI-PAI 贡献指南，包含行为准则、开发环境设置、代码规范等内容
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-08
updated: 2026-04-08
status: stable
tags: [guide],[contribution],[development],[standards]
category: guide
language: zh-CN
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# 贡献指南

感谢您有兴趣为 YYC³ AI-PAI 做出贡献！本文档将帮助您了解如何参与项目开发。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request流程](#pull-request流程)
- [问题报告](#问题报告)
- [功能请求](#功能请求)

---

## 行为准则

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 使用包容性语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 捣乱、侮辱/贬损评论以及人身或政治攻击
- 公开或私下骚扰
- 未经明确许可，发布他人的私人信息
- 其他在专业环境中可能被合理认为不适当的行为

---

## 如何贡献

### 贡献方式

1. **报告Bug** - 提交详细的问题报告
2. **建议功能** - 提出新功能想法
3. **改进文档** - 完善文档和示例
4. **提交代码** - 修复Bug或实现新功能
5. **代码审查** - 帮助审查Pull Request

### 开始之前

- 查看 [Issues](https://github.com/yyc3/YYC3-AI-PAI/issues) 了解当前任务
- 阅读 [文档](./docs) 了解项目架构
- 加入 [讨论](https://github.com/yyc3/YYC3-AI-PAI/discussions) 与社区交流

---

## 开发环境设置

### 环境要求

| 依赖 | 版本 | 安装方式 |
|------|------|----------|
| Node.js | >= 18.0.0 | `nvm install 18` |
| pnpm | >= 8.0.0 | `npm install -g pnpm` |
| Rust | >= 1.70.0 | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Git | >= 2.30.0 | 系统包管理器 |

### 克隆仓库

```bash
# Fork后克隆您的仓库
git clone https://github.com/YOUR_USERNAME/YYC3-AI-PAI.git
cd YYC3-AI-PAI

# 添加上游仓库
git remote add upstream https://github.com/yyc3/YYC3-AI-PAI.git

# 安装依赖
pnpm install
```

### 启动开发服务器

```bash
# Web开发模式
pnpm dev

# Tauri开发模式
pnpm tauri dev
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test:unit
pnpm test:e2e

# 生成覆盖率报告
pnpm test:coverage
```

---

## 代码规范

### TypeScript规范

```typescript
// ✅ 推荐：使用接口定义类型
interface User {
  id: string
  name: string
  email: string
}

// ✅ 推荐：使用类型别名定义联合类型
type Status = 'pending' | 'active' | 'completed'

// ✅ 推荐：使用const断言
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const

// ❌ 避免：使用any类型
const data: any = fetchData() // 不推荐

// ✅ 推荐：使用具体类型或unknown
const data: unknown = fetchData()
```

### React规范

```tsx
// ✅ 推荐：使用函数组件和Hooks
import { useState, useCallback } from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={isHovered ? 'hovered' : ''}
    >
      {children}
    </button>
  )
}

// ❌ 避免：使用类组件（除非必要）
class OldButton extends React.Component {
  // ...
}
```

### 文件命名规范

```
组件文件：PascalCase.tsx (如：Button.tsx)
工具函数：camelCase.ts (如：formatDate.ts)
类型定义：kebab-case.ts (如：user-types.ts)
测试文件：*.test.ts 或 *.spec.ts
样式文件：*.module.css 或 *.css
```

### 目录结构规范

```
src/
├── app/
│   ├── components/      # 页面组件
│   ├── hooks/          # 自定义Hooks
│   ├── services/       # 业务服务
│   ├── store/          # 状态管理
│   ├── types/          # 类型定义
│   └── utils/          # 工具函数
├── components/
│   └── ui/             # 基础UI组件
└── styles/             # 全局样式
```

### ESLint和Prettier

```bash
# 检查代码规范
pnpm lint

# 自动修复
pnpm lint:fix

# 格式化代码
pnpm format
```

---

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型（Type）

| 类型 | 描述 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add user authentication` |
| `fix` | Bug修复 | `fix: resolve login redirect issue` |
| `docs` | 文档更新 | `docs: update API documentation` |
| `style` | 代码格式（不影响功能） | `style: format code with prettier` |
| `refactor` | 重构（不是新功能或修复） | `refactor: simplify auth logic` |
| `perf` | 性能优化 | `perf: optimize list rendering` |
| `test` | 添加或修改测试 | `test: add unit tests for auth` |
| `chore` | 构建过程或辅助工具变动 | `chore: update dependencies` |
| `ci` | CI配置文件和脚本变动 | `ci: add GitHub Actions workflow` |
| `revert` | 回退之前的提交 | `revert: revert "feat: add feature"` |

### 作用域（Scope）

可选，表示提交影响的范围：

- `core` - 核心功能
- `ui` - UI组件
- `api` - API接口
- `store` - 状态管理
- `docs` - 文档
- `test` - 测试

### 示例

```bash
# 新功能
git commit -m "feat(ui): add dark mode toggle button"

# Bug修复
git commit -m "fix(core): resolve memory leak in file watcher"

# 文档更新
git commit -m "docs: add installation guide for Windows"

# 重构
git commit -m "refactor(store): simplify state management logic"

# 带有详细描述
git commit -m "feat(api): add rate limiting support

- Implement token bucket algorithm
- Add configurable rate limits
- Include rate limit headers in responses

Closes #123"
```

---

## Pull Request流程

### 创建Pull Request

1. **创建分支**

```bash
# 从main创建新分支
git checkout main
git pull upstream main
git checkout -b feature/amazing-feature
```

2. **开发和测试**

```bash
# 开发代码
pnpm dev

# 运行测试
pnpm test

# 检查代码规范
pnpm lint
pnpm type-check
```

3. **提交代码**

```bash
git add .
git commit -m "feat: add amazing feature"
```

4. **推送分支**

```bash
git push origin feature/amazing-feature
```

5. **创建Pull Request**

- 访问您的Fork仓库
- 点击 "New Pull Request"
- 填写PR模板

### PR检查清单

- [ ] 代码通过所有测试 (`pnpm test`)
- [ ] 无ESLint警告 (`pnpm lint`)
- [ ] 无TypeScript错误 (`pnpm type-check`)
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交信息符合规范
- [ ] PR描述清晰完整

### PR审查

- 维护者会审查您的代码
- 可能会提出修改建议
- 请及时响应审查意见
- 所有讨论解决后，PR将被合并

---

## 问题报告

### 报告Bug

如果您发现了Bug，请创建 [Issue](https://github.com/yyc3/YYC3-AI-PAI/issues/new?template=bug_report.md) 并包含：

1. **Bug描述** - 清晰简洁地描述问题
2. **复现步骤** - 详细说明如何复现
3. **期望行为** - 描述您期望发生什么
4. **实际行为** - 描述实际发生了什么
5. **环境信息** - 操作系统、Node版本、浏览器等
6. **截图** - 如果适用，添加截图
7. **日志** - 相关的错误日志或控制台输出

### Bug报告模板

```markdown
## Bug描述
[清晰简洁地描述问题]

## 复现步骤
1. 打开 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

## 期望行为
[描述您期望发生什么]

## 实际行为
[描述实际发生了什么]

## 环境信息
- OS: [如：macOS 14.0]
- Node.js: [如：18.17.0]
- 浏览器: [如：Chrome 120]
- 版本: [如：1.0.0]

## 截图
[如果适用，添加截图]

## 额外信息
[其他相关信息]
```

---

## 功能请求

### 提交功能请求

如果您有新功能想法，请创建 [Issue](https://github.com/yyc3/YYC3-AI-PAI/issues/new?template=feature_request.md) 并包含：

1. **功能描述** - 清晰描述您想要的功能
2. **使用场景** - 说明为什么需要这个功能
3. **建议方案** - 如果有想法，描述实现方案
4. **替代方案** - 描述您考虑过的替代方案
5. **额外信息** - 其他相关信息

### 功能请求模板

```markdown
## 功能描述
[清晰简洁地描述您想要的功能]

## 使用场景
[描述为什么需要这个功能，解决什么问题]

## 建议方案
[描述您建议的实现方案]

## 替代方案
[描述您考虑过的替代方案]

## 额外信息
[其他相关信息、截图、参考链接等]
```

---

## 获取帮助

- **文档** - [项目文档](./docs)
- **讨论** - [GitHub Discussions](https://github.com/yyc3/YYC3-AI-PAI/discussions)
- **邮件** - <admin@0379.email>

---

## 许可证

通过贡献代码，您同意您的贡献将根据 [MIT License](./LICENSE) 进行许可。

---

<div align="center">

**感谢您的贡献！**

*YanYuCloudCube Team*

</div>
