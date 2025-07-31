# API Endpoint Implementation Plan: Delete Recipe

## 1. Przegląd punktu końcowego

Usuwa istniejący przepis należący do zalogowanego użytkownika. Punkt końcowy wykorzystuje mechanizm RLS w Supabase, aby zapewnić, że użytkownicy mogą usuwać tylko swoje własne zasoby.

## 2. Szczegóły żądania

- Metoda HTTP: DELETE
- Struktura URL: `/api/recipes/{id}`
- Parametry:
  - Wymagane:
    - Path param `id` (UUID) – identyfikator przepisu do usunięcia
  - Opcjonalne: brak
- Nagłówki:
  - `Authorization: Bearer <token>` – sesja uwierzytelniająca użytkownika
- Request Body: brak

## 3. Wykorzystywane typy

- **DeleteRecipeCommand**

  ```ts
  interface DeleteRecipeCommand {
    id: string;
  }
  ```

- **Brak ciała odpowiedzi** – kod statusu 204 No Content

## 4. Szczegóły odpowiedzi

- 204 No Content – operacja zakończona pomyślnie
- 400 Bad Request – niepoprawny identyfikator (np. nieUUID)
- 401 Unauthorized – brak lub nieprawidłowy token uwierzytelniający
- 404 Not Found – przepis nie istnieje lub użytkownik nie ma do niego dostępu
- 500 Internal Server Error – niespodziewany błąd serwera

## 5. Przepływ danych

1. Handler Astro w `src/pages/api/recipes/[id].ts`:
   - Wyodrębnia `id` z parametrów trasy
   - Pobiera `supabase` z `context.locals` oraz `session` z `supabase.auth.getSession()`
   - Weryfikuje obecność sesji (404 lub 401)
   - Wywołuje `recipeService.deleteRecipe(userId, id)`

   ```ts
   await supabase.from("recipes").delete().eq("id", recipeId);
   ```

2. `recipeService.deleteRecipe(userId, recipeId)`:
   - Waliduje UUID (jeśli nie wykonujemy przez Zod, to manualnie)
   - Dzięki RLS Supabase operacja usunie tylko rekordy, gdzie `user_id = auth.uid()`

3. Handler zwraca odpowiedni kod statusu i pustą odpowiedź

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: weryfikacja JWT z Supabase Auth
- **Autoryzacja**: RLS na tabeli `recipes` wymuszające `auth.uid() = user_id`
- **Walidacja**: sprawdzenie poprawności formatu UUID (Za pomocą Zod lub manualne)
- **Unikanie ujawniania**: nie ujawniamy szczegółów przy 404/401

## 7. Obsługa błędów

| Kod | Warunek                              | Odpowiedź                            |
| --- | ------------------------------------ | ------------------------------------ |
| 400 | Niepoprawne `id` (format UUID)       | `{ error: 'Invalid recipe ID' }`     |
| 401 | Brak sesji / nieautoryzowany token   | `{ error: 'Unauthorized' }`          |
| 404 | Rekord nie istnieje lub brak dostępu | `{ error: 'Recipe not found' }`      |
| 500 | Błąd serwera / wyjątek               | `{ error: 'Internal server error' }` |

## 8. Rozważania dotyczące wydajności

- Operacja jest pojedynczym zapytaniem DELETE z warunkiem po PK i indeksie `id`
- RLS nie wpływa znacząco na wydajność w tym scenariuszu
- Możliwość dodatkowego cachowania listy przepisów, ale DELETE wymusza odświeżenie klienta

## 9. Kroki implementacji

1. **Typy i komendy**
   - Zdefiniować `DeleteRecipeCommand` w `src/types.ts`
2. **Service Layer**
   - Dodać metodę `deleteRecipe(userId: string, recipeId: string)` w `src/services/recipeService.ts`
3. **Handler API**
   - Utworzyć lub zaktualizować `src/pages/api/recipes/[id].ts` zgodnie z konwencjami Astro i Supabase
   - Wykorzystać `context.locals.supabase` i Zod/np. `validateUUID`
4. **Walidacja**
   - Użyć Zod do walidacji `id` lub napisać prostą funkcję `isUUID`
