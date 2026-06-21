import axios from 'axios'
import { apiCall, getSignals, createSignal, getScreenerResults, getHealthStatus } from '@/lib/api'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('lib/api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('apiCall', () => {
    it('returns success response with data on successful GET', async () => {
      mockedAxios.mockResolvedValueOnce({
        data: { data: [{ id: '1', symbol: 'RELIANCE' }] },
        status: 200,
      })

      const result = await apiCall('/signals')

      expect(result.success).toBe(true)
      expect(result.data).toEqual([{ id: '1', symbol: 'RELIANCE' }])
      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/signals'),
        data: undefined,
        params: undefined,
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    })

    it('falls back to response.data when .data property is absent', async () => {
      mockedAxios.mockResolvedValueOnce({
        data: { status: 'healthy' },
        status: 200,
      })

      const result = await apiCall('/health')

      expect(result.success).toBe(true)
      expect(result.data).toEqual({ status: 'healthy' })
    })

    it('sends POST request with body', async () => {
      const payload = { symbol: 'TCS', signal: 'BUY' }
      mockedAxios.mockResolvedValueOnce({
        data: { data: { id: '1', ...payload } },
        status: 201,
      })

      const result = await apiCall('/signals', {
        method: 'POST',
        body: payload,
      })

      expect(result.success).toBe(true)
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: payload,
        })
      )
    })

    it('passes custom headers', async () => {
      mockedAxios.mockResolvedValueOnce({
        data: { data: {} },
        status: 200,
      })

      await apiCall('/endpoint', {
        headers: { Authorization: 'Bearer token123' },
      })

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer token123',
          }),
        })
      )
    })

    it('passes query params', async () => {
      mockedAxios.mockResolvedValueOnce({
        data: { data: [] },
        status: 200,
      })

      await apiCall('/screener', {
        params: { momentum: 'Bullish' },
      })

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { momentum: 'Bullish' },
        })
      )
    })

    it('returns error response on axios error with response data', async () => {
      const axiosError = {
        response: { data: { error: 'Not found' } },
        message: 'Request failed with status code 404',
      }
      mockedAxios.mockRejectedValueOnce(axiosError)

      const result = await apiCall('/nonexistent')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not found')
    })

    it('returns error response with message when response data has no error', async () => {
      const axiosError = {
        response: { data: {} },
        message: 'Network Error',
      }
      mockedAxios.mockRejectedValueOnce(axiosError)

      const result = await apiCall('/endpoint')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network Error')
    })

    it('returns generic error when error has no message', async () => {
      mockedAxios.mockRejectedValueOnce({})

      const result = await apiCall('/endpoint')

      expect(result.success).toBe(false)
      expect(result.error).toBe('An error occurred')
    })
  })

  describe('getSignals', () => {
    it('calls apiCall with /signals endpoint', async () => {
      mockedAxios.mockResolvedValueOnce({
        data: { data: [] },
        status: 200,
      })

      const result = await getSignals()
      expect(result.success).toBe(true)
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining('/signals') })
      )
    })
  })

  describe('createSignal', () => {
    it('calls apiCall with POST method and signal data', async () => {
      const signalData = { symbol: 'INFY', signal: 'BUY', confidence: 85 }
      mockedAxios.mockResolvedValueOnce({
        data: { data: { id: '1', ...signalData } },
        status: 201,
      })

      const result = await createSignal(signalData)
      expect(result.success).toBe(true)
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          data: signalData,
        })
      )
    })
  })

  describe('getScreenerResults', () => {
    it('calls apiCall with params for filtering', async () => {
      mockedAxios.mockResolvedValueOnce({
        data: { data: [] },
        status: 200,
      })

      await getScreenerResults({ momentum: 'Bullish', marketCap: 'large' })
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { momentum: 'Bullish', marketCap: 'large' },
        })
      )
    })

    it('calls without params when no filters provided', async () => {
      mockedAxios.mockResolvedValueOnce({
        data: { data: [] },
        status: 200,
      })

      await getScreenerResults()
      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          params: undefined,
        })
      )
    })
  })

  describe('getHealthStatus', () => {
    it('calls apiCall with /health endpoint', async () => {
      mockedAxios.mockResolvedValueOnce({
        data: { status: 'healthy' },
        status: 200,
      })

      const result = await getHealthStatus()
      expect(result.success).toBe(true)
    })
  })
})
