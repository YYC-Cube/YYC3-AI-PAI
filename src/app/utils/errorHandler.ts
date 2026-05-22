/**
 * @file errorHandler.ts
 * @description 统一错误处理工具，提供完善的错误边界和恢复机制
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-05-22
 * @status stable
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags error,handling,utility,production-ready
 */

// ===== 错误类型定义 =====

/**
 * 应用级错误分类
 */
export enum ErrorType {
  // 网络错误
  NETWORK = 'NETWORK',
  API = 'API',
  TIMEOUT = 'TIMEOUT',

  // 数据错误
  VALIDATION = 'VALIDATION',
  PARSING = 'PARSING',
  NOT_FOUND = 'NOT_FOUND',

  // 权限错误
  AUTH = 'AUTH',
  PERMISSION = 'PERMISSION',

  // 资源错误
  RESOURCE = 'RESOURCE',
  MEMORY = 'MEMORY',
  QUOTA = 'QUOTA',

  // 应用错误
  RUNTIME = 'RUNTIME',
  COMPONENT = 'COMPONENT',
  STATE = 'STATE',

  // 未知错误
  UNKNOWN = 'UNKNOWN',
}

/**
 * 错误严重级别
 */
export enum ErrorSeverity {
  LOW = 'low',       // 不影响核心功能
  MEDIUM = 'medium', // 影响部分功能
  HIGH = 'high',     // 影响核心功能
  CRITICAL = 'critical', // 应用无法使用
}

/**
 * 应用错误接口
 */
export interface AppError extends Error {
  type: ErrorType
  severity: ErrorSeverity
  userMessage: string
  technicalMessage: string
  timestamp: Date
  stack?: string
  context?: Record<string, unknown>
  recoverable: boolean
}

// ===== 错误工厂函数 =====

/**
 * 创建应用错误对象
 */
export function createError(
  type: ErrorType,
  severity: ErrorSeverity,
  userMessage: string,
  technicalMessage?: string,
  context?: Record<string, unknown>
): AppError {
  const error = new Error(userMessage) as AppError
  // 🔧 设置错误原因链，以便错误追踪
  const causeError = technicalMessage ? new Error(technicalMessage) : undefined
  if (causeError) {
    ;(error as Error).cause = causeError
  }

  error.type = type
  error.severity = severity
  error.userMessage = userMessage
  error.technicalMessage = technicalMessage || userMessage
  error.timestamp = new Date()
  error.context = context
  error.recoverable = severity !== ErrorSeverity.CRITICAL

  return error
}

// ===== 特定错误类型的快捷创建函数 =====

/**
 * 创建网络错误
 */
export function createNetworkError(
  message: string,
  context?: { url?: string; method?: string; status?: number }
): AppError {
  return createError(
    ErrorType.NETWORK,
    ErrorSeverity.MEDIUM,
    '网络连接失败，请检查您的网络连接',
    message,
    context
  )
}

/**
 * 创建API错误
 */
export function createAPIError(
  message: string,
  context?: { endpoint?: string; status?: number; response?: unknown }
): AppError {
  return createError(
    ErrorType.API,
    ErrorSeverity.MEDIUM,
    '服务请求失败，请稍后重试',
    message,
    context
  )
}

/**
 * 创建验证错误
 */
export function createValidationError(
  message: string,
  context?: { field?: string; value?: unknown; constraint?: string }
): AppError {
  return createError(
    ErrorType.VALIDATION,
    ErrorSeverity.LOW,
    '输入数据格式不正确',
    message,
    context
  )
}

/**
 * 创建权限错误
 */
export function createAuthError(
  message: string,
  context?: { action?: string; resource?: string }
): AppError {
  return createError(
    ErrorType.AUTH,
    ErrorSeverity.HIGH,
    '您没有执行此操作的权限',
    message,
    context
  )
}

/**
 * 创建资源错误
 */
export function createResourceError(
  message: string,
  context?: { resource?: string; operation?: string }
): AppError {
  return createError(
    ErrorType.RESOURCE,
    ErrorSeverity.MEDIUM,
    '资源加载失败，请刷新页面重试',
    message,
    context
  )
}

// ===== 错误处理工具函数 =====

/**
 * 判断错误是否可恢复
 */
export function isRecoverable(error: unknown): boolean {
  if (error instanceof Error) {
    const appError = error as AppError
    return appError.recoverable !== undefined ? appError.recoverable : true
  }
  return true
}

/**
 * 获取用户友好的错误消息
 */
