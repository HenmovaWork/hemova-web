"use client";

import { Button } from "@/components/ui/button";

const jobTypes = [
  { value: "all", label: "All Jobs" },
  { value: "fulltime", label: "Full Time" },
  { value: "parttime", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

interface JobFiltersProps {
  currentType?: string;
  onTypeChange?: (type: string) => void;
}

export default function JobFilters({
  currentType = "all",
  onTypeChange,
}: JobFiltersProps) {
  const handleFilterChange = (type: string) => {
    if (onTypeChange) {
      onTypeChange(type);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
      <div className="text-sm font-medium text-muted-foreground mb-2 w-full">
        Filter by job type:
      </div>
      <div className="flex flex-wrap gap-2">
        {jobTypes.map((jobType) => (
          <Button
            key={jobType.value}
            variant={currentType === jobType.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange(jobType.value)}
            className="text-sm"
          >
            {jobType.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
