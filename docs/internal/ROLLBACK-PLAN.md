# 🚨 紧急修复白屏问题 - 回滚方案

**问题**: 移除@mui依赖后导致生产环境白屏
**时间**: 2026-05-22 12:15
**优先级**: 🔴 **P0 - 紧急**

---

## 🎯 **立即行动方案**

### 方案A: 立即回滚 (推荐)

执行以下命令恢复稳定的依赖：

```bash
# 1. 恢复被移除的依赖
pnpm add @mui/material@7.3.5 @mui/icons-material@7.3.5 @emotion/react@11.14.0 @emotion/styled@11.14.1

# 2. 重新构建
pnpm build

# 3. 验证本地构建正常
pnpm dev --port 3103 --host

# 4. 如果正常，立即部署
git add .
git commit -m "fix: 回滚Material-UI依赖以修复白屏问题"
git push origin main
```

### 方案B: 深度诊断并修复

如果要坚持Material-UI移除，需要：

```bash
# 1. 检查具体冲突的包
pnpm ls @radix-ui/react-slot @radix-ui/react-compose-refs

# 2. 修复版本冲突
pnpm update @radix-ui/react-slot@latest @radix-ui/react-compose-refs@latest

# 3. 清理和重建
rm -rf node_modules dist
pnpm install
pnpm build

# 4. 详细测试
# 逐一测试每个可能受影响的组件
```

---

## 🔍 **问题根源分析**

### 最可能的原因
移除@mui/material时，可能意外移除了某些共享依赖：
- @emotion/react 可能被其他包依赖
- @emotion/styled 可能被某些UI组件间接使用
- 可能有peer dependency冲突

### 验证步骤
1. **检查生产环境**: https://code.yyc3.top/ 是否确实使用了新构建
2. **检查浏览器控制台**: 查看具体的错误堆栈
3. **检查Network标签**: 查看哪些JS文件加载失败

---

## ⏰ **时间估算**

### 方案A (回滚)
- **执行时间**: 2-3分钟
- **验证时间**: 2分钟
- **总时间**: 5分钟
- **成功概率**: 95%

### 方案B (深度修复)
- **诊断时间**: 10-15分钟
- **修复时间**: 15-30分钟
- **验证时间**: 5分钟
- **总时间**: 30-50分钟
- **成功概率**: 70%

---

## 🎯 **推荐决策**

**立即选择方案A (回滚)**，原因：
1. ✅ **最快**: 5分钟内恢复服务
2. ✅ **最安全**: 恢复已知稳定状态
3. ✅ **用户影响最小**: 快速解决白屏
4. ✅ **后续优化**: 可以在稳定后再优化UI库

---

## 📞 **执行计划**

### 第一步: 立即回滚 (执行)
```bash
pnpm add @mui/material@7.3.5 @mui/icons-material@7.3.5 @emotion/react@11.14.0 @emotion/styled@11.14.1
pnpm build
```

### 第二步: 本地验证 (执行)
```bash
pnpm dev --port 3103 --host
# 浏览器访问 http://localhost:3103
# 检查是否正常显示
```

### 第三步: 如果正常，立即部署 (执行)
```bash
git add .
git commit -m "fix: 回滚Material-UI依赖以修复白屏问题 - 紧急修复"
git push origin main
```

### 第四步: 生产环境验证 (等待)
```bash
# 等待CI/CD完成 (约2-3分钟)
curl -I https://code.yyc3.top/
# 访问 https://code.yyc3.top/ 确认修复
```

---

**状态**: 🟡 **等待执行决策**
**建议**: 立即执行回滚方案
**时间窗口**: 需要在5分钟内完成