export function getUserMessage(error: unknown): string {
  if (error instanceof Error) {
    const appError = error as AppError
    return appError.userMessage || appError.message || '发生未知错误'
  }
  return '发生未知错误，请稍后重试'
}

/**
 * 获取技术错误消息（用于日志记录）
 */
export function getTechnicalMessage(error: unknown): string {
  if (error instanceof Error) {
    const appError = error as AppError
    return appError.technicalMessage || appError.message || String(error)
  }
  return String(error)
}

/**
 * 记录错误到控制台（生产环境可以替换为日志服务）
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const technicalMessage = getTechnicalMessage(error)
  const errorData = {
    error: technicalMessage,
    context,
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    stack: error instanceof Error ? error.stack : undefined,
  }

  // 🔧 生产环境应该发送到日志服务
  if (import.meta.env.PROD) {
    // TODO: 发送到日志服务
    // sendToLogService(errorData)
    console.warn('[Production Error]', errorData)
  } else {
    console.warn('[Development Error]', errorData)
  }
}

/**
 * 处理异步操作的错误
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  errorHandler?: (error: unknown) => T
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    logError(error, { operation: operation.name || 'anonymous' })

    if (errorHandler) {
      return errorHandler(error)
    }

    // 默认错误处理
    const userMessage = getUserMessage(error)
    throw new Error(userMessage)
  }
}

/**
 * 安全地执行可能失败的操作
 */
export function safeExecute<T>(
  operation: () => T,
  fallback: T,
  errorHandler?: (error: unknown) => void
): T {
  try {
    return operation()
  } catch (error) {
    logError(error, { operation: operation.name || 'anonymous' })

    if (errorHandler) {
      errorHandler(error)
    }

    return fallback
  }
}

// ===== 错误边界组件辅助函数 =====

/**
 * 增强的错误边界上下文
 */
export interface ErrorBoundaryContext {
  error: AppError | null
  resetError: () => void
  reportError: (error: unknown) => void
}

/**
 * 创建错误边界上下文值
 */
export function createErrorBoundaryContext(): ErrorBoundaryContext {
  let error: AppError | null = null

  return {
    get error() { return error },
    resetError() { error = null },
    reportError(err: unknown) {
      if (err instanceof Error) {
        error = err as AppError
      } else {
        error = createError(
          ErrorType.RUNTIME,
          ErrorSeverity.MEDIUM,
          '发生未知错误',
          String(err)
        )
      }
      logError(error)
    },
  }
}

// ===== 错误监控集成 =====

/**
 * 错误监控配置
 */
interface ErrorMonitoringConfig {
  enabled: boolean
  sampleRate: number // 0-1，采样率
  beforeSend?: (error: AppError) => boolean | Promise<boolean>
}

let monitoringConfig: ErrorMonitoringConfig = {
  enabled: true,
  sampleRate: 1.0,
}

/**
 * 配置错误监控
 */
export function setupErrorMonitoring(config: Partial<ErrorMonitoringConfig>): void {
  monitoringConfig = { ...monitoringConfig, ...config }
}

/**
 * 发送错误到监控服务
 */
export async function sendToMonitoringService(error: AppError): Promise<void> {
  if (!monitoringConfig.enabled) return

  // 采样率控制
  if (Math.random() > monitoringConfig.sampleRate) return

  // beforeSend钩子
  if (monitoringConfig.beforeSend) {
    const shouldSend = await monitoringConfig.beforeSend(error)
    if (!shouldSend) return
  }

  // TODO: 实现实际的监控服务集成
  // await sendToSentry(error)
  // await sendToDataDog(error)
  // await sendToCustomService(error)

  if (import.meta.env.DEV) {
    console.warn('[Error Monitoring] Error would be sent to monitoring service:', error)
  }
}

/**
 * 全局错误处理器初始化
 */
export function initializeGlobalErrorHandling(): void {
  // 处理未捕获的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()
    const error = createError(
      ErrorType.RUNTIME,
      ErrorSeverity.MEDIUM,
      '应用程序遇到意外错误',
      event.reason?.message || String(event.reason)
    )
    logError(error, { originalReason: event.reason })
    sendToMonitoringService(error)
  })

  // 处理全局JavaScript错误
  window.addEventListener('error', (event) => {
    const error = createError(
      ErrorType.RUNTIME,
      ErrorSeverity.HIGH,
      '应用程序运行时错误',
      event.message,
      { filename: event.filename, lineno: event.lineno, colno: event.colno }
    )
    logError(error, { originalEvent: event })
    sendToMonitoringService(error)
  })

  if (import.meta.env.DEV) {
    console.log('[Error Handling] Global error handling initialized')
  }
}
