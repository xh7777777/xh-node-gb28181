export interface IRedisDevice {
    deviceId: string;
    deviceName: string;
    manufacturer?: string;
    model?: string;
    firmware?: string;
    channelCount?: number;
    sipHost: string;
    sipPort: number;
    lastPulse: number;
    lastRegisterTime: number;
    registerExpires: number;
    pulseExpires: number;
}

