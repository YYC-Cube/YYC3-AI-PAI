---
file: /Volumes/Development/yyc3-77/YYC3-AI-PAI/docs/YYC3-AI-技术文档/YYC3-AI-技术-安全API文档.md
description: 技术文档
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-03-06
updated: 2026-04-09
status: stable
tags: [technical],[documentation],[guide]
category: technical
language: zh-CN
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC³ 安全功能 API 文档

## 概述

本文档描述了 YYC³ 项目中实现的安全功能 API，包括 CSRF 防护、敏感数据脱敏、性能监控告警和安全审计日志。

---

## 1. CSRF 防护 (`src/app/utils/csrf.ts`)

### 1.1 CSRFTokenManager

CSRF Token 管理器，用于生成、存储和验证 CSRF Token。

```typescript
import { CSRFTokenManager, secureFetch } from '@/app/utils/csrf'

// 创建管理器实例
const csrfManager = new CSRFTokenManager()

// 获取 Token
const token = csrfManager.getToken()

// 验证 Token
const isValid = csrfManager.validateToken(userProvidedToken)

// 生成新的 Token
const newToken = csrfManager.refreshToken()
```

### 1.2 secureFetch

安全的 fetch 包装器，自动添加 CSRF Token。

```typescript
import { secureFetch } from '@/app/utils/csrf'

// GET 请求（自动添加 CSRF Token 到 header）
const response = await secureFetch('/api/data')

// POST 请求（自动添加 CSRF Token 到 body）
const response = await secureFetch('/api/update', {
  method: 'POST',
  body: JSON.stringify({ data: 'value' })
})
```

### 1.3 useCSRFToken Hook

React Hook，用于在组件中使用 CSRF Token。

```typescript
import { useCSRFToken } from '@/app/utils/csrf'

function MyComponent() {
  const { token, refreshToken, validateToken } = useCSRFToken()
  
  const handleSubmit = async () => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': token
      }
    })
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## 2. 敏感数据脱敏 (`src/app/utils/sanitize.ts`)

### 2.1 SensitiveDataSanitizer

敏感数据脱敏工具，支持多种敏感数据类型的自动检测和脱敏。

```typescript
import { SensitiveDataSanitizer } from '@/app/utils/sanitize'

// 创建脱敏器实例
const sanitizer = new SensitiveDataSanitizer()

// 脱敏字符串
const text = 'API Key: sk-1234567890, Email: user@example.com'
const sanitized = sanitizer.sanitize(text)
// 结果: 'API Key: ****REDACTED****, Email: ****REDACTED****'

// 脱敏对象
const obj = {
  name: 'John',
  password: 'secret123',
  email: 'john@example.com'
}
const sanitizedObj = sanitizer.sanitizeObject(obj)
// 结果: { name: 'John', password: '****REDACTED****', email: '****REDACTED****' }
```

### 2.2 支持的敏感数据类型

| 类型 | 描述 | 示例 |
|------|------|------|
| `api_key` | API 密钥 | `sk-xxxxx`, `api-key-xxxxx` |
| `jwt_token` | JWT Token | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `email` | 电子邮件 | `user@example.com` |
| `phone` | 电话号码 | `13812345678`, `+86-138-1234-5678` |
| `ip_address` | IP 地址 | `192.168.1.1`, `2001:0db8:85a3::8a2e:0370:7334` |
| `credit_card` | 信用卡号 | `4111-1111-1111-1111` |
| `password` | 密码字段 | `password: xxx` |

### 2.3 useSensitiveDataSanitizer Hook

React Hook，用于在组件中使用脱敏功能。

```typescript
import { useSensitiveDataSanitizer } from '@/app/utils/sanitize'

function LogViewer({ logData }) {
  const { sanitize, sanitizeObject, detectSensitiveData } = useSensitiveDataSanitizer()
  
  // 检测敏感数据
  const detected = detectSensitiveData(logData)
  
  // 脱敏后显示
  return <pre>{sanitize(logData)}</pre>
}
```

---

## 3. 性能监控告警 (`src/app/utils/performance-monitor.ts`)

### 3.1 PerformanceMonitor

性能监控器，用于收集、分析和告警性能指标。

```typescript
import { PerformanceMonitor, performanceMonitor } from '@/app/utils/performance-monitor'

// 使用默认实例
performanceMonitor.recordMetric({
  name: 'api-response-time',
  value: 150,
  unit: 'ms',
  category: 'network'
})

// 创建自定义实例
const monitor = new PerformanceMonitor({
  enabled: true,
  sampleInterval: 1000,
  thresholds: {
    'render-time': { warning: 16, critical: 33 },
    'fps': { warning: 30, critical: 20 }
  }
})
```

### 3.2 性能指标记录

```typescript
// 记录同步操作耗时
const result = monitor.measureTime('sync-operation', () => {
  // 执行操作
  return computeHeavyTask()
})

// 记录异步操作耗时
const data = await monitor.measureTimeAsync('api-call', async () => {
  return await fetchData()
})

