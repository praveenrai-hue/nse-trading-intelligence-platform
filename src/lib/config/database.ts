// Database configuration
// This will be used to connect to Supabase PostgreSQL

export const dbConfig = {
  provider: 'supabase',
  url: process.env.DATABASE_URL,
  options: {
    ssl: true,
    connectionString: process.env.DATABASE_URL,
  },
}

// Redis configuration
export const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  options: {
    retry_strategy: (options: any) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        return new Error('End of retry.')
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Retry time exhausted')
      }
      if (options.attempt > 10) {
        return undefined
      }
      return Math.min(options.attempt * 100, 3000)
    },
  },
}
