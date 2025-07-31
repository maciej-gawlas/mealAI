# API Endpoint Implementation Plan: Get All Preferences

## 1. Przegląd punktu końcowego

Celem punktu końcowego `GET /preferences` jest pobranie listy obsługiwanych preferencji dietetycznych z tabeli `preferences`. Punkt jest publiczny (nie wymaga uwierzytelnienia) i zwraca tablicę obiektów zawierających `id` oraz `name`.

## 2. Szczegóły żądania

- Metoda HTTP: GET

- Struktura URL: `/preferences`

- Parametry:
  - Wymagane: brak

  - Opcjonalne: brak

- Request Body: nie dotyczy

## 3. Wykorzystywane typy

- `PreferenceDTO` (alias `Tables<'preferences'>`) – model pojedynczej preferencji

- `PreferencesResponseDTO` – typ odpowiedzi zawierający pole `data: PreferenceDTO[]`

## 4. Szczegóły odpowiedzi

- Kod 200 OK – zwraca JSON:

  ```json
  {
    "data": [
      { "id": "uuid1", "name": "Vegan" },
      { "id": "uuid2", "name": "Vegetarian" }
    ]
  }
  ```

- Błędy:
  - 500 Internal Server Error – w razie problemu z bazą danych lub serwerem

## 5. Przepływ danych

1. Middleware ładuje `supabase` do `context.locals`.

2. Handler `GET /preferences` wywołuje usługę `getAllPreferences(locals.supabase)`.

3. Serwis wykonuje zapytanie do tabeli `preferences`:

   ```ts
   const { data, error } = await client
     .from("preferences")
     .select("id, name")
     .order("name", { ascending: true });
   ```

4. Serwis zwraca listę preferencji lub rzuca błąd, jeśli `error` jest zdefiniowane.

5. Handler formatuje odpowiedź jako `PreferencesResponseDTO` i zwraca `Response` z kodem 200.

## 6. Względy bezpieczeństwa

- Publiczny endpoint – brak uwierzytelnienia.

- Zabezpieczenie przeciw nadmiernym zapytaniom: rozważyć rate limiting.

- Sanitacja i walidacja parametrów wyjściowych (opcjonalnie Zod) w celu ochrony przed nieoczekiwanymi danymi.

## 7. Obsługa błędów

- Błąd bazy danych lub inne nieoczekiwane wyjątki:
  - Logowanie na serwerze (console.error).

  - Zwrócenie `500 Internal Server Error` z treścią `{ error: 'Internal server error' }`.

- Brak danych (pusta tabela) – zwrócenie `200 OK` z pustą tablicą w `data`.

## 8. Rozważania dotyczące wydajności

- Tabela preferencji zwykle ma niewielką liczbę wierszy.

- Sortowanie po nazwie po stronie bazy.

## 9. Kroki implementacji

1. Utworzyć schemat Zod w `src/schemas/preferences.ts`:

   ```ts
   import { z } from "zod";

   export const PreferenceSchema = z.object({
     id: z.string().uuid(),
     name: z.string().min(1),
   });

   export const GetPreferencesResponseSchema = z.object({
     data: z.array(PreferenceSchema),
   });
   ```

2. W folderze `src/services/preferencesService.ts` dodać funkcję:

   ```ts
   import type { SupabaseClient } from "../db/supabase.client";
   import type { PreferenceDTO } from "../types";

   export async function getAllPreferences(
     client: SupabaseClient,
   ): Promise<PreferenceDTO[]> {
     const { data, error } = await client
       .from("preferences")
       .select("id, name")
       .order("name", { ascending: true });
     if (error) throw new Error("Failed to retrieve preferences");
     return data || [];
   }
   ```

3. Utworzyć plik `src/pages/api/preferences.ts` z handlerem:

   ```ts
   import type { APIRoute } from "astro";
   import { getAllPreferences } from "../../services/preferencesService";
   import type { PreferencesResponseDTO } from "../../types";
   import { GetPreferencesResponseSchema } from "../../schemas/preferences";

   export const GET: APIRoute = async ({ locals }) => {
     try {
       const prefs = await getAllPreferences(locals.supabase);
       const response: PreferencesResponseDTO = { data: prefs };
       GetPreferencesResponseSchema.parse(response);
       return new Response(JSON.stringify(response), {
         status: 200,
         headers: { "Content-Type": "application/json" },
       });
     } catch (err) {
       console.error("Error fetching preferences:", err);
       return new Response(JSON.stringify({ error: "Internal server error" }), {
         status: 500,
         headers: { "Content-Type": "application/json" },
       });
     }
   };
   ```

4. Uzupełnić dokumentację w `README.md` i Swagger/OpenAPI`
