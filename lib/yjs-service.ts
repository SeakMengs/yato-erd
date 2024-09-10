import { WebsocketProvider } from "y-websocket";
import { WebrtcProvider } from "y-webrtc";
import type { Awareness } from "y-protocols/awareness.js";
import * as Y from "yjs";

type BaseConnection = {
  roomId?: string;
};

export type EstablishWebRtcConnection = BaseConnection & {
  password?: string;
  signaling?: string;
  type: "webrtc";
};

export type EstablishWebsocketConnection = BaseConnection & {
  wsUrl?: string;
  type: "websocket";
};

export type YjsServiceConstructor = {
  providerType: "webrtc" | "websocket";
};

class YjsService {
  public ydoc: Y.Doc | undefined;
  public provider: WebrtcProvider | WebsocketProvider | undefined;
  public awareness: Awareness | undefined;
  public providerType: YjsServiceConstructor["providerType"] | undefined;
  public roomId: string | undefined;

  constructor({ providerType }: YjsServiceConstructor) {
    this.providerType = providerType;
  }

  public establishConnection(
    args: EstablishWebsocketConnection | EstablishWebsocketConnection,
  ): void {
    if (
      this.provider instanceof WebsocketProvider ||
      this.provider instanceof WebrtcProvider
    ) {
      logger.info("Yjs provider has already establish connection");
      return;
    }

    switch (this.providerType) {
      case "websocket":
        this.establishWebsocketConnection(args);
        break;
      case "webrtc":
        this.establishWebrtcConnection(args);
        break;
    }
  }

  public destroy(): void {
    if (this.ydoc) {
      this.ydoc.destroy();
    }

    if (this.awareness) {
      this.awareness.destroy();
    }

    if (this.provider) {
      this.provider.destroy();
    }

    this.ydoc = undefined;
    this.awareness = undefined;
    this.provider = undefined;
  }

  private establishWebrtcConnection({
    roomId = generateRandomRoomId(),
    password = "optional-room-password",
    signaling = getWebRTCSignalServer(),
  }: Omit<EstablishWebRtcConnection, "type"> = {}) {
    logger.info(
      `Establishing yjs webrtc connection! signal server url: ${signaling}, room id: ${roomId}`,
    );

    if (!process.client) {
      throw new YatoErDError(
        YatoErDErrorCode.YJS_PROVIDER_MUST_ESTABLISH_IN_CLIENT_SIDE,
      );
    }

    this.ydoc = new Y.Doc();
    this.roomId = roomId;
    this.provider = new WebrtcProvider(roomId, this.ydoc, {
      password,
      // Peers using the same signaling server will find each other
      signaling: [signaling],
      // Maximal number of WebRTC connections.
      maxConns: 20 + Math.floor(Math.random() * 15),
    });
    this.awareness = this.provider.awareness;

    // TODO: improve this by adding timout like 10,15 second
    this.provider.on("status", (event) => {
      logger.info(`establishWebrtcConnection has been ${event.connected}`);
    });
  }

  private establishWebsocketConnection({
    wsUrl = getWebsocketUrl(),
    roomId = "public-room",
  }: Omit<EstablishWebsocketConnection, "type"> = {}) {
    logger.info(
      `Establishing yjs websocket connection! ws server url: ${wsUrl}, room id: ${roomId}`,
    );

    this.ydoc = new Y.Doc();
    this.roomId = roomId;
    this.provider = new WebsocketProvider(wsUrl, roomId, this.ydoc);
    this.awareness = this.provider.awareness;

    this.provider.on("status", (event: any) => {
      logger.info(`establishWebsocketConnection has been ${event.connected}`);
    });
  }
}

export default YjsService;
