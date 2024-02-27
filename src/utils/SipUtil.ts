import { SipRequest, SipResponse } from "../types/sip.type";
import { IRedisDevice } from "../models/redis/device";
import { SIP_CONFIG } from "../config";
import { v4 } from "uuid";
import logUtil from "./logUtil";
const logger = logUtil("SipUtil");
import { sipContentTypeEnum, sipMethodEnum } from "../types/enum";

export function trimQuotString(source: string) {
  return source.replace(/"/g, "");
}

export function getDeviceInfoFromSip(req: SipRequest): IRedisDevice {
  const defaultExpire = parseInt(process.env.SIP_EXPIRE || "3600");
  const defaultPulseExpire = parseInt(process.env.SIP_PULSE_EXPIRE || "60");
  const [ deviceId, deviceRealm ] = req.headers.from.uri.split(":")[1].split('@');
  return {
    deviceId: deviceId,
    deviceRealm: deviceRealm,
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

interface IFrom {
  name?: string;
  id: string;
  realm: string;
  tag?: string;
}

export interface ISipMessage {
  method: sipMethodEnum;
  name?: string;
  deviceInfo: IRedisDevice;
  tag?: string;
  content: string;
  cesqNumber?: number;
  contentType?: sipContentTypeEnum;
}

export interface ISdpItem {
  channel: string;
  mediaIp: string;
  udpPort: number;
  ssrc: string;
}
export class SipMessageHelper {
  private message: SipRequest;
  constructor({
    method,
    name,
    deviceInfo,
    tag,
    content,
    cesqNumber,
    contentType,
  }: ISipMessage) {
    const deviceId = deviceInfo.deviceId;
    const deviceRealm = deviceInfo.deviceRealm || SIP_CONFIG.realm;
    const defaultCesqNumber = 20;
    const defaultContentType = sipContentTypeEnum.xml;
    const deviceUri = `sip:${deviceId}@${deviceInfo.sipHost}:${deviceInfo.sipPort}`;
    this.message = {
      method,
      uri: deviceUri,
      version: SIP_CONFIG.version,
      headers: {
        via: [SipMessageHelper.generateVia(SIP_CONFIG.protocol)],
        to: SipMessageHelper.generateTo({
          name,
          id: deviceId,
          realm: deviceRealm,
        }),
        from: SipMessageHelper.generateFrom({
          name,
          id: SIP_CONFIG.id,
          realm: SIP_CONFIG.realm,
          tag,
        }),
        contact: [SipMessageHelper.generateContact()],
        "call-id": SipMessageHelper.generateCallId(),
        cseq: SipMessageHelper.geneteCseq(
          defaultCesqNumber || cesqNumber,
          method
        ),
        "content-type": contentType || defaultContentType,
        "content-length": content.length,
        "max-forwards": SIP_CONFIG.maxForwards,
        "user-agent": SIP_CONFIG.userAgent,
      },
      content,
    };
  }

  public setHeader(key: string, value: any) {
    // @ts-ignore
    this.message.headers[key] = value;
  }

  public getMessage() {
    return this.message;
  }

  public static generateContact() {
    return {
      uri: SipMessageHelper.generateLocalUri(),
    };
  }

  public static generateFrom({ name, id, realm, tag }: IFrom) {
    const uri = `sip:${id}@${realm}`;
    return {
      name,
      uri,
      params: {
        tag: tag || v4(),
      },
    };
  }

  public static generateTo({ name, id, realm }: IFrom) {
    const uri = `sip:${id}@${realm}`;
    return {
      name,
      uri,
      params: {},
    };
  }

  public static generateLocalUri() {
    return `sip:${SIP_CONFIG.id}@${SIP_CONFIG.host}:${SIP_CONFIG.port}`;
  }

  public static generateCallId() {
    return v4();
  }

  public static generateVia(
    protocol: string,
    host = SIP_CONFIG.host,
    port = SIP_CONFIG.port
  ) {
    return {
      version: SIP_CONFIG.version,
      protocol,
      host,
      port,
      params: {
        rport: port,
        branch: v4(),
        received: host,
      },
    };
  }

  public static geneteCseq(seq: number, method: string) {
    return {
      seq,
      method,
    };
  }

  public static generateSdpContent({
    channel,
    mediaIp,
    udpPort,
    ssrc,
  }: ISdpItem) {
    // sdp参考文章，https://blog.csdn.net/uianster/article/details/125902301
    return (
      "v=0\r\n" +
      `o=${channel} 0 0 IN IP4 ${mediaIp}\r\n` +
      "s=Play\r\n" +
      `c=IN IP4 ${mediaIp}\r\n` +
      "t=0 0\r\n" +
      // udpPort在国标中需要指定端口号m=<media><port><transport><fmt/payload type list>
      `m=video ${udpPort} TCP/RTP/AVP 96 97 98\r\n` +
      "a=setup:passive\r\n" +
      "a=rtpmap:96 PS/90000\r\n" +
      "a=rtpmap:97 MPEG4/90000\r\n" +
      "a=rtpmap:98 H264/90000\r\n" +
      "a=recvonly\r\n" +
      "a=streamprofile:0\r\n" +
      "a=streamnumber:0\r\n" +
      `y=${ssrc}\r\n\r\n`
    );
  }
}

export function compare(obj1: SipRequest, obj2: SipRequest) {
  for (let key in obj1) {
    // @ts-ignore
    if (obj1[key] !== obj2[key]) {
      // @ts-ignore
      if (typeof obj1[key] === "object") {
        // @ts-ignore
        compare(obj1[key], obj2[key]);
      } else {
        // @ts-ignore
        logger.info(`key:${key},obj1:${obj1[key]},obj2:${obj2[key]}`);
        // @ts-ignore
      }
    }
  }
}
