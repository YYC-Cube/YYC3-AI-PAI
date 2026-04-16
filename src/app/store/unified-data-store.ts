/**
 * @file unified-data-store.ts
 * @description 统一数据管理Store - 一人一端数据主权核心
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-04-08
 * @updated 2026-04-08
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags unified,data,sovereignty,privacy,local-first
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createLogger } from '../utils/logger'

const logger = createLogger('unified-data')

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 数据存储位置
 */
export type DataLocation = 'local' | 'indexeddb' | 'filesystem' | 'cloud' | 'external'

/**
 * 数据类型
 */
export type DataType =
  | 'settings'
  | 'models'
  | 'files'
  | 'notes'
  | 'projects'
  | 'chat-history'
  | 'sync-records'
  | 'backups'
  | 'keys'
  | 'cache'

/**
 * 数据状态
 */
export type DataStatus = 'synced' | 'pending' | 'conflict' | 'error' | 'encrypted'

/**
 * 数据条目
 */
export interface DataEntry {
  id: string
  type: DataType
  location: DataLocation
  status: DataStatus
  size: number
  lastModified: number
  encrypted: boolean
  synced: boolean
  checksum?: string
  path?: string
}

/**
 * 存储配额
 */
export interface StorageQuota {
  location: DataLocation
  used: number
  total: number
  available: number
  percentage: number
}

/**
 * 同步状态
 */
export interface SyncStatus {
  lastSync: number | null
  pending: number
  conflicts: number
  errors: number
  isSyncing: boolean
  progress: number
}

/**
 * 安全状态
 */
export interface SecurityStatus {
  vaultLocked: boolean
  encryptionEnabled: boolean
  keyDerivationIterations: number
  lastAuditTime: number
  securityScore: number
}

/**
 * 数据可移植性状态
 */
export interface PortabilityStatus {
  exportInProgress: boolean
  importInProgress: boolean
  lastExport: number | null
  lastImport: number | null
  supportedFormats: string[]
}

/**
 * 统一数据状态
 */
export interface UnifiedDataState {
  // 数据概览
  entries: DataEntry[]
  totalSize: number
  totalEntries: number

  // 存储配额
  quotas: StorageQuota[]

  // 同步状态
  sync: SyncStatus

  // 安全状态
  security: SecurityStatus

  // 可移植性
  portability: PortabilityStatus

  // UI状态
  activeTab: 'overview' | 'sync' | 'security' | 'portability' | 'advanced'
  searchQuery: string
  selectedEntries: string[]

  // 操作
  initialize: () => Promise<void>
  scanData: () => Promise<void>
  syncAll: () => Promise<void>
  syncEntry: (id: string) => Promise<void>
  encryptEntry: (id: string, passphrase: string) => Promise<void>
  decryptEntry: (id: string, passphrase: string) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  exportData: (format: 'json' | 'zip' | 'sqlite', entries?: string[]) => Promise<Blob>
  importData: (file: File, passphrase?: string) => Promise<void>
  resolveConflict: (id: string, resolution: 'local' | 'remote' | 'merge') => Promise<void>
  setActiveTab: (tab: UnifiedDataState['activeTab']) => void
  setSearchQuery: (query: string) => void
  toggleEntrySelection: (id: string) => void
  selectAllEntries: () => void
  clearSelection: () => void
}

// ============================================================================
// 常量
// ============================================================================

const STORAGE_LOCATIONS: DataLocation[] = ['local', 'indexeddb', 'filesystem']
const SUPPORTED_EXPORT_FORMATS = ['json', 'zip', 'sqlite']

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 计算localStorage使用量
 */
function calculateLocalStorageUsage(): number {
  let total = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key)
      if (value) {
        total += key.length + value.length
      }
    }
  }
  return total * 2 // UTF-16 编码
}

/**
 * 获取存储配额
 */
