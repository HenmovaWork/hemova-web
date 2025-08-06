"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";
import { logCustomError } from "@/lib/error-logging";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    // Log 404 errors for monitoring
    logCustomError(`404 - Page not found: ${pathname}`, {
      level: "warning",
      component: "NotFound",
      action: "404_page_accessed",
      additionalContext: {
        requestedPath: pathname,
        referrer: typeof window !== "undefined" ? document.referrer : "unknown",
      },
    });
  }, [pathname]);

  // Suggest similar pages based on the requested path
  const getSuggestedPages = (path: string) => {
    const suggestions = [];

    if (path.includes("game")) {
      suggestions.push({ href: "/games", label: "Browse Games" });
    }
    if (
      path.includes("blog") ||
      path.includes("news") ||
      path.includes("article")
    ) {
      suggestions.push({ href: "/news", label: "Latest News" });
    }
    if (path.includes("job") || path.includes("career")) {
      suggestions.push({ href: "/jobs", label: "Job Openings" });
    }
    if (path.includes("service") || path.includes("contact")) {
      suggestions.push({ href: "/services", label: "Our Services" });
    }

    // Default suggestions if no specific matches
    if (suggestions.length === 0) {
      suggestions.push(
        { href: "/games", label: "Browse Games" },
        { href: "/news", label: "Latest News" },
      );
    }

    return suggestions;
  };

  const suggestedPages = getSuggestedPages(pathname);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
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
            <FileQuestion className="h-16 w-16 text-gray-400" />
          </div>
          <CardTitle className="text-6xl font-bold text-gray-800 mb-2">
            404
          </CardTitle>
          <h1 className="text-2xl font-semibold text-gray-700 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-2">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <p className="text-sm text-gray-500">
            Requested path:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              {pathname}
            </code>
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Suggested Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-center gap-2"
              >
                <Home className="h-5 w-5" />
                <span className="text-sm">Go Home</span>
              </Button>
            </Link>

            <Link href="/games" className="block">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-center gap-2"
              >
                <Search className="h-5 w-5" />
                <span className="text-sm">Browse Games</span>
              </Button>
            </Link>

            <button onClick={() => window.history.back()} className="w-full">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">Go Back</span>
              </Button>
            </button>
          </div>

          {/* Dynamic Suggestions */}
          {suggestedPages.length > 0 && (
            <div className="pt-6 border-t">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Were you looking for one of these?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPages.map((page, index) => (
                  <Link
                    key={index}
                    href={page.href}
                    className="text-blue-600 hover:text-blue-800 hover:underline p-2 rounded hover:bg-blue-50 transition-colors"
                  >
                    {page.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Popular Links */}
          <div className="pt-6 border-t">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Popular Pages
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/games"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Games
              </Link>
              <Link
                href="/news"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                News & Blog
              </Link>
              <Link
                href="/jobs"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Careers
              </Link>
              <Link
                href="/services"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Services
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-4 text-sm text-gray-600">
            <p>
              Still can&apos;t find what you&apos;re looking for?{" "}
              <Link
                href="/services"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                Contact us
              </Link>{" "}
              for help.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
