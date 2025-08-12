import React, { useEffect, useState } from "react";
import RecipesList from "./RecipesList";
import EmptyState from "./EmptyState";
import type { RecipeViewModel } from "../../types";
import { PreferencesSelect } from "./PreferencesSelect";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RecipePreference {
  preference: {
    id: string;
    name: string;
  };
}

interface RawRecipe {
  id: string;
  name: string;
  created_at: string;
  recipe_preferences?: RecipePreference[];
}

const RecipesListClient: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState("all");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const url = new URL("/api/recipes", window.location.origin);
        if (selectedPreference && selectedPreference !== "all") {
          url.searchParams.set("preference", selectedPreference);
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setRecipes(
          data.data.map((recipe: RawRecipe) => ({
            id: recipe.id,
            name: recipe.name,
            preferences: recipe.recipe_preferences?.map((rp) => ({
              id: rp.preference.id,
              name: rp.preference.name,
              preference_id: rp.preference.id,
            })),
            createdAtFormatted: new Date(recipe.created_at).toLocaleDateString(
              "pl-PL",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              },
            ),
          })),
        );
      } catch (error) {
        setHasError(true);
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [selectedPreference]);

  if (hasError) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>
          Wystąpił błąd podczas ładowania przepisów. Spróbuj ponownie później.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <RecipesList isLoading={true} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-4">
        <PreferencesSelect
          value={selectedPreference}
          onChange={setSelectedPreference}
        />
        <Button
          onClick={() => {
            window.location.href = "/recipes/add";
          }}
          className="flex items-center gap-2 hover:bg-primary/90 hover:text-white transition duration-150"
        >
          <Plus className="w-4 h-4" />
          Dodaj przepis
        </Button>
      </div>
      {recipes.length > 0 ? (
        <RecipesList recipes={recipes} isLoading={false} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default RecipesListClient;
