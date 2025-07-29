# API Endpoint Implementation Plan: Get User Preferences

## 1. Przegląd punktu końcowego

Punkt końcowy `/users/me/preferences` umożliwia pobranie preferencji zalogowanego użytkownika. Endpoint zwraca listę mapowań pomiędzy identyfikatorem użytkownika a identyfikatorami preferencji. Dostęp do tego punktu końcowego jest zabezpieczony tokenem JWT.

## 2. Szczegóły żądania

- Metoda HTTP: GET
- Struktura URL: `/api/users/me/preferences`
- Parametry:
  - Wymagane: Brak
  - Opcjonalne: Brak
- Nagłówki:
  - Wymagane: `Authorization: Bearer <token>`

## 3. Wykorzystywane typy

```typescript
// Istniejące typy DTO
import type { UserPreferenceDTO } from "../types";
import type { UserPreferencesResponseDTO } from "../types";

// Rozszerzony typ dla odpowiedzi z nazwą preferencji
type ExtendedUserPreferenceDTO = UserPreferenceDTO & {
  name: string;
};

// Zaktualizowana odpowiedź zawierająca nazwy preferencji
interface ExtendedUserPreferencesResponseDTO {
  data: ExtendedUserPreferenceDTO[];
}
```

## 4. Szczegóły odpowiedzi

- Kody statusu:
  - 200 OK: Preferencje użytkownika zostały pomyślnie pobrane
  - 401 Unauthorized: Brak lub nieprawidłowy token autoryzacyjny
  - 500 Internal Server Error: Błąd serwera podczas pobierania preferencji

- Format odpowiedzi (200 OK):

```json
{
  "data": [
    { "user_id": "user-uuid", "preference_id": "uuid1", "name": "Vegan" },
    { "user_id": "user-uuid", "preference_id": "uuid3", "name": "Keto" }
  ]
}
```

## 5. Przepływ danych

1. Klient wysyła żądanie GET do `/api/users/me/preferences` z tokenem autoryzacyjnym
2. Middleware Astro waliduje token JWT i dodaje informacje o użytkowniku do `context.locals`
3. Endpoint pobiera ID użytkownika z `context.locals`
4. Endpoint wykonuje zapytanie do bazy danych Supabase, pobierając wszystkie preferencje dla zalogowanego użytkownika wraz z ich nazwami poprzez JOIN z tabelą preferences
5. Dane są mapowane do odpowiedniego formatu odpowiedzi zawierającego ID preferencji, ID użytkownika oraz nazwę preferencji
6. Odpowiedź jest zwracana do klienta

## 6. Względy bezpieczeństwa

- Autentykacja: Wymagany token JWT w nagłówku Authorization
- Autoryzacja: Użytkownik może pobierać tylko własne preferencje
- Walidacja danych: Nie jest wymagana walidacja danych wejściowych, ponieważ endpoint nie przyjmuje żadnych parametrów
- Row Level Security (RLS): Polityka RLS w Supabase zapewnia, że użytkownik może pobierać tylko swoje preferencje

## 7. Obsługa błędów

- 401 Unauthorized:
  - Brak tokenu JWT
  - Nieprawidłowy token JWT
  - Token JWT wygasł
- 500 Internal Server Error:
  - Błąd połączenia z bazą danych
  - Nieoczekiwany błąd podczas pobierania preferencji

## 8. Rozważania dotyczące wydajności

- Indeksowanie: Tabela `user_preferences` posiada indeks na kolumnie `user_id`, co zapewnia szybkie wyszukiwanie
- JOIN: Operacja JOIN między tabelami `user_preferences` i `preferences` jest wydajna dzięki kluczom podstawowym i obcym
- Cachowanie: Można rozważyć cachowanie preferencji użytkownika, jeśli są często pobierane i rzadko zmieniane
- Selektywne pobieranie kolumn: Zapytanie pobiera tylko potrzebne kolumny, co minimalizuje ilość przesyłanych danych

## 9. Etapy wdrożenia

1. Stworzenie nowego pliku `/src/pages/api/users/me/preferences.ts` dla implementacji endpointu
2. Implementacja funkcji getUserPreferences w istniejącym serwisie `userPreferencesService.ts`
3. Implementacja handlera żądania w pliku endpointu
4. Implementacja obsługi błędów i odpowiednich kodów statusu
5. Testowanie endpointu z różnymi scenariuszami (autoryzowany użytkownik, nieautoryzowany dostęp)
6. Dokumentacja endpointu w dokumentacji API

## 10. Przykładowa implementacja

### Dodanie nowej funkcji do serwisu userPreferencesService.ts

```typescript
/**
 * Gets all preferences for a specific user including preference names
 * @param supabase Supabase client instance
 * @param userId ID of the user whose preferences are being retrieved
 * @returns Array of user preference mappings with preference names
 * @throws Error if database operation fails
 */
export async function getUserPreferences(
  supabase: SupabaseClient,
  userId: string,
): Promise<(UserPreferenceDTO & { name: string })[]> {
  // Wykonaj JOIN między tabelami user_preferences i preferences, aby pobrać również nazwy preferencji
  const { data, error } = await supabase
    .from(DB_TABLES.USER_PREFERENCES)
    .select(
      `
      user_id,
      preference_id,
      ${DB_TABLES.PREFERENCES}!inner(name)
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to retrieve user preferences:", error);
    throw new Error("Failed to retrieve user preferences");
  }

  // Przekształć dane do oczekiwanego formatu
  const formattedData =
    data?.map((item) => ({
      user_id: item.user_id,
      preference_id: item.preference_id,
      name: item[DB_TABLES.PREFERENCES].name,
    })) || [];

  return formattedData;
}
```

### Implementacja endpointu w `/src/pages/api/users/me/preferences.ts`

```typescript
import type { APIRoute } from "astro";
import { getUserPreferences } from "../../../services/userPreferencesService";
// Użycie rozszerzonego typu odpowiedzi
import type { ExtendedUserPreferencesResponseDTO } from "../../../types";

export const GET: APIRoute = async ({ locals }) => {
  // Sprawdź czy użytkownik jest zalogowany
  if (!locals.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Pobierz preferencje użytkownika wraz z nazwami
    const userPreferences = await getUserPreferences(
      locals.supabase,
      locals.user.id,
    );

    // Przygotuj odpowiedź zgodnie z kontraktem API
    const response: ExtendedUserPreferencesResponseDTO = {
      data: userPreferences,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error retrieving user preferences:", error);

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
```
