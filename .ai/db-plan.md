# Baza danych HealthyMeal (MVP)

## 1. Tabele

### auth.users (Supabase Auth)

This table is managed by Supabase Auth.

- id UUID PRIMARY KEY
- email TEXT NOT NULL UNIQUE
- password VARCHAR NOT NULL
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

### 1.1 preferences

- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- name TEXT NOT NULL UNIQUE

### 1.2 user_preferences

- user_id UUID NOT NULL
  ‣ FK → auth.users(id) ON DELETE CASCADE
- preference_id UUID NOT NULL
  ‣ FK → preferences(id) ON DELETE CASCADE
- PRIMARY KEY (user_id, preference_id)

### 1.3 recipes

- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- user_id UUID NOT NULL
  ‣ FK → auth.users(id) ON DELETE CASCADE
- name TEXT NOT NULL
- ingredients TEXT NOT NULL
- instructions TEXT NOT NULL
- is_ai_generated BOOLEAN NOT NULL DEFAULT false
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()

## 2. Relacje między tabelami

- auth.users (1) ←— (∞) recipes
- auth.users (1) ←— (∞) user_preferences — (∞) → preferences
- preferences (1) ←— (∞) user_preferences

## 3. Indeksy

- recipes(user_id)
- recipes(created_at)
- UNIQUE INDEX on preferences(name) (implicit)
- PRIMARY KEY implicit B-tree on user_preferences(user_id, preference_id)

## 4. Zasady PostgreSQL i RLS

1. Włączamy RLS na `recipes` i `user_preferences`:

   ```sql
   ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
   ```

2. Polityki CRUD (tylko właściciel może):

   ```sql
   CREATE POLICY "recipes_owner" ON recipes
     FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "user_prefs_owner" ON user_preferences
     FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
   ```

3. Trigger do automatycznego ustawiania `updated_at`:

   ```sql
   CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
   BEGIN
     NEW.updated_at = now();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER trg_set_updated_at
     BEFORE UPDATE ON recipes
     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
   ```
