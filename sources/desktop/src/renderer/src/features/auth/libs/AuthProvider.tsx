import React, { useState, useEffect, useCallback } from 'react'
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getSavedCredentials,
  setSavedCredentials,
  removeSavedCredentials
} from '@renderer/libs/storage'
import { loginApi, getMeApi } from '../actions/auth.api'
import { AuthContext } from './context'
import type { LoginRequest, UserInfo } from '../types'
import { toast } from '@renderer/components/toast'

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getStoredToken)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Tự động kiểm tra đăng nhập lúc app khởi động
  useEffect(() => {
    let isMounted = true

    // Dọn sạch token cũ ngay khi khởi động - không bao giờ dùng lại token từ phiên cũ
    removeStoredToken()

    const checkSavedLogin = async (): Promise<void> => {
      // Chỉ kiểm tra thông tin tài khoản được người dùng chọn ghi nhớ từ trước
      const savedCreds = getSavedCredentials()

      if (savedCreds?.username && savedCreds?.password) {
        try {
          // Luôn gọi API login mới để nhận token mới tinh cho phiên làm việc này
          const res = await loginApi({
            username: savedCreds.username,
            password: savedCreds.password
          })

          setStoredToken(res.token)
          const userInfo: UserInfo = await getMeApi(res.token).catch(() => ({
            username: savedCreds.username
          }))

          if (isMounted) {
            setToken(res.token)
            setUser(userInfo)
            setIsAuthenticated(true)
            setIsLoading(false)
            return
          }
        } catch {
          // Thông tin ghi nhớ không còn hợp lệ
          removeSavedCredentials()
          removeStoredToken()
        }
      }

      // Chưa có thông tin ghi nhớ hoặc không hợp lệ -> Hiển thị form đăng nhập
      if (isMounted) {
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
        setIsLoading(false)
      }
    }

    void checkSavedLogin()

    // Khi người dùng thoát app hoặc đóng cửa sổ, hủy ngay token của phiên làm việc
    const handleExit = (): void => {
      removeStoredToken()
    }
    window.addEventListener('beforeunload', handleExit)

    return (): void => {
      isMounted = false
      window.removeEventListener('beforeunload', handleExit)
    }
  }, [])

  const login = useCallback(
    async (credentials: LoginRequest, remember = false): Promise<boolean> => {
      setError(null)
      try {
        const res = await loginApi(credentials)

        setStoredToken(res.token)
        setToken(res.token)

        if (remember) {
          setSavedCredentials(credentials)
        } else {
          removeSavedCredentials()
        }

        const userInfo: UserInfo = await getMeApi(res.token).catch(() => ({
          username: credentials.username
        }))
        setUser(userInfo)
        setIsAuthenticated(true)
        toast.success(`Chào mừng ${userInfo?.fullName || credentials.username} đã đăng nhập!`, {
          title: 'Đăng nhập thành công'
        })
        return true
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Đăng nhập không thành công'
        setError(msg)
        toast.error(msg, { title: 'Đăng nhập thất bại' })
        return false
      }
    },
    []
  )

  const logout = useCallback((): void => {
    removeStoredToken()
    removeSavedCredentials()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
    toast.info('Đã đăng xuất khỏi phiên làm việc.')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        token,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
