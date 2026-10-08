import { CONFIG } from '@renderer/libs/config'

export interface HealthCheckResult {
  ok: boolean
  latencyMs: number
  error?: string
}

export async function checkBackendHealth(
  serverUrl = CONFIG.DEFAULT_BACKEND_URL
): Promise<HealthCheckResult> {
  const startTime = performance.now()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS)

  try {
    const response = await fetch(`${serverUrl}/api/v1/health/ping`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })

    const latencyMs = Math.round(performance.now() - startTime)

    if (response.ok) {
      return { ok: true, latencyMs }
    }

    return {
      ok: false,
      latencyMs,
      error: `Máy chủ phản hồi mã lỗi: ${response.status}`
    }
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime)
    const isTimeout = err instanceof DOMException && err.name === 'AbortError'
    return {
      ok: false,
      latencyMs,
      error: isTimeout ? 'Hết thời gian chờ kết nối (Timeout)' : 'Không thể kết nối đến máy chủ'
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
