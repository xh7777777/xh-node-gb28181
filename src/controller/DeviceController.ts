import { SipRequest } from "../types/sip.type";
import { getDeviceInfoFromSip ,generateDeviceKey } from "../utils/SipUtil";
import client from "../middleware/redis";
import logUtil from "../utils/logUtil";
const logger = logUtil("DeviceController");

export class DeviceController {
  public static async getDeviceById(req: SipRequest) {
    const device = getDeviceInfoFromSip(req);
    const key = generateDeviceKey(device.device_id, device.sip_host, device.sip_port);
    const value = await client.hGet("device", key);
    logger.info(`获取设备信息: ${value}`);
    return value === undefined ? null : JSON.parse(value);
  }

  public static async setDeviceToRedis(req: SipRequest) {
    const device = getDeviceInfoFromSip(req);
    const key = generateDeviceKey(device.device_id, device.sip_host, device.sip_port);
    const value = JSON.stringify(device);
    logger.info(`设备信息111: ${value}`);
    await client.hSet("device", key, value);
  }

}