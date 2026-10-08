import React, { useEffect, useState, useMemo } from 'react'
import type { ToastItem, ToastOptions, ToastType } from './types'
import { toast } from './toastStore'
import { ToastContext } from './context'
import { ToastContainer } from './components/ToastContainer'

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    return toast.subscribe((items) => {
      setToasts(items)
    })
  }, [])

  const value = useMemo(
    () => ({
      toasts,
      show: (msg: string, type?: ToastType, opts?: ToastOptions): string =>
        toast.show(msg, type, opts),
      success: (msg: string, opts?: ToastOptions): string => toast.success(msg, opts),
      error: (msg: string, opts?: ToastOptions): string => toast.error(msg, opts),
      warning: (msg: string, opts?: ToastOptions): string => toast.warning(msg, opts),
      info: (msg: string, opts?: ToastOptions): string => toast.info(msg, opts),
      dismiss: (id: string): void => toast.dismiss(id),
      dismissAll: (): void => toast.dismissAll()
    }),
    [toasts]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}
