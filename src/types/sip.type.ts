import { sipMethodEnum, sipContentTypeEnum } from "./enum";

export interface SipServerConfig {
  port: number;
  host: string;
  udp?: boolean;
  tcp?: boolean;
  logger?: {
    send?: (message: string, address: string) => void;
    recv?: (message: string, address: string) => void;
    level?: string;
  };
  publicAddress?: string;
  hostname?: string;
  // 这个参数会传到tls.createServer的参数中
  tls?: {
    connect: (cleartextStream: any, socket: any, head: any) => void;
  };
  tls_port?: number;
  // 为了支持websocket这个字段是必须的，它没有默认值
  ws_port?: number;
  // default 60480
  maxBytesHeaders?: number;
  // default 60480
  maxContentLength?: number;
}

export interface SipRequest {
  method: sipMethodEnum;
  uri: string;
  version: string;
  headers: {
    via: SipVia[];
    to: {
        name: string | undefined;
        uri: string;
        params?: Object[] | Object;
    }
    from: {
        name: string | undefined;
        uri: string;
        params?: Object[] | Object;
    }
    "call-id": string;
    cseq: {
        seq: number;
        method: string;
    };
    contact?: Object[]
    "content-type": sipContentTypeEnum;
    "content-length": number;
    'max-forwards': string;
    "user-agent": string;
    expires?: string;
    "www-authenticate"?: string;
    authorization?: SipAuth[]
  };
  content: string;
}

export interface SipResponse extends SipRequest {
  status: number;
  reason: string;
}

export interface SipVia {
    version: string;
    protocol: string;
    host: string;
    port: number;
    params: {
        rport: number;
        branch: string;
        received: string;
    };
}

export interface SipRemote {
    protocol: string;
    address: string;
    port: number;
    local: {
        address: string;
        port: number;
    }
}

export interface SipAuth {
    scheme: string;
    realm: string;
    username: string;
    uri: string;
    nonce: string;
    response: string;
    algorithm: string;
    opaque: string;
    qop: string;
    nc: string;
    cnonce: string;
}