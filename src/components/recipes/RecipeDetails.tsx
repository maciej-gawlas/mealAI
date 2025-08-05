import { useState } from "react";
import { toast } from "sonner";
import { DeleteButtonWithDialog } from "./DeleteButtonWithDialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed } from "lucide-react";
import type { RecipeViewModel } from "@/types";

interface RecipeDetailsProps {
  recipe: RecipeViewModel;
}

export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSuccess = () => {
    toast.success("Recipe deleted successfully");
    // Redirect to recipes list after successful deletion
    window.location.href = "/recipes";
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        <div>
          <h1 id="recipe-title" className="text-3xl font-bold mb-2">
            {recipe.name}
          </h1>
          <time
            className="text-sm text-muted-foreground"
            dateTime={recipe.createdAtFormatted}
          >
            Created on {recipe.createdAtFormatted}
          </time>
        </div>
        <DeleteButtonWithDialog
          recipeId={recipe.id}
          onSuccess={handleDeleteSuccess}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {recipe.preferences && recipe.preferences.length > 0 && (
          <section aria-labelledby="preferences-heading">
            <h2
              id="preferences-heading"
              className="text-xl font-semibold mb-3 flex items-center gap-2"
            >
              <UtensilsCrossed className="h-5 w-5" />
              Preferences
            </h2>
            <div className="flex flex-wrap gap-2">
              {recipe.preferences.map((pref) => (
                <Badge
                  key={pref.preference_id}
                  variant="secondary"
                  className="text-sm"
                >
                  {pref.name}
                </Badge>
              ))}
            </div>
          </section>
        )}
        <section aria-labelledby="ingredients-heading">
          <h2 id="ingredients-heading" className="text-xl font-semibold mb-3">
            Ingredients
          </h2>
          <div className="whitespace-pre-line">{recipe.ingredients}</div>
        </section>
        <section aria-labelledby="instructions-heading">
          <h2 id="instructions-heading" className="text-xl font-semibold mb-3">
            Instructions
          </h2>
          <div className="whitespace-pre-line">{recipe.instructions}</div>
        </section>
      </CardContent>
    </Card>
  );
}
