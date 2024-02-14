export interface SipServerConfig {
    port: number;
    host: string;
    udp: boolean;
    tcp: boolean;
    logger: {
        send ?: (message: string, address: string) => void;
        recv ?: (message: string, address: string) => void;
        level ?: string;
    }
}

  export interface SipRequest {
      method: string;
      uri: string;
      headers: {
          to: string;
          from: string;
          'call-id': string;
          cseq: string;
          'content-type': string;
          'content-length': string;
      };
  }