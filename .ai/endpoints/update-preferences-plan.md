# API Endpoint Implementation Plan: Update User Preferences

## 1. Przegląd punktu końcowego

Endpoint pozwala aktualizować (nadpisywać) mapowania preferencji dietetycznych zalogowanego użytkownika. Umożliwia podanie nowego zestawu identyfikatorów preferencji, które zostaną zapisane w tabeli `user_preferences`.

## 2. Szczegóły żądania

- Metoda HTTP: PUT
- Struktura URL: `/users/me/preferences`
- Nagłówki:
  - Authorization: Bearer &lt;accessToken&gt; (wymagane)
- Parametry ścieżki: brak
- Parametry zapytania: brak
- Request Body (JSON):

  ```json
  {
    "preferences": ["uuid1", "uuid2", ...]
  }
  ```

- Wymagane pola:
  - `preferences` (string[]) — lista UUID istniejących preferencji
- Opcjonalne pola: brak

## 3. Wykorzystywane typy

- `UpdateUserPreferencesCommand` (body input)
- `UserPreferenceDTO` (zwrotny typ pojedynczego rekordu)
- `UpdateUserPreferencesResponseDTO` (response wrapper)

## 4. Szczegóły odpowiedzi

- Status 200 OK
- Body (JSON):

  ```json
  {
    "data": [
      { "user_id": "user-uuid", "preference_id": "uuid1" },
      { "user_id": "user-uuid", "preference_id": "uuid2" }
    ]
  }
  ```

## 5. Przepływ danych

1. Middleware uwierzytelniania odczytuje sesję z `context.locals.supabase` i zwraca `userId` lub 401.
2. Handler odbiera żądanie, parsuje JSON.
3. Walidacja payload za pomocą Zod: `preferences: z.array(z.string().uuid())`.
4. Wywołanie serwisu:
   - `updateUserPreferences(userId, preferencesIds)`
   - w ramach transakcji:
     1. Usuń istniejące rekordy w `user_preferences` dla `userId`
     2. Wstaw nowe wpisy z podanego zestawu UUID
   - Zwróć wstawione rekordy.
5. Handler zwraca 200 z wypełnionym DTO.

## 6. Względy bezpieczeństwa

- Autoryzacja: tylko uwierzytelnieni użytkownicy mogą modyfikować własne dane (401 jeśli brak tokenu).
- Użycie RLS w Supabase (`user_preferences_owner` policy).
- Walidacja schematu zapytania (Zod) zapobiega wstrzyknięciom SQL.
- Ograniczenia bazy danych wymuszają istnienie `preference_id` i kaskadowe usuwanie.

## 7. Obsługa błędów

| Kod | Warunek                                 | Opis                                                 |
| --- | --------------------------------------- | ---------------------------------------------------- |
| 400 | Nieprawidłowy JSON / brak `preferences` | Zwróć komunikat o walidacji z Zod                    |
| 401 | Brak lub wygasły token autoryzacyjny    | Użytkownik nieautoryzowany                           |
| 404 | Podany UUID preferencji nie istnieje    | Zwróć informację, że dana preferencja nie znaleziona |
| 500 | Błąd serwera lub błąd bazy danych       | Loguj wewnętrznie, zwróć ogólny komunikat            |

## 8. Rozważenia dotyczące wydajności

- Bulk delete/inserts w pojedynczej transakcji minimalizują liczbę zapytań.
- Indeks na `user_preferences(user_id)` przyspiesza usuwanie.
- Cache wyników (opcjonalnie) — jeśli front często odpytywany o te same dane.

## 9. Kroki implementacji

1. **Dodanie schematu walidacji Zod**
   - Utworzyć `schemas/userPreferences.ts` z definicją `UpdateUserPreferencesCommandSchema`.
2. **Serwis aktualizacji**
   - Utworzyć `services/userPreferencesService.ts` z funkcją `updateUserPreferences(userId: string, prefs: string[]): Promise<UserPreferenceDTO[]>`.
3. **Handler API**
   - W `src/pages/api/users/me/preferences.ts` eksportować `export async function PUT({ request, locals }): Response`.
   - Odczytać `locals.supabase` i sesję, zweryfikować `userId`.
   - Parsować ciało, walidować schemat.
   - Wywołać `updateUserPreferences` i zwrócić `new Response(JSON.stringify({ data }), { status: 200 })`.
