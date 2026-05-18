# English Mode Plan

## Ziel
Portfolio auf Deutsch + Englisch umschaltbar.

## Technischer Ansatz

### Option A: React Context (Empfohlen)
- `LanguageContext` + `useTranslation` Hook
- Übersetzungen in JSON/Objekte
- Toggle im Header neben Theme Switcher

**Vorteile:**
- Einfach, schnell zu implementieren
- Keine extra Dependencies
- Performance gut (kleine Datenmenge)

**Struktur:**
```
src/
  translations/
    de.js  # Deutsch (Aktuell)
    en.js  # Englisch
  Context/
    LanguageContext.jsx  # Sprache state + toggle
```

### Option B: react-i18next
- Professionelle i18n Library
- Pluralization, Interpolation
- Mehr Aufwand Setup

**Vorteile:**
- Industry Standard
- Skalierbar für viele Sprachen
- Built-in Features (Plural, Date formatting)

**Nachteile:**
- Extra Dependency
- Mehr Setup Aufwand

## Empfehlung: Option A (Context)

### Umsetzungsschritte

1. **Translations erstellen**
   ```js
   // translations/de.js
   export default {
     hero: {
       hi: 'HI',
       ichBin: 'ICH BIN',
       name: 'EERAJ JAN',
       role: 'Digital Creative | Frontend Developer'
     },
     nav: {
       about: 'About',
       skills: 'Skills',
       projekte: 'Projekte',
       referenzen: 'Referenzen',
       kontakt: 'Kontakt'
     }
   }

   // translations/en.js
   export default {
     hero: {
       hi: 'HI',
       ichBin: 'I AM',
       name: 'EERAJ JAN',
       role: 'Digital Creative | Frontend Developer'
     },
     nav: {
       about: 'About',
       skills: 'Skills',
       projekte: 'Projects',
       referenzen: 'References',
       kontakt: 'Contact'
     }
   }
   ```

2. **LanguageContext**
   ```js
   // Context/LanguageContext.jsx
   const LanguageContext = createContext()
   const [language, setLanguage] = useState('de')
   const toggleLanguage = () => setLanguage(l => l === 'de' ? 'en' : 'de')
   ```

3. **Components aktualisieren**
   - Header: Nav Links übersetzt
   - Hero: Typewriter Text übersetzt
   - About, Skills, Projects, etc.

4. **UI Toggle**
   - Header: DE/EN Button neben Theme Switcher
   - Flag Icons oder Text "DE / EN"

## Arbeitsaufwand

- **Minimal:** 2-3 Stunden
- **Komplett:** 4-5 Stunden (alle Texte)

## Reihenfolge

1. ✅ LanguageContext + Toggle
2. ✅ Translation Objects (de + en)
3. ✅ Header Nav übersetzen
4. ✅ Hero übersetzen
5. ✅ Restliche Components (About, Skills, Projects, etc.)
6. ✅ localStorage Persistenz
7. ✅ Testing beide Sprachen

## Dependencies

Keine extra nötig bei Option A.
Bei Option B: `npm install react-i18next i18next`

## Morgen weitermachen?

- Tokens knapp → heute Planung
- morgen: Implementation starten
- Context zuerst → dann Content übersetzen
