import React, { useEffect, useRef, useState } from 'react'
import type { ToastItem } from '../types'
import { toast } from '../toastStore'

import {
  CheckmarkCircleRegular,
  DismissCircleRegular,
  WarningRegular,
  InfoRegular,
  DismissRegular
} from '@fluentui/react-icons'

interface ToastItemViewProps {
  item: ToastItem
}

export const ToastItemView: React.FC<ToastItemViewProps> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false)
  const remainingTimeRef = useRef(item.duration)
  const startTimeRef = useRef(item.createdAt)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (item.duration <= 0) return

    if (!isHovered) {
      startTimeRef.current = Date.now()
      timerRef.current = setTimeout(() => {
        toast.dismiss(item.id)
      }, remainingTimeRef.current)
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      const elapsed = Date.now() - startTimeRef.current
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed)
    }

    return (): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isHovered, item.duration, item.id])

  // Cấu hình style và icon theo loại Toast sử dụng semantic token trong @theme
  const iconConfig = {
    success: {
      boxClass: 'bg-status-online-bg text-status-online border-status-online-border',
      barClass: 'bg-status-online',
      icon: <CheckmarkCircleRegular className="text-base" />
    },
    error: {
      boxClass: 'bg-status-offline-bg text-status-offline border-status-offline-border',
      barClass: 'bg-status-offline',
      icon: <DismissCircleRegular className="text-base" />
    },
    warning: {
      boxClass: 'bg-status-checking-bg text-status-checking border-status-checking-border',
      barClass: 'bg-status-checking',
      icon: <WarningRegular className="text-base" />
    },
    info: {
      boxClass: 'bg-brand/10 text-brand border-brand/20',
      barClass: 'bg-brand',
      icon: <InfoRegular className="text-base" />
    }
  }

  const currentType = iconConfig[item.type]

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pointer-events-auto relative w-80 bg-card-bg border border-border-main rounded-xl shadow-md p-3.5 flex items-start gap-3 select-none overflow-hidden animate-toast-in transition-all hover:shadow-lg"
      role="alert"
    >
      {/* Icon hiển thị */}
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${currentType.boxClass}`}
      >
        {currentType.icon}
      </div>

      {/* Nội dung thông báo */}
      <div className="flex-1 min-w-0 pr-1">
        {item.title && (
          <h4 className="text-xs font-bold text-text-primary mb-0.5 truncate">{item.title}</h4>
        )}
        <p className="text-xs text-text-secondary leading-relaxed break-words">{item.message}</p>

        {/* Nút thao tác đính kèm nếu có */}
        {item.action && (
          <button
            type="button"
            onClick={() => {
              item.action?.onClick()
              toast.dismiss(item.id)
            }}
            className="mt-2 text-xs font-semibold text-brand hover:underline cursor-pointer block"
          >
            {item.action.label}
          </button>
        )}
      </div>

      {/* Nút đóng */}
      <button
        type="button"
        onClick={() => toast.dismiss(item.id)}
        className="w-5 h-5 rounded-md flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-subtle-bg transition-colors shrink-0 cursor-pointer"
        aria-label="Đóng"
      >
        <DismissRegular className="text-xs" />
      </button>

      {/* Thanh tiến trình tự đóng ở cạnh dưới */}
      {item.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border-subtle overflow-hidden">
          <div
            className={`h-full ${currentType.barClass}`}
            style={{
              animation: `toast-progress ${item.duration}ms linear forwards`,
              animationPlayState: isHovered ? 'paused' : 'running'
            }}
          />
        </div>
      )}
    </div>
  )
}
