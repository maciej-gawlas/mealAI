import { Button } from "@/components/ui/button";
import type { GetRecipeResponseDTO } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { RecipeDetails } from "./RecipeDetails";

import type { ExtendedRecipePreferenceDTO } from "@/types";

interface RecipeViewModel {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  is_ai_generated: boolean;
  createdAtFormatted: string;
  preferences?: ExtendedRecipePreferenceDTO[];
}

interface RecipeDetailsPageProps {
  id: string;
}

export function RecipeDetailsPage({ id }: RecipeDetailsPageProps) {
  const [recipe, setRecipe] = useState<RecipeViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Recipe not found");
          }
          throw new Error("An error occurred while fetching the recipe");
        }

        const data: GetRecipeResponseDTO = await response.json();
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(data.created_at));

        setRecipe({
          id: data.id,
          name: data.name,
          ingredients: data.ingredients,
          instructions: data.instructions,
          is_ai_generated: data.is_ai_generated,
          createdAtFormatted: formattedDate,
          preferences: data.recipe_preferences?.map((pref) => ({
            id: pref.preference.id,
            name: pref.preference.name,
            recipe_id: data.id,
            preference_id: pref.preference.id,
            created_at: data.created_at,
          })),
        });
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "An error occurred while fetching the recipe",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-start">
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/recipes")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </div>
      {error && (
        <div className="text-center transform transition-all duration-300 ease-in-out">
          <h1 className="text-2xl font-bold text-red-500 animate-in fade-in slide-in-from-top-4">
            {error}
          </h1>
        </div>
      )}
      {!error && isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      {!error && !isLoading && recipe && (
        <div className="animate-in fade-in duration-500">
          <RecipeDetails recipe={recipe} />
        </div>
      )}
    </main>
  );
}
