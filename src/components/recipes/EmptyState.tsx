import React from "react";
import { Button } from "../ui/button";

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold mb-4">
        Nie masz jeszcze żadnych przepisów
      </h2>
      <p className="text-muted-foreground mb-8">
        Dodaj swój pierwszy przepis lub wygeneruj go z pomocą AI
      </p>
      <div className="space-x-4">
        <Button asChild>
          <a href="/recipes/new">Dodaj przepis</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/generate">Generuj z AI</a>
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
