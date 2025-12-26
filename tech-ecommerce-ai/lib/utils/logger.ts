// Logger utility for conditional logging
// Set DEBUG=true in .env.local for development logging

const IS_DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true' || process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: unknown[]) => {
    if (IS_DEBUG) console.log(...args)
  },
  error: (...args: unknown[]) => {
    // Always log errors
    console.error(...args)
  },
  warn: (...args: unknown[]) => {
    if (IS_DEBUG) console.warn(...args)
  },
  info: (...args: unknown[]) => {
    if (IS_DEBUG) console.info(...args)
  },
  debug: (...args: unknown[]) => {
    if (IS_DEBUG) console.debug(...args)
  }
}

// Client-side logger (for components)
export const clientLogger = {
  log: (...args: unknown[]) => {
    if (typeof window !== 'undefined' && IS_DEBUG) {
      console.log(...args)
    }
  },
  error: (...args: unknown[]) => {
    if (typeof window !== 'undefined') {
      console.error(...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (typeof window !== 'undefined' && IS_DEBUG) {
      console.warn(...args)
    }
  },
  info: (...args: unknown[]) => {
    if (typeof window !== 'undefined' && IS_DEBUG) {
      console.info(...args)
    }
  }
}
