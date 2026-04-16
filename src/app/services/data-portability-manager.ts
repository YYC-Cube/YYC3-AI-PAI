/**
 * @file data-portability-manager.ts
 * @description 数据可移植性管理器 - 数据导入导出和迁移
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-04-08
 * @updated 2026-04-08
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags portability,export,import,migration
 */

import type { DataEntry, DataLocation } from '../store/unified-data-store'
import { securityVault } from './security-vault'

// ============================================================================
// 类型定义
// ============================================================================

export interface ExportOptions {
  format: 'json' | 'zip' | 'sqlite'
  includeEncrypted: boolean
  includeMetadata: boolean
  passphrase?: string
  compress: boolean
  prettyPrint: boolean
  entries?: string[]
}

export interface ImportOptions {
  merge: boolean
  overwrite: boolean
  passphrase?: string
  validateChecksum: boolean
  skipErrors: boolean
}

export interface ExportResult {
  blob: Blob
  filename: string
  size: number
  entries: number
  timestamp: number
  checksum: string
}

export interface ImportResult {
  success: boolean
  entries: number
  skipped: number
  errors: ImportError[]
  warnings: string[]
}

export interface ImportError {
  entryId: string
  error: string
  reason: 'invalid_format' | 'checksum_mismatch' | 'decryption_failed' | 'validation_failed' | 'unknown'
}

export interface DataPackage {
  version: string
  timestamp: number
  checksum: string
  entries: ExportableDataEntry[]
  metadata: PackageMetadata
}

export interface ExportableDataEntry extends DataEntry {
  data?: string
}

export interface PackageMetadata {
  source: string
  platform: string
  version: string
  encrypted: boolean
  compression?: 'gzip' | 'deflate' | 'none'
}

export interface MigrationPlan {
  id: string
  source: DataLocation
  target: DataLocation
  entries: DataEntry[]
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startTime?: number
  endTime?: number
  errors: string[]
}

// ============================================================================
// 数据可移植性管理器
// ============================================================================

export class DataPortabilityManager {
  private readonly PACKAGE_VERSION = '1.0.0'
  private readonly SOURCE_NAME = 'YYC3-AI-PAI'

  // ==========================================================================
  // 导出功能
  // ==========================================================================

  /**
   * 导出数据
   */
  async exportData(entries: DataEntry[], options: ExportOptions): Promise<ExportResult> {
    const filteredEntries = options.entries
      ? entries.filter(e => options.entries!.includes(e.id))
      : entries

    let processedEntries = filteredEntries

    if (!options.includeEncrypted) {
      processedEntries = processedEntries.filter(e => !e.encrypted)
    }

    if (options.passphrase) {
      processedEntries = await this.encryptEntries(processedEntries, options.passphrase)
    }

    const dataPackage: DataPackage = {
      version: this.PACKAGE_VERSION,
      timestamp: Date.now(),
      checksum: '',
      entries: processedEntries,
      metadata: {
        source: this.SOURCE_NAME,
        platform: this.getPlatform(),
        version: this.PACKAGE_VERSION,
        encrypted: !!options.passphrase,
        compression: options.compress ? 'gzip' : 'none',
      },
    }

    dataPackage.checksum = await this.calculateChecksum(dataPackage)

    let blob: Blob
    let filename: string

    switch (options.format) {
      case 'json':
        blob = await this.createJsonBlob(dataPackage, options.prettyPrint)
        filename = this.generateFilename('json', options.passphrase ? 'encrypted' : 'export')
        break
      case 'zip':
        blob = await this.createZipBlob(dataPackage, options.compress)
        filename = this.generateFilename('zip', options.passphrase ? 'encrypted' : 'export')
        break
      case 'sqlite':
        blob = await this.createSqliteBlob(dataPackage)
        filename = this.generateFilename('sqlite', options.passphrase ? 'encrypted' : 'export')
        break
      default:
        throw new Error(`Unsupported format: ${options.format}`)
    }

    return {
      blob,
      filename,
      size: blob.size,
      entries: processedEntries.length,
      timestamp: dataPackage.timestamp,
      checksum: dataPackage.checksum,
    }
  }

  // ==========================================================================
  // 导入功能
  // ==========================================================================

