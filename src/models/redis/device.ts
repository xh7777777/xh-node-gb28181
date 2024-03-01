export interface IRedisDevice {
    deviceId: string;
    deviceRealm?: string;
    deviceName?: string;
    manufacturer?: string;
    model?: string;
    firmware?: string;
    channelCount?: number;
    sipHost?: string;
    sipPort?: number;
    lastPulse?: number;
    lastRegisterTime?: number;
    registerExpires?: number;
    pulseExpires?: number;
}

export interface IDeviceSessionCache {
    deviceId: string;
    channelId: number;
    callId: string;
    cseqNum: number;
    toTag: string;
    fromTag: string;
}

