import { ApiSuccess, request } from '@renderer/libs'
import { AccountProfile, LoginPayload, LoginResponse } from './types'

export async function login(payload: LoginPayload, language: string): Promise<string> {
  const response = await request<ApiSuccess<LoginResponse>>('/auth/login', {
    method: 'POST',
    language,
    body: JSON.stringify(payload)
  })

  return response.data.token
}

export async function getMe(token: string, language: string): Promise<AccountProfile> {
  const response = await request<ApiSuccess<AccountProfile>>('/auth/me', {
    method: 'GET',
    language,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
