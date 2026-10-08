import React from 'react'
import { ToastProvider } from './components/toast'
import { ConnectionProvider } from './features/connection'
import { AuthProvider, useAuth, AuthPage } from './features/auth'
import { DashboardPage } from './features/dashboard/DashboardPage'

const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // 1. Khi đang kiểm tra thông tin đăng nhập lưu từ trước (Splash Loading)
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-app-bg text-text-primary select-none">
        <div className="w-12 h-12 rounded-2xl bg-brand text-text-inverse font-black text-sm flex items-center justify-center shadow-xs animate-pulse mb-3">
          POS
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <svg className="w-3.5 h-3.5 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
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
          <span>Đang khởi động ứng dụng...</span>
        </div>
      </div>
    )
  }

  // 2. Nếu đã đăng nhập (hoặc tự động đăng nhập từ thông tin lưu trước) -> Vào thẳng Dashboard
  if (isAuthenticated) {
    return <DashboardPage />
  }

  // 3. Nếu chưa có thông tin đăng nhập -> Form đăng nhập hiện lên giữa màn hình
  return <AuthPage />
}

function App(): React.JSX.Element {
  return (
    <ToastProvider>
      <ConnectionProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ConnectionProvider>
    </ToastProvider>
  )
}

export default App
