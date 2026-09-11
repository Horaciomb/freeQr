/**
 * Normalizacion y analisis de la entrada del usuario.
 *
 * Equivale a normalizar_url() de generar_qr.py, pero corrige un bug de esa
 * version: urlparse() acepta puntos dentro del esquema, asi que para
 * "ejemplo.com:8080/ruta" devuelve scheme="ejemplo.com" y el CLI no le agrega
 * https://. Aca exigimos "://" explicitamente.
 */

const ESQUEMA_CON_BARRAS = /^[a-z][a-z0-9+.-]*:\/\//i;
const ESQUEMAS_SIN_BARRAS = /^(mailto|tel|sms|geo):/i;

/** Agrega https:// cuando falta el esquema. Devuelve '' para entrada vacia. */
export function normalizarUrl(entrada) {
  const valor = (entrada ?? '').trim();
  if (!valor) return '';
  if (ESQUEMA_CON_BARRAS.test(valor) || ESQUEMAS_SIN_BARRAS.test(valor)) {
    return valor;
  }
  return `https://${valor}`;
}

/**
 * Analiza la entrada sin bloquear al usuario mientras tipea.
 *
 * @returns {{valor: string, estado: 'vacio'|'ok'|'texto', aviso: string|null}}
 *   valor  - lo que realmente se va a codificar en el QR
 *   estado - 'vacio' es el unico que inhabilita las acciones
 *   aviso  - mensaje neutro para mostrar debajo del input, o null
 */
export function analizarUrl(entrada) {
  const crudo = (entrada ?? '').trim();
  if (!crudo) {
    return { valor: '', estado: 'vacio', aviso: null };
  }

  const candidato = normalizarUrl(crudo);
  try {
    const url = new URL(candidato);
    const dominioPlausible =
      url.hostname.includes('.') || url.hostname === 'localhost';
    return {
      valor: candidato,
      estado: 'ok',
      aviso: dominioPlausible
        ? null
        : 'No parece un dominio; revisa que este bien escrito.',
    };
  } catch {
    // No es una URL: se codifica el texto tal cual, sin pegarle https:// adelante.
    return {
      valor: crudo,
      estado: 'texto',
      aviso: 'No es una URL valida: se codifica como texto plano.',
    };
  }
}

/** Nombre de archivo derivado del dominio, p. ej. qr-github-com.png */
export function nombreArchivo(valor, extension) {
  try {
    const host = new URL(valor).hostname
      .replace(/^www\./, '')
      .replace(/[^a-z0-9.-]/gi, '-')
      .replace(/\./g, '-');
    return `qr-${host}.${extension}`;
  } catch {
    return `qr.${extension}`;
  }
}
