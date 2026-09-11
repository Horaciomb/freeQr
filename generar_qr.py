"""Genera una imagen QR a partir de una URL.

Uso:
    python generar_qr.py https://ejemplo.com
    python generar_qr.py https://ejemplo.com -o mi_qr.png --tamano 12 --color "#1a1a1a"

Sin argumentos, pide la URL de forma interactiva.
"""

import argparse
import sys
from pathlib import Path
from urllib.parse import urlparse

import qrcode
from qrcode.constants import (
    ERROR_CORRECT_L,
    ERROR_CORRECT_M,
    ERROR_CORRECT_Q,
    ERROR_CORRECT_H,
)

NIVELES_CORRECCION = {
    "L": ERROR_CORRECT_L,  # ~7% de recuperacion
    "M": ERROR_CORRECT_M,  # ~15%
    "Q": ERROR_CORRECT_Q,  # ~25%
    "H": ERROR_CORRECT_H,  # ~30% (recomendado si pones un logo encima)
}


def normalizar_url(url: str) -> str:
    """Agrega https:// si el usuario no incluyo esquema."""
    url = url.strip()
    if not url:
        raise ValueError("La URL no puede estar vacia.")
    if not urlparse(url).scheme:
        url = "https://" + url
    return url


def generar_qr(
    url: str,
    salida: Path,
    tamano: int = 10,
    borde: int = 4,
    correccion: str = "M",
    color: str = "black",
    fondo: str = "white",
) -> Path:
    """Crea el QR y lo guarda en `salida`. Devuelve la ruta final."""
    qr = qrcode.QRCode(
        version=None,  # se ajusta solo al largo de la URL
        error_correction=NIVELES_CORRECCION[correccion.upper()],
        box_size=tamano,
        border=borde,
    )
    qr.add_data(url)
    qr.make(fit=True)

    imagen = qr.make_image(fill_color=color, back_color=fondo)

    salida.parent.mkdir(parents=True, exist_ok=True)
    imagen.save(salida)
    return salida


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Genera una imagen QR desde una URL."
    )
    parser.add_argument("url", nargs="?", help="URL a codificar en el QR")
    parser.add_argument(
        "-o", "--salida",
        default="qr.png",
        help="Archivo de salida (.png, .jpg, .webp). Por defecto: qr.png",
    )
    parser.add_argument(
        "-t", "--tamano",
        type=int,
        default=10,
        help="Pixeles por modulo del QR. Por defecto: 10",
    )
    parser.add_argument(
        "-b", "--borde",
        type=int,
        default=4,
        help="Ancho del margen blanco en modulos (minimo 4). Por defecto: 4",
    )
    parser.add_argument(
        "-c", "--correccion",
        choices=list(NIVELES_CORRECCION),
        default="M",
        help="Nivel de correccion de errores. Por defecto: M",
    )
    parser.add_argument(
        "--color", default="black", help="Color de los modulos. Por defecto: black"
    )
    parser.add_argument(
        "--fondo", default="white", help="Color de fondo. Por defecto: white"
    )
    args = parser.parse_args()

    url = args.url or input("Pega la URL: ")

    try:
        url = normalizar_url(url)
        ruta = generar_qr(
            url=url,
            salida=Path(args.salida),
            tamano=args.tamano,
            borde=args.borde,
            correccion=args.correccion,
            color=args.color,
            fondo=args.fondo,
        )
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    except OSError as exc:
        print(f"No se pudo guardar la imagen: {exc}", file=sys.stderr)
        return 1

    print(f"QR generado: {ruta.resolve()}")
    print(f"Apunta a: {url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
