import { Legal } from "@/lib/types";
import { MarkdocRenderer } from "@/components/markdoc-renderer";

interface LegalDetailProps {
  legal: Legal;
}

export default function LegalDetail({ legal }: LegalDetailProps) {
  return (
    <div className="w-full">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{legal.title}</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date(legal.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {legal.content && <MarkdocRenderer content={legal.content} />}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            If you have any questions about this document, please contact us at{" "}
            <a
              href="mailto:henmovaofficial@gmail.com"
              className="text-primary hover:underline"
            >
              henmovaofficial@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
