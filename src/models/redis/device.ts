import { zlmStreamMode } from "../../types/enum";

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
    channelId: string;
    callId: string;
    cseqNum: number;
    toTag: string;
    fromTag: string;
    rtspUrl?: string;
    rtpPort?: number;
}

export interface IDeviceChannel {
    deviceId: string;
    channelId: string; 
    channelName: string;
    rtpUrl?: string;
    rtpPort?: number;
    streamMode?: zlmStreamMode;
}

