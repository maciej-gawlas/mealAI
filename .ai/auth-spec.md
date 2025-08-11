# Specyfikacja modułu uwierzytelniania — rejestracja, logowanie i odzyskiwanie hasła (MVP)

Poniższa specyfikacja opisuje architekturę implementacji funkcjonalności rejestracji i logowania użytkowników oraz scenariusz manualnego resetu hasła w aplikacji HealthyMeal, zgodnie z założeniami MVP.

---

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Struktura stron i layoutów

- **Layouty ogólne**
  - `Layout.astro` (publiczny, `non-auth`): nagłówek z przyciskami „Zaloguj” i „Zarejestruj”.
  - `AuthLayout.astro` (chroniony, `auth`): nagłówek z przyciskiem „Wyloguj” w prawym górnym rogu.

- **Nowe strony (w folderze `src/pages`)**
  - `/login.astro` — strona logowania.
  - `/register.astro` — strona rejestracji.
  - `/onboarding.astro` — strona powitalna po rejestracji (onboarding).
  - `/forgot-password.astro` — strona instrukcji resetu (jedynie komunikat, kontakt mailowy).

### 1.2 Komponenty client-side (React)

- `LoginForm.tsx`
  - Pola: email (input typu `email`), password (input typu `password`).
  - Walidacja lokalna: format e-mail, minimalna długość hasła, obecność cyfry i znaku specjalnego.
  - Przekazuje dane do usługi AuthService.
  - Wyświetla komunikaty błędów (np. "Nieprawidłowy e-mail lub hasło").

- `RegisterForm.tsx`
  - Pola: email, password, confirmPassword.
  - Mechanizm potwierdzenia hasła.
  - Walidacja: podobnie jak w LoginForm, dodatkowo zgodność confirmPassword.
  - Obsługa błędów biznesowych zwracanych z backendu (np. „Użytkownik już istnieje”).

- `ForgotPasswordNotice.tsx`
  - Prosty komponent z tekstem: „Aby zresetować hasło, wyślij wiadomość na <mailto:pomoc@healthymeal.app>”.

### 1.3 Integracja i nawigacja

- Domyślnie każdy nieautoryzowany użytkownik próbujący uzyskać dostęp do chronionej trasy zostanie przekierowany na `/login`.
- Nawigacja między stronami realizowana za pomocą linków Astro `<a href="/login">` itp.
- Po pomyślnym zarejestrowaniu użytkownika: przekierowanie na stronę onboarding `/onboarding`.
- Po pomyślnym zalogowaniu: przekierowanie do głównej strony przepisów `/recipes`.
- W przypadku błędu walidacji: blokowanie submita oraz wyświetlenie inline komunikatów.

### 1.4 Scenariusze i obsługa błędów

1. **Rejestracja**
   - Błędna struktura e-mail: komunikat „Nieprawidłowy format adresu e-mail.”
   - Hasło < 6 znaków lub brak cyfry/znaku specjalnego: „Hasło musi mieć min. 6 znaków, w tym 1 cyfrę i 1 znak specjalny.”
   - confirmPassword != password: „Hasła nie są takie same.”
   - Backend zwraca 409: „Użytkownik o tym adresie e-mail już istnieje.”

2. **Logowanie**
   - Nieuzupełnione pola: komunikat „Pole nie może być puste.”
   - Błędny login/hasło: „Nieprawidłowy e-mail lub hasło.”

3. **Odzyskiwanie hasła**
   - Jedyna ścieżka: przekierowanie do `forgot-password` z komunikatem kontaktu mailowego.

---

## 2. LOGIKA BACKENDOWA

### 2.1 Endpoints API (folder `src/pages/api/auth`)

- **POST `/api/auth/register`**
  - Body: `{ email: string, password: string }`.
  - Walidacja: email RFC, regex dla hasła (`/(?=.*\d)(?=.*[!@#$%^&*])/`, długość >= 6).
  - Logika:
    1. Sprawdzenie istnienia użytkownika w Supabase.
    2. Wywołanie `supabase.auth.signUp({ email, password })`.
    3. Obsługa błędów (409 gdy zajęty e-mail, 400 dla nieprawidłowych danych).
  - Odpowiedź: 201 + `{ user }` lub 4xx + `{ error: string }`.

- **POST `/api/auth/login`**
  - Body: `{ email: string, password: string }`.
  - Logika:
    1. `supabase.auth.signInWithPassword({ email, password })`.
    2. Obsługa błędów 401/400.
  - Odpowiedź: 200 + `{ session }` lub 401 + `{ error: string }`.

- **POST `/api/auth/logout`**
  - Header: session token lub cookie.
  - Logika: `supabase.auth.signOut()`.
  - Odpowiedź: 204.

- **GET `/api/auth/user`**
  - Pobranie aktualnej sesji i danych użytkownika.
  - Używane przez `AuthLayout.astro` do warunkowego renderowania.

### 2.2 Modele danych i walidacja

- Schematy Zod (w folderze `src/schemas/auth.ts`):
  - `registerSchema` and `loginSchema`.
  - Reguły odpowiadające wymaganiom hasła.

- Usługi (`src/services/authService.ts`):
  - Funkcje `register`, `login`, `logout`, `getUser` wykorzystujące `supabase.client.ts`.
  - Obsługa i normalizacja błędów (throw ApiError z kodem i opisem).

### 2.3 Obsługa wyjątków i middleware

- Globalny handler błędów w `src/middleware/index.ts`:
  - Przechwytuje wyjątki z API, zwraca ujednolicone odpowiedzi.
  - Loguje błędy po stronie serwera (wersja produkcyjna/rozwojowa).

- Middleware SSR w `astro.config.mjs`:
  - Dodanie nagłówka Cookie/session do SSR, by sprawdzić stan zalogowania na stronach chronionych.
  - Warunkowe przekierowania (np. dostęp do `/recipes` tylko dla zalogowanych).

---

## 3. SYSTEM AUTENTYKACJI — Supabase Auth

### 3.1 Konfiguracja Supabase

- Ustawienie cookie-based auth (`auth.persistSession: true`) dla SSR.

### 3.2 Mechanizmy auth w Astro

- **Ochrona tras** w `AuthLayout.astro`:
  - W `getStaticProps` / `getServerSideProps` (Astro-style): pobranie sesji z Supabase.
  - Jeśli brak sesji: przekierowanie do `/login`.

- **Przechowywanie stanu** client-side:
  - Hook `useSession` w `src/hooks/useSession.ts`: nasłuchiwanie zmiany sesji Supabase i aktualizacja kontekstu React.
  - `SessionContext` dla dostępu do danych użytkownika w komponentach.

- **Wylogowanie**:
  - Wywołanie `POST /api/auth/logout`, czyszczenie sesji, przekierowanie na `login`.

### 3.3 Brak automatycznego resetu hasła

- W MVP jedynie strona informacyjna `forgot-password.astro` z komponentem `ForgotPasswordNotice.tsx`.
- Nie implementujemy workflow resetu, wymuszamy kontakt mailowy.

---

### Wnioski

- Rozwiązanie opiera się w pełni na Supabase Auth, integrując funkcje rejestracji, logowania i wylogowywania.
- Architektura UI wykorzystuje podział na layouty publiczne i chronione oraz dedykowane formularze w React.
- Backend API implementuje RESTowe endpointy obsługujące wszystkie scenariusze z walidacją Zod i globalnym handlerem błędów.
- Manualne odzyskiwanie hasła ograniczone do komunikatu instrukcyjnego, zgodnie z MVP.

---

End of spec
