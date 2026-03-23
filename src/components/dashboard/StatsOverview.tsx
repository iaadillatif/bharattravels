import { Progress } from "@/components/ui/progress";
import { StateVisitData } from "@/types/travel";

interface StatsOverviewProps {
  states: StateVisitData[];
}

export function StatsOverview({ states }: StatsOverviewProps) {
  const visitedCount = states.filter((s) => s.visited).length;
  const totalCount = states.length;
  const percentage = Math.round((visitedCount / totalCount) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-md border flex flex-col justify-between">
        <div>
          <h3 className="text-muted-foreground text-sm font-medium mb-1">
            States Visited
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-headline font-bold text-primary">
              {visitedCount}
            </span>
            <span className="text-muted-foreground font-medium">
              / {totalCount}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium mb-2">
            <span className="text-muted-foreground">Travel Progress</span>
            <span className="text-primary">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border flex flex-col">
        <h3 className="text-muted-foreground text-sm font-medium mb-4">
          Quick Insights
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Latest Visit</span>
            <span className="text-sm font-semibold">Chhattisgarh</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Favorite State
            </span>
            <span className="text-sm font-semibold">Bihar</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Cities Explored
            </span>
            <span className="text-sm font-semibold">200+</span>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white p-6 rounded-2xl shadow-md border flex flex-col justify-center">
        <p className="text-lg font-headline font-medium leading-tight">
          "The world is a book and those who do not travel read only one page."
        </p>
        <span className="text-primary-foreground/70 text-sm mt-4">
          — St. Augustine
        </span>
      </div>
    </div>
  );
}
