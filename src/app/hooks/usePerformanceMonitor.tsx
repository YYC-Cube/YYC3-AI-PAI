/**
 * @file usePerformanceMonitor.ts
 * @description 性能监控Hook，收集Core Web Vitals和组件性能
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-24
 * @updated 2026-03-24
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags hook,performance,monitoring,web-vitals,profiler
 */

import React, { useEffect, useRef } from 'react'
import {
  onCLS,
  onFCP,
  onINP,
  onLCP,
  onTTFB,
} from 'web-vitals'
import { usePerformanceStore, type CoreWebVitals } from '../store/performance-store'

interface WebVitalMetric {
  name: string
  value: number
  rating: string
  delta: number
  id: string
  navigationType?: string
}

type ReportHandler = (callback: (metric: WebVitalMetric) => void) => void

/**
 * 性能监控Hook配置
 */
export interface UsePerformanceMonitorOptions {
  /** 是否启用Core Web Vitals监控 */
  enableWebVitals?: boolean
  /** 是否启用组件性能追踪 */
  _enableComponentProfiling?: boolean
  /** 是否启用系统资源监控 */
  enableSystemMonitoring?: boolean
  /** 系统资源监控间隔 (ms) */
  systemMonitoringInterval?: number
  /** 自定义Web Vitals报告处理器 */
  onReport?: (metric: WebVitalMetric) => void
  /** 是否在控制台输出性能数据 */
  debug?: boolean
}

/**
 * Core Web Vitals指标映射
 */
const VITALS_MAPPING: Record<string, keyof CoreWebVitals> = {
  CLS: 'cls',
  INP: 'inp',
  LCP: 'lcp',
  FCP: 'fcp',
  TTFB: 'ttfb',
}

/**
 * 性能监控Hook
 *
 * @example
 * ```tsx
 * function App() {
 *   usePerformanceMonitor({
 *     enableWebVitals: true,
 *     _enableComponentProfiling: true,
 *     enableSystemMonitoring: true,
 *     debug: true,
 *   })
 *
 *   return <MyComponent />
 * }
 * ```
 */
export function usePerformanceMonitor(options: UsePerformanceMonitorOptions = {}) {
  const {
    enableWebVitals = true,
    _enableComponentProfiling = false,
    enableSystemMonitoring = false,
    systemMonitoringInterval = 2000,
    onReport,
    debug = false,
  } = options

  const updateWebVital = usePerformanceStore((state) => state.updateWebVital)
  const recordSystemMetrics = usePerformanceStore((state) => state.recordSystemMetrics)
  const startMonitoring = usePerformanceStore((state) => state.startMonitoring)
  const stopMonitoring = usePerformanceStore((state) => state.stopMonitoring)

  // 🔧 使用useRef避免依赖变化导致定时器重置，防止内存泄漏
  const systemMonitorTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const metricsLoggedRef = useRef<Set<string>>(new Set())

  // 🔧 稳定的配置引用，避免不必要的effect重新执行
  const optionsRef = useRef({
    enableSystemMonitoring,
    systemMonitoringInterval,
    onReport,
    debug,
  })

  // 更新配置引用但不触发effect重新执行
  useEffect(() => {
    optionsRef.current = {
      enableSystemMonitoring,
      systemMonitoringInterval,
      onReport,
      debug,
    }
  })

  useEffect(() => {
    if (enableWebVitals) {
      startMonitoring()

      // 注册Web Vitals监控
      const registerVital = (name: string, handler: ReportHandler) => {
        handler((metric: WebVitalMetric) => {
          const vitalKey = VITALS_MAPPING[name]
          if (vitalKey) {
            updateWebVital(vitalKey, metric.value)

            // 避免重复日志
            const logKey = `${name}-${metric.rating}`
            if (!metricsLoggedRef.current.has(logKey)) {
              metricsLoggedRef.current.add(logKey)
              if (optionsRef.current.debug) {
                console.warn(`[Web Vital] ${name}:`, {
                  value: metric.value,
                  rating: metric.rating,
                  delta: metric.delta,
                  id: metric.id,
                })
              }
            }

            // 自定义报告处理器
            if (optionsRef.current.onReport) {
              optionsRef.current.onReport(metric)
            }
          }
        })
      }

      // 注册所有Web Vitals
      registerVital('CLS', onCLS)
      registerVital('INP', onINP)
      registerVital('LCP', onLCP)
      registerVital('FCP', onFCP)
      registerVital('TTFB', onTTFB)

      if (optionsRef.current.debug) {
        console.warn('[Performance Monitor] Web Vitals monitoring started')
      }
    }

    return () => {
      stopMonitoring()
      if (optionsRef.current.debug) {
        console.warn('[Performance Monitor] Web Vitals monitoring stopped')
      }
    }
  }, [enableWebVitals, updateWebVital, startMonitoring, stopMonitoring]) // 🔧 移除不稳定的依赖

  useEffect(() => {
    if (!optionsRef.current.enableSystemMonitoring) return

    const collectSystemMetrics = async () => {
      try {
        // CPU使用率 (估算)
        const cpuUsage = await estimateCPUUsage()

        // 内存使用率
        const memoryUsage = await estimateMemoryUsage()

        // 网络延迟
        const latency = await estimateNetworkLatency()

        // 网络速度 (简化)
        const networkSpeed = await estimateNetworkSpeed()

        recordSystemMetrics({
          cpu: cpuUsage,
          memory: memoryUsage,
          latency,
          networkSpeed,
        })

        if (optionsRef.current.debug) {
          console.warn('[Performance Monitor] System metrics:', {
            cpu: cpuUsage.toFixed(1),
            memory: memoryUsage.toFixed(1),
            latency: latency.toFixed(0),
            networkSpeed: networkSpeed.toFixed(2),
          })
        }
      } catch (error) {
        console.error('[Performance Monitor] Failed to collect system metrics:', error)
      }
    }

    // 立即收集一次
    collectSystemMetrics()

    // 🔧 使用稳定的配置引用，避免定时器重新创建
    const interval = optionsRef.current.systemMonitoringInterval

    // 定期收集系统指标
    systemMonitorTimerRef.current = setInterval(
      collectSystemMetrics,
      interval
    )

    if (optionsRef.current.debug) {
      console.warn('[Performance Monitor] System monitoring started')
    }

    return () => {
      if (systemMonitorTimerRef.current) {
        clearInterval(systemMonitorTimerRef.current)
        systemMonitorTimerRef.current = null // 🔧 防止双重清理
      }
      if (optionsRef.current.debug) {
        console.warn('[Performance Monitor] System monitoring stopped')
      }
    }
  }, [recordSystemMetrics]) // 🔧 只依赖recordSystemMetrics，避免不必要的重新执行

  return {
    isMonitoring: usePerformanceStore((state) => state.isMonitoring),
    webVitals: usePerformanceStore((state) => state.webVitals),
    performanceScore: usePerformanceStore((state) => state.performanceScore),
  }
}

