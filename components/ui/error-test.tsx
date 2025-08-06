"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bug } from "lucide-react";
import ErrorBoundary from "./error-boundary";
import { logCustomError } from "@/lib/error-logging";

// Component that throws an error when triggered
function ErrorTrigger({ shouldError }: { shouldError: boolean }) {
  if (shouldError) {
    throw new Error("Test error triggered by user");
  }
  return <div>No error - component is working normally</div>;
}

// Component for testing error handling (only shown in development)
export default function ErrorTest() {
  const [triggerError, setTriggerError] = useState(false);
  const [showTest, setShowTest] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const handleCustomError = () => {
    logCustomError("Custom error test triggered", {
      level: "error",
      component: "ErrorTest",
      action: "custom_error_test",
      additionalContext: {
        timestamp: new Date().toISOString(),
        testType: "manual_trigger",
      },
    });
  };

  const handleAsyncError = async () => {
    try {
      // Simulate an async operation that fails
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Async operation failed")), 100);
      });
    } catch (error) {
      const { logError } = await import("@/lib/error-logging");
      logError(error as Error, {
        component: "ErrorTest",
        additionalContext: {
          testType: "async_error",
        },
      });
    }
  };

  if (!showTest) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowTest(true)}
          variant="outline"
          size="sm"
          className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
        >
          <Bug className="h-4 w-4 mr-2" />
          Error Test
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            Error Testing (Dev Only)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-yellow-700 mb-3">
            Test error handling and logging functionality
          </div>

          {/* Error Boundary Test */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-yellow-800">
              Error Boundary Test:
            </div>
            <ErrorBoundary>
              <ErrorTrigger shouldError={triggerError} />
            </ErrorBoundary>
            <Button
              onClick={() => setTriggerError(!triggerError)}
              size="sm"
              variant="outline"
              className="w-full text-xs"
            >
              {triggerError ? "Reset Component" : "Trigger Error"}
            </Button>
          </div>

          {/* Custom Error Test */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-yellow-800">
              Custom Error Test:
            </div>
            <Button
              onClick={handleCustomError}
              size="sm"
              variant="outline"
              className="w-full text-xs"
            >
              Log Custom Error
            </Button>
          </div>

          {/* Async Error Test */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-yellow-800">
              Async Error Test:
            </div>
            <Button
              onClick={handleAsyncError}
              size="sm"
              variant="outline"
              className="w-full text-xs"
            >
              Trigger Async Error
            </Button>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => setShowTest(false)}
            size="sm"
            variant="ghost"
            className="w-full text-xs mt-3"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
