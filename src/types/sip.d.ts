declare module "sip" {
  export function start(
    config: SipServerConfig,
    callback: (req: SipRequest, remote: SipRemote) => void
  ): void;
  export function stop(): void;
  export function makeResponse(
    req: SipRequest,
    status: number,
    reason: string
  ): SipResponse;
  export function send(
    response: SipRequest,
    callback?: (resp: SipResponse) => void
  ): void;
  export function parseUri(uri: string): {
    user: string;
    host: string;
    port: number;
    password: string | undefined;
    schema: string;
    params: { [key: string]: string };
    headers: { [key: string]: string };
  };
}

declare module "sip/digest" {
  export function challenge(
    session: { realm?: string; nonce?: string },
    callback: SipRequest
  ): string;

  export function authenticateRequest(
    realm: { realm: string },
    req: SipRequest,
    userinfo: { password: string; user: string }
  ): boolean;
}
