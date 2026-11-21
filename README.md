# totoo jeżyckie spa - strona WWW

Statyczna strona (HTML + CSS + JS), bez etapu budowania i bez zależności do instalowania.
Ten folder jest kompletny: można go w całości wgrać do repozytorium i opublikować.

**Status: wersja do feedbacku klienta.** Wszystkie strony mają `<meta name="robots" content="noindex, nofollow">`,
żeby Google nie zaindeksował wersji roboczej. Przed właściwą publikacją trzeba ten znacznik usunąć
(szukaj komentarza `WERSJA DO FEEDBACKU` w plikach `.html`).

## Struktura

| Plik / folder | Co zawiera |
|---|---|
| `index.html`, `o-nas.html`, `oferta.html`, `vouchery.html`, `kontakt.html` | strony serwisu |
| `404.html` | strona błędu (GitHub Pages i Netlify podstawiają ją automatycznie) |
| `styleguide.html` | wewnętrzny przewodnik po stylach (niepodlinkowany, `noindex`) |
| `css/style.css` | wspólne style: kolory, typografia, pasek, stopka, panele, przyciski, formularze |
| `css/home.css`, `onas.css`, `oferta.css`, `vouchery.css`, `kontakt.css` | style poszczególnych stron |
| `css/mobile.css` | wersja mobilna (do 760 px), ładowana na końcu |
| `js/main.js` | menu, panele, animacje, karuzela, akordeony, formularze |
| `assets/img`, `assets/svg`, `assets/fonts` | zdjęcia, ikony i ozdobniki, font Coconat |

## Podgląd lokalny

W tym folderze:

```
python -m http.server 8899
```

i w przeglądarce `http://localhost:8899`.

## Publikacja

### Wariant A (zalecany): GitHub + Netlify - formularze działają

1. Wgraj zawartość tego folderu do repozytorium na GitHubie (może być prywatne).
2. W Netlify: **Add new site → Import an existing project → GitHub**, wybierz repozytorium.
   Pola *Build command* i *Publish directory* zostaw puste (albo `.` jako katalog publikacji).
3. W panelu strony: **Forms → Enable form detection**, potem ponów wdrożenie (*Deploys → Trigger deploy*).
   Netlify wykryje dwa formularze: `kontakt` i `newsletter`.
4. **Forms → Form notifications → Add notification → Email notification** - wpisz adres,
   na który mają przychodzić zgłoszenia.

Każda kolejna zmiana wypchnięta do repozytorium publikuje się sama.

### Wariant B: GitHub Pages - tylko podgląd

**Settings → Pages → Deploy from a branch → `main` / root.** Strona działa w całości,
ale GitHub Pages nie obsługuje formularzy: na adresach `*.github.io` formularz kontaktowy
i newsletter działają w trybie podglądu (walidacja i potwierdzenie „Dziękujemy (podgląd)”,
bez wysyłki). Plik `.nojekyll` wyłącza przetwarzanie Jekyllem.

## Formularze

- Kod wysyłki: `js/main.js`, sekcja „Formularze”. Zgłoszenie idzie metodą POST na adres strony
  (mechanizm Netlify Forms, atrybut `data-netlify="true"` w HTML).
- Lokalnie i na `*.github.io` nic nie jest wysyłane - pojawia się tylko potwierdzenie z dopiskiem „(podgląd)”.
- Komunikaty walidacji są w atrybutach `data-err` / `data-err-format` pól w `kontakt.html` i w stopkach.

## Zależności zewnętrzne

- Font DM Sans - Google Fonts.
- Płynne przewijanie - biblioteka Lenis 1.1.20 z jsDelivr.
- Mapa na stronie Kontakt - osadzona mapa Google.
