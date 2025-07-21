# Dokument wymagań produktu (PRD) - HealthyMeal (MVP)

## 1. Przegląd produktu

HealthyMeal to aplikacja mobilna w wersji MVP (Minimum Viable Product), której celem jest uproszczenie procesu tworzenia przepisów kulinarnych dopasowanych do indywidualnych potrzeb żywieniowych użytkownika. Aplikacja wykorzystuje sztuczną inteligencję (AI) do generowania nowych przepisów na podstawie zapytań tekstowych oraz predefiniowanych preferencji dietetycznych użytkownika. Użytkownicy mogą również ręcznie zapisywać i zarządzać własnymi przepisami. Komunikacja aplikacji ma być utrzymana w nowoczesnym, luźnym i przyjaznym tonie ("cool").

## 2. Problem użytkownika

Użytkownicy, którzy chcą gotować zdrowo i zgodnie ze swoimi restrykcjami lub preferencjami dietetycznymi (np. alergie, wegetarianizm, dieta bezglutenowa), napotykają na trudności w dostosowywaniu ogólnodostępnych przepisów znalezionych w internecie. Proces ten jest często czasochłonny, wymaga wiedzy o zamiennikach i nie zawsze gwarantuje smaczny rezultat. HealthyMeal rozwiązuje ten problem, oferując spersonalizowane przepisy generowane przez AI, co oszczędza czas i eliminuje niepewność.

## 3. Wymagania funkcjonalne

### 3.1. System kont użytkowników

- Użytkownik może założyć nowe konto, podając adres e-mail i hasło.
- Hasło musi mieć minimum 6 znaków, w tym co najmniej jeden znak specjalny i jedną cyfrę.
- Użytkownik może zalogować się do aplikacji za pomocą swojego e-maila i hasła.
- W MVP nie ma funkcji automatycznego odzyskiwania hasła. W przypadku utraty hasła, użytkownik musi skontaktować się z administracją poprzez podany w aplikacji adres e-mail w celu manualnego resetu.

### 3.2. Profil użytkownika

- Każdy użytkownik ma stronę profilu.
- Na stronie profilu użytkownik może wybrać i zapisać swoje preferencje żywieniowe z predefiniowanej listy 5 opcji.

### 3.3. Zarządzanie przepisami (CRUD)

- Tworzenie (Create): Użytkownik może dodać przepis na dwa sposoby:
  1.  Ręcznie, poprzez formularz z polami: Nazwa, Składniki, Instrukcje.
  2.  Automatycznie, generując go za pomocą AI.
- Odczyt (Read): Użytkownik może przeglądać listę wszystkich swoich zapisanych przepisów. Po kliknięciu na przepis z listy, wyświetlane są jego szczegóły (nazwa, składniki, instrukcje).
- Aktualizacja (Update): Funkcja edycji istniejących przepisów nie wchodzi w zakres MVP.
- Usuwanie (Delete): Użytkownik może usunąć dowolny ze swoich przepisów. Usunięcie wymaga potwierdzenia w oknie dialogowym (popup).

### 3.4. Generowanie przepisów przez AI

- Aplikacja posiada dedykowany ekran do generowania przepisów.
- Ekran zawiera pole tekstowe, w którym użytkownik wpisuje opis dania (np. "szybki wegański lunch").
- Pod polem tekstowym znajdują się pola wyboru (checkbox) z 5 predefiniowanymi preferencjami żywieniowymi.
- Preferencje są domyślnie zaznaczone zgodnie z ustawieniami w profilu użytkownika, ale można je tymczasowo zmienić na potrzeby konkretnego zapytania.
- Po zatwierdzeniu, aplikacja wysyła zapytanie do API OpenAI i oczekuje na odpowiedź. W tym czasie wyświetlany jest stan ładowania.
- API OpenAI musi zwrócić dane w ustrukturyzowanym formacie JSON: `{name, ingredients, instructions}`.
- W przypadku błędu komunikacji z API, użytkownikowi wyświetlany jest stosowny komunikat z możliwością ponowienia próby.
- Przy każdym przepisie wygenerowanym przez AI musi być widoczne i jednoznaczne ostrzeżenie (disclaimer) informujące o potencjalnym ryzyku (np. obecności alergenów) i konieczności weryfikacji składników.

## 4. Granice produktu

Następujące funkcjonalności celowo NIE wchodzą w zakres wersji MVP:

