export interface IRedisDevice {
    deviceId: string;
    deviceName: string;
    sipHost: string;
    sipPort: number;
    lastPulse: number;
    lastRegisterTime: number;
    registerExpires: number;
    pulseExpires: number;
}

