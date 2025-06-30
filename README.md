# @aaroncode/iframe-bridge

Librería para facilitar la comunicación segura entre una aplicación padre y un iframe usando `postMessage`.

---

## Español

### Instalación

#### Opción 1: Instalar desde npm

```bash
npm install @aaroncode/iframe-bridge
```

#### Opción 2: Instalar desde el repositorio (requiere compilar)

1. Clona el repositorio (solo contiene código fuente TypeScript, no usa librerías de terceros):
   ```bash
   git clone https://bitbucket.org/ENTURA/wdi_kyc_sdk_web.git
   cd wdi_kyc_sdk_web
   ```
2. Compila el código TypeScript usa el comando:
   ```bash
   npm run build
   tsc
   ```
   Esto generará los archivos JavaScript en la carpeta `dist/`.
3. Copia el archivo `dist/index.js` a tu proyecto (por ejemplo, al mismo nivel que tu archivo HTML o JS principal).
4. Importa la librería en tu código:
   ```js
   import { KycIframeBridge } from "./index.js";
   ```

---

### Uso básico

#### 1. Agrega los elementos en tu HTML

```html
<button id="openKycBtn">Abrir KYC</button>
<iframe id="kycIframe" style="display:none;width:600px;height:400px;"></iframe>
<div id="mensaje"></div>
```

#### 2. Usa la librería en tu JS

##### Opción A: Usando el archivo compilado localmente

```js
import { KycIframeBridge } from "./index.js";
```

##### Opción B: Importando desde npm (con bundler)

```js
import { KycIframeBridge } from "@aaroncode/iframe-bridge";
```

##### ~~Opción C: Importando desde CDN (jsDelivr)~~

> ⚠️ **No disponible:** La librería no funciona correctamente si se importa directamente desde CDN.

#### Ejemplo de uso

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

#### Opciones del constructor

| Opción         | Tipo     | Descripción                                        |
| -------------- | -------- | -------------------------------------------------- |
| iframeId       | string   | ID del iframe en el DOM                            |
| buttonId       | string   | ID del botón que abre el iframe                    |
| allowedOrigins | string[] | Lista de orígenes permitidos para recibir mensajes |
| iframeUrl      | string   | URL que se cargará en el iframe                    |
| entity         | object   | Datos que se enviarán al iframe                    |
| onExit         | function | Callback al cerrar el iframe                       |
| onError        | function | Callback para errores                              |

---

## English

### Installation

#### Option 1: Install from npm

```bash
npm install @aaroncode/iframe-bridge
```

#### Option 2: Install from repository (requires build)

1. Clone the repository (it only contains TypeScript source code, no third-party libraries):
   ```bash
   git clone https://bitbucket.org/ENTURA/wdi_kyc_sdk_web.git
   cd wdi_kyc_sdk_web
   ```
2. Compile the TypeScript code using the command:
   ```bash
   npm run build
   tsc
   ```
   This will generate the JavaScript files in the `dist/` folder.
3. Copy the `dist/index.js` file to your project (for example, next to your main HTML or JS file).
4. Import the library in your code:
   ```js
   import { KycIframeBridge } from "./index.js";
   ```

---

### Basic usage

#### 1. Add elements to your HTML

```html
<button id="openKycBtn">Open KYC</button>
<iframe id="kycIframe" style="display:none;width:600px;height:400px;"></iframe>
<div id="mensaje"></div>
```

#### 2. Use the library in your JS

##### Option A: Using the locally compiled file

```js
import { KycIframeBridge } from "./index.js";
```

##### Option B: Importing from npm (with bundler)

```js
import { KycIframeBridge } from "@aaroncode/iframe-bridge";
```

##### ~~Option C: Importing from CDN (jsDelivr)~~

> ⚠️ **Not available:** The library does not work correctly if imported directly from CDN.

#### Usage example

```js
const bridge = new KycIframeBridge({
    iframeId: "kycIframe",
    buttonId: "openKycBtn",
    allowedOrigins: ["http://localhost:45679"],
    iframeUrl: "http://localhost:45679/kyc",
    entity: {
        id: "user-123",
        apiKey: "api-key-xyz"
    },
    onExit: (data) => {
        document.getElementById("mensaje").textContent = "KYC closed: " + (data?.message || "");
    },
    onError: (data) => {
        document.getElementById("mensaje").textContent = "Error: " + (data?.message || "");
    }
});
```

#### Constructor options

| Option         | Type     | Description                                 |
| -------------- | -------- | ------------------------------------------- |
| iframeId       | string   | ID of the iframe in the DOM                 |
| buttonId       | string   | ID of the button that opens the iframe      |
| allowedOrigins | string[] | List of allowed origins to receive messages |
| iframeUrl      | string   | URL to be loaded in the iframe              |
| entity         | object   | Data to be sent to the iframe               |
| onExit         | function | Callback when closing the iframe            |
| onError        | function | Callback for errors                         |

---

## Notas / Notes

- Solo se permite comunicación por `postMessage` (no acceso directo al DOM del iframe si es cross-origin).
- Only `postMessage` communication is allowed (no direct DOM access if cross