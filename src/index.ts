export interface BridgeOptions {
  allowedOrigins: string[]; // Lista de orígenes (URLs) permitidos para recibir mensajes
  debug?: boolean; // Si se activa, se muestran logs útiles en consola
}

type MessageHandler = (data: any) => any | Promise<any>;

type MessageData = {
  type: string;
  data?: any;
  requestId?: string;
};

export class IframeBridge {
  private handlers = new Map<string, MessageHandler>(); // Almacena funciones manejadoras por tipo de mensaje
  private pendingRequests = new Map<string, (data: any) => void>(); // Guarda promesas pendientes para emparejar respuesta
  private allowedOrigins: string[];
  private debug: boolean;

  constructor(
    private targetWindow: Window, // Ventana destino (puede ser `iframe.contentWindow` o `window.parent`)
    options: BridgeOptions
  ) {
    this.allowedOrigins = options.allowedOrigins;
    this.debug = options.debug || false;

    // Escucha todos los mensajes que lleguen a la ventana actual
    window.addEventListener("message", this._onMessage.bind(this));
  }

  /**
   * Envía un mensaje a la ventana destino sin esperar respuesta
   * @param type Tipo del mensaje (por ejemplo: "alerta", "statusUpdate")
   * @param data Datos que se desean enviar
   */
  public send(type: string, data?: any) {
    this._postMessage({ type, data });
  }

  /**
   * Envía un mensaje esperando una respuesta (como una promesa)
   * @param type Tipo del mensaje (por ejemplo: "calcular")
   * @param data Datos que se desean enviar
   * @returns Promesa que se resuelve cuando llega la respuesta
   */
  public request(type: string, data?: any): Promise<any> {
    const requestId = this._uuid(); // ID único para emparejar respuesta

    return new Promise((resolve) => {
      this.pendingRequests.set(requestId, resolve); // Guarda el resolve
      this._postMessage({ type, data, requestId }); // Envía mensaje con ID
    });
  }

  /**
   * Registra una función para manejar un tipo específico de mensaje recibido
   * @param type Tipo de mensaje (como "resolverEcuacion")
   * @param handler Función que procesará ese tipo de mensaje
   */
  public on(type: string, handler: MessageHandler) {
    this.handlers.set(type, handler);
  }

  /**
   * Maneja la recepción de un mensaje entrante
   */
  private async _onMessage(event: MessageEvent) {
    // Ignora mensajes que no provienen de orígenes permitidos
    if (!this.allowedOrigins.includes(event.origin)) {
      if (this.debug)
        console.warn("[IframeBridge] Origen no permitido:", event.origin);
      return;
    }

    const { type, data, requestId } = event.data || {};

    // Ignora mensajes sin tipo
    if (!type) return;

    if (this.debug) {
      console.log("[IframeBridge] Mensaje recibido:", type, data);
    }

    // Si es una respuesta a un request anterior
    if (requestId && this.pendingRequests.has(requestId)) {
      const resolve = this.pendingRequests.get(requestId)!;
      resolve(data); // resuelve la promesa
      this.pendingRequests.delete(requestId); // elimina la entrada
      return;
    }

    // Buscar si hay un handler registrado para este tipo
    const handler = this.handlers.get(type);
    if (handler) {
      try {
        const result = await handler(data); // ejecuta handler
        // Si había un requestId, significa que esperan una respuesta
        if (requestId) {
          this._postMessage({ type, data: result, requestId });
        }
      } catch (error) {
        console.error("[IframeBridge] Error en handler:", error);
        // Si ocurre error, envía respuesta con mensaje de error
        if (requestId) {
          this._postMessage({
            type,
            data: { error: "Error interno" },
            requestId,
          });
        }
      }
    }
  }

  /**
   * Envía un mensaje a la ventana destino
   * @param message Objeto con tipo, datos y opcionalmente un requestId
   */
  private _postMessage(message: MessageData) {
    if (this.debug) {
      console.log("[IframeBridge] Enviando mensaje:", message);
    }

    // Enviar al primer origen permitido (es lo más seguro)
    this.targetWindow.postMessage(message, this.allowedOrigins[0]);
  }

  /**
   * Genera un ID único para las solicitudes que esperan respuesta
   */
  private _uuid(): string {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    // Fallback si el navegador no tiene randomUUID
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
