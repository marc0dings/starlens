# StarLens ✦

StarLens ist eine App rund um den Nachthimmel: Sternbilder und Planeten per Kamera live erkennen, in einem Lexikon nachlesen, als „gesehen“ markieren und auf einer interaktiven Sternkarte erkunden.

Gebaut mit [Expo](https://expo.dev) (Expo Router, React Native, TypeScript).

## Bereiche der App

- **Start** – animierter Hub-Bildschirm mit Zugang zu den drei Bereichen und dem persönlichen Fortschritt (wie viele Sternbilder schon entdeckt wurden).
- **Himmel** – hält man die Kamera auf den Nachthimmel, zeigt ein AR-Overlay live, welche Sternbilder und Planeten gerade in Blickrichtung stehen. Basiert auf Kompass (`expo-location`), Neigungssensor (`expo-sensors`) und echten astronomischen Berechnungen (`astronomy-engine`) – **keine** Bilderkennung im Kamerabild, sondern eine sensorgestützte Positionsberechnung, wie sie auch andere Astronomie-Apps verwenden.
- **Lexikon** – Sternbilder, Planeten (inkl. Sonne & Mond) und allgemeine Astronomie-Themen mit Kurztexten, Fakten und generierter SVG-Illustration.
- **Karte** – frei zoom- und schwenkbare Sternkarte des kompletten Katalogs. Antippen hebt ein Sternbild hervor und zeigt Details dazu.
- **Gesehen-Tracking** – Sternbilder lassen sich als „gesehen“ markieren; der Status bleibt über `AsyncStorage` geräteweit erhalten.

## Tech-Stack

- [Expo](https://expo.dev) (SDK 57) mit [Expo Router](https://docs.expo.dev/router/introduction/) (File-based Routing, native Tabs)
- React Native + TypeScript, React Compiler aktiviert
- `react-native-svg` für Sternbild-Grafiken, Planeten-Icons und die Sternkarte
- `react-native-reanimated` + `react-native-gesture-handler` für Animationen sowie Pan/Pinch/Tap auf der Karte
- `astronomy-engine` für Alt/Az-Berechnungen von Sternen und Planeten
- `expo-camera`, `expo-location`, `expo-sensors` für die AR-Himmelsansicht
- `@react-native-async-storage/async-storage` für die „gesehen“-Persistenz

## Loslegen

Voraussetzung: Node.js sowie die [Expo-CLI-Umgebung](https://docs.expo.dev/get-started/installation/).

```bash
npm install
npx expo start
```

Danach in der Ausgabe wählen: [Expo Go](https://expo.dev/go), Android-Emulator, iOS-Simulator oder Web (`w` drücken). Kamera, Standort und Sensoren funktionieren laut Expo-Dokumentation auch in Expo Go – für den Himmel-Tab ist also kein Custom-Dev-Build nötig.

Beim ersten Öffnen des Himmel-Tabs fragt die App nach Kamera- und Standortzugriff; ohne beide Berechtigungen zeigt der Tab stattdessen einen Hinweisbildschirm mit einem Link zu den Systemeinstellungen.

### Nützliche Skripte

```bash
npx expo lint        # ESLint
npx tsc --noEmit      # TypeScript-Typecheck
npm test              # Jest — u. a. Astronomie-Berechnungen & Seen-Store
npx expo-doctor       # Projekt-/Abhängigkeits-Diagnose
npx expo install --fix  # inkompatible Paketversionen korrigieren
```

Vor jedem Abschluss einer Änderung sollten Lint und Typecheck sauber durchlaufen (siehe `AGENTS.md`).

## Projektstruktur

```
src/
  app/                     Expo-Router-Screens (jede Datei = eine Route)
    index.tsx              Start-Hub
    sky.tsx                Himmel (AR-Kameraansicht)
    library/                Lexikon (Liste + Detailrouten)
      index.tsx
      constellation/[id].tsx
      planet/[id].tsx
      topic/[id].tsx
    map/index.tsx           Interaktive Sternkarte
  components/               Wiederverwendbare UI-Bausteine
    star-field-background.tsx   Animierter Sternenhimmel-Hintergrund
    constellation-svg.tsx       Sternbild-Illustration aus Katalogdaten
    planet-svg.tsx              Generierte Planeten-Grafik
    detail-sheet.tsx            Bottom-Sheet für Karte & Himmel
    app-tabs.tsx / app-tabs.web.tsx   Tab-Navigation (nativ bzw. Web)
  data/                     Statische Inhalte (Deutsch)
    constellations.ts       Sternbild-Katalog (Sterne, Linien, Mythologie)
    planets.ts               Planeten/Sonne/Mond
    topics.ts                 Astronomie-Artikel
  lib/
    astronomy.ts             Alt/Az-Berechnungen, Bildschirmprojektion
    star-chart.ts             Projektion für die Weltkarte
  store/
    seen-store.tsx            „Gesehen“-Status inkl. AsyncStorage-Persistenz
  constants/theme.ts          Durchgehend dunkles „Night“-Farbschema
```

## Bekannte Einschränkungen

- **App-Icon & Splash-Grafik** sind noch Platzhalter aus dem Expo-Starter-Template (`assets/images/icon.png`, `splash-icon.png`, Android-Adaptive-Icon) – finale Bildassets fehlen noch.
- **Sternkatalog-Koordinaten** sind auf ca. 1° genau (aus Modellwissen, keine Live-Ephemeride) – für Kartendarstellung und AR-Pointing ausreichend, aber keine professionelle Astrometrie.
- Die **Neigungsberechnung** im Himmel-Tab (`sky.tsx`) berücksichtigt aktuell nicht die Roll-Achse des Geräts.
- **Pan/Zoom auf der Karte** ist nicht gegen die Kartengrenzen geklammert – man kann theoretisch in den leeren Bereich navigieren.
- Schnelles, mehrfaches Umschalten des „gesehen“-Status kann durch nicht sequenzierte `AsyncStorage`-Schreibvorgänge in einer Race Condition enden.

Diese Punkte stehen als priorisiertes Backlog aus dem letzten Team-Review fest (siehe Git-Historie bzw. `.claude/workflows/starlens-sprint.js` für den Review-Workflow, der sie aufgedeckt hat).

## Lizenz

MIT, siehe [`LICENSE`](./LICENSE).
