/**
 * 监控仪表板组件
 * 显示实时性能指标和系统健康状态
 */

import { useState, useEffect } from 'react'
import { getMonitor } from '../monitoring/SimpleMonitor'

interface DashboardMetrics {
  status: 'healthy' | 'warning' | 'critical'
  errorRate: number
  avgMemory: number
  lastUpdate: number
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const monitor = getMonitor()
    if (!monitor) return

    // 每5秒更新一次指标
    const interval = setInterval(() => {
      const healthStatus = monitor.getHealthStatus()
      setMetrics({
        status: healthStatus.status,
        errorRate: healthStatus.metrics.errorRate,
        avgMemory: healthStatus.metrics.avgMemory,
        lastUpdate: healthStatus.metrics.lastUpdate,
      })
    }, 5000)

    // 初始加载
    const healthStatus = monitor.getHealthStatus()
    setMetrics({
      status: healthStatus.status,
      errorRate: healthStatus.metrics.errorRate,
      avgMemory: healthStatus.metrics.avgMemory,
      lastUpdate: healthStatus.metrics.lastUpdate,
    })

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '8px 12px',
          backgroundColor: metrics?.status === 'critical' ? '#ef4444' :
                         metrics?.status === 'warning' ? '#f59e0b' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        📊 监控
      </button>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'critical': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return '✅ 健康'
      case 'warning': return '⚠️ 警告'
      case 'critical': return '🚨 严重'
      default: return '❓ 未知'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        width: '320px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        fontSize: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>📊 系统监控</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6b7280',
          }}
        >
          ×
        </button>
      </div>

      {metrics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 状态卡片 */}
          <div
            style={{
              padding: '12px',
              backgroundColor: getStatusColor(metrics.status) + '20',
              border: `1px solid ${getStatusColor(metrics.status)}`,
              borderRadius: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
              {getStatusText(metrics.status)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              最后更新: {new Date(metrics.lastUpdate).toLocaleTimeString()}
            </div>
          </div>

          {/* 详细指标 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div
              style={{
                padding: '8px',
                backgroundColor: '#f9fafb',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>错误率</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: metrics.errorRate > 1 ? '#ef4444' : '#10b981' }}>
                {metrics.errorRate.toFixed(2)}/min
              </div>
            </div>

            <div
              style={{
                padding: '8px',
                backgroundColor: '#f9fafb',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>内存使用</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: metrics.avgMemory > 50 ? '#f59e0b' : '#10b981' }}>
                {metrics.avgMemory}MB
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => {
                const monitor = getMonitor()
                if (monitor) {
                  console.log('📊 监控指标:', monitor.getAllMetrics())
                  console.log('❌ 最近错误:', monitor.getRecentErrors())
                }
              }}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              📋 详细日志
            </button>
            <button
              onClick={() => {
                window.location.href = '/monitoring-status.html'
              }}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              📊 完整仪表板
            </button>
          </div>
        </div>
      )}

      {!metrics && (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
          正在初始化监控...
        </div>
      )}
    </div>
  )
}

// 开发环境下自动显示监控仪表板
if (import.meta.env.DEV) {
  console.log('📊 监控仪表板组件已加载，可以通过调用 <MonitoringDashboard /> 显示')
}