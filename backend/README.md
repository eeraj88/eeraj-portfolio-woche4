# Portfolio Backend

Spring Boot Backend für das Portfolio mit Visitor Counter, Like System und Kommentaren.

## Voraussetzungen

- **Java 17** oder höher installiert
- **Maven** (meistens mit Java installiert)

## Backend starten

### 1. In den Backend-Ordner wechseln
```bash
cd backend
```

### 2. Dependencies installieren
```bash
mvn clean install
```

### 3. Backend starten
```bash
mvn spring-boot:run
```

Das Backend läuft dann auf `http://localhost:8080`

## API Endpoints

### Visitor Counter
- `GET /api/visitor/count` - Besucher-Anzahl abrufen
- `POST /api/visitor` - Besuch registrieren

### Likes
- `GET /api/likes/{projectId}` - Like-Anzahl für Projekt abrufen
- `POST /api/likes/{projectId}` - Like hinzufügen

### Kommentare
- `GET /api/comments/{projectId}` - Alle Kommentare für Projekt abrufen
- `POST /api/comments/{projectId}` - Neuen Kommentar erstellen

## Frontend starten

In einem **neuen Terminal**:

```bash
npm run dev
```

Das Frontend läuft auf `http://localhost:5173`

## H2 Datenbank Konsole

Für Debugging: `http://localhost:8080/h2-console`

Connection Details:
- JDBC URL: `jdbc:h2:mem:portfolio_db`
- Username: `sa`
- Password: (leer lassen)

## Features

✅ **Visitor Counter** - Zählt Besucher im Footer
✅ **Like Button** - Auf Projekten im Modal
✅ **Kommentare** - Unter Projekten im Modal

## Troubleshooting

**Backend startet nicht?**
- Prüfe ob Java 17+ installiert: `java -version`
- Prüfe ob Port 8080 frei ist

**Frontend zeigt keine Daten an?**
- Prüfe ob Backend läuft: `http://localhost:8080/api/visitor/count`
- Browser Konsole auf Fehler prüfen (F12)

## Stack

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (In-Memory)
- Maven
