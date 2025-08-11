import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormSkeletonProps {
  title: string;
  children: React.ReactNode;
}

export function AuthFormSkeleton({ title, children }: AuthFormSkeletonProps) {
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
