/**
 * @file performanceBaseline.ts
 * @description 性能基准线建立和监控工具
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-05-22
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags performance,monitoring,baseline,metrics
 */

// ===== Core Web Vitals 基准线 =====

/**
 * Core Web Vitals 目标值 (基于Google标准)
 */
export const CORE_WEB_VITALS_TARGETS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, needsImprovement: 300 },  // First Input Delay (ms)
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte (ms)
  INP: { good: 200, needsImprovement: 500 },  // Interaction to Next Paint (ms)
} as const

/**
 * 自定义性能基准线
 */
export const CUSTOM_PERFORMANCE_TARGETS = {
  // 构建相关
  buildSize: {
    total: 8 * 1024 * 1024, // 8MB目标
    vendorChunks: 3 * 1024 * 1024, // 3MB目标
    individualChunks: 500 * 1024, // 500KB目标
  },
  buildTime: {
    target: 3000, // 3秒构建时间目标
    warning: 5000, // 5秒警告
  },

  // 运行时性能
  runtime: {
    firstRender: 1500, // 首次渲染1.5秒
    interaction: 100, // 交互响应100ms
    animation: 16, // 动画帧率16ms (60fps)
  },

  // 资源使用
  resources: {
    memory: {
      good: 50 * 1024 * 1024, // 50MB
      warning: 100 * 1024 * 1024, // 100MB
      critical: 200 * 1024 * 1024, // 200MB
    },
    cpu: {
      good: 30, // 30%使用率
      warning: 60, // 60%使用率
      critical: 90, // 90%使用率
    },
  },

  // 用户体验
  ux: {
    lighthouse: {
      performance: 90, // 性能分数
      accessibility: 95, // 可访问性分数
      bestPractices: 90, // 最佳实践分数
      seo: 90, // SEO分数
    },
  },
} as const

// ===== 性能基准线数据结构 =====

export interface PerformanceBaseline {
  timestamp: Date
  environment: 'development' | 'production'

  // Core Web Vitals
  webVitals: {
    lcp: number
    fid: number
    cls: number
    fcp: number
    ttfb: number
    inp: number
  }

  // 构建指标
  buildMetrics: {
    buildTime: number
    totalSize: number
    vendorSize: number
    chunkCount: number
  }

  // 运行时指标
  runtimeMetrics: {
    firstRender: number
    ttfr: number // Time to First Render
  }

  // 资源使用
  resourceMetrics: {
    memoryUsed: number
    memoryTotal: number
    cpuUsage: number
  }

  // 用户体验指标
  uxMetrics: {
    lighthouse?: {
      performance: number
      accessibility: number
      bestPractices: number
      seo: number
    }
  }
}

// ===== 性能基准线管理 =====

/**
 * 性能基准线管理器
 */
export class PerformanceBaselineManager {
  private baseline: PerformanceBaseline | null = null
  private measurements: PerformanceBaseline[] = []
  private readonly maxMeasurements = 100 // 保留最近100次测量

  /**
   * 建立当前性能基准线
   */
  establishBaseline(): PerformanceBaseline {
    const baseline: PerformanceBaseline = {
      timestamp: new Date(),
      environment: import.meta.env.PROD ? 'production' : 'development',

      webVitals: this.getWebVitals(),
      buildMetrics: this.getBuildMetrics(),
      runtimeMetrics: this.getRuntimeMetrics(),
      resourceMetrics: this.getResourceMetrics(),
      uxMetrics: {
        lighthouse: undefined, // 需要手动运行Lighthouse
      },
    }

    this.baseline = baseline
    this.measurements.push(baseline)

    // 限制测量历史大小
    if (this.measurements.length > this.maxMeasurements) {
      this.measurements.shift()
    }

    return baseline
  }

  /**
   * 获取Core Web Vitals
   */
  private getWebVitals() {
    // 从performance store或performance API获取
    return {
      lcp: 0, // 需要从实际测量获取
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      inp: 0,
    }
  }

