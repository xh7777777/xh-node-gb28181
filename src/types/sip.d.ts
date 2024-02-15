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
  ): SipRequest;
export function send(
    response: SipRequest,
): void;
}

declare module "sip/digest" {
    export function challenge(
        session: { realm?: string, nonce?: string},
        callback: SipRequest
    ): string;

    export function authenticateRequest(
        realm: { realm: string },
        req: SipRequest,
        userinfo: { password: string, user: string}
    ): boolean;
}