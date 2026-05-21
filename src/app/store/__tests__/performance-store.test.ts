/**
 * @file performance-store.test.ts
 * @description performance-store测试
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-26
 * @status testing
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { usePerformanceStore } from '../performance-store'
import type {
  CoreWebVitals,
  ComponentMetrics,
  OptimizationSuggestion,
  APIMetrics,
  SystemMetrics,
} from '../performance-store'

describe('performance-store', () => {
  beforeEach(() => {
    // 清除store状态
    usePerformanceStore.getState().clearComponentMetrics()
    usePerformanceStore.getState().clearSuggestions()
    usePerformanceStore.getState().clearAPIMetrics()
    usePerformanceStore.getState().clearSystemMetrics()
    usePerformanceStore.getState().stopMonitoring()
  })

  afterEach(() => {
    // 清理
  })

  describe('初始状态', () => {
    it('should have empty webVitals', () => {
      const state = usePerformanceStore.getState()

      expect(state.webVitals).toEqual({})
    })

    it('should have empty componentMetrics', () => {
      const state = usePerformanceStore.getState()

      expect(state.componentMetrics).toEqual([])
    })

    it('should have empty suggestions', () => {
      const state = usePerformanceStore.getState()

      expect(state.suggestions).toEqual([])
    })

    it('should have empty apiMetrics map', () => {
      const state = usePerformanceStore.getState()

      expect(state.apiMetrics).toBeInstanceOf(Map)
      expect(state.apiMetrics.size).toBe(0)
    })

    it('should have empty systemMetricsHistory', () => {
      const state = usePerformanceStore.getState()

      expect(state.systemMetricsHistory).toEqual([])
    })

    it('should not be monitoring', () => {
      const state = usePerformanceStore.getState()

      expect(state.isMonitoring).toBe(false)
    })

    it('should have zero performanceScore', () => {
      const state = usePerformanceStore.getState()

      expect(state.performanceScore).toBe(0)
    })
  })

  describe('Web Vitals更新', () => {
    it('should update CLS metric', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('cls', 0.1)

      const updated = usePerformanceStore.getState()
      expect(updated.webVitals.cls).toBe(0.1)
    })

    it('should update FID metric', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('fid', 100)

      const updated = usePerformanceStore.getState()
      expect(updated.webVitals.fid).toBe(100)
    })

    it('should update INP metric', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('inp', 150)

      const updated = usePerformanceStore.getState()
      expect(updated.webVitals.inp).toBe(150)
    })

    it('should update LCP metric', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('lcp', 2500)

      const updated = usePerformanceStore.getState()
      expect(updated.webVitals.lcp).toBe(2500)
    })

    it('should update FCP metric', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('fcp', 1800)

      const updated = usePerformanceStore.getState()
      expect(updated.webVitals.fcp).toBe(1800)
    })

    it('should update TTFB metric', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('ttfb', 800)

      const updated = usePerformanceStore.getState()
      expect(updated.webVitals.ttfb).toBe(800)
    })

    it('should calculate performance score after update', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('lcp', 2000)
      state.updateWebVital('fid', 50)
      state.updateWebVital('cls', 0.05)

      const updated = usePerformanceStore.getState()
      expect(updated.performanceScore).toBeGreaterThan(0)
    })
  })

  describe('组件性能记录', () => {
    it('should record component render', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('MyComponent', 10)

      const updated = usePerformanceStore.getState()
      expect(updated.componentMetrics).toHaveLength(1)
      expect(updated.componentMetrics[0].name).toBe('MyComponent')
      expect(updated.componentMetrics[0].renderTime).toBe(10)
    })

    it('should update existing component render', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('MyComponent', 10)
      state.recordComponentRender('MyComponent', 15)

      const updated = usePerformanceStore.getState()
      expect(updated.componentMetrics).toHaveLength(1)
      expect(updated.componentMetrics[0].renderTime).toBe(15)
      expect(updated.componentMetrics[0].renderCount).toBe(2)
    })

    it('should add suggestion for slow component', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('SlowComponent', 20)

      const updated = usePerformanceStore.getState()
      expect(updated.suggestions.length).toBeGreaterThan(0)
      expect(updated.suggestions[0].type).toBe('memo')
      expect(updated.suggestions[0].target).toBe('SlowComponent')
    })

    it('should add critical suggestion for very slow component', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('VerySlowComponent', 60)

      const updated = usePerformanceStore.getState()
      expect(updated.suggestions.length).toBeGreaterThan(0)
      expect(updated.suggestions[0].severity).toBe('critical')
    })

    it('should clear component metrics', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('MyComponent', 10)
      state.clearComponentMetrics()

      const updated = usePerformanceStore.getState()
      expect(updated.componentMetrics).toEqual([])
    })
  })

  describe('性能优化建议', () => {
    it('should add suggestion', () => {
      const state = usePerformanceStore.getState()

      const suggestion: OptimizationSuggestion = {
        type: 'lazy-load',
        severity: 'warning',
        title: 'Lazy Load Images',
        description: 'Load images lazily to improve performance',
        target: 'images',
        expectedImprovement: '30% faster',
      }

      state.addSuggestion(suggestion)

      const updated = usePerformanceStore.getState()
      expect(updated.suggestions).toHaveLength(1)
      expect(updated.suggestions[0]).toEqual({ ...suggestion, handled: false })
    })

    it('should not add duplicate suggestion', () => {
      const state = usePerformanceStore.getState()

      const suggestion: OptimizationSuggestion = {
        type: 'lazy-load',
        severity: 'warning',
        title: 'Lazy Load Images',
        description: 'Load images lazily to improve performance',
        target: 'images',
      }

      state.addSuggestion(suggestion)
      state.addSuggestion(suggestion)

      const updated = usePerformanceStore.getState()
      expect(updated.suggestions).toHaveLength(1)
    })

    it('should mark suggestion as handled', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('SlowComponent', 20)
      state.markSuggestionHandled('SlowComponent')

      const updated = usePerformanceStore.getState()
      const suggestion = updated.suggestions.find((s) => s.target === 'SlowComponent')
      expect(suggestion?.handled).toBe(true)
    })

    it('should clear all suggestions', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('SlowComponent', 20)
      state.clearSuggestions()

      const updated = usePerformanceStore.getState()
      expect(updated.suggestions).toEqual([])
    })
  })

  describe('API指标', () => {
    it('should add new API metrics', () => {
      const state = usePerformanceStore.getState()

      state.updateAPIMetrics('/api/users', 500)

      const updated = usePerformanceStore.getState()
      expect(updated.apiMetrics.size).toBe(1)

      const metrics = updated.apiMetrics.get('/api/users')
      expect(metrics).toBeDefined()
      expect(metrics?.avg).toBe(500)
    })

    it('should update existing API metrics', () => {
      const state = usePerformanceStore.getState()

      state.updateAPIMetrics('/api/users', 500)
      state.updateAPIMetrics('/api/users', 600)

      const updated = usePerformanceStore.getState()
      const metrics = updated.apiMetrics.get('/api/users')
      expect(metrics?.avg).toBeGreaterThan(500)
    })

    it('should track errors', () => {
      const state = usePerformanceStore.getState()

      state.updateAPIMetrics('/api/users', 500)
      state.updateAPIMetrics('/api/users', 0, true)
      state.updateAPIMetrics('/api/users', 600)

      const updated = usePerformanceStore.getState()
      const metrics = updated.apiMetrics.get('/api/users')
      expect(metrics?.errors).toBe(1)
    })

    it('should track P95 and P99', () => {
      const state = usePerformanceStore.getState()

      state.updateAPIMetrics('/api/users', 100)
      state.updateAPIMetrics('/api/users', 200)
      state.updateAPIMetrics('/api/users', 300)

      const updated = usePerformanceStore.getState()
      const metrics = updated.apiMetrics.get('/api/users')
      expect(metrics?.p99).toBe(300)
    })

    it('should add suggestion for slow API', () => {
      const state = usePerformanceStore.getState()

      state.updateAPIMetrics('/api/slow', 3000)

      const updated = usePerformanceStore.getState()
      const suggestion = updated.suggestions.find((s) => s.target === '/api/slow')
      expect(suggestion).toBeDefined()
      expect(suggestion?.type).toBe('code-split')
    })

    it('should clear API metrics', () => {
      const state = usePerformanceStore.getState()

      state.updateAPIMetrics('/api/users', 500)
      state.clearAPIMetrics()

      const updated = usePerformanceStore.getState()
      expect(updated.apiMetrics.size).toBe(0)
    })
  })

  describe('系统指标', () => {
    it('should record system metrics', () => {
      const state = usePerformanceStore.getState()

      state.recordSystemMetrics({
        cpu: 50,
        memory: 60,
        latency: 100,
        networkSpeed: 10,
      })

      const updated = usePerformanceStore.getState()
      expect(updated.systemMetricsHistory).toHaveLength(1)
      expect(updated.systemMetricsHistory[0].cpu).toBe(50)
    })

    it('should add timestamp to system metrics', () => {
      const state = usePerformanceStore.getState()

      state.recordSystemMetrics({
        cpu: 50,
        memory: 60,
        latency: 100,
        networkSpeed: 10,
      })

      const updated = usePerformanceStore.getState()
      expect(updated.systemMetricsHistory[0].timestamp).toBeDefined()
      expect(updated.systemMetricsHistory[0].timestamp).toBeLessThanOrEqual(Date.now())
    })

    it('should limit system metrics history to 100', () => {
      const state = usePerformanceStore.getState()

      // 添加超过100条记录
      for (let i = 0; i < 150; i++) {
        state.recordSystemMetrics({
          cpu: i % 100,
          memory: i % 100,
          latency: i % 100,
          networkSpeed: 10,
        })
      }

      const updated = usePerformanceStore.getState()
      expect(updated.systemMetricsHistory.length).toBeLessThanOrEqual(100)
    })

    it('should clear system metrics', () => {
      const state = usePerformanceStore.getState()

      state.recordSystemMetrics({
        cpu: 50,
        memory: 60,
        latency: 100,
        networkSpeed: 10,
      })
      state.clearSystemMetrics()

      const updated = usePerformanceStore.getState()
      expect(updated.systemMetricsHistory).toEqual([])
    })
  })

  describe('监控控制', () => {
    it('should start monitoring', () => {
      const state = usePerformanceStore.getState()

      state.startMonitoring()

      const updated = usePerformanceStore.getState()
      expect(updated.isMonitoring).toBe(true)
    })

    it('should stop monitoring', () => {
      const state = usePerformanceStore.getState()

      state.startMonitoring()
      state.stopMonitoring()

      const updated = usePerformanceStore.getState()
      expect(updated.isMonitoring).toBe(false)
    })

    it('should handle multiple start/stop cycles', () => {
      const state = usePerformanceStore.getState()

      state.startMonitoring()
      state.stopMonitoring()
      state.startMonitoring()
      state.stopMonitoring()

      const updated = usePerformanceStore.getState()
      expect(updated.isMonitoring).toBe(false)
    })
  })

  describe('性能评分', () => {
    it('should return performance score', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('lcp', 2000)

      const score = state.calculatePerformanceScore()
      expect(score).toBeGreaterThan(0)
    })

    it('should calculate score based on all vitals', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('lcp', 2000)
      state.updateWebVital('fid', 50)
      state.updateWebVital('cls', 0.05)
      state.updateWebVital('fcp', 1500)
      state.updateWebVital('ttfb', 600)

      const score = state.calculatePerformanceScore()
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should penalize poor CLS', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('cls', 0.5)

      const score = state.calculatePerformanceScore()
      expect(score).toBeLessThan(100)
    })

    it('should penalize poor LCP', () => {
      const state = usePerformanceStore.getState()

      state.updateWebVital('lcp', 5000)

      const score = state.calculatePerformanceScore()
      expect(score).toBeLessThan(100)
    })
  })

  describe('慢组件列表', () => {
    it('should return empty list when no components', () => {
      const state = usePerformanceStore.getState()

      const slowComponents = state.getSlowComponents()
      expect(slowComponents).toEqual([])
    })

    it('should return empty list for fast components', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('FastComponent', 10)

      const slowComponents = state.getSlowComponents()
      expect(slowComponents).toEqual([])
    })

    it('should return slow components sorted by render time', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('SlowComponent1', 20)
      state.recordComponentRender('SlowComponent2', 30)
      state.recordComponentRender('SlowComponent3', 25)

      const slowComponents = state.getSlowComponents()
      expect(slowComponents).toHaveLength(3)
      expect(slowComponents[0].renderTime).toBe(30) // 最慢的在前
    })

    it('should only include components with render time > 16ms', () => {
      const state = usePerformanceStore.getState()

      state.recordComponentRender('FastComponent', 10)
      state.recordComponentRender('SlowComponent', 20)

      const slowComponents = state.getSlowComponents()
      expect(slowComponents).toHaveLength(1)
      expect(slowComponents[0].name).toBe('SlowComponent')
    })
  })

  describe('性能趋势', () => {
    it('should return empty trend when no metrics', () => {
      const state = usePerformanceStore.getState()

      const trend = state.getPerformanceTrend()
      expect(trend).toEqual([])
    })

    it('should return performance trend', () => {
      const state = usePerformanceStore.getState()

      state.recordSystemMetrics({
        cpu: 50,
        memory: 60,
        latency: 100,
        networkSpeed: 10,
      })
      state.recordSystemMetrics({
        cpu: 55,
        memory: 65,
        latency: 110,
        networkSpeed: 10,
      })

      const trend = state.getPerformanceTrend()
      expect(trend).toHaveLength(2)
    })

    it('should limit trend to specified limit', () => {
      const state = usePerformanceStore.getState()

      for (let i = 0; i < 50; i++) {
        state.recordSystemMetrics({
          cpu: i % 100,
          memory: i % 100,
          latency: i % 100,
          networkSpeed: 10,
        })
      }

      const trend = state.getPerformanceTrend(10)
      expect(trend).toHaveLength(10)
    })

    it('should use default limit of 30', () => {
      const state = usePerformanceStore.getState()

      for (let i = 0; i < 50; i++) {
        state.recordSystemMetrics({
          cpu: i % 100,
          memory: i % 100,
          latency: i % 100,
          networkSpeed: 10,
        })
      }

      const trend = state.getPerformanceTrend()
      expect(trend.length).toBeLessThanOrEqual(30)
    })
  })

  describe('边缘情况', () => {
    it('should handle zero render time', () => {
      const state = usePerformanceStore.getState()

      expect(() => {
        state.recordComponentRender('ZeroComponent', 0)
      }).not.toThrow()
    })

    it('should handle very large render time', () => {
      const state = usePerformanceStore.getState()

      expect(() => {
        state.recordComponentRender('VerySlowComponent', 10000)
      }).not.toThrow()
    })

    it('should handle negative metrics values', () => {
      const state = usePerformanceStore.getState()

      expect(() => {
        state.updateWebVital('cls', -0.1)
      }).not.toThrow()
    })

    it('should handle very large API response time', () => {
      const state = usePerformanceStore.getState()

      expect(() => {
        state.updateAPIMetrics('/api/slow', 100000)
      }).not.toThrow()
    })

    it('should handle empty component name', () => {
      const state = usePerformanceStore.getState()

      expect(() => {
        state.recordComponentRender('', 10)
      }).not.toThrow()
    })

    it('should handle very long component name', () => {
      const state = usePerformanceStore.getState()

      const longName = 'A'.repeat(1000)
      expect(() => {
        state.recordComponentRender(longName, 10)
      }).not.toThrow()
    })
  })

  describe('并发操作', () => {
    it('should handle multiple component renders', () => {
      const state = usePerformanceStore.getState()

      expect(() => {
        for (let i = 0; i < 100; i++) {
          state.recordComponentRender(`Component${i}`, i)
        }
      }).not.toThrow()
    })

    it('should handle multiple API updates', () => {
      const state = usePerformanceStore.getState()

      expect(() => {
        for (let i = 0; i < 100; i++) {
          state.updateAPIMetrics(`/api/endpoint${i}`, i * 10)
        }
      }).not.toThrow()
    })

    it('should handle multiple system metrics records', () => {
      const state = usePerformanceStore.getState()

      expect(() => {
        for (let i = 0; i < 100; i++) {
          state.recordSystemMetrics({
            cpu: i,
            memory: i,
            latency: i,
            networkSpeed: 10,
          })
        }
      }).not.toThrow()
    })
  })

  describe('Map操作', () => {
    it('should handle Map operations correctly', () => {
      const state = usePerformanceStore.getState()

      state.updateAPIMetrics('/api/users', 500)
      state.updateAPIMetrics('/api/posts', 600)
      state.updateAPIMetrics('/api/comments', 400)

      const updated = usePerformanceStore.getState()
      expect(updated.apiMetrics.size).toBe(3)
      expect(updated.apiMetrics.get('/api/users')).toBeDefined()
      expect(updated.apiMetrics.get('/api/posts')).toBeDefined()
      expect(updated.apiMetrics.get('/api/comments')).toBeDefined()
    })

    it('should clear Map correctly', () => {
      const state = usePerformanceStore.getState()

      state.updateAPIMetrics('/api/users', 500)
      state.clearAPIMetrics()

      const updated = usePerformanceStore.getState()
      expect(updated.apiMetrics.size).toBe(0)
    })
  })
})
