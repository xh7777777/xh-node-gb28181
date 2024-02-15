import { SipRequest } from "../types/sip.type";

export function trimQuotString(source: string) {
  return source.replace(/"/g, "");
}

export function getDeviceInfoFromSip(req: SipRequest) {
  const defaultExpire = process.env.SIP_EXPIRE || 3600;
  return {
    device_id: req.headers.from.uri.split(":")[1],
    device_name:
      req.headers.from.name === undefined
        ? "未命名设备"
        : req.headers.from.name,
    sip_host: req.headers.via[0].host,
    sip_port: req.headers.via[0].port,
    last_pulse: Date.now(), // 最后一次心跳验证的时间戳
    lastRegisterTime: Date.now(), // 最后注册时间
    registerExpires:
      req.headers.expires === undefined
        ? defaultExpire
        : parseInt(req.headers.expires), // 注册过期时间
  };
}

export function generateDeviceKey(
  device_id: string,
  sip_host: string,
  sip_port: number
) {
  return `${device_id}@${sip_host}:${sip_port}`;
}
