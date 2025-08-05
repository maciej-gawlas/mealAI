# Plan implementacji widoku: Lista Przepisów

## 1. Przegląd

Widok "Lista Przepisów" jest głównym ekranem dla zalogowanego użytkownika, na którym może on przeglądać wszystkie swoje zapisane przepisy. Widok ten obsługuje dwa stany: listę przepisów w formie siatki oraz "pusty stan", który jest wyświetlany, gdy użytkownik nie ma jeszcze żadnych przepisów. Umożliwia również nawigację do szczegółów przepisu, a także inicjowanie procesu jego usunięcia.

## 2. Routing widoku

- **Ścieżka:** `/recipes`
- **Dostęp:** Widok chroniony, dostępny tylko dla zalogowanych użytkowników. Niezalogowani użytkownicy powinni być przekierowani na stronę logowania (`/login`).

## 3. Struktura komponentów

Hierarchia komponentów dla tego widoku będzie następująca:

```
/src/pages/recipes/index.astro  (Strona główna widoku)
└── /src/components/layout/Layout.astro (Główny layout aplikacji)
    ├── (Warunkowo) /src/components/recipes/RecipesList.astro
    │   └── (Pętla) /src/components/recipes/RecipeCard.astro
    │       └── /src/components/recipes/DeleteConfirmationDialog.tsx (Astro Island)
    └── (Warunkowo) /src/components/recipes/EmptyState.astro
        ├── /src/components/ui/button.tsx (Przycisk "Dodaj przepis")
        └── /src/components/ui/button.tsx (Przycisk "Generuj z AI")
```

## 4. Szczegóły komponentów

### `RecipesPage` (`/src/pages/recipes/index.astro`)

- **Opis:** Główny komponent strony. Odpowiada za sprawdzenie autentykacji, pobranie danych o przepisach użytkownika i warunkowe renderowanie `RecipesList` lub `EmptyState`.
- **Główne elementy:** Wykorzystuje `Layout.astro`. Wewnątrz renderuje jeden z dwóch głównych komponentów w zależności od liczby przepisów.
- **Obsługiwane interakcje:** Brak.
- **Obsługiwana walidacja:** Sprawdza, czy `Astro.locals.user` istnieje. Jeśli nie, przekierowuje na `/login`.
- **Typy:** `ListRecipesResponseDTO`
- **Propsy:** Brak.

### `RecipesList` (`/src/components/recipes/RecipesList.astro`)

- **Opis:** Komponent prezentacyjny, który renderuje siatkę kart z przepisami.
- **Główne elementy:** Kontener `div` z klasami Tailwind CSS do stworzenia responsywnej siatki (np. `grid`, `grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`). Wewnątrz pętla renderująca komponenty `RecipeCard`.
- **Obsługiwane interakcje:** Brak.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `RecipeViewModel[]`
- **Propsy:** `recipes: RecipeViewModel[]`

### `RecipeCard` (`/src/components/recipes/RecipeCard.astro`)

- **Opis:** Karta reprezentująca pojedynczy przepis. Cała karta jest linkiem do strony szczegółów przepisu. Zawiera również przycisk do usuwania.
- **Główne elementy:** Element `a` owijający całą kartę, prowadzący do `/recipes/[id]`. Wewnątrz elementy wyświetlające nazwę i datę utworzenia. Przycisk `Button` (z ikoną kosza) do usuwania oraz edycji.
- **Obsługiwane interakcje:**
  - Kliknięcie karty: nawigacja do strony szczegółów.
  - Kliknięcie przycisku "Usuń": uruchomienie `DeleteConfirmationDialog`.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `RecipeViewModel`
- **Propsy:** `recipe: RecipeViewModel`

### `EmptyState` (`/src/components/recipes/EmptyState.astro`)

