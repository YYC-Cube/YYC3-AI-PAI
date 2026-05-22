/**
 * 简易生产环境监控系统
 * 基于用户需求: 加强生产环境实时监控
 */

export interface PerformanceMetrics {
  timestamp: number
  pageLoadTime?: number
  domContentLoaded?: number
  firstPaint?: number
  firstContentfulPaint?: number
  memoryUsage?: number
  connectionType?: string
  onLine?: boolean
}

export interface ErrorMetrics {
  timestamp: number
  message: string
  source: string
  userAgent: string
  url: string
}

class SimpleProductionMonitor {
  private metrics: PerformanceMetrics[] = []
  private errors: ErrorMetrics[] = []
  private isMonitoring = false
  private maxMetrics = 100 // 最多保存100条记录

  constructor() {
    this.initPerformanceMonitoring()
    this.initErrorMonitoring()
  }

  // 启动监控
  startMonitoring() {
    if (this.isMonitoring) return
    this.isMonitoring = true

    // 每30秒收集一次指标
    setInterval(() => {
      this.collectMetrics()
    }, 30000)

    // 页面卸载时发送数据
    window.addEventListener('beforeunload', () => {
      this.sendDataToServer()
    })
  }

  // 初始化性能监控
  private initPerformanceMonitoring() {
    if (typeof window === 'undefined' || !window.performance) return

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.collectPageLoadMetrics()
      }, 0)
    })
  }

  // 收集页面加载指标
  private collectPageLoadMetrics() {
    if (!window.performance) return

    const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    const metrics: PerformanceMetrics = {
      timestamp: Date.now(),
      pageLoadTime: perfData?.loadEventEnd - perfData?.fetchStart,
      domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.fetchStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint(),
      memoryUsage: this.getMemoryUsage(),
      connectionType: this.getConnectionType(),
      onLine: navigator.onLine,
    }

    this.addMetric(metrics)
  }

  // 收集实时指标
  private collectMetrics() {
    const metrics: PerformanceMetrics = {
      timestamp: Date.now(),
      memoryUsage: this.getMemoryUsage(),
      connectionType: this.getConnectionType(),
      onLine: navigator.onLine,
    }

    this.addMetric(metrics)
  }

  // 获取首次绘制时间
  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint')
    const fp = paintEntries.find(entry => entry.name === 'first-paint')
    return fp?.startTime || 0
  }

  // 获取首次内容绘制时间
  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint')
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return fcp?.startTime || 0
  }

  // 获取内存使用情况
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const mem = (performance as any).memory
      return Math.round(mem.usedJSHeapSize / 1048576) // MB
    }
    return 0
  }

  // 获取网络连接类型
  private getConnectionType(): string {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection
      return conn.effectiveType || 'unknown'
    }
    return 'unknown'
  }

  // 初始化错误监控
  private initErrorMonitoring() {
    window.addEventListener('error', (event) => {
      this.recordError({
        timestamp: Date.now(),
        message: event.message,
        source: event.filename || 'unknown',
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        timestamp: Date.now(),
        message: `Unhandled Promise Rejection: ${event.reason}`,
        source: 'promise',
        userAgent: navigator.userAgent,
        url: window.location.href,
      })
    })
  }

  // 记录错误
  private recordError(error: ErrorMetrics) {
    this.errors.push(error)

    // 限制错误记录数量
    if (this.errors.length > 50) {
      this.errors.shift()
    }

    // 检查是否需要告警
    this.checkErrorAlert()
  }

  // 检查错误告警
  private checkErrorAlert() {
    const recentErrors = this.errors.filter(
      e => Date.now() - e.timestamp < 60000 // 最近1分钟
    )

    if (recentErrors.length > 5) {
      console.warn('🚨 错误率过高，请检查生产环境！', {
        recentErrorCount: recentErrors.length,
        latestError: recentErrors[recentErrors.length - 1],
      })
    }
  }

  // 添加指标
  private addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)

    // 限制指标记录数量
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }
  }

  // 发送数据到服务器
  private async sendDataToServer() {
    const data = {
      metrics: this.metrics,
      errors: this.errors,
      timestamp: Date.now(),
    }

    try {
      // 这里可以发送到实际的监控API
      console.log('📊 监控数据:', data)
      // await fetch('/api/monitoring/metrics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
    } catch (error) {
      console.error('发送监控数据失败:', error)
    }
  }

  // 获取当前指标
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null
  }

  // 获取所有指标
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  // 获取最近的错误
  getRecentErrors(count = 10): ErrorMetrics[] {
    return this.errors.slice(-count)
  }

  // 健康状态检查
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical'
    metrics: {
      errorRate: number
      avgMemory: number
      lastUpdate: number
    }
  } {
    const recentErrors = this.errors.filter(
      e => Date.now() - e.timestamp < 300000 // 最近5分钟
    )

    const errorRate = recentErrors.length / 5 // 每分钟错误数
    const latestMetric = this.getCurrentMetrics()

    const avgMemory = latestMetric?.memoryUsage || 0

    let status: 'healthy' | 'warning' | 'critical' = 'healthy'

    if (errorRate > 1 || avgMemory > 100) {
      status = 'critical'
    } else if (errorRate > 0.2 || avgMemory > 50) {
      status = 'warning'
    }

    return {
      status,
      metrics: {
        errorRate,
        avgMemory,
        lastUpdate: Date.now(),
      },
    }
  }
}

// 创建全局监控实例
let globalMonitor: SimpleProductionMonitor | null = null

export function initMonitoring() {
  if (typeof window !== 'undefined' && !globalMonitor) {
    globalMonitor = new SimpleProductionMonitor()
    globalMonitor.startMonitoring()
    console.log('✅ 监控系统已启动')
  }
  return globalMonitor
}

export function getMonitor(): SimpleProductionMonitor | null {
  return globalMonitor
}

// 开发环境下显示监控信息
if (import.meta.env.DEV) {
  (window as any).__monitor = () => globalMonitor
}
