# @aaroncode/iframe-bridge

Librería para facilitar la comunicación segura entre una aplicación padre y un iframe usando `postMessage`.

## Instalación

```bash
npm install @aaroncode/iframe-bridge
```

## Uso básico

### 1. Agrega los elementos en tu HTML

```html
<button id="openKycBtn">Abrir KYC</button>
<iframe id="kycIframe" style="display:none;width:600px;height:400px;"></iframe>
<div id="mensaje"></div>
```

### 2. Usa la librería en tu JS

#### Opción A: Busca el archivo index.js dentro de la carpeta node_modules/@aaroncode/iframe-bridge/dist/ Copia este archivo a tu proyecto (por ejemplo, al mismo nivel que tu archivo de ejemplo) y renómbralo si lo deseas.

```js
import { KycIframeBridge } from "./index.js";



```

#### Opción B: Importando desde npm (con bundler)

```js
import { KycIframeBridge } from "@aaroncode/iframe-bridge";
```

#### Opción C: Importando desde CDN (jsDelivr)

```js
import { KycIframeBridge } from "https://cdn.jsdelivr.net/npm/@aaroncode/iframe-bridge/+esm";

```
### Ejemplo de uso:

```js

    
    const bridge = new KycIframeBridge({
    iframeId: "kycIframe",
    buttonId: "openKycBtn",
    allowedOrigins: ["http://localhost:45679"],
    iframeUrl: "http://localhost:45679/kyc",
    entity: {
        id: "usuario-123",
        apiKey: "api-key-xyz"
    },
    onExit: (data) => {
        document.getElementById("mensaje").textContent = "KYC cerrado: " + (data?.message || "");
    },
    onError: (data) => {
        document.getElementById("mensaje").textContent = "Error: " + (data?.message || "");
    }
    });
```

## Opciones del constructor

| Opción         | Tipo     | Descripción                                        |
| -------------- | -------- | -------------------------------------------------- |
| iframeId       | string   | ID del iframe en el DOM                            |
| buttonId       | string   | ID del botón que abre el iframe                    |
| allowedOrigins | string[] | Lista de orígenes permitidos para recibir mensajes |
| iframeUrl      | string   | URL que se cargará en el iframe                    |
| entity         | object   | Datos que se enviarán al iframe                    |
| onExit         | function | Callback al cerrar el iframe                       |
| onError        | function | Callback para errores                              |

## Notas

- Solo se permite comunicación por `postMessage` (no acceso directo al DOM del iframe si es cross-origin).
- Si tienes una app sin usar herramientas de empaquetado la mejor forma es usando  la libreria es descargandolo desde npm usando npm install @aaroncode/iframe-bridge luego buscar la carpeta dentro de node_modules el archivo index.js en la carpeta @aaroncode/iframe-bridge/dist/index.js y copear lo que existe en este archivo en un archivo js

---