## UI Architecture Planning Summary

- **Główne widoki i ekrany**
  1. Logowanie / Rejestracja
  2. Profil użytkownika (checkboxy preferencji + przycisk „Zapisz”)
  3. Lista przepisów (wszystkie bez paginacji, pusty stan zachęcający do dodania/generowania)
  4. Szczegóły przepisu (wyświetla wszystkie pola + tylko `created_at`)
  5. Dodaj przepis – pojedynczy widok z dwoma zakładkami:
     - **Ręcznie**: formularz name/ingredients/instructions
     - **Generuj AI**: pole prompt + checkboxy preferencji + przycisk „Generuj” → pod formularzem “Ręcznie”

- **Nawigacja i routing**
  - Bottom navigation na mobile: Home, Dodaj, Profil
  - Chronione trasy z redirectem do `/login` przy nieautoryzowanym dostępie
  - Astro + React Router dla routingu + guards

- **Interakcja z API i zarządzanie stanem**
  - Supabase Auth do zarządzania tokenem i auth state
  - Fetch preferencji raz przy mount zakładki Generuj AI
  - RTK Query / React Query do fetchowania i mutacji (przepisy, profil, generowanie AI)
  - Stan globalny auth w React Context lub Zustand

- **Formularze i generowanie AI**
  - Po kliknięciu „Generuj” pojedyncze wywołanie API (bez debounce/autoprefetch)
  - useTransition do loadera, wypełnienie formularza „Ręcznie” danymi AI
  - Edycja wygenerowanego przepisu przed zapisem
  - Disclaimer pod przyciskiem „Generuj”

- **UX/UI i komponenty**
  - Tailwind CSS (JIT, @layer, @apply, responsive sm:/md:/lg:, dark:)
  - shadcn/ui: Button, Modal, Checkbox, Tabs, Toast
  - Kluczowa dostępność: useId, aria-label, tabindex, keyboard navigation, WCAG kontrast
  - Modal confirm dla usuwania recepty + toast po sukcesie

- **Foldery i struktura projektu**
  - Feature-based:
    - `pages/` (Astro + React)
    - `components/`
    - `hooks/`
    - `services/` (API calls)
    - `store/` (Zustand / Context)

- **Obsługa błędów**
  - Centralny handler błędów API w hooku/useErrorHandler
  - Unified toast dla komunikatów o błędach i sukcesach
  - W zakładce AI: przycisk „Spróbuj ponownie” zamiast automatycznego retry

- **Dodatkowe założenia**
  - Całość bez paginacji – wszystkie przepisy ładowane jednorazowo
  - Bottom nav tylko na mobile, desktop: minimalny header
  - W widoku szczegółów widoczne tylko `created_at` jako metadane

## Unresolved Issues

- Brak nierozwiązanych kwestii – wszystkie
