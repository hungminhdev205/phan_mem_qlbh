export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface UserInfo {
  username?: string
  role?: string
  fullName?: string
  [key: string]: unknown
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserInfo | null
  token: string | null
  error: string | null
  login: (credentials: LoginRequest, remember?: boolean) => Promise<boolean>
  logout: () => void
}
