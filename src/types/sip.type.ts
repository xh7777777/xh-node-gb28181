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
}

export interface SipRequest {
  method: string;
  uri: string;
  version: string;
  headers: {
    via: Object[];
    to: {
        name: string | undefined;
        uri: string;
        params: Object[];
    }
    from: {
        name: string | undefined;
        uri: string;
        params: Object[];
    }
    "call-id": string;
    cseq: {
        seq: number;
        method: string;
    };
    contact?: Object[]
    "content-type": string;
    "content-length": number;
    'max-forwards': string;
    "user-agent": string;
    expires?: string;
    "www-authenticate"?: string;
    authorization?: any
  };
  content: string;
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