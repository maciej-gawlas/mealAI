# Plan implementacji widoku Dodaj przepis

## 1. Przegląd

Celem tego widoku jest umożliwienie użytkownikom dodawania nowych przepisów do aplikacji. Widok oferuje dwie ścieżki: ręczne wprowadzanie danych przez formularz oraz automatyczne generowanie przepisu za pomocą AI na podstawie opisu tekstowego i wybranych preferencji. Widok ma być intuicyjny, responsywny i zapewniać płynne przełączanie się między trybem ręcznym a generowaniem AI.

## 2. Routing widoku

Widok powinien być dostępny pod następującą ścieżką:

- **Ścieżka**: `/recipes/add`

## 3. Struktura komponentów

Widok zostanie zaimplementowany jako strona Astro renderująca jeden główny komponent React, który zarządza całą logiką i stanem.

```
/src/pages/recipes/add.astro
└── /src/components/recipes/AddRecipeView.tsx (client:load)
    ├── Tabs (komponent z shadcn/ui)
    │   ├── Zakładka "Ręcznie"
    │   │   └── ManualRecipeForm.tsx
    │   │       ├── Form (z react-hook-form)
    │   │       ├── Input (dla nazwy)
    │   │       ├── Textarea (dla składników)
    │   │       ├── Textarea (dla instrukcji)
    │   │       ├── PreferenceCheckboxGroup.tsx
    │   │       └── Button "Zapisz"
    │   └── Zakładka "Generuj AI"
    │       └── AiRecipeGenerator.tsx
    │           ├── Form (z react-hook-form)
    │           ├── Input (dla description)
    │           ├── PreferenceCheckboxGroup.tsx
    │           ├── Button "Generuj"
    │           ├── (Warunkowo) Loader
    │           └── (Warunkowo) Disclaimer.tsx
    └── Toaster (komponent z sonner do powiadomień)
```

## 4. Szczegóły komponentów

### `AddRecipeView.tsx`

- **Opis komponentu**: Główny komponent-kontener, który zarządza stanem zakładek (Tabs) oraz koordynuje przepływ danych między formularzem ręcznym a generatorem AI. Odpowiada za logikę przełączania zakładek i przekazywania wygenerowanego przepisu do formularza ręcznego.
- **Główne elementy**: `Tabs` z `shadcn/ui` do nawigacji, `ManualRecipeForm`, `AiRecipeGenerator`.
- **Obsługiwane interakcje**: Przełączanie między zakładkami "Ręcznie" i "Generuj AI".
- **Typy**: `AIRecipeDTO` do przechowywania wyniku z AI.
- **Propsy**: Brak.

### `ManualRecipeForm.tsx`

- **Opis komponentu**: Formularz do ręcznego dodawania lub edycji (po wygenerowaniu przez AI) przepisu.
- **Główne elementy**: `form`, `Input` (nazwa), `Textarea` (składniki), `Textarea` (instrukcje), `PreferenceCheckboxGroup`, `Button` (Zapisz).
- **Obsługiwane interakcje**: Wprowadzanie danych, zaznaczanie preferencji, wysłanie formularza.
- **Obsługiwana walidacja**:
  - `name`: Wymagane, minimum 3 znaki.
  - `instructions`: Wymagane, minimum 10 znaków.
  - `ingredients`: Wymagane, minimum 10 znaków.
- **Typy**: `CreateRecipeCommand`, `ManualRecipeFormViewModel`.
- **Propsy**:
  - `initialData?: Partial<ManualRecipeFormViewModel>`: Opcjonalne dane do wstępnego wypełnienia formularza (używane po generacji AI).
  - `onSubmit: (data: CreateRecipeCommand) => Promise<void>`: Funkcja zwrotna wywoływana po pomyślnej walidacji i wysłaniu formularza.
  - `isSaving: boolean`: Flaga informująca o trwającym procesie zapisywania.

### `AiRecipeGenerator.tsx`

- **Opis komponentu**: Formularz do generowania przepisu przez AI. Użytkownik podaje opis, wybiera preferencje i inicjuje proces generowania.
- **Główne elementy**: `form`, `Input` (description), `PreferenceCheckboxGroup`, `Button` (Generuj), wskaźnik ładowania, `Disclaimer`.
- **Obsługiwane interakcje**: Wprowadzanie opisu, zaznaczanie preferencji, uruchomienie generowania.
- **Obsługiwana walidacja**:
  - `description`: Wymagane, minimum 5 znaków.