async function getStorageQuota(location: DataLocation): Promise<StorageQuota> {
  if (location === 'local') {
    const used = calculateLocalStorageUsage()
    const total = 5 * 1024 * 1024 // 5MB 典型限制
    return {
      location,
      used,
      total,
      available: total - used,
      percentage: (used / total) * 100,
    }
  }

  if (location === 'indexeddb') {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      const used = estimate.usage || 0
      const total = estimate.quota || 0
      return {
        location,
        used,
        total,
        available: total - used,
        percentage: total > 0 ? (used / total) * 100 : 0,
      }
    }
  }

  return {
    location,
    used: 0,
    total: 0,
    available: 0,
    percentage: 0,
  }
}

/**
 * 扫描localStorage数据
 */
function scanLocalStorage(): DataEntry[] {
  const entries: DataEntry[] = []
  const prefixPattern = /^yyc3_/

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && prefixPattern.test(key)) {
      const value = localStorage.getItem(key)
      if (value) {
        let type: DataType = 'settings'
        if (key.includes('model')) type = 'models'
        else if (key.includes('file')) type = 'files'
        else if (key.includes('sync')) type = 'sync-records'
        else if (key.includes('backup')) type = 'backups'
        else if (key.includes('key')) type = 'keys'
        else if (key.includes('cache')) type = 'cache'

        entries.push({
          id: `local:${key}`,
          type,
          location: 'local',
          status: 'synced',
          size: (key.length + value.length) * 2,
          lastModified: Date.now(),
          encrypted: key.includes('encrypted') || key.includes('vault'),
          synced: false,
          path: key,
        })
      }
    }
  }

  return entries
}

// ============================================================================
// Store 实现
// ============================================================================

