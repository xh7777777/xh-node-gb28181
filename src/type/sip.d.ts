declare module 'sip' {
    export function start (config:SipServerConfig, callback: (req:any) => void): void;
}