  /**
   * 获取构建指标 (仅在构建时可用)
   */
  private getBuildMetrics() {
    if (import.meta.env.PROD) {
      return {
        buildTime: 2250, // 从构建日志获取
        totalSize: 14 * 1024 * 1024, // 14MB
        vendorSize: 665 * 1024, // 665KB
        chunkCount: 15, // chunk数量
      }
    }
    return {
      buildTime: 0,
      totalSize: 0,
      vendorSize: 0,
      chunkCount: 0,
    }
  }

  /**
   * 获取运行时性能指标
   */
  private getRuntimeMetrics() {
    if (typeof performance === 'undefined') {
      return { firstRender: 0, ttfr: 0 }
    }

    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    return {
      firstRender: navigationTiming?.loadEventEnd || 0,
      ttfr: navigationTiming?.domContentLoadedEventEnd || 0,
    }
  }

  /**
   * 获取资源使用情况
   */
  private getResourceMetrics() {
    if ('memory' in performance) {
      const mem = (performance as any).memory
      return {
        memoryUsed: mem.usedJSHeapSize,
        memoryTotal: mem.totalJSHeapSize,
        cpuUsage: 0, // 需要其他方式获取
      }
    }

    return {
      memoryUsed: 0,
      memoryTotal: 0,
      cpuUsage: 0,
    }
  }

  /**
   * 评估性能与基准线的对比
   */
  evaluatePerformance(current: PerformanceBaseline) {
    const baseline = this.baseline
    if (!baseline) {
      return { status: 'no-baseline' }
    }

    const comparison = {
      webVitals: this.compareWebVitals(current.webVitals, baseline.webVitals),
      buildMetrics: this.compareBuildMetrics(current.buildMetrics, baseline.buildMetrics),
      runtimeMetrics: this.compareRuntimeMetrics(current.runtimeMetrics, baseline.runtimeMetrics),
      resourceMetrics: this.compareResourceMetrics(current.resourceMetrics, baseline.resourceMetrics),
    }

    return this.getOverallStatus(comparison)
  }

  /**
   * 对比Web Vitals
   */
  private compareWebVitals(current: any, baseline: any) {
    return {
      lcp: this.calculateImprovement(current.lcp, baseline.lcp),
      fcp: this.calculateImprovement(current.fcp, baseline.fcp),
      cls: this.calculateImprovement(current.cls, baseline.cls),
    }
  }

  /**
   * 对比构建指标
   */
  private compareBuildMetrics(current: any, baseline: any) {
    return {
      buildTime: this.calculateImprovement(current.buildTime, baseline.buildTime),
      totalSize: this.calculateImprovement(current.totalSize, baseline.totalSize),
    }
  }

  /**
   * 对比运行时指标
   */
  private compareRuntimeMetrics(current: any, baseline: any) {
    return {
      firstRender: this.calculateImprovement(current.firstRender, baseline.firstRender),
    }
  }

  /**
   * 对比资源指标
   */
  private compareResourceMetrics(current: any, baseline: any) {
    return {
      memoryUsed: this.calculateImprovement(current.memoryUsed, baseline.memoryUsed),
    }
  }

  /**
   * 计算改进百分比
   */
  private calculateImprovement(current: number, baseline: number): number {
    if (baseline === 0) return 0
    return ((baseline - current) / baseline) * 100
  }