- Importowanie przepisów z zewnętrznych stron internetowych (URL).
- Dodawanie, przechowywanie i wyświetlanie zdjęć lub filmów do przepisów.
- Funkcje społecznościowe, takie jak udostępnianie przepisów innym użytkownikom, komentowanie czy ocenianie.
- Modyfikowanie istniejących przepisów za pomocą AI.
- Automatyczna weryfikacja adresu e-mail po rejestracji.
- Zautomatyzowany system resetowania hasła ("zapomniałem hasła").
- Panel administracyjny do zarządzania użytkownikami.

## 5. Historyjki użytkowników

---

- ID: US-001
- Tytuł: Rejestracja nowego konta
- Opis: Jako nowy użytkownik, chcę móc założyć konto w aplikacji za pomocą adresu e-mail i hasła, aby móc zapisywać swoje przepisy i preferencje.
- Kryteria akceptacji:
  1.  Gdy podam poprawny adres e-mail i hasło spełniające wymagania (min. 6 znaków, 1 cyfra, 1 znak specjalny), konto zostaje utworzone.
  2.  Po pomyślnej rejestracji jestem automatycznie zalogowany i przekierowany do głównego ekranu aplikacji.
  3.  Gdy spróbuję użyć e-maila, który już istnieje w systemie, zobaczę komunikat o błędzie "Użytkownik o tym adresie e-mail już istnieje".
  4.  Gdy hasło nie spełnia wymagań, zobaczę komunikat o błędzie wyjaśniający te wymagania.

---

- ID: US-002
- Tytuł: Logowanie do aplikacji
- Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się do aplikacji przy użyciu mojego e-maila i hasła, aby uzyskać dostęp do moich przepisów.
- Kryteria akceptacji:
  1.  Gdy podam prawidłowy e-mail i hasło, zostaję pomyślnie zalogowany.
  2.  Po zalogowaniu widzę ekran z listą moich przepisów.
  3.  Gdy podam nieprawidłowy e-mail lub hasło, zobaczę komunikat o błędzie "Nieprawidłowy e-mail lub hasło".

---

- ID: US-003
- Tytuł: Manualne odzyskiwanie hasła
- Opis: Jako użytkownik, który zapomniał hasła, chcę mieć jasną informację, jak mogę je odzyskać, abym mógł ponownie uzyskać dostęp do konta.
- Kryteria akceptacji:
  1.  Na ekranie logowania znajduje się link lub informacja "Zapomniałeś hasła?".
  2.  Po kliknięciu w link wyświetla się informacja instruująca mnie, abym skontaktował się z pomocą techniczną pod adresem e-mail `pomoc@healthymeal.app` w celu manualnego zresetowania hasła.

---

- ID: US-004
- Tytuł: Konfiguracja preferencji żywieniowych
- Opis: Jako użytkownik, chcę móc zdefiniować swoje preferencje żywieniowe w profilu, aby generowane przez AI przepisy były do mnie dopasowane.
- Kryteria akceptacji:
  1.  W moim profilu znajduje się sekcja z 5 predefiniowanymi preferencjami żywieniowymi (checkboxy).
  2.  Mogę zaznaczyć i odznaczyć dowolną liczbę preferencji.
  3.  Po naciśnięciu przycisku "Zapisz", moje wybory zostają zapisane na stałe w moim profilu.
  4.  Przy ponownym wejściu na stronę profilu widzę moje wcześniej zapisane preferencje.

---

- ID: US-005
- Tytuł: Generowanie przepisu przez AI
- Opis: Jako użytkownik, chcę móc wygenerować nowy przepis na podstawie krótkiego opisu i moich preferencji dietetycznych, aby szybko znaleźć pomysł na posiłek.
- Kryteria akceptacji:
  1.  Na ekranie generowania widzę pole tekstowe do wpisania opisu potrawy.
  2.  Widzę również listę preferencji, które są domyślnie zaznaczone zgodnie z moim profilem.
  3.  Mogę tymczasowo zmienić zaznaczenie preferencji na potrzeby tego jednego zapytania.
  4.  Po wpisaniu opisu i kliknięciu "Generuj", widzę wskaźnik ładowania.
  5.  Po pomyślnym wygenerowaniu, przepis jest wyświetlany na ekranie (nazwa, składniki, instrukcje) wraz z opcją zapisania go.
  6.  Przy wygenerowanym przepisie widoczny jest disclaimer dotyczący bezpieczeństwa AI.

