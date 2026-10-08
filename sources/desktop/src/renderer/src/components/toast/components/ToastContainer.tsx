import React, { useEffect, useState } from 'react'
import type { ToastItem } from '../types'
import { toast } from '../toastStore'
import { ToastItemView } from './ToastItemView'

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const unsubscribe = toast.subscribe((items) => {
      setToasts(items)
    })
    return (): void => {
      unsubscribe()
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-14 right-5 z-40 flex flex-col gap-2.5 pointer-events-none select-none"
      aria-live="polite"
    >
      {toasts.map((item) => (
        <ToastItemView key={item.id} item={item} />
      ))}
    </div>
  )
}
