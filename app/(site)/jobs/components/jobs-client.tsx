"use client";

import React, { useState } from "react";
import JobCard from "./job-card";
import JobFilters from "./job-filters";
import { Job } from "@/lib/types";

export default function JobsClient({ jobs }: { jobs: Job[] }) {
  const [type, setType] = useState<string>("all");
  const filteredJobs =
    type === "all" ? jobs : jobs.filter((job) => job.jobType === type);

  return (
    <div className="w-full -mt-px space-y-6 mb-6">
      <div className="bg-linear-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-4">
            Explore Our Career Opportunities Today!
          </h1>
          <p className="text-xl opacity-90">
            Discover diverse job openings tailored to your skills. Take the
            first step towards a fulfilling career with us. Join our team and
            unlock your potential. Explore our listings and find your perfect
            fit! Your dream job awaits. Start your journey with us now.
          </p>
        </div>
      </div>
      <div className="w-[94%] sm:container mx-auto space-y-6">
        <JobFilters currentType={type} onTypeChange={setType} />
        <div className="flex justify-between items-center">
          <div className="text-xl text-muted-foreground">
            Available Jobs ({filteredJobs.length})
          </div>
        </div>
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              {type && type !== "all"
                ? `No ${type.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()} positions available at the moment.`
                : "No job openings available at the moment."}
            </p>
            <p className="text-sm text-muted-foreground">
              Check back later for new opportunities!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.slug} {...job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