// 手动记录指标
monitor.recordMetric({
  name: 'memory-used',
  value: 50 * 1024 * 1024, // 50MB
  unit: 'bytes',
  category: 'memory'
})
```

### 3.3 告警配置

```typescript
const monitor = new PerformanceMonitor({
  thresholds: {
    'render-time': { warning: 16, critical: 33 },
    'fps': { warning: 30, critical: 20 },
    'memory-used': { warning: 100 * 1024 * 1024, critical: 200 * 1024 * 1024 },
    'api-response-time': { warning: 1000, critical: 3000 }
  },
  alertCallbacks: [
    (alert) => {
      console.log(`[${alert.level}] ${alert.metric}: ${alert.message}`)
    }
  ]
})
```

### 3.4 性能报告

```typescript
// 生成性能报告
const report = monitor.generateReport()
console.log(report.summary)
console.log(report.alerts)
console.log(report.recommendations)

// 获取指标历史
const history = monitor.getMetricHistory('fps', 10) // 最近10条

// 获取告警列表
const alerts = monitor.getAlerts(false) // 未确认的告警
```

---

## 4. 安全审计日志 (`src/app/utils/security-audit.ts`)

### 4.1 SecurityAuditLogger

安全审计日志记录器，用于记录和追踪安全相关事件。

```typescript
import { securityAudit, logAuditEvent } from '@/app/utils/security-audit'

// 记录审计事件
logAuditEvent({
  type: 'auth.login',
  severity: 'low',
  userId: 'user-123',
  action: 'User logged in successfully',
  details: { method: 'password' },
  success: true
})
```

### 4.2 审计事件类型

| 类型 | 描述 | 严重级别 |
|------|------|----------|
| `auth.login` | 用户登录 | low/medium |
| `auth.logout` | 用户登出 | low |
| `auth.password_change` | 密码修改 | medium |
| `auth.mfa_enable/disable` | MFA 设置 | medium |
| `file.create/read/update/delete` | 文件操作 | low-high |
| `database.connect/query/export` | 数据库操作 | medium-high |
| `api.key_generate/revoke` | API 密钥管理 | high |
| `security.alert` | 安全告警 | high/critical |

### 4.3 查询审计日志

```typescript
// 获取所有事件
const events = securityAudit.getEvents()

// 筛选事件
const failedLogins = securityAudit.getEvents({
  type: 'auth.login',
  success: false,
  startTime: Date.now() - 24 * 60 * 60 * 1000 // 最近24小时
})

// 获取统计信息
const stats = securityAudit.getStats()
console.log(stats.total, stats.bySeverity, stats.successRate)
```

### 4.4 订阅审计事件

```typescript
// 订阅实时审计事件
const unsubscribe = securityAudit.subscribe((event) => {
  if (event.severity === 'critical') {
    notifySecurityTeam(event)
  }
})

// 取消订阅
unsubscribe()
```

### 4.5 导出审计日志

```typescript
// 导出为 JSON
const jsonData = securityAudit.export('json')

// 导出为 CSV
const csvData = securityAudit.export('csv')
```

---

## 5. UI 组件

### 5.1 PerformanceAlertPanel

性能告警面板组件，用于显示和管理性能告警。

```tsx
import { PerformanceAlertPanel } from '@/app/components/PerformanceAlertPanel'

function App() {
  const [showAlerts, setShowAlerts] = useState(false)
  
  return (
    <>
      <button onClick={() => setShowAlerts(true)}>查看告警</button>
      <PerformanceAlertPanel 
        visible={showAlerts} 
        onClose={() => setShowAlerts(false)} 
      />
    </>
  )
}
```

### 5.2 SecurityAuditPanel

安全审计面板组件，用于显示和管理审计日志。

```tsx
import { SecurityAuditPanel } from '@/app/components/SecurityAuditPanel'

function App() {
  const [showAudit, setShowAudit] = useState(false)
  
  return (
    <>
      <button onClick={() => setShowAudit(true)}>安全审计</button>
      <SecurityAuditPanel 
        visible={showAudit} 
        onClose={() => setShowAudit(false)} 
      />
    </>
  )
}
```

---

## 6. 最佳实践

### 6.1 CSRF 防护

- 所有状态变更操作（POST、PUT、DELETE）都应使用 `secureFetch`
- Token 应存储在 HttpOnly Cookie 中（服务端配置）
- 定期刷新 Token 以提高安全性

### 6.2 敏感数据脱敏

- 日志输出前必须进行脱敏处理
- API 响应中包含敏感数据时应进行过滤
- 使用 `sanitizeObject` 处理复杂嵌套对象

### 6.3 性能监控

- 关键操作都应记录性能指标
- 设置合理的告警阈值
- 定期分析性能报告并优化

### 6.4 安全审计

- 所有敏感操作都应记录审计日志
- 设置失败尝试阈值和自动告警
- 定期导出和分析审计日志

---

## 7. 配置参考

### 7.1 Content Security Policy

在 `index.html` 中配置 CSP：

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.openai.com https://api.anthropic.com;
  font-src 'self' data:;
">
```

### 7.2 安全相关环境变量

```env
# CSRF Token 密钥（服务端）
CSRF_SECRET=your-secret-key

# 安全审计日志级别
AUDIT_LOG_LEVEL=info

# 性能监控开关
PERFORMANCE_MONITOR_ENABLED=true
```

---

## 8. 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2026-04-04 | 初始版本，包含 CSRF 防护、敏感数据脱敏、性能监控告警、安全审计日志 |

---

*文档维护：YYC³ Team*
*最后更新：2026-04-04*
