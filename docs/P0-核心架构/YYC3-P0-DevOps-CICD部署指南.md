# YYC³ AI-PAI - CI/CD部署配置指南

## 📋 概述

完善的CI/CD配置，实现自动部署到 **ai-pai.yyc3.top** 域名。

## 🔧 GitHub Secrets 配置

### 必需的 Secrets

在 GitHub 仓库设置中添加以下 Secrets：

#### 1. 生产环境配置
```bash
PRODUCTION_HOST          # 服务器地址 (例如: your-server.com)
PRODUCTION_USER          # SSH用户名 (例如: root)
PRODUCTION_SSH_KEY       # SSH私钥
PRODUCTION_PORT          # SSH端口 (默认: 22)
```

#### 2. 通知配置 (可选)
```bash
SLACK_WEBHOOK           # Slack Webhook URL 用于部署通知
```

### 🔑 SSH密钥生成

```bash
# 生成SSH密钥对
ssh-keygen -t ed25519 -C "github-actions@ai-pai.yyc3.top" -f ~/.ssh/github_actions

# 复制公钥到服务器
ssh-copy-id -i ~/.ssh/github_actions.pub user@ai-pai.yyc3.top

# 将私钥添加到GitHub Secrets
cat ~/.ssh/github_actions | pbcopy  # macOS
```

## 🚀 部署流程

### 自动部署
推送代码到 `main` 分支后自动触发：
1. **代码质量检查** - ESLint + Console检查
2. **测试运行** - 2067个测试用例
3. **应用构建** - Vite优化构建
4. **服务器部署** - SSH + SCP部署
5. **健康检查** - 自动验证部署状态
6. **性能监控** - Lighthouse性能分析
7. **结果通知** - Slack通知（可选）

### 手动部署
```bash
# 本地部署
./scripts/deploy.sh

# 监控部署
./scripts/monitor.sh ai-pai.yyc3.top
```

## 🔍 监控和日志

### 部署监控
- **实时监控**: GitHub Actions标签页
- **健康检查**: 自动HTTP状态检查
- **性能监控**: Lighthouse CI集成
- **错误追踪**: 自动失败通知

### 访问日志
```bash
# SSH到服务器查看日志
ssh user@ai-pai.yyc3.top
tail -f /var/log/nginx/access.log
```

## 🛠️ 故障排除

### 常见问题

1. **SSH连接失败**
   ```bash
   # 测试SSH连接
   ssh -i ~/.ssh/github_actions user@ai-pai.yyc3.top

   # 检查SSH密钥权限
   chmod 600 ~/.ssh/github_actions
   ```

2. **部署失败**
   ```bash
   # 检查GitHub Actions日志
   # 仓库 > Actions > 选择运行 > 查看详细日志

   # 手动运行部署
   ./scripts/deploy.sh
   ```

3. **健康检查失败**
   ```bash
   # 手动健康检查
   curl -I https://ai-pai.yyc3.top

   # 检查Nginx配置
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 📊 性能目标

- **首字节时间 (TTFB)**: < 200ms
- **首次内容绘制 (FCP)**: < 2s
- **可交互时间 (TTI)**: < 5s
- **Lighthouse评分**: > 90

## 🔄 回滚策略

部署失败时的自动回滚：
1. 保留最近5个备份
2. 部署失败时自动恢复上一个备份
3. 手动回滚命令：
   ```bash
   # SSH到服务器
   ssh user@ai-pai.yyc3.top

   # 恢复备份
   cd /var/www/ai-pai.yyc3.top
   tar -xzf /var/backups/ai-pai.yyc3.top/backup_YYYYMMDD_HHMMSS.tar.gz
   ```

## 📈 监控仪表板

- **GitHub Actions**: https://github.com/YYC-Cube/YYC3-AI-PAI/actions
- **部署状态**: https://ai-pai.yyc3.top
- **Lighthouse报告**: GitHub Actions Artifacts

---

*最后更新: 2026-05-22*
*维护者: YanYuCloudCube Team*