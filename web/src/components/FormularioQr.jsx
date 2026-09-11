import { NIVELES, TAMANOS } from '../constantes';
import { esHexValido } from '../utils/colores';

function CampoColor({ id, etiqueta, valor, onChange }) {
  return (
    <div className="campo-color">
      <label htmlFor={id}>{etiqueta}</label>
      <div className="campo-color__controles">
        <input
          type="color"
          id={id}
          value={esHexValido(valor) ? valor : '#000000'}
          onChange={(e) => onChange(e.target.value)}
        />
        {/* El picker nativo no es accesible por teclado en varios navegadores:
            el campo de texto es la ruta alternativa y permite pegar un hex. */}
        <input
          type="text"
          className="campo-color__hex"
          aria-label={`${etiqueta} en hexadecimal`}
          value={valor}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function FormularioQr({
  entrada,
  setEntrada,
  colorModulos,
  setColorModulos,
  colorFondo,
  setColorFondo,
  tamano,
  setTamano,
  nivel,
  setNivel,
  analisis,
  avisoColor,
}) {
  return (
    <form className="formulario" onSubmit={(e) => e.preventDefault()}>
      <div className="campo">
        <label htmlFor="url">Link o texto</label>
        <input
          id="url"
          type="url"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          placeholder="ejemplo.com"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          aria-describedby="ayuda-url"
        />
        <p id="ayuda-url" className="ayuda" role="status" aria-live="polite">
          {analisis.estado === 'vacio'
            ? 'Si no ponés esquema, le agregamos https://'
            : analisis.aviso ?? `Se codificará: ${analisis.valor}`}
        </p>
      </div>

      <fieldset className="campo">
        <legend>Corrección de errores</legend>
        <div className="niveles">
          {NIVELES.map(({ valor, etiqueta, detalle }) => (
            <label key={valor} className="nivel">
              <input
                type="radio"
                name="nivel"
                value={valor}
                checked={nivel === valor}
                onChange={() => setNivel(valor)}
              />
              <span className="nivel__letra">{etiqueta}</span>
              <span className="nivel__detalle">{detalle}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="campo campo--colores">
        <CampoColor
          id="color-modulos"
          etiqueta="Color"
          valor={colorModulos}
          onChange={setColorModulos}
        />
        <CampoColor
          id="color-fondo"
          etiqueta="Fondo"
          valor={colorFondo}
          onChange={setColorFondo}
        />
      </div>

      {avisoColor && (
        <p className="aviso" role="status" aria-live="polite">
          {avisoColor}
        </p>
      )}

      <div className="campo">
        <label htmlFor="tamano">Tamaño de descarga (px)</label>
        <select
          id="tamano"
          value={tamano}
          onChange={(e) => setTamano(Number(e.target.value))}
          aria-describedby="ayuda-tamano"
        >
          {TAMANOS.map((px) => (
            <option key={px} value={px}>
              {px} × {px}
            </option>
          ))}
        </select>
        <p id="ayuda-tamano" className="ayuda">
          No afecta la vista previa, solo el archivo descargado.
        </p>
      </div>
    </form>
  );
}
