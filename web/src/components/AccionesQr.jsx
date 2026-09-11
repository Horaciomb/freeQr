export default function AccionesQr({
  habilitado,
  feedback,
  soportaCopiaImagen,
  soportaCopiaTexto,
  guardarPng,
  guardarSvg,
  copiarImagen,
  copiarEnlace,
}) {
  return (
    <div className="acciones">
      <div className="acciones__botones">
        <button
          type="button"
          className="boton boton--principal"
          onClick={guardarPng}
          disabled={!habilitado}
        >
          Descargar PNG
        </button>

        <button
          type="button"
          className="boton"
          onClick={guardarSvg}
          disabled={!habilitado}
        >
          Descargar SVG
        </button>

        {/* Se muestra deshabilitado en vez de esconderlo: esconder controles
            desorienta. El title explica por que no esta disponible. */}
        <button
          type="button"
          className="boton"
          onClick={copiarImagen}
          disabled={!habilitado || !soportaCopiaImagen}
          title={
            soportaCopiaImagen
              ? undefined
              : 'Tu navegador no permite copiar imágenes (requiere HTTPS o localhost).'
          }
        >
          Copiar imagen
        </button>

        {!soportaCopiaImagen && soportaCopiaTexto && (
          <button
            type="button"
            className="boton"
            onClick={copiarEnlace}
            disabled={!habilitado}
          >
            Copiar link
          </button>
        )}
      </div>

      {/* aria-live anuncia el cambio sin robar el foco. El texto de los botones
          no cambia, para evitar reflow y confusion sobre que hacen. */}
      <p
        className={`estado ${feedback ? `estado--${feedback.tipo}` : ''}`}
        role="status"
        aria-live="polite"
      >
        {feedback?.texto ?? ''}
      </p>
    </div>
  );
}
