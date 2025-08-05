-- Add recipe_preferences table to link recipes with preferences

-- 1. Create recipe_preferences table
CREATE TABLE public.recipe_preferences (
    recipe_id uuid NOT NULL,
    preference_id uuid NOT NULL,
    CONSTRAINT recipe_preferences_pkey PRIMARY KEY (recipe_id, preference_id),
    CONSTRAINT recipe_preferences_preference_id_fkey FOREIGN KEY (preference_id) REFERENCES public.preferences(id) ON DELETE CASCADE,
    CONSTRAINT recipe_preferences_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE
);

-- 2. Enable Row Level Security
ALTER TABLE public.recipe_preferences ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policy for recipe_preferences
-- This policy allows users to manage preferences only for recipes they own.
CREATE POLICY "recipe_prefs_owner"
ON public.recipe_preferences
FOR ALL
USING (
  (SELECT user_id FROM public.recipes WHERE id = recipe_id) = auth.uid()
);

-- 4. Add comments to the new table and columns
COMMENT ON TABLE public.recipe_preferences IS 'Stores the many-to-many relationship between recipes and preferences.';
COMMENT ON COLUMN public.recipe_preferences.recipe_id IS 'Foreign key to the recipes table.';
COMMENT ON COLUMN public.recipe_preferences.preference_id IS 'Foreign key to the preferences table.';
