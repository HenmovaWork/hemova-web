import { ContentService } from "@/lib/content";
import { Blog } from "@/lib/types";
import NewsList from "./components/news-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Blog - Henmova",
  description:
    "Stay updated with the latest news, insights, and updates from Henmova.",
};

export default async function NewsPage() {
  let blogs: Blog[] = [];

  try {
    const result = await ContentService.blogs.getAll();
    blogs = result.items;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    blogs = [];
  }

  return (
    <div className="container mx-auto p-4 md:px-8">
      <div className="text-2xl font-semibold pb-4">News & Blog</div>
      <NewsList blogs={blogs} />
    </div>
  );
}
