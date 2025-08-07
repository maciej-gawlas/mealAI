import { Card, CardContent } from "@/components/ui/card";

export function RecipeFormSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          <div className="h-24 w-full bg-muted rounded animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-5 w-28 bg-muted rounded animate-pulse" />
          <div className="h-32 w-full bg-muted rounded animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
