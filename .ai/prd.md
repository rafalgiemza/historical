# PRD – Aplikacja webowa z listą użytkowników i wyszukiwaniem geograficznym

## 1. Cel produktu

Aplikacja webowa umożliwiająca przeglądanie użytkowników pobranych z zewnętrznego API, filtrowanie ich według zakresu geograficznego (lat/lng) oraz szczegółowy podgląd ich aktywności (posty i komentarze) w bocznym drawerze.

---

## 2. Użytkownicy docelowi

Deweloperzy i testerzy integracji API; docelowo każdy użytkownik przeglądarki bez potrzeby logowania.

---

## 3. Wymagania funkcjonalne

### 3.1 Geolokalizacja użytkownika

- Aplikacja przy starcie pobiera lokalizację użytkownika.
- Na potrzeby MVP lokalizacja jest mockowana (hardcoded lub losowe dane), ale symuluje opóźnienie wynoszące **~100 ms** (np. `setTimeout` lub sztuczny delay w serwisie).
- Pobrana lokalizacja może być użyta jako domyślna wartość inputów lat/lng lub tylko jako informacja kontekstowa.

### 3.2 Pobieranie listy użytkowników

- Aplikacja umożliwia pobranie listy użytkowników z endpointu:  
  `GET https://jsonplaceholder.typicode.com/users`
- Pobieranie jest inicjowane jawną akcją użytkownika (np. przycisk „Pobierz użytkowników") lub automatycznie po załadowaniu strony — do decyzji na etapie implementacji.
- Lista wyświetla co najmniej: imię i nazwisko, e-mail, miasto/lokalizację użytkownika.

### 3.3 Header – filtry geograficzne

- W nagłówku strony (header) znajdują się **dwa inputy typu `number`**:
  - `lat` – zakres szerokości geograficznej
  - `lng` – zakres długości geograficznej
- Wartości domyślne: **lat = 10**, **lng = 10**.
- Obok inputów znajduje się przycisk **„Szukaj"**.

### 3.4 Wyszukiwanie użytkowników wg zakresu geograficznego

- Po zmianie wartości inputów i kliknięciu przycisku „Szukaj" aplikacja wysyła zapytanie do serwera z parametrami zakresu przekazanymi jako **query params w URL**, np.:  
  `GET /api/users?lat=10&lng=10`
- Wyniki wyszukiwania aktualizują listę użytkowników na stronie.
- Do czasu implementacji backendu endpoint może być mockowany po stronie frontendu.

### 3.5 Kliknięcie w użytkownika – otwarcie drawera

- Każdy element na liście użytkowników jest klikalny.
- Kliknięcie w użytkownika otwiera **boczny drawer** (panel wysuwany, np. z prawej strony ekranu).
- Drawer zawiera dane wybranego użytkownika oraz jego aktywność.

### 3.6 Drawer – zakładki Posts i Comments

- Drawer zawiera **dwie zakładki (taby)**:
  1. **Posts** – lista postów danego użytkownika, pobierana z:  
     `GET https://jsonplaceholder.typicode.com/posts?userId={id}`
  2. **Comments** – lista komentarzy danego użytkownika, pobierana z:  
     `GET https://jsonplaceholder.typicode.com/comments?postId={...}` lub odpowiedni endpoint powiązany z użytkownikiem.
- Dane w zakładkach są ładowane **lazy** – dopiero po kliknięciu danej zakładki (lub po otwarciu drawera dla aktywnej zakładki).
- Drawer można zamknąć (przycisk „X" lub kliknięcie poza obszar drawera).

---

## 4. Wymagania niefunkcjonalne

- Aplikacja działa w przeglądarce (SPA lub SSR – do decyzji).
- Mockowany delay geolokalizacji: **100 ms**.
- Wszystkie requesty do zewnętrznych API obsługują stany: ładowanie, sukces, błąd.
- UI jest responsywne (co najmniej desktop + tablet).
- Kod jest podzielony na logiczne komponenty/moduły.

---

## 5. Przepływ użytkownika (User Flow)

```
Start
  └─> [Symulacja pobierania lokalizacji ~100ms]
        └─> Strona główna z headerem (lat=10, lng=10) i listą użytkowników
              ├─> Użytkownik zmienia lat/lng i klika „Szukaj"
              │     └─> GET /api/users?lat=X&lng=Y → aktualizacja listy
              └─> Użytkownik klika na użytkownika z listy
                    └─> Otwiera się Drawer
                          ├─> Tab „Posts"    → GET /posts?userId={id}
                          └─> Tab „Comments" → GET /comments?userId={id}
```

---

## 6. Endpointy zewnętrzne

| Zasób                    | URL                                                             |
| ------------------------ | --------------------------------------------------------------- |
| Lista użytkowników       | `https://jsonplaceholder.typicode.com/users`                    |
| Posty użytkownika        | `https://jsonplaceholder.typicode.com/posts?userId={id}`        |
| Komentarze (posty usera) | `https://jsonplaceholder.typicode.com/comments?postId={postId}` |

---

## 7. Poza zakresem MVP

- Autoryzacja i logowanie.
- Prawdziwa geolokalizacja przez API przeglądarki (Geolocation API) — etap kolejny po mocku.
- Backend do filtrowania geograficznego — w MVP mockowany po stronie frontu.
- Paginacja listy użytkowników.
