import { Body, Equator, Horizon, Observer } from 'astronomy-engine';

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

export interface HorizontalCoords {
  /** Degrees clockwise from true north, [0, 360). */
  azimuth: number;
  /** Degrees above the horizon, negative below. */
  altitude: number;
}

function toObserver(position: GeoPosition): Observer {
  return new Observer(position.latitude, position.longitude, 0);
}

/**
 * Alt/Az for a fixed catalog star given its J2000 right ascension (hours) and declination (degrees).
 */
export function getStarHorizontalCoords(
  ra: number,
  dec: number,
  position: GeoPosition,
  date: Date
): HorizontalCoords {
  const horizon = Horizon(date, toObserver(position), ra, dec, 'normal');
  return { azimuth: horizon.azimuth, altitude: horizon.altitude };
}

/**
 * Alt/Az for a solar-system body (Sun, Moon, planets) at the given time and place.
 */
export function getBodyHorizontalCoords(
  body: Body,
  position: GeoPosition,
  date: Date
): HorizontalCoords {
  const observer = toObserver(position);
  const equatorOfDate = Equator(body, date, observer, true, true);
  const horizon = Horizon(date, observer, equatorOfDate.ra, equatorOfDate.dec, 'normal');
  return { azimuth: horizon.azimuth, altitude: horizon.altitude };
}

/** Smallest signed angular difference (in degrees) going from `a` to `b`, in the range (-180, 180]. */
export function angleDiffDeg(a: number, b: number): number {
  let diff = (b - a) % 360;
  if (diff > 180) diff -= 360;
  if (diff <= -180) diff += 360;
  return diff;
}

/**
 * Projects a point at (azimuth, altitude) onto a flat screen plane centered on the
 * direction the device is currently pointing at (centerAz, centerAlt), using a simple
 * tangent (gnomonic) projection. Output units are degrees of angular offset, scaled by
 * the caller into pixels — well-behaved for the camera's field of view.
 */
export function projectToScreen(
  azimuth: number,
  altitude: number,
  centerAz: number,
  centerAlt: number
): { x: number; y: number } {
  const dAz = angleDiffDeg(centerAz, azimuth) * (Math.PI / 180);
  const dAlt = ((altitude - centerAlt) * Math.PI) / 180;
  const centerAltRad = (centerAlt * Math.PI) / 180;
  const x = dAz * Math.cos(centerAltRad);
  const y = dAlt;
  return { x: (x * 180) / Math.PI, y: (y * 180) / Math.PI };
}

export { Body };
