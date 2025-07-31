# API Endpoint Implementation Plan: List recipes

## 1. Przegląd punktu końcowego

Punkt końcowy służy do pobierania listy przepisów zalogowanego użytkownika z opcją stronicowania, sortowania oraz filtrowania przepisów generowanych przez AI.

## 2. Szczegóły żądania

- Metoda HTTP: GET
- Ścieżka URL: `/recipes`
- Nagłówek:
  - Authorization: `Bearer <token>`
- Parametry zapytania:
  - Wymagane:
    - brak (wszystkie parametry mają wartości domyślne)
  - Opcjonalne:
    - `page` (integer, domyślnie 1)
    - `limit` (integer, domyślnie 20)
    - `sort` (string, np. `created_at desc`)
    - `ai_generated` (boolean)

## 3. Wykorzystywane typy

- `RecipeDTO` — pojedynczy rekord przepisu
- `ListRecipesMeta` — metadane paginacji (`page`, `limit`, `total`)
- `ListRecipesResponseDTO` — struktura odpowiedzi (`meta` + `data: RecipeDTO[]`)

## 4. Szczegóły odpowiedzi

- 200 OK:
  ```json
  {
    "meta": { "page": 1, "limit": 20, "total": 42 },
    "data": [
      /* lista obiektów RecipeDTO */
    ]
  }
  ```
- Kody błędów:
  - 400 Bad Request — nieprawidłowe parametry zapytania
  - 401 Unauthorized — brak lub nieprawidłowy token dostępu
  - 500 Internal Server Error — błąd po stronie serwera

## 5. Przepływ danych

1. `src/pages/api/recipes.ts` obsługuje żądanie:
   - pobiera `supabase` z `context.locals`
   - waliduje i parsuje parametry zapytania za pomocą Zod
   - wyciąga `userId` z sesji (`supabase.auth.getUser()` lub `locals.user`)
   - wywołuje `recipeService.listRecipes(supabase, userId, query)`
2. W `src/services/recipeService.ts`:
   - definiuje metodę `listRecipes`:
     - tworzy zapytanie do tabeli `recipes` z filtrami `eq('user_id', userId)`
     - nakłada warunek `eq('is_ai_generated', ai_generated)` jeśli parametr obecny
     - ustawia sortowanie `.order(by: [kolumna, kierunek])`
     - ustawia paginację `.range(start, end)` na podstawie `page` i `limit`
     - pobiera jednocześnie całkowitą liczbę rekordów (`.select('*', { count: 'exact' })`)
     - mapuje wynik do `ListRecipesResponseDTO`
3. Odpowiedź zwracana klientowi jako JSON

## 6. Względy bezpieczeństwa

- Uwierzytelnianie tokenem w nagłówku Authorization
- RLS w Supabase na tabeli `recipes` ogranicza widoczność do wierszy z `user_id = auth.uid()`
- Walidacja typów parametrów wejściowych Zod
- Ograniczenie maksymalnej wartości `limit` (np. do 100) aby zapobiec nadmiernym zapytaniom

## 7. Obsługa błędów

- Zwrócenie 400 przy błędach walidacji Zod z opisem nieprawidłowych parametrów
- Zwrócenie 401 przy braku sesji lub błędzie autoryzacji
- Zwrócenie 500 przy nieoczekiwanym błędzie podczas komunikacji z bazą danych
- Logowanie błędów (opcjonalnie zapis do zewnętrznego systemu logów lub do dedykowanej tabeli)

## 8. Rozważania dotyczące wydajności

- Indeks na `recipes(user_id)` i `recipes(created_at)`
- Paginate zamiast pobierania całej tabeli
- Ograniczenie górnego limitu `limit`
- Wydajne sortowanie po kolumnach z indeksem

## 9. Kroki implementacji

1. Utworzyć typ `ListRecipesQuery` (opcjonalnie) i Zod schema w `src/schemas/recipe.ts`.
2. Rozszerzyć `src/services/recipeService.ts` o metodę `listRecipes` zgodnie z opisem.
3. Dodać plik `src/pages/api/recipes.ts`:
   - obsługa wyciągania supabase i userId
   - walidacja Zod
   - wywołanie serwisu i zwrócenie JSON
