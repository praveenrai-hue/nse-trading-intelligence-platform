import axios, { AxiosError } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, unknown>
}

/**
 * Make API calls with proper error handling
 */
export async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const { method = 'GET', headers = {}, body, params } = options

    const response = await axios({
      method,
      url: `${API_URL}${endpoint}`,
      data: body,
      params,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    return {
      success: true,
      data: response.data.data || response.data,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    const errorMessage =
      (axiosError.response?.data as any)?.error ||
      axiosError.message ||
      'An error occurred'

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Fetch trading signals
 */
export async function getSignals() {
  return apiCall('/signals')
}

/**
 * Create a new signal
 */
export async function createSignal(signalData: unknown) {
  return apiCall('/signals', {
    method: 'POST',
    body: signalData,
  })
}

/**
 * Fetch screener results
 */
export async function getScreenerResults(filters?: Record<string, unknown>) {
  return apiCall('/screener', {
    params: filters,
  })
}

/**
 * Get health status
 */
export async function getHealthStatus() {
  return apiCall('/health')
}
