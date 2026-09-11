/**
 * Aviso de contraste entre modulos y fondo.
 *
 * Esto es correccion funcional, no cosmetica: un QR con modulos mas claros que
 * el fondo esta invertido y casi ningun lector lo interpreta.
 */

const canal = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

const PESOS = [0.2126, 0.7152, 0.0722];

/** Luminancia relativa (WCAG) de un hex #rrggbb. */
export function luminancia(hex) {
  return [1, 3, 5]
    .map((i) => canal(parseInt(hex.slice(i, i + 2), 16) / 255))
    .reduce((acc, valor, i) => acc + PESOS[i] * valor, 0);
}

/** @returns {string|null} mensaje de aviso, o null si el contraste sirve. */
export function avisoColores(colorModulos, colorFondo) {
  if (!esHexValido(colorModulos) || !esHexValido(colorFondo)) return null;

  const lModulos = luminancia(colorModulos);
  const lFondo = luminancia(colorFondo);

  if (lModulos > lFondo) {
    return 'Los modulos son mas claros que el fondo: la mayoria de los lectores no va a poder escanearlo.';
  }

  const ratio =
    (Math.max(lModulos, lFondo) + 0.05) / (Math.min(lModulos, lFondo) + 0.05);
  if (ratio < 3) {
    return 'Contraste bajo entre modulos y fondo; puede fallar el escaneo.';
  }

  return null;
}

export function esHexValido(valor) {
  return /^#[0-9a-f]{6}$/i.test(valor ?? '');
}
