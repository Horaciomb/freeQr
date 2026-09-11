# freeQR

Generador de códigos QR a partir de un link. Viene en dos sabores que comparten
las mismas opciones: una **web en React** y un **script de Python** para la
terminal.

## Web

App React (Vite) que genera el QR enteramente en el navegador: no hay backend,
no se envía la URL a ningún servidor.

```bash
cd web
npm install
npm run dev      # http://localhost:5173
```

Permite elegir color, fondo, tamaño de descarga y nivel de corrección de
errores, y ofrece descargar **PNG**, descargar **SVG** o **copiar la imagen** al
portapapeles.

> El botón de copiar al portapapeles necesita un contexto seguro (HTTPS o
> `localhost`). Si servís con `npm run dev -- --host` y entrás desde el celular
> por `http://192.168.x.x:5173`, el navegador lo bloquea: no es un error de la app.

Build de producción:

```bash
npm run build && npm run preview
```

## CLI de Python

```bash
python -m venv venv
venv\Scripts\pip install -r requirements.txt
venv\Scripts\python generar_qr.py https://ejemplo.com
```

Sin argumentos pide la URL de forma interactiva.

| Flag | Qué hace | Default |
|---|---|---|
| `-o, --salida` | archivo de salida (`.png`, `.jpg`, `.webp`) | `qr.png` |
| `-t, --tamano` | píxeles **por módulo** | `10` |
| `-b, --borde` | margen en módulos | `4` |
| `-c, --correccion` | nivel `L` / `M` / `Q` / `H` | `M` |
| `--color` / `--fondo` | colores (nombre o hex) | `black` / `white` |

## Una diferencia entre los dos

El `--tamano` del CLI son píxeles **por módulo**, así que el tamaño final de la
imagen depende de cuán larga sea la URL: `-t 10` puede dar 330px o 570px. La web
en cambio te deja elegir el **tamaño final** de la imagen (256 / 512 / 1024 /
2048 px), que suele ser lo que uno quiere controlar.

## Deploy

`vercel.json` en la raíz ya deja configurado el build desde la subcarpeta `web/`.
Importá el repo en Vercel dejando el Root Directory en `/` (el default) y no hace
falta tocar nada en el panel.

## Estructura

```
freeQr/
├── generar_qr.py      CLI de Python
├── requirements.txt
├── vercel.json        build de la web desde web/
└── web/               app React (Vite)
    └── src/
        ├── components/   formulario, vista previa, acciones
        ├── hooks/        descargas y portapapeles
        └── utils/        URL, exportación, contraste de colores
```
