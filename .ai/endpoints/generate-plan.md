# API Endpoint Implementation Plan: Generate a Recipe via AI

## 1. Przegląd punktu końcowego

Endpoint umożliwia użytkownikom wysłanie żądania wygenerowania przepisu kulinarnego za pomocą usługi AI. Po przyjęciu żądania zuruchamiana jest logika generacji przepisu a nastepnie wysylany jest przepis.

## 2. Szczegóły żądania

- Metoda HTTP: POST
- Struktura URL: `/recipes/generate`
- Nagłówki:
  - `Authorization: Bearer <token>` (wymagane)
  - `Content-Type: application/json`
- Parametry:
  - Wymagane:
    - `description` (string): opis przepisu do wygenerowania, opcjonalny
    - `preferences` (string[]): tablica UUID preferencji dietetycznych użytkownika
  - Opcjonalne: brak
- Request Body:

  ```json
  {
    "description": "quick vegan lunch",
    "preferences": ["uuid1", "uuid2"]
  }
  ```

## 3. Wykorzystywane typy

- `GenerateRecipeCommand` (src/types.ts)
- `GenerateRecipeResponseDTO`, `AIRecipeDTO` (src/types.ts)
- Zod schema: `GenerateRecipeSchema`

## 4. Szczegóły odpowiedzi

- Status: 202 Accepted
- Ciało odpowiedzi:

  ```json
  {
    "recipe": {
      "name": string,
      "ingredients": string,
      "instructions": string
    }
  }
  ```

- Kody statusów:
  - 202 – żądanie przyjęte do realizacji
  - 400 – nieprawidłowe dane wejściowe
  - 401 – brak lub nieważny token
  - 500 – błąd serwera

## 5. Przepływ danych

1. Klient wysyła żądanie POST z tokenem i danymi w ciele.
2. Middleware autoryzacyjne w Astro wyciąga supabase z `context.locals` i sprawdza `session`.
3. Walidacja Zod schema w handlerze API.
4. Utworzenie `GenerateRecipeCommand` i przekazanie do `recipeService.generateRecipe(command)`.
5. `recipeService` wywołuje zewnętrzne API AI (Openrouter.ai) z prompt i preferencjami.
6. Odbiór wygenerowanego przepisu.
7. Zwrócenie wygenerowanego przepisu.

## 6. Względy bezpieczeństwa

- Uwierzytelnianie przez Supabase Auth: użycie `context.locals.supabase`.
- Autoryzacja: RLS na tabeli `recipes` (tylko właściciel może pisać).
- Walidacja wejścia przez Zod, weryfikacja UUID.
- Unikanie wstrzyknięć: bezpośrednie przekazywanie danych do Supabase.
- Ograniczenie rozmiaru prompt i liczby preferencji w walidacji.

## 7. Obsługa błędów

- 400: schema validation error → zwróć `BadRequestError` z opisem.
- 401: brak sesji lub wygasły token → `UnauthorizedError`.
- 502/503: błąd integracji z AI → zwróć `ServiceUnavailableError` lub `502 Bad Gateway`.
- 500: nieprzewidziane błędy → `InternalServerError` i log w konsoli.

## 8. Kroki implementacji

1. Dodanie Zod schema (`src/schemas/generateRecipe.ts`).
2. Utworzenie nowej metody `generateRecipe` w `src/services/recipeService.ts`.
3. Dodanie pliku handlera API `src/pages/api/recipes/generate.ts`.
4. Integracja z `context.locals.supabase` i autoryzacją.
5. Implementacja logiki wywołania Openrouter.ai w `recipeService`.
6. Zwrócenie wygenerowanego przepisu.
