"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Import error logging dynamically to avoid SSR issues
    import("@/lib/error-logging").then(({ logError }) => {
      logError(error, {
        component: "GlobalError",
        additionalContext: {
          digest: error.digest,
          type: "global_error",
        },
      });
    });
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-6">
                <OptimizedImage
                  src="/logos/logo-2.svg"
                  alt="Henmova Logo"
                  width={120}
                  height={120}
                  priority
                  className="mx-auto"
                />
              </div>
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                Something went wrong!
              </CardTitle>
              <p className="text-gray-600">
                We apologize for the inconvenience. An unexpected error has
                occurred. Our team has been notified and is working to fix this
                issue.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={reset}
                  className="w-full h-auto py-4 flex flex-col items-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span className="text-sm">Try Again</span>
                </Button>

                <Link href="/" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2"
                  >
                    <Home className="h-5 w-5" />
                    <span className="text-sm">Go Home</span>
                  </Button>
                </Link>
              </div>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === "development" && (
                <div className="pt-6 border-t text-left">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Error Details (Development Only)
                  </h3>
                  <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono text-gray-800 overflow-auto max-h-40">
                    <p>
                      <strong>Message:</strong> {error.message}
                    </p>
                    {error.digest && (
                      <p>
                        <strong>Digest:</strong> {error.digest}
                      </p>
                    )}
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-semibold">
                          Stack Trace
                        </summary>
                        <pre className="mt-2 whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="pt-4 text-sm text-gray-600">
                <p>
                  If this problem persists, please{" "}
                  <Link
                    href="/services"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    contact our support team
                  </Link>{" "}
                  for assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
