import { JobService } from "@/lib/content";
import { Job } from "@/lib/types";
import JobsClient from "./components/jobs-client";

export default async function JobsPage() {
  let jobs: Job[] = [];
  try {
    const result = await JobService.getAll();
    jobs = result.items;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  }
  return <JobsClient jobs={jobs} />;
}
