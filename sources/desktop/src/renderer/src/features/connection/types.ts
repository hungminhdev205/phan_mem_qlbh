export type ConnectionStatus = 'online' | 'offline' | 'checking'

export interface ConnectionState {
  status: ConnectionStatus
  latencyMs: number | null
  lastCheckedAt: Date | null
  error: string | null
  serverUrl: string
  isChecking: boolean
  checkConnection: () => Promise<boolean>
}
