import { SipRequest } from "../types/sip.type";
import { IRedisDevice } from "../models/redis/device";

export function trimQuotString(source: string) {
  return source.replace(/"/g, "");
}

export function getDeviceInfoFromSip(req: SipRequest):IRedisDevice {
  const defaultExpire = parseInt(process.env.SIP_EXPIRE || '3600');
  const defaultPulseExpire = parseInt(process.env.SIP_PULSE_EXPIRE || '60') ;
  return {
    deviceId: req.headers.from.uri.split(":")[1],
    deviceName:
      req.headers.from.name === undefined
        ? "未命名设备"
        : req.headers.from.name,
    sipHost: req.headers.via[0].host,
    sipPort: req.headers.via[0].port,
    lastPulse: Date.now(), // 最后一次心跳验证的时间戳
    lastRegisterTime: Date.now(), // 最后注册时间
    registerExpires:
      req.headers.expires === undefined
        ? defaultExpire
        : parseInt(req.headers.expires), // 注册过期时间
    pulseExpires: defaultPulseExpire, // 心跳过期时间
  };
}

export function generateDeviceKey(
  device_id: string,
  sip_host: string,
  sip_port: number
) {
  return `${device_id}@${sip_host}:${sip_port}`;
}
