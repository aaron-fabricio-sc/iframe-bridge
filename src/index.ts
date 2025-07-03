// Interfaz para los datos de la entidad que se enviarán al iframe
export interface KycEntity {
  id: string;
  apiKey: string;
  [key: string]: any;
}

// Opciones de configuración para la clase KycIframeBridge
export interface KycIframeBridgeOptions {
  modalId: string; // ID del modal que contiene el iframe
  iframeId: string; // ID del elemento iframe en el DOM
  buttonId: string; // ID del botón que abre el modal
  allowedOrigins: string[]; // Lista de orígenes permitidos
  iframeUrl: string; // URL que se cargará en el iframe
  entity: KycEntity; // Datos de la entidad a enviar
  onExit?: (data: any) => void; // Callback opcional al cerrar el flujo
  onComplete?: (data: any) => void; // Callback opcional al completar la acción
  onError?: (data: any) => void; // Callback opcional al ocurrir un error
}

// Clase principal que gestiona la comunicación con el iframe dentro de un modal
export class KycIframeBridge {
  private modal: HTMLElement;
  private iframe: HTMLIFrameElement;
  private button: HTMLButtonElement;
  private allowedOrigins: string[];
  private iframeUrl: string;
  private entity: KycEntity;
  private onExit?: (data: any) => void;
  private onComplete?: (data: any) => void;
  private onError?: (data: any) => void;

  constructor(options: KycIframeBridgeOptions) {
    // Obtiene las referencias a los elementos del DOM
    this.modal = document.getElementById(options.modalId) as HTMLElement;
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
    this.onComplete = options.onComplete;
    this.onError = options.onError;

    // Asigna el evento click al botón para abrir el modal con el iframe
    this.button.addEventListener("click", this.openModal.bind(this));
    // Escucha los mensajes provenientes del iframe
    window.addEventListener("message", this.handleMessage.bind(this));
  }

  // Método para mostrar el modal y enviar los datos de la entidad al iframe
  private openModal(): void {
    // Muestra el modal y establece la URL del iframe
    this.iframe.src = this.iframeUrl;
    this.modal.style.display = "block";
    // Espera un breve tiempo antes de enviar el mensaje al iframe
    setTimeout(() => {
      const iframeWindow = this.iframe.contentWindow;
      if (iframeWindow) {
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

  // Método para ocultar el modal
  private closeModal(): void {
    this.modal.style.display = "none";
    this.iframe.src = ""; // Limpia el iframe por seguridad
  }

  // Maneja los mensajes recibidos desde el iframe
  private handleMessage(event: MessageEvent): void {
    const { type, data } = event.data || {};
    console.log("Mensaje recibido del iframe:", type, data);

    if (data.type === "exit") {
      if (this.onExit) this.onExit(data);
      this.closeModal();
    }
    if (data.type === "complete") {
      if (this.onComplete) this.onComplete(data);
      this.closeModal();
    }
    if (data.type === "error") {
      if (this.onError) this.onError(data);
      this.closeModal();
    }
  }
}
