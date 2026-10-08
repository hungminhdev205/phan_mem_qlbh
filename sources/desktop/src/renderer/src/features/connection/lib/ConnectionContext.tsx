import React, { useState, useEffect, useCallback, useRef } from 'react'
import { CONFIG } from '@renderer/libs/config'
import { checkBackendHealth } from '../actions/checkHealth'
import { ConnectionContext } from './context'
import type { ConnectionStatus } from '../types'
import { toast } from '@renderer/components/toast'

export const ConnectionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<ConnectionStatus>('checking')
  const [latencyMs, setLatencyMs] = useState<number | null>(null)
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(false)
  const prevStatusRef = useRef<ConnectionStatus>('checking')

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true)
    const result = await checkBackendHealth(CONFIG.DEFAULT_BACKEND_URL)

    setLatencyMs(result.latencyMs)
    setLastCheckedAt(new Date())
    setIsChecking(false)

    if (result.ok) {
      if (prevStatusRef.current === 'offline') {
        toast.success('Đã kết nối lại thành công đến máy chủ!')
      }
      prevStatusRef.current = 'online'
      setStatus('online')
      setError(null)
      return true
    } else {
      if (prevStatusRef.current === 'online') {
        toast.error('Mất kết nối đến máy chủ! Hệ thống chuyển sang chế độ Offline.', {
          duration: 5000
        })
      }
      prevStatusRef.current = 'offline'
      setStatus('offline')
      setError(result.error || 'Mất kết nối máy chủ')
      return false
    }
  }, [])

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      void checkConnection()
    }, 0)

    const intervalId = setInterval(() => {
      void checkConnection()
    }, CONFIG.HEARTBEAT_INTERVAL_MS)

    return (): void => {
      clearTimeout(initialTimer)
      clearInterval(intervalId)
    }
  }, [checkConnection])

  return (
    <ConnectionContext.Provider
      value={{
        status,
        latencyMs,
        lastCheckedAt,
        error,
        serverUrl: CONFIG.DEFAULT_BACKEND_URL,
        isChecking,
        checkConnection
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}