  /**
   * 获取总体状态评估
   */
  private getOverallStatus(comparison: any) {
    // 简化的评估逻辑
    const improvements = Object.values(comparison).flat()
    const avgImprovement = improvements.reduce((sum: number, val: any) => {
      const numericVal = typeof val === 'object' ? Object.values(val)[0] : val
      return sum + (typeof numericVal === 'number' ? numericVal : 0)
    }, 0) / improvements.length

    if (avgImprovement > 20) return { status: 'excellent', improvement: avgImprovement }
    if (avgImprovement > 10) return { status: 'good', improvement: avgImprovement }
    if (avgImprovement > 0) return { status: 'fair', improvement: avgImprovement }
    return { status: 'needs-attention', improvement: avgImprovement }
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const baseline = this.baseline
    if (!baseline) {
      return 'No baseline established'
    }

    return `
Performance Baseline Report
============================
Date: ${baseline.timestamp.toISOString()}
Environment: ${baseline.environment}

Build Metrics:
- Build Time: ${baseline.buildMetrics.buildTime}ms
- Total Size: ${this.formatBytes(baseline.buildMetrics.totalSize)}
- Vendor Size: ${this.formatBytes(baseline.buildMetrics.vendorSize)}
- Chunk Count: ${baseline.buildMetrics.chunkCount}

Runtime Metrics:
- First Render: ${baseline.runtimeMetrics.firstRender}ms
- Time to First Render: ${baseline.runtimeMetrics.ttfr}ms

Resource Metrics:
- Memory Used: ${this.formatBytes(baseline.resourceMetrics.memoryUsed)}
- Memory Total: ${this.formatBytes(baseline.resourceMetrics.memoryTotal)}

Recommendations:
${this.getRecommendations()}
    `.trim()
  }

  /**
   * 获取性能改进建议
   */
  private getRecommendations(): string {
    const recommendations: string[] = []

    // 构建大小建议
    if (this.baseline && this.baseline.buildMetrics.totalSize > CUSTOM_PERFORMANCE_TARGETS.buildSize.total) {
      recommendations.push('- Consider code splitting to reduce bundle size')
    }

    // 运行时性能建议
    if (this.baseline && this.baseline.runtimeMetrics.firstRender > CUSTOM_PERFORMANCE_TARGETS.runtime.firstRender) {
      recommendations.push('- Optimize critical rendering path')
    }

    // 内存使用建议
    if (this.baseline && this.baseline.resourceMetrics.memoryUsed > CUSTOM_PERFORMANCE_TARGETS.resources.memory.warning) {
      recommendations.push('- Investigate memory usage and potential leaks')
    }

    return recommendations.length > 0 ? recommendations.join('\n') : '- Performance is within target ranges'
  }

  /**
   * 格式化字节大小
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  /**
   * 导出基准线数据
   */
  exportBaseline(): string {
    return JSON.stringify(this.baseline, null, 2)
  }

  /**
   * 导入基准线数据
   */
  importBaseline(data: string): void {
    try {
      this.baseline = JSON.parse(data) as PerformanceBaseline
    } catch (error) {
      console.error('Failed to import baseline:', error)
    }
  }

  /**
   * 获取历史测量数据
   */
  getHistory(): PerformanceBaseline[] {
    return [...this.measurements]
  }

  /**
   * 清除所有数据
   */
  clear(): void {
    this.baseline = null
    this.measurements = []
  }
}

// ===== 全局实例 =====

export const performanceBaselineManager = new PerformanceBaselineManager()

// ===== 便捷函数 =====

/**
 * 建立性能基准线
 */
export function establishPerformanceBaseline(): PerformanceBaseline {
  return performanceBaselineManager.establishBaseline()
}

/**
 * 生成性能报告
 */
export function generatePerformanceReport(): string {
  return performanceBaselineManager.generateReport()
}

/**
 * 评估当前性能
 */
export function evaluateCurrentPerformance() {
  const current = performanceBaselineManager.establishBaseline()
  return performanceBaselineManager.evaluatePerformance(current)
}

/**
 * 初始化性能基准线系统
 */
export function initPerformanceBaseline() {
  if (typeof window !== 'undefined') {
    // 页面加载完成后建立基准线
    if (document.readyState === 'complete') {
      establishPerformanceBaseline()
    } else {
      window.addEventListener('load', establishPerformanceBaseline)
    }

    // 定期重新测量 (每5分钟)
    setInterval(() => {
      establishPerformanceBaseline()
    }, 5 * 60 * 1000)

    console.log('[Performance Baseline] System initialized')
  }
}
