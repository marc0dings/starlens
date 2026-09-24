export const meta = {
  name: 'starlens-sprint',
  description: 'Designer + Tester review StarLens, Developer fixes top issues, Stakeholder accepts, team stands up on what is next',
  phases: [
    { title: 'Review' },
    { title: 'Development' },
    { title: 'Abnahme' },
    { title: 'Standup' },
  ],
}

const PROJECT_CONTEXT = `
StarLens ist eine deutschsprachige Expo/React-Native-App (Expo SDK 57, Expo Router, TypeScript,
React Compiler aktiv) rund um Nachthimmel-Beobachtung und Astronomie. Konventionen stehen in
AGENTS.md im Repo-Root (u.a.: "npx expo install" statt npm/yarn, "npx expo lint" und
"npx tsc --noEmit" müssen vor Abschluss sauber laufen, ios/ und android/ nie von Hand anfassen).

Kernbereiche des Codes:
- src/app/index.tsx – animierter Start-Hub mit Navigation zu den drei Bereichen
- src/app/sky.tsx – Kamera-Live-Ansicht mit AR-Overlay (Kompass/Neigungssensor + astronomy-engine),
  zeigt Sternbilder/Planeten in Blickrichtung, tippen öffnet Detail-Sheet
- src/app/library/ – Lexikon: Liste (index.tsx) + Detailrouten für Sternbilder/Planeten/Themen
- src/app/map/index.tsx – frei zoom-/pan-bare Sternkarte (Gesture-Handler + Reanimated + SVG-viewBox),
  Antippen hebt ein Sternbild hervor und öffnet ein Detail-Sheet
- src/components/ – star-field-background.tsx (animierter Sternenhintergrund), constellation-svg.tsx,
  planet-svg.tsx, detail-sheet.tsx (Bottom-Sheet), seen-badge.tsx, starlens-mark.tsx (Logo), app-tabs.tsx
- src/data/ – constellations.ts, planets.ts, topics.ts (statische Inhaltsdaten, Deutsch)
- src/lib/astronomy.ts, src/lib/star-chart.ts – Astronomie-/Projektionsberechnungen
- src/store/seen-store.tsx – AsyncStorage-persistierter "gesehen"-Status für Sternbilder
- src/constants/theme.ts – "Night"-Farbpalette; die App ist bewusst durchgehend dunkel/weltraum-thematisch
  gestaltet, unabhängig vom System-Farbschema.
`.trim()

const PRODUCT_BRIEF = `
Ursprüngliche Anforderung des Product Owners (StarLens):
"Ich erstelle eine App namens StarLens. Die App dreht sich voll um den Nachthimmel und die Sterne
sowie Astronomie. Es soll einen schönen Startbildschirm im geeigneten animierten Stil geben. Von da
aus kommt man zu den einzelnen verschiedenen Bereichen der App. Man soll mit Hilfe der Kamera des
Smartphones den Sternenhimmel analysieren können und so dann die verschiedenen Sternbilder und
Planeten deuten. Ich möchte zusätzlich einen Bereich, der sich um die schriftliche und bildliche
Darstellung der Sternenbilder und Planeten sowie allgemeinen astronomischen Themen dreht. Ich
möchte bei den Sternbildern die Funktion, dass man diese als 'gesehen' markieren kann. Als letztes
möchte ich eine Art interaktive Karte, durch die man sich bewegen kann. Dort sich dann die
verschiedenen Sterne und Sternenbilder abgebildet und man hat die Möglichkeit diese anzutippen und
sie hervorzuheben und dann etwas darüber zu erfahren."
`.trim()

const DESIGN_FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          area: { type: 'string' },
          file: { type: 'string' },
          summary: { type: 'string' },
          suggestion: { type: 'string' },
          severity: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
        required: ['area', 'file', 'summary', 'suggestion', 'severity'],
      },
    },
  },
  required: ['findings'],
}

const TEST_FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    toolingClean: { type: 'boolean' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          area: { type: 'string' },
          file: { type: 'string' },
          summary: { type: 'string' },
          failureScenario: { type: 'string' },
          severity: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
        required: ['area', 'file', 'summary', 'failureScenario', 'severity'],
      },
    },
  },
  required: ['toolingClean', 'findings'],
}

const DEV_REPORT_SCHEMA = {
  type: 'object',
  properties: {
    changes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          description: { type: 'string' },
          addressesFinding: { type: 'string' },
        },
        required: ['file', 'description'],
      },
    },
    skipped: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          item: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['item', 'reason'],
      },
    },
    verification: { type: 'string' },
  },
  required: ['changes', 'skipped', 'verification'],
}

