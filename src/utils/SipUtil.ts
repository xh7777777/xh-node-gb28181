import { SipRequest } from "../types/sip.type";

export function trimQuotString(source: string) {
  return source.replace(/"/g, "");
}

export function getDeviceInfoFromSip(req: SipRequest) {
  return {
    device_id: req.headers.from.uri.split(":")[1],
    device_name: req.headers.from.name === undefined ? "未命名设备" : req.headers.from.name,
    sip_host: req.headers.via[0].host,
    sip_port: req.headers.via[0].port,
    device_ua: req.headers["user-agent"],
  };
}
