/**
 * Descarga PNG / SVG y copia al portapapeles.
 *
 * Aca viven los tres detalles finos del proyecto:
 *   1. qrcode.react multiplica el canvas por devicePixelRatio -> hay que
 *      remuestrear para que el PNG mida exactamente lo que pidio el usuario.
 *   2. El SVG del DOM usa width="100%"; en un archivo suelto hay que fijar
 *      dimensiones concretas y declarar el xmlns.
 *   3. El portapapeles exige construir el ClipboardItem con la PROMESA del
 *      blob, sin await previo, o Safari invalida el gesto del usuario.
 */

export class ErrorPortapapeles extends Error {
  constructor(motivo, opciones) {
    super(motivo, opciones);
    this.name = 'ErrorPortapapeles';
    this.motivo = motivo;
  }
}

/**
 * Devuelve un canvas de exactamente px por px.
 *
 * qrcode.react hace canvas.width = size * devicePixelRatio, asi que en una
 * pantalla Windows al 150% un size de 1024 produce un bitmap de 1536.
 */
export function canvasATamanoExacto(origen, px) {
  if (origen.width === px) return origen;

  const destino = document.createElement('canvas');
  destino.width = px;
  destino.height = px;

  const ctx = destino.getContext('2d');
  ctx.imageSmoothingEnabled = false; // bordes duros: los modulos no deben difuminarse
  ctx.drawImage(origen, 0, 0, px, px);
  return destino;
}

export function canvasABlob(canvas, tipo = 'image/png') {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('canvas.toBlob() devolvio null'));
    }, tipo);
  });
}

export function descargarBlob(blob, nombre) {
  const href = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = href;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  // Safari necesita que la URL siga viva un rato despues del click.
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export async function descargarPng(canvas, px, nombre) {
  const blob = await canvasABlob(canvasATamanoExacto(canvas, px));
  descargarBlob(blob, nombre);
}

/** Serializa el <svg> del DOM a un archivo autocontenido. */
export function svgABlob(svgEl, px) {
  const clon = svgEl.cloneNode(true);
  clon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clon.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  // En el DOM vale width="100%" para que sea responsive; en un archivo suelto
  // hace falta un tamanio concreto. El viewBox se conserva, asi que sigue
  // escalando sin perder calidad.
  clon.setAttribute('width', String(px));
  clon.setAttribute('height', String(px));

  const xml = new XMLSerializer().serializeToString(clon);
  return new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], {
    type: 'image/svg+xml;charset=utf-8',
  });
}

export function descargarSvg(svgEl, px, nombre) {
  descargarBlob(svgABlob(svgEl, px), nombre);
}

/** El portapapeles de imagenes exige contexto seguro (https o localhost). */
export function puedeCopiarImagen() {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    typeof ClipboardItem !== 'undefined' &&
    typeof navigator.clipboard?.write === 'function'
  );
}

export async function copiarPng(canvas, px) {
  if (!puedeCopiarImagen()) {
    throw new ErrorPortapapeles('no-soportado');
  }

  // Sincrono a proposito: no rompe la cadena del gesto del usuario.
  const fuente = canvasATamanoExacto(canvas, px);

  // Clave: se le pasa la PROMESA del blob al ClipboardItem. Hacer
  // `const blob = await canvasABlob(...)` antes funciona en Chrome pero
  // rompe en Safari, que invalida la activacion del usuario tras el await.
  const item = new ClipboardItem({ 'image/png': canvasABlob(fuente) });

  try {
    await navigator.clipboard.write([item]);
  } catch (causa) {
    // Tipico: NotAllowedError "Document is not focused" con DevTools enfocado.
    throw new ErrorPortapapeles('fallo', { cause: causa });
  }
}

export function puedeCopiarTexto() {
  return (
    typeof window !== 'undefined' &&
    window.isSecureContext &&
    typeof navigator.clipboard?.writeText === 'function'
  );
}
