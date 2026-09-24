import { Body } from 'astronomy-engine';

export interface PlanetVisual {
  /** Base sphere color. */
  color: string;
  /** Secondary color used for bands/shading gradient stop. */
  colorAlt: string;
  hasRings?: boolean;
}

export interface Planet {
  id: string;
  name: string;
  /** astronomy-engine body used to compute real-time position; undefined for bodies without one (none currently). */
  body: Body;
  tagline: string;
  description: string;
  facts: { label: string; value: string }[];
  visual: PlanetVisual;
}

export const planets: Planet[] = [
  {
    id: 'sonne',
    name: 'Sonne',
    body: Body.Sun,
    tagline: 'Der Stern in unserem Zentrum',
    description:
      'Die Sonne ist ein durchschnittlich großer Stern und macht über 99 % der Masse unseres gesamten Sonnensystems aus. Ihre Energie entsteht durch Kernfusion in ihrem Inneren, bei der Wasserstoff zu Helium verschmilzt.',
    facts: [
      { label: 'Durchmesser', value: '≈ 1.392.700 km' },
      { label: 'Entfernung zur Erde', value: '≈ 149,6 Mio. km (1 AE)' },
      { label: 'Oberflächentemperatur', value: '≈ 5.500 °C' },
      { label: 'Alter', value: '≈ 4,6 Milliarden Jahre' },
    ],
    visual: { color: '#F3C969', colorAlt: '#F58A3B' },
  },
  {
    id: 'mond',
    name: 'Mond',
    body: Body.Moon,
    tagline: 'Unser einziger natürlicher Begleiter',
    description:
      'Der Mond entstand vermutlich vor rund 4,5 Milliarden Jahren durch eine gewaltige Kollision zwischen der jungen Erde und einem marsgroßen Körper. Er stabilisiert die Neigung der Erdachse und ist für die Gezeiten verantwortlich.',
    facts: [
      { label: 'Durchmesser', value: '≈ 3.474 km' },
      { label: 'Mittlere Entfernung', value: '≈ 384.400 km' },
      { label: 'Umlaufzeit', value: '≈ 27,3 Tage' },
      { label: 'Schwerkraft', value: '≈ 1/6 der Erdschwerkraft' },
    ],
    visual: { color: '#D9D6E3', colorAlt: '#9A96AB' },
  },
  {
    id: 'merkur',
    name: 'Merkur',
    body: Body.Mercury,
    tagline: 'Der sonnennächste Planet',
    description:
      'Merkur ist der kleinste und sonnennächste Planet unseres Systems. Ohne nennenswerte Atmosphäre schwanken die Temperaturen zwischen glühend heißen Tagen und eisig kalten Nächten extrem.',
    facts: [
      { label: 'Durchmesser', value: '≈ 4.879 km' },
      { label: 'Abstand zur Sonne', value: '≈ 57,9 Mio. km' },
      { label: 'Umlaufzeit', value: '88 Tage' },
      { label: 'Monde', value: '0' },
    ],
    visual: { color: '#B7A99A', colorAlt: '#7A6E63' },
  },
  {
    id: 'venus',
    name: 'Venus',
    body: Body.Venus,
    tagline: 'Der heißeste Planet des Sonnensystems',
    description:
      'Venus ist von einer dichten Kohlendioxid-Atmosphäre umhüllt, die einen extremen Treibhauseffekt erzeugt. Ihre Oberflächentemperatur übertrifft sogar die des sonnennäheren Merkur.',
    facts: [
      { label: 'Durchmesser', value: '≈ 12.104 km' },
      { label: 'Abstand zur Sonne', value: '≈ 108,2 Mio. km' },
      { label: 'Umlaufzeit', value: '225 Tage' },
      { label: 'Oberflächentemperatur', value: '≈ 465 °C' },
    ],
    visual: { color: '#E8C88B', colorAlt: '#C79A56' },
  },
  {
    id: 'mars',
    name: 'Mars',
    body: Body.Mars,
    tagline: 'Der Rote Planet',
    description:
      'Mars verdankt seine Farbe eisenoxidhaltigem Staub auf seiner Oberfläche. Er besitzt die größte bekannte Vulkanstruktur des Sonnensystems, den Olympus Mons, und gilt als aussichtsreichstes Ziel für zukünftige bemannte Missionen.',
    facts: [
      { label: 'Durchmesser', value: '≈ 6.779 km' },
      { label: 'Abstand zur Sonne', value: '≈ 227,9 Mio. km' },
      { label: 'Umlaufzeit', value: '687 Tage' },
      { label: 'Monde', value: '2 (Phobos, Deimos)' },
    ],
    visual: { color: '#C1583A', colorAlt: '#8A3722' },
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    body: Body.Jupiter,
    tagline: 'Der Gigant unter den Planeten',
    description:
      'Jupiter ist der größte Planet des Sonnensystems und besteht überwiegend aus Wasserstoff und Helium. Sein Großer Roter Fleck ist ein gigantischer Sturm, der seit Jahrhunderten beobachtet wird.',
    facts: [
      { label: 'Durchmesser', value: '≈ 139.820 km' },
      { label: 'Abstand zur Sonne', value: '≈ 778,5 Mio. km' },
      { label: 'Umlaufzeit', value: '≈ 11,9 Jahre' },
      { label: 'Monde', value: '95 bekannte Monde' },
    ],
    visual: { color: '#D9B48F', colorAlt: '#A9744F' },
  },
  {
    id: 'saturn',
    name: 'Saturn',
    body: Body.Saturn,
    tagline: 'Der Herr der Ringe',
    description:
      'Saturns spektakuläres Ringsystem besteht hauptsächlich aus Eispartikeln und etwas Gestein. Der Gasriese ist so leicht, dass er theoretisch in einem ausreichend großen Wasserbecken schwimmen würde.',
    facts: [
      { label: 'Durchmesser', value: '≈ 116.460 km' },
      { label: 'Abstand zur Sonne', value: '≈ 1,43 Mrd. km' },
      { label: 'Umlaufzeit', value: '≈ 29,5 Jahre' },
      { label: 'Monde', value: '146 bekannte Monde' },
    ],
    visual: { color: '#E6D2A6', colorAlt: '#BFA268', hasRings: true },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    body: Body.Uranus,
    tagline: 'Der Planet auf der Seite',
    description:
      'Uranus rotiert fast quer zu seiner Umlaufbahn, vermutlich das Ergebnis einer gewaltigen Kollision in seiner Frühzeit. Seine blassblaue Farbe stammt von Methan in der oberen Atmosphäre.',
    facts: [
      { label: 'Durchmesser', value: '≈ 50.724 km' },
      { label: 'Abstand zur Sonne', value: '≈ 2,87 Mrd. km' },
      { label: 'Umlaufzeit', value: '≈ 84 Jahre' },
      { label: 'Monde', value: '28 bekannte Monde' },
    ],
    visual: { color: '#9FD9E0', colorAlt: '#5FA6AD' },
  },
  {
    id: 'neptun',
    name: 'Neptun',
    body: Body.Neptune,
    tagline: 'Der windigste Planet',
    description:
      'Neptun ist der äußerste bekannte Planet unseres Sonnensystems und besitzt die stärksten Winde, die je in einem Planetensystem gemessen wurden — mit Geschwindigkeiten von über 2.000 km/h.',
    facts: [
      { label: 'Durchmesser', value: '≈ 49.244 km' },
      { label: 'Abstand zur Sonne', value: '≈ 4,50 Mrd. km' },
      { label: 'Umlaufzeit', value: '≈ 165 Jahre' },
      { label: 'Monde', value: '16 bekannte Monde' },
    ],
    visual: { color: '#5B7FE0', colorAlt: '#3A54A6' },
  },
];

export function getPlanetById(id: string): Planet | undefined {
  return planets.find((p) => p.id === id);
}
