import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  copiarPng,
  descargarPng,
  descargarSvg,
  puedeCopiarImagen,
  puedeCopiarTexto,
} from '../utils/exportar';
import { nombreArchivo } from '../utils/url';

const DURACION_FEEDBACK = 3000;

/** Descargas, copia al portapapeles y el mensaje de estado que las acompania. */
export default function useAccionesQr({ valor, tamano, svgRef, canvasRef }) {
  const [feedback, setFeedback] = useState(null);

  // Se evalua una sola vez: depende del navegador, no del estado de la app.
  const soportaCopiaImagen = useMemo(() => puedeCopiarImagen(), []);
  const soportaCopiaTexto = useMemo(() => puedeCopiarTexto(), []);

  useEffect(() => {
    if (!feedback) return undefined;
    const id = setTimeout(() => setFeedback(null), DURACION_FEEDBACK);
    return () => clearTimeout(id);
  }, [feedback]);

  const guardarPng = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      await descargarPng(canvasRef.current, tamano, nombreArchivo(valor, 'png'));
      setFeedback({ tipo: 'ok', texto: 'PNG descargado' });
    } catch {
      setFeedback({ tipo: 'error', texto: 'No se pudo generar el PNG.' });
    }
  }, [canvasRef, tamano, valor]);

  const guardarSvg = useCallback(() => {
    if (!svgRef.current) return;
    try {
      descargarSvg(svgRef.current, tamano, nombreArchivo(valor, 'svg'));
      setFeedback({ tipo: 'ok', texto: 'SVG descargado' });
    } catch {
      setFeedback({ tipo: 'error', texto: 'No se pudo generar el SVG.' });
    }
  }, [svgRef, tamano, valor]);

  const copiarImagen = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      await copiarPng(canvasRef.current, tamano);
      setFeedback({ tipo: 'ok', texto: '¡Imagen copiada!' });
    } catch (error) {
      if (error.motivo === 'no-soportado') {
        setFeedback({
          tipo: 'aviso',
          texto: 'Tu navegador no permite copiar imágenes. Descargá el PNG.',
        });
        return;
      }
      // Degradacion util: si la copia falla, al menos se lleva el archivo.
      await guardarPng();
      setFeedback({ tipo: 'aviso', texto: 'No se pudo copiar; descargamos el PNG.' });
    }
  }, [canvasRef, tamano, guardarPng]);

  const copiarEnlace = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(valor);
      setFeedback({ tipo: 'ok', texto: 'Link copiado' });
    } catch {
      setFeedback({ tipo: 'error', texto: 'No se pudo copiar el link.' });
    }
  }, [valor]);

  return {
    feedback,
    soportaCopiaImagen,
    soportaCopiaTexto,
    guardarPng,
    guardarSvg,
    copiarImagen,
    copiarEnlace,
  };
}
