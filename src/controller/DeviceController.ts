import { SipRequest } from "../types/sip.type";
import { getDeviceInfoFromSip } from '../utils/SipUtil';
import { IRedisDevice, IDeviceSessionCache, IDeviceChannel } from "../models/redis/device";
import client from "../middleware/redis";
import logUtil from "../utils/logUtil";
const logger = logUtil("DeviceController");
import { Context, Next } from "koa";
import { resolve } from "../utils/httpUtil";
import InviteEmitter from "../Sip/emitter/InviteEmitter";
import { mediaProtocolEnum } from "../types/enum";
import { encodeUri } from "../utils/httpUtil";
import cacheUtil from "../utils/cacheUtil";
import ZLMediaKit from "../Media/ZLMediaKit";
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
    logger.info("获取通道列表", deviceId);
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
    const { deviceId, channelId } = ctx.request.body;
    // 读取缓存防止重复请求
    const deviceCacheId = `${deviceId}@${channelId}`;
    const session = await DeviceController.getSession(deviceCacheId);
    logger.info("inviteStreamSession",  session);
    if (session) {
      ctx.body = resolve.json({
        url: encodeUri(`${mediaProtocolEnum.rtmp}${session.rtspUrl}`),
        prefix: 'ws://localhost:3000/websocket/rtsp',
      }, 'success');
      return;
    }
    const device = await DeviceController.getDeviceById({deviceId});
    if (device) {
      // 发送invite推流
      const res = await InviteEmitter.sendInviteStream(device, channelId);
      if (res.code === 500) {
          ctx.body = resolve.fail(res.message);
          return;
      } else {
        const { port, url, message, code } = res;
        logger.info("inviteStream", encodeUri(`${mediaProtocolEnum.rtmp}${url}`));
        // 获取用户配置的播放协议
        ctx.body = resolve.json({
          url: encodeUri(`${mediaProtocolEnum.rtmp}${url}`),
          prefix: 'ws://localhost:3000/websocket/rtsp',
        }, message, code);
      }
    } else {
      ctx.body = resolve.fail( '设备不存在');
    }
  }

  public static async closeStream(ctx:Context, next:Next) {
    const { deviceId, channelId } = ctx.request.body;
    // 清缓存
    await DeviceController.deleteSession(deviceId, channelId);
    cacheUtil.del(`${deviceId}@${channelId}`);
    // 关闭rtp端口
    await ZLMediaKit.closeRtpServer(`${deviceId}_${channelId}`)
    ctx.body = resolve.json({
      closeStreamId: `${deviceId}_${channelId}`
    })
  }

}