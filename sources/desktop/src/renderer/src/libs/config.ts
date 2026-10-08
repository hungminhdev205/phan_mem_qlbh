export const CONFIG = {
  // Mặc định backend Spring Boot chạy cổng 8090
  DEFAULT_BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8090',
  API_PREFIX: '/api/v1',
  TIMEOUT_MS: 4000,
  HEARTBEAT_INTERVAL_MS: 30000,
  STORAGE_KEYS: {
    SERVER_URL: 'qlbh_server_url',
    AUTH_TOKEN: 'qlbh_auth_token',
    USER_INFO: 'qlbh_user_info'
  }
} as const
