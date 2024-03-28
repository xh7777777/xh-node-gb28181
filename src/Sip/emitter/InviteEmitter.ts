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

export default class InviteEmitter {
  /*
   * @description: 发送邀请推流
   * @param {IRedisDevice} device
   * @return boolean 是否成功
   */
  public static async sendInviteStream(device: IRedisDevice) {

    // 创建rtp端口
    const openRtp = await ZLMediaKit.openRtpServer({
      port: 0,
      stream_id: device.deviceId,
      tcp_mode: 1,
    });
    if (openRtp.code !== 0) throw new HttpException("创建RTP端口失败", 500);
    else {

      const sdpContent = SipMessageHelper.generateSdpContent({
        udpPort: openRtp.port,
        channel: device.deviceId,
        clientIp: SIP_CONFIG.host || "",
        ssrc: SdpHelper.generateSsrc({
          history: false,
          realm: device.deviceRealm || "",
        }),
      });
      const message = InviteGenerator.invitePushStream(device, sdpContent);

      sip.send(message, function (res: SipRequest) {
        // const ackMessage = AckGenerator.ackInviteSdp(res, sdpContent, device);
        logger.info("invite response: ", res);
        const ackMessage = AckGenerator.generateCommonAck(res, device);
        ackMessage.headers["call-id"] = res.headers["call-id"];
        ackMessage.headers.to = res.headers.to;
        ackMessage.headers.from = res.headers.from;

        // 缓存会话记录
        const session: IDeviceSessionCache = {
          deviceId: device.deviceId,
          channelId: +(device.channelCount || 1),
          callId: res.headers["call-id"],
          cseqNum: res.headers.cseq.seq + 1 || 20,
          toTag: res.headers.to.params?.tag || "",
          fromTag: res.headers.from.params?.tag || "",
          rtpPort: openRtp.port,
          rtspUrl: `rtsp://${ZLMediaKitConfig.host}:${openRtp.udpPort}/rtp/${device.deviceId}`,
        };
        DeviceController.setSessionToRedis(session);

        sip.send(ackMessage);
      });
    }
  }
}
