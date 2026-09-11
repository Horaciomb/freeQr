import { useDeferredValue, useMemo, useRef, useState } from 'react';
import FormularioQr from './components/FormularioQr';
import VistaPreviaQr from './components/VistaPreviaQr';
import AccionesQr from './components/AccionesQr';
import useAccionesQr from './hooks/useAccionesQr';
import { analizarUrl } from './utils/url';
import { avisoColores, esHexValido } from './utils/colores';
import { DEFAULTS } from './constantes';

export default function App() {
  const [entrada, setEntrada] = useState('');
  const [colorModulos, setColorModulos] = useState(DEFAULTS.colorModulos);
  const [colorFondo, setColorFondo] = useState(DEFAULTS.colorFondo);
  const [tamano, setTamano] = useState(DEFAULTS.tamano);
  const [nivel, setNivel] = useState(DEFAULTS.nivel);

  const svgRef = useRef(null);
  const canvasRef = useRef(null);

  // Desacopla el render del QR del tecleo, sin debounce manual.
  const entradaDiferida = useDeferredValue(entrada);
  const analisis = useMemo(() => analizarUrl(entradaDiferida), [entradaDiferida]);
  const avisoColor = useMemo(
    () => avisoColores(colorModulos, colorFondo),
    [colorModulos, colorFondo],
  );

  // Un hex a medio escribir no debe romper el render del QR.
  const fgSeguro = esHexValido(colorModulos) ? colorModulos : DEFAULTS.colorModulos;
  const bgSeguro = esHexValido(colorFondo) ? colorFondo : DEFAULTS.colorFondo;

  const acciones = useAccionesQr({
    valor: analisis.valor,
    tamano,
    svgRef,
    canvasRef,
  });

  return (
    <div className="pagina">
      <header className="cabecera">
        <h1>freeQR</h1>
        <p>Pegá un link y descargá su código QR. Todo pasa en tu navegador.</p>
      </header>

      <main className="contenido">
        <section className="columna columna--controles">
          <FormularioQr
            entrada={entrada}
            setEntrada={setEntrada}
            colorModulos={colorModulos}
            setColorModulos={setColorModulos}
            colorFondo={colorFondo}
            setColorFondo={setColorFondo}
            tamano={tamano}
            setTamano={setTamano}
            nivel={nivel}
            setNivel={setNivel}
            analisis={analisis}
            avisoColor={avisoColor}
          />
        </section>

        <section className="columna columna--preview">
          <VistaPreviaQr
            valor={analisis.valor}
            nivel={nivel}
            colorModulos={fgSeguro}
            colorFondo={bgSeguro}
            tamano={tamano}
            svgRef={svgRef}
            canvasRef={canvasRef}
          />
          <AccionesQr habilitado={analisis.estado !== 'vacio'} {...acciones} />
        </section>
      </main>

      <footer className="pie">
        <p>
          También existe como script de Python:{' '}
          <code>python generar_qr.py https://ejemplo.com</code>
        </p>
      </footer>
    </div>
  );
}
