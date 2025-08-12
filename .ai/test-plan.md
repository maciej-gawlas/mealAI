<plan_testów>

# Plan Testów dla Projektu "HealthyMeal"

---

## 1. Wprowadzenie i Cele Testowania

### 1.1. Wprowadzenie

Niniejszy dokument przedstawia kompleksowy plan testów dla aplikacji webowej "HealthyMeal". Aplikacja ta jest zbudowana w oparciu o nowoczesny stos technologiczny, w skład którego wchodzą Astro, React, TypeScript i Supabase. Umożliwia użytkownikom zarządzanie przepisami kulinarnymi, w tym ich tworzenie ręczne oraz generowanie z wykorzystaniem sztucznej inteligencji na podstawie preferencji dietetycznych.

Plan ten został przygotowany w celu usystematyzowania procesu weryfikacji jakości, zapewnienia stabilności oraz bezpieczeństwa aplikacji przed jej wdrożeniem produkcyjnym.

### 1.2. Cele Testowania

Główne cele procesu testowego to:

- **Weryfikacja funkcjonalna:** Zapewnienie, że wszystkie funkcjonalności aplikacji działają zgodnie ze specyfikacją, w tym uwierzytelnianie, zarządzanie przepisami (CRUD), generowanie AI i zarządzanie preferencjami.
- **Zapewnienie jakości UI/UX:** Sprawdzenie, czy interfejs użytkownika jest spójny, intuicyjny, responsywny i wolny od defektów wizualnych.
- **Identyfikacja i minimalizacja ryzyka:** Wczesne wykrycie i eliminacja potencjalnych problemów związanych z bezpieczeństwem, wydajnością i integracją z usługami zewnętrznymi (Supabase, OpenRouter).
- **Walidacja niezawodności:** Potwierdzenie, że aplikacja jest stabilna, poprawnie obsługuje błędy i zapewnia ciągłość działania kluczowych procesów.
- **Spełnienie kryteriów akceptacji:** Dostarczenie dowodów na to, że oprogramowanie spełnia zdefiniowane wymagania i jest gotowe do wdrożenia.

---

## 2. Zakres Testów

### 2.1. Funkcjonalności w Zakresie Testów

- **Moduł Uwierzytelniania i Autoryzacji:**
  - Rejestracja nowego użytkownika.
  - Logowanie i wylogowywanie.
  - Zarządzanie sesją użytkownika (middleware, obsługa tokenów).
  - Walidacja formularzy (poprawność e-maila, siła hasła).
  - Ochrona endpointów API wymagających autoryzacji.
- **Moduł Zarządzania Przepisami (CRUD):**
  - Ręczne tworzenie nowego przepisu.
  - Wyświetlanie listy przepisów użytkownika.
  - Filtrowanie listy przepisów po preferencjach dietetycznych.
  - Wyświetlanie szczegółów pojedynczego przepisu.
  - Usuwanie przepisu wraz z oknem dialogowym potwierdzenia.
- **Moduł Generowania Przepisów AI:**
  - Generowanie przepisu na podstawie opisu i wybranych preferencji.
  - Przenoszenie wygenerowanych danych do formularza ręcznego dodawania przepisu.
  - Obsługa stanu ładowania podczas generowania.
  - Integracja z serwisem OpenRouter.
- **Moduł Preferencji Użytkownika:**
  - Pobieranie i wyświetlanie dostępnych preferencji dietetycznych.
  - Możliwość przypisania preferencji do przepisu.
  - (Implikowany) Możliwość przypisania preferencji do profilu użytkownika.
- **Interfejs Użytkownika (UI):**
  - Responsywność widoków na różnych urządzeniach (desktop, mobile).
  - Działanie komponentów UI (przyciski, dialogi, toasty, formularze).
  - Poprawność wyświetlania stanów (ładowanie, błąd, brak danych - "Empty State").
- **Obsługa Błędów:**
  - Wyświetlanie komunikatów o błędach (toasty).
  - Działanie komponentów `ErrorBoundary`.
  - Obsługa błędów API (np. 401 Unauthorized, 404 Not Found, 500 Internal Server Error).

### 2.2. Funkcjonalności Poza Zakresem Testów

