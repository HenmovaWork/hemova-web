interface ErrorLogData {
  message: string;
  stack?: string;
  digest?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  buildId?: string;
  component?: string;
  props?: Record<string, any>;
  additionalContext?: Record<string, any>;
}

interface ErrorInfo {
  componentStack?: string | null;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private isProduction = process.env.NODE_ENV === "production";
  private apiEndpoint =
    process.env.NEXT_PUBLIC_ERROR_LOGGING_ENDPOINT || "/api/errors";

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Log a client-side error
   */
  async logError(
    error: Error,
    context?: {
      component?: string;
      props?: Record<string, any>;
      additionalContext?: Record<string, any>;
    },
  ): Promise<void> {
    const errorData: ErrorLogData = {
      message: error.message,
      stack: error.stack,
      digest: (error as any).digest,
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
      buildId: process.env.NEXT_PUBLIC_BUILD_ID,
      component: context?.component,
      props: context?.props,
      additionalContext: context?.additionalContext,
    };

    // Always log to console
    console.error("Error logged:", errorData);

    // In production, send to external service
    if (this.isProduction && this.apiEndpoint) {
      try {
        await this.sendToExternalService(errorData);
      } catch (sendError) {
        console.error("Failed to send error to external service:", sendError);
      }
    }

    // Store locally for debugging
    this.storeLocalError(errorData);
  }

  /**
   * Log a React error boundary error
   */
  async logBoundaryError(
    error: Error,
    errorInfo: ErrorInfo,
    context?: {
      component?: string;
      props?: Record<string, any>;
    },
  ): Promise<void> {
    const errorData: ErrorLogData = {
      message: error.message,
      stack: error.stack,
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
      buildId: process.env.NEXT_PUBLIC_BUILD_ID,
      component: context?.component,
      props: context?.props,
      additionalContext: {
        componentStack: errorInfo.componentStack,
        errorBoundary: errorInfo.errorBoundary,
        errorBoundaryStack: errorInfo.errorBoundaryStack,
      },
    };

    console.error("Boundary error logged:", errorData);

    if (this.isProduction && this.apiEndpoint) {
      try {
        await this.sendToExternalService(errorData);
      } catch (sendError) {
        console.error(
          "Failed to send boundary error to external service:",
          sendError,
        );
      }
    }

    this.storeLocalError(errorData);
  }

  /**
   * Log a custom application error
   */
  async logCustomError(
    message: string,
    context?: {
      level?: "error" | "warning" | "info";
      component?: string;
      action?: string;
      additionalContext?: Record<string, any>;
    },
  ): Promise<void> {
    const errorData: ErrorLogData = {
      message,
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
      buildId: process.env.NEXT_PUBLIC_BUILD_ID,
      component: context?.component,
      additionalContext: {
        level: context?.level || "error",
        action: context?.action,
        ...context?.additionalContext,
      },
    };

    console.error("Custom error logged:", errorData);

    if (this.isProduction && this.apiEndpoint) {
      try {
        await this.sendToExternalService(errorData);
      } catch (sendError) {
        console.error(
          "Failed to send custom error to external service:",
          sendError,
        );
      }
    }

    this.storeLocalError(errorData);
  }

  /**
   * Send error to external monitoring service
   */
  private async sendToExternalService(errorData: ErrorLogData): Promise<void> {
    if (!this.apiEndpoint) return;

    const response = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(errorData),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to send error: ${response.status} ${response.statusText}`,
      );
    }
  }

  /**
   * Store error locally for debugging
   */
  private storeLocalError(errorData: ErrorLogData): void {
    if (typeof window === "undefined") return;

    try {
      const errors = this.getLocalErrors();
      errors.push(errorData);

      // Keep only the last 50 errors
      const recentErrors = errors.slice(-50);

      localStorage.setItem("henmova_error_logs", JSON.stringify(recentErrors));
    } catch (storageError) {
      console.warn("Failed to store error locally:", storageError);
    }
  }

  /**
   * Get locally stored errors
   */
  getLocalErrors(): ErrorLogData[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem("henmova_error_logs");
      return stored ? JSON.parse(stored) : [];
    } catch (parseError) {
      console.warn("Failed to parse local errors:", parseError);
      return [];
    }
  }

  /**
   * Clear locally stored errors
   */
  clearLocalErrors(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem("henmova_error_logs");
    } catch (clearError) {
      console.warn("Failed to clear local errors:", clearError);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByComponent: Record<string, number>;
    recentErrors: ErrorLogData[];
  } {
    const errors = this.getLocalErrors();
    const errorsByComponent: Record<string, number> = {};

    errors.forEach((error) => {
      if (error.component) {
        errorsByComponent[error.component] =
          (errorsByComponent[error.component] || 0) + 1;
      }
    });

    return {
      totalErrors: errors.length,
      errorsByComponent,
      recentErrors: errors.slice(-10), // Last 10 errors
    };
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

// Convenience functions
export const logError = (
  error: Error,
  context?: Parameters<typeof errorLogger.logError>[1],
) => errorLogger.logError(error, context);

export const logBoundaryError = (
  error: Error,
  errorInfo: ErrorInfo,
  context?: Parameters<typeof errorLogger.logBoundaryError>[2],
) => errorLogger.logBoundaryError(error, errorInfo, context);

export const logCustomError = (
  message: string,
  context?: Parameters<typeof errorLogger.logCustomError>[1],
) => errorLogger.logCustomError(message, context);

// Global error handler for unhandled errors
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    errorLogger.logError(event.error, {
      additionalContext: {
        type: "unhandled_error",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));
    errorLogger.logError(error, {
      additionalContext: {
        type: "unhandled_promise_rejection",
      },
    });
  });
}
