# 🚀 YYC³ AI-PAI - 快速部署指南

## 📋 自动部署 (推荐)

推送到 `main` 分支即可自动部署到 **ai-pai.yyc3.top**:

```bash
git add .
git commit -m "feat: your changes"
git push origin main
```

**自动部署流程:**
- ✅ 代码质量检查 (ESLint)
- ✅ 测试运行 (2067个测试)
- ✅ 构建优化
- ✅ 部署到服务器
- ✅ 健康检查
- ✅ 性能监控
- ✅ 结果通知

## 🔧 手动部署

### 1. 本地构建
```bash
pnpm install
pnpm build
pnpm test
```

### 2. 手动部署脚本
```bash
# 设置环境变量
export DEPLOY_HOST="ai-pai.yyc3.top"
export DEPLOY_USER="your-user"

# 运行部署脚本
bash scripts/deploy.sh
```

### 3. 监控部署
```bash
# 监控部署状态
bash scripts/monitor.sh ai-pai.yyc3.top
```

## 🔑 GitHub Secrets 配置

需要在 GitHub 仓库设置中配置以下 Secrets:

### 必需配置
```bash
PRODUCTION_HOST          # 服务器地址
PRODUCTION_USER          # SSH用户名
PRODUCTION_SSH_KEY       # SSH私钥
PRODUCTION_PORT          # SSH端口 (可选，默认22)
```

### 可选配置
```bash
SLACK_WEBHOOK           # Slack通知Webhook
```

## 🏥 健康检查

### 手动检查
```bash
# HTTP状态检查
curl -I https://ai-pai.yyc3.top

# 响应时间检查
curl -o /dev/null -s -w "%{time_total}\n" https://ai-pai.yyc3.top

# SSL证书检查
echo | openssl s_client -servername ai-pai.yyc3.top -connect ai-pai.yyc3.top:443 | openssl x509 -noout -dates
```

### 自动监控
部署后会自动进行健康检查:
- HTTP状态码检查 (预期: 200)
- 响应时间检查 (预期: < 2s)
- 关键资源检查 (CSS/JS)

## 📊 部署结果追踪

### GitHub Actions
1. 访问: https://github.com/YYC-Cube/YYC3-AI-PAI/actions
2. 选择最新的 "CI/CD" 工作流运行
3. 查看详细的部署日志

### 部署监控
- **实时日志**: GitHub Actions输出
- **健康检查**: 自动监控5分钟
- **性能报告**: Lighthouse CI结果

## 🔄 回滚策略

### 自动回滚
部署失败时会自动恢复最近备份。

### 手动回滚
```bash
# SSH到服务器
ssh user@ai-pai.yyc3.top

# 查看可用备份
ls -la /var/backups/ai-pai.yyc3.top/

# 恢复备份
cd /var/www/ai-pai.yyc3.top
tar -xzf /var/backups/ai-pai.yyc3.top/backup_YYYYMMDD_HHMMSS.tar.gz
```

## 🎯 部署环境

- **生产环境**: https://ai-pai.yyc3.top
- **GitHub Pages**: https://yyc-cube.github.io/YYC3-AI-PAI/
- **本地开发**: http://localhost:3100

## 📈 性能目标

- **首次内容绘制**: < 2s
- **可交互时间**: < 5s
- **Lighthouse评分**: > 90
- **HTTP状态**: 200
- **响应时间**: < 2s

---

**需要帮助?** 查看详细文档: `docs/P0-核心架构/YYC3-P0-DevOps-CICD部署指南.md`