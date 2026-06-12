# Eeraj Jan - Digital Portfolio

Mein interaktives Portfolio an der Schnittstelle von Technologie, Business und Kreativarbeit.

Ich verbinde Frontend- und Full-Stack-Entwicklung mit KI-Automation, B2B-Sales, Consulting, Marketing und Design. Das Portfolio zeigt nicht nur Projekte, sondern integriert eigene interaktive Funktionen, Live-Daten und spielerische Elemente.

**Live:** [eeraj-portfolio.vercel.app](https://eeraj-portfolio.vercel.app)

## Profil

- Digital Creative
- Frontend- und Full-Stack-Entwicklung
- AI Automation und Workflow Engineering
- Sales und Consulting
- Marketingstrategie und Content
- Business-orientierte Produktentwicklung

## Highlights

- Eigenständiges Cyberpunk-Design in Schwarz und Electric Cyan
- Deutscher und englischer Sprachmodus
- Dark Mode und Light Mode
- Animierte Hero-Sequenz mit Typewriter- und Glitch-Effekten
- Responsive Projektgalerie mit Filtern und Detailansichten
- Projekt-Likes, Kommentare und Besucherstatistik
- Live-KI-Newsfeed auf Basis von Supabase
- Interaktiver Pokemon-Buddy mit Starter-Auswahl, Quests, Kämpfen und Leaderboard
- Anbindung an das separate Pixel-Art-Portfolio-Spiel [Eeraj World](https://eeraj-world.vercel.app)
- Kundenstimmen, Kontaktformular und mehrsprachiger CV-Download
- Scroll-Reveals, Cursor-Glow, Grid-Effekte und weitere Micro-Interactions

## Ausgewählte Projekte

- **RAYLEAD Engine:** autonome KI-Lead-Pipeline für den B2B-Vertrieb
- **Eeraj World:** interaktives Pixel-Art-Portfolio als Top-Down-RPG
- **Voice-to-CRM:** KI-gestützte PWA für Sprachtranskription und CRM-Export
- **NovaTech:** Unternehmens-Landingpage mit RAG-Chatbot und n8n-Automation
- **Wu-Wear:** Social-Media- und Content-Strategie
- **Performance Marketing:** datengetriebene Kampagnen- und ROI-Analyse

## Tech Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- JavaScript
- CSS-Animationen und responsive UI
- React Markdown

### Daten und Integrationen

- Supabase
- Firebase Realtime Database
- EmailJS
- Microsoft Clarity
- Externe REST APIs

### Optionales Backend

- Java 17
- Spring Boot 3.2
- Spring Data JPA
- H2 Database
- Maven

Das Spring-Boot-Backend enthält Endpunkte für Besucherzahlen, Likes und Kommentare. Das Frontend besitzt zusätzlich Firebase-Integrationen für Echtzeitdaten und das Pokemon-Leaderboard.

## Lokale Entwicklung

Voraussetzungen: Node.js und npm.

```bash
git clone https://github.com/eeraj88/eeraj-portfolio.git
cd eeraj-portfolio
npm install
npm run dev
```

Das Frontend läuft standardmäßig unter `http://localhost:5173`.

### Umgebungsvariablen

Für alle Live-Funktionen können folgende Variablen in einer lokalen `.env` hinterlegt werden:

```env
VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Optionales Spring-Boot-Backend

Voraussetzungen: Java 17 und Maven.

```bash
cd backend
mvn spring-boot:run
```

Das Backend läuft standardmäßig unter `http://localhost:8080`.

## Projektstruktur

```text
.
|-- backend/                 # Optionales Spring-Boot-Backend
|-- public/                  # Bilder, CVs und weitere statische Assets
|-- src/
|   |-- components/          # Portfolio-Sektionen und interaktive Features
|   |   |-- Pokemon/         # Pokemon-Spiel, Hooks und UI
|   |   `-- ui/              # Wiederverwendbare UI-Komponenten
|   |-- Context/             # Theme- und Sprachverwaltung
|   |-- data/                # Projekte, Skills und Testimonials
|   |-- services/            # API-Kommunikation
|   |-- translations/        # Deutsche und englische Texte
|   |-- App.jsx
|   `-- main.jsx
|-- package.json
`-- vite.config.js
```

## Autor

**Eeraj Jan**  
Digital Creative, Developer, AI Automation, Sales und Consulting