const STAKEHOLDER_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['accepted', 'accepted_with_notes', 'changes_requested'] },
    perItem: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          item: { type: 'string' },
          verdict: { type: 'string', enum: ['accepted', 'accepted_with_notes', 'changes_requested'] },
          note: { type: 'string' },
        },
        required: ['item', 'verdict'],
      },
    },
    summary: { type: 'string' },
    openQuestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict', 'summary'],
}

const STANDUP_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    decisions: { type: 'array', items: { type: 'string' } },
    backlog: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          owner: { type: 'string', enum: ['Designer', 'Tester', 'Developer', 'Stakeholder'] },
          priority: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['title', 'owner', 'priority'],
      },
    },
  },
  required: ['summary', 'backlog'],
}

log('Sprint gestartet: Designer und Tester reviewen parallel.')
phase('Review')

const [designReview, testReview] = await parallel([
  () =>
    agent(
      `Du bist die Designerin im StarLens-Team. Kontext:\n${PROJECT_CONTEXT}\n\n${PRODUCT_BRIEF}\n\n` +
        `Bewerte die visuelle Gestaltung und UX der App rein lesend (keine Änderungen). Lies dafür ` +
        `src/constants/theme.ts, src/components/star-field-background.tsx, src/components/starlens-mark.tsx, ` +
        `src/components/constellation-svg.tsx, src/components/planet-svg.tsx, src/components/detail-sheet.tsx, ` +
        `src/components/seen-badge.tsx, src/components/app-tabs.tsx und alle Screens unter src/app/. ` +
        `Prüfe: visuelle Konsistenz, Qualität/Wirkung der Animationen, Typografie- und Abstandshierarchie, ` +
        `Farbkontrast/Lesbarkeit (z.B. Night.textMuted auf Night.bg0), Touch-Ziel-Größen, Leer-/Ladezustände, ` +
        `und ob es sich "schön und stimmig für eine Nachthimmel-Astronomie-App" anfühlt, wie ursprünglich gefordert. ` +
        `Jeder Befund muss konkret und umsetzbar sein (nenne die exakte Datei und was genau geändert werden soll, ` +
        `keine vagen Aussagen wie "Design verbessern"). Gib deine Befunde ausschließlich über das Schema zurück.`,
      { phase: 'Review', label: 'designer', schema: DESIGN_FINDINGS_SCHEMA }
    ),
  () =>
    agent(
      `Du bist der Tester im StarLens-Team. Kontext:\n${PROJECT_CONTEXT}\n\n${PRODUCT_BRIEF}\n\n` +
        `Es gibt kein Gerät/keinen Simulator – teste daher durch Code-Lektüre und read-only Bash-Befehle. ` +
        `Führe zuerst "npx tsc --noEmit", "npx expo lint" und "npx expo-doctor" aus und melde, ob sie sauber ` +
        `durchlaufen (toolingClean). Prüfe dann gezielt auf echte Bugs/Edge-Cases, u.a.: ` +
        `(1) src/store/seen-store.tsx – Persistenz, Ladefehler, Race Conditions; ` +
        `(2) src/lib/astronomy.ts – Korrektheit von projectToScreen/angleDiffDeg bei 0°/360°-Wraparound und ` +
        `Polnähe; ` +
        `(3) src/app/sky.tsx – Verhalten bei verweigerten Berechtigungen, fehlendem Standort, Grenzfälle der ` +
        `Neigungs-Formel, werden alle Subscriptions in useEffect-Cleanups wirklich entfernt (Memory-Leaks)?; ` +
        `(4) src/app/map/index.tsx – Gesture-Mathematik (Pan/Pinch-Clamping, Tap-Hit-Testing), Performance bei ` +
        `vielen SVG-Elementen; ` +
        `(5) src/app/library/**/[id].tsx – Verhalten bei ungültigen ids. ` +
        `Nur lesen/Bash zum Prüfen verwenden, keine Dateien ändern. Jeder Befund braucht ein konkretes ` +
        `Fehlerszenario. Gib alles ausschließlich über das Schema zurück.`,
      { phase: 'Review', label: 'tester', schema: TEST_FINDINGS_SCHEMA }
    ),
])

const designCount = designReview?.findings?.length ?? 0
const testCount = testReview?.findings?.length ?? 0
log(`Review fertig: ${designCount} Design-Befunde, ${testCount} Test-Befunde.`)

