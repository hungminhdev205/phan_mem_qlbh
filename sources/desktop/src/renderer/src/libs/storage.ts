import { CONFIG } from './config'

const STORAGE_KEYS = {
  ...CONFIG.STORAGE_KEYS,
  SAVED_CREDENTIALS: 'qlbh_saved_credentials'
}

export const getStoredServerUrl = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEYS.SERVER_URL) || CONFIG.DEFAULT_BACKEND_URL
  } catch {
    return CONFIG.DEFAULT_BACKEND_URL
  }
}

export const setStoredServerUrl = (url: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SERVER_URL, url.trim().replace(/\/+$/, ''))
  } catch (error) {
    console.error('Failed to save server URL:', error)
  }
}

// Đảm bảo không bao giờ tồn đọng token cũ trong localStorage
try {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
} catch {
  // Bỏ qua nếu môi trường không có localStorage
}

export const getStoredToken = (): string | null => {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  } catch {
    return null
  }
}

export const setStoredToken = (token: string): void => {
  try {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  } catch (error) {
    console.error('Failed to save session token:', error)
  }
}

export const removeStoredToken = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  } catch (error) {
    console.error('Failed to remove token:', error)
  }
}

export interface StoredCredentials {
  username: string
  password?: string
}

export const getSavedCredentials = (): StoredCredentials | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_CREDENTIALS)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setSavedCredentials = (credentials: StoredCredentials): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_CREDENTIALS, JSON.stringify(credentials))
  } catch (error) {
    console.error('Failed to save credentials:', error)
  }
}

export const removeSavedCredentials = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_CREDENTIALS)
  } catch (error) {
    console.error('Failed to remove credentials:', error)
  }
}
