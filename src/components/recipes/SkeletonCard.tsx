import React from "react";
import { Card, CardHeader } from "../ui/card";

const SkeletonCard: React.FC = () => {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/3 bg-muted animate-pulse rounded mt-2" />
      </CardHeader>
    </Card>
  );
};

export default SkeletonCard;
