import { ContentService } from "@/lib/content";
import { Blog } from "@/lib/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogDetail from "./components/blog-detail";

export async function generateStaticParams() {
  const result = await ContentService.blogs.getAll();
  return result.items.map((blog) => ({ slug: blog.slug }));
}

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const blog = await ContentService.blogs.getBySlug(slug);

    return {
      title: `${blog.title} - Henmova News`,
      description: blog.excerpt,
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        images: [
          {
            url: blog.coverImage.src,
            width: blog.coverImage.width,
            height: blog.coverImage.height,
            alt: blog.title,
          },
        ],
        type: "article",
        publishedTime: blog.publishedAt,
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt,
        images: [blog.coverImage.src],
      },
    };
  } catch (error) {
    return {
      title: "Blog Post Not Found - Henmova",
      description: "The requested blog post could not be found.",
    };
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  let blog: Blog;

  try {
    const { slug } = await params;
    blog = await ContentService.blogs.getBySlug(slug);
  } catch (error) {
    const { slug } = await params;
    console.error(`Failed to fetch blog with slug "${slug}":`, error);
    notFound();
  }

  return <BlogDetail blog={blog} />;
}