- **Opis:** Komponent wyświetlany, gdy lista przepisów jest pusta. Zawiera tekst informacyjny i przyciski akcji.
- **Główne elementy:** Kontener `div` centrujący zawartość. Elementy tekstowe (`h2`, `p`) z komunikatem. Dwa komponenty `Button` (jako linki `<a>`) kierujące do `/recipes/new` i `/generate`.
- **Obsługiwane interakcje:**
  - Kliknięcie "Dodaj przepis": nawigacja do `/recipes/new`.
- **Obsługiwana walidacja:** Brak.
- **Typy:** Brak.
- **Propsy:** Brak.

### `DeleteConfirmationDialog` (`/src/components/recipes/DeleteConfirmationDialog.tsx`)

- **Opis:** Komponent React (Astro Island) wyświetlający modal z prośbą o potwierdzenie usunięcia przepisu. Będzie zarządzał swoim stanem (otwarty/zamknięty) i obsługiwał wywołanie API.
- **Główne elementy:** Wykorzystuje komponent `AlertDialog` z biblioteki `shadcn/ui`.
- **Obsługiwane interakcje:**
  - Potwierdzenie: wywołanie `DELETE /api/recipes/[id]`, wyświetlenie `Toast` i odświeżenie strony.
  - Anulowanie: zamknięcie okna dialogowego.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `RecipeViewModel`
- **Propsy:** `recipeId: string`, `recipeName: string`, `trigger: React.ReactNode` (element wyzwalający, np. przycisk).

## 5. Typy

### `RecipeDTO` (Typ danych z API)

Pochodzi bezpośrednio z `src/types.ts` i reprezentuje surowe dane z bazy danych.

```typescript
export type RecipeDTO = Tables<"recipes">;
// { id, user_id, name, ingredients, instructions, is_ai_generated, created_at, updated_at }
```

### `RecipeViewModel` (Nowy typ dla widoku)

Typ ten będzie używany do przekazywania danych do komponentów po ich sformatowaniu.

```typescript
export interface RecipeViewModel {
  id: string;
  name: string;
  createdAtFormatted: string; // sformatowana data, np. "23 lipca 2025"
}
```

## 6. Zarządzanie stanem

- **Poziom strony (`.astro`):** Stan jest zarządzany po stronie serwera. Dane są pobierane jednorazowo podczas renderowania strony i przekazywane jako propsy do komponentów potomnych.
- **Poziom komponentu (`.tsx`):** Komponent `DeleteConfirmationDialog` będzie zarządzał swoim stanem wewnętrznym za pomocą hooków `useState` w React:
  - `isOpen: boolean`: kontroluje widoczność modala.
  - `isDeleting: boolean`: do wyświetlania wskaźnika ładowania podczas operacji usuwania.
- **Custom Hook:** Można stworzyć hook `useDeleteRecipe` do enkapsulacji logiki usuwania (wywołanie API, obsługa stanu ładowania i błędów), aby utrzymać komponent `DeleteConfirmationDialog` w czystości.

## 7. Integracja API

### Pobieranie listy przepisów

- **Endpoint:** `GET /api/recipes`
- **Wywołanie:** Po stronie serwera w `src/pages/recipes/index.astro`. Zostanie wywołana funkcja `listRecipes` z `recipeService`.
- **Typ żądania:** Parametry zapytania (np. `page`, `limit`) przekazane do funkcji serwisowej.
- **Typ odpowiedzi:** `Promise<ListRecipesResponseDTO>`

### Usuwanie przepisu

- **Endpoint:** `DELETE /api/recipes/[id]`
- **Wywołanie:** Po stronie klienta, z komponentu `DeleteConfirmationDialog.tsx`.
- **Typ żądania:** `id` przepisu jest częścią URL. Wymagany jest nagłówek `Authorization`.
- **Typ odpowiedzi:** Oczekiwany status `204 No Content` w przypadku sukcesu.

## 8. Interakcje użytkownika

