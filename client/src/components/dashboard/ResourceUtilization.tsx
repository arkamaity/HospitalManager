import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { HospitalResource } from "@shared/schema";

const getProgressColor = (percentage: number) => {
  if (percentage <= 40) return "bg-success";
  if (percentage <= 70) return "bg-warning";
  return "bg-error";
};

const ResourceUtilization = () => {
  const { data: resources, isLoading, error } = useQuery<HospitalResource[]>({
    queryKey: ['/api/resources'],
  });

  return (
    <Card>
      <CardHeader className="px-4 py-3 border-b border-neutral-200">
        <CardTitle className="font-heading font-bold text-neutral-800">Hospital Resources</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[50px]" />
                </div>
                <Skeleton className="h-2.5 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">
            Failed to load resource information
          </div>
        ) : resources && resources.length > 0 ? (
          <div>
            {resources.map((resource) => {
              const percentage = Math.round((resource.usedCount / resource.totalCount) * 100);
              return (
                <div key={resource.id} className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-700">
                      {resource.resourceName.charAt(0).toUpperCase() + resource.resourceName.slice(1)} ({resource.usedCount}/{resource.totalCount})
                    </span>
                    <span className="text-sm font-medium text-neutral-700">{percentage}%</span>
                  </div>
                  <Progress
                    value={percentage}
                    className={`w-full h-2.5 bg-neutral-200 rounded-full`}
                    indicatorClassName={getProgressColor(percentage)}
                  />
                </div>
              );
            })}
            <div className="text-center mt-6">
              <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm font-medium transition duration-150">
                View Detailed Report
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-neutral-500">
            No resource data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceUtilization;
