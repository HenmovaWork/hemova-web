"use client";

import { Blog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MarkdocRenderer from "@/components/markdoc-renderer";
import Title from "@/components/site/title";
import { toast } from "sonner";

interface BlogDetailProps {
  blog: Blog;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: blog.title,
      text: blog.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.info("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.info("Link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Error copying to clipboard:", clipboardError);
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto p-4 md:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/news">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          {/* Title */}
          <Title className="font-bold mt-4 mb-4">{blog.title}</Title>

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(blog.publishedAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="mb-8">
            <Image
              src={blog.coverImage.src}
              alt={blog.coverImage.alt || blog.title}
              width={blog.coverImage.width || 800}
              height={blog.coverImage.height || 450}
              className="w-full h-auto object-cover aspect-video rounded-lg"
              priority
              quality={90}
            />
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="mb-8">
              <div className="text-xl text-gray-700 font-medium leading-relaxed p-6 bg-gray-50 rounded-lg border-l-4 border-primary">
                {blog.excerpt}
              </div>
            </div>
          )}

          {/* Article Content */}
          {blog.content && (
            <div className="mb-8">
              <div className="prose prose-lg prose-gray max-w-none">
                <MarkdocRenderer content={blog.content} />
              </div>
            </div>
          )}

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Published on {formatDate(blog.publishedAt)}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/news">
                  <Button variant="outline" size="sm">
                    More Articles
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
