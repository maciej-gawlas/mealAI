# API Endpoint Implementation Plan: Get Recipe Details

## 1. Przegląd punktu końcowego

Pobranie szczegółów pojedynczego przepisu na podstawie jego identyfikatora UUID. Punkt jest chroniony i dostępny tylko dla zalogowanego użytkownika.

## 2. Szczegóły żądania

- Metoda HTTP: GET
- Struktura URL: `/recipes/{id}`
- Parametry:
  - Wymagane:
    - `id` (ścieżka) – UUID przepisu
    - Nagłówek `Authorization: Bearer <token>`
- Request Body: brak

## 3. Szczegóły odpowiedzi

- 200 OK

  ```json
  {
    "id": "recipe-uuid",
    "user_id": "user-uuid",
    "name": "Salad",
    "ingredients": "Lettuce, Tomato, Cucumber",
    "instructions": "Chop veggies and mix",
    "is_ai_generated": false,
    "created_at": "2025-07-23T12:34:56Z",
    "updated_at": "2025-07-23T12:34:56Z"
  }
  ```

- Wykorzystane typy:
  - `RecipeDTO`
  - `GetRecipeResponseDTO`

## 4. Przepływ danych

1. Parsowanie ścieżki i ekstrakcja parametru `id`.
2. Walidacja formatu UUID przez Zod.
3. Pobranie `userId` z `context.locals.supabase.auth.getUser()`.
4. Wywołanie serwisu: `recipeService.getRecipeById(userId, id)`.
5. Serwis używa Supabase z `context.locals.supabase` i RLS do pobrania rekordu.
6. Zwrot danych DTO lub rzucenie odpowiedniego błędu.

## 5. Względy bezpieczeństwa

- Uwierzytelnianie: nagłówek Bearer token
- Autoryzacja: RLS na tabeli `recipes` + warunek `user_id = auth.uid()`
- Walidacja parametrów: Zod zabezpiecza przed niepoprawnym UUID
- Ochrona przed leakiem danych – każdy użytkownik widzi tylko swoje przepisy

## 6. Obsługa błędów

- 400 Bad Request: niepoprawny format UUID (Zod)
- 401 Unauthorized: brak tokena lub brak uprawnień
- 404 Not Found: brak przepisu lub nie należy do użytkownika
- 500 Internal Server Error: błąd po stronie serwera lub Supabase

## 7. Wydajność

- Indeks PRIMARY KEY na `id` gwarantuje szybkie wyszukiwanie
- RLS nie wpływa znacząco na pojedyncze zapytania po kluczu głównym
- Możliwość cache’owania odpowiedzi na poziomie CDN lub pamięci podręcznej aplikacji

## 8. Kroki implementacji

1. W pliku `pages/api/recipes.ts` utworzyć handler GET.
2. Zdefiniować Zod schema do walidacji `id` (UUID).
3. Wyciągnąć `supabase` i `user` z `context.locals`.
4. Zaimportować i wywołać `recipeService.getRecipeById(user.id, id)`.
5. Zmapować wynik na `GetRecipeResponseDTO` i zwrócić 200.
6. Dodać obsługę błędów z odpowiednimi kodami statusu.
