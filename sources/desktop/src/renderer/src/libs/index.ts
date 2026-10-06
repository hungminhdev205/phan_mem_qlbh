const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8090/api/v1'

export type ApiSuccess<T> = {
  success: boolean
  msg: string
  data: T
}

type ApiRequestOptions = RequestInit & {
  language?: string
}

export async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { language = 'vi', headers, ...requestOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language,
      Locale: language,
      ...headers
    }
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload?.detail ?? payload?.msg ?? 'Khong the ket noi may chu. Vui long thu lai.'
    throw new Error(message)
  }

  return payload as T
}
