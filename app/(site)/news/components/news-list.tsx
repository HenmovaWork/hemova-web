"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Blog } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface NewsListProps {
  blogs: Blog[];
}

const POSTS_PER_PAGE = 6;

export default function NewsList({ blogs }: NewsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter blogs based on search term
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        searchTerm === "" ||
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [blogs, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No blog posts available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {currentBlogs.length} of {filteredBlogs.length} posts
        {searchTerm && ` (filtered from ${blogs.length} total)`}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentBlogs.map((blog) => (
          <Link key={blog.slug} href={`/news/${blog.slug}`}>
            <Card className="overflow-hidden group cursor-pointer h-full transition-all duration-300 hover:shadow-lg">
              {/* Cover Image */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  draggable={false}
                  className="transition-all ease-in-out duration-300 group-hover:scale-105 object-cover"
                  src={
                    typeof blog.coverImage === "string"
                      ? blog.coverImage
                      : blog.coverImage.src
                  }
                  height={300}
                  width={400}
                  alt={
                    typeof blog.coverImage === "string"
                      ? blog.title
                      : blog.coverImage.alt || blog.title
                  }
                  quality={85}
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="mt-4">
                  <Badge variant="outline" className="text-xs">
                    Read More
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* No results message */}
      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No blog posts match your search criteria.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
