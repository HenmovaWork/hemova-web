"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Import error logging dynamically to avoid SSR issues
    import("@/lib/error-logging").then(({ logBoundaryError }) => {
      logBoundaryError(error, errorInfo, {
        component: "ErrorBoundary",
      });
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card className="w-full max-w-lg mx-auto my-8">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Something went wrong
            </CardTitle>
            <p className="text-gray-600 text-sm">
              This component encountered an unexpected error.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={this.handleReset}
              className="w-full flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            {/* Error Details (only in development or when showDetails is true) */}
            {(process.env.NODE_ENV === "development" ||
              this.props.showDetails) &&
              this.state.error && (
                <div className="pt-4 border-t text-left">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Error Details
                  </h4>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-auto max-h-32">
                    <p>
                      <strong>Message:</strong> {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-semibold">
                          Stack Trace
                        </summary>
                        <pre className="mt-1 whitespace-pre-wrap text-xs">
                          {this.state.error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
