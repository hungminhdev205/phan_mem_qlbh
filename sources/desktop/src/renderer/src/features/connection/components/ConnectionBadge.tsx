import React from 'react'
import { useConnection } from '../lib/useConnection'

interface ConnectionBadgeProps {
  onClick?: () => void
  showLatency?: boolean
  className?: string
}

export const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({
  onClick,
  showLatency = false,
  className = ''
}) => {
  const { status, latencyMs, isChecking } = useConnection()

  const config = {
    online: {
      bg: 'bg-status-online-bg text-status-online-text border-status-online-border',
      dot: 'bg-status-online',
      label: 'Online'
    },
    checking: {
      bg: 'bg-status-checking-bg text-status-checking-text border-status-checking-border',
      dot: 'bg-status-checking animate-pulse',
      label: 'Đang kết nối'
    },
    offline: {
      bg: 'bg-status-offline-bg text-status-offline-text border-status-offline-border',
      dot: 'bg-status-offline',
      label: 'Offline'
    }
  }

  const current = config[status]

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border select-none transition-all shadow-2xs ${current.bg} ${
        onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {status === 'online' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-online opacity-60" />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${current.dot}`} />
      </span>

      <span>{current.label}</span>

      {showLatency && status === 'online' && latencyMs !== null && (
        <span className="font-mono text-[10px] opacity-80">({latencyMs}ms)</span>
      )}

      {isChecking && (
        <svg
          className="animate-spin h-2.5 w-2.5 ml-0.5 opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
    </div>
  )
}