phase('Development')

const devReport = await agent(
  `Du bist der Entwickler im StarLens-Team. Kontext:\n${PROJECT_CONTEXT}\n\n${PRODUCT_BRIEF}\n\n` +
    `Die Designerin und der Tester haben soeben folgende Befunde eingereicht:\n\n` +
    `DESIGN-BEFUNDE:\n${JSON.stringify(designReview?.findings ?? [], null, 2)}\n\n` +
    `TEST-BEFUNDE:\n${JSON.stringify(testReview?.findings ?? [], null, 2)}\n\n` +
    `Wähle die ca. 5 wichtigsten, sicher umsetzbaren Punkte aus (bevorzuge Korrektheits-Bugs und günstige, ` +
    `wirkungsvolle Design-Politur; überspringe alles, was neue Abhängigkeiten, externe Bild-/Audio-Assets ` +
    `oder Architekturänderungen braucht – liste diese stattdessen unter "skipped" für später). Setze die ` +
    `Änderungen direkt im Repo um (Edit/Write), passend zum bestehenden Code-Stil und zur "Night"-Palette in ` +
    `src/constants/theme.ts. Führe danach "npx tsc --noEmit" und "npx expo lint" aus und behebe alles, was du ` +
    `kaputt gemacht hast. Gib abschließend ausschließlich über das Schema zurück, was du geändert hast, was du ` +
    `bewusst übersprungen hast (mit Grund) und was die Verifikation ergab.`,
  { phase: 'Development', label: 'developer', schema: DEV_REPORT_SCHEMA }
)

log(`Entwicklung fertig: ${devReport?.changes?.length ?? 0} Änderungen, ${devReport?.skipped?.length ?? 0} zurückgestellt.`)

phase('Abnahme')

const stakeholderReview = await agent(
  `Du bist der Stakeholder/Product Owner für StarLens. Kontext:\n${PROJECT_CONTEXT}\n\n${PRODUCT_BRIEF}\n\n` +
    `Der Entwickler meldet folgende Änderungen:\n${JSON.stringify(devReport, null, 2)}\n\n` +
    `Prüfe das selbst nach – führe "git diff --stat" und "git diff" per Bash aus und lies die geänderten ` +
    `Dateien. Beurteile pro Änderung, ob sie eine echte Verbesserung ist, zur bestehenden Night/Weltraum- ` +
    `Bildsprache passt und keine Regression einführt. Vergib pro Punkt ein Urteil (accepted / ` +
    `accepted_with_notes / changes_requested), dazu ein Gesamturteil und offene Fragen fürs Team. Antworte ` +
    `ausschließlich über das Schema.`,
  { phase: 'Abnahme', label: 'stakeholder', schema: STAKEHOLDER_SCHEMA }
)

log(`Abnahme fertig: Gesamturteil = ${stakeholderReview?.verdict ?? 'unbekannt'}.`)

phase('Standup')

const standup = await agent(
  `Du moderierst das kurze Standup für das StarLens-Team. Fasse zusammen, was in diesem Sprint passiert ist, ` +
    `und plane die nächsten Schritte. Grundlagen:\n\n` +
    `DESIGN-BEFUNDE:\n${JSON.stringify(designReview?.findings ?? [], null, 2)}\n\n` +
    `TEST-BEFUNDE:\n${JSON.stringify(testReview?.findings ?? [], null, 2)}\n\n` +
    `ENTWICKLER-BERICHT:\n${JSON.stringify(devReport, null, 2)}\n\n` +
    `STAKEHOLDER-URTEIL:\n${JSON.stringify(stakeholderReview, null, 2)}\n\n` +
    `Schreibe eine knappe Standup-Zusammenfassung (was wurde ausgeliefert, was hat der Stakeholder angemerkt) ` +
    `und ein priorisiertes Backlog für den nächsten Sprint (kombiniere nicht umgesetzte Design-/Test-Befunde, ` +
    `offene Fragen des Stakeholders und vom Entwickler zurückgestellte Punkte). Jeder Backlog-Punkt braucht ` +
    `einen vorgeschlagenen Owner (Designer/Tester/Developer/Stakeholder) und eine Priorität. Antworte ` +
    `ausschließlich über das Schema.`,
  { phase: 'Standup', label: 'standup', schema: STANDUP_SCHEMA }
)

return { designReview, testReview, devReport, stakeholderReview, standup }