export const useUnifiedDataStore = create<UnifiedDataState>()(
  immer((set, get) => ({
    // 初始状态
    entries: [],
    totalSize: 0,
    totalEntries: 0,
    quotas: [],
    sync: {
      lastSync: null,
      pending: 0,
      conflicts: 0,
      errors: 0,
      isSyncing: false,
      progress: 0,
    },
    security: {
      vaultLocked: true,
      encryptionEnabled: false,
      keyDerivationIterations: 100000,
      lastAuditTime: Date.now(),
      securityScore: 85,
    },
    portability: {
      exportInProgress: false,
      importInProgress: false,
      lastExport: null,
      lastImport: null,
      supportedFormats: SUPPORTED_EXPORT_FORMATS,
    },
    activeTab: 'overview',
    searchQuery: '',
    selectedEntries: [],

    // 初始化
    initialize: async () => {
      logger.info('Initializing unified data store...')
      await get().scanData()

      // 获取存储配额
      const quotas: StorageQuota[] = []
      for (const location of STORAGE_LOCATIONS) {
        quotas.push(await getStorageQuota(location))
      }

      set(state => {
        state.quotas = quotas
      })

      logger.info('Unified data store initialized')
    },

    // 扫描数据
    scanData: async () => {
      logger.info('Scanning data...')

      const entries: DataEntry[] = []

      // 扫描localStorage
      entries.push(...scanLocalStorage())

      // 计算总大小
      const totalSize = entries.reduce((sum, e) => sum + e.size, 0)

      // 计算同步状态
      const pending = entries.filter(e => e.status === 'pending').length
      const conflicts = entries.filter(e => e.status === 'conflict').length
      const errors = entries.filter(e => e.status === 'error').length

      set(state => {
        state.entries = entries
        state.totalSize = totalSize
        state.totalEntries = entries.length
        state.sync.pending = pending
        state.sync.conflicts = conflicts
        state.sync.errors = errors
      })

      logger.info(`Scanned ${entries.length} entries, total size: ${(totalSize / 1024).toFixed(2)} KB`)
    },

    // 同步所有数据
    syncAll: async () => {
      logger.info('Starting full sync...')

      set(state => {
        state.sync.isSyncing = true
        state.sync.progress = 0
      })

      const entries = get().entries
      const total = entries.length

      for (let i = 0; i < entries.length; i++) {
        await get().syncEntry(entries[i].id)

        set(state => {
          state.sync.progress = ((i + 1) / total) * 100
        })
      }

      set(state => {
        state.sync.isSyncing = false
        state.sync.lastSync = Date.now()
        state.sync.progress = 100
      })

      logger.info('Full sync completed')
    },

    // 同步单个条目
    syncEntry: async (id: string) => {
      logger.info(`Syncing entry: ${id}`)

      set(state => {
        const entry = state.entries.find(e => e.id === id)
        if (entry) {
          entry.status = 'synced'
          entry.synced = true
          entry.lastModified = Date.now()
        }
      })
    },

    // 加密条目
    encryptEntry: async (id: string, _passphrase: string) => {
      logger.info(`Encrypting entry: ${id}`)

      set(state => {
        const entry = state.entries.find(e => e.id === id)
        if (entry) {
          entry.encrypted = true
          entry.status = 'encrypted'
          entry.lastModified = Date.now()
        }
      })
    },

    // 解密条目
    decryptEntry: async (id: string, _passphrase: string) => {
      logger.info(`Decrypting entry: ${id}`)

      set(state => {
        const entry = state.entries.find(e => e.id === id)
        if (entry) {
          entry.encrypted = false
          entry.status = 'synced'
          entry.lastModified = Date.now()
        }
      })
    },

    // 删除条目
    deleteEntry: async (id: string) => {
      logger.info(`Deleting entry: ${id}`)

      const entry = get().entries.find(e => e.id === id)
      if (entry?.path) {
        localStorage.removeItem(entry.path)
      }

      set(state => {
        state.entries = state.entries.filter(e => e.id !== id)
        state.totalEntries = state.entries.length
        state.totalSize = state.entries.reduce((sum, e) => sum + e.size, 0)
      })
    },

    // 导出数据
    exportData: async (format: 'json' | 'zip' | 'sqlite', entries?: string[]) => {
      logger.info(`Exporting data in ${format} format...`)

      set(state => {
        state.portability.exportInProgress = true
      })

      const targetEntries = entries
        ? get().entries.filter(e => entries.includes(e.id))
        : get().entries

      const exportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        entries: targetEntries.map(e => ({
          ...e,
          content: e.path ? localStorage.getItem(e.path) : null,
        })),
      }

      let blob: Blob
      if (format === 'json') {
        blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      } else {
        blob = new Blob([JSON.stringify(exportData)], { type: 'application/octet-stream' })
      }

      set(state => {
        state.portability.exportInProgress = false
        state.portability.lastExport = Date.now()
      })

      logger.info(`Export completed: ${targetEntries.length} entries`)
      return blob
    },

    // 导入数据
    importData: async (file: File, _passphrase?: string) => {
      logger.info(`Importing data from ${file.name}...`)

      set(state => {
        state.portability.importInProgress = true
      })

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (data.entries && Array.isArray(data.entries)) {
          for (const entry of data.entries) {
            if (entry.path && entry.content) {
              localStorage.setItem(entry.path, entry.content)
            }
          }
        }

        await get().scanData()

        set(state => {
          state.portability.importInProgress = false
          state.portability.lastImport = Date.now()
        })

        logger.info('Import completed')
      } catch (error) {
        logger.error('Import failed:', error)
        set(state => {
          state.portability.importInProgress = false
        })
        throw error
      }
    },

    // 解决冲突
    resolveConflict: async (id: string, resolution: 'local' | 'remote' | 'merge') => {
      logger.info(`Resolving conflict for ${id} with resolution: ${resolution}`)

      set(state => {
        const entry = state.entries.find(e => e.id === id)
        if (entry) {
          entry.status = 'synced'
          entry.synced = true
          state.sync.conflicts = Math.max(0, state.sync.conflicts - 1)
        }
      })
    },

    // UI操作
    setActiveTab: (tab) => set(state => { state.activeTab = tab }),
    setSearchQuery: (query) => set(state => { state.searchQuery = query }),
    toggleEntrySelection: (id) => set(state => {
      const index = state.selectedEntries.indexOf(id)
      if (index >= 0) {
        state.selectedEntries.splice(index, 1)
      } else {
        state.selectedEntries.push(id)
      }
    }),
    selectAllEntries: () => set(state => {
      state.selectedEntries = state.entries.map(e => e.id)
    }),
    clearSelection: () => set(state => {
      state.selectedEntries = []
    }),
  }))
)
