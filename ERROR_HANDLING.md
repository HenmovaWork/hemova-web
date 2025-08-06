# Error Handling System

This document describes the comprehensive error handling and monitoring system implemented in the Henmova site.

## Overview

The error handling system provides:

- Custom 404 pages with intelligent navigation suggestions
- Global and route-level error boundaries
- Comprehensive error logging and monitoring
- Development tools for testing error scenarios
- Production-ready error reporting

## Components

### 1. Error Pages

#### 404 Not Found (`app/not-found.tsx`)

- Custom 404 page with Henmova branding
- Dynamic navigation suggestions based on requested path
- Popular pages section for easy navigation
- Automatic error logging for monitoring 404 patterns

#### Global Error (`app/global-error.tsx`)

- Handles application-wide errors that crash the entire app
- Provides recovery options (retry, go home)
- Logs errors with full context
- Shows error details in development mode

#### Route Error (`app/error.tsx`)

- Handles errors within specific routes/pages
- Provides recovery options and navigation alternatives
- Maintains app shell (navbar, footer) while showing error state
- Logs errors with route context

### 2. Error Boundaries

#### ErrorBoundary Component (`components/ui/error-boundary.tsx`)

- Reusable React error boundary for component-level error handling
- Customizable fallback UI
- Automatic error logging
- Reset functionality to recover from errors
- Development mode error details

Usage:

```tsx
import ErrorBoundary from "@/components/ui/error-boundary";

<ErrorBoundary onError={(error, errorInfo) => console.log("Custom handler")}>
  <YourComponent />
</ErrorBoundary>;
```

### 3. Error Logging System (`lib/error-logging.ts`)

#### Features

- Centralized error logging with multiple levels
- Local storage for debugging
- Production-ready external service integration
- Automatic context collection (URL, user agent, timestamp)
- Error statistics and analytics

#### Usage Examples

```tsx
import {
  logError,
  logCustomError,
  logBoundaryError,
} from "@/lib/error-logging";

// Log a caught error
try {
  riskyOperation();
} catch (error) {
  logError(error, {
    component: "MyComponent",
    additionalContext: { action: "user_action" },
  });
}

// Log a custom error/warning
logCustomError("User attempted invalid action", {
  level: "warning",
  component: "UserForm",
  action: "validation_failed",
});

// Log from error boundary (automatic in ErrorBoundary component)
logBoundaryError(error, errorInfo, {
  component: "MyErrorBoundary",
});
```

#### Error Data Structure

```typescript
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
```

### 4. Error API Endpoint (`app/api/errors/route.ts`)

#### Features

- Receives client-side error reports
- Enriches errors with server-side context
- Integrates with external monitoring services
- Validates and processes error data

#### Configuration

Set environment variables for external service integration:

```env
# Optional: Custom error logging endpoint
NEXT_PUBLIC_ERROR_LOGGING_ENDPOINT=/api/errors

# Optional: External monitoring service webhook
ERROR_WEBHOOK_URL=https://your-monitoring-service.com/webhook
ERROR_WEBHOOK_TOKEN=your-webhook-token

# Optional: Build ID for error tracking
NEXT_PUBLIC_BUILD_ID=your-build-id
```

### 5. Development Tools

#### Error Test Component (`components/ui/error-test.tsx`)

- Only visible in development mode
- Provides buttons to test different error scenarios:
  - Error boundary errors
  - Custom error logging
  - Async error handling
- Floating widget in bottom-right corner

## Integration with External Services

The system is designed to integrate with popular error monitoring services:

### Sentry Integration

```typescript
// In lib/error-logging.ts sendToMonitoringService method
if (process.env.SENTRY_DSN) {
  Sentry.captureException(new Error(errorData.message), {
    extra: errorData,
  });
}
```

### LogRocket Integration

```typescript
if (process.env.LOGROCKET_APP_ID) {
  LogRocket.captureException(new Error(errorData.message));
}
```

### Custom Webhook

```typescript
if (process.env.ERROR_WEBHOOK_URL) {
  await fetch(process.env.ERROR_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ERROR_WEBHOOK_TOKEN}`,
    },
    body: JSON.stringify(errorData),
  });
}
```

## Error Statistics and Debugging

### Local Error Storage

Errors are stored locally in `localStorage` for debugging:

- Last 50 errors are kept
- Accessible via browser developer tools
- Can be cleared programmatically

### Error Statistics

```typescript
import { errorLogger } from "@/lib/error-logging";

const stats = errorLogger.getErrorStats();
console.log(stats.totalErrors);
console.log(stats.errorsByComponent);
console.log(stats.recentErrors);
```

## Best Practices

### 1. Component Error Handling

Wrap potentially error-prone components with ErrorBoundary:

```tsx
<ErrorBoundary>
  <DataFetchingComponent />
</ErrorBoundary>
```

### 2. Async Error Handling

Always handle async errors properly:

```tsx
const handleAsyncAction = async () => {
  try {
    await riskyAsyncOperation();
  } catch (error) {
    logError(error, {
      component: "MyComponent",
      additionalContext: { action: "async_operation" },
    });
    // Show user-friendly error message
  }
};
```

### 3. Form Error Handling

Handle form submission errors gracefully:

```tsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
  } catch (error) {
    logError(error, {
      component: "ContactForm",
      additionalContext: { formData: data },
    });
    setError("Failed to submit form. Please try again.");
  }
};
```

### 4. API Error Handling

Handle API errors with proper context:

```tsx
const fetchData = async () => {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    logError(error, {
      component: "DataProvider",
      additionalContext: {
        endpoint: "/api/data",
        status: response?.status,
      },
    });
    throw error; // Re-throw for component handling
  }
};
```

## Monitoring and Alerts

### Production Monitoring

1. Set up external monitoring service (Sentry, LogRocket, etc.)
2. Configure webhook endpoints for real-time alerts
3. Monitor error patterns and frequencies
4. Set up alerts for critical errors

### Key Metrics to Monitor

- Error frequency by component
- 404 error patterns
- User agent and browser-specific errors
- Error recovery success rates
- Time to error resolution

## Testing

### Manual Testing

Use the ErrorTest component in development to verify:

- Error boundaries work correctly
- Error logging functions properly
- Recovery mechanisms function as expected

### Automated Testing

Consider adding tests for:

- Error boundary behavior
- Error logging functionality
- API error handling
- 404 page functionality

## Troubleshooting

### Common Issues

1. **Errors not being logged**
   - Check network connectivity
   - Verify API endpoint is accessible
   - Check browser console for logging errors

2. **Error boundaries not catching errors**
   - Ensure errors occur during render phase
   - Check that ErrorBoundary is properly wrapped around components
   - Verify error boundary is not itself throwing errors

3. **404 page not showing**
   - Check Next.js routing configuration
   - Verify not-found.tsx is in correct location
   - Check for conflicting catch-all routes

### Debug Mode

Enable additional logging in development:

```typescript
// In lib/error-logging.ts
const DEBUG_MODE = process.env.NODE_ENV === "development";
if (DEBUG_MODE) {
  console.log("Error logging debug info:", errorData);
}
```

## Future Enhancements

Potential improvements to consider:

- User session recording integration
- Performance error tracking
- Error trend analysis
- Automated error categorization
- User feedback collection on errors
- Error recovery suggestions based on error type
