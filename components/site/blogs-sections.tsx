import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogService } from "@/lib/content";
import { Blog } from "@/lib/types";

export default async function BlogsSection() {
  let blogs: Blog[] = [];

  try {
    blogs = await BlogService.getRecent(3);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    blogs = [];
  }

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <div className="bg-black/5 border-t-2 border-t-black/5 w-full py-8">
      <div className="container mx-auto p-4 md:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 mx-auto gap-4">
          {blogs.map((blog) => (
            <Card key={blog.slug}>
              <CardHeader className="p-1">
                <CardTitle>
                  {blog.coverImage && blog.coverImage.src && (
                    <Image
                      src={blog.coverImage.src}
                      alt={blog.coverImage.alt}
                      width={blog.coverImage.width || 400}
                      height={blog.coverImage.height || 300}
                      className="rounded-md w-full h-full object-cover aspect-video"
                    />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-3 pt-2">
                <div className="text-xl font-medium">{blog.title}</div>
                {blog.excerpt && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {blog.excerpt}
                  </p>
                )}
              </CardContent>
              <CardFooter className="p-2 flex justify-between items-center border-t-black/10 border-t-2">
                <div className="text-sm text-black/40 flex items-center gap-2">
                  <Calendar size={18} />
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <Button variant="link">
                  <Link href={`/news/${blog.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
