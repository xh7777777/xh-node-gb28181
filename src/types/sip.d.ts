declare module 'sip' {
    
    export function start (config:SipServerConfig, callback: (req:SipRequest, remote:SipRemote) => void): void;
    export function stop (): void;
}