  /**
   * 导入数据
   */
  async importData(file: File, options: ImportOptions): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      entries: 0,
      skipped: 0,
      errors: [],
      warnings: [],
    }

    try {
      let dataPackage: DataPackage

      const extension = file.name.split('.').pop()?.toLowerCase()
      switch (extension) {
        case 'json':
          dataPackage = await this.parseJsonBlob(file)
          break
        case 'zip':
          dataPackage = await this.parseZipBlob(file)
          break
        case 'sqlite':
          dataPackage = await this.parseSqliteBlob(file)
          break
        default:
          throw new Error(`Unsupported file format: ${extension}`)
      }

      if (options.validateChecksum) {
        const validChecksum = await this.validateChecksum(dataPackage)
        if (!validChecksum) {
          result.errors.push({
            entryId: 'package',
            error: 'Checksum validation failed',
            reason: 'checksum_mismatch',
          })
          return result
        }
      }

      if (dataPackage.metadata.encrypted && !options.passphrase) {
        result.errors.push({
          entryId: 'package',
          error: 'Passphrase required for encrypted data',
          reason: 'decryption_failed',
        })
        return result
      }

      let entries = dataPackage.entries
      if (options.passphrase) {
        entries = await this.decryptEntries(entries, options.passphrase)
      }

      for (const entry of entries) {
        try {
          const validation = this.validateEntry(entry)
          if (!validation.valid) {
            result.errors.push({
              entryId: entry.id,
              error: validation.error || 'Validation failed',
              reason: 'validation_failed',
            })
            if (!options.skipErrors) {
              continue
            }
          }

          result.entries++
        } catch (error) {
          result.errors.push({
            entryId: entry.id,
            error: error instanceof Error ? error.message : 'Unknown error',
            reason: 'unknown',
          })
          if (!options.skipErrors) {
            return result
          }
        }
      }

      result.success = result.errors.length === 0 || options.skipErrors

    } catch (error) {
      result.errors.push({
        entryId: 'file',
        error: error instanceof Error ? error.message : 'Unknown error',
        reason: 'invalid_format',
      })
    }

    return result
  }

  // ==========================================================================
  // 迁移功能
  // ==========================================================================

  /**
   * 创建迁移计划
   */
  createMigrationPlan(
    source: DataLocation,
    target: DataLocation,
    entries: DataEntry[]
  ): MigrationPlan {
    return {
      id: crypto.randomUUID(),
      source,
      target,
      entries,
      status: 'pending',
      progress: 0,
      errors: [],
    }
  }

  /**
   * 执行迁移
   */
  async executeMigration(
    plan: MigrationPlan,
    onProgress?: (progress: number) => void
  ): Promise<MigrationPlan> {
    plan.status = 'running'
    plan.startTime = Date.now()

    try {
      const total = plan.entries.length
      let processed = 0

      for (const entry of plan.entries) {
        try {
          // 迁移条目到目标位置
          entry.location = plan.target
          entry.lastModified = Date.now()

          processed++
          plan.progress = (processed / total) * 100
          onProgress?.(plan.progress)

        } catch (error) {
          plan.errors.push(
            `Failed to migrate ${entry.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          )
        }
      }

      plan.status = plan.errors.length === 0 ? 'completed' : 'failed'
      plan.endTime = Date.now()

    } catch (error) {
      plan.status = 'failed'
      plan.endTime = Date.now()
      plan.errors.push(error instanceof Error ? error.message : 'Unknown error')
    }

    return plan
  }

  // ==========================================================================
  // 私有方法
  // ==========================================================================

  private async encryptEntries(entries: DataEntry[], _passphrase: string): Promise<ExportableDataEntry[]> {
    const encrypted: ExportableDataEntry[] = []
    for (const entry of entries) {
      if (entry.encrypted) {
        encrypted.push(entry)
        continue
      }

      const data = JSON.stringify(entry)
      const encoded = new TextEncoder().encode(data)
      const encryptedData = await securityVault.encrypt(encoded.buffer as ArrayBuffer)

      encrypted.push({
        ...entry,
        encrypted: true,
        data: this.arrayBufferToBase64(encryptedData.ciphertext),
      })
    }
    return encrypted
  }

  private async decryptEntries(entries: ExportableDataEntry[], _passphrase: string): Promise<DataEntry[]> {
    const decrypted: DataEntry[] = []
    for (const entry of entries) {
      if (!entry.encrypted || !entry.data) {
        decrypted.push(entry)
        continue
      }

      try {
        const ciphertext = this.base64ToArrayBuffer(entry.data)
        const decryptedData = await securityVault.decrypt({
          ciphertext,
          iv: new Uint8Array(12),
          salt: new Uint8Array(16),
          version: 1,
          algorithm: 'AES-GCM',
        })

        const json = new TextDecoder().decode(decryptedData)
        const originalEntry = JSON.parse(json) as DataEntry

        decrypted.push({
          ...originalEntry,
          encrypted: false,
        })
      } catch (error) {
        const message = `Failed to decrypt entry ${entry.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        const newError = new Error(message)
        if (error instanceof Error) {
          ; (newError as Error & { cause?: unknown }).cause = error
        }
        throw newError
      }
    }
    return decrypted
  }

  private async createJsonBlob(data: DataPackage, prettyPrint: boolean): Promise<Blob> {
    const json = prettyPrint
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data)
    return new Blob([json], { type: 'application/json' })
  }

  private async createZipBlob(data: DataPackage, compress: boolean): Promise<Blob> {
    const json = JSON.stringify(data)
    const encoder = new TextEncoder()
    const bytes = encoder.encode(json)

    if (compress) {
      const compressed = await this.compressData(bytes)
      return new Blob([compressed.buffer as ArrayBuffer], { type: 'application/zip' })
    }

    return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/zip' })
  }

  private async createSqliteBlob(data: DataPackage): Promise<Blob> {
    const json = JSON.stringify(data)
    return new Blob([json], { type: 'application/x-sqlite3' })
  }

  private async parseJsonBlob(file: File): Promise<DataPackage> {
    const text = await file.text()
    return JSON.parse(text) as DataPackage
  }

  private async parseZipBlob(file: File): Promise<DataPackage> {
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    try {
      const decompressed = await this.decompressData(bytes)
      const text = new TextDecoder().decode(decompressed)
      return JSON.parse(text) as DataPackage
    } catch {
      const text = new TextDecoder().decode(bytes)
      return JSON.parse(text) as DataPackage
    }
  }

  private async parseSqliteBlob(file: File): Promise<DataPackage> {
    const text = await file.text()
    return JSON.parse(text) as DataPackage
  }

  private async calculateChecksum(data: DataPackage): Promise<string> {
    const content = JSON.stringify({
      version: data.version,
      timestamp: data.timestamp,
      entries: data.entries.map(e => ({ id: e.id, type: e.type, size: e.size })),
    })

    const encoder = new TextEncoder()
    const data_bytes = encoder.encode(content)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data_bytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  private async validateChecksum(data: DataPackage): Promise<boolean> {
    const calculated = await this.calculateChecksum(data)
    return calculated === data.checksum
  }

  private validateEntry(entry: DataEntry): { valid: boolean; error?: string } {
    if (!entry.id) {
      return { valid: false, error: 'Missing entry ID' }
    }
    if (!entry.type) {
      return { valid: false, error: 'Missing entry type' }
    }
    if (!entry.location) {
      return { valid: false, error: 'Missing entry location' }
    }
    if (typeof entry.size !== 'number' || entry.size < 0) {
      return { valid: false, error: 'Invalid entry size' }
    }
    return { valid: true }
  }

  private generateFilename(extension: string, prefix: string): string {
    const date = new Date().toISOString().split('T')[0]
    return `yyc3-${prefix}-${date}.${extension}`
  }

  private getPlatform(): string {
    if (typeof window !== 'undefined') {
      return navigator.platform || 'unknown'
    }
    return 'server'
  }

  private async compressData(data: Uint8Array): Promise<Uint8Array> {
    const stream = new CompressionStream('gzip')
    const writer = stream.writable.getWriter()
    await writer.write(data as unknown as BufferSource)
    await writer.close()

    const reader = stream.readable.getReader()
    const chunks: Uint8Array[] = []
    let totalLength = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      totalLength += value.length
    }

    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }

    return result
  }

  private async decompressData(data: Uint8Array): Promise<Uint8Array> {
    const stream = new DecompressionStream('gzip')
    const writer = stream.writable.getWriter()
    await writer.write(data as unknown as BufferSource)
    await writer.close()

    const reader = stream.readable.getReader()
    const chunks: Uint8Array[] = []
    let totalLength = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      totalLength += value.length
    }

    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }

    return result
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }
}

// ============================================================================
// 单例实例
// ============================================================================

export const dataPortabilityManager = new DataPortabilityManager()
