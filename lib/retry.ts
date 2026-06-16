export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
  maxDelay?: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
  onRetry?: (error: any, attempt: number) => void;
}

class RetryError extends Error {
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

/** Matches axios / fetch transient failures for retry decisions. */
export function isTransientRequestError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const err = error as {
    code?: string;
    message?: string;
    name?: string;
    response?: { status?: number };
  };

  if (err.name === 'TimeoutError' || err.name === 'AbortError') return true;
  if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') return true;
  if (err.message === 'Network Error' || err.message?.includes('timed out')) return true;

  const status = err.response?.status;
  return typeof status === 'number' && status >= 500 && status < 600;
}

// Specific retry configurations for common scenarios
export const retryConfigs = {
  // For API calls that might fail due to network issues
  networkRequest: {
    maxAttempts: 3,
    delay: 1000,
    backoff: 'exponential' as const,
    shouldRetry: (error: unknown) => isTransientRequestError(error),
  },

  // For file uploads that might fail
  fileUpload: {
    maxAttempts: 5,
    delay: 2000,
    backoff: 'exponential' as const,
    maxDelay: 10000,
    shouldRetry: (error: unknown) => isTransientRequestError(error),
  },

  // For critical read operations that must succeed
  critical: {
    maxAttempts: 3,
    delay: 500,
    backoff: 'exponential' as const,
    maxDelay: 5000,
    shouldRetry: (error: unknown) => isTransientRequestError(error),
  },

  // For quick operations that should fail fast
  quick: {
    maxAttempts: 2,
    delay: 500,
    backoff: 'linear' as const,
  },
};

// Hook for using retry in React components
function useRetry() {
  const retry = async <T>(
    fn: () => Promise<T>,
    options?: RetryOptions
  ): Promise<T> => {
    return withRetry(fn, options);
  };

  return { retry };
}