import { SipRequest } from "../types/sip.type";
import { generateDeviceKey, getDeviceInfoFromSip } from '../utils/SipUtil';
import { IRedisDevice } from "../models/redis/device";
import client from "../middleware/redis";
import logUtil from "../utils/logUtil";
const logger = logUtil("DeviceController");
import { Context, Next } from "koa";
import { resolve } from "../utils/httpUtil";
export class DeviceController {
  public static async getDeviceInfoFromSip(req: SipRequest) {
    return getDeviceInfoFromSip(req);
  }

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

  public static async getDeviceList(ctx:Context, next:Next) {
    const value = await client.hGetAll("device");
    if (value) {
      ctx.body = resolve.json(value);
    } else {
      ctx.body = resolve.json({}, '设备列表为空')
    }
  }

}