/** Niveles de correccion de errores, en el mismo orden que el CLI de Python. */
export const NIVELES = [
  { valor: 'L', etiqueta: 'L', detalle: '~7% de recuperacion' },
  { valor: 'M', etiqueta: 'M', detalle: '~15%, equilibrado' },
  { valor: 'Q', etiqueta: 'Q', detalle: '~25%' },
  { valor: 'H', etiqueta: 'H', detalle: '~30%, resiste mas danio' },
];

/**
 * Tamanios de descarga en pixeles totales de la imagen.
 *
 * Ojo: el CLI expone --tamano como pixeles POR MODULO (box_size), asi que alli
 * el tamanio final depende del largo de la URL. Aca exponemos el tamanio final,
 * que es lo que realmente se quiere elegir. Tope en 2048: con devicePixelRatio 2
 * el buffer interno del canvas ya seria de 4096x4096 (~64 MB).
 */
export const TAMANOS = [256, 512, 1024, 2048];

/** Zona de silencio que exige la especificacion (= --borde 4 del CLI).
 *  qrcode.react usa 0 por defecto y muchos lectores fallan sin este margen. */
export const MARGEN_MODULOS = 4;

export const DEFAULTS = {
  colorModulos: '#000000',
  colorFondo: '#ffffff',
  tamano: 1024,
  nivel: 'M',
};
