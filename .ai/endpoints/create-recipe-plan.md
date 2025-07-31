# API Endpoint Implementation Plan: Create Recipe

## 1. Przegląd punktu końcowego

Dodaj nową recepturę dla uwierzytelnionego użytkownika w bazie danych Supabase z wykorzystaniem RLS.

## 2. Szczegóły żądania

- Metoda HTTP: POST
- URL: /api/recipes
- Nagłówki:
- Authorization: Bearer `<token>`
- Parametry:
  - Wymagane: brak w ścieżki ani query

- Request Body (JSON):

  ```json
  {
    "name": "My Dish",
    "ingredients": "Chicken, Rice, Spices",
    "instructions": "Cook rice and chicken, then season",
    "is_ai_generated": false
  }
  ```

## 3. Wykorzystywane typy

- CreateRecipeCommand (src/types.ts)
- RecipeDTO (src/types.ts)
- CreateRecipeResponseDTO (src/types.ts)
- Zod schema: CreateRecipeSchema (src/schemas/recipe.ts)

## 4. Szczegóły odpowiedzi

- Status 201 Created

- Response Body (JSON):

  ```json
  {
    "id": "uuid",
    "user_id": "user-uuid",
    "name": "My Dish",
    "ingredients": "Chicken, Rice, Spices",
    "instructions": "Cook rice and chicken, then season",
    "is_ai_generated": false,
    "created_at": "2025-07-23T12:34:56Z",
    "updated_at": "2025-07-23T12:34:56Z"
  }
  ```

## 5. Przepływ danych

1. Rice client przekazuje token w Authorization header.
2. Astro handler (`src/pages/api/recipes.ts`) pobiera `locals.supabase` i sprawdza sesję użytkownika.
3. Walidacja ciała żądania za pomocą Zod.
4. Wywołanie `recipeService.createRecipe(userId, command)`.
5. `recipeService` używa `locals.supabase.from('recipes').insert(...)` w celu zapisania rekordu.
6. Zwrócenie utworzonego wiersza z bazy.

## 6. Względy bezpieczeństwa

- Uwierzytelnianie: wymaga ważnego JWT Supabase w nagłówku Authorization.
- Autoryzacja: RLS w tabeli `recipes` zapewnia, że wstawki są dozwolone tylko dla właściciela (auth.uid() = user_id).
- Walidacja: Zod zapewnia poprawność typów i zakresów danych.

## 7. Obsługa błędów

- 400 Bad Request: niezgodność z Zod (brak wymaganych pól, nieprawidłowy typ).
- 401 Unauthorized: brak lub nieważny token, sesja niezweryfikowana.
- 500 Internal Server Error: błąd po stronie serwera lub błąd Supabase.

### Scenariusze błędów

| Kod | Przyczyna                                     | Odpowiedź                    |
| --- | --------------------------------------------- | ---------------------------- |
| 400 | Walidacja Zod                                 | `{ error: "Invalid input" }` |
| 401 | Brak/nieprawidłowy token                      | `{ error: "Unauthorized" }`  |
| 500 | Błąd zapisu do bazy lub nieoczekiwany wyjątek | `{ error: "Server error" }`  |

## 8. Wydajność

- Jedno zapytanie INSERT, niewielki payload.
- RLS i Supabase obsługuje indeksy (`recipes(user_id)`), wstawianie jest szybkie.
- Nie wymaga dodatkowych zewnętrznych wywołań.

## 9. Kroki implementacji

1. Utworzyć schemat walidacji Zod w `src/schemas/recipe.ts`:

   ```ts
   import { z } from "zod";

   export const CreateRecipeSchema = z.object({
     name: z.string().min(1),
     ingredients: z.string().min(1),
     instructions: z.string().min(1),
     is_ai_generated: z.boolean(),
   });
   ```

2. Dodać serwis `src/services/recipeService.ts` z funkcją `createRecipe`:

   ```ts
   import type { CreateRecipeCommand, RecipeDTO } from "../types";

   export async function createRecipe(
     supabase: SupabaseClient,
     userId: string,
     command: CreateRecipeCommand,
   ): Promise<RecipeDTO> {
     const { data, error } = await supabase
       .from("recipes")
       .insert({ user_id: userId, ...command })
       .select("*")
       .single();
     if (error) throw error;
     return data;
   }
   ```

3. Utworzyć handler HTTP w `src/pages/api/recipes.ts`:

   ```ts
   import type { APIRoute } from "astro";
   import { CreateRecipeSchema } from "../schemas/recipe";
   import { createRecipe } from "../services/recipeService";

   export const post: APIRoute = async ({ request, locals }) => {
     const supabase = locals.supabase;
     const session = await supabase.auth.getSession();
     if (!session.data.session) {
       return new Response(JSON.stringify({ error: "Unauthorized" }), {
         status: 401,
       });
     }
     const body = await request.json();
     const parse = CreateRecipeSchema.safeParse(body);
     if (!parse.success) {
       return new Response(JSON.stringify({ error: "Invalid input" }), {
         status: 400,
       });
     }
     try {
       const recipe = await createRecipe(
         supabase,
         session.data.session.user.id,
         parse.data,
       );
       return new Response(JSON.stringify(recipe), { status: 201 });
     } catch (err) {
       console.error(err);
       return new Response(JSON.stringify({ error: "Server error" }), {
         status: 500,
       });
     }
   };
   ```