---

- ID: US-006
- Tytuł: Obsługa błędu generowania AI
- Opis: Jako użytkownik, w przypadku problemu z wygenerowaniem przepisu przez AI, chcę otrzymać czytelny komunikat o błędzie.
- Kryteria akceptacji:
  1.  Gdy API OpenAI zwróci błąd lub wystąpi problem z połączeniem, wskaźnik ładowania znika.
  2.  Na ekranie pojawia się komunikat o błędzie, np. "Nie udało się wygenerować przepisu. Spróbuj ponownie.".
  3.  Mam możliwość ponowienia próby generowania.

---

- ID: US-007
- Tytuł: Ręczne dodawanie przepisu
- Opis: Jako użytkownik, chcę móc ręcznie dodać własny przepis do aplikacji, aby przechowywać go w mojej cyfrowej książce kucharskiej.
- Kryteria akceptacji:
  1.  Istnieje formularz z polami: "Nazwa", "Składniki" (pole tekstowe wieloliniowe) i "Instrukcje" (pole tekstowe wieloliniowe).
  2.  Po wypełnieniu pól i kliknięciu "Zapisz", przepis zostaje dodany do mojej listy przepisów.
  3.  Pola "Nazwa" i "Instrukcje" są wymagane do zapisania przepisu.

---

- ID: US-008
- Tytuł: Przeglądanie listy przepisów
- Opis: Jako użytkownik, chcę widzieć listę wszystkich moich zapisanych przepisów, aby łatwo znaleźć to, czego szukam.
- Kryteria akceptacji:
  1.  Główny ekran po zalogowaniu wyświetla listę moich przepisów.
  2.  Każdy element na liście zawiera co najmniej nazwę przepisu.
  3.  Kliknięcie na element listy przenosi mnie do widoku szczegółowego tego przepisu.

---

- ID: US-009
- Tytuł: Wyświetlanie pustego stanu listy przepisów
- Opis: Jako nowy użytkownik, który nie ma jeszcze żadnych przepisów, chcę zobaczyć informację o pustym stanie, która zachęci mnie do dodania pierwszego przepisu.
- Kryteria akceptacji:
  1.  Gdy lista moich przepisów jest pusta, na ekranie wyświetlany jest komunikat, np. "Nie masz jeszcze żadnych przepisów. Dodaj swój pierwszy przepis lub wygeneruj go z pomocą AI!".
  2.  Na ekranie pustego stanu widoczne są przyciski/linki umożliwiające dodanie lub wygenerowanie przepisu.

---

- ID: US-010
- Tytuł: Wyświetlanie szczegółów przepisu
- Opis: Jako użytkownik, chcę móc zobaczyć pełne szczegóły wybranego przepisu, w tym jego nazwę, składniki i instrukcje.
- Kryteria akceptacji:
  1.  Po wybraniu przepisu z listy, otwiera się nowy ekran.
  2.  Na ekranie widoczne są trzy oddzielne sekcje: Nazwa, Składniki i Instrukcje.
  3.  Treść w każdej sekcji odpowiada danym zapisanym dla tego przepisu.

---

- ID: US-011
- Tytuł: Usuwanie przepisu
- Opis: Jako użytkownik, chcę móc usunąć przepis, którego już nie potrzebuję, aby utrzymać porządek na mojej liście.
- Kryteria akceptacji:
  1.  W widoku listy przepisów lub w widoku szczegółowym znajduje się opcja "Usuń".
  2.  Po kliknięciu "Usuń" pojawia się okno dialogowe z pytaniem o potwierdzenie, np. "Czy na pewno chcesz usunąć ten przepis?".
  3.  Jeśli potwierdzę, przepis jest trwale usuwany z mojej listy.
  4.  Jeśli anuluję, okno dialogowe znika, a przepis pozostaje na liście.

## 6. Metryki sukcesu

Sukces wersji MVP będzie mierzony za pomocą następujących kluczowych wskaźników wydajności (KPI):

1.  Adopcja profilu preferencji:
    - Metryka: Procent aktywnych użytkowników, którzy mają zdefiniowane co najmniej dwie preferencje żywieniowe w swoim profilu.
    - Cel: 90%
2.  Zaangażowanie w kluczową funkcjonalność:
    - Metryka: Procent aktywnych użytkowników, którzy generują co najmniej jeden przepis za pomocą AI w ciągu tygodnia.
    - Cel: 75%
