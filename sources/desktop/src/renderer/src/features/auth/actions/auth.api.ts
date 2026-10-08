import { CONFIG } from '@renderer/libs/config'
import type { LoginRequest, LoginResponse, UserInfo } from '../types'

const BASE_URL = CONFIG.DEFAULT_BACKEND_URL

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credentials)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMsg =
      errorData?.detail ||
      errorData?.msg ||
      errorData?.message ||
      'Tài khoản hoặc mật khẩu không đúng'
    throw new Error(errorMsg)
  }

  const result = await response.json()
  const token =
    result?.data?.token || result?.token || result?.data?.accessToken || result?.accessToken || ''
  return { token }
}

export async function getMeApi(token: string): Promise<UserInfo> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Phiên đăng nhập đã hết hạn hoặc không hợp lệ')
  }

  const result = await response.json()
  return (result?.data || result) as UserInfo
}
