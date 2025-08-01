# Plan implementacji usługi OpenRouter

## 1. Opis usługi

Usługa `OpenRouterService` pozwala na komunikację z API OpenRouter w celu generowania odpowiedzi LLM, z obsługą ustrukturyzowanych odpowiedzi zgodnych z JSON Schema, zarządzaniem komunikatami systemowymi i użytkownika oraz konfigurowalnymi parametrami modelu.

## 2. Opis konstruktora

```ts
new OpenRouterService(config: OpenRouterConfig)
```

**Parametry konfiguracji:**

- `apiKey: string` – klucz API OpenRouter (w `import.meta.env`)
- `endpoint?: string` – adres endpointu (domyślnie `https://openrouter.ai/v1/chat/completions`)
- `modelName: string` – nazwa modelu (np. `"gpt-4o"`)
- `systemMessage?: ChatMessage` – opcjonalny komunikat systemowy (np. `{ role: "system", content: "You are a helpful assistant." }`)
- `defaultParams?: ModelParams` – domyślne parametry modelu (temperature, max_tokens, top_p)
- `responseFormat?: ResponseFormat` – definicja schematu odpowiedzi JSON

## 3. Publiczne metody i pola

### Pola

- `modelName: string`
- `params: ModelParams`
- `systemMessage: ChatMessage`
- `responseFormat: ResponseFormat`

### Metody

#### async sendMessage(userMessage: string): Promise<T>

1. Buduje payload łączący:
   - komunikat systemowy
   - komunikat użytkownika
   - definicję `response_format`
   - parametry modelu i nazwę modelu
2. Wysyła `POST` do OpenRouter API
3. Odbiera i waliduje odpowiedź względem JSON Schema
4. Zwraca sparsowane dane typu T

**Przykład użycia:**

```ts
const service = new OpenRouterService({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
  modelName: "gpt-4o",
  systemMessage: { role: "system", content: "You are a helpful assistant." },
  defaultParams: { temperature: 0.7, max_tokens: 800, top_p: 1.0 },
  responseFormat: {
    type: "json_schema",
    json_schema: {
      name: "RecipeResponse",
      strict: true,
      schema: {
        recipe: { type: "string" },
        ingredients: { type: "array", items: { type: "string" } },
      },
    },
  },
});
const result = await service.sendMessage("Podaj przepis na ciasto marchewkowe");
```

## 4. Prywatne metody i pola

- `_buildPayload(userMessage: string): ChatCompletionRequest` – łączy wszystkie komunikaty i parametry w body
- `_callApi(payload: ChatCompletionRequest): Promise<RawApiResponse>` – wykonuje `fetch` do OpenRouter
- `_validateSchema(raw: RawApiResponse): T` – waliduje odpowiedź względem JSON Schema za pomocą Zod lub innej biblioteki

## 5. Obsługa błędów

1. **NetworkError** – brak połączenia sieciowego (retry/backoff)
2. **AuthenticationError** – niepoprawny lub brak klucza API (log + wyjątek)
3. **ValidationError** – odpowiedź niezgodna z JSON Schema (wyrzuca `ResponseFormatError`)
4. **InvalidInputError** – niepoprawne dane wejściowe (wyjątek ZodError)
5. **TimeoutError** – przekroczony czas oczekiwania (retry lub zwrócenie 504)

## 6. Kwestie bezpieczeństwa

- Przechowywanie klucza w `import.meta.env.OPENROUTER_API_KEY`
- Ograniczenie prędkości wywołań (rate limiting)
- Sanityzacja i walidacja `systemMessage` oraz `userMessage`
- Unikanie logowania pełnych payloadów z kluczem
- Uwierzytelnianie dostępu do endpointa w wewnętrznych metodach Astro

## 7. Plan wdrożenia krok po kroku

1. **Zainstaluj zależności:**
   ```bash
   npm install zod node-fetch
   ```
2. **Skonfiguruj zmienne środowiskowe:**
   - `OPENROUTER_API_KEY` w pliku `.env`
3. **Utwórz katalog i plik usługi:**
   - `src/services/OpenRouterService.ts`
4. **Skonfiguruj kluczowe elementy usługi:**
   1. Komunikat systemowy: `{ role: "system", content: "You are a helpful assistant." }`
   2. Komunikat użytkownika: `{ role: "user", content: userMessage }`
   3. Response Format:
      ```ts
      {
        type: 'json_schema',
        json_schema: {
          name: 'RecipeResponse',
          strict: true,
          schema: {
            recipe: { type: 'string' },
            ingredients: { type: 'array', items: { type: 'string' } }
          }
        }
      }
      ```
   4. Nazwa modelu: `'gpt-4o'` lub inny wspierany model
   5. Parametry modelu: `{ temperature: 0.7, max_tokens: 800, top_p: 1.0 }`
5. **Zaimplementuj klasę zgodnie ze specyfikacją:**
   - Konstruktor, publiczne i prywatne metody
6. **Dodaj testy jednostkowe:**
   - Mockowanie odpowiedzi OpenRouter z JSON Schema
7. **Zintegruj serwis w istniejącej logice AI:**
   - np. `services/ai/openrouter.ts` → wywołanie `OpenRouterService.sendMessage`