- Testowanie infrastruktury chmurowej Supabase i OpenRouter (testowana będzie jedynie poprawność integracji z ich API).
- Testy kompatybilności na przestarzałych lub niszowych przeglądarkach.
- Testowanie wewnętrznej logiki modeli AI dostarczanych przez OpenRouter.
- Szczegółowe testy penetracyjne (w ramach tego planu zostaną wykonane podstawowe testy bezpieczeństwa).

---

## 3. Typy Testów do Przeprowadzenia

Strategia testowania opiera się na piramidzie testów, aby zapewnić efektywność i szybkość informacji zwrotnej.

- **Testy Jednostkowe (Unit Tests):**
  - **Cel:** Weryfikacja małych, izolowanych fragmentów kodu (funkcje, schematy walidacji).
  - **Zakres:** Funkcje pomocnicze (`/lib/utils.ts`), schematy Zod (`/src/schemas/`), proste serwisy z zamockowanymi zależnościami.
- **Testy Komponentów (Component Tests):**
  - **Cel:** Testowanie komponentów React (`.tsx`) w izolacji od reszty aplikacji.
  - **Zakres:** Wszystkie interaktywne komponenty w `/src/components/`, weryfikacja ich renderowania, interakcji i logiki w odpowiedzi na akcje użytkownika.
- **Testy Integracyjne (Integration Tests):**
  - **Cel:** Weryfikacja współpracy pomiędzy różnymi częściami systemu.
  - **Zakres:**
    - Testowanie serwisów (`/src/services/`) i ich interakcji z zamockowanym klientem Supabase.
    - Testowanie endpointów API (`/src/pages/api/`) w celu weryfikacji logiki biznesowej, walidacji danych wejściowych i poprawności formatu odpowiedzi.
- **Testy End-to-End (E2E):**
  - **Cel:** Symulowanie pełnych scenariuszy użytkownika w przeglądarce, weryfikując całą aplikację od frontendu po bazę danych.
  - **Zakres:** Krytyczne ścieżki użytkownika, takie jak proces od rejestracji, przez stworzenie przepisu, aż po wylogowanie.
- **Testy Wizualnej Regresji (Visual Regression Tests):**
  - **Cel:** Automatyczne wykrywanie niezamierzonych zmian w interfejsie użytkownika.
  - **Zakres:** Kluczowe strony (lista przepisów, detale przepisu) oraz biblioteka komponentów UI.
- **Testy Wydajnościowe (Performance Tests):**
  - **Cel:** Ocena wydajności i skalowalności kluczowych endpointów API pod obciążeniem.
  - **Zakres:** `GET /api/recipes` (z filtrowaniem), `POST /api/recipes`.
- **Testy Bezpieczeństwa (Security Tests):**
  - **Cel:** Identyfikacja podstawowych luk bezpieczeństwa.
  - **Zakres:** Weryfikacja, czy użytkownik A nie ma dostępu do danych użytkownika B; sprawdzenie ochrony endpointów API.

---

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

Poniżej przedstawiono przykładowe scenariusze testowe wysokiego poziomu. Każdy z nich zostanie rozwinięty w szczegółowe przypadki testowe.

### 4.1. Moduł: Uwierzytelnianie

| ID Scenariusza | Opis                                                                                                                                                             | Oczekiwany Rezultat                                                                                                                       | Priorytet     |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| **AUTH-01**    | **Pomyślna rejestracja:** Użytkownik podaje prawidłowy, unikalny e-mail oraz hasło spełniające kryteria i je potwierdza.                                         | Użytkownik zostaje zarejestrowany, automatycznie zalogowany i przekierowany na stronę onboardingu.                                        | **Krytyczny** |
| **AUTH-02**    | **Nieudana rejestracja - e-mail zajęty:** Użytkownik próbuje się zarejestrować na istniejący już adres e-mail.                                                   | Wyświetlany jest czytelny komunikat błędu "Użytkownik o tym adresie email już istnieje".                                                  | **Wysoki**    |
| **AUTH-03**    | **Nieudana rejestracja - walidacja hasła:** Użytkownik podaje hasło niespełniające kryteriów (za krótkie, brak cyfry/znaku specjalnego) lub hasła nie są zgodne. | Pod odpowiednimi polami formularza wyświetlane są komunikaty o błędach walidacji. Rejestracja jest blokowana.                             | **Wysoki**    |
| **AUTH-04**    | **Pomyślne logowanie:** Użytkownik podaje prawidłowe dane logowania.                                                                                             | Użytkownik zostaje zalogowany i przekierowany na stronę z listą przepisów (`/recipes`). Wyświetla się toast o pomyślnym zalogowaniu.      | **Krytyczny** |
| **AUTH-05**    | **Nieudane logowanie:** Użytkownik podaje błędny e-mail lub hasło.                                                                                               | Wyświetlany jest toast z komunikatem "Nieprawidłowy e-mail lub hasło". Użytkownik pozostaje na stronie logowania.                         | **Wysoki**    |
| **AUTH-06**    | **Wylogowanie:** Zalogowany użytkownik klika przycisk "Wyloguj się".                                                                                             | Sesja użytkownika zostaje zakończona, a on sam przekierowany na stronę logowania (`/login`). Wyświetla się toast o pomyślnym wylogowaniu. | **Krytyczny** |