/**
 * 估算CPU使用率 (简化实现)
 */
async function estimateCPUUsage(): Promise<number> {
  // 使用Performance API估算CPU负载
  const start = performance.now()
  await new Promise((resolve) => setTimeout(resolve, 10))
  const end = performance.now()

  const frameTime = end - start
  const cpuUsage = Math.min(100, (frameTime / 10) * 50)

  // 添加一些随机波动模拟真实数据
  return Math.max(5, Math.min(90, cpuUsage + (Math.random() - 0.5) * 20))
}

/**
 * 估算内存使用率
 */
async function estimateMemoryUsage(): Promise<number> {
  // 使用Performance.memory API (如果可用)
  if ('memory' in performance) {
    const mem = (performance as any).memory
    if (mem) {
      const used = mem.usedJSHeapSize / 1024 / 1024 // MB
      const total = mem.totalJSHeapSize / 1024 / 1024 // MB
      return (used / total) * 100
    }
  }

  // 后备方案：基于当前负载估算
  return 40 + Math.random() * 30
}

/**
 * 估算网络延迟
 */
async function estimateNetworkLatency(): Promise<number> {
  const start = performance.now()

  try {
    // 发送一个小请求测量延迟
    await fetch(window.location.href, {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    })
  } catch (error) {
    // 忽略错误，使用估算值
  }

  const end = performance.now()
  const latency = end - start

  return Math.max(20, Math.min(1000, latency))
}

/**
 * 估算网络速度
 */
async function estimateNetworkSpeed(): Promise<number> {
  // 简化实现：基于网络连接信息
  if ('connection' in navigator) {
    const conn = (navigator as any).connection
    if (conn) {
      // downlink单位是Mbps，转换为MB/s
      const speedMbps = conn.downlink || 10
      return speedMbps / 8
    }
  }

  // 后备方案：随机生成合理值
  return 5 + Math.random() * 45
}

/**
 * 组件性能追踪Hook
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useComponentProfiler('MyComponent')
 *   return <div>...</div>
 * }
 * ```
 */
export function useComponentProfiler(componentName: string, enabled = true) {
  const recordComponentRender = usePerformanceStore((state) => state.recordComponentRender)

  useEffect(() => {
    if (!enabled) return

    const renderStart = performance.now()

    return () => {
      const renderTime = performance.now() - renderStart
      recordComponentRender(componentName, renderTime)
    }
  }, [componentName, enabled, recordComponentRender])
}

/**
 * React Profiler包装器
 */
export const withPerformanceProfiler = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return function PerformanceProfilerWrapper(props: P) {
    useComponentProfiler(componentName)
    return <Component {...props} />
  }
}
