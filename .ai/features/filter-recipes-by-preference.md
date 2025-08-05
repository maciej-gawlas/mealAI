# RFC: Filtrowanie przepisów po preferencjach użytkownika

## 1. Status

- **Proponent:** zespół deweloperski
- **Status:** Proposal (Request for Comments)
- **Data:** 2025-08-05

## 2. Cel

Umożliwić użytkownikom filtrowanie listy przepisów według jednej z ich preferencji (np. wegańskie, bezglutenowe, niskowęglowodanowe).

## 3. Motywacja

- Usprawnienie nawigacji po dużej liście przepisów.
- Lepsze dopasowanie treści do indywidualnych potrzeb dietetycznych.
- Podniesienie użyteczności i personalizacji serwisu.

## 4. Zakres

- Komponent wyboru preferencji (`<PreferencesSelect />`) w klienckim komponencie listy.
- LIsta preferencji powinna zosta pobrana z backendu z endpointa `/api/preferences`
- Modyfikacja fetchowania przepisów z backendu / endpointu Astro w oparciu o query param `preference`.
- Stylowanie zgodnie z wytycznymi Tailwind (JIT, @apply, warstwy).

## 5. Szczegóły implementacji

### 5.1 Nowy komponent PreferencesSelect (React + TSX)

- Plik: `src/components/recipes/PreferencesSelect.tsx`
- Props:
  - `value: string`
  - `onChange: (pref: string) => void`
- Użycie hooków:
  - `useCallback` dla handlera zmiany
  - `useId` do unikalnego `id` elementu
- Styl:
  - @layer components
  - @apply border rounded px-3 py-2 focus:outline-none

### 5.2 Modyfikacja RecipesListClient

- Dodanie stanu `selectedPreference` (`useState<string>`).
- Wrapping fetch w `useEffect` zależny od `selectedPreference`.
- Fetch z `/api/recipes?preference=${selectedPreference}`.

### 5.3 Backend / Endpoint Astro

- Plik: `src/pages/api/recipes.ts` (Astro Server Endpoint)
- Odczyt parametru `preference` z `request.url.searchParams`.
- Filtracja po stronie serwera przed zwróceniem JSON-a.

### 5.4 Stylowanie i organizacja Tailwind

- W `tailwind.config.js`:
  - Dodanie warstwy `components` z klasą `.select-preference`.
- W CSS globalnym:

```css
@layer components {
  .select-preference {
    @apply border rounded px-3 py-2 focus:outline-none;
  }
}
```

- Responsive warianty: `sm:w-full md:w-1/3`
