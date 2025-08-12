import { http, HttpResponse, delay } from "msw";

// Handler factory functions for common API operations
export const createSuccessHandler = (url: string, data: any) => {
  return http.get(url, async () => {
    await delay(100); // Simulate network delay
    return HttpResponse.json(data);
  });
};

export const createErrorHandler = (
  url: string,
  status = 500,
  message = "Server error",
) => {
  return http.get(url, async () => {
    await delay(100);
    return new HttpResponse(JSON.stringify({ message }), {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
};

// Example handlers for testing
export const handlers = [
  // Recipe API handlers
  http.get("/api/recipes", async () => {
    await delay(100);
    return HttpResponse.json([
      {
        id: "1",
        title: "Pasta Carbonara",
        description:
          "Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper",
        ingredients: [
          "Spaghetti",
          "Eggs",
          "Pancetta",
          "Parmesan",
          "Black Pepper",
        ],
        instructions: [
          "Cook pasta",
          "Fry pancetta",
          "Mix eggs and cheese",
          "Combine all ingredients",
        ],
        cookingTime: 20,
        servings: 2,
        tags: ["italian", "pasta", "quick"],
      },
      {
        id: "2",
        title: "Vegetable Stir Fry",
        description: "Quick and healthy vegetable stir fry with soy sauce",
        ingredients: [
          "Mixed Vegetables",
          "Soy Sauce",
          "Ginger",
          "Garlic",
          "Rice",
        ],
        instructions: [
          "Prepare vegetables",
          "Heat wok",
          "Stir fry vegetables",
          "Add sauce",
          "Serve with rice",
        ],
        cookingTime: 15,
        servings: 2,
        tags: ["vegetarian", "quick", "healthy"],
      },
    ]);
  }),

  // Preferences API handlers
  http.get("/api/preferences", async () => {
    await delay(100);
    return HttpResponse.json({
      dietaryRestrictions: ["vegetarian", "glutenFree"],
      cuisinePreferences: ["italian", "asian", "mediterranean"],
      mealTypes: ["breakfast", "dinner"],
    });
  }),
];
