import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { MARGEN_MODULOS } from '../constantes';

/**
 * Dos representaciones del mismo QR:
 *   - <QRCodeSVG> visible: vectorial, nitido a cualquier tamanio y ademas la
 *     fuente de la descarga SVG.
 *   - <QRCodeCanvas> oculto a tamanio completo: fuente del PNG y del
 *     portapapeles. El canvas 2D dibuja igual sin estar en el layout.
 */
export default function VistaPreviaQr({
  valor,
  nivel,
  colorModulos,
  colorFondo,
  tamano,
  svgRef,
  canvasRef,
}) {
  if (!valor) {
    return (
      <div className="preview preview--vacio">
        <p>Tu codigo QR va a aparecer aca</p>
      </div>
    );
  }

  const comunes = {
    value: valor,
    level: nivel,
    fgColor: colorModulos,
    bgColor: colorFondo,
    marginSize: MARGEN_MODULOS, // el default de la libreria es 0 y rompe lectores
    boostLevel: false, // que el nivel mostrado sea el nivel real
  };

  return (
    <>
      <div className="preview">
        <QRCodeSVG
          {...comunes}
          ref={svgRef}
          size={tamano}
          width="100%"
          height="100%"
          title={`Codigo QR para ${valor}`}
        />
      </div>

      {/* Fuente de alta resolucion para PNG y portapapeles. */}
      <div className="preview__fuente-oculta" aria-hidden="true">
        <QRCodeCanvas {...comunes} ref={canvasRef} size={tamano} />
      </div>
    </>
  );
}