- **Typy**: `GenerateRecipeCommand`, `AiGeneratorFormViewModel`.
- **Propsy**:
  - `onRecipeGenerated: (recipe: AIRecipeDTO) => void`: Funkcja zwrotna wywoływana po pomyślnym wygenerowaniu przepisu.
  - `isGenerating: boolean`: Flaga informująca o trwającym procesie generowania.

### `PreferenceCheckboxGroup.tsx`

- **Opis komponentu**: Reużywalna grupa checkboxów do wyboru preferencji dietetycznych. Komponent sam pobiera listę dostępnych preferencji.
- **Główne elementy**: Kontener `div`, `Checkbox` i `Label` dla każdej preferencji.
- **Obsługiwane interakcje**: Zaznaczanie/odznaczanie preferencji.
- **Typy**: `PreferenceDTO`.
- **Propsy**:
  - `value: string[]`: Tablica ID zaznaczonych preferencji.
  - `onChange: (selectedIds: string[]) => void`: Funkcja zwrotna wywoływana przy zmianie zaznaczenia.

## 5. Typy

Do implementacji widoku, oprócz istniejących typów DTO, potrzebne będą następujące typy ViewModel do zarządzania stanem formularzy.

- **`ManualRecipeFormViewModel`**: Reprezentuje dane formularza ręcznego.
  ```typescript
  interface ManualRecipeFormViewModel {
    name: string;
    ingredients: string;
    instructions: string;
    preference_ids: string[];
  }
  ```
- **`AiGeneratorFormViewModel`**: Reprezentuje dane formularza generatora AI.
  ```typescript
  interface AiGeneratorFormViewModel {
    description: string;
    preferences: string[];
  }
  ```

## 6. Zarządzanie stanem

Stan będzie zarządzany lokalnie w komponencie `AddRecipeView.tsx` przy użyciu hooków React (`useState`, `useReducer` lub `useTransition`). Rozważone zostanie stworzenie customowego hooka `useAddRecipe` w celu hermetyzacji całej logiki.

- **Główne stany**:
  - `activeTab: 'manual' | 'ai'`: Przechowuje informację o aktywnej zakładce.
  - `generatedRecipe: AIRecipeDTO | null`: Przechowuje dane przepisu zwrócone przez AI.
  - `isGenerating: boolean`: Stan ładowania dla generatora AI (zarządzany przez `useTransition`).
  - `isSaving: boolean`: Stan ładowania dla zapisu ręcznego (zarządzany przez `useTransition`).
- **Biblioteki**: `react-hook-form` z `zod` do zarządzania formularzami i ich walidacji.

## 7. Integracja API

Komponenty będą komunikować się z dwoma endpointami API.

1.  **Generowanie przepisu AI**
    - **Endpoint**: `POST /api/recipes/generate`
    - **Typ żądania**: `GenerateRecipeCommand`
      ```typescript
      interface GenerateRecipeCommand {
        description: string;
        preferences: string[]; // Tablica ID preferencji
      }
      ```
    - **Typ odpowiedzi (sukces)**: `GenerateRecipeResponseDTO`
      ```typescript
      interface GenerateRecipeResponseDTO {
        recipe: AIRecipeDTO;
      }
      ```
2.  **Tworzenie przepisu (ręcznie)**
    - **Endpoint**: `POST /api/recipes`
    - **Typ żądania**: `CreateRecipeCommand`
      ```typescript
      type CreateRecipeCommand = Omit<
        TablesInsert<"recipes">,
        "id" | "user_id" | "created_at" | "updated_at"
      > & {
        preference_ids?: string[];
      };
      ```
    - **Typ odpowiedzi (sukces)**: `CreateRecipeResponseDTO` (czyli `RecipeDTO`)

## 8. Interakcje użytkownika

