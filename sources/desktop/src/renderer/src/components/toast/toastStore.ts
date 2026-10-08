import type { ToastItem, ToastOptions, ToastType } from './types'

type ToastListener = (toasts: ToastItem[]) => void

class ToastManager {
  private toasts: ToastItem[] = []
  private listeners: Set<ToastListener> = new Set()

  private notify(): void {
    const list = [...this.toasts]
    this.listeners.forEach((listener) => listener(list))
  }

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener)
    listener([...this.toasts])
    return (): void => {
      this.listeners.delete(listener)
    }
  }

  show(message: string, type: ToastType = 'info', options?: ToastOptions): string {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const duration = options?.duration !== undefined ? options.duration : 4000

    const item: ToastItem = {
      id,
      type,
      title: options?.title,
      message,
      duration,
      action: options?.action,
      createdAt: Date.now()
    }

    this.toasts = [...this.toasts.slice(-4), item]
    this.notify()
    return id
  }

  success(message: string, options?: ToastOptions): string {
    return this.show(message, 'success', options)
  }

  error(message: string, options?: ToastOptions): string {
    return this.show(message, 'error', options)
  }

  warning(message: string, options?: ToastOptions): string {
    return this.show(message, 'warning', options)
  }

  info(message: string, options?: ToastOptions): string {
    return this.show(message, 'info', options)
  }

  dismiss(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id)
    this.notify()
  }

  dismissAll(): void {
    this.toasts = []
    this.notify()
  }

  getToasts(): ToastItem[] {
    return [...this.toasts]
  }
}

export const toast = new ToastManager()
