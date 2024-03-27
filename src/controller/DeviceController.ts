import { SipRequest } from "../types/sip.type";
import { getDeviceInfoFromSip } from '../utils/SipUtil';
import { IRedisDevice, IDeviceSessionCache, IDeviceChannel } from "../models/redis/device";
import client from "../middleware/redis";
import logUtil from "../utils/logUtil";
const logger = logUtil("DeviceController");
import { Context, Next } from "koa";
import { resolve } from "../utils/httpUtil";
import InviteEmitter from "../Sip/emitter/InviteEmitter";
export class DeviceController {
  public static async getDeviceInfoFromSip(req: SipRequest) {
    return getDeviceInfoFromSip(req);
  }

  public static async getDeviceById(device: IRedisDevice) {
    const key = device.deviceId;
    const value = await client.hGet("device", key);
    return value === undefined ? null : JSON.parse(value);
  }

  public static async setDeviceToRedis(device: IRedisDevice) {
    const key = device.deviceId;
    const value = JSON.stringify(device);
    await client.hSet("device", key, value);
  }

  public static async deleteDevice(deviceId: string) {
    await client.hDel("device", deviceId);
    const channels = await DeviceController.getChannelListFromRedis(deviceId);
    for (const channel of channels) {
      await DeviceController.deleteChannelFromRedis(deviceId, channel.channelId);
    }
  }

  public static async setSessionToRedis(session: IDeviceSessionCache) {
    const key = `${session.deviceId}@${session.channelId}`
    const value = JSON.stringify(session);
    // 设置过期时间 10分钟
    await client.hSet("session", key, value);
  }

  public static async setChannelToRedis(channel: IDeviceChannel) {
    const key = `${channel.deviceId}@${channel.channelId}`;
    const value = JSON.stringify(channel);
    await client.hSet("channel", key, value);
  }

  public static async getChannelFromRedis(deviceId: string, channelId: number) {
    const key = `${deviceId}@${channelId}`;
    const value = await client.hGet("channel", key);
    return value === undefined ? null : JSON.parse(value);
  }

  public static async getChannelListFromRedis(deviceId: string) {
    const value = await client.hGetAll("channel");
    const result = [];
    for (const key in value) {
      if (key.includes(deviceId)) {
        result.push(JSON.parse(value[key]));
      }
    }
    return result;
  }

  public static async deleteChannelFromRedis(deviceId: string, channelId: number) {
    const key = `${deviceId}@${channelId}`;
    await client.hDel("channel", key);
  }

  public static async getChannelList(ctx: Context, next: Next) {
    const { deviceId } = ctx.request.body;
    const value = await DeviceController.getChannelListFromRedis(deviceId);
    if (value) {
      ctx.body = resolve.json(value);
    } else {
      ctx.body = resolve.json({}, '通道列表为空');
    }
  }

  public static async getDeviceList(ctx:Context, next:Next) {
    const value = await client.hGetAll("device");
    if (value) {
      ctx.body = resolve.json(value);
    } else {
      ctx.body = resolve.json({}, '设备列表为空')
    }
  }

  public static async userDeleteDevice(ctx: Context, next: Next) {
    const { deviceId } = ctx.request.body;
    await DeviceController.deleteDevice(deviceId);
    ctx.body = resolve.success('删除成功');
  }

  public static async deleteSession(deviceId: string, channelId: number) {
    await client.hDel("session", `${deviceId}@${channelId}`);
  }

  public static async getSession(deviceId: string) {
    const value = await client.hGet("session", deviceId);
    return value === undefined ? null : JSON.parse(value);
  }

  public static async inviteStream(ctx:Context, next:Next) {
    const { deviceId} = ctx.request.body;
    const device = await DeviceController.getDeviceById({deviceId});
    if (device) {
      logger.info("发送invite push stream报文设备信息：", device);
      InviteEmitter.sendInviteStream(device);
      ctx.body = resolve.success('成功');
    } else {
      ctx.body = resolve.json({}, '设备不存在');
    }
  }

}