### 4.2. Moduł: Zarządzanie Przepisami (CRUD)

| ID Scenariusza | Opis                                                                                                                        | Oczekiwany Rezultat                                                                                                                   | Priorytet     |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ | :------------ |
| **REC-01**     | **Tworzenie ręczne przepisu:** Zalogowany użytkownik wypełnia formularz dodawania przepisu poprawnymi danymi i go zapisuje. | Przepis zostaje zapisany w bazie danych. Użytkownik jest przekierowywany do listy przepisów, gdzie widoczny jest nowo dodany element. | **Krytyczny** |
| **REC-02**     | **Wyświetlanie listy przepisów:** Zalogowany użytkownik przechodzi na stronę `/recipes`.                                    | Wyświetla się lista wszystkich przepisów należących do danego użytkownika.                                                            | **Krytyczny** |
| **REC-03**     | **Filtrowanie przepisów:** Użytkownik na liście przepisów wybiera filtr preferencji dietetycznej.                           | Lista zostaje przefiltrowana i wyświetla tylko te przepisy, które mają przypisaną wybraną preferencję.                                | **Wysoki**    |
| **REC-04**     | **Wyświetlanie pustego stanu:** Użytkownik, który nie ma żadnych przepisów, wchodzi na listę.                               | Wyświetlany jest komponent "EmptyState" z zachętą do dodania pierwszego przepisu.                                                     | **Średni**    |
| **REC-05**     | **Usuwanie przepisu:** Użytkownik klika ikonę usuwania na karcie przepisu i potwierdza operację w oknie dialogowym.         | Przepis zostaje trwale usunięty z bazy danych. Lista przepisów odświeża się, a usunięty element nie jest już widoczny.                | **Wysoki**    |
| **REC-06**     | **Ochrona dostępu:** Zalogowany użytkownik próbuje uzyskać dostęp (przez API lub URL) do przepisu innego użytkownika.       | Operacja kończy się niepowodzeniem (np. błąd 404 Not Found), a dane nie są ujawniane.                                                 | **Krytyczny** |

### 4.3. Moduł: Generowanie Przepisów AI

| ID Scenariusza | Opis                                                                                                           | Oczekiwany Rezultat                                                                                                                          | Priorytet  |
| :------------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :--------- |
| **AI-01**      | **Pomyślne generowanie przepisu:** Użytkownik wprowadza opis, wybiera preferencje i klika "Wygeneruj przepis". | Przycisk przechodzi w stan ładowania. Po chwili formularz ręcznego dodawania jest wypełniany danymi z AI. Wyświetlany jest toast o sukcesie. | **Wysoki** |
| **AI-02**      | **Obsługa błędu walidacji:** Użytkownik próbuje wygenerować przepis z za krótkim opisem.                       | Wyświetlany jest komunikat błędu walidacji pod polem opisu. Żądanie do API nie jest wysyłane.                                                | **Średni** |
| **AI-03**      | **Obsługa błędu API:** Podczas generowania występuje błąd po stronie serwera lub zewnętrznego API.             | Stan ładowania kończy się. Wyświetlany jest toast z informacją o niepowodzeniu.                                                              | **Wysoki** |

---

## 5. Środowisko Testowe