- **Przeglądanie listy:** Użytkownik przewija stronę, aby zobaczyć wszystkie załadowane przepisy.
- **Nawigacja do szczegółów:** Kliknięcie dowolnego miejsca na `RecipeCard` przenosi użytkownika na stronę `/recipes/[id]`.
- **Inicjowanie usunięcia:** Kliknięcie przycisku usuwania na `RecipeCard` otwiera `DeleteConfirmationDialog`.
- **Potwierdzenie usunięcia:** Kliknięcie przycisku "Potwierdź" w dialogu wysyła żądanie usunięcia, a następnie odświeża stronę w celu zaktualizowania listy.
- **Anulowanie usunięcia:** Kliknięcie "Anuluj" zamyka dialog bez żadnych dalszych działań.

## 9. Warunki i walidacja

- **Uwierzytelnianie:** Na poziomie strony `RecipesPage.astro` sprawdzane jest istnienie sesji użytkownika (`Astro.locals.user`). W przypadku jej braku, następuje przekierowanie na stronę logowania. Jest to kluczowy warunek dostępu do widoku.
- **Własność danych:** Backend jest odpowiedzialny za weryfikację, czy użytkownik usuwający przepis jest jego właścicielem. Frontend powinien być przygotowany na obsługę błędu `403 Forbidden` lub `404 Not Found`.

## 10. Obsługa błędów

- **Błąd pobierania listy:** Jeśli wywołanie API w `RecipesPage.astro` nie powiedzie się, strona powinna wyświetlić ogólny komunikat o błędzie zamiast listy przepisów.
- **Błąd usuwania przepisu:** Jeśli żądanie `DELETE` nie powiedzie się, `DeleteConfirmationDialog` powinien:
  1. Wyświetlić komunikat o błędzie za pomocą komponentu `Toast`.
  2. Zakończyć stan ładowania (`isDeleting = false`).
  3. Pozostawić otwarty dialog, aby użytkownik mógł spróbować ponownie lub go zamknąć.
- **Pusta lista:** Nie jest to błąd, ale osobny stan interfejsu. `RecipesPage` renderuje komponent `EmptyState`, gdy API zwróci pustą tablicę `data`.

## 11. Kroki implementacji

1.  **Utworzenie struktury plików:** Stwórz pliki: `/src/pages/recipes/index.astro`, `/src/components/recipes/RecipesList.astro`, `/src/components/recipes/RecipeCard.astro`, `/src/components/recipes/EmptyState.astro` i `/src/components/recipes/DeleteConfirmationDialog.tsx`.
2.  **Implementacja `RecipesPage`:**
    - Dodaj logikę sprawdzania uwierzytelnienia i przekierowania.
    - Zdefiniuj typ `RecipeViewModel` i zmapuj `RecipeDTO` na `RecipeViewModel` (głównie formatowanie daty).
    - Zaimplementuj logikę warunkowego renderowania `RecipesList` lub `EmptyState` na podstawie wyniku API.
3.  **Implementacja komponentów `RecipesList` i `RecipeCard`:**
    - Stwórz statyczne komponenty Astro, które przyjmują `propsy` i renderują dane.
    - Ostyluj komponenty za pomocą Tailwind CSS, zapewniając responsywność siatki.
    - W `RecipeCard` dodaj link `<a>` do strony szczegółów.
4.  **Implementacja `EmptyState`:**
    - Stwórz komponent z odpowiednim komunikatem i przyciskiem (link) do dodawania.
5.  **Implementacja `DeleteConfirmationDialog`:**
    - Stwórz komponent React jako Astro Island (`client:load`).
    - Użyj `AlertDialog` z `shadcn/ui`.
    - Zaimplementuj logikę wywołania API `DELETE` po kliknięciu przycisku potwierdzenia.
    - Dodaj obsługę stanu ładowania i błędów.
    - Po pomyślnym usunięciu, odśwież stronę (`window.location.reload()`).
6.  **Integracja i testowanie:**
    - Umieść `DeleteConfirmationDialog` w `RecipeCard`, przekazując niezbędne `propsy`.
    - Upewnij się, że cały przepływ działa: wyświetlanie listy, pusty stan, nawigacja, otwieranie dialogu, anulowanie i potwierdzanie usunięcia.
    - Przetestuj responsywność widoku.
