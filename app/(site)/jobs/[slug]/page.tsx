import { JobService } from "@/lib/content";
import { Job } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, Briefcase } from "lucide-react";
import { notFound } from "next/navigation";
import { formatJobType, formatTimeAgo } from "../components/job-card";
import ApplyForm from "./components/apply-form";
import { MarkdocRenderer } from "@/components/markdoc-renderer";

export async function generateStaticParams() {
  const result = await JobService.getAll();
  return result.items.map((job) => ({ slug: job.slug }));
}

interface JobDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  let job: Job;

  try {
    job = await JobService.getBySlug(slug);
  } catch (error) {
    console.error("Failed to fetch job:", error);
    notFound();
  }

  if (!job || !job.isActive) {
    notFound();
  }

  const posted = formatTimeAgo(job.postedAt);

  return (
    <div className="w-full -mt-px space-y-6 mb-6">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-4">
                  {job.title}
                </CardTitle>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{job.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    <span>{formatJobType(job.jobType)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>Posted {posted}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <p className="text-lg text-muted-foreground mb-6">
                {job.description}
              </p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {job.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.content && (
              <>
                <hr className="my-8" />
                <article className="w-full">
                  <h3 className="text-2xl font-bold mb-6">About the Job</h3>
                  <div className="prose prose-lg max-w-none">
                    <MarkdocRenderer content={job.content} />
                  </div>
                </article>
              </>
            )}

            <hr className="my-8" />
            <div className="text-2xl font-bold mb-6">Apply Now</div>
            <ApplyForm jobSlug={job.slug} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
