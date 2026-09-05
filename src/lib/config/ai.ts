// AI/ML API configuration

export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  maxTokens: 2000,
  temperature: 0.7,
}

export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-pro',
}

// NSE Data API configuration
export const nseConfig = {
  baseUrl: process.env.NSE_DATA_API_URL || 'https://api.nseindia.com',
  apiKey: process.env.NSE_API_KEY,
  timeout: 30000,
}
