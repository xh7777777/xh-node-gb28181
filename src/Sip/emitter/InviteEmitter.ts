import sip from "sip";
import { IRedisDevice, IDeviceSessionCache } from "../../models/redis/device";
import InviteGenerator from "../generator/InviteGenerator";
import logUtil from "../../utils/logUtil";
const logger = logUtil("InviteEmitter");
import AckGenerator from "../generator/AckGenerator";
import { SipMessageHelper, SdpHelper } from "../../utils/SipUtil";
import { SIP_CONFIG } from "../../config";
import { SipRequest } from "../../types/sip.type";
import { DeviceController } from "../../controller/DeviceController";
import ZLMediaKit from "../../Media/ZLMediaKit";
import { ZLMediaKitConfig } from "../../config";
import { HttpException } from "../../utils/httpUtil";
import cacheUtil from "../../utils/cacheUtil";

export default class InviteEmitter {
  /*
   * @description: 发送邀请推流
   * @param {IRedisDevice} device
   * @return boolean 是否成功
   */
  public static async sendInviteStream(device: IRedisDevice, channelId: string) {

    // 创建rtp端口
    try {
      const time = cacheUtil.get(`${device.deviceId}@${channelId}`) as any;
      if (time) {
        clearTimeout(time as NodeJS.Timeout);
      }
      const channel = await DeviceController.getChannelFromRedis(device.deviceId, channelId);
      const openRtp = await ZLMediaKit.openRtpServer({
        port: 0,
        stream_id: `${device.deviceId}_${channelId}`,
        tcp_mode: channel.streamMode || 1,
      });
      if (!openRtp?.port) return {
        code: 500,
        message: "创建rtp端口失败",
      };
      else {
        const rtspUrl = `://${ZLMediaKitConfig.host}:${ZLMediaKitConfig.rtmp_port}/rtp/${device.deviceId}_${channelId}`;
        cacheUtil.set(`${device.deviceId}@${channelId}`, {
          rtpPort: openRtp.port,
          rtspUrl,
        }, 60)
        const sdpContent = SipMessageHelper.generateSdpContent({
          udpPort: openRtp.port,
          channel: channelId,
          clientIp: SIP_CONFIG.host || "",
          ssrc: SdpHelper.generateSsrc({
            history: false,
            realm: device.deviceRealm || "",
          }),
        });
        const message = InviteGenerator.invitePushStream(device, sdpContent);

        cacheUtil.set(`${device.deviceId}@${channelId}`, {
          rtpPort: openRtp.port,
          rtspUrl,
        });
  
        sip.send(message, function (res: SipRequest) {
          // const ackMessage = AckGenerator.ackInviteSdp(res, sdpContent, device);
          const ackMessage = AckGenerator.generateCommonAck(res, device);
          ackMessage.headers["call-id"] = res.headers["call-id"];
          ackMessage.headers.to = res.headers.to;
          ackMessage.headers.from = res.headers.from;
  
          const session: IDeviceSessionCache = {
            deviceId: device.deviceId,
            channelId,
            callId: res.headers["call-id"],
            cseqNum: res.headers.cseq.seq + 1 || 20,
            toTag: res.headers.to.params?.tag || "",
            fromTag: res.headers.from.params?.tag || "",
            rtpPort: openRtp.port,
            rtspUrl,
          };
         DeviceController.setSessionToRedis(session);
  
          sip.send(ackMessage);
        });
        return {
          code: 0,
          message: "success",
          port: openRtp.port,
          url: rtspUrl,
        };
      }
    } catch (error) {
      logger.error("创建rtp端口失败", error);
      return {
        code: 500,
        message: "创建rtp端口失败",
      };
    }
  }
}
