export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  title?: string
  duration?: number // Milliseconds, mặc định 4000ms. Đặt 0 nếu không muốn tự đóng
  action?: ToastAction
}

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
  duration: number
  action?: ToastAction
  createdAt: number
}

export interface ToastContextType {
  toasts: ToastItem[]
  show: (message: string, type?: ToastType, options?: ToastOptions) => string
  success: (message: string, options?: ToastOptions) => string
  error: (message: string, options?: ToastOptions) => string
  warning: (message: string, options?: ToastOptions) => string
  info: (message: string, options?: ToastOptions) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}
