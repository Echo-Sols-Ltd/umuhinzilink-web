export class TimeoutError extends Error {
  constructor(message: string, public timeout: number) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage?: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(
        timeoutMessage || `Operation timed out after ${timeoutMs}ms`,
        timeoutMs
      ));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}

export function createTimeoutPromise(timeoutMs: number, message?: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(
        message || `Timeout after ${timeoutMs}ms`,
        timeoutMs
      ));
    }, timeoutMs);
  });
}

// Common timeout configurations
export const timeoutConfigs = {
  // Quick operations (form submissions, simple API calls)
  quick: 5000, // 5 seconds

  // Standard operations (data fetching, search)
  standard: 10000, // 10 seconds

  // Long operations (file uploads, complex processing)
  long: 30000, // 30 seconds

  // Critical operations (authentication, payment)
  critical: 15000, // 15 seconds
};

// Utility for creating abortable operations
export class AbortableOperation {
  private abortController: AbortController;
  private timeoutId?: NodeJS.Timeout;

  constructor(private timeoutMs?: number) {
    this.abortController = new AbortController();
  }

  get signal(): AbortSignal {
    return this.abortController.signal;
  }

  abort(reason?: string): void {
    this.abortController.abort(reason);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  async execute<T>(operation: (signal: AbortSignal) => Promise<T>): Promise<T> {
    if (this.timeoutMs) {
      this.timeoutId = setTimeout(() => {
        this.abort(`Operation timed out after ${this.timeoutMs}ms`);
      }, this.timeoutMs);
    }

    try {
      const result = await operation(this.signal);
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      return result;
    } catch (error) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      if (this.signal.aborted) {
        throw new TimeoutError(
          this.signal.reason || `Operation was aborted`,
          this.timeoutMs || 0
        );
      }
      
      throw error;
    }
  }
}

// Hook for using timeout in React components
export function useTimeout() {
  const withTimeoutHook = <T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage?: string
  ): Promise<T> => {
    return withTimeout(promise, timeoutMs, timeoutMessage);
  };

  const createAbortableOperation = (timeoutMs?: number) => {
    return new AbortableOperation(timeoutMs);
  };

  return {
    withTimeout: withTimeoutHook,
    createAbortableOperation,
    TimeoutError,
  };
}