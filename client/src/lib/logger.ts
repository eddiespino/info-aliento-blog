/**
 * Production-safe logging utility
 * Logs to console in development, silent in production
 */

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};