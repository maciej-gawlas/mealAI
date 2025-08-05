import React from "react";
import type { RecipeViewModel } from "../../types";
import RecipeCard from "./RecipeCard";
import SkeletonCard from "./SkeletonCard.tsx";

interface Props {
  recipes?: RecipeViewModel[];
  isLoading?: boolean;
}

const RecipesList: React.FC<Props> = ({ recipes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((key) => (
          <SkeletonCard key={key} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes?.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipesList;
