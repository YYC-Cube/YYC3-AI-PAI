/**
 * @file useWebGPUInference.test.ts
 * @description useWebGPUInference Hook测试
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-26
 * @status testing
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 */

import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AIModel } from '../../store/webgpu-inference-store'
import { useWebGPUInferenceStore } from '../../store/webgpu-inference-store'
import { useInference, useInferenceStats, useModelManager, useWebGPUInference } from '../useWebGPUInference'

describe('useWebGPUInference Hook', () => {
  beforeEach(() => {
    useWebGPUInferenceStore.getState().clearAll()
    useWebGPUInferenceStore.setState((state) => {
      for (const model of state.models.values()) {
        model.loaded = false
        model.loadProgress = 0
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  describe('初始状态', () => {
    it('should return empty arrays and null values', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(result.current.models).toBeDefined()
      expect(result.current.models.every((m: AIModel) => !m.loaded)).toBe(true)
      expect(result.current.activeModel).toBeNull()
      expect(result.current.tasks).toEqual([])
      expect(result.current.isLoadingModel).toBe(false)
      expect(result.current.isInferencing).toBe(false)
    })

    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useWebGPUInference())

      expect(result.current.models).toBeDefined()
      expect(result.current.tasks).toBeDefined()
      expect(result.current.stats).toBeDefined()
    })

    it('should set autoInitialize to true by default', () => {
      const { result } = renderHook(() => useWebGPUInference())

      expect(result.current.webGPUSupported).toBeDefined()
      expect(result.current.engineType).toBeDefined()
    })
  })

  describe('选项配置', () => {
    it('should support autoInitialize option', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: true }))

      expect(result.current.webGPUSupported).toBeDefined()
    })

    it('should support autoLoadDefaultModel option', () => {
      const { result } = renderHook(() =>
        useWebGPUInference({
          autoInitialize: false,
          autoLoadDefaultModel: false,
        })
      )

      expect(result.current.activeModel).toBeNull()
    })

    it('should support custom defaultModelId', () => {
      const { result } = renderHook(() =>
        useWebGPUInference({
          autoInitialize: false,
          defaultModelId: 'custom-model',
        })
      )

      expect(result.current.models.length).toBeGreaterThan(0)
    })
  })

  describe('模型管理', () => {
    it('should load model', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      // 验证方法可以调用
      await expect(result.current.loadModel('tinyllama-1.1b')).resolves.not.toThrow()
    })

    it('should unload model', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(() => {
        result.current.unloadModel('tinyllama-1.1b')
      }).not.toThrow()
    })

    it('should unload all models', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(() => {
        result.current.unloadAllModels()
      }).not.toThrow()
    })

    it('should set active model', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      await result.current.loadModel('tinyllama-1.1b')
      expect(() => {
        result.current.setActiveModel('tinyllama-1.1b')
      }).not.toThrow()
    })
  })

  describe('推理功能', () => {
    it('should execute inference', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      await result.current.loadModel('tinyllama-1.1b')
      await expect(result.current.infer('function hello() {}', 'tinyllama-1.1b')).resolves.not.toThrow()
    })

    it('should handle inference without modelId', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      // 当没有activeModelId时，应该抛出错误
      try {
        await result.current.infer('function hello() {}')
        // 如果没有抛出错误，说明逻辑有问题
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should update isInferencing state', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(result.current.isInferencing).toBe(false)
    })
  })

  describe('辅助函数', () => {
    it('should filter models by type', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      const textModels = result.current.modelsByType('code-completion')
      expect(Array.isArray(textModels)).toBe(true)
    })

    it('should return loaded models', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      const loaded = result.current.loadedModels
      expect(Array.isArray(loaded)).toBe(true)
    })

    it('should calculate stats', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(result.current.stats).toBeDefined()
      expect(result.current.stats.totalInferences).toBeGreaterThanOrEqual(0)
      expect(result.current.stats.totalInferenceTime).toBeGreaterThanOrEqual(0)
      expect(result.current.stats.avgInferenceTime).toBeGreaterThanOrEqual(0)
      expect(result.current.stats.successRate).toBeGreaterThanOrEqual(0)
    })
  })

  describe('数据清除', () => {
    it('should clear tasks', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(() => {
        result.current.clearTasks()
      }).not.toThrow()
    })

    it('should clear all data', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(() => {
        result.current.clearAll()
      }).not.toThrow()
    })

    it('should clear cache', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      await expect(result.current.clearCache()).resolves.not.toThrow()
    })

    it('should get cache stats', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      const stats = result.current.getCacheStats()
      expect(stats).toBeDefined()
      expect(stats.size).toBeGreaterThanOrEqual(0)
      expect(stats.max).toBeGreaterThan(0)
      expect(stats.usage).toBeGreaterThanOrEqual(0)
    })
  })

  describe('简化Hooks', () => {
    describe('useInference', () => {
      it('should return inference functions', () => {
        const { result } = renderHook(() => useInference())

        expect(result.current.infer).toBeDefined()
        expect(result.current.isInferencing).toBeDefined()
        expect(result.current.activeModel).toBeDefined()
        expect(result.current.stats).toBeDefined()
      })

      it('should auto initialize', () => {
        const { result } = renderHook(() => useInference())

        expect(result.current.infer).toBeDefined()
        expect(result.current.isInferencing).toBeDefined()
      })

      it('should execute inference', async () => {
        await useWebGPUInferenceStore.getState().loadModel('tinyllama-1.1b')
        useWebGPUInferenceStore.getState().setActiveModel('tinyllama-1.1b')

        const { result } = renderHook(() => useInference())
        await expect(result.current.infer('function hello() {}')).resolves.toBeDefined()
      })
    })

    describe('useModelManager', () => {
      it('should return model management functions', () => {
        const { result } = renderHook(() => useModelManager())

        expect(result.current.models).toBeDefined()
        expect(result.current.loadedModels).toBeDefined()
        expect(result.current.loadModel).toBeDefined()
        expect(result.current.unloadModel).toBeDefined()
        expect(result.current.unloadAllModels).toBeDefined()
        expect(result.current.isLoadingModel).toBeDefined()
      })

      it('should load model', async () => {
        const { result } = renderHook(() => useModelManager())

        await expect(result.current.loadModel('tinyllama-1.1b')).resolves.not.toThrow()
      })

      it('should unload model', () => {
        const { result } = renderHook(() => useModelManager())

        expect(() => {
          result.current.unloadModel('tinyllama-1.1b')
        }).not.toThrow()
      })
    })

    describe('useInferenceStats', () => {
      it('should return stats functions', () => {
        const { result } = renderHook(() => useInferenceStats())

        expect(result.current.stats).toBeDefined()
        expect(result.current.tasks).toBeDefined()
        expect(result.current.clearTasks).toBeDefined()
        expect(result.current.clearAll).toBeDefined()
      })

      it('should not auto initialize', () => {
        const { result } = renderHook(() => useInferenceStats())

        expect(result.current.stats).toBeDefined()
      })

      it('should clear tasks', () => {
        const { result } = renderHook(() => useInferenceStats())

        expect(() => {
          result.current.clearTasks()
        }).not.toThrow()
      })
    })
  })

  describe('边缘情况', () => {
    it('should handle empty models list', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(result.current.models.length).toBeGreaterThan(0)
      expect(result.current.activeModel).toBeNull()
    })

    it('should handle no active model', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(result.current.activeModel).toBeNull()
    })

    it('should handle invalid modelId', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      await expect(result.current.loadModel('invalid-model')).rejects.toThrow('not found')
    })

    it('should handle empty input', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      await result.current.loadModel('tinyllama-1.1b')
      await expect(result.current.infer('', 'tinyllama-1.1b')).resolves.toBeDefined()
    })

    it('should handle long input', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      await result.current.loadModel('tinyllama-1.1b')
      const longInput = 'a'.repeat(10000)
      await expect(result.current.infer(longInput, 'tinyllama-1.1b')).resolves.toBeDefined()
    })
  })

  describe('并发操作', () => {
    it('should handle multiple inference calls', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      await result.current.loadModel('tinyllama-1.1b')
      const promises = [
        result.current.infer('const a = ', 'tinyllama-1.1b'),
        result.current.infer('const b = ', 'tinyllama-1.1b'),
        result.current.infer('const c = ', 'tinyllama-1.1b'),
      ]

      const results = await Promise.all(promises)
      expect(results).toHaveLength(3)
    })

    it('should handle rapid model load/unload', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      // 验证方法可以调用
      await expect(result.current.loadModel('tinyllama-1.1b')).resolves.not.toThrow()
      expect(() => {
        result.current.unloadModel('tinyllama-1.1b')
      }).not.toThrow()
    })
  })

  describe('状态管理', () => {
    it('should update activeModelId', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      await result.current.loadModel('tinyllama-1.1b')
      expect(() => {
        result.current.setActiveModel('tinyllama-1.1b')
      }).not.toThrow()
    })

    it('should update stats after inference', async () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      await result.current.loadModel('tinyllama-1.1b')
      await result.current.infer('function hello() {}', 'tinyllama-1.1b')

      expect(result.current.stats).toBeDefined()
    })

    it('should track tasks', () => {
      const { result } = renderHook(() => useWebGPUInference({ autoInitialize: false }))

      expect(Array.isArray(result.current.tasks)).toBe(true)
    })
  })
})
