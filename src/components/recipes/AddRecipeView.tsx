import { Suspense, useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster } from "sonner";
import type { AIRecipeDTO } from "@/types";

import { ErrorBoundary } from "./ErrorBoundary";
import { RecipeFormSkeleton } from "./RecipeFormSkeleton";
import ManualRecipeForm from "./ManualRecipeForm";
import AiRecipeGenerator from "./AiRecipeGenerator";
import { Button } from "@/components/ui/button";

export default function AddRecipeView() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");
  const [generatedRecipe, setGeneratedRecipe] = useState<AIRecipeDTO | null>(
    null,
  );
  const [generatedPreferences, setGeneratedPreferences] = useState<string[]>(
    [],
  );

  const handleRecipeGenerated = (
    recipe: AIRecipeDTO,
    preferences: string[],
  ) => {
    setGeneratedRecipe(recipe);
    setGeneratedPreferences(preferences);
    startTransition(() => {
      setActiveTab("manual");
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = "/recipes")}
          className="flex items-center gap-2"
        >
          <span>&larr;</span> Powrót do listy
        </Button>
      </div>
      <ErrorBoundary>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "manual" | "ai")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Wprowadź ręcznie</TabsTrigger>
            <TabsTrigger value="ai">Generuj</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <Suspense fallback={<RecipeFormSkeleton />}>
              <ManualRecipeForm
                initialData={
                  generatedRecipe
                    ? {
                        name: generatedRecipe.name,
                        ingredients: generatedRecipe.ingredients,
                        instructions: generatedRecipe.instructions,
                        preference_ids: generatedPreferences,
                      }
                    : undefined
                }
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="ai">
            <Suspense fallback={<RecipeFormSkeleton />}>
              <AiRecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
      <Toaster theme="system" position="top-right" expand={false} richColors />
    </div>
  );
}
