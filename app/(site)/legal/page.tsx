import { ContentService } from "@/lib/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal - Henmova",
  description: "Legal documents and policies for Henmova",
};

export default async function LegalPage() {
  const result = await ContentService.legal.getAll();
  const legalDocs = result.items;

  return (
    <div className="w-full -mt-px space-y-6 mb-6 bg-secondary">
      <div className="py-8 md:px-8 space-y-2 bg-primary text-white">
        <div className="w-[94%] sm:container mx-auto">
          <h1 className="sm:text-4xl text-3xl text-center font-extrabold">
            LEGAL INFORMATION
          </h1>
          <p className="text-center text-lg opacity-90 mt-4">
            Important legal documents and policies
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {legalDocs.map((doc) => (
            <Link key={doc.slug} href={`/legal/${doc.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {doc.title
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{doc.excerpt}</p>
                  <p className="text-sm text-muted-foreground">
                    Last updated:{" "}
                    {new Date(doc.lastUpdated).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