- **Środowisko lokalne:** Wykorzystywane przez deweloperów do uruchamiania testów jednostkowych i komponentów podczas pracy nad kodem.
- **Środowisko CI/CD (np. GitHub Actions):** Na tym środowisku automatycznie uruchamiane będą wszystkie typy testów (jednostkowe, komponentów, integracyjne, E2E) po każdym pushu do gałęzi `main` oraz przy tworzeniu Pull Requestów.
- **Środowisko testowe (Staging):** Dedykowana instancja aplikacji połączona z osobnym projektem Supabase (baza testowa), na której będą przeprowadzane testy manualne, eksploracyjne oraz wydajnościowe. Będzie ona odzwierciedleniem środowiska produkcyjnego.
- **Dane testowe:** Użycie dedykowanych kont użytkowników z predefiniowanym zestawem danych (przepisy, preferencje) w celu zapewnienia powtarzalności testów.
- **Klucze API:** Konfiguracja osobnych kluczy API (Supabase, OpenRouter) dla środowiska testowego, przechowywanych jako sekrety w CI/CD.
- **Przeglądarki:** Testy będą prowadzone na najnowszych, stabilnych wersjach przeglądarek:
  - Google Chrome
  - Mozilla Firefox
  - Apple Safari

---

## 6. Narzędzia do Testowania

| Typ Testu                           | Narzędzie                          | Uzasadnienie                                                                                                                                                                |
| :---------------------------------- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Runner**                     | **Vitest**                         | Zintegrowany z ekosystemem Vite, który jest używany przez Astro. Zapewnia szybkość i bogate API do asercji i mockowania.                                                    |
| **Testy Jednostkowe / Komponentów** | **Vitest + React Testing Library** | Standard w testowaniu aplikacji React. Umożliwia testowanie komponentów z perspektywy użytkownika, co zwiększa pewność ich działania.                                       |
| **Mockowanie API**                  | **Mock Service Worker (MSW)**      | Umożliwia przechwytywanie zapytań sieciowych na poziomie sieci, co pozwala na testowanie komponentów i E2E bez zależności od prawdziwego backendu.                          |
| **Testy Integracyjne API**          | **Vitest + Supertest**             | Supertest ułatwia wysyłanie żądań HTTP do endpointów API Astro i weryfikację odpowiedzi w testach integracyjnych.                                                           |
| **Testy End-to-End**                | **Playwright**                     | Nowoczesne i potężne narzędzie od Microsoftu, oferujące szybkie i stabilne testy E2E na wielu przeglądarkach, z zaawansowanymi funkcjami jak auto-wait i nagrywanie testów. |
| **Testy Wizualnej Regresji**        | **Percy / Chromatic**              | Integracja z Playwright/Cypress oraz GitHub, co pozwala na łatwe wdrożenie i przeglądanie zmian wizualnych w Pull Requestach.                                               |
| **Testy Wydajnościowe**             | **k6 (Grafana)**                   | Potężne narzędzie open-source do testów obciążeniowych, umożliwiające pisanie scenariuszy w JavaScripcie.                                                                   |

---

## 7. Harmonogram Testów

Proces testowania będzie prowadzony w sposób ciągły, zintegrowany z cyklem rozwoju oprogramowania.

- **Faza rozwoju (Development Sprint):**
  - Deweloperzy są odpowiedzialni za pisanie testów jednostkowych i komponentów dla nowo tworzonych funkcjonalności.
  - Inżynier QA przygotowuje scenariusze testowe dla nadchodzących zadań.
- **Przed złączeniem do `main` (Pull Request):**
  - Automatycznie uruchamiany jest pełny zestaw testów jednostkowych, komponentów i integracyjnych.
  - Inżynier QA wykonuje przegląd kodu pod kątem pokrycia testami i potencjalnych ryzyk.
- **Po złączeniu do `main` (deployment na Staging):**
  - Automatycznie uruchamiany jest pełny zestaw testów E2E.
  - Inżynier QA przeprowadza testy eksploracyjne i weryfikuje nowe funkcjonalności manualnie.
- **Faza przedprodukcyjna (Pre-release):**
  - Uruchomienie testów regresji (pełne E2E).
  - Przeprowadzenie testów wydajnościowych.
  - Ostateczna akceptacja przez zespół.

