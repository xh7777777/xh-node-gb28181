import { SipRequest } from "../types/sip.type";
import { generateDeviceKey } from "../utils/SipUtil";
import { IRedisDevice } from "../models/redis/device";
import client from "../middleware/redis";
import logUtil from "../utils/logUtil";
const logger = logUtil("DeviceController");

export class DeviceController {
  public static async getDeviceById(device: IRedisDevice) {
    const key = generateDeviceKey(device.deviceId, device.sipHost, device.sipPort);
    const value = await client.hGet("device", key);
    return value === undefined ? null : JSON.parse(value);
  }

  public static async setDeviceToRedis(device: IRedisDevice) {
    const key = generateDeviceKey(device.deviceId, device.sipHost, device.sipPort);
    const value = JSON.stringify(device);
    await client.hSet("device", key, value);
  }

}