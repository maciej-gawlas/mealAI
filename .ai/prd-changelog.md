# Product Changelog

## [Unreleased] - 2025-08-05

### ✨ Features

- **Recipe Preferences**: Users can now associate dietary and culinary preferences with their recipes. When creating a new recipe, an optional array of `preference_ids` can be provided. This allows for better categorization and future filtering of recipes based on user needs.
- **Filter Recipes by Preference**: Added a dropdown in the recipes list and support for the query parameter `preference` in the `GET /api/recipes` endpoint, enabling users to filter recipes by their dietary preferences.

### 🛠️ Technical Changes

- **Database**: Added a new table `recipe_preferences` to create a many-to-many relationship between `recipes` and `preferences`.
- **API**: The `POST /api/recipes` endpoint now accepts an optional `preference_ids` array in the request body.
- **Backend**: The `recipeService` has been updated to handle the creation of recipe-preference links within a database transaction, ensuring data integrity.
- **Types & Schemas**: Updated `CreateRecipeSchema` (Zod) and `CreateRecipeCommand` (TypeScript) to include the new optional `preference_ids` field.
- **Migrations**: A new Supabase migration `20250805100000_add_recipe_preferences.sql` has been created to apply the database schema changes.
