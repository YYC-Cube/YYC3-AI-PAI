/**
 * @file storage-cleaner.ts
 * @description 存储清理工具
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-04-07
 * @updated 2026-04-07
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags storage,cleaner,management
 */

import { createLogger } from './logger'

const logger = createLogger('storage-cleaner')

export interface CleanResult {
  cleaned: number
  freedBytes: number
  errors: string[]
}

export interface CleanOptions {
  maxAge?: number
  dryRun?: boolean
}

export class StorageCleaner {
  private static instance: StorageCleaner
  private cleanInterval: number | null = null

  private constructor() { }

  static getInstance(): StorageCleaner {
    if (!StorageCleaner.instance) {
      StorageCleaner.instance = new StorageCleaner()
    }
    return StorageCleaner.instance
  }

  async cleanExpiredCache(options: CleanOptions = {}): Promise<CleanResult> {
    const result: CleanResult = { cleaned: 0, freedBytes: 0, errors: [] }
    const { dryRun = false } = options

    try {
      const now = Date.now()
      const keysToRemove: string[] = []
      let freedBytes = 0

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('yyc3_')) {
          try {
            const value = localStorage.getItem(key)
            if (value) {
              const data = JSON.parse(value)
              if (data.timestamp && data.ttl) {
                const expiresAt = data.timestamp + data.ttl
                if (now > expiresAt) {
                  keysToRemove.push(key)
                  freedBytes += key.length + value.length
                }
              }
            }
          } catch {
            // Not JSON or no timestamp/ttl, skip
          }
        }
      }

      if (!dryRun) {
        keysToRemove.forEach((key) => {
          try {
            localStorage.removeItem(key)
            result.cleaned++
          } catch (error) {
            result.errors.push(`Failed to remove ${key}: ${error}`)
          }
        })
      } else {
        result.cleaned = keysToRemove.length
      }

      result.freedBytes = freedBytes * 2
      logger.info(`[StorageCleaner] Cleaned ${result.cleaned} expired items, freed ${result.freedBytes} bytes`)
    } catch (error) {
      result.errors.push(`Failed to clean expired cache: ${error}`)
      logger.error('[StorageCleaner] Failed to clean expired cache', error)
    }

    return result
  }

  async cleanOldData(maxAge: number, options: CleanOptions = {}): Promise<CleanResult> {
    const result: CleanResult = { cleaned: 0, freedBytes: 0, errors: [] }
    const { dryRun = false } = options

    try {
      const cutoff = Date.now() - maxAge
      const keysToRemove: string[] = []
      let freedBytes = 0

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('yyc3_')) {
          try {
            const value = localStorage.getItem(key)
            if (value) {
              const data = JSON.parse(value)
              if (data.timestamp && data.timestamp < cutoff) {
                keysToRemove.push(key)
                freedBytes += key.length + value.length
              }
            }
          } catch {
            // Not JSON or no timestamp, skip
          }
        }
      }

      if (!dryRun) {
        keysToRemove.forEach((key) => {
          try {
            localStorage.removeItem(key)
            result.cleaned++
          } catch (error) {
            result.errors.push(`Failed to remove ${key}: ${error}`)
          }
        })
      } else {
        result.cleaned = keysToRemove.length
      }

      result.freedBytes = freedBytes * 2
      logger.info(`[StorageCleaner] Cleaned ${result.cleaned} old items, freed ${result.freedBytes} bytes`)
    } catch (error) {
      result.errors.push(`Failed to clean old data: ${error}`)
      logger.error('[StorageCleaner] Failed to clean old data', error)
    }

    return result
  }

  async cleanLowPriorityData(options: CleanOptions = {}): Promise<CleanResult> {
    const result: CleanResult = { cleaned: 0, freedBytes: 0, errors: [] }
    const { dryRun = false } = options

    try {
      const lowPriorityKeys: string[] = [
        'yyc3_file_store',
        'yyc3_query_history',
        'yyc3_activity_log',
      ]

      let freedBytes = 0

      lowPriorityKeys.forEach((key) => {
        try {
          const value = localStorage.getItem(key)
          if (value) {
            freedBytes += key.length + value.length
            if (!dryRun) {
              localStorage.removeItem(key)
              result.cleaned++
            }
          }
        } catch (error) {
          result.errors.push(`Failed to remove ${key}: ${error}`)
        }
      })

      if (dryRun) {
        result.cleaned = lowPriorityKeys.filter((key) => localStorage.getItem(key) !== null).length
      }

      result.freedBytes = freedBytes * 2
      logger.info(`[StorageCleaner] Cleaned ${result.cleaned} low priority items, freed ${result.freedBytes} bytes`)
    } catch (error) {
      result.errors.push(`Failed to clean low priority data: ${error}`)
      logger.error('[StorageCleaner] Failed to clean low priority data', error)
    }

    return result
  }

  async cleanAll(): Promise<CleanResult> {
    const result: CleanResult = { cleaned: 0, freedBytes: 0, errors: [] }

    try {
      let freedBytes = 0

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && key.startsWith('yyc3_')) {
          try {
            const value = localStorage.getItem(key)
            if (value) {
              freedBytes += key.length + value.length
              localStorage.removeItem(key)
              result.cleaned++
            }
          } catch (error) {
            result.errors.push(`Failed to remove ${key}: ${error}`)
          }
        }
      }

      result.freedBytes = freedBytes * 2
      logger.info(`[StorageCleaner] Cleaned all ${result.cleaned} items, freed ${result.freedBytes} bytes`)
    } catch (error) {
      result.errors.push(`Failed to clean all data: ${error}`)
      logger.error('[StorageCleaner] Failed to clean all data', error)
    }

    return result
  }

  scheduleAutoClean(interval: number): void {
    if (this.cleanInterval) {
      this.cancelAutoClean()
    }

    this.cleanInterval = setInterval(async () => {
      await this.cleanExpiredCache()
    }, interval)

    logger.info(`[StorageCleaner] Scheduled auto clean with ${interval}ms interval`)
  }

  cancelAutoClean(): void {
    if (this.cleanInterval) {
      clearInterval(this.cleanInterval)
      this.cleanInterval = null
      logger.info('[StorageCleaner] Cancelled auto clean')
    }
  }
}

export const storageCleaner = StorageCleaner.getInstance()
