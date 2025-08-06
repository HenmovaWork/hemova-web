import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, MapPin, Briefcase } from "lucide-react";

export const getJobTypeColor = (jobType: string) => {
  switch (jobType) {
    case "fulltime":
      return "bg-green-500";
    case "parttime":
      return "bg-blue-500";
    case "contract":
      return "bg-yellow-500";
    case "internship":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export const formatJobType = (jobType: string) => {
  switch (jobType) {
    case "fulltime":
      return "Full Time";
    case "parttime":
      return "Part Time";
    case "contract":
      return "Contract";
    case "internship":
      return "Internship";
    default:
      return jobType;
  }
};

export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export default function JobCard({
  title,
  description,
  slug,
  jobType,
  location,
  postedAt,
}: Job) {
  const posted = formatTimeAgo(postedAt);

  return (
    <Card className="p-0 hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-0">
        <div className="w-full justify-between items-start flex">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{location || "Remote"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase size={16} />
                <span>{formatJobType(jobType)}</span>
              </div>
            </div>
          </div>
          <div
            className={`text-white px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(
              jobType,
            )}`}
          >
            {formatJobType(jobType)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 line-clamp-3 text-muted-foreground">
          {description}
        </div>
        <div className="flex gap-2 items-end justify-between">
          <Button
            asChild
            variant={"default"}
            className="rounded-full px-5 py-[.5rem] font-bold"
          >
            <Link href={`/jobs/${slug}`}>Apply Now</Link>
          </Button>
          <div className="text-muted-foreground flex gap-2 items-center text-sm">
            <Clock size={16} /> {posted}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
