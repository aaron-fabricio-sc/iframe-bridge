// Interfaz para los datos de la entidad que se enviarán al iframe
export interface KycEntity {
  id: string;
  apiKey: string;
  [key: string]: any;
}

// Opciones de configuración para la clase KycIframeBridge
export interface KycIframeBridgeOptions {
  iframeId: string; // ID del elemento iframe en el DOM
  buttonId: string; // ID del botón que abre el iframe
  allowedOrigins: string[]; // Lista de orígenes permitidos
  iframeUrl: string; // URL que se cargará en el iframe
  entity: KycEntity; // Datos de la entidad a enviar
  onExit?: (data: any) => void; // Callback opcional al cerrar el iframe
  onError?: (data: any) => void; // Callback opcional para errores
}

// Clase principal que gestiona la comunicación con el iframe
export class KycIframeBridge {
  private iframe: HTMLIFrameElement;
  private button: HTMLButtonElement;
  private allowedOrigins: string[];
  private iframeUrl: string;
  private entity: KycEntity;
  private onExit?: (data: any) => void;
  private onError?: (data: any) => void;

  constructor(options: KycIframeBridgeOptions) {
    // Obtiene las referencias a los elementos del DOM
    this.iframe = document.getElementById(
      options.iframeId
    ) as HTMLIFrameElement;
    this.button = document.getElementById(
      options.buttonId
    ) as HTMLButtonElement;
    this.allowedOrigins = options.allowedOrigins;
    this.iframeUrl = options.iframeUrl;
    this.entity = options.entity;
    this.onExit = options.onExit;
    this.onError = options.onError;

    // Asigna el evento click al botón para abrir el iframe
    this.button.addEventListener("click", this.openIframe.bind(this));
    // Escucha los mensajes provenientes del iframe
    window.addEventListener("message", this.handleMessage.bind(this));
  }

  // Método para mostrar el iframe y enviar los datos de la entidad
  private openIframe(): void {
    // Verifica si el origen está permitido
    /*  if (!this.allowedOrigins.includes(this.iframeUrl)) {
      alert("Origen no permitido");
      return;
    } */
    // Muestra el iframe y establece su URL
    this.iframe.src = this.iframeUrl;
    this.iframe.style.display = "block";
    // Espera 1 segundo antes de enviar el mensaje al iframe
    setTimeout(() => {
      const iframeWindow = this.iframe.contentWindow;
      if (iframeWindow) {
        // Envía los datos de la entidad al iframe mediante postMessage
        iframeWindow.postMessage(
          {
            type: "communication-iframe",
            data: this.entity,
          },
          this.iframeUrl
        );
      }
    }, 500);
  }

  // Maneja los mensajes recibidos desde el iframe
  private handleMessage(event: MessageEvent): void {
    // Si el mensaje indica un error de origen, ejecuta el callback de error y oculta el iframe
    if (event.data?.type === "kyc-origin-error") {
      if (this.onError) this.onError(event.data);
      this.iframe.style.display = "none";
      return;
    }
    // Verifica que el origen del mensaje esté permitido
    /* if (!this.allowedOrigins.includes(event.origin)) {
      return;
    } */
    // Procesa el mensaje recibido
    const { type, data } = event.data || {};
    // Si el mensaje es exitRequest, ejecuta el callback de salida y oculta el iframe
    if (type === "exitRequest") {
      if (this.onExit) this.onExit(data);
      this.iframe.style.display = "none";
    }
  }
}

export default KycIframeBridge;
