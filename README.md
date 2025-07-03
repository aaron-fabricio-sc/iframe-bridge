# iframe-bridge

Librería para facilitar la comunicación segura entre una aplicación padre y la aplicación KYC usando `postMessage`.

---

## Español

## Datos necesarios

Antes de usar la librería necesita tener el ID de la configuración de la entidad y el Key ID de la configuración para obtenerlo necesita ir a la aplicación REM BIZ

1. Ingrese con su entidad emisora.
2. (En caso de que no tenga una configuración)En el menu lateral entre a KYC Configurations y para crear una configuración entre a KYC Credentials, siga los pasos y cree la configuración.
3. La lista de configuraciones de credenciales esta en el menu lateral 'KYC Configurations' -> 'KYC Api Key' ingrese ahi y vera la tabla con las configuraciones 'El ID de la configuración se encuentra en esa tabla' (Guarde el id de la configuración que necesita).
4. (En caso de que la configuración no tenga una Api Key) En la tabla de las configuraciones presione el botón `See Api Keys` que abrirá un modal en el cual podrá crear un Api Key.
5. En ese mismo modal vera la lista de Api Keys de la configuración (Guarde el Key Id que necesita).

### Instalación

#### Opción 1: Instalar desde npm y copiar el archivo JS

1. Instala la librería:
   ```bash
   npm install git+https://bitbucket.org/ENTURA/wdi_kyc_sdk_web_repo.git
   ```
2. Busca el archivo `index.js` dentro de `node_modules/iframe-bridge-compilado/dist/`.
3. Copia ese archivo a tu proyecto (por ejemplo, al mismo nivel que tu archivo HTML o JS principal).
4. Tener en cuenta que el tag script donde usaras la lógica de la librería  tiene que tener el type="module"
   ```html
   <script type="module" src="tuArchivoJs.js"></script>
   ```
   
5. Importa la librería en tu código js:

   ```js
   import { KycIframeBridge } from "./index.js";
   ```





### Uso básico

#### 1. Agrega los elementos en tu HTML

```html
<button id="openKycBtn">Abrir KYC</button>

<!-- Modal centrado con el iframe dentro -->
<div id="kycModal" class="modal">
  <div class="modal-content">

    <iframe id="kycIframe" style="width:100%;height:100%; border:none; display:block;" allow="camera; microphone"></iframe>

  </div>
</div>
```

#### 2. Agrega los estilos para el modal

```css
.modal {
  display: none; /* Oculto por defecto */
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: rgba(0,0,0,0.5);
}

.modal-content {
  background-color: #fff;
  margin: 5% auto;
  padding: 0;
  border-radius: 8px;
  width: 80%;
  max-width: 1000px;
  height:80%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close {
  color: #aaa;
  position: absolute;
  right: 16px;
  top: 8px;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
}
.close:hover,
.close:focus {
  color: #333;
  text-decoration: none;
  cursor: pointer;
}
```

#### 3. Usa la librería en tu archivo JS

```js
//index.js es el archivo donde esta la lógica de la librería
import { KycIframeBridge } from "./index.js";

const bridge = new KycIframeBridge({
  modalId: "kycModal",
  iframeId: "kycIframe",
  buttonId: "openKycBtn",
  allowedOrigins: ["https://remkyc-x.wdi.net/kyc"],
  iframeUrl: "https://remkyc-x.wdi.net/kyc",
  //Reemplace los valores por los Ids que se menciona al principio del Readme
  entity: {
    id: "ID de la configuración",
    apiKey: "Key Id de la configuración",
  },
  onExit: (data) => {
    // La app KYC se puede cerrar por un error o por el usuario manualmente
    console.log("KYC exit data:", data);
   

  },
  onComplete: (data) => {
    // Dentro de data llegara un objeto con UUIDs si los necesita 
     console.log("KYC complete data:", data);
  },
  onError: (data) => {
    // Evento que se ejecutara cuando ocurra un error
     console.log("KYC error data:", data);
  }
});


```

#### Opciones del constructor

| Opción         | Tipo     | Descripción                                        |
| -------------- | -------- | -------------------------------------------------- |
| modalId        | string   | ID del modal que contiene el iframe                |
| iframeId       | string   | ID del iframe en el DOM                            |
| buttonId       | string   | ID del botón que abre el modal                     |
| allowedOrigins | string[] | Lista de orígenes permitidos para recibir mensajes |
| iframeUrl      | string   | URL que se cargará en el iframe                    |
| entity         | object   | Datos que se enviarán al iframe                    |
| onExit         | function | Callback al cerrar el iframe/modal                 |
| onComplete     | function | Callback cuando el flujo de la app kyc se completa |
| onError        | function | Callback cuando ocurra un error                    |

---