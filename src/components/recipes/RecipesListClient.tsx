import React, { useEffect, useState } from "react";
import RecipesList from "./RecipesList";
import EmptyState from "./EmptyState";
import type { RecipeViewModel } from "../../types";

const RecipesListClient: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setRecipes(
          data.data.map((recipe: any) => ({
            id: recipe.id,
            name: recipe.name,
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
  }, []);

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
  return recipes.length > 0 ? (
    <RecipesList recipes={recipes} />
  ) : (
    <EmptyState />
  );
};

export default RecipesListClient;