---

## 8. Kryteria Akceptacji Testów

### 8.1. Kryteria Wejścia (Rozpoczęcia Testów)

- Kod dla danej funkcjonalności został ukończony i zintegrowany.
- Aplikacja pomyślnie się buduje i jest wdrożona na środowisku testowym.
- Testy jednostkowe i komponentów napisane przez deweloperów przechodzą pomyślnie.

### 8.2. Kryteria Wyjścia (Zakończenia Testów)

- **100%** przypadków testowych dla ścieżek krytycznych (priorytet "Krytyczny") musi zakończyć się sukcesem.
- **Minimum 95%** wszystkich zdefiniowanych przypadków testowych musi zakończyć się sukcesem.
- Pokrycie kodu testami (Code Coverage) powinno wynosić **minimum 80%**.
- Wszystkie zidentyfikowane błędy o priorytecie "Krytyczny" i "Wysoki" muszą zostać naprawione.
- Testy wydajnościowe nie wykazują degradacji w stosunku do poprzedniej wersji.
- Brak nierozwiązanych, krytycznych defektów wizualnych.

---

## 9. Role i Odpowiedzialności

- **Deweloperzy:**
  - Tworzenie testów jednostkowych i komponentów.
  - Naprawa błędów wykrytych podczas testów.
  - Utrzymywanie jakości kodu.
- **Inżynier QA:**
  - Projektowanie i utrzymanie planu testów.
  - Tworzenie i automatyzacja testów integracyjnych i E2E.
  - Przeprowadzanie testów manualnych i eksploracyjnych.
  - Raportowanie i zarządzanie cyklem życia błędów.
  - Analiza wyników testów i raportowanie o stanie jakości oprogramowania.
- **DevOps/Inżynier Infrastruktury:**
  - Konfiguracja i utrzymanie środowisk testowych.
  - Integracja testów automatycznych z potokiem CI/CD.
- **Product Owner / Manager Projektu:**
  - Definiowanie wymagań i kryteriów akceptacji.
  - Priorytetyzacja naprawy błędów.

---

## 10. Procedury Raportowania Błędów

Wszystkie wykryte błędy będą raportowane i śledzone za pomocą narzędzia **GitHub Issues**.

### 10.1. Struktura Zgłoszenia Błędu

Każde zgłoszenie błędu musi zawierać następujące informacje:

- **Tytuł:** Zwięzły i jednoznaczny opis problemu.
- **Projekt/Komponent:** Obszar aplikacji, którego dotyczy błąd (np. `Auth`, `RecipeForm`).
- **Opis:**
  - **Kroki do odtworzenia (Steps to Reproduce):** Szczegółowa, ponumerowana lista kroków.
  - **Oczekiwany rezultat (Expected Result):** Jak system powinien się zachować.
  - **Rzeczywisty rezultat (Actual Result):** Jak system faktycznie się zachował.
- **Środowisko:** Gdzie błąd został zaobserwowany (np. `Chrome 125, Staging, macOS`).
- **Priorytet/Waga (Severity):**
  - **Krytyczny (Blocker):** Uniemożliwia dalsze testy lub działanie kluczowej funkcjonalności.
  - **Wysoki (Major):** Poważny błąd funkcjonalny, ale istnieje obejście.
  - **Średni (Minor):** Błąd funkcjonalny o niewielkim wpływie lub defekt UI.
  - **Niski (Trivial):** Literówka, niewielki problem estetyczny.
- **Załączniki:** Zrzuty ekranu, nagrania wideo, logi z konsoli przeglądarki.

### 10.2. Cykl Życia Błędu

1.  **New:** Błąd został zgłoszony.
2.  **In Review:** Błąd jest analizowany przez zespół.
3.  **To Do:** Błąd został zaakceptowany i czeka na przypisanie do dewelopera.
4.  **In Progress:** Trwają prace nad naprawą błędu.
5.  **Ready for QA:** Błąd został naprawiony i jest gotowy do weryfikacji na środowisku testowym.
6.  **Closed:** Inżynier QA potwierdził naprawę.
7.  **Reopened:** Weryfikacja nie powiodła się, błąd wraca do dewelopera.

</plan_testów>
