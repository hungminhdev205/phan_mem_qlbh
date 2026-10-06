export type AccountProfile = Record<string, unknown>

export type LoginPayload = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
}

export type SavedCredentials = LoginPayload & {
  remember: boolean
}
