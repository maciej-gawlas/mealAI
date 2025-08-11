import React from "react";
import type { RecipeViewModel } from "../../types";
import { Card, CardHeader, CardTitle } from "../ui/card";
import DeleteButtonWithDialog from "./DeleteButtonWithDialog";
import { Badge } from "../ui/badge";

interface Props {
  recipe: RecipeViewModel;
}

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  return (
    <Card className="relative group hover:shadow-lg transition-all duration-300">
      <a href={`/recipes/${recipe.id}`} className="block">
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors">
            {recipe.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {recipe.createdAtFormatted}
          </p>
          {recipe.preferences && recipe.preferences.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.preferences.map((pref) => (
                <Badge
                  key={pref.preference_id}
                  variant="secondary"
                  className="text-xs"
                >
                  {pref.name}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </a>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
        <DeleteButtonWithDialog recipeId={recipe.id} recipeName={recipe.name} />
      </div>
    </Card>
  );
};

export default RecipeCard;
