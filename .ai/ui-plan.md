# Architektura UI dla HealthyMeal

## 1. Przegląd struktury UI

HealthyMeal opiera się na architekturze feature-based, w której każdy widok jest odrębną stroną lub komponentem. Całość zarządzana jest przez Astro z React Routerem i guardami dla chronionych tras. Stylizacja realizowana jest za pomocą Tailwind CSS, a interaktywne elementy pochodzą z biblioteki shadcn/ui.

Struktura folderów:

- pages/ (Astro + React)
- components/ (wspólne komponenty UI)
- hooks/ (logika fetchowania, error handling)
- services/ (API calls)
- store/ (Zustand / React Context dla auth)

## 2. Lista widoków

### 2.1. Logowanie / Rejestracja

- Ścieżka: `/login` (lub `/register`)
- Cel: uwierzytelnienie użytkownika
- Wyświetlane informacje: formularz e-mail, hasło; link „Zapomniałeś hasła?”
- Kluczowe komponenty: `AuthForm`, `Input`, `Button`, `Link` z aria-label
- UX/dostępność: focus management, etykiety form, aria-invalid dla błędów
- Bezpieczeństwo: walidacja po stronie klienta, komunikaty o błędach bez wycieku detali

### 2.2. Profil użytkownika

- Ścieżka: `/profile`
- Cel: zarządzanie preferencjami dietetycznymi
- Wyświetlane informacje: lista 5 checkboxów z preferencjami, przycisk „Zapisz”
- Kluczowe komponenty: `PreferenceCheckboxGroup`, `Button`, `Toast` na potwierdzenie zapisu
- UX/dostępność: useId dla checkboxów, aria-checked, tab-order, komunikat sukcesu/erro
- Bezpieczeństwo: chroniona trasa, fetch z tokenem w nagłówku

### 2.3. Lista przepisów

- Ścieżka: `/recipes`
- Cel: przegląd zapisanych przepisów lub pusty stan
- Wyświetlane informacje: siatka/lista `RecipeCard` (nazwa + data utworzenia), pusty stan z CTA
- Kluczowe komponenty: `RecipeCard`, `Toast`, `BottomNav` (na mobile)
- UX/dostępność: responsywność, focusable cards, empty state z opisem i buttonami
- Bezpieczeństwo: chroniona trasa, BFF/serwer filtry user_id

### 2.4. Szczegóły przepisu

- Ścieżka: `/recipes/:id`
- Cel: prezentacja pełnych danych pojedynczego przepisu
- Wyświetlane informacje: nazwa, składniki, instrukcje, created_at
- Kluczowe komponenty: `RecipeDetails`, `Button` (Usuń), `ModalConfirm`, `Toast`
- UX/dostępność: aria-labelledby, keyboard nav modal, potwierdzenie przed usunięciem
- Bezpieczeństwo: chroniona trasa, RLS row-level security

### 2.5. Dodaj przepis

- Ścieżka: `/recipes/add`
- Cel: stworzenie nowego przepisu (manual/AI)
- Zakładki:
  - Ręcznie: pola `Input name`, `Textarea ingredients`, `Textarea instructions`, `PreferenceCheckboxGroup`, `Button Zapisz`
  - Generuj AI: `Input prompt`, `PreferenceCheckboxGroup`, `Button Generuj`, loader, disclaimer
- Kluczowe komponenty: `Tabs`, `Form`, `useTransition` loader, `Toast`, `Disclaimer`
- UX/dostępność: responsive tabs, aria-controls, aria-selected, wyraźny loader, możliwość edycji danych AI
- Bezpieczeństwo: walidacja pól, obsługa błędów AI, retry button

## 3. Mapa podróży użytkownika

1. Użytkownik wchodzi na `/login` -> loguje się (US-002)
2. Przekierowanie do `/recipes` -> widzi listę przepisów lub pusty stan (US-009)
3. Klika „Dodaj” w BottomNav lub pustym stanie -> przechodzi do `/recipes/add` (US-007)
4. Wybiera zakładkę „Generuj AI”, wpisuje prompt, generuje (US-005)
5. Widzi loader -> po generacji edytuje dane -> zapisuje (US-005)
6. Powrót do `/recipes` z nową kartą przepisu
7. Kliknięcie karty -> `/recipes/:id` (US-010)
8. W widoku szczegółów usuwa przepis -> modal confirm -> toast (US-011)
9. W każdej chwili wybiera `/profile` z BottomNav -> zarządza preferencjami (US-004)

## 4. Układ i struktura nawigacji

- Mobile: `BottomNav` z ikonami Home(`/recipes`), Dodaj(`/recipes/add`), Profil(`/profile`)
- Desktop: minimalny `Header` z logo i linkami: Przepisy, Dodaj, Profil
- React Router: chronione trasy (`<PrivateRoute>`) wokół `/recipes*`, `/profile`;
  `/login`, `/register` dostępne anonimowo

## 5. Kluczowe komponenty

- RecipeCard: podsumowanie przepisu (nazwa, data)
- RecipeDetails: pełny widok przepisu
- PreferenceCheckboxGroup: opakowany zestaw checkboxów
- AuthForm: formularz logowania/rejestracji
- Tabs: abstrahowana nawigacja zakładek
- ModalConfirm: uniwersalny modal potwierdzenia
- Toast: globalny system powiadomień
- BottomNav / Header: elementy nawigacyjne
- Loader: spinner/indicator dla useTransition
- Disclaimer: komponent informacyjny pod AI generatorem
