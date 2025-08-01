# Integracja z OpenRouter.ai

## 1. Wykorzystywane typy

- **GenerateRecipeInput** (z `src/schemas/generateRecipe.ts`) – dane wejściowe od użytkownika (preferencje, opis).
- **AIRecipeDTO** (z `src/types.ts`) – obiekt zwracany przez usługę AI zawierający pola:
  - `name: string`
  - `ingredients: string`
  - `instructions: string`
- **Zod Schema** – walidacja odpowiedzi z OpenRouter:

  ```typescript
  const recipeResponseSchema = z.object({
    name: z.string(),
    ingredients: z.string(),
    instructions: z.string(),
  });
  ```

- **PromptModel** (wewnętrzny) – struktura promptu wysyłanego do API (ciąg tekstowy lub obiekt JSON).

## 2. Względy bezpieczeństwa

- **Przechowywanie kluczy**
  - Klucz `OPENROUTER_API_KEY` w zmiennych środowiskowych (nie w kodzie).
  - Dostęp do klucza tylko po stronie serwera, za pomocą `import.meta.env.OPENROUTER_API_KEY`.
- **Walidacja danych wejściowych**
  - Użycie Zod do weryfikacji `GenerateRecipeInput` przed wywołaniem usługi.

## 3. Obsługa błędów

- **Błędy sieciowe** (timeout, brak łączności):
  - Retry z limitem (np. 2 próby, backoff).
  - Fallback do informowania użytkownika o niedostępności usługi.
- **Błędy limitów API** (429 Too Many Requests):
  - Exponential backoff lub „circuit breaker”.
- **Niepoprawny format odpowiedzi**:
  - Walidacja Zod, rzucanie `ValidationError` z opisem.

## 4. Etapy wdrożenia

1. **Instalacja biblioteki**

   ```bash
   npm install openrouter
   ```

2. **Konfiguracja zmiennych środowiskowych**
   - Dodaj `OPENROUTER_API_KEY` do pliku `.env` lub konfiguracji środowiska.
3. **Utworzenie serwisu AI**
   - W `src/services/ai/openrouter.ts`:
     - Inicjalizacja klienta `OpenRouterClient` z kluczem.
     - Funkcja `buildPrompt(input: GenerateRecipeInput): string` generująca prompt.
     - Funkcja `generateRecipeWithAI(...)`:
       - Walidacja `input` przez Zod.
       - Wywołanie `client.chat.completions.create({ model: ..., prompt })`.
       - Parsowanie i walidacja odpowiedzi przez `recipeResponseSchema`.
       - Zwrócenie `AIRecipeDTO`.
4. **Integracja w endpointach**
   - W `src/pages/api/recipes/generate.ts`:
     - Pobranie `supabase` z `context.locals` i `userId`.
     - Wywołanie `generateRecipeWithAI` i obsługa błędów.
     - Zapis historii generowanych przepisów w Supabase (opcjonalnie).
