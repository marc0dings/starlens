export interface Topic {
  id: string;
  title: string;
  teaser: string;
  paragraphs: string[];
}

export const topics: Topic[] = [
  {
    id: 'lichtjahr',
    title: 'Was ist ein Lichtjahr?',
    teaser: 'Eine Einheit für die riesigen Entfernungen im Weltall.',
    paragraphs: [
      'Ein Lichtjahr ist die Strecke, die das Licht in einem Jahr im Vakuum zurücklegt — etwa 9,46 Billionen Kilometer. Es ist also trotz seines Namens eine Entfernungsangabe, keine Zeitangabe.',
      'Weil das Weltall so gigantisch ist, wären Kilometerangaben unhandlich groß. Der nächste Stern nach der Sonne, Proxima Centauri, ist bereits rund 4,2 Lichtjahre entfernt.',
      'Wenn wir weit entfernte Objekte betrachten, blicken wir buchstäblich in die Vergangenheit: Das Licht der Andromedagalaxie, das wir heute sehen, ist rund 2,5 Millionen Jahre alt.',
    ],
  },
  {
    id: 'sternentstehung',
    title: 'Wie entstehen Sterne?',
    teaser: 'Von kollabierenden Gaswolken zu leuchtenden Fusionsöfen.',
    paragraphs: [
      'Sterne entstehen in riesigen Wolken aus Gas und Staub, sogenannten Molekülwolken. Unter ihrer eigenen Schwerkraft ziehen sich dichtere Bereiche dieser Wolken zusammen.',
      'Während der Kollaps fortschreitet, erhitzt sich der entstehende Kern immer weiter. Erreicht die Kerntemperatur etwa 10 Millionen Grad, zündet die Kernfusion von Wasserstoff zu Helium — ein Stern ist geboren.',
      'Wie lange ein Stern lebt und wie er endet, hängt fast ausschließlich von seiner Masse ab: Massearme Sterne wie unsere Sonne leben viele Milliarden Jahre, massereiche Riesen verglühen oft schon nach wenigen Millionen Jahren in einer Supernova.',
    ],
  },
  {
    id: 'galaxien',
    title: 'Galaxien — Inseln aus Milliarden Sternen',
    teaser: 'Unsere Milchstraße ist nur eine von hunderten Milliarden.',
    paragraphs: [
      'Eine Galaxie ist ein durch Gravitation zusammengehaltenes System aus Sternen, Gas, Staub und Dunkler Materie. Unsere eigene Galaxie, die Milchstraße, enthält schätzungsweise 100 bis 400 Milliarden Sterne.',
      'Galaxien treten in unterschiedlichen Formen auf: elegante Spiralgalaxien wie die Milchstraße, kompakte elliptische Galaxien und unregelmäßig geformte Zwerggalaxien.',
      'Im beobachtbaren Universum gibt es vermutlich mehrere hundert Milliarden bis Billionen Galaxien — jede davon eine eigene "Inselwelt" aus unzähligen Sternen.',
    ],
  },
  {
    id: 'sternschnuppen',
    title: 'Sternschnuppen und Meteorschauer',
    teaser: 'Warum der Himmel manchmal "Sterne fallen" lässt.',
    paragraphs: [
      'Sternschnuppen sind keine echten Sterne, sondern winzige Staub- und Gesteinspartikel, die beim Eintritt in die Erdatmosphäre mit hoher Geschwindigkeit verglühen und dabei kurz aufleuchten.',
      'Meteorschauer entstehen, wenn die Erde auf ihrer Umlaufbahn regelmäßig die Staubspur eines Kometen durchquert. Bekannte Beispiele sind die Perseiden im August und die Geminiden im Dezember.',
      'Der scheinbare Ursprungspunkt eines Meteorschauers am Himmel wird Radiant genannt — die Schauer werden meist nach dem Sternbild benannt, in dem dieser Punkt liegt.',
    ],
  },
  {
    id: 'ekliptik',
    title: 'Die Ekliptik und der Tierkreis',
    teaser: 'Warum Planeten immer im selben Himmelsband wandern.',
    paragraphs: [
      'Die Ekliptik ist die scheinbare Bahn der Sonne am Himmel im Laufe eines Jahres. Da alle Planeten unseres Sonnensystems annähernd in derselben Ebene um die Sonne kreisen, bewegen sich auch Mond und Planeten stets nahe dieser Linie.',
      'Die zwölf Sternbilder entlang der Ekliptik bilden den klassischen Tierkreis (Zodiak) — darunter Sternbilder wie Löwe, Skorpion oder Stier.',
      'Wer weiß, wo die Ekliptik verläuft, kann Planeten am Nachthimmel oft schon anhand ihrer Position gegenüber den Fixsternen erkennen.',
    ],
  },
  {
    id: 'lichtverschmutzung',
    title: 'Lichtverschmutzung — der Feind der Sternbeobachtung',
    teaser: 'Warum in Städten kaum noch Sterne zu sehen sind.',
    paragraphs: [
      'Künstliches Licht aus Städten streut in der Atmosphäre und überstrahlt schwaches Sternenlicht. In vielen Großstädten sind dadurch nur noch die hellsten paar Dutzend Sterne sichtbar.',
      'Der Bortle-Skala zufolge reicht der Himmel von "Innenstadt" (Klasse 9, kaum Sterne sichtbar) bis zu "exzellentem dunklem Landhimmel" (Klasse 1, Milchstraße wirft Schatten).',
      'Schon eine kurze Fahrt aufs Land, fernab von Straßenbeleuchtung, kann den sichtbaren Sternenhimmel dramatisch verbessern — ideal, um StarLens im echten Dunkel auszuprobieren.',
    ],
  },
];

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}
