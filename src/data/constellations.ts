/**
 * Approximate J2000 star catalog data for a curated set of well-known constellations.
 * Coordinates are accurate to roughly a degree — enough for AR sky-pointing and chart
 * layout, not for precision astrometry.
 */
export interface CatalogStar {
  name: string;
  /** Right ascension in hours [0, 24). */
  ra: number;
  /** Declination in degrees [-90, 90]. */
  dec: number;
  /** Apparent magnitude — lower is brighter. */
  mag: number;
}

export interface Constellation {
  id: string;
  name: string;
  latinName: string;
  abbr: string;
  season: string;
  hemisphere: 'Nord' | 'Süd' | 'Beide';
  mythology: string;
  facts: string[];
  stars: CatalogStar[];
  /** Index pairs into `stars`, describing which stars are connected by a line. */
  lines: [number, number][];
}

export const constellations: Constellation[] = [
  {
    id: 'orion',
    name: 'Orion',
    latinName: 'Orion',
    abbr: 'Ori',
    season: 'Winter',
    hemisphere: 'Beide',
    mythology:
      'Orion war in der griechischen Mythologie ein gewaltiger Jäger, so stolz auf seine Fähigkeiten, dass er sich rühmte, jedes Tier der Erde erlegen zu können. Zur Strafe wurde er von einem Skorpion getötet — weshalb Orion und das Sternbild Skorpion der Sage nach niemals gleichzeitig am Himmel stehen.',
    facts: [
      'Der Orionnebel (M42) im "Schwert" ist mit bloßem Auge als verschwommener Fleck sichtbar.',
      'Beteigeuze ist ein roter Überriese und könnte als Supernova explodieren — astronomisch gesehen "bald", was auch in Jahrtausenden liegen kann.',
      'Der markante Gürtel aus drei Sternen macht Orion zu einem der am leichtesten erkennbaren Sternbilder.',
    ],
    stars: [
      { name: 'Beteigeuze', ra: 5.919, dec: 7.407, mag: 0.5 },
      { name: 'Bellatrix', ra: 5.418, dec: 6.35, mag: 1.64 },
      { name: 'Mintaka', ra: 5.533, dec: -0.299, mag: 2.23 },
      { name: 'Alnilam', ra: 5.603, dec: -1.202, mag: 1.69 },
      { name: 'Alnitak', ra: 5.679, dec: -1.943, mag: 1.88 },
      { name: 'Saiph', ra: 5.796, dec: -9.67, mag: 2.09 },
      { name: 'Rigel', ra: 5.242, dec: -8.202, mag: 0.13 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 2],
      [4, 0],
    ],
  },
  {
    id: 'ursa-major',
    name: 'Großer Bär',
    latinName: 'Ursa Major',
    abbr: 'UMa',
    season: 'Frühling',
    hemisphere: 'Nord',
    mythology:
      'Die Nymphe Kallisto wurde der Sage nach von der eifersüchtigen Göttin Hera in eine Bärin verwandelt. Zeus versetzte sie schließlich als Großen Bären an den Himmel. Der markante "Große Wagen" ist nur der hintere Teil und Schwanz des Bären.',
    facts: [
      'Der "Große Wagen" ist ein Asterismus (eine markante Sternformation), kein eigenes Sternbild.',
      'Verlängert man die beiden vorderen Kastensterne (Dubhe und Merak), findet man den Polarstern.',
      'Mizar ist mit bloßem Auge als Doppelstern mit seinem Begleiter Alkor erkennbar — ein klassischer Sehtest.',
    ],
    stars: [
      { name: 'Dubhe', ra: 11.062, dec: 61.751, mag: 1.79 },
      { name: 'Merak', ra: 11.031, dec: 56.382, mag: 2.37 },
      { name: 'Phecda', ra: 11.897, dec: 53.695, mag: 2.44 },
      { name: 'Megrez', ra: 12.257, dec: 57.033, mag: 3.31 },
      { name: 'Alioth', ra: 12.9, dec: 55.96, mag: 1.77 },
      { name: 'Mizar', ra: 13.399, dec: 54.925, mag: 2.23 },
      { name: 'Alkaid', ra: 13.792, dec: 49.313, mag: 1.86 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: 'ursa-minor',
    name: 'Kleiner Bär',
    latinName: 'Ursa Minor',
    abbr: 'UMi',
    season: 'Ganzjährig',
    hemisphere: 'Nord',
    mythology:
      'Der Kleine Bär gilt als Kallistos Sohn Arkas, der ebenfalls an den Himmel versetzt wurde. An seiner Schwanzspitze steht Polaris, der Polarstern — seit Jahrhunderten der wichtigste Fixpunkt der Seefahrt, da er fast genau über dem Nordpol steht.',
    facts: [
      'Polaris weicht nur etwa 0,5° von der Verlängerung der Erdachse ab.',
      'Wegen der Präzession der Erdachse wird in rund 13.000 Jahren ein anderer Stern den Polarstern ablösen.',
      'Kochab und Pherkad werden als "Wächter des Pols" bezeichnet.',
    ],
    stars: [
      { name: 'Polaris', ra: 2.53, dec: 89.264, mag: 1.98 },
      { name: 'Yildun', ra: 17.537, dec: 86.586, mag: 4.35 },
      { name: 'Epsilon UMi', ra: 16.766, dec: 82.037, mag: 4.19 },
      { name: 'Zeta UMi', ra: 15.734, dec: 77.794, mag: 4.32 },
      { name: 'Eta UMi', ra: 16.292, dec: 75.755, mag: 4.95 },
      { name: 'Pherkad', ra: 15.345, dec: 71.834, mag: 3.0 },
      { name: 'Kochab', ra: 14.845, dec: 74.156, mag: 2.08 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 3],
    ],
  },
  {
    id: 'cassiopeia',
    name: 'Kassiopeia',
    latinName: 'Cassiopeia',
    abbr: 'Cas',
    season: 'Herbst',
    hemisphere: 'Nord',
    mythology:
      'Kassiopeia war eine eitle Königin, die sich rühmte, schöner zu sein als die Meeresnymphen. Zur Strafe wurde sie an den Himmel versetzt, wo sie in manchen Nächten kopfüber sitzen muss.',
    facts: [
      'Das markante W (oder M) aus fünf Sternen macht Kassiopeia ganzjährig leicht auffindbar.',
      'Sie steht dem Großen Wagen am Himmelspol fast gegenüber.',
      'In der Region liegt der berühmte Supernova-Überrest "Cassiopeia A".',
    ],
    stars: [
      { name: 'Segin', ra: 1.906, dec: 63.67, mag: 3.35 },
      { name: 'Ruchbah', ra: 1.43, dec: 60.235, mag: 2.68 },
      { name: 'Gamma Cas', ra: 0.945, dec: 60.717, mag: 2.47 },
      { name: 'Schedar', ra: 0.675, dec: 56.537, mag: 2.24 },
      { name: 'Caph', ra: 0.153, dec: 59.15, mag: 2.28 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: 'cygnus',
    name: 'Schwan',
    latinName: 'Cygnus',
    abbr: 'Cyg',
    season: 'Sommer',
    hemisphere: 'Nord',
    mythology:
      'Der Schwan wird meist mit Zeus in Verbindung gebracht, der sich in dieser Gestalt der schönen Leda näherte. Die auffällige Kreuzform entlang der Milchstraße gab dem Sternbild auch den Beinamen "Nordkreuz".',
    facts: [
      'Deneb bildet zusammen mit Vega (Leier) und Atair (Adler) das "Sommerdreieck".',
      'Deneb ist trotz seiner enormen Entfernung von rund 2600 Lichtjahren einer der hellsten Sterne am Nachthimmel.',
      'Der Schwan fliegt entlang der Milchstraße "nach Süden" in Richtung Horizont.',
    ],
    stars: [
      { name: 'Deneb', ra: 20.69, dec: 45.28, mag: 1.25 },
      { name: 'Sadr', ra: 20.37, dec: 40.257, mag: 2.23 },
      { name: 'Albireo', ra: 19.512, dec: 27.96, mag: 3.18 },
      { name: 'Delta Cyg', ra: 19.749, dec: 45.131, mag: 2.87 },
      { name: 'Aljanah', ra: 20.77, dec: 33.97, mag: 2.48 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [3, 1],
      [1, 4],
    ],
  },
  {
    id: 'lyra',
    name: 'Leier',
    latinName: 'Lyra',
    abbr: 'Lyr',
    season: 'Sommer',
    hemisphere: 'Nord',
    mythology:
      'Die Leier gehörte der Sage nach dem Sänger Orpheus, der mit ihrer Musik selbst Steine zu Tränen rühren konnte. Nach seinem Tod wurde das Instrument von den Göttern an den Himmel versetzt.',
    facts: [
      'Vega war vor rund 12.000 Jahren der Polarstern und wird es in etwa 12.000 Jahren wieder sein.',
      'Vega ist einer der hellsten Sterne am Nordhimmel und bildet eine Ecke des Sommerdreiecks.',
      'Trotz ihrer geringen Größe enthält die Leier mit dem Ringnebel (M57) eines der bekanntesten Objekte für Hobbyteleskope.',
    ],
    stars: [
      { name: 'Vega', ra: 18.615, dec: 38.784, mag: 0.03 },
      { name: 'Zeta1 Lyr', ra: 18.746, dec: 37.605, mag: 4.34 },
      { name: 'Delta2 Lyr', ra: 18.907, dec: 36.898, mag: 4.3 },
      { name: 'Sheliak', ra: 18.835, dec: 33.363, mag: 3.52 },
      { name: 'Sulafat', ra: 18.983, dec: 32.69, mag: 3.25 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 4],
      [4, 3],
      [3, 1],
    ],
  },
  {
    id: 'leo',
    name: 'Löwe',
    latinName: 'Leo',
    abbr: 'Leo',
    season: 'Frühling',
    hemisphere: 'Beide',
    mythology:
      'Der Löwe steht für das nemeische Ungeheuer, das von Herkules in seiner ersten der zwölf Arbeiten erlegt wurde. Sein Fell war so widerstandsfähig, dass Herkules es nur mit seinen eigenen Krallen bezwingen konnte.',
    facts: [
      'Die "Sichel" aus gebogenen Sternen zeichnet den Kopf des Löwen nach.',
      'Regulus liegt fast exakt auf der Ekliptik, der scheinbaren Jahresbahn der Sonne.',
      'Der Löwe ist eines der wenigen Sternbilder, dessen Form seinem Namensgeber tatsächlich ähnelt.',
    ],
    stars: [
      { name: 'Regulus', ra: 10.139, dec: 11.967, mag: 1.35 },
      { name: 'Algieba', ra: 10.333, dec: 19.842, mag: 2.08 },
      { name: 'Zosma', ra: 11.235, dec: 20.524, mag: 2.56 },
      { name: 'Denebola', ra: 11.818, dec: 14.572, mag: 2.14 },
      { name: 'Chertan', ra: 11.237, dec: 15.43, mag: 3.34 },
      { name: 'Adhafera', ra: 10.278, dec: 23.417, mag: 3.44 },
      { name: 'Epsilon Leo', ra: 9.762, dec: 23.774, mag: 2.98 },
    ],
    lines: [
      [6, 5],
      [5, 1],
      [1, 0],
      [0, 4],
      [4, 2],
      [2, 3],
    ],
  },
  {
    id: 'scorpius',
    name: 'Skorpion',
    latinName: 'Scorpius',
    abbr: 'Sco',
    season: 'Sommer',
    hemisphere: 'Süd',
    mythology:
      'Dieser Skorpion soll Orion getötet haben, nachdem dieser sich seiner Jagdkünste rühmte. Die Götter stellten beide an gegenüberliegende Enden des Himmels, sodass Orion untergeht, sobald der Skorpion aufsteigt.',
    facts: [
      'Antares, der "Rivale des Mars", leuchtet durch seine rötliche Farbe ähnlich wie der Planet Mars.',
      'Der geschwungene Schweif mit dem "Stachel" (Shaula/Lesath) ist eine der markantesten Formen am Sommerhimmel.',
      'Der Skorpion liegt in einer sternreichen Region nahe dem Zentrum der Milchstraße.',
    ],
    stars: [
      { name: 'Acrab', ra: 16.09, dec: -19.805, mag: 2.62 },
      { name: 'Dschubba', ra: 16.006, dec: -22.622, mag: 2.29 },
      { name: 'Pi Sco', ra: 15.979, dec: -26.114, mag: 2.89 },
      { name: 'Antares', ra: 16.49, dec: -26.432, mag: 1.06 },
      { name: 'Tau Sco', ra: 16.605, dec: -28.216, mag: 2.82 },
      { name: 'Epsilon Sco', ra: 16.836, dec: -34.293, mag: 2.29 },
      { name: 'Mu1 Sco', ra: 16.868, dec: -38.048, mag: 3.08 },
      { name: 'Shaula', ra: 17.56, dec: -37.104, mag: 1.62 },
      { name: 'Lesath', ra: 17.512, dec: -37.296, mag: 2.7 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
    ],
  },
  {
    id: 'sagittarius',
    name: 'Schütze',
    latinName: 'Sagittarius',
    abbr: 'Sgr',
    season: 'Sommer',
    hemisphere: 'Süd',
    mythology:
      'Der Schütze wird meist als Zentaur mit gespanntem Bogen dargestellt, der seinen Pfeil in Richtung des Skorpions richtet. Er steht in der dichtesten, hellsten Region der Milchstraße, in deren Richtung sich das Zentrum unserer Galaxie befindet.',
    facts: [
      'Die auffällige "Teekanne" ist ein moderner Asterismus innerhalb des Sternbilds.',
      'In Richtung Schütze liegt das Zentrum der Milchstraße, verdeckt von dichten Staubwolken.',
      'Der Bereich enthält zahlreiche Nebel und Sternhaufen, darunter den Lagunennebel (M8).',
    ],
    stars: [
      { name: 'Alnasl', ra: 18.098, dec: -30.424, mag: 2.99 },
      { name: 'Kaus Media', ra: 18.351, dec: -29.828, mag: 2.72 },
      { name: 'Kaus Australis', ra: 18.403, dec: -34.385, mag: 1.85 },
      { name: 'Ascella', ra: 19.043, dec: -29.88, mag: 2.6 },
      { name: 'Nunki', ra: 18.921, dec: -26.297, mag: 2.05 },
      { name: 'Kaus Borealis', ra: 18.467, dec: -25.421, mag: 2.82 },
      { name: 'Phi Sgr', ra: 19.043, dec: -21.026, mag: 3.17 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 0],
    ],
  },
  {
    id: 'taurus',
    name: 'Stier',
    latinName: 'Taurus',
    abbr: 'Tau',
    season: 'Winter',
    hemisphere: 'Beide',
    mythology:
      'Der Stier soll Zeus darstellen, der sich in einen prächtigen weißen Stier verwandelte, um die phönizische Prinzessin Europa zu entführen. Nur Kopf und Vorderkörper sind am Himmel abgebildet.',
    facts: [
      'Das V-förmige Gesicht des Stiers wird vom Sternhaufen der Hyaden gebildet.',
      'Aldebaran wirkt wie ein Mitglied der Hyaden, liegt aber tatsächlich viel näher an der Erde.',
      'Der Plejaden-Sternhaufen ("Siebengestirn") auf der Schulter des Stiers ist eines der bekanntesten Himmelsobjekte.',
    ],
    stars: [
      { name: 'Aldebaran', ra: 4.599, dec: 16.509, mag: 0.87 },
      { name: 'Epsilon Tau', ra: 4.477, dec: 19.181, mag: 3.53 },
      { name: 'Gamma Tau', ra: 4.33, dec: 15.628, mag: 3.65 },
      { name: 'Theta2 Tau', ra: 4.43, dec: 15.871, mag: 3.4 },
      { name: 'Elnath', ra: 5.438, dec: 28.608, mag: 1.65 },
      { name: 'Zeta Tau', ra: 5.629, dec: 21.143, mag: 3.0 },
      { name: 'Lambda Tau', ra: 4.012, dec: 12.49, mag: 3.47 },
    ],
    lines: [
      [6, 2],
      [2, 3],
      [3, 0],
      [0, 1],
      [1, 4],
      [0, 5],
    ],
  },
  {
    id: 'gemini',
    name: 'Zwillinge',
    latinName: 'Gemini',
    abbr: 'Gem',
    season: 'Winter',
    hemisphere: 'Nord',
    mythology:
      'Castor und Pollux waren unzertrennliche Zwillingsbrüder. Als der sterbliche Castor starb, bat der unsterbliche Pollux Zeus, seine Unsterblichkeit zu teilen — die Götter vereinten die Brüder daraufhin als Sternbild am Himmel.',
    facts: [
      'Die beiden hellsten Sterne tragen die Namen der Zwillinge selbst: Castor und Pollux.',
      'Castor ist tatsächlich ein System aus sechs Sternen, das dem bloßen Auge als einer erscheint.',
      'Der jährliche Meteorstrom der Geminiden scheint aus diesem Sternbild zu entspringen.',
    ],
    stars: [
      { name: 'Castor', ra: 7.577, dec: 31.889, mag: 1.58 },
      { name: 'Pollux', ra: 7.755, dec: 28.026, mag: 1.14 },
      { name: 'Alhena', ra: 6.629, dec: 16.399, mag: 1.93 },
      { name: 'Mebsuta', ra: 6.732, dec: 25.131, mag: 3.06 },
      { name: 'Wasat', ra: 7.335, dec: 21.982, mag: 3.53 },
      { name: 'Mekbuda', ra: 7.068, dec: 20.57, mag: 3.79 },
      { name: 'Tejat', ra: 6.383, dec: 22.514, mag: 2.88 },
      { name: 'Propus', ra: 6.245, dec: 22.514, mag: 3.31 },
    ],
    lines: [
      [0, 4],
      [4, 2],
      [1, 5],
      [5, 6],
      [6, 7],
    ],
  },
  {
    id: 'perseus',
    name: 'Perseus',
    latinName: 'Perseus',
    abbr: 'Per',
    season: 'Herbst',
    hemisphere: 'Nord',
    mythology:
      'Perseus enthauptete die Gorgone Medusa und rettete die Prinzessin Andromeda vor einem Seeungeheuer. Er wird am Himmel meist mit dem abgeschlagenen Medusenhaupt in der Hand dargestellt.',
    facts: [
      'Algol, das "Medusenhaupt", ist ein berühmter veränderlicher Stern, der regelmäßig deutlich an Helligkeit verliert.',
      'Der jährliche Meteorstrom der Perseiden im August ist nach diesem Sternbild benannt.',
      'Perseus liegt in einer sternreichen Region der Milchstraße nahe Cassiopeia.',
    ],
    stars: [
      { name: 'Mirfak', ra: 3.405, dec: 49.861, mag: 1.79 },
      { name: 'Algol', ra: 3.136, dec: 40.956, mag: 2.12 },
      { name: 'Delta Per', ra: 3.714, dec: 47.787, mag: 3.01 },
      { name: 'Epsilon Per', ra: 3.966, dec: 40.01, mag: 2.89 },
      { name: 'Zeta Per', ra: 3.902, dec: 31.884, mag: 2.85 },
      { name: 'Gamma Per', ra: 3.078, dec: 53.506, mag: 2.93 },
      { name: 'Rho Per', ra: 3.054, dec: 38.84, mag: 3.32 },
    ],
    lines: [
      [5, 0],
      [0, 2],
      [2, 3],
      [3, 4],
      [0, 6],
      [6, 1],
    ],
  },
];

export function getConstellationById(id: string): Constellation | undefined {
  return constellations.find((c) => c.id === id);
}
