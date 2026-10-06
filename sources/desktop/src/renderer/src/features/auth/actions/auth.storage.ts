import { SavedCredentials } from './types'

const TOKEN_KEY = 'auth_token'
const CREDENTIALS_KEY = 'auth_remembered_credentials'

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getSavedCredentials(): SavedCredentials | null {
  const rawValue = localStorage.getItem(CREDENTIALS_KEY)
  if (!rawValue) {
    return null
  }

  try {
    const credentials = JSON.parse(rawValue) as SavedCredentials
    if (!credentials.username || !credentials.password) {
      return null
    }
    return credentials
  } catch {
    return null
  }
}

export function saveCredentials(credentials: SavedCredentials): void {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials))
}

export function clearSavedCredentials(): void {
  localStorage.removeItem(CREDENTIALS_KEY)
}