- **Przełączanie zakładek**: Użytkownik klika na nagłówek zakładki, co zmienia `activeTab` i renderuje odpowiedni formularz.
- **Generowanie AI**:
  1. Użytkownik wypełnia pole "description" i opcjonalnie zmienia preferencje.
  2. Klika "Generuj". Przycisk zostaje zablokowany, pojawia się wskaźnik ładowania.
  3. Po sukcesie: wskaźnik znika, aplikacja automatycznie przełącza się na zakładkę "Ręcznie", a formularz zostaje wypełniony danymi z AI. Pojawia się `Disclaimer`.
- **Zapis przepisu**:
  1. Użytkownik wypełnia formularz ręcznie (lub edytuje dane po generacji AI).
  2. Klika "Zapisz". Przycisk zostaje zablokowany, pojawia się wskaźnik ładowania.
  3. Po sukcesie: użytkownik jest przekierowywany na listę przepisów (`/recipes`) i widzi powiadomienie (toast) o powodzeniu.

## 9. Warunki i walidacja

- **Formularz ręczny (`ManualRecipeForm`)**:
  - Pole `name` nie może być puste (minimum 3 znaki).
  - Pole `instructions` nie może być puste (minimum 10 znaków).
  - Przycisk "Zapisz" jest nieaktywny, dopóki wymagane pola nie zostaną poprawnie wypełnione.
- **Formularz AI (`AiRecipeGenerator`)**:
  - Pole `description` nie może być puste (minimum 5 znaków).
  - Przycisk "Generuj" jest nieaktywny, dopóki pole `description` nie zostanie poprawnie wypełnione.
- Walidacja będzie realizowana w czasie rzeczywistym za pomocą `react-hook-form` i `zod`.

## 10. Obsługa błędów

- **Błąd pobierania preferencji**: W miejscu `PreferenceCheckboxGroup` wyświetlany jest komunikat o błędzie.
- **Błąd generowania AI**:
  - Wskaźnik ładowania znika.
  - Wyświetlany jest toast z komunikatem "Nie udało się wygenerować przepisu. Spróbuj ponownie."
  - Przycisk "Generuj" staje się ponownie aktywny.
- **Błąd zapisu przepisu**:
  - Wskaźnik ładowania znika.
  - Wyświetlany jest toast z komunikatem "Wystąpił błąd podczas zapisywania przepisu."
  - Przycisk "Zapisz" staje się ponownie aktywny, a dane w formularzu zostają zachowane.
- **Błędy walidacji**: Komunikaty o błędach wyświetlane są pod odpowiednimi polami formularza.

## 11. Kroki implementacji

1.  **Stworzenie plików**: Utworzenie plików `/src/pages/recipes/add.astro` oraz komponentów React: `AddRecipeView.tsx`, `ManualRecipeForm.tsx`, `AiRecipeGenerator.tsx`, `PreferenceCheckboxGroup.tsx`.
2.  **Struktura strony (`add.astro`)**: Implementacja strony Astro, która importuje i renderuje komponent `AddRecipeView.tsx` z dyrektywą `client:load`.
3.  **Komponent `PreferenceCheckboxGroup`**: Implementacja reużywalnego komponentu do pobierania i wyświetlania preferencji.
4.  **Komponent `AddRecipeView`**: Implementacja logiki zarządzania zakładkami i stanem głównym.
5.  **Formularz ręczny (`ManualRecipeForm`)**: Implementacja formularza z użyciem `react-hook-form` i `zod` do walidacji, integracja z `PreferenceCheckboxGroup`.
6.  **Formularz AI (`AiRecipeGenerator`)**: Implementacja formularza AI, również z `react-hook-form` i `zod`.
7.  **Integracja API**: Podłączenie logiki wywołań do endpointów `/api/recipes/generate` i `/api/recipes` w odpowiednich komponentach.
8.  **Zarządzanie stanem ładowania**: Implementacja wskaźników ładowania przy użyciu `useTransition` dla przycisków "Generuj" i "Zapisz".
9.  **Obsługa błędów i powiadomienia**: Dodanie obsługi błędów API i walidacji, implementacja powiadomień (toast) za pomocą `sonner`.
10. **Przepływ danych AI -> Manual**: Implementacja logiki, która po wygenerowaniu przepisu przez AI przekazuje dane do `ManualRecipeForm` i przełącza zakładkę.
11. **Stylowanie i testowanie**: Dopracowanie stylów za pomocą Tailwind CSS
