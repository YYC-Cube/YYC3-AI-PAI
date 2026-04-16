# 获取帮助与支持

感谢您使用 YYC³ AI-PAI！我们提供多种渠道来帮助您解决问题。

## 🆘 快速问题排查

在寻求帮助之前，请先尝试以下步骤：

### 1. 查阅文档
- 📖 [完整文档](./docs/) - 100+篇技术文档
- 🚀 [快速开始](./README.md#-快速开始) - 5分钟上手指南
- ❓ [常见问题](#常见问题-faq) - 热门问题解答

### 2. 搜索已有Issue
- 🔍 使用 [GitHub Issues搜索](https://github.com/yyc3/YYC3-AI-PAI/issues?q=is%3Aissue)
- 关键词：错误信息、功能名称、组件名

### 3. 检查系统要求
```bash
# 确认Node.js版本
node --version  # 需要 >= 18

# 确认pnpm版本
pnpm --version  # 推荐 >= 9

# 清理缓存重试
pnpm store prune && rm -rf node_modules && pnpm install
```

## 📞 支持渠道

### 💬 社区支持（推荐）

| 渠道 | 响应时间 | 适用场景 |
|------|---------|---------|
| **GitHub Discussions** | 24-72h | 功能讨论、使用建议、经验分享 |
| **Discord社区** | 实时 | 即时交流、非正式讨论 |
| **Stack Overflow** | 变化 | 标记 `yyc3-ai-pai` 标签 |

#### GitHub Discussions
👉 [访问论坛](https://github.com/yyc3/YYC3-AI-PAI/discussions)

发布Discussion时，请：
- ✅ 选择正确的分类（Bug/Feature/Question）
- ✅ 提供清晰的问题描述和环境信息
- ✅ 附上相关代码片段或截图
- ❌ 不要发布敏感信息（API密钥等）

#### Discord
👉 [加入服务器](https://discord.gg/yyc3)

频道分类：
- `#general` - 一般讨论
- `#help` - 技术求助
- `#showcase` - 作品展示
- `#off-topic` - 闲聊

### 🐛 Bug报告

发现Bug？请通过GitHub Issue报告：

👉 [提交Bug Report](https://github.com/yyc3/YYC3-AI-PAI/issues/new?template=bug_report.md)

**高质量Issue包含：**
1. 清晰的标题和描述
2. 可复现的步骤（最小示例）
3. 期望 vs 实际行为
4. 截屏/录屏
5. 环境信息（OS、浏览器、版本号）

### 💡 功能建议

有好想法？欢迎提出：

👉 [提交功能请求](https://github.com/yyc3/YYC3-AI-PAI/issues/new?template=feature_request.md)

**优秀的功能建议：**
- 明确的使用场景和痛点
- 详细的设计思路（如有）
- UI草图或参考实现
- 优先级评估

### 📧 商业支持

需要企业级支持？联系我们：

- 📩 Email: support@0379.email
- 💼 企业版功能：
  - SLA保障（99.9%可用性）
  - 专属技术顾问
  - 定制开发服务
  - 私有化部署支持
  - 培训和认证

## ❓ 常见问题 (FAQ)

### 安装 & 配置

<details>
<summary><strong>❓ 安装依赖时报错怎么办？</strong></summary>

**解决方案：**

1. **清除缓存重新安装**
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **检查Node.js版本**
   ```bash
   # 需要Node.js 18+
   node --version
   
   # 如果版本过低，使用nvm切换
   nvm install 18
   nvm use 18
   ```

3. **检查pnpm版本**
   ```bash
   # 推荐pnpm 9+
   pnpm --version
   
   # 升级pnpm
   npm install -g pnpm@latest
   ```

4. **权限问题（Linux/macOS）**
   ```bash
   # 如果遇到EACCES错误
   sudo chown -R $(whoami) ~/.npm
   ```

</details>

<details>
<summary><strong>❓ 如何配置AI模型API密钥？</strong></summary>

**步骤：**

1. 打开设置页面 (`Cmd/Ctrl + ,`)
2. 进入 "AI Provider" 设置
3. 选择你的AI提供商：
   - OpenAI: 需要 API Key
   - Anthropic: 需要 API Key  
   - Gemini: 需要 API Key
   - Ollama: 本地运行，无需密钥

4. 输入API Key并保存

**安全提示：**
- ✅ 密钥加密存储在本地
- ✅ 从不发送到第三方服务器
- ✅ 支持自定义端点（自托管）

</details>

<details>
<summary><strong>❓ Monaco编辑器加载缓慢？</strong></summary>

**优化方案：**

1. **启用懒加载** (默认已开启)
   ```typescript
   // vite.config.ts 已配置代码分割
   ```

2. **减少语言支持包**
   ```typescript
   // 只加载需要的语言
   import * as monaco from 'monaco-editor/esm/vs/editor/editor.main'
   import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'
   ```

3. **开启Web Worker**
   ```typescript
   // Monaco Editor自动使用Worker进行语法高亮
   ```

4. **升级硬件/网络**
   - 首次加载需下载~5MB资源
   - 后续会缓存到IndexedDB

</details>

### 使用 & 功能

<details>
<summary><strong>❓ 数据存储在哪里？安全吗？</strong></summary>

**YYC³的数据架构：**

```
本地优先架构:
├── IndexedDB (Dexie.js)
│   ├── 用户配置 (加密)
│   ├── 项目数据 (加密)
│   ├── AI对话历史 (加密)
│   └── 缓存数据 (可选加密)
│
├── Tauri Native Storage
│   └── API密钥 (系统钥匙串)
│
└── 文件系统 (可选)
    └── 导出备份 (AES-256-GCM)
```

**安全保障：**
- ✅ 所有敏感数据AES-256-GCM加密
- ✅ 默认本地存储，无需联网
- ✅ 云同步为可选项，用户完全控制
- ✅ 符合GDPR/CCPA合规要求

</details>

<details>
<summary><strong>❓ CRDT协作如何工作？</strong></summary>

**CRDT (Conflict-free Replicated Data Types)** 工作原理：

1. **无中心服务器** - 点对点直接通信
2. **自动冲突解决** - 基于操作转换(OT)
3. **离线支持** - 断网后自动合并
4. **实时同步** - <100ms延迟

**使用场景：**
- 多人同时编辑同一文件
- 代码审查协作
- 远程结对编程

**技术栈：**
- Yjs - CRDT数据结构
- WebRTC/WebSocket - 传输层
- Awareness - 光标位置同步

</details>

<details>
<summary><strong>❓ 如何导出/导入我的数据？</strong></summary>

**数据导出：**

1. 打开设置 → 数据管理
2. 点击 "导出全部数据"
3. 选择格式 (JSON/Encrypted)
4. 下载备份文件

**数据导入：**

1. 打开设置 → 数据管理
2. 点击 "导入数据"
3. 选择备份文件
4. 输入密码（如加密）
5. 确认覆盖选项

**支持的格式：**
- `.json` - 明文JSON
- `.yyc3` - 加密备份
- `.sql` - SQLite数据库（高级用户）

</details>

### 性能 & 优化

<details>
<summary><strong>❓ 内存占用过高怎么办？</strong></summary>

**诊断方法：**

1. 打开性能监控面板 (`Shift + P`)
2. 查看内存使用趋势图
3. 定位内存泄漏源

**优化策略：**

1. **关闭未使用的面板**
   - 右键面板 → Close Panel

2. **调整虚拟滚动参数**
   ```typescript
   // Settings → Performance
   virtualScroll: {
     overscan: 5,        // 减少预渲染项
     itemHeight: 48,     // 固定行高
   }
   ```

3. **清理缓存**
   - Settings → Advanced → Clear Cache
   - 或手动删除 IndexedDB

4. **禁用实时协作** (如果不需要)
   - Settings → Collaboration → Disable

**目标指标：**
- 正常使用: < 300MB
- 大型项目: < 500MB
- 警告阈值: > 800MB

</details>

<details>
<summary><strong>❓ 构建产物太大怎么优化？</strong></summary>

**当前构建大小分析：**

```
dist/assets/js/
├── index-CIY8fSJx.js      (~850KB)  ← 主Bundle
├── IDEMode-DP13X5SD.js    (~200KB)  ← Monaco Editor
├── AIAssistantPanel-*.js  (~150KB)  ← AI集成
└── ...其他chunks          (~400KB)

Total: ~4.8MB (gzipped: ~1.6MB)
```

**优化方案：**

1. **Tree Shaking** (已配置)
   ```javascript
   // vite.config.ts
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           monaco: ['monaco-editor'],
           vendor: ['react', 'react-dom']
         }
       }
     }
   }
   ```

2. **动态导入懒加载**
   ```typescript
   const IDEMode = lazy(() => import('./components/IDEMode'))
   ```

3. **Gzip/Brotli压缩** (生产环境)
   - Nginx/Apache配置压缩
   - 可减小60-70%体积

4. **移除未使用的语言包**
   - Monaco只保留TypeScript/JavaScript/JSON

</details>

## 🎓 学习资源

### 官方文档
- 📘 [架构设计文档](./docs/P0-核心架构/)
- 📗 [功能说明文档](./docs/P1-核心功能/)
- 📙 [高级特性文档](./docs/P2-高级功能/)
- 📒 [开发规范文档](./docs/YYC3-AI-开发规范/)

### 视频教程
- 🎥 [YouTube频道](https://youtube.com/@yyc3) (即将上线)
- 🎬 [Bilibili空间](https://space.bilibili.com/yyc3) (中文)

### 博客文章
- 📝 [技术博客](https://blog.yyc3.ai) (即将上线)
- 📰 [更新日志](./CHANGELOG.md)

### 社区案例
- 💼 [展示案例库](https://github.com/yyc3/awesome-yyc3) (征集贡献中)

## 🤝 贡献方式

除了代码，您还可以通过以下方式支持项目：

- ✍️ **完善文档** - 修正错误、补充示例
- 🐛 **测试反馈** - 报告Bug、验证修复
- 🌍 **国际化翻译** - 添加多语言支持
- 🎨 **UI改进** - 设计新主题、图标
- 📢 **推广宣传** - 分享给更多开发者
- 💰 **赞助支持** - [Open Collective](https://opencollective.com/yyc3)

## 📊 服务状态

查看当前系统状态：

| 服务 | 状态 | 延迟 |
|------|------|------|
| GitHub仓库 | 🟢 运行正常 | < 100ms |
| 文档站点 | 🟢 运行正常 | < 200ms |
| Discord社区 | 🟢 运行正常 | 实时 |
| CI/CD流水线 | 🟢 运行正常 | ~5min |

*最后更新: 2026-04-09*

---

## 🙏 致谢

感谢所有为YYC³生态做出贡献的开发者、设计师、测试者和用户！

特别感谢：
- 核心维护者团队
- Issue报告者和PR贡献者
- 社区活跃成员
- 赞助商和支持者

**一起构建更智能的编程未来！** 🚀

---

**需要更多帮助？** 请不要犹豫，通过上述任何渠道联系我们。我们承诺在24小时内响应每一个询问。

*YanYuCloudCube Team | 言启象限 · 语枢未来*
