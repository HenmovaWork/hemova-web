import { ContentService } from "@/lib/content";
import { Legal } from "@/lib/types";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import LegalDetail from "./components/legal-detail";

export async function generateStaticParams() {
  const result = await ContentService.legal.getAll();
  return result.items.map((legal) => ({ slug: legal.slug }));
}

interface LegalPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: LegalPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const legal = await ContentService.legal.getBySlug(slug);

    return {
      title: `${legal.title} - Henmova`,
      description: legal.excerpt,
      openGraph: {
        title: legal.title,
        description: legal.excerpt,
      },
    };
  } catch (error) {
    return {
      title: "Legal - Henmova",
      description: "Legal information",
    };
  }
}

export default async function LegalPage({ params }: LegalPageProps) {
  try {
    const { slug } = await params;
    const legal = await ContentService.legal.getBySlug(slug);

    return <LegalDetail legal={legal} />;
  } catch (error) {
    notFound();
  }
}
