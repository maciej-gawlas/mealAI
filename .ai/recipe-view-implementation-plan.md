# Plan implementacji widoku: Szczegóły przepisu

## 1. Przegląd

Widok „Szczegóły przepisu” wyświetla kompletne informacje o jednym przepisie: nazwę, składniki, instrukcje oraz datę utworzenia. Zapewnia także możliwość usunięcia przepisu z dodatkowym potwierdzeniem i odpowiednim feedbackiem.

## 2. Routing widoku

- **Ścieżka:** `/recipes/:id`
- **Plik Astro:** `src/pages/recipes/[id].astro`
- **Dostęp:** Widok chroniony – użytkownik musi być zalogowany, w przeciwnym razie przekierowanie na `/login`.

## 3. Struktura komponentów

```text
/src/pages/recipes/[id].astro    (Strona Szczegóły przepisu)
└── <RecipeDetails />             (Komponent React klient)
    ├── <DeleteButtonWithConfirm />  (Przycisk Usuń + modal)
    │   └── <ModalConfirm />         (Uniwersalny komponent potwierdzenia)
    └── <Toast />                    (Powiadomienia o sukcesie/błędzie)
```

## 4. Szczegóły komponentów

### 4.1. RecipePage (`[id].astro`)

- **Opis:** Frontmatter Astro pobiera dane recepty z endpointu GET `/api/recipes/{id}` i przekazuje je do komponentu React.
- **Główne elementy:**
  - `<script lang="ts" context="server">` z wywołaniem `fetch`.
  - Import i render `<RecipeDetails recipe={recipe} />`.
- **Obsługiwane interakcje:** Brak – tylko inicjalne renderowanie.
- **Typy:** `RecipeDTO`

### 4.2. RecipeDetails (React)

- **Opis:** Renderuje sekcje:
  1. Nazwa przepisu (`<h1>` z `aria-labelledby`).
  2. Składniki (`<section>`).
  3. Instrukcje (`<section>`).
  4. Data utworzenia (`<time>`).
  5. Przycisk „Usuń”.
- **Obsługiwane interakcje:** Kliknięcie „Usuń” otwiera modal.
- **Walidacja:** Kontrola, że pola nie są puste.
- **Propsy:**
  - `recipe: RecipeViewModel`
  - `onDeleteSuccess: () => void`

### 4.3. DeleteButtonWithConfirm (React)

- **Opis:** Wyświetla przycisk „Usuń” i zarządza otwieraniem modalu.
- **Główne elementy:**
  - `<Button>` (shadcn/ui).
  - `<ModalConfirm>` z przekazanymi propsami.
- **Interakcje:**
  - Otwarcie modalu.
  - Potwierdzenie/Anulowanie.
- **Propsy:**
  - `recipeId: string`
  - `onSuccess: () => void`

### 4.4. ModalConfirm (React)

- **Opis:** Uniwersalny modal potwierdzający akcję.
- **Główne elementy:**
  - Nagłówek (`<h2>`), opis (`<p>`).
  - Przyciski „Anuluj” i „Potwierdź”.
- **Obsługiwane interakcje:**
  - Zamknięcie na `ESC`.
  - Focus trap wewnątrz modalu.
- **Propsy:**
  - `isOpen: boolean`
  - `title: string`
  - `description: string`
  - `onConfirm: () => Promise<void>`
  - `onCancel: () => void`

### 4.5. Toast (React)

- **Opis:** Wyświetla krótkie powiadomienia.
- **Główne elementy:** Ikona + tekst.
- **Interakcje:**
  - Automatyczne zamknięcie (3s).
  - Możliwość ręcznego zamknięcia.
- **Propsy:**
  - `message: string`
  - `type: 'success' | 'error'`

## 5. Typy

### 5.1. RecipeDTO

```ts
export interface RecipeDTO {
  id: string;
  user_id: string;
  name: string;
  ingredients: string;
  instructions: string;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
}
```

### 5.2. RecipeViewModel

```ts
export interface RecipeViewModel {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  createdAt: string; // sformatowana data, np. "23 lipca 2025"
}
```

## 6. Zarządzanie stanem

- Poziom komponentu (`RecipeDetails`):
  - `const [isModalOpen, setModalOpen] = useState(false)`
  - `const [isDeleting, setDeleting] = useState(false)`
  - `const [toasts, dispatchToast] = useReducer(toastReducer, [])`
- Custom hook `useDeleteRecipe(id: string, onSuccess: () => void)`:
  - Zarządzanie `loading`, `error` i wywołaniem API.

## 7. Integracja API

- **GET `/api/recipes/{id}`**
  - Odpowiedź: `RecipeDTO`.
- **DELETE `/api/recipes/{id}`**
  - Odpowiedź: status `204 No Content`.
- Nagłówki: `Content-Type: application/json`, `Authorization: Bearer <token>`

## 8. Interakcje użytkownika

1. Wejście na `/recipes/:id` → ładowanie, spinner.
2. Render danych → `RecipeDetails`.
3. Kliknięcie „Usuń” → otwarcie `ModalConfirm`.
4. Kliknięcie „Anuluj” → zamknięcie modalu.
5. Kliknięcie „Potwierdź” → `DELETE`, loader w przycisku.
6. Sukces → zamknięcie modalu, `Toast success`, przekierowanie na `/recipes`.
7. Błąd → `Toast error`, modal pozostaje otwarty.

## 9. Warunki i walidacja

- Sprawdzenie istnienia `id` w URL – jeśli błędny UUID lub 404, wyświetlić komunikat „Przepis nie znaleziony”.
- Przy usuwaniu obsłużyć statusy 401/403/404 jako error.

## 10. Obsługa błędów

- **GET:**
  - `404` → widok not found (komponent z komunikatem).
  - Inne → ogólny komunikat o błędzie.
- **DELETE:**
  1. Poniżej statusu 200/204 → `Toast error`.
  2. Wyłączenie `isDeleting`, pozostawienie modalu otwartego.

## 11. Kroki implementacji

1. Utworzyć plik `src/pages/recipes/[id].astro` z logiką fetch w frontmatter.
2. Zdefiniować i wyeksportować typy `RecipeDTO` i `RecipeViewModel`.
3. Stworzyć komponent `RecipeDetails.tsx` w `src/components/recipes`.
4. Zaimplementować `DeleteButtonWithConfirm`, `ModalConfirm` i `Toast` (lub wykorzystać shadcn/ui).
5. Dodać custom hook `useDeleteRecipe` dla logiki usuwania.
6. Ostylować komponenty Tailwindem zgodnie z wytycznymi (warianty responsywne, dark mode).
7. Zapewnić dostępność ARIA (aria-labelledby, focus trap) w `ModalConfirm`.
