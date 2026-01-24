export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
  maxDelay?: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
  onRetry?: (error: any, attempt: number) => void;
}

export class RetryError extends Error {
  public attempts: number;
  public lastError: any;

  constructor(message: string, attempts: number, lastError: any) {
    super(message);
    this.name = 'RetryError';
    this.attempts = attempts;
    this.lastError = lastError;
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    maxDelay = 30000,
    shouldRetry = (error, attempt) => attempt < maxAttempts,
    onRetry,
  } = options;

  let lastError: any;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt++;

      if (!shouldRetry(error, attempt)) {
        break;
      }

      if (attempt < maxAttempts) {
        const currentDelay = calculateDelay(delay, attempt, backoff, maxDelay);
        
        if (onRetry) {
          onRetry(error, attempt);
        }

        await sleep(currentDelay);
      }
    }
  }

  throw new RetryError(
    `Operation failed after ${attempt} attempts`,
    attempt,
    lastError
  );
}

function calculateDelay(
  baseDelay: number,
  attempt: number,
  backoff: 'linear' | 'exponential',
  maxDelay: number
): number {
  let delay: number;

  if (backoff === 'exponential') {
    delay = baseDelay * Math.pow(2, attempt - 1);
  } else {
    delay = baseDelay * attempt;
  }

  return Math.min(delay, maxDelay);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Specific retry configurations for common scenarios
export const retryConfigs = {
  // For API calls that might fail due to network issues
  networkRequest: {
    maxAttempts: 3,
    delay: 1000,
    backoff: 'exponential' as const,
    shouldRetry: (error: any) => {
      // Retry on network errors, 5xx errors, and timeouts
      return (
        error.code === 'NETWORK_ERROR' ||
        error.code === 'TIMEOUT' ||
        (error.response && error.response.status >= 500) ||
        error.name === 'AbortError'
      );
    },
  },

  // For file uploads that might fail
  fileUpload: {
    maxAttempts: 5,
    delay: 2000,
    backoff: 'exponential' as const,
    maxDelay: 10000,
    shouldRetry: (error: any) => {
      // Don't retry on client errors (4xx), only server errors and network issues
      return (
        error.code === 'NETWORK_ERROR' ||
        error.code === 'TIMEOUT' ||
        (error.response && error.response.status >= 500)
      );
    },
  },

  // For critical operations that must succeed
  critical: {
    maxAttempts: 5,
    delay: 500,
    backoff: 'exponential' as const,
    maxDelay: 5000,
  },

  // For quick operations that should fail fast
  quick: {
    maxAttempts: 2,
    delay: 500,
    backoff: 'linear' as const,
  },
};

// Hook for using retry in React components
export function useRetry() {
  const retry = async <T>(
    fn: () => Promise<T>,
    options?: RetryOptions
  ): Promise<T> => {
    return withRetry(fn, options);
  };

  return { retry };
}